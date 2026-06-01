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

/**
 * Lifecycle of a single prescription record (the prescription feedback loop).
 * - `active`     — currently prescribed; the session it belongs to is not yet resolved.
 * - `completed`  — the session finished and an outcome was recorded.
 * - `abandoned`  — the session was never completed and a later session's
 *                  prescription has superseded it.
 * - `superseded` — re-generated within the same session before completion
 *                  (e.g. the plan was regenerated), so this record is stale.
 */
export const PrescriptionStatusSchema = z.enum([
  "active",
  "completed",
  "abandoned",
  "superseded",
]);

/** Where the prescribed target came from. */
export const PrescriptionTargetSourceSchema = z.enum([
  "engine",
  "program-template",
  "manual",
]);

/**
 * The realized result of a prescription, written when its session completes.
 * Compares what the engine asked for against what the user actually did so the
 * next prescription can reason from outcome rather than from a raw PR gap.
 */
export const PrescriptionOutcomeSchema = z.object({
  /** Best working-set load actually achieved (kg for lifting; null for cardio). */
  actualTopSetKg: z.number().min(0).nullable(),
  /** Reps achieved on the best working set. */
  actualReps: z.number().int().min(0),
  /** Reliability-weighted RIR across the realized working sets; null when unknown. */
  reliabilityWeightedRir: z.number().min(0).nullable(),
  /** Whether the prescribed target was missed. */
  missed: z.boolean(),
  /** Actual vs prescribed work; ~1.0 means the prescription was matched. Null when not computable. */
  completionRatio: z.number().min(0).nullable(),
  resolvedAt: z.coerce.date(),
});

/**
 * A durable, session-linked record of one prescription and (once resolved) its
 * outcome. Persisted as a bounded ring buffer on `ProgressionEngineState.prescriptionLog`
 * so the engine can score `last prescription → actual work → next prescription`.
 */
export const PrescriptionRecordSchema = z.object({
  /** Stable id for this record (sessionId + canonicalExerciseId + order). */
  id: z.string().min(1),
  sessionId: z.string().min(1),
  /** Program exercise template id, when prescribed from a program; null for ad-hoc. */
  programExerciseId: z.string().nullable(),
  canonicalExerciseId: z.string().min(1),
  /** Position of the exercise within the session; null when unknown. */
  order: z.number().int().min(0).nullable(),
  decision: PrescriptionDecisionSchema,
  targetSource: PrescriptionTargetSourceSchema,
  /** Prescribed best-set load (kg for lifting; null for cardio). */
  prescribedTopSetKg: z.number().min(0).nullable(),
  /** Prescribed best-set reps. */
  prescribedReps: z.number().int().min(0),
  status: PrescriptionStatusSchema,
  createdAt: z.coerce.date(),
  /** When the record left `active` (completed/abandoned/superseded); null while active. */
  resolvedAt: z.coerce.date().nullable(),
  outcome: PrescriptionOutcomeSchema.nullable(),
});

/**
 * Persisted Progression Engine V2 state.
 *
 * The magnitude fields are modality-neutral: for lifting they are kilograms,
 * for cardio they are workload *scores* (METs·min, distance, etc.). They were
 * previously named `rawBaselineKg` / `capacityEstimateKg` / `trainingMaxKg`;
 * the `z.preprocess` below transparently maps those legacy keys from any
 * already-persisted blob onto the new modality-neutral names, so existing data
 * keeps parsing without a destructive migration.
 */
const ProgressionEngineStateObjectSchema = z.object({
  calibrationState: ProgressionCalibrationStateSchema,
  /** Raw proven baseline. Lifting: kg (all-time PR e1rm). Cardio: workload score. */
  rawBaselineScore: z.number().min(0).nullable(),
  /** Current capacity estimate. Lifting: kg. Cardio: workload score. */
  capacityScore: z.number().min(0).nullable(),
  /** Conservative everyday training target. Lifting: kg (training max). Cardio: workload score. */
  trainingTargetScore: z.number().min(0).nullable(),
  uncertaintyPct: z.number().min(0).max(1).nullable(),
  distinctSessionCount: z.number().int().min(0),
  lastDecision: PrescriptionDecisionSchema.optional(),
  /** Bounded ring buffer of recent prescription records (newest last). */
  prescriptionLog: z.array(PrescriptionRecordSchema).optional(),
  schemaVersion: z.number().int().min(1),
});

const LEGACY_ENGINE_STATE_FIELD_MAP: Record<string, string> = {
  rawBaselineKg: "rawBaselineScore",
  capacityEstimateKg: "capacityScore",
  trainingMaxKg: "trainingTargetScore",
};

export const ProgressionEngineStateSchema = z.preprocess((value) => {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  const source = value as Record<string, unknown>;
  let mapped: Record<string, unknown> | null = null;
  for (const [legacyKey, neutralKey] of Object.entries(LEGACY_ENGINE_STATE_FIELD_MAP)) {
    if (legacyKey in source && !(neutralKey in source)) {
      mapped ??= { ...source };
      mapped[neutralKey] = source[legacyKey];
    }
  }
  return mapped ?? source;
}, ProgressionEngineStateObjectSchema);

export type ProgressionCalibrationState = z.infer<
  typeof ProgressionCalibrationStateSchema
>;
export type PrescriptionAction = z.infer<typeof PrescriptionActionSchema>;
export type PrescriptionDriver = z.infer<typeof PrescriptionDriverSchema>;
export type PrescriptionDecision = z.infer<typeof PrescriptionDecisionSchema>;
export type PrescriptionStatus = z.infer<typeof PrescriptionStatusSchema>;
export type PrescriptionTargetSource = z.infer<
  typeof PrescriptionTargetSourceSchema
>;
export type PrescriptionOutcome = z.infer<typeof PrescriptionOutcomeSchema>;
export type PrescriptionRecord = z.infer<typeof PrescriptionRecordSchema>;
export type ProgressionEngineState = z.infer<
  typeof ProgressionEngineStateSchema
>;
