import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

vi.mock('@/core/app/infrastructure/repositories/graphql/app.gql.repository', () => ({
  appGqlRepository: {
    listApps: vi.fn(),
    createApp: vi.fn(),
  },
}));

import { AdminAppsScreen } from './admin-apps.screen';
import { AdminTopBarActionsHost } from '@/core/tenancy/presentation/components/admin-top-bar-actions-host/admin-top-bar-actions-host';
import { useAdminTopBarStore } from '@/core/tenancy/infrastructure/store/admin-top-bar.store';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';
import enDict from '@/core/app/presentation/i18n/en';

// AdminAppsScreen injects its "Crear app" action into AdminShell's shared
// top bar via useAdminTopBarActions() rather than rendering it inline —
// AdminTopBarActionsHost stands in for that slot so the button still
// mounts in this screen-only test. AdminAppsScreen's useApps() suspends
// while loading (the real Suspense fallback and error boundary live in
// app/[lang]/admin/apps/page.tsx and app/[lang]/admin/error.tsx), so this
// test wraps it in its own <Suspense> the same way.
function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminTopBarActionsHost>
        <Suspense fallback={<div>loading</div>}>
          <AdminAppsScreen dict={enDict} lang="en" />
        </Suspense>
      </AdminTopBarActionsHost>
    </QueryClientProvider>,
  );
}

describe('AdminAppsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminTopBarStore.setState({ actions: null });
  });

  it('renders each app with a link to its detail page', async () => {
    vi.mocked(appGqlRepository.listApps).mockResolvedValue({
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
    vi.mocked(appGqlRepository.listApps).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      perPage: 50,
      totalPages: 0,
    });
    renderScreen();

    expect(await screen.findByText(enDict.apps.empty.title)).toBeInTheDocument();
  });

  it('opens the create-app dialog from the header action', async () => {
    vi.mocked(appGqlRepository.listApps).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      perPage: 50,
      totalPages: 0,
    });
    const user = userEvent.setup();
    renderScreen();

    await screen.findByText(enDict.apps.empty.title);
    await user.click(screen.getByRole('button', { name: enDict.apps.createApp }));

    expect(screen.getByText(enDict.createAppDialog.title)).toBeInTheDocument();
  });

  it('creates an app and refreshes the apps list', async () => {
    vi.mocked(appGqlRepository.listApps).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      perPage: 50,
      totalPages: 0,
    });
    vi.mocked(appGqlRepository.createApp).mockResolvedValue({ id: 'app-1' });
    const user = userEvent.setup();
    renderScreen();

    await screen.findByText(enDict.apps.empty.title);
    await user.click(screen.getByRole('button', { name: enDict.apps.createApp }));
    await user.type(screen.getByLabelText(enDict.createAppDialog.name.label), 'Gardenia');
    await user.click(screen.getByRole('button', { name: enDict.createAppDialog.submit }));

    await waitFor(() => expect(appGqlRepository.createApp).toHaveBeenCalledWith({ name: 'Gardenia' }));
    await waitFor(() => expect(appGqlRepository.listApps).toHaveBeenCalledTimes(2));
  });
});
