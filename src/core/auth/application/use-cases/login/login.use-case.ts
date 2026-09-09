import { IAuthRepository, LoginResult } from '@/core/auth/application/ports/auth.repository.port';
import { LoginInput } from '@/core/auth/domain/interfaces/login-input.interface';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';

export class LoginUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const result = await this.repository.login(input);
    useSessionStore.getState().setAccessToken(result.accessToken);
    return result;
  }
}
