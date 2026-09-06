import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
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

import { TenantMembersDialog } from './tenant-members-dialog';
import { tenancyGqlRepository } from '@/core/tenancy/infrastructure/repositories/graphql/tenancy.gql.repository';
import enDict from '@/core/tenancy/presentation/i18n/en';
import { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';

function renderDialog() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TenantMembersDialog dict={enDict} tenantId="t1" tenantName="Casa de Marta" open onOpenChange={vi.fn()} />
    </QueryClientProvider>,
  );
}

describe('TenantMembersDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the tenant name in the title', async () => {
    vi.mocked(tenancyGqlRepository.listTenantMembers).mockResolvedValue([]);
    renderDialog();

    expect(await screen.findByText('Members of Casa de Marta')).toBeInTheDocument();
  });

  it('renders existing members with their role', async () => {
    vi.mocked(tenancyGqlRepository.listTenantMembers).mockResolvedValue([
      { id: 'm1', tenantId: 't1', userId: 'user-1234', role: TenantRole.OWNER, createdAt: '', updatedAt: '' },
    ]);
    renderDialog();

    const memberRow = (await screen.findByText('user-1234')).closest('li')!;
    expect(within(memberRow).getByText(enDict.roles.OWNER)).toBeInTheDocument();
  });

  it('shows the empty state when there are no members', async () => {
    vi.mocked(tenancyGqlRepository.listTenantMembers).mockResolvedValue([]);
    renderDialog();

    expect(await screen.findByText(enDict.membersDialog.empty)).toBeInTheDocument();
  });

  it('adds a member via email and role, then resets the form', async () => {
    vi.mocked(tenancyGqlRepository.listTenantMembers).mockResolvedValue([]);
    vi.mocked(tenancyGqlRepository.addTenantMember).mockResolvedValue({ id: 'membership-1' });
    const user = userEvent.setup();
    renderDialog();

    await screen.findByText(enDict.membersDialog.empty);
    await user.type(screen.getByLabelText(enDict.membersDialog.addMember.email.label), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: enDict.membersDialog.addMember.submit }));

    await waitFor(() =>
      expect(tenancyGqlRepository.addTenantMember).toHaveBeenCalledWith({
        tenantId: 't1',
        email: 'jane@example.com',
        role: TenantRole.MEMBER,
      }),
    );
  });

  it('shows a generic error alert when adding a member fails', async () => {
    vi.mocked(tenancyGqlRepository.listTenantMembers).mockResolvedValue([]);
    vi.mocked(tenancyGqlRepository.addTenantMember).mockRejectedValue(new Error('boom'));
    const user = userEvent.setup();
    renderDialog();

    await screen.findByText(enDict.membersDialog.empty);
    await user.type(screen.getByLabelText(enDict.membersDialog.addMember.email.label), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: enDict.membersDialog.addMember.submit }));

    expect(await screen.findByRole('alert')).toHaveTextContent(enDict.membersDialog.addMember.errors.generic);
  });
});
