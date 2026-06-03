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
});
// GET/POST response record (userId not echoed to client)
export const AiAuditLogEntrySchema = AiAuditLogCreateSchema.extend({
    id: z.string().min(1),
    timestamp: z.coerce.date(),
});
// ===========================================================================
// SmartBuilderDraft
// ===========================================================================
const SmartBuilderConversationTurnSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.number().finite().nonnegative(),
});
// The persisted draft payload blob (stored in Prisma Json column)
export const SmartBuilderDraftPayloadSchema = z.object({
    conversationHistory: z.array(SmartBuilderConversationTurnSchema),
    currentProgram: z.unknown(),
    phase: z.enum(['input', 'conversing', 'generating', 'preview', 'refining']),
    questionGroups: z.unknown().optional(),
    readyMessage: z.string().nullable().optional(),
    selectedGymId: z.string().nullable().optional(),
    userAnswers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
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
// PUT /:month request body (merge semantics — additive, not replace)
export const AiTokenUsageUpsertSchema = z.object({
    tokens: z.record(z.string().min(1).max(64), z.number().int().nonnegative()),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});
// GET/PUT response record (userId not echoed to client)
export const AiTokenUsageSchema = z.object({
    id: z.string().min(1),
    month: AiTokenUsageMonthSchema,
    tokens: z.record(z.string(), z.number()),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
//# sourceMappingURL=persistence.js.map