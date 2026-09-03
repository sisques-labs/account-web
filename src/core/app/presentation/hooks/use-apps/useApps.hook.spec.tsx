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

import { useApps } from './useApps.hook';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useApps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches apps via the repository', async () => {
    const result = { items: [{ id: 'a1', slug: 'app-1', name: 'App 1', createdAt: '', updatedAt: '' }], total: 1, page: 1, perPage: 50, totalPages: 1 };
    vi.mocked(appGqlRepository.listApps).mockResolvedValue(result);

    const { result: hookResult } = renderHook(() => useApps(), { wrapper });

    await waitFor(() => expect(hookResult.current.isSuccess).toBe(true));
    expect(hookResult.current.data).toEqual(result);
  });
});
