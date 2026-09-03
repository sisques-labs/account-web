import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { AdminAppsScreen } from '@/core/tenancy/presentation/screens/admin-apps/admin-apps.screen';

export default async function AdminAppsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return <AdminAppsScreen dict={dict.tenancy} lang={lang} />;
}
