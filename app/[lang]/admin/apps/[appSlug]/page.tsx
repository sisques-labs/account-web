import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { AdminAppDetailScreen } from '@/core/tenancy/presentation/screens/admin-app-detail/admin-app-detail.screen';

export default async function AdminAppDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; appSlug: string }>;
}) {
  const { lang, appSlug } = await params;
  const dict = getDictionary(lang);

  return <AdminAppDetailScreen dict={dict.tenancy} appSlug={appSlug} />;
}
