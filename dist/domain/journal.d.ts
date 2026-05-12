/**
 * @ai-context Journal domain contracts | journal entries and AI assessments
 *
 * This module provides the canonical definitions for journal-related types:
 * - Journal moods and energy levels
 * - Journal entries with metadata
 * - AI assessment contracts for journal analysis
 *
 * IMPORTANT: All journal-related types MUST be imported from here.
 *
 * deps: zod, common.ts | consumers: all codebases
 */
import { z } from "zod";
export declare const JOURNAL_MOODS: readonly ["very_negative", "negative", "neutral", "positive", "very_positive"];
export type JournalMood = z.infer<typeof JournalMoodSchema>;
export declare const JournalMoodSchema: z.ZodEnum<{
    very_negative: "very_negative";
    negative: "negative";
    neutral: "neutral";
    positive: "positive";
    very_positive: "very_positive";
}>;
export declare const JOURNAL_MOOD_LABELS: Record<JournalMood, string>;
export declare const JOURNAL_ENERGIES: readonly ["very_low", "low", "medium", "high", "very_high"];
export type JournalEnergy = z.infer<typeof JournalEnergySchema>;
export declare const JournalEnergySchema: z.ZodEnum<{
    low: "low";
    high: "high";
    medium: "medium";
    very_low: "very_low";
    very_high: "very_high";
}>;
export declare const JOURNAL_ENERGY_LABELS: Record<JournalEnergy, string>;
/** Canonical allowed values for the plan-adherence UI button group. */
export declare const PLAN_ADHERENCE_VALUES: readonly ["Yes", "Mostly", "No"];
export declare const PlanAdherenceSchema: z.ZodEnum<{
    Yes: "Yes";
    Mostly: "Mostly";
    No: "No";
}>;
/** UI-facing plan adherence answer (maps to numeric 1-3 before persistence). */
export type PlanAdherence = z.infer<typeof PlanAdherenceSchema>;
/**
 * Zod schema for the daily check-in form before any contract mapping.
 * Validated in the feature layer (useDailyCheckIn) on submit.
 */
export declare const dailyCheckInFormSchema: z.ZodObject<{
    planAdherence: z.ZodEnum<{
        Yes: "Yes";
        Mostly: "Mostly";
        No: "No";
    }>;
    energyLevel: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DailyCheckInFormInput = z.infer<typeof dailyCheckInFormSchema>;
export declare const journalAIAssessmentSchema: z.ZodObject<{
    summary: z.ZodString;
    themes: z.ZodArray<z.ZodString>;
    sentimentScore: z.ZodNumber;
    recommendedActions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type JournalAIAssessment = z.infer<typeof journalAIAssessmentSchema>;
export type JournalAIAssessmentContract = z.infer<typeof journalAIAssessmentSchema>;
export declare const journalEntrySchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    entryDate: z.ZodString;
    content: z.ZodString;
    mood: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        very_negative: "very_negative";
        negative: "negative";
        neutral: "neutral";
        positive: "positive";
        very_positive: "very_positive";
    }>>>>;
    energy: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        low: "low";
        high: "high";
        medium: "medium";
        very_low: "very_low";
        very_high: "very_high";
    }>>>>;
    stressLevel: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    planAdherence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    motivation: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    aiAssessment: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        summary: z.ZodString;
        themes: z.ZodArray<z.ZodString>;
        sentimentScore: z.ZodNumber;
        recommendedActions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>>;
    attachments: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export type JournalEntryContract = z.infer<typeof journalEntrySchema>;
/**
 * Canonical paginated journal list response.
 * Shape: { data: JournalEntryContract[], pagination: PaginationMeta }
 */
export declare const journalListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        entryDate: z.ZodString;
        content: z.ZodString;
        mood: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            very_negative: "very_negative";
            negative: "negative";
            neutral: "neutral";
            positive: "positive";
            very_positive: "very_positive";
        }>>>>;
        energy: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            low: "low";
            high: "high";
            medium: "medium";
            very_low: "very_low";
            very_high: "very_high";
        }>>>>;
        stressLevel: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        planAdherence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        motivation: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        aiAssessment: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            summary: z.ZodString;
            themes: z.ZodArray<z.ZodString>;
            sentimentScore: z.ZodNumber;
            recommendedActions: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>>;
        attachments: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type JournalListResponse = z.infer<typeof journalListResponseSchema>;
/**
 * Client-side form validation schema for journal entry input.
 * Slider values (mood, energy, stress, motivation) are raw 1–10 integers;
 * they are mapped to domain enum values before submission.
 * Bounds match server-side validation in server/src/validation/journal.ts.
 */
export declare const journalEntryFormSchema: z.ZodObject<{
    content: z.ZodString;
    mood: z.ZodOptional<z.ZodNumber>;
    energy: z.ZodOptional<z.ZodNumber>;
    stress: z.ZodOptional<z.ZodNumber>;
    motivation: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type JournalEntryFormInput = z.infer<typeof journalEntryFormSchema>;
export declare const createMockJournalAIAssessment: (overrides?: Partial<JournalAIAssessmentContract>) => JournalAIAssessmentContract;
export declare const createMockJournalEntry: (overrides?: Partial<JournalEntryContract>) => JournalEntryContract;
//# sourceMappingURL=journal.d.ts.map