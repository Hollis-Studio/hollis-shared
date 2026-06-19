import { z } from "zod";
import { SetSignalSchema } from "../domain/training-session-log.js";

/**
 * Schema version stamped onto persisted ProgressionEngineState (and derived
 * engine-state snapshots). Single source of truth for the app and server, which
 * previously each defined their own `= 1` constant and risked silent version skew.
 */
export const PROGRESSION_ENGINE_STATE_SCHEMA_VERSION = 1;

/**
 * The progression dimension a cardio prescription was optimizing for.
 * Snapshotted at prescription time so resolution is focus-aware even if
 * the user later changes their setting.
 */
export const CardioProgressionFocusSchema = z.enum(["duration", "distance", "pace"]);
export type CardioProgressionFocus = z.infer<typeof CardioProgressionFocusSchema>;

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
 * The realized result of a lifting prescription.
 */
export const LiftingPrescriptionOutcomeSchema = z.object({
  kind: z.literal("lifting"),
  /** Best working-set load actually achieved (kg). */
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
 * The realized result of a cardio prescription.
 */
export const CardioPrescriptionOutcomeSchema = z.object({
  kind: z.literal("cardio"),
  durationS: z.number().min(0).nullable(),
  distanceKm: z.number().min(0).nullable(),
  pace: z.number().min(0).nullable(),
  mets: z.number().min(0).nullable(),
  /**
   * Focus-weighted headline completion scalar (the focus metric's entry from
   * completionByMetric). ~1.0 means the prescribed target was matched. Null when not
   * computable. For pace-focus, faster→>1 (inverted ratio).
   */
  completionRatio: z.number().min(0).nullable(),
  /**
   * Per-metric completion ratios (actual/prescribed; pace inverted so faster→>1).
   * Null when the metric was not prescribed. Powers the transparency breakdown card.
   */
  completionByMetric: z
    .object({
      duration: z.number().min(0).nullable(),
      distance: z.number().min(0).nullable(),
      pace: z.number().min(0).nullable(),
    })
    .nullable()
    .optional(),
  resolvedAt: z.coerce.date(),
});

/**
 * The realized result of a prescription, written when its session completes.
 * Compares what the engine asked for against what the user actually did so the
 * next prescription can reason from outcome rather than from a raw PR gap.
 *
 * Backward-compatible: legacy (kind-less) persisted lifting outcomes are
 * silently promoted to `kind: "lifting"` via z.preprocess.
 */
export const PrescriptionOutcomeSchema = z.preprocess(
  (val) =>
    val && typeof val === "object" && !("kind" in (val as Record<string, unknown>))
      ? { ...(val as Record<string, unknown>), kind: "lifting" }
      : val,
  z.discriminatedUnion("kind", [LiftingPrescriptionOutcomeSchema, CardioPrescriptionOutcomeSchema]),
);

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
  /**
   * The best-set load the live-adapted in-session plan actually asked for by the
   * end of the session (kg), after up/down mid-workout adaptation. Lets the next
   * prescription reason from what the user was actually coached toward rather than
   * the untouched pre-session plan in `prescribedTopSetKg`. Null for cardio or when
   * no live adaptation occurred (falls back to `prescribedTopSetKg`).
   */
  liveAdaptedTopSetKg: z.number().min(0).nullable().optional(),
  status: PrescriptionStatusSchema,
  createdAt: z.coerce.date(),
  /** When the record left `active` (completed/abandoned/superseded); null while active. */
  resolvedAt: z.coerce.date().nullable(),
  outcome: PrescriptionOutcomeSchema.nullable(),
  /** Prescribed cardio duration in seconds; null for lifting or when not prescribed. */
  prescribedDurationSeconds: z.number().min(0).nullable().optional(),
  /** Prescribed cardio distance in km; null for lifting or when not prescribed. */
  prescribedDistanceKm: z.number().min(0).nullable().optional(),
  /**
   * Focus the cardio target was generated for, snapshotted at prescription time so
   * resolution is focus-aware even if the user later changes their setting.
   * null/absent for lifting.
   */
  prescribedFocus: CardioProgressionFocusSchema.nullable().optional(),
  /**
   * Prescribed pace target in seconds/km for pace-focus completion. Inverted so that
   * faster pace → completionRatio > 1. null/absent for non-pace-focus or lifting.
   */
  prescribedPaceSecondsPerKm: z.number().min(0).nullable().optional(),
  /** Cardio-specific outcome record (separate from the lifting-centric `outcome` field). */
  cardioOutcome: CardioPrescriptionOutcomeSchema.nullable().optional(),
});

/**
 * Per-exercise learned personalization scalars. Every field is a single
 * human-interpretable number so a load decision stays explainable in one
 * sentence and can never become a black box. These are *inputs* that nudge the
 * deterministic engine's named constants — they never set a weight directly.
 *
 * All nullable: until enough of the user's own history exists (`sampleSize`
 * below the engine's cold-start floor) the engine falls back to population
 * constants. Respects the first-lift imperative — nothing is seeded before the
 * user's first logged set.
 */
export const ProgressionPersonalizationSchema = z.object({
  /** Kalman-filtered estimate of the user's true e1RM for this lift (kg); null until seeded. */
  e1rmEstimateKg: z.number().min(0).nullable(),
  /** Estimate variance (kg²) — "how confident we are"; widens after a training gap. */
  e1rmVarianceKg2: z.number().min(0).nullable(),
  /** Rolling progression success rate over the recent window (0..1); null until enough data. */
  progressionSuccessRate: z.number().min(0).max(1).nullable(),
  /** Personal strength trend slope in percent-of-e1RM per week; null until enough data. */
  trendSlopePctPerWeek: z.number().nullable(),
  /** Personal within-session fatigue percent (0..0.2) for backoff sizing; null until calibrated. */
  fatiguePct: z.number().min(0).max(0.2).nullable(),
  /** Number of distinct sessions backing these estimates (cold-start gate). */
  sampleSize: z.number().int().min(0),
  /** When these scalars were last recomputed; null when never. */
  updatedAt: z.coerce.date().nullable(),
});
export type ProgressionPersonalization = z.infer<typeof ProgressionPersonalizationSchema>;

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
  /**
   * Per-user learned personalization scalars (Kalman e1RM, success rate, trend
   * slope, fatigue percent). Optional/absent until the user has enough of their
   * own history; the engine falls back to population constants when missing.
   */
  personalization: ProgressionPersonalizationSchema.optional(),
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

// ============================================================================
// Prescription drop step (narration / explanation trace)
// ============================================================================

export const PrescriptionDropStepSchema = z.object({
  kind: z.enum(["anchor", "driver"]),
  label: z.string().min(1),
  pctChange: z.number(),
  reason: z.string().min(1),
});

// ============================================================================
// Cardio per-metric capacity
// ============================================================================

export const CardioCapacityMetricSchema = z.enum(["mets_min", "distance_km", "duration_min"]);

export const CardioMetricCapacitySchema = z.object({
  metric: CardioCapacityMetricSchema,
  score: z.number(),
  sessionCount: z.number().int().min(0),
});

// ============================================================================
// AI engine-seam types
// ============================================================================

export const AiContextDriverInputSchema = z.object({
  contributionPct: z.number().min(-0.08).max(0.08),
  reason: z.string().min(1),
  confidence: z.enum(["low", "medium", "high"]),
});

export const AiSetSignalOverrideSchema = z.object({
  signal: SetSignalSchema,
  confidence: z.enum(["low", "medium", "high"]),
  reason: z.string().min(1),
});

// ============================================================================
// Inferred types
// ============================================================================

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
export type LiftingPrescriptionOutcome = z.infer<typeof LiftingPrescriptionOutcomeSchema>;
export type CardioPrescriptionOutcome = z.infer<typeof CardioPrescriptionOutcomeSchema>;
export type PrescriptionOutcome = z.infer<typeof PrescriptionOutcomeSchema>;
export type PrescriptionRecord = z.infer<typeof PrescriptionRecordSchema>;
export type ProgressionEngineState = z.infer<
  typeof ProgressionEngineStateSchema
>;
export type PrescriptionDropStep = z.infer<typeof PrescriptionDropStepSchema>;
export type CardioCapacityMetric = z.infer<typeof CardioCapacityMetricSchema>;
export type CardioMetricCapacity = z.infer<typeof CardioMetricCapacitySchema>;
export type AiContextDriverInput = z.infer<typeof AiContextDriverInputSchema>;
export type AiSetSignalOverride = z.infer<typeof AiSetSignalOverrideSchema>;
