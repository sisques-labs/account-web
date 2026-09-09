import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTenantUseCase } from '@/core/tenancy/application/use-cases/create-tenant/create-tenant.use-case';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import { CreateTenantInput } from '@/core/tenancy/application/interfaces/create-tenant-input.interface';
import { tenantsByAppQueryKey } from '@/core/tenancy/presentation/hooks/use-tenants-by-app/useTenantsByApp.hook';

const createTenantUseCase = new CreateTenantUseCase(tenancyGqlRepository);

export function useCreateTenant(appId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => createTenantUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsByAppQueryKey(appId) });
    },
  });
}
