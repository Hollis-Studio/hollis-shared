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
export const WORKOUTS_TRACKING_MODES = ['weightlifting', 'cardio', 'stretching'] as const;
/** @deprecated Use WorkoutsModalitySchema */
export const WorkoutsTrackingModeSchema = z.enum(WORKOUTS_TRACKING_MODES);
/** @deprecated Use WorkoutsModality */
export type WorkoutsTrackingMode = z.infer<typeof WorkoutsTrackingModeSchema>;
export const WorkoutsModalitySchema = WorkoutsTrackingModeSchema;
export type WorkoutsModality = WorkoutsTrackingMode;

// ---------------------------------------------------------------------------
// ExerciseSubcategorySchema
// ---------------------------------------------------------------------------
export const EXERCISE_SUBCATEGORIES = [
  'compound', 'isolation', 'machine', 'freeweight', 'bodyweight', 'cable',
  'treadmill', 'bike', 'rowing', 'elliptical', 'stairmaster',
  'outdoor_running', 'outdoor_walking', 'outdoor_cycling',
  'jump_rope', 'isometric', 'flexibility',
] as const;
export const ExerciseSubcategorySchema = z.enum(EXERCISE_SUBCATEGORIES);
export type ExerciseSubcategory = z.infer<typeof ExerciseSubcategorySchema>;

// ---------------------------------------------------------------------------
// ExerciseSourceSchema
// ---------------------------------------------------------------------------
export const EXERCISE_SOURCES = ['library', 'user_created', 'ai_generated_freestyle'] as const;
export const ExerciseSourceSchema = z.enum(EXERCISE_SOURCES);
export type ExerciseSource = z.infer<typeof ExerciseSourceSchema>;

// ---------------------------------------------------------------------------
// WorkoutsExerciseTrackingModeSchema
// Fine-grained set-logging UI mode. Named Workouts* to avoid collision with
// contracts TrackingTypeSchema (REPS|TIME|DISTANCE — Health-app vocabulary).
// ---------------------------------------------------------------------------
export const WORKOUTS_EXERCISE_TRACKING_MODES = ['reps', 'timed', 'cardio', 'stretch'] as const;
export const WorkoutsExerciseTrackingModeSchema = z.enum(WORKOUTS_EXERCISE_TRACKING_MODES);
export type WorkoutsExerciseTrackingMode = z.infer<typeof WorkoutsExerciseTrackingModeSchema>;

// ---------------------------------------------------------------------------
// ExerciseAliasSourceSchema
// Canonical value set — includes user_confirmed which the server was missing
// (AUDIT-4 fix).
// ---------------------------------------------------------------------------
export const EXERCISE_ALIAS_SOURCES = ['scan', 'manual', 'ai_match', 'user_confirmed'] as const;
export const ExerciseAliasSourceSchema = z.enum(EXERCISE_ALIAS_SOURCES);
export type ExerciseAliasSource = z.infer<typeof ExerciseAliasSourceSchema>;

// ---------------------------------------------------------------------------
// Exercise provenance + moderation (Hollis Workouts #46)
//
// The user-generated exercise pipeline EXTENDS the canonical exercise row
// rather than introducing a parallel persistence model. A row is "canonical"
// (publicly presentable library content) iff:
//
//     source === 'library' && ownerUserId === null && supersededBy === null
//
// Anything else is user-owned content that must never be presented as
// canonical. `source` keeps its existing three-value vocabulary — 'library'
// IS the founder decision's `canonical`, and the two user-scoped values are
// its `user`.
//
// Moderation outcomes:
//   promote → source flips to 'library', ownerUserId cleared, status 'approved'
//   merge   → supersededBy set to the surviving id, status 'merged', row kept
//             as a redirect so existing session/program/baseline references
//             resolve without silent ID loss
//   reject  → status 'rejected' + rejectionReason, row stays user-owned
// ---------------------------------------------------------------------------
export const EXERCISE_MODERATION_STATUSES = [
  'draft',
  'pending',
  'approved',
  'rejected',
  'merged',
] as const;
export const ExerciseModerationStatusSchema = z.enum(EXERCISE_MODERATION_STATUSES);
export type ExerciseModerationStatus = z.infer<typeof ExerciseModerationStatusSchema>;

/**
 * Provenance/moderation block carried by every exercise row (canonical and
 * user-owned alike). Every field defaults to the "plain canonical library row"
 * value so pre-#46 rows and pre-#46 clients keep parsing unchanged.
 */
export const ExerciseProvenanceSchema = z.object({
  /** Owning user for user-generated rows; null for canonical library rows. */
  ownerUserId: z.string().min(1).nullable().default(null),
  /** True once the owner has explicitly suggested the row for the public library. */
  submittedForReview: z.boolean().default(false),
  submittedAt: z.coerce.date().nullable().default(null),
  moderationStatus: ExerciseModerationStatusSchema.nullable().default(null),
  /** Moderator-supplied reason; only meaningful when moderationStatus === 'rejected'. */
  rejectionReason: z.string().max(1000).nullable().default(null),
  /** Surviving exercise id this row was merged into. Non-null == redirect row. */
  supersededBy: z.string().min(1).nullable().default(null),
  moderatedAt: z.coerce.date().nullable().default(null),
  /** Moderator user id that recorded the last decision. */
  moderatedBy: z.string().min(1).nullable().default(null),
});
export type ExerciseProvenance = z.infer<typeof ExerciseProvenanceSchema>;

/** The provenance shape of a plain, unsubmitted, user-owned row. */
export const EXERCISE_PROVENANCE_DEFAULTS: ExerciseProvenance = {
  ownerUserId: null,
  submittedForReview: false,
  submittedAt: null,
  moderationStatus: null,
  rejectionReason: null,
  supersededBy: null,
  moderatedAt: null,
  moderatedBy: null,
};

/**
 * Structural canonical-library predicate. Every surface that presents the
 * public library MUST gate on this — filtering on `source` alone lets a
 * promoted-then-merged redirect row leak back into pickers.
 */
export function isCanonicalLibraryExercise(row: {
  /** Widened to `string` so it can be called directly on a DB row. */
  source: string;
  ownerUserId?: string | null;
  supersededBy?: string | null;
}): boolean {
  return (
    row.source === 'library' &&
    (row.ownerUserId ?? null) === null &&
    (row.supersededBy ?? null) === null
  );
}

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
export type UserExerciseSync = z.infer<typeof UserExerciseSyncSchema>;

// ---------------------------------------------------------------------------
// UserExerciseRecordSchema — GET response shape
// ---------------------------------------------------------------------------
export const UserExerciseRecordSchema = UserExerciseSyncSchema.extend({
  id: z.string().min(1),
  userId: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  // #46 provenance/moderation mirror. Response-only on purpose: these fields
  // are absent from UserExerciseSyncSchema so a client PUT can never forge its
  // own moderation state — only the moderation routes write them.
  ...ExerciseProvenanceSchema.shape,
});
export type UserExerciseRecord = z.infer<typeof UserExerciseRecordSchema>;

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
export type ExerciseAliasSync = z.infer<typeof ExerciseAliasSyncSchema>;

// ---------------------------------------------------------------------------
// ExerciseAliasRecordSchema — GET response shape
// ---------------------------------------------------------------------------
export const ExerciseAliasRecordSchema = ExerciseAliasSyncSchema.extend({
  id: z.string().min(1),
  userId: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ExerciseAliasRecord = z.infer<typeof ExerciseAliasRecordSchema>;

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
  // #46 provenance/moderation. Canonical library rows carry the defaults.
  ...ExerciseProvenanceSchema.shape,
});
export type CanonicalExerciseRecord = z.infer<typeof CanonicalExerciseRecordSchema>;
