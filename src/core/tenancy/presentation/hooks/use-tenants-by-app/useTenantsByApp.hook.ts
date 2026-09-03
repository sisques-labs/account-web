import { useQuery } from '@tanstack/react-query';
import { ListTenantsByAppUseCase } from '@/core/tenancy/application/use-cases/list-tenants-by-app/list-tenants-by-app.use-case';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';

const listTenantsByAppUseCase = new ListTenantsByAppUseCase(tenancyGqlRepository);

export const tenantsByAppQueryKey = (appId: string) => ['tenancy', 'tenants', appId] as const;

export function useTenantsByApp(appId: string) {
  return useQuery({
    queryKey: tenantsByAppQueryKey(appId),
    queryFn: () => listTenantsByAppUseCase.execute({ appId }),
    enabled: Boolean(appId),
  });
}
