let refreshPromise: Promise<string | null> | null = null;

export function refreshTokenOnce(doRefresh: () => Promise<string>): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh()
    .then((token) => token)
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
