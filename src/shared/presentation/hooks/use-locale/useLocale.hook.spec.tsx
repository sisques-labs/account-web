import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

let mockPathname = '/en/admin/apps';
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

import { useLocale } from './useLocale.hook';

describe('useLocale', () => {
  it('resolves the locale from the first path segment', () => {
    mockPathname = '/es/admin/apps';
    const { result } = renderHook(() => useLocale());
    expect(result.current).toBe('es');
  });

  it('falls back to the default locale for an unsupported segment', () => {
    mockPathname = '/fr/admin/apps';
    const { result } = renderHook(() => useLocale());
    expect(result.current).toBe('en');
  });

  it('falls back to the default locale for a root path', () => {
    mockPathname = '/';
    const { result } = renderHook(() => useLocale());
    expect(result.current).toBe('en');
  });
});
