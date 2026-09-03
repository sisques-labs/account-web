import type { ITenancyRepository, Pagination } from '@/core/tenancy/application/ports/tenancy.repository.port';
import type { Tenant } from '@/core/tenancy/domain/interfaces/tenant.interface';
import type { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';

export interface ListTenantsByAppInput {
  appId: string;
  pagination?: Pagination;
}

export class ListTenantsByAppUseCase {
  constructor(private readonly repository: ITenancyRepository) {}

  async execute(input: ListTenantsByAppInput): Promise<PaginatedResult<Tenant>> {
    return this.repository.listTenantsByApp(input.appId, input.pagination);
  }
}
