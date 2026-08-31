import { describe, it, expect } from 'vitest';
import { t } from './interpolate';

describe('t (interpolate)', () => {
  it('returns the template unchanged when no vars are given', () => {
    expect(t('Hello {name}')).toBe('Hello {name}');
  });

  it('substitutes a single placeholder', () => {
    expect(t('Hello {name}', { name: 'Ada' })).toBe('Hello Ada');
  });

  it('substitutes multiple placeholders', () => {
    expect(t('{a} and {b}', { a: 'foo', b: 'bar' })).toBe('foo and bar');
  });

  it('stringifies numeric values', () => {
    expect(t('Count: {count}', { count: 3 })).toBe('Count: 3');
  });

  it('leaves a placeholder untouched when its var is missing', () => {
    expect(t('Hello {name}', {})).toBe('Hello {name}');
  });
});
