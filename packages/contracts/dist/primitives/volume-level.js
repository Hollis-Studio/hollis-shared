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
// ============================================================================
// VOLUME LEVELS (for training phases)
// ============================================================================
/**
 * Volume levels for training phases.
 * Represents training intensity/volume in a periodization scheme.
 * Note: Stored as plain string in Prisma (not a Prisma enum).
 */
export const VOLUME_LEVELS = ["low", "moderate", "high"];
/**
 * Zod schema for volume level validation
 */
export const VolumeLevelSchema = z.enum(VOLUME_LEVELS);
/**
 * Human-readable labels for volume levels
 */
export const VOLUME_LEVEL_LABELS = {
    low: "Low",
    moderate: "Moderate",
    high: "High",
};
/**
 * Volume level constants for type-safe usage
 */
export const VOLUME_LEVEL = {
    LOW: "low",
    MODERATE: "moderate",
    HIGH: "high",
};
//# sourceMappingURL=volume-level.js.map