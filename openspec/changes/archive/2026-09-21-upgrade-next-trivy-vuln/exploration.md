# Exploration: upgrade-next-trivy-vuln

## Verified failure
- Workflow: `Docker Build` (docker.yml -> shared docker-smoke-build.yml@main, `scan_image: true`, `block_on_critical: true`), PR-time.
- Trivy blocking scan: CRITICAL only, ignore-unfixed. Total: 2 (CRITICAL: 2), both on `next` (package.json) installed 16.3.0:
  - CVE-2026-75604 — Next.js: Unauthenticated RCE (fixed in 15.5.24, 16.3.3)
  - GHSA-2xp9-vwfh-vxw4 — Next.js: Unauthenticated RCE in Image Optimization API (AVIF via libheif in sharp)
- Trunk pipeline runs the scan report-only (`block_on_critical: false`).

## Current versions
next 16.3.0, eslint-config-next 16.3.0, react/react-dom 19.2.8, sharp 0.35.3. Dockerfile: node:24-bookworm-slim. No .trivyignore.

## Approaches
| | Pros | Cons |
|---|---|---|
| A. Bump next + eslint-config-next to 16.3.3 (recommended) | Vendor fix, same minor | Patch disables AVIF optimization; check next.config images.formats |
| B. Override sharp/libvips | Targeted | Fragile, unsupported |
| C. Base image / apt upgrade | — | Does not address Next findings |
| D. .trivyignore | Trivial | Hides a critical RCE |

## Recommendation
A. Verify with lint, tsc, test, build, docker build and a Trivy re-scan.

## Risks
- AVIF behavior change; AGENTS.md warns of breaking changes (read node_modules/next/dist/docs).
- Shared workflow `@main` floats.

Engram: sdd/upgrade-next-trivy-vuln/explore (obs 868).
