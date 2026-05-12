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
import { isoDateSchema } from "../domain/common.js";
import { BiologicalSexSchema, PrimaryGoalSchema } from "../domain/user.js";
import { passwordSchema } from "../password/index.js";
import { bodyWeightKgSchema } from "./weight.js";
// ============================================================================
// JSON BLOB SCHEMAS (Prisma JSON fields)
// ============================================================================
export * from "./json-blobs.js";
export * from "./weight.js";
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
export function isValidBarcode(code) {
    return BARCODE_REGEX.test(code);
}
/**
 * Validates that a string matches the user ID format
 */
export function isValidUserId(id) {
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
    userId: z
        .string()
        .regex(USER_ID_REGEX, "Invalid user barcode format (expected HH-XXXXXX)"),
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
    userId: z.string().min(1, "userId is required"),
});
// ============================================================================
// AUTH SCHEMAS
// ============================================================================
/**
 * Simplified sex options for signup/onboarding flows.
 * Full biological sex options are in domain/user (BIOLOGICAL_SEXES).
 *
 * Use this for registration forms where a simpler set is appropriate.
 */
export const SIGNUP_SEX_OPTIONS = ["male", "female", "other"];
/** Zod schema for signup sex field */
export const signupSexSchema = z.enum(SIGNUP_SEX_OPTIONS);
/**
 * Schema for login request body
 */
export const loginBodySchema = z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(1, "Password required"),
});
/**
 * Schema for token refresh request body
 */
export const refreshBodySchema = z.object({
    refreshToken: z.string().min(1, "Refresh token required"),
});
/**
 * Height validation schema (centimetres).
 * Physiologically reasonable bounds: 50–300 cm.
 */
export const heightCmSchema = z
    .number()
    .min(50, "Height must be at least 50 cm")
    .max(300, "Height cannot exceed 300 cm");
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
        weightKg: bodyWeightKgSchema.optional(),
        dateOfBirth: z.string().optional(), // ISO date string
        biologicalSex: BiologicalSexSchema.optional(),
        primaryGoal: PrimaryGoalSchema.optional(),
    })
        .optional(),
});
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
 * Phone number validation schema (strict E.164 international format)
 * Requires canonical E.164 formatting: leading `+`, international country code,
 * digits only, and a plausible international length.
 * Use for API payloads and backend validation where consistent format is required.
 */
const STRICT_E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/u;
const LENIENT_PHONE_ALLOWED_CHARS_REGEX = /^[\d\s\-+().]{7,}$/u;
const countPhoneDigits = (value) => (value.match(/\d/g) ?? []).length;
export const STRICT_E164_PHONE_MESSAGE = "Enter a phone number in international format, like +14155552671";
export const LENIENT_PHONE_MESSAGE = "Enter a valid phone number with at least 7 digits";
export const phoneSchema = z
    .string()
    .regex(STRICT_E164_PHONE_REGEX, STRICT_E164_PHONE_MESSAGE);
/**
 * Phone number validation schema (lenient format)
 * Accepts formatted phone numbers with spaces, dashes, parentheses, etc.
 * Requires at least 7 digits so punctuation-only placeholders do not pass.
 * Use for user-facing forms where UX accepts common formatting patterns.
 */
export const phoneSchemaLenient = z
    .string()
    .regex(LENIENT_PHONE_ALLOWED_CHARS_REGEX, LENIENT_PHONE_MESSAGE)
    .refine((value) => countPhoneDigits(value) >= 7, LENIENT_PHONE_MESSAGE);
/**
 * Normalizes a user-facing phone input to canonical E.164 when possible.
 *
 * This is intended for UI edges that accept punctuation/spaces or national-format
 * numbers, but must submit canonical E.164 across API boundaries.
 *
 * Behavior:
 * - `+1 (415) 555-2671` -> `+14155552671`
 * - `(415) 555-2671` -> `+14155552671` (defaults to US country code `1`)
 * - `14155552671` -> `+14155552671`
 * - invalid strings (letters, too few digits, etc.) -> `null`
 */
export function normalizePhoneToE164(value, options) {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    if (!phoneSchemaLenient.safeParse(trimmed).success) {
        return null;
    }
    const digits = trimmed.replace(/\D/g, "");
    if (!digits) {
        return null;
    }
    const defaultCountryCode = options?.defaultCountryCode ?? "1";
    const candidates = trimmed.startsWith("+")
        ? [`+${digits}`]
        : digits.length === 10
            ? [`+${defaultCountryCode}${digits}`]
            : digits.length === 11 && digits.startsWith(defaultCountryCode)
                ? [`+${digits}`]
                : [`+${digits}`];
    for (const candidate of candidates) {
        if (phoneSchema.safeParse(candidate).success) {
            return candidate;
        }
    }
    return null;
}
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
    .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
}, { message: "Invalid date format" })
    .refine((val) => {
    const date = new Date(val);
    return date <= new Date();
}, { message: "Date of birth cannot be in the future" })
    .refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const ageMs = now.getTime() - date.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    return ageYears >= MIN_AGE_YEARS;
}, { message: `Must be at least ${MIN_AGE_YEARS} years old` })
    .refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const ageMs = now.getTime() - date.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    return ageYears <= MAX_AGE_YEARS;
}, { message: `Age must be ${MAX_AGE_YEARS} years or less` });
//# sourceMappingURL=index.js.map