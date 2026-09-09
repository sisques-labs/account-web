import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseTrustedOrigins } from './trusted-origins';

describe('parseTrustedOrigins', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an empty Set for undefined', () => {
    expect(parseTrustedOrigins(undefined)).toEqual(new Set());
  });

  it('returns an empty Set for an empty string', () => {
    expect(parseTrustedOrigins('')).toEqual(new Set());
  });

  it('parses a single origin', () => {
    expect(parseTrustedOrigins('https://app.sisqueslabs.com')).toEqual(
      new Set(['https://app.sisqueslabs.com']),
    );
  });

  it('parses multiple origins with surrounding whitespace', () => {
    expect(
      parseTrustedOrigins(' https://app.sisqueslabs.com , https://gardenia.sisqueslabs.com '),
    ).toEqual(new Set(['https://app.sisqueslabs.com', 'https://gardenia.sisqueslabs.com']));
  });

  it('drops empty entries from a trailing comma', () => {
    expect(parseTrustedOrigins('https://app.sisqueslabs.com,')).toEqual(
      new Set(['https://app.sisqueslabs.com']),
    );
  });

  it('drops empty entries between two commas', () => {
    expect(parseTrustedOrigins('https://app.sisqueslabs.com,,https://gardenia.sisqueslabs.com')).toEqual(
      new Set(['https://app.sisqueslabs.com', 'https://gardenia.sisqueslabs.com']),
    );
  });

  it('drops a malformed entry and warns, keeping valid siblings', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(parseTrustedOrigins('not-a-url,https://app.sisqueslabs.com')).toEqual(
      new Set(['https://app.sisqueslabs.com']),
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('not-a-url');
  });

  it('drops http:// on a non-loopback host', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(parseTrustedOrigins('http://app.sisqueslabs.com')).toEqual(new Set());
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps http://localhost:3001', () => {
    expect(parseTrustedOrigins('http://localhost:3001')).toEqual(
      new Set(['http://localhost:3001']),
    );
  });

  it('keeps http:// on 127.0.0.1', () => {
    expect(parseTrustedOrigins('http://127.0.0.1:3001')).toEqual(
      new Set(['http://127.0.0.1:3001']),
    );
  });

  it('keeps http:// on [::1]', () => {
    expect(parseTrustedOrigins('http://[::1]:3001')).toEqual(new Set(['http://[::1]:3001']));
  });

  it('drops an entry carrying a path instead of truncating it', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(parseTrustedOrigins('https://app.sisqueslabs.com/dashboard')).toEqual(new Set());
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('drops an entry carrying a query string', () => {
    expect(parseTrustedOrigins('https://app.sisqueslabs.com/?tab=1')).toEqual(new Set());
  });

  it('drops an entry carrying a hash fragment', () => {
    expect(parseTrustedOrigins('https://app.sisqueslabs.com/#section')).toEqual(new Set());
  });

  it('drops an entry carrying credentials', () => {
    expect(parseTrustedOrigins('https://user:pass@app.sisqueslabs.com/')).toEqual(new Set());
  });

  it('dedupes case and default-port variants into one normalized entry', () => {
    expect(
      parseTrustedOrigins('https://App.X.com:443/,https://app.x.com'),
    ).toEqual(new Set(['https://app.x.com']));
  });
});
