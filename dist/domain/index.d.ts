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
export * from "./common.js";
export * from "./user.js";
export * from "./app-review.js";
export * from "./offer-sheet.js";
export * from "./appointments.js";
export * from "./nutrition.js";
export { GOAL_CATEGORIES, GOAL_CATEGORY, GOAL_CATEGORY_LABELS, GOAL_DATA_SOURCE, GOAL_DATA_SOURCES, GOAL_DATA_SOURCE_LABELS, GoalCategorySchema, GoalDataSourceSchema, GoalDirectionSchema, LEGACY_GOAL_DATA_SOURCES, LegacyGoalDataSourceSchema, STRATEGY_GENERATION_EVENT, STRATEGY_GENERATION_EVENTS, STRATEGY_GENERATION_PHASE, STRATEGY_GENERATION_PHASES, STRATEGY_STATUS, STRATEGY_STATUSES, STRATEGY_STATUS_LABELS, STRATEGY_TYPE, STRATEGY_TYPES, STRATEGY_TYPE_LABELS, StrategyGoalSchema, StrategyStatusSchema, StrategyTypeSchema, TrainingPhaseSchema, TrainingStrategySchema, WORKOUT_TYPE, WORKOUT_TYPES, WORKOUT_TYPE_LABELS, WorkoutTypeSchema, createMockTrainingPhase, createMockTrainingStrategy, isGoalCategory, isGoalDataSource, isStrategyStatus, isStrategyType, isWorkoutType, normalizeGoalDataSource, strategyGenerationEventSchema, strategyGenerationPhaseSchema, type GoalCategory, type GoalDataSource, type GoalDirection, type LegacyGoalDataSource, type StrategyGenerationEventType, type StrategyGenerationPhase, type StrategyGoalContract, type StrategyStatus, type StrategyType, type TrainingPhaseContract, type TrainingStrategyContract, type WorkoutType } from "./training.js";
export * from "./workouts.js";
export * from "./muscles.js";
export * from "./equipment.js";
export * from "./cardio-session.js";
export * from "./training-session-log.js";
export * from "./clinical.js";
export * from "./sessions.js";
export * from "./recovery-sessions.js";
export * from "./labs.js";
export * from "./registration.js";
export * from "./analytics.js";
export * from "./businessAnalytics.js";
export * from "./mfa.js";
export * from "./phi-audit.js";
export * from "./ai-notes.js";
export * from "./pagination.js";
export * from "./clinical-registry.schema.js";
export * from "./metric-definition.js";
export * from "./biometrics.js";
export * from "./organization.js";
export * from "./appointment-config.js";
export * from "./documents.js";
export * from "./realtime.js";
export { DATA_QUALITY, DATA_QUALITY_LABELS, DATA_QUALITY_LEVELS, DataQualityLevelSchema, HEALTH_METRIC_CATEGORIES, HEALTH_METRIC_CATEGORY_LABELS, HEALTH_METRIC_DIRECTIONS, HEALTH_TREND, HEALTH_TRENDS, HEALTH_TREND_LABELS, HealthMetricCategorySchema, HealthMetricDirectionSchema, HealthMetricKeySchema, HealthTrendSchema, SOURCE_WEIGHTS, VERIFICATION_MULTIPLIER, determineTrendFromDirection, getDataPointWeight, isDataQualityLevel, isHealthTrend, type DataQualityLevel, type HealthMetricCategory, type HealthMetricDirection, type HealthMetricKey, type HealthTrend } from "./health-progress.js";
export { ConcernAreaSchema, DailySummarySchema, HealthImprovementPointSchema, HealthMetricGoalSchema, HealthMetricGoalUpsertSchema, HealthProgressImprovementSchema, HealthProgressOverviewSchema, HealthProgressSnapshotSchema, MetricAggregateSchema, MetricChangeSchema, PatientClinicalContextSchema, PatientHealthProgressSchema, RangeDerivationModifierSchema, RangeDerivationSchema, RangeDerivationStepSchema, WearablesDataSchema, calculateInRangeScore, getDefaultReferenceRange, healthGoalsListResponseSchema, type ConcernArea, type DailySummaryContract, type HealthGoalsListResponse, type HealthImprovementPoint, type HealthMetricGoal, type HealthMetricGoalContract, type HealthMetricGoalUpsert, type HealthProgressImprovement, type HealthProgressOverview, type HealthProgressSnapshot, type MetricAggregate, type MetricChange, type PatientClinicalContext, type PatientHealthProgress, type RangeDerivation, type RangeDerivationModifier, type RangeDerivationStep, type WearablesDataContract, HealthMetricSummarySchema, type HealthMetricSummaryContract } from "./health-metrics.js";
export * from "./exercise.js";
export * from "./daily-metrics.js";
export * from "./sleep.js";
export * from "./journal.js";
export * from "./compliance.js";
export * from "./push.js";
export * from "./units.js";
export * from "./messages.js";
export * from "./nutrition-plan.js";
export { CreateDetailedStrategyGoalSchema, CreateDetailedTrainingPhaseSchema, CreateDetailedTrainingStrategySchema, DetailedStrategyGoalSchema, DetailedTrainingPhaseSchema, DetailedTrainingStrategySchema, GOAL_SYNC_ERROR_CODES, GoalSyncResultSchema, StrategyDraftSchema, StrategyGenerationActivitySchema, StrategyGenerationResponseSchema, StrategyGoalDraftSchema, SyncAllGoalsResultSchema, TrainingPhaseDraftSchema, UpdateDetailedTrainingStrategySchema, calculateGoalProgress, calculateStrategyProgress, createMockDetailedStrategyGoal, createMockDetailedTrainingPhase, createMockDetailedTrainingStrategy, createMockStrategyClarificationNeeded, createMockStrategyDraft, createMockStrategyGenerationProgress, createMockStrategyGenerationResult, createMockStrategyGoalDraft, createMockTrainingPhaseDraft, getCurrentPhase, type DetailedStrategyGoalContract, type DetailedTrainingPhaseContract, type DetailedTrainingStrategyContract, type GoalSyncErrorCode, type GoalSyncResultContract, type StrategyClarificationNeededContract, type StrategyDraftContract, type StrategyGenerationActivityContract, type StrategyGenerationProgressContract, type StrategyGenerationResponseContract, type StrategyGenerationResultContract, type StrategyGoalDraftContract, type SyncAllGoalsResultContract, type TrainingPhaseDraftContract } from "./training-strategy.js";
export * from "./enumContract.js";
export * from "./metric-codes.js";
export * from "./billing.js";
export * from "./jobs.js";
export * from "./admin-tasks.js";
export * from "./auth-tokens.js";
export { METRIC_CATEGORY, METRIC_CATEGORY_LABELS, METRIC_VALUE_TYPE, METRIC_VALUE_TYPE_LABELS, METRIC_VALUE_TYPES, MetricValueTypeSchema, TREND_DIRECTION, TREND_DIRECTION_LABELS, TREND_DIRECTIONS, TrendDirectionSchema, isMetricCategory, isMetricValueType, isTrendDirection, type MetricValueType, type TrendDirection, } from "./health-metric-types.js";
export * from "./marketing.js";
//# sourceMappingURL=index.d.ts.map