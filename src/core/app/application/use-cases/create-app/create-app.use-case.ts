import type { IAppRepository } from '@/core/app/application/ports/app.repository.port';
import type { CreateAppInput } from '@/core/app/application/interfaces/create-app-input.interface';
import type { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export class CreateAppUseCase {
  constructor(private readonly repository: IAppRepository) {}

  async execute(input: CreateAppInput): Promise<CreatedEntity> {
    return this.repository.createApp(input);
  }
}
