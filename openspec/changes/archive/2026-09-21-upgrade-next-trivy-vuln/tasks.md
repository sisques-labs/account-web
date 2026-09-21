# Tasks: Upgrade Next.js to 16.3.3 (Trivy CRITICAL fix)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~20-150 (2 pin lines + lockfile churn) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | pending (not needed) |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Bump next + eslint-config-next to 16.3.3, refresh lockfile | PR 1 | `pnpm install --frozen-lockfile && pnpm test` | `trivy image --severity CRITICAL --ignore-unfixed account-web:16.3.3` | `git revert` commit (package.json + pnpm-lock.yaml together) |

Strict TDD note: dependency bump, zero requirement delta. No new tests. Proof = existing suite (80% coverage) + Trivy re-scan.

## Phase 1: Manifest and lockfile

- [x] 1.1 Edit `package.json`: set `"next": "16.3.3"` (exact, no caret).
- [x] 1.2 Edit `package.json`: set `"eslint-config-next": "16.3.3"` (exact, no caret).
- [x] 1.3 Run `corepack enable`, then `pnpm install` (pnpm@11.20.0) to regenerate `pnpm-lock.yaml`. If `trustPolicy` trips, verify on npm and add an exact-version `trustPolicyExclude` entry only (never relax globally).
- [x] 1.4 Check `git diff --stat`: only `package.json` and `pnpm-lock.yaml` changed; `pnpm-lock.yaml` diff size (additions + deletions) stays under the 400-line budget. If over, stop and report to orchestrator.

## Phase 2: Verification (stop at first failure)

- [x] 2.1 `pnpm install --frozen-lockfile` (lockfile self-consistent).
- [x] 2.2 `pnpm lint`.
- [x] 2.3 `pnpm tsc --noEmit`.
- [x] 2.4 `pnpm test:coverage` (existing suite, 80% threshold).
- [x] 2.5 `pnpm build` (standalone output).
- [x] 2.6 `docker build -t account-web:16.3.3 .`
- [x] 2.7 `trivy image --severity CRITICAL --ignore-unfixed account-web:16.3.3`: pass = 0 findings attributed to `next`, no `.trivyignore`. Base-image CRITICALs go to a separate change.

## Phase 3: Wrap-up

- [x] 3.1 Confirm the final diff touches only `package.json` and `pnpm-lock.yaml`; commit as `chore(deps): bump next to 16.3.3` (no AI attribution).
