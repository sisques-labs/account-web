# Spec: dependency-security (upgrade-next-trivy-vuln)

## Delta Summary

There are NO requirement deltas. This change is a dependency-security patch
(`next` and `eslint-config-next` 16.3.0 -> 16.3.3). No capability is added or
modified, and no observable application behavior changes. `openspec/specs/` is
empty, so there is no base spec to modify. This file exists only to record the
verifiable acceptance scenarios that gate the change.

## ADDED Requirements

None.

## MODIFIED Requirements

None.

## REMOVED Requirements

None.

## Acceptance Scenarios (verification only, not new requirements)

### Scenario 1: Dependencies pinned at the patched version
- Given the change is applied
- When `package.json` and `pnpm-lock.yaml` are inspected
- Then `next` and `eslint-config-next` both resolve to exactly `16.3.3`

### Scenario 2: Trivy blocking scan is clean for next
- Given the Docker image is built from the updated lockfile
- When the Trivy scan runs with severity CRITICAL and `ignore-unfixed`
- Then it reports 0 findings for `next` (CVE-2026-75604 and GHSA-2xp9-vwfh-vxw4 absent)
- And no `.trivyignore` entry was added to achieve this

### Scenario 3: Static checks and tests pass
- Given the updated dependencies are installed with `pnpm install --frozen-lockfile`
- When `pnpm lint`, `pnpm tsc --noEmit`, and `pnpm test` run
- Then all three exit with status 0
- And coverage remains at or above the 80% threshold

### Scenario 4: Builds succeed
- Given the updated dependencies
- When `pnpm build` and the Docker standalone build run
- Then both complete successfully

### Scenario 5: No behavior change
- Given `next.config.ts` declares no `images` block
- When the change is applied
- Then `images.formats` remains the Next 16 default `['image/webp']`
- And no application, domain, or bounded-context source file is modified

### Scenario 6: Review budget
- Given the change is submitted as a single PR
- Then the diff touches only `package.json` and `pnpm-lock.yaml`
- And stays under the 400-line PR budget
