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
export declare const WeekDocumentBodySchema: z.ZodObject<{
    deterministicSnapshot: z.ZodOptional<z.ZodUnknown>;
    aiRetrospective: z.ZodOptional<z.ZodUnknown>;
    userAnnotations: z.ZodOptional<z.ZodUnknown>;
    conversationUpdatedAt: z.ZodOptional<z.ZodString>;
    hasConversation: z.ZodOptional<z.ZodBoolean>;
    lastConversationThreadId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WeekDocumentBody = z.infer<typeof WeekDocumentBodySchema>;
export declare const WeekDocumentSchema: z.ZodObject<{
    deterministicSnapshot: z.ZodOptional<z.ZodUnknown>;
    aiRetrospective: z.ZodOptional<z.ZodUnknown>;
    userAnnotations: z.ZodOptional<z.ZodUnknown>;
    conversationUpdatedAt: z.ZodOptional<z.ZodString>;
    hasConversation: z.ZodOptional<z.ZodBoolean>;
    lastConversationThreadId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    weekIso: z.ZodString;
    createdAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type WeekDocument = z.infer<typeof WeekDocumentSchema>;
//# sourceMappingURL=workouts-weeks.d.ts.map