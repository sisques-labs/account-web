import { Suspense } from 'react';
import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { AdminAppsScreen } from '@/core/tenancy/presentation/screens/admin-apps/admin-apps.screen';
import { AdminAppsSkeleton } from '@/core/tenancy/presentation/components/admin-apps-skeleton/admin-apps-skeleton';

export default async function AdminAppsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <Suspense fallback={<AdminAppsSkeleton />}>
      <AdminAppsScreen dict={dict.app} lang={lang} />
    </Suspense>
  );
}
