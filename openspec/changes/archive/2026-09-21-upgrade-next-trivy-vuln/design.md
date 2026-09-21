# Design: Upgrade Next.js to 16.3.3 to clear blocking Trivy CRITICALs

## Technical Approach

Proposal approach A: patch-level bump inside the same minor. Edit the two exact
pins in `package.json`, regenerate `pnpm-lock.yaml` with the repo's own pnpm, and
prove the result through the existing verification chain plus a local Trivy
re-scan. No source file under `src/`, no `next.config.ts` change, no CI workflow
change. DDD/Hexagonal layering is untouched by construction — the diff never
enters `src/core/` or `src/shared/`.

## Architecture Decisions

### Decision: Bump `next` + `eslint-config-next` to 16.3.3

| Option | Tradeoff | Decision |
|---|---|---|
| A. Patch bump 16.3.0 -> 16.3.3 | Vendor-patched, same minor, React 19.2.8 peer unchanged, no codemod | **Chosen** |
| B. pnpm `overrides` on sharp/libvips | Only masks the AVIF path; Trivy still matches the `next` advisory; unsupported combo | Rejected |
| C. `.trivyignore` entry | Suppresses a real unauthenticated RCE; proposal declares it out of scope | Rejected |
| D. Jump to the newest 16.x/17.x available | Minor/major surface beyond the fix; may violate `minimumReleaseAge: 1440` | Rejected |

**Rationale**: 16.3.3 is the minimum version that satisfies both advisories
(CVE-2026-75604, GHSA-2xp9-vwfh-vxw4) with the smallest blast radius and the
shortest review diff.

### Decision: Keep the existing exact-pin style

`package.json` pins `"next": "16.3.0"` and `"eslint-config-next": "16.3.0"` with
no range prefix, unlike the caret-ranged rest of the manifest. Both become
`"16.3.3"` — literal, no `^`. Rationale: framework/lint-config lockstep is
intentional here; introducing a caret would silently widen resolution.

### Decision: AVIF disablement has no functional impact

`next.config.ts` declares `reactCompiler` and `output: 'standalone'` only — no
`images` block. `images.formats` therefore stays at the Next 16 default
`['image/webp']`, so the AVIF optimization path the patch disables was never
reachable. No `next/image` consumer needs review. Rationale: verified in code,
not inferred from release notes.

## File Changes

| File | Action | Description |
|---|---|---|
| `package.json` | Modify | `next` and `eslint-config-next` exact pins 16.3.0 -> 16.3.3 |
| `pnpm-lock.yaml` | Modify | Regenerated resolution for those two roots and their transitives |

Nothing else. Any other path appearing in the diff is a defect in the change.

## Lockfile Refresh

Use the repo-pinned toolchain, not an ambient pnpm: `package.json` declares
`packageManager: pnpm@11.20.0` and the Dockerfile does
`corepack prepare pnpm@11.20.0 --activate`. Run `corepack enable` first, then
from the repo root:

```
pnpm install            # after editing both pins; rewrites pnpm-lock.yaml
pnpm install --frozen-lockfile   # proves the lockfile is self-consistent
```

Constraints from `pnpm-workspace.yaml` that the refresh must satisfy:
- `minimumReleaseAge: 1440` — 16.3.3 published 2026-08-25, well past 24h. OK.
- `trustPolicy: no-downgrade` — if a *new* transitive resolution trips the
  provenance heuristic, follow the existing documented pattern: verify against
  the npm registry and add an **exact-version** entry to `trustPolicyExclude`.
  Never relax the policy globally. Not expected for a patch bump.

Note (out of scope): `AGENTS.md` still states `pnpm@9.15.4`; `package.json` is
authoritative at 11.20.0.

## Verification Sequence

Run in order; stop at the first failure.

```
pnpm install --frozen-lockfile
pnpm lint
pnpm tsc --noEmit
pnpm test                 # or pnpm test:coverage for the 80% threshold
pnpm build
docker build -t account-web:16.3.3 .
trivy image --severity CRITICAL --ignore-unfixed account-web:16.3.3
```

The Trivy invocation mirrors the reusable workflow's blocking gate (CRITICAL,
`ignore-unfixed`, exit 1). Pass = 0 findings attributed to `next`. CRITICALs from
OS/base-image packages are a separate change, not this one.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | No behavior delta | Existing Vitest suite, unchanged, 80% threshold |
| Build | Standalone output still produced | `pnpm build` + 2-stage Docker build |
| Security | Advisories cleared | Local Trivy re-scan, then the CI blocking gate on the PR |

No new tests. A dependency patch with zero requirement delta has nothing to
assert that the existing suite does not already cover.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file
classification, or process-integration boundary is introduced or modified.

## Migration / Rollout

No migration. Single commit, single PR, far under the 400-line budget once the
lock diff is confirmed narrow.

**Rollback**: `git revert` the single commit (both files move together), then
`pnpm install --frozen-lockfile`. No data, schema, or config state to unwind.
Rollback returns to next@16.3.0 with the blocking gate red — stable but unmergeable.

## Open Questions

- [ ] Exact failing CVE IDs from run 35490828467 were never confirmed via
      `gh run view --log-failed` (exploration caveat). The re-scan settles it
      empirically, so this does not block apply.
- [ ] Whether Trivy surfaces additional CRITICALs from `node:24-bookworm-slim`
      once `next` is clear. If so: separate change.
