import type { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';

/**
 * Mirrors `account-api`'s `TenantMembershipResponseDto` exactly. Note there
 * is no user display name/email on this DTO — only `userId` — because the
 * backend does not resolve it. The members dialog displays the raw
 * `userId` rather than fabricating a name.
 */
export interface TenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  createdAt: string;
  updatedAt: string;
}
