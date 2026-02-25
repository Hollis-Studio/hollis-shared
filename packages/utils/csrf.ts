/**
 * @ai-context Shared CSRF cookie utilities
 *
 * Implements the client-side half of the double-submit cookie pattern:
 *   1. Server sets a non-httpOnly cookie containing the CSRF token.
 *   2. Client reads the cookie and sends the value in X-CSRF-Token on mutations.
 *   3. Server verifies header === cookie.
 *
 * Why this is safe:
 *   - Same-origin policy prevents attacker sites from reading our cookies.
 *   - SameSite=Lax/None limits when cookies are sent cross-origin.
 *   - Even if XSS can read the CSRF token, httpOnly auth cookies are still safe.
 *
 * consumers: web-admin/services/webApiClient.ts
 *            web-public/lib/csrf.ts (fallback path — see note below)
 *
 * NOTE: web-public/lib/csrf.ts currently contains a duplicated cookie-parsing
 * regex using a hardcoded 'csrf_token' magic string instead of CSRF_TOKEN_COOKIE.
 * That file should be updated to import parseCsrfCookie from here.
 * Tracked as tech-debt: API-4 follow-up.
 */

/**
 * Parse a CSRF token out of a `document.cookie` string.
 *
 * Regex design:
 *   `(?:^|;\s*)` — non-capturing: start of string OR semicolon + optional spaces
 *                  (document.cookie separates cookies with "; ")
 *   `([^;]+)`    — capturing: one-or-more non-semicolon chars (rejects empty tokens)
 *
 * The value is URI-decoded to handle any encoding applied by the server.
 *
 * IMPORTANT: cookieName must not contain regex special characters.
 * CSRF_TOKEN_COOKIE is `csrf_token`, which is safe.
 *
 * @param cookieString - Raw `document.cookie` value
 * @param cookieName   - Cookie name constant (use CSRF_TOKEN_COOKIE, never a magic string)
 * @returns Decoded token string, or null if not found / empty
 */
export function parseCsrfCookie(
  cookieString: string,
  cookieName: string,
): string | null {
  const re = new RegExp("(?:^|;\\s*)" + cookieName + "=([^;]+)");
  const match = cookieString.match(re);
  return match ? decodeURIComponent(match[1]) : null;
}
