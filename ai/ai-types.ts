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

import type { VolumeLevel as AdminVolumeLevel } from '../admin/admin-types';
import { type AINoteCategory } from '../domain/ai-notes';
import { type GoalMetricKey } from '../domain/goal-metrics';
import { type WorkoutSectionType } from '../domain/workouts';

// ============================================================================
// Generated Workout Plan Types
// ============================================================================

/**
 * Generated exercise within a workout
 */
export interface GeneratedExercise {
  /** Exercise name (must match library exactly when exerciseId is provided) */
  name: string;
  /** ID from exercise library if using existing exercise */
  exerciseId?: string;
  /** Number of sets */
  sets?: number;
  /** Rep target (e.g., "8-10", "5", "12-15", "AMRAP") */
  reps?: string;
  /** Weight/intensity target (e.g., "185lbs", "70% 1RM", "RPE 7-8") */
  weight?: string;
  /** Duration for timed exercises (e.g., "30 seconds", "2 minutes") */
  duration?: string;
  /** Coaching cues, tempo prescriptions, or special instructions */
  notes?: string;
  /** Optional video demonstration URL */
  link?: string;
}

/**
 * Generated workout section (warmup/working/cooldown)
 */
export interface GeneratedWorkoutSection {
  type: WorkoutSectionType;
  title: string;
  exercises: GeneratedExercise[];
}

/**
 * Generated workout day
 */
export interface GeneratedWorkoutDay {
  /** Day of week: 0=Sunday, 1=Monday, etc. */
  dayOfWeek: number;
  /** Workout name (e.g., "Push Day", "Lower Body", "Rest") */
  name: string;
  /** Whether this is a rest/recovery day */
  isRestDay: boolean;
  /** Workout sections in execution order */
  sections: GeneratedWorkoutSection[];
}

/**
 * Generated workout plan structure (before persisting)
 */
export interface GeneratedWorkoutPlan {
  days: GeneratedWorkoutDay[];
}

// ============================================================================
// Workout Plan Generation Types
// Note: WorkoutGenerationProgress is defined in admin/admin-types.ts to avoid duplication
// ============================================================================

/**
 * Reason codes for unresolved exercises requiring human review
 */
export const UNRESOLVED_EXERCISE_REASONS = ['missing_id', 'invalid_id', 'name_mismatch'] as const;
export type UnresolvedExerciseReason = (typeof UNRESOLVED_EXERCISE_REASONS)[number];

/**
 * Exercise that requires human review before workout can be saved
 * @see WorkoutPlanGenerationResult.reviewReasons
 */
export interface UnresolvedExercise {
  /** Day of week (0=Sunday, 6=Saturday) */
  dayOfWeek: number;
  /** Display name for the day (e.g., "Monday - Push Day") */
  dayName: string;
  /** Index of section within the day */
  sectionIndex: number;
  /** Section title (e.g., "Working Sets") */
  sectionTitle: string;
  /** Index of exercise within the section */
  exerciseIndex: number;
  /** Name of the unresolved exercise */
  exerciseName: string;
  /** Why this exercise requires review */
  reason: UnresolvedExerciseReason;
}

/**
 * SSE event types for workout plan generation
 */
export const WORKOUT_GENERATION_EVENTS = ['progress', 'complete', 'needs_review', 'error'] as const;
export type WorkoutGenerationEventType = (typeof WORKOUT_GENERATION_EVENTS)[number];

/**
 * Workout generation event type constants
 */
export const WORKOUT_GENERATION_EVENT = {
  PROGRESS: 'progress' as WorkoutGenerationEventType,
  COMPLETE: 'complete' as WorkoutGenerationEventType,
  NEEDS_REVIEW: 'needs_review' as WorkoutGenerationEventType,
  ERROR: 'error' as WorkoutGenerationEventType,
} as const;

/**
 * Result from workout plan generation
 */
export interface WorkoutPlanGenerationResult {
  plan: GeneratedWorkoutPlan;
  newNotes: AIGeneratedNote[];
  reasoning?: string;
  /**
   * True if exercises require human review before saving.
   * When true, the plan MUST NOT be persisted until all reviewReasons are resolved.
   */
  needsReview?: boolean;
  /**
   * List of exercises requiring human intervention.
   * Only populated when needsReview is true.
   */
  reviewReasons?: UnresolvedExercise[];
}

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
 * Result from nutrition plan generation
 */
export interface NutritionPlanGenerationResult {
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
  weeklyNotes: string;
  newNotes: AIGeneratedNote[];
}

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
// Note: VOLUME_LEVELS and VolumeLevel are defined in admin/admin-types.ts
// We import for use in this module but don't re-export to avoid conflicts
// ============================================================================

/**
 * Strategy generation phases for progress tracking
 */
export const STRATEGY_GENERATION_PHASES = [
  'analyzing_context',
  'checking_conflicts',
  'searching_exercises',
  'generating_strategy',
  'complete',
] as const;
export type StrategyGenerationPhase = (typeof STRATEGY_GENERATION_PHASES)[number];

/**
 * Strategy generation phase constants
 */
export const STRATEGY_GENERATION_PHASE = {
  ANALYZING_CONTEXT: 'analyzing_context' as StrategyGenerationPhase,
  CHECKING_CONFLICTS: 'checking_conflicts' as StrategyGenerationPhase,
  SEARCHING_EXERCISES: 'searching_exercises' as StrategyGenerationPhase,
  GENERATING_STRATEGY: 'generating_strategy' as StrategyGenerationPhase,
  COMPLETE: 'complete' as StrategyGenerationPhase,
} as const;

/**
 * Progress update for strategy generation
 */
export interface StrategyGenerationProgress {
  step: number;
  totalSteps: number;
  phase: StrategyGenerationPhase | string;
  detail?: string;
}

/**
 * Callback type for strategy generation progress updates
 */
export type StrategyGenerationProgressCallback = (progress: StrategyGenerationProgress) => void;

/**
 * Goal draft for strategy generation
 */
export interface StrategyGoalDraft {
  goalMetric: GoalMetricKey;
  goalTarget: number;
  linkedExerciseId?: string;
  weight?: number;
  baselineValue?: number;
}

/**
 * Training phase draft for strategy generation
 */
export interface TrainingPhaseDraft {
  name: string;
  order: number;
  weekCount: number;
  intensityRange?: string;
  volumeLevel?: AdminVolumeLevel;
  focusAreas: string[];
  notes?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * Strategy draft from AI generation
 */
export interface StrategyDraft {
  name: string;
  type: string;
  goal: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: string;
  goals: StrategyGoalDraft[];
  phases?: TrainingPhaseDraft[];
  reasoning: string;
}

/**
 * Clarification request when AI needs more information
 */
export interface StrategyClarificationNeeded {
  type: 'clarification_needed';
  requestId: string;
  questions: string[];
}

/**
 * Strategy generation result when successful
 */
export interface StrategyGenerationResult {
  type: 'strategy_generated';
  strategy: StrategyDraft;
  reasoning: string;
}

/**
 * Combined response type for strategy generation
 */
export type StrategyGenerationResponse = StrategyClarificationNeeded | StrategyGenerationResult;

// ============================================================================
// AI Notes Types
// ============================================================================

/**
 * Note generated by AI during plan/strategy generation
 */
export interface AIGeneratedNote {
  id: string;
  userId: string;
  content: string;
  category: AINoteCategory;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

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
