'use client';

import { ApolloClientProvider } from './apollo.provider';
import { ReactQueryProvider } from './query.provider';
import { useSessionBootstrap } from '@/shared/presentation/hooks/use-session-bootstrap/useSessionBootstrap.hook';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Silent session bootstrap on every app load — see useSessionBootstrap's
  // own docstring. Cross-cutting (not admin-specific), hence wired here
  // rather than in any one bounded context's provider.
  useSessionBootstrap();

  return (
    <ApolloClientProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ApolloClientProvider>
  );
}
