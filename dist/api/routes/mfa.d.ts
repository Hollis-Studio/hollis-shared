/**
 * @ai-context MFA Routes | Multi-Factor Authentication API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Multi-Factor Authentication API routes.
 * Base path: /auth/mfa
 *
 * @group MFA
 */
export declare const MFA_ROUTES: {
    /** GET - Get current MFA status for authenticated user */
    readonly STATUS: "/auth/mfa/status";
    /** GET - List all MFA credentials for authenticated user */
    readonly CREDENTIALS: "/auth/mfa/credentials";
    /** DELETE - Remove a specific MFA credential */
    readonly CREDENTIAL: "/auth/mfa/credentials/:credentialId";
    /** POST - Initiate TOTP setup (returns secret and QR code) */
    readonly TOTP_SETUP: "/auth/mfa/totp/setup";
    /** POST - Verify TOTP code to complete setup */
    readonly TOTP_VERIFY: "/auth/mfa/totp/verify";
    /** POST - Verify MFA during login (after password verification) */
    readonly LOGIN_VERIFY: "/auth/mfa/login/verify";
    /** POST - Step-up authentication for sensitive actions */
    readonly STEP_UP: "/auth/mfa/step-up";
    /** POST - Generate new backup codes (invalidates old ones) */
    readonly BACKUP_CODES: "/auth/mfa/backup-codes";
    /** POST - Initiate WebAuthn registration */
    readonly WEBAUTHN_REGISTER_START: "/auth/mfa/webauthn/register/start";
    /** POST - Complete WebAuthn registration */
    readonly WEBAUTHN_REGISTER_FINISH: "/auth/mfa/webauthn/register/finish";
    /** POST - Initiate WebAuthn authentication challenge */
    readonly WEBAUTHN_AUTH_START: "/auth/mfa/webauthn/auth/start";
    /** POST - Verify WebAuthn authentication */
    readonly WEBAUTHN_AUTH_FINISH: "/auth/mfa/webauthn/auth/finish";
};
/** Type for MFA route values */
export type MfaRoute = (typeof MFA_ROUTES)[keyof typeof MFA_ROUTES];
/**
 * Clinician-Patient Assignment API routes.
 * Base path: /admin/assignments
 *
 * @group ASSIGNMENTS
 */
export declare const ASSIGNMENT_ROUTES: {
    /** GET - List all clinician-patient assignments */
    readonly LIST: "/admin/assignments";
    /** POST - Create a new clinician-patient assignment */
    readonly CREATE: "/admin/assignments";
    /** GET - Get a specific assignment */
    readonly GET: "/admin/assignments/:id";
    /** DELETE - Revoke a clinician-patient assignment */
    readonly REVOKE: "/admin/assignments/:id";
    /** GET - Get assignments for a specific clinician */
    readonly BY_CLINICIAN: "/admin/assignments/clinician/:clinicianId";
    /** GET - Get assignments for a specific patient */
    readonly BY_PATIENT: "/admin/assignments/patient/:patientId";
    /** PATCH - Update assignment (e.g., change primary status) */
    readonly UPDATE: "/admin/assignments/:id";
};
/** Type for assignment route values */
export type AssignmentRoute = (typeof ASSIGNMENT_ROUTES)[keyof typeof ASSIGNMENT_ROUTES];
//# sourceMappingURL=mfa.d.ts.map