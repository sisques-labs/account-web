import { describe, it, expect, vi } from 'vitest';
import { ListTenantMembersUseCase } from './list-tenant-members.use-case';
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

describe('ListTenantMembersUseCase', () => {
  it('delegates to the repository with tenantId', async () => {
    const members = [{ id: 'm1', tenantId: 't1', userId: 'u1', role: 'OWNER', createdAt: '', updatedAt: '' }];
    const repository = makeRepository({ listTenantMembers: vi.fn().mockResolvedValue(members) });
    const useCase = new ListTenantMembersUseCase(repository);

    const actual = await useCase.execute({ tenantId: 't1' });

    expect(repository.listTenantMembers).toHaveBeenCalledWith('t1');
    expect(actual).toBe(members);
  });
});
