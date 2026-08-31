import axios from 'axios';
import { refreshTokenOnce } from './refresh-mutex';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import { logHttpError } from './http-logger';
import { HTTP_TIMEOUT_MS } from '@/shared/config/env';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';
// Placeholder auth route convention — align with the first `auth` bounded
// context's actual endpoints once it exists.
const AUTH_SKIP = ['/auth/login', '/auth/register'];

// Bare instance — no interceptors. Used for refresh and post-401 retry.
export const bareHttp = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: HTTP_TIMEOUT_MS,
});

export async function doRefresh(): Promise<string> {
  const res = await bareHttp.post<{ accessToken: string }>('/auth/refresh');
  useSessionStore.getState().setAccessToken(res.data.accessToken);
  return res.data.accessToken;
}

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: HTTP_TIMEOUT_MS,
});

http.interceptors.request.use((config) => {
  const path = config.url ?? '';
  if (!AUTH_SKIP.some((p) => path.endsWith(p))) {
    const token = useSessionStore.getState().accessToken;
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config as any)._startTime = Date.now();
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startTime: number = (originalRequest as any)?._startTime ?? Date.now();
    logHttpError({
      status: error.response?.status as number | undefined,
      url: originalRequest?.url as string | undefined,
      durationMs: Date.now() - startTime,
    });

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const path = originalRequest.url ?? '';
    if (path.endsWith('/auth/refresh')) {
      useSessionStore.getState().clearAccessToken();
      useSessionStore.getState().redirectToLogin();
      return Promise.reject(error);
    }
    if (AUTH_SKIP.some((p) => path.endsWith(p))) {
      return Promise.reject(error);
    }

    const newToken = await refreshTokenOnce(doRefresh);
    if (!newToken) {
      useSessionStore.getState().clearAccessToken();
      useSessionStore.getState().redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
    return http(originalRequest);
  }
);
