import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/shared/presentation/i18n/locale';

/**
 * Resolves the current locale from the URL path segment. For a route
 * segment file that Next.js doesn't pass `params` to (e.g. `error.tsx`,
 * which only receives `{ error, reset }`), this is the only way to know
 * which locale's dictionary to render.
 */
export function useLocale(): Locale {
  const pathname = usePathname();
  const segment = pathname?.split('/')[1] ?? '';
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}
