import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

import { AdminAppsScreen } from './admin-apps.screen';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import enDict from '@/core/tenancy/presentation/i18n/en';

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminAppsScreen dict={enDict} lang="en" />
    </QueryClientProvider>,
  );
}

describe('AdminAppsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders each app with a link to its detail page', async () => {
    vi.mocked(tenancyGqlRepository.listApps).mockResolvedValue({
      items: [{ id: 'a1', slug: 'gardenia', name: 'Gardenia', createdAt: '', updatedAt: '' }],
      total: 1,
      page: 1,
      perPage: 50,
      totalPages: 1,
    });
    renderScreen();

    expect(await screen.findByText('Gardenia')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enDict.apps.viewTenants })).toHaveAttribute(
      'href',
      '/en/admin/apps/gardenia',
    );
  });

  it('shows an empty state when there are no apps', async () => {
    vi.mocked(tenancyGqlRepository.listApps).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      perPage: 50,
      totalPages: 0,
    });
    renderScreen();

    expect(await screen.findByText(enDict.apps.empty.title)).toBeInTheDocument();
  });

  it('shows an error alert when the query fails', async () => {
    vi.mocked(tenancyGqlRepository.listApps).mockRejectedValue(new Error('boom'));
    renderScreen();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(enDict.apps.error));
  });
});
