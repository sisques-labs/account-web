import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { RegisterUseCase } from '@/core/auth/application/use-cases/register/register.use-case';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { RegisterInput } from '@/core/auth/domain/interfaces/register-input.interface';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

const registerUseCase = new RegisterUseCase(authRestRepository);

type RegisterDict = WidenStringLiterals<AuthDict>;

function getErrorMessage(error: unknown, dict: RegisterDict): string | null {
  if (!error) return null;
  if (isAxiosError(error) && error.response?.status === 409) {
    return dict.register.errors.emailAlreadyRegistered;
  }
  return dict.register.errors.generic;
}

export function useRegister(dict: RegisterDict) {
  const mutation = useMutation({
    mutationFn: (input: RegisterInput) => registerUseCase.execute(input),
  });

  return { ...mutation, errorMessage: getErrorMessage(mutation.error, dict) };
}
