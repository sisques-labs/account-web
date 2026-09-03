import type { App } from '@/core/app/domain/interfaces/app.interface';
import type { CreateAppInput } from '@/core/app/application/interfaces/create-app-input.interface';
import type { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';
import type { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export interface Pagination {
  page: number;
  perPage: number;
}

export interface IAppRepository {
  listApps(pagination?: Pagination): Promise<PaginatedResult<App>>;
  createApp(input: CreateAppInput): Promise<CreatedEntity>;
}
