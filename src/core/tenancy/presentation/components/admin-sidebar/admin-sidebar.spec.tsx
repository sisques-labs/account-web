import { render, screen } from '@testing-library/react';
import { AdminSidebar } from './admin-sidebar';
import enDict from '@/core/tenancy/presentation/i18n/en';

describe('AdminSidebar', () => {
  it('renders all three nav items', () => {
    render(<AdminSidebar lang="en" dict={enDict} active="apps" />);

    expect(screen.getByRole('link', { name: enDict.admin.nav.apps })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enDict.admin.nav.users })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enDict.admin.nav.invites })).toBeInTheDocument();
  });

  it('marks the active section with aria-current', () => {
    render(<AdminSidebar lang="en" dict={enDict} active="users" />);

    expect(screen.getByRole('link', { name: enDict.admin.nav.users })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: enDict.admin.nav.apps })).not.toHaveAttribute('aria-current');
  });

  it('links point at the localized admin routes', () => {
    render(<AdminSidebar lang="es" dict={enDict} active="apps" />);

    expect(screen.getByRole('link', { name: enDict.admin.nav.apps })).toHaveAttribute('href', '/es/admin/apps');
    expect(screen.getByRole('link', { name: enDict.admin.nav.users })).toHaveAttribute('href', '/es/admin/users');
    expect(screen.getByRole('link', { name: enDict.admin.nav.invites })).toHaveAttribute('href', '/es/admin/invites');
  });
});
