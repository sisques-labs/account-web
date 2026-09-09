import { useSuspenseQuery } from '@tanstack/react-query';
import { ListTenantsByAppUseCase } from '@/core/tenancy/application/use-cases/list-tenants-by-app/list-tenants-by-app.use-case';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';

const listTenantsByAppUseCase = new ListTenantsByAppUseCase(tenancyGqlRepository);

export const tenantsByAppQueryKey = (appId: string) => ['tenancy', 'tenants', appId] as const;

/**
 * Suspends while tenants are loading and throws to the nearest error
 * boundary on failure. Requires a resolved `appId` — see
 * AdminAppDetailBody, which only mounts (and so only calls this hook)
 * once its parent has confirmed the app exists.
 */
export function useTenantsByApp(appId: string) {
  return useSuspenseQuery({
    queryKey: tenantsByAppQueryKey(appId),
    queryFn: () => listTenantsByAppUseCase.execute({ appId }),
  });
}
