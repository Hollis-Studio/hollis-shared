/**
 * @ai-context Compliance domain contracts | tier-aware compliance tracking statuses
 *
 * BUSINESS CONTEXT:
 * Hollis Health has 3 membership tiers with different engagement expectations.
 * This file enables tier-specific compliance tracking so admins can identify:
 * - High-paying clients underutilizing their membership (churn risk)
 * - Clients who are thriving and getting full value
 * - Where specifically a client is falling short
 *
 * IMPORTANT: All compliance-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';
import type { UserTier } from './user';
import { UserTierSchema } from './user';

// ============================================================================
// COMPLIANCE STATUS
// ============================================================================

/**
 * Granular compliance status levels (replaces binary "compliant/non-compliant").
 * - excellent (≥90%): Client is crushing it, fully engaged
 * - good (≥70%): On track, meeting most expectations
 * - at-risk (≥50%): Needs proactive outreach before they disengage
 * - non-compliant (<50%): Intervention needed, significant churn risk
 */
export const COMPLIANCE_STATUSES = ['excellent', 'good', 'at-risk', 'non-compliant'] as const;
export type ComplianceStatus = (typeof COMPLIANCE_STATUSES)[number];

export const ComplianceStatusSchema = z.enum(COMPLIANCE_STATUSES);

/** Centralized compliance status constants for equality checks */
export const COMPLIANCE_STATUS = {
  EXCELLENT: 'excellent' as ComplianceStatus,
  GOOD: 'good' as ComplianceStatus,
  AT_RISK: 'at-risk' as ComplianceStatus,
  NON_COMPLIANT: 'non-compliant' as ComplianceStatus,
} as const;

/** Human-readable labels for compliance statuses */
export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  excellent: 'Excellent',
  good: 'Good',
  'at-risk': 'At Risk',
  'non-compliant': 'Non-Compliant',
};

/** Score thresholds for each compliance status */
export const COMPLIANCE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  AT_RISK: 50,
  // Below 50 = non-compliant
} as const;

/**
 * Derive compliance status from a numeric score (0-100).
 */
export function getComplianceStatusFromScore(score: number): ComplianceStatus {
  if (score >= COMPLIANCE_THRESHOLDS.EXCELLENT) return COMPLIANCE_STATUS.EXCELLENT;
  if (score >= COMPLIANCE_THRESHOLDS.GOOD) return COMPLIANCE_STATUS.GOOD;
  if (score >= COMPLIANCE_THRESHOLDS.AT_RISK) return COMPLIANCE_STATUS.AT_RISK;
  return COMPLIANCE_STATUS.NON_COMPLIANT;
}

/**
 * Check if a string is a valid compliance status
 */
export function isComplianceStatus(value: string): value is ComplianceStatus {
  return (COMPLIANCE_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// COMPLIANCE METRICS
// ============================================================================

/**
 * Compliance metrics for a user over a specific period.
 * Tracks adherence to tier-specific requirements for workouts, diet logging, check-ins, and appointments.
 */
export const ComplianceMetricsSchema = z.object({
  patientId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  workoutAdherence: z.number(),
  dietLoggingStreak: z.number(),
  appointmentAttendanceRate: z.number(),
  overallScore: z.number(),
  avgWorkoutsPerWeek: z.number(),
  avgFoodLoggingDaysPerWeek: z.number(),
  avgEveningCheckinsPerWeek: z.number(),
  nutritionQualityScore: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ComplianceMetrics = z.infer<typeof ComplianceMetricsSchema>;

// ============================================================================
// TIER COMPLIANCE REQUIREMENTS
// ============================================================================

export const TierComplianceRequirementsSchema = z.object({
  checkinsPerWeek: z.number().min(0),
  foodLogsPerWeek: z.number().min(0),
  workoutsPerWeek: z.number().min(0),
});

export type TierComplianceRequirements = z.infer<typeof TierComplianceRequirementsSchema>;

/**
 * Tier-specific compliance requirements.
 */
export const TIER_COMPLIANCE_REQUIREMENTS: Record<UserTier, TierComplianceRequirements> = {
  ESSENTIALS: {
    checkinsPerWeek: 1,
    foodLogsPerWeek: 0,
    workoutsPerWeek: 1,
  },
  CORE: {
    checkinsPerWeek: 0.5,
    foodLogsPerWeek: 4,
    workoutsPerWeek: 2,
  },
  CONCIERGE: {
    checkinsPerWeek: 7,
    foodLogsPerWeek: 7,
    workoutsPerWeek: 4,
  },
} as const;

// ============================================================================
// COMPLIANCE BREAKDOWN
// ============================================================================

export const MetricAdherenceSchema = z.object({
  actual: z.number().min(0),
  expected: z.number().min(0),
  adherence: z.number().min(0).max(100),
});

export type MetricAdherence = z.infer<typeof MetricAdherenceSchema>;

export const ComplianceBreakdownSchema = z.object({
  checkins: MetricAdherenceSchema,
  foodLogs: MetricAdherenceSchema,
  workouts: MetricAdherenceSchema,
});

export type ComplianceBreakdown = z.infer<typeof ComplianceBreakdownSchema>;

// ============================================================================
// TIER-AWARE COMPLIANCE RESULT
// ============================================================================

export const TierAwareComplianceResultSchema = z.object({
  status: ComplianceStatusSchema,
  score: z.number().min(0).max(100),
  tier: UserTierSchema,
  breakdown: ComplianceBreakdownSchema,
  periodWeeks: z.number().int().min(1),
});

export type TierAwareComplianceResult = z.infer<typeof TierAwareComplianceResultSchema>;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

export function createMockMetricAdherence(overrides: Partial<MetricAdherence> = {}): MetricAdherence {
  return {
    actual: 5,
    expected: 7,
    adherence: 71,
    ...overrides,
  };
}

export function createMockComplianceBreakdown(
  overrides: Partial<ComplianceBreakdown> = {}
): ComplianceBreakdown {
  return {
    checkins: createMockMetricAdherence(),
    foodLogs: createMockMetricAdherence(),
    workouts: createMockMetricAdherence({ actual: 3, expected: 4, adherence: 75 }),
    ...overrides,
  };
}

export function createMockTierAwareComplianceResult(
  overrides: Partial<TierAwareComplianceResult> = {}
): TierAwareComplianceResult {
  return {
    status: COMPLIANCE_STATUS.GOOD,
    score: 72,
    tier: 'CORE',
    breakdown: createMockComplianceBreakdown(),
    periodWeeks: 4,
    ...overrides,
  };
}
