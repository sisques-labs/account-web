import { describe, it, expect, vi } from 'vitest';
import { CreateAppUseCase } from './create-app.use-case';
import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';

function makeRepository(overrides: Partial<ITenancyRepository> = {}): ITenancyRepository {
  return {
    listApps: vi.fn(),
    createApp: vi.fn(),
    listTenantsByApp: vi.fn(),
    listTenantMembers: vi.fn(),
    createTenant: vi.fn(),
    addTenantMember: vi.fn(),
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
