# Proposal: Upgrade Next.js to 16.3.3 to clear blocking Trivy CRITICALs

## Intent

The PR-time `Docker Build` job (run 35490828467) fails its blocking Trivy scan (CRITICAL, `ignore-unfixed`) with 2 findings, both on `next@16.3.0`:

- `CVE-2026-75604` — unauthenticated RCE (fixed in 15.5.24 / 16.3.3)
- `GHSA-2xp9-vwfh-vxw4` — unauthenticated RCE in the Image Optimization API (AVIF via libheif in sharp)

No PR can merge while this gate fails, and the second advisory is a real RCE class, not scanner noise. Success = green blocking scan on the vendor-patched version, with no behavior regression.

## Scope

### In Scope
- Bump `next` and `eslint-config-next` from `16.3.0` to `16.3.3` (exact pins, as today).
- Refresh `pnpm-lock.yaml` (transitively picks up the patched `sharp`/libheif resolution if any).
- Verify: `pnpm lint`, `pnpm tsc --noEmit`, `pnpm test` (80% coverage threshold), `pnpm build`, Docker build, Trivy re-scan.

### Out of Scope
- `sharp`/libvips version override (fragile, unsupported).
- Base-image or `apt` upgrades (does not address the `next` findings).
- `.trivyignore` entries (would hide a critical RCE).
- Any application, domain, or bounded-context code change.
- Changing the shared workflow's floating `@main` reference.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- None. This is a dependency-security patch: no requirement or observable behavior changes, so no spec deltas are produced. The security outcome is enforced by the existing CI Trivy gate, not by a new spec requirement.

## Approach

Exploration approach A. Patch-level bump inside the same minor: no peer change for React 19.2.8, no codemod. `pnpm` `minimumReleaseAge: 1440` is satisfied (16.3.3 released 2026-08-25).

AVIF impact verified in code: `next.config.ts` declares no `images` block, so `images.formats` stays at the Next 16 default `['image/webp']` (`node_modules/next/dist/shared/lib/image-config.js`). AVIF optimization is not enabled, so the patch's AVIF disablement has **no functional impact**. `next/image` is used in five shared UI components only.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | `next`, `eslint-config-next` → `16.3.3` |
| `pnpm-lock.yaml` | Modified | Regenerated resolution |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Patch-level regression in build/runtime | Low | Full lint/tsc/test/build + Docker build before merge |
| Trivy still flags other CRITICALs (base image / OS packages) | Medium | Re-scan is part of verification; out-of-scope findings become a separate change |
| Lockfile churn beyond `next` | Low | Review lock diff; keep it within the 400-line PR budget |

## Rollback Plan

Revert the single commit (`package.json` + `pnpm-lock.yaml`), run `pnpm install --frozen-lockfile`. No data, schema, or config migration is involved. The pre-change state is `next@16.3.0` with a failing gate, so rollback restores the known-broken-but-stable baseline.

## Dependencies

- `next@16.3.3` published and installable under `minimumReleaseAge: 1440`.

## Success Criteria

- [ ] `package.json` and `pnpm-lock.yaml` resolve `next` and `eslint-config-next` at `16.3.3`.
- [ ] Trivy blocking scan reports 0 CRITICAL findings for `next`.
- [ ] `pnpm lint`, `pnpm tsc --noEmit`, `pnpm test` pass; coverage stays ≥ 80%.
- [ ] `pnpm build` and the Docker standalone build succeed.
- [ ] Single PR, under the 400-line review budget.
