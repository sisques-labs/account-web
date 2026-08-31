import { redirect } from 'next/navigation';
import { isLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/shared/presentation/i18n/locale';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) redirect(`/${DEFAULT_LOCALE}`);

  return children;
}
