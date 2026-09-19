/**
 * @ai-context Common domain contracts | shared types and base schemas
 *
 * This module provides common types used across all domains:
 * - ISO date/timestamp types
 * - Base document metadata
 *
 * deps: zod | consumers: all domain modules
 */
import * as z from "zod";
/** ISO date string in format YYYY-MM-DD */
export type IsoDateString = string;
/** ISO 8601 timestamp string */
export type IsoTimestampString = string;
export declare const isoTimestampSchema: z.ZodString;
export type IsoTimestamp = z.infer<typeof isoTimestampSchema>;
export declare const isoDateSchema: z.ZodString;
export type IsoDate = z.infer<typeof isoDateSchema>;
export declare const baseDocumentSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type ContractDocumentMeta = z.infer<typeof baseDocumentSchema>;
/**
 * A BCP-47 language tag as the Workouts client sends it (`en`, `es-MX`,
 * `pt-BR`, `zh-Hant`, …). Deliberately a loose shape check, not a closed list:
 * the app's supported-locale registry lives in the client (`LOCALE_CODES`) and
 * a server that receives a tag it has no bundle for still prompts the model in
 * that language — the wire must not need a contracts release per new locale.
 * Consumers normalise casing (`normalizeLocaleTag`) and fall back to `en`.
 */
export declare const LocaleTagSchema: z.ZodString;
export type LocaleTag = z.infer<typeof LocaleTagSchema>;
//# sourceMappingURL=common.d.ts.map