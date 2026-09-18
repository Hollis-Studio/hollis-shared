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
export const isoTimestampSchema = z
    .string()
    .datetime({ offset: true, message: "Must be ISO 8601 timestamp" });
export const isoDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, "Must be ISO date (YYYY-MM-DD)")
    .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    if (month < 1 || month > 12)
        return false;
    if (day < 1 || day > 31)
        return false;
    // Validate the date is real (handles Feb 30, etc.)
    const date = new Date(year, month - 1, day);
    return (date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day);
}, "Must be a valid date");
// ============================================================================
// BASE DOCUMENT METADATA
// ============================================================================
export const baseDocumentSchema = z.object({
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
});
// ============================================================================
// LOCALE
// ============================================================================
/**
 * A BCP-47 language tag as the Workouts client sends it (`en`, `es-MX`,
 * `pt-BR`, `zh-Hant`, …). Deliberately a loose shape check, not a closed list:
 * the app's supported-locale registry lives in the client (`LOCALE_CODES`) and
 * a server that receives a tag it has no bundle for still prompts the model in
 * that language — the wire must not need a contracts release per new locale.
 * Consumers normalise casing (`normalizeLocaleTag`) and fall back to `en`.
 */
export const LocaleTagSchema = z
    .string()
    .trim()
    .min(2)
    .max(35)
    .regex(/^[A-Za-z]{2,3}(?:[-_][A-Za-z0-9]{2,8})*$/u, "Must be a BCP-47 language tag");
//# sourceMappingURL=common.js.map