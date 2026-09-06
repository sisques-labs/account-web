import type { Meta, StoryObj } from '@storybook/react';
import { AdminAppsScreen } from './admin-apps.screen';
import { AdminTopBarActionsHost } from '@/core/tenancy/presentation/components/admin-top-bar-actions-host/admin-top-bar-actions-host';
import enDict from '@/core/app/presentation/i18n/en';
import { withQueryClient } from '../../../../../../.storybook/decorators/with-query-client';
import { appsQueryKey } from '@/core/app/presentation/hooks/use-apps/useApps.hook';

// The screen injects its "Crear app" action into AdminShell's shared top
// bar via useAdminTopBarActions() — AdminTopBarActionsHost renders a stand-in
// for that slot above the screen so the story shows the button in context.
const meta = {
  title: 'Tenancy/Screens/AdminApps',
  component: AdminAppsScreen,
  tags: ['autodocs'],
  decorators: [(Story) => <AdminTopBarActionsHost><Story /></AdminTopBarActionsHost>],
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
