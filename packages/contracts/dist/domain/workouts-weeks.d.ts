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