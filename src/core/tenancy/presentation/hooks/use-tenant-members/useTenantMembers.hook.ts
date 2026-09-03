import { useQuery } from '@tanstack/react-query';
import { ListTenantMembersUseCase } from '@/core/tenancy/application/use-cases/list-tenant-members/list-tenant-members.use-case';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';

const listTenantMembersUseCase = new ListTenantMembersUseCase(tenancyGqlRepository);

export const tenantMembersQueryKey = (tenantId: string) => ['tenancy', 'tenant-members', tenantId] as const;

export function useTenantMembers(tenantId: string, enabled = true) {
  return useQuery({
    queryKey: tenantMembersQueryKey(tenantId),
    queryFn: () => listTenantMembersUseCase.execute({ tenantId }),
    enabled: enabled && Boolean(tenantId),
  });
}
