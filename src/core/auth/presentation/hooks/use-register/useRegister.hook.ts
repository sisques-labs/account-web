import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { RegisterUseCase } from '@/core/auth/application/use-cases/register/register.use-case';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { RegisterInput } from '@/core/auth/domain/interfaces/register-input.interface';
import type { RegisterSchema } from '@/core/auth/presentation/schemas/register.schema';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message';

const registerUseCase = new RegisterUseCase(authRestRepository);

type RegisterDict = WidenStringLiterals<AuthDict>;

function getErrorMessage(error: unknown, dict: RegisterDict): string | null {
  return getAxiosErrorMessage(
    error,
    { 409: dict.register.errors.emailAlreadyRegistered },
    dict.register.errors.generic,
  );
}

export function useRegister(dict: RegisterDict, lang: Locale) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (input: RegisterInput) => registerUseCase.execute(input),
  });

  // A blank display name submits '' (not undefined) from the form; treat it
  // the same as not provided so the backend doesn't store an empty string.
  const submit = (data: RegisterSchema) => {
    mutation.mutate(
      { ...data, displayName: data.displayName || undefined },
      { onSuccess: () => router.push(`/${lang}/login`) },
    );
  };

  return { ...mutation, errorMessage: getErrorMessage(mutation.error, dict), submit };
}
