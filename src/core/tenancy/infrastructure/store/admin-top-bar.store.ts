import type { ReactNode } from 'react';
import { create } from 'zustand';

/**
 * Holds whatever action a screen rendered inside AdminShell wants to inject
 * into the shared top bar, next to the section title (e.g. "Crear app") —
 * see useAdminTopBarActions. A plain Zustand store rather than a
 * useState + React Context, so AdminShell doesn't need to wrap `children`
 * in a Provider just to plumb a setter down to an arbitrarily nested
 * screen.
 */
interface AdminTopBarState {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
}

export const useAdminTopBarStore = create<AdminTopBarState>()((set) => ({
  actions: null,
  setActions: (actions) => set({ actions }),
}));
