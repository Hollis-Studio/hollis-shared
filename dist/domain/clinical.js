/**
 * @ai-context Clinical domain contracts | limitation severities, biometric sources
 *
 * This module provides the canonical definitions for clinical-related constants:
 * - Limitation severities (mild, moderate, severe)
 * - Biometric data sources (LAB_REPORT, CLINICIAN_ENTRY, APPLE_HEALTH, etc.)
 *
 * IMPORTANT: All clinical-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
import { extractedDataSchema } from "../schemas/json-blobs.js";
import { baseDocumentSchema } from "./common.js";
import { DocumentCategorySchema } from "./documents.js";
// ============================================================================
// LIMITATION SEVERITIES
// ============================================================================
export const LIMITATION_SEVERITIES = ["mild", "moderate", "severe"];
export const LimitationSeveritySchema = z.enum(LIMITATION_SEVERITIES);
export const LIMITATION_SEVERITY = {
    MILD: "mild",
    MODERATE: "moderate",
    SEVERE: "severe",
};
export const LIMITATION_SEVERITY_LABELS = {
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
};
// ============================================================================
// BIOMETRIC SOURCES
// ============================================================================
/**
 * Sources from which biometric data can be captured.
 * Used to track data provenance and enable source-specific filtering.
 *
 * **VERIFICATION RULE**:
 * - VERIFIED (isVerified: true): LAB_REPORT, CLINICIAN_ENTRY, DERIVED
 *   → Manual input from admins/clinicians/trainers, parsed lab reports, or system-calculated values
 * - UNVERIFIED (isVerified: false): All others (APPLE_HEALTH, USER_LOG, GOOGLE_FIT, OURA, WHOOP, DEVICE)
 *   → Data from wearables or user self-entry - not vetted for accuracy
 */
export const BIOMETRIC_SOURCES = [
    "LAB_REPORT",
    "CLINICIAN_ENTRY",
    "DERIVED",
    "APPLE_HEALTH",
    "USER_LOG",
    "GOOGLE_FIT",
    "OURA",
    "WHOOP",
    "DEVICE",
];
export const BiometricSourceSchema = z.enum(BIOMETRIC_SOURCES);
export const BIOMETRIC_SOURCE = {
    LAB_REPORT: "LAB_REPORT",
    CLINICIAN_ENTRY: "CLINICIAN_ENTRY",
    DERIVED: "DERIVED",
    APPLE_HEALTH: "APPLE_HEALTH",
    USER_LOG: "USER_LOG",
    GOOGLE_FIT: "GOOGLE_FIT",
    OURA: "OURA",
    WHOOP: "WHOOP",
    DEVICE: "DEVICE",
};
/** Human-readable labels for biometric sources */
export const BIOMETRIC_SOURCE_LABELS = {
    LAB_REPORT: "Lab Report",
    CLINICIAN_ENTRY: "Clinician Entry",
    DERIVED: "System Calculated",
    APPLE_HEALTH: "Apple Health",
    USER_LOG: "User Log",
    GOOGLE_FIT: "Google Fit",
    OURA: "Oura",
    WHOOP: "Whoop",
    DEVICE: "Device",
};
// ============================================================================
// INJURY RECOVERY STATUS
// ============================================================================
export const INJURY_RECOVERY_STATUSES = [
    "active",
    "recovering",
    "healed",
    "chronic",
];
export const InjuryRecoveryStatusSchema = z.enum(INJURY_RECOVERY_STATUSES);
export const INJURY_RECOVERY_STATUS = {
    ACTIVE: "active",
    RECOVERING: "recovering",
    HEALED: "healed",
    CHRONIC: "chronic",
};
export const INJURY_RECOVERY_STATUS_LABELS = {
    active: "Active",
    recovering: "Recovering",
    healed: "Healed",
    chronic: "Chronic",
};
// ============================================================================
// MEDICAL CONDITION STATUS
// ============================================================================
export const MEDICAL_CONDITION_STATUSES = [
    "active",
    "managed",
    "resolved",
    "monitoring",
];
export const MedicalConditionStatusSchema = z.enum(MEDICAL_CONDITION_STATUSES);
export const MEDICAL_CONDITION_STATUS = {
    ACTIVE: "active",
    MANAGED: "managed",
    RESOLVED: "resolved",
    MONITORING: "monitoring",
};
export const MEDICAL_CONDITION_STATUS_LABELS = {
    active: "Active",
    managed: "Managed",
    resolved: "Resolved",
    monitoring: "Monitoring",
};
// ============================================================================
// MEDICATION CONTRACT
// ============================================================================
export const medicationSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Medication name is required").max(200, "Name must be at most 200 characters"),
    dosage: z.string().min(1, "Dosage is required").max(100, "Dosage must be at most 100 characters"),
    frequency: z.string().min(1, "Frequency is required").max(200, "Frequency must be at most 200 characters"),
    notes: z.string().max(5000, "Notes must be at most 5000 characters").optional(),
});
/**
 * Form-level schema for a single medication entry in the admin UI (PHI).
 * Used to validate medication form fields before API submission.
 * Intentionally lenient: dosage/frequency optional so partial entries can be
 * validated incrementally (required-field gate lives in the container save handler).
 */
export const medicationItemSchema = z.object({
    name: z.string().trim().min(1, "Medication name is required").max(200),
    dosage: z.string().trim().max(100).optional(),
    frequency: z.string().trim().max(100).optional(),
    notes: z.string().trim().max(1000).optional(),
});
export const medicationsSchema = z.array(medicationSchema);
// ============================================================================
// LIMITATION CONTRACT
// ============================================================================
export const limitationSchema = z.object({
    id: z.string(),
    description: z.string().min(1, "Limitation description is required").max(500, "Description must be at most 500 characters"),
    severity: LimitationSeveritySchema.optional(),
    notes: z.string().max(5000, "Notes must be at most 5000 characters").optional(),
});
export const limitationsSchema = z.array(limitationSchema);
// ============================================================================
// INJURY CONTRACT
// ============================================================================
export const injurySchema = z.object({
    id: z.string(),
    description: z.string().min(1, "Injury description is required").max(500),
    bodyPart: z.string().max(100).optional(),
    occurredAt: z.string().optional(), // ISO date
    severity: LimitationSeveritySchema.optional(),
    recoveryStatus: InjuryRecoveryStatusSchema.optional(),
    notes: z.string().max(5000).optional(),
});
export const injuriesSchema = z.array(injurySchema);
// ============================================================================
// MEDICAL CONDITION CONTRACT
// ============================================================================
export const medicalConditionSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Condition name is required").max(200),
    status: MedicalConditionStatusSchema,
    diagnosisDate: z.string().optional(), // ISO date
    notes: z.string().max(5000).optional(),
});
export const medicalConditionsSchema = z.array(medicalConditionSchema);
// ============================================================================
// CARE TEAM ROLE
// ============================================================================
/**
 * Roles for care team members associated with a patient.
 */
export const CARE_TEAM_ROLES = [
    "primary_care",
    "endocrinologist",
    "cardiologist",
    "nutritionist",
    "nurse",
    "health_coach",
    "other",
];
export const CareTeamRoleSchema = z.enum(CARE_TEAM_ROLES);
export const CARE_TEAM_ROLE = {
    PRIMARY_CARE: "primary_care",
    ENDOCRINOLOGIST: "endocrinologist",
    CARDIOLOGIST: "cardiologist",
    NUTRITIONIST: "nutritionist",
    NURSE: "nurse",
    HEALTH_COACH: "health_coach",
    OTHER: "other",
};
export const CARE_TEAM_ROLE_LABELS = {
    primary_care: "Primary Care",
    endocrinologist: "Endocrinologist",
    cardiologist: "Cardiologist",
    nutritionist: "Nutritionist",
    nurse: "Nurse",
    health_coach: "Health Coach",
    other: "Other",
};
// ============================================================================
// NOTE LIMITS (shared constants for note content validation)
// ============================================================================
/**
 * Shared content and tag limits for all note types.
 *
 * Use these constants in:
 * - Server route validation (server/src/validation/notes.ts)
 * - Client form validation (features, components)
 *
 * This ensures server and client enforce identical constraints without
 * duplicating magic numbers.
 */
export const NOTE_LIMITS = {
    /** User-created notes (patient self-entry) */
    USER_CONTENT_MAX: 10_000,
    /** Clinical notes (admin/clinician entry) */
    CLINICAL_CONTENT_MAX: 5_000,
    /** Maximum tags per note */
    MAX_TAGS: 20,
    /** Maximum tag length in characters */
    MAX_TAG_LENGTH: 100,
};
// ============================================================================
// NOTE INPUT SCHEMAS (canonical — derive from NOTE_LIMITS)
// ============================================================================
/**
 * Canonical tags schema — enforces MAX_TAGS and MAX_TAG_LENGTH.
 * Use in both server validation and client form schemas.
 */
export const noteTagsSchema = z
    .array(z.string().max(NOTE_LIMITS.MAX_TAG_LENGTH))
    .max(NOTE_LIMITS.MAX_TAGS, `Too many tags (max ${NOTE_LIMITS.MAX_TAGS})`);
/**
 * Canonical note input schema for user-created (patient self-entry) notes.
 * Server route: server/src/validation/notes.ts createNoteBodySchema
 */
export const userNoteInputSchema = z.object({
    patientId: z.string().min(1),
    content: z
        .string()
        .min(1, "Content is required")
        .max(NOTE_LIMITS.USER_CONTENT_MAX, `Content must be ${NOTE_LIMITS.USER_CONTENT_MAX} characters or less`),
    tags: noteTagsSchema.optional(),
});
/**
 * Canonical note input schema for clinical notes (admin/clinician entry).
 * Server route: server/src/validation/notes.ts createClinicalNoteBodySchema
 *
 * NOTE: createdAt is omitted — server decides whether to accept it based on
 * the caller's role (ADMIN may supply it; CLINICIAN must use server timestamp).
 */
export const clinicalNoteInputSchema = z.object({
    content: z
        .string()
        .min(1, "Content is required")
        .max(NOTE_LIMITS.CLINICAL_CONTENT_MAX, `Content must be ${NOTE_LIMITS.CLINICAL_CONTENT_MAX} characters or less`),
    tags: noteTagsSchema.optional(),
    createdAt: z.string().datetime().optional(),
});
// ============================================================================
// CLINICAL NOTE CONTRACT
// ============================================================================
export const ClinicalNoteContractSchema = z.object({
    id: z.string(),
    patientId: z.string().nullable(),
    authorId: z.string().nullable(),
    content: z.string().min(1, "Note content is required"),
    tags: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ============================================================================
// PATIENT DOCUMENT CONTRACT
// ============================================================================
export const PatientDocumentContractSchema = z.object({
    id: z.string(),
    patientId: z.string(),
    uploaderId: z.string(),
    fileUrl: z.string().url(),
    fileType: z.string().min(1),
    category: DocumentCategorySchema.default("OTHER"),
    tags: z.array(z.string()),
    notes: z.string().nullable().optional(),
    extractedData: extractedDataSchema.optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// Backward-compatible schemas using baseDocumentSchema
export const clinicalNoteSchema = baseDocumentSchema.extend({
    id: z.string().optional(),
    patientId: z.string(),
    authorId: z.string(),
    content: z.string().min(1),
    tags: z.array(z.string()),
});
export const patientDocumentSchema = baseDocumentSchema.extend({
    id: z.string().optional(),
    patientId: z.string(),
    uploaderId: z.string(),
    fileUrl: z.string().url(),
    fileType: z.string().min(1),
    category: DocumentCategorySchema.default("OTHER"),
    tags: z.array(z.string()),
    extractedData: extractedDataSchema.optional(),
});
// ============================================================================
// MOCK FACTORIES
// ============================================================================
/**
 * Mock factory for Medication (testing)
 */
export const createMockMedication = (overrides = {}) => ({
    id: "med-test-id",
    name: "Test Medication",
    dosage: "100mg",
    frequency: "once daily",
    notes: "Take with food",
    ...overrides,
});
/**
 * Mock factory for Limitation (testing)
 */
export const createMockLimitation = (overrides = {}) => ({
    id: "lim-test-id",
    description: "Test limitation",
    severity: "moderate",
    notes: "Avoid high-impact exercises",
    ...overrides,
});
//# sourceMappingURL=clinical.js.map