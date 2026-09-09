import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginUseCase } from '@/core/auth/application/use-cases/login/login.use-case';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { getSafeRedirectPath } from '@/shared/lib/safe-redirect';
import { getSafeExternalRedirectUrl } from '@/shared/lib/safe-external-redirect';
import { getAxiosErrorMessage } from '@/shared/lib/get-axios-error-message';
import { TRUSTED_REDIRECT_ORIGINS } from '@/shared/config/env';

const loginUseCase = new LoginUseCase(authRestRepository);

type LoginDict = WidenStringLiterals<AuthDict>;

function getErrorMessage(error: unknown, dict: LoginDict): string | null {
  return getAxiosErrorMessage(error, { 401: dict.login.errors.invalidCredentials }, dict.login.errors.generic);
}

/**
 * On a successful login, resolves the post-login redirect destination by
 * trying, in order: (1) an internal same-origin relative path (e.g. sent
 * here by useAdminGuard when an unauthenticated visitor hits /admin/*) via
 * `getSafeRedirectPath`, navigated with `router.push`; (2) an allowlisted
 * external origin (a consumer app on another `sisqueslabs.com` origin,
 * matched exactly — never a subdomain) via `getSafeExternalRedirectUrl`,
 * navigated with `window.location.assign` because a cross-origin SSO
 * handoff must be a full document load, not a soft client-side transition;
 * (3) the current locale's home route as fallback via `router.push`. The
 * first successful step wins — neither validator can turn the query string
 * into an open redirect, since both reject anything outside their exact
 * contract.
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
        const redirectTo = searchParams.get('redirectTo');

        const internalPath = getSafeRedirectPath(redirectTo);
        if (internalPath) {
          router.push(internalPath);
          return;
        }

        const externalUrl = getSafeExternalRedirectUrl(redirectTo, TRUSTED_REDIRECT_ORIGINS);
        if (externalUrl) {
          window.location.assign(externalUrl);
          return;
        }

        router.push(`/${lang}`);
      },
    });
  };

  return { ...mutation, errorMessage: getErrorMessage(mutation.error, dict), submit };
}
