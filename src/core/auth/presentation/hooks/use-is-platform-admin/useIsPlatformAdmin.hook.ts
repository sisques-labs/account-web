import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import { decodeAccessTokenClaims } from '@/core/auth/domain/services/decode-access-token.service';

/**
 * Reactive selector: true when the current session's access token carries
 * `platformAdmin: true`. Client-side only, for UI gating (see
 * decode-access-token.service.ts) — `account-api` always re-checks this
 * server-side via `PlatformAdminGuard`.
 */
export function useIsPlatformAdmin(): boolean {
  return useSessionStore((state) => decodeAccessTokenClaims(state.accessToken)?.platformAdmin ?? false);
}
