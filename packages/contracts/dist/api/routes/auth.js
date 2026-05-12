/**
 * @ai-context Auth Routes | authentication API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
// ============================================================================
// AUTH ROUTES
// ============================================================================
/**
 * Authentication API routes.
 * Base path: /auth
 *
 * @group AUTH
 */
export const AUTH_ROUTES = {
    /** POST - Email/password login */
    LOGIN: "/auth/login",
    /** POST - Create new account with password */
    SIGNUP: "/auth/signup",
    /** POST - Validate patient barcode before signup (public, no auth required) */
    VALIDATE_BARCODE: "/auth/validate-barcode",
    /** POST - Refresh access token using refresh token */
    REFRESH: "/auth/refresh",
    /** POST - OAuth social sign-in (Apple or Google) with nonce + CSRF state verification */
    OAUTH_SIGN_IN: "/auth/oauth",
    /**
     * POST - OAuth social registration (Apple or Google) during barcode onboarding.
     * Registers a new account using a social identity token + barcode code + displayName.
     * Distinct from OAUTH_SIGN_IN: sign-in requires a pre-existing account; this creates one.
     */
    OAUTH_REGISTER: "/auth/oauth-register",
    /** POST - Sign out current session */
    LOGOUT: "/auth/logout",
    /** POST - Request password reset email (rate limited, no account enumeration) */
    FORGOT_PASSWORD: "/auth/forgot-password",
    /** POST - Reset password using token from email */
    RESET_PASSWORD: "/auth/reset-password",
    /** POST - Change password for authenticated user (invalidates all sessions) */
    CHANGE_PASSWORD: "/auth/change-password",
    /** POST - Re-verify MFA for session (when MFA session expires, no re-login needed) */
    MFA_SESSION_REVERIFY: "/auth/mfa/session-reverify",
};
//# sourceMappingURL=auth.js.map