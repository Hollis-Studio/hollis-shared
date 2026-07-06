/**
 * @ai-context Workouts gym domain | GymProfile, GymEquipmentItem, GymExerciseInstance,
 * equipment variant/weight-system enums, and exercise selection mode.
 *
 * deps: zod, domain/equipment, domain/units
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
import { EquipmentTypeSchema } from './equipment.js';
import { WeightUnitSchema, WeightModeSchema } from './units.js';

// ---------------------------------------------------------------------------
// ExerciseSelectionModeSchema
// ---------------------------------------------------------------------------
export const EXERCISE_SELECTION_MODES = ['equipment_based', 'exercise'] as const;
export const ExerciseSelectionModeSchema = z.enum(EXERCISE_SELECTION_MODES);
export type ExerciseSelectionMode = z.infer<typeof ExerciseSelectionModeSchema>;

// ---------------------------------------------------------------------------
// EquipmentVariantSchema (44 members — matches server inline + app constants exactly)
// ---------------------------------------------------------------------------
export const EQUIPMENT_VARIANTS = [
  'standard_barbell', 'olympic_barbell', 'ez_curl_bar', 'trap_bar', 'safety_squat_bar',
  'fixed_dumbbells', 'adjustable_dumbbells',
  'single_stack_cable', 'dual_crossover_cable', 'functional_trainer',
  'leg_press', 'hack_squat', 'chest_press_machine', 'lat_pulldown_machine',
  'seated_row_machine', 'leg_extension_machine', 'leg_curl_machine', 'pec_deck',
  'smith_machine_standard',
  'flat_treadmill', 'incline_treadmill', 'upright_bike', 'recumbent_bike', 'spin_bike',
  'concept2_rower', 'standard_elliptical',
  'standard_kettlebell', 'competition_kettlebell',
  'loop_band', 'tube_band',
  'standard_stairmaster', 'stepper',
  'speed_rope', 'weighted_rope',
  'power_rack', 'squat_stand', 'pull_up_bar', 'dip_station',
  'flat_bench', 'adjustable_bench', 'decline_bench', 'preacher_curl_bench',
  'ghd', 'other_variant',
] as const;
export const EquipmentVariantSchema = z.enum(EQUIPMENT_VARIANTS);
export type EquipmentVariant = z.infer<typeof EquipmentVariantSchema>;

// ---------------------------------------------------------------------------
// EquipmentWeightSystemSchema
// ---------------------------------------------------------------------------
export const EQUIPMENT_WEIGHT_SYSTEMS = [
  'none', 'bar', 'weight_stack', 'plate_loaded', 'free_weight',
] as const;
export const EquipmentWeightSystemSchema = z.enum(EQUIPMENT_WEIGHT_SYSTEMS);
export type EquipmentWeightSystem = z.infer<typeof EquipmentWeightSystemSchema>;

// ---------------------------------------------------------------------------
// GymLocationSchema
// Note: no .refine() here — the client-side "at least one field" guard stays
// in src/schemas/gym.ts as app UX logic, not a wire contract invariant.
// ---------------------------------------------------------------------------
export const GymLocationSchema = z.object({
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  address: z.string().optional(),
});
export type GymLocation = z.infer<typeof GymLocationSchema>;

// ---------------------------------------------------------------------------
// GymEquipmentItemSchema
// Server enforces id.max(128) and notes.max(500) — included in contract.
// variant is a closed enum (server rejects values outside it with 400).
// ---------------------------------------------------------------------------
export const GymEquipmentItemSchema = z.object({
  id: z.string().min(1).max(128),
  type: EquipmentTypeSchema,
  variant: EquipmentVariantSchema.optional(),
  weightSystem: EquipmentWeightSystemSchema.optional(),
  weightStackKg: z.number().nonnegative().optional(),
  incrementKg: z.number().nonnegative().optional(),
  minWeightKg: z.number().nonnegative().optional(),
  maxWeightKg: z.number().nonnegative().optional(),
  count: z.number().int().min(1),
  notes: z.string().max(500).optional(),
});
export type GymEquipmentItem = z.infer<typeof GymEquipmentItemSchema>;

// ---------------------------------------------------------------------------
// GymProfileSchema — full record shape (request body uses .omit({id,userId}))
// Note: createdAt/updatedAt are .optional() so the schema doubles as request
// body base; the response always populates them.
// The app's {} → undefined preprocess for location stays in src/schemas/gym.ts
// as a read-path coercion, not a wire contract concern.
// ---------------------------------------------------------------------------
export const GymProfileSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  name: z.string().min(1).max(200),
  location: GymLocationSchema.optional(),
  equipmentTypes: z.array(EquipmentTypeSchema).default([]),
  equipmentIds: z.array(z.string().min(1).max(128)).default([]),
  equipmentItems: z.array(GymEquipmentItemSchema).default([]),
  exerciseSelectionMode: ExerciseSelectionModeSchema.default('equipment_based'),
  isActive: z.boolean(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
export type GymProfile = z.infer<typeof GymProfileSchema>;

// ---------------------------------------------------------------------------
// AutoregulationStyleSchema — per-exercise within-session set-style intent
// consumed by the Workouts progression engine v3 (spec DEC6/DEC12):
//   pyramid_down — hold target reps, drop load across working sets (default)
//   hold_weight  — hold load, let predicted reps fall across working sets
// ---------------------------------------------------------------------------
export const AUTOREGULATION_STYLES = ['pyramid_down', 'hold_weight'] as const;
export const AutoregulationStyleSchema = z.enum(AUTOREGULATION_STYLES);
export type AutoregulationStyle = z.infer<typeof AutoregulationStyleSchema>;

// ---------------------------------------------------------------------------
// GymExerciseInstanceSchema — full record shape
// deletedAt included because CRUD uses deleteStyle:"hard" which stamps it;
// tombstoned rows appear in list responses.
// repRangeMin/repRangeMax/autoregulationStyle are the per-exercise engine
// overrides (v3 spec DEC12) — first-class columns replacing the interim
// UserSettings.exerciseEngineOverrides passthrough map. Both rep bounds are
// set together or not at all; the app enforces min ≤ max as UX logic.
// ---------------------------------------------------------------------------
export const GymExerciseInstanceSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  gymProfileId: z.string().min(1),
  canonicalExerciseId: z.string().min(1),
  baseWeightKg: z.number().min(0).nullable().optional(),
  weightUnit: WeightUnitSchema,
  weightMode: WeightModeSchema,
  weightIncrementKg: z.number().min(0).optional(),
  repRangeMin: z.number().int().min(1).max(100).nullable().optional(),
  repRangeMax: z.number().int().min(1).max(100).nullable().optional(),
  autoregulationStyle: AutoregulationStyleSchema.nullable().optional(),
  isActive: z.boolean(),
  notes: z.string().max(500).optional(),
  lastUsedWeightKg: z.number().min(0).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
});
export type GymExerciseInstance = z.infer<typeof GymExerciseInstanceSchema>;
