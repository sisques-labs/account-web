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

import { CreateTenantDialog } from './create-tenant-dialog';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import enDict from '@/core/tenancy/presentation/i18n/en';

function renderDialog(onOpenChange = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <CreateTenantDialog dict={enDict} appId="app-1" open onOpenChange={onOpenChange} />
    </QueryClientProvider>,
  );
  return { onOpenChange };
}

describe('CreateTenantDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the name field and submit button', () => {
    renderDialog();

    expect(screen.getByLabelText(enDict.createTenantDialog.name.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: enDict.createTenantDialog.submit })).toBeInTheDocument();
  });

  it('blocks submission and shows a validation error for an empty name', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: enDict.createTenantDialog.submit }));

    expect(await screen.findByText(enDict.validation.nameRequired)).toBeInTheDocument();
    expect(tenancyGqlRepository.createTenant).not.toHaveBeenCalled();
  });

  it('submits and closes the dialog on success', async () => {
    vi.mocked(tenancyGqlRepository.createTenant).mockResolvedValue({ id: 'tenant-1' });
    const user = userEvent.setup();
    const { onOpenChange } = renderDialog();

    await user.type(screen.getByLabelText(enDict.createTenantDialog.name.label), 'Casa de Marta');
    await user.click(screen.getByRole('button', { name: enDict.createTenantDialog.submit }));

    await waitFor(() =>
      expect(tenancyGqlRepository.createTenant).toHaveBeenCalledWith({ appId: 'app-1', name: 'Casa de Marta' }),
    );
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('shows a generic error alert when the mutation fails', async () => {
    vi.mocked(tenancyGqlRepository.createTenant).mockRejectedValue(new Error('boom'));
    const user = userEvent.setup();
    renderDialog();

    await user.type(screen.getByLabelText(enDict.createTenantDialog.name.label), 'Casa de Marta');
    await user.click(screen.getByRole('button', { name: enDict.createTenantDialog.submit }));

    expect(await screen.findByRole('alert')).toHaveTextContent(enDict.createTenantDialog.errors.generic);
  });
});
