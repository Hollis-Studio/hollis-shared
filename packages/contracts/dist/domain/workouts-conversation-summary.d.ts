/**
 * @ai-context Workouts conversation rolling summary | ConversationRollingSummarySchema,
 * ConversationRollingSummaryBodySchema, ConversationRollingSummaryEntrySchema.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
export declare const ConversationRollingSummaryEntrySchema: z.ZodObject<{
    weekIso: z.ZodString;
    summary: z.ZodString;
    retainedFacts: z.ZodArray<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type ConversationRollingSummaryEntry = z.infer<typeof ConversationRollingSummaryEntrySchema>;
export declare const ConversationRollingSummaryBodySchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        weekIso: z.ZodString;
        summary: z.ZodString;
        retainedFacts: z.ZodArray<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ConversationRollingSummaryBody = z.infer<typeof ConversationRollingSummaryBodySchema>;
export declare const ConversationRollingSummarySchema: z.ZodObject<{
    userId: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        weekIso: z.ZodString;
        summary: z.ZodString;
        retainedFacts: z.ZodArray<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type ConversationRollingSummary = z.infer<typeof ConversationRollingSummarySchema>;
//# sourceMappingURL=workouts-conversation-summary.d.ts.map