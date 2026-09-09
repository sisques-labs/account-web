import { apolloClient } from '@/shared/infrastructure/http/apollo.client';
import { IAppRepository, Pagination } from '@/core/app/application/ports/app.repository.port';
import { App } from '@/core/app/domain/interfaces/app.interface';
import { CreateAppInput } from '@/core/app/application/interfaces/create-app-input.interface';
import { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';
import { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';
import { APPS_FIND_BY_CRITERIA } from './queries/apps-find-by-criteria.query';
import { APP_CREATE } from './mutations/app-create.mutation';

const DEFAULT_PAGINATION: Pagination = { page: 1, perPage: 50 };

interface AppsFindByCriteriaResult {
  appsFindByCriteria: PaginatedResult<App>;
}

interface MutationAck {
  success: boolean;
  message?: string;
  id?: string;
}

export class AppGqlRepository implements IAppRepository {
  async listApps(pagination: Pagination = DEFAULT_PAGINATION): Promise<PaginatedResult<App>> {
    const { data } = await apolloClient.query<AppsFindByCriteriaResult>({
      query: APPS_FIND_BY_CRITERIA,
      variables: { input: { pagination } },
      fetchPolicy: 'network-only',
    });
    return data!.appsFindByCriteria;
  }

  async createApp(input: CreateAppInput): Promise<CreatedEntity> {
    const { data } = await apolloClient.mutate<{ appCreate: MutationAck }>({
      mutation: APP_CREATE,
      variables: { input },
    });
    return { id: data?.appCreate.id ?? '' };
  }
}

export const appGqlRepository = new AppGqlRepository();
