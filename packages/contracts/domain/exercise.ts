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

import { z } from 'zod';
import { baseDocumentSchema, isoDateSchema, isoTimestampSchema, type IsoDateString, type IsoTimestampString } from './common';

// ============================================================================
// EXERCISE CATEGORIES
// ============================================================================

export const EXERCISE_CATEGORIES = ['compound', 'isolation', 'cardio', 'mobility', 'plyometric'] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];
export const ExerciseCategorySchema = z.enum(EXERCISE_CATEGORIES);

export const EXERCISE_CATEGORY = {
  COMPOUND: 'compound' as ExerciseCategory,
  ISOLATION: 'isolation' as ExerciseCategory,
  CARDIO: 'cardio' as ExerciseCategory,
  MOBILITY: 'mobility' as ExerciseCategory,
  PLYOMETRIC: 'plyometric' as ExerciseCategory,
} as const;

export const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  compound: 'Compound',
  isolation: 'Isolation',
  cardio: 'Cardio',
  mobility: 'Mobility',
  plyometric: 'Plyometric',
};

export function isExerciseCategory(value: string): value is ExerciseCategory {
  return (EXERCISE_CATEGORIES as readonly string[]).includes(value);
}

// ============================================================================
// MOVEMENT PATTERNS
// ============================================================================

export const MOVEMENT_PATTERNS = ['squat', 'hinge', 'push', 'pull', 'carry', 'rotation', 'lunge'] as const;
export type MovementPattern = (typeof MOVEMENT_PATTERNS)[number];
export const MovementPatternSchema = z.enum(MOVEMENT_PATTERNS);

export const MOVEMENT_PATTERN = {
  SQUAT: 'squat' as MovementPattern,
  HINGE: 'hinge' as MovementPattern,
  PUSH: 'push' as MovementPattern,
  PULL: 'pull' as MovementPattern,
  CARRY: 'carry' as MovementPattern,
  ROTATION: 'rotation' as MovementPattern,
  LUNGE: 'lunge' as MovementPattern,
} as const;

export const MOVEMENT_PATTERN_LABELS: Record<MovementPattern, string> = {
  squat: 'Squat',
  hinge: 'Hinge',
  push: 'Push',
  pull: 'Pull',
  carry: 'Carry',
  rotation: 'Rotation',
  lunge: 'Lunge',
};

// ============================================================================
// MUSCLE GROUPS
// ============================================================================

export const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'quadriceps', 'hamstrings', 'glutes', 'calves', 'core', 'forearms'
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export const MuscleGroupSchema = z.enum(MUSCLE_GROUPS);

export const MUSCLE_GROUP = {
  CHEST: 'chest' as MuscleGroup,
  BACK: 'back' as MuscleGroup,
  SHOULDERS: 'shoulders' as MuscleGroup,
  BICEPS: 'biceps' as MuscleGroup,
  TRICEPS: 'triceps' as MuscleGroup,
  QUADRICEPS: 'quadriceps' as MuscleGroup,
  HAMSTRINGS: 'hamstrings' as MuscleGroup,
  GLUTES: 'glutes' as MuscleGroup,
  CALVES: 'calves' as MuscleGroup,
  CORE: 'core' as MuscleGroup,
  FOREARMS: 'forearms' as MuscleGroup,
} as const;

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  quadriceps: 'Quadriceps',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  core: 'Core',
  forearms: 'Forearms',
};

// ============================================================================
// EQUIPMENT TYPES
// ============================================================================

export const EQUIPMENT_TYPES = [
  'barbell', 'dumbbell', 'kettlebell', 'cable', 'machine',
  'bodyweight', 'resistance_band', 'squat_rack', 'bench', 'pull_up_bar'
] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export const EquipmentTypeSchema = z.enum(EQUIPMENT_TYPES);

export const EQUIPMENT_TYPE = {
  BARBELL: 'barbell' as EquipmentType,
  DUMBBELL: 'dumbbell' as EquipmentType,
  KETTLEBELL: 'kettlebell' as EquipmentType,
  CABLE: 'cable' as EquipmentType,
  MACHINE: 'machine' as EquipmentType,
  BODYWEIGHT: 'bodyweight' as EquipmentType,
  RESISTANCE_BAND: 'resistance_band' as EquipmentType,
  SQUAT_RACK: 'squat_rack' as EquipmentType,
  BENCH: 'bench' as EquipmentType,
  PULL_UP_BAR: 'pull_up_bar' as EquipmentType,
} as const;

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  kettlebell: 'Kettlebell',
  cable: 'Cable',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  resistance_band: 'Resistance Band',
  squat_rack: 'Squat Rack',
  bench: 'Bench',
  pull_up_bar: 'Pull Up Bar',
};

// ============================================================================
// DIFFICULTY LEVELS
// ============================================================================

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];
export const DifficultyLevelSchema = z.enum(DIFFICULTY_LEVELS);

export const DIFFICULTY_LEVEL = {
  BEGINNER: 'beginner' as DifficultyLevel,
  INTERMEDIATE: 'intermediate' as DifficultyLevel,
  ADVANCED: 'advanced' as DifficultyLevel,
  EXPERT: 'expert' as DifficultyLevel,
} as const;

export const DIFFICULTY_LEVEL_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

// ============================================================================
// EXERCISE CONTRACT
// ============================================================================

/**
 * Exercise definition contract - represents an exercise in the library.
 */
export interface ExerciseContract {
  id: string;
  name: string;
  category: ExerciseCategory;
  movementPattern?: MovementPattern;
  primaryMuscleGroups: MuscleGroup[];
  secondaryMuscleGroups?: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: DifficultyLevel;
  description?: string;
  instructions?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  isCompound: boolean;
  isUnilateral: boolean;
  isActive: boolean;
  tags?: string[];
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
}

export const exerciseSchema: z.ZodType<ExerciseContract> = baseDocumentSchema.extend({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  category: ExerciseCategorySchema,
  movementPattern: MovementPatternSchema.optional(),
  primaryMuscleGroups: z.array(MuscleGroupSchema).min(1),
  secondaryMuscleGroups: z.array(MuscleGroupSchema).optional(),
  equipment: z.array(EquipmentTypeSchema),
  difficulty: DifficultyLevelSchema,
  description: z.string().max(2000).optional(),
  instructions: z.array(z.string()).optional(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  isCompound: z.boolean(),
  isUnilateral: z.boolean(),
  isActive: z.boolean(),
  tags: z.array(z.string()).optional(),
}) satisfies z.ZodType<ExerciseContract>;

// ============================================================================
// EXERCISE LOG CONTRACT
// ============================================================================

/**
 * Exercise log contract - represents a logged exercise performance.
 */
export interface ExerciseLogContract {
  id: string;
  /** User identifier in HH-XXXXXX barcode format */
  userId: string;
  exerciseId: string;
  exerciseName: string;
  workoutSessionId?: string;
  performedAt: IsoTimestampString;
  date: IsoDateString;
  sets: number;
  reps?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  duration?: number; // seconds
  distance?: number; // meters
  rpe?: number; // 1-10
  notes?: string;
  tags?: string[];
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
}

export const exerciseLogSchema: z.ZodType<ExerciseLogContract> = baseDocumentSchema.extend({
  id: z.string().uuid(),
  userId: z.string(),
  exerciseId: z.string().uuid(),
  exerciseName: z.string().min(1),
  workoutSessionId: z.string().uuid().optional(),
  performedAt: isoTimestampSchema,
  date: isoDateSchema,
  sets: z.number().int().min(1),
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(['kg', 'lbs']).optional(),
  duration: z.number().int().min(0).optional(),
  distance: z.number().min(0).optional(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
}) satisfies z.ZodType<ExerciseLogContract>;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockExercise = (overrides: Partial<ExerciseContract> = {}): ExerciseContract => {
  const timestamp = nowIso();
  return {
    id: 'mock-exercise-id',
    name: 'Barbell Squat',
    category: 'compound',
    movementPattern: 'squat',
    primaryMuscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscleGroups: ['hamstrings', 'core'],
    equipment: ['barbell', 'squat_rack'],
    difficulty: 'intermediate',
    description: 'A fundamental compound exercise for leg development.',
    instructions: ['Set up barbell at shoulder height', 'Position bar across upper back'],
    isCompound: true,
    isUnilateral: false,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};

export const createMockExerciseLog = (overrides: Partial<ExerciseLogContract> = {}): ExerciseLogContract => {
  const timestamp = nowIso();
  return {
    id: 'mock-exercise-log-id',
    userId: 'HH-ABC123',
    exerciseId: 'mock-exercise-id',
    exerciseName: 'Barbell Squat',
    performedAt: timestamp,
    date: timestamp.split('T')[0],
    sets: 4,
    reps: 8,
    weight: 100,
    weightUnit: 'kg',
    rpe: 8,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};
