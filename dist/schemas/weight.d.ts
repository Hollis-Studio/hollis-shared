import { z } from "zod";
/**
 * Body weight validation schema (kilograms).
 * Physiologically reasonable clinical bounds: 20–500 kg.
 */
export declare const bodyWeightKgSchema: z.ZodNumber;
/**
 * Load weight validation schema (kilograms).
 * Training loads can be 0 kg for bodyweight or unloaded movements.
 */
export declare const loadWeightKgSchema: z.ZodNumber;
//# sourceMappingURL=weight.d.ts.map