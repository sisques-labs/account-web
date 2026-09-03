'use client';

import Link from 'next/link';
import { Card } from '@/shared/presentation/components/ui/card/card';
import { Badge } from '@/shared/presentation/components/ui/badge/badge';
import { buttonVariants } from '@/shared/presentation/components/ui/button/button-variants';
import { Skeleton } from '@/shared/presentation/components/ui/skeleton/skeleton';
import { Alert } from '@/shared/presentation/components/ui/alert/alert';
import { EmptyState } from '@/shared/presentation/components/ui/empty-state/empty-state';
import { useApps } from '@/core/tenancy/presentation/hooks/use-apps/useApps.hook';
import type { Locale } from '@/shared/presentation/i18n/locale';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminAppsScreenProps {
  dict: WidenStringLiterals<TenancyDict>;
  lang: Locale;
}

function AdminAppsScreen({ dict, lang }: AdminAppsScreenProps) {
  const appsQuery = useApps();

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      <h1 className="headline text-2xl">{dict.apps.title}</h1>

      {appsQuery.isLoading && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
          <Skeleton height={160} />
          <Skeleton height={160} />
        </div>
      )}

      {appsQuery.isError && <Alert variant="error" message={dict.apps.error} />}

      {appsQuery.isSuccess && appsQuery.data.items.length === 0 && (
        <EmptyState title={dict.apps.empty.title} description={dict.apps.empty.description} />
      )}

      {appsQuery.isSuccess && appsQuery.data.items.length > 0 && (
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
    </div>
  );
}

AdminAppsScreen.displayName = 'AdminAppsScreen';

export { AdminAppsScreen };
