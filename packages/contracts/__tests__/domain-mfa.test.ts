/**
 * @ai-context MFA Domain Contracts Tests | validates MFA types, schemas, and constants
 *
 * This test suite verifies:
 * 1. MfaCredentialType tuple, schema, labels
 * 2. MfaEventType tuple and schema
 * 3. StepUpAuthAction tuple, schema, constants
 * 4. AssignmentStatus tuple, schema, constants, labels
 * 5. Request/response schemas (TOTP setup, verify, login, step-up)
 * 6. Admin MFA schemas (reset, backup codes)
 * 7. clinicianPatientAssignment schemas
 * 8. authSessionProfileSchema
 * 9. MFA constants (TOTP code length, session windows)
 *
 * Run: npx jest shared/contracts/__tests__/domain-mfa.test.ts
 */

import {
  adminMfaResetRequestSchema,
  adminMfaResetResponseSchema,
  ASSIGNMENT_STATUS,
  ASSIGNMENT_STATUS_LABELS,
  ASSIGNMENT_STATUSES,
  AssignmentStatusSchema,
  authSessionProfileSchema,
  backupCodesRequestSchema,
  backupCodesResponseSchema,
  clinicianPatientAssignmentSchema,
  createAssignmentRequestSchema,
  enrichedAssignmentSchema,
  MFA_BACKUP_CODE_LENGTH,
  MFA_CREDENTIAL_TYPE_LABELS,
  MFA_CREDENTIAL_TYPES,
  MFA_SESSION_WINDOW_MS,
  MFA_TOTP_CODE_LENGTH,
  mfaCredentialResponseSchema,
  mfaCredentialsResponseSchema,
  mfaLoginPendingResponseSchema,
  mfaLoginVerifyRequestSchema,
  mfaLoginVerifyResponseSchema,
  MfaCredentialTypeSchema,
  MfaEventTypeSchema,
  mfaSessionReverifyRequestSchema,
  mfaStatusResponseSchema,
  MFA_EVENT_TYPES,
  revokeAssignmentRequestSchema,
  STEP_UP_AUTH_ACTIONS,
  STEP_UP_AUTH_WINDOW_MS,
  stepUpAuthRequestSchema,
  stepUpAuthResponseSchema,
  StepUpAuthActionSchema,
  totpSetupRequestSchema,
  totpSetupResponseSchema,
  totpVerifyRequestSchema,
  updateAssignmentRequestSchema,
  userMfaStatusResponseSchema,
} from '../domain/mfa';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();
const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';
const VALID_EMAIL = 'test@example.com';

function validMfaCredential() {
  return {
    id: VALID_UUID,
    type: 'TOTP' as const,
    name: 'My Authenticator',
    isVerified: true,
    isDefault: true,
    lastUsedAt: NOW_ISO,
    backupCodesRemaining: 8,
    createdAt: NOW_ISO,
  };
}

function validClinicianAssignment() {
  return {
    id: VALID_UUID,
    clinicianId: 'clinician-123',
    patientId: 'patient-456',
    status: 'ACTIVE' as const,
    isPrimary: true,
    assignedById: 'admin-789',
    assignmentReason: 'Primary care assignment',
    revocationReason: null,
    revokedAt: null,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

// ============================================================================
// MFA CONSTANTS
// ============================================================================

describe('MFA Domain Contracts', () => {
  describe('MFA Code Length Constants', () => {
    it('should have MFA_TOTP_CODE_LENGTH of 6', () => {
      expect(MFA_TOTP_CODE_LENGTH).toBe(6);
    });

    it('should have MFA_BACKUP_CODE_LENGTH of 8', () => {
      expect(MFA_BACKUP_CODE_LENGTH).toBe(8);
    });

    it('should have STEP_UP_AUTH_WINDOW_MS of 15 minutes', () => {
      expect(STEP_UP_AUTH_WINDOW_MS).toBe(15 * 60 * 1000);
    });

    it('should have MFA_SESSION_WINDOW_MS of 8 hours', () => {
      expect(MFA_SESSION_WINDOW_MS).toBe(8 * 60 * 60 * 1000);
    });
  });

  // ============================================================================
  // MFA CREDENTIAL TYPE TESTS
  // ============================================================================

  describe('MfaCredentialType', () => {
    it('should contain exactly 2 credential types', () => {
      expect(MFA_CREDENTIAL_TYPES).toHaveLength(2);
    });

    it('should contain TOTP and WEBAUTHN', () => {
      expect(MFA_CREDENTIAL_TYPES).toContain('TOTP');
      expect(MFA_CREDENTIAL_TYPES).toContain('WEBAUTHN');
    });

    it.each(MFA_CREDENTIAL_TYPES)('schema should accept valid value: %s', (value) => {
      expect(MfaCredentialTypeSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(MfaCredentialTypeSchema.safeParse('SMS').success).toBe(false);
      expect(MfaCredentialTypeSchema.safeParse('totp').success).toBe(false);
      expect(MfaCredentialTypeSchema.safeParse('').success).toBe(false);
      expect(MfaCredentialTypeSchema.safeParse(null).success).toBe(false);
    });

    it('should have labels for all credential types', () => {
      for (const type of MFA_CREDENTIAL_TYPES) {
        expect(MFA_CREDENTIAL_TYPE_LABELS[type]).toBeDefined();
        expect(MFA_CREDENTIAL_TYPE_LABELS[type].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // MFA EVENT TYPE TESTS
  // ============================================================================

  describe('MfaEventType', () => {
    it('should contain all lifecycle event types', () => {
      expect(MFA_EVENT_TYPES).toContain('SETUP_STARTED');
      expect(MFA_EVENT_TYPES).toContain('SETUP_COMPLETED');
      expect(MFA_EVENT_TYPES).toContain('SETUP_CANCELLED');
      expect(MFA_EVENT_TYPES).toContain('VERIFICATION_SUCCESS');
      expect(MFA_EVENT_TYPES).toContain('VERIFICATION_FAILED');
      expect(MFA_EVENT_TYPES).toContain('BACKUP_CODE_USED');
      expect(MFA_EVENT_TYPES).toContain('CREDENTIAL_REMOVED');
      expect(MFA_EVENT_TYPES).toContain('RECOVERY_INITIATED');
      expect(MFA_EVENT_TYPES).toContain('RECOVERY_COMPLETED');
      expect(MFA_EVENT_TYPES).toContain('STEP_UP_REQUIRED');
      expect(MFA_EVENT_TYPES).toContain('STEP_UP_SUCCESS');
      expect(MFA_EVENT_TYPES).toContain('STEP_UP_FAILED');
    });

    it.each(MFA_EVENT_TYPES)('schema should accept: %s', (value) => {
      expect(MfaEventTypeSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid event types', () => {
      expect(MfaEventTypeSchema.safeParse('LOGIN_SUCCESS').success).toBe(false);
      expect(MfaEventTypeSchema.safeParse('setup_started').success).toBe(false);
    });
  });

  // ============================================================================
  // STEP-UP AUTH ACTION TESTS
  // ============================================================================

  describe('StepUpAuthAction', () => {
    it('should contain all defined step-up actions', () => {
      expect(STEP_UP_AUTH_ACTIONS).toContain('EXPORT_DATA');
      expect(STEP_UP_AUTH_ACTIONS).toContain('CHANGE_ROLE');
      expect(STEP_UP_AUTH_ACTIONS).toContain('RESET_PASSWORD');
      expect(STEP_UP_AUTH_ACTIONS).toContain('DELETE_ACCOUNT');
      expect(STEP_UP_AUTH_ACTIONS).toContain('MODIFY_MFA');
      expect(STEP_UP_AUTH_ACTIONS).toContain('ASSIGN_CLINICIAN');
      expect(STEP_UP_AUTH_ACTIONS).toContain('REVOKE_ASSIGNMENT');
      expect(STEP_UP_AUTH_ACTIONS).toContain('VIEW_AUDIT_LOGS');
      expect(STEP_UP_AUTH_ACTIONS).toContain('MODIFY_PERMISSIONS');
      expect(STEP_UP_AUTH_ACTIONS).toContain('BULK_OPERATIONS');
      expect(STEP_UP_AUTH_ACTIONS).toContain('RESET_USER_MFA');
    });

    it.each(STEP_UP_AUTH_ACTIONS)('schema should accept: %s', (value) => {
      expect(StepUpAuthActionSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid actions', () => {
      expect(StepUpAuthActionSchema.safeParse('VIEW_PHI').success).toBe(false);
      expect(StepUpAuthActionSchema.safeParse('export_data').success).toBe(false);
      expect(StepUpAuthActionSchema.safeParse('').success).toBe(false);
    });
  });

  // ============================================================================
  // ASSIGNMENT STATUS TESTS
  // ============================================================================

  describe('AssignmentStatus', () => {
    it('should contain exactly 3 values', () => {
      expect(ASSIGNMENT_STATUSES).toHaveLength(3);
    });

    it('should contain ACTIVE, REVOKED, PENDING', () => {
      expect(ASSIGNMENT_STATUSES).toContain('ACTIVE');
      expect(ASSIGNMENT_STATUSES).toContain('REVOKED');
      expect(ASSIGNMENT_STATUSES).toContain('PENDING');
    });

    it.each(ASSIGNMENT_STATUSES)('schema should accept: %s', (value) => {
      expect(AssignmentStatusSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(AssignmentStatusSchema.safeParse('INACTIVE').success).toBe(false);
      expect(AssignmentStatusSchema.safeParse('active').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(ASSIGNMENT_STATUS.ACTIVE).toBe('ACTIVE');
      expect(ASSIGNMENT_STATUS.REVOKED).toBe('REVOKED');
      expect(ASSIGNMENT_STATUS.PENDING).toBe('PENDING');
    });

    it('should have labels for all statuses', () => {
      for (const status of ASSIGNMENT_STATUSES) {
        expect(ASSIGNMENT_STATUS_LABELS[status]).toBeDefined();
        expect(ASSIGNMENT_STATUS_LABELS[status].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // TOTP SETUP SCHEMAS
  // ============================================================================

  describe('totpSetupRequestSchema', () => {
    it('should accept an empty object (uses default deviceName)', () => {
      const result = totpSetupRequestSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should accept a custom device name', () => {
      const result = totpSetupRequestSchema.safeParse({ deviceName: 'iPhone 15' });
      expect(result.success).toBe(true);
    });

    it('should reject device name over 100 chars', () => {
      const result = totpSetupRequestSchema.safeParse({
        deviceName: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('should apply default deviceName when not provided', () => {
      const result = totpSetupRequestSchema.parse({});
      expect(result.deviceName).toBe('Authenticator App');
    });
  });

  describe('totpSetupResponseSchema', () => {
    it('should accept a valid setup response', () => {
      const result = totpSetupResponseSchema.safeParse({
        credentialId: VALID_UUID,
        secret: 'JBSWY3DPEHPK3PXP',
        qrCodeUri: 'otpauth://totp/Hollis:test@example.com?secret=JBSWY3DPEHPK3PXP',
        backupCodes: Array.from({ length: 10 }, (_, i) => `backup-${i}`),
      });
      expect(result.success).toBe(true);
    });

    it('should reject fewer than 10 backup codes', () => {
      const result = totpSetupResponseSchema.safeParse({
        credentialId: VALID_UUID,
        secret: 'JBSWY3DPEHPK3PXP',
        qrCodeUri: 'otpauth://totp/Hollis:test@example.com?secret=JBSWY3DPEHPK3PXP',
        backupCodes: Array.from({ length: 9 }, (_, i) => `backup-${i}`),
      });
      expect(result.success).toBe(false);
    });

    it('should reject more than 10 backup codes', () => {
      const result = totpSetupResponseSchema.safeParse({
        credentialId: VALID_UUID,
        secret: 'JBSWY3DPEHPK3PXP',
        qrCodeUri: 'otpauth://totp/...',
        backupCodes: Array.from({ length: 11 }, (_, i) => `backup-${i}`),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('totpVerifyRequestSchema', () => {
    it('should accept a valid 6-digit code', () => {
      const result = totpVerifyRequestSchema.safeParse({
        credentialId: VALID_UUID,
        code: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-digit code', () => {
      expect(totpVerifyRequestSchema.safeParse({
        credentialId: VALID_UUID,
        code: 'abc123',
      }).success).toBe(false);
    });

    it('should reject code with wrong length', () => {
      expect(totpVerifyRequestSchema.safeParse({
        credentialId: VALID_UUID,
        code: '12345',
      }).success).toBe(false);

      expect(totpVerifyRequestSchema.safeParse({
        credentialId: VALID_UUID,
        code: '1234567',
      }).success).toBe(false);
    });

    it('should reject invalid UUID for credentialId', () => {
      expect(totpVerifyRequestSchema.safeParse({
        credentialId: 'not-a-uuid',
        code: '123456',
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // MFA LOGIN VERIFY SCHEMAS
  // ============================================================================

  describe('mfaLoginVerifyRequestSchema', () => {
    it('should accept a valid login verify request', () => {
      const result = mfaLoginVerifyRequestSchema.safeParse({
        sessionToken: 'mfa_pending_token_abc',
        code: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('should accept with optional credentialId', () => {
      const result = mfaLoginVerifyRequestSchema.safeParse({
        sessionToken: 'token',
        code: '123456',
        credentialId: VALID_UUID,
      });
      expect(result.success).toBe(true);
    });

    it('should apply default false for isBackupCode', () => {
      const result = mfaLoginVerifyRequestSchema.parse({
        sessionToken: 'token',
        code: '123456',
      });
      expect(result.isBackupCode).toBe(false);
    });

    it('should accept isBackupCode true', () => {
      const result = mfaLoginVerifyRequestSchema.safeParse({
        sessionToken: 'token',
        code: 'ABCDEFGH',
        isBackupCode: true,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty sessionToken', () => {
      expect(mfaLoginVerifyRequestSchema.safeParse({
        sessionToken: '',
        code: '123456',
      }).success).toBe(false);
    });
  });

  describe('mfaLoginPendingResponseSchema', () => {
    it('should accept a valid pending response with userId', () => {
      const result = mfaLoginPendingResponseSchema.safeParse({
        mfaRequired: true,
        sessionToken: 'session-token-123',
        availableMethods: ['TOTP'],
        expiresIn: 300,
        user: {
          userId: 'user-123',
          email: VALID_EMAIL,
          role: 'CLIENT',
        },
      });
      expect(result.success).toBe(true);
    });

    it('should accept uid as alternate to userId', () => {
      const result = mfaLoginPendingResponseSchema.safeParse({
        mfaRequired: true,
        sessionToken: 'session-token',
        availableMethods: ['TOTP'],
        expiresIn: 300,
        user: {
          uid: 'user-via-uid',
          email: VALID_EMAIL,
          role: 'CLINICIAN',
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject when mfaRequired is false', () => {
      const result = mfaLoginPendingResponseSchema.safeParse({
        mfaRequired: false,
        sessionToken: 'token',
        availableMethods: ['TOTP'],
        expiresIn: 300,
        user: { userId: 'user-123', email: VALID_EMAIL, role: 'CLIENT' },
      });
      expect(result.success).toBe(false);
    });

    it('should reject when user has neither uid nor userId', () => {
      const result = mfaLoginPendingResponseSchema.safeParse({
        mfaRequired: true,
        sessionToken: 'token',
        availableMethods: ['TOTP'],
        expiresIn: 300,
        user: { email: VALID_EMAIL, role: 'PATIENT' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('mfaLoginVerifyResponseSchema', () => {
    it('should accept a valid verify response', () => {
      const result = mfaLoginVerifyResponseSchema.safeParse({
        expiresIn: 3600,
        expiresAt: NOW_ISO,
        user: { uid: 'user-123', email: VALID_EMAIL, role: 'ADMIN' },
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing user', () => {
      expect(mfaLoginVerifyResponseSchema.safeParse({
        expiresIn: 3600,
        expiresAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // STEP-UP AUTH SCHEMAS
  // ============================================================================

  describe('stepUpAuthRequestSchema', () => {
    it('should accept a valid step-up request', () => {
      const result = stepUpAuthRequestSchema.safeParse({
        action: 'EXPORT_DATA',
        code: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('should accept with optional credentialId', () => {
      const result = stepUpAuthRequestSchema.safeParse({
        action: 'DELETE_ACCOUNT',
        code: '123456',
        credentialId: VALID_UUID,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid action', () => {
      expect(stepUpAuthRequestSchema.safeParse({
        action: 'INVALID_ACTION',
        code: '123456',
      }).success).toBe(false);
    });
  });

  describe('stepUpAuthResponseSchema', () => {
    it('should accept a success response', () => {
      const result = stepUpAuthResponseSchema.safeParse({
        success: true,
        stepUpToken: 'step-up-token-abc',
        expiresAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should accept a failure response without token', () => {
      const result = stepUpAuthResponseSchema.safeParse({ success: false });
      expect(result.success).toBe(true);
    });
  });

  // ============================================================================
  // AUTH SESSION PROFILE SCHEMA
  // ============================================================================

  describe('authSessionProfileSchema', () => {
    it('should accept a valid session profile', () => {
      const result = authSessionProfileSchema.safeParse({
        userId: 'user-123',
        email: VALID_EMAIL,
        role: 'CLINICIAN',
        tier: 'CORE',
        onboardingCompleted: true,
        organizationId: 'org-456',
        isActive: true,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should accept minimal profile (only required fields)', () => {
      const result = authSessionProfileSchema.safeParse({
        userId: 'user-123',
        email: VALID_EMAIL,
        role: 'CLIENT',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(authSessionProfileSchema.safeParse({
        userId: 'user-123',
        email: 'not-an-email',
        role: 'CLIENT',
      }).success).toBe(false);
    });

    it('should reject invalid role', () => {
      expect(authSessionProfileSchema.safeParse({
        userId: 'user-123',
        email: VALID_EMAIL,
        role: 'SUPERUSER',
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // MFA CREDENTIAL RESPONSE SCHEMAS
  // ============================================================================

  describe('mfaCredentialResponseSchema', () => {
    it('should accept a valid credential', () => {
      expect(mfaCredentialResponseSchema.safeParse(validMfaCredential()).success).toBe(true);
    });

    it('should accept null lastUsedAt', () => {
      expect(mfaCredentialResponseSchema.safeParse({
        ...validMfaCredential(),
        lastUsedAt: null,
      }).success).toBe(true);
    });

    it('should reject negative backupCodesRemaining', () => {
      expect(mfaCredentialResponseSchema.safeParse({
        ...validMfaCredential(),
        backupCodesRemaining: -1,
      }).success).toBe(false);
    });

    it('should reject invalid UUID', () => {
      expect(mfaCredentialResponseSchema.safeParse({
        ...validMfaCredential(),
        id: 'not-a-uuid',
      }).success).toBe(false);
    });
  });

  describe('mfaCredentialsResponseSchema', () => {
    it('should accept a valid credentials list response', () => {
      const result = mfaCredentialsResponseSchema.safeParse({
        credentials: [validMfaCredential()],
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty credentials array', () => {
      const result = mfaCredentialsResponseSchema.safeParse({ credentials: [] });
      expect(result.success).toBe(true);
    });
  });

  describe('mfaStatusResponseSchema', () => {
    it('should accept a valid MFA status response', () => {
      const result = mfaStatusResponseSchema.safeParse({
        isEnabled: true,
        isRequired: false,
        isRecommended: true,
        credentials: [validMfaCredential()],
        hasBackupCodes: true,
        lastVerifiedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should accept null lastVerifiedAt', () => {
      const result = mfaStatusResponseSchema.safeParse({
        isEnabled: false,
        isRequired: false,
        credentials: [],
        hasBackupCodes: false,
        lastVerifiedAt: null,
      });
      expect(result.success).toBe(true);
    });

    it('should apply default false for isRecommended', () => {
      const result = mfaStatusResponseSchema.parse({
        isEnabled: false,
        isRequired: false,
        credentials: [],
        hasBackupCodes: false,
        lastVerifiedAt: null,
      });
      expect(result.isRecommended).toBe(false);
    });
  });

  // ============================================================================
  // BACKUP CODES SCHEMAS
  // ============================================================================

  describe('backupCodesRequestSchema', () => {
    it('should accept a valid backup codes request', () => {
      const result = backupCodesRequestSchema.safeParse({
        credentialId: VALID_UUID,
        code: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('should reject code with wrong length', () => {
      expect(backupCodesRequestSchema.safeParse({
        credentialId: VALID_UUID,
        code: '12345',
      }).success).toBe(false);
    });

    it('should reject non-digit code', () => {
      expect(backupCodesRequestSchema.safeParse({
        credentialId: VALID_UUID,
        code: '12345a',
      }).success).toBe(false);
    });
  });

  describe('backupCodesResponseSchema', () => {
    it('should accept a valid backup codes response', () => {
      expect(backupCodesResponseSchema.safeParse({
        backupCodes: ['CODE1', 'CODE2'],
        credentialId: VALID_UUID,
      }).success).toBe(true);
    });

    it('should accept response without credentialId (standard endpoint)', () => {
      expect(backupCodesResponseSchema.safeParse({
        backupCodes: ['CODE1'],
      }).success).toBe(true);
    });
  });

  // ============================================================================
  // ADMIN MFA SCHEMAS
  // ============================================================================

  describe('adminMfaResetRequestSchema', () => {
    it('should accept a valid reset reason', () => {
      expect(adminMfaResetRequestSchema.safeParse({
        reason: 'User locked out - verified via phone call',
      }).success).toBe(true);
    });

    it('should reject empty reason', () => {
      expect(adminMfaResetRequestSchema.safeParse({ reason: '' }).success).toBe(false);
    });

    it('should reject reason over 500 chars', () => {
      expect(adminMfaResetRequestSchema.safeParse({
        reason: 'a'.repeat(501),
      }).success).toBe(false);
    });
  });

  describe('adminMfaResetResponseSchema', () => {
    it('should accept a valid admin reset response', () => {
      expect(adminMfaResetResponseSchema.safeParse({
        backupCodes: ['code1', 'code2'],
        message: 'MFA reset successful',
      }).success).toBe(true);
    });

    it('should reject missing message', () => {
      expect(adminMfaResetResponseSchema.safeParse({
        backupCodes: ['code1'],
      }).success).toBe(false);
    });
  });

  describe('userMfaStatusResponseSchema', () => {
    it('should accept a valid status response', () => {
      expect(userMfaStatusResponseSchema.safeParse({
        hasMfaEnabled: true,
        credentialCount: 2,
        lastVerifiedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should accept null lastVerifiedAt', () => {
      expect(userMfaStatusResponseSchema.safeParse({
        hasMfaEnabled: false,
        credentialCount: 0,
        lastVerifiedAt: null,
      }).success).toBe(true);
    });

    it('should reject negative credentialCount', () => {
      expect(userMfaStatusResponseSchema.safeParse({
        hasMfaEnabled: false,
        credentialCount: -1,
        lastVerifiedAt: null,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // CLINICIAN ASSIGNMENT SCHEMAS
  // ============================================================================

  describe('clinicianPatientAssignmentSchema', () => {
    it('should accept a valid assignment', () => {
      expect(clinicianPatientAssignmentSchema.safeParse(validClinicianAssignment()).success).toBe(true);
    });

    it('should accept null for optional fields', () => {
      expect(clinicianPatientAssignmentSchema.safeParse({
        ...validClinicianAssignment(),
        assignedById: null,
        assignmentReason: null,
      }).success).toBe(true);
    });

    it('should reject invalid status', () => {
      expect(clinicianPatientAssignmentSchema.safeParse({
        ...validClinicianAssignment(),
        status: 'SUSPENDED',
      }).success).toBe(false);
    });
  });

  describe('createAssignmentRequestSchema', () => {
    it('should accept a minimal create request', () => {
      const result = createAssignmentRequestSchema.safeParse({
        clinicianId: 'clinician-123',
        patientId: 'patient-456',
      });
      expect(result.success).toBe(true);
    });

    it('should apply default false for isPrimary', () => {
      const result = createAssignmentRequestSchema.parse({
        clinicianId: 'clinician-123',
        patientId: 'patient-456',
      });
      expect(result.isPrimary).toBe(false);
    });

    it('should reject assignmentReason over 500 chars', () => {
      expect(createAssignmentRequestSchema.safeParse({
        clinicianId: 'clinician-123',
        patientId: 'patient-456',
        assignmentReason: 'a'.repeat(501),
      }).success).toBe(false);
    });
  });

  describe('revokeAssignmentRequestSchema', () => {
    it('should accept an empty object (reason is optional)', () => {
      expect(revokeAssignmentRequestSchema.safeParse({}).success).toBe(true);
    });

    it('should accept with revocation reason', () => {
      expect(revokeAssignmentRequestSchema.safeParse({
        revocationReason: 'Patient transferred',
      }).success).toBe(true);
    });

    it('should reject reason over 500 chars', () => {
      expect(revokeAssignmentRequestSchema.safeParse({
        revocationReason: 'a'.repeat(501),
      }).success).toBe(false);
    });
  });

  describe('updateAssignmentRequestSchema', () => {
    it('should accept an empty object (all fields optional)', () => {
      expect(updateAssignmentRequestSchema.safeParse({}).success).toBe(true);
    });

    it('should accept isPrimary update', () => {
      expect(updateAssignmentRequestSchema.safeParse({ isPrimary: true }).success).toBe(true);
    });
  });

  describe('enrichedAssignmentSchema', () => {
    it('should accept a valid enriched assignment', () => {
      const result = enrichedAssignmentSchema.safeParse({
        ...validClinicianAssignment(),
        clinician: {
          id: 'clinician-123',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
        },
        patient: {
          id: 'patient-456',
          firstName: 'John',
          lastName: null,
          email: 'john@example.com',
        },
      });
      expect(result.success).toBe(true);
    });

    it('should accept null names in clinician/patient objects', () => {
      const result = enrichedAssignmentSchema.safeParse({
        ...validClinicianAssignment(),
        clinician: { id: 'c1', firstName: null, lastName: null, email: 'c@example.com' },
        patient: { id: 'p1', firstName: null, lastName: null, email: 'p@example.com' },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('mfaSessionReverifyRequestSchema', () => {
    it('should accept a valid reverify request', () => {
      expect(mfaSessionReverifyRequestSchema.safeParse({
        code: '123456',
      }).success).toBe(true);
    });

    it('should reject empty code', () => {
      expect(mfaSessionReverifyRequestSchema.safeParse({
        code: '',
      }).success).toBe(false);
    });

    it('should apply default false for isBackupCode', () => {
      const result = mfaSessionReverifyRequestSchema.parse({ code: '123456' });
      expect(result.isBackupCode).toBe(false);
    });
  });
});
