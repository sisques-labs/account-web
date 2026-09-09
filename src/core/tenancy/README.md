# Tenancy Context

## Scope

Platform-admin views over `account-api`'s `tenancy` GraphQL context:
listing/creating tenants for an app, and listing/adding tenant members.
Backs the tenant table on the `/admin/apps/[appSlug]` screen. `/admin/users`
and `/admin/invites` are static, UI-only placeholders (no backend exists for
either — see below) and have no use-cases/repository calls of their own.

The **App** aggregate (ecosystem apps — listing them, creating one, the
`/admin/apps` screen's cards and "Create app" dialog) lives in its own
`core/app/` context, not here — see `core/app/README.md` for why and for
how the two contexts' data meet only at the presentation layer.
`tenancy`'s own use-cases (`CreateTenantUseCase`, `ListTenantsByAppUseCase`)
only ever take an `appId: string`, never an app's name/slug, so this
context has no port/adapter into `app` — there is nothing for its
application layer to look up.

## Transport decision: GraphQL

`account-api`'s GraphQL `tenant-queries.resolver.ts` exposes
`tenantsFindByCriteria`, guarded by `PlatformAdminGuard` and filterable by
`appId` — i.e. a genuine platform-admin-scoped "list tenants" query, not
scoped to the caller's own memberships. Since GraphQL already covers every
read/write this context needs (`tenantsFindByCriteria`,
`tenantMembershipsFindByTenantId`, `tenantCreate`, `tenantMemberAdd`), this
context uses GraphQL exclusively, per the repo's documented "current
standard" for new contexts (`openspec/config.yaml` →
`conventions.naming.repositories`). There was no need to fall back to REST
for any part of this module.

## Deviations from the canvas forced by the real backend

- **No "Owner" selector in the create-tenant dialog.** `tenantCreate`
  always assigns the authenticated caller (`creatorUserId`, read from the
  JWT server-side) as the tenant's `OWNER` — there is no `ownerId` field on
  `TenantCreateRequestDto`, so an admin cannot create a tenant on behalf of
  someone else. `CreateTenantInput` is therefore just `{ appId, name }`.
- **No "Owner" column in the tenant table.** `TenantResponseDto` has no
  owner field at all — ownership is only derivable from a tenant's
  memberships (the membership with role `OWNER`), which would need an
  extra fetch per row. The table shows Tenant / Members / Created instead
  of the canvas's Tenant / Owner / Members / Created.
- **Add-member form takes an email, not a "pick an existing user" select.**
  `TenantAddMemberRequestDto` takes `email` (the backend resolves the
  target user id server-side); there is also no user-listing endpoint to
  populate a picker with. The members dialog's add-member form is a plain
  email input + role select instead of the canvas's user dropdown.
- **Members list shows a raw `userId`, not a name.**
  `TenantMembershipResponseDto` only has `userId` — no resolved name/email
  — on both GraphQL and REST. The dialog displays the id (monospace)
  rather than fabricating a display name.
- **`AddTenantMemberUseCase`'s error state is a single generic message.**
  `tenantMemberAdd` can fail (e.g. email not found) but the failure isn't
  surfaced as a documented, stable GraphQL error code today, so the UI
  doesn't attempt to special-case it.
## `/admin/users` and `/admin/invites`

Confirmed via `account-api` source: the `user` context has no
find-by-criteria query/controller (only single lookups by id/email used
internally), and there is no `invite` feature anywhere in the codebase (a
migration comment explicitly documents `tenant_invite` as intentionally
not created yet). Both screens render their table's column headers with a
static "not available yet" empty state — no hooks, no use-cases, no
network calls.

## No provider

Like `auth`, this context adds no `tenancy.providers.tsx` — it has no
Zustand store and needs no React context beyond the app-wide Apollo/
TanStack Query providers already wired in `shared/`.

## Platform-admin gating

The `useIsPlatformAdmin()` hook (and the underlying, framework-free
`decodeAccessTokenClaims()` service) live in `core/auth/` rather than here,
since they're about interpreting the shared session token — see
`core/auth/README.md`. This context's own
`presentation/hooks/use-admin-guard/useAdminGuard.hook.ts` composes that
hook with the session store's bootstrap state and the current pathname to
gate the whole `/admin` route tree: it redirects an unauthenticated visitor
to `/login` (once the app-wide session bootstrap has had its one silent
chance to restore a session — see `useSessionBootstrap`), reports
`unauthorized` for a signed-in non-admin, and resolves which admin section
the current pathname maps to. `AdminShell` (this context's
`presentation/components/admin-shell/`) is pure JSX driven by that hook's
`{ status, active }` output — it holds no auth-guard logic of its own.
