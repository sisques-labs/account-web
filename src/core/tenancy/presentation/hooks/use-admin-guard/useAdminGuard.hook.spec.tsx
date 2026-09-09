import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ replace }),
}));

let mockPathname = '/en/admin/apps';

import { useAdminGuard } from './useAdminGuard.hook';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';

function base64UrlEncode(json: object): string {
  return btoa(JSON.stringify(json)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeToken(platformAdmin: boolean): string {
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const body = base64UrlEncode({ sub: 'u1', email: 'a@b.com', platformAdmin, tenants: [] });
  return `${header}.${body}.signature`;
}

describe('useAdminGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSessionStore.setState({ accessToken: null, hasBootstrapped: true });
    mockPathname = '/en/admin/apps';
  });

  it('reports pending and does not redirect while the session bootstrap is still in flight', () => {
    useSessionStore.setState({ accessToken: null, hasBootstrapped: false });

    const { result } = renderHook(() => useAdminGuard('en'));

    expect(result.current.status).toBe('pending');
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects to login with a redirectTo param once bootstrap confirms there is no session', () => {
    const { result } = renderHook(() => useAdminGuard('en'));

    expect(replace).toHaveBeenCalledWith('/en/login?redirectTo=%2Fen%2Fadmin%2Fapps');
    expect(result.current.status).toBe('pending');
  });

  it('reports unauthorized for a signed-in non-admin, without redirecting', () => {
    useSessionStore.setState({ accessToken: makeToken(false) });

    const { result } = renderHook(() => useAdminGuard('en'));

    expect(result.current.status).toBe('unauthorized');
    expect(replace).not.toHaveBeenCalled();
  });

  it('reports authorized for a platform admin', () => {
    useSessionStore.setState({ accessToken: makeToken(true) });

    const { result } = renderHook(() => useAdminGuard('en'));

    expect(result.current.status).toBe('authorized');
    expect(replace).not.toHaveBeenCalled();
  });

  it('resolves the apps section as active by default', () => {
    useSessionStore.setState({ accessToken: makeToken(true) });

    const { result } = renderHook(() => useAdminGuard('en'));

    expect(result.current.active).toBe('apps');
  });

  it('resolves the users section as active on /admin/users', () => {
    mockPathname = '/en/admin/users';
    useSessionStore.setState({ accessToken: makeToken(true) });

    const { result } = renderHook(() => useAdminGuard('en'));

    expect(result.current.active).toBe('users');
  });

  it('resolves the invites section as active on /admin/invites', () => {
    mockPathname = '/en/admin/invites';
    useSessionStore.setState({ accessToken: makeToken(true) });

    const { result } = renderHook(() => useAdminGuard('en'));

    expect(result.current.active).toBe('invites');
  });
});
