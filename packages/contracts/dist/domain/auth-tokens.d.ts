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
export declare const REVOKED_REASONS: readonly ["LOGOUT", "TOKEN_REUSE_DETECTED", "PASSWORD_RESET", "PASSWORD_CHANGE", "ORG_ARCHIVED", "TEST_CLEANUP", "TEST_REVOCATION"];
export type RevokedReason = (typeof REVOKED_REASONS)[number];
export declare const RevokedReasonSchema: z.ZodEnum<{
    LOGOUT: "LOGOUT";
    TOKEN_REUSE_DETECTED: "TOKEN_REUSE_DETECTED";
    PASSWORD_RESET: "PASSWORD_RESET";
    PASSWORD_CHANGE: "PASSWORD_CHANGE";
    ORG_ARCHIVED: "ORG_ARCHIVED";
    TEST_CLEANUP: "TEST_CLEANUP";
    TEST_REVOCATION: "TEST_REVOCATION";
}>;
/** Centralized constants for equality checks and Prisma writes */
export declare const REVOKED_REASON: {
    readonly LOGOUT: "LOGOUT";
    readonly TOKEN_REUSE_DETECTED: "TOKEN_REUSE_DETECTED";
    readonly PASSWORD_RESET: "PASSWORD_RESET";
    readonly PASSWORD_CHANGE: "PASSWORD_CHANGE";
    readonly ORG_ARCHIVED: "ORG_ARCHIVED";
    readonly TEST_CLEANUP: "TEST_CLEANUP";
    readonly TEST_REVOCATION: "TEST_REVOCATION";
};
/**
 * Canonical token type values carried in the JWT `type` claim.
 */
export declare const AUTH_TOKEN_TYPES: readonly ["access", "refresh", "mfa_pending"];
export type AuthTokenType = (typeof AUTH_TOKEN_TYPES)[number];
export declare const AuthTokenTypeSchema: z.ZodEnum<{
    access: "access";
    refresh: "refresh";
    mfa_pending: "mfa_pending";
}>;
/**
 * Suite-wide app identifiers for the JWT `aud` claim.
 * A token may be valid for one or more apps simultaneously.
 *
 * NOTE: Extend this list as new Hollis suite apps are introduced
 * (e.g. 'hollis-nutrition', 'hollis-admin'). The Identity Service
 * issues tokens listing all apps the user has access to.
 */
export declare const AUDIENCES: readonly ["hollis-health", "hollis-workouts"];
export type Audience = (typeof AUDIENCES)[number];
export declare const AudienceSchema: z.ZodEnum<{
    "hollis-health": "hollis-health";
    "hollis-workouts": "hollis-workouts";
}>;
/**
 * Canonical shape of a verified JWT access token payload.
 *
 * The `claims` field is the per-app extension namespace for app-specific
 * data that does not belong in the top-level claims (e.g. `claims.hollisHealth.organizationId`).
 * Top-level fields like `sub`, `userId`, `type`, `jti`, and `aud` are required
 * by all consumers regardless of app.
 */
export declare const AccessTokenClaimsSchema: z.ZodObject<{
    sub: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<{
        access: "access";
        refresh: "refresh";
        mfa_pending: "mfa_pending";
    }>;
    jti: z.ZodString;
    aud: z.ZodArray<z.ZodEnum<{
        "hollis-health": "hollis-health";
        "hollis-workouts": "hollis-workouts";
    }>>;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
    mfaVerifiedAt: z.ZodOptional<z.ZodNumber>;
    mfaEnabled: z.ZodOptional<z.ZodBoolean>;
    claims: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type AccessTokenClaims = z.infer<typeof AccessTokenClaimsSchema>;
/**
 * Returns true if the token claims include the required audience.
 * Pure function — no side effects, safe to call in any environment.
 *
 * @param claims - Verified AccessTokenClaims from a parsed JWT
 * @param requiredAud - The audience string the consuming app expects
 */
export declare function validateAudience(claims: AccessTokenClaims, requiredAud: Audience): boolean;
//# sourceMappingURL=auth-tokens.d.ts.map