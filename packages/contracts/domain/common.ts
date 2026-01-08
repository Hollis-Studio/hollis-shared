/**
 * @ai-context Common domain contracts | shared types and base schemas
 *
 * This module provides common types used across all domains:
 * - ISO date/timestamp types
 * - Base document metadata
 *
 * deps: zod | consumers: all domain modules
 */
import { z } from 'zod';

// ============================================================================
// DATE/TIME TYPES
// ============================================================================

/** ISO date string in format YYYY-MM-DD */
export type IsoDateString = string;

/** ISO 8601 timestamp string */
export type IsoTimestampString = string;

export const isoTimestampSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Must be ISO 8601 timestamp');

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Must be ISO date (YYYY-MM-DD)')
  .refine((value) => {
    // Additional validation: ensure date components are valid
    const [year, month, day] = value.split('-').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    // Validate the date is real (handles Feb 30, etc.)
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, 'Must be a valid date');

// ============================================================================
// BASE DOCUMENT METADATA
// ============================================================================

/** Base document metadata interface */
export interface ContractDocumentMeta {
  id?: string;
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
}

export const baseDocumentSchema = z.object({
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

// ============================================================================
// DOCUMENT CATEGORIES
// ============================================================================

/** Tuple of valid document category values (source of truth) */
export const DOCUMENT_CATEGORIES = [
  'lab_result',
  'insurance_card',
  'medical_record',
  'imaging',
  'prescription',
  'referral',
  'consent_form',
  'other',
] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

/** Zod schema for document category - derived from tuple */
export const DocumentCategorySchema = z.enum(DOCUMENT_CATEGORIES);

/** Constant object for document category comparisons */
export const DOCUMENT_CATEGORY = {
  LAB_RESULT: 'lab_result' as DocumentCategory,
  INSURANCE_CARD: 'insurance_card' as DocumentCategory,
  MEDICAL_RECORD: 'medical_record' as DocumentCategory,
  IMAGING: 'imaging' as DocumentCategory,
  PRESCRIPTION: 'prescription' as DocumentCategory,
  REFERRAL: 'referral' as DocumentCategory,
  CONSENT_FORM: 'consent_form' as DocumentCategory,
  OTHER: 'other' as DocumentCategory,
} as const;

/** Human-readable labels for document categories */
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  lab_result: 'Lab Result',
  insurance_card: 'Insurance Card',
  medical_record: 'Medical Record',
  imaging: 'Imaging',
  prescription: 'Prescription',
  referral: 'Referral',
  consent_form: 'Consent Form',
  other: 'Other',
};

/**
 * Type guard to check if a string is a valid document category
 */
export function isDocumentCategory(value: string): value is DocumentCategory {
  return (DOCUMENT_CATEGORIES as readonly string[]).includes(value);
}
