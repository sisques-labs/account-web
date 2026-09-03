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

import { useTenantMembers } from './useTenantMembers.hook';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useTenantMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches members for the given tenantId', async () => {
    vi.mocked(tenancyGqlRepository.listTenantMembers).mockResolvedValue([]);

    const { result } = renderHook(() => useTenantMembers('t1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(tenancyGqlRepository.listTenantMembers).toHaveBeenCalledWith('t1');
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useTenantMembers('t1', false), { wrapper });

    expect(result.current.fetchStatus).toBe('idle');
    expect(tenancyGqlRepository.listTenantMembers).not.toHaveBeenCalled();
  });
});
