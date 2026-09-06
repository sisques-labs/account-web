import type { ReactNode } from 'react';
import { useAdminTopBarStore } from '@/core/tenancy/infrastructure/store/admin-top-bar.store';

export interface AdminTopBarActionsHostProps {
  children: ReactNode;
}

/**
 * Minimal stand-in for AdminShell's top-bar slot, for unit tests and
 * Storybook stories of a screen that calls `useAdminTopBarActions` in
 * isolation (without mounting the full gated AdminShell). Renders whatever
 * the screen injects into a `data-testid="admin-top-bar-actions"` node
 * above `children`, the same way AdminShell's real top bar does.
 */
function AdminTopBarActionsHost({ children }: AdminTopBarActionsHostProps) {
  const actions = useAdminTopBarStore((state) => state.actions);

  return (
    <>
      <div data-testid="admin-top-bar-actions">{actions}</div>
      {children}
    </>
  );
}

AdminTopBarActionsHost.displayName = 'AdminTopBarActionsHost';

export { AdminTopBarActionsHost };
