import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { internalUrl, proxyTo } from './proxy';

function request(path: string, init?: { method?: string }) {
  return new NextRequest(new URL(path, 'http://localhost:3001'), init);
}

describe('proxyTo', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('forwards every Set-Cookie header from the upstream response', async () => {
    const setCookies = ['refresh_token=abc; HttpOnly; Path=/', 'other=xyz; Path=/'];

    // Mirrors real fetch() semantics: Set-Cookie is excluded from forEach on
    // a network response (only getSetCookie() exposes it) — a manually
    // constructed `new Response()` does NOT reproduce that guard, so it
    // can't stand in for the real bug here.
    const upstreamHeaders = {
      forEach: (cb: (value: string, key: string) => void) => {
        cb('application/json', 'content-type');
      },
      getSetCookie: () => setCookies,
    } as unknown as Headers;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 200, body: null, headers: upstreamHeaders } as Response),
    );

    const res = await proxyTo(
      request('/api/auth/register', { method: 'POST' }),
      internalUrl('/api/auth/register'),
    );

    expect(res.headers.getSetCookie()).toEqual(setCookies);
  });

  it('strips hop-by-hop and host headers before forwarding the request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      body: null,
      headers: { forEach: () => {}, getSetCookie: () => [] } as unknown as Headers,
    } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const req = request('/api/plants', { method: 'GET' });
    req.headers.set('connection', 'keep-alive');
    req.headers.set('x-custom', 'keep-me');

    await proxyTo(req, internalUrl('/api/plants'));

    const [, init] = fetchMock.mock.calls[0];
    const forwardedHeaders = init.headers as Headers;
    expect(forwardedHeaders.has('connection')).toBe(false);
    expect(forwardedHeaders.has('host')).toBe(false);
    expect(forwardedHeaders.get('x-custom')).toBe('keep-me');
  });

  it('omits the request body and duplex option for GET requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      body: null,
      headers: { forEach: () => {}, getSetCookie: () => [] } as unknown as Headers,
    } as Response);
    vi.stubGlobal('fetch', fetchMock);

    await proxyTo(request('/api/plants', { method: 'GET' }), internalUrl('/api/plants'));

    const [, init] = fetchMock.mock.calls[0];
    expect(init.body).toBeUndefined();
    expect(init.duplex).toBeUndefined();
  });

  it('strips hop-by-hop headers from the upstream response before returning it', async () => {
    const upstreamHeaders = {
      forEach: (cb: (value: string, key: string) => void) => {
        cb('keep-alive', 'connection');
        cb('application/json', 'content-type');
      },
      getSetCookie: () => [],
    } as unknown as Headers;

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 200, body: null, headers: upstreamHeaders } as Response));

    const res = await proxyTo(request('/api/plants'), internalUrl('/api/plants'));

    expect(res.headers.has('connection')).toBe(false);
    expect(res.headers.get('content-type')).toBe('application/json');
  });
});
