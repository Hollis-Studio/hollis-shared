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

// Clinical domain - limitation severities, biometric sources
export * from './clinical';

// Sessions domain - session types, reset frequencies
export * from './sessions';
// Including: biometrics, clinical, nutrition, training, appointments, etc.
// ============================================================================
