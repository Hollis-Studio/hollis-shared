/**
 * @ai-context Smart Assist Notes contracts | workout session notes, permanent notes, and aggregated context schemas
 */
import { z } from "zod";
/**
 * Valid AI note category values for permanent user context.
 */
export declare const AI_NOTE_CATEGORIES: readonly ["INJURY", "PREFERENCE", "LIMITATION", "MEDICAL", "GOAL", "OTHER"];
export type AINoteCategory = z.infer<typeof AINoteCategorySchema>;
export declare const AINoteCategorySchema: z.ZodEnum<{
    OTHER: "OTHER";
    INJURY: "INJURY";
    PREFERENCE: "PREFERENCE";
    LIMITATION: "LIMITATION";
    MEDICAL: "MEDICAL";
    GOAL: "GOAL";
}>;
/** Centralized AI note category constants for equality checks */
export declare const AI_NOTE_CATEGORY: {
    readonly INJURY: AINoteCategory;
    readonly PREFERENCE: AINoteCategory;
    readonly LIMITATION: AINoteCategory;
    readonly MEDICAL: AINoteCategory;
    readonly GOAL: AINoteCategory;
    readonly OTHER: AINoteCategory;
};
/** Human-readable labels for AI note categories */
export declare const AI_NOTE_CATEGORY_LABELS: Record<AINoteCategory, string>;
/**
 * Source type for AI permanent notes - distinguishes verified data from AI-generated.
 * Used to indicate trust level and origin of the note.
 */
export declare const AI_NOTE_SOURCE_TYPES: readonly ["AI_GENERATED", "COACH_OBSERVATION", "INTAKE_SEEDED", "CLINICIAN_VERIFIED"];
export type AINoteSourceType = z.infer<typeof AINoteSourceTypeSchema>;
export declare const AINoteSourceTypeSchema: z.ZodEnum<{
    AI_GENERATED: "AI_GENERATED";
    COACH_OBSERVATION: "COACH_OBSERVATION";
    INTAKE_SEEDED: "INTAKE_SEEDED";
    CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
}>;
/** Centralized AI note source type constants for equality checks */
export declare const AI_NOTE_SOURCE_TYPE: {
    readonly AI_GENERATED: AINoteSourceType;
    readonly COACH_OBSERVATION: AINoteSourceType;
    readonly INTAKE_SEEDED: AINoteSourceType;
    readonly CLINICIAN_VERIFIED: AINoteSourceType;
};
/** Human-readable labels for AI note source types */
export declare const AI_NOTE_SOURCE_TYPE_LABELS: Record<AINoteSourceType, string>;
/**
 * Check if a string is a valid AI note source type
 */
export declare function isAINoteSourceType(value: string): value is AINoteSourceType;
/**
 * Get the label for an AI note source type, with fallback
 */
export declare function getAINoteSourceTypeLabel(sourceType: string): string;
/**
 * Check if a string is a valid AI note category
 */
export declare function isAINoteCategory(value: string): value is AINoteCategory;
/**
 * Get the label for an AI note category, with fallback
 */
export declare function getAINoteCategoryLabel(category: string): string;
/**
 * Workout session notes - temporary context for specific workout sessions.
 * Used to capture user feedback, modifications, and observations during workouts.
 */
export declare const workoutSessionNoteSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodString;
    userId: z.ZodString;
    workoutPlanId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workoutDate: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export type WorkoutSessionNoteContract = z.infer<typeof workoutSessionNoteSchema>;
/**
 * Smart Assist permanent notes - long-term context about user preferences, limitations, and conditions.
 * Used by Smart Assist systems to personalize workout and diet recommendations.
 */
export declare const aiPermanentNoteSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodString;
    userId: z.ZodString;
    content: z.ZodString;
    category: z.ZodEnum<{
        OTHER: "OTHER";
        INJURY: "INJURY";
        PREFERENCE: "PREFERENCE";
        LIMITATION: "LIMITATION";
        MEDICAL: "MEDICAL";
        GOAL: "GOAL";
    }>;
    source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sourceType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        AI_GENERATED: "AI_GENERATED";
        COACH_OBSERVATION: "COACH_OBSERVATION";
        INTAKE_SEEDED: "INTAKE_SEEDED";
        CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
    }>>>;
}, z.core.$strip>;
export type AIPermanentNoteContract = z.infer<typeof aiPermanentNoteSchema>;
/**
 * Form-level schema for creating or editing a permanent note (PHI).
 * Used to validate the AddNoteModal form before API submission.
 * Intentionally excludes id, userId, category (handled separately in the modal).
 */
export declare const permanentNoteFormSchema: z.ZodObject<{
    content: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PermanentNoteFormInput = z.infer<typeof permanentNoteFormSchema>;
/**
 * Aggregated Smart Assist context for inference - combines relevant user data for processing.
 * This is the payload sent to Smart Assist services for personalized recommendations.
 */
export declare const aiContextSchema: z.ZodObject<{
    userId: z.ZodString;
    recentSessionNotes: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodString;
        userId: z.ZodString;
        workoutPlanId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workoutDate: z.ZodString;
        content: z.ZodString;
    }, z.core.$strip>>;
    permanentNotes: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodString;
        userId: z.ZodString;
        content: z.ZodString;
        category: z.ZodEnum<{
            OTHER: "OTHER";
            INJURY: "INJURY";
            PREFERENCE: "PREFERENCE";
            LIMITATION: "LIMITATION";
            MEDICAL: "MEDICAL";
            GOAL: "GOAL";
        }>;
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            AI_GENERATED: "AI_GENERATED";
            COACH_OBSERVATION: "COACH_OBSERVATION";
            INTAKE_SEEDED: "INTAKE_SEEDED";
            CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
        }>>>;
    }, z.core.$strip>>;
    clinicalLimitations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    medicalNotes: z.ZodOptional<z.ZodString>;
    goals: z.ZodOptional<z.ZodArray<z.ZodString>>;
    preferences: z.ZodOptional<z.ZodArray<z.ZodString>>;
    contextWindowDays: z.ZodNumber;
    generatedAt: z.ZodString;
}, z.core.$strip>;
export type AIContextContract = z.infer<typeof aiContextSchema>;
/**
 * Create a mock WorkoutSessionNoteContract for testing
 */
export declare const createMockWorkoutSessionNote: (overrides?: Partial<WorkoutSessionNoteContract>) => WorkoutSessionNoteContract;
/**
 * Create a mock AIPermanentNoteContract for testing
 */
export declare const createMockAIPermanentNote: (overrides?: Partial<AIPermanentNoteContract>) => AIPermanentNoteContract;
/**
 * Create a mock AIContextContract for testing
 */
export declare const createMockAIContext: (overrides?: Partial<AIContextContract>) => AIContextContract;
//# sourceMappingURL=ai-notes.d.ts.map