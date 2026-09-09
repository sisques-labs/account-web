import type { Meta, StoryObj } from '@storybook/react';
import { AdminUsersScreen } from './admin-users.screen';
import enDict from '@/core/tenancy/presentation/i18n/en';

const meta = {
  title: 'Tenancy/Screens/AdminUsers',
  component: AdminUsersScreen,
  tags: ['autodocs'],
} satisfies Meta<typeof AdminUsersScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { dict: enDict },
};
