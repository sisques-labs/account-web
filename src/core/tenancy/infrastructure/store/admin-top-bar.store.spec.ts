import { describe, it, expect, beforeEach } from 'vitest';
import { useAdminTopBarStore } from './admin-top-bar.store';

describe('admin-top-bar.store', () => {
  beforeEach(() => {
    useAdminTopBarStore.setState({ actions: null });
  });

  it('starts with no actions', () => {
    expect(useAdminTopBarStore.getState().actions).toBeNull();
  });

  it('setActions stores the injected node', () => {
    useAdminTopBarStore.getState().setActions('Crear app');
    expect(useAdminTopBarStore.getState().actions).toBe('Crear app');
  });

  it('setActions(null) clears the injected node', () => {
    useAdminTopBarStore.getState().setActions('Crear app');
    useAdminTopBarStore.getState().setActions(null);
    expect(useAdminTopBarStore.getState().actions).toBeNull();
  });
});
