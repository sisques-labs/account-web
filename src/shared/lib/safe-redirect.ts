/**
 * Validates that a redirect target is a same-origin, relative path — never
 * an absolute URL or a protocol-relative one (`//evil.com`), which browsers
 * treat as an external redirect. Used to sanitize a `redirectTo`/`next`
 * query param before it's used for navigation, so the app can't be turned
 * into an open redirect.
 *
 * Returns the path unchanged when safe, otherwise `null`.
 */
export function getSafeRedirectPath(path: string | null | undefined): string | null {
  if (!path) return null;
  // Must start with exactly one '/' — rejects absolute URLs (https://…),
  // protocol-relative URLs (//evil.com), and backslash tricks (/\evil.com,
  // which some browsers normalize to //evil.com).
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null;
  // Reject anything carrying a scheme (e.g. "/\t/javascript:alert(1)" or a
  // encoded variant) — a bare relative path never needs a colon this early.
  if (/^\/+[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) return null;
  return path;
}
