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
} from "./common";

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
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];
export const ExerciseCategorySchema = z.enum(EXERCISE_CATEGORIES);

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
export type MovementPattern = (typeof MOVEMENT_PATTERNS)[number];
export const MovementPatternSchema = z.enum(MOVEMENT_PATTERNS);

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
// MUSCLE GROUPS
// ============================================================================

export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "core",
  "forearms",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export const MuscleGroupSchema = z.enum(MUSCLE_GROUPS);

export const MUSCLE_GROUP = {
  CHEST: "chest" as MuscleGroup,
  BACK: "back" as MuscleGroup,
  SHOULDERS: "shoulders" as MuscleGroup,
  BICEPS: "biceps" as MuscleGroup,
  TRICEPS: "triceps" as MuscleGroup,
  QUADRICEPS: "quadriceps" as MuscleGroup,
  HAMSTRINGS: "hamstrings" as MuscleGroup,
  GLUTES: "glutes" as MuscleGroup,
  CALVES: "calves" as MuscleGroup,
  CORE: "core" as MuscleGroup,
  FOREARMS: "forearms" as MuscleGroup,
} as const;

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  quadriceps: "Quadriceps",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  core: "Core",
  forearms: "Forearms",
};

// ============================================================================
// EQUIPMENT TYPES
// ============================================================================

export const EQUIPMENT_TYPES = [
  "barbell",
  "dumbbell",
  "kettlebell",
  "cable",
  "machine",
  "bodyweight",
  "resistance_band",
  "squat_rack",
  "bench",
  "pull_up_bar",
] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export const EquipmentTypeSchema = z.enum(EQUIPMENT_TYPES);

export const EQUIPMENT_TYPE = {
  BARBELL: "barbell" as EquipmentType,
  DUMBBELL: "dumbbell" as EquipmentType,
  KETTLEBELL: "kettlebell" as EquipmentType,
  CABLE: "cable" as EquipmentType,
  MACHINE: "machine" as EquipmentType,
  BODYWEIGHT: "bodyweight" as EquipmentType,
  RESISTANCE_BAND: "resistance_band" as EquipmentType,
  SQUAT_RACK: "squat_rack" as EquipmentType,
  BENCH: "bench" as EquipmentType,
  PULL_UP_BAR: "pull_up_bar" as EquipmentType,
} as const;

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  kettlebell: "Kettlebell",
  cable: "Cable",
  machine: "Machine",
  bodyweight: "Bodyweight",
  resistance_band: "Resistance Band",
  squat_rack: "Squat Rack",
  bench: "Bench",
  pull_up_bar: "Pull Up Bar",
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
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];
export const DifficultyLevelSchema = z.enum(DIFFICULTY_LEVELS);

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

// ============================================================================
// TRACKING TYPES
// ============================================================================

export const TRACKING_TYPES = ["REPS", "TIME", "DISTANCE"] as const;
export type TrackingType = (typeof TRACKING_TYPES)[number];
export const TrackingTypeSchema = z.enum(TRACKING_TYPES);

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

// ============================================================================
// EXERCISE CONTRACT
// ============================================================================

export const exerciseSchema = baseDocumentSchema.extend({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  category: ExerciseCategorySchema,
  movementPattern: MovementPatternSchema.optional(),
  trackingType: TrackingTypeSchema.optional(),
  muscleGroups: z.array(z.string()).optional(),
  primaryMuscle: z.string().optional(),
  /** @deprecated Use muscleGroups instead. Kept for backward compatibility. */
  primaryMuscleGroups: z.array(MuscleGroupSchema).optional(),
  /** @deprecated Not persisted in DB. Computed from muscleGroups. */
  secondaryMuscleGroups: z.array(MuscleGroupSchema).optional(),
  equipment: z.array(EquipmentTypeSchema),
  difficulty: DifficultyLevelSchema.optional(),
  description: z.string().max(2000).optional(),
  instructions: z.string().nullable().optional(),
  cues: z.array(z.string()).optional(),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  /** @deprecated Use imageUrl instead */
  thumbnailUrl: z.string().url().optional(),
  /** @enrichment Computed from category; not persisted */
  isCompound: z.boolean().optional(),
  /** @enrichment UI-computed; not persisted */
  isUnilateral: z.boolean().optional(),
  /** @enrichment UI-computed; not persisted */
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  mergedIntoId: z.string().uuid().optional(),
  createdBy: z.string().optional(),
  metricDefinitionId: z.string().optional(),
  defaultSets: z.number().int().optional(),
  defaultReps: z.string().optional(),
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
  workoutPlanId: z.string().uuid().optional(),
  performedAt: isoTimestampSchema,
  date: isoDateSchema,
  setNumber: z.number().int().min(1).optional(),
  /** @enrichment Aggregate set count; not per-row */
  sets: z.number().int().min(1).optional(),
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(["kg", "lbs"]).optional(),
  duration: z.number().int().min(0).optional(),
  distance: z.number().min(0).optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  metricDefinitionId: z.string().optional(),
  /** @computed Calculated from weight × reps × sets */
  volume: z.number().optional(),
  /** @computed Estimated one-rep max */
  estimated1RM: z.number().optional(),
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

export const updateExerciseSchema = createExerciseSchema.partial();

export const createExerciseLogSchema = exerciseLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================================================
// SCHEMA ALIASES (backwards compatibility with camelCase names)
// ============================================================================

/** @deprecated Use ExerciseCategorySchema instead. Remove after 2026-05-01 */
export const exerciseCategorySchema = ExerciseCategorySchema;

/** @deprecated Use MovementPatternSchema instead. Remove after 2026-05-01 */
export const movementPatternSchema = MovementPatternSchema;

/** @deprecated Use MuscleGroupSchema instead. Remove after 2026-05-01 */
export const muscleGroupSchema = MuscleGroupSchema;

/** @deprecated Use EquipmentTypeSchema instead. Remove after 2026-05-01 */
export const equipmentTypeSchema = EquipmentTypeSchema;

/** @deprecated Use DifficultyLevelSchema instead. Remove after 2026-05-01 */
export const difficultyLevelSchema = DifficultyLevelSchema;

/** @deprecated Use TrackingTypeSchema instead. Remove after 2026-05-01 */
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
