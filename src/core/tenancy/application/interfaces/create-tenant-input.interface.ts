/**
 * `account-api`'s `tenantCreate` mutation always assigns the authenticated
 * caller as the tenant's `OWNER` (`creatorUserId` comes from the JWT
 * server-side) — there is no `ownerId` field on the real
 * `TenantCreateRequestDto`, so an admin cannot create a tenant on behalf of
 * someone else. This input intentionally has no owner field; the canvas's
 * "Owner" selector in the create-tenant dialog was dropped for this reason.
 */
export interface CreateTenantInput {
  appId: string;
  name: string;
}
