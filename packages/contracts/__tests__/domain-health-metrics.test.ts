/**
 * @ai-context Health Metrics & Health Metric Types Domain Contracts Tests
 *
 * This test suite covers:
 * 1. health-metric-types.ts: directions, categories, metric categories, value types, trend directions
 * 2. health-metrics.ts: MetricChangeSchema, ConcernAreaSchema, MetricAggregateSchema,
 *    HealthProgressOverviewSchema, HealthProgressSnapshotSchema, PatientHealthProgressSchema,
 *    WearablesDataSchema, DailySummarySchema, HealthMetricGoalSchema
 * 3. calculateInRangeScore utility function
 * 4. health-progress.ts: trends, data quality, getDataPointWeight, determineTrendFromDirection
 *
 * Run: npx jest shared/contracts/__tests__/domain-health-metrics.test.ts
 */

import {
  calculateInRangeScore,
  ConcernAreaSchema,
  DailySummarySchema,
  getDefaultReferenceRange,
  HealthImprovementPointSchema,
  HealthMetricGoalUpsertSchema,
  HealthProgressImprovementSchema,
  HealthProgressOverviewSchema,
  HealthProgressSnapshotSchema,
  MetricAggregateSchema,
  MetricChangeSchema,
  PatientHealthProgressSchema,
  PatientClinicalContextSchema,
  WearablesDataSchema,
} from '../domain/health-metrics';

import {
  HEALTH_METRIC_CATEGORIES,
  HEALTH_METRIC_CATEGORY_LABELS,
  HealthMetricCategorySchema,
  HEALTH_METRIC_DIRECTIONS,
  HealthMetricDirectionSchema,
  isMetricCategory,
  isMetricValueType,
  isTrendDirection,
  METRIC_CATEGORIES,
  METRIC_CATEGORY,
  METRIC_CATEGORY_LABELS,
  MetricCategorySchema,
  METRIC_VALUE_TYPE,
  METRIC_VALUE_TYPE_LABELS,
  METRIC_VALUE_TYPES,
  MetricValueTypeSchema,
  TREND_DIRECTION,
  TREND_DIRECTION_LABELS,
  TREND_DIRECTIONS,
  TrendDirectionSchema,
} from '../domain/health-metric-types';

import {
  DATA_QUALITY,
  DATA_QUALITY_LABELS,
  DATA_QUALITY_LEVELS,
  DataQualityLevelSchema,
  determineTrendFromDirection,
  getDataPointWeight,
  HEALTH_TREND,
  HEALTH_TREND_LABELS,
  HEALTH_TRENDS,
  HealthTrendSchema,
  isDataQualityLevel,
  isHealthTrend,
  SOURCE_WEIGHTS,
  VERIFICATION_MULTIPLIER,
} from '../domain/health-progress';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();

function validCategoryScores() {
  return {
    body_composition: 75,
    cardiovascular: 80,
    metabolic: 70,
    hormonal: 65,
    performance: 85,
    hematology: 90,
    inflammatory: 78,
    nutritional: 72,
  };
}

function validMetricChange() {
  return {
    metric: 'glucoseFasting',
    unit: 'mg/dL',
    startValue: 110,
    endValue: 95,
    percentChange: -13.6,
    trend: 'improving' as const,
    isWithinNormalRange: true,
    dataConfidence: 0.9,
    inRangeScore: 85,
  };
}

// ============================================================================
// HEALTH METRIC TYPES (health-metric-types.ts)
// ============================================================================

describe('Health Metric Types Domain Contracts', () => {

  // ============================================================================
  // HEALTH METRIC DIRECTION
  // ============================================================================

  describe('HealthMetricDirection', () => {
    it('should contain exactly 3 directions', () => {
      expect(HEALTH_METRIC_DIRECTIONS).toHaveLength(3);
    });

    it('should contain lower_better, higher_better, context', () => {
      expect(HEALTH_METRIC_DIRECTIONS).toContain('lower_better');
      expect(HEALTH_METRIC_DIRECTIONS).toContain('higher_better');
      expect(HEALTH_METRIC_DIRECTIONS).toContain('context');
    });

    it.each(HEALTH_METRIC_DIRECTIONS)('schema should accept: %s', (value) => {
      expect(HealthMetricDirectionSchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(HealthMetricDirectionSchema.safeParse('neutral').success).toBe(false);
      expect(HealthMetricDirectionSchema.safeParse('HIGHER_BETTER').success).toBe(false);
      expect(HealthMetricDirectionSchema.safeParse('').success).toBe(false);
    });
  });

  // ============================================================================
  // HEALTH METRIC CATEGORY
  // ============================================================================

  describe('HealthMetricCategory', () => {
    it('should contain 8 categories', () => {
      expect(HEALTH_METRIC_CATEGORIES).toHaveLength(8);
    });

    it('should contain all expected categories', () => {
      expect(HEALTH_METRIC_CATEGORIES).toContain('body_composition');
      expect(HEALTH_METRIC_CATEGORIES).toContain('cardiovascular');
      expect(HEALTH_METRIC_CATEGORIES).toContain('metabolic');
      expect(HEALTH_METRIC_CATEGORIES).toContain('hormonal');
      expect(HEALTH_METRIC_CATEGORIES).toContain('performance');
      expect(HEALTH_METRIC_CATEGORIES).toContain('hematology');
      expect(HEALTH_METRIC_CATEGORIES).toContain('inflammatory');
      expect(HEALTH_METRIC_CATEGORIES).toContain('nutritional');
    });

    it.each(HEALTH_METRIC_CATEGORIES)('schema should accept: %s', (value) => {
      expect(HealthMetricCategorySchema.safeParse(value).success).toBe(true);
    });

    it('should have labels for all categories', () => {
      for (const category of HEALTH_METRIC_CATEGORIES) {
        expect(HEALTH_METRIC_CATEGORY_LABELS[category]).toBeDefined();
        expect(HEALTH_METRIC_CATEGORY_LABELS[category].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // METRIC CATEGORY (Prisma alignment)
  // ============================================================================

  describe('MetricCategory', () => {
    it('should contain 6 categories', () => {
      expect(METRIC_CATEGORIES).toHaveLength(6);
    });

    it('should contain all expected values', () => {
      expect(METRIC_CATEGORIES).toContain('LAB');
      expect(METRIC_CATEGORIES).toContain('EXERCISE');
      expect(METRIC_CATEGORIES).toContain('BIOMETRIC');
      expect(METRIC_CATEGORIES).toContain('NUTRITION');
      expect(METRIC_CATEGORIES).toContain('WEARABLE');
      expect(METRIC_CATEGORIES).toContain('COMPUTED');
    });

    it.each(METRIC_CATEGORIES)('schema should accept: %s', (value) => {
      expect(MetricCategorySchema.safeParse(value).success).toBe(true);
    });

    it('schema should reject invalid values', () => {
      expect(MetricCategorySchema.safeParse('IMAGING').success).toBe(false);
      expect(MetricCategorySchema.safeParse('lab').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(METRIC_CATEGORY.LAB).toBe('LAB');
      expect(METRIC_CATEGORY.EXERCISE).toBe('EXERCISE');
      expect(METRIC_CATEGORY.BIOMETRIC).toBe('BIOMETRIC');
      expect(METRIC_CATEGORY.NUTRITION).toBe('NUTRITION');
      expect(METRIC_CATEGORY.WEARABLE).toBe('WEARABLE');
      expect(METRIC_CATEGORY.COMPUTED).toBe('COMPUTED');
    });

    it('should have labels for all categories', () => {
      for (const cat of METRIC_CATEGORIES) {
        expect(METRIC_CATEGORY_LABELS[cat]).toBeDefined();
        expect(METRIC_CATEGORY_LABELS[cat].length).toBeGreaterThan(0);
      }
    });

    describe('isMetricCategory type guard', () => {
      it.each(METRIC_CATEGORIES)('should return true for: %s', (value) => {
        expect(isMetricCategory(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isMetricCategory('IMAGING')).toBe(false);
        expect(isMetricCategory('')).toBe(false);
        expect(isMetricCategory('lab')).toBe(false);
      });
    });
  });

  // ============================================================================
  // METRIC VALUE TYPE
  // ============================================================================

  describe('MetricValueType', () => {
    it('should contain 6 value types', () => {
      expect(METRIC_VALUE_TYPES).toHaveLength(6);
    });

    it('should contain all expected values', () => {
      expect(METRIC_VALUE_TYPES).toContain('SCALAR');
      expect(METRIC_VALUE_TYPES).toContain('COMPOUND');
      expect(METRIC_VALUE_TYPES).toContain('DURATION');
      expect(METRIC_VALUE_TYPES).toContain('RATE');
      expect(METRIC_VALUE_TYPES).toContain('PERCENTAGE');
      expect(METRIC_VALUE_TYPES).toContain('SCORE');
    });

    it.each(METRIC_VALUE_TYPES)('schema should accept: %s', (value) => {
      expect(MetricValueTypeSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(METRIC_VALUE_TYPE.SCALAR).toBe('SCALAR');
      expect(METRIC_VALUE_TYPE.COMPOUND).toBe('COMPOUND');
      expect(METRIC_VALUE_TYPE.DURATION).toBe('DURATION');
      expect(METRIC_VALUE_TYPE.RATE).toBe('RATE');
      expect(METRIC_VALUE_TYPE.PERCENTAGE).toBe('PERCENTAGE');
      expect(METRIC_VALUE_TYPE.SCORE).toBe('SCORE');
    });

    it('should have labels for all value types', () => {
      for (const type of METRIC_VALUE_TYPES) {
        expect(METRIC_VALUE_TYPE_LABELS[type]).toBeDefined();
        expect(METRIC_VALUE_TYPE_LABELS[type].length).toBeGreaterThan(0);
      }
    });

    describe('isMetricValueType type guard', () => {
      it.each(METRIC_VALUE_TYPES)('should return true for: %s', (value) => {
        expect(isMetricValueType(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isMetricValueType('RATIO')).toBe(false);
        expect(isMetricValueType('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // TREND DIRECTION
  // ============================================================================

  describe('TrendDirection', () => {
    it('should contain 3 trend directions', () => {
      expect(TREND_DIRECTIONS).toHaveLength(3);
    });

    it('should contain all expected values', () => {
      expect(TREND_DIRECTIONS).toContain('HIGHER_BETTER');
      expect(TREND_DIRECTIONS).toContain('LOWER_BETTER');
      expect(TREND_DIRECTIONS).toContain('TARGET_BETTER');
    });

    it.each(TREND_DIRECTIONS)('schema should accept: %s', (value) => {
      expect(TrendDirectionSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(TREND_DIRECTION.HIGHER_BETTER).toBe('HIGHER_BETTER');
      expect(TREND_DIRECTION.LOWER_BETTER).toBe('LOWER_BETTER');
      expect(TREND_DIRECTION.TARGET_BETTER).toBe('TARGET_BETTER');
    });

    it('should have labels for all trend directions', () => {
      for (const dir of TREND_DIRECTIONS) {
        expect(TREND_DIRECTION_LABELS[dir]).toBeDefined();
        expect(TREND_DIRECTION_LABELS[dir].length).toBeGreaterThan(0);
      }
    });

    describe('isTrendDirection type guard', () => {
      it.each(TREND_DIRECTIONS)('should return true for: %s', (value) => {
        expect(isTrendDirection(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isTrendDirection('higher_better')).toBe(false);
        expect(isTrendDirection('')).toBe(false);
      });
    });
  });
});

// ============================================================================
// HEALTH PROGRESS (health-progress.ts)
// ============================================================================

describe('Health Progress Domain Contracts', () => {
  describe('HealthTrend', () => {
    it('should contain exactly 3 trends', () => {
      expect(HEALTH_TRENDS).toHaveLength(3);
    });

    it('should contain improving, stable, declining', () => {
      expect(HEALTH_TRENDS).toContain('improving');
      expect(HEALTH_TRENDS).toContain('stable');
      expect(HEALTH_TRENDS).toContain('declining');
    });

    it.each(HEALTH_TRENDS)('schema should accept: %s', (value) => {
      expect(HealthTrendSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(HEALTH_TREND.IMPROVING).toBe('improving');
      expect(HEALTH_TREND.STABLE).toBe('stable');
      expect(HEALTH_TREND.DECLINING).toBe('declining');
    });

    it('should have labels for all trends', () => {
      for (const trend of HEALTH_TRENDS) {
        expect(HEALTH_TREND_LABELS[trend]).toBeDefined();
        expect(HEALTH_TREND_LABELS[trend].length).toBeGreaterThan(0);
      }
    });

    describe('isHealthTrend type guard', () => {
      it.each(HEALTH_TRENDS)('should return true for: %s', (value) => {
        expect(isHealthTrend(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isHealthTrend('worsening')).toBe(false);
        expect(isHealthTrend('IMPROVING')).toBe(false);
        expect(isHealthTrend('')).toBe(false);
      });
    });
  });

  describe('DataQualityLevel', () => {
    it('should contain exactly 3 levels', () => {
      expect(DATA_QUALITY_LEVELS).toHaveLength(3);
    });

    it('should contain sufficient, sparse, insufficient', () => {
      expect(DATA_QUALITY_LEVELS).toContain('sufficient');
      expect(DATA_QUALITY_LEVELS).toContain('sparse');
      expect(DATA_QUALITY_LEVELS).toContain('insufficient');
    });

    it.each(DATA_QUALITY_LEVELS)('schema should accept: %s', (value) => {
      expect(DataQualityLevelSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants matching tuple values', () => {
      expect(DATA_QUALITY.SUFFICIENT).toBe('sufficient');
      expect(DATA_QUALITY.SPARSE).toBe('sparse');
      expect(DATA_QUALITY.INSUFFICIENT).toBe('insufficient');
    });

    it('should have labels for all quality levels', () => {
      for (const level of DATA_QUALITY_LEVELS) {
        expect(DATA_QUALITY_LABELS[level]).toBeDefined();
        expect(DATA_QUALITY_LABELS[level].length).toBeGreaterThan(0);
      }
    });

    describe('isDataQualityLevel type guard', () => {
      it.each(DATA_QUALITY_LEVELS)('should return true for: %s', (value) => {
        expect(isDataQualityLevel(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isDataQualityLevel('SUFFICIENT')).toBe(false);
        expect(isDataQualityLevel('unknown')).toBe(false);
      });
    });
  });

  describe('SOURCE_WEIGHTS and getDataPointWeight', () => {
    it('should have source weights for all BiometricSource values', () => {
      const sources = [
        'LAB_REPORT', 'CLINICIAN_ENTRY', 'DERIVED', 'APPLE_HEALTH',
        'OURA', 'WHOOP', 'GOOGLE_FIT', 'DEVICE', 'USER_LOG',
      ] as const;
      for (const source of sources) {
        expect(SOURCE_WEIGHTS[source]).toBeDefined();
        expect(SOURCE_WEIGHTS[source]).toBeGreaterThan(0);
        expect(SOURCE_WEIGHTS[source]).toBeLessThanOrEqual(1);
      }
    });

    it('lab and clinician entries should have max weight of 1.0', () => {
      expect(SOURCE_WEIGHTS.LAB_REPORT).toBe(1.0);
      expect(SOURCE_WEIGHTS.CLINICIAN_ENTRY).toBe(1.0);
    });

    it('user logs should have lower weight than lab reports', () => {
      expect(SOURCE_WEIGHTS.USER_LOG).toBeLessThan(SOURCE_WEIGHTS.LAB_REPORT);
    });

    it('getDataPointWeight should return weight for verified source', () => {
      const weight = getDataPointWeight('LAB_REPORT', true);
      expect(weight).toBe(1.0);
    });

    it('getDataPointWeight should reduce weight for unverified source', () => {
      const verified = getDataPointWeight('LAB_REPORT', true);
      const unverified = getDataPointWeight('LAB_REPORT', false);
      expect(unverified).toBeLessThan(verified);
    });

    it('getDataPointWeight should return value between 0 and 1', () => {
      const weight = getDataPointWeight('USER_LOG', false);
      expect(weight).toBeGreaterThanOrEqual(0);
      expect(weight).toBeLessThanOrEqual(1);
    });

    it('VERIFICATION_MULTIPLIER should have verified=1.0 and unverified<1', () => {
      expect(VERIFICATION_MULTIPLIER.verified).toBe(1.0);
      expect(VERIFICATION_MULTIPLIER.unverified).toBeLessThan(1.0);
    });
  });

  describe('determineTrendFromDirection', () => {
    it('should return stable for null percentChange', () => {
      expect(determineTrendFromDirection('higher_better', null)).toBe('stable');
      expect(determineTrendFromDirection('lower_better', null)).toBe('stable');
    });

    it('should return stable for change within ±3%', () => {
      expect(determineTrendFromDirection('higher_better', 2.9)).toBe('stable');
      expect(determineTrendFromDirection('higher_better', -2.9)).toBe('stable');
      expect(determineTrendFromDirection('lower_better', 0)).toBe('stable');
    });

    it('treats exactly +3% as improving for higher_better (threshold is strict < 3, not <=)', () => {
      // Source: Math.abs(percentChange) < STABILITY_THRESHOLD (3)
      // 3.0 is NOT less than 3, so it exits the stable branch and follows direction logic.
      expect(determineTrendFromDirection('higher_better', 3.0)).toBe('improving');
    });

    it('treats exactly -3% as declining for higher_better (threshold is strict < 3, not <=)', () => {
      expect(determineTrendFromDirection('higher_better', -3.0)).toBe('declining');
    });

    it('treats exactly +3% as declining for lower_better (threshold is strict < 3, not <=)', () => {
      expect(determineTrendFromDirection('lower_better', 3.0)).toBe('declining');
    });

    it('treats exactly -3% as improving for lower_better (threshold is strict < 3, not <=)', () => {
      expect(determineTrendFromDirection('lower_better', -3.0)).toBe('improving');
    });

    it('should return improving for higher_better with positive increase', () => {
      expect(determineTrendFromDirection('higher_better', 10)).toBe('improving');
    });

    it('should return declining for higher_better with negative decrease', () => {
      expect(determineTrendFromDirection('higher_better', -10)).toBe('declining');
    });

    it('should return improving for lower_better with negative change (decrease)', () => {
      expect(determineTrendFromDirection('lower_better', -10)).toBe('improving');
    });

    it('should return declining for lower_better with positive change (increase)', () => {
      expect(determineTrendFromDirection('lower_better', 10)).toBe('declining');
    });

    it('should return stable for context direction regardless of change', () => {
      expect(determineTrendFromDirection('context', 50)).toBe('stable');
      expect(determineTrendFromDirection('context', -50)).toBe('stable');
    });
  });
});

// ============================================================================
// HEALTH METRICS SCHEMAS (health-metrics.ts)
// ============================================================================

describe('Health Metrics Domain Contracts', () => {
  describe('calculateInRangeScore', () => {
    it('should return 100 for value at center of range', () => {
      const score = calculateInRangeScore(50, 0, 100);
      expect(score).toBe(100);
    });

    it('should return exactly 80 for value at the edge of range', () => {
      // value=0 is exactly at the low edge of [0, 100].
      // distanceFromCenter = |0 - 50| = 50; normalized = 50 / (100/2) = 1
      // score = round((1 - 1 * 0.2) * 100) = round(80) = 80
      const score = calculateInRangeScore(0, 0, 100);
      expect(score).toBe(80);
    });

    it('should return 0 for value outside by a full span', () => {
      const score = calculateInRangeScore(200, 0, 100);
      expect(score).toBe(0);
    });

    it('should return 0 when rangeLow is null', () => {
      expect(calculateInRangeScore(50, null, 100)).toBe(0);
    });

    it('should return 0 when rangeHigh is null', () => {
      expect(calculateInRangeScore(50, 0, null)).toBe(0);
    });

    it('should return 0 for NaN range values', () => {
      expect(calculateInRangeScore(50, NaN, 100)).toBe(0);
      expect(calculateInRangeScore(50, 0, NaN)).toBe(0);
    });

    it('should handle inverted range (min > max) by normalizing', () => {
      // Should work with inverted ranges via Math.min/max
      const score = calculateInRangeScore(50, 100, 0);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('getDefaultReferenceRange', () => {
    it('should return null (deprecated — all ranges now in DB)', () => {
      expect(getDefaultReferenceRange('glucoseFasting')).toBeNull();
      expect(getDefaultReferenceRange('ldlCholesterol')).toBeNull();
      expect(getDefaultReferenceRange('anyMetric')).toBeNull();
    });
  });

  describe('MetricChangeSchema', () => {
    it('should accept a valid metric change', () => {
      expect(MetricChangeSchema.safeParse(validMetricChange()).success).toBe(true);
    });

    it('should accept null values', () => {
      expect(MetricChangeSchema.safeParse({
        ...validMetricChange(),
        startValue: null,
        endValue: null,
        percentChange: null,
        dataConfidence: null,
        inRangeScore: null,
      }).success).toBe(true);
    });

    it('should reject empty metric string', () => {
      expect(MetricChangeSchema.safeParse({
        ...validMetricChange(),
        metric: '',
      }).success).toBe(false);
    });

    it('should reject dataConfidence outside 0-1 range', () => {
      expect(MetricChangeSchema.safeParse({
        ...validMetricChange(),
        dataConfidence: 1.5,
      }).success).toBe(false);

      expect(MetricChangeSchema.safeParse({
        ...validMetricChange(),
        dataConfidence: -0.1,
      }).success).toBe(false);
    });

    it('should reject inRangeScore outside 0-100 range', () => {
      expect(MetricChangeSchema.safeParse({
        ...validMetricChange(),
        inRangeScore: 101,
      }).success).toBe(false);

      expect(MetricChangeSchema.safeParse({
        ...validMetricChange(),
        inRangeScore: -1,
      }).success).toBe(false);
    });

    it('should reject invalid trend value', () => {
      expect(MetricChangeSchema.safeParse({
        ...validMetricChange(),
        trend: 'worsening',
      }).success).toBe(false);
    });
  });

  describe('ConcernAreaSchema', () => {
    it('should accept a valid concern area', () => {
      expect(ConcernAreaSchema.safeParse({
        metric: 'hba1c',
        patientsDeclined: 5,
      }).success).toBe(true);
    });

    it('should accept zero patientsDeclined', () => {
      expect(ConcernAreaSchema.safeParse({
        metric: 'hba1c',
        patientsDeclined: 0,
      }).success).toBe(true);
    });

    it('should reject negative patientsDeclined', () => {
      expect(ConcernAreaSchema.safeParse({
        metric: 'hba1c',
        patientsDeclined: -1,
      }).success).toBe(false);
    });

    it('should reject empty metric string', () => {
      expect(ConcernAreaSchema.safeParse({
        metric: '',
        patientsDeclined: 5,
      }).success).toBe(false);
    });
  });

  describe('MetricAggregateSchema', () => {
    it('should accept a valid metric aggregate', () => {
      expect(MetricAggregateSchema.safeParse({
        metric: 'ldlCholesterol',
        avgChange: -5.2,
      }).success).toBe(true);
    });

    it('should accept negative avgChange', () => {
      expect(MetricAggregateSchema.safeParse({
        metric: 'bodyFat',
        avgChange: -3.1,
      }).success).toBe(true);
    });
  });

  describe('HealthProgressOverviewSchema', () => {
    it('should accept a valid overview', () => {
      const result = HealthProgressOverviewSchema.safeParse({
        totalPatients: 50,
        improving: 30,
        stable: 15,
        declining: 5,
        avgScore: 72.5,
        topImprovingMetrics: [{ metric: 'hdlCholesterol', avgChange: 8.2 }],
        concernAreas: [{ metric: 'hba1c', patientsDeclined: 3 }],
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty arrays for metrics and concerns', () => {
      const result = HealthProgressOverviewSchema.safeParse({
        totalPatients: 0,
        improving: 0,
        stable: 0,
        declining: 0,
        avgScore: 0,
        topImprovingMetrics: [],
        concernAreas: [],
      });
      expect(result.success).toBe(true);
    });

    it('should reject avgScore outside 0-100', () => {
      expect(HealthProgressOverviewSchema.safeParse({
        totalPatients: 10,
        improving: 5,
        stable: 3,
        declining: 2,
        avgScore: 101,
        topImprovingMetrics: [],
        concernAreas: [],
      }).success).toBe(false);
    });
  });

  describe('HealthProgressSnapshotSchema', () => {
    it('should accept a valid snapshot', () => {
      const result = HealthProgressSnapshotSchema.safeParse({
        id: 'snapshot-123',
        userId: 'user-456',
        calculatedAt: NOW_ISO,
        periodMonths: 3,
        overallScore: 78.5,
        overallTrend: 'improving',
        dataConfidence: 0.85,
        categoryScores: validCategoryScores(),
        metricChanges: [validMetricChange()],
      });
      expect(result.success).toBe(true);
    });

    it('should accept null dataConfidence', () => {
      const result = HealthProgressSnapshotSchema.safeParse({
        id: 'snapshot-123',
        userId: 'user-456',
        calculatedAt: NOW_ISO,
        periodMonths: 1,
        overallScore: 0,
        overallTrend: 'stable',
        dataConfidence: null,
        categoryScores: validCategoryScores(),
        metricChanges: [],
      });
      expect(result.success).toBe(true);
    });

    it('should reject periodMonths less than 1', () => {
      expect(HealthProgressSnapshotSchema.safeParse({
        id: 'snap',
        userId: 'user',
        calculatedAt: NOW_ISO,
        periodMonths: 0,
        overallScore: 50,
        overallTrend: 'stable',
        dataConfidence: null,
        categoryScores: validCategoryScores(),
        metricChanges: [],
      }).success).toBe(false);
    });

    it('should reject dataConfidence outside 0-1', () => {
      expect(HealthProgressSnapshotSchema.safeParse({
        id: 'snap',
        userId: 'user',
        calculatedAt: NOW_ISO,
        periodMonths: 1,
        overallScore: 50,
        overallTrend: 'stable',
        dataConfidence: 1.5,
        categoryScores: validCategoryScores(),
        metricChanges: [],
      }).success).toBe(false);
    });
  });

  describe('PatientHealthProgressSchema', () => {
    it('should accept a valid patient health progress', () => {
      const result = PatientHealthProgressSchema.safeParse({
        patientId: 'patient-123',
        periodStart: '2024-01-01',
        periodEnd: '2024-04-01',
        overallTrend: 'improving',
        overallScore: 72,
        categoryScores: validCategoryScores(),
        metricChanges: [validMetricChange()],
        dataQuality: 'sufficient',
        overallDataConfidence: 0.8,
        monthlyImprovement: null,
      });
      expect(result.success).toBe(true);
    });

    it('should accept without optional monthlyImprovement', () => {
      const result = PatientHealthProgressSchema.safeParse({
        patientId: 'patient-123',
        periodStart: '2024-01-01',
        periodEnd: '2024-04-01',
        overallTrend: 'stable',
        overallScore: 60,
        categoryScores: validCategoryScores(),
        metricChanges: [],
        dataQuality: 'sparse',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('PatientClinicalContextSchema', () => {
    it('should accept a valid clinical context', () => {
      expect(PatientClinicalContextSchema.safeParse({
        sex: 'male',
        age: 35,
        pregnancyStatus: null,
      }).success).toBe(true);
    });

    it('should accept an empty object (all optional)', () => {
      expect(PatientClinicalContextSchema.safeParse({}).success).toBe(true);
    });

    it('should accept null for all fields', () => {
      expect(PatientClinicalContextSchema.safeParse({
        sex: null,
        age: null,
        pregnancyStatus: null,
      }).success).toBe(true);
    });

    it('should reject invalid sex value', () => {
      expect(PatientClinicalContextSchema.safeParse({
        sex: 'other',
      }).success).toBe(false);
    });

    it('should reject age outside 0-150 range', () => {
      expect(PatientClinicalContextSchema.safeParse({ age: -1 }).success).toBe(false);
      expect(PatientClinicalContextSchema.safeParse({ age: 151 }).success).toBe(false);
    });
  });

  describe('WearablesDataSchema', () => {
    it('should accept a minimal valid wearables data object', () => {
      expect(WearablesDataSchema.safeParse({ isVerified: true }).success).toBe(true);
    });

    it('should accept a fully populated wearables object', () => {
      const result = WearablesDataSchema.safeParse({
        steps: 10000,
        sleepHours: 7.5,
        restingHeartRate: 58,
        activeCalories: 450,
        flightsClimbed: 12,
        weight: 78.5,
        heartRateVariability: 52.3,
        oxygenSaturation: 98.5,
        respiratoryRate: 14.2,
        source: 'APPLE_HEALTH',
        isVerified: true,
        syncedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing isVerified', () => {
      expect(WearablesDataSchema.safeParse({
        steps: 5000,
      }).success).toBe(false);
    });

    it('should reject non-integer steps', () => {
      expect(WearablesDataSchema.safeParse({
        isVerified: true,
        steps: 1000.5,
      }).success).toBe(false);
    });
  });

  describe('HealthImprovementPointSchema', () => {
    it('should accept a valid improvement point', () => {
      expect(HealthImprovementPointSchema.safeParse({
        date: '2024-01-01',
        percentChange: 5.2,
        score: 75,
      }).success).toBe(true);
    });

    it('should reject score outside 0-100', () => {
      expect(HealthImprovementPointSchema.safeParse({
        date: '2024-01-01',
        percentChange: 5,
        score: 101,
      }).success).toBe(false);
    });
  });

  describe('HealthProgressImprovementSchema', () => {
    it('should accept a valid improvement', () => {
      const result = HealthProgressImprovementSchema.safeParse({
        periodDays: 90,
        startScore: 60,
        endScore: 75,
        percentChange: 25.0,
        points: [{ date: '2024-01-01', percentChange: 0, score: 60 }],
      });
      expect(result.success).toBe(true);
    });

    it('should accept null scores and percentChange', () => {
      const result = HealthProgressImprovementSchema.safeParse({
        periodDays: 30,
        startScore: null,
        endScore: null,
        percentChange: null,
        points: [],
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-positive periodDays', () => {
      expect(HealthProgressImprovementSchema.safeParse({
        periodDays: 0,
        startScore: null,
        endScore: null,
        percentChange: null,
        points: [],
      }).success).toBe(false);
    });
  });

  describe('HealthMetricGoalUpsertSchema', () => {
    it('should accept an empty object (all fields optional)', () => {
      expect(HealthMetricGoalUpsertSchema.safeParse({}).success).toBe(true);
    });

    it('should accept a partial goal update', () => {
      expect(HealthMetricGoalUpsertSchema.safeParse({
        targetValue: 5.5,
        targetDirection: 'lower_better',
        referenceRangeLow: 4.0,
        referenceRangeHigh: 5.7,
      }).success).toBe(true);
    });

    it('should accept null values for nullable fields', () => {
      expect(HealthMetricGoalUpsertSchema.safeParse({
        targetValue: null,
        referenceRangeLow: null,
        referenceRangeHigh: null,
      }).success).toBe(true);
    });
  });

  describe('DailySummarySchema', () => {
    it('should accept a valid daily summary', () => {
      const result = DailySummarySchema.safeParse({
        date: '2024-06-15',
        userId: 'user-123',
        wearables: { isVerified: false },
        nutrition: {
          userId: 'user-123',
          date: '2024-06-15',
          timezone: 'America/Chicago',
          meals: [],
          totals: {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fat: 70,
          },
          isVerified: false,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        },
        documents: [],
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      expect(DailySummarySchema.safeParse({
        date: '2024/06/15',
        userId: 'user-123',
        wearables: { isVerified: false },
        nutrition: {
          userId: 'user-123',
          date: '2024-06-15',
          foods: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        },
        documents: [],
      }).success).toBe(false);
    });
  });
});
