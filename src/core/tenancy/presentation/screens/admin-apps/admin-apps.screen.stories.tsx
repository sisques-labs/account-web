import type { Meta, StoryObj } from '@storybook/react';
import { AdminAppsScreen } from './admin-apps.screen';
import enDict from '@/core/tenancy/presentation/i18n/en';
import { withQueryClient } from '../../../../../../.storybook/decorators/with-query-client';
import { appsQueryKey } from '@/core/tenancy/presentation/hooks/use-apps/useApps.hook';

const meta = {
  title: 'Tenancy/Screens/AdminApps',
  component: AdminAppsScreen,
  tags: ['autodocs'],
} satisfies Meta<typeof AdminAppsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const APPS = {
  items: [
    { id: 'app-1', slug: 'gardenia', name: 'Gardenia', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'app-2', slug: 'account', name: 'Account', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ],
  total: 2,
  page: 1,
  perPage: 50,
  totalPages: 1,
};

export const Default: Story = {
  decorators: [withQueryClient((qc) => qc.setQueryData(appsQueryKey, APPS))],
  args: { dict: enDict, lang: 'en' },
};

export const Empty: Story = {
  decorators: [
    withQueryClient((qc) => qc.setQueryData(appsQueryKey, { items: [], total: 0, page: 1, perPage: 50, totalPages: 0 })),
  ],
  args: { dict: enDict, lang: 'en' },
};
