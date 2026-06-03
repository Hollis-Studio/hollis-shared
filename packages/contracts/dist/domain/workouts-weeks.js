/**
 * @ai-context Workouts week documents | WeekDocumentSchema, WeekDocumentBodySchema.
 *
 * deterministicSnapshot/aiRetrospective/userAnnotations are kept opaque (unknown)
 * because DeterministicSnapshotSchema imports app-local schemas and is too
 * coupled to the app layer to include in contracts. If wire-level structure
 * validation is needed, promote DeterministicSnapshotSchema to contracts later.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
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