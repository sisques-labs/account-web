import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CreateTenantDialog } from './create-tenant-dialog';
import enDict from '@/core/tenancy/presentation/i18n/en';

const meta = {
  title: 'Tenancy/CreateTenantDialog',
  component: CreateTenantDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof CreateTenantDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenDialog() {
  const [open, setOpen] = useState(true);
  return <CreateTenantDialog dict={enDict} appId="app-1" open={open} onOpenChange={setOpen} />;
}

export const Open: Story = {
  args: { dict: enDict, appId: 'app-1', open: true, onOpenChange: () => {} },
  render: () => <OpenDialog />,
};
