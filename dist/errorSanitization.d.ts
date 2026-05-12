/**
 * @ai-context PHI Error Sanitization | removes sensitive data from error messages
 *
 * All error messages that may be displayed to users or logged must be sanitized
 * to prevent PHI (Protected Health Information) exposure.
 *
 * Patterns redacted:
 * - Email addresses → [REDACTED_EMAIL]
 * - Barcodes (HH-XXXXXX) → [REDACTED_BARCODE]
 * - UUIDs → [REDACTED_ID]
 * - Phone numbers → [REDACTED_PHONE]
 * - SSN patterns → [REDACTED_SSN]
 *
 * Usage:
 *   import { sanitizeErrorMessage } from '@contracts';
 *   throw new Error(sanitizeErrorMessage(`User ${email} not found`));
 *
 * deps: none | consumers: src/services/apiClient, server/src/lib/AppError, server/src/middleware/errorHandler
 */
/**
 * Redaction placeholders for different PHI types
 */
export declare const REDACTION_PLACEHOLDERS: {
    readonly EMAIL: "[REDACTED_EMAIL]";
    readonly BARCODE: "[REDACTED_BARCODE]";
    readonly UUID: "[REDACTED_ID]";
    readonly PHONE: "[REDACTED_PHONE]";
    readonly SSN: "[REDACTED_SSN]";
};
/**
 * Sanitizes an error message by removing PHI patterns.
 *
 * @param message - The error message to sanitize
 * @returns The sanitized message with PHI replaced by redaction placeholders
 *
 * @example
 * sanitizeErrorMessage('User john@example.com not found')
 * // Returns: 'User [REDACTED_EMAIL] not found'
 *
 * sanitizeErrorMessage('Invalid barcode: HH-ABC123')
 * // Returns: 'Invalid barcode: [REDACTED_BARCODE]'
 */
export declare function sanitizeErrorMessage(message: string): string;
/**
 * Sanitizes an object by recursively sanitizing all string values.
 * Useful for sanitizing error details or response objects.
 *
 * @param obj - The object to sanitize
 * @returns A new object with all string values sanitized
 */
export declare function sanitizeErrorObject<T>(obj: T): T;
/**
 * Checks if a message contains any potential PHI patterns.
 * Useful for validation and testing.
 *
 * @param message - The message to check
 * @returns true if the message contains potential PHI
 */
export declare function containsPotentialPhi(message: string): boolean;
//# sourceMappingURL=errorSanitization.d.ts.map