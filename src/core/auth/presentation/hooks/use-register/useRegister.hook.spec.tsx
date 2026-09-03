import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('@/core/auth/infrastructure/repositories/rest/auth.rest.repository', () => ({
  authRestRepository: { register: vi.fn(), login: vi.fn() },
}));

import { AxiosError, AxiosHeaders } from 'axios';
import { useRegister } from './useRegister.hook';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import enDict from '@/core/auth/presentation/i18n/en';

function make409Error(): AxiosError {
  return new AxiosError(
    'Conflict',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders() },
    {},
    { status: 409, statusText: 'Conflict', headers: {}, config: { headers: new AxiosHeaders() }, data: {} },
  );
}

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

    const { result } = renderHook(() => useRegister(enDict), { wrapper });
    expect(result.current.isPending).toBe(false);
    expect(result.current.errorMessage).toBeNull();

    const input = { email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!', displayName: 'Jane' };
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(authRestRepository.register).toHaveBeenCalledWith(input);
  });

  it('surfaces isError and error on a rejected mutation', async () => {
    vi.mocked(authRestRepository.register).mockRejectedValue(new Error('email already registered'));

    const { result } = renderHook(() => useRegister(enDict), { wrapper });
    result.current.mutate({ email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('email already registered'));
  });

  it('derives the email-already-registered message from a 409 error', async () => {
    vi.mocked(authRestRepository.register).mockRejectedValue(make409Error());

    const { result } = renderHook(() => useRegister(enDict), { wrapper });
    result.current.mutate({ email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!' });

    await waitFor(() =>
      expect(result.current.errorMessage).toBe(enDict.register.errors.emailAlreadyRegistered),
    );
  });

  it('derives a generic message from a non-409 error', async () => {
    vi.mocked(authRestRepository.register).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useRegister(enDict), { wrapper });
    result.current.mutate({ email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!' });

    await waitFor(() => expect(result.current.errorMessage).toBe(enDict.register.errors.generic));
  });
});
