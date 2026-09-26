/**
 * @ai-context Auth Routes | authentication API endpoints
 *
 * One registry for the two servers that mount `/auth/*`: Hollis Identity
 * (`https://identity.hollis.health/v1`) and the hollis-health-app server. An entry
 * served by only one of them says so. This object is the ONLY declaration —
 * `api/routes.ts` re-exports it (hollis-workouts#178: two copies drifted).
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
  /**
   * POST - Barcode-gated patient sign-up. Health server only — Hollis Identity has
   * no `/auth/signup` (it answers 404). Identity email sign-up is REGISTER.
   */
  SIGNUP: "/auth/signup",
  /**
   * POST - Email/password registration on Hollis Identity (no barcode; Workouts and
   * other greenfield apps). Answers 201 with a full session. Identity only.
   */
  REGISTER: "/auth/register",
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
  /**
   * POST - Sign out. The tokens travel in the BODY (Identity: `IdentityLogoutRequestSchema`;
   * Health server: `logoutBodySchema`) and no Bearer header is required, so sign-out
   * works with an expired access token.
   */
  LOGOUT: "/auth/logout",
  /**
   * GET - The signed-in Identity account (Bearer). Response `data`:
   * `IdentityMeResponseSchema`. Identity only.
   */
  ME: "/auth/me",
  /** POST - Request password reset email (rate limited, no account enumeration) */
  FORGOT_PASSWORD: "/auth/forgot-password",
  /** POST - Reset password using token from email */
  RESET_PASSWORD: "/auth/reset-password",
  /** POST - Send or resend email verification link for authenticated user */
  VERIFY_EMAIL_SEND: "/auth/verify-email/send",
  /** GET - Confirm email verification token from email link */
  VERIFY_EMAIL_CONFIRM: "/auth/verify-email/confirm",
  /** POST - Change password for authenticated user (invalidates all sessions) */
  CHANGE_PASSWORD: "/auth/change-password",
  /** POST - Issue a refresh token to store for biometric login */
  BIOMETRIC_TOKEN: "/auth/biometric-token",
  /** POST - Re-verify MFA for session (when MFA session expires, no re-login needed) */
  MFA_SESSION_REVERIFY: "/auth/mfa/session-reverify",
  /**
   * POST - Record a cross-device "Reset Onboarding" (Bearer); answers
   * `{ onboardingResetAt }`. Surfaced back through ME. Identity only.
   */
  ONBOARDING_RESET: "/auth/onboarding/reset",
  /**
   * POST - Exchange a fresh re-auth proof for a 10-minute account-deletion grant
   * (Bearer). Identity only.
   */
  ACCOUNT_DELETION_AUTHORIZATION: "/auth/account/deletion-authorization",
  /** DELETE - Erase the Identity account; body `{ authorization }` (Bearer). Identity only. */
  ACCOUNT: "/auth/account",
} as const;

/** Type for auth route values */
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
