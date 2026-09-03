import { apolloClient } from '@/shared/infrastructure/http/apollo.client';
import { ITenancyRepository, Pagination } from '@/core/tenancy/application/ports/tenancy.repository.port';
import { App } from '@/core/tenancy/domain/interfaces/app.interface';
import { Tenant } from '@/core/tenancy/domain/interfaces/tenant.interface';
import { TenantMembership } from '@/core/tenancy/domain/interfaces/tenant-membership.interface';
import { CreateAppInput } from '@/core/tenancy/application/interfaces/create-app-input.interface';
import { CreateTenantInput } from '@/core/tenancy/application/interfaces/create-tenant-input.interface';
import { AddTenantMemberInput } from '@/core/tenancy/application/interfaces/add-tenant-member-input.interface';
import { TenantQueryableField } from '@/core/tenancy/domain/enums/tenant-queryable-field.enum';
import { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';
import { PaginatedResult } from '@/shared/domain/interfaces/paginated-result.interface';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { APPS_FIND_BY_CRITERIA } from './queries/apps-find-by-criteria.query';
import { TENANTS_FIND_BY_CRITERIA } from './queries/tenants-find-by-criteria.query';
import { TENANT_MEMBERSHIPS_FIND_BY_TENANT_ID } from './queries/tenant-memberships-find-by-tenant-id.query';
import { APP_CREATE } from './mutations/app-create.mutation';
import { TENANT_CREATE } from './mutations/tenant-create.mutation';
import { TENANT_MEMBER_ADD } from './mutations/tenant-member-add.mutation';

const DEFAULT_PAGINATION: Pagination = { page: 1, perPage: 50 };

interface AppsFindByCriteriaResult {
  appsFindByCriteria: PaginatedResult<App>;
}

interface TenantsFindByCriteriaResult {
  tenantsFindByCriteria: PaginatedResult<Tenant>;
}

interface TenantMembershipsFindByTenantIdResult {
  tenantMembershipsFindByTenantId: TenantMembership[];
}

interface MutationAck {
  success: boolean;
  message?: string;
  id?: string;
}

export class TenancyGqlRepository implements ITenancyRepository {
  async listApps(pagination: Pagination = DEFAULT_PAGINATION): Promise<PaginatedResult<App>> {
    const { data } = await apolloClient.query<AppsFindByCriteriaResult>({
      query: APPS_FIND_BY_CRITERIA,
      variables: { input: { pagination } },
      fetchPolicy: 'network-only',
    });
    return data!.appsFindByCriteria;
  }

  async createApp(input: CreateAppInput): Promise<CreatedEntity> {
    const { data } = await apolloClient.mutate<{ appCreate: MutationAck }>({
      mutation: APP_CREATE,
      variables: { input },
    });
    return { id: data?.appCreate.id ?? '' };
  }

  async listTenantsByApp(appId: string, pagination: Pagination = DEFAULT_PAGINATION): Promise<PaginatedResult<Tenant>> {
    const { data } = await apolloClient.query<TenantsFindByCriteriaResult>({
      query: TENANTS_FIND_BY_CRITERIA,
      variables: {
        input: {
          filters: [{ field: TenantQueryableField.APP_ID, operator: FilterOperator.EQUALS, value: appId }],
          pagination,
        },
      },
      fetchPolicy: 'network-only',
    });
    return data!.tenantsFindByCriteria;
  }

  async listTenantMembers(tenantId: string): Promise<TenantMembership[]> {
    const { data } = await apolloClient.query<TenantMembershipsFindByTenantIdResult>({
      query: TENANT_MEMBERSHIPS_FIND_BY_TENANT_ID,
      variables: { input: { tenantId } },
      fetchPolicy: 'network-only',
    });
    return data!.tenantMembershipsFindByTenantId;
  }

  async createTenant(input: CreateTenantInput): Promise<CreatedEntity> {
    const { data } = await apolloClient.mutate<{ tenantCreate: MutationAck }>({
      mutation: TENANT_CREATE,
      variables: { input },
    });
    return { id: data?.tenantCreate.id ?? '' };
  }

  async addTenantMember(input: AddTenantMemberInput): Promise<CreatedEntity> {
    const { data } = await apolloClient.mutate<{ tenantMemberAdd: MutationAck }>({
      mutation: TENANT_MEMBER_ADD,
      variables: { input },
    });
    return { id: data?.tenantMemberAdd.id ?? '' };
  }
}

export const tenancyGqlRepository = new TenancyGqlRepository();
