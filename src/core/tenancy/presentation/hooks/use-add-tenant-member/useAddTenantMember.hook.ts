import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddTenantMemberUseCase } from '@/core/tenancy/application/use-cases/add-tenant-member/add-tenant-member.use-case';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import { AddTenantMemberInput } from '@/core/tenancy/application/interfaces/add-tenant-member-input.interface';
import { tenantMembersQueryKey } from '@/core/tenancy/presentation/hooks/use-tenant-members/useTenantMembers.hook';

const addTenantMemberUseCase = new AddTenantMemberUseCase(tenancyGqlRepository);

export function useAddTenantMember(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddTenantMemberInput) => addTenantMemberUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantMembersQueryKey(tenantId) });
    },
  });
}
