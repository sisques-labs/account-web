import { ApolloClient, ApolloLink, InMemoryCache, Observable, createHttpLink, from } from '@apollo/client';
import type { FetchResult } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import { refreshTokenOnce } from './refresh-mutex';
import { doRefresh } from '@/shared/infrastructure/http/axios.client';
import { GRAPHQL_URL, HTTP_TIMEOUT_MS } from '@/shared/config/env';
import { logHttpError } from './http-logger';

// ── fetchWithTimeout ────────────────────────────────────────────────────────
export function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(id));
}

// ── httpLink ────────────────────────────────────────────────────────────────
const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include',
  fetch: fetchWithTimeout,
});

// ── authLink ────────────────────────────────────────────────────────────────
// Reads accessToken at request time (rotation-safe). Omits header when null.
export const authLink: ApolloLink = setContext((_, previousContext) => {
  const token = useSessionStore.getState().accessToken;
  if (!token) return previousContext;
  return {
    ...previousContext,
    headers: {
      ...(previousContext.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  };
});

// ── onErrorLink ─────────────────────────────────────────────────────────────
// On 401 / UNAUTHENTICATED: refresh once via mutex, retry. On failure: logout.
// __retried guard prevents infinite loop.
function isUnauthorizedError(error: unknown): boolean {
  if (ServerError.is(error) && error.statusCode === 401) return true;
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED');
  }
  // Fallback: plain error object with statusCode (e.g. from tests)
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as { statusCode: number }).statusCode === 401;
  }
  return false;
}

export const onErrorLink: ApolloLink = new ErrorLink(({ error, operation, forward }) => {
  if (!isUnauthorizedError(error)) return;

  const ctx = operation.getContext();
  if (ctx.__retried) return;

  return new Observable<FetchResult>((observer) => {
    refreshTokenOnce(doRefresh)
      .then((token) => {
        if (!token) {
          useSessionStore.getState().clearAccessToken();
          useSessionStore.getState().redirectToLogin();
          observer.error(error);
          return;
        }
        operation.setContext({
          ...ctx,
          __retried: true,
          headers: { ...(ctx.headers ?? {}), Authorization: `Bearer ${token}` },
        });
        const sub = forward(operation).subscribe({
          next: (v) => observer.next(v),
          error: (e) => observer.error(e),
          complete: () => observer.complete(),
        });
        return () => sub.unsubscribe();
      })
      .catch((err) => observer.error(err));
  });
});

// ── loggingLink ─────────────────────────────────────────────────────────────
// Logs non-recoverable HTTP errors (after onErrorLink has had a chance to retry).
export const loggingLink: ApolloLink = new ApolloLink((operation, forward) => {
  const startTime = Date.now();
  return new Observable<FetchResult>((observer) => {
    const sub = forward(operation).subscribe({
      next: (value) => observer.next(value),
      error: (err) => {
        logHttpError({
          status: (err as { statusCode?: number }).statusCode,
          url: GRAPHQL_URL,
          durationMs: Date.now() - startTime,
        });
        observer.error(err);
      },
      complete: () => observer.complete(),
    });
    return () => sub.unsubscribe();
  });
});

// ── Apollo client — link order: authLink → onErrorLink → loggingLink → httpLink
export const apolloClient = new ApolloClient({
  link: from([authLink, onErrorLink, loggingLink, httpLink]),
  cache: new InMemoryCache(),
});
