/**
 * @ai-context Compliance Domain Contracts Tests
 *
 * This test suite verifies:
 * 1. COMPLIANCE_STATUSES tuple, schema, constants, labels
 * 2. COMPLIANCE_THRESHOLDS constant values
 * 3. getComplianceStatusFromScore() — boundary values at 90 / 70 / 50
 * 4. isComplianceStatus() type guard
 * 5. ComplianceMetricsSchema
 * 6. TierComplianceRequirementsSchema
 * 7. TIER_COMPLIANCE_REQUIREMENTS — per-tier values
 * 8. MetricAdherenceSchema
 * 9. ComplianceBreakdownSchema
 * 10. TierAwareComplianceResultSchema
 * 11. Mock factories: createMockMetricAdherence, createMockComplianceBreakdown,
 *     createMockTierAwareComplianceResult
 *
 * Run: npx jest shared/contracts/__tests__/domain-compliance.test.ts
 */

import {
  COMPLIANCE_STATUS,
  COMPLIANCE_STATUS_LABELS,
  COMPLIANCE_STATUSES,
  COMPLIANCE_THRESHOLDS,
  ComplianceBreakdownSchema,
  ComplianceMetricsSchema,
  ComplianceStatusSchema,
  createMockComplianceBreakdown,
  createMockMetricAdherence,
  createMockTierAwareComplianceResult,
  getComplianceStatusFromScore,
  isComplianceStatus,
  MetricAdherenceSchema,
  TIER_COMPLIANCE_REQUIREMENTS,
  TierAwareComplianceResultSchema,
  TierComplianceRequirementsSchema,
  type ComplianceStatus,
} from '../domain/compliance';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();

function validComplianceMetrics() {
  return {
    patientId: 'patient-001',
    periodStart: '2024-06-01',
    periodEnd: '2024-06-30',
    workoutAdherence: 75,
    dietLoggingStreak: 20,
    appointmentAttendanceRate: 100,
    overallScore: 80,
    avgWorkoutsPerWeek: 3,
    avgFoodLoggingDaysPerWeek: 5,
    avgEveningCheckinsPerWeek: 6,
    nutritionQualityScore: 72,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

// ============================================================================
// COMPLIANCE STATUS
// ============================================================================

describe('Compliance Domain Contracts', () => {
  describe('COMPLIANCE_STATUSES', () => {
    it('should contain exactly 4 compliance statuses', () => {
      expect(COMPLIANCE_STATUSES).toHaveLength(4);
    });

    it('should contain excellent, good, at-risk, non-compliant', () => {
      expect(COMPLIANCE_STATUSES).toContain('excellent');
      expect(COMPLIANCE_STATUSES).toContain('good');
      expect(COMPLIANCE_STATUSES).toContain('at-risk');
      expect(COMPLIANCE_STATUSES).toContain('non-compliant');
    });

    it.each(COMPLIANCE_STATUSES)('ComplianceStatusSchema should accept: %s', (value) => {
      expect(ComplianceStatusSchema.safeParse(value).success).toBe(true);
    });

    it('ComplianceStatusSchema should reject invalid values', () => {
      expect(ComplianceStatusSchema.safeParse('EXCELLENT').success).toBe(false);
      expect(ComplianceStatusSchema.safeParse('poor').success).toBe(false);
      expect(ComplianceStatusSchema.safeParse('compliant').success).toBe(false);
      expect(ComplianceStatusSchema.safeParse('').success).toBe(false);
      expect(ComplianceStatusSchema.safeParse(null).success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(COMPLIANCE_STATUS.EXCELLENT).toBe('excellent');
      expect(COMPLIANCE_STATUS.GOOD).toBe('good');
      expect(COMPLIANCE_STATUS.AT_RISK).toBe('at-risk');
      expect(COMPLIANCE_STATUS.NON_COMPLIANT).toBe('non-compliant');
    });

    it('should have labels for all statuses', () => {
      for (const status of COMPLIANCE_STATUSES) {
        expect(COMPLIANCE_STATUS_LABELS[status as ComplianceStatus]).toBeDefined();
        expect(COMPLIANCE_STATUS_LABELS[status as ComplianceStatus].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // COMPLIANCE THRESHOLDS
  // ============================================================================

  describe('COMPLIANCE_THRESHOLDS', () => {
    it('should have EXCELLENT at 90', () => {
      expect(COMPLIANCE_THRESHOLDS.EXCELLENT).toBe(90);
    });

    it('should have GOOD at 70', () => {
      expect(COMPLIANCE_THRESHOLDS.GOOD).toBe(70);
    });

    it('should have AT_RISK at 50', () => {
      expect(COMPLIANCE_THRESHOLDS.AT_RISK).toBe(50);
    });

    it('should have EXCELLENT threshold stricter than GOOD', () => {
      expect(COMPLIANCE_THRESHOLDS.EXCELLENT).toBeGreaterThan(COMPLIANCE_THRESHOLDS.GOOD);
    });

    it('should have GOOD threshold stricter than AT_RISK', () => {
      expect(COMPLIANCE_THRESHOLDS.GOOD).toBeGreaterThan(COMPLIANCE_THRESHOLDS.AT_RISK);
    });
  });

  // ============================================================================
  // getComplianceStatusFromScore
  // ============================================================================

  describe('getComplianceStatusFromScore', () => {
    it('should return "excellent" at exactly 90 (>= EXCELLENT threshold)', () => {
      expect(getComplianceStatusFromScore(90)).toBe('excellent');
    });

    it('should return "excellent" for scores above 90', () => {
      expect(getComplianceStatusFromScore(95)).toBe('excellent');
      expect(getComplianceStatusFromScore(100)).toBe('excellent');
    });

    it('should return "good" for score of 89 (below EXCELLENT, above GOOD)', () => {
      expect(getComplianceStatusFromScore(89)).toBe('good');
    });

    it('should return "good" at exactly 70 (>= GOOD threshold)', () => {
      expect(getComplianceStatusFromScore(70)).toBe('good');
    });

    it('should return "good" for scores between 70 and 89', () => {
      expect(getComplianceStatusFromScore(75)).toBe('good');
      expect(getComplianceStatusFromScore(80)).toBe('good');
    });

    it('should return "at-risk" for score of 69 (below GOOD, above AT_RISK)', () => {
      expect(getComplianceStatusFromScore(69)).toBe('at-risk');
    });

    it('should return "at-risk" at exactly 50 (>= AT_RISK threshold)', () => {
      expect(getComplianceStatusFromScore(50)).toBe('at-risk');
    });

    it('should return "at-risk" for scores between 50 and 69', () => {
      expect(getComplianceStatusFromScore(55)).toBe('at-risk');
      expect(getComplianceStatusFromScore(60)).toBe('at-risk');
    });

    it('should return "non-compliant" for score of 49 (below AT_RISK)', () => {
      expect(getComplianceStatusFromScore(49)).toBe('non-compliant');
    });

    it('should return "non-compliant" for scores below 50', () => {
      expect(getComplianceStatusFromScore(0)).toBe('non-compliant');
      expect(getComplianceStatusFromScore(25)).toBe('non-compliant');
      expect(getComplianceStatusFromScore(1)).toBe('non-compliant');
    });

    it('should return a valid ComplianceStatus for all boundary values', () => {
      const boundaries = [0, 49, 50, 69, 70, 89, 90, 100];
      for (const score of boundaries) {
        const result = getComplianceStatusFromScore(score);
        expect(ComplianceStatusSchema.safeParse(result).success).toBe(true);
      }
    });
  });

  // ============================================================================
  // isComplianceStatus
  // ============================================================================

  describe('isComplianceStatus', () => {
    it.each(COMPLIANCE_STATUSES)('should return true for valid status: %s', (value) => {
      expect(isComplianceStatus(value)).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(isComplianceStatus('EXCELLENT')).toBe(false);
      expect(isComplianceStatus('poor')).toBe(false);
      expect(isComplianceStatus('')).toBe(false);
    });
  });

  // ============================================================================
  // COMPLIANCE METRICS SCHEMA
  // ============================================================================

  describe('ComplianceMetricsSchema', () => {
    it('should accept a valid compliance metrics object', () => {
      expect(ComplianceMetricsSchema.safeParse(validComplianceMetrics()).success).toBe(true);
    });

    it('should accept fractional numeric fields', () => {
      expect(ComplianceMetricsSchema.safeParse({
        ...validComplianceMetrics(),
        avgWorkoutsPerWeek: 2.5,
        avgFoodLoggingDaysPerWeek: 4.3,
        avgEveningCheckinsPerWeek: 5.8,
      }).success).toBe(true);
    });

    it('should reject missing patientId', () => {
      const { patientId: _p, ...rest } = validComplianceMetrics();
      expect(ComplianceMetricsSchema.safeParse(rest).success).toBe(false);
    });

    it('should reject missing periodStart', () => {
      const { periodStart: _s, ...rest } = validComplianceMetrics();
      expect(ComplianceMetricsSchema.safeParse(rest).success).toBe(false);
    });
  });

  // ============================================================================
  // TIER COMPLIANCE REQUIREMENTS
  // ============================================================================

  describe('TierComplianceRequirementsSchema', () => {
    it('should accept valid tier requirements', () => {
      expect(TierComplianceRequirementsSchema.safeParse({
        checkinsPerWeek: 1,
        foodLogsPerWeek: 4,
        workoutsPerWeek: 2,
      }).success).toBe(true);
    });

    it('should accept zero values (no requirement)', () => {
      expect(TierComplianceRequirementsSchema.safeParse({
        checkinsPerWeek: 0,
        foodLogsPerWeek: 0,
        workoutsPerWeek: 0,
      }).success).toBe(true);
    });

    it('should accept fractional values (e.g., 0.5 check-ins per week)', () => {
      expect(TierComplianceRequirementsSchema.safeParse({
        checkinsPerWeek: 0.5,
        foodLogsPerWeek: 0,
        workoutsPerWeek: 1,
      }).success).toBe(true);
    });

    it('should reject negative values', () => {
      expect(TierComplianceRequirementsSchema.safeParse({
        checkinsPerWeek: -1,
        foodLogsPerWeek: 4,
        workoutsPerWeek: 2,
      }).success).toBe(false);
    });
  });

  describe('TIER_COMPLIANCE_REQUIREMENTS', () => {
    it('should have requirements for ESSENTIALS, CORE, and CONCIERGE tiers', () => {
      expect(TIER_COMPLIANCE_REQUIREMENTS.ESSENTIALS).toBeDefined();
      expect(TIER_COMPLIANCE_REQUIREMENTS.CORE).toBeDefined();
      expect(TIER_COMPLIANCE_REQUIREMENTS.CONCIERGE).toBeDefined();
    });

    it('CONCIERGE should require the most workouts per week', () => {
      expect(TIER_COMPLIANCE_REQUIREMENTS.CONCIERGE.workoutsPerWeek)
        .toBeGreaterThan(TIER_COMPLIANCE_REQUIREMENTS.CORE.workoutsPerWeek);
      expect(TIER_COMPLIANCE_REQUIREMENTS.CORE.workoutsPerWeek)
        .toBeGreaterThan(TIER_COMPLIANCE_REQUIREMENTS.ESSENTIALS.workoutsPerWeek);
    });

    it('CONCIERGE should require the most food logs per week', () => {
      expect(TIER_COMPLIANCE_REQUIREMENTS.CONCIERGE.foodLogsPerWeek)
        .toBeGreaterThan(TIER_COMPLIANCE_REQUIREMENTS.CORE.foodLogsPerWeek);
    });

    it('TRAINING should carry the same minimal expectations as ESSENTIALS', () => {
      expect(TIER_COMPLIANCE_REQUIREMENTS.TRAINING).toEqual(
        TIER_COMPLIANCE_REQUIREMENTS.ESSENTIALS,
      );
    });

    it('ESSENTIALS should have zero food logs requirement', () => {
      expect(TIER_COMPLIANCE_REQUIREMENTS.ESSENTIALS.foodLogsPerWeek).toBe(0);
    });

    it('CONCIERGE should require daily check-ins (7 per week)', () => {
      expect(TIER_COMPLIANCE_REQUIREMENTS.CONCIERGE.checkinsPerWeek).toBe(7);
    });

    it('all tier requirements should be valid TierComplianceRequirements', () => {
      for (const tier of Object.keys(TIER_COMPLIANCE_REQUIREMENTS) as (keyof typeof TIER_COMPLIANCE_REQUIREMENTS)[]) {
        const result = TierComplianceRequirementsSchema.safeParse(
          TIER_COMPLIANCE_REQUIREMENTS[tier],
        );
        expect(result.success).toBe(true);
      }
    });
  });

  // ============================================================================
  // METRIC ADHERENCE
  // ============================================================================

  describe('MetricAdherenceSchema', () => {
    it('should accept a valid metric adherence object', () => {
      expect(MetricAdherenceSchema.safeParse({
        actual: 5,
        expected: 7,
        adherence: 71,
      }).success).toBe(true);
    });

    it('should accept 100% adherence', () => {
      expect(MetricAdherenceSchema.safeParse({
        actual: 7,
        expected: 7,
        adherence: 100,
      }).success).toBe(true);
    });

    it('should accept 0% adherence', () => {
      expect(MetricAdherenceSchema.safeParse({
        actual: 0,
        expected: 7,
        adherence: 0,
      }).success).toBe(true);
    });

    it('should reject adherence above 100', () => {
      expect(MetricAdherenceSchema.safeParse({
        actual: 8,
        expected: 7,
        adherence: 114,
      }).success).toBe(false);
    });

    it('should reject negative actual', () => {
      expect(MetricAdherenceSchema.safeParse({
        actual: -1,
        expected: 7,
        adherence: 0,
      }).success).toBe(false);
    });

    it('should reject negative expected', () => {
      expect(MetricAdherenceSchema.safeParse({
        actual: 5,
        expected: -1,
        adherence: 50,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // COMPLIANCE BREAKDOWN
  // ============================================================================

  describe('ComplianceBreakdownSchema', () => {
    it('should accept a valid compliance breakdown', () => {
      expect(ComplianceBreakdownSchema.safeParse({
        checkins: { actual: 6, expected: 7, adherence: 86 },
        foodLogs: { actual: 5, expected: 7, adherence: 71 },
        workouts: { actual: 3, expected: 4, adherence: 75 },
      }).success).toBe(true);
    });

    it('should reject missing checkins', () => {
      expect(ComplianceBreakdownSchema.safeParse({
        foodLogs: { actual: 5, expected: 7, adherence: 71 },
        workouts: { actual: 3, expected: 4, adherence: 75 },
      }).success).toBe(false);
    });

    it('should reject invalid metric adherence value within breakdown', () => {
      expect(ComplianceBreakdownSchema.safeParse({
        checkins: { actual: -1, expected: 7, adherence: 0 },
        foodLogs: { actual: 5, expected: 7, adherence: 71 },
        workouts: { actual: 3, expected: 4, adherence: 75 },
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // TIER-AWARE COMPLIANCE RESULT
  // ============================================================================

  describe('TierAwareComplianceResultSchema', () => {
    it('should accept a valid tier-aware compliance result', () => {
      expect(TierAwareComplianceResultSchema.safeParse({
        status: 'good',
        score: 72,
        tier: 'CORE',
        breakdown: {
          checkins: { actual: 5, expected: 7, adherence: 71 },
          foodLogs: { actual: 5, expected: 7, adherence: 71 },
          workouts: { actual: 3, expected: 4, adherence: 75 },
        },
        periodWeeks: 4,
      }).success).toBe(true);
    });

    it('should accept all valid compliance statuses', () => {
      for (const status of COMPLIANCE_STATUSES) {
        expect(TierAwareComplianceResultSchema.safeParse({
          status,
          score: 50,
          tier: 'ESSENTIALS',
          breakdown: {
            checkins: { actual: 1, expected: 2, adherence: 50 },
            foodLogs: { actual: 0, expected: 0, adherence: 100 },
            workouts: { actual: 1, expected: 2, adherence: 50 },
          },
          periodWeeks: 1,
        }).success).toBe(true);
      }
    });

    it('should reject score above 100', () => {
      expect(TierAwareComplianceResultSchema.safeParse({
        status: 'excellent',
        score: 101,
        tier: 'CONCIERGE',
        breakdown: {
          checkins: { actual: 7, expected: 7, adherence: 100 },
          foodLogs: { actual: 7, expected: 7, adherence: 100 },
          workouts: { actual: 4, expected: 4, adherence: 100 },
        },
        periodWeeks: 4,
      }).success).toBe(false);
    });

    it('should reject periodWeeks of 0', () => {
      expect(TierAwareComplianceResultSchema.safeParse({
        status: 'good',
        score: 72,
        tier: 'CORE',
        breakdown: {
          checkins: { actual: 5, expected: 7, adherence: 71 },
          foodLogs: { actual: 5, expected: 7, adherence: 71 },
          workouts: { actual: 3, expected: 4, adherence: 75 },
        },
        periodWeeks: 0,
      }).success).toBe(false);
    });

    it('should reject invalid tier', () => {
      expect(TierAwareComplianceResultSchema.safeParse({
        status: 'good',
        score: 72,
        tier: 'PREMIUM',
        breakdown: {
          checkins: { actual: 5, expected: 7, adherence: 71 },
          foodLogs: { actual: 5, expected: 7, adherence: 71 },
          workouts: { actual: 3, expected: 4, adherence: 75 },
        },
        periodWeeks: 4,
      }).success).toBe(false);
    });

    it('should reject invalid compliance status', () => {
      expect(TierAwareComplianceResultSchema.safeParse({
        status: 'EXCELLENT',
        score: 92,
        tier: 'CONCIERGE',
        breakdown: {
          checkins: { actual: 7, expected: 7, adherence: 100 },
          foodLogs: { actual: 7, expected: 7, adherence: 100 },
          workouts: { actual: 4, expected: 4, adherence: 100 },
        },
        periodWeeks: 4,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // MOCK FACTORIES
  // ============================================================================

  describe('Mock factories', () => {
    describe('createMockMetricAdherence', () => {
      it('should produce a valid MetricAdherence', () => {
        const mock = createMockMetricAdherence();
        expect(MetricAdherenceSchema.safeParse(mock).success).toBe(true);
      });

      it('should use default values', () => {
        const mock = createMockMetricAdherence();
        expect(mock.actual).toBe(5);
        expect(mock.expected).toBe(7);
        expect(mock.adherence).toBe(71);
      });

      it('should allow overriding fields', () => {
        const mock = createMockMetricAdherence({ actual: 7, adherence: 100 });
        expect(mock.actual).toBe(7);
        expect(mock.adherence).toBe(100);
        expect(mock.expected).toBe(7); // default preserved
      });
    });

    describe('createMockComplianceBreakdown', () => {
      it('should produce a valid ComplianceBreakdown', () => {
        const mock = createMockComplianceBreakdown();
        expect(ComplianceBreakdownSchema.safeParse(mock).success).toBe(true);
      });

      it('should have default workout adherence of 75%', () => {
        const mock = createMockComplianceBreakdown();
        expect(mock.workouts.actual).toBe(3);
        expect(mock.workouts.expected).toBe(4);
        expect(mock.workouts.adherence).toBe(75);
      });

      it('should allow overriding checkins breakdown', () => {
        const customCheckins = createMockMetricAdherence({ actual: 7, expected: 7, adherence: 100 });
        const mock = createMockComplianceBreakdown({ checkins: customCheckins });
        expect(mock.checkins.actual).toBe(7);
        expect(mock.checkins.adherence).toBe(100);
      });
    });

    describe('createMockTierAwareComplianceResult', () => {
      it('should produce a valid TierAwareComplianceResult', () => {
        const mock = createMockTierAwareComplianceResult();
        expect(TierAwareComplianceResultSchema.safeParse(mock).success).toBe(true);
      });

      it('should use default status of "good"', () => {
        const mock = createMockTierAwareComplianceResult();
        expect(mock.status).toBe('good');
      });

      it('should use default tier of "CORE"', () => {
        const mock = createMockTierAwareComplianceResult();
        expect(mock.tier).toBe('CORE');
      });

      it('should use default score of 72', () => {
        const mock = createMockTierAwareComplianceResult();
        expect(mock.score).toBe(72);
      });

      it('should allow overriding status and tier', () => {
        const mock = createMockTierAwareComplianceResult({
          status: 'excellent',
          tier: 'CONCIERGE',
          score: 95,
          periodWeeks: 8,
        });
        expect(mock.status).toBe('excellent');
        expect(mock.tier).toBe('CONCIERGE');
        expect(mock.score).toBe(95);
        expect(mock.periodWeeks).toBe(8);
      });
    });
  });
});
