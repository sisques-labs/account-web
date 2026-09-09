import type { Meta, StoryObj } from '@storybook/react';
import { AdminSidebar } from './admin-sidebar';
import enDict from '@/core/tenancy/presentation/i18n/en';

const meta = {
  title: 'Tenancy/AdminSidebar',
  component: AdminSidebar,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ height: 400 }}><Story /></div>],
} satisfies Meta<typeof AdminSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Apps: Story = {
  args: { lang: 'en', dict: enDict, active: 'apps' },
};

export const Users: Story = {
  args: { lang: 'en', dict: enDict, active: 'users' },
};

export const Invites: Story = {
  args: { lang: 'en', dict: enDict, active: 'invites' },
};
