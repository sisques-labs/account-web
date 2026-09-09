import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { AdminUsersScreen } from '@/core/tenancy/presentation/screens/admin-users/admin-users.screen';

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return <AdminUsersScreen dict={dict.tenancy} />;
}
