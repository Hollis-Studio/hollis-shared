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
export * from "./common";

// User domain - roles, tiers, profile enums
export * from "./user";

// App review/demo credentials - canonical reviewer accounts used across surfaces
export * from "./app-review";

// Master offer sheet - canonical commercial terms for memberships
export * from "./offer-sheet";

// Appointment domain - statuses, types, booking steps
export * from "./appointments";

// Nutrition domain - meal types, location types
export * from "./nutrition";

// Training domain - strategy types, goal categories
// NOTE: HEALTH_METRIC_* enums NOT re-exported to avoid conflicts (use health-progress instead)
export {
    GOAL_CATEGORIES,
    GOAL_CATEGORY,
    GOAL_CATEGORY_LABELS,
    GOAL_DATA_SOURCE,
    GOAL_DATA_SOURCES,
    GOAL_DATA_SOURCE_LABELS,
    GoalCategorySchema,
    GoalDataSourceSchema,
    GoalDirectionSchema,
    LEGACY_GOAL_DATA_SOURCES,
    LegacyGoalDataSourceSchema,
    STRATEGY_GENERATION_EVENT,
    STRATEGY_GENERATION_EVENTS,
    STRATEGY_GENERATION_PHASE,
    STRATEGY_GENERATION_PHASES,
    STRATEGY_STATUS,
    STRATEGY_STATUSES,
    STRATEGY_STATUS_LABELS,
    STRATEGY_TYPE,
    STRATEGY_TYPES,
    STRATEGY_TYPE_LABELS,
    StrategyGoalSchema,
    StrategyStatusSchema,
    StrategyTypeSchema,
    TrainingPhaseSchema,
    TrainingStrategySchema,
    WORKOUT_TYPE,
    WORKOUT_TYPES,
    WORKOUT_TYPE_LABELS,
    WorkoutTypeSchema,
    createMockTrainingPhase,
    createMockTrainingStrategy,
    isGoalCategory,
    isGoalDataSource,
    isStrategyStatus,
    isStrategyType,
    isWorkoutType,
    normalizeGoalDataSource,
    strategyGenerationEventSchema,
    strategyGenerationPhaseSchema,
    type GoalCategory,
    type GoalDataSource,
    type GoalDirection,
    type LegacyGoalDataSource,
    type StrategyGenerationEventType,
    type StrategyGenerationPhase,
    type StrategyGoalContract,
    type StrategyStatus,
    type StrategyType,
    type TrainingPhaseContract,
    type TrainingStrategyContract,
    type WorkoutType
} from "./training";

// Workout domain - session, plan, and set schemas
export * from "./workouts";

// Clinical domain - limitation severities, biometric sources
export * from "./clinical";

// Sessions domain - session types, reset frequencies
export * from "./sessions";

// Recovery sessions domain - structured recovery modality logs
export * from "./recovery-sessions";

// Labs domain - lab result statuses and flags
export * from "./labs";

// Registration domain - registration statuses
export * from "./registration";

// Analytics domain - trends, statuses, chart types, time ranges
export * from "./analytics";

// Business Analytics domain - CRM dashboard, compliance, trainer effectiveness
export * from "./businessAnalytics";

// MFA domain - multi-factor auth types and clinician assignments
export * from "./mfa";

// PHI Audit domain - audit trail types for HIPAA compliance
export * from "./phi-audit";

// AI Notes domain - workout session notes, permanent notes
export * from "./ai-notes";

// Pagination types - for consistent list responses
export * from "./pagination";

// Clinical Registry domain - clinical metric definitions schema
export * from "./clinical-registry.schema";

// Metric Definition domain - lightweight MetricDefinition summary for API responses
export * from "./metric-definition";

// Biometrics domain - canonical biometric keys for validation
export * from "./biometrics";

// Organization domain - multi-tenancy for MSO model
export * from "./organization";

export * from "./appointment-config";
export * from "./documents";

// Realtime domain - SSE resource types, event types
export * from "./realtime";

// Health Progress domain - health metrics, trends, data quality
// Canonical source for HEALTH_METRIC_* enums and utility functions
export {
    DATA_QUALITY,
    DATA_QUALITY_LABELS,
    DATA_QUALITY_LEVELS,
    DataQualityLevelSchema,
    HEALTH_METRIC_CATEGORIES,
    HEALTH_METRIC_CATEGORY_LABELS,
    HEALTH_METRIC_DIRECTIONS,
    HEALTH_TREND,
    HEALTH_TRENDS,
    HEALTH_TREND_LABELS,
    HealthMetricCategorySchema,
    HealthMetricDirectionSchema,
    HealthMetricKeySchema,
    HealthTrendSchema,
    SOURCE_WEIGHTS,
    VERIFICATION_MULTIPLIER,
    determineTrendFromDirection,
    getDataPointWeight,
    isDataQualityLevel,
    isHealthTrend,
    type DataQualityLevel,
    type HealthMetricCategory,
    type HealthMetricDirection,
    type HealthMetricKey,
    type HealthTrend
} from "./health-progress";

// Health Metrics domain - unified health metric types, utilities, and schemas
// Provides additional utility functions (calculateInRangeScore, etc.),
// and related types (MetricChange, ConcernArea, HealthProgressOverview, etc.)
export {
    ConcernAreaSchema,
    DailySummarySchema,
    HealthImprovementPointSchema,
    HealthMetricGoalSchema,
    HealthMetricGoalUpsertSchema, HealthProgressImprovementSchema,
    HealthProgressOverviewSchema,
    HealthProgressSnapshotSchema,
    MetricAggregateSchema,
    MetricChangeSchema,
    PatientClinicalContextSchema,
    PatientHealthProgressSchema,
    RangeDerivationModifierSchema,
    RangeDerivationSchema,
    RangeDerivationStepSchema,
    WearablesDataSchema,
    calculateInRangeScore,
    getDefaultReferenceRange, healthGoalsListResponseSchema, type ConcernArea,
    type DailySummaryContract, type HealthGoalsListResponse, type HealthImprovementPoint, type HealthMetricGoal, type HealthMetricGoalContract,
    type HealthMetricGoalUpsert,
    type HealthProgressImprovement,
    type HealthProgressOverview,
    type HealthProgressSnapshot,
    type MetricAggregate,
    type MetricChange,
    type PatientClinicalContext,
    type PatientHealthProgress,
    type RangeDerivation,
    type RangeDerivationModifier,
    type RangeDerivationStep,
    type WearablesDataContract,
    HealthMetricSummarySchema,
    type HealthMetricSummaryContract
} from "./health-metrics";

// Exercise domain - exercise definitions, logs, and performance tracking
export * from "./exercise";

// Daily Metrics domain - TDEE, recovery, training load
export * from "./daily-metrics";

// Sleep domain - sleep entry form validation schemas
export * from "./sleep";

// Journal domain - journal entries and AI assessments
export * from "./journal";

// Compliance domain - tier-aware compliance tracking
export * from "./compliance";

// Push notifications domain - platforms, app roles, token management
export * from "./push";

// Units domain - unit systems and conversion constants for all measurement types
export * from "./units";

// Admin Notifications domain - realtime notification types for admin dashboard
// NOTE: Not re-exported from this barrel — ADMIN_REALTIME_NOTIFICATION_KINDS
// types are already exported via shared/contracts/admin, and re-exporting
// them here produces duplicate-export lint errors at shared/contracts/index.ts.
// Consumers should import from '@hollis-health/contracts/admin' instead.
// export * from './admin-notifications';

// Messages domain - conversation and messaging types
export * from "./messages";

// Nutrition Plan domain - nutrition targets, progress, and plans
export * from "./nutrition-plan";

// Training Strategy domain - detailed strategy schemas and goal sync
// NOTE: Excluding deprecated camelCase schema aliases (use PascalCase from ./training)
// NOTE: Excluding volume level re-exports (already exported from ../primitives)
// NOTE: Excluding StrategyGenerationProgressSchema, StrategyGenerationResultSchema,
//   StrategyClarificationNeededSchema to avoid conflicts with web-admin validation schemas.
//   Import directly from '@hollis/contracts/domain/training-strategy' when needed.
export {
    CreateDetailedStrategyGoalSchema,
    CreateDetailedTrainingPhaseSchema,
    CreateDetailedTrainingStrategySchema,
    DetailedStrategyGoalSchema,
    DetailedTrainingPhaseSchema,
    DetailedTrainingStrategySchema,
    GOAL_SYNC_ERROR_CODES,
    GoalSyncResultSchema,
    StrategyDraftSchema,
    StrategyGenerationActivitySchema,
    StrategyGenerationResponseSchema,
    StrategyGoalDraftSchema,
    SyncAllGoalsResultSchema,
    TrainingPhaseDraftSchema,
    UpdateDetailedTrainingStrategySchema,
    calculateGoalProgress,
    calculateStrategyProgress,
    createMockDetailedStrategyGoal,
    createMockDetailedTrainingPhase,
    createMockDetailedTrainingStrategy,
    createMockStrategyClarificationNeeded,
    createMockStrategyDraft,
    createMockStrategyGenerationProgress,
    createMockStrategyGenerationResult,
    createMockStrategyGoalDraft,
    createMockTrainingPhaseDraft,
    getCurrentPhase,
    type DetailedStrategyGoalContract,
    type DetailedTrainingPhaseContract,
    type DetailedTrainingStrategyContract,
    type GoalSyncErrorCode,
    type GoalSyncResultContract,
    type StrategyClarificationNeededContract,
    type StrategyDraftContract,
    type StrategyGenerationActivityContract,
    type StrategyGenerationProgressContract,
    type StrategyGenerationResponseContract,
    type StrategyGenerationResultContract,
    type StrategyGoalDraftContract,
    type SyncAllGoalsResultContract,
    type TrainingPhaseDraftContract
} from "./training-strategy";

// Enum Contract utilities - factory for creating type-safe enum contracts
export * from "./enumContract";

// Metric Codes domain - canonical metric definition codes
export * from "./metric-codes";

// Billing domain - billing status, dispute status
export * from "./billing";

// Jobs domain - cron job run status values
export * from "./jobs";

// Admin Tasks domain - task types, priorities, statuses
export * from "./admin-tasks";

// Auth Token domain - refresh token revocation reasons
export * from "./auth-tokens";

// Health Metric Types - core type definitions for health metrics (imported by health-metric-definitions)
// NOTE: MetricCategorySchema and MetricCategory are already re-exported through metric-definition.ts.
// Export the constant maps and value-type / trend-direction symbols that are not covered elsewhere.
export {
    METRIC_CATEGORY,
    METRIC_CATEGORY_LABELS,
    METRIC_VALUE_TYPE,
    METRIC_VALUE_TYPE_LABELS,
    METRIC_VALUE_TYPES,
    MetricValueTypeSchema,
    TREND_DIRECTION,
    TREND_DIRECTION_LABELS,
    TREND_DIRECTIONS,
    TrendDirectionSchema,
    isMetricCategory,
    isMetricValueType,
    isTrendDirection,
    type MetricValueType,
    type TrendDirection,
} from "./health-metric-types";

// Health Metric Definitions - registry of all health metric definitions
// NOTE: Already re-exported through health-progress.ts, no need to export directly to avoid conflicts
// export * from './health-metric-definitions';
