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
import { extractedDataSchema } from "../schemas/json-blobs";
import { baseDocumentSchema } from "./common";
import { DocumentCategorySchema } from "./documents";

// ============================================================================
// LIMITATION SEVERITIES
// ============================================================================

export const LIMITATION_SEVERITIES = ["mild", "moderate", "severe"] as const;

export const LimitationSeveritySchema = z.enum(LIMITATION_SEVERITIES);
export type LimitationSeverity = z.infer<typeof LimitationSeveritySchema>;

export const LIMITATION_SEVERITY = {
  MILD: "mild" as LimitationSeverity,
  MODERATE: "moderate" as LimitationSeverity,
  SEVERE: "severe" as LimitationSeverity,
} as const;

export const LIMITATION_SEVERITY_LABELS: Record<LimitationSeverity, string> = {
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
] as const;

export const BiometricSourceSchema = z.enum(BIOMETRIC_SOURCES);
export type BiometricSource = z.infer<typeof BiometricSourceSchema>;

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
} as const satisfies Record<BiometricSource, BiometricSource>;

/** Human-readable labels for biometric sources */
export const BIOMETRIC_SOURCE_LABELS: Record<BiometricSource, string> = {
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
] as const;

export const InjuryRecoveryStatusSchema = z.enum(INJURY_RECOVERY_STATUSES);
export type InjuryRecoveryStatus = z.infer<typeof InjuryRecoveryStatusSchema>;

export const INJURY_RECOVERY_STATUS = {
  ACTIVE: "active" as InjuryRecoveryStatus,
  RECOVERING: "recovering" as InjuryRecoveryStatus,
  HEALED: "healed" as InjuryRecoveryStatus,
  CHRONIC: "chronic" as InjuryRecoveryStatus,
} as const;

export const INJURY_RECOVERY_STATUS_LABELS: Record<
  InjuryRecoveryStatus,
  string
> = {
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
] as const;

export const MedicalConditionStatusSchema = z.enum(MEDICAL_CONDITION_STATUSES);
export type MedicalConditionStatus = z.infer<
  typeof MedicalConditionStatusSchema
>;

export const MEDICAL_CONDITION_STATUS = {
  ACTIVE: "active" as MedicalConditionStatus,
  MANAGED: "managed" as MedicalConditionStatus,
  RESOLVED: "resolved" as MedicalConditionStatus,
  MONITORING: "monitoring" as MedicalConditionStatus,
} as const;

export const MEDICAL_CONDITION_STATUS_LABELS: Record<
  MedicalConditionStatus,
  string
> = {
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
  name: z.string().min(1, "Medication name is required").max(200),
  dosage: z.string().min(1, "Dosage is required").max(100),
  frequency: z.string().min(1, "Frequency is required").max(200),
  notes: z.string().max(5000).optional(),
});

export type Medication = z.infer<typeof medicationSchema>;

export const medicationsSchema = z.array(medicationSchema);
export type Medications = z.infer<typeof medicationsSchema>;

// ============================================================================
// LIMITATION CONTRACT
// ============================================================================

export const limitationSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Limitation description is required").max(500),
  severity: LimitationSeveritySchema.optional(),
  notes: z.string().max(5000).optional(),
});

export type Limitation = z.infer<typeof limitationSchema>;

export const limitationsSchema = z.array(limitationSchema);
export type Limitations = z.infer<typeof limitationsSchema>;

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

export type Injury = z.infer<typeof injurySchema>;

export const injuriesSchema = z.array(injurySchema);
export type Injuries = z.infer<typeof injuriesSchema>;

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

export type MedicalCondition = z.infer<typeof medicalConditionSchema>;

export const medicalConditionsSchema = z.array(medicalConditionSchema);
export type MedicalConditions = z.infer<typeof medicalConditionsSchema>;

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
] as const;

export const CareTeamRoleSchema = z.enum(CARE_TEAM_ROLES);
export type CareTeamRole = z.infer<typeof CareTeamRoleSchema>;

export const CARE_TEAM_ROLE = {
  PRIMARY_CARE: "primary_care" as CareTeamRole,
  ENDOCRINOLOGIST: "endocrinologist" as CareTeamRole,
  CARDIOLOGIST: "cardiologist" as CareTeamRole,
  NUTRITIONIST: "nutritionist" as CareTeamRole,
  NURSE: "nurse" as CareTeamRole,
  HEALTH_COACH: "health_coach" as CareTeamRole,
  OTHER: "other" as CareTeamRole,
} as const;

export const CARE_TEAM_ROLE_LABELS: Record<CareTeamRole, string> = {
  primary_care: "Primary Care",
  endocrinologist: "Endocrinologist",
  cardiologist: "Cardiologist",
  nutritionist: "Nutritionist",
  nurse: "Nurse",
  health_coach: "Health Coach",
  other: "Other",
};

// ============================================================================
// CLINICAL NOTE CONTRACT
// ============================================================================

export const ClinicalNoteContractSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  authorId: z.string(),
  content: z.string().min(1, "Note content is required"),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ClinicalNoteContract = z.infer<typeof ClinicalNoteContractSchema>;

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

export type PatientDocumentContract = z.infer<
  typeof PatientDocumentContractSchema
>;

// Backward-compatible schemas using baseDocumentSchema
export const clinicalNoteSchema = baseDocumentSchema.extend({
  id: z.string().optional(),
  patientId: z.string(),
  authorId: z.string(),
  content: z.string().min(1),
  tags: z.array(z.string()),
});
export type ClinicalNote = z.infer<typeof clinicalNoteSchema>;

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
export type PatientDocument = z.infer<typeof patientDocumentSchema>;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

/**
 * Mock factory for Medication (testing)
 */
export const createMockMedication = (
  overrides: Partial<Medication> = {},
): Medication => ({
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
export const createMockLimitation = (
  overrides: Partial<Limitation> = {},
): Limitation => ({
  id: "lim-test-id",
  description: "Test limitation",
  severity: "moderate",
  notes: "Avoid high-impact exercises",
  ...overrides,
});
