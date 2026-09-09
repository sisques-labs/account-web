const BACKSLASH = '\\';

/**
 * Returns true when `raw` contains a C0 control character (U+0000–U+0020,
 * which includes the plain space) or a backslash. Both are silently
 * stripped or re-normalized by the URL parser (e.g. `https:\evil.com`
 * parses as `https://evil.com`), the same parse-differential
 * `safe-redirect.ts` already defends against, so they must be rejected
 * before the string ever reaches `new URL`.
 */
function hasForbiddenRawChar(raw: string): boolean {
  for (let i = 0; i < raw.length; i += 1) {
    const code = raw.charCodeAt(i);
    if (code <= 0x20 || raw[i] === BACKSLASH) return true;
  }
  return false;
}

/**
 * Validates that a redirect target is an absolute URL whose origin exactly
 * matches one entry in `allowedOrigins`. Parallel to and independent from
 * `getSafeRedirectPath` — that helper only accepts same-origin relative
 * paths, this one only accepts allowlisted absolute cross-origin URLs.
 *
 * Exact-origin match only: a subdomain of an allowlisted origin
 * (`https://evil.app.sisqueslabs.com` against an allowlisted
 * `https://app.sisqueslabs.com`) does NOT match, per OWASP's Subdomain
 * Takeover Prevention guidance against suffix trust. Scheme and port are
 * part of `origin`, so they must match too.
 *
 * Never throws — a malformed, opaque, or non-allowlisted target returns
 * `null`.
 *
 * Returns the parser's normalized URL string when safe, otherwise `null`.
 */
export function getSafeExternalRedirectUrl(
  target: string | null | undefined,
  allowedOrigins: ReadonlySet<string>,
): string | null {
  if (!target) return null;

  if (hasForbiddenRawChar(target)) return null;

  let url: URL;
  try {
    // No base URL: a relative path throws here and is rejected by
    // construction — it belongs to `getSafeRedirectPath`.
    url = new URL(target);
  } catch {
    return null;
  }

  // Opaque origin — assigned by WHATWG to `javascript:`, `data:`, `blob:`.
  if (url.origin === 'null') return null;

  if (!allowedOrigins.has(url.origin)) return null;

  return url.toString();
}
