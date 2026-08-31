import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSessionStore, isAuthenticated } from './session.store';

describe('session.store', () => {
  beforeEach(() => {
    useSessionStore.setState({ accessToken: null });
  });

  it('starts with a null access token', () => {
    expect(useSessionStore.getState().accessToken).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('setAccessToken stores the token', () => {
    useSessionStore.getState().setAccessToken('tok');
    expect(useSessionStore.getState().accessToken).toBe('tok');
    expect(isAuthenticated()).toBe(true);
  });

  it('clearAccessToken resets the token to null', () => {
    useSessionStore.getState().setAccessToken('tok');
    useSessionStore.getState().clearAccessToken();
    expect(useSessionStore.getState().accessToken).toBeNull();
  });

  describe('redirectToLogin', () => {
    let replace: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      replace = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { ...window.location, pathname: '/en/dashboard', replace },
        writable: true,
      });
    });

    it('redirects to the locale-prefixed login route', () => {
      useSessionStore.getState().redirectToLogin();
      expect(replace).toHaveBeenCalledWith('/en/login');
    });

    it('does nothing when already on a login route', () => {
      Object.defineProperty(window, 'location', {
        value: { ...window.location, pathname: '/en/login', replace },
        writable: true,
      });
      useSessionStore.getState().redirectToLogin();
      expect(replace).not.toHaveBeenCalled();
    });

    it('redirects to an unprefixed login route when the path has no locale segment', () => {
      Object.defineProperty(window, 'location', {
        value: { ...window.location, pathname: '/dashboard', replace },
        writable: true,
      });
      useSessionStore.getState().redirectToLogin();
      expect(replace).toHaveBeenCalledWith('/login');
    });
  });
});
