import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAppUseCase } from '@/core/app/application/use-cases/create-app/create-app.use-case';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';
import { CreateAppInput } from '@/core/app/application/interfaces/create-app-input.interface';
import { appsQueryKey } from '@/core/app/presentation/hooks/use-apps/useApps.hook';

const createAppUseCase = new CreateAppUseCase(appGqlRepository);

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppInput) => createAppUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appsQueryKey });
    },
  });
}
