/**
 * @ai-context Auth Token Domain Contracts | access token claims, audiences, revocation reasons
 *
 * Provides canonical definitions for token lifecycle events:
 * - Revocation reasons for refresh tokens (RevokedReason)
 * - Token type enum (AuthTokenType)
 * - Audience enum (Audience) — suite-wide app identifiers for JWT `aud` claim
 * - AccessTokenClaims — canonical shape of a verified access token's payload
 * - validateAudience — pure utility to check aud claim membership
 *
 * IMPORTANT: All revocation reason values MUST be imported from here.
 * Never use raw string literals for revokedReason.
 *
 * deps: zod | consumers: server, @hollis-studio/auth-client
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

// ============================================================================
// TOKEN TYPES
// ============================================================================

/**
 * Canonical token type values carried in the JWT `type` claim.
 */
export const AUTH_TOKEN_TYPES = ["access", "refresh", "mfa_pending"] as const;

export type AuthTokenType = (typeof AUTH_TOKEN_TYPES)[number];

export const AuthTokenTypeSchema = z.enum(AUTH_TOKEN_TYPES);

// ============================================================================
// AUDIENCES
// ============================================================================

/**
 * Suite-wide app identifiers for the JWT `aud` claim.
 * A token may be valid for one or more apps simultaneously.
 *
 * NOTE: Extend this list as new Hollis suite apps are introduced
 * (e.g. 'hollis-nutrition', 'hollis-admin'). The Identity Service
 * issues tokens listing all apps the user has access to.
 */
export const AUDIENCES = ["hollis-health", "hollis-workouts"] as const;

export type Audience = (typeof AUDIENCES)[number];

export const AudienceSchema = z.enum(AUDIENCES);

// ============================================================================
// ACCESS TOKEN CLAIMS
// ============================================================================

/**
 * Canonical shape of a verified JWT access token payload.
 *
 * The `claims` field is the per-app extension namespace for app-specific
 * data that does not belong in the top-level claims (e.g. `claims.hollisHealth.organizationId`).
 * Top-level fields like `sub`, `userId`, `type`, `jti`, and `aud` are required
 * by all consumers regardless of app.
 */
export const AccessTokenClaimsSchema = z.object({
  /** Subject — canonical user ID (same as userId) */
  sub: z.string(),
  /** Canonical user ID */
  userId: z.string(),
  /** Token type — must be 'access' for authenticated requests */
  type: AuthTokenTypeSchema,
  /** JWT ID — unique identifier for this token (used for revocation checks) */
  jti: z.string(),
  /** Audience — list of apps this token is valid for; must contain at least one entry */
  aud: AudienceSchema.array().nonempty(),
  /** Issued-at Unix timestamp (seconds) */
  iat: z.number().optional(),
  /** Expiry Unix timestamp (seconds) */
  exp: z.number().optional(),
  /** Unix timestamp (seconds) when MFA was last verified in this session */
  mfaVerifiedAt: z.number().optional(),
  /** Whether MFA is enabled for this user — avoids DB lookup in requireMFA middleware */
  mfaEnabled: z.boolean().optional(),
  /**
   * Per-app extension namespace. Consumers SHOULD namespace their data under
   * a key matching their app identifier (e.g. `claims.hollisHealth.organizationId`).
   * TODO(W6): Move Health-specific fields (organizationId, tier) under
   * `claims.hollisHealth.*` once the Identity Service is live and issues tokens
   * with this structure.
   */
  claims: z.record(z.string(), z.unknown()).optional(),
});

export type AccessTokenClaims = z.infer<typeof AccessTokenClaimsSchema>;

// ============================================================================
// AUDIENCE VALIDATION UTILITY
// ============================================================================

/**
 * Returns true if the token claims include the required audience.
 * Pure function — no side effects, safe to call in any environment.
 *
 * @param claims - Verified AccessTokenClaims from a parsed JWT
 * @param requiredAud - The audience string the consuming app expects
 */
export function validateAudience(
  claims: AccessTokenClaims,
  requiredAud: Audience,
): boolean {
  return claims.aud.includes(requiredAud);
}
