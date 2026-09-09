import type { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';

/**
 * `account-api`'s `TenantAddMemberRequestDto` takes `email`, not `userId` —
 * the backend resolves the target user id server-side. This input mirrors
 * that exactly (the canvas's "select an existing user" dropdown assumed a
 * user-listing endpoint that doesn't exist — see the `tenancy` README).
 */
export interface AddTenantMemberInput {
  tenantId: string;
  email: string;
  role: TenantRole;
}
