/**
 * @ai-context AI Validation Module | Zod schemas for AI request/response validation
 *
 * This module contains all Zod schemas used to validate:
 * - AI function call arguments (from Gemini responses)
 * - AI generation requests (from clients)
 * - AI generation responses (to clients)
 *
 * IMPORTANT: These schemas are used by both server and web-admin.
 * They must remain pure Zod with no platform-specific dependencies.
 *
 * deps: zod, admin/admin-types, domain/training | consumers: server/src/services/ai*, web-admin/services
 */

import { z } from 'zod';
import { VOLUME_LEVELS } from '../admin/admin-types';
import { AI_NOTE_CATEGORIES, aiPermanentNoteSchema } from '../domain/ai-notes';
import { STRATEGY_STATUS, STRATEGY_STATUSES, STRATEGY_TYPES } from '../domain/training';
import { WORKOUT_SECTION_TYPES } from '../domain/workouts';
import { USER_ID_REGEX } from '../schemas';

// ============================================================================
// Constants for Validation
// ============================================================================

/**
 * AI note categories for validation (alias for backward compatibility)
 * Note: AI_NOTE_CATEGORIES and AI_NOTE_CATEGORY are already exported via domain module
 */
export const AI_NOTE_CATEGORIES_FOR_VALIDATION = AI_NOTE_CATEGORIES;

// Note: WORKOUT_SECTION_TYPES is already exported via domain module

// ============================================================================
// Exercise Schemas
// ============================================================================

/**
 * Schema for validating generated exercise from AI
 */
export const generatedExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  exerciseId: z.string().optional(),
  sets: z.number().int().positive().optional(),
  reps: z.string().optional(),
  weight: z.string().optional(),
  duration: z.string().optional(),
  notes: z.string().optional(),
  // Accept empty strings from AI but transform to undefined for cleaner data
  link: z.string().url().optional().or(z.literal('')).transform((val) => val || undefined),
});

export type GeneratedExerciseInput = z.infer<typeof generatedExerciseSchema>;

// ============================================================================
// Workout Section Schemas
// ============================================================================

/**
 * Schema for validating generated workout section from AI
 */
export const generatedSectionSchema = z.object({
  type: z.enum(WORKOUT_SECTION_TYPES),
  title: z.string().min(1, 'Section title is required'),
  exercises: z.array(generatedExerciseSchema),
});

export type GeneratedSectionInput = z.infer<typeof generatedSectionSchema>;

// ============================================================================
// Workout Day Schemas
// ============================================================================

/**
 * Schema for validating generated workout day from AI
 */
export const generatedDaySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  name: z.string().min(1, 'Day name is required'),
  isRestDay: z.boolean(),
  sections: z.array(generatedSectionSchema),
});

export type GeneratedDayInput = z.infer<typeof generatedDaySchema>;

// ============================================================================
// Workout Plan Schemas
// ============================================================================

/**
 * Schema for validating generate_workout_plan function call arguments from AI
 */
export const generateWorkoutPlanArgsSchema = z.object({
  days: z.array(generatedDaySchema).min(1, 'At least one day is required'),
  reasoning: z.string().optional(),
});

export type GenerateWorkoutPlanArgs = z.infer<typeof generateWorkoutPlanArgsSchema>;

/**
 * Schema for validating generated workout plan structure
 */
export const generatedWorkoutPlanSchema = z.object({
  days: z.array(generatedDaySchema),
});

/**
 * Schema for workout plan generation result
 */
export const workoutPlanGenerationResultSchema = z.object({
  plan: generatedWorkoutPlanSchema,
  newNotes: z.array(aiPermanentNoteSchema),
  reasoning: z.string().optional(),
});

/**
 * Schema for nutrition plan generation result
 */
export const nutritionPlanGenerationResultSchema = z.object({
  calories: z.number().int().positive(),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  reasoning: z.string(),
  weeklyNotes: z.string().optional(),
  newNotes: z.array(aiPermanentNoteSchema),
});

// ============================================================================
// Permanent Note Schemas
// ============================================================================

/**
 * Schema for validating save_permanent_note function call arguments from AI
 */
export const savePermanentNoteArgsSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  category: z.enum(AI_NOTE_CATEGORIES_FOR_VALIDATION),
});

export type SavePermanentNoteArgs = z.infer<typeof savePermanentNoteArgsSchema>;

// ============================================================================
// Nutrition Schemas
// ============================================================================

/**
 * Schema for validating generate_nutrition_targets function call arguments from AI
 */
export const generateNutritionTargetsArgsSchema = z.object({
  calories: z.number().int().positive().max(10000, 'Calories seem unreasonably high'),
  protein: z.number().min(0).max(500, 'Protein must be 0-500g'),
  carbs: z.number().min(0).max(1500, 'Carbs must be 0-1500g'),
  fat: z.number().min(0).max(500, 'Fat must be 0-500g'),
  dailyTargets: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    calories: z.number().int().positive(),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
  })).min(7, 'Must generate targets for all 7 days').max(7),
  reasoning: z.string().min(1, 'Reasoning is required'),
  weeklyNotes: z.string().optional(),
});

export type GenerateNutritionTargetsArgs = z.infer<typeof generateNutritionTargetsArgsSchema>;

// ============================================================================
// Training Strategy Schemas
// ============================================================================

/**
 * Schema for strategy goal input
 */
export const createStrategyGoalArgsSchema = z.object({
  goalMetric: z.string().min(1),
  goalTarget: z.number(),
  linkedExerciseId: z.string().uuid().optional(),
  weight: z.number().min(0.1).max(10).default(1.0),
  baselineValue: z.number().optional(),
});

export type CreateStrategyGoalArgs = z.infer<typeof createStrategyGoalArgsSchema>;

/**
 * Schema for training phase input
 */
export const createPhaseArgsSchema = z.object({
  name: z.string().min(1).max(100),
  order: z.number().int().min(0),
  weekCount: z.number().int().min(1).max(52),
  intensityRange: z.string().max(50).optional(),
  volumeLevel: z.enum(VOLUME_LEVELS).optional(),
  focusAreas: z.array(z.string().max(50)).default([]),
  notes: z.string().max(1000).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isActive: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
});

export type CreatePhaseArgs = z.infer<typeof createPhaseArgsSchema>;

/**
 * Schema for validating request_clarification function call arguments from AI
 */
export const requestClarificationArgsSchema = z.object({
  questions: z.array(z.string().min(1)).min(1).max(5),
});

export type RequestClarificationArgs = z.infer<typeof requestClarificationArgsSchema>;

/**
 * Schema for validating generate_training_strategy function call arguments from AI
 */
export const generateStrategyArgsSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(STRATEGY_TYPES),
  goal: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(STRATEGY_STATUSES).default(STRATEGY_STATUS.ACTIVE),
  goals: z.array(createStrategyGoalArgsSchema).min(1),
  phases: z.array(createPhaseArgsSchema).optional(),
  reasoning: z.string().min(1),
});

export type GenerateStrategyArgs = z.infer<typeof generateStrategyArgsSchema>;

// ============================================================================
// Exercise Library Search Schemas
// ============================================================================

/**
 * Schema for search_exercise_library function call arguments
 */
export const searchExerciseLibraryArgsSchema = z.object({
  searchTerm: z.string().optional(),
  movementPattern: z.string().optional(),
  muscleGroup: z.string().optional(),
  equipment: z.string().optional(),
  difficulty: z.string().optional(),
  limit: z.number().int().positive().max(50).default(10),
});

export type SearchExerciseLibraryArgs = z.infer<typeof searchExerciseLibraryArgsSchema>;

/**
 * Schema for batch_search_exercises function call arguments
 */
export const batchSearchExercisesArgsSchema = z.object({
  searches: z.array(
    z.object({
      label: z.string().min(1),
      searchTerm: z.string().min(1),
      limit: z.number().int().positive().max(20).default(5),
    })
  ).min(1).max(10),
});

export type BatchSearchExercisesArgs = z.infer<typeof batchSearchExercisesArgsSchema>;

/**
 * Schema for create_exercise function call arguments
 */
export const createExerciseArgsSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1),
  muscleGroups: z.array(z.string()).min(1),
  primaryMuscle: z.string().optional(),
  equipment: z.array(z.string()).default([]),
  movementPattern: z.string().optional(),
  difficulty: z.string().optional(),
  instructions: z.string().optional(),
  cues: z.array(z.string()).default([]),
  defaultSets: z.number().int().positive().optional(),
  defaultReps: z.string().optional(),
});

export type CreateExerciseArgs = z.infer<typeof createExerciseArgsSchema>;

// ============================================================================
// API Request Schemas
// ============================================================================

/**
 * Schema for workout plan generation request
 */
// ============================================================================
// API Request Schemas
// Note: Some request schemas (WorkoutPlanGenerationParams, NutritionPlanGenerationRequest)
// are already defined in admin/admin-schemas.ts and admin/admin-types.ts
// Import from there to avoid duplication
// ============================================================================

/**
 * Schema for strategy generation request (AI-specific, not in admin)
 * 
 * @param userId - Patient identifier in HH-XXXXXX barcode format
 * @param customPrompt - User's training goal description
 * @param requestId - Optional UUID for multi-turn conversations
 * @param clarificationAnswers - Optional answers to clarification questions
 */
export const strategyGenerationRequestSchema = z.object({
  userId: z.string().regex(USER_ID_REGEX, 'Invalid user ID format (expected HH-XXXXXX)'),
  customPrompt: z.string().min(1).max(2000),
  requestId: z.string().uuid().optional(),
  clarificationAnswers: z.array(z.string()).optional(),
});

export type StrategyGenerationRequest = z.infer<typeof strategyGenerationRequestSchema>;
