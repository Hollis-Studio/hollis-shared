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
// NOTE: HEALTH_METRIC_* enums NOT re-exported to avoid conflicts (use health-progress instead)
export {
  STRATEGY_TYPES,
  type StrategyType,
  StrategyTypeSchema,
  STRATEGY_TYPE,
  STRATEGY_TYPE_LABELS,
  isStrategyType,
  STRATEGY_STATUSES,
  type StrategyStatus,
  StrategyStatusSchema,
  STRATEGY_STATUS,
  STRATEGY_STATUS_LABELS,
  isStrategyStatus,
  GOAL_CATEGORIES,
  type GoalCategory,
  GoalCategorySchema,
  GOAL_CATEGORY,
  GOAL_CATEGORY_LABELS,
  isGoalCategory,
  GOAL_DATA_SOURCES,
  type GoalDataSource,
  GoalDataSourceSchema,
  GOAL_DATA_SOURCE,
  GOAL_DATA_SOURCE_LABELS,
  isGoalDataSource,
  type GoalDirection,
  GoalDirectionSchema,
  WORKOUT_TYPES,
  type WorkoutType,
  WorkoutTypeSchema,
  WORKOUT_TYPE,
  WORKOUT_TYPE_LABELS,
  isWorkoutType,
  type TrainingPhaseContract,
  TrainingPhaseSchema,
  type TrainingStrategyContract,
  TrainingStrategySchema,
  type StrategyGoalContract,
  StrategyGoalSchema,
  STRATEGY_GENERATION_PHASES,
  type StrategyGenerationPhase,
  strategyGenerationPhaseSchema,
  STRATEGY_GENERATION_PHASE,
  STRATEGY_GENERATION_EVENTS,
  type StrategyGenerationEventType,
  strategyGenerationEventSchema,
  STRATEGY_GENERATION_EVENT,
  createMockTrainingPhase,
  createMockTrainingStrategy,
} from './training';

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
// Canonical source for HEALTH_METRIC_* enums and utility functions
export {
  HEALTH_METRIC_DIRECTIONS,
  type HealthMetricDirection,
  HealthMetricDirectionSchema,
  HEALTH_METRIC_CATEGORIES,
  type HealthMetricCategory,
  HealthMetricCategorySchema,
  HEALTH_METRIC_CATEGORY_LABELS,
  HEALTH_TRENDS,
  type HealthTrend,
  HealthTrendSchema,
  HEALTH_TREND,
  HEALTH_TREND_LABELS,
  isHealthTrend,
  DATA_QUALITY_LEVELS,
  type DataQualityLevel,
  DataQualityLevelSchema,
  DATA_QUALITY,
  DATA_QUALITY_LABELS,
  isDataQualityLevel,
  EXPECTED_UNITS,
  getExpectedUnit,
  isUnitMatch,
  SOURCE_WEIGHTS,
  VERIFICATION_MULTIPLIER,
  getDataPointWeight,
  getMetricDirection,
  getMetricCategory,
  isWithinNormalRange,
  determineTrend,
  HealthMetricKeySchema,
  BIOMETRIC_KEY_MAP,
  LAB_NAME_MAP,
} from './health-progress';

// Health Metrics domain - unified health metric types, utilities, and schemas
// Provides additional utility functions (calculateInRangeScore, etc.),
// and related types (MetricChange, ConcernArea, HealthProgressOverview, etc.)
// NOTE: For GOAL_METRIC_DEFINITIONS and GOAL_METRIC_KEYS, import from goal-metrics.ts
export {
  type MetricChange,
  MetricChangeSchema,
  type ConcernArea,
  ConcernAreaSchema,
  type MetricAggregate,
  MetricAggregateSchema,
  type HealthImprovementPoint,
  HealthImprovementPointSchema,
  type HealthProgressImprovement,
  HealthProgressImprovementSchema,
  type HealthProgressOverview,
  HealthProgressOverviewSchema,
  type HealthProgressSnapshot,
  HealthProgressSnapshotSchema,
  type PatientHealthProgress,
  PatientHealthProgressSchema,
  type PatientClinicalContext,
  PatientClinicalContextSchema,
  type RangeDerivationStep,
  type RangeDerivationModifier,
  type RangeDerivation,
  RangeDerivationStepSchema,
  RangeDerivationModifierSchema,
  RangeDerivationSchema,
  type HealthMetricGoalContract,
  HealthMetricGoalSchema,
  HealthMetricGoalUpsertSchema,
  type HealthMetricGoalUpsert,
  type WearablesDataContract,
  WearablesDataSchema,
  type DailySummaryContract,
  DailySummarySchema,
  getDefaultReferenceRange,
  calculateInRangeScore,
  HEALTH_METRIC_LABELS,
} from './health-metrics';

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

// Units domain - unit systems and conversion constants for all measurement types
export * from './units';

// Admin Notifications domain - realtime notification types for admin dashboard
// NOTE: Already exported from ../admin/notifications.ts, skipping to avoid conflicts
// export * from './admin-notifications';

// Messages domain - conversation and messaging types
export * from './messages';

// Nutrition Plan domain - nutrition targets, progress, and plans
export * from './nutrition-plan';

// Training Strategy domain - detailed strategy schemas and goal sync
// NOTE: Excluding deprecated camelCase schema aliases (use PascalCase from ./training)
// NOTE: Excluding volume level re-exports (already exported from ../primitives)
// NOTE: Excluding StrategyGenerationProgressSchema, StrategyGenerationResultSchema,
//   StrategyClarificationNeededSchema to avoid conflicts with web-admin validation schemas.
//   Import directly from '@hollis/contracts/domain/training-strategy' when needed.
export {
  type DetailedStrategyGoalContract,
  DetailedStrategyGoalSchema,
  type DetailedTrainingPhaseContract,
  DetailedTrainingPhaseSchema,
  type DetailedTrainingStrategyContract,
  DetailedTrainingStrategySchema,
  CreateDetailedStrategyGoalSchema,
  CreateDetailedTrainingPhaseSchema,
  CreateDetailedTrainingStrategySchema,
  UpdateDetailedTrainingStrategySchema,
  GOAL_SYNC_ERROR_CODES,
  type GoalSyncErrorCode,
  type GoalSyncResultContract,
  GoalSyncResultSchema,
  type SyncAllGoalsResultContract,
  SyncAllGoalsResultSchema,
  type StrategyGoalDraftContract,
  StrategyGoalDraftSchema,
  type TrainingPhaseDraftContract,
  TrainingPhaseDraftSchema,
  type StrategyDraftContract,
  StrategyDraftSchema,
  type StrategyGenerationActivityContract,
  StrategyGenerationActivitySchema,
  type StrategyGenerationProgressContract,
  type StrategyGenerationResultContract,
  type StrategyClarificationNeededContract,
  type StrategyGenerationResponseContract,
  StrategyGenerationResponseSchema,
  calculateGoalProgress,
  calculateStrategyProgress,
  getCurrentPhase,
  createMockDetailedTrainingPhase,
  createMockDetailedStrategyGoal,
  createMockDetailedTrainingStrategy,
  createMockStrategyGoalDraft,
  createMockTrainingPhaseDraft,
  createMockStrategyDraft,
  createMockStrategyGenerationProgress,
  createMockStrategyGenerationResult,
  createMockStrategyClarificationNeeded,
} from './training-strategy';

// Enum Contract utilities - factory for creating type-safe enum contracts
export * from './enumContract';

// Billing domain - billing status, dispute status
export * from './billing';

// Admin Tasks domain - task types, priorities, statuses
export * from './admin-tasks';

// Health Metric Types - core type definitions for health metrics (imported by health-metric-definitions)
// NOTE: Already re-exported through health-progress.ts, no need to export directly
// export * from './health-metric-types';

// Health Metric Definitions - registry of all health metric definitions
// NOTE: Already re-exported through health-progress.ts, no need to export directly to avoid conflicts
// export * from './health-metric-definitions';
