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

import { useCreateTenantDialog } from './useCreateTenantDialog.hook';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCreateTenantDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resets the form and closes the dialog on a successful submit', async () => {
    vi.mocked(tenancyGqlRepository.createTenant).mockResolvedValue({ id: 'tenant-1' });
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateTenantDialog({ appId: 'app-1', onOpenChange, reset }), {
      wrapper,
    });
    result.current.submit('Casa de Marta');

    await waitFor(() =>
      expect(tenancyGqlRepository.createTenant).toHaveBeenCalledWith({
        appId: 'app-1',
        name: 'Casa de Marta',
      }),
    );
    await waitFor(() => expect(reset).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not reset the form or close the dialog when the mutation fails', async () => {
    vi.mocked(tenancyGqlRepository.createTenant).mockRejectedValue(new Error('boom'));
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateTenantDialog({ appId: 'app-1', onOpenChange, reset }), {
      wrapper,
    });
    result.current.submit('Casa de Marta');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(reset).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('resets the form when the dialog is closed manually without submitting', () => {
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateTenantDialog({ appId: 'app-1', onOpenChange, reset }), {
      wrapper,
    });
    result.current.onOpenChange(false);

    expect(reset).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not reset the form when the dialog is opened', () => {
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateTenantDialog({ appId: 'app-1', onOpenChange, reset }), {
      wrapper,
    });
    result.current.onOpenChange(true);

    expect(reset).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
