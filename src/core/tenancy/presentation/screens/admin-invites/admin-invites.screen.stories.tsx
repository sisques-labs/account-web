import type { Meta, StoryObj } from '@storybook/react';
import { AdminInvitesScreen } from './admin-invites.screen';
import enDict from '@/core/tenancy/presentation/i18n/en';

const meta = {
  title: 'Tenancy/Screens/AdminInvites',
  component: AdminInvitesScreen,
  tags: ['autodocs'],
} satisfies Meta<typeof AdminInvitesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { dict: enDict },
};
