import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
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
    useSessionStore.setState({ accessToken: null });
    mockPathname = '/en/admin/apps';
  });

  it('shows the unauthorized message when the user is not a platform admin', () => {
    render(
      <AdminShell lang="en" dict={enDict}>
        <div>content</div>
      </AdminShell>,
    );

    expect(screen.getByText(enDict.admin.unauthorized.title)).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
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
