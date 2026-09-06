'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/presentation/components/ui/card/card';
import { Badge } from '@/shared/presentation/components/ui/badge/badge';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { buttonVariants } from '@/shared/presentation/components/ui/button/button-variants';
import { EmptyState } from '@/shared/presentation/components/ui/empty-state/empty-state';
import { useApps } from '@/core/app/presentation/hooks/use-apps/useApps.hook';
import { CreateAppDialog } from '@/core/app/presentation/components/create-app-dialog/create-app-dialog';
import { useAdminTopBarActions } from '@/core/tenancy/presentation/hooks/use-admin-top-bar-actions/useAdminTopBarActions.hook';
import type { Locale } from '@/shared/presentation/i18n/locale';
import type { AppDict } from '@/core/app/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminAppsScreenProps {
  dict: WidenStringLiterals<AppDict>;
  lang: Locale;
}

function AdminAppsScreen({ dict, lang }: AdminAppsScreenProps) {
  // Suspends while loading and throws on error — the page's <Suspense>
  // (AdminAppsSkeleton) and app/[lang]/admin/error.tsx cover those cases,
  // so this screen only ever renders the success state.
  const appsQuery = useApps();
  const [createOpen, setCreateOpen] = useState(false);

  // Injects the "Crear app" action into AdminShell's shared top bar, next to
  // the section title — the page body itself carries no title/header of its
  // own, avoiding a duplicate with the top bar.
  useAdminTopBarActions(<Button onClick={() => setCreateOpen(true)}>{dict.apps.createApp}</Button>);

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-6">
      {appsQuery.data.items.length === 0 && (
        <EmptyState title={dict.apps.empty.title} description={dict.apps.empty.description} />
      )}

      {appsQuery.data.items.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
          {appsQuery.data.items.map((app) => (
            <Card key={app.id} className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--forest-bg)] text-base font-bold text-[var(--forest)]">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-base font-semibold text-[var(--ink)]">{app.name}</div>
                  </div>
                  <Badge variant="forest">{dict.apps.connected}</Badge>
                </div>
                <Link
                  href={`/${lang}/admin/apps/${app.slug}`}
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  {dict.apps.viewTenants}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateAppDialog dict={dict} open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

AdminAppsScreen.displayName = 'AdminAppsScreen';

export { AdminAppsScreen };
