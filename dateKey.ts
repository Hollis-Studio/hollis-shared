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
export const DATE_KEY_FORMAT = "yyyy-MM-dd" as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

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
export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Get today's date as a date key string (yyyy-MM-dd).
 * Convenience function for common use case.
 *
 * @returns Today's date in yyyy-MM-dd format
 */
export function getTodayDateKey(): string {
  return formatDateKey(new Date());
}

/**
 * Parse a date key string to a Date object (at midnight local time).
 * Uses manual split to avoid timezone issues with `new Date(string)`.
 *
 * @param dateKey - Date string in yyyy-MM-dd format
 * @returns Date object at midnight local time
 * @throws Error if the dateKey is not in yyyy-MM-dd format or represents an invalid date
 */
export function parseDateKey(dateKey: string): Date {
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    throw new Error(
      `Invalid date key format: "${dateKey}". Expected yyyy-MM-dd.`,
    );
  }
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  // Validate the date is actually valid (e.g., not Feb 30)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid date key: "${dateKey}". Date does not exist.`);
  }
  return date;
}
