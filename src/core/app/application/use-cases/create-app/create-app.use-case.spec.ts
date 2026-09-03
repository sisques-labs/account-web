import { describe, it, expect, vi } from 'vitest';
import { CreateAppUseCase } from './create-app.use-case';
import type { IAppRepository } from '@/core/app/application/ports/app.repository.port';

function makeRepository(overrides: Partial<IAppRepository> = {}): IAppRepository {
  return {
    listApps: vi.fn(),
    createApp: vi.fn(),
    ...overrides,
  };
}

describe('CreateAppUseCase', () => {
  it('delegates to the repository and returns the created id', async () => {
    const repository = makeRepository({ createApp: vi.fn().mockResolvedValue({ id: 'app-1' }) });
    const useCase = new CreateAppUseCase(repository);

    const actual = await useCase.execute({ name: 'Gardenia' });

    expect(repository.createApp).toHaveBeenCalledWith({ name: 'Gardenia' });
    expect(actual).toEqual({ id: 'app-1' });
  });
});
