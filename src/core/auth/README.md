# Auth Context

## Scope

Registration and login against `account-api`'s REST auth endpoints
(`/api/v1/auth/{register,login}`), plus session bootstrap (storing the
access token on the shared `session.store.ts`). This is the first
bounded context in this repo, so it also establishes conventions later
contexts follow.

Not covered here: tenancy, `/admin`, password reset/MFA (delegated to
Keycloak, see the platform architecture doc), or a client-facing refresh
flow — refresh is already handled entirely by the shared axios
interceptor (`src/shared/infrastructure/http/axios.client.ts`).

## REST repository convention

`account-api`'s auth module is REST-only (no GraphQL transport), unlike
`tenancy`/`app`. This context introduces the REST sibling to the
project's GraphQL repository convention:

```
src/core/auth/infrastructure/repositories/rest/
  auth.rest.repository.ts        — implements IAuthRepository, singleton export authRestRepository
  auth.rest.repository.spec.ts   — unit tests; mock the shared `http` axios instance directly (vi.mock)
```

No `queries/`/`mutations/` subfolders — those are GraphQL-document
concepts. A REST repository's methods build each request inline using the
shared `http` instance (`src/shared/infrastructure/http/axios.client.ts`),
the same way any other axios call in this codebase is made.

Use this same shape for the next REST-backed context.

## Refresh token handling

`account-api`'s login response includes `refreshToken` in the JSON body
*in addition to* setting it as an httpOnly cookie. `AuthRestRepository.login()`
deliberately discards the body's `refreshToken` and returns only
`{ accessToken }` — the platform architecture doc is explicit that
`refresh_token` is httpOnly specifically to be hardened against XSS, so
nothing above the repository layer (`application/`, `presentation/`) ever
sees the raw value. The httpOnly cookie set via the Next.js proxy's
forwarded `Set-Cookie` header is the only place it lives.

## Versioned paths

`account-api` mounts auth under URI versioning (`/api/v1/auth/*`). The
Next.js proxy (`app/api/[...path]/route.ts`) forwards paths unchanged —
it does not inject a version segment — so every path this context calls
must include `/v1/...` explicitly (see `auth.rest.repository.ts` and the
`AUTH_SKIP` array in the shared axios client).

## Session store

`LoginUseCase.execute()` writes the access token to the shared,
already-existing `useSessionStore` (`src/shared/infrastructure/store/session.store.ts`)
directly via `getState()`, per the architecture skill's rule that
application-layer code touches store state only through `getState()`.
This context has no store of its own — there's no richer session data to
keep yet.

## No provider, no skeletons

This context adds no `auth.providers.tsx` (no context-scoped React
context or custom QueryClient needed beyond what's already shared) and no
skeleton components for the login/register screens (neither fetches data
on mount — the only network activity is the submit mutation).
