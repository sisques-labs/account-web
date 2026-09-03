import type { App } from '@/core/tenancy/domain/interfaces/app.interface';
import type { Tenant } from '@/core/tenancy/domain/interfaces/tenant.interface';
import type { TenantMembership } from '@/core/tenancy/domain/interfaces/tenant-membership.interface';
import type { CreateAppInput } from '@/core/tenancy/application/interfaces/create-app-input.interface';
import type { CreateTenantInput } from '@/core/tenancy/application/interfaces/create-tenant-input.interface';
import type { AddTenantMemberInput } from '@/core/tenancy/application/interfaces/add-tenant-member-input.interface';
import type { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';
import type { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export interface Pagination {
  page: number;
  perPage: number;
}

export interface ITenancyRepository {
  listApps(pagination?: Pagination): Promise<PaginatedResult<App>>;
  createApp(input: CreateAppInput): Promise<CreatedEntity>;
  listTenantsByApp(appId: string, pagination?: Pagination): Promise<PaginatedResult<Tenant>>;
  listTenantMembers(tenantId: string): Promise<TenantMembership[]>;
  createTenant(input: CreateTenantInput): Promise<CreatedEntity>;
  addTenantMember(input: AddTenantMemberInput): Promise<CreatedEntity>;
}
