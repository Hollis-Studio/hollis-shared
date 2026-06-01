import { z } from "zod";

export const ProgressionCalibrationStateSchema = z.enum([
  "no_data",
  "calibrating",
  "provisional",
  "stable",
]);

export const PrescriptionActionSchema = z.enum([
  "calibrate",
  "repeat",
  "progress",
  "reduce",
  "deload",
  "maintain",
]);

export const PrescriptionDriverSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  category: z.enum([
    "performance",
    "effort",
    "fatigue",
    "consistency",
    "cardio",
    "context",
    "equipment",
  ]),
  direction: z.enum(["up", "down", "neutral"]),
  weight: z.number().min(0).max(1),
  contributionPct: z.number().min(-1).max(1),
  confidence: z.enum(["low", "medium", "high"]),
  reason: z.string().min(1),
  tooltip: z.string().min(1),
});

export const PrescriptionDecisionSchema = z.object({
  action: PrescriptionActionSchema,
  confidence: z.enum(["low", "medium", "high"]),
  targetSummary: z.string().min(1),
  drivers: z.array(PrescriptionDriverSchema),
  generatedAt: z.coerce.date(),
  schemaVersion: z.number().int().min(1),
});

export const ProgressionEngineStateSchema = z.object({
  calibrationState: ProgressionCalibrationStateSchema,
  rawBaselineKg: z.number().min(0).nullable(),
  capacityEstimateKg: z.number().min(0).nullable(),
  trainingMaxKg: z.number().min(0).nullable(),
  uncertaintyPct: z.number().min(0).max(1).nullable(),
  distinctSessionCount: z.number().int().min(0),
  lastDecision: PrescriptionDecisionSchema.optional(),
  schemaVersion: z.number().int().min(1),
});

export type ProgressionCalibrationState = z.infer<
  typeof ProgressionCalibrationStateSchema
>;
export type PrescriptionAction = z.infer<typeof PrescriptionActionSchema>;
export type PrescriptionDriver = z.infer<typeof PrescriptionDriverSchema>;
export type PrescriptionDecision = z.infer<typeof PrescriptionDecisionSchema>;
export type ProgressionEngineState = z.infer<
  typeof ProgressionEngineStateSchema
>;
