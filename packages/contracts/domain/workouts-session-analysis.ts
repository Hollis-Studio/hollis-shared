/**
 * @ai-context Workouts daily lift analysis | SessionAnalysisSchema,
 * SessionAnalysisFeaturesSchema, SessionAnalysisContentSchema,
 * SessionAnalysisRequestSchema, SessionAnalysisResponseSchema.
 *
 * The per-session coaching read-out behind the post-workout push
 * (Workouts AI spec §9.4 / freestyle-first Wave C). One analysis exists per
 * completed session, keyed by `sessionId` — the server stores it under that
 * primary key so a re-request replays the stored row instead of paying a
 * second provider call.
 *
 * SHAPE RULE: `features` is a COMPUTED digest, never raw history. Every field
 * below is a number the server already derived (deltas, counts, top sets,
 * e1RM) precisely so the prompt never carries set-by-set history and the model
 * can never quote a figure deterministic code did not compute. `content` is
 * the only model-authored block on the wire.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';

/** Bumped when the feature digest changes shape; stored rows carry their own. */
export const SESSION_ANALYSIS_SCHEMA_VERSION = 1;

/** Cap on model-authored observations. Three is what the screen renders. */
export const SESSION_ANALYSIS_OBSERVATION_MAX = 3;
/** Cap on per-exercise feature rows sent to the model. */
export const SESSION_ANALYSIS_EXERCISE_MAX = 12;
/** Cap on per-muscle-group feature rows sent to the model. */
export const SESSION_ANALYSIS_MUSCLE_GROUP_MAX = 12;
/** Cap on deterministic signal keys carried alongside the digest. */
export const SESSION_ANALYSIS_SIGNAL_MAX = 12;

/**
 * Post-session check-in answers, already normalized to the 1-5 scale the app
 * stores. Null when the user skipped the questionnaire — the model must then
 * say nothing about readiness rather than infer it.
 *
 * Storage semantics are preserved verbatim: `soreness` and `stress` are
 * higher-is-worse on the wire (the client inverts them at the presentation
 * boundary only), so the prompt states the direction explicitly.
 */
export const SessionAnalysisReadinessSchema = z.object({
  sleepQuality: z.number().min(0).max(5).nullable(),
  energyLevel: z.number().min(0).max(5).nullable(),
  /** Higher = MORE sore. */
  sorenessLevel: z.number().min(0).max(5).nullable(),
  /** Higher = MORE stressed. */
  stressLevel: z.number().min(0).max(5).nullable(),
  hydrationLevel: z.number().min(0).max(5).nullable(),
});
export type SessionAnalysisReadiness = z.infer<typeof SessionAnalysisReadinessSchema>;

/** One exercise's computed digest. No set list, by construction. */
export const SessionAnalysisExerciseFeatureSchema = z.object({
  name: z.string().min(1).max(200),
  isFreestyle: z.boolean(),
  setCount: z.number().int().min(0),
  volumeKg: z.number().min(0),
  /** Heaviest qualifying working set, or null when none qualified. */
  topSet: z
    .object({
      weightKg: z.number().min(0),
      reps: z.number().int().min(0),
      rir: z.number().min(0).max(10).nullable(),
    })
    .nullable(),
  /** Session estimated 1RM, kg. Null when the tracking mode cannot produce one. */
  e1rmKg: z.number().min(0).nullable(),
  /** Best prior e1RM this exercise had before today, kg. */
  priorBestE1rmKg: z.number().min(0).nullable(),
  /** Fractional change vs `priorBestE1rmKg` (0.03 = +3%). Null when either side is null. */
  e1rmDeltaPct: z.number().nullable(),
  /** Deterministic PR flag — set by the engine, never inferred by the model. */
  isPr: z.boolean(),
  /** Working sets that came in under the prescribed target. */
  missedTargetSets: z.number().int().min(0),
  /** Deterministic plateau flag carried from the progression baseline. */
  isPlateauFlagged: z.boolean(),
  /** Days since this exercise was last logged; null on a first exposure. */
  daysSinceLastPerformed: z.number().int().min(0).nullable(),
});
export type SessionAnalysisExerciseFeature = z.infer<typeof SessionAnalysisExerciseFeatureSchema>;

export const SessionAnalysisMuscleGroupFeatureSchema = z.object({
  muscleGroup: z.string().min(1).max(60),
  setCount: z.number().int().min(0),
  volumeKg: z.number().min(0),
});
export type SessionAnalysisMuscleGroupFeature = z.infer<
  typeof SessionAnalysisMuscleGroupFeatureSchema
>;

/**
 * How today compares to the user's own recent work. `priorSessionCount` is the
 * denominator behind every delta here — at 0 the deltas are null and the model
 * is told it has no comparison to draw.
 */
export const SessionAnalysisComparisonSchema = z.object({
  priorSessionCount: z.number().int().min(0),
  volumeDeltaPct: z.number().nullable(),
  durationDeltaPct: z.number().nullable(),
  /** Trailing 4-week sessions-per-week average; null when history is too short. */
  sessionsPerWeekTrailing4w: z.number().min(0).nullable(),
});
export type SessionAnalysisComparison = z.infer<typeof SessionAnalysisComparisonSchema>;

/**
 * The full deterministic digest for one session. This is the ONLY thing the
 * analysis prompt is allowed to reason from, and it is stored alongside the
 * generated copy so a served analysis can always be traced to its inputs.
 */
export const SessionAnalysisFeaturesSchema = z.object({
  schemaVersion: z.literal(SESSION_ANALYSIS_SCHEMA_VERSION),
  sessionId: z.string().min(1),
  completedAt: z.string().datetime(),
  /** User-local yyyy-mm-dd the session completed on. */
  localDate: z.string().min(1).max(10),
  /** The reader's unit. Every *Kg field is kilograms regardless. */
  displayUnit: z.enum(['kg', 'lbs']),
  session: z.object({
    programDayName: z.string().max(200).nullable(),
    isFreestyle: z.boolean(),
    isSubstitution: z.boolean(),
    durationMinutes: z.number().min(0),
    totalVolumeKg: z.number().min(0),
    exerciseCount: z.number().int().min(0),
    setCount: z.number().int().min(0),
    /** Confirmed working sets (warmups excluded). */
    workingSetCount: z.number().int().min(0),
    skippedExerciseCount: z.number().int().min(0),
  }),
  readiness: SessionAnalysisReadinessSchema.nullable(),
  muscleGroups: z.array(SessionAnalysisMuscleGroupFeatureSchema).max(SESSION_ANALYSIS_MUSCLE_GROUP_MAX),
  exercises: z.array(SessionAnalysisExerciseFeatureSchema).max(SESSION_ANALYSIS_EXERCISE_MAX),
  comparison: SessionAnalysisComparisonSchema,
  /** Deterministic signal keys the analysis may cite, e.g. "pr:Bench Press". */
  signals: z.array(z.string().max(120)).max(SESSION_ANALYSIS_SIGNAL_MAX),
});
export type SessionAnalysisFeatures = z.infer<typeof SessionAnalysisFeaturesSchema>;

/** One model-authored observation. `label` is a short noun phrase, not a sentence. */
export const SessionAnalysisObservationSchema = z.object({
  label: z.string().trim().min(1).max(40),
  detail: z.string().trim().min(1).max(200),
});
export type SessionAnalysisObservation = z.infer<typeof SessionAnalysisObservationSchema>;

/** The only model-authored block. Structured so the screen never parses prose. */
export const SessionAnalysisContentSchema = z.object({
  headline: z.string().trim().min(1).max(60),
  summary: z.string().trim().min(1).max(400),
  observations: z.array(SessionAnalysisObservationSchema).max(SESSION_ANALYSIS_OBSERVATION_MAX),
  /** One forward-looking line, or null when the digest supports none. */
  focusNext: z.string().trim().max(200).nullable(),
});
export type SessionAnalysisContent = z.infer<typeof SessionAnalysisContentSchema>;

/** `fallback` means deterministic copy — the provider failed or is unconfigured. */
export const SessionAnalysisSourceSchema = z.enum(['ai', 'fallback']);
export type SessionAnalysisSource = z.infer<typeof SessionAnalysisSourceSchema>;

/** A stored analysis as served to the client. */
export const SessionAnalysisSchema = z.object({
  sessionId: z.string().min(1),
  schemaVersion: z.literal(SESSION_ANALYSIS_SCHEMA_VERSION),
  generatedAt: z.string().datetime(),
  source: SessionAnalysisSourceSchema,
  content: SessionAnalysisContentSchema,
  features: SessionAnalysisFeaturesSchema,
});
export type SessionAnalysis = z.infer<typeof SessionAnalysisSchema>;

/**
 * POST /v1/ai/session-analysis — generate (or replay) the analysis for one
 * completed session. Entitlement-gated and metered. Idempotent on `sessionId`:
 * the second call for a session returns the stored row with `cached: true` and
 * spends nothing.
 */
export const SessionAnalysisRequestSchema = z.object({
  sessionId: z.string().min(1).max(200),
});
export type SessionAnalysisRequest = z.infer<typeof SessionAnalysisRequestSchema>;

export const SessionAnalysisResponseSchema = z.object({
  analysis: SessionAnalysisSchema,
  /** True when the stored analysis was replayed — no provider call was made. */
  cached: z.boolean(),
});
export type SessionAnalysisResponse = z.infer<typeof SessionAnalysisResponseSchema>;
