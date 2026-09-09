import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? 'http://localhost:3000';

const HOP_BY_HOP = new Set([
  'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
  'proxy-authorization', 'proxy-authenticate', 'te', 'trailer',
]);

// account-api's POST /v1/auth/refresh predates account-web (its own
// session-cookies.helper.ts docstring says as much) and only ever reads the
// refresh token from the JSON body — it never reads it back off the
// `refresh_token` cookie it sets on login/refresh. The browser can't supply
// that body itself: the cookie is httpOnly specifically so client JS can't
// read its value. This proxy route runs server-side, though, so — unlike
// the browser — it CAN read the incoming cookie; for this one path it does,
// and builds the body account-api actually expects instead of forwarding
// the browser's (bodyless) request verbatim.
const REFRESH_PATH_SUFFIX = '/v1/auth/refresh';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

function isRefreshRequest(req: NextRequest, upstreamUrl: string): boolean {
  return req.method === 'POST' && new URL(upstreamUrl).pathname.endsWith(REFRESH_PATH_SUFFIX);
}

export async function proxyTo(req: NextRequest, upstreamUrl: string): Promise<NextResponse> {
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== 'host') {
      headers.set(key, value);
    }
  });

  let body: BodyInit | undefined;
  let duplex: 'half' | undefined;

  if (isRefreshRequest(req, upstreamUrl)) {
    const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token cookie present' }, { status: 401 });
    }
    body = JSON.stringify({ refreshToken });
    headers.set('content-type', 'application/json');
    headers.delete('content-length');
  } else {
    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    body = hasBody ? (req.body as BodyInit | undefined) : undefined;
    duplex = hasBody ? 'half' : undefined;
  }

  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
    // @ts-expect-error — duplex required for streaming request body in Node fetch
    duplex,
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== 'set-cookie') {
      responseHeaders.set(key, value);
    }
  });
  // Set-Cookie is excluded from forEach/get/entries on a fetch() response —
  // getSetCookie() is the only way to read it, and each value must be
  // appended individually (set() would overwrite on a second cookie).
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append('set-cookie', cookie);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export function internalUrl(path: string): string {
  return `${INTERNAL_API_URL}${path}`;
}
