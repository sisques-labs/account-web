'use client';

import { AdminSidebar } from '@/core/tenancy/presentation/components/admin-sidebar/admin-sidebar';
import { useAdminGuard } from '@/core/tenancy/presentation/hooks/use-admin-guard/useAdminGuard.hook';
import { useAdminTopBarStore } from '@/core/tenancy/infrastructure/store/admin-top-bar.store';
import type { Locale } from '@/shared/presentation/i18n/locale';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminShellProps {
  lang: Locale;
  dict: WidenStringLiterals<TenancyDict>;
  children: React.ReactNode;
}

function AdminShell({ lang, dict, children }: AdminShellProps) {
  // Auth-guard logic (session bootstrap gating, the login redirect, and
  // resolving which admin section is active) lives entirely in
  // useAdminGuard — this component is pure JSX driven by its output. See
  // that hook for why the redirect waits on `hasBootstrapped` and why a
  // signed-in non-admin gets "unauthorized" instead of being redirected.
  const { status, active } = useAdminGuard(lang);
  // A screen nested arbitrarily deep under `children` injects its top-bar
  // action (e.g. "Crear app") via useAdminTopBarActions, which writes to
  // this same store — see admin-top-bar.store.ts for why that's a Zustand
  // store rather than a useState + React Context.
  const topBarActions = useAdminTopBarStore((state) => state.actions);

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
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}

AdminShell.displayName = 'AdminShell';

export { AdminShell };
