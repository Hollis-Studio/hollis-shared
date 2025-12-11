/**
 * @ai-context Common domain contracts | shared types and base schemas
 *
 * This module provides common types used across all domains:
 * - ISO date/timestamp types
 * - Base document metadata
 *
 * deps: none | consumers: all domain modules
 */

// ============================================================================
// DATE/TIME TYPES
// ============================================================================

/** ISO date string in format YYYY-MM-DD */
export type IsoDateString = string;

/** ISO 8601 timestamp string */
export type IsoTimestampString = string;

// ============================================================================
// BASE DOCUMENT METADATA
// ============================================================================

/** Base document metadata interface */
export interface ContractDocumentMeta {
  id?: string;
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
}
