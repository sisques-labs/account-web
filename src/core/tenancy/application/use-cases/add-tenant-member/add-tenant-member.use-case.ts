import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';
import type { AddTenantMemberInput } from '@/core/tenancy/application/interfaces/add-tenant-member-input.interface';
import type { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export class AddTenantMemberUseCase {
  constructor(private readonly repository: ITenancyRepository) {}

  async execute(input: AddTenantMemberInput): Promise<CreatedEntity> {
    return this.repository.addTenantMember(input);
  }
}
