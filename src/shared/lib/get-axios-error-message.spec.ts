import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getAxiosErrorMessage } from './get-axios-error-message';

function makeAxiosError(status: number): AxiosError {
  return new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders() },
    {},
    { status, statusText: '', headers: {}, config: { headers: new AxiosHeaders() }, data: {} },
  );
}

describe('getAxiosErrorMessage', () => {
  it('returns null when there is no error', () => {
    expect(getAxiosErrorMessage(null, { 401: 'invalid' }, 'generic')).toBeNull();
  });

  it('returns the mapped message for a matching status code', () => {
    expect(getAxiosErrorMessage(makeAxiosError(401), { 401: 'invalid' }, 'generic')).toBe('invalid');
  });

  it('returns the generic message for an unmapped status code', () => {
    expect(getAxiosErrorMessage(makeAxiosError(500), { 401: 'invalid' }, 'generic')).toBe('generic');
  });

  it('returns the generic message for a non-axios error', () => {
    expect(getAxiosErrorMessage(new Error('boom'), { 401: 'invalid' }, 'generic')).toBe('generic');
  });
});
