import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
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

  it('is disabled when appId is empty', () => {
    const { result: hookResult } = renderHook(() => useTenantsByApp(''), { wrapper });

    expect(hookResult.current.fetchStatus).toBe('idle');
    expect(tenancyGqlRepository.listTenantsByApp).not.toHaveBeenCalled();
  });
});
