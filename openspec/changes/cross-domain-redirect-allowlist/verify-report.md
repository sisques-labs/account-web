# Verification Report: cross-domain-redirect-allowlist (PR 2 of 3 - independent slice review)

**Scope**: `getSafeExternalRedirectUrl` helper only (Phase 2 / tasks 2.1-2.2). Phase 3
(env wiring + `useLogin` chain) and Phase 4 (final regression/coverage/lint/tsc
gate) are not yet implemented - expected and out of scope for this pass. This
report does NOT close the change; Phase 3/4 remain pending for a subsequent
verify pass.

## Completeness (this slice)

| Task | Status | Evidence |
|---|---|---|
| 2.1 RED spec | checked, matches code | `safe-external-redirect.spec.ts`, 15 cases, all runtime-passing |
| 2.2 GREEN impl | checked, matches code | `safe-external-redirect.ts` implements design Decision 3 step order exactly |

`tasks.md` diff is exactly the two checkbox flips for 2.1/2.2 - no other line changed.

## Command Evidence

| Command | Result |
|---|---|
| `pnpm exec vitest run safe-external-redirect` | 1 file, 15/15 tests PASS |
| `pnpm exec vitest run src/shared/lib/safe-redirect.spec.ts` (PR1 regression) | 1 file, 10/10 tests PASS, file byte-for-byte untouched |
| `pnpm exec vitest run src/shared/lib/trusted-origins.spec.ts` (PR1 regression) | 1 file, 16/16 tests PASS |
| `pnpm test:coverage` | 129 files, 630/630 tests PASS. Repo-wide: 97.65% stmts / 90.11% branch / 97.12% funcs / 98.46% lines - 80% threshold met. `safe-external-redirect.ts` isolated: 100/100/100/100 (19 stmts, 12 branches, 2 funcs, 13 lines) |
| `pnpm lint` | 0 errors, 15 warnings - all pre-existing, in unrelated `shared/presentation/components/ui/*` files, none touching this slice |
| `pnpm tsc --noEmit` | clean, no output |
| `git status --short` | `M tasks.md`, `?? safe-external-redirect.ts`, `?? safe-external-redirect.spec.ts` (+ unrelated `.atl/` tool dir). `safe-redirect.ts`/`.spec.ts`, `trusted-origins.ts`/`.spec.ts`, `env.ts`, `useLogin.hook.ts` all absent from status - confirmed untouched |
| byte scan of both new files | No stray control bytes (0x00-0x1F excl. LF), no NUL, no leftover regex hex-escape artifact. Files are byte-clean |

## Algorithm Compliance vs. design.md Decision 3

| Step | Design requirement | Implementation | Verdict |
|---|---|---|---|
| 1 | Falsy `target` -> `null` | `if (!target) return null;` | PASS |
| 2 | Reject raw C0 (U+0000-U+0020) or backslash BEFORE parsing | `hasForbiddenRawChar` loops `charCodeAt`, checks `code <= 0x20 or raw[i] === backslash`, called before `new URL` | PASS (logic correct; see WARNING on test proof below) |
| 3 | `new URL(target)` try/catch -> `null`, no base arg | Exact match, no second constructor argument, relative paths therefore throw and return `null` | PASS |
| 4 | Reject opaque origin (`url.origin === 'null'`) | Present, correct string literal `'null'` | PASS |
| 5 | Exact `allowedOrigins.has(url.origin)`, no suffix/substring matching | `Set.has` only; no `.endsWith`/`.includes`/regex anywhere in the file | PASS |
| 6 | Return `url.toString()` | Present | PASS |

Order matches the design exactly; no steps reordered, skipped, or merged.

## Behavioral Compliance Matrix (spec.md - External Redirect Helper Contract)

| Scenario | Covering test | Runtime result |
|---|---|---|
| Allowlisted external target validates | `returns the normalized URL for an allowlisted origin` | PASS |
| Non-allowlisted external target is rejected | `returns null for a non-allowlisted origin` | PASS |
| Malformed target does not throw | `returns null for a malformed URL without throwing` (asserts both `not.toThrow()` and `toBeNull()`) | PASS |
| Existing same-origin validator is unaffected | `safe-redirect.spec.ts` 10/10 unmodified + file untouched in git status | PASS |

Adversarial cases required by this review, all present and correctly asserted:

| Input | Expected | Confirmed |
|---|---|---|
| `https://evil.com/phishing` | null | yes |
| `https://evil.app.sisqueslabs.com` vs allowlisted `https://app.sisqueslabs.com` | null (subdomain) | yes |
| `https://app.sisqueslabs.com:8443` (port) | null | yes |
| `http://app.sisqueslabs.com` (scheme) | null | yes |
| `javascript:alert(1)`, `data:text/html,x` | null | yes |
| backslash-scheme trick (`https:` + backslash + `app.sisqueslabs.com`) | null | yes - confirmed via mutation test this assertion is load-bearing (see below) |
| `/en/admin/apps` (relative path) | null | yes |
| Empty allowlist vs. otherwise-valid URL | null | yes |

## Byte-level source integrity (item 2 of task)

Byte scan of both files: 2069 bytes (`safe-external-redirect.ts`) and
2850 bytes (`safe-external-redirect.spec.ts`), zero bytes in 0x00-0x1F (excluding
ordinary LF) or 0x7F. No stray NUL, no leftover regex hex-escape
artifact. The final committed-to-working-tree files are clean; the control-char
check is an explicit `charCodeAt` loop, not a regex, as the apply report
claimed.

## Issues

### WARNING - control-character pre-parse branch has no assertion proving it functions

The `code <= 0x20` half of `hasForbiddenRawChar`'s OR condition is never
exercised as `true` by any of the 15 tests. Verified two ways:

1. **Mutation test** (isolated re-implementation, not a source edit): removing
   the `code <= 0x20` clause and keeping only the backslash check, then
   replaying all 15 test inputs against both branches, produces byte-identical
   results for every case, including the one named "control character
   smuggled into an allowlisted origin" (`https://app.sisqueslabs.com%00.evil.com`).
2. **Root cause**: that test's payload is the literal ASCII text `%00`, not an
   actual control byte - `hasForbiddenRawChar` never returns `true` for it
   (none of its chars are <= 0x20 or a backslash). It is rejected downstream by
   `new URL()`'s own `try/catch` in step 3, because a percent-decoded NUL in a
   hostname is a forbidden host code point per the WHATWG URL Standard (node
   confirms: `new URL('https://x.com%00.y.com')` throws `Invalid URL` on its
   own, no pre-check needed).
3. v8 branch coverage still reports 100% (12/12) for this file - coverage
   tooling counts "both sides of the OR were reached," not "the left operand
   ever evaluated to true," so it cannot see this gap. This is exactly the
   kind of gap coverage percentage alone cannot catch.
4. **This is not a demonstrated exploit** in the current call pattern: the
   function always navigates using its own re-serialized `url.toString()`
   output rather than the raw input, and WHATWG's own host-validation (via
   `new URL()`) independently rejects the concrete `%00`-in-host and literal-
   NUL cases tested by hand (`new URL('https://x.com .y.com')` with an
   embedded space also throws directly). No input was found, by hand or via
   node's real `URL` parser, that turns the missing `code <= 0x20` branch into
   an actual origin-allowlist bypass. The gap is real but currently latent,
   not exploitable through this code path today - this could change if a
   future edit ever uses the raw `target` (instead of the parsed
   `url.toString()`) anywhere, so the check is worth keeping and worth proving
   with a real test.
5. **Recommendation** (not applied - verify does not fix): add one test with a
   genuine literal control byte (e.g. a raw tab, CR, or plain space embedded
   mid-string, not a percent-encoded sequence) that specifically depends on
   `hasForbiddenRawChar`'s `code <= 0x20` clause returning `true` before it
   ever reaches `new URL()`. WHATWG explicitly strips ASCII tab/CR/LF from
   input silently (confirmed: `new URL('https://x.com<TAB>.y.com')` does not
   throw, it silently drops the tab and fuses the hostname segments) rather
   than rejecting it, which is the actual scenario this line exists to guard
   against, and it is currently unproven.

### WARNING - design.md Threat Matrix row is mislabeled

The row `https://app.sisqueslabs.com%00.evil.com` -> "Control char rejected
pre-parse" in design.md's Threat Matrix is factually inaccurate: that string
contains no raw control character (it is literal `%`, `0`, `0`), and it is not
rejected by the pre-parse step. It is rejected by the `try/catch` around `new
URL()` in step 3, for an unrelated reason (WHATWG's forbidden-host-code-point
rule on percent-decoded hostnames). The test's own description inherits the
same mislabeling. Recommend correcting the design doc row and/or adding a
genuinely-raw-control-char test case, and relabeling the existing `%00` test to
describe what it actually proves (URL-constructor rejection of a malformed
host), not the pre-parse defense.

No CRITICAL findings. No findings block committing this slice as-is; the two
WARNINGs are test-coverage/documentation-accuracy gaps on a still-correct,
still-safe implementation, not functional or security defects in the shipped
code.

## Verdict

**PASS WITH WARNINGS** for the PR2 slice (`getSafeExternalRedirectUrl` +
its spec). Safe to commit/merge as-is. Overall change verification remains
blocked pending Phase 3 (env wiring + `useLogin` chain) and Phase 4 (final
regression gate), per tasks.md - that is expected at this point in the stack,
not a defect of this slice.
