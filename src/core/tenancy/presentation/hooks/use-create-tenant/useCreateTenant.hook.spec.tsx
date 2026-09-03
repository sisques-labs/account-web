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

import { useCreateTenant } from './useCreateTenant.hook';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import { tenantsByAppQueryKey } from '@/core/tenancy/presentation/hooks/use-tenants-by-app/useTenantsByApp.hook';

describe('useCreateTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a tenant and invalidates the tenants-by-app query', async () => {
    vi.mocked(tenancyGqlRepository.createTenant).mockResolvedValue({ id: 'tenant-1' });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    function wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const { result } = renderHook(() => useCreateTenant('app-1'), { wrapper });
    result.current.mutate({ appId: 'app-1', name: 'Casa de Marta' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: tenantsByAppQueryKey('app-1') });
  });
});
