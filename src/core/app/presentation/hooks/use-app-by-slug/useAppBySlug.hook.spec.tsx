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

import { useAppBySlug } from './useAppBySlug.hook';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';

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

const APPS = {
  items: [
    { id: 'a1', slug: 'gardenia', name: 'Gardenia', createdAt: '', updatedAt: '' },
    { id: 'a2', slug: 'nexora', name: 'Nexora', createdAt: '', updatedAt: '' },
  ],
  total: 2,
  page: 1,
  perPage: 50,
  totalPages: 1,
};

describe('useAppBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves the app matching the given slug once the apps list loads', async () => {
    vi.mocked(appGqlRepository.listApps).mockResolvedValue(APPS);

    const { result } = renderHook(() => useAppBySlug('nexora'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.app).toEqual(APPS.items[1]);
  });

  it('resolves undefined when no app matches the slug', async () => {
    vi.mocked(appGqlRepository.listApps).mockResolvedValue(APPS);

    const { result } = renderHook(() => useAppBySlug('missing'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.app).toBeUndefined();
  });

  it('throws to the nearest error boundary when the underlying query fails', async () => {
    vi.mocked(appGqlRepository.listApps).mockRejectedValue(new Error('boom'));

    renderHook(() => useAppBySlug('gardenia'), { wrapper });

    expect(await screen.findByText('error boundary: boom')).toBeInTheDocument();
  });
});
