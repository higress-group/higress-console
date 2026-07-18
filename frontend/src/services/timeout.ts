export const REQUEST_TIMEOUT_STORAGE_KEY = 'requestTimeout';
export const DEFAULT_REQUEST_TIMEOUT = 60 * 1000;

/**
 * Resolve the request timeout in milliseconds.
 *
 * Reads `requestTimeout` (a millisecond string) from localStorage and falls
 * back to {@link DEFAULT_REQUEST_TIMEOUT} when the value is missing, not a
 * finite number, or not strictly positive.
 *
 * @param storage - Storage source, defaults to `localStorage`; injectable for testing.
 * @returns The resolved timeout in milliseconds.
 */
export function resolveRequestTimeout(
  storage: Pick<Storage, 'getItem'> = localStorage,
): number {
  const raw = storage.getItem(REQUEST_TIMEOUT_STORAGE_KEY);
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_REQUEST_TIMEOUT;
  }
  return parsed;
}
