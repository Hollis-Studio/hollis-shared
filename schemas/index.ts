/**
 * @ai-context Zod Schemas Barrel | exports all shared Zod validation schemas
 *
 * This module provides Zod schemas for:
 * - Common primitives (dates, timestamps, IDs)
 * - Path/query parameter validation
 * - Auth request/response validation
 * - Common validation patterns (email, phone, uuid, etc.)
 *
 * NOTE: Domain-specific schemas (UserRoleSchema, AppointmentStatusSchema, etc.)
 * are exported from the domain module alongside their tuples and labels.
 * This module focuses on validation schemas for API request/response payloads.
 *
 * IMPORTANT: Schemas in this module must be usable in all environments:
 * - Browser (mobile app, web-admin)
 * - Node.js (server)
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// COMMON PRIMITIVE SCHEMAS
// ============================================================================

/**
 * ISO 8601 timestamp schema with validation
 */
export const isoTimestampSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Must be ISO 8601 timestamp');

/**
 * ISO date schema (YYYY-MM-DD) with full validation
 */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Must be ISO date (YYYY-MM-DD)')
  .refine((value) => {
    // Additional validation: ensure date components are valid
    const [year, month, day] = value.split('-').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    // Validate the date is real (handles Feb 30, etc.)
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, 'Must be a valid date');

/**
 * Base document metadata schema
 */
export const baseDocumentSchema = z.object({
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type BaseDocument = z.infer<typeof baseDocumentSchema>;

// ============================================================================
// BARCODE SCHEMAS
// ============================================================================

/**
 * Barcode format: HH-XXXXXX
 * Charset excludes confusable characters (0/O, 1/I/L)
 */
export const BARCODE_REGEX = /^HH-[A-HJ-KM-NP-Z2-9]{6}$/;

/**
 * User ID regex: HH-XXXXXX where X is alphanumeric (more permissive than BARCODE_REGEX)
 * Some legacy/test IDs include characters outside the strict barcode charset (e.g., O),
 * so we accept the broader set here while keeping BARCODE_REGEX for barcode issuance.
 */
export const USER_ID_REGEX = /^HH-[A-Z0-9]{6}$/;

/**
 * Zod schema for validating barcode format
 */
export const barcodeSchema = z.string().regex(BARCODE_REGEX, 'Invalid barcode format (expected HH-XXXXXX)');

/**
 * Zod schema for validating user ID format (more permissive)
 */
export const userIdSchema = z.string().regex(USER_ID_REGEX, 'Invalid user ID format (expected HH-XXXXXX)');

/**
 * Validates that a string matches the HH-XXXXXX barcode format
 */
export function isValidBarcode(code: string): boolean {
  return BARCODE_REGEX.test(code);
}

/**
 * Validates that a string matches the user ID format
 */
export function isValidUserId(id: string): boolean {
  return USER_ID_REGEX.test(id);
}

// ============================================================================
// PATH PARAMETER SCHEMAS
// ============================================================================

/**
 * Schema for routes with :userId param (validates HH-XXXXXX barcode format)
 */
export const userIdParamSchema = z.object({
  userId: z.string().regex(USER_ID_REGEX, 'Invalid user ID format (expected HH-XXXXXX)'),
});

/**
 * Schema for routes with :date param (ISO date format)
 */
export const dateParamSchema = z.object({
  date: isoDateSchema,
});

/**
 * Schema for routes with both :userId and :date params
 */
export const userIdAndDateParamsSchema = z.object({
  userId: z.string().regex(USER_ID_REGEX, 'Invalid user barcode format (expected HH-XXXXXX)'),
  date: isoDateSchema,
});

// ============================================================================
// QUERY PARAMETER SCHEMAS
// ============================================================================

/**
 * Schema for date range query parameters
 */
export const dateRangeQuerySchema = z.object({
  startDate: isoDateSchema,
  endDate: isoDateSchema,
});

/**
 * Schema for pagination query parameters with defaults
 */
export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

/**
 * Schema for userId query parameter
 */
export const userIdQuerySchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

// Signup profile sex values - simplified set for onboarding
// Full biological sex options are in domain/user (BIOLOGICAL_SEXES)
const SIGNUP_SEX_OPTIONS = ['male', 'female', 'other'] as const;

/**
 * Schema for login request body
 */
export const loginBodySchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

/**
 * Schema for token refresh request body
 */
export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

/**
 * Schema for signup request body (barcode-based patient registration)
 */
export const signupBodySchema = z.object({
  code: z.string().min(1, 'Patient barcode is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  // Optional fields that can override prefilled data
  profile: z.object({
    heightCm: z.number().optional(),
    weightKg: z.number().optional(),
    dateOfBirth: z.string().optional(), // ISO date string
    sex: z.enum(SIGNUP_SEX_OPTIONS).optional(),
    goals: z.string().optional(),
  }).optional(),
});

// ============================================================================
// COMMON VALIDATION SCHEMAS
// ============================================================================

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema with minimum requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters');

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Phone number validation schema (flexible international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/**
 * URL validation schema
 */
export const urlSchema = z.string().url('Invalid URL format');
