import { IAuthRepository, LoginResult } from '@/core/auth/application/ports/auth.repository.port';
import { RegisterInput } from '@/core/auth/domain/interfaces/register-input.interface';
import { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';
import { CreatedEntity } from '@/shared/domain/interfaces/created-entity.interface';
import { http } from '@/shared/infrastructure/http/axios.client';

interface LoginResponseBody {
  accessToken: string;
  refreshToken: string;
}

export class AuthRestRepository implements IAuthRepository {
  async register(input: RegisterInput): Promise<CreatedEntity> {
    const response = await http.post<string>('/v1/auth/register', input);
    return { id: response.data };
  }

  async login(input: LoginInput): Promise<LoginResult> {
    const response = await http.post<LoginResponseBody>('/v1/auth/login', input);
    return { accessToken: response.data.accessToken };
  }
}

export const authRestRepository = new AuthRestRepository();
