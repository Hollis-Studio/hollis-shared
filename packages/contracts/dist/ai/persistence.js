/**
 * @ai-context Workouts AI persistence entities | AiAuditLogEntrySchema,
 * SmartBuilderDraftPayloadSchema, PlateauCoachingArtifactSchema,
 * CancellationFeedbackSchema, AiTokenUsageSchema.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
// ===========================================================================
// AiAuditLog
// ===========================================================================
export const AI_AUDIT_LOG_SURFACES = [
    'sunday_review_phase_outlook', 'plateau_coaching', 'program_critique',
    'program_edit', 'goal_reasoning', 'pr_celebration', 'anomaly_label',
    'rest_day_pulse', 'smart_program_builder', 'smart_gym_setup',
    'sunday_review_freeform',
];
export const AiAuditLogSurfaceSchema = z.enum(AI_AUDIT_LOG_SURFACES);
export const AI_AUDIT_LOG_MODEL_TIERS = ['flash', 'pro', 'image'];
export const AiAuditLogModelTierSchema = z.enum(AI_AUDIT_LOG_MODEL_TIERS);
export const AI_AUDIT_LOG_ACTIONS = [
    'auto_applied', 'user_applied', 'user_dismissed', 'user_overrode',
];
export const AiAuditLogActionSchema = z.enum(AI_AUDIT_LOG_ACTIONS);
// POST request body (id and timestamp are server-assigned; userId from token)
export const AiAuditLogCreateSchema = z.object({
    surface: AiAuditLogSurfaceSchema,
    modelTier: AiAuditLogModelTierSchema,
    snapshotRef: z.string().optional(),
    action: AiAuditLogActionSchema,
    persisted: z.boolean(),
    sourceRef: z.unknown().refine((v) => v !== null && v !== undefined, 'sourceRef required'),
    snapshotInline: z.unknown().optional(),
    aiOutput: z.unknown().refine((v) => v !== null && v !== undefined, 'aiOutput required'),
    diff: z.unknown().optional(),
    /**
     * Stable client-generated idempotency key (UUID). The client sends the SAME
     * key on every outbox retry of one logical append, so the server can dedup
     * (upsert on (userId, clientIdempotencyKey)) and an immutable audit entry is
     * never duplicated by at-least-once outbox delivery. Optional: legacy clients
     * and one-shot appends may omit it, in which case the server falls back to a
     * plain create. Never echoed in the GET/POST response record.
     */
    clientIdempotencyKey: z.string().uuid().optional(),
});
// GET/POST response record (userId and clientIdempotencyKey not echoed to client —
// the idempotency key is a write-time dedup hint, not part of the durable record).
export const AiAuditLogEntrySchema = AiAuditLogCreateSchema.omit({
    clientIdempotencyKey: true,
}).extend({
    id: z.string().min(1),
    timestamp: z.coerce.date(),
});
// ===========================================================================
// SmartBuilderDraft
// ===========================================================================
const SmartBuilderConversationTurnSchema = z.object({
    role: z.enum(['user', 'assistant']),
    // Mirrors the wire ConversationMessageSchema.content cap. Deliberately 24k
    // rather than the 4000 response-message cap: verbose assistant replies
    // written before that cap existed may already sit in stored drafts.
    content: z.string().max(24_000),
    timestamp: z.number().finite().nonnegative(),
});
/**
 * The persisted draft payload blob (stored in a Prisma Json column).
 *
 * The bounds below are WRITE-SIDE HYGIENE only — they cap what a client may
 * newly persist. The server's GET route must safeParse-quarantine a stored row
 * and never throw on it: rows written before these bounds existed may violate
 * them, and a hard parse would make an old draft unreadable forever.
 *
 * `phase` (including the converse-era 'conversing'), `questionGroups`, and
 * `currentProgram` stay permissive for exactly that reason — converse-era rows
 * are still in the database even though the flow is retired from the wire.
 */
/**
 * A standing instruction the user gave mid-conversation that the builder
 * agent holds explicitly and re-injects into every model request so the
 * client-side history trim cannot drop it (workouts #60c, 2026-08-19).
 * `id` is content-derived on the client, so restating a rule is idempotent.
 */
export const SmartBuilderPinnedConstraintSchema = z.object({
    id: z.string().min(1).max(64),
    /** The instruction as the user phrased it. */
    text: z.string().min(1).max(1000),
    /** Truncated display form for the chip UI. */
    label: z.string().min(1).max(120),
    kind: z.enum(['prohibition', 'preference', 'limitation', 'schedule']),
    pinnedAt: z.number().finite().nonnegative(), // epoch-ms
});
export const SmartBuilderDraftPayloadSchema = z.object({
    conversationHistory: z.array(SmartBuilderConversationTurnSchema).max(50),
    currentProgram: z.unknown(),
    phase: z.enum(['input', 'conversing', 'generating', 'preview', 'refining']),
    questionGroups: z.unknown().optional(),
    // Stores a response `message`, so it shares the wire's 4000-char cap.
    readyMessage: z.string().max(4000).nullable().optional(),
    selectedGymId: z.string().nullable().optional(),
    userAnswers: z.record(z.string(), z.union([z.string().max(1000), z.number(), z.boolean()])),
    /**
     * Optional for back-compat (rows and clients predate it, alpha.51). NOTE:
     * because this schema strips unknown keys, a client OLDER than alpha.51
     * that round-trips a draft will silently drop another device's pins — the
     * client must treat pins as device-authoritative until its own contracts
     * pin is >= alpha.51.
     */
    pinnedConstraints: z.array(SmartBuilderPinnedConstraintSchema).max(20).optional(),
    createdAt: z.number().finite().nonnegative(), // epoch-ms inside blob
    updatedAt: z.number().finite().nonnegative(), // epoch-ms inside blob
});
// PUT request body envelope
export const SmartBuilderDraftUpsertSchema = z.object({
    payload: SmartBuilderDraftPayloadSchema,
    createdAt: z.coerce.date().optional(),
});
// GET/PUT response record
export const SmartBuilderDraftRecordSchema = z.object({
    userId: z.string().min(1),
    payload: SmartBuilderDraftPayloadSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
// DELETE response ack (idempotent — `deleted: true` whether or not a draft
// existed). Closes the last inline-Zod ack on the Workouts draft routes.
export const SmartBuilderDraftDeleteAckSchema = z.object({
    deleted: z.literal(true),
});
// ===========================================================================
// PlateauCoachingArtifact
// ===========================================================================
export const PlateauCoachingTokenCountSchema = z.object({
    input: z.number().int().nonnegative().optional(),
    output: z.number().int().nonnegative().optional(),
}).nullable();
// PUT/POST request body (id from URL param, not body)
// rootCauses/recommendations: nullable in request (null normalized to [] server-side)
export const PlateauCoachingArtifactCreateSchema = z.object({
    exerciseId: z.string().min(1).max(512),
    detectedAt: z.coerce.date(),
    narrative: z.string().min(1),
    rootCauses: z.array(z.string().min(1)).nullable(),
    recommendations: z.array(z.string().min(1)).nullable(),
    dismissedAt: z.coerce.date().nullable().optional(),
    tokenCount: PlateauCoachingTokenCountSchema.optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});
// GET/PUT response record (rootCauses/recommendations non-nullable in Postgres)
export const PlateauCoachingArtifactSchema = z.object({
    id: z.string().min(1),
    exerciseId: z.string().min(1),
    detectedAt: z.coerce.date(),
    narrative: z.string().min(1),
    rootCauses: z.array(z.string()),
    recommendations: z.array(z.string()),
    dismissedAt: z.coerce.date().nullable(),
    tokenCount: PlateauCoachingTokenCountSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable().optional(),
});
// ===========================================================================
// CancellationFeedback
// ===========================================================================
export const CANCELLATION_FEEDBACK_OPTIONS = [
    'too_expensive', 'not_using_smart_features', 'found_different_app',
    'taking_break', 'something_else',
];
export const CancellationFeedbackOptionSchema = z.enum(CANCELLATION_FEEDBACK_OPTIONS);
// POST request body (id and createdAt are server-assigned)
export const CancellationFeedbackCreateSchema = z.object({
    option: CancellationFeedbackOptionSchema,
    detail: z.string().min(1).max(1000).nullable().optional(),
});
// GET/POST response record (no updatedAt — records are immutable)
export const CancellationFeedbackSchema = z.object({
    id: z.string().min(1),
    option: CancellationFeedbackOptionSchema,
    detail: z.string().nullable(),
    createdAt: z.coerce.date(),
});
// ===========================================================================
// AiTokenUsage
// ===========================================================================
export const AiTokenUsageMonthSchema = z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/, 'month must be yyyy-mm');
// PUT /:month request body (merge semantics — additive, not replace).
// Legacy clients send a flat `feature → number` map; still accepted.
export const AiTokenUsageUpsertSchema = z.object({
    tokens: z.record(z.string().min(1).max(64), z.number().int().nonnegative()),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});
// Enriched per-feature usage shape (v2). Server records input/output split,
// call counts, and per-model breakdown. Legacy rows store a bare `number`
// (cumulative total) per feature; readers must normalize both shapes.
//
// TOKEN-CLASS FIELDS (workouts #62). Everything beyond input/output is optional
// for back-compat: alpha.51 added the cache/audio counters, alpha.58 added
// `imageInput` and `longContext`. Readers treat a missing field as 0. Together
// they mirror every dimension the price table in ./pricing.ts can charge apart,
// so a recorded row can be repriced exactly instead of being flattened onto the
// plain input rate.
//
// SUBSET INVARIANT: `cachedInput`, `audioInput`, `cachedAudioInput` and
// `imageInput` are SUBSETS of `input`, never extra tokens beside it. `input`
// keeps meaning the provider's `promptTokenCount` for every row ever written,
// so `total`, the admin rollups, and pre-alpha.51 rows all keep one consistent
// meaning; the class fields only say how that prompt broke down. The first
// three are mutually exclusive; `imageInput` lives inside the plain (non-cached,
// non-audio) remainder, because Gemini prices image and video at the text input
// rate and it is recorded for ATTRIBUTION (which surface burns media tokens),
// not to change a number.
//
// NOT MODELLED: context-cache STORAGE token-hours. ./pricing.ts can charge that
// dimension, but nothing in Workouts creates an explicit cache
// (`caches.create`) — every cache hit recorded here comes from Gemini's
// IMPLICIT caching, which bills no storage. Adding a persisted counter now
// would be a field guaranteed to be 0. `RecordedUsageCounts` in ./pricing.ts
// still accepts `cacheStorageTokenHours` so an explicit-cache path can be
// priced the day it ships.
const aiTokenClassShape = {
    /** Prompt tokens served from context cache (text / image / video). */
    cachedInput: z.number().int().nonnegative().optional(),
    /** Non-cached AUDIO prompt tokens, where the model prices audio apart. */
    audioInput: z.number().int().nonnegative().optional(),
    /** Audio prompt tokens served from context cache. */
    cachedAudioInput: z.number().int().nonnegative().optional(),
    /** Non-cached IMAGE / VIDEO prompt tokens. Attribution only — priced as input. */
    imageInput: z.number().int().nonnegative().optional(),
};
// The slice of an entry contributed by calls whose OWN prompt crossed the
// model's long-context threshold (`longContextThresholdTokens` in ./pricing.ts;
// 200k on gemini-3.1-pro-preview, the only tiered model today).
//
// This has to be decided at record time and carried, because the >200k step is
// a per-REQUEST property: a month of ordinary calls sums past 200k without any
// single prompt doing so, and pricing an aggregate as long-context on that
// basis would over-charge by up to 2x. Every field is a subset of the
// same-named field on the parent entry.
export const AiLongContextUsageSchema = z.object({
    input: z.number().int().nonnegative(),
    output: z.number().int().nonnegative(),
    cachedInput: z.number().int().nonnegative().optional(),
    audioInput: z.number().int().nonnegative().optional(),
    cachedAudioInput: z.number().int().nonnegative().optional(),
});
export const AiFeatureModelUsageSchema = z.object({
    input: z.number().int().nonnegative(),
    output: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    calls: z.number().int().nonnegative(),
    ...aiTokenClassShape,
    longContext: AiLongContextUsageSchema.optional(),
});
export const AiFeatureUsageSchema = z.object({
    input: z.number().int().nonnegative(),
    output: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    calls: z.number().int().nonnegative(),
    ...aiTokenClassShape,
    longContext: AiLongContextUsageSchema.optional(),
    byModel: z.record(z.string(), AiFeatureModelUsageSchema).default({}),
});
// A stored token value is either a legacy bare total (number) or the enriched
// object. The union keeps reads back-compatible with rows written before v2.
export const AiTokenValueSchema = z.union([
    z.number().nonnegative(),
    AiFeatureUsageSchema,
]);
// GET/PUT response record (userId not echoed to client)
export const AiTokenUsageSchema = z.object({
    id: z.string().min(1),
    month: AiTokenUsageMonthSchema,
    tokens: z.record(z.string(), AiTokenValueSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
// ===========================================================================
// AiTokenUsage — admin cross-user summary (GET /v1/ai-token-usage/admin/summary)
// ===========================================================================
// Query: optional month filter ("yyyy-mm"); omit for all-time.
export const AiTokenUsageAdminQuerySchema = z.object({
    month: AiTokenUsageMonthSchema.optional(),
});
// Every rollup below carries the same token-class breakdown as the recorded
// row (workouts #62) plus a server-computed `costUsd`. Before alpha.58 the
// rollups carried only input/output, so the admin "All users" view had to price
// every cached token at the flat input rate — the one place cost telemetry was
// still knowingly wrong after the recording half shipped. Cost is computed
// SERVER-SIDE with estimateUsageCostUsd from ./pricing.ts because only the
// server holds the per-(feature, model) split that pricing needs; a client
// pricing a feature rollup could only guess a model.
const aiRollupCountsShape = {
    input: z.number().int().nonnegative(),
    output: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    calls: z.number().int().nonnegative(),
    ...aiTokenClassShape,
    longContext: AiLongContextUsageSchema.optional(),
    /** USD estimate for this rollup, priced per model across every token class. */
    costUsd: z.number().nonnegative(),
};
const AiUsageTotalsSchema = z.object({
    ...aiRollupCountsShape,
    users: z.number().int().nonnegative(),
});
export const AiTokenUsageFeatureRollupSchema = z.object({
    feature: z.string(),
    ...aiRollupCountsShape,
    users: z.number().int().nonnegative(),
});
export const AiTokenUsageModelRollupSchema = z.object({
    model: z.string(),
    ...aiRollupCountsShape,
    users: z.number().int().nonnegative(),
});
// The (feature x model) cell — the grain the unit-economics decision register
// asks for ("track cost by uid + feature + model + input + cachedInput +
// output + image/audio count"). byFeature and byModel are its margins; neither
// alone can answer "which surface is expensive ON WHICH MODEL".
export const AiTokenUsageFeatureModelRollupSchema = z.object({
    feature: z.string(),
    model: z.string(),
    ...aiRollupCountsShape,
    users: z.number().int().nonnegative(),
});
export const AiTokenUsageAccountRollupSchema = z.object({
    userId: z.string(),
    ...aiRollupCountsShape,
    lastActiveMonth: AiTokenUsageMonthSchema.nullable(),
});
export const AiTokenUsageAdminSummarySchema = z.object({
    // Null month = all-time; otherwise the filtered "yyyy-mm".
    month: AiTokenUsageMonthSchema.nullable(),
    totals: AiUsageTotalsSchema,
    byFeature: z.array(AiTokenUsageFeatureRollupSchema),
    byModel: z.array(AiTokenUsageModelRollupSchema),
    byFeatureModel: z.array(AiTokenUsageFeatureModelRollupSchema).default([]),
    topAccounts: z.array(AiTokenUsageAccountRollupSchema),
    // How many (userId, month) rows were aggregated, and whether the scan was
    // capped (so the UI can warn instead of implying full coverage).
    rowsScanned: z.number().int().nonnegative(),
    truncated: z.boolean(),
    generatedAt: z.coerce.date(),
});
//# sourceMappingURL=persistence.js.map