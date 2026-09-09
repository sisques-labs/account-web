import { describe, it, expect, vi } from 'vitest';
import { RegisterUseCase } from './register.use-case';
import type { IAuthRepository } from '@/core/auth/application/ports/auth.repository.port';
import type { RegisterInput } from '@/core/auth/domain/interfaces/register-input.interface';

function makeRepository(overrides: Partial<IAuthRepository> = {}): IAuthRepository {
  return {
    register: vi.fn(),
    login: vi.fn(),
    ...overrides,
  };
}

describe('RegisterUseCase', () => {
  const input: RegisterInput = {
    email: 'jane@example.com',
    password: 'Sup3rStrongPassw0rd!',
    displayName: 'Jane Doe',
  };

  it('calls repository.register with the given input and returns its result', async () => {
    const repository = makeRepository({
      register: vi.fn().mockResolvedValue({ id: 'user-1' }),
    });
    const useCase = new RegisterUseCase(repository);

    const result = await useCase.execute(input);

    expect(repository.register).toHaveBeenCalledWith(input);
    expect(result).toEqual({ id: 'user-1' });
  });

  it('propagates a rejection from repository.register', async () => {
    const repository = makeRepository({
      register: vi.fn().mockRejectedValue(new Error('email already registered')),
    });
    const useCase = new RegisterUseCase(repository);

    await expect(useCase.execute(input)).rejects.toThrow('email already registered');
  });
});
