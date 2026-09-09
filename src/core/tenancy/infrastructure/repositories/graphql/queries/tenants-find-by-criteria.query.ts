import { gql } from '@apollo/client';

/**
 * Matches `account-api`'s `tenantsFindByCriteria` query (`tenancy` context).
 * Guarded server-side by `PlatformAdminGuard` — returns tenants across the
 * whole platform (not scoped to the caller's own memberships), filterable
 * by `appId`.
 */
export const TENANTS_FIND_BY_CRITERIA = gql`
  query TenantsFindByCriteria($input: TenantFindByCriteriaRequestDto) {
    tenantsFindByCriteria(input: $input) {
      items {
        id
        appId
        name
        slug
        createdAt
        updatedAt
      }
      total
      page
      perPage
      totalPages
    }
  }
`;
