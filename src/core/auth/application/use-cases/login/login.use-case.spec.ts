import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/infrastructure/store/session.store', () => ({
  useSessionStore: { getState: vi.fn() },
}));

import { LoginUseCase } from './login.use-case';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import type { IAuthRepository } from '@/core/auth/application/ports/auth.repository.port';
import type { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';

function makeRepository(overrides: Partial<IAuthRepository> = {}): IAuthRepository {
  return {
    register: vi.fn(),
    login: vi.fn(),
    ...overrides,
  };
}

describe('LoginUseCase', () => {
  const input: LoginInput = { email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores the access token on the shared session store and returns the result', async () => {
    const setAccessToken = vi.fn();
    vi.mocked(useSessionStore.getState).mockReturnValue({
      accessToken: null,
      setAccessToken,
      clearAccessToken: vi.fn(),
      redirectToLogin: vi.fn(),
    });
    const repository = makeRepository({
      login: vi.fn().mockResolvedValue({ accessToken: 'access-tok' }),
    });
    const useCase = new LoginUseCase(repository);

    const result = await useCase.execute(input);

    expect(repository.login).toHaveBeenCalledWith(input);
    expect(setAccessToken).toHaveBeenCalledWith('access-tok');
    expect(result).toEqual({ accessToken: 'access-tok' });
  });

  it('propagates a rejection without touching the session store', async () => {
    const setAccessToken = vi.fn();
    vi.mocked(useSessionStore.getState).mockReturnValue({
      accessToken: null,
      setAccessToken,
      clearAccessToken: vi.fn(),
      redirectToLogin: vi.fn(),
    });
    const repository = makeRepository({
      login: vi.fn().mockRejectedValue(new Error('invalid credentials')),
    });
    const useCase = new LoginUseCase(repository);

    await expect(useCase.execute(input)).rejects.toThrow('invalid credentials');
    expect(setAccessToken).not.toHaveBeenCalled();
  });
});
