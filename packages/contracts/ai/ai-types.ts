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

import { type AINoteCategory } from '../domain/ai-notes';
import { type StrategyGenerationPhase } from '../domain/training';
import { type WorkoutSectionType } from '../domain/workouts';
import { type VolumeLevel } from '../primitives';

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
// Note: VOLUME_LEVELS and VolumeLevel are defined in primitives/volume-level.ts
// to avoid circular dependencies
// ============================================================================

// Note: STRATEGY_GENERATION_PHASES, StrategyGenerationPhase, and STRATEGY_GENERATION_PHASE
// are defined in domain/training.ts and exported from there (via the domain barrel).
// We don't re-export here to avoid duplicate export conflicts.

/**
 * Activity entry for real-time strategy generation progress display.
 */
export interface StrategyGenerationActivity {
  /** Timestamp of the activity */
  timestamp: string;
  /** Type of activity */
  type: 'search' | 'create' | 'select' | 'plan' | 'note' | 'thinking' | 'complete' | 'analyze';
  /** Short description of the activity */
  message: string;
  /** Optional additional data */
  data?: Record<string, unknown>;
}

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
 */
export interface StrategyGoalDraft {
  /** MetricDefinition code string (previously GoalMetricKey) */
  goalMetric: string;
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
  volumeLevel?: VolumeLevel;
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
  /** AI reasoning for why this strategy was designed this way */
  reasoning?: string;
}

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
