/**
 * @ai-context Auth Token Domain Contracts | refresh token revocation reasons
 *
 * Provides canonical definitions for token lifecycle events:
 * - Revocation reasons for refresh tokens (RevokedReason)
 *
 * IMPORTANT: All revocation reason values MUST be imported from here.
 * Never use raw string literals for revokedReason.
 *
 * deps: zod | consumers: server
 */

import { z } from "zod";

// ============================================================================
// REVOKED REASON
// ============================================================================

/**
 * Canonical reasons a refresh token can be revoked.
 *
 * Production reasons:
 * - LOGOUT: User explicitly logged out.
 * - TOKEN_REUSE_DETECTED: Token reuse detected; entire family revoked for security.
 * - PASSWORD_RESET: All sessions invalidated because the user reset their password.
 * - PASSWORD_CHANGE: Other sessions invalidated because the user changed their password.
 * - ORG_ARCHIVED: Organisation was archived; all member tokens revoked.
 *
 * Test-only reasons (must NOT appear in production code paths):
 * - TEST_CLEANUP: Token revoked during test teardown.
 * - TEST_REVOCATION: Token manually revoked inside a test to simulate a revoked-token scenario.
 */
export const REVOKED_REASONS = [
  "LOGOUT",
  "TOKEN_REUSE_DETECTED",
  "PASSWORD_RESET",
  "PASSWORD_CHANGE",
  "ORG_ARCHIVED",
  "TEST_CLEANUP",
  "TEST_REVOCATION",
] as const;

export type RevokedReason = (typeof REVOKED_REASONS)[number];

export const RevokedReasonSchema = z.enum(REVOKED_REASONS);

/** Centralized constants for equality checks and Prisma writes */
export const REVOKED_REASON = {
  LOGOUT: "LOGOUT",
  TOKEN_REUSE_DETECTED: "TOKEN_REUSE_DETECTED",
  PASSWORD_RESET: "PASSWORD_RESET",
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  ORG_ARCHIVED: "ORG_ARCHIVED",
  TEST_CLEANUP: "TEST_CLEANUP",
  TEST_REVOCATION: "TEST_REVOCATION",
} as const satisfies Record<RevokedReason, RevokedReason>;
