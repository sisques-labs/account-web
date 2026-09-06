import { useEffect } from 'react';
import { doRefresh } from '@/shared/infrastructure/http/axios.client';
import { refreshTokenOnce } from '@/shared/infrastructure/http/refresh-mutex';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';

/**
 * Attempts a single silent session bootstrap on app mount. The access token
 * lives only in the in-memory session store (no persistence — see
 * `session.store.ts`), so a hard page reload resets it to null even though
 * the httpOnly `refresh_token` cookie set by account-api is still valid.
 * Without this, a gated route like AdminShell would see `accessToken: null`
 * immediately on mount and redirect to `/login` before ever giving the
 * refresh cookie a chance — the exact bug this hook exists to close.
 *
 * If there's already an access token (a client-side navigation, not a
 * reload), bootstrap is trivially "done". Otherwise it exchanges the
 * refresh cookie for a fresh access token via `doRefresh()` — succeeding
 * silently when the cookie is valid, failing silently (genuinely logged
 * out) when it isn't. Routed through `refreshTokenOnce` so a concurrent
 * reactive 401 refresh (or React StrictMode's double-invoked effect in dev)
 * shares the same in-flight request instead of firing twice.
 *
 * Call this once near the root (see `shared/presentation/providers`).
 * Gated routes read `hasBootstrapped` off the session store to know when
 * it's safe to decide whether to redirect — see `admin-shell.tsx`.
 */
export function useSessionBootstrap(): void {
  useEffect(() => {
    const { accessToken, hasBootstrapped, setHasBootstrapped } = useSessionStore.getState();
    if (hasBootstrapped) return;

    if (accessToken !== null) {
      setHasBootstrapped();
      return;
    }

    let cancelled = false;
    void refreshTokenOnce(doRefresh).finally(() => {
      if (!cancelled) setHasBootstrapped();
    });

    return () => {
      cancelled = true;
    };
  }, []);
}
