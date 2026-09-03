import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { LoginUseCase } from '@/core/auth/application/use-cases/login/login.use-case';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

const loginUseCase = new LoginUseCase(authRestRepository);

type LoginDict = WidenStringLiterals<AuthDict>;

function getErrorMessage(error: unknown, dict: LoginDict): string | null {
  if (!error) return null;
  if (isAxiosError(error) && error.response?.status === 401) {
    return dict.login.errors.invalidCredentials;
  }
  return dict.login.errors.generic;
}

export function useLogin(dict: LoginDict) {
  const mutation = useMutation({
    mutationFn: (input: LoginInput) => loginUseCase.execute(input),
  });

  return { ...mutation, errorMessage: getErrorMessage(mutation.error, dict) };
}
