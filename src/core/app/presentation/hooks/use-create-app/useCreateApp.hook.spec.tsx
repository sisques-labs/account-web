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

import { useCreateApp } from './useCreateApp.hook';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';
import { appsQueryKey } from '@/core/app/presentation/hooks/use-apps/useApps.hook';

describe('useCreateApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an app and invalidates the apps query', async () => {
    vi.mocked(appGqlRepository.createApp).mockResolvedValue({ id: 'app-1' });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    function wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const { result } = renderHook(() => useCreateApp(), { wrapper });
    result.current.mutate({ name: 'Gardenia' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: appsQueryKey });
  });
});
