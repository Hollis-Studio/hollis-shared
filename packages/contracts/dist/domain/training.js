/**
 * @ai-context Training domain contracts | strategy types, statuses, goal categories
 *
 * This module provides the canonical definitions for training-related constants:
 * - Strategy types (LINEAR_PROGRESSION, UNDULATING, BLOCK, etc.)
 * - Strategy statuses (ACTIVE, COMPLETED, PAUSED, CANCELLED)
 * - Goal categories (fitness, body_composition, cardiovascular, etc.)
 * - Goal data sources (biometric, lab, exercise_log, manual)
 *
 * IMPORTANT: All training-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
import { VolumeLevelSchema } from "../primitives/index.js";
import { MetricCategorySchema, } from "./health-metric-types.js";
import { MetricDefinitionSummarySchema } from "./metric-definition.js";
// ============================================================================
// STRATEGY TYPES
// ============================================================================
export const STRATEGY_TYPES = [
    "LINEAR_PROGRESSION",
    "UNDULATING",
    "BLOCK",
    "MESOCYCLE",
    "DELOAD",
    "CUSTOM",
];
export const StrategyTypeSchema = z.enum(STRATEGY_TYPES);
export const STRATEGY_TYPE = {
    LINEAR_PROGRESSION: "LINEAR_PROGRESSION",
    UNDULATING: "UNDULATING",
    BLOCK: "BLOCK",
    MESOCYCLE: "MESOCYCLE",
    DELOAD: "DELOAD",
    CUSTOM: "CUSTOM",
};
/** Human-readable labels for strategy types */
export const STRATEGY_TYPE_LABELS = {
    LINEAR_PROGRESSION: "Linear Progression",
    UNDULATING: "Undulating",
    BLOCK: "Block Periodization",
    MESOCYCLE: "Mesocycle",
    DELOAD: "Deload",
    CUSTOM: "Custom",
};
/**
 * Check if a string is a valid strategy type
 */
export function isStrategyType(value) {
    return STRATEGY_TYPES.includes(value);
}
// ============================================================================
// STRATEGY STATUSES
// ============================================================================
export const STRATEGY_STATUSES = [
    "ACTIVE",
    "COMPLETED",
    "PAUSED",
    "CANCELLED",
];
export const StrategyStatusSchema = z.enum(STRATEGY_STATUSES);
export const STRATEGY_STATUS = {
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    PAUSED: "PAUSED",
    CANCELLED: "CANCELLED",
};
/** Human-readable labels for strategy statuses */
export const STRATEGY_STATUS_LABELS = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
    PAUSED: "Paused",
    CANCELLED: "Cancelled",
};
/**
 * Check if a string is a valid strategy status
 */
export function isStrategyStatus(value) {
    return STRATEGY_STATUSES.includes(value);
}
// ============================================================================
// GOAL CATEGORIES
// ============================================================================
/**
 * Categories for health/fitness goals.
 * Used to group and filter strategies by their primary focus area.
 */
export const GOAL_CATEGORIES = [
    "fitness",
    "body_composition",
    "cardiovascular",
    "metabolic",
    "hormonal",
    "performance",
];
export const GoalCategorySchema = z.enum(GOAL_CATEGORIES);
/** Centralized goal category constants for equality checks */
export const GOAL_CATEGORY = {
    FITNESS: "fitness",
    BODY_COMPOSITION: "body_composition",
    CARDIOVASCULAR: "cardiovascular",
    METABOLIC: "metabolic",
    HORMONAL: "hormonal",
    PERFORMANCE: "performance",
};
/** Human-readable labels for goal categories */
export const GOAL_CATEGORY_LABELS = {
    fitness: "Fitness",
    body_composition: "Body Composition",
    cardiovascular: "Cardiovascular",
    metabolic: "Metabolic",
    hormonal: "Hormonal",
    performance: "Performance",
};
/**
 * Check if a string is a valid goal category
 */
export function isGoalCategory(value) {
    return GOAL_CATEGORIES.includes(value);
}
// ============================================================================
// GOAL DATA SOURCES
// ============================================================================
/**
 * Data sources from which goal progress (currentValue) can be pulled.
 * Enables automatic progress tracking from existing database records.
 */
export const GOAL_DATA_SOURCES = [
    "biometric",
    "lab",
    "exercise_log",
    "manual",
];
export const GoalDataSourceSchema = z.enum(GOAL_DATA_SOURCES);
/**
 * Canonical-only contract for new goal write surfaces.
 *
 * Legacy persisted values (for example "measurement") remain supported only
 * through deferred read-time normalization helpers during migration cleanup.
 */
export const GoalWriteDataSourceSchema = GoalDataSourceSchema;
/**
 * @deprecated Compatibility alias; includes the legacy persisted "measurement"
 * value until a database backfill fully removes it.
 */
// DEFERRED [audit-05]: Shared training contracts still export legacy goal data-source values and normalization to keep pre-migration consumers working. Not material at <50 users pre-revenue. Revisit at scale.
export const LEGACY_GOAL_DATA_SOURCES = [
    ...GOAL_DATA_SOURCES,
    "measurement",
];
export const LegacyGoalDataSourceSchema = z.enum(LEGACY_GOAL_DATA_SOURCES);
/** Centralized goal data source constants for equality checks */
export const GOAL_DATA_SOURCE = {
    BIOMETRIC: "biometric",
    LAB: "lab",
    EXERCISE_LOG: "exercise_log",
    MANUAL: "manual",
};
export const EXERCISE_GOAL_DATA_KEYS = [
    "estimated1RM",
    "bestDuration",
    "bestDistance",
    "bestReps",
];
export const ExerciseGoalDataKeySchema = z.enum(EXERCISE_GOAL_DATA_KEYS);
export const EXERCISE_GOAL_DATA_KEY = {
    ESTIMATED_1RM: "estimated1RM",
    BEST_DURATION: "bestDuration",
    BEST_DISTANCE: "bestDistance",
    BEST_REPS: "bestReps",
};
/**
 * Canonical goal data-source subset for ad-hoc dynamic metric definitions.
 * These metric definitions currently hydrate only from lab and biometric feeds.
 */
export const DYNAMIC_METRIC_GOAL_DATA_SOURCES = [
    GOAL_DATA_SOURCE.LAB,
    GOAL_DATA_SOURCE.BIOMETRIC,
];
export const DynamicMetricGoalDataSourceSchema = GoalDataSourceSchema.extract(DYNAMIC_METRIC_GOAL_DATA_SOURCES);
/**
 * Canonical MetricCategory → GoalDataSource mapping.
 *
 * Wearable metrics persist through the biometric ingestion path, so they must
 * sync like biometrics rather than manual-only goals.
 */
export const GOAL_DATA_SOURCE_BY_METRIC_CATEGORY = {
    LAB: GOAL_DATA_SOURCE.LAB,
    EXERCISE: GOAL_DATA_SOURCE.EXERCISE_LOG,
    BIOMETRIC: GOAL_DATA_SOURCE.BIOMETRIC,
    NUTRITION: GOAL_DATA_SOURCE.MANUAL,
    WEARABLE: GOAL_DATA_SOURCE.BIOMETRIC,
    COMPUTED: GOAL_DATA_SOURCE.MANUAL,
};
export function mapMetricCategoryToGoalDataSource(category) {
    return GOAL_DATA_SOURCE_BY_METRIC_CATEGORY[MetricCategorySchema.parse(category)];
}
/** Human-readable labels for data sources */
export const GOAL_DATA_SOURCE_LABELS = {
    biometric: "Biometric",
    lab: "Lab Result",
    exercise_log: "Exercise Log",
    manual: "Manual Entry",
};
/**
 * Check if a string is a valid goal data source
 */
export function isGoalDataSource(value) {
    return GOAL_DATA_SOURCES.includes(value);
}
/**
 * Legacy value mapping for goal data sources persisted before the canonical
 * GOAL_DATA_SOURCES enum was established. Maps old string values to their
 * canonical equivalents before Zod validation.
 */
const LEGACY_GOAL_DATA_SOURCE_MAP = {
    measurement: GOAL_DATA_SOURCE.BIOMETRIC,
};
/**
 * Normalize a goal data-source value, mapping legacy values to their canonical
 * equivalents. Throws a ZodError for unrecognized values.
 *
 * Legacy mappings:
 * - "measurement" → "biometric"
 */
export function normalizeGoalDataSource(value) {
    const normalized = value != null && value in LEGACY_GOAL_DATA_SOURCE_MAP
        ? LEGACY_GOAL_DATA_SOURCE_MAP[value]
        : value;
    return GoalDataSourceSchema.parse(normalized);
}
/**
 * Normalize a goal data-source value when the caller prefers a nullable result
 * instead of a thrown Zod error.
 */
export function normalizeGoalDataSourceOrNull(value) {
    if (value == null) {
        return null;
    }
    try {
        return normalizeGoalDataSource(value);
    }
    catch {
        return null;
    }
}
const EXERCISE_DURATION_KEYWORDS = [
    "time",
    "duration",
    "minute",
    "second",
    "pace",
];
const EXERCISE_DISTANCE_KEYWORDS = [
    "distance",
    "meter",
    "metre",
    "mile",
    "km",
    "run",
    "walk",
    "sprint",
];
const EXERCISE_REPS_KEYWORDS = [
    "rep",
    "repetition",
    "round",
    "set_count",
];
const EXERCISE_STRENGTH_KEYWORDS = [
    "1rm",
    "max",
    "load",
    "weight",
    "strength",
];
const EXERCISE_DURATION_UNITS = [
    "ms",
    "s",
    "sec",
    "secs",
    "second",
    "seconds",
    "min",
    "mins",
    "minute",
    "minutes",
    "hr",
    "hrs",
    "hour",
    "hours",
];
const EXERCISE_DISTANCE_UNITS = [
    "m",
    "meter",
    "meters",
    "metre",
    "metres",
    "km",
    "mi",
    "mile",
    "miles",
    "yd",
    "yard",
    "yards",
    "ft",
    "feet",
];
const EXERCISE_REPS_UNITS = ["rep", "reps", "count"];
const EXERCISE_WEIGHT_UNITS = [
    "kg",
    "kgs",
    "lb",
    "lbs",
    "pound",
    "pounds",
];
function normalizeMetricSearchValue(value) {
    return value?.toLowerCase().trim() ?? "";
}
function haystackContainsAny(haystack, keywords) {
    return keywords.some((keyword) => haystack.includes(keyword));
}
export function inferExerciseGoalDataKey(metric) {
    const primaryUnit = normalizeMetricSearchValue(metric.primaryUnit);
    const trendDirection = normalizeMetricSearchValue(metric.trendDirection);
    const haystack = `${metric.code} ${metric.displayName}`.toLowerCase();
    if (EXERCISE_REPS_UNITS.includes(primaryUnit)) {
        return EXERCISE_GOAL_DATA_KEY.BEST_REPS;
    }
    if (EXERCISE_DISTANCE_UNITS.includes(primaryUnit)) {
        return EXERCISE_GOAL_DATA_KEY.BEST_DISTANCE;
    }
    if (EXERCISE_DURATION_UNITS.includes(primaryUnit)) {
        return EXERCISE_GOAL_DATA_KEY.BEST_DURATION;
    }
    if (EXERCISE_WEIGHT_UNITS.includes(primaryUnit)) {
        return EXERCISE_GOAL_DATA_KEY.ESTIMATED_1RM;
    }
    if (haystackContainsAny(haystack, EXERCISE_REPS_KEYWORDS)) {
        return EXERCISE_GOAL_DATA_KEY.BEST_REPS;
    }
    if (haystackContainsAny(haystack, EXERCISE_DISTANCE_KEYWORDS)) {
        return EXERCISE_GOAL_DATA_KEY.BEST_DISTANCE;
    }
    if (haystackContainsAny(haystack, EXERCISE_DURATION_KEYWORDS)) {
        return EXERCISE_GOAL_DATA_KEY.BEST_DURATION;
    }
    if (haystackContainsAny(haystack, EXERCISE_STRENGTH_KEYWORDS)) {
        return EXERCISE_GOAL_DATA_KEY.ESTIMATED_1RM;
    }
    if (trendDirection.includes("lower")) {
        return EXERCISE_GOAL_DATA_KEY.BEST_DURATION;
    }
    return EXERCISE_GOAL_DATA_KEY.ESTIMATED_1RM;
}
export function inferGoalMetricDataSourceInfo(metric) {
    const dataSource = mapMetricCategoryToGoalDataSource(metric.category);
    if (metric.category === MetricCategorySchema.enum.EXERCISE) {
        return {
            dataSource,
            dataKey: inferExerciseGoalDataKey(metric),
        };
    }
    return {
        dataSource,
        dataKey: metric.code,
    };
}
// ============================================================================
// HEALTH METRIC TYPES (canonical source: health-metric-types.ts)
// ============================================================================
export { HEALTH_METRIC_CATEGORIES, HEALTH_METRIC_CATEGORY_LABELS, HEALTH_METRIC_DIRECTIONS, HealthMetricCategorySchema, HealthMetricDirectionSchema } from "./health-metric-types.js";
// Backwards-compatibility aliases
export { HealthMetricDirectionSchema as GoalDirectionSchema } from "./health-metric-types.js";
// ============================================================================
// WORKOUT TYPES
// ============================================================================
/**
 * Valid workout types for training sessions and load tracking.
 * Used in analytics algorithms, training load calculations, and workout logging.
 */
export const WORKOUT_TYPES = [
    "strength",
    "cardio",
    "mixed",
    "recovery",
    "flexibility",
    "sports",
];
export const WorkoutTypeSchema = z.enum(WORKOUT_TYPES);
/** Centralized workout type constants for equality checks */
export const WORKOUT_TYPE = {
    STRENGTH: "strength",
    CARDIO: "cardio",
    MIXED: "mixed",
    RECOVERY: "recovery",
    FLEXIBILITY: "flexibility",
    SPORTS: "sports",
};
/** Human-readable labels for workout types */
export const WORKOUT_TYPE_LABELS = {
    strength: "Strength",
    cardio: "Cardio",
    mixed: "Mixed",
    recovery: "Recovery",
    flexibility: "Flexibility",
    sports: "Sports",
};
/**
 * Check if a string is a valid workout type
 */
export function isWorkoutType(value) {
    return WORKOUT_TYPES.includes(value);
}
// ============================================================================
// VOLUME LEVELS
// ============================================================================
// Note: VolumeLevel type, constants, and labels are imported from primitives (canonical export location)
// ============================================================================
// TRAINING PHASE CONTRACT
// ============================================================================
/**
 * Training phase contract - represents a phase within a training strategy.
 *
 * @deprecated Use DetailedTrainingPhaseSchema from training-strategy.ts for new code.
 * This schema will be removed after 2026-09-01.
 */
export const TrainingPhaseSchema = z.object({
    id: z.string().uuid(),
    strategyId: z.string().uuid(),
    name: z.string().min(1),
    order: z.number().int().min(0),
    weekCount: z.number().int().positive(),
    intensityRange: z.string().optional(),
    volumeLevel: VolumeLevelSchema.optional(),
    focusAreas: z.array(z.string()),
    notes: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean(),
    isCompleted: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ============================================================================
// STRATEGY GOALS
// ============================================================================
/**
 * Strategy goal contract - represents a measurable goal within a training strategy.
 *
 * @deprecated Use DetailedStrategyGoalSchema from training-strategy.ts for new code.
 * This schema will be removed after 2026-09-01.
 */
export const StrategyGoalSchema = z.object({
    id: z.string().uuid(),
    strategyId: z.string().uuid(),
    goalMetric: z.string(),
    goalTarget: z.number(),
    baselineValue: z.number().optional(),
    currentValue: z.number().optional(),
    progressPercent: z.number().optional(),
    weight: z.number().optional(),
    linkedExerciseId: z.string().uuid().optional(),
    dynamicMetricDefinition: z
        .object({
        dataSource: DynamicMetricGoalDataSourceSchema,
        dataKey: z.string(),
        label: z.string(),
        unit: z.string(),
        direction: z.string(),
        category: z.string(),
    })
        .optional(),
    /** Server-enriched metric metadata (Phase 3 migration). Optional for backward compat. */
    metricDefinition: MetricDefinitionSummarySchema.nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ============================================================================
// TRAINING STRATEGY CONTRACT
// ============================================================================
/**
 * Training strategy contract - represents a complete training program.
 */
export const TrainingStrategySchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    strategyType: StrategyTypeSchema,
    status: StrategyStatusSchema,
    goalCategory: GoalCategorySchema.optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    targetWeeks: z.number().int().positive(),
    currentWeek: z.number().int().min(0).optional(),
    phases: z.array(TrainingPhaseSchema),
    goals: z.array(StrategyGoalSchema).optional(),
    overallProgress: z.number().optional(),
    isAIGenerated: z.boolean().optional(),
    aiPrompt: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ============================================================================
// STRATEGY GENERATION PHASES (AI Generation Progress)
// ============================================================================
/**
 * Phases during AI-powered strategy generation.
 * Used for streaming progress updates to the client.
 */
export const STRATEGY_GENERATION_PHASES = [
    "analyzing_context",
    "identifying_goals",
    "checking_conflicts",
    "searching_exercises",
    "designing_periodization",
    "building_strategy",
    "generating_workouts",
    "optimizing",
    "complete",
];
export const strategyGenerationPhaseSchema = z.enum(STRATEGY_GENERATION_PHASES);
/** Constant object for strategy generation phase comparisons */
export const STRATEGY_GENERATION_PHASE = {
    ANALYZING_CONTEXT: "analyzing_context",
    IDENTIFYING_GOALS: "identifying_goals",
    CHECKING_CONFLICTS: "checking_conflicts",
    SEARCHING_EXERCISES: "searching_exercises",
    DESIGNING_PERIODIZATION: "designing_periodization",
    BUILDING_STRATEGY: "building_strategy",
    GENERATING_WORKOUTS: "generating_workouts",
    OPTIMIZING: "optimizing",
    COMPLETE: "complete",
};
// ============================================================================
// STRATEGY GENERATION EVENTS (SSE Event Types)
// ============================================================================
/**
 * Event types emitted during AI strategy generation via SSE.
 * Used to distinguish between progress updates, completion, errors, etc.
 */
export const STRATEGY_GENERATION_EVENTS = [
    "progress",
    "complete",
    "clarification_needed",
    "error",
];
export const strategyGenerationEventSchema = z.enum(STRATEGY_GENERATION_EVENTS);
/** Constant object for strategy generation event comparisons */
export const STRATEGY_GENERATION_EVENT = {
    PROGRESS: "progress",
    COMPLETE: "complete",
    CLARIFICATION_NEEDED: "clarification_needed",
    ERROR: "error",
};
// ============================================================================
// MOCK FACTORIES
// ============================================================================
const nowIso = () => new Date().toISOString();
export const createMockTrainingPhase = (overrides = {}) => {
    const timestamp = nowIso();
    return {
        id: "mock-phase-id",
        strategyId: "mock-strategy-id",
        name: "Foundation Phase",
        order: 0,
        weekCount: 4,
        intensityRange: "60-70%",
        volumeLevel: "moderate",
        focusAreas: ["strength", "conditioning"],
        isActive: true,
        isCompleted: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
    };
};
export const createMockTrainingStrategy = (overrides = {}) => {
    const timestamp = nowIso();
    return {
        id: "mock-strategy-id",
        userId: "HH-ABC123",
        name: "Strength Building Program",
        description: "A 12-week progressive strength program",
        strategyType: "LINEAR_PROGRESSION",
        status: "ACTIVE",
        goalCategory: "fitness",
        startDate: "2024-01-01",
        targetWeeks: 12,
        currentWeek: 1,
        phases: [createMockTrainingPhase()],
        isAIGenerated: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
    };
};
//# sourceMappingURL=training.js.map