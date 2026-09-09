# Verification Report: cross-domain-redirect-allowlist (FINAL — whole-change gate, PR 3 of 3)

**Scope**: This report supersedes the prior PR2-only report for the final
verdict but does not erase its findings — see "Carried-forward findings"
below. This pass covers Phase 3 (env wiring + `useLogin` selection chain +
`.env.example`) and Phase 4 (full regression, coverage, lint, tsc, build),
and independently re-verifies PR1 (`trusted-origins.ts`) and PR2
(`safe-external-redirect.ts`) are present, untouched, and still green.

## Task Completeness

All tasks in `tasks.md` are checked `[x]` across all 4 phases (1.1–1.2,
2.1–2.2, 3.1–3.4, 4.1–4.4). Verified against actual code state, not just the
checkbox:

| Task | Status | Evidence |
|---|---|---|
| 1.1/1.2 (parser) | done, matches code | `trusted-origins.ts`/`.spec.ts` present, byte-identical to PR1 commit `ef46df2` |
| 2.1/2.2 (external helper) | done, matches code | `safe-external-redirect.ts`/`.spec.ts` present, byte-identical to PR2 commit `e000f97` (including the load-bearing control-char regression test added to close the PR2 WARNING) |
| 3.1 (env.ts wiring) | done, matches code | see "env.ts wiring" below |
| 3.2/3.3 (hook RED/GREEN) | done, matches code | see "useLogin selection chain" below |
| 3.4 (.env.example) | done, unverifiable content | `.env.example` shows `M`, 7 lines changed (`git diff e000f97 --stat`); direct content read is denied by this session's `.env*` permission rule — see "Acknowledged gap" |
| 4.1–4.4 | done | full regression/coverage/lint/tsc run below, plus `pnpm build` (config.yaml `rules.verify.build_command`) |

## 1. `env.ts` wiring vs design Decision 1

```ts
export const TRUSTED_REDIRECT_ORIGINS = parseTrustedOrigins(process.env.NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS);
```

The literal string `process.env.NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS` appears
inline as a direct member-expression argument — not built via template
string, concatenation, bracket-access, or a variable. This is statically
analyzable by Next's build-time env inliner. Confirmed functionally: `pnpm
build` output includes `Environments: .env`, i.e. the build successfully
resolved and inlined the `.env` file's vars, consistent with this being a
literal, not a dynamic, reference. Matches design Decision 1 exactly — no
deviation.

## 2. `useLogin.hook.ts` selection chain vs design Decision 4

```ts
const internalPath = getSafeRedirectPath(redirectTo);
if (internalPath) { router.push(internalPath); return; }

const externalUrl = getSafeExternalRedirectUrl(redirectTo, TRUSTED_REDIRECT_ORIGINS);
if (externalUrl) { window.location.assign(externalUrl); return; }

router.push(`/${lang}`);
```

- Order is exactly internal → external → fallback, matching design verbatim.
- Each of the first two branches has an unconditional `return` immediately
  after its navigation call, inside the same `if` block — there is no path
  from "matched internal" to "also evaluates external," and no path from
  "matched external" to "also falls through to home." The fallback `router
  .push(`/${lang}`)` is reached only when both `if`s are skipped.
- External branch calls `window.location.assign` (full document load, per
  design's SSO-handoff rationale); internal and fallback branches both use
  `router.push`. No branch mixes the two navigation primitives.
- No deviation from design found.

## 3. Existing 7 `useLogin.hook.spec.tsx` cases — genuinely unmodified

Diffed the working tree against the PR2 commit (`git diff e000f97 -- .../useLogin.hook.spec.tsx`); the 7 original cases are present with their original assertions intact:

1. `calls the repository with the submitted input and reports success` — unchanged.
2. `redirects to the locale home on success by default` — unchanged (`push` → `/en`).
3. `redirects to a valid ?redirectTo= target instead of the locale home` — unchanged (`push` → `/en/admin/apps`).
4. `falls back to the locale home when ?redirectTo= is an unsafe absolute URL` — unchanged; still asserts `push('/en')` AND `push` never called with `'https://evil.com/phishing'`. This is the proposal's named regression-gate assertion (proposal.md "Regression gate") and it is intact, not weakened.
5. `surfaces isError and error on a rejected mutation, without redirecting` — unchanged.
6. `derives the invalid-credentials message from a 401 error` — unchanged.
7. `derives a generic message from a non-401 error` — unchanged.

None of the 7 assertions were loosened, removed, or given wider tolerances to accommodate the new code. The only additions to the file are: the `vi.mock('@/shared/config/env', ...)` block, the `afterEach(() => vi.unstubAllGlobals())`, and the 2 new `it` blocks (below).

## 4. The 2 new test cases

- `redirects via window.location.assign to an allowlisted external origin, without calling router.push` — sets `redirectTo=https://app.sisqueslabs.com/dashboard`, stubs `location.assign`, asserts `assign` called with that exact URL AND `push` never called. Correct polarity and correct ordering proof (external wins when internal validation would reject an absolute URL).
- `redirects via router.push for a relative redirectTo, without calling window.location.assign` — sets `redirectTo=/en/admin/apps`, asserts `push` called with that path AND `assign` never called. Proves internal branch short-circuits before external is ever consulted.

**Mock isolation check**: `vi.mock('@/shared/config/env', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/shared/config/env')>()), TRUSTED_REDIRECT_ORIGINS: new Set(['https://app.sisqueslabs.com']) }))` — confirmed the spread of `importOriginal()` is real code, not just a comment/claim (read the actual file, line 12–15). This correctly preserves every other `env.ts` export (`GRAPHQL_URL`, `HTTP_TIMEOUT_MS`, `API_URL`) untouched while only overriding `TRUSTED_REDIRECT_ORIGINS`, so no other module-level env read in the graph breaks. `vi.stubGlobal('location', ...)` + `afterEach(() => vi.unstubAllGlobals())` correctly isolates the jsdom `location.assign` stub per-test (jsdom's real `assign` throws "Not implemented" per design's noted gotcha).

## 5. Full Regression Run — actually executed, real output

| Command | Result |
|---|---|
| `pnpm exec vitest run useLogin` | 1 file, **9/9 PASS** (7 original + 2 new) |
| `pnpm exec vitest run trusted-origins` | 1 file, **16/16 PASS** |
| `pnpm exec vitest run safe-external-redirect` | 1 file, **16/16 PASS** (15 original + 1 control-char regression test added in PR2's follow-up commit `e000f97`) |
| `pnpm exec vitest run safe-redirect` | 1 file, **10/10 PASS** — same 10 cases as the pre-change baseline; ultimate regression gate for the whole 3-PR change holds |
| `pnpm test:coverage` | **129 files / 633 tests PASS.** Repo-wide: 97.69% stmts / 90.18% branch / 97.12% funcs / 98.49% lines — all above the 80% threshold. No file under this change appears in the uncovered-lines table. |
| `pnpm lint` | **0 errors**, 15 warnings — all pre-existing, all in unrelated `shared/presentation/components/ui/*` files (unused imports, one React Compiler skip note on `table.tsx`), none touching this change's files |
| `pnpm tsc --noEmit` | clean, no output |
| `pnpm build` (config.yaml `rules.verify.build_command`) | **Compiled successfully**, all 21 routes generated, TypeScript pass embedded in build succeeded, `Environments: .env` confirms build-time env resolution ran |

Test count grew from PR2's reported 630 to 633 (env.ts/useLogin wiring added 3 net new runtime assertions: 2 new `useLogin` cases + the trusted-origins/safe-external-redirect counts were already included in PR2's 630). All previously-green suites remain green; nothing regressed.

## 6. Spec Requirement → Test Cross-Check (`specs/cross-domain-redirect/spec.md`)

| Requirement | Scenario | Covering test(s) | Verdict |
|---|---|---|---|
| Exact-Origin Allowlist Validation | Exact match against the allowlist | `trusted-origins.spec.ts::parses a single origin` (parse-side) + `safe-external-redirect.spec.ts::returns the normalized URL for an allowlisted origin` (consume-side) | PASS |
| Exact-Origin Allowlist Validation | Subdomain of an allowlisted origin is rejected | `safe-external-redirect.spec.ts::returns null for a subdomain of an allowlisted origin` | PASS |
| Exact-Origin Allowlist Validation | Unset or empty allowlist trusts nothing | `trusted-origins.spec.ts::returns an empty Set for undefined` / `...for an empty string`; consumed by `safe-external-redirect.spec.ts` empty-allowlist case | PASS |
| Exact-Origin Allowlist Validation | Malformed candidate URL | `safe-external-redirect.spec.ts::returns null for a malformed URL without throwing` | PASS |
| External Redirect Helper Contract | Allowlisted external target validates | `returns the normalized URL for an allowlisted origin` | PASS |
| External Redirect Helper Contract | Non-allowlisted external target is rejected | `returns null for a non-allowlisted origin` | PASS |
| External Redirect Helper Contract | Malformed target does not throw | `returns null for a malformed URL without throwing` | PASS |
| External Redirect Helper Contract | Existing same-origin validator is unaffected | `safe-redirect.spec.ts` 10/10 unmodified, file byte-identical since before PR1 | PASS |
| Login Redirect Selection Chain | Internal same-origin redirect wins first | `useLogin.hook.spec.tsx::redirects to a valid ?redirectTo= target instead of the locale home` (existing) + `...redirects via router.push for a relative redirectTo, without calling window.location.assign` (new, proves external is never consulted) | PASS |
| Login Redirect Selection Chain | External allowlisted redirect used when not internal | `useLogin.hook.spec.tsx::redirects via window.location.assign to an allowlisted external origin, without calling router.push` (new) | PASS |
| Login Redirect Selection Chain | Non-allowlisted external target falls back to locale home | `useLogin.hook.spec.tsx::falls back to the locale home when ?redirectTo= is an unsafe absolute URL` (existing, `evil.com`) | PASS |
| Login Redirect Selection Chain | Absent redirectTo falls back to locale home | `useLogin.hook.spec.tsx::redirects to the locale home on success by default` (existing) | PASS |

All 12 scenarios across the spec's 3 requirements have a runtime-passing covering test. No requirement is asserted only by inspection.

## 7. Known Limitations documentation check

`design.md`'s "Known Limitations" section (Login CSRF; Trusted-destination
phishing) and `proposal.md`'s "Out of Scope / Known Limitations" section both
name these as **pre-existing gaps outside the threat model of both mechanisms**,
with a one-line rationale for each and, for login CSRF, an explicit pointer to
what a real mitigation would require ("a pre-session token on the login form
itself — separate work"). This reads as an intentional, reasoned scope
boundary recorded at design time, not an item silently dropped from tasks —
neither appears in `tasks.md` as an unchecked or missing task, and both are
mirrored verbatim in `specs/cross-domain-redirect/spec.md`'s "Out of Scope"
section. No action needed.

## Carried-forward findings from the PR2 report

The PR2 report's two WARNINGs are now resolved:

1. **Control-char pre-parse branch untested** — resolved. Commit `e000f97`
   added `returns null for a control character smuggled into an allowlisted
   origin` using a genuine raw control byte (not a percent-encoded `%00`),
   independently confirmed present in `safe-external-redirect.spec.ts` and
   passing at runtime (line 62 per the grep above).
2. **Threat Matrix `%00` row mislabeled** — resolved per `e000f97`'s commit
   message ("Corrects design.md's Threat Matrix..."); the design.md Threat
   Matrix table now reads consistently with the actual rejection mechanism
   (verified by re-reading design.md's Threat Matrix in this pass — the
   `%00` row and the separate literal-control-char row are both present and
   distinctly labeled).

No new CRITICAL or WARNING findings were introduced by the PR3 slice.

## Acknowledged gap — not a finding

This session's permission settings hard-deny Read/Edit/Bash access to any
`.env*` path. `.env.example`'s content could not be directly inspected.
Indirect evidence collected instead: `git status --porcelain` shows ` M
.env.example`; `git diff e000f97 --stat` (whole-tree diff, not path-scoped)
shows `.env.example | 7 +++++++` (7 insertions, matching the 7-line
comment+var block design.md Decision 5 specifies); `pnpm build`'s
`Environments: .env` line and the successful `TRUSTED_REDIRECT_ORIGINS`
wiring both indicate the env file is syntactically valid and loadable. This
is recorded as an acknowledged, unverifiable-by-this-session gap per the
task's explicit instruction, not treated as a blocking CRITICAL/WARNING.

## Issues

**CRITICAL**: None.

**WARNING**: None new. (Both PR2 WARNINGs are resolved — see above.)

**SUGGESTION**: None beyond what PR2 already recommended and which has since
been applied.

## Final Verdict

**PASS.** The whole `cross-domain-redirect-allowlist` change (all 3 PRs) is
verified-safe to consider done:

- All 4 phases / all tasks complete and match code state.
- All 3 layers (parser, external-redirect helper, login-chain wiring) trace
  cleanly to design decisions with zero unexplained deviation.
- All 12 spec scenarios across the spec's 3 requirements have a
  runtime-passing covering test.
- Full regression suite (633 tests, including the ultimate
  `safe-redirect.spec.ts` 10/10 gate) passes; coverage, lint, tsc, and
  production build are all clean.
- Both issues raised in the PR2 interim report were independently confirmed
  resolved in this pass, not just claimed resolved.
- The one unverifiable item (`.env.example` content) is a pre-declared,
  environment-imposed constraint, not a code or test gap, and is fully
  bounded by indirect evidence.

No fix is required before archive.
