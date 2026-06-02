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

const ProgramEditSchema = z.discriminatedUnion("op", [
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
    edits: z.array(ProgramEditSchema),
    message: z.string(),
  }),
]);
export type SmartBuilderResponse = z.infer<typeof SmartBuilderResponseSchema>;

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
