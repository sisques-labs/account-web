import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsPlatformAdmin } from './useIsPlatformAdmin.hook';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';

function base64UrlEncode(json: object): string {
  return btoa(JSON.stringify(json)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeToken(platformAdmin: boolean): string {
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const body = base64UrlEncode({ sub: 'u1', email: 'a@b.com', platformAdmin, tenants: [] });
  return `${header}.${body}.signature`;
}

describe('useIsPlatformAdmin', () => {
  beforeEach(() => {
    useSessionStore.setState({ accessToken: null });
  });

  it('returns false when there is no session', () => {
    const { result } = renderHook(() => useIsPlatformAdmin());
    expect(result.current).toBe(false);
  });

  it('returns false when the token is not a platform admin', () => {
    useSessionStore.setState({ accessToken: makeToken(false) });
    const { result } = renderHook(() => useIsPlatformAdmin());
    expect(result.current).toBe(false);
  });

  it('returns true when the token carries platformAdmin: true', () => {
    useSessionStore.setState({ accessToken: makeToken(true) });
    const { result } = renderHook(() => useIsPlatformAdmin());
    expect(result.current).toBe(true);
  });
});
