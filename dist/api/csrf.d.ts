/**
 * @ai-context CSRF Protection Constants | Shared between web-admin and server
 *
 * Defines the constant names for CSRF tokens used in the double-submit cookie pattern.
 * Web-admin reads the CSRF cookie and sends it in the header on mutations.
 *
 * deps: none | consumers: web-admin/services/*, server/src/middleware/csrf.ts
 */
/**
 * CSRF token cookie name.
 * This cookie is NOT httpOnly - client JS must read it.
 */
export declare const CSRF_TOKEN_COOKIE = "csrf_token";
/**
 * CSRF token header name.
 * Client reads cookie and sends value in this header.
 */
export declare const CSRF_TOKEN_HEADER = "X-CSRF-Token";
/**
 * Header to indicate client type for conditional auth handling.
 * 'web' = use httpOnly cookies, 'mobile' = use Bearer tokens
 */
export declare const CLIENT_TYPE_HEADER = "X-Client-Type";
/**
 * Client type values.
 */
export declare const CLIENT_TYPE: {
    readonly WEB: "web";
    readonly MOBILE: "mobile";
};
export type ClientType = (typeof CLIENT_TYPE)[keyof typeof CLIENT_TYPE];
/**
 * Auth cookie names — must match what the server sets in cookieConfig.ts.
 * Shared here so web-admin middleware can reference them without importing from server/.
 *
 * @see server/src/lib/cookieConfig.ts - AUTH_COOKIES
 */
export declare const AUTH_COOKIE_NAMES: {
    /** Short-lived access token cookie used for API auth */
    readonly ACCESS_TOKEN: "hollis_access_token";
    /** Long-lived refresh token cookie used to obtain new access tokens */
    readonly REFRESH_TOKEN: "hollis_refresh_token";
};
//# sourceMappingURL=csrf.d.ts.map