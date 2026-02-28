/**
 * @ai-context Smart Assist Notes contracts | workout session notes, permanent notes, and aggregated context schemas
 */
import { z } from "zod";
import {
    baseDocumentSchema,
    isoDateSchema,
    isoTimestampSchema,
} from "./common";

// ============================================================================
// AI NOTE CATEGORIES
// ============================================================================

/**
 * Valid AI note category values for permanent user context.
 */
export const AI_NOTE_CATEGORIES = [
  "INJURY",
  "PREFERENCE",
  "LIMITATION",
  "MEDICAL",
  "GOAL",
  "OTHER",
] as const;

export type AINoteCategory = z.infer<typeof AINoteCategorySchema>;

export const AINoteCategorySchema = z.enum(AI_NOTE_CATEGORIES);

/** Centralized AI note category constants for equality checks */
export const AI_NOTE_CATEGORY = {
  INJURY: "INJURY" as AINoteCategory,
  PREFERENCE: "PREFERENCE" as AINoteCategory,
  LIMITATION: "LIMITATION" as AINoteCategory,
  MEDICAL: "MEDICAL" as AINoteCategory,
  GOAL: "GOAL" as AINoteCategory,
  OTHER: "OTHER" as AINoteCategory,
} as const;

/** Human-readable labels for AI note categories */
export const AI_NOTE_CATEGORY_LABELS: Record<AINoteCategory, string> = {
  INJURY: "Injury",
  PREFERENCE: "Preference",
  LIMITATION: "Limitation",
  MEDICAL: "Medical",
  GOAL: "Goal",
  OTHER: "Other",
};

// ============================================================================
// AI NOTE SOURCE TYPES
// ============================================================================

/**
 * Source type for AI permanent notes - distinguishes verified data from AI-generated.
 * Used to indicate trust level and origin of the note.
 */
export const AI_NOTE_SOURCE_TYPES = [
  "AI_GENERATED",
  "COACH_OBSERVATION",
  "INTAKE_SEEDED",
  "CLINICIAN_VERIFIED",
] as const;

export type AINoteSourceType = z.infer<typeof AINoteSourceTypeSchema>;

export const AINoteSourceTypeSchema = z.enum(AI_NOTE_SOURCE_TYPES);

/** Centralized AI note source type constants for equality checks */
export const AI_NOTE_SOURCE_TYPE = {
  AI_GENERATED: "AI_GENERATED" as AINoteSourceType,
  COACH_OBSERVATION: "COACH_OBSERVATION" as AINoteSourceType,
  INTAKE_SEEDED: "INTAKE_SEEDED" as AINoteSourceType,
  CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED" as AINoteSourceType,
} as const;

/** Human-readable labels for AI note source types */
export const AI_NOTE_SOURCE_TYPE_LABELS: Record<AINoteSourceType, string> = {
  AI_GENERATED: "AI Generated",
  COACH_OBSERVATION: "Coach Observation",
  INTAKE_SEEDED: "Intake Form",
  CLINICIAN_VERIFIED: "Clinician Verified",
};

/**
 * Check if a string is a valid AI note source type
 */
export function isAINoteSourceType(value: string): value is AINoteSourceType {
  return (AI_NOTE_SOURCE_TYPES as readonly string[]).includes(value);
}

/**
 * Get the label for an AI note source type, with fallback
 */
export function getAINoteSourceTypeLabel(sourceType: string): string {
  if (isAINoteSourceType(sourceType)) {
    return AI_NOTE_SOURCE_TYPE_LABELS[sourceType];
  }
  return sourceType;
}

/**
 * Check if a string is a valid AI note category
 */
export function isAINoteCategory(value: string): value is AINoteCategory {
  return (AI_NOTE_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Get the label for an AI note category, with fallback
 */
export function getAINoteCategoryLabel(category: string): string {
  if (isAINoteCategory(category)) {
    return AI_NOTE_CATEGORY_LABELS[category];
  }
  return category;
}

// ============================================================================
// WORKOUT SESSION NOTE
// ============================================================================

/**
 * Workout session notes - temporary context for specific workout sessions.
 * Used to capture user feedback, modifications, and observations during workouts.
 */
export const workoutSessionNoteSchema = baseDocumentSchema.extend({
  id: z.string(),
  userId: z.string(),
  workoutPlanId: z.string().nullable().optional(),
  workoutDate: isoDateSchema,
  content: z.string().min(1),
});
export type WorkoutSessionNoteContract = z.infer<
  typeof workoutSessionNoteSchema
>;

// ============================================================================
// SMART ASSIST PERMANENT NOTE
// ============================================================================

/**
 * Smart Assist permanent notes - long-term context about user preferences, limitations, and conditions.
 * Used by Smart Assist systems to personalize workout and diet recommendations.
 */
export const aiPermanentNoteSchema = baseDocumentSchema.extend({
  id: z.string(),
  userId: z.string(),
  content: z.string().min(1),
  category: AINoteCategorySchema,
  source: z.string().nullable().optional(),
  sourceType: AINoteSourceTypeSchema.nullable().optional(),
});
export type AIPermanentNoteContract = z.infer<typeof aiPermanentNoteSchema>;

/**
 * Form-level schema for creating or editing a permanent note (PHI).
 * Used to validate the AddNoteModal form before API submission.
 * Intentionally excludes id, userId, category (handled separately in the modal).
 */
export const permanentNoteFormSchema = z.object({
  content: z.string().trim().min(1, "Note content is required").max(50000),
  source: z.string().trim().max(200).optional(),
});
export type PermanentNoteFormInput = z.infer<typeof permanentNoteFormSchema>;

// ============================================================================
// SMART ASSIST CONTEXT (AGGREGATED)
// ============================================================================

/**
 * Aggregated Smart Assist context for inference - combines relevant user data for processing.
 * This is the payload sent to Smart Assist services for personalized recommendations.
 */
export const aiContextSchema = z.object({
  userId: z.string(),
  recentSessionNotes: z.array(workoutSessionNoteSchema),
  permanentNotes: z.array(aiPermanentNoteSchema),
  clinicalLimitations: z.array(z.string()).optional(),
  medicalNotes: z.string().optional(),
  goals: z.array(z.string()).optional(),
  preferences: z.array(z.string()).optional(),
  contextWindowDays: z.number().int().min(1),
  generatedAt: isoTimestampSchema,
});
export type AIContextContract = z.infer<typeof aiContextSchema>;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();
const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Create a mock WorkoutSessionNoteContract for testing
 */
export const createMockWorkoutSessionNote = (
  overrides: Partial<WorkoutSessionNoteContract> = {},
): WorkoutSessionNoteContract => {
  const timestamp = nowIso();
  return {
    id:
      overrides.id ?? `session-note-${Math.random().toString(36).slice(2, 8)}`,
    userId: overrides.userId ?? "mock-user",
    workoutPlanId: overrides.workoutPlanId,
    workoutDate: overrides.workoutDate ?? todayIso(),
    content:
      overrides.content ??
      "Felt good during squats, increased weight by 10lbs.",
    createdAt: overrides.createdAt ?? timestamp,
    updatedAt: overrides.updatedAt ?? timestamp,
  };
};

/**
 * Create a mock AIPermanentNoteContract for testing
 */
export const createMockAIPermanentNote = (
  overrides: Partial<AIPermanentNoteContract> = {},
): AIPermanentNoteContract => {
  const timestamp = nowIso();
  return {
    id:
      overrides.id ??
      `permanent-note-${Math.random().toString(36).slice(2, 8)}`,
    userId: overrides.userId ?? "mock-user",
    content:
      overrides.content ??
      "User has a previous rotator cuff injury on the left shoulder.",
    category: overrides.category ?? AI_NOTE_CATEGORY.INJURY,
    source: overrides.source ?? "Workout session on 2025-01-15",
    createdAt: overrides.createdAt ?? timestamp,
    updatedAt: overrides.updatedAt ?? timestamp,
  };
};

/**
 * Create a mock AIContextContract for testing
 */
export const createMockAIContext = (
  overrides: Partial<AIContextContract> = {},
): AIContextContract => {
  const timestamp = nowIso();
  return {
    userId: overrides.userId ?? "mock-user",
    recentSessionNotes: overrides.recentSessionNotes ?? [
      createMockWorkoutSessionNote(),
    ],
    permanentNotes: overrides.permanentNotes ?? [
      createMockAIPermanentNote({ category: AI_NOTE_CATEGORY.INJURY }),
      createMockAIPermanentNote({
        category: AI_NOTE_CATEGORY.PREFERENCE,
        content: "Prefers morning workouts before 8am.",
      }),
    ],
    clinicalLimitations: overrides.clinicalLimitations ?? [
      "Lower back sensitivity",
    ],
    medicalNotes: overrides.medicalNotes ?? "No current medications.",
    goals: overrides.goals ?? [
      "Build lean muscle",
      "Improve cardiovascular endurance",
    ],
    preferences: overrides.preferences ?? [
      "Prefers free weights over machines",
    ],
    contextWindowDays: overrides.contextWindowDays ?? 7,
    generatedAt: overrides.generatedAt ?? timestamp,
  };
};
