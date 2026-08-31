import { create } from 'zustand';

/**
 * Holds only the access token. It lives in shared/ (not in a bounded context)
 * because axios.client.ts and apollo.client.ts need it before any context
 * exists. The first `auth` context you add should call setAccessToken()/
 * clearAccessToken() from its login/refresh/logout use-cases, and can keep
 * richer session data (current user, boot state, etc.) in its own
 * core/auth/infrastructure/store/auth.store.ts.
 */
interface SessionState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
  redirectToLogin: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
  redirectToLogin: () => {
    /* v8 ignore next -- SSR guard: window is always defined under jsdom */
    if (typeof window === 'undefined') return;
    const { pathname } = window.location;
    if (pathname.includes('/login')) return; // already on a login route — no loop
    const localePrefix = pathname.match(/^\/[a-z]{2}(?=\/|$)/)?.[0] ?? '';
    window.location.replace(`${localePrefix}/login`);
  },
}));

export const isAuthenticated = () => useSessionStore.getState().accessToken !== null;
