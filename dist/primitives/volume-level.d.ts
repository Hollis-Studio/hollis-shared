/**
 * @ai-context Volume Level Primitives | Shared type for training volume levels
 *
 * This module provides the canonical definition of volume levels for training phases.
 * Extracted to break circular dependency between admin-types and training contracts.
 *
 * IMPORTANT: This is a primitive type with no dependencies on other contract modules.
 *
 * deps: zod only | consumers: admin/admin-types, domain/training, ai/ai-types
 */
import { z } from "zod";
/**
 * Volume levels for training phases.
 * Represents training intensity/volume in a periodization scheme.
 * Note: Stored as plain string in Prisma (not a Prisma enum).
 */
export declare const VOLUME_LEVELS: readonly ["low", "moderate", "high"];
/**
 * Zod schema for volume level validation
 */
export declare const VolumeLevelSchema: z.ZodEnum<{
    low: "low";
    moderate: "moderate";
    high: "high";
}>;
export type VolumeLevel = z.infer<typeof VolumeLevelSchema>;
/**
 * Human-readable labels for volume levels
 */
export declare const VOLUME_LEVEL_LABELS: Record<VolumeLevel, string>;
/**
 * Volume level constants for type-safe usage
 */
export declare const VOLUME_LEVEL: {
    readonly LOW: "low";
    readonly MODERATE: "moderate";
    readonly HIGH: "high";
};
//# sourceMappingURL=volume-level.d.ts.map