import { gql } from '@apollo/client';

/** Matches `account-api`'s `tenantMembershipsFindByTenantId` query. */
export const TENANT_MEMBERSHIPS_FIND_BY_TENANT_ID = gql`
  query TenantMembershipsFindByTenantId($input: TenantMembershipFindByTenantIdRequestDto!) {
    tenantMembershipsFindByTenantId(input: $input) {
      id
      tenantId
      userId
      role
      createdAt
      updatedAt
    }
  }
`;
