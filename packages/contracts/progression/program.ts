import { z } from "zod";

export const SetTypeSchema = z.enum(["normal", "warmup", "drop_set", "rest_pause", "superset"]);
export type SetType = z.infer<typeof SetTypeSchema>;

export const ProgressionModeSchema = z.enum(["weight_first", "reps_first", "duration_first"]);
export type ProgressionMode = z.infer<typeof ProgressionModeSchema>;

export const ExerciseGoalModeSchema = z.enum(["progress", "maintain", "track_only"]);
export type ExerciseGoalMode = z.infer<typeof ExerciseGoalModeSchema>;

export const ProgramTypeSchema = z.enum(["linear", "mesocycle", "custom"]);
export type ProgramType = z.infer<typeof ProgramTypeSchema>;

export const ProgramSetSchema = z.object({
  setNumber: z.number().int().min(1),
  targetWeightKg: z.number().min(0).nullable(),
  targetReps: z.number().int().min(0),
  targetDurationSeconds: z.number().int().min(1).nullable().optional(),
  targetRIR: z.number().int().min(0).max(10),
  isWarmup: z.boolean(),
  setType: SetTypeSchema.default("normal"),
  setGroupId: z.string().nullable().optional(),
  originExerciseId: z.string().nullable().optional(),
});

export const CardioTargetsSchema = z.object({
  targetDurationSeconds: z.number().min(1).nullable(),
  targetDistanceKm: z.number().min(0).nullable(),
  targetSpeedKmh: z.number().min(0).nullable(),
  targetIncline: z.number().min(0).max(40).nullable(),
  targetResistance: z.number().min(0).nullable(),
  // Machine-specific progression targets (stairmaster floors, jump-rope jumps).
  // Default null so programs authored before alpha.40 parse forward unchanged.
  targetFloors: z.number().min(0).nullable().default(null),
  targetSteps: z.number().min(0).nullable().default(null),
  targetJumps: z.number().min(0).nullable().default(null),
});

export const MaintenanceTargetSchema = z.object({
  weightKg: z.number().min(0),
  reps: z.number().int().min(1),
});

export const ProgramExerciseSchema = z
  .object({
    canonicalExerciseId: z.string().min(1),
    order: z.number().int().min(0),
    sets: z.array(ProgramSetSchema),
    goalMode: ExerciseGoalModeSchema.optional(),
    useSmartProgress: z.boolean().optional(),
    progressionMode: ProgressionModeSchema,
    repThresholdForWeightJump: z.number().int().min(1).nullable(),
    cardioTargets: CardioTargetsSchema.nullable().default(null),
    maintenanceTarget: MaintenanceTargetSchema.nullable().default(null),
    cardioMaintenanceTarget: CardioTargetsSchema.nullable().default(null),
    priorityLevel: z.enum(["primary", "secondary", "supporting"]).optional(),
  })
  .transform((data) => {
    const goalMode = data.goalMode ?? (data.useSmartProgress === false ? "track_only" : "progress");
    const { useSmartProgress: _, ...rest } = data;
    return { ...rest, goalMode } as const;
  });

export const ProgramDaySchema = z.object({
  dayOfWeek: z.number().int().min(-1).max(6),
  name: z.string().min(1),
  exercises: z.array(ProgramExerciseSchema).min(1),
});

export const ProgramSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  type: ProgramTypeSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  durationWeeks: z.number().int().min(1),
  isActive: z.boolean(),
  deloadWeekNumbers: z.array(z.number().int().min(1)),
  deloadPercent: z.number().min(0).max(1),
  schedule: z.array(ProgramDaySchema).min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  schemaVersion: z.number().optional(),
});

export type CardioTargets = z.infer<typeof CardioTargetsSchema>;
export type MaintenanceTarget = z.infer<typeof MaintenanceTargetSchema>;
export type ProgramSet = z.infer<typeof ProgramSetSchema>;
export type ProgramExercise = z.infer<typeof ProgramExerciseSchema>;
export type ProgramDay = z.infer<typeof ProgramDaySchema>;
export type Program = z.infer<typeof ProgramSchema>;
