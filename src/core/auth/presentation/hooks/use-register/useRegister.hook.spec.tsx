import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('@/core/auth/infrastructure/repositories/rest/auth.rest.repository', () => ({
  authRestRepository: { register: vi.fn(), login: vi.fn() },
}));

import { useRegister } from './useRegister.hook';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the repository with the submitted input and reports success', async () => {
    vi.mocked(authRestRepository.register).mockResolvedValue({ id: 'user-1' });

    const { result } = renderHook(() => useRegister(), { wrapper });
    expect(result.current.isPending).toBe(false);

    const input = { email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!', displayName: 'Jane' };
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(authRestRepository.register).toHaveBeenCalledWith(input);
  });

  it('surfaces isError and error on a rejected mutation', async () => {
    vi.mocked(authRestRepository.register).mockRejectedValue(new Error('email already registered'));

    const { result } = renderHook(() => useRegister(), { wrapper });
    result.current.mutate({ email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('email already registered'));
  });
});
