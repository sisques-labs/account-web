import { describe, it, expect, vi } from 'vitest';
import { CreateTenantUseCase } from './create-tenant.use-case';
import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';

function makeRepository(overrides: Partial<ITenancyRepository> = {}): ITenancyRepository {
  return {
    listTenantsByApp: vi.fn(),
    listTenantMembers: vi.fn(),
    createTenant: vi.fn(),
    addTenantMember: vi.fn(),
    ...overrides,
  };
}

describe('CreateTenantUseCase', () => {
  it('delegates to the repository and returns the created id', async () => {
    const repository = makeRepository({ createTenant: vi.fn().mockResolvedValue({ id: 'tenant-1' }) });
    const useCase = new CreateTenantUseCase(repository);

    const actual = await useCase.execute({ appId: 'app-1', name: 'Casa de Marta' });

    expect(repository.createTenant).toHaveBeenCalledWith({ appId: 'app-1', name: 'Casa de Marta' });
    expect(actual).toEqual({ id: 'tenant-1' });
  });
});
