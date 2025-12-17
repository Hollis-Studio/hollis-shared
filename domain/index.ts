/**
 * @ai-context Domain Contracts Barrel | exports all domain types, interfaces, and constants
 *
 * This module provides domain-specific contracts including:
 * - User roles and tiers
 * - Appointment types and statuses
 * - Nutrition types (meal types, etc.)
 * - Training/workout types
 * - Clinical types
 * - Session types
 *
 * deps: zod | consumers: all codebases
 */

// Common types
export * from './common';

// User domain - roles, tiers, profile enums
export * from './user';

// Appointment domain - statuses, types, booking steps
export * from './appointments';

// Nutrition domain - meal types, location types
export * from './nutrition';

// Training domain - strategy types, goal categories
export * from './training';

// Workout domain - session, plan, and set schemas
export * from './workouts';

// Clinical domain - limitation severities, biometric sources
export * from './clinical';

// Sessions domain - session types, reset frequencies
export * from './sessions';

// Labs domain - lab result statuses and flags
export * from './labs';

// Registration domain - registration statuses
export * from './registration';

// Analytics domain - trends, statuses, chart types, time ranges
export * from './analytics';

// MFA domain - multi-factor auth types and clinician assignments
export * from './mfa';

// PHI Audit domain - audit trail types for HIPAA compliance
export * from './phi-audit';

// AI Notes domain - workout session notes, permanent notes
export * from './ai-notes';

// Reference Ranges domain - metric limits and modifiers
export * from './reference-ranges';
