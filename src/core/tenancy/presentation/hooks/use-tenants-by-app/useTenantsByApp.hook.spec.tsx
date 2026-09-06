import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';

vi.mock('@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository', () => ({
  tenancyGqlRepository: {
    listApps: vi.fn(),
    listTenantsByApp: vi.fn(),
    listTenantMembers: vi.fn(),
    createTenant: vi.fn(),
    addTenantMember: vi.fn(),
  },
}));

import { useTenantsByApp } from './useTenantsByApp.hook';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';

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

describe('useTenantsByApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches tenants for the given appId', async () => {
    const result = { items: [], total: 0, page: 1, perPage: 50, totalPages: 0 };
    vi.mocked(tenancyGqlRepository.listTenantsByApp).mockResolvedValue(result);

    const { result: hookResult } = renderHook(() => useTenantsByApp('app-1'), { wrapper });

    await waitFor(() => expect(hookResult.current.isSuccess).toBe(true));
    expect(tenancyGqlRepository.listTenantsByApp).toHaveBeenCalledWith('app-1', undefined);
  });

  it('throws to the nearest error boundary when the query fails', async () => {
    vi.mocked(tenancyGqlRepository.listTenantsByApp).mockRejectedValue(new Error('boom'));

    renderHook(() => useTenantsByApp('app-1'), { wrapper });

    expect(await screen.findByText('error boundary: boom')).toBeInTheDocument();
  });
});
