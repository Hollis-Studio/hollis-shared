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

import { z } from 'zod';

// ============================================================================
// LIMITATION SEVERITIES
// ============================================================================

export const LIMITATION_SEVERITIES = ['mild', 'moderate', 'severe'] as const;
export type LimitationSeverity = (typeof LIMITATION_SEVERITIES)[number];

export const LimitationSeveritySchema = z.enum(LIMITATION_SEVERITIES);

export const LIMITATION_SEVERITY = {
  MILD: 'mild' as LimitationSeverity,
  MODERATE: 'moderate' as LimitationSeverity,
  SEVERE: 'severe' as LimitationSeverity,
} as const;

export const LIMITATION_SEVERITY_LABELS: Record<LimitationSeverity, string> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
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
  'LAB_REPORT',
  'CLINICIAN_ENTRY',
  'DERIVED',
  'APPLE_HEALTH',
  'USER_LOG',
  'GOOGLE_FIT',
  'OURA',
  'WHOOP',
  'DEVICE',
] as const;
export type BiometricSource = (typeof BIOMETRIC_SOURCES)[number];

export const BiometricSourceSchema = z.enum(BIOMETRIC_SOURCES);

export const BIOMETRIC_SOURCE = {
  LAB_REPORT: 'LAB_REPORT' as BiometricSource,
  CLINICIAN_ENTRY: 'CLINICIAN_ENTRY' as BiometricSource,
  DERIVED: 'DERIVED' as BiometricSource,
  APPLE_HEALTH: 'APPLE_HEALTH' as BiometricSource,
  USER_LOG: 'USER_LOG' as BiometricSource,
  GOOGLE_FIT: 'GOOGLE_FIT' as BiometricSource,
  OURA: 'OURA' as BiometricSource,
  WHOOP: 'WHOOP' as BiometricSource,
  DEVICE: 'DEVICE' as BiometricSource,
} as const;

/** Human-readable labels for biometric sources */
export const BIOMETRIC_SOURCE_LABELS: Record<BiometricSource, string> = {
  LAB_REPORT: 'Lab Report',
  CLINICIAN_ENTRY: 'Clinician Entry',
  DERIVED: 'System Calculated',
  APPLE_HEALTH: 'Apple Health',
  USER_LOG: 'User Log',
  GOOGLE_FIT: 'Google Fit',
  OURA: 'Oura',
  WHOOP: 'Whoop',
  DEVICE: 'Device',
};

// ============================================================================
// INJURY RECOVERY STATUS
// ============================================================================

export const INJURY_RECOVERY_STATUSES = ['active', 'recovering', 'healed', 'chronic'] as const;
export type InjuryRecoveryStatus = (typeof INJURY_RECOVERY_STATUSES)[number];

export const InjuryRecoveryStatusSchema = z.enum(INJURY_RECOVERY_STATUSES);

export const INJURY_RECOVERY_STATUS = {
  ACTIVE: 'active' as InjuryRecoveryStatus,
  RECOVERING: 'recovering' as InjuryRecoveryStatus,
  HEALED: 'healed' as InjuryRecoveryStatus,
  CHRONIC: 'chronic' as InjuryRecoveryStatus,
} as const;

export const INJURY_RECOVERY_STATUS_LABELS: Record<InjuryRecoveryStatus, string> = {
  active: 'Active',
  recovering: 'Recovering',
  healed: 'Healed',
  chronic: 'Chronic',
};

// ============================================================================
// MEDICAL CONDITION STATUS
// ============================================================================

export const MEDICAL_CONDITION_STATUSES = ['active', 'managed', 'resolved', 'monitoring'] as const;
export type MedicalConditionStatus = (typeof MEDICAL_CONDITION_STATUSES)[number];

export const MedicalConditionStatusSchema = z.enum(MEDICAL_CONDITION_STATUSES);

export const MEDICAL_CONDITION_STATUS = {
  ACTIVE: 'active' as MedicalConditionStatus,
  MANAGED: 'managed' as MedicalConditionStatus,
  RESOLVED: 'resolved' as MedicalConditionStatus,
  MONITORING: 'monitoring' as MedicalConditionStatus,
} as const;

export const MEDICAL_CONDITION_STATUS_LABELS: Record<MedicalConditionStatus, string> = {
  active: 'Active',
  managed: 'Managed',
  resolved: 'Resolved',
  monitoring: 'Monitoring',
};

// ============================================================================
// MEDICATION CONTRACT
// ============================================================================

/**
 * Medication entry for patient clinical profile.
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export const medicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Medication name is required').max(200),
  dosage: z.string().min(1, 'Dosage is required').max(100),
  frequency: z.string().min(1, 'Frequency is required').max(200),
  notes: z.string().max(5000).optional(),
});

export const medicationsSchema = z.array(medicationSchema);

// ============================================================================
// LIMITATION CONTRACT
// ============================================================================

/**
 * Physical limitation/restriction for patient clinical profile.
 */
export interface Limitation {
  id: string;
  description: string;
  severity?: LimitationSeverity;
  notes?: string;
}

export const limitationSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Limitation description is required').max(500),
  severity: LimitationSeveritySchema.optional(),
  notes: z.string().max(5000).optional(),
});

export const limitationsSchema = z.array(limitationSchema);

// ============================================================================
// INJURY CONTRACT
// ============================================================================

/**
 * Injury entry for patient clinical profile.
 * Tracks injuries with body location, timing, severity, and recovery progress.
 */
export interface Injury {
  id: string;
  description: string;
  bodyPart?: string;
  occurredAt?: string; // ISO date string
  severity?: LimitationSeverity;
  recoveryStatus?: InjuryRecoveryStatus;
  notes?: string;
}

export const injurySchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Injury description is required').max(500),
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

/**
 * Medical condition entry for patient clinical profile.
 * Tracks diagnoses with status and management information.
 */
export interface MedicalCondition {
  id: string;
  name: string;
  status: MedicalConditionStatus;
  diagnosisDate?: string; // ISO date string
  notes?: string;
}

export const medicalConditionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Condition name is required').max(200),
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
  'primary_care',
  'endocrinologist',
  'cardiologist',
  'nutritionist',
  'nurse',
  'health_coach',
  'other',
] as const;
export type CareTeamRole = (typeof CARE_TEAM_ROLES)[number];

export const CareTeamRoleSchema = z.enum(CARE_TEAM_ROLES);

export const CARE_TEAM_ROLE = {
  PRIMARY_CARE: 'primary_care' as CareTeamRole,
  ENDOCRINOLOGIST: 'endocrinologist' as CareTeamRole,
  CARDIOLOGIST: 'cardiologist' as CareTeamRole,
  NUTRITIONIST: 'nutritionist' as CareTeamRole,
  NURSE: 'nurse' as CareTeamRole,
  HEALTH_COACH: 'health_coach' as CareTeamRole,
  OTHER: 'other' as CareTeamRole,
} as const;

export const CARE_TEAM_ROLE_LABELS: Record<CareTeamRole, string> = {
  primary_care: 'Primary Care',
  endocrinologist: 'Endocrinologist',
  cardiologist: 'Cardiologist',
  nutritionist: 'Nutritionist',
  nurse: 'Nurse',
  health_coach: 'Health Coach',
  other: 'Other',
};

// ============================================================================
// MOCK FACTORIES
// ============================================================================

/**
 * Mock factory for Medication (testing)
 */
export const createMockMedication = (overrides: Partial<Medication> = {}): Medication => ({
  id: 'med-test-id',
  name: 'Test Medication',
  dosage: '100mg',
  frequency: 'once daily',
  notes: 'Take with food',
  ...overrides,
});

/**
 * Mock factory for Limitation (testing)
 */
export const createMockLimitation = (overrides: Partial<Limitation> = {}): Limitation => ({
  id: 'lim-test-id',
  description: 'Test limitation',
  severity: 'moderate',
  notes: 'Avoid high-impact exercises',
  ...overrides,
});
