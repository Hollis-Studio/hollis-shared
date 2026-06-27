import { z } from "zod";

import { ProgressionEngineStateSchema } from "./engine.js";

export const BaselineEntrySchema = z.object({
  sessionId: z.string().min(1),
  date: z.coerce.date(),
  weightKg: z.number().min(0),
  reps: z.number().int().min(0),
  rir: z.number().int().min(0).max(10),
  e1rm: z.number().min(0),
  e1rmFormula: z.enum(["epley", "wathan"]),
  isOutlier: z.boolean(),
  goEasier: z.boolean(),
  sessionMix: z
    .object({ s: z.number(), h: z.number(), e: z.number() })
    .optional(),
  isMiss: z.boolean().optional(),
});

export const ProgressionBaselineSchema = z.object({
  canonicalExerciseId: z.string().min(1),
  userId: z.string(),
  currentE1RM_Kg: z.number().min(0),
  topSetWeightKg: z.number().min(0),
  topSetReps: z.number().int().min(0),
  topSetRIR: z.number().int().min(0).max(10),
  lastUpdated: z.coerce.date(),
  history: z.array(BaselineEntrySchema),
  engineState: ProgressionEngineStateSchema.optional(),
  phaseExitE1RM_Kg: z.number().min(0).nullable().optional(),
  phaseExitDate: z.number().int().min(0).nullable().optional(),
  classMix: z
    .object({ s: z.number(), h: z.number(), e: z.number() })
    .optional(),
  trendE1RM_Kg: z.number().min(0).optional(),
  trendTopSetWeightKg: z.number().min(0).optional(),
  trendTopSetReps: z.number().int().min(0).optional(),
  trendTopSetRIR: z.number().int().min(0).max(10).optional(),
  missStreak: z.number().int().min(0).optional(),
  autoDeloadPercent: z
    .union([z.literal(0), z.literal(0.05), z.literal(0.1)])
    .optional(),
  plateauDeloadUntil: z.coerce.date().nullable().optional(),
  plateauDeloadReductionPercent: z.number().min(0).max(0.99).optional(),
  lastPlateauAlertedAt: z.coerce.date().nullable().optional(),
  schemaVersion: z.number().nullish(),
});

export const CardioBaselineEntrySchema = z.object({
  sessionId: z.string().min(1),
  date: z.coerce.date(),
  durationSeconds: z.number().min(1),
  distanceKm: z.number().min(0).nullable(),
  avgSpeedKmh: z.number().min(0).nullable(),
  paceSecondsPerKm: z.number().min(0).nullable(),
  avgHeartRate: z.number().int().min(30).max(250).nullable(),
  incline: z.number().min(0).nullable(),
  resistance: z.number().min(0).nullable(),
  mets: z.number().min(0).nullable().default(null),
  // Machine-specific metrics for modality-profiled progression (default null so
  // pre-alpha.39 history entries parse forward).
  floors: z.number().min(0).nullable().default(null),
  jumps: z.number().min(0).nullable().default(null),
  steps: z.number().min(0).nullable().default(null),
  isOutlier: z.boolean(),
  goEasier: z.boolean(),
});

export const CardioBaselineSchema = z.object({
  canonicalExerciseId: z.string().min(1),
  userId: z.string(),
  bestDurationSeconds: z.number().min(0),
  bestDistanceKm: z.number().min(0).nullable(),
  bestPaceSecondsPerKm: z.number().min(0).nullable(),
  bestMETs: z.number().min(0).nullable().default(null),
  // Machine-specific PR ratchets (higher is better). Default null so existing
  // baselines parse forward without these fields.
  bestFloors: z.number().min(0).nullable().default(null),
  bestJumps: z.number().min(0).nullable().default(null),
  bestSteps: z.number().min(0).nullable().default(null),
  lowestHRAtPace: z.number().int().min(30).max(250).nullable(),
  lastDurationSeconds: z.number().min(0),
  lastDistanceKm: z.number().min(0).nullable(),
  lastAvgSpeedKmh: z.number().min(0).nullable(),
  lastPaceSecondsPerKm: z.number().min(0).nullable(),
  lastIncline: z.number().min(0).nullable(),
  lastResistance: z.number().min(0).nullable(),
  lastAvgHeartRate: z.number().int().min(30).max(250).nullable(),
  lastFloors: z.number().min(0).nullable().default(null),
  lastJumps: z.number().min(0).nullable().default(null),
  lastSteps: z.number().min(0).nullable().default(null),
  lastUpdated: z.coerce.date(),
  history: z.array(CardioBaselineEntrySchema),
  engineState: ProgressionEngineStateSchema.optional(),
});

export type BaselineEntry = z.infer<typeof BaselineEntrySchema>;
export type ProgressionBaseline = z.infer<typeof ProgressionBaselineSchema>;
export type CardioBaselineEntry = z.infer<typeof CardioBaselineEntrySchema>;
export type CardioBaseline = z.infer<typeof CardioBaselineSchema>;
