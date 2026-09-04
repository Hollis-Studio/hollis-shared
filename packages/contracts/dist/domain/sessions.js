/**
 * @ai-context Sessions domain contracts | session types, reset frequencies, allocations
 *
 * Session types currently offered by Hollis Health:
 * - FITNESS_SESSION: 1:1 private coaching sessions
 * - RECOVERY_SESSION: Sauna, ice bath, red light therapy
 * - MOBILE_SESSION: Mobile/on-location sessions (CONCIERGE only)
 *
 * Retired session types (LABWORK, CLINICIAN_INITIAL, CLINICIAN_FOLLOWUP,
 * DXA_SCAN, SLEEP_SCREENING) remain in the enum because historical
 * SessionUsage / SessionBalance rows and Appointment records reference them.
 * They are NOT entitlements: Hollis removed medical services from the business
 * (2026-07-17 / 2026-08-19) and "does not bill for or sell medical services"
 * per the signed membership agreement, so they carry no allocation at any tier.
 *
 * deps: zod, user.ts | consumers: all codebases
 */
import { z } from "zod";
import { baseDocumentSchema, isoTimestampSchema } from "./common.js";
import { USER_TIERS } from "./user.js";
// ============================================================================
// SESSION TYPES
// ============================================================================
/**
 * All bookable session types in the Hollis Health system
 */
export const SESSION_TYPES = [
    "FITNESS_SESSION", // 1:1 Training sessions
    "RECOVERY_SESSION", // Sauna, Ice Bath, Red Light (unlimited in all tiers, but tracked)
    // RETIRED (no allocation at any tier) — retained for historical rows only.
    "LABWORK", // CMP + hormones blood panel
    "CLINICIAN_INITIAL", // Initial PCP/RN consultation
    "CLINICIAN_FOLLOWUP", // Regular PCP check-ins
    "DXA_SCAN", // Body composition DEXA scan
    "SLEEP_SCREENING", // Overnight O2/sleep health screening
    "MOBILE_SESSION", // Mobile/on-location sessions (CONCIERGE only)
];
export const SessionTypeSchema = z.enum(SESSION_TYPES);
/** Centralized session type constants for equality checks */
export const SESSION_TYPE = {
    FITNESS_SESSION: "FITNESS_SESSION",
    RECOVERY_SESSION: "RECOVERY_SESSION",
    LABWORK: "LABWORK",
    CLINICIAN_INITIAL: "CLINICIAN_INITIAL",
    CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP",
    DXA_SCAN: "DXA_SCAN",
    SLEEP_SCREENING: "SLEEP_SCREENING",
    MOBILE_SESSION: "MOBILE_SESSION",
};
/** Human-readable labels for session types */
export const SESSION_TYPE_LABELS = {
    FITNESS_SESSION: "Fitness Session",
    RECOVERY_SESSION: "Recovery Session",
    LABWORK: "Lab Work",
    CLINICIAN_INITIAL: "Initial Consultation",
    CLINICIAN_FOLLOWUP: "Follow-up Check-in",
    DXA_SCAN: "DXA Scan",
    SLEEP_SCREENING: "Sleep Screening",
    MOBILE_SESSION: "Mobile Session",
};
/**
 * Check if a string is a valid session type
 */
export function isSessionType(value) {
    return SESSION_TYPES.includes(value);
}
// ============================================================================
// RESET FREQUENCIES
// ============================================================================
/**
 * Reset frequency for session allocations
 * MONTHLY: Resets on billing date each month
 * QUARTERLY: Resets every 3 months from billing date
 * BIANNUAL: Resets every 6 months from billing date
 * ANNUAL: Resets once per year from billing date
 */
export const RESET_FREQUENCIES = [
    "MONTHLY",
    "QUARTERLY",
    "BIANNUAL",
    "ANNUAL",
];
export const ResetFrequencySchema = z.enum(RESET_FREQUENCIES);
/** Centralized reset frequency constants for equality checks */
export const RESET_FREQUENCY = {
    MONTHLY: "MONTHLY",
    QUARTERLY: "QUARTERLY",
    BIANNUAL: "BIANNUAL",
    ANNUAL: "ANNUAL",
};
/** Human-readable labels for reset frequencies */
export const RESET_FREQUENCY_LABELS = {
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    BIANNUAL: "Biannual",
    ANNUAL: "Annual",
};
// ============================================================================
// SESSION BALANCE
// ============================================================================
// zod-manual: type exported as SessionBalanceItemContract
export const SessionBalanceItemSchema = z.object({
    sessionType: SessionTypeSchema,
    allocated: z.number().int().min(-1),
    rolledOver: z.number().int().min(0),
    used: z.number().int().min(0),
    remaining: z.number().int().min(-1),
    adjustments: z.number().int(),
    resetFrequency: ResetFrequencySchema,
    periodStart: z.string(),
    periodEnd: z.string(),
    nextResetDate: z.string(),
});
// ============================================================================
// USER SESSION BALANCE
// ============================================================================
// zod-manual: type exported as UserSessionBalanceContract
export const UserSessionBalanceSchema = z.object({
    userId: z.string(),
    tier: z.enum(USER_TIERS),
    billingAnchorDate: z.string(),
    balances: z.array(SessionBalanceItemSchema),
    /** @computed Set to SessionBalance.updatedAt at serialization time. */
    lastUpdated: z.string(),
});
// ============================================================================
// SESSION ALLOCATIONS
// ============================================================================
export const SessionAllocationSchema = z.object({
    sessionType: SessionTypeSchema,
    quantity: z.number().int().min(-1), // -1 = unlimited
    resetFrequency: ResetFrequencySchema,
});
// zod-manual: type exported as TierSessionAllocationsContract
export const TierSessionAllocationsSchema = z.object({
    tier: z.enum(USER_TIERS),
    allocations: z.array(SessionAllocationSchema),
});
/**
 * Mobile session free allocation for CONCIERGE tier.
 * CONCIERGE members receive this many free mobile sessions per billing cycle.
 */
export const FREE_MONTHLY_ALLOCATION = 2;
/**
 * Maximum rollover cap for free mobile sessions (CONCIERGE tier).
 * Free sessions cannot exceed this amount, even with rollover.
 */
export const FREE_MAX_ROLLOVER = 4;
/**
 * Default tier allocations based on Hollis Health membership structure.
 *
 * Hollis bills for coaching, recovery access and care coordination only. The
 * medical services that once carried credits here (LABWORK, CLINICIAN_INITIAL,
 * CLINICIAN_FOLLOWUP, DXA_SCAN, SLEEP_SCREENING) were removed from the business
 * on 2026-07-17 / 2026-08-19, and the signed membership agreement states Hollis
 * "does not bill for or sell medical services". Granting credits for them would
 * be an entitlement the company cannot and must not fulfil, so they are absent
 * from every tier. The SessionType enum values themselves are retained for
 * historical usage/balance rows.
 *
 * ESSENTIALS:
 * - 8x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 *
 * CORE:
 * - 16x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 *
 * CONCIERGE:
 * - 24x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 2x Mobile Sessions/mo
 */
export const DEFAULT_TIER_ALLOCATIONS = {
    ESSENTIALS: [
        {
            sessionType: SESSION_TYPE.FITNESS_SESSION,
            quantity: 8,
            resetFrequency: RESET_FREQUENCY.MONTHLY,
        },
        {
            sessionType: SESSION_TYPE.RECOVERY_SESSION,
            quantity: -1,
            resetFrequency: RESET_FREQUENCY.MONTHLY,
        }, // Unlimited
    ],
    CORE: [
        {
            sessionType: SESSION_TYPE.FITNESS_SESSION,
            quantity: 16,
            resetFrequency: RESET_FREQUENCY.MONTHLY,
        },
        {
            sessionType: SESSION_TYPE.RECOVERY_SESSION,
            quantity: -1,
            resetFrequency: RESET_FREQUENCY.MONTHLY,
        }, // Unlimited
    ],
    CONCIERGE: [
        {
            sessionType: SESSION_TYPE.FITNESS_SESSION,
            quantity: 24,
            resetFrequency: RESET_FREQUENCY.MONTHLY,
        },
        {
            sessionType: SESSION_TYPE.RECOVERY_SESSION,
            quantity: -1,
            resetFrequency: RESET_FREQUENCY.MONTHLY,
        }, // Unlimited
        {
            sessionType: SESSION_TYPE.MOBILE_SESSION,
            quantity: 2,
            resetFrequency: RESET_FREQUENCY.MONTHLY,
        },
    ],
};
/**
 * Session types that no longer carry any membership entitlement.
 *
 * Kept as data (not just prose) so callers seeding balances, rendering credit
 * UIs, or auditing allocations can filter deterministically instead of
 * re-deriving the list from `DEFAULT_TIER_ALLOCATIONS`.
 */
export const RETIRED_SESSION_TYPES = [
    SESSION_TYPE.LABWORK,
    SESSION_TYPE.CLINICIAN_INITIAL,
    SESSION_TYPE.CLINICIAN_FOLLOWUP,
    SESSION_TYPE.DXA_SCAN,
    SESSION_TYPE.SLEEP_SCREENING,
];
/** Whether a session type is retired (historical data only, never allocated). */
export function isRetiredSessionType(sessionType) {
    return RETIRED_SESSION_TYPES.includes(sessionType);
}
// ============================================================================
// SESSION USAGE SOURCES
// ============================================================================
/**
 * Sources for session usage records.
 * Tracks how sessions were consumed or credited.
 */
export const SESSION_USAGE_SOURCES = [
    "BOOKING",
    "ADMIN_DEDUCT",
    "ADMIN_CREDIT",
    "BILLING_RESET",
];
export const SessionUsageSourceSchema = z.enum(SESSION_USAGE_SOURCES);
/** Centralized session usage source constants for equality checks */
export const SESSION_USAGE_SOURCE = {
    BOOKING: "BOOKING",
    ADMIN_DEDUCT: "ADMIN_DEDUCT",
    ADMIN_CREDIT: "ADMIN_CREDIT",
    BILLING_RESET: "BILLING_RESET",
};
/** Human-readable labels for session usage sources */
export const SESSION_USAGE_SOURCE_LABELS = {
    BOOKING: "Appointment Booking",
    ADMIN_DEDUCT: "Admin Deduction",
    ADMIN_CREDIT: "Admin Credit",
    BILLING_RESET: "Billing Reset",
};
/**
 * Check if a string is a valid session usage source
 */
export function isSessionUsageSource(value) {
    return SESSION_USAGE_SOURCES.includes(value);
}
// ============================================================================
// ERROR CODES (shared across mobile, web-admin, backend)
// ============================================================================
/**
 * Domain error codes for session operations.
 * These codes are surfaced to clients for deterministic handling.
 */
export const SESSION_ERROR_CODES = [
    "INVALID_SESSION_TYPE",
    "NO_SESSIONS_REMAINING",
    "CANNOT_ADJUST_UNLIMITED",
    "USER_NOT_FOUND",
    "SAME_TIER",
    "MEMBERSHIP_PAUSED",
    // Access control error codes (billing/account status)
    "ACCOUNT_INACTIVE",
    "ACCOUNT_SUSPENDED",
    "ORGANIZATION_SUSPENDED",
    "ORGANIZATION_ARCHIVED",
    "SUBSCRIPTION_NOT_ACTIVE",
    "NO_ACTIVE_SUBSCRIPTION",
];
export const sessionErrorCodeSchema = z.enum(SESSION_ERROR_CODES);
export const SESSION_ERROR_CODE = {
    INVALID_SESSION_TYPE: "INVALID_SESSION_TYPE",
    NO_SESSIONS_REMAINING: "NO_SESSIONS_REMAINING",
    CANNOT_ADJUST_UNLIMITED: "CANNOT_ADJUST_UNLIMITED",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    SAME_TIER: "SAME_TIER",
    MEMBERSHIP_PAUSED: "MEMBERSHIP_PAUSED",
    // Access control error codes (billing/account status)
    ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE",
    ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
    ORGANIZATION_SUSPENDED: "ORGANIZATION_SUSPENDED",
    ORGANIZATION_ARCHIVED: "ORGANIZATION_ARCHIVED",
    SUBSCRIPTION_NOT_ACTIVE: "SUBSCRIPTION_NOT_ACTIVE",
    NO_ACTIVE_SUBSCRIPTION: "NO_ACTIVE_SUBSCRIPTION",
};
/** Human-friendly labels for displaying session errors */
export const SESSION_ERROR_LABELS = {
    INVALID_SESSION_TYPE: "Invalid session type",
    NO_SESSIONS_REMAINING: "No sessions remaining",
    CANNOT_ADJUST_UNLIMITED: "Cannot adjust unlimited session types",
    USER_NOT_FOUND: "User not found",
    SAME_TIER: "User is already on this tier",
    MEMBERSHIP_PAUSED: "Cannot use sessions while membership is paused",
    // Access control error labels
    ACCOUNT_INACTIVE: "Your account is inactive",
    ACCOUNT_SUSPENDED: "Your account is suspended due to a billing dispute",
    ORGANIZATION_SUSPENDED: "Your organization account is suspended",
    ORGANIZATION_ARCHIVED: "Your organization account is no longer active",
    SUBSCRIPTION_NOT_ACTIVE: "Your subscription is not active",
    NO_ACTIVE_SUBSCRIPTION: "No active subscription found",
};
// ============================================================================
// APPOINTMENT TO SESSION MAPPING
// ============================================================================
/**
 * Map AppointmentType to SessionType for booking integration.
 * Type-safe mapping ensures compile-time errors if new appointment types are added
 * without updating this map.
 *
 * NOTE: ONBOARDING maps to null because onboarding doesn't consume session credits.
 */
export const APPOINTMENT_TO_SESSION_MAP = {
    CHECK_IN: SESSION_TYPE.CLINICIAN_FOLLOWUP,
    CONSULTATION: SESSION_TYPE.CLINICIAN_INITIAL,
    TRAINING_SESSION: SESSION_TYPE.FITNESS_SESSION,
    ONBOARDING: null, // Onboarding doesn't consume sessions
    RECOVERY_SESSION: SESSION_TYPE.RECOVERY_SESSION,
    LABWORK: SESSION_TYPE.LABWORK,
    DXA_SCAN: SESSION_TYPE.DXA_SCAN,
    SLEEP_SCREENING: SESSION_TYPE.SLEEP_SCREENING,
};
// ============================================================================
// SESSION USAGE
// ============================================================================
export const SessionUsageSchema = baseDocumentSchema.extend({
    id: z.string().optional(),
    userId: z.string(),
    sessionType: SessionTypeSchema,
    appointmentId: z.string().nullable().optional(),
    usedAt: isoTimestampSchema,
    notes: z.string().nullable().optional(),
    source: SessionUsageSourceSchema,
    quantity: z.number().int(),
    /** Session balance after this usage. DB default 0. */
    balanceAfter: z.number().int(),
    /** Billing period start for this usage record (from sessionBalance at time of usage) */
    periodStart: isoTimestampSchema.nullable().optional(),
    /** Billing period end for this usage record (from sessionBalance at time of usage) */
    periodEnd: isoTimestampSchema.nullable().optional(),
});
// ============================================================================
// SESSION ADJUSTMENT
// ============================================================================
export const SessionAdjustmentPayloadSchema = z.object({
    sessionType: SessionTypeSchema,
    adjustment: z
        .number()
        .int()
        .refine((val) => val !== 0, {
        message: "Adjustment must be a non-zero number",
    }),
    reason: z.string().min(1),
});
// ============================================================================
// TIER CHANGE
// ============================================================================
export const TierChangePayloadSchema = z.object({
    newTier: z.enum(USER_TIERS),
    effectiveDate: z.string().optional(),
    prorateSessions: z.boolean().optional(),
    reason: z.string().optional(),
});
// ============================================================================
// BILLING DATE UPDATE
// ============================================================================
export const BillingDateUpdatePayloadSchema = z.object({
    newBillingAnchorDate: z.string(),
    reason: z.string().optional(),
});
// ============================================================================
// SESSION SERVICE ERROR
// ============================================================================
// zod-manual: type exported as SessionServiceErrorContract
export const sessionServiceErrorSchema = z.object({
    code: sessionErrorCodeSchema,
    message: z.string(),
    statusCode: z.number().int().positive().optional(),
});
export const createMockSessionError = (overrides = {}) => ({
    code: overrides.code ?? SESSION_ERROR_CODE.INVALID_SESSION_TYPE,
    message: overrides.message ?? SESSION_ERROR_LABELS.INVALID_SESSION_TYPE,
    statusCode: overrides.statusCode ?? 400,
});
// ============================================================================
// SESSION HELPERS
// ============================================================================
/**
 * Helper to check if a session type has sessions available
 */
export function hasSessionsAvailable(balance) {
    if (balance.allocated === -1)
        return true; // Unlimited
    return balance.remaining > 0;
}
/**
 * Helper to return the effective remaining for a session type.
 *
 * NOTE: `balance.remaining` is computed server-side as:
 *   `Math.max(0, allocated + rolledOver - used + adjustments)`
 * Adjustments are already baked into `remaining`. Do NOT add them again.
 */
export function getEffectiveRemaining(balance) {
    if (balance.allocated === -1)
        return -1; // Unlimited
    return Math.max(0, balance.remaining);
}
//# sourceMappingURL=sessions.js.map