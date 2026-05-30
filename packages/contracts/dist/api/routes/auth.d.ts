/**
 * @ai-context Auth Routes | authentication API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Authentication API routes.
 * Base path: /auth
 *
 * @group AUTH
 */
export declare const AUTH_ROUTES: {
    /** POST - Email/password login */
    readonly LOGIN: "/auth/login";
    /** POST - Create new account with password */
    readonly SIGNUP: "/auth/signup";
    /** POST - Validate patient barcode before signup (public, no auth required) */
    readonly VALIDATE_BARCODE: "/auth/validate-barcode";
    /** POST - Refresh access token using refresh token */
    readonly REFRESH: "/auth/refresh";
    /** POST - OAuth social sign-in (Apple or Google) with nonce + CSRF state verification */
    readonly OAUTH_SIGN_IN: "/auth/oauth";
    /**
     * POST - OAuth social registration (Apple or Google) during barcode onboarding.
     * Registers a new account using a social identity token + barcode code + displayName.
     * Distinct from OAUTH_SIGN_IN: sign-in requires a pre-existing account; this creates one.
     */
    readonly OAUTH_REGISTER: "/auth/oauth-register";
    /** POST - Sign out current session */
    readonly LOGOUT: "/auth/logout";
    /** POST - Request password reset email (rate limited, no account enumeration) */
    readonly FORGOT_PASSWORD: "/auth/forgot-password";
    /** POST - Reset password using token from email */
    readonly RESET_PASSWORD: "/auth/reset-password";
    /** POST - Send or resend email verification link for authenticated user */
    readonly VERIFY_EMAIL_SEND: "/auth/verify-email/send";
    /** GET - Confirm email verification token from email link */
    readonly VERIFY_EMAIL_CONFIRM: "/auth/verify-email/confirm";
    /** POST - Change password for authenticated user (invalidates all sessions) */
    readonly CHANGE_PASSWORD: "/auth/change-password";
    /** POST - Re-verify MFA for session (when MFA session expires, no re-login needed) */
    readonly MFA_SESSION_REVERIFY: "/auth/mfa/session-reverify";
};
/** Type for auth route values */
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
//# sourceMappingURL=auth.d.ts.map