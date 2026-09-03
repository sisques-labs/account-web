import { describe, it, expect, vi } from 'vitest';
import { AddTenantMemberUseCase } from './add-tenant-member.use-case';
import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';
import { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';

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

describe('AddTenantMemberUseCase', () => {
  it('delegates to the repository and returns the created membership id', async () => {
    const repository = makeRepository({ addTenantMember: vi.fn().mockResolvedValue({ id: 'membership-1' }) });
    const useCase = new AddTenantMemberUseCase(repository);

    const actual = await useCase.execute({ tenantId: 't1', email: 'jane@example.com', role: TenantRole.MEMBER });

    expect(repository.addTenantMember).toHaveBeenCalledWith({
      tenantId: 't1',
      email: 'jane@example.com',
      role: TenantRole.MEMBER,
    });
    expect(actual).toEqual({ id: 'membership-1' });
  });
});
