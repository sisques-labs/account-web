import type { ITenancyRepository, Pagination } from '@/core/tenancy/application/ports/tenancy.repository.port';
import type { App } from '@/core/tenancy/domain/interfaces/app.interface';
import type { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';

export class ListAppsUseCase {
  constructor(private readonly repository: ITenancyRepository) {}

  async execute(pagination?: Pagination): Promise<PaginatedResult<App>> {
    return this.repository.listApps(pagination);
  }
}
