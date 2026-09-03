import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('@/core/auth/infrastructure/repositories/rest/auth.rest.repository', () => ({
  authRestRepository: { register: vi.fn(), login: vi.fn() },
}));
vi.mock('@/shared/infrastructure/store/session.store', () => ({
  useSessionStore: { getState: vi.fn() },
}));

import { useLogin } from './useLogin.hook';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSessionStore.getState).mockReturnValue({
      accessToken: null,
      setAccessToken: vi.fn(),
      clearAccessToken: vi.fn(),
      redirectToLogin: vi.fn(),
    });
  });

  it('calls the repository with the submitted input and reports success', async () => {
    vi.mocked(authRestRepository.login).mockResolvedValue({ accessToken: 'access-tok' });

    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.isPending).toBe(false);

    const input = { email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!' };
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(authRestRepository.login).toHaveBeenCalledWith(input);
  });

  it('surfaces isError and error on a rejected mutation', async () => {
    vi.mocked(authRestRepository.login).mockRejectedValue(new Error('invalid credentials'));

    const { result } = renderHook(() => useLogin(), { wrapper });
    result.current.mutate({ email: 'jane@example.com', password: 'wrong' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('invalid credentials'));
  });
});
