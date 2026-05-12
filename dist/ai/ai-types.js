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
import { AINoteCategorySchema, AINoteSourceTypeSchema } from "../domain/ai-notes.js";
import { WorkoutSectionTypeSchema } from "../domain/workouts.js";
// ============================================================================
// Generated Workout Plan Types
// ============================================================================
/**
 * Generated exercise within a workout
 */
export const GeneratedExerciseSchema = z.object({
    /** Exercise name (must match library exactly when exerciseId is provided) */
    name: z.string().min(1),
    /** ID from exercise library if using existing exercise */
    exerciseId: z.string().optional(),
    /** Number of sets */
    sets: z.number().int().positive().optional(),
    /** Rep target (e.g., "8-10", "5", "12-15", "AMRAP") */
    reps: z.string().optional(),
    /** Weight/intensity target (e.g., "185lbs", "70% 1RM", "RPE 7-8") */
    weight: z.string().optional(),
    /** Duration for timed exercises (e.g., "30 seconds", "2 minutes") */
    duration: z.string().optional(),
    /** Coaching cues, tempo prescriptions, or special instructions */
    notes: z.string().optional(),
    /** Optional video demonstration URL */
    link: z.string().url().optional(),
});
/**
 * Generated workout section (warmup/working/cooldown)
 */
export const GeneratedWorkoutSectionSchema = z.object({
    type: WorkoutSectionTypeSchema,
    title: z.string().min(1),
    exercises: z.array(GeneratedExerciseSchema),
});
/**
 * Generated workout day
 */
export const GeneratedWorkoutDaySchema = z.object({
    /** Day of week: 0=Sunday, 1=Monday, etc. */
    dayOfWeek: z.number().int().min(0).max(6),
    /** Workout name (e.g., "Push Day", "Lower Body", "Rest") */
    name: z.string().min(1),
    /** Whether this is a rest/recovery day */
    isRestDay: z.boolean(),
    /** Workout sections in execution order */
    sections: z.array(GeneratedWorkoutSectionSchema),
});
/**
 * Generated workout plan structure (before persisting)
 */
export const GeneratedWorkoutPlanSchema = z.object({
    days: z.array(GeneratedWorkoutDaySchema),
});
// ============================================================================
// Workout Plan Generation Types
// Note: WorkoutGenerationProgress is defined in admin/admin-types.ts to avoid duplication
// ============================================================================
/**
 * Reason codes for unresolved exercises requiring human review
 */
export const UNRESOLVED_EXERCISE_REASONS = [
    "missing_id",
    "invalid_id",
    "name_mismatch",
];
/**
 * Exercise that requires human review before workout can be saved
 * @see WorkoutPlanGenerationResult.reviewReasons
 */
export const UnresolvedExerciseSchema = z.object({
    /** Day of week (0=Sunday, 6=Saturday) */
    dayOfWeek: z.number().int().min(0).max(6),
    /** Display name for the day (e.g., "Monday - Push Day") */
    dayName: z.string(),
    /** Index of section within the day */
    sectionIndex: z.number().int().min(0),
    /** Section title (e.g., "Working Sets") */
    sectionTitle: z.string(),
    /** Index of exercise within the section */
    exerciseIndex: z.number().int().min(0),
    /** Name of the unresolved exercise */
    exerciseName: z.string(),
    /** Why this exercise requires review */
    reason: z.enum(UNRESOLVED_EXERCISE_REASONS),
});
/**
 * SSE event types for workout plan generation
 */
export const WORKOUT_GENERATION_EVENTS = [
    "progress",
    "complete",
    "needs_review",
    "error",
];
/**
 * Workout generation event type constants
 */
export const WORKOUT_GENERATION_EVENT = {
    PROGRESS: "progress",
    COMPLETE: "complete",
    NEEDS_REVIEW: "needs_review",
    ERROR: "error",
};
/**
 * Result from workout plan generation.
 *
 * @note newNotes uses AIGeneratedNote (the DB-persisted shape with createdAt/updatedAt).
 * AIPermanentNoteContract is a structural supertype of AIGeneratedNote and is compatible.
 * Mobile contracts (src/contracts/aiNotes.ts) re-export this type directly.
 */
export const WorkoutPlanGenerationResultSchema = z.object({
    plan: GeneratedWorkoutPlanSchema,
    newNotes: z.array(z.lazy(() => AIGeneratedNoteSchema)),
    reasoning: z.string().optional(),
    /**
     * True if exercises require human review before saving.
     * When true, the plan MUST NOT be persisted until all reviewReasons are resolved.
     */
    needsReview: z.boolean().optional(),
    /**
     * List of exercises requiring human intervention.
     * Only populated when needsReview is true.
     */
    reviewReasons: z.array(UnresolvedExerciseSchema).optional(),
});
// ============================================================================
// AI Notes Types
// ============================================================================
/**
 * Note generated by AI during plan/strategy generation
 */
export const AIGeneratedNoteSchema = z.object({
    id: z.string(),
    userId: z.string(),
    content: z.string().min(1),
    category: AINoteCategorySchema,
    source: z.string().nullable().optional(),
    sourceType: AINoteSourceTypeSchema.nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
//# sourceMappingURL=ai-types.js.map