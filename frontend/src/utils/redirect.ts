/**
 * Validate and sanitize a `redirect` query-string value to prevent open-redirect
 * attacks and self-loops on /login. Returns a safe path suitable for
 * `history.push(...)`.
 *
 * Rules:
 *  - Non-string / null / undefined / empty → '/'
 *  - Must start with a single '/' (rejects whitespace, backslash-leading or
 *    slash-backslash '/\', URL schemes like 'http://', 'javascript:', 'data:',
 *    and protocol-relative '//evil.com')
 *  - Must NOT be '/login' (case-insensitive path-segment match, with or
 *    without query/hash suffix)
 *  - Must NOT contain ASCII control characters (WHATWG URL parsing strips
 *    C0 controls and DEL before parsing, so e.g. '/\t/evil.com' becomes
 *    '//evil.com' = protocol-relative)
 *
 * Otherwise the input is returned as-is (may include query / hash fragments).
 */
export function sanitizeRedirectValue(raw: string | null | undefined): string {
  if (typeof raw !== 'string') {
    return '/';
  }
  // Trim is intentionally NOT applied: a leading-space value is suspicious.
  if (raw.length === 0) {
    return '/';
  }
  // WHATWG URL parsing strips ASCII tab/LF/CR (and other C0 controls) BEFORE parsing,
  // so '/\t/evil.com' resolves to '//evil.com' = protocol-relative.
  // Reject any control character to close this open-redirect bypass.
  if (/[\x00-\x1F\x7F]/.test(raw)) {
    return '/';
  }
  // Self-loop guard: catch '/login', '/LOGIN', '/login?next=1', '/login#foo'.
  // Anything whose path segment (case-insensitive) is '/login' is the login page.
  const pathSegment = raw.split(/[?#]/, 1)[0];
  if (pathSegment.toLowerCase() === '/login') {
    return '/';
  }
  // Must start with exactly one '/' (rejects backslash, whitespace, scheme prefixes
  // like 'http://', 'javascript:', 'data:', and protocol-relative '//evil.com').
  if (raw[0] !== '/' || raw[1] === '/' || raw[1] === '\\') {
    return '/';
  }
  return raw;
}

/**
 * Build the `redirect=...` portion (without the leading '?') for a /login URL
 * when forcing a user back to their original page after a 401.
 *
 * Returns an empty string when the resulting target is just the root path
 * (no need to round-trip '/' back to itself). Otherwise returns
 * `redirect=<encodeURIComponent(pathname+search)>` so that '?', '&' and '='
 * inside pathname+search are correctly escaped as data inside the outer query.
 *
 * This function ONLY encodes; safety validation is the consumer's job
 * (use sanitizeRedirectValue on the read-back value in the login page).
 */
export function buildRedirectSearch(pathname: string, search: string): string {
  if (typeof pathname !== 'string' || pathname.length === 0) {
    return '';
  }
  // location.search already includes the leading '?' when present.
  const combined = pathname + (search || '');
  if (combined === '/') {
    return '';
  }
  return `redirect=${encodeURIComponent(combined)}`;
}
