# Tasks: Cross-Domain Redirect Allowlist

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~500-540 (PR1 ~195, PR2 ~215, PR3 ~88) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (parser) → PR 2 (external helper) → PR 3 (wiring + hook + env-example) |
| Delivery strategy | auto-chain |
| Chain strategy | pending — orchestrator to select (stacked-to-main or feature-branch-chain) |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | `parseTrustedOrigins` parser, fully unit-tested | PR 1 | `pnpm test src/shared/lib/trusted-origins.spec.ts` | N/A — pure function, no browser/network dependency | Delete `trusted-origins.ts`/`.spec.ts`; no other file references them yet |
| 2 | `getSafeExternalRedirectUrl` helper, fully unit-tested | PR 2 | `pnpm test src/shared/lib/safe-external-redirect.spec.ts` | N/A — pure function, no browser/network dependency | Delete `safe-external-redirect.ts`/`.spec.ts`; no other file references them yet |
| 3 | Wire parser+helper into `env.ts`/`useLogin` chain, add `.env.example` | PR 3 | `pnpm test src/core/auth/presentation/hooks/use-login/useLogin.hook.spec.tsx` | Manual: unset env var → confirm same-origin/`evil.com` behavior unchanged; set var → confirm `window.location.assign` fires for allowlisted origin | Revert `env.ts`, `useLogin.hook.ts`/`.spec.tsx`, `.env.example`; PR 1/2 files stay valid standalone |

## Phase 1: Trusted Origins Parser (PR 1)

- [x] 1.1 RED: Write `src/shared/lib/trusted-origins.spec.ts` — cases: unset/empty → empty Set; single origin; multiple with surrounding whitespace; trailing comma and `a,,b`; malformed entry dropped + `console.warn`, valid siblings survive; `http://` on non-loopback host dropped; `http://localhost:3001` kept; entry with a path dropped; case/default-port dedupe (`https://App.X.com:443/` + `https://app.x.com` → one entry). Run `pnpm test src/shared/lib/trusted-origins.spec.ts`, confirm it fails (module missing).
- [x] 1.2 GREEN: Create `src/shared/lib/trusted-origins.ts` — `parseTrustedOrigins(raw: string | undefined): ReadonlySet<string>` per design's parsing-semantics table (split/trim/drop-empty, try/catch malformed drop, https-only + loopback http exception, reject non-root path/search/hash/credentials, dedupe via `Set` over `url.origin`, `console.warn` per drop). Confirm 1.1 passes.

## Phase 2: External Redirect Helper (PR 2)

- [x] 2.1 RED: Write `src/shared/lib/safe-external-redirect.spec.ts` — cases: null/undefined/empty → null; allowlisted origin → normalized URL string; non-allowlisted `https://evil.com/phishing` → null; subdomain of allowlisted origin → null; different port → null; different scheme → null; malformed URL → null without throwing; relative path → null; `javascript:`/`data:` → null; backslash or control char pre-parse → null; empty allowlist → null for every input. Run `pnpm test src/shared/lib/safe-external-redirect.spec.ts`, confirm it fails.
- [x] 2.2 GREEN: Create `src/shared/lib/safe-external-redirect.ts` — `getSafeExternalRedirectUrl(target, allowedOrigins)` per design step order (falsy → null; reject C0/backslash; `new URL` try/catch → null; reject opaque `url.origin === 'null'`; exact `Set` membership check; return `url.toString()`). Confirm 2.1 passes.

## Phase 3: Wiring & Login Chain (PR 3)

- [x] 3.1 Modify `src/shared/config/env.ts` — add `export const TRUSTED_REDIRECT_ORIGINS = parseTrustedOrigins(process.env.NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS)`, literal inline for Next build-time inlining.
- [x] 3.2 RED: Add to `src/core/auth/presentation/hooks/use-login/useLogin.hook.spec.tsx` — new case: allowlisted absolute `redirectTo` calls `window.location.assign` and never `router.push`; new case: relative `redirectTo` still uses `router.push` and never `assign`. Use `vi.mock('@/shared/config/env', async (importOriginal) => ({ ...(await importOriginal()), TRUSTED_REDIRECT_ORIGINS: new Set([...]) }))` and `vi.stubGlobal('location', { ...window.location, assign: vi.fn() })` with `vi.unstubAllGlobals()` in `afterEach`. Keep the existing 7 cases unmodified. Run the spec, confirm the 2 new cases fail.
- [x] 3.3 GREEN: Modify `src/core/auth/presentation/hooks/use-login/useLogin.hook.ts` — three-way chain: `getSafeRedirectPath(redirectTo)` first, else `getSafeExternalRedirectUrl(redirectTo, TRUSTED_REDIRECT_ORIGINS)` via `window.location.assign`, else `router.push(`/${lang}`)`; update JSDoc. Confirm 3.2's 2 new cases pass and all 7 existing cases still pass unmodified.
- [x] 3.4 Added `NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS` to `.env.example` at repo root, comment block per design's format. The sandbox's permission settings hard-deny both Read and Edit on any `.env*` path, so the user appended the block themselves via their own terminal (not a from-scratch create as design's Decision 5 assumed — the file already existed with 4 unrelated vars).

## Phase 4: Regression & Final Verification

- [x] 4.1 Regression check: run `pnpm test src/shared/lib/safe-redirect.spec.ts` (read-only) — confirm all 10 existing cases pass, file byte-for-byte untouched.
- [x] 4.2 Run `pnpm test:coverage` — confirm 80% threshold (lines/functions/branches/statements) green.
- [x] 4.3 Run `pnpm lint` — confirm no errors.
- [x] 4.4 Run `pnpm tsc --noEmit` — confirm no type errors.
