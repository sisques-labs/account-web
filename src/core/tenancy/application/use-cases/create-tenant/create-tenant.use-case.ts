import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';
import type { CreateTenantInput } from '@/core/tenancy/application/interfaces/create-tenant-input.interface';
import type { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export class CreateTenantUseCase {
  constructor(private readonly repository: ITenancyRepository) {}

  async execute(input: CreateTenantInput): Promise<CreatedEntity> {
    return this.repository.createTenant(input);
  }
}
