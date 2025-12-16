/**
 * @ai-context MFA Routes | Multi-Factor Authentication API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// ============================================================================
// MFA ROUTES
// ============================================================================

/**
 * Multi-Factor Authentication API routes.
 * Base path: /auth/mfa
 *
 * @group MFA
 */
export const MFA_ROUTES = {
  /** GET - Get current MFA status for authenticated user */
  STATUS: '/auth/mfa/status',
  /** GET - List all MFA credentials for authenticated user */
  CREDENTIALS: '/auth/mfa/credentials',
  /** DELETE - Remove a specific MFA credential */
  CREDENTIAL: '/auth/mfa/credentials/:credentialId',
  /** POST - Initiate TOTP setup (returns secret and QR code) */
  TOTP_SETUP: '/auth/mfa/totp/setup',
  /** POST - Verify TOTP code to complete setup */
  TOTP_VERIFY: '/auth/mfa/totp/verify',
  /** POST - Verify MFA during login (after password verification) */
  LOGIN_VERIFY: '/auth/mfa/login/verify',
  /** POST - Step-up authentication for sensitive actions */
  STEP_UP: '/auth/mfa/step-up',
  /** POST - Generate new backup codes (invalidates old ones) */
  BACKUP_CODES: '/auth/mfa/backup-codes',
  /** POST - Initiate WebAuthn registration */
  WEBAUTHN_REGISTER_START: '/auth/mfa/webauthn/register/start',
  /** POST - Complete WebAuthn registration */
  WEBAUTHN_REGISTER_FINISH: '/auth/mfa/webauthn/register/finish',
  /** POST - Initiate WebAuthn authentication challenge */
  WEBAUTHN_AUTH_START: '/auth/mfa/webauthn/auth/start',
  /** POST - Verify WebAuthn authentication */
  WEBAUTHN_AUTH_FINISH: '/auth/mfa/webauthn/auth/finish',
} as const;

/** Type for MFA route values */
export type MfaRoute = (typeof MFA_ROUTES)[keyof typeof MFA_ROUTES];

// ============================================================================
// CLINICIAN ASSIGNMENT ROUTES
// ============================================================================

/**
 * Clinician-Patient Assignment API routes.
 * Base path: /admin/assignments
 *
 * @group ASSIGNMENTS
 */
export const ASSIGNMENT_ROUTES = {
  /** GET - List all clinician-patient assignments */
  LIST: '/admin/assignments',
  /** POST - Create a new clinician-patient assignment */
  CREATE: '/admin/assignments',
  /** GET - Get a specific assignment */
  GET: '/admin/assignments/:id',
  /** DELETE - Revoke a clinician-patient assignment */
  REVOKE: '/admin/assignments/:id',
  /** GET - Get assignments for a specific clinician */
  BY_CLINICIAN: '/admin/assignments/clinician/:clinicianId',
  /** GET - Get assignments for a specific patient */
  BY_PATIENT: '/admin/assignments/patient/:patientId',
  /** PATCH - Update assignment (e.g., change primary status) */
  UPDATE: '/admin/assignments/:id',
} as const;

/** Type for assignment route values */
export type AssignmentRoute = (typeof ASSIGNMENT_ROUTES)[keyof typeof ASSIGNMENT_ROUTES];
