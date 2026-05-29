/**
 * @ai-context Session Domain Contracts Tests | validates all session domain contracts
 *
 * This test suite verifies:
 * 1. SESSION_TYPES tuple contains expected types
 * 2. DEFAULT_TIER_ALLOCATIONS has correct session counts per tier
 * 3. SESSION_USAGE_SOURCES contains expected sources
 * 4. Session-related schemas validate correctly
 * 5. Edge cases: missing fields, invalid types
 * 6. Reset frequencies, error codes, labels completeness
 *
 * Run: npx jest shared/contracts/__tests__/domain-sessions.test.ts
 */

import {
    // Appointment to Session mapping
    APPOINTMENT_TO_SESSION_MAP,
    DEFAULT_TIER_ALLOCATIONS,
    isSessionType,
    isSessionUsageSource,
    // Reset Frequencies
    RESET_FREQUENCIES,
    RESET_FREQUENCY,
    RESET_FREQUENCY_LABELS,
    ResetFrequencySchema,
    SESSION_ERROR_CODE,
    // Error Codes
    SESSION_ERROR_CODES,
    SESSION_ERROR_LABELS,
    SESSION_TYPE,
    SESSION_TYPE_LABELS,
    // Session Types
    SESSION_TYPES,
    SESSION_USAGE_SOURCE,
    SESSION_USAGE_SOURCE_LABELS,
    // Session Usage Sources
    SESSION_USAGE_SOURCES,
    // Session Allocations
    SessionAllocationSchema,
    // Session Balance
    SessionBalanceItemSchema,
    sessionErrorCodeSchema,
    SessionTypeSchema,
    SessionUsageSourceSchema,
    TierSessionAllocationsSchema,
    UserSessionBalanceSchema,
} from '../domain/sessions';

import { USER_TIERS, type UserTier } from '../domain/user';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();

function validSessionBalanceItem() {
  return {
    sessionType: 'FITNESS_SESSION' as const,
    allocated: 8,
    rolledOver: 2,
    used: 3,
    remaining: 7,
    adjustments: 0,
    resetFrequency: 'MONTHLY' as const,
    periodStart: '2025-06-01',
    periodEnd: '2025-07-01',
    nextResetDate: '2025-07-01',
  };
}

function validUserSessionBalance() {
  return {
    userId: 'HH-ABC123',
    tier: 'CORE' as const,
    billingAnchorDate: '2025-01-15',
    balances: [validSessionBalanceItem()],
    lastUpdated: NOW_ISO,
  };
}

// ============================================================================
// SESSION TYPE TESTS
// ============================================================================

describe('Session Domain Contracts', () => {
  describe('SessionType', () => {
    describe('tuple values', () => {
      it('should contain exactly 8 types', () => {
        expect(SESSION_TYPES).toHaveLength(8);
      });

      it('should contain all expected session types', () => {
        expect(SESSION_TYPES).toContain('FITNESS_SESSION');
        expect(SESSION_TYPES).toContain('RECOVERY_SESSION');
        expect(SESSION_TYPES).toContain('LABWORK');
        expect(SESSION_TYPES).toContain('CLINICIAN_INITIAL');
        expect(SESSION_TYPES).toContain('CLINICIAN_FOLLOWUP');
        expect(SESSION_TYPES).toContain('DXA_SCAN');
        expect(SESSION_TYPES).toContain('SLEEP_SCREENING');
        expect(SESSION_TYPES).toContain('MOBILE_SESSION');
      });
    });

    describe('schema validation', () => {
      it.each(SESSION_TYPES)('should accept valid value: %s', (value) => {
        const result = SessionTypeSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(SessionTypeSchema.safeParse('invalid').success).toBe(false);
        expect(SessionTypeSchema.safeParse('fitness_session').success).toBe(false); // lowercase
        expect(SessionTypeSchema.safeParse('').success).toBe(false);
        expect(SessionTypeSchema.safeParse(123).success).toBe(false);
        expect(SessionTypeSchema.safeParse(null).success).toBe(false);
        expect(SessionTypeSchema.safeParse(undefined).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(SESSION_TYPES)('isSessionType should return true for: %s', (value) => {
        expect(isSessionType(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isSessionType('invalid')).toBe(false);
        expect(isSessionType('')).toBe(false);
        expect(isSessionType('fitness_session')).toBe(false); // case-sensitive
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of SESSION_TYPES) {
          expect(SESSION_TYPE_LABELS[value]).toBeDefined();
          expect(typeof SESSION_TYPE_LABELS[value]).toBe('string');
          expect(SESSION_TYPE_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(SESSION_TYPE.FITNESS_SESSION).toBe('FITNESS_SESSION');
        expect(SESSION_TYPE.RECOVERY_SESSION).toBe('RECOVERY_SESSION');
        expect(SESSION_TYPE.LABWORK).toBe('LABWORK');
        expect(SESSION_TYPE.CLINICIAN_INITIAL).toBe('CLINICIAN_INITIAL');
        expect(SESSION_TYPE.CLINICIAN_FOLLOWUP).toBe('CLINICIAN_FOLLOWUP');
        expect(SESSION_TYPE.DXA_SCAN).toBe('DXA_SCAN');
        expect(SESSION_TYPE.SLEEP_SCREENING).toBe('SLEEP_SCREENING');
        expect(SESSION_TYPE.MOBILE_SESSION).toBe('MOBILE_SESSION');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(SESSION_TYPE);
        expect(constantValues).toHaveLength(8);
        for (const value of constantValues) {
          expect(SESSION_TYPES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // RESET FREQUENCY TESTS
  // ============================================================================

  describe('ResetFrequency', () => {
    describe('tuple values', () => {
      it('should contain exactly 4 values', () => {
        expect(RESET_FREQUENCIES).toHaveLength(4);
      });

      it('should contain all expected values', () => {
        expect(RESET_FREQUENCIES).toContain('MONTHLY');
        expect(RESET_FREQUENCIES).toContain('QUARTERLY');
        expect(RESET_FREQUENCIES).toContain('BIANNUAL');
        expect(RESET_FREQUENCIES).toContain('ANNUAL');
      });
    });

    describe('schema validation', () => {
      it.each(RESET_FREQUENCIES)('should accept valid value: %s', (value) => {
        const result = ResetFrequencySchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(ResetFrequencySchema.safeParse('WEEKLY').success).toBe(false);
        expect(ResetFrequencySchema.safeParse('monthly').success).toBe(false); // lowercase
        expect(ResetFrequencySchema.safeParse(null).success).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of RESET_FREQUENCIES) {
          expect(RESET_FREQUENCY_LABELS[value]).toBeDefined();
          expect(typeof RESET_FREQUENCY_LABELS[value]).toBe('string');
          expect(RESET_FREQUENCY_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(RESET_FREQUENCY.MONTHLY).toBe('MONTHLY');
        expect(RESET_FREQUENCY.QUARTERLY).toBe('QUARTERLY');
        expect(RESET_FREQUENCY.BIANNUAL).toBe('BIANNUAL');
        expect(RESET_FREQUENCY.ANNUAL).toBe('ANNUAL');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(RESET_FREQUENCY);
        expect(constantValues).toHaveLength(4);
        for (const value of constantValues) {
          expect(RESET_FREQUENCIES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // SESSION BALANCE ITEM SCHEMA TESTS
  // ============================================================================

  describe('SessionBalanceItemSchema', () => {
    describe('valid objects', () => {
      it('should accept a valid balance item', () => {
        const result = SessionBalanceItemSchema.safeParse(validSessionBalanceItem());
        expect(result.success).toBe(true);
      });

      it('should accept unlimited allocation (-1)', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          sessionType: 'RECOVERY_SESSION',
          allocated: -1,
          remaining: -1,
        });
        expect(result.success).toBe(true);
      });

      it('should accept zero used sessions', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          used: 0,
        });
        expect(result.success).toBe(true);
      });

      it('should accept negative adjustments', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          adjustments: -2,
        });
        expect(result.success).toBe(true);
      });

      it('should accept positive adjustments', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          adjustments: 5,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject invalid session type', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          sessionType: 'INVALID_TYPE',
        });
        expect(result.success).toBe(false);
      });

      it('should reject allocated below -1', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          allocated: -2,
        });
        expect(result.success).toBe(false);
      });

      it('should reject negative rolledOver', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          rolledOver: -1,
        });
        expect(result.success).toBe(false);
      });

      it('should reject negative used', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          used: -1,
        });
        expect(result.success).toBe(false);
      });

      it('should reject remaining below -1', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          remaining: -2,
        });
        expect(result.success).toBe(false);
      });

      it('should reject invalid reset frequency', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          resetFrequency: 'WEEKLY',
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing required fields', () => {
        const result = SessionBalanceItemSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it('should reject non-integer allocated', () => {
        const result = SessionBalanceItemSchema.safeParse({
          ...validSessionBalanceItem(),
          allocated: 4.5,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // USER SESSION BALANCE SCHEMA TESTS
  // ============================================================================

  describe('UserSessionBalanceSchema', () => {
    describe('valid objects', () => {
      it('should accept a valid user session balance', () => {
        const result = UserSessionBalanceSchema.safeParse(validUserSessionBalance());
        expect(result.success).toBe(true);
      });

      it('should accept balance with empty balances array', () => {
        const result = UserSessionBalanceSchema.safeParse({
          ...validUserSessionBalance(),
          balances: [],
        });
        expect(result.success).toBe(true);
      });

      it('should accept balance with multiple balance items', () => {
        const result = UserSessionBalanceSchema.safeParse({
          ...validUserSessionBalance(),
          balances: [
            validSessionBalanceItem(),
            {
              ...validSessionBalanceItem(),
              sessionType: 'RECOVERY_SESSION',
              allocated: -1,
              remaining: -1,
            },
          ],
        });
        expect(result.success).toBe(true);
      });

      it.each(USER_TIERS)('should accept tier: %s', (tier) => {
        const result = UserSessionBalanceSchema.safeParse({
          ...validUserSessionBalance(),
          tier,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject invalid tier', () => {
        const result = UserSessionBalanceSchema.safeParse({
          ...validUserSessionBalance(),
          tier: 'PLATINUM',
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing userId', () => {
        const { userId: _u, ...rest } = validUserSessionBalance();
        const result = UserSessionBalanceSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject missing balances', () => {
        const { balances: _b, ...rest } = validUserSessionBalance();
        const result = UserSessionBalanceSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it('should reject empty object', () => {
        const result = UserSessionBalanceSchema.safeParse({});
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // SESSION ALLOCATION SCHEMA TESTS
  // ============================================================================

  describe('SessionAllocationSchema', () => {
    describe('valid objects', () => {
      it('should accept a valid allocation', () => {
        const result = SessionAllocationSchema.safeParse({
          sessionType: 'FITNESS_SESSION',
          quantity: 8,
          resetFrequency: 'MONTHLY',
        });
        expect(result.success).toBe(true);
      });

      it('should accept unlimited quantity (-1)', () => {
        const result = SessionAllocationSchema.safeParse({
          sessionType: 'RECOVERY_SESSION',
          quantity: -1,
          resetFrequency: 'MONTHLY',
        });
        expect(result.success).toBe(true);
      });

      it('should accept zero quantity', () => {
        const result = SessionAllocationSchema.safeParse({
          sessionType: 'LABWORK',
          quantity: 0,
          resetFrequency: 'ANNUAL',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('invalid objects', () => {
      it('should reject quantity below -1', () => {
        const result = SessionAllocationSchema.safeParse({
          sessionType: 'FITNESS_SESSION',
          quantity: -2,
          resetFrequency: 'MONTHLY',
        });
        expect(result.success).toBe(false);
      });

      it('should reject non-integer quantity', () => {
        const result = SessionAllocationSchema.safeParse({
          sessionType: 'FITNESS_SESSION',
          quantity: 4.5,
          resetFrequency: 'MONTHLY',
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing fields', () => {
        const result = SessionAllocationSchema.safeParse({});
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // TIER SESSION ALLOCATIONS SCHEMA TESTS
  // ============================================================================

  describe('TierSessionAllocationsSchema', () => {
    it('should accept valid tier allocations', () => {
      const result = TierSessionAllocationsSchema.safeParse({
        tier: 'CORE',
        allocations: [
          { sessionType: 'FITNESS_SESSION', quantity: 8, resetFrequency: 'MONTHLY' },
          { sessionType: 'RECOVERY_SESSION', quantity: -1, resetFrequency: 'MONTHLY' },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid tier', () => {
      const result = TierSessionAllocationsSchema.safeParse({
        tier: 'PLATINUM',
        allocations: [],
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // DEFAULT TIER ALLOCATIONS TESTS
  // ============================================================================

  describe('DEFAULT_TIER_ALLOCATIONS', () => {
    it('should have allocations for all tiers', () => {
      for (const tier of USER_TIERS) {
        expect(DEFAULT_TIER_ALLOCATIONS[tier]).toBeDefined();
        expect(Array.isArray(DEFAULT_TIER_ALLOCATIONS[tier])).toBe(true);
        expect(DEFAULT_TIER_ALLOCATIONS[tier].length).toBeGreaterThan(0);
      }
    });

    describe('ESSENTIALS tier', () => {
      it('should have 8 fitness sessions per month', () => {
        const fitness = DEFAULT_TIER_ALLOCATIONS.ESSENTIALS.find(
          (a) => a.sessionType === 'FITNESS_SESSION',
        );
        expect(fitness).toBeDefined();
        expect(fitness!.quantity).toBe(8);
        expect(fitness!.resetFrequency).toBe('MONTHLY');
      });

      it('should have unlimited recovery sessions', () => {
        const recovery = DEFAULT_TIER_ALLOCATIONS.ESSENTIALS.find(
          (a) => a.sessionType === 'RECOVERY_SESSION',
        );
        expect(recovery).toBeDefined();
        expect(recovery!.quantity).toBe(-1);
      });

      it('should have 1 labwork per biannual period', () => {
        const lab = DEFAULT_TIER_ALLOCATIONS.ESSENTIALS.find(
          (a) => a.sessionType === 'LABWORK',
        );
        expect(lab).toBeDefined();
        expect(lab!.quantity).toBe(1);
        expect(lab!.resetFrequency).toBe('BIANNUAL');
      });

      it('should have 1 initial clinician consult per year', () => {
        const initial = DEFAULT_TIER_ALLOCATIONS.ESSENTIALS.find(
          (a) => a.sessionType === 'CLINICIAN_INITIAL',
        );
        expect(initial).toBeDefined();
        expect(initial!.quantity).toBe(1);
        expect(initial!.resetFrequency).toBe('ANNUAL');
      });

      it('should NOT include MOBILE_SESSION', () => {
        const mobile = DEFAULT_TIER_ALLOCATIONS.ESSENTIALS.find(
          (a) => a.sessionType === 'MOBILE_SESSION',
        );
        expect(mobile).toBeUndefined();
      });
    });

    describe('CORE tier', () => {
      it('should have 16 fitness sessions per month', () => {
        const fitness = DEFAULT_TIER_ALLOCATIONS.CORE.find(
          (a) => a.sessionType === 'FITNESS_SESSION',
        );
        expect(fitness).toBeDefined();
        expect(fitness!.quantity).toBe(16);
        expect(fitness!.resetFrequency).toBe('MONTHLY');
      });

      it('should have unlimited recovery sessions', () => {
        const recovery = DEFAULT_TIER_ALLOCATIONS.CORE.find(
          (a) => a.sessionType === 'RECOVERY_SESSION',
        );
        expect(recovery).toBeDefined();
        expect(recovery!.quantity).toBe(-1);
      });

      it('should have 1 labwork per quarter', () => {
        const lab = DEFAULT_TIER_ALLOCATIONS.CORE.find(
          (a) => a.sessionType === 'LABWORK',
        );
        expect(lab).toBeDefined();
        expect(lab!.quantity).toBe(1);
        expect(lab!.resetFrequency).toBe('QUARTERLY');
      });

      it('should have 2 sleep screenings per month', () => {
        const sleep = DEFAULT_TIER_ALLOCATIONS.CORE.find(
          (a) => a.sessionType === 'SLEEP_SCREENING',
        );
        expect(sleep).toBeDefined();
        expect(sleep!.quantity).toBe(2);
        expect(sleep!.resetFrequency).toBe('MONTHLY');
      });

      it('should NOT include MOBILE_SESSION', () => {
        const mobile = DEFAULT_TIER_ALLOCATIONS.CORE.find(
          (a) => a.sessionType === 'MOBILE_SESSION',
        );
        expect(mobile).toBeUndefined();
      });
    });

    describe('CONCIERGE tier', () => {
      it('should have 24 fitness sessions per month', () => {
        const fitness = DEFAULT_TIER_ALLOCATIONS.CONCIERGE.find(
          (a) => a.sessionType === 'FITNESS_SESSION',
        );
        expect(fitness).toBeDefined();
        expect(fitness!.quantity).toBe(24);
        expect(fitness!.resetFrequency).toBe('MONTHLY');
      });

      it('should have unlimited recovery sessions', () => {
        const recovery = DEFAULT_TIER_ALLOCATIONS.CONCIERGE.find(
          (a) => a.sessionType === 'RECOVERY_SESSION',
        );
        expect(recovery).toBeDefined();
        expect(recovery!.quantity).toBe(-1);
      });

      it('should have 1 labwork per month', () => {
        const lab = DEFAULT_TIER_ALLOCATIONS.CONCIERGE.find(
          (a) => a.sessionType === 'LABWORK',
        );
        expect(lab).toBeDefined();
        expect(lab!.quantity).toBe(1);
        expect(lab!.resetFrequency).toBe('MONTHLY');
      });

      it('should include MOBILE_SESSION (2 per month)', () => {
        const mobile = DEFAULT_TIER_ALLOCATIONS.CONCIERGE.find(
          (a) => a.sessionType === 'MOBILE_SESSION',
        );
        expect(mobile).toBeDefined();
        expect(mobile!.quantity).toBe(2);
        expect(mobile!.resetFrequency).toBe('MONTHLY');
      });

      it('should have 4 sleep screenings per month', () => {
        const sleep = DEFAULT_TIER_ALLOCATIONS.CONCIERGE.find(
          (a) => a.sessionType === 'SLEEP_SCREENING',
        );
        expect(sleep).toBeDefined();
        expect(sleep!.quantity).toBe(4);
        expect(sleep!.resetFrequency).toBe('MONTHLY');
      });
    });

    it('fitness sessions should increase with tier level', () => {
      const getFitness = (tier: UserTier) =>
        DEFAULT_TIER_ALLOCATIONS[tier].find(
          (a) => a.sessionType === 'FITNESS_SESSION',
        )!.quantity;

      expect(getFitness('ESSENTIALS')).toBeLessThan(getFitness('CORE'));
      expect(getFitness('CORE')).toBeLessThan(getFitness('CONCIERGE'));
    });

    it('all allocations should conform to SessionAllocationSchema', () => {
      for (const tier of USER_TIERS) {
        for (const allocation of DEFAULT_TIER_ALLOCATIONS[tier]) {
          const result = SessionAllocationSchema.safeParse(allocation);
          expect(result.success).toBe(true);
        }
      }
    });
  });

  // ============================================================================
  // SESSION USAGE SOURCE TESTS
  // ============================================================================

  describe('SessionUsageSource', () => {
    describe('tuple values', () => {
      it('should contain exactly 4 values', () => {
        expect(SESSION_USAGE_SOURCES).toHaveLength(4);
      });

      it('should contain all expected values', () => {
        expect(SESSION_USAGE_SOURCES).toContain('BOOKING');
        expect(SESSION_USAGE_SOURCES).toContain('ADMIN_DEDUCT');
        expect(SESSION_USAGE_SOURCES).toContain('ADMIN_CREDIT');
        expect(SESSION_USAGE_SOURCES).toContain('BILLING_RESET');
      });
    });

    describe('schema validation', () => {
      it.each(SESSION_USAGE_SOURCES)('should accept valid value: %s', (value) => {
        const result = SessionUsageSourceSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(SessionUsageSourceSchema.safeParse('MANUAL').success).toBe(false);
        expect(SessionUsageSourceSchema.safeParse('booking').success).toBe(false); // lowercase
        expect(SessionUsageSourceSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('type guard', () => {
      it.each(SESSION_USAGE_SOURCES)('isSessionUsageSource should return true for: %s', (value) => {
        expect(isSessionUsageSource(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isSessionUsageSource('invalid')).toBe(false);
        expect(isSessionUsageSource('')).toBe(false);
        expect(isSessionUsageSource('booking')).toBe(false); // case-sensitive
      });
    });

    describe('labels map', () => {
      it('should have a label for every tuple value', () => {
        for (const value of SESSION_USAGE_SOURCES) {
          expect(SESSION_USAGE_SOURCE_LABELS[value]).toBeDefined();
          expect(typeof SESSION_USAGE_SOURCE_LABELS[value]).toBe('string');
          expect(SESSION_USAGE_SOURCE_LABELS[value].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to tuple values', () => {
        expect(SESSION_USAGE_SOURCE.BOOKING).toBe('BOOKING');
        expect(SESSION_USAGE_SOURCE.ADMIN_DEDUCT).toBe('ADMIN_DEDUCT');
        expect(SESSION_USAGE_SOURCE.ADMIN_CREDIT).toBe('ADMIN_CREDIT');
        expect(SESSION_USAGE_SOURCE.BILLING_RESET).toBe('BILLING_RESET');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(SESSION_USAGE_SOURCE);
        expect(constantValues).toHaveLength(4);
        for (const value of constantValues) {
          expect(SESSION_USAGE_SOURCES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // SESSION ERROR CODES TESTS
  // ============================================================================

  describe('SessionErrorCodes', () => {
    describe('tuple values', () => {
      it('should contain domain error codes', () => {
        expect(SESSION_ERROR_CODES).toContain('INVALID_SESSION_TYPE');
        expect(SESSION_ERROR_CODES).toContain('NO_SESSIONS_REMAINING');
        expect(SESSION_ERROR_CODES).toContain('CANNOT_ADJUST_UNLIMITED');
        expect(SESSION_ERROR_CODES).toContain('USER_NOT_FOUND');
        expect(SESSION_ERROR_CODES).toContain('SAME_TIER');
        expect(SESSION_ERROR_CODES).toContain('MEMBERSHIP_PAUSED');
      });

      it('should contain access control error codes', () => {
        expect(SESSION_ERROR_CODES).toContain('ACCOUNT_INACTIVE');
        expect(SESSION_ERROR_CODES).toContain('ACCOUNT_SUSPENDED');
        expect(SESSION_ERROR_CODES).toContain('ORGANIZATION_SUSPENDED');
        expect(SESSION_ERROR_CODES).toContain('ORGANIZATION_ARCHIVED');
        expect(SESSION_ERROR_CODES).toContain('SUBSCRIPTION_NOT_ACTIVE');
        expect(SESSION_ERROR_CODES).toContain('NO_ACTIVE_SUBSCRIPTION');
      });
    });

    describe('schema validation', () => {
      it.each(SESSION_ERROR_CODES)('should accept valid error code: %s', (code) => {
        const result = sessionErrorCodeSchema.safeParse(code);
        expect(result.success).toBe(true);
      });

      it('should reject invalid error codes', () => {
        expect(sessionErrorCodeSchema.safeParse('UNKNOWN_ERROR').success).toBe(false);
        expect(sessionErrorCodeSchema.safeParse('').success).toBe(false);
        expect(sessionErrorCodeSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('labels map', () => {
      it('should have a label for every error code', () => {
        for (const code of SESSION_ERROR_CODES) {
          expect(SESSION_ERROR_LABELS[code]).toBeDefined();
          expect(typeof SESSION_ERROR_LABELS[code]).toBe('string');
          expect(SESSION_ERROR_LABELS[code].length).toBeGreaterThan(0);
        }
      });
    });

    describe('constants object', () => {
      it('should have keys that map to error code values', () => {
        expect(SESSION_ERROR_CODE.INVALID_SESSION_TYPE).toBe('INVALID_SESSION_TYPE');
        expect(SESSION_ERROR_CODE.NO_SESSIONS_REMAINING).toBe('NO_SESSIONS_REMAINING');
        expect(SESSION_ERROR_CODE.CANNOT_ADJUST_UNLIMITED).toBe('CANNOT_ADJUST_UNLIMITED');
        expect(SESSION_ERROR_CODE.ACCOUNT_INACTIVE).toBe('ACCOUNT_INACTIVE');
        expect(SESSION_ERROR_CODE.ACCOUNT_SUSPENDED).toBe('ACCOUNT_SUSPENDED');
        expect(SESSION_ERROR_CODE.NO_ACTIVE_SUBSCRIPTION).toBe('NO_ACTIVE_SUBSCRIPTION');
      });

      it('should have all values present in tuple', () => {
        const constantValues = Object.values(SESSION_ERROR_CODE);
        for (const value of constantValues) {
          expect(SESSION_ERROR_CODES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // APPOINTMENT TO SESSION MAP TESTS
  // ============================================================================

  describe('APPOINTMENT_TO_SESSION_MAP', () => {
    it('should map TRAINING_SESSION to FITNESS_SESSION', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.TRAINING_SESSION).toBe('FITNESS_SESSION');
    });

    it('should map CONSULTATION to CLINICIAN_INITIAL', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.CONSULTATION).toBe('CLINICIAN_INITIAL');
    });

    it('should map CHECK_IN to CLINICIAN_FOLLOWUP', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.CHECK_IN).toBe('CLINICIAN_FOLLOWUP');
    });

    it('should map RECOVERY_SESSION to RECOVERY_SESSION', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.RECOVERY_SESSION).toBe('RECOVERY_SESSION');
    });

    it('should map LABWORK to LABWORK', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.LABWORK).toBe('LABWORK');
    });

    it('should map DXA_SCAN to DXA_SCAN', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.DXA_SCAN).toBe('DXA_SCAN');
    });

    it('should map SLEEP_SCREENING to SLEEP_SCREENING', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.SLEEP_SCREENING).toBe('SLEEP_SCREENING');
    });

    it('should map ONBOARDING to null (no session consumed)', () => {
      expect(APPOINTMENT_TO_SESSION_MAP.ONBOARDING).toBeNull();
    });

    it('mapped session types should all be valid SessionTypes or null', () => {
      for (const [, sessionType] of Object.entries(APPOINTMENT_TO_SESSION_MAP)) {
        if (sessionType !== null) {
          expect(isSessionType(sessionType)).toBe(true);
        }
      }
    });
  });
});
