'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar, type AdminSection } from '@/core/tenancy/presentation/components/admin-sidebar/admin-sidebar';
import { useIsPlatformAdmin } from '@/core/auth/presentation/hooks/use-is-platform-admin/useIsPlatformAdmin.hook';
import type { Locale } from '@/shared/presentation/i18n/locale';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface AdminShellProps {
  lang: Locale;
  dict: WidenStringLiterals<TenancyDict>;
  children: React.ReactNode;
}

function resolveActiveSection(pathname: string): AdminSection {
  if (pathname.includes('/admin/users')) return 'users';
  if (pathname.includes('/admin/invites')) return 'invites';
  return 'apps';
}

function AdminShell({ lang, dict, children }: AdminShellProps) {
  const isPlatformAdmin = useIsPlatformAdmin();
  const pathname = usePathname();
  const active = resolveActiveSection(pathname ?? '');

  if (!isPlatformAdmin) {
    return (
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="headline text-xl">{dict.admin.unauthorized.title}</h1>
        <p className="text-sm text-[var(--ink-3)]">{dict.admin.unauthorized.description}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 overflow-hidden">
      <AdminSidebar lang={lang} dict={dict} active={active} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center border-b border-[var(--rule)] px-6">
          <span className="text-sm font-semibold text-[var(--ink)]">{dict.admin.nav[active]}</span>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}

AdminShell.displayName = 'AdminShell';

export { AdminShell };
