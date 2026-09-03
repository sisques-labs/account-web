import { RegisterInput } from '@/core/auth/domain/interfaces/register-input.interface';
import { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';
import { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';

export interface LoginResult {
  accessToken: string;
}

export interface IAuthRepository {
  register(input: RegisterInput): Promise<CreatedEntity>;
  login(input: LoginInput): Promise<LoginResult>;
}
