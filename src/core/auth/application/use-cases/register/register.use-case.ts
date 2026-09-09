import { IAuthRepository } from '@/core/auth/application/ports/auth.repository.port';
import { RegisterInput } from '@/core/auth/domain/interfaces/register-input.interface';
import { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export class RegisterUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(input: RegisterInput): Promise<CreatedEntity> {
    return this.repository.register(input);
  }
}
