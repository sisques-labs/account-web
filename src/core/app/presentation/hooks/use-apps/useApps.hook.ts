import { useQuery } from '@tanstack/react-query';
import { ListAppsUseCase } from '@/core/app/application/use-cases/list-apps/list-apps.use-case';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';

const listAppsUseCase = new ListAppsUseCase(appGqlRepository);

export const appsQueryKey = ['app', 'apps'] as const;

export function useApps() {
  return useQuery({
    queryKey: appsQueryKey,
    queryFn: () => listAppsUseCase.execute(),
  });
}
