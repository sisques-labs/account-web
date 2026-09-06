import { describe, it, expect } from 'vitest';
import { decodeAccessTokenClaims } from './decode-access-token.service';

function base64UrlEncode(json: object): string {
  return btoa(JSON.stringify(json)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeToken(payload: object): string {
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const body = base64UrlEncode(payload);
  return `${header}.${body}.signature`;
}

describe('decodeAccessTokenClaims', () => {
  it('decodes a well-formed JWT payload', () => {
    const claims = {
      sub: 'user-1',
      email: 'jane@example.com',
      platformAdmin: true,
      tenants: [{ tenantId: 't1', role: 'OWNER' }],
    };

    expect(decodeAccessTokenClaims(makeToken(claims))).toEqual(claims);
  });

  it('returns null for a null token', () => {
    expect(decodeAccessTokenClaims(null)).toBeNull();
  });

  it('returns null for an undefined token', () => {
    expect(decodeAccessTokenClaims(undefined)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(decodeAccessTokenClaims('')).toBeNull();
  });

  it('returns null when the token does not have 3 segments', () => {
    expect(decodeAccessTokenClaims('not-a-jwt')).toBeNull();
  });

  it('returns null when the payload segment is not valid base64/JSON', () => {
    expect(decodeAccessTokenClaims('header.not-valid-base64!!!.signature')).toBeNull();
  });

  it('handles base64url payloads that need padding', () => {
    const claims = { sub: 'u', email: 'a@b.com', platformAdmin: false, tenants: [] };
    expect(decodeAccessTokenClaims(makeToken(claims))).toEqual(claims);
  });
});
