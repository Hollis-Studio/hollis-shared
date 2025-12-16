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
  LOGIN: '/auth/login',
  /** POST - Create new account with password */
  SIGNUP: '/auth/signup',
  /** POST - Refresh access token using refresh token */
  REFRESH: '/auth/refresh',
  /** POST - Link OAuth credentials to existing account */
  LINK: '/auth/link',
  /** POST - Sign out current session */
  LOGOUT: '/auth/logout',
  /** POST - Request password reset email (rate limited, no account enumeration) */
  FORGOT_PASSWORD: '/auth/forgot-password',
  /** POST - Reset password using token from email */
  RESET_PASSWORD: '/auth/reset-password',
  /** POST - Change password for authenticated user (invalidates all sessions) */
  CHANGE_PASSWORD: '/auth/change-password',
} as const;

/** Type for auth route values */
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
