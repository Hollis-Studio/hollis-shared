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
import { baseDocumentSchema } from "../domain/common.js";
export * from "./json-blobs.js";
export * from "./weight.js";
export type BaseDocument = z.infer<typeof baseDocumentSchema>;
/**
 * Barcode format regex: HH-XXXXXX
 * Charset excludes confusable characters (0/O, 1/I/L).
 * Use this regex for validating newly issued barcodes.
 *
 * @see docs/IDENTIFIER_CONVENTIONS.md for full documentation.
 */
export declare const BARCODE_REGEX: RegExp;
/**
 * User ID regex: HH-XXXXXX where X is alphanumeric (more permissive than BARCODE_REGEX).
 * Some legacy/test IDs include characters outside the strict barcode charset (e.g., O),
 * so we accept the broader set here while keeping BARCODE_REGEX for barcode issuance.
 *
 * Use this regex for validating user IDs in API routes and queries.
 *
 * @see docs/IDENTIFIER_CONVENTIONS.md for full documentation.
 */
export declare const USER_ID_REGEX: RegExp;
/**
 * Zod schema for validating barcode format (strict).
 * Use for validating newly generated barcodes during registration.
 *
 * @description Validates HH-XXXXXX format with restricted charset.
 */
export declare const barcodeSchema: z.ZodString;
/**
 * Zod schema for validating user ID format (permissive).
 * Use for validating user IDs in API routes, queries, and request bodies.
 *
 * @description Validates HH-XXXXXX format with broader alphanumeric charset.
 * @note userId and barcode are the same value - User.id stores the barcode.
 */
export declare const userIdSchema: z.ZodString;
/**
 * Validates that a string matches the HH-XXXXXX barcode format
 */
export declare function isValidBarcode(code: string): boolean;
/**
 * Validates that a string matches the user ID format
 */
export declare function isValidUserId(id: string): boolean;
/**
 * Schema for routes with :userId param (validates HH-XXXXXX barcode format).
 *
 * userId is the primary user identifier - it IS the barcode value.
 * Use this for API routes like GET /users/:userId/profile.
 *
 * @see docs/IDENTIFIER_CONVENTIONS.md for full documentation.
 */
export declare const userIdParamSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
/**
 * Schema for routes with :date param (ISO date format)
 */
export declare const dateParamSchema: z.ZodObject<{
    date: z.ZodString;
}, z.core.$strip>;
export type DateParam = z.infer<typeof dateParamSchema>;
/**
 * Schema for routes with both :userId and :date params
 */
export declare const userIdAndDateParamsSchema: z.ZodObject<{
    userId: z.ZodString;
    date: z.ZodString;
}, z.core.$strip>;
export type UserIdAndDateParams = z.infer<typeof userIdAndDateParamsSchema>;
/**
 * Schema for date range query parameters
 */
export declare const dateRangeQuerySchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
}, z.core.$strip>;
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
/**
 * Schema for pagination query parameters with defaults
 */
export declare const paginationQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
/**
 * Schema for userId query parameter
 */
export declare const userIdQuerySchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export type UserIdQuery = z.infer<typeof userIdQuerySchema>;
/**
 * Simplified sex options for signup/onboarding flows.
 * Full biological sex options are in domain/user (BIOLOGICAL_SEXES).
 *
 * Use this for registration forms where a simpler set is appropriate.
 */
export declare const SIGNUP_SEX_OPTIONS: readonly ["male", "female", "other"];
export type SignupSex = (typeof SIGNUP_SEX_OPTIONS)[number];
/** Zod schema for signup sex field */
export declare const signupSexSchema: z.ZodEnum<{
    other: "other";
    female: "female";
    male: "male";
}>;
/**
 * Schema for login request body
 */
export declare const loginBodySchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginBody = z.infer<typeof loginBodySchema>;
/**
 * Schema for token refresh request body
 */
export declare const refreshBodySchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export type RefreshBody = z.infer<typeof refreshBodySchema>;
/**
 * Height validation schema (centimetres).
 * Physiologically reasonable bounds: 50–300 cm.
 */
export declare const heightCmSchema: z.ZodNumber;
/**
 * Schema for signup request body (barcode-based patient registration).
 *
 * The `code` field is the patient's barcode (HH-XXXXXX format).
 * After signup, this becomes the user's userId/User.id.
 */
export declare const signupBodySchema: z.ZodObject<{
    code: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    profile: z.ZodOptional<z.ZodObject<{
        heightCm: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        dateOfBirth: z.ZodOptional<z.ZodString>;
        biologicalSex: z.ZodOptional<z.ZodEnum<{
            female: "female";
            male: "male";
            non_binary: "non_binary";
            intersex: "intersex";
            prefer_not_to_say: "prefer_not_to_say";
        }>>;
        primaryGoal: z.ZodOptional<z.ZodEnum<{
            other: "other";
            lose_weight: "lose_weight";
            gain_muscle: "gain_muscle";
            maintain: "maintain";
            improve_health: "improve_health";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SignupBody = z.infer<typeof signupBodySchema>;
/**
 * Email validation schema
 */
export declare const emailSchema: z.ZodString;
/**
 * UUID validation schema
 */
export declare const uuidSchema: z.ZodString;
export declare const STRICT_E164_PHONE_MESSAGE = "Enter a phone number in international format, like +14155552671";
export declare const LENIENT_PHONE_MESSAGE = "Enter a valid phone number with at least 7 digits";
export declare const phoneSchema: z.ZodString;
/**
 * Phone number validation schema (lenient format)
 * Accepts formatted phone numbers with spaces, dashes, parentheses, etc.
 * Requires at least 7 digits so punctuation-only placeholders do not pass.
 * Use for user-facing forms where UX accepts common formatting patterns.
 */
export declare const phoneSchemaLenient: z.ZodString;
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
export declare function normalizePhoneToE164(value: string, options?: {
    defaultCountryCode?: string;
}): string | null;
/**
 * URL validation schema
 */
export declare const urlSchema: z.ZodString;
/**
 * Date of birth validation schema.
 * - Must be a valid ISO date string
 * - Must not be in the future
 * - Must meet COPPA minimum age of 13
 * - Must not exceed 120 years
 */
export declare const dateOfBirthSchema: z.ZodString;
//# sourceMappingURL=index.d.ts.map