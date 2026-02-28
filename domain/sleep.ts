/**
 * @ai-context Sleep domain contracts | sleep entry form validation schemas
 *
 * This module provides Zod schemas for validating sleep-related form inputs
 * in the web-admin.
 *
 * deps: zod | consumers: web-admin
 */

import { z } from "zod";

// ============================================================================
// SLEEP ENTRY FORM SCHEMA (Web-admin entry form validation)
// ============================================================================

/**
 * Zod schema for validating sleep metric fields before API submission.
 * Validates parsed numeric values (not raw strings from form inputs).
 *
 * Range constraints match the existing manual validation in SleepEntryForm.
 *
 * @see web-admin/components/admin/SleepEntryForm.tsx
 */
export const sleepEntryFormSchema = z.object({
  /** ISO date string (YYYY-MM-DD) */
  date: z.string().min(1, "Date is required"),
  /** Total sleep duration in hours (0–24) */
  sleepHours: z
    .number()
    .min(0, "Sleep hours must be ≥ 0")
    .max(24, "Sleep hours must be ≤ 24"),
  /** Deep sleep percentage (0–100) */
  deepSleepPercent: z
    .number()
    .min(0, "Deep Sleep % must be ≥ 0")
    .max(100, "Deep Sleep % must be ≤ 100")
    .optional(),
  /** Light sleep percentage (0–100) */
  lightSleepPercent: z
    .number()
    .min(0, "Light Sleep % must be ≥ 0")
    .max(100, "Light Sleep % must be ≤ 100")
    .optional(),
  /** REM sleep percentage (0–100) */
  remSleepPercent: z
    .number()
    .min(0, "REM Sleep % must be ≥ 0")
    .max(100, "REM Sleep % must be ≤ 100")
    .optional(),
  /** Awake time in minutes (≥ 0) */
  awakeMinutes: z
    .number()
    .int("Awake Minutes must be a whole number")
    .min(0, "Awake Minutes must be ≥ 0")
    .optional(),
  /** Resting heart rate in bpm (20–250) */
  restingHeartRate: z
    .number()
    .min(20, "Resting Heart Rate must be ≥ 20 bpm")
    .max(250, "Resting Heart Rate must be ≤ 250 bpm")
    .optional(),
  /** Sleep quality score (0–100) */
  sleepQuality: z
    .number()
    .int("Sleep Quality must be a whole number")
    .min(0, "Sleep Quality must be ≥ 0")
    .max(100, "Sleep Quality must be ≤ 100")
    .optional(),
});

export type SleepEntryFormData = z.infer<typeof sleepEntryFormSchema>;
