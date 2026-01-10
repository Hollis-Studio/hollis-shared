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

// Business Analytics domain - CRM dashboard, compliance, trainer effectiveness
export * from './businessAnalytics';

// MFA domain - multi-factor auth types and clinician assignments
export * from './mfa';

// PHI Audit domain - audit trail types for HIPAA compliance
export * from './phi-audit';

// AI Notes domain - workout session notes, permanent notes
export * from './ai-notes';

// Pagination types - for consistent list responses
export * from './pagination';

// Clinical Registry domain - clinical metric definitions schema
export * from './clinical-registry.schema';

// Goal Metrics domain - canonical goal metric keys for validation
export * from './goal-metrics';

// Biometrics domain - canonical biometric keys for validation
export * from './biometrics';

// Organization domain - multi-tenancy for MSO model
export * from './organization';

export * from './appointment-config';
export * from './documents';

// Realtime domain - SSE resource types, event types
export * from './realtime';

// Health Progress domain - health metrics, trends, data quality
export * from './health-progress';

// Health Metrics domain - unified health metric types, utilities, and schemas
// Provides HEALTH_METRIC_DEFINITIONS, HEALTH_METRIC_KEYS, HealthMetricKey,
// utility functions (getMetricCategory, determineTrend, calculateInRangeScore, etc.),
// and related types (MetricChange, ConcernArea, HealthProgressOverview, etc.)
export * from './health-metrics';

// Exercise domain - exercise definitions, logs, and performance tracking
export * from './exercise';

// Daily Metrics domain - TDEE, recovery, training load
export * from './daily-metrics';

// Journal domain - journal entries and AI assessments
export * from './journal';

// Compliance domain - tier-aware compliance tracking
export * from './compliance';

// Push notifications domain - platforms, app roles, token management
export * from './push';

// Metric key conversion utilities - bidirectional mapping between GoalMetricKey and HealthMetricKey
export * from './metric-key-conversion';
