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
export const REDACTION_PLACEHOLDERS = {
  EMAIL: '[REDACTED_EMAIL]',
  BARCODE: '[REDACTED_BARCODE]',
  UUID: '[REDACTED_ID]',
  PHONE: '[REDACTED_PHONE]',
  SSN: '[REDACTED_SSN]',
} as const;

/**
 * Email pattern: matches most common email formats
 * Note: This is intentionally broad to catch potential PHI
 */
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * UUID pattern: matches standard UUID v4 format
 * Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

/**
 * Phone number patterns: matches common US phone formats
 * Examples: (555) 123-4567, 555-123-4567, 5551234567, +1-555-123-4567
 */
const PHONE_PATTERN = /(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

/**
 * SSN pattern: matches Social Security Number formats
 * Examples: 123-45-6789, 123 45 6789, 123456789
 */
const SSN_PATTERN = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g;

/**
 * Barcode pattern: matches HH-XXXXXX format (global version for replacement)
 * Matches HH- followed by exactly 6 alphanumeric characters
 * Excludes confusable characters: 0, 1, I, L, O
 */
const BARCODE_PATTERN = /\bHH-[A-HJ-KM-NP-Z2-9]{6}\b/gi;

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
export function sanitizeErrorMessage(message: string): string {
  if (!message || typeof message !== 'string') {
    return message;
  }

  let sanitized = message;

  // Order matters: SSN before phone (SSN is more specific)
  // Barcode before UUID (barcode is more specific)
  
  // Redact SSNs first (more specific than phone numbers)
  sanitized = sanitized.replace(SSN_PATTERN, REDACTION_PLACEHOLDERS.SSN);
  
  // Redact barcodes (HH-XXXXXX format)
  sanitized = sanitized.replace(BARCODE_PATTERN, REDACTION_PLACEHOLDERS.BARCODE);
  
  // Redact emails
  sanitized = sanitized.replace(EMAIL_PATTERN, REDACTION_PLACEHOLDERS.EMAIL);
  
  // Redact UUIDs
  sanitized = sanitized.replace(UUID_PATTERN, REDACTION_PLACEHOLDERS.UUID);
  
  // Redact phone numbers (after SSN to avoid double-matching)
  sanitized = sanitized.replace(PHONE_PATTERN, REDACTION_PLACEHOLDERS.PHONE);

  return sanitized;
}

/**
 * Sanitizes an object by recursively sanitizing all string values.
 * Useful for sanitizing error details or response objects.
 * 
 * @param obj - The object to sanitize
 * @returns A new object with all string values sanitized
 */
export function sanitizeErrorObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeErrorMessage(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeErrorObject(item)) as T;
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeErrorObject(value);
    }
    return sanitized as T;
  }

  return obj;
}

/**
 * Checks if a message contains any potential PHI patterns.
 * Useful for validation and testing.
 * 
 * @param message - The message to check
 * @returns true if the message contains potential PHI
 */
export function containsPotentialPhi(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }

  // Use non-global regex for .test() calls to avoid lastIndex state persistence bug
  // (calling .test() on a global regex mutates lastIndex, causing alternating true/false)
  const emailTest = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const uuidTest = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const phoneTest = /(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const ssnTest = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/;
  const barcodeTest = /\bHH-[A-HJ-KM-NP-Z2-9]{6}\b/i;

  return (
    emailTest.test(message) ||
    barcodeTest.test(message) ||
    uuidTest.test(message) ||
    phoneTest.test(message) ||
    ssnTest.test(message)
  );
}
