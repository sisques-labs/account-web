'use client';

import { useEffect } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { getDictionary } from '@/shared/presentation/i18n/get-dictionary';
import { useLocale } from '@/shared/presentation/hooks/use-locale/useLocale.hook';

/**
 * Catches a suspended screen's rejected query (AdminAppsScreen,
 * AdminAppDetailScreen — both use useSuspenseQuery, which throws instead of
 * exposing isError) anywhere under /admin. Next.js route error boundaries
 * can't receive `params`, so the locale comes from the URL via useLocale
 * instead. Resetting a TanStack Query error boundary requires clearing the
 * query's own error state (see useQueryErrorResetBoundary docs) before
 * Next's `reset()` re-renders the segment, otherwise the same stale error
 * throws again immediately.
 */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = useLocale();
  const dict = getDictionary(lang).shell.error;
  const { reset: resetQueryError } = useQueryErrorResetBoundary();

  useEffect(() => {
    resetQueryError();
  }, [resetQueryError]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="headline text-xl">{dict.title}</h1>
      <p className="text-sm text-[var(--ink-3)]">{dict.description}</p>
      <Button onClick={reset}>{dict.retry}</Button>
    </div>
  );
}
