import type { ITenancyRepository } from '@/core/tenancy/application/ports/tenancy.repository.port';
import type { CreateAppInput } from '@/core/tenancy/application/interfaces/create-app-input.interface';
import type { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export class CreateAppUseCase {
  constructor(private readonly repository: ITenancyRepository) {}

  async execute(input: CreateAppInput): Promise<CreatedEntity> {
    return this.repository.createApp(input);
  }
}
