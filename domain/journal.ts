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
import { baseDocumentSchema, isoDateSchema } from "./common";

// ============================================================================
// JOURNAL MOOD & ENERGY
// ============================================================================

export const JOURNAL_MOODS = [
  "very_negative",
  "negative",
  "neutral",
  "positive",
  "very_positive",
] as const;
export type JournalMood = z.infer<typeof JournalMoodSchema>;
export const JournalMoodSchema = z.enum(JOURNAL_MOODS);

export const JOURNAL_MOOD_LABELS: Record<JournalMood, string> = {
  very_negative: "Very Negative",
  negative: "Negative",
  neutral: "Neutral",
  positive: "Positive",
  very_positive: "Very Positive",
};

export const JOURNAL_ENERGIES = [
  "very_low",
  "low",
  "medium",
  "high",
  "very_high",
] as const;
export type JournalEnergy = z.infer<typeof JournalEnergySchema>;
export const JournalEnergySchema = z.enum(JOURNAL_ENERGIES);

export const JOURNAL_ENERGY_LABELS: Record<JournalEnergy, string> = {
  very_low: "Very Low",
  low: "Low",
  medium: "Medium",
  high: "High",
  very_high: "Very High",
};

// ============================================================================
// DAILY CHECK-IN FORM
// ============================================================================

/** Canonical allowed values for the plan-adherence UI button group. */
export const PLAN_ADHERENCE_VALUES = ["Yes", "Mostly", "No"] as const;
export const PlanAdherenceSchema = z.enum(PLAN_ADHERENCE_VALUES);
/** UI-facing plan adherence answer (maps to numeric 1-3 before persistence). */
export type PlanAdherence = z.infer<typeof PlanAdherenceSchema>;

/**
 * Zod schema for the daily check-in form before any contract mapping.
 * Validated in the feature layer (useDailyCheckIn) on submit.
 */
export const dailyCheckInFormSchema = z.object({
  planAdherence: PlanAdherenceSchema,
  energyLevel: z.number().int().min(1).max(5),
  /** Optional free-text notes. Capped at 2000 chars to prevent runaway PHI storage. */
  notes: z.string().max(2000).optional(),
});
export type DailyCheckInFormInput = z.infer<typeof dailyCheckInFormSchema>;

// ============================================================================
// JOURNAL AI ASSESSMENT CONTRACT
// ============================================================================

export const journalAIAssessmentSchema = z.object({
  summary: z.string().min(1),
  themes: z.array(z.string()),
  sentimentScore: z.number().min(-1).max(1),
  recommendedActions: z.array(z.string()).optional(),
});
export type JournalAIAssessment = z.infer<typeof journalAIAssessmentSchema>;

export type JournalAIAssessmentContract = z.infer<
  typeof journalAIAssessmentSchema
>;

// ============================================================================
// JOURNAL ENTRY CONTRACT
// ============================================================================

export const journalEntrySchema = baseDocumentSchema.extend({
  id: z.string().optional(),
  userId: z.string(),
  entryDate: isoDateSchema,
  content: z.string().min(1),
  mood: JournalMoodSchema.nullable().optional(),
  energy: JournalEnergySchema.nullable().optional(),
  stressLevel: z.number().int().min(1).max(10).nullable().optional(),
  planAdherence: z.number().int().min(1).max(3).nullable().optional(),
  motivation: z.number().int().min(1).max(10).nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  aiAssessment: journalAIAssessmentSchema.nullable().optional(),
  attachments: z.array(z.string().url()).nullable().optional(),
});

export type JournalEntryContract = z.infer<typeof journalEntrySchema>;

// ============================================================================
// JOURNAL ENTRY FORM INPUT SCHEMA
// ============================================================================

/**
 * Client-side form validation schema for journal entry input.
 * Slider values (mood, energy, stress, motivation) are raw 1–10 integers;
 * they are mapped to domain enum values before submission.
 * Bounds match server-side validation in server/src/validation/journal.ts.
 */
export const journalEntryFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Journal entry cannot be empty")
    .max(10000, "Journal entry is too long (max 10,000 characters)"),
  mood: z.number().int().min(1).max(10).optional(),
  energy: z.number().int().min(1).max(10).optional(),
  stress: z.number().int().min(1).max(10).optional(),
  motivation: z.number().int().min(1).max(10).optional(),
  tags: z
    .array(z.string().trim().max(50, "Each tag must be 50 characters or less"))
    .max(20, "Too many tags (max 20)")
    .optional(),
});

export type JournalEntryFormInput = z.infer<typeof journalEntryFormSchema>;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockJournalAIAssessment = (
  overrides: Partial<JournalAIAssessmentContract> = {},
): JournalAIAssessmentContract => ({
  summary:
    "User expressed overall positive outlook with minor stress about work deadlines.",
  themes: ["work", "stress", "productivity"],
  sentimentScore: 0.6,
  recommendedActions: [
    "Consider a short walk to decompress",
    "Practice 5-minute breathing exercise",
  ],
  ...overrides,
});

let mockJournalEntryCounter = 0;

export const createMockJournalEntry = (
  overrides: Partial<JournalEntryContract> = {},
): JournalEntryContract => {
  const timestamp = nowIso();
  mockJournalEntryCounter += 1;
  return {
    id: overrides.id ?? `mock-journal-entry-${mockJournalEntryCounter}`,
    userId: "HH-ABC123",
    createdAt: timestamp,
    updatedAt: timestamp,
    entryDate: timestamp.split("T")[0],
    content:
      "Today was a productive day. Completed my workout and felt great afterwards.",
    mood: "positive",
    energy: "high",
    stressLevel: 3,
    planAdherence: 1,
    motivation: 8,
    tags: ["workout", "productive"],
    aiAssessment: createMockJournalAIAssessment(),
    ...overrides,
  };
};
