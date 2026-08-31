import { describe, it, expect } from 'vitest';
import en from './en';
import es from './es';

function flatKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      return flatKeys(v as object, key);
    }
    return [key];
  });
}

describe('i18n parity — shell', () => {
  it('every key in en exists in es', () => {
    const missing = flatKeys(en).filter((k) => !flatKeys(es).includes(k));
    expect(missing).toEqual([]);
  });

  it('every key in es exists in en', () => {
    const missing = flatKeys(es).filter((k) => !flatKeys(en).includes(k));
    expect(missing).toEqual([]);
  });
});
