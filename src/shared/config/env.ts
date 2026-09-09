import { parseTrustedOrigins } from '@/shared/lib/trusted-origins';

export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? '/graphql';
export const HTTP_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_HTTP_TIMEOUT_MS ?? 10_000);
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';
export const TRUSTED_REDIRECT_ORIGINS = parseTrustedOrigins(process.env.NEXT_PUBLIC_TRUSTED_REDIRECT_ORIGINS);
