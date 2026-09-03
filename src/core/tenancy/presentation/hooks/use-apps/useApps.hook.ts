import { useQuery } from '@tanstack/react-query';
import { ListAppsUseCase } from '@/core/tenancy/application/use-cases/list-apps/list-apps.use-case';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';

const listAppsUseCase = new ListAppsUseCase(tenancyGqlRepository);

export const appsQueryKey = ['tenancy', 'apps'] as const;

export function useApps() {
  return useQuery({
    queryKey: appsQueryKey,
    queryFn: () => listAppsUseCase.execute(),
  });
}
