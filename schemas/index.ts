/**
 * @ai-context Zod Schemas Barrel | exports all shared Zod validation schemas
 *
 * This module provides Zod schemas for:
 * - Common primitives (dates, timestamps, IDs)
 * - Path/query parameter validation
 * - Auth request/response validation
 * - Common validation patterns (email, phone, uuid, etc.)
 * - JSON blob field schemas (Prisma Json fields)
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

import { z } from "zod";
import { baseDocumentSchema, isoDateSchema } from "../domain/common";
import { passwordSchema } from "../password";

// ============================================================================
// JSON BLOB SCHEMAS (Prisma JSON fields)
// ============================================================================

export * from "./json-blobs";

// ============================================================================
// COMMON PRIMITIVE SCHEMAS
// ============================================================================

export type BaseDocument = z.infer<typeof baseDocumentSchema>;

// ============================================================================
// BARCODE SCHEMAS
// ============================================================================

/**
 * Barcode format regex: HH-XXXXXX
 * Charset excludes confusable characters (0/O, 1/I/L).
 * Use this regex for validating newly issued barcodes.
 *
 * @see docs/IDENTIFIER_CONVENTIONS.md for full documentation.
 */
export const BARCODE_REGEX = /^HH-[A-HJ-KM-NP-Z2-9]{6}$/;

/**
 * User ID regex: HH-XXXXXX where X is alphanumeric (more permissive than BARCODE_REGEX).
 * Some legacy/test IDs include characters outside the strict barcode charset (e.g., O),
 * so we accept the broader set here while keeping BARCODE_REGEX for barcode issuance.
 *
 * Use this regex for validating user IDs in API routes and queries.
 *
 * @see docs/IDENTIFIER_CONVENTIONS.md for full documentation.
 */
export const USER_ID_REGEX = /^HH-[A-Z0-9]{6}$/;

/**
 * Zod schema for validating barcode format (strict).
 * Use for validating newly generated barcodes during registration.
 *
 * @description Validates HH-XXXXXX format with restricted charset.
 */
export const barcodeSchema = z
  .string()
  .regex(BARCODE_REGEX, "Invalid barcode format (expected HH-XXXXXX)");

/**
 * Zod schema for validating user ID format (permissive).
 * Use for validating user IDs in API routes, queries, and request bodies.
 *
 * @description Validates HH-XXXXXX format with broader alphanumeric charset.
 * @note userId and barcode are the same value - User.id stores the barcode.
 */
export const userIdSchema = z
  .string()
  .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)");

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
 * Schema for routes with :userId param (validates HH-XXXXXX barcode format).
 *
 * userId is the primary user identifier - it IS the barcode value.
 * Use this for API routes like GET /users/:userId/profile.
 *
 * @see docs/IDENTIFIER_CONVENTIONS.md for full documentation.
 */
export const userIdParamSchema = z.object({
  /** User identifier in HH-XXXXXX barcode format. */
  userId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)"),
});
export type UserIdParam = z.infer<typeof userIdParamSchema>;

/**
 * Schema for routes with :date param (ISO date format)
 */
export const dateParamSchema = z.object({
  date: isoDateSchema,
});
export type DateParam = z.infer<typeof dateParamSchema>;

/**
 * Schema for routes with both :userId and :date params
 */
export const userIdAndDateParamsSchema = z.object({
  userId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user barcode format (expected HH-XXXXXX)"),
  date: isoDateSchema,
});
export type UserIdAndDateParams = z.infer<typeof userIdAndDateParamsSchema>;

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
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;

/**
 * Schema for pagination query parameters with defaults
 */
export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/**
 * Schema for userId query parameter
 */
export const userIdQuerySchema = z.object({
  userId: z.string().min(1, "userId is required"),
});
export type UserIdQuery = z.infer<typeof userIdQuerySchema>;

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

/**
 * Simplified sex options for signup/onboarding flows.
 * Full biological sex options are in domain/user (BIOLOGICAL_SEXES).
 *
 * Use this for registration forms where a simpler set is appropriate.
 */
export const SIGNUP_SEX_OPTIONS = ["male", "female", "other"] as const;
export type SignupSex = (typeof SIGNUP_SEX_OPTIONS)[number];

/** Zod schema for signup sex field */
export const signupSexSchema = z.enum(SIGNUP_SEX_OPTIONS);

/**
 * Schema for login request body
 */
export const loginBodySchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});
export type LoginBody = z.infer<typeof loginBodySchema>;

/**
 * Schema for token refresh request body
 */
export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1, "Refresh token required"),
});
export type RefreshBody = z.infer<typeof refreshBodySchema>;

/**
 * Height validation schema (centimetres).
 * Physiologically reasonable bounds: 50–300 cm.
 */
export const heightCmSchema = z
  .number()
  .min(50, "Height must be at least 50 cm")
  .max(300, "Height cannot exceed 300 cm");

/**
 * Weight validation schema (kilograms).
 * Physiologically reasonable bounds: 20–500 kg.
 */
export const weightKgSchema = z
  .number()
  .min(20, "Weight must be at least 20 kg")
  .max(500, "Weight cannot exceed 500 kg");

/**
 * Schema for signup request body (barcode-based patient registration).
 *
 * The `code` field is the patient's barcode (HH-XXXXXX format).
 * After signup, this becomes the user's userId/User.id.
 */
export const signupBodySchema = z.object({
  /** Patient barcode to claim (HH-XXXXXX format). Becomes the userId after registration. */
  code: z.string().min(1, "Patient barcode is required"),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be 100 characters or less"),
  // Optional fields that can override prefilled data
  profile: z
    .object({
      heightCm: heightCmSchema.optional(),
      weightKg: weightKgSchema.optional(),
      dateOfBirth: z.string().optional(), // ISO date string
      biologicalSex: z.enum(SIGNUP_SEX_OPTIONS).optional(),
      primaryGoal: z.string().optional(),
    })
    .optional(),
});
export type SignupBody = z.infer<typeof signupBodySchema>;

// ============================================================================
// COMMON VALIDATION SCHEMAS
// ============================================================================

/**
 * Email validation schema
 */
export const emailSchema = z.string().email("Invalid email address");

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid("Invalid UUID format");

/**
 * Phone number validation schema (flexible international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");

/**
 * URL validation schema
 */
export const urlSchema = z.string().url("Invalid URL format");

// ============================================================================
// BIOMETRIC VALIDATION SCHEMAS
// ============================================================================

/** Reasonable age bounds (COPPA compliance) */
const MIN_AGE_YEARS = 13;
const MAX_AGE_YEARS = 120;

/**
 * Date of birth validation schema.
 * - Must be a valid ISO date string
 * - Must not be in the future
 * - Must meet COPPA minimum age of 13
 * - Must not exceed 120 years
 */
export const dateOfBirthSchema = z
  .string()
  .refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format" },
  )
  .refine(
    (val) => {
      const date = new Date(val);
      return date <= new Date();
    },
    { message: "Date of birth cannot be in the future" },
  )
  .refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      const ageMs = now.getTime() - date.getTime();
      const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
      return ageYears >= MIN_AGE_YEARS;
    },
    { message: `Must be at least ${MIN_AGE_YEARS} years old` },
  )
  .refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      const ageMs = now.getTime() - date.getTime();
      const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
      return ageYears <= MAX_AGE_YEARS;
    },
    { message: `Age must be ${MAX_AGE_YEARS} years or less` },
  );
