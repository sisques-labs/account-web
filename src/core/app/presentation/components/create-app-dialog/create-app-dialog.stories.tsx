import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CreateAppDialog } from './create-app-dialog';
import enDict from '@/core/app/presentation/i18n/en';

const meta = {
  title: 'App/CreateAppDialog',
  component: CreateAppDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof CreateAppDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenDialog() {
  const [open, setOpen] = useState(true);
  return <CreateAppDialog dict={enDict} open={open} onOpenChange={setOpen} />;
}

export const Open: Story = {
  args: { dict: enDict, open: true, onOpenChange: () => {} },
  render: () => <OpenDialog />,
};
