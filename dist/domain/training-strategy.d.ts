/**
 * @ai-context Training strategy detailed contracts | goal sync, drafts, progress calculations, AI generation
 *
 * This module provides the detailed training strategy contracts used across all surfaces:
 * - Detailed strategy goal contracts with full metadata
 * - Goal sync result types
 * - Strategy/goal/phase draft contracts for AI generation
 * - Create/update schemas
 * - Progress calculation helpers
 * - AI strategy generation SSE event contracts
 * - Mock factories for testing
 *
 * IMPORTANT: Enum constants (STRATEGY_TYPE, STRATEGY_STATUS, GOAL_CATEGORY, etc.)
 * and the base TrainingPhaseContract/TrainingStrategyContract/StrategyGoalContract
 * are defined in ./training.ts. This file extends those with detailed contracts.
 *
 * deps: zod, ./common, ./training, ../primitives, ./goal-metrics
 * consumers: mobile app, server, web-admin
 */
import { z } from "zod";
export { VOLUME_LEVEL, VOLUME_LEVEL_LABELS, VOLUME_LEVELS, VolumeLevelSchema, type VolumeLevel } from "../primitives/index.js";
/** @deprecated Use VolumeLevelSchema (PascalCase) from primitives. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const volumeLevelSchema: z.ZodEnum<{
    low: "low";
    moderate: "moderate";
    high: "high";
}>;
/** @deprecated Use StrategyTypeSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const strategyTypeSchema: z.ZodEnum<{
    CUSTOM: "CUSTOM";
    LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
    UNDULATING: "UNDULATING";
    BLOCK: "BLOCK";
    MESOCYCLE: "MESOCYCLE";
    DELOAD: "DELOAD";
}>;
/** @deprecated Use StrategyStatusSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const strategyStatusSchema: z.ZodEnum<{
    COMPLETED: "COMPLETED";
    CANCELLED: "CANCELLED";
    ACTIVE: "ACTIVE";
    PAUSED: "PAUSED";
}>;
/** @deprecated Use GoalCategorySchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const goalCategorySchema: z.ZodEnum<{
    fitness: "fitness";
    body_composition: "body_composition";
    cardiovascular: "cardiovascular";
    metabolic: "metabolic";
    hormonal: "hormonal";
    performance: "performance";
}>;
/** @deprecated Use GoalDataSourceSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const goalDataSourceSchema: z.ZodEnum<{
    manual: "manual";
    biometric: "biometric";
    lab: "lab";
    exercise_log: "exercise_log";
}>;
/** @deprecated Use GoalDirectionSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const goalDirectionSchema: z.ZodEnum<{
    lower_better: "lower_better";
    higher_better: "higher_better";
    context: "context";
}>;
export declare const DetailedStrategyGoalSchema: z.ZodObject<{
    id: z.ZodString;
    strategyId: z.ZodString;
    goalMetric: z.ZodString;
    goalCategory: z.ZodEnum<{
        fitness: "fitness";
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
    }>;
    goalUnit: z.ZodString;
    goalDirection: z.ZodEnum<{
        lower_better: "lower_better";
        higher_better: "higher_better";
        context: "context";
    }>;
    linkedExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    linkedExerciseName: z.ZodOptional<z.ZodString>;
    baselineValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currentValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    goalTarget: z.ZodNumber;
    weight: z.ZodNumber;
    dataSource: z.ZodEnum<{
        manual: "manual";
        biometric: "biometric";
        lab: "lab";
        exercise_log: "exercise_log";
    }>;
    dataKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    progressPercent: z.ZodNumber;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
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
}, z.core.$strip>;
export type DetailedStrategyGoal = z.infer<typeof DetailedStrategyGoalSchema>;
/**
 * Individual goal within a training strategy.
 * Strategies can have multiple weighted goals for composite progress tracking.
 *
 * This is the detailed version with full metadata fields (goalCategory, goalUnit,
 * goalDirection, dataSource, etc.). For the simpler version, see StrategyGoalContract
 * in ./training.ts.
 */
export type DetailedStrategyGoalContract = z.infer<typeof DetailedStrategyGoalSchema>;
export declare const DetailedTrainingPhaseSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
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
}, z.core.$strip>;
export type DetailedTrainingPhase = z.infer<typeof DetailedTrainingPhaseSchema>;
/**
 * Training phase within a strategy with full validation.
 *
 * Uses baseDocumentSchema for timestamp validation (ISO format enforcement).
 * For the simpler version, see TrainingPhaseContract in ./training.ts.
 */
export type DetailedTrainingPhaseContract = z.infer<typeof DetailedTrainingPhaseSchema>;
export declare const DetailedTrainingStrategySchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<{
        CUSTOM: "CUSTOM";
        LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
        UNDULATING: "UNDULATING";
        BLOCK: "BLOCK";
        MESOCYCLE: "MESOCYCLE";
        DELOAD: "DELOAD";
    }>;
    goal: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<{
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
    }>;
    goals: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        strategyId: z.ZodString;
        goalMetric: z.ZodString;
        goalCategory: z.ZodEnum<{
            fitness: "fitness";
            body_composition: "body_composition";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            hormonal: "hormonal";
            performance: "performance";
        }>;
        goalUnit: z.ZodString;
        goalDirection: z.ZodEnum<{
            lower_better: "lower_better";
            higher_better: "higher_better";
            context: "context";
        }>;
        linkedExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        linkedExerciseName: z.ZodOptional<z.ZodString>;
        baselineValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        currentValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        goalTarget: z.ZodNumber;
        weight: z.ZodNumber;
        dataSource: z.ZodEnum<{
            manual: "manual";
            biometric: "biometric";
            lab: "lab";
            exercise_log: "exercise_log";
        }>;
        dataKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        progressPercent: z.ZodNumber;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
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
    }, z.core.$strip>>;
    overallProgress: z.ZodNumber;
    phases: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
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
    }, z.core.$strip>>;
    createdBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type DetailedTrainingStrategy = z.infer<typeof DetailedTrainingStrategySchema>;
/**
 * Complete training strategy with goals, phases, and progress tracking.
 *
 * Uses `type` field for strategy type (vs `strategyType` in the base version).
 * For the simpler version, see TrainingStrategyContract in ./training.ts.
 */
export type DetailedTrainingStrategyContract = z.infer<typeof DetailedTrainingStrategySchema>;
export declare const CreateDetailedStrategyGoalSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    weight: z.ZodNumber;
    goalMetric: z.ZodString;
    goalTarget: z.ZodNumber;
    baselineValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currentValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    linkedExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dataSource: z.ZodEnum<{
        manual: "manual";
        biometric: "biometric";
        lab: "lab";
        exercise_log: "exercise_log";
    }>;
    dataKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
    goalCategory: z.ZodEnum<{
        fitness: "fitness";
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
    }>;
    goalDirection: z.ZodEnum<{
        lower_better: "lower_better";
        higher_better: "higher_better";
        context: "context";
    }>;
    goalUnit: z.ZodString;
    linkedExerciseName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateDetailedStrategyGoal = z.infer<typeof CreateDetailedStrategyGoalSchema>;
export declare const CreateDetailedTrainingPhaseSchema: z.ZodObject<{
    name: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    isActive: z.ZodBoolean;
    order: z.ZodNumber;
    weekCount: z.ZodNumber;
    intensityRange: z.ZodOptional<z.ZodString>;
    volumeLevel: z.ZodOptional<z.ZodEnum<{
        low: "low";
        moderate: "moderate";
        high: "high";
    }>>;
    focusAreas: z.ZodArray<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    isCompleted: z.ZodBoolean;
}, z.core.$strip>;
export type CreateDetailedTrainingPhase = z.infer<typeof CreateDetailedTrainingPhaseSchema>;
export declare const CreateDetailedTrainingStrategySchema: z.ZodObject<{
    type: z.ZodEnum<{
        CUSTOM: "CUSTOM";
        LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
        UNDULATING: "UNDULATING";
        BLOCK: "BLOCK";
        MESOCYCLE: "MESOCYCLE";
        DELOAD: "DELOAD";
    }>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<{
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
    }>;
    userId: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    goal: z.ZodString;
    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
        isActive: z.ZodBoolean;
        order: z.ZodNumber;
        weekCount: z.ZodNumber;
        intensityRange: z.ZodOptional<z.ZodString>;
        volumeLevel: z.ZodOptional<z.ZodEnum<{
            low: "low";
            moderate: "moderate";
            high: "high";
        }>>;
        focusAreas: z.ZodArray<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        isCompleted: z.ZodBoolean;
    }, z.core.$strip>>>;
    goals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        weight: z.ZodNumber;
        goalMetric: z.ZodString;
        goalTarget: z.ZodNumber;
        baselineValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        currentValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        linkedExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dataSource: z.ZodEnum<{
            manual: "manual";
            biometric: "biometric";
            lab: "lab";
            exercise_log: "exercise_log";
        }>;
        dataKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
        goalCategory: z.ZodEnum<{
            fitness: "fitness";
            body_composition: "body_composition";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            hormonal: "hormonal";
            performance: "performance";
        }>;
        goalDirection: z.ZodEnum<{
            lower_better: "lower_better";
            higher_better: "higher_better";
            context: "context";
        }>;
        goalUnit: z.ZodString;
        linkedExerciseName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateDetailedTrainingStrategy = z.infer<typeof CreateDetailedTrainingStrategySchema>;
export declare const UpdateDetailedTrainingStrategySchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        CUSTOM: "CUSTOM";
        LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
        UNDULATING: "UNDULATING";
        BLOCK: "BLOCK";
        MESOCYCLE: "MESOCYCLE";
        DELOAD: "DELOAD";
    }>>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
    }>>;
    userId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    createdBy: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    goal: z.ZodOptional<z.ZodString>;
    phases: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
        isActive: z.ZodBoolean;
        order: z.ZodNumber;
        weekCount: z.ZodNumber;
        intensityRange: z.ZodOptional<z.ZodString>;
        volumeLevel: z.ZodOptional<z.ZodEnum<{
            low: "low";
            moderate: "moderate";
            high: "high";
        }>>;
        focusAreas: z.ZodArray<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        isCompleted: z.ZodBoolean;
    }, z.core.$strip>>>>;
    goals: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        weight: z.ZodNumber;
        goalMetric: z.ZodString;
        goalTarget: z.ZodNumber;
        baselineValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        currentValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        linkedExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dataSource: z.ZodEnum<{
            manual: "manual";
            biometric: "biometric";
            lab: "lab";
            exercise_log: "exercise_log";
        }>;
        dataKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
        goalCategory: z.ZodEnum<{
            fitness: "fitness";
            body_composition: "body_composition";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            hormonal: "hormonal";
            performance: "performance";
        }>;
        goalDirection: z.ZodEnum<{
            lower_better: "lower_better";
            higher_better: "higher_better";
            context: "context";
        }>;
        goalUnit: z.ZodString;
        linkedExerciseName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export type UpdateDetailedTrainingStrategy = z.infer<typeof UpdateDetailedTrainingStrategySchema>;
/**
 * Sync error codes for goal sync failures.
 */
export declare const GOAL_SYNC_ERROR_CODES: readonly ["NO_DATA", "MISSING_EXERCISE_LINK", "UNKNOWN_DATA_SOURCE", "FETCH_FAILED"];
export type GoalSyncErrorCode = (typeof GOAL_SYNC_ERROR_CODES)[number];
export declare const GoalSyncResultSchema: z.ZodObject<{
    goalId: z.ZodString;
    goalMetric: z.ZodString;
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
    previousValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    newValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    dataSource: z.ZodString;
    dataKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastDataDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Result of syncing a single goal from its data source.
 */
export type GoalSyncResultContract = z.infer<typeof GoalSyncResultSchema>;
export declare const SyncAllGoalsResultSchema: z.ZodObject<{
    strategyId: z.ZodString;
    syncedCount: z.ZodNumber;
    failedCount: z.ZodNumber;
    skippedCount: z.ZodNumber;
    results: z.ZodArray<z.ZodObject<{
        goalId: z.ZodString;
        goalMetric: z.ZodString;
        success: z.ZodBoolean;
        error: z.ZodOptional<z.ZodString>;
        previousValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        newValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        dataSource: z.ZodString;
        dataKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastDataDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    syncedAt: z.ZodString;
}, z.core.$strip>;
export type SyncAllGoalsResult = z.infer<typeof SyncAllGoalsResultSchema>;
/**
 * Aggregate result of syncing all goals for a strategy.
 */
export type SyncAllGoalsResultContract = z.infer<typeof SyncAllGoalsResultSchema>;
export declare const StrategyGoalDraftSchema: z.ZodObject<{
    goalMetric: z.ZodString;
    goalTarget: z.ZodNumber;
    baselineValue: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    linkedExerciseId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StrategyGoalDraftContract = z.infer<typeof StrategyGoalDraftSchema>;
export declare const TrainingPhaseDraftSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type TrainingPhaseDraft = z.infer<typeof TrainingPhaseDraftSchema>;
export type TrainingPhaseDraftContract = z.infer<typeof TrainingPhaseDraftSchema>;
export declare const StrategyDraftSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        CUSTOM: "CUSTOM";
        LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
        UNDULATING: "UNDULATING";
        BLOCK: "BLOCK";
        MESOCYCLE: "MESOCYCLE";
        DELOAD: "DELOAD";
    }>;
    goal: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
    }>;
    goals: z.ZodArray<z.ZodObject<{
        goalMetric: z.ZodString;
        goalTarget: z.ZodNumber;
        baselineValue: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        linkedExerciseId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>>;
    reasoning: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StrategyDraftContract = z.infer<typeof StrategyDraftSchema>;
/**
 * Activity entry for real-time strategy generation progress display.
 */
/**
 * Activity entry for real-time strategy generation progress display.
 * Derived from StrategyGenerationActivitySchema for schema↔type consistency.
 *
 * Note: The schema restricts `data` values to string | number | boolean | null | string[].
 * The previous manually-defined interface used Record<string, unknown> which was looser.
 */
export type StrategyGenerationActivityContract = z.infer<typeof StrategyGenerationActivitySchema>;
/** @deprecated Use StrategyGenerationActivityContract (derived from schema). */
export interface _StrategyGenerationActivityContractLegacy {
    /** Timestamp of the activity */
    timestamp: string;
    /** Type of activity */
    type: "search" | "create" | "select" | "plan" | "note" | "thinking" | "complete" | "analyze";
    /** Short description of the activity */
    message: string;
    /** Optional additional data */
    data?: Record<string, unknown>;
}
export declare const StrategyGenerationActivitySchema: z.ZodObject<{
    timestamp: z.ZodString;
    type: z.ZodEnum<{
        search: "search";
        complete: "complete";
        note: "note";
        plan: "plan";
        create: "create";
        select: "select";
        thinking: "thinking";
        analyze: "analyze";
    }>;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString>]>>>;
}, z.core.$strip>;
export type StrategyGenerationActivity = z.infer<typeof StrategyGenerationActivitySchema>;
export declare const StrategyGenerationProgressSchema: z.ZodObject<{
    step: z.ZodNumber;
    totalSteps: z.ZodNumber;
    phase: z.ZodString;
    detail: z.ZodOptional<z.ZodString>;
    turn: z.ZodOptional<z.ZodNumber>;
    maxTurns: z.ZodOptional<z.ZodNumber>;
    activities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        type: z.ZodEnum<{
            search: "search";
            complete: "complete";
            note: "note";
            plan: "plan";
            create: "create";
            select: "select";
            thinking: "thinking";
            analyze: "analyze";
        }>;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString>]>>>;
    }, z.core.$strip>>>;
    stats: z.ZodOptional<z.ZodObject<{
        goalsIdentified: z.ZodOptional<z.ZodNumber>;
        phasesCreated: z.ZodOptional<z.ZodNumber>;
        exercisesSearched: z.ZodOptional<z.ZodNumber>;
        exercisesCreated: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type StrategyGenerationProgress = z.infer<typeof StrategyGenerationProgressSchema>;
export type StrategyGenerationProgressContract = z.infer<typeof StrategyGenerationProgressSchema>;
export declare const StrategyGenerationResultSchema: z.ZodObject<{
    needsClarification: z.ZodLiteral<false>;
    strategy: z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            CUSTOM: "CUSTOM";
            LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
            UNDULATING: "UNDULATING";
            BLOCK: "BLOCK";
            MESOCYCLE: "MESOCYCLE";
            DELOAD: "DELOAD";
        }>;
        goal: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        startDate: z.ZodString;
        endDate: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            COMPLETED: "COMPLETED";
            CANCELLED: "CANCELLED";
            ACTIVE: "ACTIVE";
            PAUSED: "PAUSED";
        }>;
        goals: z.ZodArray<z.ZodObject<{
            goalMetric: z.ZodString;
            goalTarget: z.ZodNumber;
            baselineValue: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            linkedExerciseId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
        }, z.core.$strip>>>;
        reasoning: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    reasoning: z.ZodString;
}, z.core.$strip>;
export type StrategyGenerationResult = z.infer<typeof StrategyGenerationResultSchema>;
/**
 * @deprecated Use {@link StrategyGenerationResult} instead.
 * This alias was introduced when local mobile contracts used a `Contract` suffix convention.
 * The canonical name is `StrategyGenerationResult` (no suffix).
 * TY-18: duplicate alias for same Zod inference — kept for backward compatibility only.
 */
export type StrategyGenerationResultContract = z.infer<typeof StrategyGenerationResultSchema>;
export declare const StrategyClarificationNeededSchema: z.ZodObject<{
    needsClarification: z.ZodLiteral<true>;
    questions: z.ZodArray<z.ZodString>;
    requestId: z.ZodString;
    partialContext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString>]>>>;
}, z.core.$strip>;
export type StrategyClarificationNeeded = z.infer<typeof StrategyClarificationNeededSchema>;
export type StrategyClarificationNeededContract = z.infer<typeof StrategyClarificationNeededSchema>;
export declare const StrategyGenerationResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    needsClarification: z.ZodLiteral<false>;
    strategy: z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            CUSTOM: "CUSTOM";
            LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
            UNDULATING: "UNDULATING";
            BLOCK: "BLOCK";
            MESOCYCLE: "MESOCYCLE";
            DELOAD: "DELOAD";
        }>;
        goal: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        startDate: z.ZodString;
        endDate: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            COMPLETED: "COMPLETED";
            CANCELLED: "CANCELLED";
            ACTIVE: "ACTIVE";
            PAUSED: "PAUSED";
        }>;
        goals: z.ZodArray<z.ZodObject<{
            goalMetric: z.ZodString;
            goalTarget: z.ZodNumber;
            baselineValue: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            linkedExerciseId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
        }, z.core.$strip>>>;
        reasoning: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    reasoning: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    needsClarification: z.ZodLiteral<true>;
    questions: z.ZodArray<z.ZodString>;
    requestId: z.ZodString;
    partialContext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString>]>>>;
}, z.core.$strip>]>;
export type StrategyGenerationResponse = z.infer<typeof StrategyGenerationResponseSchema>;
export type StrategyGenerationResponseContract = z.infer<typeof StrategyGenerationResponseSchema>;
/**
 * Calculate progress for a single goal.
 * Handles three goal directions:
 * - 'higher_better': Progress measured by value increase (e.g., squat 1RM, testosterone)
 * - 'lower_better': Progress measured by value decrease (e.g., body fat %, A1C)
 * - 'context': Direction inferred from baseline vs target relationship
 */
export declare function calculateGoalProgress(goal: DetailedStrategyGoalContract): number;
/**
 * Calculate overall strategy progress as weighted average of goal progresses.
 */
export declare function calculateStrategyProgress(strategy: DetailedTrainingStrategyContract): number;
/**
 * Get the currently active phase from a strategy.
 */
export declare function getCurrentPhase(strategy: DetailedTrainingStrategyContract): DetailedTrainingPhaseContract | undefined;
export declare const createMockDetailedTrainingPhase: (overrides?: Partial<DetailedTrainingPhaseContract>) => DetailedTrainingPhaseContract;
export declare const createMockDetailedStrategyGoal: (overrides?: Partial<DetailedStrategyGoalContract>) => DetailedStrategyGoalContract;
export declare const createMockDetailedTrainingStrategy: (overrides?: Partial<DetailedTrainingStrategyContract>) => DetailedTrainingStrategyContract;
export declare const createMockStrategyGoalDraft: (overrides?: Partial<StrategyGoalDraftContract>) => StrategyGoalDraftContract;
export declare const createMockTrainingPhaseDraft: (overrides?: Partial<TrainingPhaseDraftContract>) => TrainingPhaseDraftContract;
export declare const createMockStrategyDraft: (overrides?: Partial<StrategyDraftContract>) => StrategyDraftContract;
export declare const createMockStrategyGenerationProgress: (overrides?: Partial<StrategyGenerationProgressContract>) => StrategyGenerationProgressContract;
export declare const createMockStrategyGenerationResult: (overrides?: Partial<StrategyGenerationResultContract>) => StrategyGenerationResultContract;
export declare const createMockStrategyClarificationNeeded: (overrides?: Partial<StrategyClarificationNeededContract>) => StrategyClarificationNeededContract;
//# sourceMappingURL=training-strategy.d.ts.map