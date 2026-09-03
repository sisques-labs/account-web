import { Card } from '@/shared/presentation/components/ui/card/card';
import { EmptyState } from '@/shared/presentation/components/ui/empty-state/empty-state';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminUsersScreenProps {
  dict: WidenStringLiterals<TenancyDict>;
}

function AdminUsersScreen({ dict }: AdminUsersScreenProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[2.4fr_1fr_1fr_1fr] gap-3 border-b border-[var(--rule)] px-4 pb-3 pt-4 eyebrow">
          <div>{dict.users.columns.user}</div>
          <div>{dict.users.columns.platformAdmin}</div>
          <div>{dict.users.columns.tenants}</div>
          <div>{dict.users.columns.since}</div>
        </div>
        <EmptyState title={dict.users.unavailable.title} description={dict.users.unavailable.description} />
      </Card>
    </div>
  );
}

AdminUsersScreen.displayName = 'AdminUsersScreen';

export { AdminUsersScreen };
