import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('@/core/app/infrastructure/repositories/graphql/app.gql.repository', () => ({
  appGqlRepository: {
    listApps: vi.fn(),
    createApp: vi.fn(),
  },
}));

import { useAppBySlug } from './useAppBySlug.hook';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const APPS = {
  items: [
    { id: 'a1', slug: 'gardenia', name: 'Gardenia', createdAt: '', updatedAt: '' },
    { id: 'a2', slug: 'nexora', name: 'Nexora', createdAt: '', updatedAt: '' },
  ],
  total: 2,
  page: 1,
  perPage: 50,
  totalPages: 1,
};

describe('useAppBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves the app matching the given slug once the apps list loads', async () => {
    vi.mocked(appGqlRepository.listApps).mockResolvedValue(APPS);

    const { result } = renderHook(() => useAppBySlug('nexora'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.app).toEqual(APPS.items[1]);
  });

  it('resolves undefined when no app matches the slug', async () => {
    vi.mocked(appGqlRepository.listApps).mockResolvedValue(APPS);

    const { result } = renderHook(() => useAppBySlug('missing'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.app).toBeUndefined();
  });

  it('exposes the underlying query loading/error state', async () => {
    vi.mocked(appGqlRepository.listApps).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useAppBySlug('gardenia'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.app).toBeUndefined();
  });
});
