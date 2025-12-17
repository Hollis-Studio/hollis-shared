/**
 * @ai-context Smart Assist Notes contracts | workout session notes, permanent notes, and aggregated context schemas
 */
import { z } from 'zod';
import { baseDocumentSchema, isoDateSchema, IsoDateString, isoTimestampSchema, IsoTimestampString } from './common';

// ============================================================================
// AI NOTE CATEGORIES
// ============================================================================

/**
 * Valid AI note category values for permanent user context.
 */
export const AI_NOTE_CATEGORIES = [
  'INJURY',
  'PREFERENCE',
  'LIMITATION',
  'MEDICAL',
  'GOAL',
  'OTHER',
] as const;

export type AINoteCategory = (typeof AI_NOTE_CATEGORIES)[number];

export const AINoteCategorySchema = z.enum(AI_NOTE_CATEGORIES);

/** Centralized AI note category constants for equality checks */
export const AI_NOTE_CATEGORY = {
  INJURY: 'INJURY' as AINoteCategory,
  PREFERENCE: 'PREFERENCE' as AINoteCategory,
  LIMITATION: 'LIMITATION' as AINoteCategory,
  MEDICAL: 'MEDICAL' as AINoteCategory,
  GOAL: 'GOAL' as AINoteCategory,
  OTHER: 'OTHER' as AINoteCategory,
} as const;

/** Human-readable labels for AI note categories */
export const AI_NOTE_CATEGORY_LABELS: Record<AINoteCategory, string> = {
  INJURY: 'Injury',
  PREFERENCE: 'Preference',
  LIMITATION: 'Limitation',
  MEDICAL: 'Medical',
  GOAL: 'Goal',
  OTHER: 'Other',
};

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
export interface WorkoutSessionNoteContract {
  id: string;
  userId: string;
  workoutPlanId?: string;
  workoutDate: IsoDateString;
  content: string;
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
}

export const workoutSessionNoteSchema: z.ZodType<WorkoutSessionNoteContract> = baseDocumentSchema.extend({
  id: z.string(),
  userId: z.string(),
  workoutPlanId: z.string().optional(),
  workoutDate: isoDateSchema,
  content: z.string().min(1),
});

// ============================================================================
// SMART ASSIST PERMANENT NOTE
// ============================================================================

/**
 * Smart Assist permanent notes - long-term context about user preferences, limitations, and conditions.
 * Used by Smart Assist systems to personalize workout and diet recommendations.
 */
export interface AIPermanentNoteContract {
  id: string;
  userId: string;
  content: string;
  category: AINoteCategory;
  source?: string; // Which workout/date/event triggered this note
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
}

export const aiPermanentNoteSchema: z.ZodType<AIPermanentNoteContract> = baseDocumentSchema.extend({
  id: z.string(),
  userId: z.string(),
  content: z.string().min(1),
  category: AINoteCategorySchema,
  source: z.string().optional(),
});

// ============================================================================
// SMART ASSIST CONTEXT (AGGREGATED)
// ============================================================================

/**
 * Aggregated Smart Assist context for inference - combines relevant user data for processing.
 * This is the payload sent to Smart Assist services for personalized recommendations.
 */
export interface AIContextContract {
  userId: string;
  /** Recent workout session notes (last N days) */
  recentSessionNotes: WorkoutSessionNoteContract[];
  /** All permanent notes for the user */
  permanentNotes: AIPermanentNoteContract[];
  /** User's clinical limitations from profile */
  clinicalLimitations?: string[];
  /** User's medical notes from profile */
  medicalNotes?: string;
  /** User's current goals */
  goals?: string[];
  /** User's preferences */
  preferences?: string[];
  /** Context window in days for recent data */
  contextWindowDays: number;
  /** Timestamp when this context was generated */
  generatedAt: IsoTimestampString;
}

export const aiContextSchema: z.ZodType<AIContextContract> = z.object({
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
    id: overrides.id ?? `session-note-${Math.random().toString(36).slice(2, 8)}`,
    userId: overrides.userId ?? 'mock-user',
    workoutPlanId: overrides.workoutPlanId,
    workoutDate: overrides.workoutDate ?? todayIso(),
    content: overrides.content ?? 'Felt good during squats, increased weight by 10lbs.',
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
    id: overrides.id ?? `permanent-note-${Math.random().toString(36).slice(2, 8)}`,
    userId: overrides.userId ?? 'mock-user',
    content: overrides.content ?? 'User has a previous rotator cuff injury on the left shoulder.',
    category: overrides.category ?? AI_NOTE_CATEGORY.INJURY,
    source: overrides.source ?? 'Workout session on 2025-01-15',
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
    userId: overrides.userId ?? 'mock-user',
    recentSessionNotes: overrides.recentSessionNotes ?? [createMockWorkoutSessionNote()],
    permanentNotes: overrides.permanentNotes ?? [
      createMockAIPermanentNote({ category: AI_NOTE_CATEGORY.INJURY }),
      createMockAIPermanentNote({ 
        category: AI_NOTE_CATEGORY.PREFERENCE, 
        content: 'Prefers morning workouts before 8am.',
      }),
    ],
    clinicalLimitations: overrides.clinicalLimitations ?? ['Lower back sensitivity'],
    medicalNotes: overrides.medicalNotes ?? 'No current medications.',
    goals: overrides.goals ?? ['Build lean muscle', 'Improve cardiovascular endurance'],
    preferences: overrides.preferences ?? ['Prefers free weights over machines'],
    contextWindowDays: overrides.contextWindowDays ?? 7,
    generatedAt: overrides.generatedAt ?? timestamp,
  };
};
