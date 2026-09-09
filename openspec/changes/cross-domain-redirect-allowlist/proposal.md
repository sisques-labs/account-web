## Why

Closes account-web#11. `getSafeRedirectPath` (`src/shared/lib/safe-redirect.ts`)
accepts only same-origin relative paths, so a consumer app on another
`sisqueslabs.com` origin cannot be a post-login destination today. The platform's
SSO model sets a shared parent-domain cookie *before* the redirect fires, so the
redirect is pure navigation — but an unguarded absolute `redirectTo` would be an
open redirect. This change adds the redirect-safety mechanism ahead of the first
consumer migration, while there is no traffic to regress.

Scope is **account-web only**. `account-api` changes, `COOKIE_DOMAIN` wiring, and
the Gardenia migration are separate work.

## What Changes

Three decisions are **settled**, not open:

1. **Exact-origin allowlist** from a comma-separated `NEXT_PUBLIC_*` env var,
   matched against `new URL(target).origin`. Not a `*.sisqueslabs.com` suffix
   check — OWASP's Subdomain Takeover Prevention guidance warns that suffix trust
   auto-trusts any subdomain later abandoned or repointed.
2. **Allowlist-only; OAuth-style `state`/nonce deferred.** Per RFC 6749 §10.12,
   `state` defends the code/token exchange; no code or token ever rides this
   redirect, so that threat model does not map.
3. **Parallel helper** (e.g. `getSafeExternalRedirectUrl`). `getSafeRedirectPath`
   stays byte-for-byte unchanged — zero regression risk to its 10 tests.

Deliverables:

- New helper + spec in `src/shared/lib/`, returning a validated absolute URL or `null`.
- New trusted-origins constant in `src/shared/config/env.ts`, with parsing
  semantics (trim, empty entries, malformed URLs, dedupe) fixed in design.
- `useLogin.hook.ts` selection chain: internal path → external allowlist → `/${lang}` home.
- **New `.env.example`** — recommended yes: first list-style env var in the repo,
  and the format needs a documented reference.

## Out of Scope / Known Limitations

Named explicitly so nobody assumes this closes the redirect-abuse surface:

- **Login CSRF** — victim tricked into authenticating as the attacker; precedes any
  session, so neither `state` nor an allowlist addresses it.
- **Trusted-destination phishing** — an allowlisted `redirectTo` lending credibility
  to a phishing link.

Both are pre-existing gaps outside both mechanisms' threat models, not new exposure.
Also out of scope: `useAdminGuard.hook.ts`, whose producer contract stays
same-origin-only and must remain documented as distinct.

## Capabilities

### New Capabilities
- `cross-domain-redirect`: validation contract for post-login redirect targets —
  same-origin paths, allowlisted external origins, and the login-hook fallback chain.

### Modified Capabilities
(none — `openspec/specs/` is empty; the `auth` change is not archived yet)

## Impact

- **Affected code**: `src/shared/lib/safe-redirect.ts` (untouched) plus a new sibling
  helper and spec; `src/shared/config/env.ts`; `src/core/auth/presentation/hooks/use-login/useLogin.hook.ts`
  and its spec; new root `.env.example`.
- **Affected contexts**: `auth` (call site), `shared` (helper + config). `tenancy`
  unchanged.
- **Regression gate**: `safe-redirect.spec.ts` and `useLogin.hook.spec.tsx` — including
  its existing `https://evil.com/phishing` → locale-home assertion — MUST pass unchanged.
- **No breaking changes**: additive. An unset/empty env var yields an empty allowlist,
  so behavior is identical to today.
- **Rollback**: revert the commit(s); no data migration, no destructive step. Removing
  the env var alone already disables the external branch.
