## Context

`getSafeRedirectPath` (`src/shared/lib/safe-redirect.ts`) accepts only same-origin
relative paths. The platform's SSO model sets a shared `Domain=.sisqueslabs.com`
cookie *before* the redirect fires, so a post-login `?redirectTo=` to another
platform origin is pure navigation, not credential transport — but unguarded it
is an open redirect. See proposal.md for the three settled decisions
(exact-origin allowlist, no OAuth `state`, parallel helper); this document fixes
the parsing, matching, and call-site semantics the proposal explicitly deferred.

Two constraints found while reading the repo shape the design:

- `src/shared/config/env.ts` is a flat list of `export const X = process.env.NEXT_PUBLIC_X ?? default`.
  It has **no list-parsing precedent**, and it is **included** in coverage
  (`vitest.config.ts` → `coverage.exclude` does not list it). Module-level env
  reads are frozen at import, so logic placed there is awkward to unit-test.
- `src/shared/lib/` is one pure function per file (`format-date.ts`,
  `get-axios-error-message.ts`, `safe-redirect.ts`), each with a co-located spec.

## Goals / Non-Goals

**Goals:** a pure, unit-tested allowlist parser and a pure external-redirect
validator; a three-way selection chain in `useLogin`; a documented `.env.example`
format; zero behavioral change when the env var is unset.

**Non-Goals:** touching `safe-redirect.ts` (byte-for-byte unchanged),
`useAdminGuard.hook.ts` (its producer contract stays same-origin-only), OAuth
`state`, `account-api`, or `COOKIE_DOMAIN` wiring.

## Decisions

### 1. Env var `NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS` → `TRUSTED_REDIRECT_ORIGINS`

`env.ts` maps `NEXT_PUBLIC_{NAME}` to `export const {NAME}` with no renaming, so
the constant name is fixed by the existing convention once the var name is
chosen. `TRUSTED_REDIRECT_ORIGINS` (over `ALLOWED_*` or `*_HOSTS`) says both
*what* is trusted and *at what granularity* — origins, not hosts, which is the
actual comparison unit. The full literal
`process.env.NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS` must be written inline for
Next's build-time inlining to fire.

```ts
// src/shared/config/env.ts
export const TRUSTED_REDIRECT_ORIGINS = parseTrustedOrigins(
  process.env.NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS,
);
```

### 2. Parsing lives in `src/shared/lib/trusted-origins.ts`, not in `env.ts`

Rejected: inlining the parser in `env.ts`. That module's constants are evaluated
once at import, so testing branch behavior needs `vi.stubEnv` + `vi.resetModules`
+ dynamic re-import for every case — and `env.ts` is coverage-included, so
untested branches drag the 80% threshold. A pure `parseTrustedOrigins(raw)` in
`src/shared/lib/` matches the one-pure-function-per-file convention and is
testable with plain string inputs.

**Parsing semantics** — `parseTrustedOrigins(raw: string | undefined): ReadonlySet<string>`:

| Rule | Behavior |
|---|---|
| Unset / empty | `undefined` or `''` → empty `Set` (cross-origin branch disabled; today's behavior) |
| Split | `raw.split(',')` |
| Whitespace | each entry `.trim()`ed |
| Empty entries | dropped — covers trailing comma, `a,,b`, whitespace-only |
| Malformed URL | `new URL(entry)` in `try/catch`; on throw the entry is **dropped**, never rethrown |
| Scheme | `https:` only, **plus** `http:` when hostname is `localhost`, `127.0.0.1`, or `[::1]`; anything else dropped |
| Shape | dropped if `pathname !== '/'`, or `search` / `hash` / `username` / `password` is non-empty |
| Stored value | `url.origin` — WHATWG-normalized: scheme and host lowercased, default port elided |
| Dedupe | free via `Set` over normalized origins |
| Visibility | each dropped entry emits one `console.warn` naming it (the function's only side effect) |

**Malformed → drop, not throw.** Rejected: failing loudly at module load.
`env.ts` is imported by `axios.client.ts` in the client bundle, so a throw would
white-screen the whole app over one typo — converting a *degraded but safe* state
(that consumer's redirect falls back to locale home) into a total outage.
Dropping is fail-closed; the `console.warn` keeps the misconfiguration visible.

**https-only with a loopback exception.** A `Secure` cookie plus a plaintext
redirect target is a downgrade a security boundary should refuse. The loopback
carve-out is standard (RFC 8252 §7.3; W3C Secure Contexts treats `localhost` as a
secure context) and does not widen trust: the operator must still list the exact
origin for it to be honored.

**Case sensitivity.** Comparison is exact string equality on `url.origin` on
*both* sides. WHATWG normalization already lowercases scheme and host; no manual
`toLowerCase()` is applied, since that would mask a non-normalized value.

**Entries carrying a path are dropped, not truncated.** `.origin` would silently
discard the path, leaving an operator who wrote
`https://app.sisqueslabs.com/dashboard` believing they had scoped the redirect to
one path. Rejecting the entry makes that misunderstanding visible.

### 3. `getSafeExternalRedirectUrl` in `src/shared/lib/safe-external-redirect.ts`

```ts
export function getSafeExternalRedirectUrl(
  target: string | null | undefined,
  allowedOrigins: ReadonlySet<string>,
): string | null
```

JSDoc mirrors `safe-redirect.ts`: states the guarantee, why exact-origin and not
suffix matching, and that it never throws. Algorithm, in order:

1. Falsy `target` → `null`.
2. Reject if the raw string contains any character in the C0 range U+0000 to
   U+0020 (controls and space) or a backslash. Those are silently stripped or
   re-normalized by the URL parser (`https:\evil.com` parses as
   `https://evil.com`), which is exactly the parse-differential
   `safe-redirect.ts` already defends against.
3. `new URL(target)` in `try/catch`; on throw → `null`. **Invalid input returns
   `null`, it never throws.** No base URL is passed, so relative paths are
   rejected here by construction — they belong to `getSafeRedirectPath`.
4. Reject `url.origin === 'null'` — the opaque origin WHATWG assigns to
   `javascript:`, `data:`, and `blob:`.
5. `allowedOrigins.has(url.origin)` → else `null`. **Exact match only.** A
   subdomain of an allowlisted origin does *not* match
   (`https://evil.app.sisqueslabs.com` against an allowlisted
   `https://app.sisqueslabs.com`), per proposal decision #1 and OWASP's Subdomain
   Takeover Prevention guidance against suffix trust. Port and scheme are part of
   `origin`, so they must match too.
6. Return `url.toString()` — the parser's normalized form, so the string that was
   validated is byte-identical to the one handed to the browser.

Scheme is not re-checked here: the Set can only contain origins that already
passed the rule table in Decision 2, so membership subsumes it.

### 4. `useLogin` selection chain — internal → external → home

```ts
const redirectTo = searchParams.get('redirectTo');
const internalPath = getSafeRedirectPath(redirectTo);
if (internalPath) {
  router.push(internalPath);
  return;
}
const externalUrl = getSafeExternalRedirectUrl(redirectTo, TRUSTED_REDIRECT_ORIGINS);
if (externalUrl) {
  window.location.assign(externalUrl);
  return;
}
router.push(`/${lang}`);
```

`getSafeRedirectPath` is tried **first**, so every existing internal-path and
`evil.com`-fallback assertion keeps its exact current code path.

**`window.location.assign` for the external branch, not `router.push`.** Next 16's
App Router documents `router.push(href)` as "a client-side navigation to the
provided route"; cross-origin targets are undocumented behavior, and this is a
security boundary. A cross-origin SSO handoff is inherently a full document load:
the destination origin must boot and validate the shared cookie against JWKS
itself, so a soft navigation would be meaningless. `router.push` remains the
internal and fallback path, preserving the spec's existing `push` assertions.

### 5. First `.env.example` — documented format, empty default

Created at the repo root, listing all four vars so the new list format has
neighbours to be read against:

```dotenv
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_GRAPHQL_URL=/graphql
NEXT_PUBLIC_HTTP_TIMEOUT_MS=10000

# Comma-separated exact origins allowed as a post-login ?redirectTo= target.
# Scheme + host + port only — no path, no wildcards, no subdomain matching.
# https only, except http on localhost / 127.0.0.1 / [::1]. Invalid entries are
# dropped with a console warning. Empty or unset disables cross-origin redirects.
# Example: https://gardenia.sisqueslabs.com,https://app.sisqueslabs.com
NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS=
```

Shipped **empty**, so a fresh clone reproduces today's same-origin-only behavior.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/shared/lib/trusted-origins.ts` | Create | `parseTrustedOrigins` |
| `src/shared/lib/trusted-origins.spec.ts` | Create | Parser unit tests |
| `src/shared/lib/safe-external-redirect.ts` | Create | `getSafeExternalRedirectUrl` |
| `src/shared/lib/safe-external-redirect.spec.ts` | Create | Validator unit tests |
| `src/shared/config/env.ts` | Modify | Add `TRUSTED_REDIRECT_ORIGINS` |
| `src/core/auth/presentation/hooks/use-login/useLogin.hook.ts` | Modify | Three-way chain + updated JSDoc |
| `src/core/auth/presentation/hooks/use-login/useLogin.hook.spec.tsx` | Modify | Add external-branch cases; existing 7 untouched |
| `.env.example` | Create | First documented env reference |
| `src/shared/lib/safe-redirect.ts` / `.spec.ts` | **Unchanged** | Regression gate |

All new code is `src/shared/` cross-cutting utility plus one `presentation/` call
site — no DDD layer boundary is crossed.

## Testing Strategy — Strict TDD, RED first

| Layer | Target | Cases |
|---|---|---|
| Unit | `parseTrustedOrigins` | unset/empty → empty Set; single origin; multiple with surrounding whitespace; trailing comma and `a,,b`; malformed entry dropped + warned while valid siblings survive; `http://` on a non-loopback host dropped; `http://localhost:3001` kept; entry carrying a path dropped; case and default-port dedupe (`https://App.X.com:443/` + `https://app.x.com` → one entry) |
| Unit | `getSafeExternalRedirectUrl` | null/undefined/empty → null; allowlisted origin → normalized URL; non-allowlisted (`https://evil.com/phishing`) → null; subdomain of an allowlisted origin → null; different port → null; different scheme → null; malformed URL → null without throwing; relative path → null; `javascript:` / `data:` → null; backslash or control char → null; **empty allowlist → null for every input** |
| Unit (hook) | `useLogin.hook.spec.tsx` | New: an allowlisted absolute URL calls `window.location.assign` with it and does **not** call `router.push`. New: a relative `redirectTo` still uses `router.push` and never `assign` (proves chain ordering). Existing internal-path and `evil.com` → `/en` assertions kept verbatim |
| Integration / E2E | — | Not implemented in this repo (Playwright pending); no new surface added |

Hook-spec gotchas to carry into tasks: stub the env module with
`vi.mock('@/shared/config/env', async (importOriginal) => ({ ...(await importOriginal()), TRUSTED_REDIRECT_ORIGINS: new Set([...]) }))`
so the rest of the module graph keeps working; stub navigation with
`vi.stubGlobal('location', { ...window.location, assign: vi.fn() })` plus
`vi.unstubAllGlobals()` in `afterEach`, because jsdom's real `location.assign`
throws "Not implemented".

`pnpm test`, `pnpm test:coverage` (80% threshold), `pnpm lint`, and
`pnpm tsc --noEmit` must all pass, with `safe-redirect.spec.ts` green unmodified.

## Threat Matrix

This change touches **routing** (navigation-target selection). The reference
matrix's rows cover shell and VCS boundaries this change does not have:

| Boundary | Applicability |
|---|---|
| Documentation-like paths | N/A — no file classification or execution |
| Git repository selection | N/A — no VCS invocation |
| Commit state | N/A — no VCS invocation |
| Push state | N/A — no VCS invocation |
| PR commands | N/A — no PR automation |

Applicable routing boundary — untrusted `?redirectTo=` input. Each row is a
planned RED test:

| Adversarial input | Expected safe behavior |
|---|---|
| `https://evil.com/phishing` | Not allowlisted → `/${lang}` |
| `https://evil.app.sisqueslabs.com` | Exact-match miss → `/${lang}` |
| `https://app.sisqueslabs.com:8443` | Port differs → `/${lang}` |
| `http://app.sisqueslabs.com` | Scheme differs → `/${lang}` |
| `javascript:alert(1)`, `data:text/html,x` | Opaque origin → `/${lang}` |
| `https:\app.sisqueslabs.com` | Backslash rejected pre-parse → `/${lang}` |
| `https://app.sisqueslabs.com%00.evil.com` | Percent-encoded null rejected by `new URL()`'s own parse failure → `/${lang}` |
| `https://app.sisques<TAB>labs.com` (literal control char, unencoded) | Rejected pre-parse by the raw C0-range guard — `new URL()` would otherwise silently strip it and fuse the hostname into an allowlisted origin → `/${lang}` |
| `//evil.com`, `/\evil.com` | Rejected by unchanged `getSafeRedirectPath`, then by step 3 → `/${lang}` |

Failure behavior is uniform: **return `null`, never throw**, and the call site
falls back to the locale home.

## Known Limitations

Named so nobody reads this change as closing the redirect-abuse surface. Both are
pre-existing gaps outside the threat model of *both* an allowlist and OAuth
`state` — not new exposure introduced here.

- **Login CSRF.** An attacker tricks a victim into authenticating as the
  attacker. It occurs before any session exists, so neither `state` nor an origin
  allowlist addresses it. A mitigation would be a pre-session token on the login
  form itself — separate work.
- **Trusted-destination phishing.** A legitimate-looking
  `login.sisqueslabs.com/?redirectTo=<allowlisted-app>` link lends the platform's
  credibility to a phishing flow. The allowlist guarantees the *destination* is
  ours; it cannot vouch for who sent the link. OWASP's interstitial
  confirmation-page pattern is a low-cost future mitigation, not a gate here.

Also out of scope: `useAdminGuard.hook.ts`, whose `redirectTo` producer contract
stays same-origin-only and must remain documented as distinct, so future internal
call sites do not accidentally widen their own trust boundary.

## Migration Plan

Purely additive. An unset `NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS` yields an empty
`Set`, so the external branch never matches and behavior is identical to today —
the code can ship before any consumer origin is added. Enabling a consumer is a
config change plus a rebuild (`NEXT_PUBLIC_*` is baked at build time, already
true of every var in `env.ts`). Rollback: revert the commit(s), or simply unset
the env var to disable the external branch. No data migration.

## Open Questions

- None blocking. The first real value for `NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS`
  is set by the Gardenia migration, which proposal.md places out of scope.
