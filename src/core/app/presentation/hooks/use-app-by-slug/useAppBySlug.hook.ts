import { useApps } from '@/core/app/presentation/hooks/use-apps/useApps.hook';

/**
 * Derives the single `App` matching `slug` from the shared `useApps()`
 * cache — there is no `appFindBySlug` query on `account-api`, so this is a
 * client-side lookup rather than a second network call. Wrapping the `.find`
 * here (instead of inline in a screen) keeps the screen as pure JSX driven
 * by hook output; the underlying query's loading/error/success state is
 * passed through unchanged.
 */
export function useAppBySlug(slug: string) {
  const appsQuery = useApps();
  const app = appsQuery.data?.items.find((item) => item.slug === slug);

  return { ...appsQuery, app };
}
