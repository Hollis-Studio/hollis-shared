/**
 * @ai-context Shared type guard utilities | safe runtime type narrowing
 *
 * These guards are consumed by all surfaces (mobile, web-admin, web-public, server).
 * They replace unsafe `as unknown as X` casts with proper runtime checks.
 *
 * deps: none | consumers: all codebases
 */
/**
 * Type guard to check if a value is a non-null, non-array object (Record).
 *
 * Excludes arrays because `typeof [] === 'object'` in JavaScript, and callers
 * that iterate `Object.keys()` or access named properties do not expect arrays.
 *
 * @example
 * ```ts
 * if (isRecord(data)) {
 *   Object.keys(data).forEach(...);
 * }
 * ```
 */
export function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
//# sourceMappingURL=typeGuards.js.map