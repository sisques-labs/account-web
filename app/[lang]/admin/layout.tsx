import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';
import { AdminShell } from '@/core/tenancy/presentation/components/admin-shell/admin-shell';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang as Locale);

  return (
    <AdminShell lang={lang as Locale} dict={dict.tenancy}>
      {children}
    </AdminShell>
  );
}
