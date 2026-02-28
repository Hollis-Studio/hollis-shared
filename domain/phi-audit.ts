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

import { z } from "zod";

// ============================================================================
// PHI RESOURCE TYPES
// ============================================================================

/**
 * Types of PHI resources that can be accessed
 */
export const PHI_RESOURCES = [
  "user",
  "user-account",
  "clinical_profile",
  "lab_panel",
  "lab_result",
  "clinical_note",
  "patient_document",
  "document",
  "biometric_entry",
  "biometrics",
  "appointment",
  "health_metric_goal",
  "health_goal",
  "health_snapshot",
  "medication",
  "limitation",
  "crm",
  "health_progress",
  "daily_metrics",
  "daily_summary",
  "daily_log",
  "measurement",
  "session",
  "journal",
  "phi",
  "message",
  "push",
  "push_token",
  "upload",
  "ai_permanent_note",
  "client_intake",
  "registration",
  "workout_plan",
  "nutrition_plan",
  "ai_context",
  "training_strategy",
  "exercise_logs",
  "billing_dispute",
] as const;
export const PhiResourceSchema = z.enum(PHI_RESOURCES);
export type PhiResource = z.infer<typeof PhiResourceSchema>;

/**
 * Constant map for PHI resources to avoid magic strings
 */
export const PHI_RESOURCE = {
  USER: "user",
  USER_ACCOUNT: "user-account",
  CLINICAL_PROFILE: "clinical_profile",
  LAB_PANEL: "lab_panel",
  LAB_RESULT: "lab_result",
  CLINICAL_NOTE: "clinical_note",
  PATIENT_DOCUMENT: "patient_document",
  DOCUMENT: "document",
  BIOMETRIC_ENTRY: "biometric_entry",
  BIOMETRICS: "biometrics",
  APPOINTMENT: "appointment",
  HEALTH_METRIC_GOAL: "health_metric_goal",
  HEALTH_GOAL: "health_goal",
  HEALTH_SNAPSHOT: "health_snapshot",
  MEDICATION: "medication",
  LIMITATION: "limitation",
  CRM: "crm",
  HEALTH_PROGRESS: "health_progress",
  DAILY_METRICS: "daily_metrics",
  DAILY_SUMMARY: "daily_summary",
  DAILY_LOG: "daily_log",
  MEASUREMENT: "measurement",
  SESSION: "session",
  JOURNAL: "journal",
  PHI: "phi",
  MESSAGE: "message",
  PUSH: "push",
  PUSH_TOKEN: "push_token",
  UPLOAD: "upload",
  AI_PERMANENT_NOTE: "ai_permanent_note",
  CLIENT_INTAKE: "client_intake",
  REGISTRATION: "registration",
  WORKOUT_PLAN: "workout_plan",
  NUTRITION_PLAN: "nutrition_plan",
  AI_CONTEXT: "ai_context",
  TRAINING_STRATEGY: "training_strategy",
  EXERCISE_LOGS: "exercise_logs",
  BILLING_DISPUTE: "billing_dispute",
} as const;

// ============================================================================
// PHI ACTION TYPES
// ============================================================================

/**
 * Actions that can be performed on PHI
 */
export const PHI_ACTIONS = [
  "READ",
  "CREATE",
  "UPDATE",
  "DELETE",
  "LIST",
] as const;
export const PhiActionSchema = z.enum(PHI_ACTIONS);
export type PhiAction = z.infer<typeof PhiActionSchema>;

/**
 * Constant map for PHI actions to avoid magic strings
 */
export const PHI_ACTION = {
  READ: "READ",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LIST: "LIST",
} as const;

// ============================================================================
// ACCESS REASONS
// ============================================================================

/**
 * Business justifications for PHI access (HIPAA requirement)
 */
export const PHI_ACCESS_REASONS = [
  "treatment",
  "payment",
  "healthcare_ops",
  "patient_request",
  "legal_requirement",
  "emergency",
  "research",
  "admin",
  "unspecified",
] as const;
export const PhiAccessReasonSchema = z.enum(PHI_ACCESS_REASONS);
export type PhiAccessReason = z.infer<typeof PhiAccessReasonSchema>;

/**
 * Labels for access reasons
 */
export const PHI_ACCESS_REASON_LABELS: Record<PhiAccessReason, string> = {
  treatment: "Direct Patient Care",
  payment: "Billing & Insurance",
  healthcare_ops: "Quality Assurance",
  patient_request: "Patient Viewing Own Data",
  legal_requirement: "Legal Requirement",
  emergency: "Emergency Care",
  research: "IRB-Approved Research",
  admin: "System Administration",
  unspecified: "Unspecified",
};

/** Constant map for PHI access reasons to avoid magic strings */
export const PHI_ACCESS_REASON = {
  TREATMENT: "treatment" as PhiAccessReason,
  PAYMENT: "payment" as PhiAccessReason,
  HEALTHCARE_OPS: "healthcare_ops" as PhiAccessReason,
  PATIENT_REQUEST: "patient_request" as PhiAccessReason,
  LEGAL_REQUIREMENT: "legal_requirement" as PhiAccessReason,
  EMERGENCY: "emergency" as PhiAccessReason,
  RESEARCH: "research" as PhiAccessReason,
  ADMIN: "admin" as PhiAccessReason,
  UNSPECIFIED: "unspecified" as PhiAccessReason,
} as const;

// ============================================================================
// LOWERCASE SCHEMA ALIASES (backward compatibility)
// ============================================================================

/** @deprecated Use PhiResourceSchema instead */
// zod-manual: deprecated alias
export const phiResourceSchema = PhiResourceSchema;
/** @deprecated Use PhiActionSchema instead */
// zod-manual: deprecated alias
export const phiActionSchema = PhiActionSchema;
/** @deprecated Use PhiAccessReasonSchema instead */
// zod-manual: deprecated alias
export const phiAccessReasonSchema = PhiAccessReasonSchema;

// ============================================================================
// AUDIT LOG ENTRY
// ============================================================================

export const phiAuditLogEntrySchema = z.object({
  id: z.string(),
  actorId: z.string(),
  userId: z.string().nullable(),
  resource: PhiResourceSchema,
  action: PhiActionSchema,
  method: z.string(),
  path: z.string(),
  resourceId: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  success: z.boolean(),
  errorMessage: z.string().nullable(),
  accessReason: z.string().nullable(),
  sequenceNumber: z.string().nullable(),
  previousHash: z.string().nullable(),
  integrityHash: z.string().nullable(),
  verifiedAt: z.string().nullable(),
  createdAt: z.string(),
});

export type PhiAuditLogEntryContract = z.infer<typeof phiAuditLogEntrySchema>;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

/** Mock factory for tests */
export const createMockPhiAuditLogEntry = (
  overrides: Partial<PhiAuditLogEntryContract> = {},
): PhiAuditLogEntryContract => ({
  id: "audit-log-id",
  actorId: "actor-123",
  userId: "user-456",
  resource: PHI_RESOURCE.USER as PhiResource,
  action: PHI_ACTION.READ as PhiAction,
  method: "GET",
  path: "/users/user-456",
  resourceId: "user-456",
  ipAddress: "127.0.0.1",
  userAgent: "jest",
  success: true,
  errorMessage: null,
  accessReason: "Treatment",
  sequenceNumber: null,
  previousHash: null,
  integrityHash: null,
  verifiedAt: null,
  createdAt: new Date().toISOString(),
  ...overrides,
});
