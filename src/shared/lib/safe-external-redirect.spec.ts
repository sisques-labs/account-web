import { describe, it, expect } from 'vitest';
import { getSafeExternalRedirectUrl } from './safe-external-redirect';

const ALLOWED_ORIGINS = new Set(['https://app.sisqueslabs.com', 'https://gardenia.sisqueslabs.com']);

describe('getSafeExternalRedirectUrl', () => {
  it('returns null for null', () => {
    expect(getSafeExternalRedirectUrl(null, ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(getSafeExternalRedirectUrl(undefined, ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getSafeExternalRedirectUrl('', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns the normalized URL for an allowlisted origin', () => {
    expect(getSafeExternalRedirectUrl('https://app.sisqueslabs.com/dashboard', ALLOWED_ORIGINS)).toBe(
      'https://app.sisqueslabs.com/dashboard',
    );
  });

  it('returns null for a non-allowlisted origin', () => {
    expect(getSafeExternalRedirectUrl('https://evil.com/phishing', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a subdomain of an allowlisted origin', () => {
    expect(getSafeExternalRedirectUrl('https://evil.app.sisqueslabs.com', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null when only the port differs', () => {
    expect(getSafeExternalRedirectUrl('https://app.sisqueslabs.com:8443', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null when only the scheme differs', () => {
    expect(getSafeExternalRedirectUrl('http://app.sisqueslabs.com', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a malformed URL without throwing', () => {
    expect(() => getSafeExternalRedirectUrl('not-a-url', ALLOWED_ORIGINS)).not.toThrow();
    expect(getSafeExternalRedirectUrl('not-a-url', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a relative path', () => {
    expect(getSafeExternalRedirectUrl('/en/admin/apps', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a javascript: scheme', () => {
    expect(getSafeExternalRedirectUrl('javascript:alert(1)', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a data: scheme', () => {
    expect(getSafeExternalRedirectUrl('data:text/html,x', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a backslash variant of an allowlisted origin', () => {
    expect(getSafeExternalRedirectUrl('https:\\app.sisqueslabs.com', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a control character smuggled into an allowlisted origin', () => {
    expect(getSafeExternalRedirectUrl('https://app.sisqueslabs.com%00.evil.com', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for a literal tab that WHATWG would silently strip into an allowlisted origin', () => {
    // Without the raw pre-parse guard, `new URL()` strips this tab and fuses the
    // hostname into the exact allowlisted 'https://app.sisqueslabs.com' — proving
    // the C0-range check (not just the try/catch fallback) is load-bearing.
    expect(getSafeExternalRedirectUrl('https://app.sisques\tlabs.com', ALLOWED_ORIGINS)).toBeNull();
  });

  it('returns null for every input when the allowlist is empty', () => {
    const emptyAllowlist = new Set<string>();
    expect(getSafeExternalRedirectUrl('https://app.sisqueslabs.com', emptyAllowlist)).toBeNull();
  });
});
