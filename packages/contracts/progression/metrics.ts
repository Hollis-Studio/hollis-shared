import { z } from "zod";

import { MuscleGroupSchema } from "../domain/muscles.js";

export const MetricGateRejectReasonSchema = z.enum([
  "reps_out_of_range",
  "rir_too_high",
  "rir_missing",
  "insufficient_qualifying_sets",
]);

export const GatedE1RMSampleSchema = z.object({
  exerciseId: z.string().min(1),
  sessionId: z.string().min(1),
  setIndex: z.number().int().min(0),
  weightKg: z.number().min(0),
  reps: z.number().int().min(0),
  rir: z.number().min(0).max(10),
  e1rmKg: z.number().min(0),
  recordedAt: z.coerce.date(),
  qualifying: z.boolean(),
  gateReason: MetricGateRejectReasonSchema.optional(),
});

export const BestQualifyingSetSchema = z.object({
  exerciseId: z.string().min(1),
  windowDays: z.number().int().min(1),
  weightKg: z.number().min(0),
  reps: z.number().int().min(0),
  rir: z.number().min(0).max(10),
  sessionId: z.string().min(1),
  setIndex: z.number().int().min(0),
  recordedAt: z.coerce.date(),
  e1rmKg: z.number().min(0),
});

export const WeeklyHardSetsEntrySchema = z.object({
  muscleGroup: MuscleGroupSchema,
  weekStart: z.coerce.date(),
  hardSetCount: z.number().int().min(0),
  totalSetCount: z.number().int().min(0),
});

export const RelativeStrengthScoreSchema = z.object({
  exerciseId: z.string().min(1),
  recordedAt: z.coerce.date(),
  e1rmKg: z.number().min(0),
  bodyWeightKg: z.number().min(0),
  score: z.number().min(0),
  bodyWeightSourceAgeDays: z.number().min(0),
});

export const RepRangePivotSchema = z.object({
  exerciseId: z.string().min(1),
  detectedAt: z.coerce.date(),
  priorMedianReps: z.number().min(0),
  currentMedianReps: z.number().min(0),
  deltaReps: z.number(),
  windowDays: z.literal(28),
  acknowledged: z.boolean(),
});

export const ConfidenceBandSchema = z.object({
  value: z.number(),
  lowerKg: z.number(),
  upperKg: z.number(),
  sampleCount: z.number().int().min(0),
  widthKg: z.number().min(0),
});

export const MetricBasketSnapshotSchema = z.object({
  exerciseId: z.string().min(1),
  capturedAt: z.coerce.date().optional(),
  e1rmGated: z
    .object({
      current: z.number().min(0),
      band: ConfidenceBandSchema,
      samples: z.number().int().min(0),
    })
    .nullable()
    .optional(),
  bestQualifyingSet: BestQualifyingSetSchema.nullable().optional(),
  relativeStrengthScore: RelativeStrengthScoreSchema.nullable().optional(),
  repRangePivot: RepRangePivotSchema.nullable().optional(),
});

export type GatedE1RMSample = z.infer<typeof GatedE1RMSampleSchema>;
export type BestQualifyingSet = z.infer<typeof BestQualifyingSetSchema>;
export type WeeklyHardSetsEntry = z.infer<typeof WeeklyHardSetsEntrySchema>;
export type RelativeStrengthScore = z.infer<typeof RelativeStrengthScoreSchema>;
export type RepRangePivot = z.infer<typeof RepRangePivotSchema>;
export type ConfidenceBand = z.infer<typeof ConfidenceBandSchema>;
export type MetricBasketSnapshot = z.infer<typeof MetricBasketSnapshotSchema>;
