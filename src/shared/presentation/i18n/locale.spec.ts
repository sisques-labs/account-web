import { describe, it, expect } from 'vitest';
import { isLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from './locale';

describe('locale', () => {
  it('DEFAULT_LOCALE is one of SUPPORTED_LOCALES', () => {
    expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE);
  });

  it.each(SUPPORTED_LOCALES)('isLocale returns true for %s', (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it('isLocale returns false for an unsupported value', () => {
    expect(isLocale('fr')).toBe(false);
  });

  it('isLocale returns false for an empty string', () => {
    expect(isLocale('')).toBe(false);
  });
});
