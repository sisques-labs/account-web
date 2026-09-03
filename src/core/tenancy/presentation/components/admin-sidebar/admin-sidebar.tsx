import Link from 'next/link';
import { LayoutGrid, Users, Mail } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Logomark } from '@/shared/presentation/components/ui/logomark/logomark';
import type { Locale } from '@/shared/presentation/i18n/locale';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export type AdminSection = 'apps' | 'users' | 'invites';

export interface AdminSidebarProps {
  lang: Locale;
  dict: WidenStringLiterals<TenancyDict>;
  active: AdminSection;
}

const NAV_ITEMS: { section: AdminSection; href: (lang: Locale) => string; icon: typeof LayoutGrid }[] = [
  { section: 'apps', href: (lang) => `/${lang}/admin/apps`, icon: LayoutGrid },
  { section: 'users', href: (lang) => `/${lang}/admin/users`, icon: Users },
  { section: 'invites', href: (lang) => `/${lang}/admin/invites`, icon: Mail },
];

function AdminSidebar({ lang, dict, active }: AdminSidebarProps) {
  return (
    <nav
      aria-label="Admin"
      className="flex h-full w-[220px] shrink-0 flex-col border-r border-[var(--rule)] bg-[var(--paper)]"
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-[var(--rule)] px-5">
        <Logomark size={26} />
        <div className="text-sm font-bold leading-tight text-[var(--ink)]">
          Sisqués Labs <span className="font-medium text-[var(--ink-2)]">Platform</span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        {NAV_ITEMS.map(({ section, href, icon: Icon }) => {
          const isActive = section === active;
          return (
            <Link
              key={section}
              href={href(lang)}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--forest-bg)] text-[var(--forest)]'
                  : 'text-[var(--ink-2)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              {dict.admin.nav[section]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

AdminSidebar.displayName = 'AdminSidebar';

export { AdminSidebar };
