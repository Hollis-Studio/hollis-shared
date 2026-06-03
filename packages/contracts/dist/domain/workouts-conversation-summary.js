/**
 * @ai-context Workouts conversation rolling summary | ConversationRollingSummarySchema,
 * ConversationRollingSummaryBodySchema, ConversationRollingSummaryEntrySchema.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
export const ConversationRollingSummaryEntrySchema = z.object({
    weekIso: z.string().regex(/^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/),
    summary: z.string(),
    retainedFacts: z.array(z.string()),
    createdAt: z.string().datetime(),
});
// PUT body (server manages userId and updatedAt)
export const ConversationRollingSummaryBodySchema = z.object({
    entries: z.array(ConversationRollingSummaryEntrySchema),
    updatedAt: z.string().datetime().optional(),
});
// GET response
export const ConversationRollingSummarySchema = z.object({
    userId: z.string().min(1),
    entries: z.array(ConversationRollingSummaryEntrySchema),
    updatedAt: z.coerce.date(),
});
//# sourceMappingURL=workouts-conversation-summary.js.map