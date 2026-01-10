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

import { z } from 'zod';
import { baseDocumentSchema, isoDateSchema, type IsoTimestampString } from './common';

// ============================================================================
// JOURNAL MOOD & ENERGY
// ============================================================================

export const JOURNAL_MOODS = ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'] as const;
export type JournalMood = (typeof JOURNAL_MOODS)[number];
export const JournalMoodSchema = z.enum(JOURNAL_MOODS);

export const JOURNAL_MOOD_LABELS: Record<JournalMood, string> = {
  very_negative: 'Very Negative',
  negative: 'Negative',
  neutral: 'Neutral',
  positive: 'Positive',
  very_positive: 'Very Positive',
};

export const JOURNAL_ENERGIES = ['very_low', 'low', 'medium', 'high', 'very_high'] as const;
export type JournalEnergy = (typeof JOURNAL_ENERGIES)[number];
export const JournalEnergySchema = z.enum(JOURNAL_ENERGIES);

export const JOURNAL_ENERGY_LABELS: Record<JournalEnergy, string> = {
  very_low: 'Very Low',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  very_high: 'Very High',
};

// ============================================================================
// JOURNAL AI ASSESSMENT CONTRACT
// ============================================================================

/**
 * AI-generated assessment of a journal entry.
 * Includes sentiment analysis, theme extraction, and recommendations.
 */
export interface JournalAIAssessmentContract {
  summary: string;
  themes: string[];
  sentimentScore: number; // -1 to 1
  recommendedActions?: string[];
}

export const journalAIAssessmentSchema: z.ZodType<JournalAIAssessmentContract> = z.object({
  summary: z.string().min(1),
  themes: z.array(z.string()),
  sentimentScore: z.number().min(-1).max(1),
  recommendedActions: z.array(z.string()).optional(),
});

// ============================================================================
// JOURNAL ENTRY CONTRACT
// ============================================================================

/**
 * Coerces mood/energy values to strings for Prisma compatibility.
 * Accepts string or number input but always outputs string (or undefined).
 */
const moodEnergySchema = z
  .union([z.string(), z.number()])
  .transform((val) => (val != null ? String(val) : val))
  .optional();

/**
 * Journal entry contract - represents a user's journal entry.
 */
export interface JournalEntryContract {
  id?: string;
  /**
   * User identifier in HH-XXXXXX barcode format.
   * References the patient this journal entry belongs to.
   *
   * @format HH-XXXXXX
   */
  userId: string;
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
  entryDate: string; // yyyy-mm-dd
  content: string;
  mood?: string | number; // 1-10 or enum
  energy?: string | number; // 1-10 or enum
  stressLevel?: number; // 1-10
  planAdherence?: number; // 1=Yes, 2=Mostly, 3=No
  motivation?: number; // 1-10
  tags?: string[];
  aiAssessment?: JournalAIAssessmentContract;
  attachments?: string[];
}

export const journalEntrySchema: z.ZodType<JournalEntryContract> = baseDocumentSchema.extend({
  id: z.string().optional(),
  userId: z.string(),
  entryDate: isoDateSchema,
  content: z.string().min(1),
  mood: moodEnergySchema,
  energy: moodEnergySchema,
  stressLevel: z.number().min(1).max(10).optional(),
  planAdherence: z.number().min(1).max(3).optional(),
  motivation: z.number().min(1).max(10).optional(),
  tags: z.array(z.string()).optional(),
  aiAssessment: journalAIAssessmentSchema.optional(),
  attachments: z.array(z.string()).optional(),
});

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockJournalAIAssessment = (
  overrides: Partial<JournalAIAssessmentContract> = {},
): JournalAIAssessmentContract => ({
  summary: 'User expressed overall positive outlook with minor stress about work deadlines.',
  themes: ['work', 'stress', 'productivity'],
  sentimentScore: 0.6,
  recommendedActions: ['Consider a short walk to decompress', 'Practice 5-minute breathing exercise'],
  ...overrides,
});

export const createMockJournalEntry = (
  overrides: Partial<JournalEntryContract> = {},
): JournalEntryContract => {
  const timestamp = nowIso();
  return {
    id: 'mock-journal-entry-id',
    userId: 'HH-ABC123',
    createdAt: timestamp,
    updatedAt: timestamp,
    entryDate: timestamp.split('T')[0],
    content: 'Today was a productive day. Completed my workout and felt great afterwards.',
    mood: 'positive',
    energy: 'high',
    stressLevel: 3,
    planAdherence: 1,
    motivation: 8,
    tags: ['workout', 'productive'],
    ...overrides,
  };
};
