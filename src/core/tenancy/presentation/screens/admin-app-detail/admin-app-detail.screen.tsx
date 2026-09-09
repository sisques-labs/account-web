'use client';

import { useState } from 'react';
import { Card } from '@/shared/presentation/components/ui/card/card';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { EmptyState } from '@/shared/presentation/components/ui/empty-state/empty-state';
import { useAppBySlug } from '@/core/app/presentation/hooks/use-app-by-slug/useAppBySlug.hook';
import { useTenantsByApp } from '@/core/tenancy/presentation/hooks/use-tenants-by-app/useTenantsByApp.hook';
import { CreateTenantDialog } from '@/core/tenancy/presentation/components/create-tenant-dialog/create-tenant-dialog';
import { TenantMembersDialog } from '@/core/tenancy/presentation/components/tenant-members-dialog/tenant-members-dialog';
import { useAdminTopBarActions } from '@/core/tenancy/presentation/hooks/use-admin-top-bar-actions/useAdminTopBarActions.hook';
import { formatDate } from '@/shared/lib/format-date';
import type { App } from '@/core/app/domain/interfaces/app.interface';
import type { Tenant } from '@/core/tenancy/domain/interfaces/tenant.interface';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminAppDetailScreenProps {
  dict: WidenStringLiterals<TenancyDict>;
  appSlug: string;
}

function AdminAppDetailScreen({ dict, appSlug }: AdminAppDetailScreenProps) {
  // Suspends while loading and throws on error — the page's <Suspense>
  // (AdminAppDetailSkeleton) and app/[lang]/admin/error.tsx cover those
  // cases, so this screen only ever renders success. `app` is undefined
  // when there is no error but the slug genuinely doesn't match any app.
  const { app } = useAppBySlug(appSlug);
  const [createOpen, setCreateOpen] = useState(false);

  // "Crear tenant" lives in AdminShell's shared top bar, next to the
  // section title, rather than duplicated inside the page body.
  useAdminTopBarActions(
    app ? <Button onClick={() => setCreateOpen(true)}>{dict.appDetail.createTenant}</Button> : null,
  );

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-5">
      {/* This title shows the specific app's name — genuinely different
          information from AdminShell's generic "Apps del ecosistema"
          section label in the top bar, so it isn't a duplicate. */}
      <h1 className="headline text-2xl">{app?.name ?? appSlug}</h1>

      {app ? (
        <AdminAppDetailBody dict={dict} app={app} createOpen={createOpen} onCreateOpenChange={setCreateOpen} />
      ) : (
        <EmptyState title={dict.appDetail.notFound.title} description={dict.appDetail.notFound.description} />
      )}
    </div>
  );
}

interface AdminAppDetailBodyProps {
  dict: WidenStringLiterals<TenancyDict>;
  app: App;
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}

/**
 * Only mounts once AdminAppDetailScreen has confirmed `app` exists, so
 * useTenantsByApp (a useSuspenseQuery) always gets a real appId — that
 * hook type doesn't support an `enabled` guard for a not-yet-known id.
 */
function AdminAppDetailBody({ dict, app, createOpen, onCreateOpenChange }: AdminAppDetailBodyProps) {
  const tenantsQuery = useTenantsByApp(app.id);
  const [membersTenant, setMembersTenant] = useState<Tenant | null>(null);

  return (
    <>
      {tenantsQuery.data.items.length === 0 && (
        <EmptyState title={dict.appDetail.empty.title} description={dict.appDetail.empty.description} />
      )}

      {tenantsQuery.data.items.length > 0 && (
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

      <CreateTenantDialog dict={dict} appId={app.id} open={createOpen} onOpenChange={onCreateOpenChange} />

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
    </>
  );
}

AdminAppDetailScreen.displayName = 'AdminAppDetailScreen';

export { AdminAppDetailScreen };
