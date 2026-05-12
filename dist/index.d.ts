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
export * from "./primitives/index.js";
export * from "./api/index.js";
export * from "./domain/index.js";
export * from "./progression/index.js";
export * from "./schemas/index.js";
export * from "./constants/index.js";
export * from "./admin/index.js";
export * from "./ai/index.js";
export * from "./public/index.js";
export * from "./stripe/index.js";
export { PASSWORD_POLICY, ZXCVBN_SCORE_LABELS, checkPasswordBreached, forgotPasswordRequestSchema, passwordLengthSchema, passwordResetResponseSchema, passwordSchema, resetPasswordRequestSchema, validatePassword, validatePasswordStrength, type ForgotPasswordRequest, type PasswordResetResponse, type PasswordValidationResult, type ResetPasswordRequest } from "./password/index.js";
export { AccountStatusSchema as accountStatusSchema, ActivityLevelSchema as activityLevelSchema, BiologicalSexSchema as biologicalSexSchema, FITNESS_EXPERIENCES as EXPERIENCE_LEVELS, FitnessExperienceSchema as experienceLevelSchema, PregnancyStatusSchema as pregnancyStatusSchema, PrimaryGoalSchema as primaryGoalSchema, UserAccountSchema as userAccountSchema, UserGoalsSchema as userGoalsSchema, UserMetricsSchema as userMetricsSchema, UserPreferencesSchema as userPreferencesSchema, UserProfileSchema as userProfileSchema } from "./domain/user.js";
export { FoodSourceSchema as foodSourceSchema } from "./domain/nutrition.js";
export { DailySummarySchema as dailySummarySchema, WearablesDataSchema as wearablesDataSchema } from "./domain/health-metrics.js";
export * from "./errors/index.js";
export { REDACTION_PLACEHOLDERS, containsPotentialPhi, sanitizeErrorMessage, sanitizeErrorObject } from "./errorSanitization.js";
export { sanitizeSentryEvent, sanitizeSentryLog, type SentryEventLike, type SentryLogLike } from "./sentrySanitization.js";
//# sourceMappingURL=index.d.ts.map