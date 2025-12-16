/**
 * @ai-context PHI Audit Domain Contracts | Types for PHI access logging and audit trail
 *
 * Provides type-safe definitions for:
 * - PHI resource types (what PHI was accessed)
 * - PHI action types (what was done with it)
 * - Access reasons (business justification)
 *
 * deps: zod | consumers: server
 */

import { z } from 'zod';

// ============================================================================
// PHI RESOURCE TYPES
// ============================================================================

/**
 * Types of PHI resources that can be accessed
 */
export const PHI_RESOURCES = [
  'user',
  'clinical_profile',
  'lab_panel',
  'clinical_note',
  'patient_document',
  'biometric_entry',
  'appointment',
  'health_metric_goal',
  'health_snapshot',
  'medication',
  'limitation',
  'crm',
  'health_progress',
  'daily_metrics',
  'client_intake',
  'registration',
  'workout_plan',
  'nutrition_plan',
  'ai_context',
  'training_strategy',
] as const;
export type PhiResource = (typeof PHI_RESOURCES)[number];
export const PhiResourceSchema = z.enum(PHI_RESOURCES);

/**
 * Constant map for PHI resources to avoid magic strings
 */
export const PHI_RESOURCE = {
  USER: 'user',
  CLINICAL_PROFILE: 'clinical_profile',
  LAB_PANEL: 'lab_panel',
  CLINICAL_NOTE: 'clinical_note',
  PATIENT_DOCUMENT: 'patient_document',
  BIOMETRIC_ENTRY: 'biometric_entry',
  APPOINTMENT: 'appointment',
  HEALTH_METRIC_GOAL: 'health_metric_goal',
  HEALTH_SNAPSHOT: 'health_snapshot',
  MEDICATION: 'medication',
  LIMITATION: 'limitation',
  CRM: 'crm',
  HEALTH_PROGRESS: 'health_progress',
  DAILY_METRICS: 'daily_metrics',
  CLIENT_INTAKE: 'client_intake',
  REGISTRATION: 'registration',
  WORKOUT_PLAN: 'workout_plan',
  NUTRITION_PLAN: 'nutrition_plan',
  AI_CONTEXT: 'ai_context',
  TRAINING_STRATEGY: 'training_strategy',
} as const;

// ============================================================================
// PHI ACTION TYPES
// ============================================================================

/**
 * Actions that can be performed on PHI
 */
export const PHI_ACTIONS = [
  'READ',
  'CREATE',
  'UPDATE',
  'DELETE',
  'LIST',
] as const;
export type PhiAction = (typeof PHI_ACTIONS)[number];
export const PhiActionSchema = z.enum(PHI_ACTIONS);

/**
 * Constant map for PHI actions to avoid magic strings
 */
export const PHI_ACTION = {
  READ: 'READ',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LIST: 'LIST',
} as const;

// ============================================================================
// ACCESS REASONS
// ============================================================================

/**
 * Business justifications for PHI access (HIPAA requirement)
 */
export const PHI_ACCESS_REASONS = [
  'treatment',
  'payment',
  'healthcare_ops',
  'patient_request',
  'legal_requirement',
  'emergency',
  'research',
  'admin',
  'unspecified',
] as const;
export type PhiAccessReason = (typeof PHI_ACCESS_REASONS)[number];
export const PhiAccessReasonSchema = z.enum(PHI_ACCESS_REASONS);

/**
 * Labels for access reasons
 */
export const PHI_ACCESS_REASON_LABELS: Record<PhiAccessReason, string> = {
  treatment: 'Direct Patient Care',
  payment: 'Billing & Insurance',
  healthcare_ops: 'Quality Assurance',
  patient_request: 'Patient Viewing Own Data',
  legal_requirement: 'Legal Requirement',
  emergency: 'Emergency Care',
  research: 'IRB-Approved Research',
  admin: 'System Administration',
  unspecified: 'Unspecified',
};
