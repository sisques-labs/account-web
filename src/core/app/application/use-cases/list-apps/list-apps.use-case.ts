import type { IAppRepository, Pagination } from '@/core/app/application/ports/app.repository.port';
import type { App } from '@/core/app/domain/interfaces/app.interface';
import type { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';

export class ListAppsUseCase {
  constructor(private readonly repository: IAppRepository) {}

  async execute(pagination?: Pagination): Promise<PaginatedResult<App>> {
    return this.repository.listApps(pagination);
  }
}
