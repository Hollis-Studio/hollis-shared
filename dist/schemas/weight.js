import { z } from "zod";
/**
 * Body weight validation schema (kilograms).
 * Physiologically reasonable clinical bounds: 20–500 kg.
 */
export const bodyWeightKgSchema = z
    .number()
    .min(20, "Body weight must be at least 20 kg")
    .max(500, "Body weight cannot exceed 500 kg");
/**
 * Load weight validation schema (kilograms).
 * Training loads can be 0 kg for bodyweight or unloaded movements.
 */
export const loadWeightKgSchema = z
    .number()
    .min(0, "Load weight must be at least 0 kg")
    .max(500, "Load weight cannot exceed 500 kg");
//# sourceMappingURL=weight.js.map