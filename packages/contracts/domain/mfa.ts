/**
 * @ai-context MFA Domain Contracts | Multi-Factor Authentication types and schemas
 *
 * Provides type-safe definitions for:
 * - MFA credential types (TOTP, WebAuthn)
 * - MFA event types (setup, verification, recovery)
 * - Step-up auth action types
 * - Clinician-patient assignment status
 *
 * deps: zod | consumers: server, web-admin
 */

import { z } from 'zod';

// ============================================================================
// MFA CREDENTIAL TYPES
// ============================================================================

/**
 * Types of MFA credentials supported
 */
export const MFA_CREDENTIAL_TYPES = ['TOTP', 'WEBAUTHN'] as const;
export type MfaCredentialType = (typeof MFA_CREDENTIAL_TYPES)[number];
export const MfaCredentialTypeSchema = z.enum(MFA_CREDENTIAL_TYPES);

/**
 * Labels for MFA credential types
 */
export const MFA_CREDENTIAL_TYPE_LABELS: Record<MfaCredentialType, string> = {
  TOTP: 'Authenticator App',
  WEBAUTHN: 'Security Key / Passkey',
};

// ============================================================================
// MFA EVENT TYPES
// ============================================================================

/**
 * Types of MFA events for audit logging
 */
export const MFA_EVENT_TYPES = [
  'SETUP_STARTED',
  'SETUP_COMPLETED',
  'SETUP_CANCELLED',
  'VERIFICATION_SUCCESS',
  'VERIFICATION_FAILED',
  'BACKUP_CODE_USED',
  'CREDENTIAL_REMOVED',
  'RECOVERY_INITIATED',
  'RECOVERY_COMPLETED',
  'STEP_UP_REQUIRED',
  'STEP_UP_SUCCESS',
  'STEP_UP_FAILED',
] as const;
export type MfaEventType = (typeof MFA_EVENT_TYPES)[number];
export const MfaEventTypeSchema = z.enum(MFA_EVENT_TYPES);

// ============================================================================
// STEP-UP AUTH ACTIONS
// ============================================================================

/**
 * Actions that require step-up authentication (MFA re-verification)
 * These are high-risk actions that need extra security even after initial MFA
 */
export const STEP_UP_AUTH_ACTIONS = [
  'EXPORT_DATA',
  'CHANGE_ROLE',
  'RESET_PASSWORD',
  'DELETE_ACCOUNT',
  'MODIFY_MFA',
  'ASSIGN_CLINICIAN',
  'REVOKE_ASSIGNMENT',
  'VIEW_AUDIT_LOGS',
  'MODIFY_PERMISSIONS',
  'BULK_OPERATIONS',
] as const;
export type StepUpAuthAction = (typeof STEP_UP_AUTH_ACTIONS)[number];
export const StepUpAuthActionSchema = z.enum(STEP_UP_AUTH_ACTIONS);

/**
 * Step-up auth window in milliseconds (how long a step-up verification lasts)
 * Default: 15 minutes
 */
export const STEP_UP_AUTH_WINDOW_MS = 15 * 60 * 1000;

// ============================================================================
// CLINICIAN-PATIENT ASSIGNMENT STATUS
// ============================================================================

/**
 * Status values for clinician-patient assignments
 */
export const ASSIGNMENT_STATUSES = ['ACTIVE', 'REVOKED', 'PENDING'] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];
export const AssignmentStatusSchema = z.enum(ASSIGNMENT_STATUSES);

/** Centralized assignment status constants for equality checks */
export const ASSIGNMENT_STATUS = {
  ACTIVE: 'ACTIVE' as AssignmentStatus,
  REVOKED: 'REVOKED' as AssignmentStatus,
  PENDING: 'PENDING' as AssignmentStatus,
} as const;

/**
 * Labels for assignment statuses
 */
export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  ACTIVE: 'Active',
  REVOKED: 'Revoked',
  PENDING: 'Pending Confirmation',
};

// ============================================================================
// MFA CONTRACTS
// ============================================================================

/**
 * MFA credential as returned from API (excludes secrets)
 */
export const mfaCredentialResponseSchema = z.object({
  id: z.string().uuid(),
  type: MfaCredentialTypeSchema,
  name: z.string().min(1).max(100),
  isVerified: z.boolean(),
  isDefault: z.boolean(),
  lastUsedAt: z.string().datetime().nullable(),
  backupCodesRemaining: z.number().int().min(0),
  createdAt: z.string().datetime(),
});
export type MfaCredentialResponseContract = z.infer<typeof mfaCredentialResponseSchema>;

/**
 * TOTP setup initiation response
 */
export const totpSetupResponseSchema = z.object({
  credentialId: z.string().uuid(),
  secret: z.string(), // Base32 encoded TOTP secret (shown to user once)
  qrCodeUri: z.string(), // otpauth:// URI for QR code generation
  backupCodes: z.array(z.string()).length(10), // One-time backup codes
});
export type TotpSetupResponseContract = z.infer<typeof totpSetupResponseSchema>;

/**
 * TOTP verification request
 */
export const totpVerifyRequestSchema = z.object({
  credentialId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});
export type TotpVerifyRequestContract = z.infer<typeof totpVerifyRequestSchema>;

/**
 * MFA verification for login
 */
export const mfaLoginVerifyRequestSchema = z.object({
  userId: z.string(),
  code: z.string(),
  credentialId: z.string().uuid().optional(), // Optional: specific credential to use
  isBackupCode: z.boolean().optional().default(false),
});
export type MfaLoginVerifyRequestContract = z.infer<typeof mfaLoginVerifyRequestSchema>;

/**
 * Step-up auth request
 */
export const stepUpAuthRequestSchema = z.object({
  action: StepUpAuthActionSchema,
  code: z.string(),
  credentialId: z.string().uuid().optional(),
});
export type StepUpAuthRequestContract = z.infer<typeof stepUpAuthRequestSchema>;

/**
 * Step-up auth response
 */
export const stepUpAuthResponseSchema = z.object({
  success: z.boolean(),
  stepUpToken: z.string().optional(), // Short-lived token for the specific action
  expiresAt: z.string().datetime().optional(),
});
export type StepUpAuthResponseContract = z.infer<typeof stepUpAuthResponseSchema>;

/**
 * MFA status for a user
 */
export const mfaStatusResponseSchema = z.object({
  isEnabled: z.boolean(),
  isRequired: z.boolean(), // True for ADMIN/CLINICIAN roles
  credentials: z.array(mfaCredentialResponseSchema),
  hasBackupCodes: z.boolean(),
  lastVerifiedAt: z.string().datetime().nullable(),
});
export type MfaStatusResponseContract = z.infer<typeof mfaStatusResponseSchema>;

// ============================================================================
// CLINICIAN-PATIENT ASSIGNMENT CONTRACTS
// ============================================================================

/**
 * Clinician-patient assignment record
 */
export const clinicianPatientAssignmentSchema = z.object({
  id: z.string().uuid(),
  clinicianId: z.string(),
  patientId: z.string(),
  status: AssignmentStatusSchema,
  isPrimary: z.boolean(),
  assignedById: z.string().nullable(),
  assignmentReason: z.string().nullable(),
  revocationReason: z.string().nullable(),
  revokedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ClinicianPatientAssignmentContract = z.infer<typeof clinicianPatientAssignmentSchema>;

/**
 * Request to create a clinician-patient assignment
 */
export const createAssignmentRequestSchema = z.object({
  clinicianId: z.string(),
  patientId: z.string(),
  isPrimary: z.boolean().optional().default(false),
  assignmentReason: z.string().max(500).optional(),
});
export type CreateAssignmentRequestContract = z.infer<typeof createAssignmentRequestSchema>;

/**
 * Request to revoke a clinician-patient assignment
 */
export const revokeAssignmentRequestSchema = z.object({
  revocationReason: z.string().max(500).optional(),
});
export type RevokeAssignmentRequestContract = z.infer<typeof revokeAssignmentRequestSchema>;

/**
 * Enriched assignment with user details
 */
export const enrichedAssignmentSchema = clinicianPatientAssignmentSchema.extend({
  clinician: z.object({
    id: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string(),
  }),
  patient: z.object({
    id: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string(),
  }),
});
export type EnrichedAssignmentContract = z.infer<typeof enrichedAssignmentSchema>;
