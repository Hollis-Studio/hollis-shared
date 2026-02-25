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
import { AINoteCategorySchema } from "../domain/ai-notes";
import { type StrategyGenerationPhase } from "../domain/training";
import {
    type StrategyGenerationActivity as _StrategyGenerationActivity,
    type TrainingPhaseDraft as _TrainingPhaseDraft,
    type StrategyDraftContract,
    type StrategyGoalDraftContract,
} from "../domain/training-strategy";
import { WorkoutSectionTypeSchema } from "../domain/workouts";
import { nutritionPlanGenerationResultSchema } from "./ai-validation";

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
export type GeneratedExercise = z.infer<typeof GeneratedExerciseSchema>;

/**
 * Generated workout section (warmup/working/cooldown)
 */
export const GeneratedWorkoutSectionSchema = z.object({
  type: WorkoutSectionTypeSchema,
  title: z.string().min(1),
  exercises: z.array(GeneratedExerciseSchema),
});
export type GeneratedWorkoutSection = z.infer<
  typeof GeneratedWorkoutSectionSchema
>;

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
export type GeneratedWorkoutDay = z.infer<typeof GeneratedWorkoutDaySchema>;

/**
 * Generated workout plan structure (before persisting)
 */
export const GeneratedWorkoutPlanSchema = z.object({
  days: z.array(GeneratedWorkoutDaySchema),
});
export type GeneratedWorkoutPlan = z.infer<typeof GeneratedWorkoutPlanSchema>;

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
] as const;
export type UnresolvedExerciseReason =
  (typeof UNRESOLVED_EXERCISE_REASONS)[number];

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
export type UnresolvedExercise = z.infer<typeof UnresolvedExerciseSchema>;

/**
 * SSE event types for workout plan generation
 */
export const WORKOUT_GENERATION_EVENTS = [
  "progress",
  "complete",
  "needs_review",
  "error",
] as const;
export type WorkoutGenerationEventType =
  (typeof WORKOUT_GENERATION_EVENTS)[number];

/**
 * Workout generation event type constants
 */
export const WORKOUT_GENERATION_EVENT = {
  PROGRESS: "progress" as WorkoutGenerationEventType,
  COMPLETE: "complete" as WorkoutGenerationEventType,
  NEEDS_REVIEW: "needs_review" as WorkoutGenerationEventType,
  ERROR: "error" as WorkoutGenerationEventType,
} as const;

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
export type WorkoutPlanGenerationResult = z.infer<
  typeof WorkoutPlanGenerationResultSchema
>;

/**
 * Callback type for workout generation progress updates
 */
export type WorkoutGenerationProgressCallback = (progress: {
  step: number;
  totalSteps: number;
  phase: string;
  detail?: string;
}) => void;

// ============================================================================
// Nutrition Plan Generation Types
// Note: NutritionPlanGenerationRequest is defined in admin/admin-types.ts
// ============================================================================

/**
 * Result from nutrition plan generation.
 * Single source of truth derived from the Zod schema — no manual interface.
 * @see nutritionPlanGenerationResultSchema in ai-validation.ts
 */
export type NutritionPlanGenerationResult = z.infer<
  typeof nutritionPlanGenerationResultSchema
>;

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

// ============================================================================
// Training Strategy Generation Types
// Note: VOLUME_LEVELS and VolumeLevel are defined in primitives/volume-level.ts
// to avoid circular dependencies
// ============================================================================

// Note: STRATEGY_GENERATION_PHASES, StrategyGenerationPhase, and STRATEGY_GENERATION_PHASE
// are defined in domain/training.ts and exported from there (via the domain barrel).
// We don't re-export here to avoid duplicate export conflicts.

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
export type StrategyGenerationProgressCallback = (
  progress: StrategyGenerationProgress,
) => void;

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
export type StrategyGenerationResponse =
  | StrategyClarificationNeeded
  | StrategyGenerationResult;

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
  source: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AIGeneratedNote = z.infer<typeof AIGeneratedNoteSchema>;

// ============================================================================
// Exercise Search Types (for AI tool results)
// ============================================================================

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

// ============================================================================
// AI Context Types (summary for prompts)
// ============================================================================

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
