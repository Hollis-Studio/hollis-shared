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
/**
 * Length of TOTP codes from authenticator apps (6 digits)
 */
export declare const MFA_TOTP_CODE_LENGTH = 6;
/**
 * Length of backup recovery codes (8 alphanumeric characters)
 */
export declare const MFA_BACKUP_CODE_LENGTH = 8;
/**
 * Types of MFA credentials supported
 */
export declare const MFA_CREDENTIAL_TYPES: readonly ["TOTP", "WEBAUTHN"];
export type MfaCredentialType = z.infer<typeof MfaCredentialTypeSchema>;
export declare const MfaCredentialTypeSchema: z.ZodEnum<{
    TOTP: "TOTP";
    WEBAUTHN: "WEBAUTHN";
}>;
/**
 * Labels for MFA credential types
 */
export declare const MFA_CREDENTIAL_TYPE_LABELS: Record<MfaCredentialType, string>;
/**
 * Types of MFA events for audit logging
 */
export declare const MFA_EVENT_TYPES: readonly ["SETUP_STARTED", "SETUP_COMPLETED", "SETUP_CANCELLED", "VERIFICATION_SUCCESS", "VERIFICATION_FAILED", "BACKUP_CODE_USED", "CREDENTIAL_REMOVED", "RECOVERY_INITIATED", "RECOVERY_COMPLETED", "STEP_UP_REQUIRED", "STEP_UP_SUCCESS", "STEP_UP_FAILED"];
export type MfaEventType = z.infer<typeof MfaEventTypeSchema>;
export declare const MfaEventTypeSchema: z.ZodEnum<{
    SETUP_STARTED: "SETUP_STARTED";
    SETUP_COMPLETED: "SETUP_COMPLETED";
    SETUP_CANCELLED: "SETUP_CANCELLED";
    VERIFICATION_SUCCESS: "VERIFICATION_SUCCESS";
    VERIFICATION_FAILED: "VERIFICATION_FAILED";
    BACKUP_CODE_USED: "BACKUP_CODE_USED";
    CREDENTIAL_REMOVED: "CREDENTIAL_REMOVED";
    RECOVERY_INITIATED: "RECOVERY_INITIATED";
    RECOVERY_COMPLETED: "RECOVERY_COMPLETED";
    STEP_UP_REQUIRED: "STEP_UP_REQUIRED";
    STEP_UP_SUCCESS: "STEP_UP_SUCCESS";
    STEP_UP_FAILED: "STEP_UP_FAILED";
}>;
/**
 * Actions that require step-up authentication (MFA re-verification)
 * These are high-risk actions that need extra security even after initial MFA
 */
export declare const STEP_UP_AUTH_ACTIONS: readonly ["EXPORT_DATA", "CHANGE_ROLE", "RESET_PASSWORD", "DELETE_ACCOUNT", "MODIFY_MFA", "ASSIGN_CLINICIAN", "REVOKE_ASSIGNMENT", "VIEW_AUDIT_LOGS", "MODIFY_PERMISSIONS", "BULK_OPERATIONS", "RESET_USER_MFA"];
export type StepUpAuthAction = z.infer<typeof StepUpAuthActionSchema>;
export declare const StepUpAuthActionSchema: z.ZodEnum<{
    RESET_PASSWORD: "RESET_PASSWORD";
    EXPORT_DATA: "EXPORT_DATA";
    CHANGE_ROLE: "CHANGE_ROLE";
    DELETE_ACCOUNT: "DELETE_ACCOUNT";
    MODIFY_MFA: "MODIFY_MFA";
    ASSIGN_CLINICIAN: "ASSIGN_CLINICIAN";
    REVOKE_ASSIGNMENT: "REVOKE_ASSIGNMENT";
    VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS";
    MODIFY_PERMISSIONS: "MODIFY_PERMISSIONS";
    BULK_OPERATIONS: "BULK_OPERATIONS";
    RESET_USER_MFA: "RESET_USER_MFA";
}>;
/**
 * Step-up auth window in milliseconds (how long a step-up verification lasts)
 * Used for individual sensitive actions (e.g., data export, MFA management).
 * Default: 15 minutes
 */
export declare const STEP_UP_AUTH_WINDOW_MS: number;
/**
 * MFA session window in milliseconds.
 * How long a user's MFA verification remains valid for general PHI access
 * after initial login MFA verification. Distinct from STEP_UP_AUTH_WINDOW_MS
 * which governs individual sensitive action tokens.
 *
 * When the access token is refreshed within this window, the server carries
 * forward the mfaVerifiedAt timestamp so the user isn't locked out every
 * 15 minutes (the access token TTL).
 *
 * Default: 8 hours
 */
export declare const MFA_SESSION_WINDOW_MS: number;
/**
 * Status values for clinician-patient assignments
 */
export declare const ASSIGNMENT_STATUSES: readonly ["ACTIVE", "REVOKED", "PENDING"];
export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>;
export declare const AssignmentStatusSchema: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    PENDING: "PENDING";
    REVOKED: "REVOKED";
}>;
/** Centralized assignment status constants for equality checks */
export declare const ASSIGNMENT_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly REVOKED: "REVOKED";
    readonly PENDING: "PENDING";
};
/**
 * Labels for assignment statuses
 */
export declare const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string>;
/**
 * MFA credential as returned from API (excludes secrets)
 */
export declare const mfaCredentialResponseSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        TOTP: "TOTP";
        WEBAUTHN: "WEBAUTHN";
    }>;
    name: z.ZodString;
    isVerified: z.ZodBoolean;
    isDefault: z.ZodBoolean;
    lastUsedAt: z.ZodNullable<z.ZodString>;
    backupCodesRemaining: z.ZodNumber;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type MfaCredentialResponseContract = z.infer<typeof mfaCredentialResponseSchema>;
export declare const mfaCredentialsResponseSchema: z.ZodObject<{
    credentials: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            TOTP: "TOTP";
            WEBAUTHN: "WEBAUTHN";
        }>;
        name: z.ZodString;
        isVerified: z.ZodBoolean;
        isDefault: z.ZodBoolean;
        lastUsedAt: z.ZodNullable<z.ZodString>;
        backupCodesRemaining: z.ZodNumber;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type MfaCredentialsResponseContract = z.infer<typeof mfaCredentialsResponseSchema>;
/**
 * TOTP setup initiation request
 */
export declare const totpSetupRequestSchema: z.ZodObject<{
    deviceName: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type TotpSetupRequestContract = z.infer<typeof totpSetupRequestSchema>;
/**
 * TOTP setup initiation response
 */
export declare const totpSetupResponseSchema: z.ZodObject<{
    credentialId: z.ZodString;
    secret: z.ZodString;
    qrCodeUri: z.ZodString;
    backupCodes: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type TotpSetupResponseContract = z.infer<typeof totpSetupResponseSchema>;
/**
 * TOTP verification request
 */
export declare const totpVerifyRequestSchema: z.ZodObject<{
    credentialId: z.ZodString;
    code: z.ZodString;
}, z.core.$strip>;
export type TotpVerifyRequestContract = z.infer<typeof totpVerifyRequestSchema>;
/**
 * MFA verification for login
 *
 * Requires a short-lived `sessionToken` (mfa_pending) issued after password verification.
 * Legacy userId-only flow is intentionally removed for security hardening.
 */
export declare const mfaLoginVerifyRequestSchema: z.ZodObject<{
    sessionToken: z.ZodString;
    code: z.ZodString;
    credentialId: z.ZodOptional<z.ZodString>;
    isBackupCode: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type MfaLoginVerifyRequestContract = z.infer<typeof mfaLoginVerifyRequestSchema>;
export declare const mfaLoginPendingUserSchema: z.ZodPipe<z.ZodObject<{
    uid: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>;
}, z.core.$strip>, z.ZodTransform<{
    userId: string;
    fullName: string | undefined;
    email: string;
    role: "ADMIN" | "CLINICIAN" | "TRAINER" | "CLIENT";
}, {
    email: string;
    role: "ADMIN" | "CLINICIAN" | "TRAINER" | "CLIENT";
    uid?: string | undefined;
    userId?: string | undefined;
    displayName?: string | undefined;
    fullName?: string | undefined;
}>>;
export type MfaLoginPendingUser = z.output<typeof mfaLoginPendingUserSchema>;
export type CanonicalMfaLoginPendingUser = MfaLoginPendingUser;
export declare const mfaLoginPendingResponseSchema: z.ZodObject<{
    mfaRequired: z.ZodLiteral<true>;
    sessionToken: z.ZodString;
    availableMethods: z.ZodArray<z.ZodEnum<{
        TOTP: "TOTP";
        WEBAUTHN: "WEBAUTHN";
    }>>;
    expiresIn: z.ZodNumber;
    user: z.ZodPipe<z.ZodObject<{
        uid: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
        email: z.ZodString;
        displayName: z.ZodOptional<z.ZodString>;
        fullName: z.ZodOptional<z.ZodString>;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            CLINICIAN: "CLINICIAN";
            TRAINER: "TRAINER";
            CLIENT: "CLIENT";
        }>;
    }, z.core.$strip>, z.ZodTransform<{
        userId: string;
        fullName: string | undefined;
        email: string;
        role: "ADMIN" | "CLINICIAN" | "TRAINER" | "CLIENT";
    }, {
        email: string;
        role: "ADMIN" | "CLINICIAN" | "TRAINER" | "CLIENT";
        uid?: string | undefined;
        userId?: string | undefined;
        displayName?: string | undefined;
        fullName?: string | undefined;
    }>>;
}, z.core.$strip>;
export type MfaLoginPendingResponse = z.output<typeof mfaLoginPendingResponseSchema>;
export type CanonicalMfaLoginPendingResponse = MfaLoginPendingResponse;
/**
 * Response returned by the MFA login verify endpoint on success.
 *
 * The server returns a slim session shape — no `profile` or `provider` wrapper
 * is present because the MFA verify step issues a fresh token, not a full
 * auth session. Callers must rebuild the full session from the `user` sub-object.
 *
 * Server route: POST /auth/mfa/login/verify
 */
export declare const mfaLoginVerifyResponseSchema: z.ZodObject<{
    expiresIn: z.ZodNumber;
    expiresAt: z.ZodString;
    user: z.ZodObject<{
        uid: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            CLINICIAN: "CLINICIAN";
            TRAINER: "TRAINER";
            CLIENT: "CLIENT";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type MfaLoginVerifyResponse = z.infer<typeof mfaLoginVerifyResponseSchema>;
/**
 * MFA session re-verification request.
 *
 * Used by admin/clinician users whose MFA session window has expired.
 * Unlike /login/verify (which uses a single-use mfa_pending token), this
 * endpoint uses the user's existing access token.
 *
 * Server route: POST /auth/mfa/session-reverify
 */
export declare const mfaSessionReverifyRequestSchema: z.ZodObject<{
    code: z.ZodString;
    credentialId: z.ZodOptional<z.ZodString>;
    isBackupCode: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type MfaSessionReverifyRequestContract = z.infer<typeof mfaSessionReverifyRequestSchema>;
/**
 * Step-up auth request
 */
export declare const stepUpAuthRequestSchema: z.ZodObject<{
    action: z.ZodEnum<{
        RESET_PASSWORD: "RESET_PASSWORD";
        EXPORT_DATA: "EXPORT_DATA";
        CHANGE_ROLE: "CHANGE_ROLE";
        DELETE_ACCOUNT: "DELETE_ACCOUNT";
        MODIFY_MFA: "MODIFY_MFA";
        ASSIGN_CLINICIAN: "ASSIGN_CLINICIAN";
        REVOKE_ASSIGNMENT: "REVOKE_ASSIGNMENT";
        VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS";
        MODIFY_PERMISSIONS: "MODIFY_PERMISSIONS";
        BULK_OPERATIONS: "BULK_OPERATIONS";
        RESET_USER_MFA: "RESET_USER_MFA";
    }>;
    code: z.ZodString;
    credentialId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StepUpAuthRequestContract = z.infer<typeof stepUpAuthRequestSchema>;
/**
 * Step-up auth response
 */
export declare const stepUpAuthResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    stepUpToken: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StepUpAuthResponseContract = z.infer<typeof stepUpAuthResponseSchema>;
/**
 * Auth session profile returned by the login and token-refresh endpoints.
 *
 * Uses `userId` as the canonical identifier (mapped from the server's `uid` field
 * in the response mapper). Distinct from the full `UserProfileContract` — this is
 * the lightweight session profile embedded in every `WebAuthSession`.
 */
export declare const authSessionProfileSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodString;
    fullName: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>;
    tier: z.ZodOptional<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    onboardingCompleted: z.ZodOptional<z.ZodBoolean>;
    organizationId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AuthSessionProfile = z.infer<typeof authSessionProfileSchema>;
/**
 * Response when backup codes are generated or regenerated for a TOTP credential.
 *
 * `credentialId` is present on admin MFA reset responses but absent on the
 * /auth/mfa/backup-codes endpoint which only returns `{ backupCodes }`.
 */
export declare const backupCodesResponseSchema: z.ZodObject<{
    backupCodes: z.ZodArray<z.ZodString>;
    credentialId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BackupCodesResponse = z.infer<typeof backupCodesResponseSchema>;
/**
 * Admin request to reset MFA for a locked-out user.
 */
export declare const adminMfaResetRequestSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type AdminMfaResetRequest = z.infer<typeof adminMfaResetRequestSchema>;
/**
 * Unwrapped response payload from admin MFA reset.
 *
 * The server still uses sendSuccess(), so the HTTP response envelope is:
 * `{ success: true, data: { backupCodes, message } }`.
 * Web clients validate the inner `data` payload against this schema after
 * the standard success envelope is automatically unwrapped.
 */
export declare const adminMfaResetResponseSchema: z.ZodObject<{
    backupCodes: z.ZodArray<z.ZodString>;
    message: z.ZodString;
}, z.core.$strip>;
export type AdminMfaResetResponse = z.infer<typeof adminMfaResetResponseSchema>;
/**
 * MFA status as seen by an admin viewing another user's account.
 * Slimmer than `MfaStatusResponseContract` (no credential list).
 */
export declare const userMfaStatusResponseSchema: z.ZodObject<{
    hasMfaEnabled: z.ZodBoolean;
    credentialCount: z.ZodNumber;
    lastVerifiedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UserMfaStatusResponse = z.infer<typeof userMfaStatusResponseSchema>;
/**
 * Backup codes generation request
 *
 * Requires a current valid TOTP code to prevent unauthorized backup code regeneration.
 * The `code` field must be a 6-digit TOTP code from the authenticator app associated
 * with the given `credentialId`.
 */
export declare const backupCodesRequestSchema: z.ZodObject<{
    credentialId: z.ZodString;
    code: z.ZodString;
}, z.core.$strip>;
export type BackupCodesRequestContract = z.infer<typeof backupCodesRequestSchema>;
/**
 * MFA status for a user
 */
export declare const mfaStatusResponseSchema: z.ZodObject<{
    isEnabled: z.ZodBoolean;
    isRequired: z.ZodBoolean;
    isRecommended: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    credentials: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            TOTP: "TOTP";
            WEBAUTHN: "WEBAUTHN";
        }>;
        name: z.ZodString;
        isVerified: z.ZodBoolean;
        isDefault: z.ZodBoolean;
        lastUsedAt: z.ZodNullable<z.ZodString>;
        backupCodesRemaining: z.ZodNumber;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    hasBackupCodes: z.ZodBoolean;
    lastVerifiedAt: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type MfaStatusResponseContract = z.infer<typeof mfaStatusResponseSchema>;
/**
 * Clinician-patient assignment record
 */
export declare const clinicianPatientAssignmentSchema: z.ZodObject<{
    id: z.ZodString;
    clinicianId: z.ZodString;
    patientId: z.ZodString;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PENDING: "PENDING";
        REVOKED: "REVOKED";
    }>;
    isPrimary: z.ZodBoolean;
    assignedById: z.ZodNullable<z.ZodString>;
    assignmentReason: z.ZodNullable<z.ZodString>;
    revocationReason: z.ZodNullable<z.ZodString>;
    revokedAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type ClinicianPatientAssignmentContract = z.infer<typeof clinicianPatientAssignmentSchema>;
/**
 * Request to create a clinician-patient assignment
 */
export declare const createAssignmentRequestSchema: z.ZodObject<{
    clinicianId: z.ZodString;
    patientId: z.ZodString;
    isPrimary: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    assignmentReason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateAssignmentRequestContract = z.infer<typeof createAssignmentRequestSchema>;
/**
 * Request to revoke a clinician-patient assignment
 */
export declare const revokeAssignmentRequestSchema: z.ZodObject<{
    revocationReason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RevokeAssignmentRequestContract = z.infer<typeof revokeAssignmentRequestSchema>;
/**
 * Request to update a clinician-patient assignment
 */
export declare const updateAssignmentRequestSchema: z.ZodObject<{
    isPrimary: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateAssignmentRequestContract = z.infer<typeof updateAssignmentRequestSchema>;
/**
 * Enriched assignment with user details
 */
export declare const enrichedAssignmentSchema: z.ZodObject<{
    id: z.ZodString;
    clinicianId: z.ZodString;
    patientId: z.ZodString;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PENDING: "PENDING";
        REVOKED: "REVOKED";
    }>;
    isPrimary: z.ZodBoolean;
    assignedById: z.ZodNullable<z.ZodString>;
    assignmentReason: z.ZodNullable<z.ZodString>;
    revocationReason: z.ZodNullable<z.ZodString>;
    revokedAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    clinician: z.ZodObject<{
        id: z.ZodString;
        firstName: z.ZodNullable<z.ZodString>;
        lastName: z.ZodNullable<z.ZodString>;
        email: z.ZodString;
    }, z.core.$strip>;
    patient: z.ZodObject<{
        id: z.ZodString;
        firstName: z.ZodNullable<z.ZodString>;
        lastName: z.ZodNullable<z.ZodString>;
        email: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type EnrichedAssignmentContract = z.infer<typeof enrichedAssignmentSchema>;
//# sourceMappingURL=mfa.d.ts.map