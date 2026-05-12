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
//# sourceMappingURL=auth-tokens.d.ts.map