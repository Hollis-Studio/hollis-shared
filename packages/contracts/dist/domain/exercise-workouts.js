/**
 * @ai-context Workouts exercise wire shapes | Scoped to Workouts-specific exercise
 * wire shapes. Does NOT clash with domain/exercise.ts vocabulary (which uses
 * ExerciseCategorySchema = COMPOUND|ISOLATION|CARDIO|MOBILITY|PLYOMETRIC and
 * TrackingTypeSchema = REPS|TIME|DISTANCE — the Health-app vocabulary).
 *
 * deps: zod, domain/equipment, domain/muscles, domain/units
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
import { EquipmentTypeSchema } from './equipment.js';
import { MuscleGroupSchema } from './muscles.js';
import { WeightModeSchema } from './units.js';
// ---------------------------------------------------------------------------
// WorkoutsModalitySchema
// The top-level routing/modality field stored in UserExercise.modality and
// CanonicalExercise.modality. Named Workouts* to avoid collision with the
// Health-app ExerciseCategorySchema (COMPOUND|ISOLATION|…).
// ---------------------------------------------------------------------------
export const WORKOUTS_TRACKING_MODES = ['weightlifting', 'cardio', 'stretching'];
/** @deprecated Use WorkoutsModalitySchema */
export const WorkoutsTrackingModeSchema = z.enum(WORKOUTS_TRACKING_MODES);
export const WorkoutsModalitySchema = WorkoutsTrackingModeSchema;
// ---------------------------------------------------------------------------
// ExerciseSubcategorySchema
// ---------------------------------------------------------------------------
export const EXERCISE_SUBCATEGORIES = [
    'compound', 'isolation', 'machine', 'freeweight', 'bodyweight', 'cable',
    'treadmill', 'bike', 'rowing', 'elliptical', 'stairmaster',
    'outdoor_running', 'outdoor_walking', 'outdoor_cycling',
    'jump_rope', 'isometric', 'flexibility',
];
export const ExerciseSubcategorySchema = z.enum(EXERCISE_SUBCATEGORIES);
// ---------------------------------------------------------------------------
// ExerciseSourceSchema
// ---------------------------------------------------------------------------
export const EXERCISE_SOURCES = ['library', 'user_created', 'ai_generated_freestyle'];
export const ExerciseSourceSchema = z.enum(EXERCISE_SOURCES);
// ---------------------------------------------------------------------------
// WorkoutsExerciseTrackingModeSchema
// Fine-grained set-logging UI mode. Named Workouts* to avoid collision with
// contracts TrackingTypeSchema (REPS|TIME|DISTANCE — Health-app vocabulary).
// ---------------------------------------------------------------------------
export const WORKOUTS_EXERCISE_TRACKING_MODES = ['reps', 'timed', 'cardio', 'stretch'];
export const WorkoutsExerciseTrackingModeSchema = z.enum(WORKOUTS_EXERCISE_TRACKING_MODES);
// ---------------------------------------------------------------------------
// ExerciseAliasSourceSchema
// Canonical value set — includes user_confirmed which the server was missing
// (AUDIT-4 fix).
// ---------------------------------------------------------------------------
export const EXERCISE_ALIAS_SOURCES = ['scan', 'manual', 'ai_match', 'user_confirmed'];
export const ExerciseAliasSourceSchema = z.enum(EXERCISE_ALIAS_SOURCES);
// ---------------------------------------------------------------------------
// UserExerciseSyncSchema — request body for POST/PUT /v1/user-exercises
// AUDIT-3 fix: trackingMode is .nullable() (was .optional() server-side,
// rejecting explicit null from the client).
// ---------------------------------------------------------------------------
export const UserExerciseSyncSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    modality: WorkoutsModalitySchema,
    subcategory: ExerciseSubcategorySchema.optional(),
    primaryMuscleGroups: z.array(MuscleGroupSchema).default([]),
    secondaryMuscleGroups: z.array(MuscleGroupSchema),
    equipmentType: EquipmentTypeSchema,
    requiredEquipment: z.array(z.string()).default([]),
    isBodyweight: z.boolean(),
    isUnilateral: z.boolean(),
    defaultRestTimerSec: z.number().int().min(0),
    defaultWeightMode: WeightModeSchema,
    illustrationUrl: z.string(),
    metadata: z.record(z.string(), z.unknown()),
    minimumIncrementKg: z.number().min(0),
    source: ExerciseSourceSchema,
    trackingMode: WorkoutsExerciseTrackingModeSchema.nullable(), // AUDIT-3: accepts null
    isActive: z.boolean().default(true),
});
// ---------------------------------------------------------------------------
// UserExerciseRecordSchema — GET response shape
// ---------------------------------------------------------------------------
export const UserExerciseRecordSchema = UserExerciseSyncSchema.extend({
    id: z.string().min(1),
    userId: z.string().min(1),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
// ---------------------------------------------------------------------------
// ExerciseAliasSyncSchema — request body for POST/PUT /v1/exercise-aliases
// AUDIT-4 fix: source now includes user_confirmed.
// ---------------------------------------------------------------------------
export const ExerciseAliasSyncSchema = z.object({
    alias: z.string().min(1),
    normalizedAlias: z.string().min(1),
    canonicalExerciseId: z.string().min(1),
    equipmentType: EquipmentTypeSchema.optional(),
    gymProfileId: z.string().min(1).optional(),
    source: ExerciseAliasSourceSchema,
});
// ---------------------------------------------------------------------------
// ExerciseAliasRecordSchema — GET response shape
// ---------------------------------------------------------------------------
export const ExerciseAliasRecordSchema = ExerciseAliasSyncSchema.extend({
    id: z.string().min(1),
    userId: z.string().min(1),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
// ---------------------------------------------------------------------------
// CanonicalExerciseRecordSchema — GET response for /v1/exercises (read-only)
// ---------------------------------------------------------------------------
export const CanonicalExerciseRecordSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    modality: WorkoutsModalitySchema,
    subcategory: ExerciseSubcategorySchema.optional(),
    primaryMuscleGroups: z.array(MuscleGroupSchema).default([]),
    secondaryMuscleGroups: z.array(MuscleGroupSchema),
    equipmentType: EquipmentTypeSchema,
    requiredEquipment: z.array(z.string()),
    isBodyweight: z.boolean(),
    isUnilateral: z.boolean(),
    defaultRestTimerSec: z.number().int().min(0),
    defaultWeightMode: WeightModeSchema,
    illustrationUrl: z.string(),
    metadata: z.record(z.string(), z.unknown()),
    minimumIncrementKg: z.number().min(0),
    source: ExerciseSourceSchema,
    isActive: z.boolean(),
    trackingMode: WorkoutsExerciseTrackingModeSchema.nullable(),
    createdAt: z.coerce.date(),
});
//# sourceMappingURL=exercise-workouts.js.map