import { describe, it, expect } from 'vitest';
import { getSafeRedirectPath } from './safe-redirect';

describe('getSafeRedirectPath', () => {
  it('accepts a plain relative path', () => {
    expect(getSafeRedirectPath('/en/admin/apps')).toBe('/en/admin/apps');
  });

  it('accepts a relative path with a query string', () => {
    expect(getSafeRedirectPath('/en/admin/apps/gardenia?tab=members')).toBe(
      '/en/admin/apps/gardenia?tab=members',
    );
  });

  it('returns null for null', () => {
    expect(getSafeRedirectPath(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(getSafeRedirectPath(undefined)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getSafeRedirectPath('')).toBeNull();
  });

  it('rejects an absolute URL to another host', () => {
    expect(getSafeRedirectPath('https://evil.com/phishing')).toBeNull();
  });

  it('rejects a protocol-relative URL', () => {
    expect(getSafeRedirectPath('//evil.com')).toBeNull();
  });

  it('rejects a backslash variant of a protocol-relative URL', () => {
    expect(getSafeRedirectPath('/\\evil.com')).toBeNull();
  });

  it('rejects a javascript: scheme smuggled in', () => {
    expect(getSafeRedirectPath('/javascript:alert(1)')).toBeNull();
  });

  it('rejects a path that does not start with a slash', () => {
    expect(getSafeRedirectPath('en/admin/apps')).toBeNull();
  });
});
