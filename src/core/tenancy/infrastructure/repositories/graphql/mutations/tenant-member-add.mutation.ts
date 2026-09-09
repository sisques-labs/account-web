import { gql } from '@apollo/client';

/**
 * Matches `account-api`'s `tenantMemberAdd` mutation. Input takes `email`
 * (not `userId`) — the backend resolves the target user id server-side.
 * Returns a lightweight ack; the resolver only forwards the new
 * membership's id (not the resolved `userId`), so this repository invalidates
 * and refetches the members list on success instead of reading richer data
 * off the mutation response.
 */
export const TENANT_MEMBER_ADD = gql`
  mutation TenantMemberAdd($input: TenantAddMemberRequestDto!) {
    tenantMemberAdd(input: $input) {
      success
      message
      id
    }
  }
`;
