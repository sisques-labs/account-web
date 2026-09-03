import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository', () => ({
  tenancyGqlRepository: {
    listApps: vi.fn(),
    createApp: vi.fn(),
    listTenantsByApp: vi.fn(),
    listTenantMembers: vi.fn(),
    createTenant: vi.fn(),
    addTenantMember: vi.fn(),
  },
}));

import { CreateAppDialog } from './create-app-dialog';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import enDict from '@/core/tenancy/presentation/i18n/en';

function renderDialog(onOpenChange = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <CreateAppDialog dict={enDict} open onOpenChange={onOpenChange} />
    </QueryClientProvider>,
  );
  return { onOpenChange };
}

describe('CreateAppDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the name field and submit button', () => {
    renderDialog();

    expect(screen.getByLabelText(enDict.createAppDialog.name.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: enDict.createAppDialog.submit })).toBeInTheDocument();
  });

  it('blocks submission and shows a validation error for an empty name', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: enDict.createAppDialog.submit }));

    expect(await screen.findByText(enDict.validation.nameRequired)).toBeInTheDocument();
    expect(tenancyGqlRepository.createApp).not.toHaveBeenCalled();
  });

  it('submits and closes the dialog on success', async () => {
    vi.mocked(tenancyGqlRepository.createApp).mockResolvedValue({ id: 'app-1' });
    const user = userEvent.setup();
    const { onOpenChange } = renderDialog();

    await user.type(screen.getByLabelText(enDict.createAppDialog.name.label), 'Gardenia');
    await user.click(screen.getByRole('button', { name: enDict.createAppDialog.submit }));

    await waitFor(() => expect(tenancyGqlRepository.createApp).toHaveBeenCalledWith({ name: 'Gardenia' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('shows a generic error alert when the mutation fails', async () => {
    vi.mocked(tenancyGqlRepository.createApp).mockRejectedValue(new Error('boom'));
    const user = userEvent.setup();
    renderDialog();

    await user.type(screen.getByLabelText(enDict.createAppDialog.name.label), 'Gardenia');
    await user.click(screen.getByRole('button', { name: enDict.createAppDialog.submit }));

    expect(await screen.findByRole('alert')).toHaveTextContent(enDict.createAppDialog.errors.generic);
  });
});
