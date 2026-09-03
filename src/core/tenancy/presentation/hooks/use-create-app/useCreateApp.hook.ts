import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAppUseCase } from '@/core/tenancy/application/use-cases/create-app/create-app.use-case';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import { CreateAppInput } from '@/core/tenancy/application/interfaces/create-app-input.interface';
import { appsQueryKey } from '@/core/tenancy/presentation/hooks/use-apps/useApps.hook';

const createAppUseCase = new CreateAppUseCase(tenancyGqlRepository);

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppInput) => createAppUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appsQueryKey });
    },
  });
}
