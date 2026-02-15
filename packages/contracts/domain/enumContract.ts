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
// TYPES
// ============================================================================

/**
 * A non-empty readonly tuple of strings, as required by z.enum().
 */
export type NonEmptyTuple<T extends string = string> = readonly [T, ...T[]];

/**
 * Writable version of a tuple for Zod compatibility.
 */
type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Options for creating an enum contract.
 */
export interface EnumContractOptions<T extends NonEmptyTuple> {
  /**
   * Custom labels for display. If not provided, labels are auto-generated
   * by transforming tuple values (e.g., 'lightly_active' → 'Lightly Active').
   */
  labels?: Partial<Record<T[number], string>>;
}

/**
 * Helper type to convert string to snake_case (simplified).
 * This handles common patterns like 'camelCase' → 'camel_case' and 'kebab-case' → 'kebab_case'.
 */
type SnakeCase<S extends string> = S extends `${infer T}-${infer U}`
  ? `${Lowercase<T>}_${SnakeCase<U>}`
  : Lowercase<S>;

/**
 * The result of createEnumContract - all artifacts derived from the source tuple.
 */
export interface EnumContract<T extends NonEmptyTuple> {
  /** The source tuple of valid values */
  readonly values: T;
  /** Zod schema for validation */
  readonly schema: z.ZodEnum<Writeable<T>>;
  /** Constant object for equality checks (keys are UPPER_SNAKE_CASE) */
  readonly constants: { readonly [K in Uppercase<SnakeCase<T[number]>>]: T[number] };
  /** Human-readable labels for UI display */
  readonly labels: Record<T[number], string>;
}

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
export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Auto-generates labels from tuple values.
 */
function generateLabels<T extends NonEmptyTuple>(
  values: T,
  customLabels?: Partial<Record<T[number], string>>,
): Record<T[number], string> {
  return Object.fromEntries(
    values.map((value) => [
      value,
      customLabels?.[value as T[number]] ?? toTitleCase(value),
    ]),
  ) as Record<T[number], string>;
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
function toConstantKey(value: string): string {
  return value
    .replace(/-/g, '_')
    .toUpperCase();
}

/**
 * Generates a constant object for equality checks.
 * Example: ['male', 'female'] → { MALE: 'male', FEMALE: 'female' }
 */
function generateConstants<T extends NonEmptyTuple>(
  values: T,
): { readonly [K in Uppercase<SnakeCase<T[number]>>]: T[number] } {
  return Object.fromEntries(
    values.map((value) => [toConstantKey(value), value]),
  ) as { readonly [K in Uppercase<SnakeCase<T[number]>>]: T[number] };
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
export function createEnumContract<T extends readonly [string, ...string[]]>(
  values: T,
  options?: EnumContractOptions<T>,
): EnumContract<T> {
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
export function getEnumValues<T extends NonEmptyTuple>(
  contract: EnumContract<T>,
): T {
  return contract.values;
}

/**
 * Type helper to extract the union type from an enum contract.
 *
 * @example
 * ```ts
 * const GenderContract = createEnumContract(['male', 'female'] as const);
 * type Gender = EnumValue<typeof GenderContract>; // 'male' | 'female'
 * ```
 */
export type EnumValue<C extends EnumContract<NonEmptyTuple>> = C['values'][number];
