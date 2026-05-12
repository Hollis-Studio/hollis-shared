/**
 * @ai-context Enum contract utility | generates types, schemas, constants, and labels from tuples
 *
 * This utility reduces boilerplate for domain constants by deriving all related
 * artifacts from a single source tuple:
 * - Type union (e.g., `type Gender = 'male' | 'female'`)
 * - Zod schema for validation
 * - Constant object for equality checks (e.g., `GENDER.MALE`)
 * - Label map for UI display
 *
 * Usage:
 * ```ts
 * const GenderContract = createEnumContract(['male', 'female', 'other'] as const, {
 *   labels: { male: 'Male', female: 'Female', other: 'Other' }
 * });
 *
 * // Access generated artifacts:
 * GenderContract.values   // ['male', 'female', 'other']
 * GenderContract.schema   // z.enum(['male', 'female', 'other'])
 * GenderContract.constants // { MALE: 'male', FEMALE: 'female', OTHER: 'other' }
 * GenderContract.labels   // { male: 'Male', female: 'Female', other: 'Other' }
 *
 * // Type can be extracted:
 * type Gender = typeof GenderContract.values[number];
 * ```
 *
 * deps: zod | consumers: contracts/*
 */
import { z } from 'zod';
// ============================================================================
// LABEL GENERATION
// ============================================================================
/**
 * Transforms a snake_case or kebab-case string to Title Case.
 * Examples:
 *   'lightly_active' → 'Lightly Active'
 *   'lose-weight' → 'Lose Weight'
 *   'ADMIN' → 'Admin'
 *   'trimester_1' → 'Trimester 1'
 */
export function toTitleCase(value) {
    return value
        .toLowerCase()
        .split(/[_-]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
/**
 * Auto-generates labels from tuple values.
 */
function generateLabels(values, customLabels) {
    return Object.fromEntries(values.map((value) => [
        value,
        customLabels?.[value] ?? toTitleCase(value),
    ]));
}
// ============================================================================
// CONSTANT OBJECT GENERATION
// ============================================================================
/**
 * Transforms a value to UPPER_SNAKE_CASE for constant keys.
 * Examples:
 *   'lightly_active' → 'LIGHTLY_ACTIVE'
 *   'lose-weight' → 'LOSE_WEIGHT'
 *   'trimester1' → 'TRIMESTER1'
 */
function toConstantKey(value) {
    return value
        .replace(/-/g, '_')
        .toUpperCase();
}
/**
 * Generates a constant object for equality checks.
 * Example: ['male', 'female'] → { MALE: 'male', FEMALE: 'female' }
 */
function generateConstants(values) {
    return Object.fromEntries(values.map((value) => [toConstantKey(value), value]));
}
// ============================================================================
// MAIN FACTORY
// ============================================================================
/**
 * Creates a complete enum contract from a const tuple.
 *
 * @param values - The source tuple of valid values (must be `as const`)
 * @param options - Optional configuration (custom labels)
 * @returns An EnumContract with values, schema, constants, and labels
 *
 * @example
 * ```ts
 * const BiologicalSexContract = createEnumContract(
 *   ['female', 'male', 'non_binary', 'intersex', 'prefer_not_to_say'] as const,
 *   {
 *     labels: {
 *       non_binary: 'Non-Binary',
 *       prefer_not_to_say: 'Prefer Not to Say',
 *     }
 *   }
 * );
 *
 * // Generated artifacts:
 * // BiologicalSexContract.values → ['female', 'male', ...]
 * // BiologicalSexContract.schema → z.enum([...])
 * // BiologicalSexContract.constants → { FEMALE: 'female', MALE: 'male', ... }
 * // BiologicalSexContract.labels → { female: 'Female', male: 'Male', non_binary: 'Non-Binary', ... }
 * ```
 */
export function createEnumContract(values, options) {
    return {
        values,
        schema: z.enum(values),
        constants: generateConstants(values),
        labels: generateLabels(values, options?.labels),
    };
}
// ============================================================================
// LEGACY COMPATIBILITY HELPERS
// ============================================================================
/**
 * Extracts the tuple values from an enum contract.
 * Useful for backward compatibility when you need just the tuple.
 */
export function getEnumValues(contract) {
    return contract.values;
}
//# sourceMappingURL=enumContract.js.map