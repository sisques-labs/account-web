import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApolloLink, Observable } from '@apollo/client';
import type { FetchResult } from '@apollo/client';
import { gql } from '@apollo/client';

// ──────────────────────────────────────────────
// Mocks — declared before any module import
// ──────────────────────────────────────────────

vi.mock('@/shared/infrastructure/store/session.store', () => ({
  useSessionStore: {
    getState: vi.fn(),
  },
}));

vi.mock('./refresh-mutex', () => ({
  refreshTokenOnce: vi.fn(),
}));

vi.mock('./http-logger', () => ({
  logHttpError: vi.fn(),
}));

vi.mock('@/shared/infrastructure/http/axios.client', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/shared/infrastructure/http/axios.client')>();
  return {
    ...original,
    doRefresh: vi.fn().mockResolvedValue('refreshed-token'),
    bareHttp: {
      post: vi.fn().mockResolvedValue({ data: { accessToken: 'refreshed-token' } }),
    },
  };
});

// ──────────────────────────────────────────────
// Imports after mocks
// ──────────────────────────────────────────────
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import { refreshTokenOnce } from './refresh-mutex';
import { doRefresh } from '@/shared/infrastructure/http/axios.client';
import { logHttpError } from './http-logger';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const TEST_QUERY = gql`
  query Test {
    test
  }
`;

// Apollo v4 requires a { client } context in ApolloLink.execute.
// The ErrorLink accesses client.queryManager.incrementalHandler for graphQL error detection.
const FAKE_INCREMENTAL_HANDLER = {
  isIncrementalResult: () => false,
  extractErrors: () => [],
};
const FAKE_CLIENT_CTX = {
  client: {
    queryManager: {
      incrementalHandler: FAKE_INCREMENTAL_HANDLER,
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};

/** Creates a terminating ApolloLink that captures context and returns success */
function captureContextLink(): { link: ApolloLink; captured: { headers: Record<string, string> } } {
  const captured = { headers: {} as Record<string, string> };
  const link = new ApolloLink((operation) => {
    const ctx = operation.getContext();
    captured.headers = ctx.headers ?? {};
    return new Observable<FetchResult>((observer) => {
      observer.next({ data: { test: true } });
      observer.complete();
    });
  });
  return { link, captured };
}

function executeLink(link: ApolloLink): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ApolloLink.execute(link, { query: TEST_QUERY }, FAKE_CLIENT_CTX).subscribe({
      next: () => {},
      error: reject,
      complete: resolve,
    });
  });
}

function executeLinkCollect(link: ApolloLink): Promise<FetchResult[]> {
  return new Promise<FetchResult[]>((resolve, reject) => {
    const results: FetchResult[] = [];
    ApolloLink.execute(link, { query: TEST_QUERY }, FAKE_CLIENT_CTX).subscribe({
      next: (v) => results.push(v),
      error: reject,
      complete: () => resolve(results),
    });
  });
}

// ──────────────────────────────────────────────
// Session store mock state helpers
// ──────────────────────────────────────────────
function mockSessionStore(
  accessToken: string | null,
  clearAccessToken = vi.fn(),
  redirectToLogin = vi.fn(),
) {
  vi.mocked(useSessionStore.getState).mockReturnValue({
    accessToken,
    clearAccessToken,
    redirectToLogin,
    setAccessToken: vi.fn(),
  });
}

// ──────────────────────────────────────────────
// doRefresh is exported from axios.client
// ──────────────────────────────────────────────
describe('axios.client — doRefresh export', () => {
  it('exports doRefresh as a function', () => {
    expect(typeof doRefresh).toBe('function');
  });
});

// ──────────────────────────────────────────────
// authLink
// ──────────────────────────────────────────────
describe('authLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets Authorization header when accessToken is present', async () => {
    mockSessionStore('tok123');

    const { authLink } = await import('./apollo.client');
    const { link: terminal, captured } = captureContextLink();
    const chain = ApolloLink.from([authLink, terminal]);

    await executeLink(chain);

    expect(captured.headers['Authorization']).toBe('Bearer tok123');
  });

  it('omits Authorization header when accessToken is null', async () => {
    mockSessionStore(null);

    const { authLink } = await import('./apollo.client');
    const { link: terminal, captured } = captureContextLink();
    const chain = ApolloLink.from([authLink, terminal]);

    await executeLink(chain);

    expect(captured.headers['Authorization']).toBeUndefined();
  });
});

// ──────────────────────────────────────────────
// onErrorLink — token refresh + retry
// ──────────────────────────────────────────────
describe('onErrorLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls refreshTokenOnce on 401 networkError and retries once', async () => {
    const clearAccessToken = vi.fn();
    const redirectToLogin = vi.fn();
    mockSessionStore(null, clearAccessToken, redirectToLogin);
    vi.mocked(refreshTokenOnce).mockResolvedValue('new-token');

    const { onErrorLink } = await import('./apollo.client');

    // First call → 401; second call (retry) → capture context and succeed
    let callCount = 0;
    let retryHeaders: Record<string, string> = {};
    const stubLink = new ApolloLink((operation) =>
      new Observable<FetchResult>((observer) => {
        callCount++;
        if (callCount === 1) {
          observer.error(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
        } else {
          retryHeaders = operation.getContext().headers ?? {};
          observer.next({ data: { test: true } });
          observer.complete();
        }
      }),
    );

    const chain = ApolloLink.from([onErrorLink, stubLink]);
    const results = await executeLinkCollect(chain);

    expect(refreshTokenOnce).toHaveBeenCalledOnce();
    expect(clearAccessToken).not.toHaveBeenCalled();
    expect(redirectToLogin).not.toHaveBeenCalled();
    expect(results).toHaveLength(1);
    expect(retryHeaders['Authorization']).toBe('Bearer new-token');
  });

  it('calls clearAccessToken and propagates error when refresh returns null', async () => {
    const clearAccessToken = vi.fn();
    const redirectToLogin = vi.fn();
    mockSessionStore(null, clearAccessToken, redirectToLogin);
    vi.mocked(refreshTokenOnce).mockResolvedValue(null);

    const { onErrorLink } = await import('./apollo.client');

    const stubLink = new ApolloLink(() =>
      new Observable<FetchResult>((observer) => {
        observer.error(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
      }),
    );

    const chain = ApolloLink.from([onErrorLink, stubLink]);

    await expect(executeLinkCollect(chain)).rejects.toBeDefined();

    expect(clearAccessToken).toHaveBeenCalledOnce();
    expect(redirectToLogin).toHaveBeenCalledOnce();
  });

  it('does not retry when __retried is already set in context', async () => {
    const clearAccessToken = vi.fn();
    mockSessionStore(null, clearAccessToken);
    vi.mocked(refreshTokenOnce).mockResolvedValue('new-token');

    const { onErrorLink } = await import('./apollo.client');

    // Always returns 401
    const stubLink = new ApolloLink(() =>
      new Observable<FetchResult>((observer) => {
        observer.error(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
      }),
    );

    // Set __retried via a preceding link
    const setRetriedLink = new ApolloLink((operation, forward) => {
      operation.setContext({ __retried: true });
      return forward!(operation);
    });

    const chain = ApolloLink.from([setRetriedLink, onErrorLink, stubLink]);

    await expect(executeLinkCollect(chain)).rejects.toBeDefined();

    // refreshTokenOnce must NOT be called — guard kicked in
    expect(refreshTokenOnce).not.toHaveBeenCalled();
  });

  it('handles concurrent 401 errors — both chains retry and succeed', async () => {
    // Note: actual dedup (one refresh for N concurrent 401s) is enforced by the
    // refreshTokenOnce mutex and tested in refresh-mutex.spec.ts. Here we verify
    // that the link correctly handles concurrent 401s and retries both operations.
    const clearAccessToken = vi.fn();
    mockSessionStore(null, clearAccessToken);
    vi.mocked(refreshTokenOnce).mockResolvedValue('new-token');

    const { onErrorLink } = await import('./apollo.client');

    const callCounts = [0, 0];
    function make401ThenSuccessLink(idx: number) {
      return new ApolloLink(() =>
        new Observable<FetchResult>((observer) => {
          callCounts[idx]++;
          if (callCounts[idx] === 1) {
            observer.error(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
          } else {
            observer.next({ data: { test: true } });
            observer.complete();
          }
        }),
      );
    }

    const chain1 = ApolloLink.from([onErrorLink, make401ThenSuccessLink(0)]);
    const chain2 = ApolloLink.from([onErrorLink, make401ThenSuccessLink(1)]);

    const [r1, r2] = await Promise.all([executeLinkCollect(chain1), executeLinkCollect(chain2)]);

    expect(refreshTokenOnce).toHaveBeenCalled();
    expect(clearAccessToken).not.toHaveBeenCalled();
    expect(r1).toHaveLength(1);
    expect(r2).toHaveLength(1);
  });

  it('handles UNAUTHENTICATED graphQLError and retries with fresh token', async () => {
    const clearAccessToken = vi.fn();
    mockSessionStore(null, clearAccessToken);
    vi.mocked(refreshTokenOnce).mockResolvedValue('new-token');

    const { onErrorLink } = await import('./apollo.client');

    let callCount = 0;
    let retryHeaders: Record<string, string> = {};
    const stubLink = new ApolloLink((operation) =>
      new Observable<FetchResult>((observer) => {
        callCount++;
        if (callCount === 1) {
          observer.next({
            data: null,
            errors: [
              {
                message: 'Unauthorized',
                extensions: { code: 'UNAUTHENTICATED' },
                locations: undefined,
                path: undefined,
                nodes: undefined,
                source: undefined,
                positions: undefined,
                originalError: undefined,
                name: 'GraphQLError',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any,
            ],
          });
          observer.complete();
        } else {
          retryHeaders = operation.getContext().headers ?? {};
          observer.next({ data: { test: true } });
          observer.complete();
        }
      }),
    );

    const chain = ApolloLink.from([onErrorLink, stubLink]);
    await executeLinkCollect(chain);

    expect(refreshTokenOnce).toHaveBeenCalledOnce();
    expect(retryHeaders['Authorization']).toBe('Bearer new-token');
  });
});

// ──────────────────────────────────────────────
// loggingLink
// ──────────────────────────────────────────────
describe('loggingLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStore(null);
  });

  it('does not call logHttpError on successful operation', async () => {
    const { loggingLink } = await import('./apollo.client');
    const terminal = new ApolloLink(() =>
      new Observable<FetchResult>((observer) => {
        observer.next({ data: { test: true } });
        observer.complete();
      }),
    );

    const chain = ApolloLink.from([loggingLink, terminal]);
    await executeLinkCollect(chain);

    expect(vi.mocked(logHttpError)).not.toHaveBeenCalled();
  });

  it('calls logHttpError with status and durationMs on error', async () => {
    const { loggingLink } = await import('./apollo.client');
    const terminal = new ApolloLink(() =>
      new Observable<FetchResult>((observer) => {
        observer.error(Object.assign(new Error('Server Error'), { statusCode: 500 }));
      }),
    );

    const chain = ApolloLink.from([loggingLink, terminal]);
    await expect(executeLinkCollect(chain)).rejects.toBeDefined();

    expect(vi.mocked(logHttpError)).toHaveBeenCalledOnce();
    const [log] = vi.mocked(logHttpError).mock.calls[0];
    expect(log.status).toBe(500);
    expect(log.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('calls logHttpError with undefined status on timeout (AbortError)', async () => {
    const { loggingLink } = await import('./apollo.client');
    const terminal = new ApolloLink(() =>
      new Observable<FetchResult>((observer) => {
        const err = new DOMException('The operation was aborted.', 'AbortError');
        observer.error(err);
      }),
    );

    const chain = ApolloLink.from([loggingLink, terminal]);
    await expect(executeLinkCollect(chain)).rejects.toBeDefined();

    expect(vi.mocked(logHttpError)).toHaveBeenCalledOnce();
    const [log] = vi.mocked(logHttpError).mock.calls[0];
    expect(log.status).toBeUndefined();
  });
});

// ──────────────────────────────────────────────
// fetchWithTimeout
// ──────────────────────────────────────────────
describe('fetchWithTimeout', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.fetch = originalFetch;
  });

  it('forwards the request and resolves with the fetch response', async () => {
    const response = new Response('ok');
    globalThis.fetch = vi.fn().mockResolvedValue(response);

    const { fetchWithTimeout } = await import('./apollo.client');
    const result = await fetchWithTimeout('https://example.com/graphql');

    expect(result).toBe(response);
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  it('aborts the request once the timeout elapses', async () => {
    let signal: AbortSignal | undefined;
    globalThis.fetch = vi.fn((_input, init) => {
      signal = (init as RequestInit).signal ?? undefined;
      return new Promise<Response>(() => {}); // never resolves — simulates a hung request
    });

    const { fetchWithTimeout } = await import('./apollo.client');
    void fetchWithTimeout('https://example.com/graphql');

    expect(signal?.aborted).toBe(false);
    await vi.runOnlyPendingTimersAsync();
    expect(signal?.aborted).toBe(true);
  });
});
