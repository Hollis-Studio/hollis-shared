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
export * from "./common.js";
// User domain - roles, tiers, profile enums
export * from "./user.js";
// App review/demo credentials - canonical reviewer accounts used across surfaces
export * from "./app-review.js";
// Master offer sheet - canonical commercial terms for memberships
export * from "./offer-sheet.js";
// Appointment domain - statuses, types, booking steps
export * from "./appointments.js";
// Nutrition domain - meal types, location types
export * from "./nutrition.js";
// Training domain - strategy types, goal categories
// NOTE: HEALTH_METRIC_* enums NOT re-exported to avoid conflicts (use health-progress instead)
export { GOAL_CATEGORIES, GOAL_CATEGORY, GOAL_CATEGORY_LABELS, GOAL_DATA_SOURCE, GOAL_DATA_SOURCES, GOAL_DATA_SOURCE_LABELS, GoalCategorySchema, GoalDataSourceSchema, GoalDirectionSchema, LEGACY_GOAL_DATA_SOURCES, LegacyGoalDataSourceSchema, STRATEGY_GENERATION_EVENT, STRATEGY_GENERATION_EVENTS, STRATEGY_GENERATION_PHASE, STRATEGY_GENERATION_PHASES, STRATEGY_STATUS, STRATEGY_STATUSES, STRATEGY_STATUS_LABELS, STRATEGY_TYPE, STRATEGY_TYPES, STRATEGY_TYPE_LABELS, StrategyGoalSchema, StrategyStatusSchema, StrategyTypeSchema, TrainingPhaseSchema, TrainingStrategySchema, WORKOUT_TYPE, WORKOUT_TYPES, WORKOUT_TYPE_LABELS, WorkoutTypeSchema, createMockTrainingPhase, createMockTrainingStrategy, isGoalCategory, isGoalDataSource, isStrategyStatus, isStrategyType, isWorkoutType, normalizeGoalDataSource, strategyGenerationEventSchema, strategyGenerationPhaseSchema } from "./training.js";
// Workout domain - session, plan, and set schemas
export * from "./workouts.js";
export * from "./muscles.js";
export * from "./equipment.js";
export * from "./cardio-session.js";
export * from "./training-session-log.js";
// Clinical domain - limitation severities, biometric sources
export * from "./clinical.js";
// Sessions domain - session types, reset frequencies
export * from "./sessions.js";
// Recovery sessions domain - structured recovery modality logs
export * from "./recovery-sessions.js";
// Labs domain - lab result statuses and flags
export * from "./labs.js";
// Registration domain - registration statuses
export * from "./registration.js";
// Analytics domain - trends, statuses, chart types, time ranges
export * from "./analytics.js";
// Business Analytics domain - CRM dashboard, compliance, trainer effectiveness
export * from "./businessAnalytics.js";
// MFA domain - multi-factor auth types and clinician assignments
export * from "./mfa.js";
// PHI Audit domain - audit trail types for HIPAA compliance
export * from "./phi-audit.js";
// AI Notes domain - workout session notes, permanent notes
export * from "./ai-notes.js";
// Pagination types - for consistent list responses
export * from "./pagination.js";
// Clinical Registry domain - clinical metric definitions schema
export * from "./clinical-registry.schema.js";
// Metric Definition domain - lightweight MetricDefinition summary for API responses
export * from "./metric-definition.js";
// Biometrics domain - canonical biometric keys for validation
export * from "./biometrics.js";
// Organization domain - multi-tenancy for MSO model
export * from "./organization.js";
export * from "./appointment-config.js";
export * from "./documents.js";
// Realtime domain - SSE resource types, event types
export * from "./realtime.js";
// Health Progress domain - health metrics, trends, data quality
// Canonical source for HEALTH_METRIC_* enums and utility functions
export { DATA_QUALITY, DATA_QUALITY_LABELS, DATA_QUALITY_LEVELS, DataQualityLevelSchema, HEALTH_METRIC_CATEGORIES, HEALTH_METRIC_CATEGORY_LABELS, HEALTH_METRIC_DIRECTIONS, HEALTH_TREND, HEALTH_TRENDS, HEALTH_TREND_LABELS, HealthMetricCategorySchema, HealthMetricDirectionSchema, HealthMetricKeySchema, HealthTrendSchema, SOURCE_WEIGHTS, VERIFICATION_MULTIPLIER, determineTrendFromDirection, getDataPointWeight, isDataQualityLevel, isHealthTrend } from "./health-progress.js";
// Health Metrics domain - unified health metric types, utilities, and schemas
// Provides additional utility functions (calculateInRangeScore, etc.),
// and related types (MetricChange, ConcernArea, HealthProgressOverview, etc.)
export { ConcernAreaSchema, DailySummarySchema, HealthImprovementPointSchema, HealthMetricGoalSchema, HealthMetricGoalUpsertSchema, HealthProgressImprovementSchema, HealthProgressOverviewSchema, HealthProgressSnapshotSchema, MetricAggregateSchema, MetricChangeSchema, PatientClinicalContextSchema, PatientHealthProgressSchema, RangeDerivationModifierSchema, RangeDerivationSchema, RangeDerivationStepSchema, WearablesDataSchema, calculateInRangeScore, getDefaultReferenceRange, healthGoalsListResponseSchema, HealthMetricSummarySchema } from "./health-metrics.js";
// Exercise domain - exercise definitions, logs, and performance tracking
export * from "./exercise.js";
// Daily Metrics domain - TDEE, recovery, training load
export * from "./daily-metrics.js";
// Sleep domain - sleep entry form validation schemas
export * from "./sleep.js";
// Journal domain - journal entries and AI assessments
export * from "./journal.js";
// Compliance domain - tier-aware compliance tracking
export * from "./compliance.js";
// Push notifications domain - platforms, app roles, token management
export * from "./push.js";
// Units domain - unit systems and conversion constants for all measurement types
export * from "./units.js";
// Admin Notifications domain - realtime notification types for admin dashboard
// NOTE: Not re-exported from this barrel — ADMIN_REALTIME_NOTIFICATION_KINDS
// types are already exported via shared/contracts/admin, and re-exporting
// them here produces duplicate-export lint errors at shared/contracts/index.ts.
// Consumers should import from '@hollis-health/contracts/admin' instead.
// export * from './admin-notifications.js';
// Messages domain - conversation and messaging types
export * from "./messages.js";
// Nutrition Plan domain - nutrition targets, progress, and plans
export * from "./nutrition-plan.js";
// Training Strategy domain - detailed strategy schemas and goal sync
// NOTE: Excluding deprecated camelCase schema aliases (use PascalCase from ./training)
// NOTE: Excluding volume level re-exports (already exported from ../primitives)
// NOTE: Excluding StrategyGenerationProgressSchema, StrategyGenerationResultSchema,
//   StrategyClarificationNeededSchema to avoid conflicts with web-admin validation schemas.
//   Import directly from '@hollis/contracts/domain/training-strategy' when needed.
export { CreateDetailedStrategyGoalSchema, CreateDetailedTrainingPhaseSchema, CreateDetailedTrainingStrategySchema, DetailedStrategyGoalSchema, DetailedTrainingPhaseSchema, DetailedTrainingStrategySchema, GOAL_SYNC_ERROR_CODES, GoalSyncResultSchema, StrategyDraftSchema, StrategyGenerationActivitySchema, StrategyGenerationResponseSchema, StrategyGoalDraftSchema, SyncAllGoalsResultSchema, TrainingPhaseDraftSchema, UpdateDetailedTrainingStrategySchema, calculateGoalProgress, calculateStrategyProgress, createMockDetailedStrategyGoal, createMockDetailedTrainingPhase, createMockDetailedTrainingStrategy, createMockStrategyClarificationNeeded, createMockStrategyDraft, createMockStrategyGenerationProgress, createMockStrategyGenerationResult, createMockStrategyGoalDraft, createMockTrainingPhaseDraft, getCurrentPhase } from "./training-strategy.js";
// Enum Contract utilities - factory for creating type-safe enum contracts
export * from "./enumContract.js";
// Metric Codes domain - canonical metric definition codes
export * from "./metric-codes.js";
// Billing domain - billing status, dispute status
export * from "./billing.js";
// Jobs domain - cron job run status values
export * from "./jobs.js";
// Admin Tasks domain - task types, priorities, statuses
export * from "./admin-tasks.js";
// Auth Token domain - refresh token revocation reasons
export * from "./auth-tokens.js";
// Health Metric Types - core type definitions for health metrics (imported by health-metric-definitions)
// NOTE: MetricCategorySchema and MetricCategory are already re-exported through metric-definition.ts.
// Export the constant maps and value-type / trend-direction symbols that are not covered elsewhere.
export { METRIC_CATEGORY, METRIC_CATEGORY_LABELS, METRIC_VALUE_TYPE, METRIC_VALUE_TYPE_LABELS, METRIC_VALUE_TYPES, MetricValueTypeSchema, TREND_DIRECTION, TREND_DIRECTION_LABELS, TREND_DIRECTIONS, TrendDirectionSchema, isMetricCategory, isMetricValueType, isTrendDirection, } from "./health-metric-types.js";
// Health Metric Definitions - registry of all health metric definitions
// NOTE: Already re-exported through health-progress.ts, no need to export directly to avoid conflicts
// export * from './health-metric-definitions';
// Marketing domain - AI-generated marketing asset image types and schemas
export * from "./marketing.js";
//# sourceMappingURL=index.js.map