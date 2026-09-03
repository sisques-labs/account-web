import { gql } from '@apollo/client';

/**
 * Matches `account-api`'s `tenantCreate` mutation. Returns a lightweight
 * ack (`MutationResponseDto`), not the full entity — the caller is always
 * assigned as the tenant's `OWNER` server-side, there is no `ownerId` input.
 */
export const TENANT_CREATE = gql`
  mutation TenantCreate($input: TenantCreateRequestDto!) {
    tenantCreate(input: $input) {
      success
      message
      id
    }
  }
`;
