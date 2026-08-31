'use client';

import { ApolloClientProvider } from './apollo.provider';
import { ReactQueryProvider } from './query.provider';

// No bounded context exists yet. Once you add one, give it its own
// presentation/providers/{context}.providers.tsx and nest it here, e.g.:
// import { AuthProviders } from '@/core/auth/presentation/providers/auth.providers';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloClientProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ApolloClientProvider>
  );
}
