/**
 * @ai-context Workouts Sunday Review wire shapes | the frozen deck the server
 * writes into a Week row's `aiRetrospective`, and the device-computed snapshot
 * the client writes into its `deterministicSnapshot` (hollis-workouts #13, #70,
 * #79, #99; single-sourced by hollis-workouts#239 — the server and app used to
 * carry hand-mirrored copies of every schema here).
 *
 * Both documents travel inside `WeekDocumentBodySchema` (./workouts-weeks),
 * whose Json slots stay `z.unknown()` on purpose: rows written before these
 * shapes existed hold other content, and `/v1/weeks` must keep serving them.
 * Consumers parse a slot with the schemas here where they use it — the
 * Workouts server's generation pass reads the snapshot, the app's deck loader
 * and slide renderer read the deck.
 *
 * ─── Who writes what ───────────────────────────────────────────────────────
 * - Deck (`SundayReviewDeckSchema`): written ONLY by the server's generation
 *   pass, then frozen — never regenerated. Read by the app.
 * - Snapshot (`WeekClientSnapshotSchema`): written by the device through
 *   `PUT /v1/weeks/:weekIso`, read by the server's generation pass. Untrusted
 *   input: an unreadable envelope means "no device-only slides", never an error.
 *
 * ─── Compatibility rules ───────────────────────────────────────────────────
 * - Objects are NOT strict: an unknown key is stripped, never rejected, so a
 *   producer one release ahead cannot break a reader one release behind.
 * - A deck slide's `type` is a plain string and its `payload` is unknown: a
 *   reader shows an unrecognised slide as one error slide instead of rejecting
 *   the deck, and parses each payload with `SlidePayloadSchemas[type]` where it
 *   renders it.
 * - Decks are frozen, so a payload field added later must be `.optional()`,
 *   or every deck already stored stops rendering that slide.
 * - `WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION` is the snapshot's compatibility
 *   hinge: the server reads only the version it knows. Bump it whenever a
 *   snapshot field is added, removed, or changes meaning.
 *
 * ─── Units ─────────────────────────────────────────────────────────────────
 * Every weight is KILOGRAMS. Every `deltaPct*` field is a FRACTION, not a
 * percent (0.172 means 17.2%).
 *
 * deps: zod, ./muscles (MuscleGroupSchema), ./training-session-log
 *       (ProgramPhaseSchema), ./workouts-program-rotation
 *       (ProgramRotationPhaseSchema), ../schemas/weight (loadWeightKgSchema)
 * consumers: hollis-workouts server (`server/src/services/sundayReview/*`) +
 *            mobile client (`src/schemas/slidePayloads.ts`,
 *            `src/schemas/weekClientSnapshot.ts`, `src/schemas/sundayReviewDeck.ts`)
 */
import * as z from "zod";
import { loadWeightKgSchema } from "../schemas/weight.js";
import { MuscleGroupSchema } from "./muscles.js";
import { ProgramPhaseSchema } from "./training-session-log.js";
import { ProgramRotationPhaseSchema } from "./workouts-program-rotation.js";
// ─── Vocabularies ───────────────────────────────────────────────────────────
/** Every slide type a deck can hold. `SlidePayloadSchemas` has exactly these keys. */
export const SUNDAY_REVIEW_SLIDE_TYPES = [
    "week_headline",
    "pr_celebration",
    "volume_delta",
    "muscle_group_balance",
    "standout_lift",
    "plateau_watch",
    "consistency_streak",
    "sleep_correlation",
    "calorie_correlation",
    "phase_outlook",
    "rotation_switch",
    "next_week_preview",
    "freeform",
    "sparse_data_note",
];
export const SundayReviewSlideTypeSchema = z.enum(SUNDAY_REVIEW_SLIDE_TYPES);
/**
 * The six coarse body regions the `muscle_group_balance` slide groups muscle
 * groups into (the server owns the MuscleGroup → region table).
 */
export const WORKOUTS_BODY_REGIONS = ["chest", "back", "arms", "shoulders", "core", "legs"];
export const WorkoutsBodyRegionSchema = z.enum(WORKOUTS_BODY_REGIONS);
/** A local civil date, `YYYY-MM-DD` — never an instant. */
const localCivilDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Must be YYYY-MM-DD");
/** i18n params rendered by the client (#99). */
const CopyParamsSchema = z.record(z.string(), z.union([z.string(), z.number()]));
// ─── Payload building blocks ────────────────────────────────────────────────
export const PRItemSchema = z.object({
    canonicalExerciseId: z.string().min(1),
    exerciseName: z.string().min(1),
    e1rm: z.number().positive(),
    previousBest: z.number().positive(),
    sessionId: z.string().min(1),
    dateIso: z.string().min(1),
});
export const VolumeRowSchema = z.object({
    muscleGroup: MuscleGroupSchema,
    volumeKg: z.number().nonnegative(),
    /** FRACTION, not percent — 0.172 means 17.2%. */
    deltaPct: z.number(),
    targetKg: z.number().nonnegative().optional(),
    /**
     * Mean weekly volume for this muscle group over the 4 weeks ending with the
     * reviewed week (w-3..w), always divided by 4 — untrained weeks count as 0.
     * Optional because decks persisted before this field existed lack it.
     */
    avgVolumeKg4w: z.number().nonnegative().optional(),
    /** Volume in week w-1 — the exact number `deltaPct` is measured against. Optional for older decks. */
    prevWeekVolumeKg: z.number().nonnegative().optional(),
});
export const NextWeekDaySchema = z.object({
    dateIso: z.string().min(1),
    label: z.string().min(1),
    sessionSummary: z.string().min(1).optional(),
});
export const JumpLiftSchema = z.object({
    canonicalExerciseId: z.string().min(1),
    name: z.string().min(1),
    currentE1rm: z.number().nonnegative(),
    jumpAtE1rm: z.number().positive(),
});
export const MuscleGroupBalanceRegionSchema = z.object({
    region: WorkoutsBodyRegionSchema,
    /** FRACTION (0..1) of the week's working sets that landed in this region. */
    percent: z.number().min(0).max(1),
    color: z.enum(["low", "ok", "over"]),
});
/**
 * One (day, health metric, performance) triple behind a correlation slide.
 * `perfNorm` is the session's performance as a z-score across the correlation
 * window, clamped; Pearson's r is invariant under that linear rescale, so it
 * changes only what the slide plots, never the reported `r`.
 */
export const SleepCorrelationPointSchema = z.object({
    dateIso: z.string().min(1),
    sleepHours: z.number().nonnegative(),
    perfNorm: z.number(),
});
export const CalorieCorrelationPointSchema = z.object({
    dateIso: z.string().min(1),
    calories: z.number().nonnegative(),
    perfNorm: z.number(),
});
/** Fields shared by both correlation payloads (spec §18.2). */
const correlationPayloadFields = {
    /** Pearson correlation coefficient, -1..1. */
    r: z.number().min(-1).max(1),
    /** Number of paired (health, session) days behind `r`. */
    n: z.number().int().nonnegative(),
    /** Distinct ISO weeks those pairs span — the slide's §9.4.2 gate is >= 4. */
    weeksWindow: z.number().int().nonnegative(),
};
/**
 * The `phase_outlook` slide's action, narrowed to a phase change (spec §18.2).
 * The server RECONSTRUCTS it from the payload's own `from`/`to` rather than
 * accepting one from the device: it is what "Apply phase change" executes.
 */
export const PhaseChangeDiffSchema = z.object({
    kind: z.literal("phase_change"),
    from: ProgramPhaseSchema,
    to: ProgramPhaseSchema,
});
/**
 * The i18n key + params a phase-outlook `reason` was rendered from (#99). The
 * device uploads it in the snapshot, the server copies it into the slide
 * untouched, and the client renders it in the reader's locale.
 * `params.fromPhase` / `params.toPhase` are raw training-phase ids.
 */
export const PhaseOutlookReasonCopySchema = z.object({
    key: z.string().min(1).max(200),
    params: CopyParamsSchema.optional(),
    signals: z
        .array(z.object({ key: z.string().min(1).max(200), params: CopyParamsSchema.optional() }))
        .max(20)
        .optional(),
});
// ─── Slide payloads ─────────────────────────────────────────────────────────
export const WeekHeadlinePayloadSchema = z.object({
    sessionsCount: z.number().int().nonnegative(),
    totalVolumeKg: z.number().nonnegative(),
    /** FRACTION, not percent — 0.172 means 17.2%. */
    deltaPctVsLastWeek: z.number(),
    weekRangeLabel: z.string().min(1),
});
export const PrCelebrationPayloadSchema = z.object({
    count: z.number().int().nonnegative(),
    prs: z.array(PRItemSchema),
});
export const VolumeDeltaPayloadSchema = z.object({
    byMuscleGroup: z.array(VolumeRowSchema),
});
export const MuscleGroupBalancePayloadSchema = z.object({
    regions: z.array(MuscleGroupBalanceRegionSchema),
});
export const StandoutLiftPayloadSchema = z.object({
    canonicalExerciseId: z.string().min(1),
    name: z.string().min(1),
    /** FRACTION, not percent — 0.172 means 17.2%. */
    deltaPct4w: z.number(),
    e1rmCurrent: z.number().nonnegative(),
    e1rmFourWeeksAgo: z.number().nonnegative(),
    sessionsContributing: z.number().int().nonnegative(),
});
export const PlateauWatchPayloadSchema = z.object({
    canonicalExerciseId: z.string().min(1),
    name: z.string().min(1),
    weeksFlat: z.number().int().nonnegative(),
    lastTopSet: z.object({
        weightKg: loadWeightKgSchema,
        reps: z.number().int().nonnegative(),
    }),
    e1rmCurrent: z.number().nonnegative(),
    e1rmFourWeeksAgo: z.number().nonnegative(),
});
export const ConsistencyStreakPayloadSchema = z.object({
    kind: z.enum(["streak", "comeback"]),
    weeks: z.number().int().nonnegative(),
    lastSessionDate: z.string().min(1),
});
/** Device-computed (HealthKit / Health Connect never reach the server); arrives in the snapshot. */
export const SleepCorrelationPayloadSchema = z.object({
    ...correlationPayloadFields,
    points: z.array(SleepCorrelationPointSchema),
});
/** Device-computed; arrives in the snapshot. */
export const CalorieCorrelationPayloadSchema = z.object({
    ...correlationPayloadFields,
    points: z.array(CalorieCorrelationPointSchema),
});
/** `from`/`to` are ProgramPhases (what the block is doing), not training phases (the goal). */
export const PhaseOutlookPayloadSchema = z.object({
    from: ProgramPhaseSchema,
    to: ProgramPhaseSchema,
    /** English sentence: what the model reads, and what a client predating `reasonCopy` shows. */
    reason: z.string().min(1),
    reasonCopy: PhaseOutlookReasonCopySchema.optional(),
    suggestedDiff: PhaseChangeDiffSchema,
});
/**
 * The `rotation_switch` slide (#70): a SCHEDULED program + phase change,
 * announced the week before it lands. The device evaluates the rotation
 * against local civil dates and uploads this exact shape as the snapshot's
 * `rotationSwitch` rider; the server copies it into the slide unchanged.
 * `phase`/`fromPhase` are training phases (build/maintain/cut), not ProgramPhases.
 */
export const RotationSwitchPayloadSchema = z.object({
    entryId: z.string().min(1),
    programId: z.string().min(1).nullable(),
    /** Display name of the incoming block: program name, else label, else a fallback. */
    programName: z.string().min(1),
    phase: ProgramRotationPhaseSchema,
    fromPhase: ProgramRotationPhaseSchema,
    /** The active program the switch ends, or null when the lifter is freestyling. */
    endingProgramName: z.string().min(1).nullable(),
    startDate: localCivilDateSchema,
    endDate: localCivilDateSchema,
    /** The Monday the switch lands on (local ISO-week start). */
    switchDate: localCivilDateSchema,
});
export const NextWeekPreviewPayloadSchema = z.object({
    upcoming: z.array(NextWeekDaySchema),
    deloadInWeeks: z.number().int().nonnegative().optional(),
    jumpThresholdLifts: z.array(JumpLiftSchema),
});
/**
 * The model's freeform observation as the generation step RECEIVES it. NOT
 * what a deck stores — see `FreeformSlidePayloadSchema`.
 */
export const FreeformPayloadSchema = z.object({
    headline: z.string().min(1),
    body: z.string().min(1),
    confidence: z.enum(["high", "medium", "low"]),
    reasoning: z.string().min(1),
});
/**
 * The `freeform` slide payload as a deck STORES it: the server drops
 * `confidence`/`reasoning` (AI metadata the slide never renders) before
 * freezing, so only the reader-facing copy is persisted. This is the schema a
 * renderer parses a stored `freeform` slide with.
 */
export const FreeformSlidePayloadSchema = FreeformPayloadSchema.pick({ headline: true, body: true });
export const SparseDataNotePayloadSchema = z.object({
    weeksOfData: z.number().int().nonnegative(),
    sessionsTotal: z.number().int().nonnegative(),
});
/** The payload schema for each slide type, as the payload sits in a stored deck. */
export const SlidePayloadSchemas = {
    week_headline: WeekHeadlinePayloadSchema,
    pr_celebration: PrCelebrationPayloadSchema,
    volume_delta: VolumeDeltaPayloadSchema,
    muscle_group_balance: MuscleGroupBalancePayloadSchema,
    standout_lift: StandoutLiftPayloadSchema,
    plateau_watch: PlateauWatchPayloadSchema,
    consistency_streak: ConsistencyStreakPayloadSchema,
    sleep_correlation: SleepCorrelationPayloadSchema,
    calorie_correlation: CalorieCorrelationPayloadSchema,
    phase_outlook: PhaseOutlookPayloadSchema,
    rotation_switch: RotationSwitchPayloadSchema,
    next_week_preview: NextWeekPreviewPayloadSchema,
    freeform: FreeformSlidePayloadSchema,
    sparse_data_note: SparseDataNotePayloadSchema,
};
// ─── Week client snapshot (the Week row's `deterministicSnapshot`) ──────────
/**
 * The only snapshot version a reader accepts. Bump it whenever a snapshot
 * field is added, removed or changes meaning; a mismatched envelope degrades
 * to "no device-only slides" instead of a wrong slide.
 *
 * 3 — adds `rotationSwitch` (hollis-workouts#70).
 * 2 — adds `phaseOutlook` (hollis-workouts#79).
 * 1 — sleep / calorie correlations + jump-threshold lifts (hollis-workouts#13).
 */
export const WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION = 3;
/**
 * The device's phase-change suggestion. NOT the slide payload: `confidence`
 * is the server's gate input and is never rendered, and there is no
 * `suggestedDiff` because the server reconstructs it from `from`/`to`.
 */
export const WeekPhaseOutlookSchema = z.object({
    from: ProgramPhaseSchema,
    to: ProgramPhaseSchema,
    /** Human-readable reasoning from the periodization engine (English; what the model reads). */
    reason: z.string().min(1),
    /** The key + params `reason` was rendered from (#99). */
    reasonCopy: PhaseOutlookReasonCopySchema.optional(),
    /** 0..1 engine confidence. The server, not the device, owns the threshold. */
    confidence: z.number().min(0).max(1),
});
/** The rotation rider IS the `rotation_switch` slide payload. */
export const WeekRotationSwitchSchema = RotationSwitchPayloadSchema;
export const WeekClientSnapshotSchema = z.object({
    schemaVersion: z.literal(WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION),
    /** The ISO week this snapshot describes — must match the row it is written to. */
    weekIso: z.string().min(1),
    /** When the device computed it, ISO 8601. */
    capturedAt: z.string().min(1),
    sleepCorrelation: SleepCorrelationPayloadSchema.optional(),
    calorieCorrelation: CalorieCorrelationPayloadSchema.optional(),
    jumpThresholdLifts: z.array(JumpLiftSchema).optional(),
    phaseOutlook: WeekPhaseOutlookSchema.optional(),
    rotationSwitch: WeekRotationSwitchSchema.optional(),
});
// ─── Frozen deck (the Week row's `aiRetrospective`) ─────────────────────────
export const SUNDAY_REVIEW_MODEL_TIERS = ["flash", "pro", "image"];
export const SundayReviewModelTierSchema = z.enum(SUNDAY_REVIEW_MODEL_TIERS);
/**
 * i18n key + params for a narrative the SERVER composed deterministically
 * (#99). `narrative` keeps the English; the client renders this in the
 * reader's locale. Keys are a data format shared with the client's locale
 * bundles: reword freely, never rename.
 */
export const SundayReviewNarrativeCopySchema = z.object({
    key: z.string().min(1),
    params: CopyParamsSchema.optional(),
});
export const SundayReviewPersistedSlideSchema = z.object({
    id: z.string().min(1),
    /** Plain string on purpose (forward compatibility) — see the module header. */
    type: z.string().min(1),
    /** Parse with `SlidePayloadSchemas[type]` where it is rendered. */
    payload: z.unknown(),
    narrative: z.string(),
    /** Present only for a server-composed (fallback) narrative. */
    narrativeCopy: SundayReviewNarrativeCopySchema.optional(),
    /** Reserved; no writer today (threads are looked up by slide id). */
    threadId: z.string().min(1).optional(),
});
export const SundayReviewDeckSchema = z.object({
    generatedAt: z.string().min(1),
    modelTier: SundayReviewModelTierSchema,
    snapshotVersion: z.number().int().nonnegative(),
    slides: z.array(SundayReviewPersistedSlideSchema),
    deckOrdering: z.array(z.number().int().nonnegative()),
});
//# sourceMappingURL=workouts-sunday-review.js.map