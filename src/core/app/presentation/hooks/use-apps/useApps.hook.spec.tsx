import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';

vi.mock('@/core/app/infrastructure/repositories/graphql/app.gql.repository', () => ({
  appGqlRepository: {
    listApps: vi.fn(),
    createApp: vi.fn(),
  },
}));

import { useApps } from './useApps.hook';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';

// useSuspenseQuery suspends instead of exposing isLoading, and throws
// instead of exposing isError — a Suspense boundary and an error boundary
// stand in for AdminAppsScreen's real fallback (AdminAppsSkeleton) and
// error boundary (app/[lang]/admin/error.tsx) for this hook-only test.
class TestErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) return <div>error boundary: {this.state.error.message}</div>;
    return this.props.children;
  }
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <TestErrorBoundary>
        <Suspense fallback={<div>loading</div>}>{children}</Suspense>
      </TestErrorBoundary>
    </QueryClientProvider>
  );
}

describe('useApps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches apps via the repository', async () => {
    const result = {
      items: [{ id: 'a1', slug: 'app-1', name: 'App 1', createdAt: '', updatedAt: '' }],
      total: 1,
      page: 1,
      perPage: 50,
      totalPages: 1,
    };
    vi.mocked(appGqlRepository.listApps).mockResolvedValue(result);

    const { result: hookResult } = renderHook(() => useApps(), { wrapper });

    await waitFor(() => expect(hookResult.current.isSuccess).toBe(true));
    expect(hookResult.current.data).toEqual(result);
  });

  it('throws to the nearest error boundary when the query fails', async () => {
    vi.mocked(appGqlRepository.listApps).mockRejectedValue(new Error('boom'));

    renderHook(() => useApps(), { wrapper });

    expect(await screen.findByText('error boundary: boom')).toBeInTheDocument();
  });
});
