/**
 * @ai-context Exercise domain contracts | exercise definitions, logs, and performance tracking
 *
 * This module provides the canonical definitions for exercise-related types:
 * - Exercise categories, movement patterns, muscle groups
 * - Equipment types, difficulty levels
 * - Exercise and exercise log contracts with Zod schemas
 *
 * IMPORTANT: All exercise-related types MUST be imported from here.
 *
 * deps: zod, common.ts | consumers: all codebases
 */

import { z } from "zod";
import {
    baseDocumentSchema,
    isoDateSchema,
    isoTimestampSchema,
} from "./common.js";
export {
  EQUIPMENT_TYPE,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_TYPES,
  EquipmentTypeSchema,
  type EquipmentType,
} from "./equipment.js";
export {
  MUSCLE_GROUP,
  MUSCLE_GROUP_LABELS,
  MUSCLE_GROUPS,
  MuscleGroupSchema,
  type MuscleGroup,
} from "./muscles.js";
import { EquipmentTypeSchema } from "./equipment.js";
import { MuscleGroupSchema } from "./muscles.js";

// ============================================================================
// EXERCISE CATEGORIES
// ============================================================================

export const EXERCISE_CATEGORIES = [
  "COMPOUND",
  "ISOLATION",
  "CARDIO",
  "MOBILITY",
  "PLYOMETRIC",
] as const;
export const ExerciseCategorySchema = z.enum(EXERCISE_CATEGORIES);
export type ExerciseCategory = z.infer<typeof ExerciseCategorySchema>;

// Workouts uses TrackingMode for its top-level tracking concept
// (`weightlifting` | `cardio` | `stretching`); ExerciseCategory remains a
// movement classification for library exercises.

export const EXERCISE_CATEGORY = {
  COMPOUND: "COMPOUND",
  ISOLATION: "ISOLATION",
  CARDIO: "CARDIO",
  MOBILITY: "MOBILITY",
  PLYOMETRIC: "PLYOMETRIC",
} as const satisfies Record<string, ExerciseCategory>;

export const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  COMPOUND: "Compound",
  ISOLATION: "Isolation",
  CARDIO: "Cardio",
  MOBILITY: "Mobility",
  PLYOMETRIC: "Plyometric",
};

export function isExerciseCategory(value: string): value is ExerciseCategory {
  return (EXERCISE_CATEGORIES as readonly string[]).includes(value);
}

// ============================================================================
// MOVEMENT PATTERNS
// ============================================================================

export const MOVEMENT_PATTERNS = [
  "squat",
  "hinge",
  "push",
  "pull",
  "carry",
  "rotation",
  "lunge",
] as const;
export const MovementPatternSchema = z.enum(MOVEMENT_PATTERNS);
export type MovementPattern = z.infer<typeof MovementPatternSchema>;

export const MOVEMENT_PATTERN = {
  SQUAT: "squat" as MovementPattern,
  HINGE: "hinge" as MovementPattern,
  PUSH: "push" as MovementPattern,
  PULL: "pull" as MovementPattern,
  CARRY: "carry" as MovementPattern,
  ROTATION: "rotation" as MovementPattern,
  LUNGE: "lunge" as MovementPattern,
} as const;

export const MOVEMENT_PATTERN_LABELS: Record<MovementPattern, string> = {
  squat: "Squat",
  hinge: "Hinge",
  push: "Push",
  pull: "Pull",
  carry: "Carry",
  rotation: "Rotation",
  lunge: "Lunge",
};

// ============================================================================
// DIFFICULTY LEVELS
// ============================================================================

export const DIFFICULTY_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
] as const;
export const DifficultyLevelSchema = z.enum(DIFFICULTY_LEVELS);
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;

export const DIFFICULTY_LEVEL = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  EXPERT: "EXPERT",
} as const satisfies Record<string, DifficultyLevel>;

export const DIFFICULTY_LEVEL_LABELS: Record<DifficultyLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

// Prisma-aligned aliases for ExerciseDifficulty enum
export const EXERCISE_DIFFICULTIES = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
] as const;
export type ExerciseDifficulty = (typeof EXERCISE_DIFFICULTIES)[number];
export const exerciseDifficultySchema = z.enum(EXERCISE_DIFFICULTIES);
export const EXERCISE_DIFFICULTY = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  EXPERT: "EXPERT",
} as const satisfies Record<string, ExerciseDifficulty>;

// ============================================================================
// TRACKING TYPES
// ============================================================================

export const TRACKING_TYPES = ["REPS", "TIME", "DISTANCE"] as const;
export const TrackingTypeSchema = z.enum(TRACKING_TYPES);
export type TrackingType = z.infer<typeof TrackingTypeSchema>;

export const TRACKING_TYPE = {
  REPS: "REPS",
  TIME: "TIME",
  DISTANCE: "DISTANCE",
} as const satisfies Record<string, TrackingType>;

export const TRACKING_TYPE_LABELS: Record<TrackingType, string> = {
  REPS: "Reps",
  TIME: "Time",
  DISTANCE: "Distance",
};

// Prisma-aligned aliases for ExerciseTrackingType enum
export const EXERCISE_TRACKING_TYPES = ["REPS", "TIME", "DISTANCE"] as const;
export type ExerciseTrackingType = (typeof EXERCISE_TRACKING_TYPES)[number];
export const exerciseTrackingTypeSchema = z.enum(EXERCISE_TRACKING_TYPES);
export const EXERCISE_TRACKING_TYPE = {
  REPS: "REPS",
  TIME: "TIME",
  DISTANCE: "DISTANCE",
} as const satisfies Record<string, ExerciseTrackingType>;

// ============================================================================
// EXERCISE CONTRACT
// ============================================================================

export const exerciseSchema = baseDocumentSchema.extend({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  category: ExerciseCategorySchema,
  movementPattern: MovementPatternSchema.nullable().optional(),
  trackingType: TrackingTypeSchema.optional(),
  muscleGroups: z.array(z.string()).optional(),
  primaryMuscle: z.string().nullable().optional(),
  /** @deprecated Remove after 2026-09-01 — use `muscleGroups` instead. Kept for backward compatibility. */
  primaryMuscleGroups: z.array(MuscleGroupSchema).optional(),
  /** @deprecated Remove after 2026-09-01 — use `muscleGroups` instead. Not persisted in DB. Computed from muscleGroups. */
  secondaryMuscleGroups: z.array(MuscleGroupSchema).optional(),
  equipment: z.array(EquipmentTypeSchema),
  difficulty: DifficultyLevelSchema.nullable().optional(),
  /** @deprecated No Prisma Exercise.description column. Always undefined. Will be removed or migrated after 2026-09-01. */
  description: z.string().max(2000).optional(),
  instructions: z.string().nullable().optional(),
  cues: z.array(z.string()).optional(),
  videoUrl: z.string().url().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  /** @deprecated Remove after 2026-09-01 — use `imageUrl` instead. */
  thumbnailUrl: z.string().url().optional(),
  /** @enrichment Computed from category; not persisted */
  isCompound: z.boolean().optional(),
  /** @enrichment UI-computed; not persisted */
  isUnilateral: z.boolean().optional(),
  /** @enrichment UI-computed; not persisted */
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  mergedIntoId: z.string().uuid().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  metricDefinitionId: z.string().optional(),
  defaultSets: z.number().int().nullable().optional(),
  defaultReps: z.string().nullable().optional(),
});

export type ExerciseContract = z.infer<typeof exerciseSchema>;

// ============================================================================
// EXERCISE LOG CONTRACT
// ============================================================================

export const exerciseLogSchema = baseDocumentSchema.extend({
  id: z.string().uuid(),
  userId: z.string(),
  exerciseId: z.string().uuid(),
  /** @enrichment Server-computed, not stored */
  exerciseName: z.string().min(1).optional(),
  /** @deprecated Use workoutPlanId. Kept for backward compatibility. */
  workoutSessionId: z.string().uuid().optional(),
  workoutPlanId: z.string().uuid().nullable().optional(),
  /** @deprecated No Prisma ExerciseLog.performedAt column exists. Always undefined in API responses. Use `date` instead. Will be removed after 2026-09-01. */
  performedAt: isoTimestampSchema.optional(),
  date: isoDateSchema,
  setNumber: z.number().int().min(1).optional(),
  /** @enrichment Aggregate set count; not per-row */
  sets: z.number().int().min(1).optional(),
  reps: z.number().int().min(0).nullable().optional(),
  weight: z.number().min(0).nullable().optional(),
  weightUnit: z.enum(["kg", "lbs"]).nullable().optional(),
  duration: z.number().int().min(0).nullable().optional(),
  distance: z.number().min(0).nullable().optional(),
  rpe: z.number().int().min(1).max(10).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  /** @deprecated No Prisma ExerciseLog.tags column. Always undefined. Remove or add DB column before 2026-09-01. */
  tags: z.array(z.string()).optional(),
  metricDefinitionId: z.string().optional(),
  /** @computed Calculated from weight × reps × sets */
  volume: z.number().nullable().optional(),
  /** @computed Estimated one-rep max */
  estimated1RM: z.number().nullable().optional(),
});

export type ExerciseLogContract = z.infer<typeof exerciseLogSchema>;

// ============================================================================
// CREATE/UPDATE SCHEMAS
// ============================================================================

export const createExerciseSchema = exerciseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateExercise = z.infer<typeof createExerciseSchema>;

export const updateExerciseSchema = createExerciseSchema.partial();
export type UpdateExercise = z.infer<typeof updateExerciseSchema>;

/**
 * Zod schema for the ExerciseModal create/edit form.
 * Validates the critical user-facing fields before calling the exercise service.
 * Optional enum fields accept an empty string to represent "not selected".
 */
export const exerciseFormSchema = z.object({
  name: z.string().trim().min(1, "Exercise name is required").max(200),
  category: ExerciseCategorySchema,
  primaryMuscle: z.string().min(1, "Primary muscle is required"),
  muscleGroups: z.array(z.string()).min(1, "Select at least one muscle group"),
  movementPattern: z.union([MovementPatternSchema, z.literal("")]).optional(),
  difficulty: z.union([DifficultyLevelSchema, z.literal("")]).optional(),
});
export type ExerciseFormInput = z.infer<typeof exerciseFormSchema>;

export const createExerciseLogSchema = exerciseLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateExerciseLog = z.infer<typeof createExerciseLogSchema>;

// ============================================================================
// SCHEMA ALIASES (backwards compatibility with camelCase names)
// ============================================================================

/** @deprecated Use ExerciseCategorySchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias — type exported from PascalCase schema
export const exerciseCategorySchema = ExerciseCategorySchema;

/** @deprecated Use MovementPatternSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias — type exported from PascalCase schema
export const movementPatternSchema = MovementPatternSchema;

/** @deprecated Use MuscleGroupSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias — type exported from PascalCase schema
export const muscleGroupSchema = MuscleGroupSchema;

/** @deprecated Use EquipmentTypeSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias — type exported from PascalCase schema
export const equipmentTypeSchema = EquipmentTypeSchema;

/** @deprecated Use DifficultyLevelSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias — type exported from PascalCase schema
export const difficultyLevelSchema = DifficultyLevelSchema;

/** @deprecated Use TrackingTypeSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias — type exported from PascalCase schema
export const trackingTypeSchema = TrackingTypeSchema;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockExercise = (
  overrides: Partial<ExerciseContract> = {},
): ExerciseContract => {
  const timestamp = nowIso();
  return {
    id: "mock-exercise-id",
    name: "Barbell Squat",
    category: "COMPOUND",
    movementPattern: "squat",
    primaryMuscleGroups: ["quadriceps", "glutes"],
    secondaryMuscleGroups: ["hamstrings", "core"],
    equipment: ["barbell", "squat_rack"],
    difficulty: "INTERMEDIATE",
    description: "A fundamental compound exercise for leg development.",
    instructions:
      "Set up barbell at shoulder height\nPosition bar across upper back",
    muscleGroups: ["quadriceps", "glutes", "hamstrings", "core"],
    primaryMuscle: "quadriceps",
    isCompound: true,
    isUnilateral: false,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};

export const createMockExerciseLog = (
  overrides: Partial<ExerciseLogContract> = {},
): ExerciseLogContract => {
  const timestamp = nowIso();
  return {
    id: "mock-exercise-log-id",
    userId: "HH-ABC123",
    exerciseId: "mock-exercise-id",
    exerciseName: "Barbell Squat",
    performedAt: timestamp,
    date: timestamp.split("T")[0],
    sets: 4,
    reps: 8,
    weight: 100,
    weightUnit: "kg",
    rpe: 8,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};
