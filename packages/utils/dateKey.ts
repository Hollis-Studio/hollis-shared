/**
 * @file shared/utils/dateKey.ts
 * @description Canonical YYYY-MM-DD date key utilities shared across mobile, server, and web-admin.
 *
 * Single source of truth for date key generation and parsing.
 * All date-based lookups (nutrition logs, daily metrics, etc.) use the YYYY-MM-DD format.
 *
 * @ai-context Date key utils | consumers: src/utils/timeFormat, server/src/utils/dateFormat, web-admin/stubs/timeFormat
 */

import { format as dateFnsFormat } from 'date-fns';

/** The standard date format used for database keys and API parameters. */
export const DATE_KEY_FORMAT = 'yyyy-MM-dd' as const;

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
  return dateFnsFormat(date, DATE_KEY_FORMAT);
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
 */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}
