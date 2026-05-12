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
import { type MetricCategory } from "./health-metric-types.js";
export declare const STRATEGY_TYPES: readonly ["LINEAR_PROGRESSION", "UNDULATING", "BLOCK", "MESOCYCLE", "DELOAD", "CUSTOM"];
export declare const StrategyTypeSchema: z.ZodEnum<{
    CUSTOM: "CUSTOM";
    LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
    UNDULATING: "UNDULATING";
    BLOCK: "BLOCK";
    MESOCYCLE: "MESOCYCLE";
    DELOAD: "DELOAD";
}>;
export type StrategyType = z.infer<typeof StrategyTypeSchema>;
export declare const STRATEGY_TYPE: {
    readonly LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
    readonly UNDULATING: "UNDULATING";
    readonly BLOCK: "BLOCK";
    readonly MESOCYCLE: "MESOCYCLE";
    readonly DELOAD: "DELOAD";
    readonly CUSTOM: "CUSTOM";
};
/** Human-readable labels for strategy types */
export declare const STRATEGY_TYPE_LABELS: Record<StrategyType, string>;
/**
 * Check if a string is a valid strategy type
 */
export declare function isStrategyType(value: string): value is StrategyType;
export declare const STRATEGY_STATUSES: readonly ["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"];
export declare const StrategyStatusSchema: z.ZodEnum<{
    COMPLETED: "COMPLETED";
    CANCELLED: "CANCELLED";
    ACTIVE: "ACTIVE";
    PAUSED: "PAUSED";
}>;
export type StrategyStatus = z.infer<typeof StrategyStatusSchema>;
export declare const STRATEGY_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly PAUSED: "PAUSED";
    readonly CANCELLED: "CANCELLED";
};
/** Human-readable labels for strategy statuses */
export declare const STRATEGY_STATUS_LABELS: Record<StrategyStatus, string>;
/**
 * Check if a string is a valid strategy status
 */
export declare function isStrategyStatus(value: string): value is StrategyStatus;
/**
 * Categories for health/fitness goals.
 * Used to group and filter strategies by their primary focus area.
 */
export declare const GOAL_CATEGORIES: readonly ["fitness", "body_composition", "cardiovascular", "metabolic", "hormonal", "performance"];
export declare const GoalCategorySchema: z.ZodEnum<{
    fitness: "fitness";
    body_composition: "body_composition";
    cardiovascular: "cardiovascular";
    metabolic: "metabolic";
    hormonal: "hormonal";
    performance: "performance";
}>;
export type GoalCategory = z.infer<typeof GoalCategorySchema>;
/** Centralized goal category constants for equality checks */
export declare const GOAL_CATEGORY: {
    readonly FITNESS: GoalCategory;
    readonly BODY_COMPOSITION: GoalCategory;
    readonly CARDIOVASCULAR: GoalCategory;
    readonly METABOLIC: GoalCategory;
    readonly HORMONAL: GoalCategory;
    readonly PERFORMANCE: GoalCategory;
};
/** Human-readable labels for goal categories */
export declare const GOAL_CATEGORY_LABELS: Record<GoalCategory, string>;
/**
 * Check if a string is a valid goal category
 */
export declare function isGoalCategory(value: string): value is GoalCategory;
/**
 * Data sources from which goal progress (currentValue) can be pulled.
 * Enables automatic progress tracking from existing database records.
 */
export declare const GOAL_DATA_SOURCES: readonly ["biometric", "lab", "exercise_log", "manual"];
export declare const GoalDataSourceSchema: z.ZodEnum<{
    manual: "manual";
    biometric: "biometric";
    lab: "lab";
    exercise_log: "exercise_log";
}>;
export type GoalDataSource = z.infer<typeof GoalDataSourceSchema>;
/**
 * Canonical-only contract for new goal write surfaces.
 *
 * Legacy persisted values (for example "measurement") remain supported only
 * through deferred read-time normalization helpers during migration cleanup.
 */
export declare const GoalWriteDataSourceSchema: z.ZodEnum<{
    manual: "manual";
    biometric: "biometric";
    lab: "lab";
    exercise_log: "exercise_log";
}>;
export type GoalWriteDataSource = GoalDataSource;
/**
 * @deprecated Compatibility alias; includes the legacy persisted "measurement"
 * value until a database backfill fully removes it.
 */
export declare const LEGACY_GOAL_DATA_SOURCES: readonly ["biometric", "lab", "exercise_log", "manual", "measurement"];
export declare const LegacyGoalDataSourceSchema: z.ZodEnum<{
    manual: "manual";
    biometric: "biometric";
    lab: "lab";
    exercise_log: "exercise_log";
    measurement: "measurement";
}>;
export type LegacyGoalDataSource = z.infer<typeof LegacyGoalDataSourceSchema>;
/** Centralized goal data source constants for equality checks */
export declare const GOAL_DATA_SOURCE: {
    readonly BIOMETRIC: GoalDataSource;
    readonly LAB: GoalDataSource;
    readonly EXERCISE_LOG: GoalDataSource;
    readonly MANUAL: GoalDataSource;
};
export declare const EXERCISE_GOAL_DATA_KEYS: readonly ["estimated1RM", "bestDuration", "bestDistance", "bestReps"];
export declare const ExerciseGoalDataKeySchema: z.ZodEnum<{
    estimated1RM: "estimated1RM";
    bestDuration: "bestDuration";
    bestDistance: "bestDistance";
    bestReps: "bestReps";
}>;
export type ExerciseGoalDataKey = z.infer<typeof ExerciseGoalDataKeySchema>;
export declare const EXERCISE_GOAL_DATA_KEY: {
    readonly ESTIMATED_1RM: ExerciseGoalDataKey;
    readonly BEST_DURATION: ExerciseGoalDataKey;
    readonly BEST_DISTANCE: ExerciseGoalDataKey;
    readonly BEST_REPS: ExerciseGoalDataKey;
};
/**
 * Canonical goal data-source subset for ad-hoc dynamic metric definitions.
 * These metric definitions currently hydrate only from lab and biometric feeds.
 */
export declare const DYNAMIC_METRIC_GOAL_DATA_SOURCES: readonly ["manual" | "biometric" | "lab" | "exercise_log", "manual" | "biometric" | "lab" | "exercise_log"];
export declare const DynamicMetricGoalDataSourceSchema: z.ZodEnum<{
    manual: "manual";
    biometric: "biometric";
    lab: "lab";
    exercise_log: "exercise_log";
}>;
export type DynamicMetricGoalDataSource = z.infer<typeof DynamicMetricGoalDataSourceSchema>;
/**
 * Canonical MetricCategory → GoalDataSource mapping.
 *
 * Wearable metrics persist through the biometric ingestion path, so they must
 * sync like biometrics rather than manual-only goals.
 */
export declare const GOAL_DATA_SOURCE_BY_METRIC_CATEGORY: {
    readonly LAB: "manual" | "biometric" | "lab" | "exercise_log";
    readonly EXERCISE: "manual" | "biometric" | "lab" | "exercise_log";
    readonly BIOMETRIC: "manual" | "biometric" | "lab" | "exercise_log";
    readonly NUTRITION: "manual" | "biometric" | "lab" | "exercise_log";
    readonly WEARABLE: "manual" | "biometric" | "lab" | "exercise_log";
    readonly COMPUTED: "manual" | "biometric" | "lab" | "exercise_log";
};
export declare function mapMetricCategoryToGoalDataSource(category: MetricCategory): GoalDataSource;
/** Human-readable labels for data sources */
export declare const GOAL_DATA_SOURCE_LABELS: Record<GoalDataSource, string>;
/**
 * Check if a string is a valid goal data source
 */
export declare function isGoalDataSource(value: string): value is GoalDataSource;
/**
 * Normalize a goal data-source value, mapping legacy values to their canonical
 * equivalents. Throws a ZodError for unrecognized values.
 *
 * Legacy mappings:
 * - "measurement" → "biometric"
 */
export declare function normalizeGoalDataSource(value: string | null | undefined): GoalDataSource;
/**
 * Normalize a goal data-source value when the caller prefers a nullable result
 * instead of a thrown Zod error.
 */
export declare function normalizeGoalDataSourceOrNull(value: string | null | undefined): GoalDataSource | null;
export interface GoalMetricDataSourceInferenceInput {
    category: MetricCategory;
    code: string;
    displayName: string;
    primaryUnit?: string | null;
    trendDirection?: string | null;
}
export declare function inferExerciseGoalDataKey(metric: Pick<GoalMetricDataSourceInferenceInput, "code" | "displayName" | "primaryUnit" | "trendDirection">): ExerciseGoalDataKey;
export declare function inferGoalMetricDataSourceInfo(metric: GoalMetricDataSourceInferenceInput): {
    dataSource: GoalDataSource;
    dataKey: string;
};
export { HEALTH_METRIC_CATEGORIES, HEALTH_METRIC_CATEGORY_LABELS, HEALTH_METRIC_DIRECTIONS, HealthMetricCategorySchema, HealthMetricDirectionSchema, type HealthMetricCategory, type HealthMetricDirection } from "./health-metric-types.js";
export { HealthMetricDirectionSchema as GoalDirectionSchema } from "./health-metric-types.js";
export type { HealthMetricDirection as GoalDirection } from "./health-metric-types.js";
/**
 * Valid workout types for training sessions and load tracking.
 * Used in analytics algorithms, training load calculations, and workout logging.
 */
export declare const WORKOUT_TYPES: readonly ["strength", "cardio", "mixed", "recovery", "flexibility", "sports"];
export declare const WorkoutTypeSchema: z.ZodEnum<{
    recovery: "recovery";
    strength: "strength";
    cardio: "cardio";
    mixed: "mixed";
    flexibility: "flexibility";
    sports: "sports";
}>;
export type WorkoutType = z.infer<typeof WorkoutTypeSchema>;
/** Centralized workout type constants for equality checks */
export declare const WORKOUT_TYPE: {
    readonly STRENGTH: WorkoutType;
    readonly CARDIO: WorkoutType;
    readonly MIXED: WorkoutType;
    readonly RECOVERY: WorkoutType;
    readonly FLEXIBILITY: WorkoutType;
    readonly SPORTS: WorkoutType;
};
/** Human-readable labels for workout types */
export declare const WORKOUT_TYPE_LABELS: Record<WorkoutType, string>;
/**
 * Check if a string is a valid workout type
 */
export declare function isWorkoutType(value: string): value is WorkoutType;
/**
 * Training phase contract - represents a phase within a training strategy.
 *
 * @deprecated Use DetailedTrainingPhaseSchema from training-strategy.ts for new code.
 * This schema will be removed after 2026-09-01.
 */
export declare const TrainingPhaseSchema: z.ZodObject<{
    id: z.ZodString;
    strategyId: z.ZodString;
    name: z.ZodString;
    order: z.ZodNumber;
    weekCount: z.ZodNumber;
    intensityRange: z.ZodOptional<z.ZodString>;
    volumeLevel: z.ZodOptional<z.ZodEnum<{
        low: "low";
        moderate: "moderate";
        high: "high";
    }>>;
    focusAreas: z.ZodArray<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    isActive: z.ZodBoolean;
    isCompleted: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type TrainingPhaseContract = z.infer<typeof TrainingPhaseSchema>;
/**
 * Strategy goal contract - represents a measurable goal within a training strategy.
 *
 * @deprecated Use DetailedStrategyGoalSchema from training-strategy.ts for new code.
 * This schema will be removed after 2026-09-01.
 */
export declare const StrategyGoalSchema: z.ZodObject<{
    id: z.ZodString;
    strategyId: z.ZodString;
    goalMetric: z.ZodString;
    goalTarget: z.ZodNumber;
    baselineValue: z.ZodOptional<z.ZodNumber>;
    currentValue: z.ZodOptional<z.ZodNumber>;
    progressPercent: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    linkedExerciseId: z.ZodOptional<z.ZodString>;
    dynamicMetricDefinition: z.ZodOptional<z.ZodObject<{
        dataSource: z.ZodEnum<{
            manual: "manual";
            biometric: "biometric";
            lab: "lab";
            exercise_log: "exercise_log";
        }>;
        dataKey: z.ZodString;
        label: z.ZodString;
        unit: z.ZodString;
        direction: z.ZodString;
        category: z.ZodString;
    }, z.core.$strip>>;
    metricDefinition: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        displayName: z.ZodString;
        primaryUnit: z.ZodString;
        trendDirection: z.ZodNullable<z.ZodEnum<{
            HIGHER_BETTER: "HIGHER_BETTER";
            LOWER_BETTER: "LOWER_BETTER";
            TARGET_BETTER: "TARGET_BETTER";
        }>>;
        category: z.ZodEnum<{
            LAB: "LAB";
            EXERCISE: "EXERCISE";
            BIOMETRIC: "BIOMETRIC";
            NUTRITION: "NUTRITION";
            WEARABLE: "WEARABLE";
            COMPUTED: "COMPUTED";
        }>;
        healthCategory: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        goalEligible: z.ZodBoolean;
    }, z.core.$strip>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type StrategyGoalContract = z.infer<typeof StrategyGoalSchema>;
/**
 * Training strategy contract - represents a complete training program.
 */
export declare const TrainingStrategySchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    strategyType: z.ZodEnum<{
        CUSTOM: "CUSTOM";
        LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
        UNDULATING: "UNDULATING";
        BLOCK: "BLOCK";
        MESOCYCLE: "MESOCYCLE";
        DELOAD: "DELOAD";
    }>;
    status: z.ZodEnum<{
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
    }>;
    goalCategory: z.ZodOptional<z.ZodEnum<{
        fitness: "fitness";
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
    }>>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodString>;
    targetWeeks: z.ZodNumber;
    currentWeek: z.ZodOptional<z.ZodNumber>;
    phases: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        strategyId: z.ZodString;
        name: z.ZodString;
        order: z.ZodNumber;
        weekCount: z.ZodNumber;
        intensityRange: z.ZodOptional<z.ZodString>;
        volumeLevel: z.ZodOptional<z.ZodEnum<{
            low: "low";
            moderate: "moderate";
            high: "high";
        }>>;
        focusAreas: z.ZodArray<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        isActive: z.ZodBoolean;
        isCompleted: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    goals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        strategyId: z.ZodString;
        goalMetric: z.ZodString;
        goalTarget: z.ZodNumber;
        baselineValue: z.ZodOptional<z.ZodNumber>;
        currentValue: z.ZodOptional<z.ZodNumber>;
        progressPercent: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        linkedExerciseId: z.ZodOptional<z.ZodString>;
        dynamicMetricDefinition: z.ZodOptional<z.ZodObject<{
            dataSource: z.ZodEnum<{
                manual: "manual";
                biometric: "biometric";
                lab: "lab";
                exercise_log: "exercise_log";
            }>;
            dataKey: z.ZodString;
            label: z.ZodString;
            unit: z.ZodString;
            direction: z.ZodString;
            category: z.ZodString;
        }, z.core.$strip>>;
        metricDefinition: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            displayName: z.ZodString;
            primaryUnit: z.ZodString;
            trendDirection: z.ZodNullable<z.ZodEnum<{
                HIGHER_BETTER: "HIGHER_BETTER";
                LOWER_BETTER: "LOWER_BETTER";
                TARGET_BETTER: "TARGET_BETTER";
            }>>;
            category: z.ZodEnum<{
                LAB: "LAB";
                EXERCISE: "EXERCISE";
                BIOMETRIC: "BIOMETRIC";
                NUTRITION: "NUTRITION";
                WEARABLE: "WEARABLE";
                COMPUTED: "COMPUTED";
            }>;
            healthCategory: z.ZodNullable<z.ZodString>;
            description: z.ZodNullable<z.ZodString>;
            goalEligible: z.ZodBoolean;
        }, z.core.$strip>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>>;
    overallProgress: z.ZodOptional<z.ZodNumber>;
    isAIGenerated: z.ZodOptional<z.ZodBoolean>;
    aiPrompt: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type TrainingStrategyContract = z.infer<typeof TrainingStrategySchema>;
/**
 * Phases during AI-powered strategy generation.
 * Used for streaming progress updates to the client.
 */
export declare const STRATEGY_GENERATION_PHASES: readonly ["analyzing_context", "identifying_goals", "checking_conflicts", "searching_exercises", "designing_periodization", "building_strategy", "generating_workouts", "optimizing", "complete"];
export declare const strategyGenerationPhaseSchema: z.ZodEnum<{
    analyzing_context: "analyzing_context";
    identifying_goals: "identifying_goals";
    checking_conflicts: "checking_conflicts";
    searching_exercises: "searching_exercises";
    designing_periodization: "designing_periodization";
    building_strategy: "building_strategy";
    generating_workouts: "generating_workouts";
    optimizing: "optimizing";
    complete: "complete";
}>;
export type StrategyGenerationPhase = z.infer<typeof strategyGenerationPhaseSchema>;
/** Constant object for strategy generation phase comparisons */
export declare const STRATEGY_GENERATION_PHASE: {
    readonly ANALYZING_CONTEXT: StrategyGenerationPhase;
    readonly IDENTIFYING_GOALS: StrategyGenerationPhase;
    readonly CHECKING_CONFLICTS: StrategyGenerationPhase;
    readonly SEARCHING_EXERCISES: StrategyGenerationPhase;
    readonly DESIGNING_PERIODIZATION: StrategyGenerationPhase;
    readonly BUILDING_STRATEGY: StrategyGenerationPhase;
    readonly GENERATING_WORKOUTS: StrategyGenerationPhase;
    readonly OPTIMIZING: StrategyGenerationPhase;
    readonly COMPLETE: StrategyGenerationPhase;
};
/**
 * Event types emitted during AI strategy generation via SSE.
 * Used to distinguish between progress updates, completion, errors, etc.
 */
export declare const STRATEGY_GENERATION_EVENTS: readonly ["progress", "complete", "clarification_needed", "error"];
export type StrategyGenerationEventType = (typeof STRATEGY_GENERATION_EVENTS)[number];
export declare const strategyGenerationEventSchema: z.ZodEnum<{
    error: "error";
    complete: "complete";
    progress: "progress";
    clarification_needed: "clarification_needed";
}>;
export type StrategyGenerationEvent = z.infer<typeof strategyGenerationEventSchema>;
/** Constant object for strategy generation event comparisons */
export declare const STRATEGY_GENERATION_EVENT: {
    readonly PROGRESS: StrategyGenerationEventType;
    readonly COMPLETE: StrategyGenerationEventType;
    readonly CLARIFICATION_NEEDED: StrategyGenerationEventType;
    readonly ERROR: StrategyGenerationEventType;
};
export declare const createMockTrainingPhase: (overrides?: Partial<TrainingPhaseContract>) => TrainingPhaseContract;
export declare const createMockTrainingStrategy: (overrides?: Partial<TrainingStrategyContract>) => TrainingStrategyContract;
//# sourceMappingURL=training.d.ts.map