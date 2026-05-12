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
import { z } from "zod";
import type { UserTier } from "./user.js";
/**
 * Granular compliance status levels (replaces binary "compliant/non-compliant").
 * - excellent (≥90%): Client is crushing it, fully engaged
 * - good (≥70%): On track, meeting most expectations
 * - at-risk (≥50%): Needs proactive outreach before they disengage
 * - non-compliant (<50%): Intervention needed, significant churn risk
 */
export declare const COMPLIANCE_STATUSES: readonly ["excellent", "good", "at-risk", "non-compliant"];
export type ComplianceStatus = z.infer<typeof ComplianceStatusSchema>;
export declare const ComplianceStatusSchema: z.ZodEnum<{
    excellent: "excellent";
    good: "good";
    "at-risk": "at-risk";
    "non-compliant": "non-compliant";
}>;
/** Centralized compliance status constants for equality checks */
export declare const COMPLIANCE_STATUS: {
    readonly EXCELLENT: ComplianceStatus;
    readonly GOOD: ComplianceStatus;
    readonly AT_RISK: ComplianceStatus;
    readonly NON_COMPLIANT: ComplianceStatus;
};
/** Human-readable labels for compliance statuses */
export declare const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string>;
/** Score thresholds for each compliance status */
export declare const COMPLIANCE_THRESHOLDS: {
    readonly EXCELLENT: 90;
    readonly GOOD: 70;
    readonly AT_RISK: 50;
};
/**
 * Derive compliance status from a numeric score (0-100).
 */
export declare function getComplianceStatusFromScore(score: number): ComplianceStatus;
/**
 * Check if a string is a valid compliance status
 */
export declare function isComplianceStatus(value: string): value is ComplianceStatus;
/**
 * Compliance metrics for a user over a specific period.
 * Tracks adherence to tier-specific requirements for workouts, diet logging, check-ins, and appointments.
 */
export declare const ComplianceMetricsSchema: z.ZodObject<{
    patientId: z.ZodString;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    workoutAdherence: z.ZodNumber;
    dietLoggingStreak: z.ZodNumber;
    appointmentAttendanceRate: z.ZodNumber;
    overallScore: z.ZodNumber;
    avgWorkoutsPerWeek: z.ZodNumber;
    avgFoodLoggingDaysPerWeek: z.ZodNumber;
    avgEveningCheckinsPerWeek: z.ZodNumber;
    nutritionQualityScore: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type ComplianceMetrics = z.infer<typeof ComplianceMetricsSchema>;
export declare const TierComplianceRequirementsSchema: z.ZodObject<{
    checkinsPerWeek: z.ZodNumber;
    foodLogsPerWeek: z.ZodNumber;
    workoutsPerWeek: z.ZodNumber;
}, z.core.$strip>;
export type TierComplianceRequirements = z.infer<typeof TierComplianceRequirementsSchema>;
/**
 * Tier-specific compliance requirements (weekly cadence).
 * Used by calculateTierAwareCompliance and the canonical compliance engine.
 *
 * ESSENTIALS: minimal tracking expectations — 1 check-in/wk, no food logging required, 1 workout/wk
 * CORE:       moderate engagement — bi-weekly check-ins, 4 food logs/wk, 2 workouts/wk
 * CONCIERGE:  full engagement — daily check-ins, daily food logs, 4 workouts/wk
 */
export declare const TIER_COMPLIANCE_REQUIREMENTS: Record<UserTier, TierComplianceRequirements>;
/**
 * Canonical compliance weights used by computeComplianceScore().
 * All four dimensions must sum to 1.0.
 *
 * Rationale for values:
 * - Workouts (0.35): Core service deliverable — most predictive of health outcomes
 * - Food/nutrition logging (0.35): Nutrition adherence is equally critical
 * - Check-ins / appointments (0.20): Engagement signal; penalizes no-shows without over-weighting
 * - Wearable sync (0.10): Useful signal but not everyone has a device; lowest weight
 */
export declare const CANONICAL_COMPLIANCE_WEIGHTS: {
    readonly checkins: 0.2;
    readonly foodLogs: 0.35;
    readonly workouts: 0.35;
    readonly wearableSync: 0.1;
};
/**
 * Tier-specific denominators for the canonical compliance engine.
 * All values represent expected counts over a 30-day window.
 *
 * Wearable sync values represent expected days with synced biometric data:
 * - ESSENTIALS: sync at least half the days (low-commitment tier)
 * - CORE:       sync most days (~2/3 of days)
 * - CONCIERGE:  near-continuous sync (expected ~daily)
 *
 * Workout/checkin/foodLog counts are derived from TIER_COMPLIANCE_REQUIREMENTS × 4 weeks.
 */
export declare const TIER_COMPLIANCE_THRESHOLDS: Record<UserTier, {
    checkinsPerMonth: number;
    foodLogsPerMonth: number;
    workoutsPerMonth: number;
    wearableDaysPerMonth: number;
}>;
/**
 * Input shape for the canonical compliance engine.
 * All counts represent actual activity over the scoring period (default: 30 days / 4 weeks).
 * wearableSyncDays is optional — callers that don't have wearable data omit it (treated as 0).
 */
export declare const ComplianceEngineInputSchema: z.ZodObject<{
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    checkinsCount: z.ZodNumber;
    foodLogsCount: z.ZodNumber;
    workoutsCompleted: z.ZodNumber;
    wearableSyncDays: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    periodWeeks: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type ComplianceEngineInput = z.infer<typeof ComplianceEngineInputSchema>;
/**
 * Result shape returned by the canonical compliance engine.
 * Backward-compatible with TierAwareComplianceResult (score, status, tier, breakdown, periodWeeks)
 * plus the new wearableSync dimension.
 */
export declare const ComplianceEngineResultSchema: z.ZodObject<{
    score: z.ZodNumber;
    status: z.ZodEnum<{
        excellent: "excellent";
        good: "good";
        "at-risk": "at-risk";
        "non-compliant": "non-compliant";
    }>;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    periodWeeks: z.ZodNumber;
    breakdown: z.ZodObject<{
        checkins: z.ZodObject<{
            actual: z.ZodNumber;
            expected: z.ZodNumber;
            adherence: z.ZodNumber;
        }, z.core.$strip>;
        foodLogs: z.ZodObject<{
            actual: z.ZodNumber;
            expected: z.ZodNumber;
            adherence: z.ZodNumber;
        }, z.core.$strip>;
        workouts: z.ZodObject<{
            actual: z.ZodNumber;
            expected: z.ZodNumber;
            adherence: z.ZodNumber;
        }, z.core.$strip>;
        wearableSync: z.ZodObject<{
            actual: z.ZodNumber;
            expected: z.ZodNumber;
            adherence: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ComplianceEngineResult = z.infer<typeof ComplianceEngineResultSchema>;
export declare const MetricAdherenceSchema: z.ZodObject<{
    actual: z.ZodNumber;
    expected: z.ZodNumber;
    adherence: z.ZodNumber;
}, z.core.$strip>;
export type MetricAdherence = z.infer<typeof MetricAdherenceSchema>;
export declare const ComplianceBreakdownSchema: z.ZodObject<{
    checkins: z.ZodObject<{
        actual: z.ZodNumber;
        expected: z.ZodNumber;
        adherence: z.ZodNumber;
    }, z.core.$strip>;
    foodLogs: z.ZodObject<{
        actual: z.ZodNumber;
        expected: z.ZodNumber;
        adherence: z.ZodNumber;
    }, z.core.$strip>;
    workouts: z.ZodObject<{
        actual: z.ZodNumber;
        expected: z.ZodNumber;
        adherence: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ComplianceBreakdown = z.infer<typeof ComplianceBreakdownSchema>;
export declare const TierAwareComplianceResultSchema: z.ZodObject<{
    status: z.ZodEnum<{
        excellent: "excellent";
        good: "good";
        "at-risk": "at-risk";
        "non-compliant": "non-compliant";
    }>;
    score: z.ZodNumber;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    breakdown: z.ZodObject<{
        checkins: z.ZodObject<{
            actual: z.ZodNumber;
            expected: z.ZodNumber;
            adherence: z.ZodNumber;
        }, z.core.$strip>;
        foodLogs: z.ZodObject<{
            actual: z.ZodNumber;
            expected: z.ZodNumber;
            adherence: z.ZodNumber;
        }, z.core.$strip>;
        workouts: z.ZodObject<{
            actual: z.ZodNumber;
            expected: z.ZodNumber;
            adherence: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    periodWeeks: z.ZodNumber;
}, z.core.$strip>;
export type TierAwareComplianceResult = z.infer<typeof TierAwareComplianceResultSchema>;
export declare function createMockMetricAdherence(overrides?: Partial<MetricAdherence>): MetricAdherence;
export declare function createMockComplianceBreakdown(overrides?: Partial<ComplianceBreakdown>): ComplianceBreakdown;
export declare function createMockTierAwareComplianceResult(overrides?: Partial<TierAwareComplianceResult>): TierAwareComplianceResult;
//# sourceMappingURL=compliance.d.ts.map