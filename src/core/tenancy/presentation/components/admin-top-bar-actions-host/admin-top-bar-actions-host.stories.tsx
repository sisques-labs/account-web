import type { Meta, StoryObj } from '@storybook/react';
import { AdminTopBarActionsHost } from './admin-top-bar-actions-host';
import { useAdminTopBarStore } from '@/core/tenancy/infrastructure/store/admin-top-bar.store';

const meta = {
  title: 'Tenancy/AdminTopBarActionsHost',
  component: AdminTopBarActionsHost,
  tags: ['autodocs'],
} satisfies Meta<typeof AdminTopBarActionsHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAction: Story = {
  decorators: [
    (Story) => {
      useAdminTopBarStore.setState({ actions: <button type="button">Crear app</button> });
      return <Story />;
    },
  ],
  args: {
    children: <div>Screen content</div>,
  },
};
