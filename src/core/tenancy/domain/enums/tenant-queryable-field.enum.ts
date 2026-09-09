/**
 * Mirrors `account-api`'s `TenantQueryableField` GraphQL enum — the
 * whitelist of fields `tenantsFindByCriteria` accepts in `filters`/`sorts`.
 * Only `APP_ID` is used by this context today (filtering tenants by app on
 * the admin app-detail screen).
 */
export enum TenantQueryableField {
  ID = 'ID',
  APP_ID = 'APP_ID',
  NAME = 'NAME',
  SLUG = 'SLUG',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}
