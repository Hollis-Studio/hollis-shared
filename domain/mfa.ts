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

import { z } from "zod";

// ============================================================================
// MFA CODE LENGTH CONSTANTS
// ============================================================================

/**
 * Length of TOTP codes from authenticator apps (6 digits)
 */
export const MFA_TOTP_CODE_LENGTH = 6;

/**
 * Length of backup recovery codes (8 alphanumeric characters)
 */
export const MFA_BACKUP_CODE_LENGTH = 8;

// ============================================================================
// MFA CREDENTIAL TYPES
// ============================================================================

/**
 * Types of MFA credentials supported
 */
export const MFA_CREDENTIAL_TYPES = ["TOTP", "WEBAUTHN"] as const;
export type MfaCredentialType = z.infer<typeof MfaCredentialTypeSchema>;
export const MfaCredentialTypeSchema = z.enum(MFA_CREDENTIAL_TYPES);

/**
 * Labels for MFA credential types
 */
export const MFA_CREDENTIAL_TYPE_LABELS: Record<MfaCredentialType, string> = {
  TOTP: "Authenticator App",
  WEBAUTHN: "Security Key / Passkey",
};

// ============================================================================
// MFA EVENT TYPES
// ============================================================================

/**
 * Types of MFA events for audit logging
 */
export const MFA_EVENT_TYPES = [
  "SETUP_STARTED",
  "SETUP_COMPLETED",
  "SETUP_CANCELLED",
  "VERIFICATION_SUCCESS",
  "VERIFICATION_FAILED",
  "BACKUP_CODE_USED",
  "CREDENTIAL_REMOVED",
  "RECOVERY_INITIATED",
  "RECOVERY_COMPLETED",
  "STEP_UP_REQUIRED",
  "STEP_UP_SUCCESS",
  "STEP_UP_FAILED",
] as const;
export type MfaEventType = z.infer<typeof MfaEventTypeSchema>;
export const MfaEventTypeSchema = z.enum(MFA_EVENT_TYPES);

// ============================================================================
// STEP-UP AUTH ACTIONS
// ============================================================================

/**
 * Actions that require step-up authentication (MFA re-verification)
 * These are high-risk actions that need extra security even after initial MFA
 */
export const STEP_UP_AUTH_ACTIONS = [
  "EXPORT_DATA",
  "CHANGE_ROLE",
  "RESET_PASSWORD",
  "DELETE_ACCOUNT",
  "MODIFY_MFA",
  "ASSIGN_CLINICIAN",
  "REVOKE_ASSIGNMENT",
  "VIEW_AUDIT_LOGS",
  "MODIFY_PERMISSIONS",
  "BULK_OPERATIONS",
  "RESET_USER_MFA", // Admin action to reset another user's MFA
] as const;
export type StepUpAuthAction = z.infer<typeof StepUpAuthActionSchema>;
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
export const ASSIGNMENT_STATUSES = ["ACTIVE", "REVOKED", "PENDING"] as const;
export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>;
export const AssignmentStatusSchema = z.enum(ASSIGNMENT_STATUSES);

/** Centralized assignment status constants for equality checks */
export const ASSIGNMENT_STATUS = {
  ACTIVE: "ACTIVE",
  REVOKED: "REVOKED",
  PENDING: "PENDING",
} as const satisfies Record<AssignmentStatus, AssignmentStatus>;

/**
 * Labels for assignment statuses
 */
export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  ACTIVE: "Active",
  REVOKED: "Revoked",
  PENDING: "Pending Confirmation",
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
export type MfaCredentialResponseContract = z.infer<
  typeof mfaCredentialResponseSchema
>;

/**
 * TOTP setup initiation request
 */
export const totpSetupRequestSchema = z.object({
  deviceName: z
    .string()
    .min(1)
    .max(100)
    .optional()
    .default("Authenticator App"),
});
export type TotpSetupRequestContract = z.infer<typeof totpSetupRequestSchema>;

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
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});
export type TotpVerifyRequestContract = z.infer<typeof totpVerifyRequestSchema>;

/**
 * MFA verification for login
 *
 * Supports two identification flows:
 * - `sessionToken`: short-lived JWT issued after password verification (preferred, mobile/web login)
 * - `userId`: direct user ID (legacy/admin flows only)
 *
 * Exactly one of `sessionToken` or `userId` must be provided.
 */
export const mfaLoginVerifyRequestSchema = z
  .object({
    userId: z.string().optional(),
    sessionToken: z.string().optional(),
    code: z.string(),
    credentialId: z.string().uuid().optional(), // Optional: specific credential to use
    isBackupCode: z.boolean().optional().default(false),
  })
  .refine(
    (data) => data.userId !== undefined || data.sessionToken !== undefined,
    {
      message: "Either userId or sessionToken must be provided",
      path: ["userId"],
    },
  );
export type MfaLoginVerifyRequestContract = z.infer<
  typeof mfaLoginVerifyRequestSchema
>;

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
export type StepUpAuthResponseContract = z.infer<
  typeof stepUpAuthResponseSchema
>;

/**
 * Backup codes generation request
 *
 * Requires a current valid TOTP code to prevent unauthorized backup code regeneration.
 * The `code` field must be a 6-digit TOTP code from the authenticator app associated
 * with the given `credentialId`.
 */
export const backupCodesRequestSchema = z.object({
  credentialId: z.string().uuid(),
  code: z
    .string()
    .length(
      MFA_TOTP_CODE_LENGTH,
      `TOTP code must be exactly ${MFA_TOTP_CODE_LENGTH} digits`,
    )
    .regex(/^\d+$/, "TOTP code must contain only digits"),
});
export type BackupCodesRequestContract = z.infer<
  typeof backupCodesRequestSchema
>;

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
export type ClinicianPatientAssignmentContract = z.infer<
  typeof clinicianPatientAssignmentSchema
>;

/**
 * Request to create a clinician-patient assignment
 */
export const createAssignmentRequestSchema = z.object({
  clinicianId: z.string(),
  patientId: z.string(),
  isPrimary: z.boolean().optional().default(false),
  assignmentReason: z.string().max(500).optional(),
});
export type CreateAssignmentRequestContract = z.infer<
  typeof createAssignmentRequestSchema
>;

/**
 * Request to revoke a clinician-patient assignment
 */
export const revokeAssignmentRequestSchema = z.object({
  revocationReason: z.string().max(500).optional(),
});
export type RevokeAssignmentRequestContract = z.infer<
  typeof revokeAssignmentRequestSchema
>;

/**
 * Request to update a clinician-patient assignment
 */
export const updateAssignmentRequestSchema = z.object({
  isPrimary: z.boolean().optional(),
});
export type UpdateAssignmentRequestContract = z.infer<
  typeof updateAssignmentRequestSchema
>;

/**
 * Enriched assignment with user details
 */
export const enrichedAssignmentSchema = clinicianPatientAssignmentSchema.extend(
  {
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
  },
);
export type EnrichedAssignmentContract = z.infer<
  typeof enrichedAssignmentSchema
>;
