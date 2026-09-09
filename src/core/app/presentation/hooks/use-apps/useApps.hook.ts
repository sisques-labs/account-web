import { useSuspenseQuery } from '@tanstack/react-query';
import { ListAppsUseCase } from '@/core/app/application/use-cases/list-apps/list-apps.use-case';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';

const listAppsUseCase = new ListAppsUseCase(appGqlRepository);

export const appsQueryKey = ['app', 'apps'] as const;

/**
 * Suspends while apps are loading and throws to the nearest error boundary
 * on failure — AdminAppsScreen renders only the success case, and
 * app/[lang]/admin/apps/page.tsx supplies the <Suspense> fallback
 * (AdminAppsSkeleton) plus app/[lang]/admin/error.tsx catches the throw.
 */
export function useApps() {
  return useSuspenseQuery({
    queryKey: appsQueryKey,
    queryFn: () => listAppsUseCase.execute(),
  });
}
