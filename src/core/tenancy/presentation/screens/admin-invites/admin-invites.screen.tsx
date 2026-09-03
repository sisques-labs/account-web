import { Card } from '@/shared/presentation/components/ui/card/card';
import { EmptyState } from '@/shared/presentation/components/ui/empty-state/empty-state';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminInvitesScreenProps {
  dict: WidenStringLiterals<TenancyDict>;
}

function AdminInvitesScreen({ dict }: AdminInvitesScreenProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_0.8fr_1.2fr_1fr] gap-3 border-b border-[var(--rule)] px-4 pb-3 pt-4 eyebrow">
          <div>{dict.invites.columns.email}</div>
          <div>{dict.invites.columns.tenant}</div>
          <div>{dict.invites.columns.role}</div>
          <div>{dict.invites.columns.invitedBy}</div>
          <div>{dict.invites.columns.expires}</div>
        </div>
        <EmptyState title={dict.invites.unavailable.title} description={dict.invites.unavailable.description} />
      </Card>
    </div>
  );
}

AdminInvitesScreen.displayName = 'AdminInvitesScreen';

export { AdminInvitesScreen };
