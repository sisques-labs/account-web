'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from '@/core/auth/presentation/schemas/forgot-password.schema';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { Input } from '@/shared/presentation/components/ui/input/input';
import { FormField } from '@/shared/presentation/components/ui/form-field/form-field';
import { Alert } from '@/shared/presentation/components/ui/alert/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/presentation/components/ui/card/card';
import { Logomark } from '@/shared/presentation/components/ui/logomark/logomark';

type ForgotPasswordDict = WidenStringLiterals<AuthDict>;

export interface ForgotPasswordScreenProps {
  dict: ForgotPasswordDict;
  lang: Locale;
}

function ForgotPasswordScreen({ dict, lang }: ForgotPasswordScreenProps) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) });

  // Per the platform architecture doc, password reset is delegated to
  // Keycloak and account-api does not expose a forgot-password endpoint
  // yet. This form deliberately makes NO network call — a valid submit
  // just reveals the "not available" notice below instead of pretending
  // to send an email.
  const onSubmit = handleSubmit(() => {
    setSubmitted(true);
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
          <CardTitle>{dict.forgotPassword.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{dict.forgotPassword.description}</p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <Alert variant="info" message={dict.forgotPassword.unavailable} />
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <FormField
                label={dict.forgotPassword.email.label}
                error={errors.email && dict.validation.emailInvalid}
              >
                <Input
                  type="email"
                  placeholder={dict.forgotPassword.email.placeholder}
                  {...register('email')}
                />
              </FormField>

              <Button type="submit">{dict.forgotPassword.submit}</Button>
            </form>
          )}

          <p className="mt-4 text-center text-sm">
            <Link href={`/${lang}/login`} className="underline underline-offset-4">
              {dict.forgotPassword.backToLoginLink}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

ForgotPasswordScreen.displayName = 'ForgotPasswordScreen';

export { ForgotPasswordScreen };
