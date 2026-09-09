import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminTopBarActionsHost } from './admin-top-bar-actions-host';
import { useAdminTopBarStore } from '@/core/tenancy/infrastructure/store/admin-top-bar.store';

describe('AdminTopBarActionsHost', () => {
  beforeEach(() => {
    useAdminTopBarStore.setState({ actions: null });
  });

  it('renders the children below the actions slot', () => {
    render(
      <AdminTopBarActionsHost>
        <div>content</div>
      </AdminTopBarActionsHost>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders whatever the admin top bar store currently holds', () => {
    useAdminTopBarStore.setState({ actions: <button type="button">Crear app</button> });

    render(
      <AdminTopBarActionsHost>
        <div>content</div>
      </AdminTopBarActionsHost>,
    );

    expect(screen.getByRole('button', { name: 'Crear app' })).toBeInTheDocument();
  });
});
