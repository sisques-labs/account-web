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

import { useAddTenantMember } from './useAddTenantMember.hook';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import { tenantMembersQueryKey } from '@/core/tenancy/presentation/hooks/use-tenant-members/useTenantMembers.hook';
import { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';

describe('useAddTenantMember', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a member and invalidates the tenant-members query', async () => {
    vi.mocked(tenancyGqlRepository.addTenantMember).mockResolvedValue({ id: 'membership-1' });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    function wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const { result } = renderHook(() => useAddTenantMember('t1'), { wrapper });
    result.current.mutate({ tenantId: 't1', email: 'jane@example.com', role: TenantRole.MEMBER });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: tenantMembersQueryKey('t1') });
  });
});
