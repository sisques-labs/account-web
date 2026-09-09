import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { AdminSection } from '@/core/tenancy/presentation/components/admin-sidebar/admin-sidebar';
import { useIsPlatformAdmin } from '@/core/auth/presentation/hooks/use-is-platform-admin/useIsPlatformAdmin.hook';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import type { Locale } from '@/shared/presentation/i18n/locale';

export type AdminGuardStatus = 'pending' | 'unauthorized' | 'authorized';

export interface AdminGuardResult {
  status: AdminGuardStatus;
  active: AdminSection;
}

function resolveActiveSection(pathname: string): AdminSection {
  if (pathname.includes('/admin/users')) return 'users';
  if (pathname.includes('/admin/invites')) return 'invites';
  return 'apps';
}

/**
 * Gates the `/admin` route tree: waits for the app-wide session bootstrap
 * (see `useSessionBootstrap`) before deciding there's no session — a hard
 * reload starts with `accessToken: null` even for an already logged-in
 * visitor, since the session store isn't persisted — then redirects an
 * unauthenticated visitor to `/login` (carrying `redirectTo` so LoginScreen
 * can send them back here) or reports `unauthorized` for a signed-in
 * non-admin. Also resolves which admin section the current pathname maps
 * to, so `AdminShell` stays pure JSX driven by this hook's output.
 */
export function useAdminGuard(lang: Locale): AdminGuardResult {
  const hasBootstrapped = useSessionStore((state) => state.hasBootstrapped);
  const hasSession = useSessionStore((state) => state.accessToken !== null);
  const isPlatformAdmin = useIsPlatformAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const active = resolveActiveSection(pathname ?? '');

  useEffect(() => {
    if (!hasBootstrapped || hasSession) return;
    const redirectTo = pathname ? `?redirectTo=${encodeURIComponent(pathname)}` : '';
    router.replace(`/${lang}/login${redirectTo}`);
  }, [hasBootstrapped, hasSession, pathname, lang, router]);

  const status: AdminGuardStatus =
    !hasBootstrapped || !hasSession ? 'pending' : !isPlatformAdmin ? 'unauthorized' : 'authorized';

  return { status, active };
}
