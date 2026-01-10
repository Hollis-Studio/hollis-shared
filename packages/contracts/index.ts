/**
 * @ai-context Shared Contracts Module | Single source of truth for all contracts across the monorepo
 *
 * This module provides:
 * - API route definitions and types
 * - Domain contracts (types, schemas, constants)
 * - Shared Zod schemas for validation
 * - Common constants and enums
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

// API Routes
export * from './api';

// Domain contracts
export * from './domain';

// Zod schemas
export * from './schemas';

// Constants
export * from './constants';

// Admin contracts (types, routes, schemas)
export * from './admin';

// AI contracts (types, validation, prompts)
export * from './ai';

// Public contracts (contact forms, public API)
export * from './public';

// Stripe contracts (products, payment links)
export * from './stripe';

// Password contracts (validation, policies, reset)
// NOTE: Explicitly re-export passwordSchema from password module to resolve ambiguity
export { PASSWORD_POLICY, ZXCVBN_SCORE_LABELS, checkPasswordBreached, passwordLengthSchema, passwordSchema, validatePassword, validatePasswordStrength, type PasswordValidationResult } from './password';

// Error sanitization (PHI protection)
export { REDACTION_PLACEHOLDERS, containsPotentialPhi, sanitizeErrorMessage, sanitizeErrorObject } from './errorSanitization';
