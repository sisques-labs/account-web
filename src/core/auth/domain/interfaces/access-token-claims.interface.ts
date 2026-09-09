/**
 * Mirrors `account-api`'s `IAccessTokenClaims` (`src/core/security/access-token-claims.interface.ts`)
 * — the decoded JWT access-token payload.
 */
export interface AccessTokenClaims {
  sub: string;
  email: string;
  platformAdmin: boolean;
  tenants: Array<{ tenantId: string; role: string }>;
}
