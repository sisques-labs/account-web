import { Suspense } from 'react';
import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { AdminAppDetailScreen } from '@/core/tenancy/presentation/screens/admin-app-detail/admin-app-detail.screen';
import { AdminAppDetailSkeleton } from '@/core/tenancy/presentation/components/admin-app-detail-skeleton/admin-app-detail-skeleton';

export default async function AdminAppDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; appSlug: string }>;
}) {
  const { lang, appSlug } = await params;
  const dict = getDictionary(lang);

  return (
    <Suspense fallback={<AdminAppDetailSkeleton />}>
      <AdminAppDetailScreen dict={dict.tenancy} appSlug={appSlug} />
    </Suspense>
  );
}
