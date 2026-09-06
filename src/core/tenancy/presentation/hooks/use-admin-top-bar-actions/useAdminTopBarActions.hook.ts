import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAdminTopBarStore } from '@/core/tenancy/infrastructure/store/admin-top-bar.store';

/**
 * Lets a screen rendered inside AdminShell inject an action (e.g. "Crear
 * app") into the shared top bar, next to the section title — matching the
 * canvas's TopBar `actions` slot.
 */
export function useAdminTopBarActions(node: ReactNode): void {
  const setActions = useAdminTopBarStore((state) => state.setActions);

  useEffect(() => {
    setActions(node);
    return () => setActions(null);
  }, [node, setActions]);
}
