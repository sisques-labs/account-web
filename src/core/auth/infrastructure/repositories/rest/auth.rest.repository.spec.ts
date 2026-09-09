import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/infrastructure/http/axios.client', () => ({
  http: { post: vi.fn() },
}));

import { authRestRepository } from './auth.rest.repository';
import { http } from '@/shared/infrastructure/http/axios.client';

describe('AuthRestRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    const input = {
      email: 'jane@example.com',
      password: 'Sup3rStrongPassw0rd!',
      displayName: 'Jane Doe',
    };

    it('posts to /v1/auth/register and maps the raw string response to CreatedEntity', async () => {
      vi.mocked(http.post).mockResolvedValue({ data: 'user-1' });

      const result = await authRestRepository.register(input);

      expect(http.post).toHaveBeenCalledWith('/v1/auth/register', input);
      expect(result).toEqual({ id: 'user-1' });
    });

    it('propagates a rejection (e.g. 409 email already registered)', async () => {
      vi.mocked(http.post).mockRejectedValue(new Error('409'));

      await expect(authRestRepository.register(input)).rejects.toThrow('409');
    });
  });

  describe('login', () => {
    const input = { email: 'jane@example.com', password: 'Sup3rStrongPassw0rd!' };

    it('posts to /v1/auth/login and returns only accessToken, discarding refreshToken', async () => {
      vi.mocked(http.post).mockResolvedValue({
        data: { accessToken: 'access-tok', refreshToken: 'refresh-tok' },
      });

      const result = await authRestRepository.login(input);

      expect(http.post).toHaveBeenCalledWith('/v1/auth/login', input);
      expect(result).toEqual({ accessToken: 'access-tok' });
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('propagates a rejection (e.g. 401 invalid credentials)', async () => {
      vi.mocked(http.post).mockRejectedValue(new Error('401'));

      await expect(authRestRepository.login(input)).rejects.toThrow('401');
    });
  });
});
