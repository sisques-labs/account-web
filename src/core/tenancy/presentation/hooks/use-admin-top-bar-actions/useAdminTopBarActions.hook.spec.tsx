import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAdminTopBarActions } from './useAdminTopBarActions.hook';
import { useAdminTopBarStore } from '@/core/tenancy/infrastructure/store/admin-top-bar.store';

describe('useAdminTopBarActions', () => {
  beforeEach(() => {
    useAdminTopBarStore.setState({ actions: null });
  });

  it('publishes the given node to the admin top bar store', () => {
    renderHook(() => useAdminTopBarActions('Crear app'));
    expect(useAdminTopBarStore.getState().actions).toBe('Crear app');
  });

  it('updates the store when the node changes', () => {
    const { rerender } = renderHook(({ node }) => useAdminTopBarActions(node), {
      initialProps: { node: 'Crear app' as React.ReactNode },
    });
    expect(useAdminTopBarStore.getState().actions).toBe('Crear app');

    rerender({ node: 'Crear tenant' });
    expect(useAdminTopBarStore.getState().actions).toBe('Crear tenant');
  });

  it('clears the store when the hook unmounts', () => {
    const { unmount } = renderHook(() => useAdminTopBarActions('Crear app'));
    expect(useAdminTopBarStore.getState().actions).toBe('Crear app');

    unmount();
    expect(useAdminTopBarStore.getState().actions).toBeNull();
  });
});
