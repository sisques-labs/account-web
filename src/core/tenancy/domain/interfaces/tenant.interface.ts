/**
 * Mirrors `account-api`'s `TenantResponseDto` exactly. Note there is no
 * `ownerId`/`owner` field on the backend DTO — ownership is only knowable
 * via a tenant's memberships (the membership with role `OWNER`), which
 * would require an extra fetch per tenant to display in a list. The admin
 * tenant table therefore does not show an "Owner" column (see
 * `tenancy` README for the full deviation note).
 */
export interface Tenant {
  id: string;
  appId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
