'use client';

import { useState } from 'react';
import { Card } from '@/shared/presentation/components/ui/card/card';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { Skeleton } from '@/shared/presentation/components/ui/skeleton/skeleton';
import { Alert } from '@/shared/presentation/components/ui/alert/alert';
import { EmptyState } from '@/shared/presentation/components/ui/empty-state/empty-state';
import { useApps } from '@/core/tenancy/presentation/hooks/use-apps/useApps.hook';
import { useTenantsByApp } from '@/core/tenancy/presentation/hooks/use-tenants-by-app/useTenantsByApp.hook';
import { CreateTenantDialog } from '@/core/tenancy/presentation/components/create-tenant-dialog/create-tenant-dialog';
import { TenantMembersDialog } from '@/core/tenancy/presentation/components/tenant-members-dialog/tenant-members-dialog';
import { useAdminTopBarActions } from '@/core/tenancy/presentation/components/admin-shell/admin-shell';
import type { Tenant } from '@/core/tenancy/domain/interfaces/tenant.interface';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminAppDetailScreenProps {
  dict: WidenStringLiterals<TenancyDict>;
  appSlug: string;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
}

function AdminAppDetailScreen({ dict, appSlug }: AdminAppDetailScreenProps) {
  const appsQuery = useApps();
  const app = appsQuery.data?.items.find((item) => item.slug === appSlug);
  const tenantsQuery = useTenantsByApp(app?.id ?? '');

  const [createOpen, setCreateOpen] = useState(false);
  const [membersTenant, setMembersTenant] = useState<Tenant | null>(null);

  // "Crear tenant" lives in AdminShell's shared top bar, next to the
  // section title, rather than duplicated inside the page body.
  useAdminTopBarActions(
    app ? <Button onClick={() => setCreateOpen(true)}>{dict.appDetail.createTenant}</Button> : null,
  );

  return (
    <div className="flex w-full flex-col gap-5">
      {/* This title shows the specific app's name — genuinely different
          information from AdminShell's generic "Apps del ecosistema"
          section label in the top bar, so it isn't a duplicate. */}
      <h1 className="headline text-2xl">{app?.name ?? appSlug}</h1>

      {(appsQuery.isLoading || (app && tenantsQuery.isLoading)) && (
        <div className="flex flex-col gap-2">
          <Skeleton variant="line" />
          <Skeleton variant="line" />
          <Skeleton variant="line" />
        </div>
      )}

      {(appsQuery.isError || tenantsQuery.isError) && <Alert variant="error" message={dict.appDetail.error} />}

      {app && tenantsQuery.isSuccess && tenantsQuery.data.items.length === 0 && (
        <EmptyState title={dict.appDetail.empty.title} description={dict.appDetail.empty.description} />
      )}

      {app && tenantsQuery.isSuccess && tenantsQuery.data.items.length > 0 && (
        <Card className="overflow-hidden">
          <div className="flex flex-col">
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-3 border-b border-[var(--rule)] px-4 pb-3 pt-4 eyebrow">
              <div>{dict.appDetail.columns.tenant}</div>
              <div>{dict.appDetail.columns.members}</div>
              <div>{dict.appDetail.columns.created}</div>
            </div>
            {tenantsQuery.data.items.map((tenant) => (
              <div
                key={tenant.id}
                className="grid grid-cols-[2fr_1fr_1fr] items-center gap-3 border-b border-[var(--rule)] px-4 py-3.5 last:border-b-0"
              >
                <div>
                  <div className="text-sm font-semibold text-[var(--ink)]">{tenant.name}</div>
                  <div className="font-mono text-xs text-[var(--ink-3)]">{tenant.slug}</div>
                </div>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => setMembersTenant(tenant)}>
                    {dict.appDetail.viewMembers}
                  </Button>
                </div>
                <div className="text-sm text-[var(--ink-2)]">{formatDate(tenant.createdAt)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {app && (
        <CreateTenantDialog dict={dict} appId={app.id} open={createOpen} onOpenChange={setCreateOpen} />
      )}

      {membersTenant && (
        <TenantMembersDialog
          dict={dict}
          tenantId={membersTenant.id}
          tenantName={membersTenant.name}
          open={membersTenant !== null}
          onOpenChange={(open) => {
            if (!open) setMembersTenant(null);
          }}
        />
      )}
    </div>
  );
}

AdminAppDetailScreen.displayName = 'AdminAppDetailScreen';

export { AdminAppDetailScreen };
