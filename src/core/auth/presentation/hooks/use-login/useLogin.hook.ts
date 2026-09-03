import { useMutation } from '@tanstack/react-query';
import { LoginUseCase } from '@/core/auth/application/use-cases/login/login.use-case';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';

const loginUseCase = new LoginUseCase(authRestRepository);

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => loginUseCase.execute(input),
  });
}
