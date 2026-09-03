import type { Meta, StoryObj } from '@storybook/react';
import { AdminAppDetailScreen } from './admin-app-detail.screen';
import { AdminTopBarActionsHost } from '@/core/tenancy/presentation/components/admin-shell/admin-shell';
import enDict from '@/core/tenancy/presentation/i18n/en';
import { withQueryClient } from '../../../../../../.storybook/decorators/with-query-client';
import { appsQueryKey } from '@/core/app/presentation/hooks/use-apps/useApps.hook';
import { tenantsByAppQueryKey } from '@/core/tenancy/presentation/hooks/use-tenants-by-app/useTenantsByApp.hook';

// The screen injects "Crear tenant" into AdminShell's shared top bar via
// useAdminTopBarActions() — AdminTopBarActionsHost renders a stand-in for
// that slot above the screen so the story shows the button in context.
const meta = {
  title: 'Tenancy/Screens/AdminAppDetail',
  component: AdminAppDetailScreen,
  tags: ['autodocs'],
  decorators: [(Story) => <AdminTopBarActionsHost><Story /></AdminTopBarActionsHost>],
} satisfies Meta<typeof AdminAppDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const APPS = {
  items: [{ id: 'app-1', slug: 'gardenia', name: 'Gardenia', createdAt: '2024-01-01', updatedAt: '2024-01-01' }],
  total: 1,
  page: 1,
  perPage: 50,
  totalPages: 1,
};

const TENANTS = {
  items: [
    { id: 't1', appId: 'app-1', name: 'Casa de Marta', slug: 'casa-de-marta', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
    { id: 't2', appId: 'app-1', name: 'Casa de Javi', slug: 'casa-de-javi', createdAt: '2024-03-01', updatedAt: '2024-03-01' },
  ],
  total: 2,
  page: 1,
  perPage: 50,
  totalPages: 1,
};

export const Default: Story = {
  decorators: [
    withQueryClient((qc) => {
      qc.setQueryData(appsQueryKey, APPS);
      qc.setQueryData(tenantsByAppQueryKey('app-1'), TENANTS);
    }),
  ],
  args: { dict: enDict, appSlug: 'gardenia' },
};

export const Empty: Story = {
  decorators: [
    withQueryClient((qc) => {
      qc.setQueryData(appsQueryKey, APPS);
      qc.setQueryData(tenantsByAppQueryKey('app-1'), { items: [], total: 0, page: 1, perPage: 50, totalPages: 0 });
    }),
  ],
  args: { dict: enDict, appSlug: 'gardenia' },
};
