import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { AdminInvitesScreen } from '@/core/tenancy/presentation/screens/admin-invites/admin-invites.screen';

export default async function AdminInvitesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return <AdminInvitesScreen dict={dict.tenancy} />;
}
