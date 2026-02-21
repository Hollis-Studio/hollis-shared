/**
 * @ai-context Common domain contracts | shared types and base schemas
 *
 * This module provides common types used across all domains:
 * - ISO date/timestamp types
 * - Base document metadata
 *
 * deps: zod | consumers: all domain modules
 */
import { z } from "zod";

// ============================================================================
// DATE/TIME TYPES
// ============================================================================

/** ISO date string in format YYYY-MM-DD */
export type IsoDateString = string;

/** ISO 8601 timestamp string */
export type IsoTimestampString = string;

export const isoTimestampSchema = z
  .string()
  .datetime({ offset: true, message: "Must be ISO 8601 timestamp" });

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, "Must be ISO date (YYYY-MM-DD)")
  .refine((value) => {
    // Additional validation: ensure date components are valid
    const [year, month, day] = value.split("-").map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    // Validate the date is real (handles Feb 30, etc.)
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }, "Must be a valid date");

// ============================================================================
// BASE DOCUMENT METADATA
// ============================================================================

export const baseDocumentSchema = z.object({
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type ContractDocumentMeta = z.infer<typeof baseDocumentSchema>;
