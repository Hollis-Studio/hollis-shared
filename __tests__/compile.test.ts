/**
 * @ai-context Contract Compilation Tests | validates all shared contracts export correctly
 *
 * Phase 8, Action Item 4: Ensure shared contracts compile and are valid.
 *
 * This test suite verifies:
 * 1. All exports from shared contracts are importable
 * 2. All Zod schemas are valid and can parse sample data
 * 3. All type exports exist
 * 4. No circular dependencies cause import failures
 *
 * Run: npm run test:contracts
 */

import * as contracts from '../index';

// ============================================================================
// COMPILATION TESTS
// ============================================================================

describe('Shared Contracts Compilation', () => {
  describe('API Routes', () => {
    it('should export API_ROUTES', () => {
      expect(contracts.API_ROUTES).toBeDefined();
      expect(typeof contracts.API_ROUTES).toBe('object');
    });

    it('should export AUTH_ROUTES', () => {
      expect(contracts.AUTH_ROUTES).toBeDefined();
      expect(contracts.AUTH_ROUTES.LOGIN).toBe('/auth/login');
      expect(contracts.AUTH_ROUTES.SIGNUP).toBe('/auth/signup');
      expect(contracts.AUTH_ROUTES.REFRESH).toBe('/auth/refresh');
      expect(contracts.AUTH_ROUTES.LOGOUT).toBe('/auth/logout');
    });

    it('should export USER_ROUTES as functions', () => {
      expect(contracts.USER_ROUTES).toBeDefined();
      expect(typeof contracts.USER_ROUTES.get).toBe('function');
      expect(contracts.USER_ROUTES.get('HH-ABC123')).toBe('/users/HH-ABC123');
    });

    it('should export ADMIN_ROUTES', () => {
      expect(contracts.ADMIN_ROUTES).toBeDefined();
      expect(contracts.ADMIN_ROUTES.ANALYTICS).toBe('/admin/analytics');
    });

    it('should export HTTP_METHODS', () => {
      expect(contracts.HTTP_METHODS).toBeDefined();
      expect(contracts.HTTP_METHODS).toContain('GET');
      expect(contracts.HTTP_METHODS).toContain('POST');
      expect(contracts.HTTP_METHODS).toContain('PUT');
      expect(contracts.HTTP_METHODS).toContain('PATCH');
      expect(contracts.HTTP_METHODS).toContain('DELETE');
    });

    it('should export route helper functions', () => {
      expect(typeof contracts.getRoutePattern).toBe('function');
      expect(typeof contracts.buildUrlWithQuery).toBe('function');

      // Test buildUrlWithQuery
      const url = contracts.buildUrlWithQuery('/users/123/metrics', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });
      expect(url).toContain('/users/123/metrics');
      expect(url).toContain('startDate=2024-01-01');
      expect(url).toContain('endDate=2024-01-31');
    });
  });

  describe('Domain Contracts', () => {
    it('should export USER_ROLES', () => {
      expect(contracts.USER_ROLES).toBeDefined();
      expect(Array.isArray(contracts.USER_ROLES)).toBe(true);
      expect(contracts.USER_ROLES).toContain('ADMIN');
      expect(contracts.USER_ROLES).toContain('CLINICIAN');
      expect(contracts.USER_ROLES).toContain('CLIENT');
    });

    it('should export USER_ROLE constants', () => {
      expect(contracts.USER_ROLE).toBeDefined();
      expect(contracts.USER_ROLE.ADMIN).toBe('ADMIN');
      expect(contracts.USER_ROLE.CLINICIAN).toBe('CLINICIAN');
      expect(contracts.USER_ROLE.CLIENT).toBe('CLIENT');
    });

    it('should export USER_ROLE_LABELS', () => {
      expect(contracts.USER_ROLE_LABELS).toBeDefined();
      expect(contracts.USER_ROLE_LABELS.ADMIN).toBe('Admin');
      expect(contracts.USER_ROLE_LABELS.CLINICIAN).toBe('Clinician');
      expect(contracts.USER_ROLE_LABELS.CLIENT).toBe('Client');
    });

    it('should export APPOINTMENT_STATUSES', () => {
      expect(contracts.APPOINTMENT_STATUSES).toBeDefined();
      expect(Array.isArray(contracts.APPOINTMENT_STATUSES)).toBe(true);
      expect(contracts.APPOINTMENT_STATUSES).toContain('SCHEDULED');
      expect(contracts.APPOINTMENT_STATUSES).toContain('COMPLETED');
      expect(contracts.APPOINTMENT_STATUSES).toContain('CANCELLED');
      expect(contracts.APPOINTMENT_STATUSES).toContain('NO_SHOW');
    });

    it('should export APPOINTMENT_TYPES', () => {
      expect(contracts.APPOINTMENT_TYPES).toBeDefined();
      expect(Array.isArray(contracts.APPOINTMENT_TYPES)).toBe(true);
      expect(contracts.APPOINTMENT_TYPES).toContain('CHECK_IN');
      expect(contracts.APPOINTMENT_TYPES).toContain('TRAINING_SESSION');
    });

    it('should export USER_TIERS', () => {
      expect(contracts.USER_TIERS).toBeDefined();
      expect(contracts.USER_TIERS).toContain('ESSENTIALS');
      expect(contracts.USER_TIERS).toContain('CORE');
      expect(contracts.USER_TIERS).toContain('CONCIERGE');
    });

    it('should export role helper functions', () => {
      expect(typeof contracts.isAdminRole).toBe('function');
      expect(typeof contracts.isSiteAdminRole).toBe('function');
      expect(contracts.isAdminRole('ADMIN')).toBe(true);
      expect(contracts.isAdminRole('CLINICIAN')).toBe(true);
      expect(contracts.isAdminRole('CLIENT')).toBe(false);
      expect(contracts.isSiteAdminRole('ADMIN')).toBe(true);
      expect(contracts.isSiteAdminRole('CLINICIAN')).toBe(false);
    });
  });

  describe('Zod Schemas', () => {
    describe('emailSchema', () => {
      it('should validate correct emails', () => {
        const result = contracts.emailSchema.safeParse('test@example.com');
        expect(result.success).toBe(true);
      });

      it('should reject invalid emails', () => {
        const result = contracts.emailSchema.safeParse('not-an-email');
        expect(result.success).toBe(false);
      });
    });

    describe('passwordSchema', () => {
      it('should validate passwords with 8+ characters', () => {
        const result = contracts.passwordSchema.safeParse('password123');
        expect(result.success).toBe(true);
      });

      it('should reject short passwords', () => {
        const result = contracts.passwordSchema.safeParse('short');
        expect(result.success).toBe(false);
      });
    });

    describe('isoDateSchema', () => {
      it('should validate correct ISO dates', () => {
        const result = contracts.isoDateSchema.safeParse('2024-01-15');
        expect(result.success).toBe(true);
      });

      it('should reject invalid date formats', () => {
        const result = contracts.isoDateSchema.safeParse('01-15-2024');
        expect(result.success).toBe(false);
      });

      it('should reject invalid dates', () => {
        const result = contracts.isoDateSchema.safeParse('2024-02-30');
        expect(result.success).toBe(false);
      });
    });

    describe('isoTimestampSchema', () => {
      it('should validate ISO timestamps', () => {
        const result = contracts.isoTimestampSchema.safeParse('2024-01-15T10:30:00.000Z');
        expect(result.success).toBe(true);
      });

      it('should reject invalid timestamps', () => {
        const result = contracts.isoTimestampSchema.safeParse('not-a-timestamp');
        expect(result.success).toBe(false);
      });
    });

    describe('barcodeSchema', () => {
      it('should validate HH-XXXXXX format', () => {
        const result = contracts.barcodeSchema.safeParse('HH-ABC234');
        expect(result.success).toBe(true);
      });

      it('should reject invalid barcode formats', () => {
        const result = contracts.barcodeSchema.safeParse('INVALID');
        expect(result.success).toBe(false);
      });
    });

    describe('userIdSchema', () => {
      it('should validate user ID format', () => {
        const result = contracts.userIdSchema.safeParse('HH-ABC123');
        expect(result.success).toBe(true);
      });
    });

    describe('UserRoleSchema', () => {
      it('should validate user roles', () => {
        expect(contracts.UserRoleSchema.safeParse('ADMIN').success).toBe(true);
        expect(contracts.UserRoleSchema.safeParse('CLINICIAN').success).toBe(true);
        expect(contracts.UserRoleSchema.safeParse('CLIENT').success).toBe(true);
        expect(contracts.UserRoleSchema.safeParse('INVALID').success).toBe(false);
      });
    });

    describe('AppointmentStatusSchema', () => {
      it('should validate appointment statuses', () => {
        expect(contracts.AppointmentStatusSchema.safeParse('SCHEDULED').success).toBe(true);
        expect(contracts.AppointmentStatusSchema.safeParse('COMPLETED').success).toBe(true);
        expect(contracts.AppointmentStatusSchema.safeParse('INVALID').success).toBe(false);
      });
    });

    describe('loginBodySchema', () => {
      it('should validate login request bodies', () => {
        const result = contracts.loginBodySchema.safeParse({
          email: 'user@example.com',
          password: 'securepassword',
        });
        expect(result.success).toBe(true);
      });

      it('should reject invalid login bodies', () => {
        const result = contracts.loginBodySchema.safeParse({
          email: 'not-an-email',
          password: '',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('dateRangeQuerySchema', () => {
      it('should validate date range queries', () => {
        const result = contracts.dateRangeQuerySchema.safeParse({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('paginationQuerySchema', () => {
      it('should provide defaults', () => {
        const result = contracts.paginationQuerySchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(20);
          expect(result.data.offset).toBe(0);
        }
      });

      it('should accept custom values', () => {
        const result = contracts.paginationQuerySchema.safeParse({
          limit: '50',
          offset: '10',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(50);
          expect(result.data.offset).toBe(10);
        }
      });
    });
  });

  describe('Constants', () => {
    it('should export STORAGE_KEYS', () => {
      expect(contracts.STORAGE_KEYS).toBeDefined();
      expect(contracts.STORAGE_KEYS.ACCESS_TOKEN).toBe('hollis:accessToken');
      expect(contracts.STORAGE_KEYS.USER_ID).toBe('hollis:userId');
    });

    it('should export UNIT_SYSTEMS', () => {
      expect(contracts.UNIT_SYSTEMS).toBeDefined();
      expect(contracts.UNIT_SYSTEMS).toContain('METRIC');
      expect(contracts.UNIT_SYSTEMS).toContain('IMPERIAL');
    });

    it('should export PAGINATION defaults', () => {
      expect(contracts.PAGINATION).toBeDefined();
      expect(contracts.PAGINATION.DEFAULT_PAGE_SIZE).toBe(20);
      expect(contracts.PAGINATION.MAX_PAGE_SIZE).toBe(100);
    });

    it('should export TIME_MS constants', () => {
      expect(contracts.TIME_MS).toBeDefined();
      expect(contracts.TIME_MS.SECOND).toBe(1000);
      expect(contracts.TIME_MS.MINUTE).toBe(60000);
      expect(contracts.TIME_MS.HOUR).toBe(3600000);
    });
  });

  describe('Type Validation Helpers', () => {
    it('should export isValidBarcode', () => {
      expect(typeof contracts.isValidBarcode).toBe('function');
      expect(contracts.isValidBarcode('HH-ABC234')).toBe(true);
      expect(contracts.isValidBarcode('invalid')).toBe(false);
    });

    it('should export isValidUserId', () => {
      expect(typeof contracts.isValidUserId).toBe('function');
      expect(contracts.isValidUserId('HH-ABC123')).toBe(true);
      expect(contracts.isValidUserId('invalid')).toBe(false);
    });

    it('should export isAppointmentStatus', () => {
      expect(typeof contracts.isAppointmentStatus).toBe('function');
      expect(contracts.isAppointmentStatus('SCHEDULED')).toBe(true);
      expect(contracts.isAppointmentStatus('INVALID')).toBe(false);
    });

    it('should export isAppointmentType', () => {
      expect(typeof contracts.isAppointmentType).toBe('function');
      expect(contracts.isAppointmentType('CHECK_IN')).toBe(true);
      expect(contracts.isAppointmentType('INVALID')).toBe(false);
    });
  });
});

// ============================================================================
// CIRCULAR DEPENDENCY TESTS
// ============================================================================

describe('Circular Dependency Prevention', () => {
  it('should import all modules without errors', () => {
    // If we got here, there are no circular dependencies that would cause
    // import failures. This test documents the expected behavior.
    expect(contracts).toBeDefined();
    expect(Object.keys(contracts).length).toBeGreaterThan(0);
  });

  it('should have all expected top-level exports', () => {
    // API Routes
    expect('API_ROUTES' in contracts).toBe(true);
    expect('AUTH_ROUTES' in contracts).toBe(true);
    expect('USER_ROUTES' in contracts).toBe(true);
    expect('ADMIN_ROUTES' in contracts).toBe(true);

    // Domain
    expect('USER_ROLES' in contracts).toBe(true);
    expect('APPOINTMENT_STATUSES' in contracts).toBe(true);
    expect('USER_TIERS' in contracts).toBe(true);

    // Schemas
    expect('emailSchema' in contracts).toBe(true);
    expect('isoDateSchema' in contracts).toBe(true);
    expect('UserRoleSchema' in contracts).toBe(true);

    // Constants
    expect('STORAGE_KEYS' in contracts).toBe(true);
    expect('UNIT_SYSTEMS' in contracts).toBe(true);
    expect('PAGINATION' in contracts).toBe(true);
  });
});

// ============================================================================
// TYPE COHERENCE TESTS
// ============================================================================

describe('Type Coherence', () => {
  it('should have matching tuple and schema for USER_ROLES', () => {
    // Ensure the tuple and schema are coherent
    const tupleValues = contracts.USER_ROLES;
    tupleValues.forEach((role) => {
      const result = contracts.UserRoleSchema.safeParse(role);
      expect(result.success).toBe(true);
    });
  });

  it('should have matching tuple and schema for APPOINTMENT_STATUSES', () => {
    const tupleValues = contracts.APPOINTMENT_STATUSES;
    tupleValues.forEach((status) => {
      const result = contracts.AppointmentStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    });
  });

  it('should have labels for all USER_ROLES', () => {
    const roles = contracts.USER_ROLES;
    roles.forEach((role) => {
      expect(contracts.USER_ROLE_LABELS[role]).toBeDefined();
      expect(typeof contracts.USER_ROLE_LABELS[role]).toBe('string');
    });
  });

  it('should have labels for all APPOINTMENT_STATUSES', () => {
    const statuses = contracts.APPOINTMENT_STATUSES;
    statuses.forEach((status) => {
      expect(contracts.APPOINTMENT_STATUS_LABELS[status]).toBeDefined();
      expect(typeof contracts.APPOINTMENT_STATUS_LABELS[status]).toBe('string');
    });
  });

  it('should have labels for all APPOINTMENT_TYPES', () => {
    const types = contracts.APPOINTMENT_TYPES;
    types.forEach((type) => {
      expect(contracts.APPOINTMENT_TYPE_LABELS[type]).toBeDefined();
      expect(typeof contracts.APPOINTMENT_TYPE_LABELS[type]).toBe('string');
    });
  });
});
