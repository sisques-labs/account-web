import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TenantMembersDialog } from './tenant-members-dialog';
import enDict from '@/core/tenancy/presentation/i18n/en';
import { withQueryClient } from '../../../../../../.storybook/decorators/with-query-client';
import { tenantMembersQueryKey } from '@/core/tenancy/presentation/hooks/use-tenant-members/useTenantMembers.hook';
import { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';

const meta = {
  title: 'Tenancy/TenantMembersDialog',
  component: TenantMembersDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof TenantMembersDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenDialog() {
  const [open, setOpen] = useState(true);
  return (
    <TenantMembersDialog dict={enDict} tenantId="t1" tenantName="Casa de Marta" open={open} onOpenChange={setOpen} />
  );
}

const baseArgs = { dict: enDict, tenantId: 't1', tenantName: 'Casa de Marta', open: true, onOpenChange: () => {} };

export const WithMembers: Story = {
  args: baseArgs,
  decorators: [
    withQueryClient((qc) =>
      qc.setQueryData(tenantMembersQueryKey('t1'), [
        { id: 'm1', tenantId: 't1', userId: 'user-1234', role: TenantRole.OWNER, createdAt: '', updatedAt: '' },
        { id: 'm2', tenantId: 't1', userId: 'user-5678', role: TenantRole.MEMBER, createdAt: '', updatedAt: '' },
      ]),
    ),
  ],
  render: () => <OpenDialog />,
};

export const Empty: Story = {
  args: baseArgs,
  decorators: [withQueryClient((qc) => qc.setQueryData(tenantMembersQueryKey('t1'), []))],
  render: () => <OpenDialog />,
};
