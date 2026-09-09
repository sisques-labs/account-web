const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Parses a comma-separated list of trusted redirect origins into a
 * normalized, deduplicated allowlist. Never throws — a malformed entry is
 * dropped and reported via `console.warn`, so one misconfigured origin
 * degrades safely instead of white-screening the app (this constant is read
 * at module import time in `env.ts`, which is imported by the client HTTP
 * bundle).
 *
 * Rules, in order, per entry:
 * - trimmed; empty entries (trailing comma, `a,,b`, whitespace-only) dropped
 * - must parse as an absolute URL (`new URL`), otherwise dropped
 * - scheme must be `https:`, except `http:` is allowed on the loopback
 *   hostnames `localhost`, `127.0.0.1`, `[::1]`
 * - must have no path beyond `/`, and no search, hash, username, or password
 * - stored as `url.origin` (WHATWG-normalized: scheme/host lowercased,
 *   default port elided), deduplicated via `Set`
 *
 * An unset or empty `raw` yields an empty Set — the cross-origin redirect
 * branch is disabled, matching today's same-origin-only behavior.
 */
export function parseTrustedOrigins(raw: string | undefined): ReadonlySet<string> {
  const origins = new Set<string>();
  if (!raw) return origins;

  for (const rawEntry of raw.split(',')) {
    const entry = rawEntry.trim();
    if (!entry) continue;

    let url: URL;
    try {
      url = new URL(entry);
    } catch {
      console.warn(`parseTrustedOrigins: dropping malformed origin "${entry}"`);
      continue;
    }

    const isLoopbackHttp = url.protocol === 'http:' && LOOPBACK_HOSTNAMES.has(url.hostname);
    if (url.protocol !== 'https:' && !isLoopbackHttp) {
      console.warn(`parseTrustedOrigins: dropping non-https origin "${entry}"`);
      continue;
    }

    const hasDisallowedShape =
      url.pathname !== '/' || url.search !== '' || url.hash !== '' || url.username !== '' || url.password !== '';
    if (hasDisallowedShape) {
      console.warn(`parseTrustedOrigins: dropping origin with disallowed shape "${entry}"`);
      continue;
    }

    origins.add(url.origin);
  }

  return origins;
}
