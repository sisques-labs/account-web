import { describe, it, expect, vi } from 'vitest';
import { ListAppsUseCase } from './list-apps.use-case';
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

describe('ListAppsUseCase', () => {
  it('delegates to the repository with the given pagination', async () => {
    const result = { items: [], total: 0, page: 1, perPage: 20, totalPages: 0 };
    const repository = makeRepository({ listApps: vi.fn().mockResolvedValue(result) });
    const useCase = new ListAppsUseCase(repository);

    const actual = await useCase.execute({ page: 1, perPage: 20 });

    expect(repository.listApps).toHaveBeenCalledWith({ page: 1, perPage: 20 });
    expect(actual).toBe(result);
  });

  it('works without pagination', async () => {
    const result = { items: [], total: 0, page: 1, perPage: 20, totalPages: 0 };
    const repository = makeRepository({ listApps: vi.fn().mockResolvedValue(result) });
    const useCase = new ListAppsUseCase(repository);

    await useCase.execute();

    expect(repository.listApps).toHaveBeenCalledWith(undefined);
  });
});
