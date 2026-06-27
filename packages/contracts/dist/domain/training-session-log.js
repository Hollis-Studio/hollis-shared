import { z } from "zod";
import { CardioSessionDataSchema } from "./cardio-session.js";
import { MuscleGroupSchema } from "./muscles.js";
export const PROGRAM_PHASES = [
    "hypertrophy",
    "strength",
    "peaking",
    "deload",
    "maintenance",
];
export const ProgramPhaseSchema = z.enum(PROGRAM_PHASES);
export const RepClassSchema = z.enum(["S", "H", "E"]);
export const CanonicalizationStatusSchema = z.enum(["matched", "unmatched", "ignored"]);
export const ExerciseTrackingModeSchema = z.enum(["reps", "timed", "cardio", "stretch"]);
/**
 * The mutually-exclusive classification a logged working set produces, judged
 * against the target the user actually saw. Shared by in-session adaptation,
 * persisted set flags, and post-workout judgment so "intentionally easier",
 * "fatigue miss", "true overperformance", and "probably bad data" stay distinct.
 */
export const SetSignalSchema = z.enum([
    "on_target",
    "overperformance",
    "fatigue_miss",
    "intentionally_easier",
    "suspected_misinput",
]);
/**
 * Optional one-tap user-reported effort for a working set ("how'd that feel?").
 * Mass-market alternative to a numeric RIR/RPE scale: inferred effort is the
 * default, this is an explicit override the user can tap. Maps onto adaptation
 * headroom (easy → surplus, hard → low headroom) without exposing a numeric scale.
 */
export const PerceivedEffortSchema = z.enum(["easy", "right", "hard"]);
/**
 * A snapshot of the prescription a set was judged against. Persisted on the set
 * (the target the user actually faced after live adaptation) and on the exercise
 * (the original, pre-adaptation plan — see SessionExercise.originalTargets).
 */
export const SetTargetSnapshotSchema = z.object({
    setNumber: z.number().int().min(1),
    weightKg: z.number().min(0).nullable(),
    reps: z.number().int().min(0),
    rir: z.number().int().min(0).max(10),
    durationSeconds: z.number().min(0).nullable().optional(),
    /**
     * Prescribed cardio distance in km, when the target carried one. Snapshotted
     * so cold-start cardio (the first session before a baseline exists) can rebuild
     * a distance-focused prescription record from originalTargets rather than being
     * forced to duration-only. Omitted/null for lifting and duration-only cardio.
     */
    distanceKm: z.number().min(0).nullable().optional(),
    /**
     * Prescribed cardio pace in seconds per km, when the target carried one. Same
     * cold-start rationale as distanceKm — lets a pace-focused first session enter
     * the feedback loop with its real focus metric. Omitted/null otherwise.
     */
    paceSecondsPerKm: z.number().min(0).nullable().optional(),
    /**
     * Prescribed machine-specific targets, when the modality progresses on one of
     * them (stairmaster → floors, jump rope → jumps, stairmaster alt → steps).
     * Snapshotted alongside distance/pace so cold-start sessions for these
     * modalities enter the feedback loop on their real focus metric.
     */
    floors: z.number().min(0).nullable().optional(),
    steps: z.number().min(0).nullable().optional(),
    jumps: z.number().min(0).nullable().optional(),
    isWarmup: z.boolean(),
});
/**
 * One in-session target adaptation, recorded for the audit trail and undo. The
 * remaining targets are recomputed from originalTargets + confirmed sets rather
 * than from these events, so an event is a durable record of what changed and why.
 */
export const AdaptationEventSchema = z.object({
    /** Index of the confirmed set whose result drove the adaptation. */
    setIndex: z.number().int().min(0),
    signal: SetSignalSchema,
    /** Human-readable explanation shown to the user; null when none was surfaced. */
    reason: z.string().nullable(),
    occurredAt: z.coerce.date(),
});
export const SessionSetSchema = z.object({
    /**
     * Stable, collision-free identity for a logged set (UUID). Unlike setNumber —
     * a mutable ordinal that two devices can independently reuse after a delete /
     * re-number — setId never changes once assigned, so the loss-free session merge
     * (sessionMerge.unionSets) can key on it and never silently collapse two
     * distinct sets onto one ordinal. Optional: legacy sets persisted before this
     * field existed carry no setId, so consumers must fall back to setNumber when
     * it is absent. New sets should always assign one.
     */
    setId: z.string().min(1).optional(),
    setNumber: z.number().int().min(1),
    weightKg: z.number().min(0),
    reps: z.number().int().min(0),
    // Nullable: a logged set may carry no RIR when the user didn't rate effort
    // (placeholder/blank sets, or RIR controls hidden). The engine's
    // calculateRirReliability already treats rir as `number | null`.
    rir: z.number().int().min(0).max(10).nullable(),
    durationSeconds: z.number().min(0).nullable().optional(),
    isWarmup: z.boolean(),
    isOutlier: z.boolean(),
    completedAt: z.coerce.date(),
    isConfirmed: z.boolean().optional(),
    skipped: z.boolean().optional(),
    restAfterSec: z.number().int().min(0).nullable(),
    setType: z.enum(["normal", "warmup", "drop_set", "rest_pause", "superset"]).default("normal"),
    setGroupId: z.string().nullable().optional(),
    side: z.enum(["left", "right"]).nullable().optional(),
    originExerciseId: z.string().nullable().optional(),
    repClass: RepClassSchema.optional(),
    isMiss: z.boolean().optional(),
    /** The target this set was judged against (after any live adaptation). */
    target: SetTargetSnapshotSchema.optional(),
    /** The signal this set produced relative to its target. */
    signal: SetSignalSchema.optional(),
    /**
     * Optional one-tap user-reported effort ("easy / right / hard"). When present
     * it refines/overrides the inferred set signal; when absent the engine infers
     * effort from reps-vs-target. Never required.
     */
    perceivedEffort: PerceivedEffortSchema.nullable().optional(),
    /**
     * True when the logged weight looks implausible (~2x target/history). A
     * flag-only, reviewable data-quality marker — distinct from isOutlier, which
     * means "excluded from the baseline ratchet". A suspected mis-input is kept in
     * the data until the user confirms or corrects it.
     */
    isSuspectedMisinput: z.boolean().optional(),
    leftReps: z.number().int().min(0).nullable().optional(),
    rightReps: z.number().int().min(0).nullable().optional(),
    leftWeightKg: z.number().min(0).nullable().optional(),
    rightWeightKg: z.number().min(0).nullable().optional(),
});
export const StretchSetSchema = z.object({
    setNumber: z.number().int().min(1),
    holdDurationSeconds: z.number().min(1),
    side: z.enum(["left", "right", "both"]),
    completedAt: z.coerce.date(),
    isOutlier: z.boolean(),
});
export const StretchSessionDataSchema = z.object({
    sets: z.array(StretchSetSchema),
    totalDurationSeconds: z.number().min(0),
});
export const SessionExerciseSchema = z
    .object({
    /** Stable identity for this exercise slot within a session. Order may change; slotId must not. */
    slotId: z.string().min(1).optional(),
    canonicalExerciseId: z.string().min(1).nullable(),
    freestyleName: z.string().nullable(),
    freestyleMuscleGroups: z.array(MuscleGroupSchema).nullable(),
    gymExerciseInstanceId: z.string().min(1).nullable(),
    order: z.number().int().min(0),
    sets: z.array(SessionSetSchema),
    isFromProgram: z.boolean(),
    canonicalizationStatus: CanonicalizationStatusSchema,
    cardioData: CardioSessionDataSchema.nullable().default(null),
    stretchData: StretchSessionDataSchema.nullable().default(null),
    trackingMode: ExerciseTrackingModeSchema.optional(),
    /**
     * The original, pre-adaptation target plan captured at session start. The
     * basis for undo/recompute: remaining targets are rebuilt from these plus
     * the confirmed sets when a set is edited.
     */
    originalTargets: z.array(SetTargetSnapshotSchema).optional(),
    /** Audit trail of in-session target adaptations, in order of occurrence. */
    adaptationEvents: z.array(AdaptationEventSchema).optional(),
})
    .refine((data) => {
    if (data.canonicalizationStatus === "matched") {
        return data.canonicalExerciseId != null;
    }
    if (data.canonicalizationStatus === "unmatched") {
        return data.canonicalExerciseId == null;
    }
    return true;
}, {
    message: 'canonicalExerciseId must be defined when status is "matched" and null/undefined when "unmatched"',
});
export const QuestionnaireResponseSchema = z.object({
    sleepHours: z.number().min(0),
    sleepQuality: z.number().int().min(0).max(5),
    energyLevel: z.number().int().min(0).max(5),
    stressLevel: z.number().int().min(0).max(5),
    sorenessLevel: z.number().int().min(0).max(5),
    hitMacrosYesterday: z.boolean(),
    hydrationLevel: z.number().int().min(0).max(5),
    goEasier: z.boolean(),
    goEasierOverridePercent: z.number().int().min(5).max(30).optional(),
    notes: z.string().optional(),
    autoFilledSleep: z.boolean(),
    restingHeartRate: z.number().optional(),
    hrv: z.number().optional(),
    bodyWeightKg: z.number().optional(),
    dietaryCalories: z.number().optional(),
});
const TrainingSessionLogBaseSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    programId: z.string().min(1).nullable(),
    programDayName: z.string().nullable(),
    gymProfileId: z.string().min(1).nullable(),
    startedAt: z.coerce.date(),
    completedAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().optional(),
    isFreestyle: z.boolean(),
    isSubstitution: z.boolean(),
    status: z.enum(["active", "completed", "abandoned"]),
    questionnaire: QuestionnaireResponseSchema,
    totalVolumeKg: z.number().min(0),
    durationMinutes: z.number().min(0),
    untrackedVolume: z.number().min(0).optional(),
    aiOutlierLabel: z.string().nullable().optional(),
    schemaVersion: z.number().optional(),
    programPhase: ProgramPhaseSchema.optional(),
    skippedExerciseIds: z.array(z.string()).optional(),
    /**
     * When this session's completion was successfully written to the platform
     * Health store (Apple Health / Health Connect). Persisted on the synced session
     * record so the Health-write dedup guard survives reinstall: the device-local
     * MMKV guard resets on reinstall, but a synced healthSyncedAt lets any device
     * (or the same device after reinstall) recognise the workout was already
     * written and skip a duplicate. Absent/null until the first successful write.
     */
    healthSyncedAt: z.coerce.date().nullable().optional(),
});
export const ActiveTrainingSessionLogSchema = TrainingSessionLogBaseSchema.extend({
    exercises: z.array(SessionExerciseSchema).min(0),
});
export const TrainingSessionLogSchema = TrainingSessionLogBaseSchema.extend({
    exercises: z.array(SessionExerciseSchema).min(1),
});
//# sourceMappingURL=training-session-log.js.map