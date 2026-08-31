import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import type { Locale } from '@/shared/presentation/i18n/locale';

export default async function LangHomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-16 text-center">
      <h1 className="text-3xl font-semibold">{dict.shell.welcome.title}</h1>
      <p className="max-w-md text-muted-foreground">{dict.shell.welcome.description}</p>
    </main>
  );
}
