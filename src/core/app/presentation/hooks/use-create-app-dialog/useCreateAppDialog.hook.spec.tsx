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

import { useCreateAppDialog } from './useCreateAppDialog.hook';
import { appGqlRepository } from '@/core/app/infrastructure/repositories/graphql/app.gql.repository';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCreateAppDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resets the form and closes the dialog on a successful submit', async () => {
    vi.mocked(appGqlRepository.createApp).mockResolvedValue({ id: 'app-1' });
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateAppDialog({ onOpenChange, reset }), { wrapper });
    result.current.submit('Gardenia');

    await waitFor(() => expect(appGqlRepository.createApp).toHaveBeenCalledWith({ name: 'Gardenia' }));
    await waitFor(() => expect(reset).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not reset the form or close the dialog when the mutation fails', async () => {
    vi.mocked(appGqlRepository.createApp).mockRejectedValue(new Error('boom'));
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateAppDialog({ onOpenChange, reset }), { wrapper });
    result.current.submit('Gardenia');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(reset).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('resets the form when the dialog is closed manually without submitting', () => {
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateAppDialog({ onOpenChange, reset }), { wrapper });
    result.current.onOpenChange(false);

    expect(reset).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not reset the form when the dialog is opened', () => {
    const onOpenChange = vi.fn();
    const reset = vi.fn();

    const { result } = renderHook(() => useCreateAppDialog({ onOpenChange, reset }), { wrapper });
    result.current.onOpenChange(true);

    expect(reset).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
