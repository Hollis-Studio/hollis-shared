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
//# sourceMappingURL=common.d.ts.map