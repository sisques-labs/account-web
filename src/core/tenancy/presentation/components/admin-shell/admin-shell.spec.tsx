import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ replace }),
}));

let mockPathname = '/en/admin/apps';

import { AdminShell } from './admin-shell';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import enDict from '@/core/tenancy/presentation/i18n/en';

function base64UrlEncode(json: object): string {
  return btoa(JSON.stringify(json)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeToken(platformAdmin: boolean): string {
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const body = base64UrlEncode({ sub: 'u1', email: 'a@b.com', platformAdmin, tenants: [] });
  return `${header}.${body}.signature`;
}

describe('AdminShell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSessionStore.setState({ accessToken: null });
    mockPathname = '/en/admin/apps';
  });

  it('redirects to login with a redirectTo param when there is no session', () => {
    render(
      <AdminShell lang="en" dict={enDict}>
        <div>content</div>
      </AdminShell>,
    );

    expect(replace).toHaveBeenCalledWith('/en/login?redirectTo=%2Fen%2Fadmin%2Fapps');
    expect(screen.queryByText('content')).not.toBeInTheDocument();
    expect(screen.queryByText(enDict.admin.unauthorized.title)).not.toBeInTheDocument();
  });

  it('shows the unauthorized message for a signed-in non-admin, without redirecting', () => {
    useSessionStore.setState({ accessToken: makeToken(false) });
    render(
      <AdminShell lang="en" dict={enDict}>
        <div>content</div>
      </AdminShell>,
    );

    expect(screen.getByText(enDict.admin.unauthorized.title)).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('renders the sidebar and children for a platform admin', () => {
    useSessionStore.setState({ accessToken: makeToken(true) });
    render(
      <AdminShell lang="en" dict={enDict}>
        <div>content</div>
      </AdminShell>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enDict.admin.nav.apps })).toHaveAttribute('aria-current', 'page');
    expect(replace).not.toHaveBeenCalled();
  });

  it('marks the users section active when on /admin/users', () => {
    mockPathname = '/en/admin/users';
    useSessionStore.setState({ accessToken: makeToken(true) });
    render(
      <AdminShell lang="en" dict={enDict}>
        <div>content</div>
      </AdminShell>,
    );

    expect(screen.getByRole('link', { name: enDict.admin.nav.users })).toHaveAttribute('aria-current', 'page');
  });
});
