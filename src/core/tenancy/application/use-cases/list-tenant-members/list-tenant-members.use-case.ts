import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';
import type { TenantMembership } from '@/core/tenancy/domain/interfaces/tenant-membership.interface';

export interface ListTenantMembersInput {
  tenantId: string;
}

export class ListTenantMembersUseCase {
  constructor(private readonly repository: ITenancyRepository) {}

  async execute(input: ListTenantMembersInput): Promise<TenantMembership[]> {
    return this.repository.listTenantMembers(input.tenantId);
  }
}
