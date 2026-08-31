'use client';

import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/shared/infrastructure/http/apollo.client';

export function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
