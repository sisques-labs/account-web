'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AdminSidebar } from '@/core/tenancy/presentation/components/admin-sidebar/admin-sidebar';
import { useAdminGuard } from '@/core/tenancy/presentation/hooks/use-admin-guard/useAdminGuard.hook';
import type { Locale } from '@/shared/presentation/i18n/locale';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminShellProps {
  lang: Locale;
  dict: WidenStringLiterals<TenancyDict>;
  children: React.ReactNode;
}

/**
 * Lets a page rendered inside AdminShell inject an action (e.g. "Crear app")
 * into the shared top bar, next to the section title — matching the
 * canvas's TopBar `actions` slot. Setting state here only re-renders
 * AdminShell's own JSX, not the `children` subtree (React bails out of
 * re-rendering a subtree when the exact same element reference is passed
 * through again), so a screen's `useAdminTopBarActions` effect re-running
 * on every AdminShell re-render can't spiral into a loop.
 */
const AdminTopBarActionsContext = createContext<(node: React.ReactNode) => void>(() => {});

export function useAdminTopBarActions(node: React.ReactNode): void {
  const setActions = useContext(AdminTopBarActionsContext);
  useEffect(() => {
    setActions(node);
    return () => setActions(null);
  }, [node, setActions]);
}

/**
 * Minimal stand-in for AdminShell's top-bar slot, for unit tests and
 * Storybook stories of a screen that calls `useAdminTopBarActions` in
 * isolation (without mounting the full gated AdminShell). Renders whatever
 * the screen injects into a `data-testid="admin-top-bar-actions"` node
 * above `children`, the same way AdminShell's real top bar does.
 */
export function AdminTopBarActionsHost({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<React.ReactNode>(null);
  return (
    <AdminTopBarActionsContext.Provider value={setActions}>
      <div data-testid="admin-top-bar-actions">{actions}</div>
      {children}
    </AdminTopBarActionsContext.Provider>
  );
}

function AdminShell({ lang, dict, children }: AdminShellProps) {
  // Auth-guard logic (session bootstrap gating, the login redirect, and
  // resolving which admin section is active) lives entirely in
  // useAdminGuard — this component is pure JSX driven by its output. See
  // that hook for why the redirect waits on `hasBootstrapped` and why a
  // signed-in non-admin gets "unauthorized" instead of being redirected.
  const { status, active } = useAdminGuard(lang);
  const [topBarActions, setTopBarActions] = useState<React.ReactNode>(null);

  if (status === 'pending') {
    return null;
  }

  if (status === 'unauthorized') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="headline text-xl">{dict.admin.unauthorized.title}</h1>
        <p className="text-sm text-[var(--ink-3)]">{dict.admin.unauthorized.description}</p>
      </div>
    );
  }

  return (
    // h-screen (not h-full) pins this to the viewport height directly —
    // h-full alone depended on an ambiguous ancestor height chain (body only
    // sets min-height, not height), which was cutting the sidebar's
    // border-right short of the full viewport.
    <div className="flex h-screen w-full overflow-hidden">
      <AdminSidebar lang={lang} dict={dict} active={active} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--rule)] px-6">
          <span className="text-sm font-semibold text-[var(--ink)]">{dict.admin.nav[active]}</span>
          {topBarActions}
        </div>
        <div className="flex-1 overflow-auto p-6">
          <AdminTopBarActionsContext.Provider value={setTopBarActions}>{children}</AdminTopBarActionsContext.Provider>
        </div>
      </div>
    </div>
  );
}

AdminShell.displayName = 'AdminShell';

export { AdminShell };
