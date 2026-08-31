import { useEffect, useState } from 'react';

/**
 * Returns `value`, but only after it has stopped changing for `delayMs`.
 * Useful for delaying an expensive downstream effect (e.g. a network
 * request) that shouldn't fire on every keystroke. Defaults to 300ms —
 * the project convention for search inputs — override only when that's
 * demonstrably wrong for a given input.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
}
