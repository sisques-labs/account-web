import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { ForgotPasswordScreen } from '@/core/auth/presentation/screens/forgot-password/forgot-password.screen';

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <ForgotPasswordScreen dict={dict.auth} lang={lang} />
    </main>
  );
}
