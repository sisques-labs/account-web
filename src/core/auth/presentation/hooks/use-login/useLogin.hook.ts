import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { LoginUseCase } from '@/core/auth/application/use-cases/login/login.use-case';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { getSafeRedirectPath } from '@/shared/lib/safe-redirect';

const loginUseCase = new LoginUseCase(authRestRepository);

type LoginDict = WidenStringLiterals<AuthDict>;

function getErrorMessage(error: unknown, dict: LoginDict): string | null {
  if (!error) return null;
  if (isAxiosError(error) && error.response?.status === 401) {
    return dict.login.errors.invalidCredentials;
  }
  return dict.login.errors.generic;
}

/**
 * On a successful login, honors a same-origin `?redirectTo=` (e.g. sent
 * here by useAdminGuard when an unauthenticated visitor hits /admin/*) so
 * the visitor lands back where they were headed instead of always on the
 * locale home. getSafeRedirectPath rejects anything that isn't a
 * same-origin relative path, so this can't become an open redirect via the
 * query string.
 */
export function useLogin(dict: LoginDict, lang: Locale) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mutation = useMutation({
    mutationFn: (input: LoginInput) => loginUseCase.execute(input),
  });

  const submit = (input: LoginInput) => {
    mutation.mutate(input, {
      onSuccess: () => {
        const redirectTo = getSafeRedirectPath(searchParams.get('redirectTo'));
        router.push(redirectTo ?? `/${lang}`);
      },
    });
  };

  return { ...mutation, errorMessage: getErrorMessage(mutation.error, dict), submit };
}
