'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { registerSchema, type RegisterSchema } from '@/core/auth/presentation/schemas/register.schema';
import { useRegister } from '@/core/auth/presentation/hooks/use-register/useRegister.hook';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { Input } from '@/shared/presentation/components/ui/input/input';
import { PasswordInput } from '@/shared/presentation/components/ui/password-input/password-input';
import { FormField } from '@/shared/presentation/components/ui/form-field/form-field';
import { Alert } from '@/shared/presentation/components/ui/alert/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/presentation/components/ui/card/card';

export interface RegisterScreenProps {
  dict: AuthDict;
  lang: Locale;
}

export function RegisterScreen({ dict, lang }: RegisterScreenProps) {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(
      { ...data, displayName: data.displayName || undefined },
      { onSuccess: () => router.push(`/${lang}/login`) },
    );
  });

  const errorMessage = getRegisterErrorMessage(registerMutation.error, dict);

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{dict.register.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{dict.register.description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {errorMessage && <Alert variant="error" message={errorMessage} />}

          <FormField
            label={dict.register.email.label}
            error={errors.email && dict.validation.emailInvalid}
          >
            <Input
              type="email"
              placeholder={dict.register.email.placeholder}
              {...register('email')}
            />
          </FormField>

          <FormField
            label={dict.register.password.label}
            error={errors.password && dict.validation.passwordTooShort}
          >
            <PasswordInput
              placeholder={dict.register.password.placeholder}
              {...register('password')}
            />
          </FormField>

          <FormField label={dict.register.displayName.label} error={errors.displayName?.message}>
            <Input
              placeholder={dict.register.displayName.placeholder}
              {...register('displayName')}
            />
          </FormField>

          <Button type="submit" loading={registerMutation.isPending}>
            {registerMutation.isPending ? dict.register.submitting : dict.register.submit}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href={`/${lang}/login`} className="underline underline-offset-4">
            {dict.register.loginLink}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function getRegisterErrorMessage(error: unknown, dict: AuthDict): string | null {
  if (!error) return null;
  if (isAxiosError(error) && error.response?.status === 409) {
    return dict.register.errors.emailAlreadyRegistered;
  }
  return dict.register.errors.generic;
}
