import type { AccessTokenClaims } from '@/core/auth/domain/interfaces/access-token-claims.interface';

/**
 * Decodes (without verifying signature/expiry) the payload segment of a JWT
 * access token. This is client-side, UNVERIFIED decoding for UI gating only
 * (e.g. showing/hiding the `/admin` section) — no security property depends
 * on it being tamper-proof. `account-api` always re-validates the token
 * server-side via its own `JwtAuthGuard`/`PlatformAdminGuard`.
 *
 * Returns `null` when the token is missing, malformed, or its payload isn't
 * valid JSON.
 */
export function decodeAccessTokenClaims(token: string | null | undefined): AccessTokenClaims | null {
  if (!token) return null;

  const segments = token.split('.');
  if (segments.length !== 3) return null;

  try {
    const payloadSegment = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadSegment.padEnd(payloadSegment.length + ((4 - (payloadSegment.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json) as AccessTokenClaims;
  } catch {
    return null;
  }
}
