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

import { z } from 'zod';

// ============================================================================
// PASSWORD POLICY CONSTANTS
// ============================================================================

/**
 * Centralized password policy configuration.
 * Change these values to update policy across all codebases.
 */
export const PASSWORD_POLICY = {
  /** Minimum password length. 10 chars provides ~50 bits of entropy minimum. */
  MIN_LENGTH: 10,
  
  /** Maximum password length. Prevents DoS; bcrypt only uses first 72 bytes anyway. */
  MAX_LENGTH: 128,
  
  /** Minimum zxcvbn score required (0-4 scale). 3 = "Strong" */
  MIN_ZXCVBN_SCORE: 3,
  
  /** Whether to check HaveIBeenPwned by default */
  HIBP_CHECK_ENABLED: true,
  
  /** HIBP API endpoint for k-anonymity range queries */
  HIBP_API_URL: 'https://api.pwnedpasswords.com/range/',
  
  /** Timeout for HIBP API calls in milliseconds */
  HIBP_TIMEOUT_MS: 3000,
} as const;

/**
 * Human-readable labels for zxcvbn scores
 */
export const ZXCVBN_SCORE_LABELS = {
  0: 'Very Weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Strong',
  4: 'Very Strong',
} as const;

// ============================================================================
// PASSWORD VALIDATION RESULT TYPES
// ============================================================================

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

// ============================================================================
// SYNC PASSWORD SCHEMA (Basic validation)
// ============================================================================

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
export const passwordSchema = z
  .string()
  .min(PASSWORD_POLICY.MIN_LENGTH, `Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters`)
  .max(PASSWORD_POLICY.MAX_LENGTH, `Password must be at most ${PASSWORD_POLICY.MAX_LENGTH} characters`);

/**
 * Password schema that requires basic length validation only.
 * Used as a building block; consumers should add strength validation.
 */
export const passwordLengthSchema = passwordSchema;

// ============================================================================
// ASYNC PASSWORD VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check password strength using zxcvbn.
 * 
 * @param password - Password to check
 * @param userInputs - Optional array of user-specific strings to penalize (email, name, etc.)
 * @returns Validation result with score and feedback
 */
export async function validatePasswordStrength(
  password: string,
  userInputs: string[] = []
): Promise<PasswordValidationResult> {
  // First check basic requirements
  const basicResult = passwordSchema.safeParse(password);
  if (!basicResult.success) {
    return {
      valid: false,
      error: basicResult.error.errors[0]?.message ?? 'Invalid password',
    };
  }

  try {
    // Lazy load zxcvbn to reduce bundle size
    const { default: zxcvbn } = await import('zxcvbn');
    const result = zxcvbn(password, userInputs);
    
    const strengthLabel = ZXCVBN_SCORE_LABELS[result.score as keyof typeof ZXCVBN_SCORE_LABELS];
    
    if (result.score < PASSWORD_POLICY.MIN_ZXCVBN_SCORE) {
      return {
        valid: false,
        score: result.score,
        strengthLabel,
        feedback: result.feedback,
        error: `Password is too weak (${strengthLabel}). ${result.feedback.warning || 'Use a longer, more unique password.'}`,
      };
    }

    return {
      valid: true,
      score: result.score,
      strengthLabel,
      feedback: result.feedback,
    };
  } catch {
    // If zxcvbn fails to load, fall back to basic validation
    // This is a degraded mode - log this in production
    console.warn('[Password] zxcvbn failed to load, falling back to basic validation');
    return {
      valid: true,
      error: undefined,
    };
  }
}

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
export async function checkPasswordBreached(
  password: string
): Promise<{ breached: boolean; count: number }> {
  try {
    // Use Web Crypto API (works in browser and Node 18+)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    // Query HIBP API with k-anonymity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PASSWORD_POLICY.HIBP_TIMEOUT_MS);
    
    try {
      const response = await fetch(`${PASSWORD_POLICY.HIBP_API_URL}${prefix}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'HollisHealth-PasswordCheck',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // HIBP API error - fail open (allow password) but log
        console.warn('[Password] HIBP API returned non-OK status:', response.status);
        return { breached: false, count: 0 };
      }
      
      const text = await response.text();
      const lines = text.split('\n');
      
      for (const line of lines) {
        const [hashSuffix, countStr] = line.split(':');
        if (hashSuffix.trim() === suffix) {
          const count = parseInt(countStr.trim(), 10);
          return { breached: true, count };
        }
      }
      
      return { breached: false, count: 0 };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    // Network error or timeout - fail open but log
    if ((error as Error).name === 'AbortError') {
      console.warn('[Password] HIBP check timed out');
    } else {
      console.warn('[Password] HIBP check failed:', error);
    }
    return { breached: false, count: 0 };
  }
}

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
export async function validatePassword(
  password: string,
  options: {
    /** User-specific strings to penalize in zxcvbn (email, name, etc.) */
    userInputs?: string[];
    /** Whether to check HIBP (default: PASSWORD_POLICY.HIBP_CHECK_ENABLED) */
    checkBreached?: boolean;
    /** Skip strength check (for testing only) */
    skipStrengthCheck?: boolean;
  } = {}
): Promise<PasswordValidationResult> {
  const {
    userInputs = [],
    checkBreached = PASSWORD_POLICY.HIBP_CHECK_ENABLED,
    skipStrengthCheck = false,
  } = options;

  // Step 1: Basic length validation
  const basicResult = passwordSchema.safeParse(password);
  if (!basicResult.success) {
    return {
      valid: false,
      error: basicResult.error.errors[0]?.message ?? 'Invalid password',
    };
  }

  // Step 2: Strength validation (unless skipped)
  if (!skipStrengthCheck) {
    const strengthResult = await validatePasswordStrength(password, userInputs);
    if (!strengthResult.valid) {
      return strengthResult;
    }
  }

  // Step 3: Breach check (if enabled)
  if (checkBreached) {
    const breachResult = await checkPasswordBreached(password);
    if (breachResult.breached) {
      return {
        valid: false,
        breached: true,
        breachCount: breachResult.count,
        error: `This password has been exposed in ${breachResult.count.toLocaleString()} data breaches. Please choose a different password.`,
      };
    }
  }

  // Get final score for the result
  const finalStrength = await validatePasswordStrength(password, userInputs);
  
  return {
    valid: true,
    score: finalStrength.score,
    strengthLabel: finalStrength.strengthLabel,
    feedback: finalStrength.feedback,
    breached: false,
  };
}

// ============================================================================
// ZOD SCHEMA WITH ASYNC REFINEMENT (for server-side validation)
// ============================================================================

/**
 * Password schema with async refinement for server-side validation.
 * 
 * Use this in server route handlers where async validation is acceptable.
 * For client-side forms, use passwordSchema (sync) + validatePasswordStrength() on submit.
 * 
 * @param options - Validation options passed to validatePassword()
 */
export function createStrictPasswordSchema(options: {
  userInputs?: string[];
  checkBreached?: boolean;
} = {}) {
  return passwordSchema.refine(
    async (password) => {
      const result = await validatePassword(password, options);
      return result.valid;
    },
    {
      message: 'Password does not meet security requirements. Use a stronger, unique password.',
    }
  );
}

// ============================================================================
// PASSWORD RESET REQUEST SCHEMAS
// ============================================================================

/**
 * Schema for forgot password request (initiate password reset).
 * Used by both mobile and web clients.
 */
export const forgotPasswordRequestSchema = z.object({
  /** User's email address */
  email: z.string().email('Valid email required'),
});

/**
 * TypeScript type for forgot password request
 */
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

/**
 * Schema for reset password request (complete password reset with token).
 * Used by both mobile and web clients.
 */
export const resetPasswordRequestSchema = z.object({
  /** Reset token from email (URL-safe base64) */
  token: z.string().min(1, 'Reset token required'),
  /** New password meeting security requirements */
  newPassword: passwordSchema,
});

/**
 * TypeScript type for reset password request
 */
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
