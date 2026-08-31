import { describe, it, expect, vi } from 'vitest';
import { refreshTokenOnce } from './refresh-mutex';

describe('refreshTokenOnce', () => {
  it('calls doRefresh exactly once for N concurrent calls', async () => {
    const doRefresh = vi.fn().mockResolvedValue('new-token');

    const results = await Promise.all(
      Array.from({ length: 5 }, () => refreshTokenOnce(doRefresh))
    );

    expect(doRefresh).toHaveBeenCalledTimes(1);
    expect(results).toEqual(Array(5).fill('new-token'));
  });

  it('resets the gate after completion so next cycle starts fresh', async () => {
    const doRefresh = vi.fn().mockResolvedValue('token');

    await refreshTokenOnce(doRefresh);
    await refreshTokenOnce(doRefresh);

    expect(doRefresh).toHaveBeenCalledTimes(2);
  });

  it('resolves null when doRefresh throws', async () => {
    const doRefresh = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await refreshTokenOnce(doRefresh);

    expect(result).toBeNull();
  });

  it('all concurrent callers receive null on refresh failure', async () => {
    const doRefresh = vi.fn().mockRejectedValue(new Error('401'));

    const results = await Promise.all(
      Array.from({ length: 3 }, () => refreshTokenOnce(doRefresh))
    );

    expect(doRefresh).toHaveBeenCalledTimes(1);
    expect(results).toEqual([null, null, null]);
  });
});
