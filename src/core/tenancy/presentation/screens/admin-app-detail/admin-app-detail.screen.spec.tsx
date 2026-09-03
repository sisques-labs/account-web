import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository', () => ({
  tenancyGqlRepository: {
    listApps: vi.fn(),
    listTenantsByApp: vi.fn(),
    listTenantMembers: vi.fn(),
    createTenant: vi.fn(),
    addTenantMember: vi.fn(),
  },
}));

import { AdminAppDetailScreen } from './admin-app-detail.screen';
import { AdminTopBarActionsHost } from '@/core/tenancy/presentation/components/admin-shell/admin-shell';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import enDict from '@/core/tenancy/presentation/i18n/en';

const APPS = {
  items: [{ id: 'app-1', slug: 'gardenia', name: 'Gardenia', createdAt: '', updatedAt: '' }],
  total: 1,
  page: 1,
  perPage: 50,
  totalPages: 1,
};

// AdminAppDetailScreen injects "Crear tenant" into AdminShell's shared top
// bar via useAdminTopBarActions() — AdminTopBarActionsHost stands in for
// that slot so the button still mounts in this screen-only test.
function renderScreen(appSlug = 'gardenia') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminTopBarActionsHost>
        <AdminAppDetailScreen dict={enDict} appSlug={appSlug} />
      </AdminTopBarActionsHost>
    </QueryClientProvider>,
  );
}

describe('AdminAppDetailScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tenancyGqlRepository.listApps).mockResolvedValue(APPS);
  });

  it('renders the tenant table once the app resolves', async () => {
    vi.mocked(tenancyGqlRepository.listTenantsByApp).mockResolvedValue({
      items: [{ id: 't1', appId: 'app-1', name: 'Casa de Marta', slug: 'casa-de-marta', createdAt: '2024-01-01', updatedAt: '2024-01-01' }],
      total: 1,
      page: 1,
      perPage: 50,
      totalPages: 1,
    });
    renderScreen();

    expect(await screen.findByText('Casa de Marta')).toBeInTheDocument();
    expect(tenancyGqlRepository.listTenantsByApp).toHaveBeenCalledWith('app-1', undefined);
  });

  it('shows an empty state when the app has no tenants', async () => {
    vi.mocked(tenancyGqlRepository.listTenantsByApp).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      perPage: 50,
      totalPages: 0,
    });
    renderScreen();

    expect(await screen.findByText(enDict.appDetail.empty.title)).toBeInTheDocument();
  });

  it('opens the create-tenant dialog', async () => {
    vi.mocked(tenancyGqlRepository.listTenantsByApp).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      perPage: 50,
      totalPages: 0,
    });
    const user = userEvent.setup();
    renderScreen();

    await screen.findByText(enDict.appDetail.empty.title);
    await user.click(screen.getByRole('button', { name: enDict.appDetail.createTenant }));

    expect(screen.getByText(enDict.createTenantDialog.title)).toBeInTheDocument();
  });

  it('opens the members dialog for a tenant', async () => {
    vi.mocked(tenancyGqlRepository.listTenantsByApp).mockResolvedValue({
      items: [{ id: 't1', appId: 'app-1', name: 'Casa de Marta', slug: 'casa-de-marta', createdAt: '2024-01-01', updatedAt: '2024-01-01' }],
      total: 1,
      page: 1,
      perPage: 50,
      totalPages: 1,
    });
    vi.mocked(tenancyGqlRepository.listTenantMembers).mockResolvedValue([]);
    const user = userEvent.setup();
    renderScreen();

    await user.click(await screen.findByRole('button', { name: enDict.appDetail.viewMembers }));

    await waitFor(() => expect(screen.getByText('Members of Casa de Marta')).toBeInTheDocument());
  });
});
