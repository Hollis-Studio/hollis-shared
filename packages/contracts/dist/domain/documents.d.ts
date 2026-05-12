/**
 * @ai-context Document domain contracts | Canonical document categories and types
 *
 * This module defines the canonical document categories used across mobile, web-admin, and backend.
 * All document types must use these categories rather than magic strings.
 *
 * IMPORTANT: All document category constants MUST be imported from here.
 *
 * deps: zod | consumers: server/src/services/*, src/features/documents/*, web-admin/services/*
 */
import { z } from "zod";
/**
 * Canonical document category values (source of truth).
 * These are used as tags when uploading and filtering documents.
 */
export declare const DOCUMENT_CATEGORIES: readonly ["LAB_RESULT", "INSURANCE_CARD", "MEDICAL_RECORD", "IMAGING", "PRESCRIPTION", "REFERRAL", "CONSENT_FORM", "ID_DOCUMENT", "INTAKE_FORM", "PROGRESS_PHOTO", "OTHER"];
/** Single document category type */
export type DocumentCategory = z.infer<typeof DocumentCategorySchema>;
/** Zod schema for document category validation - derived from tuple */
export declare const DocumentCategorySchema: z.ZodEnum<{
    LAB_RESULT: "LAB_RESULT";
    INSURANCE_CARD: "INSURANCE_CARD";
    MEDICAL_RECORD: "MEDICAL_RECORD";
    IMAGING: "IMAGING";
    PRESCRIPTION: "PRESCRIPTION";
    REFERRAL: "REFERRAL";
    CONSENT_FORM: "CONSENT_FORM";
    ID_DOCUMENT: "ID_DOCUMENT";
    INTAKE_FORM: "INTAKE_FORM";
    PROGRESS_PHOTO: "PROGRESS_PHOTO";
    OTHER: "OTHER";
}>;
/**
 * Document category constant object for type-safe access.
 * @example DOCUMENT_CATEGORY.LAB_RESULT // 'LAB_RESULT'
 */
export declare const DOCUMENT_CATEGORY: {
    readonly LAB_RESULT: "LAB_RESULT";
    readonly INSURANCE_CARD: "INSURANCE_CARD";
    readonly MEDICAL_RECORD: "MEDICAL_RECORD";
    readonly IMAGING: "IMAGING";
    readonly PRESCRIPTION: "PRESCRIPTION";
    readonly REFERRAL: "REFERRAL";
    readonly CONSENT_FORM: "CONSENT_FORM";
    readonly ID_DOCUMENT: "ID_DOCUMENT";
    readonly INTAKE_FORM: "INTAKE_FORM";
    readonly PROGRESS_PHOTO: "PROGRESS_PHOTO";
    readonly OTHER: "OTHER";
};
/**
 * Human-readable labels for document categories.
 * Used in dropdowns and display text.
 */
export declare const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string>;
/**
 * Type guard to check if a string is a valid document category
 */
export declare function isDocumentCategory(value: string): value is DocumentCategory;
/**
 * Get the display label for a document category.
 * Falls back to 'Other' for unknown categories.
 */
export declare function getDocumentCategoryLabel(category: string): string;
//# sourceMappingURL=documents.d.ts.map