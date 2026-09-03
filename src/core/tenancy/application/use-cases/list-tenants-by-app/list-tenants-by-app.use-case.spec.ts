import { describe, it, expect, vi } from 'vitest';
import { ListTenantsByAppUseCase } from './list-tenants-by-app.use-case';
import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';

function makeRepository(overrides: Partial<ITenancyRepository> = {}): ITenancyRepository {
  return {
    listApps: vi.fn(),
    listTenantsByApp: vi.fn(),
    listTenantMembers: vi.fn(),
    createTenant: vi.fn(),
    addTenantMember: vi.fn(),
    ...overrides,
  };
}

describe('ListTenantsByAppUseCase', () => {
  it('delegates to the repository with appId and pagination', async () => {
    const result = { items: [], total: 0, page: 1, perPage: 20, totalPages: 0 };
    const repository = makeRepository({ listTenantsByApp: vi.fn().mockResolvedValue(result) });
    const useCase = new ListTenantsByAppUseCase(repository);

    const actual = await useCase.execute({ appId: 'app-1', pagination: { page: 1, perPage: 20 } });

    expect(repository.listTenantsByApp).toHaveBeenCalledWith('app-1', { page: 1, perPage: 20 });
    expect(actual).toBe(result);
  });
});
