/**
 * @file shared/utils/dateKey.ts
 * @description Canonical YYYY-MM-DD date key utilities shared across mobile, server, and web-admin.
 *
 * Single source of truth for date key generation and parsing.
 * All date-based lookups (nutrition logs, daily metrics, etc.) use the YYYY-MM-DD format.
 *
 * @ai-context Date key utils | consumers: src/utils/timeFormat, server/src/utils/dateFormat, web-admin/stubs/timeFormat
 */
/** The standard date format used for database keys and API parameters. */
export declare const DATE_KEY_FORMAT: "yyyy-MM-dd";
/**
 * Format a Date object to a date key string (yyyy-MM-dd).
 * Use this instead of `format(date, 'yyyy-MM-dd')` for consistency.
 *
 * @param date - Date object to format
 * @returns Date string in yyyy-MM-dd format
 *
 * @example
 * formatDateKey(new Date()) // '2026-02-24'
 * formatDateKey(new Date('2025-01-15')) // '2025-01-15'
 */
export declare function formatDateKey(date: Date): string;
/**
 * Get today's date as a date key string (yyyy-MM-dd).
 * Convenience function for common use case.
 *
 * @returns Today's date in yyyy-MM-dd format
 */
export declare function getTodayDateKey(): string;
/**
 * Parse a date key string to a Date object (at midnight local time).
 * Uses manual split to avoid timezone issues with `new Date(string)`.
 *
 * @param dateKey - Date string in yyyy-MM-dd format
 * @returns Date object at midnight local time
 * @throws Error if the dateKey is not in yyyy-MM-dd format or represents an invalid date
 */
export declare function parseDateKey(dateKey: string): Date;
//# sourceMappingURL=dateKey.d.ts.map