import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('@/shared/infrastructure/http/axios.client', () => ({
  doRefresh: vi.fn(),
}));

vi.mock('@/shared/infrastructure/http/refresh-mutex', () => ({
  refreshTokenOnce: vi.fn(),
}));

import { useSessionBootstrap } from './useSessionBootstrap.hook';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import { doRefresh } from '@/shared/infrastructure/http/axios.client';
import { refreshTokenOnce } from '@/shared/infrastructure/http/refresh-mutex';

describe('useSessionBootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSessionStore.setState({ accessToken: null, hasBootstrapped: false });
  });

  it('marks bootstrap done immediately, without calling refresh, when a token already exists', () => {
    useSessionStore.setState({ accessToken: 'existing-token', hasBootstrapped: false });

    renderHook(() => useSessionBootstrap());

    expect(useSessionStore.getState().hasBootstrapped).toBe(true);
    expect(refreshTokenOnce).not.toHaveBeenCalled();
  });

  it('does nothing when bootstrap has already run', () => {
    useSessionStore.setState({ accessToken: null, hasBootstrapped: true });

    renderHook(() => useSessionBootstrap());

    expect(refreshTokenOnce).not.toHaveBeenCalled();
  });

  it('attempts a silent refresh and marks bootstrap done on success', async () => {
    vi.mocked(refreshTokenOnce).mockResolvedValue('new-token');

    renderHook(() => useSessionBootstrap());

    expect(refreshTokenOnce).toHaveBeenCalledWith(doRefresh);
    await waitFor(() => expect(useSessionStore.getState().hasBootstrapped).toBe(true));
  });

  it('marks bootstrap done even when the silent refresh fails', async () => {
    vi.mocked(refreshTokenOnce).mockResolvedValue(null);

    renderHook(() => useSessionBootstrap());

    await waitFor(() => expect(useSessionStore.getState().hasBootstrapped).toBe(true));
  });

  it('does not update the store after unmount', async () => {
    let resolveRefresh!: (value: string | null) => void;
    vi.mocked(refreshTokenOnce).mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      }),
    );

    const { unmount } = renderHook(() => useSessionBootstrap());
    unmount();
    resolveRefresh(null);
    await Promise.resolve();
    await Promise.resolve();

    expect(useSessionStore.getState().hasBootstrapped).toBe(false);
  });
});
