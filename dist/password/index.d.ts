/**
 * @ai-context Password Policy Module | Centralized password validation for all codebases
 *
 * This module provides:
 * - PASSWORD_POLICY constants (min/max length, zxcvbn score requirements)
 * - passwordSchema - Sync Zod schema for basic length/format validation
 * - validatePasswordStrength() - Async function for zxcvbn strength checking
 * - checkPasswordBreached() - Async function for HaveIBeenPwned k-anonymity check
 * - validatePassword() - Combined async validation (strength + optional breach check)
 *
 * Security philosophy:
 * - Minimum 10 characters (more entropy than complexity rules)
 * - Maximum 128 characters (prevents DoS from bcrypt's 72-byte limit and memory attacks)
 * - zxcvbn score >= 3 (Strong) required for production
 * - Optional HIBP k-anonymity check (can be skipped in dev/test)
 * - NO regex complexity rules (uppercase/lowercase/number/special) - these lead to predictable patterns
 *
 * deps: zod, zxcvbn (lazy loaded) | consumers: all codebases
 */
import { z } from "zod";
/**
 * Centralized password policy configuration.
 * Change these values to update policy across all codebases.
 */
export declare const PASSWORD_POLICY: {
    /** Minimum password length. */
    readonly MIN_LENGTH: 6;
    /** Maximum password length. Prevents DoS; bcrypt only uses first 72 bytes anyway. */
    readonly MAX_LENGTH: 128;
    /** Minimum zxcvbn score required (0-4 scale). 3 = "Strong" */
    readonly MIN_ZXCVBN_SCORE: 3;
    /** Whether to check HaveIBeenPwned by default */
    readonly HIBP_CHECK_ENABLED: true;
    /** HIBP API endpoint for k-anonymity range queries */
    readonly HIBP_API_URL: "https://api.pwnedpasswords.com/range/";
    /** Timeout for HIBP API calls in milliseconds */
    readonly HIBP_TIMEOUT_MS: 3000;
};
/**
 * Human-readable labels for zxcvbn scores
 */
export declare const ZXCVBN_SCORE_LABELS: {
    readonly 0: "Very Weak";
    readonly 1: "Weak";
    readonly 2: "Fair";
    readonly 3: "Strong";
    readonly 4: "Very Strong";
};
export interface PasswordValidationResult {
    /** Whether the password passed all validation checks */
    valid: boolean;
    /** Human-readable error message if validation failed */
    error?: string;
    /** zxcvbn score (0-4) if strength check was performed */
    score?: number;
    /** Human-readable strength label */
    strengthLabel?: string;
    /** Feedback from zxcvbn (warnings and suggestions) */
    feedback?: {
        warning?: string;
        suggestions: string[];
    };
    /** Whether the password was found in known breaches */
    breached?: boolean;
    /** Number of times password appeared in breaches (if breached) */
    breachCount?: number;
}
/**
 * Basic password schema for synchronous validation.
 *
 * Use this for:
 * - Form field validation (real-time feedback)
 * - Quick rejection of obviously invalid passwords
 *
 * For full security validation, use validatePassword() which includes
 * zxcvbn strength checking and optional HIBP breach detection.
 */
export declare const passwordSchema: z.ZodString;
/**
 * Password schema that requires basic length validation only.
 * Used as a building block; consumers should add strength validation.
 */
export declare const passwordLengthSchema: z.ZodString;
/**
 * Check password strength using zxcvbn.
 *
 * @param password - Password to check
 * @param userInputs - Optional array of user-specific strings to penalize (email, name, etc.)
 * @returns Validation result with score and feedback
 */
export declare function validatePasswordStrength(password: string, userInputs?: string[]): Promise<PasswordValidationResult>;
/**
 * Check if password has been exposed in known data breaches using
 * HaveIBeenPwned's k-anonymity API.
 *
 * How it works:
 * 1. SHA-1 hash the password
 * 2. Send first 5 chars of hash to HIBP API (k-anonymity preserves privacy)
 * 3. HIBP returns all hash suffixes matching that prefix
 * 4. We check if our full hash is in the response
 *
 * @param password - Password to check
 * @returns Object with breached status and count
 */
export declare function checkPasswordBreached(password: string): Promise<{
    breached: boolean;
    count: number;
}>;
/**
 * Complete password validation with strength and breach checking.
 *
 * This is the recommended function for validating passwords during:
 * - User signup
 * - Password reset
 * - Password change
 * - Admin-created user accounts
 *
 * @param password - Password to validate
 * @param options - Validation options
 * @returns Complete validation result
 */
export declare function validatePassword(password: string, options?: {
    /** User-specific strings to penalize in zxcvbn (email, name, etc.) */
    userInputs?: string[];
    /** Whether to check HIBP (default: PASSWORD_POLICY.HIBP_CHECK_ENABLED) */
    checkBreached?: boolean;
    /** Skip strength check (for testing only) */
    skipStrengthCheck?: boolean;
}): Promise<PasswordValidationResult>;
/**
 * Password schema with async refinement for server-side validation.
 *
 * Use this in server route handlers where async validation is acceptable.
 * For client-side forms, use passwordSchema (sync) + validatePasswordStrength() on submit.
 *
 * @param options - Validation options passed to validatePassword()
 */
export declare function createStrictPasswordSchema(options?: {
    userInputs?: string[];
    checkBreached?: boolean;
}): z.ZodString;
/**
 * Schema for forgot password request (initiate password reset).
 * Used by both mobile and web clients.
 */
export declare const forgotPasswordRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
/**
 * TypeScript type for forgot password request
 */
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
/**
 * Schema for reset password request (complete password reset with token).
 * Used by both mobile and web clients.
 */
export declare const resetPasswordRequestSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
/**
 * TypeScript type for reset password request
 */
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
/**
 * Schema for the password reset success response payload.
 *
 * The server sends `{ success: true, data: { message: string } }` via sendSuccess().
 * After envelope unwrapping by the API clients, consumers receive `{ message: string }`.
 *
 * Used by both mobile (src/services/auth.http.ts) and
 * web-admin (web-admin/services/webAuthService.ts) to validate the response.
 */
export declare const passwordResetResponseSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
/**
 * TypeScript type for the unwrapped password reset response.
 */
export type PasswordResetResponse = z.infer<typeof passwordResetResponseSchema>;
//# sourceMappingURL=index.d.ts.map