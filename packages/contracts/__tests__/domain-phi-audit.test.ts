/**
 * @ai-context PHI Audit Domain Contracts Tests
 *
 * This test suite verifies:
 * 1. PHI_RESOURCES tuple and PhiResourceSchema
 * 2. PHI_RESOURCE constant object
 * 3. PHI_ACTIONS tuple and PhiActionSchema
 * 4. PHI_ACCESS_REASONS tuple, schema, labels
 * 5. phiAuditLogEntrySchema (full audit log entry)
 * 6. createMockPhiAuditLogEntry mock factory
 *
 * Run: npx jest shared/contracts/__tests__/domain-phi-audit.test.ts
 */

import {
  createMockPhiAuditLogEntry,
  PHI_ACCESS_REASON,
  PHI_ACCESS_REASON_LABELS,
  PHI_ACCESS_REASONS,
  PhiAccessReasonSchema,
  PHI_ACTION,
  PHI_ACTIONS,
  phiActionSchema,
  PhiActionSchema,
  PHI_RESOURCE,
  PHI_RESOURCES,
  phiResourceSchema,
  PhiResourceSchema,
  phiAuditLogEntrySchema,
  type PhiAccessReason,
  type PhiAction,
  type PhiResource,
} from '../domain/phi-audit';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();

function validAuditEntry() {
  return {
    id: 'audit-001',
    actorId: 'admin-123',
    userId: 'patient-456',
    resource: 'user' as PhiResource,
    action: 'READ' as PhiAction,
    method: 'GET',
    path: '/api/users/patient-456',
    resourceId: 'patient-456',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    success: true,
    errorMessage: null,
    accessReason: 'treatment',
    sequenceNumber: null,
    previousHash: null,
    integrityHash: 'sha256-abc123',
    verifiedAt: null,
    createdAt: NOW_ISO,
  };
}

// ============================================================================
// PHI RESOURCES
// ============================================================================

describe('PHI Audit Domain Contracts', () => {
  describe('PHI_RESOURCES', () => {
    it('should contain exactly 41 resource types', () => {
      // Update this count when adding/removing PHI resources — deliberate protection against silent removal
      expect(PHI_RESOURCES).toHaveLength(41);
    });

    it('should contain common PHI resource types', () => {
      expect(PHI_RESOURCES).toContain('user');
      expect(PHI_RESOURCES).toContain('clinical_profile');
      expect(PHI_RESOURCES).toContain('lab_result');
      expect(PHI_RESOURCES).toContain('appointment');
      expect(PHI_RESOURCES).toContain('health_metric_goal');
      expect(PHI_RESOURCES).toContain('daily_metrics');
      expect(PHI_RESOURCES).toContain('journal');
      expect(PHI_RESOURCES).toContain('nutrition_plan');
      expect(PHI_RESOURCES).toContain('training_strategy');
      expect(PHI_RESOURCES).toContain('billing_dispute');
      expect(PHI_RESOURCES).toContain('consent_record');
    });

    it.each(PHI_RESOURCES)('PhiResourceSchema should accept: %s', (value) => {
      expect(PhiResourceSchema.safeParse(value).success).toBe(true);
    });

    it('PhiResourceSchema should reject invalid values', () => {
      expect(PhiResourceSchema.safeParse('insurance').success).toBe(false);
      expect(PhiResourceSchema.safeParse('USER').success).toBe(false);
      expect(PhiResourceSchema.safeParse('').success).toBe(false);
      expect(PhiResourceSchema.safeParse(null).success).toBe(false);
    });

    it('deprecated phiResourceSchema alias should also work', () => {
      expect(phiResourceSchema.safeParse('user').success).toBe(true);
    });

    describe('PHI_RESOURCE constant object', () => {
      it('should have constants for all major resource types', () => {
        expect(PHI_RESOURCE.USER).toBe('user');
        expect(PHI_RESOURCE.USER_ACCOUNT).toBe('user-account');
        expect(PHI_RESOURCE.CLINICAL_PROFILE).toBe('clinical_profile');
        expect(PHI_RESOURCE.LAB_PANEL).toBe('lab_panel');
        expect(PHI_RESOURCE.LAB_RESULT).toBe('lab_result');
        expect(PHI_RESOURCE.CLINICAL_NOTE).toBe('clinical_note');
        expect(PHI_RESOURCE.APPOINTMENT).toBe('appointment');
        expect(PHI_RESOURCE.DAILY_METRICS).toBe('daily_metrics');
        expect(PHI_RESOURCE.JOURNAL).toBe('journal');
        expect(PHI_RESOURCE.NUTRITION_PLAN).toBe('nutrition_plan');
        expect(PHI_RESOURCE.TRAINING_STRATEGY).toBe('training_strategy');
        expect(PHI_RESOURCE.BILLING_DISPUTE).toBe('billing_dispute');
        expect(PHI_RESOURCE.CONSENT_RECORD).toBe('consent_record');
      });

      it('should have all constant values present in the tuple', () => {
        for (const value of Object.values(PHI_RESOURCE)) {
          expect(PHI_RESOURCES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // PHI ACTIONS
  // ============================================================================

  describe('PHI_ACTIONS', () => {
    it('should contain exactly 5 actions', () => {
      expect(PHI_ACTIONS).toHaveLength(5);
    });

    it('should contain READ, CREATE, UPDATE, DELETE, LIST', () => {
      expect(PHI_ACTIONS).toContain('READ');
      expect(PHI_ACTIONS).toContain('CREATE');
      expect(PHI_ACTIONS).toContain('UPDATE');
      expect(PHI_ACTIONS).toContain('DELETE');
      expect(PHI_ACTIONS).toContain('LIST');
    });

    it.each(PHI_ACTIONS)('PhiActionSchema should accept: %s', (value) => {
      expect(PhiActionSchema.safeParse(value).success).toBe(true);
    });

    it('PhiActionSchema should reject invalid values', () => {
      expect(PhiActionSchema.safeParse('WRITE').success).toBe(false);
      expect(PhiActionSchema.safeParse('read').success).toBe(false);
      expect(PhiActionSchema.safeParse('').success).toBe(false);
    });

    it('deprecated phiActionSchema alias should also work', () => {
      expect(phiActionSchema.safeParse('READ').success).toBe(true);
    });

    describe('PHI_ACTION constant object', () => {
      it('should have constants matching actions', () => {
        expect(PHI_ACTION.READ).toBe('READ');
        expect(PHI_ACTION.CREATE).toBe('CREATE');
        expect(PHI_ACTION.UPDATE).toBe('UPDATE');
        expect(PHI_ACTION.DELETE).toBe('DELETE');
        expect(PHI_ACTION.LIST).toBe('LIST');
      });
    });
  });

  // ============================================================================
  // PHI ACCESS REASONS
  // ============================================================================

  describe('PHI_ACCESS_REASONS', () => {
    it('should contain exactly 9 reasons', () => {
      expect(PHI_ACCESS_REASONS).toHaveLength(9);
    });

    it('should contain all expected reasons', () => {
      expect(PHI_ACCESS_REASONS).toContain('treatment');
      expect(PHI_ACCESS_REASONS).toContain('payment');
      expect(PHI_ACCESS_REASONS).toContain('healthcare_ops');
      expect(PHI_ACCESS_REASONS).toContain('patient_request');
      expect(PHI_ACCESS_REASONS).toContain('legal_requirement');
      expect(PHI_ACCESS_REASONS).toContain('emergency');
      expect(PHI_ACCESS_REASONS).toContain('research');
      expect(PHI_ACCESS_REASONS).toContain('admin');
      expect(PHI_ACCESS_REASONS).toContain('unspecified');
    });

    it.each(PHI_ACCESS_REASONS)('PhiAccessReasonSchema should accept: %s', (value) => {
      expect(PhiAccessReasonSchema.safeParse(value).success).toBe(true);
    });

    it('PhiAccessReasonSchema should reject invalid values', () => {
      expect(PhiAccessReasonSchema.safeParse('business_ops').success).toBe(false);
      expect(PhiAccessReasonSchema.safeParse('TREATMENT').success).toBe(false);
      expect(PhiAccessReasonSchema.safeParse('').success).toBe(false);
    });

    it('should have labels for all access reasons', () => {
      for (const reason of PHI_ACCESS_REASONS) {
        expect(PHI_ACCESS_REASON_LABELS[reason as PhiAccessReason]).toBeDefined();
        expect(PHI_ACCESS_REASON_LABELS[reason as PhiAccessReason].length).toBeGreaterThan(0);
      }
    });

    describe('PHI_ACCESS_REASON constant object', () => {
      it('should have constants matching access reasons', () => {
        expect(PHI_ACCESS_REASON.TREATMENT).toBe('treatment');
        expect(PHI_ACCESS_REASON.PAYMENT).toBe('payment');
        expect(PHI_ACCESS_REASON.HEALTHCARE_OPS).toBe('healthcare_ops');
        expect(PHI_ACCESS_REASON.PATIENT_REQUEST).toBe('patient_request');
        expect(PHI_ACCESS_REASON.LEGAL_REQUIREMENT).toBe('legal_requirement');
        expect(PHI_ACCESS_REASON.EMERGENCY).toBe('emergency');
        expect(PHI_ACCESS_REASON.RESEARCH).toBe('research');
        expect(PHI_ACCESS_REASON.ADMIN).toBe('admin');
        expect(PHI_ACCESS_REASON.UNSPECIFIED).toBe('unspecified');
      });
    });
  });

  // ============================================================================
  // PHI AUDIT LOG ENTRY SCHEMA
  // ============================================================================

  describe('phiAuditLogEntrySchema', () => {
    it('should accept a valid audit log entry', () => {
      expect(phiAuditLogEntrySchema.safeParse(validAuditEntry()).success).toBe(true);
    });

    it('should accept null optional fields', () => {
      const result = phiAuditLogEntrySchema.safeParse({
        ...validAuditEntry(),
        userId: null,
        resourceId: null,
        ipAddress: null,
        userAgent: null,
        errorMessage: null,
        sequenceNumber: null,
        previousHash: null,
        verifiedAt: null,
      });
      expect(result.success).toBe(true);
    });

    it('should accept bigint for sequenceNumber (transforms to string)', () => {
      const result = phiAuditLogEntrySchema.safeParse({
        ...validAuditEntry(),
        sequenceNumber: BigInt(12345),
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.sequenceNumber).toBe('string');
        expect(result.data.sequenceNumber).toBe('12345');
      }
    });

    it('should accept string for sequenceNumber', () => {
      const result = phiAuditLogEntrySchema.safeParse({
        ...validAuditEntry(),
        sequenceNumber: '42',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid resource type', () => {
      expect(phiAuditLogEntrySchema.safeParse({
        ...validAuditEntry(),
        resource: 'insurance_record',
      }).success).toBe(false);
    });

    it('should reject invalid action', () => {
      expect(phiAuditLogEntrySchema.safeParse({
        ...validAuditEntry(),
        action: 'WRITE',
      }).success).toBe(false);
    });

    it('should reject missing required fields', () => {
      expect(phiAuditLogEntrySchema.safeParse({}).success).toBe(false);
    });

    it('should reject missing actorId', () => {
      const { actorId: _a, ...rest } = validAuditEntry();
      expect(phiAuditLogEntrySchema.safeParse(rest).success).toBe(false);
    });

    it('accepts any string for accessReason (schema uses z.string(), not z.enum)', () => {
      // NOTE: phiAuditLogEntrySchema defines accessReason as z.string() rather than
      // PhiAccessReasonSchema (z.enum(PHI_ACCESS_REASONS)). This means invalid values
      // are not rejected at the schema layer. If stricter validation is desired, change
      // the schema field to PhiAccessReasonSchema and update any callers that pass
      // legacy or ad-hoc strings (e.g. "LEGACY_UNSPECIFIED" in the mock factory).
      const result = phiAuditLogEntrySchema.safeParse({
        ...validAuditEntry(),
        accessReason: 'INVALID_REASON_NOT_IN_TUPLE',
      });
      expect(result.success).toBe(true);
    });

    it('should require success boolean', () => {
      const { success: _s, ...rest } = validAuditEntry();
      expect(phiAuditLogEntrySchema.safeParse(rest).success).toBe(false);
    });
  });

  // ============================================================================
  // MOCK FACTORY
  // ============================================================================

  describe('createMockPhiAuditLogEntry', () => {
    it('should produce a valid audit log entry', () => {
      const mock = createMockPhiAuditLogEntry();
      expect(phiAuditLogEntrySchema.safeParse(mock).success).toBe(true);
    });

    it('should allow overriding fields', () => {
      const mock = createMockPhiAuditLogEntry({
        actorId: 'custom-actor',
        resource: PHI_RESOURCE.JOURNAL as PhiResource,
        action: PHI_ACTION.CREATE as PhiAction,
      });
      expect(mock.actorId).toBe('custom-actor');
      expect(mock.resource).toBe('journal');
      expect(mock.action).toBe('CREATE');
    });

    it('should use default values', () => {
      const mock = createMockPhiAuditLogEntry();
      expect(mock.action).toBe('READ');
      expect(mock.success).toBe(true);
    });
  });
});
