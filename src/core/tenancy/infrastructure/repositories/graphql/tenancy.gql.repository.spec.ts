import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/infrastructure/http/apollo.client', () => ({
  apolloClient: { query: vi.fn(), mutate: vi.fn() },
}));

import { TenancyGqlRepository } from './tenancy.gql.repository';
import { apolloClient } from '@/shared/infrastructure/http/apollo.client';
import { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';
import { TenantQueryableField } from '@/core/tenancy/domain/enums/tenant-queryable-field.enum';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';

describe('TenancyGqlRepository', () => {
  let repository: TenancyGqlRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new TenancyGqlRepository();
  });

  it('listTenantsByApp filters by appId', async () => {
    vi.mocked(apolloClient.query).mockResolvedValue({
      data: { tenantsFindByCriteria: { items: [], total: 0, page: 1, perPage: 50, totalPages: 0 } },
    } as never);

    await repository.listTenantsByApp('app-1');

    expect(apolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            filters: [{ field: TenantQueryableField.APP_ID, operator: FilterOperator.EQUALS, value: 'app-1' }],
            pagination: { page: 1, perPage: 50 },
          },
        },
      }),
    );
  });

  it('listTenantMembers queries by tenantId', async () => {
    const members = [{ id: 'm1', tenantId: 't1', userId: 'u1', role: TenantRole.OWNER, createdAt: '', updatedAt: '' }];
    vi.mocked(apolloClient.query).mockResolvedValue({
      data: { tenantMembershipsFindByTenantId: members },
    } as never);

    const result = await repository.listTenantMembers('t1');

    expect(apolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { input: { tenantId: 't1' } } }),
    );
    expect(result).toEqual(members);
  });

  it('createTenant mutates and returns the created id from the ack', async () => {
    vi.mocked(apolloClient.mutate).mockResolvedValue({
      data: { tenantCreate: { success: true, message: 'ok', id: 'tenant-1' } },
    } as never);

    const result = await repository.createTenant({ appId: 'app-1', name: 'Casa de Marta' });

    expect(apolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { input: { appId: 'app-1', name: 'Casa de Marta' } } }),
    );
    expect(result).toEqual({ id: 'tenant-1' });
  });

  it('addTenantMember mutates and returns the created membership id from the ack', async () => {
    vi.mocked(apolloClient.mutate).mockResolvedValue({
      data: { tenantMemberAdd: { success: true, message: 'ok', id: 'membership-1' } },
    } as never);

    const result = await repository.addTenantMember({
      tenantId: 't1',
      email: 'jane@example.com',
      role: TenantRole.MEMBER,
    });

    expect(apolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { input: { tenantId: 't1', email: 'jane@example.com', role: TenantRole.MEMBER } },
      }),
    );
    expect(result).toEqual({ id: 'membership-1' });
  });
});
