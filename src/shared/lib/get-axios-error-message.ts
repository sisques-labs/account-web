import { isAxiosError } from 'axios';

/**
 * Maps a mutation error to a dictionary message: a specific message for a
 * given HTTP status code, or a generic fallback for anything else (a
 * non-axios error, a response with no mapped status, or no response at
 * all). Returns null when there's no error, so hooks can wire the result
 * straight to an optional error banner.
 */
export function getAxiosErrorMessage(
  error: unknown,
  statusMessages: Partial<Record<number, string>>,
  genericMessage: string,
): string | null {
  if (!error) return null;
  if (isAxiosError(error) && error.response) {
    const message = statusMessages[error.response.status];
    if (message) return message;
  }
  return genericMessage;
}
