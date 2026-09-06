import { describe, it, expect } from 'vitest';
import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats a valid ISO date using the locale date format', () => {
    const date = new Date('2024-03-15T00:00:00.000Z');
    expect(formatDate(date.toISOString())).toBe(date.toLocaleDateString());
  });

  it('returns the original string unchanged when it is not a valid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
