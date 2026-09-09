import type { Tenant } from '@/core/tenancy/domain/interfaces/tenant.interface';
import type { TenantMembership } from '@/core/tenancy/domain/interfaces/tenant-membership.interface';
import type { CreateTenantInput } from '@/core/tenancy/application/interfaces/create-tenant-input.interface';
import type { AddTenantMemberInput } from '@/core/tenancy/application/interfaces/add-tenant-member-input.interface';
import type { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';
import type { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export interface Pagination {
  page: number;
  perPage: number;
}

/**
 * Tenant/TenantMembership only — App lives in its own context, mirroring
 * `account-api`'s `app`/`tenancy` split (see `core/app/README.md`).
 */
export interface ITenancyRepository {
  listTenantsByApp(appId: string, pagination?: Pagination): Promise<PaginatedResult<Tenant>>;
  listTenantMembers(tenantId: string): Promise<TenantMembership[]>;
  createTenant(input: CreateTenantInput): Promise<CreatedEntity>;
  addTenantMember(input: AddTenantMemberInput): Promise<CreatedEntity>;
}
