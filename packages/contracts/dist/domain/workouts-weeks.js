/**
 * @ai-context Workouts week documents | WeekDocumentSchema, WeekDocumentBodySchema.
 *
 * deterministicSnapshot/aiRetrospective/userAnnotations stay opaque (unknown)
 * at this level on purpose: rows written before their shapes existed hold
 * other content, the server's single-row read parses every response through
 * WeekDocumentSchema, and the client's synced collection validates every row
 * with it — typing the slots here would turn one legacy row into a 500 and a
 * quarantined week. The real shapes live in ./workouts-sunday-review
 * (WeekClientSnapshotSchema for deterministicSnapshot, SundayReviewDeckSchema
 * for aiRetrospective); consumers parse the slot with them where they use it.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import * as z from 'zod';
export const WeekDocumentBodySchema = z.object({
    deterministicSnapshot: z.unknown().optional(),
    aiRetrospective: z.unknown().optional(),
    userAnnotations: z.unknown().optional(),
    conversationUpdatedAt: z.string().datetime().optional(),
    hasConversation: z.boolean().optional(),
    lastConversationThreadId: z.string().optional(),
});
export const WeekDocumentSchema = WeekDocumentBodySchema.extend({
    id: z.string().min(1), // synthetic: server sets id = weekIso
    weekIso: z.string().regex(/^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});
//# sourceMappingURL=workouts-weeks.js.map