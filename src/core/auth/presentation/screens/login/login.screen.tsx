'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@/core/auth/presentation/schemas/login.schema';
import { useLogin } from '@/core/auth/presentation/hooks/use-login/useLogin.hook';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';
import type { Locale } from '@/shared/presentation/i18n/locale';

type LoginDict = WidenStringLiterals<AuthDict>;
import { Button } from '@/shared/presentation/components/ui/button/button';
import { Input } from '@/shared/presentation/components/ui/input/input';
import { PasswordInput } from '@/shared/presentation/components/ui/password-input/password-input';
import { FormField } from '@/shared/presentation/components/ui/form-field/form-field';
import { Alert } from '@/shared/presentation/components/ui/alert/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/presentation/components/ui/card/card';
import { Logomark } from '@/shared/presentation/components/ui/logomark/logomark';

export interface LoginScreenProps {
  dict: LoginDict;
  lang: Locale;
}

export function LoginScreen({ dict, lang }: LoginScreenProps) {
  const loginMutation = useLogin(dict, lang);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((data) => {
    loginMutation.submit(data);
  });

  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col gap-6">
      <div className="flex items-center justify-center gap-2.5">
        <Logomark size={36} />
        <div className="text-base font-bold text-[var(--ink)]">
          Sisqués Labs <span className="font-medium text-[var(--ink-2)]">Platform</span>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{dict.login.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{dict.login.description}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            {loginMutation.errorMessage && <Alert variant="error" message={loginMutation.errorMessage} />}

            <FormField
              label={dict.login.email.label}
              error={errors.email && dict.validation.emailInvalid}
            >
              <Input type="email" placeholder={dict.login.email.placeholder} {...register('email')} />
            </FormField>

            <FormField
              label={dict.login.password.label}
              error={errors.password && dict.validation.passwordRequired}
            >
              <PasswordInput placeholder={dict.login.password.placeholder} {...register('password')} />
            </FormField>

            <div className="-mt-2 flex justify-end">
              <Link href={`/${lang}/forgot-password`} className="text-sm underline underline-offset-4">
                {dict.login.forgotPasswordLink}
              </Link>
            </div>

            <Button type="submit" loading={loginMutation.isPending}>
              {loginMutation.isPending ? dict.login.submitting : dict.login.submit}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link href={`/${lang}/register`} className="underline underline-offset-4">
              {dict.login.registerLink}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
