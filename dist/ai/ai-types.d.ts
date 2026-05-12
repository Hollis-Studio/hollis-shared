/**
 * @ai-context AI Types Module | Shared type definitions for AI operations
 *
 * This module contains all type definitions for AI-powered features:
 * - Workout plan generation types
 * - Nutrition plan generation types
 * - Training strategy generation types
 * - Progress tracking types
 *
 * IMPORTANT: This module must remain pure TypeScript.
 * NO platform-specific imports, NO Gemini SDK types.
 *
 * deps: admin/admin-types | consumers: server/src/services/ai*, web-admin/services
 */
import { z } from "zod";
import { type StrategyGenerationPhase } from "../domain/training.js";
import { type StrategyGenerationActivity as _StrategyGenerationActivity, type TrainingPhaseDraft as _TrainingPhaseDraft, type StrategyDraftContract, type StrategyGoalDraftContract } from "../domain/training-strategy.js";
import { nutritionPlanGenerationResultSchema } from "./ai-validation.js";
/**
 * Generated exercise within a workout
 */
export declare const GeneratedExerciseSchema: z.ZodObject<{
    name: z.ZodString;
    exerciseId: z.ZodOptional<z.ZodString>;
    sets: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodString>;
    weight: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    link: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GeneratedExercise = z.infer<typeof GeneratedExerciseSchema>;
/**
 * Generated workout section (warmup/working/cooldown)
 */
export declare const GeneratedWorkoutSectionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        warmup: "warmup";
        working: "working";
        cooldown: "cooldown";
    }>;
    title: z.ZodString;
    exercises: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        exerciseId: z.ZodOptional<z.ZodString>;
        sets: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodString>;
        weight: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        link: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GeneratedWorkoutSection = z.infer<typeof GeneratedWorkoutSectionSchema>;
/**
 * Generated workout day
 */
export declare const GeneratedWorkoutDaySchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    name: z.ZodString;
    isRestDay: z.ZodBoolean;
    sections: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            warmup: "warmup";
            working: "working";
            cooldown: "cooldown";
        }>;
        title: z.ZodString;
        exercises: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            exerciseId: z.ZodOptional<z.ZodString>;
            sets: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodString>;
            duration: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
            link: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GeneratedWorkoutDay = z.infer<typeof GeneratedWorkoutDaySchema>;
/**
 * Generated workout plan structure (before persisting)
 */
export declare const GeneratedWorkoutPlanSchema: z.ZodObject<{
    days: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        name: z.ZodString;
        isRestDay: z.ZodBoolean;
        sections: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<{
                warmup: "warmup";
                working: "working";
                cooldown: "cooldown";
            }>;
            title: z.ZodString;
            exercises: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                exerciseId: z.ZodOptional<z.ZodString>;
                sets: z.ZodOptional<z.ZodNumber>;
                reps: z.ZodOptional<z.ZodString>;
                weight: z.ZodOptional<z.ZodString>;
                duration: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
                link: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GeneratedWorkoutPlan = z.infer<typeof GeneratedWorkoutPlanSchema>;
/**
 * Reason codes for unresolved exercises requiring human review
 */
export declare const UNRESOLVED_EXERCISE_REASONS: readonly ["missing_id", "invalid_id", "name_mismatch"];
export type UnresolvedExerciseReason = (typeof UNRESOLVED_EXERCISE_REASONS)[number];
/**
 * Exercise that requires human review before workout can be saved
 * @see WorkoutPlanGenerationResult.reviewReasons
 */
export declare const UnresolvedExerciseSchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    dayName: z.ZodString;
    sectionIndex: z.ZodNumber;
    sectionTitle: z.ZodString;
    exerciseIndex: z.ZodNumber;
    exerciseName: z.ZodString;
    reason: z.ZodEnum<{
        missing_id: "missing_id";
        invalid_id: "invalid_id";
        name_mismatch: "name_mismatch";
    }>;
}, z.core.$strip>;
export type UnresolvedExercise = z.infer<typeof UnresolvedExerciseSchema>;
/**
 * SSE event types for workout plan generation
 */
export declare const WORKOUT_GENERATION_EVENTS: readonly ["progress", "complete", "needs_review", "error"];
export type WorkoutGenerationEventType = (typeof WORKOUT_GENERATION_EVENTS)[number];
/**
 * Workout generation event type constants
 */
export declare const WORKOUT_GENERATION_EVENT: {
    readonly PROGRESS: WorkoutGenerationEventType;
    readonly COMPLETE: WorkoutGenerationEventType;
    readonly NEEDS_REVIEW: WorkoutGenerationEventType;
    readonly ERROR: WorkoutGenerationEventType;
};
/**
 * Result from workout plan generation.
 *
 * @note newNotes uses AIGeneratedNote (the DB-persisted shape with createdAt/updatedAt).
 * AIPermanentNoteContract is a structural supertype of AIGeneratedNote and is compatible.
 * Mobile contracts (src/contracts/aiNotes.ts) re-export this type directly.
 */
export declare const WorkoutPlanGenerationResultSchema: z.ZodObject<{
    plan: z.ZodObject<{
        days: z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodNumber;
            name: z.ZodString;
            isRestDay: z.ZodBoolean;
            sections: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<{
                    warmup: "warmup";
                    working: "working";
                    cooldown: "cooldown";
                }>;
                title: z.ZodString;
                exercises: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    exerciseId: z.ZodOptional<z.ZodString>;
                    sets: z.ZodOptional<z.ZodNumber>;
                    reps: z.ZodOptional<z.ZodString>;
                    weight: z.ZodOptional<z.ZodString>;
                    duration: z.ZodOptional<z.ZodString>;
                    notes: z.ZodOptional<z.ZodString>;
                    link: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    newNotes: z.ZodArray<z.ZodLazy<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        content: z.ZodString;
        category: z.ZodEnum<{
            OTHER: "OTHER";
            INJURY: "INJURY";
            PREFERENCE: "PREFERENCE";
            LIMITATION: "LIMITATION";
            MEDICAL: "MEDICAL";
            GOAL: "GOAL";
        }>;
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            AI_GENERATED: "AI_GENERATED";
            COACH_OBSERVATION: "COACH_OBSERVATION";
            INTAKE_SEEDED: "INTAKE_SEEDED";
            CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
        }>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>>;
    reasoning: z.ZodOptional<z.ZodString>;
    needsReview: z.ZodOptional<z.ZodBoolean>;
    reviewReasons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        dayName: z.ZodString;
        sectionIndex: z.ZodNumber;
        sectionTitle: z.ZodString;
        exerciseIndex: z.ZodNumber;
        exerciseName: z.ZodString;
        reason: z.ZodEnum<{
            missing_id: "missing_id";
            invalid_id: "invalid_id";
            name_mismatch: "name_mismatch";
        }>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type WorkoutPlanGenerationResult = z.infer<typeof WorkoutPlanGenerationResultSchema>;
/**
 * Callback type for workout generation progress updates
 */
export type WorkoutGenerationProgressCallback = (progress: {
    step: number;
    totalSteps: number;
    phase: string;
    detail?: string;
}) => void;
/**
 * Result from nutrition plan generation.
 * Single source of truth derived from the Zod schema — no manual interface.
 * @see nutritionPlanGenerationResultSchema in ai-validation.ts
 */
export type NutritionPlanGenerationResult = z.infer<typeof nutritionPlanGenerationResultSchema>;
/**
 * Internal type for nutrition targets from AI
 */
export interface NutritionTargetsArgs {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    dailyTargets: {
        dayOfWeek: number;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    }[];
    reasoning: string;
    weeklyNotes?: string;
}
/**
 * Activity entry for real-time strategy generation progress display.
 * @deprecated Import StrategyGenerationActivity from domain/training-strategy instead
 */
export type StrategyGenerationActivity = _StrategyGenerationActivity;
/**
 * Progress update for strategy generation
 */
export interface StrategyGenerationProgress {
    step: number;
    totalSteps: number;
    phase: StrategyGenerationPhase | string;
    detail?: string;
    /** Current AI conversation turn */
    turn?: number;
    /** Maximum conversation turns allowed */
    maxTurns?: number;
    /** Agent activity log entries for real-time display */
    activities?: StrategyGenerationActivity[];
    /** Running stats for progress summary */
    stats?: {
        goalsIdentified?: number;
        phasesCreated?: number;
        exercisesSearched?: number;
        exercisesCreated?: number;
    };
}
/**
 * Callback type for strategy generation progress updates
 */
export type StrategyGenerationProgressCallback = (progress: StrategyGenerationProgress) => void;
/**
 * Goal draft for strategy generation
 * @deprecated Import StrategyGoalDraftContract from domain/training-strategy instead
 */
export type StrategyGoalDraft = StrategyGoalDraftContract;
/**
 * Training phase draft for strategy generation
 * @deprecated Import TrainingPhaseDraft from domain/training-strategy instead
 */
export type TrainingPhaseDraft = _TrainingPhaseDraft;
/**
 * Strategy draft from AI generation
 * @deprecated Import StrategyDraftContract from domain/training-strategy instead
 */
export type StrategyDraft = StrategyDraftContract;
/**
 * Clarification request when AI needs more information
 * Uses needsClarification: true as discriminator for discriminated union
 */
export interface StrategyClarificationNeeded {
    needsClarification: true;
    requestId: string;
    questions: string[];
    partialContext?: unknown;
}
/**
 * Strategy generation result when successful
 * Uses needsClarification: false as discriminator for discriminated union
 */
export interface StrategyGenerationResult {
    needsClarification: false;
    strategy: StrategyDraft;
    reasoning: string;
}
/**
 * Combined response type for strategy generation
 * Discriminated union on needsClarification boolean
 */
export type StrategyGenerationResponse = StrategyClarificationNeeded | StrategyGenerationResult;
/**
 * Note generated by AI during plan/strategy generation
 */
export declare const AIGeneratedNoteSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    content: z.ZodString;
    category: z.ZodEnum<{
        OTHER: "OTHER";
        INJURY: "INJURY";
        PREFERENCE: "PREFERENCE";
        LIMITATION: "LIMITATION";
        MEDICAL: "MEDICAL";
        GOAL: "GOAL";
    }>;
    source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sourceType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        AI_GENERATED: "AI_GENERATED";
        COACH_OBSERVATION: "COACH_OBSERVATION";
        INTAKE_SEEDED: "INTAKE_SEEDED";
        CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
    }>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type AIGeneratedNote = z.infer<typeof AIGeneratedNoteSchema>;
/**
 * Exercise search result from library
 */
export interface ExerciseSearchResult {
    id: string;
    name: string;
    category: string;
    primaryMuscle?: string;
    equipment?: string[];
    movementPattern?: string;
    difficulty?: string;
    relevanceScore?: number;
}
/**
 * Batch search request
 */
export interface BatchSearchRequest {
    searches: {
        label: string;
        searchTerm: string;
        limit?: number;
    }[];
}
/**
 * Batch search results grouped by label
 */
export interface BatchSearchResults {
    [label: string]: {
        exercises: ExerciseSearchResult[];
        count: number;
    };
}
/**
 * Minimal AI context contract for type checking
 * Full definition in aiContext/types.ts
 */
export interface AIContextSummary {
    userId: string;
    weekStartDate: string;
    hasActiveStrategy: boolean;
    hasPermanentNotes: boolean;
    hasRecentWorkouts: boolean;
    generatedAt: string;
}
//# sourceMappingURL=ai-types.d.ts.map