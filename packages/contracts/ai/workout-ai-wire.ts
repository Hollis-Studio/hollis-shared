/**
 * @ai-context Workouts AI wire contract | Shared Zod schemas for the Hollis
 * Workouts AI HTTP surface (Smart Builder, voice logging, equipment recognition,
 * exercise matching, muscle tagging, gym setup).
 *
 * These are the request/response shapes that BOTH the Workouts Express server
 * (server/src/services/ai/*) and the Workouts mobile client (src/schemas/ai/*)
 * must agree on. They previously lived as two hand-maintained copies that drifted
 * (mismatched numeric bounds, a missing `stretch` tracking mode, a one-sided
 * cardio refinement, prompt-only vocabularies). This module is the single source
 * of truth that makes that drift structurally impossible.
 *
 * IMPORTANT: pure TypeScript + Zod only.
 * - NO Gemini SDK imports (@google/genai). The Gemini structured-output schemas
 *   (Type.OBJECT trees) require the SDK and stay in server/src/services/ai.
 * - NO Node.js-only or platform-specific imports (consumed by React Native).
 *
 * Deliberately NOT centralized (legitimate per-side concerns, not drift):
 * - The voice response ENVELOPE (server validates its output with a non-empty
 *   transcript; the client accepts leniently and runs a legacy→V2 normalizer).
 * - The client-only `userOverride` flag (set in the review UI, never on the wire).
 * - Request-body schemas that only one side validates.
 *
 * deps: zod, domain/muscles | consumers: hollis-workouts server + mobile client
 */

import { z } from "zod";
import { MuscleGroupSchema } from "../domain/muscles.js";
import {
  PrescriptionActionSchema,
  PrescriptionDropStepSchema,
  AiContextDriverInputSchema,
  AiSetSignalOverrideSchema,
} from "../progression/engine.js";

// ============================================================================
// Shared vocabulary
// ============================================================================

/** Equipment types catalogued by the gym-setup wizard. Closed set + `other`. */
export const GYM_EQUIPMENT_TYPES = [
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
  "plate_loaded_machine",
  "smith_machine",
  "treadmill",
  "stationary_bike",
  "rowing_machine",
  "elliptical",
  "stairmaster",
  "jump_rope",
  "other",
] as const;
export type GymEquipmentType = (typeof GYM_EQUIPMENT_TYPES)[number];

/**
 * Equipment types the photo recognizer may return. Same as the gym-setup set
 * plus `none` (no equipment detected in the frame).
 */
export const RECOGNIZE_EQUIPMENT_TYPES = [
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
  "plate_loaded_machine",
  "smith_machine",
  "treadmill",
  "stationary_bike",
  "rowing_machine",
  "elliptical",
  "stairmaster",
  "jump_rope",
  "none",
  "other",
] as const;
export type RecognizeEquipmentType = (typeof RECOGNIZE_EQUIPMENT_TYPES)[number];

/** Per-set / per-operation numeric bounds. Shared so the two sides cannot drift. */
const WEIGHT_KG_MAX = 1000;
const REPS_MAX = 200;
const RIR_MAX = 10;
// durationSeconds spans both timed holds and long cardio efforts (ultra
// distances run for many hours), so the ceiling is generous on purpose.
const DURATION_SECONDS_MAX = 86_400;
const DISTANCE_KM_MAX = 1000;
const REST_SECONDS_MAX = 3600;

// ============================================================================
// Voice workout logging — operation schema (V2)
// ============================================================================

/** Flat set shape used inside `add_exercise.sets`. */
export const VoiceOpSetSchema = z.object({
  weightKg: z.number().min(0).max(WEIGHT_KG_MAX).optional(),
  reps: z.number().int().min(0).max(REPS_MAX).optional(),
  rir: z.number().int().min(0).max(RIR_MAX).optional(),
  durationSeconds: z.number().int().min(0).max(DURATION_SECONDS_MAX).optional(),
  distanceKm: z.number().min(0).max(DISTANCE_KM_MAX).optional(),
});

const VoiceLogOperationRawSchema = z.object({
  op: z.enum([
    "log_set",
    "modify_set",
    "delete_set",
    "skip_set",
    "set_rest",
    "set_active_exercise",
    "add_exercise",
  ]),
  exerciseIndex: z.number().int().min(0).optional(),
  setIndex: z.number().int().min(0).optional(),
  weightKg: z.number().min(0).max(WEIGHT_KG_MAX).optional(),
  reps: z.number().int().min(0).max(REPS_MAX).optional(),
  rir: z.number().int().min(0).max(RIR_MAX).optional(),
  durationSeconds: z.number().int().min(0).max(DURATION_SECONDS_MAX).optional(),
  distanceKm: z.number().min(0).max(DISTANCE_KM_MAX).optional(),
  restAfterSec: z.number().int().min(0).max(REST_SECONDS_MAX).nullable().optional(),
  exerciseName: z.string().min(1).optional(),
  trackingMode: z.enum(["reps", "timed", "cardio", "stretch"]).optional(),
  insertAfterIndex: z.number().int().min(0).nullable().optional(),
  sets: z.array(VoiceOpSetSchema).max(20).optional(),
  confidence: z.number().min(0).max(1),
  explanation: z.string().optional(),
});

/**
 * A single voice-log operation. Gemini structured output cannot emit a
 * discriminated union, so every field is optional except `op`/`confidence`; a
 * superRefine enforces the per-op required fields and narrows into the union.
 */
export const VoiceLogOperationSchema = VoiceLogOperationRawSchema.superRefine(
  (val, ctx) => {
    const requireField = (field: string, label: string): void => {
      if ((val as Record<string, unknown>)[field] === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${val.op} requires '${label}'`,
          path: [field],
        });
      }
    };

    switch (val.op) {
      case "log_set":
        requireField("exerciseIndex", "exerciseIndex");
        break;
      case "modify_set":
      case "delete_set":
      case "skip_set":
        requireField("exerciseIndex", "exerciseIndex");
        requireField("setIndex", "setIndex");
        break;
      case "set_rest":
        requireField("exerciseIndex", "exerciseIndex");
        requireField("setIndex", "setIndex");
        requireField("restAfterSec", "restAfterSec");
        break;
      case "set_active_exercise":
        requireField("exerciseIndex", "exerciseIndex");
        break;
      case "add_exercise":
        requireField("exerciseName", "exerciseName");
        requireField("trackingMode", "trackingMode");
        break;
    }
  },
);
export type VoiceLogOperation = z.infer<typeof VoiceLogOperationSchema>;

// ============================================================================
// Smart program builder — slotted program + response union
// ============================================================================

const AIQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  type: z.enum(["chips", "slider", "toggle", "text"]),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  placeholder: z.string().optional(),
  multiline: z.boolean().optional(),
});

const AIQuestionGroupSchema = z.object({
  topic: z.string(),
  questions: z.array(AIQuestionSchema).min(1),
});

const LiftingSlottedExerciseSchema = z.object({
  slotId: z.string().min(1),
  canonicalExerciseId: z.string(),
  exerciseType: z.literal("lifting"),
  sets: z.number().int().min(1).max(10),
  reps: z.number().int().min(1).max(100),
  rir: z.number().int().min(0).max(5),
  progressionMode: z.enum(["weight_first", "reps_first"]),
  goalMode: z.enum(["progress", "maintain", "track_only"]).optional(),
  priorityLevel: z.enum(["primary", "secondary", "supporting"]).optional(),
});

const TimedSlottedExerciseSchema = z.object({
  slotId: z.string().min(1),
  canonicalExerciseId: z.string(),
  exerciseType: z.literal("timed"),
  sets: z.number().int().min(1).max(10),
  durationSeconds: z.number().int().min(5).max(600),
  progressionMode: z.literal("duration_first"),
  goalMode: z.enum(["progress", "maintain", "track_only"]).optional(),
  priorityLevel: z.enum(["primary", "secondary", "supporting"]).optional(),
});

const CardioSlottedExerciseSchema = z
  .object({
    slotId: z.string().min(1),
    canonicalExerciseId: z.string(),
    exerciseType: z.literal("cardio"),
    durationSeconds: z.number().int().min(60).nullable(),
    targetDistanceKm: z.number().min(0).nullable(),
    targetSpeedKmh: z.number().min(0).nullable(),
    goalMode: z.enum(["progress", "maintain", "track_only"]).optional(),
    priorityLevel: z.enum(["primary", "secondary", "supporting"]).optional(),
  })
  // A cardio slot with all three targets null is meaningless; both sides reject it.
  .refine(
    (exercise) =>
      exercise.durationSeconds !== null ||
      exercise.targetDistanceKm !== null ||
      exercise.targetSpeedKmh !== null,
    { message: "Cardio exercises need at least one target" },
  );

/**
 * Backward-compat: coerce old-format exercises (no `exerciseType`) to `lifting`.
 * Note: stretch exercises are slotted as `timed` (a duration-based hold) — the
 * slot model has no dedicated stretch type.
 */
export const SlottedExerciseSchema = z.preprocess(
  (val: unknown) => {
    if (val && typeof val === "object" && !("exerciseType" in val)) {
      return { ...val, exerciseType: "lifting" };
    }
    return val;
  },
  z.discriminatedUnion("exerciseType", [
    LiftingSlottedExerciseSchema,
    TimedSlottedExerciseSchema,
    CardioSlottedExerciseSchema,
  ]),
);

const SlottedDaySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  name: z.string(),
  exercises: z.array(SlottedExerciseSchema),
});

export const SlottedProgramSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["linear", "undulating", "block", "custom"]),
  durationWeeks: z.number().int().min(1).max(52),
  deloadWeekNumbers: z.array(z.number().int()).optional(),
  deloadPercent: z.number().min(0).max(1).optional(),
  schedule: z.array(SlottedDaySchema),
});
export type SlottedProgram = z.infer<typeof SlottedProgramSchema>;

// ============================================================================
// Program editing — robust, semantically-addressed edit operations (alpha.27)
// ============================================================================
//
// Replaces the legacy 5-op union (kept below as `LegacyProgramEditSchema` for
// one deprecation cycle). The new union adds semantic addressing (target a day
// by name | index | dayOfWeek; a slot by slotId | {day, exercise}), schema-level
// numeric bounds, server-generated slot IDs for `add_exercise`, and three new
// ops (reorder_within_day, rename_or_reschedule_day, apply_to_all_days).
// Cross-field "at least one" rules are enforced by a union-level superRefine
// because z.discriminatedUnion members cannot carry their own refinements.

/** Patchable per-slot training parameters. All optional; bounds match the slot schemas. */
export const EditParamsSchema = z.object({
  sets: z.number().int().min(1).max(10).optional(),
  reps: z.number().int().min(1).max(REPS_MAX).optional(),
  rir: z.number().int().min(0).max(5).optional(),
  durationSeconds: z.number().int().min(1).max(DURATION_SECONDS_MAX).optional(),
  targetDistanceKm: z.number().min(0).max(DISTANCE_KM_MAX).optional(),
  targetSpeedKmh: z.number().min(0).optional(),
  progressionMode: z.enum(["weight_first", "reps_first", "duration_first"]).optional(),
  // Engine-consumed per-slot intent. goalMode drives the progression engine's
  // progress/maintain decision; priorityLevel drives progression scaling. These
  // mirror the slot schemas above so update_set_params / apply_params can set
  // them — the model must NOT fake "put X on maintenance" via set/rep tweaks.
  goalMode: z.enum(["progress", "maintain", "track_only"]).optional(),
  priorityLevel: z.enum(["primary", "secondary", "supporting"]).optional(),
});
export type EditParams = z.infer<typeof EditParamsSchema>;

const EDIT_PARAM_KEYS = [
  "sets",
  "reps",
  "rir",
  "durationSeconds",
  "targetDistanceKm",
  "targetSpeedKmh",
  "progressionMode",
  "goalMode",
  "priorityLevel",
] as const;
const hasAnyEditParam = (p: EditParams | undefined): boolean =>
  p !== undefined && EDIT_PARAM_KEYS.some((k) => p[k] !== undefined);

/** Address a program day by exactly one of: name (preferred), positional index, or dayOfWeek. */
export const DayRefSchema = z
  .object({
    name: z.string().min(1).optional(),
    index: z.number().int().min(0).optional(),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
  })
  .refine(
    (r) => [r.name, r.index, r.dayOfWeek].filter((v) => v !== undefined).length === 1,
    { message: "DayRef must specify exactly one of name, index, dayOfWeek" },
  );
export type DayRef = z.infer<typeof DayRefSchema>;

/** Identify an exercise within a day by canonical id (preferred) or display name. */
export const ExerciseRefSchema = z
  .object({
    canonicalExerciseId: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
  })
  .refine((r) => r.canonicalExerciseId !== undefined || r.name !== undefined, {
    message: "ExerciseRef must specify canonicalExerciseId or name",
  });
export type ExerciseRef = z.infer<typeof ExerciseRefSchema>;

/** Address a slot by its stable slotId, or by (day + exercise) when the id is unknown. */
export const SlotRefSchema = z.union([
  z.object({ slotId: z.string().min(1) }),
  z.object({ day: DayRefSchema, exercise: ExerciseRefSchema }),
]);
export type SlotRef = z.infer<typeof SlotRefSchema>;

const EditOperationRawSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("replace_exercise"),
    slot: SlotRefSchema,
    newExerciseId: z.string().min(1),
    params: EditParamsSchema.optional(),
  }),
  z.object({
    op: z.literal("update_set_params"),
    slot: SlotRefSchema,
    params: EditParamsSchema,
  }),
  z.object({
    op: z.literal("remove_exercise"),
    slot: SlotRefSchema,
  }),
  z.object({
    op: z.literal("add_exercise"),
    day: DayRefSchema,
    canonicalExerciseId: z.string().min(1),
    exerciseType: z.enum(["lifting", "timed", "cardio"]),
    // The server generates the slotId; the model must NOT supply one.
    insertAfterSlotId: z.string().min(1).nullable().optional(),
    params: EditParamsSchema.optional(),
  }),
  z.object({
    op: z.literal("move_or_swap_days"),
    fromDay: DayRefSchema,
    toDay: DayRefSchema,
    mode: z.enum(["swap", "move"]),
  }),
  z.object({
    op: z.literal("reorder_within_day"),
    day: DayRefSchema,
    orderedSlots: z.array(SlotRefSchema).min(1),
  }),
  z.object({
    op: z.literal("rename_or_reschedule_day"),
    day: DayRefSchema,
    newName: z.string().min(1).optional(),
    newDayOfWeek: z.number().int().min(0).max(6).optional(),
  }),
  z.object({
    op: z.literal("apply_to_all_days"),
    fromExerciseId: z.string().min(1),
    toExerciseId: z.string().min(1),
    params: EditParamsSchema.optional(),
  }),
  // add_day is the ONLY op that creates a day not already in the schedule. Every
  // other op references an existing day; add_day names a brand-new one. The
  // server/client generate slotIds for the seeded exercises.
  z.object({
    op: z.literal("add_day"),
    name: z.string().min(1),
    dayOfWeek: z.number().int().min(0).max(6),
    exercises: z
      .array(
        z.object({
          canonicalExerciseId: z.string().min(1),
          exerciseType: z.enum(["lifting", "timed", "cardio"]),
          params: EditParamsSchema.optional(),
        }),
      )
      .min(1),
  }),
  // remove_day deletes a whole training day from the schedule. The subtractive
  // mirror of add_day — use this for "delete the arm day" / "cut to N days",
  // NEVER emit per-slot remove_exercise to eliminate an entire day.
  z.object({
    op: z.literal("remove_day"),
    day: DayRefSchema,
  }),
  // rename_program edits PROGRAM-level metadata (the displayed title, summary,
  // or block length). Distinct from rename_or_reschedule_day, which renames a DAY.
  z.object({
    op: z.literal("rename_program"),
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    durationWeeks: z.number().int().min(1).max(52).optional(),
  }),
  // set_deload configures the engine's deload weeks (which program weeks run at
  // reduced volume/intensity) — the ONLY correct way to express "make week 4 a
  // deload". NEVER permanently slash sets via update_set_params to fake a deload.
  z.object({
    op: z.literal("set_deload"),
    weekNumbers: z.array(z.number().int().min(1)).min(1),
    percent: z.number().min(0).max(1).optional(),
  }),
  // apply_params broadcasts the same set/rep/RIR/goalMode/priority change across
  // many slots in ONE op — the whole program, or one day when `day` is given.
  // Use for "make every exercise 4 sets" instead of N update_set_params.
  z.object({
    op: z.literal("apply_params"),
    day: DayRefSchema.optional(),
    params: EditParamsSchema,
  }),
]);

/** A single robust, semantically-addressed program edit operation. */
export const EditOperationSchema = EditOperationRawSchema.superRefine((val, ctx) => {
  if (val.op === "update_set_params" && !hasAnyEditParam(val.params)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "update_set_params requires at least one field in params",
      path: ["params"],
    });
  }
  if (
    val.op === "rename_or_reschedule_day" &&
    val.newName === undefined &&
    val.newDayOfWeek === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "rename_or_reschedule_day requires newName or newDayOfWeek",
      path: ["newName"],
    });
  }
  if (
    val.op === "rename_program" &&
    val.name === undefined &&
    val.description === undefined &&
    val.durationWeeks === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "rename_program requires name, description, or durationWeeks",
      path: ["name"],
    });
  }
  if (val.op === "apply_params" && !hasAnyEditParam(val.params)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "apply_params requires at least one field in params",
      path: ["params"],
    });
  }
});
export type EditOperation = z.infer<typeof EditOperationSchema>;

/**
 * @deprecated Legacy 5-op program-edit union (slotId-only addressing, no bounds
 * on the update fields). Replaced by {@link EditOperationSchema}. Kept exported
 * for one deprecation cycle so the server can accept old-format edits while the
 * client rolls over to the new union.
 */
export const LegacyProgramEditSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("replace_exercise"),
    slotId: z.string(),
    newExerciseId: z.string(),
  }),
  z.object({
    op: z.literal("update_sets"),
    slotId: z.string(),
    sets: z.number().int().min(1).max(10).optional(),
    reps: z.number().int().min(1).max(100).optional(),
    rir: z.number().int().min(0).max(5).optional(),
    durationSeconds: z.number().int().min(5).max(600).optional(),
    progressionMode: z.enum(["weight_first", "reps_first", "duration_first"]).optional(),
  }),
  z.object({ op: z.literal("remove_exercise"), slotId: z.string() }),
  z.object({
    op: z.literal("add_exercise"),
    dayOfWeek: z.number().int().min(0).max(6),
    newSlotId: z.string(),
    canonicalExerciseId: z.string(),
    exerciseType: z.enum(["lifting", "timed", "cardio"]).default("lifting"),
    sets: z.number().int().min(1).max(10).optional(),
    reps: z.number().int().min(1).max(100).optional(),
    rir: z.number().int().min(0).max(5).optional(),
    durationSeconds: z.number().int().min(5).optional(),
    targetDistanceKm: z.number().min(0).optional(),
    targetSpeedKmh: z.number().min(0).optional(),
    progressionMode: z.enum(["weight_first", "reps_first", "duration_first"]).optional(),
  }),
  z.object({
    op: z.literal("swap_days"),
    fromDayOfWeek: z.number().int().min(0).max(6),
    toDayOfWeek: z.number().int().min(0).max(6),
  }),
]);
export type LegacyProgramEdit = z.infer<typeof LegacyProgramEditSchema>;

/** Discriminated union of every Smart Builder turn the server can return. */
export const SmartBuilderResponseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("questions"),
    message: z.string().optional(),
    groups: z.array(AIQuestionGroupSchema).min(1),
  }),
  z.object({ type: z.literal("ready"), message: z.string() }),
  z.object({
    type: z.literal("program"),
    message: z.string().optional(),
    program: SlottedProgramSchema,
  }),
  z.object({
    type: z.literal("edits"),
    edits: z.array(EditOperationSchema),
    message: z.string(),
  }),
]);
export type SmartBuilderResponse = z.infer<typeof SmartBuilderResponseSchema>;

// ============================================================================
// User training context — the typed payload the Smart Builder agent reasons over
// ============================================================================
//
// Replaces the server's previous `userContext: z.record(string, unknown)` (which
// dropped every rich field on the floor). Both sides now agree on this shape:
// the client assembles it from local state; the server validates it and renders
// EVERY tier into the prompt. All weights are kg (display unit is a hint only).

/** Lightweight profile facts that shape program design. */
export const UserProfileContextSchema = z.object({
  experienceLevel: z.string().nullable().optional(),
  trainingPhase: z.string().nullable().optional(),
  trainingPhaseStartedAtMs: z.number().nullable().optional(),
  gender: z.string().nullable().optional(),
  // Derived age in years — never the raw date of birth.
  ageYears: z.number().int().min(0).max(120).nullable().optional(),
  bodyweightKg: z.number().min(0).max(WEIGHT_KG_MAX).nullable().optional(),
  displayUnit: z.enum(["kg", "lbs"]).optional(),
  // Progression preferences — how the user wants load/reps to advance. The
  // builder should respect these when setting starting prescriptions so the
  // program matches the increment cadence the runtime engine will apply.
  progressionIncrementKg: z.number().min(0).max(WEIGHT_KG_MAX).nullable().optional(),
  repIncrement: z.number().int().min(0).max(REPS_MAX).nullable().optional(),
  adaptiveProgression: z.boolean().optional(),
  defaultRir: z.number().int().min(0).max(RIR_MAX).nullable().optional(),
});
export type UserProfileContext = z.infer<typeof UserProfileContextSchema>;

/** Per-exercise strength + progression state, keyed by canonical exercise id. */
export const ExerciseStrengthStateSchema = z.object({
  canonicalExerciseId: z.string().min(1),
  exerciseName: z.string(),
  currentE1RMKg: z.number().min(0).max(WEIGHT_KG_MAX).nullable(),
  workingWeightKg: z.number().min(0).max(WEIGHT_KG_MAX).nullable().optional(),
  workingReps: z.number().int().min(0).max(REPS_MAX).nullable().optional(),
  adaptiveRateKgPerSession: z.number().nullable().optional(),
  lastLoggedAt: z.string().nullable().optional(),
  calibrationState: z.string().nullable().optional(),
  missStreak: z.number().int().min(0).nullable().optional(),
  isInPlateauDeload: z.boolean().optional(),
  plateauDeloadPercent: z.number().min(0).max(1).nullable().optional(),
  // The progression engine's most recent decision for this lift — its current
  // intent (progress | maintain | repeat | reduce | deload | calibrate). Lets the
  // program builder align with the runtime engine instead of re-deriving blind.
  lastDecision: z.string().nullable().optional(),
  // Terse human summary of that decision's target (e.g. "hold 100kg×5, +1 rep").
  lastDecisionSummary: z.string().max(200).nullable().optional(),
});
export type ExerciseStrengthState = z.infer<typeof ExerciseStrengthStateSchema>;

/** Summary of the user's currently-active program and their progress through it. */
export const ActiveProgramSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  durationWeeks: z.number().int().min(1).max(52),
  startDate: z.string().nullable().optional(),
  currentWeek: z.number().int().min(1).nullable().optional(),
  isDeloadWeek: z.boolean().optional(),
  completedSessionCount: z.number().int().min(0).nullable().optional(),
  days: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      name: z.string(),
      exerciseNames: z.array(z.string()),
    }),
  ),
});
export type ActiveProgramSummary = z.infer<typeof ActiveProgramSummarySchema>;

/** Per-exercise cardio personal bests / recency, keyed by canonical exercise id. */
export const CardioBaselineSummarySchema = z.object({
  canonicalExerciseId: z.string().min(1),
  exerciseName: z.string(),
  bestDurationSeconds: z.number().int().min(0).nullable().optional(),
  bestDistanceKm: z.number().min(0).max(DISTANCE_KM_MAX).nullable().optional(),
  bestPaceSecondsPerKm: z.number().min(0).nullable().optional(),
  lastDurationSeconds: z.number().int().min(0).nullable().optional(),
  lastUpdatedAt: z.string().nullable().optional(),
});
export type CardioBaselineSummary = z.infer<typeof CardioBaselineSummarySchema>;

/** Per-machine configuration the user has set at a gym. */
export const GymExerciseConfigSchema = z.object({
  canonicalExerciseId: z.string().min(1),
  name: z.string().optional(),
  baseWeightKg: z.number().min(0).max(WEIGHT_KG_MAX).nullable().optional(),
  weightUnit: z.string().optional(),
  weightMode: z.string().optional(),
  notes: z.string().nullable().optional(),
});
export type GymExerciseConfig = z.infer<typeof GymExerciseConfigSchema>;

/** The user's gym: how exercises are selected, available equipment, and gym-available exercise ids. */
export const GymContextSchema = z.object({
  exerciseSelectionMode: z.enum(["equipment_based", "exercise"]),
  // Equipment is sent as free strings (the app's EquipmentType enum is broader
  // than GYM_EQUIPMENT_TYPES); the server renders them, it does not gate on them.
  equipment: z.array(z.string()),
  equipmentIds: z.array(z.string()).optional(),
  gymExerciseConfigs: z.array(GymExerciseConfigSchema).optional(),
  gymAvailableExerciseIds: z.array(z.string()).optional(),
});
export type GymContext = z.infer<typeof GymContextSchema>;

/** An active injury/restriction the program must respect. */
export const InjuryContextSchema = z.object({
  muscleGroup: z.string(),
  description: z.string().max(500),
});
export type InjuryContext = z.infer<typeof InjuryContextSchema>;

/** A condensed completed-session summary used to convey recent training. */
export const WorkoutSummarySchema = z.object({
  date: z.string(),
  programDayName: z.string().nullable(),
  isFreestyle: z.boolean(),
  totalVolumeKg: z.number().min(0),
  durationMinutes: z.number().min(0).nullable().optional(),
  exercises: z.array(
    z.object({
      exerciseId: z.string(),
      exerciseName: z.string(),
      sets: z.number().int().min(0),
      topWeightKg: z.number().min(0).max(WEIGHT_KG_MAX).nullable().optional(),
      reps: z.number().int().min(0).max(REPS_MAX).nullable().optional(),
      // Per-working-set breakdown (weight × reps @ RIR). Conveys grind / effort
      // the top-set alone hides. Populated only for the most recent sessions to
      // keep the payload bounded; omitted for older sessions.
      setDetails: z
        .array(
          z.object({
            weightKg: z.number().min(0).max(WEIGHT_KG_MAX),
            reps: z.number().int().min(0).max(REPS_MAX),
            rir: z.number().int().min(0).max(RIR_MAX),
          }),
        )
        .optional(),
    }),
  ),
  muscleGroupsHit: z.array(z.string()).optional(),
});
export type WorkoutSummary = z.infer<typeof WorkoutSummarySchema>;

/** Recent readiness signal derived from questionnaire correlations. */
export const ReadinessContextSchema = z.object({
  score: z.number().int().min(0).max(100),
  confidence: z.number().min(0).max(1),
});
export type ReadinessContext = z.infer<typeof ReadinessContextSchema>;

/** One entry of the equipment-filtered exercise library the agent may choose from. */
export const ExerciseLibraryEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  category: z.string().nullable().optional(),
  subcategory: z.string().nullable().optional(),
  primaryMuscleGroups: z.array(z.string()).optional(),
  secondaryMuscleGroups: z.array(z.string()).optional(),
  equipmentType: z.string().nullable().optional(),
  isBodyweight: z.boolean().optional(),
  isUnilateral: z.boolean().optional(),
  trackingMode: z.string().optional(),
  requiredEquipment: z.array(z.string()).optional(),
});
export type ExerciseLibraryEntry = z.infer<typeof ExerciseLibraryEntrySchema>;

/**
 * The user's explicitly-configured training goals/targets. Distinct from the
 * implicit `trainingPhase` enum — these are concrete numbers the user set, so
 * the builder can size weekly volume and cardio to what the user is aiming for.
 */
export const TrainingGoalsContextSchema = z.object({
  // Per-muscle-group weekly hard-set targets, e.g. [{ muscleGroup: "chest", weeklySets: 12 }].
  volumeTargets: z
    .array(
      z.object({
        muscleGroup: z.string(),
        weeklySets: z.number().min(0).max(100),
      }),
    )
    .optional(),
  // Named cardio goal preset (e.g. "general_fitness", "endurance", "none").
  cardioGoalPreset: z.string().nullable().optional(),
  // Weekly zone-minute cardio targets (heart-rate zones 1–4).
  cardioWeeklyZoneMinutes: z
    .object({
      z1: z.number().min(0),
      z2: z.number().min(0),
      z3: z.number().min(0),
      z4: z.number().min(0),
    })
    .nullable()
    .optional(),
});
export type TrainingGoalsContext = z.infer<typeof TrainingGoalsContextSchema>;

/** The complete, typed context the Smart Builder agent reasons over. */
export const UserTrainingContextSchema = z.object({
  profile: UserProfileContextSchema,
  exerciseStrengthStates: z.array(ExerciseStrengthStateSchema).max(50),
  recentWorkouts: z.array(WorkoutSummarySchema).max(20),
  activeProgram: ActiveProgramSummarySchema.nullable().optional(),
  readiness: ReadinessContextSchema.nullable().optional(),
  injuries: z.array(InjuryContextSchema),
  gym: GymContextSchema,
  cardioBaselines: z.array(CardioBaselineSummarySchema),
  exerciseLibrary: z.array(ExerciseLibraryEntrySchema),
  // Explicit user-configured goals/targets (volume + cardio). Optional so the
  // payload stays backward-compatible when the user has set no targets.
  goals: TrainingGoalsContextSchema.nullable().optional(),
});
export type UserTrainingContext = z.infer<typeof UserTrainingContextSchema>;

// ============================================================================
// Smart Builder request envelope (converse | generate | refine)
// ============================================================================

/** Which program a refine targets: a saved program by id, the in-flight draft, or a brand-new program. */
export const ProgramRefSchema = z.union([
  z.object({ id: z.string().min(1) }),
  z.object({ draft: z.literal(true) }),
  z.object({}),
]);
export type ProgramRef = z.infer<typeof ProgramRefSchema>;

/** One conversational turn between the user and the Smart Builder agent. */
export const ConversationMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});
export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;

/**
 * Unified Smart Builder request. `userContext` is now the fully-typed
 * {@link UserTrainingContextSchema} (was `z.record(string, unknown)`).
 * `currentProgram` carries the slotted program being refined (a draft, or a
 * saved program projected into slotted form) when `action === "refine"` and the
 * server cannot resolve it from `programRef.id`.
 */
export const SmartBuilderRequestSchema = z.object({
  action: z.enum(["converse", "generate", "refine"]),
  conversationHistory: z.array(ConversationMessageSchema).max(50),
  userContext: UserTrainingContextSchema,
  programRef: ProgramRefSchema.optional(),
  currentProgram: SlottedProgramSchema.optional(),
});
export type SmartBuilderRequest = z.infer<typeof SmartBuilderRequestSchema>;

// ============================================================================
// Exercise matching
// ============================================================================

export const ExerciseMatchSchema = z.object({
  freestyleName: z.string(),
  canonicalExerciseId: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  suggestedCategory: z.string().nullable(),
  suggestedMuscleGroups: z.array(z.string()),
  suggestedEquipmentType: z.string().nullable(),
});

export const MatchExercisesResponseSchema = z.object({
  matches: z.array(ExerciseMatchSchema),
});
export type MatchExercisesResponse = z.infer<typeof MatchExercisesResponseSchema>;

// ============================================================================
// Equipment recognition (photo)
// ============================================================================

export const RecognizeEquipmentResponseSchema = z.object({
  equipmentType: z.enum(RECOGNIZE_EQUIPMENT_TYPES),
  suggestedExerciseName: z.string(),
  confidence: z.number().min(0).max(1),
  clarifyingQuestions: z.array(z.string()),
});
export type RecognizeEquipmentResponse = z.infer<typeof RecognizeEquipmentResponseSchema>;

// ============================================================================
// Exercise muscle tagging (admin/dev pipeline)
// ============================================================================

export const TagExerciseMusclesResponseSchema = z.object({
  tags: z.array(
    z.object({
      name: z.string(),
      // Canonical MuscleGroup enum — the same single source of truth used by
      // domain/muscles and the Workouts injuries route.
      muscleGroups: z.array(MuscleGroupSchema).min(1),
    }),
  ),
});
export type TagExerciseMusclesResponse = z.infer<typeof TagExerciseMusclesResponseSchema>;

// ============================================================================
// Gym setup wizard
// ============================================================================

const GymSetupEquipmentResultSchema = z.object({
  type: z.enum(GYM_EQUIPMENT_TYPES),
  // `variant` is intentionally a free string (descriptive, optional, and the
  // canonical variant list is non-exhaustive in practice); the producing prompt
  // still constrains it and consumers map unknown variants leniently.
  variant: z.string().optional(),
  weightStackKg: z.number().min(0).optional(),
  incrementKg: z.number().min(0).optional(),
  count: z.number().int().min(1).default(1),
  notes: z.string().optional(),
});

const GymSetupQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  type: z.enum(["chips", "slider", "toggle", "text", "multi_chips"]),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  placeholder: z.string().optional(),
});

const GymSetupQuestionGroupSchema = z.object({
  topic: z.string(),
  questions: z.array(GymSetupQuestionSchema).min(1),
});

export const GymSetupResponseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("questions"),
    message: z.string().optional(),
    groups: z.array(GymSetupQuestionGroupSchema).min(1),
  }),
  z.object({
    type: z.literal("confirm"),
    message: z.string(),
    equipment: z.array(GymSetupEquipmentResultSchema),
  }),
  z.object({
    type: z.literal("update"),
    message: z.string().optional(),
    equipment: z.array(GymSetupEquipmentResultSchema),
    groups: z.array(GymSetupQuestionGroupSchema).optional(),
  }),
]);
export type GymSetupResponse = z.infer<typeof GymSetupResponseSchema>;

// ============================================================================
// Prescription narration
// ============================================================================

export const PrescriptionNarrationRequestSchema = z.object({
  exerciseName: z.string(),
  dropSteps: z.array(PrescriptionDropStepSchema),
  action: PrescriptionActionSchema,
  targetSummary: z.string(),
  displayUnit: z.enum(["kg", "lbs"]),
});
export type PrescriptionNarrationRequest = z.infer<typeof PrescriptionNarrationRequestSchema>;

export const PrescriptionNarrationResponseSchema = z.object({
  shortReason: z.string().min(1),
  fullNarration: z.string().min(1),
  confidence: z.enum(["low", "medium", "high"]),
});
export type PrescriptionNarrationResponse = z.infer<typeof PrescriptionNarrationResponseSchema>;

// ============================================================================
// Set-signal tiebreaker
// ============================================================================

export const SetSignalTiebreakerRequestSchema = z.object({
  exerciseName: z.string(),
  targetWeightKg: z.number().nullable(),
  targetReps: z.number().int().nullable(),
  targetRIR: z.number().nullable(),
  actualWeightKg: z.number().nullable(),
  actualReps: z.number().int(),
  actualRir: z.number().nullable(),
  historicalMaxWeightKg: z.number().nullable(),
  ambiguityReason: z.string().nullable(),
});
export type SetSignalTiebreakerRequest = z.infer<typeof SetSignalTiebreakerRequestSchema>;

export const SetSignalTiebreakerResponseSchema = AiSetSignalOverrideSchema;
export type SetSignalTiebreakerResponse = z.infer<typeof SetSignalTiebreakerResponseSchema>;

// ============================================================================
// Cross-modal context driver
// ============================================================================

export const CrossModalContextRequestSchema = z.object({
  exerciseName: z.string(),
  acuteCardioLoadRatio: z.number().nullable(),
  suggestedGoEasierPercent: z.number().nullable(),
  trainingPhase: z.string().nullable(),
  recentSessionSummary: z.string().nullable(),
});
export type CrossModalContextRequest = z.infer<typeof CrossModalContextRequestSchema>;

export const CrossModalContextResponseSchema = AiContextDriverInputSchema;
export type CrossModalContextResponse = z.infer<typeof CrossModalContextResponseSchema>;

// ============================================================================
// NEW ADDITIONS for alpha.29
// ============================================================================
import { EquipmentTypeSchema } from '../domain/equipment.js';

// --- RecognizeEquipmentBodySchema ---
export const RecognizeEquipmentBodySchema = z.object({
  imageBase64: z.string().min(1),
  userDescription: z.string().max(200).optional(),
});
export type RecognizeEquipmentBody = z.infer<typeof RecognizeEquipmentBodySchema>;

// --- MatchExercisesBodySchema ---
export const ExerciseSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  primaryMuscleGroups: z.array(z.string()),
  equipmentType: z.string(),
});
export type ExerciseSummary = z.infer<typeof ExerciseSummarySchema>;

export const MatchExercisesBodySchema = z.object({
  freestyleNames: z.array(z.string().min(1).max(200)).min(1).max(20),
  availableExercises: z.array(ExerciseSummarySchema).max(2500),
});
export type MatchExercisesBody = z.infer<typeof MatchExercisesBodySchema>;

// --- GymSetupChatBodySchema ---
// Note: no .min(1) on content (differs from SmartBuilder ConversationMessageSchema)
const GymSetupConversationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(4000),
});
export type GymSetupConversationMessage = z.infer<typeof GymSetupConversationMessageSchema>;

export const GymSetupChatBodySchema = z.object({
  conversationHistory: z.array(GymSetupConversationMessageSchema).max(50),
  currentEquipment: z.array(z.record(z.string(), z.unknown())).max(500),
  gymName: z.string().optional(),
});
export type GymSetupChatBody = z.infer<typeof GymSetupChatBodySchema>;

// --- TagExerciseMusclesBodySchema ---
export const TagExerciseMusclesBodySchema = z.object({
  exerciseNames: z.array(z.string().min(1)).min(1).max(100),
});
export type TagExerciseMusclesBody = z.infer<typeof TagExerciseMusclesBodySchema>;

// --- ExerciseSearchSemanticScoresBodySchema + ResponseSchema ---
export const SemanticScoreExerciseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  searchText: z.string().min(1).max(2000).optional(),
});
export type SemanticScoreExercise = z.infer<typeof SemanticScoreExerciseSchema>;

export const ExerciseSearchSemanticScoresBodySchema = z.object({
  query: z.string().trim().min(1).max(200),
  exercises: z.array(SemanticScoreExerciseSchema).min(1).max(150),
});
export type ExerciseSearchSemanticScoresBody = z.infer<typeof ExerciseSearchSemanticScoresBodySchema>;

export const ExerciseSearchSemanticScoresResponseSchema = z.object({
  scoresByExerciseId: z.record(z.string(), z.number().min(0).max(1)),
});
export type ExerciseSearchSemanticScoresResponse = z.infer<typeof ExerciseSearchSemanticScoresResponseSchema>;

// --- LogWorkoutAudioBodySchema + ResponseV2Schema ---
export const LoggedSetContextSchema = z.object({
  setIndex: z.number().int().min(0),
  weightKg: z.number().nullable(),
  reps: z.number().int().nullable(),
  rir: z.number().int().nullable(),
  durationSeconds: z.number().int().nullable(),
  isConfirmed: z.boolean(),
  isWarmup: z.boolean(),
});
export type LoggedSetContext = z.infer<typeof LoggedSetContextSchema>;

export const AudioExerciseContextSchema = z.object({
  exerciseIndex: z.number().int().min(0),
  exerciseName: z.string().trim().min(1),
  canonicalExerciseId: z.string().nullable(),
  trackingMode: z.enum(['reps', 'timed', 'cardio', 'stretch']),
  targetSetCount: z.number().int().min(0),
  isActive: z.boolean().optional(),
  loggedSets: z.array(LoggedSetContextSchema).optional(),
});
export type AudioExerciseContext = z.infer<typeof AudioExerciseContextSchema>;

export const LogWorkoutAudioBodySchema = z.object({
  audioBase64: z.string().min(1),
  mimeType: z.enum(['audio/m4a', 'audio/mp4', 'audio/wav', 'audio/webm']),
  defaultWeightUnit: z.enum(['kg', 'lbs']),
  hideRirControls: z.boolean().optional(),
  exercises: z.array(AudioExerciseContextSchema).max(30),
});
export type LogWorkoutAudioBody = z.infer<typeof LogWorkoutAudioBodySchema>;

// V2 protocol only (canonical forward shape). V1 legacy envelope stays local to server.
// VoiceLogOperationSchema is already exported from this file.
export const LogWorkoutAudioResponseV2Schema = z.object({
  summary: z.string().min(1),
  transcript: z.string().default(''),
  operations: z.array(VoiceLogOperationSchema).max(50),
  unmatched: z.array(z.string()).max(20),
});
export type LogWorkoutAudioResponseV2 = z.infer<typeof LogWorkoutAudioResponseV2Schema>;

// --- BuildExerciseProfileBodySchema + ResponseSchema ---
// category = top-level routing mode (weightlifting|cardio|stretching)
// trackingMode = fine-grained set-logging mode (reps|timed|cardio|stretch)
// Named ExerciseTopLevelCategory/ExerciseFineGrainedMode to avoid collision
// with contracts ExerciseCategorySchema (Health-app vocabulary).
export const ExerciseTopLevelCategorySchema = z.enum(['weightlifting', 'cardio', 'stretching']);
export type ExerciseTopLevelCategory = z.infer<typeof ExerciseTopLevelCategorySchema>;

export const ExerciseFineGrainedModeSchema = z.enum(['reps', 'timed', 'cardio', 'stretch']);
export type ExerciseFineGrainedMode = z.infer<typeof ExerciseFineGrainedModeSchema>;

export const BuildExerciseProfileBodySchema = z.object({
  exerciseName: z.string().trim().min(1).max(200),
  hint: z.string().max(200).optional(),
});
export type BuildExerciseProfileBody = z.infer<typeof BuildExerciseProfileBodySchema>;

export const BuildExerciseProfileResponseSchema = z.object({
  category: ExerciseTopLevelCategorySchema,
  trackingMode: ExerciseFineGrainedModeSchema,
  primaryMuscleGroups: z.array(MuscleGroupSchema).min(1),
  secondaryMuscleGroups: z.array(MuscleGroupSchema),
  equipmentType: EquipmentTypeSchema,
});
export type BuildExerciseProfileResponse = z.infer<typeof BuildExerciseProfileResponseSchema>;

// --- SmartReaderUsageResponseSchema ---
export const SmartReaderUsageResponseSchema = z.object({
  used: z.number().int().min(0),
  limit: z.number().int().min(0),
  remaining: z.number().int().min(0),
});
export type SmartReaderUsageResponse = z.infer<typeof SmartReaderUsageResponseSchema>;

// ============================================================================
// Smart notifications — preview/send wire contract
// ============================================================================

export const SmartNotificationChannelSchema = z.enum([
  "pre_lift",
  "rest_day_pulse",
  "post_workout_recap",
  "missed_slot",
  "weekly_review",
]);
export type SmartNotificationChannel = z.infer<typeof SmartNotificationChannelSchema>;

const SmartNotificationRecentSessionSchema = z.object({
  id: z.string(),
  date: z.string(),
  programDayName: z.string().nullable(),
  durationMinutes: z.number(),
  totalVolumeKg: z.number(),
  exerciseCount: z.number(),
  isFreestyle: z.boolean(),
  isSubstitution: z.boolean(),
  topExercises: z.array(z.string()).max(5),
});

const SmartNotificationProgramTodaySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isTrainingDay: z.boolean(),
  dayName: z.string().nullable(),
  exerciseCount: z.number().int().min(0),
  setCount: z.number().int().min(0),
  topExercises: z.array(z.string()).max(6),
  progressionModes: z.array(z.string()).max(4),
});

const SmartNotificationActiveProgramSchema = z.object({
  id: z.string(),
  name: z.string(),
  weekIndex: z.number().int().min(1),
  daysPerWeek: z.number().int().min(0),
  today: SmartNotificationProgramTodaySchema,
  nextTrainingDay: z
    .object({
      dayOfWeek: z.number().int().min(0).max(6),
      dayName: z.string(),
    })
    .nullable(),
});

const SmartNotificationAnalyticsSummarySchema = z.object({
  week: z.object({
    sessions: z.number().int().min(0),
    volumeKg: z.number().min(0),
    durationMinutes: z.number().min(0),
    substitutions: z.number().int().min(0),
    freestyle: z.number().int().min(0),
  }),
  month: z.object({
    sessions: z.number().int().min(0),
    volumeKg: z.number().min(0),
    trend: z.enum(["up", "down", "flat", "unknown"]),
  }),
});

const SmartNotificationProgressionSummarySchema = z.object({
  trainingPhase: z.string().nullable(),
  trainingGoal: z.string().nullable(),
  activeModes: z.array(z.string()).max(4),
  watchlist: z
    .array(
      z.object({
        exerciseId: z.string(),
        currentE1RMKg: z.number().nullable(),
        missStreak: z.number().int().nullable(),
        plateauDeloadUntil: z.string().nullable(),
      }),
    )
    .max(6),
  recentMetricSignals: z
    .array(
      z.object({
        exerciseId: z.string(),
        capturedAt: z.string(),
        hasGatedE1RM: z.boolean(),
        hasBestQualifyingSet: z.boolean(),
      }),
    )
    .max(8),
});

export const SmartNotificationSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  channel: SmartNotificationChannelSchema,
  generatedAt: z.string(),
  localDate: z.string(),
  localHour: z.number().int().min(0).max(23),
  timeZone: z.string(),
  freshness: z.object({
    latestSessionAt: z.string().nullable(),
    latestProfileUpdateAt: z.string().nullable(),
    latestServerDataAt: z.string().nullable(),
    isFreshEnoughForSpecificClaims: z.boolean(),
    reason: z.string(),
  }),
  user: z.object({
    displayName: z.string().nullable(),
    weightUnit: z.string(),
    distanceUnit: z.string(),
  }),
  activeProgram: SmartNotificationActiveProgramSchema.nullable(),
  recentSessions: z.array(SmartNotificationRecentSessionSchema).max(8),
  analytics: SmartNotificationAnalyticsSummarySchema,
  progression: SmartNotificationProgressionSummarySchema,
});
export type SmartNotificationSnapshot = z.infer<typeof SmartNotificationSnapshotSchema>;

export const SmartNotificationCopySchema = z.object({
  title: z.string().trim().min(1).max(40),
  body: z.string().trim().min(1).max(140),
});
export type SmartNotificationCopy = z.infer<typeof SmartNotificationCopySchema>;

export const SmartNotificationCopySourceSchema = z.enum(["ai", "fallback"]);
export type SmartNotificationCopySource = z.infer<typeof SmartNotificationCopySourceSchema>;

export const SmartNotificationPreviewRequestSchema = z.object({
  channel: SmartNotificationChannelSchema,
  referenceDateIso: z.string().datetime().optional(),
});
export type SmartNotificationPreviewRequest = z.infer<
  typeof SmartNotificationPreviewRequestSchema
>;

export const SmartNotificationSendRequestSchema = SmartNotificationPreviewRequestSchema.extend({
  dryRun: z.boolean().optional().default(false),
});
export type SmartNotificationSendRequest = z.infer<typeof SmartNotificationSendRequestSchema>;

export const SmartNotificationPreviewResponseSchema = z.object({
  snapshot: SmartNotificationSnapshotSchema,
  notification: SmartNotificationCopySchema,
  source: SmartNotificationCopySourceSchema,
});
export type SmartNotificationPreviewResponse = z.infer<
  typeof SmartNotificationPreviewResponseSchema
>;

export const SmartNotificationSendResponseSchema =
  SmartNotificationPreviewResponseSchema.extend({
    delivery: z.object({
      status: z.enum(["sent", "skipped", "failed"]),
      reason: z.string().optional(),
      providerMessageId: z.string().optional(),
    }),
  });
export type SmartNotificationSendResponse = z.infer<
  typeof SmartNotificationSendResponseSchema
>;
