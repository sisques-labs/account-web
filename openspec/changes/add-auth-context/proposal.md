## Why

`account-web` has no bounded context yet — it's a fresh clone of
`nextjs-template` with only the shared infrastructure wired. `account-api`
already exposes working REST auth endpoints (`/api/v1/auth/register`,
`/login`, `/refresh`), and the shared HTTP client
(`src/shared/infrastructure/http/axios.client.ts`) already anticipates
`/auth/login` and `/auth/register` paths and a full 401-refresh flow. We
need a login and registration UI so a real user can authenticate against
Sisques Account. This is also the **first** bounded context in this repo,
so it establishes the pattern (including a REST repository convention,
since account-api's auth endpoints are REST, not GraphQL) that every
subsequent context follows.

## What Changes

- Add the `auth` bounded context (`src/core/auth/`) with `login` and
  `register` use cases, screens, and the Zustand-backed session wiring the
  existing axios interceptor already expects.
- Introduce a **REST repository convention** for this template
  (`infrastructure/repositories/rest/{context}.rest.repository.ts`, using
  the existing `http`/`bareHttp` axios instances) as the sibling to the
  documented GraphQL convention — `account-api`'s auth module is REST-only,
  so this context cannot follow the GQL pattern `openspec/config.yaml`
  currently documents as "current standard". This convention becomes the
  reference for any other REST-backed context.
- Add `/[lang]/login` and `/[lang]/register` routes (public, unauthenticated).
- Populate the shared `session.store.ts` access token on successful login;
  rely on the account-api `Set-Cookie` (already forwarded correctly by the
  existing `proxyTo` helper) for the httpOnly `refresh_token` cookie — no
  new store needed for it.
- Add `en.ts`/`es.ts` i18n dictionaries for the auth module and wire them
  into `get-dictionary.ts`.
- Add `auth.providers.tsx` (if any auth-scoped React context is needed) and
  nest it into `shared/presentation/providers/providers.tsx`.
- Add Storybook stories for both screens, seeding TanStack Query/Zustand
  state per the project's hook-backed-story convention.
- **Not included** (explicitly out of scope for this change): tenancy
  screens, the `/admin` section, password reset/MFA (delegated to
  Keycloak), and a client-visible refresh-token screen/flow (refresh is
  already fully handled by the existing axios interceptor).

## Capabilities

### New Capabilities
- `auth`: user registration and login against Sisques Account's REST auth
  API, including session bootstrap (access token in the shared store,
  refresh token via httpOnly cookie) and redirect behavior on
  success/failure.

### Modified Capabilities
(none — no existing specs in this repo yet)

## Impact

- **Affected code**: new `src/core/auth/**`, new `app/[lang]/login/`,
  `app/[lang]/register/` routes, `shared/presentation/i18n/get-dictionary.ts`
  (register auth dict), `shared/presentation/providers/providers.tsx` (nest
  auth provider, if any).
- **Affected docs**: `openspec/config.yaml` conventions section gains the
  REST repository convention alongside the existing GQL one;
  `src/core/README.md` updated to reference `auth` as the canonical
  example, per the architecture skill's own instruction.
- **APIs consumed**: `account-api` `POST /api/v1/auth/register`,
  `POST /api/v1/auth/login` (via the existing Next.js proxy at
  `app/api/[...path]/route.ts`, no direct browser-to-account-api calls).
- **No breaking changes** — this is the first context added to an
  otherwise-empty `src/core/`.
- **Rollback**: additive only (new directory tree + two new routes + one
  dictionary registration + one provider registration); revert the commit(s)
  to roll back, no data migrations or destructive steps involved.
