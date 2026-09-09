## Context

`account-api`'s auth module is REST-only (`@Controller({ path: 'auth', version: '1' })`,
global prefix `api` + URI versioning → real routes are
`/api/v1/auth/{register,login,refresh}`), while `openspec/config.yaml`'s
`conventions.naming.repositories` currently documents only the GraphQL
repository pattern as "current standard" (tenancy/app already have a
GraphQL transport in `account-api`, but auth does not). See proposal.md
for why this context exists; this document covers how it's built and the
REST-convention gap it fills.

Two pieces of shared infra were already built anticipating this context:
`src/shared/infrastructure/http/axios.client.ts` (with an `AUTH_SKIP` list
for `/auth/login` / `/auth/register` and a full 401 → refresh → retry
flow) and `src/shared/infrastructure/http/proxy.ts` (forwards `Set-Cookie`
correctly, verified by reading `proxyTo()`). Both are reused, not
rebuilt.

**Path mismatch found while reading the existing proxy** — worth calling
out because it's silent: `app/api/[...path]/route.ts` builds the upstream
URL as `internalUrl('/api/' + path.join('/'))`, i.e. it does **not** add
the `v1` version segment. `axios.client.ts`'s current `AUTH_SKIP` entries
(`/auth/login`, `/auth/register`) are explicitly flagged in that file's
own comment as a placeholder "to align with the first `auth` bounded
context's actual endpoints once it exists." Left as-is, a call to
`/auth/login` would proxy to `account-api`'s `/api/auth/login`, which
doesn't exist (real route is `/api/v1/auth/login`) — this would 404
today. See Decision 1.

## Goals / Non-Goals

**Goals:**
- Working register + login screens backed by the real `account-api` REST
  endpoints, session established per the architecture doc's cookie model.
- A documented REST repository convention other REST-backed contexts can
  copy (tenancy already has GraphQL to copy from; nothing exists yet for
  REST).
- Fix the versioned-path gap between the existing proxy and axios client
  placeholders so `/auth/*` calls actually reach `account-api`.

**Non-Goals:**
- Tenancy screens, `/admin`, password reset/MFA, or a client-facing
  refresh flow — all explicitly out of scope per proposal.md.
- A rich frontend domain model for `auth` (value objects, entities). The
  API is the source of truth for account state; the frontend only needs
  DTOs shaped for the two forms plus the session bootstrap.
- Any change to `account-api` itself.

## Decisions

### 1. Versioned REST paths, fixed at the shared-infra boundary
The auth REST repository calls `/v1/auth/register`, `/v1/auth/login`
(relative to the axios `baseURL` of `/api`, so the browser requests
`/api/v1/auth/{...}`, which the existing proxy forwards unchanged to
`account-api`'s real `/api/v1/auth/{...}`). `axios.client.ts`'s
`AUTH_SKIP` array and `doRefresh()`'s call to `/auth/refresh` are updated
to the same `/v1/...` paths as part of this change — they're shared
infra, not context-owned, but they were built as a placeholder explicitly
for this context to correct. Alternative considered: change the Next.js
proxy to inject `v1` itself — rejected, because `account-api` may expose
future endpoints under different versions, and the browser-visible path
should stay an explicit, greppable contract rather than implicit rewrite
logic in the proxy.

### 2. REST repository convention (new, sibling to the GQL one)
```
src/core/auth/infrastructure/repositories/rest/
  auth.rest.repository.ts        — implements IAuthRepository, singleton export authRestRepository
  auth.rest.repository.spec.ts   — unit tests; mock the shared `http` axios instance directly (vi.mock), same spirit as GQL repos mocking apolloClient
```
No `queries/`/`mutations/` subfolders (those are GraphQL-document
concepts) — a REST repository's methods build the request inline, same
as any other axios call in this codebase. This becomes the pattern
recorded in `openspec/config.yaml` and `src/core/README.md` for the next
REST-backed context.

### 3. Refresh token is never stored client-side, even though the API returns it in the login response body
`ILoginSessionResult` on `account-api` includes `refreshToken` in the
JSON body (in addition to setting it as an httpOnly cookie). The
architecture doc is explicit that `refresh_token` is httpOnly specifically
to be "blindado contra XSS" — readable-by-JS storage defeats that. The
`IAuthRepository.login()` port method therefore returns only
`{ accessToken: string }`; the REST repository implementation reads
`response.data.accessToken` and discards `response.data.refreshToken`
rather than passing it up. The cookie set by the proxied `Set-Cookie`
header is the only place the refresh token lives. Nothing in
`application/` or `presentation/` ever sees the raw value.

### 4. `LoginUseCase` writes the access token to the shared session store directly
Per the architecture skill's rule 2 ("application/ reads/writes store
state via `getState()` only"), `LoginUseCase.execute()` calls
`useSessionStore.getState().setAccessToken(result.accessToken)` itself
after a successful repository call, rather than pushing that
responsibility up into the presentation-layer hook's `onSuccess`. This
keeps `useLogin` a thin TanStack Query wrapper (matching every other hook
in this codebase) and keeps the "session established" business rule in
one place.

### 5. No domain models/value-objects, no context-scoped provider
- **Domain layer**: plain interfaces only (`RegisterInput`, `LoginInput`)
  — no VOs/entities. Field-level validation (email format, password
  length ≥ 8 on register, required fields on login) lives in the Zod
  schemas in `presentation/schemas/`, mirroring `account-api`'s
  `class-validator` constraints; there's no other business rule to model.
- **No `auth.providers.tsx`**: this context introduces no context-scoped
  React context, no custom QueryClient, nothing beyond the
  already-shared `session.store.ts` (Zustand, global) and the existing
  Apollo/Query providers. Adding an empty passthrough provider file
  would be dead weight. If a future auth-scoped need appears (e.g. a
  route guard), add it then.

### 6. Post-login redirect target
Redirects to `/[lang]` (the locale home) — there's no dashboard or
tenancy list yet (both out of scope, see proposal.md). This is a
placeholder revisited by whichever future change adds the first
authenticated landing screen; tracked as an open question below rather
than blocking this change on a screen that doesn't exist yet.

### 7. No skeleton components for the two screens
The Storybook/skeleton convention (`{name}-skeleton/`) exists for
screens that Suspense-load server data. Login and register fetch nothing
on mount — the only network activity is the submit mutation, which
`react-hook-form`'s own submitting state covers. No skeleton is added for
either screen.

## Risks / Trade-offs

- **[Risk]** `account-api`'s `POST /auth/register` handler returns
  `Promise<string>` from the controller (Nest sends a bare string body,
  not `{ id }`), based on reading `auth.controller.ts` — not verified
  against a running instance. → **Mitigation**: the REST repository
  builds `CreatedEntity` as `{ id: response.data }`, and the first task
  in tasks.md is to confirm the actual wire shape against a running
  `account-api` (via `local-dev-stack`) before finalizing the mapping;
  adjust the one line in `auth.rest.repository.ts` if the real response
  differs.
- **[Risk]** The `AUTH_SKIP`/`doRefresh` path fix (Decision 1) touches
  shared infra used by every future context, not just `auth`. →
  **Mitigation**: the change is additive-in-spirit (correcting a
  documented placeholder to its intended real value) and covered by the
  existing `axios.client.spec.ts`/`refresh-mutex.spec.ts` suites, which
  must still pass unmodified in behavior (only the literal path strings
  change).
- **[Trade-off]** Skipping a dedicated `auth.providers.tsx` means the
  next context that *does* need one won't find a populated example to
  copy from this context — acceptable since the architecture skill's
  provider rule is about registration when a provider exists, not a
  mandate to always create one.

## Migration Plan
Purely additive (new `src/core/auth/**`, two new routes, one dictionary
registration, corrected placeholder paths in existing shared infra). No
data migration. Rollback is reverting the change's commit(s); no
account-api or infrastructure changes are involved.

## Open Questions
- What is the actual authenticated landing route once tenancy exists?
  Decision 6 picks `/[lang]` as a placeholder for now; revisit when the
  first authenticated screen (tenant list, most likely) is proposed.
