# App Context

## Scope

The `App` aggregate — one row per app in the Sisqués Labs ecosystem
(Gardenia, Nexora, …). Listing the ecosystem's apps and registering a new
one, backing the app cards on `/admin/apps` and the "Create app" dialog.
Split out of `tenancy` (see below) — everything Tenant/TenantMembership
stays in `core/tenancy/`.

## Why this is its own context

`account-api` treats `app` and `tenancy` as separate bounded contexts
(`src/contexts/app/`, `src/contexts/tenancy/`) — `tenancy`'s own README is
explicit that "the App aggregate … lives in the separate app context …
tenancy reaches app only through `IAppLookupPort` + `AppLookupAdapter`
(QueryBus), never a direct domain import." This frontend originally folded
`listApps`/`createApp` into `ITenancyRepository` alongside the Tenant/
TenantMembership methods — a boundary violation flagged in a PR review on
`tenancy.repository.port.ts`. This context mirrors the backend split:
`IAppRepository` (`listApps`, `createApp`) lives here, `ITenancyRepository`
keeps only Tenant/TenantMembership methods.

## No cross-context lookup needed on this side

On `account-api`, `tenancy`'s `CreateTenantCommandHandler` needs
`IAppLookupPort` to assert an app exists server-side. On this frontend,
`tenancy`'s use-cases (`CreateTenantUseCase`, `ListTenantsByAppUseCase`)
only ever take an `appId: string` — they never need an app's name/slug —
so `tenancy`'s application layer has no reason to reach into `app` at all.
The only place both contexts' data meet is in `presentation/`: screens
living in `tenancy` (e.g. `admin-app-detail.screen.tsx`) compose `app`'s
`useAppBySlug()` hook alongside `tenancy`'s `useTenantsByApp()` hook — that
composition happens at the presentation layer, which is allowed to consume
multiple contexts' public hooks; no port/adapter is warranted for it.

## `useAppBySlug`

`account-api` has no `appFindBySlug` query, so resolving an app from its
slug (used by the `/admin/apps/[appSlug]` route) is a client-side lookup
over the same `useApps()` cache rather than a second network call —
`presentation/hooks/use-app-by-slug/useAppBySlug.hook.ts` wraps that lookup
and passes the underlying query's loading/error/success state through, so
consuming screens stay pure JSX driven by hook output.

## `CreateAppDialog` placement

Moved here (not left in `tenancy`'s presentation) because it's about
creating an `App` entity, not a tenancy concern — the same reasoning that
keeps `CreateTenantDialog`/`TenantMembersDialog` in `tenancy`'s own
presentation layer for the Tenant/TenantMembership entities they create.

## Transport decision: GraphQL

Same as `tenancy` — `account-api` exposes `appsFindByCriteria` and
`appCreate` over GraphQL, so this context uses GraphQL exclusively, per the
repo's documented "current standard" for new contexts.

## No provider

Like `auth`/`tenancy`, this context adds no `app.providers.tsx` — no
Zustand store, no React context beyond the app-wide Apollo/TanStack Query
providers already wired in `shared/`.
