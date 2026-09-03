import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { LoginScreen } from '@/core/auth/presentation/screens/login/login.screen';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <LoginScreen dict={dict.auth} lang={lang} />
    </main>
  );
}
