/**
 * @ai-context Shared Contracts Module | Single source of truth for all contracts across the monorepo
 *
 * CONVENTION: All domain enums use UPPER_CASE values to match Prisma enum definitions.
 * This is the canonical import alias: `@contracts` (or `@hollis/contracts`).
 *
 * This module provides:
 * - API route definitions and types
 * - Domain contracts (types, schemas, constants)
 * - Shared Zod schemas for validation
 * - Common constants and enums
 * - Primitive types (no cross-dependencies)
 * - Admin contracts for CRM/admin operations
 * - AI contracts for AI-powered features
 *
 * IMPORTANT: This module must remain pure TypeScript + Zod only.
 * - NO React/React Native imports
 * - NO Node.js-only imports (fs, path, etc.)
 * - NO platform-specific code
 *
 * Consumers:
 * - Mobile app: /src/*
 * - Backend server: /server/src/*
 * - Web admin: /web-admin/*
 *
 * @packageDocumentation
 */

// Primitives (exported first to avoid circular dependencies)
export * from "./primitives/index.js";

// API Routes
export * from "./api/index.js";

// Domain contracts (includes units, user, appointments, nutrition, training, clinical, etc.)
export * from "./domain/index.js";

// Zod schemas
export * from "./schemas/index.js";

// Constants
export * from "./constants/index.js";

// Admin contracts (types, routes, schemas)
export * from "./admin/index.js";

// AI contracts (types, validation, prompts)
export * from "./ai/index.js";

// Public contracts (contact forms, public API)
export * from "./public/index.js";

// Stripe contracts (products, payment links)
export * from "./stripe/index.js";

// Password contracts (validation, policies, reset)
// NOTE: Explicitly re-export passwordSchema from password module to resolve ambiguity
export {
    PASSWORD_POLICY,
    ZXCVBN_SCORE_LABELS,
    checkPasswordBreached,
    passwordLengthSchema,
    passwordResetResponseSchema,
    passwordSchema,
    validatePassword,
    validatePasswordStrength,
    type PasswordResetResponse,
    type PasswordValidationResult
} from "./password/index.js";

// Shared error classes
export * from "./errors/index.js";

// Error sanitization (PHI protection)
export {
    REDACTION_PLACEHOLDERS,
    containsPotentialPhi,
    sanitizeErrorMessage,
    sanitizeErrorObject
} from "./errorSanitization.js";

// Sentry sanitization (PHI protection across all surfaces)
export { sanitizeSentryEvent, sanitizeSentryLog, type SentryEventLike, type SentryLogLike } from "./sentrySanitization.js";
