import { useMutation } from '@tanstack/react-query';
import { RegisterUseCase } from '@/core/auth/application/use-cases/register/register.use-case';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { RegisterInput } from '@/core/auth/domain/interfaces/register-input.interface';

const registerUseCase = new RegisterUseCase(authRestRepository);

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => registerUseCase.execute(input),
  });
}
