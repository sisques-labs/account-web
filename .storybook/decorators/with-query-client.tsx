import type { Decorator } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Seeds a fresh QueryClient with fixture data so the real TanStack Query hooks
 * resolve from cache instead of hitting the network. One QueryClient per story
 * (never the app singleton) to avoid state leaking between stories.
 */
export function withQueryClient(seed?: (queryClient: QueryClient) => void): Decorator {
  function QueryClientDecorator(Story: Parameters<Decorator>[0]) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity, gcTime: Infinity } },
    });
    seed?.(queryClient);

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  }
  return QueryClientDecorator;
}
