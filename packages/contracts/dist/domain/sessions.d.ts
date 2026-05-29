/**
 * @ai-context Sessions domain contracts | session types, reset frequencies, allocations
 *
 * Session types map to the services offered by Hollis Health:
 * - FITNESS_SESSION: 1:1 private coaching sessions
 * - RECOVERY_SESSION: Sauna, ice bath, red light therapy
 * - LABWORK: Blood panel (CMP + hormones)
 * - CLINICIAN_INITIAL: Initial consultation with PCP/RN
 * - CLINICIAN_FOLLOWUP: Regular PCP check-ins
 * - DXA_SCAN: Body composition DEXA scan
 * - SLEEP_SCREENING: Overnight O2/sleep health screening
 *
 * deps: zod, user.ts | consumers: all codebases
 */
import { z } from "zod";
import { type AppointmentType } from "./appointments.js";
import { type UserTier } from "./user.js";
/**
 * All bookable session types in the Hollis Health system
 */
export declare const SESSION_TYPES: readonly ["FITNESS_SESSION", "RECOVERY_SESSION", "LABWORK", "CLINICIAN_INITIAL", "CLINICIAN_FOLLOWUP", "DXA_SCAN", "SLEEP_SCREENING", "MOBILE_SESSION"];
export declare const SessionTypeSchema: z.ZodEnum<{
    RECOVERY_SESSION: "RECOVERY_SESSION";
    LABWORK: "LABWORK";
    DXA_SCAN: "DXA_SCAN";
    SLEEP_SCREENING: "SLEEP_SCREENING";
    FITNESS_SESSION: "FITNESS_SESSION";
    CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
    CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
    MOBILE_SESSION: "MOBILE_SESSION";
}>;
export type SessionType = z.infer<typeof SessionTypeSchema>;
/** Centralized session type constants for equality checks */
export declare const SESSION_TYPE: {
    readonly FITNESS_SESSION: "FITNESS_SESSION";
    readonly RECOVERY_SESSION: "RECOVERY_SESSION";
    readonly LABWORK: "LABWORK";
    readonly CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
    readonly CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
    readonly DXA_SCAN: "DXA_SCAN";
    readonly SLEEP_SCREENING: "SLEEP_SCREENING";
    readonly MOBILE_SESSION: "MOBILE_SESSION";
};
/** Human-readable labels for session types */
export declare const SESSION_TYPE_LABELS: Record<SessionType, string>;
/**
 * Check if a string is a valid session type
 */
export declare function isSessionType(value: string): value is SessionType;
/**
 * Reset frequency for session allocations
 * MONTHLY: Resets on billing date each month
 * QUARTERLY: Resets every 3 months from billing date
 * BIANNUAL: Resets every 6 months from billing date
 * ANNUAL: Resets once per year from billing date
 */
export declare const RESET_FREQUENCIES: readonly ["MONTHLY", "QUARTERLY", "BIANNUAL", "ANNUAL"];
export declare const ResetFrequencySchema: z.ZodEnum<{
    MONTHLY: "MONTHLY";
    QUARTERLY: "QUARTERLY";
    BIANNUAL: "BIANNUAL";
    ANNUAL: "ANNUAL";
}>;
export type ResetFrequency = z.infer<typeof ResetFrequencySchema>;
/** Centralized reset frequency constants for equality checks */
export declare const RESET_FREQUENCY: {
    readonly MONTHLY: "MONTHLY";
    readonly QUARTERLY: "QUARTERLY";
    readonly BIANNUAL: "BIANNUAL";
    readonly ANNUAL: "ANNUAL";
};
/** Human-readable labels for reset frequencies */
export declare const RESET_FREQUENCY_LABELS: Record<ResetFrequency, string>;
export declare const SessionBalanceItemSchema: z.ZodObject<{
    sessionType: z.ZodEnum<{
        RECOVERY_SESSION: "RECOVERY_SESSION";
        LABWORK: "LABWORK";
        DXA_SCAN: "DXA_SCAN";
        SLEEP_SCREENING: "SLEEP_SCREENING";
        FITNESS_SESSION: "FITNESS_SESSION";
        CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
        CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
        MOBILE_SESSION: "MOBILE_SESSION";
    }>;
    allocated: z.ZodNumber;
    rolledOver: z.ZodNumber;
    used: z.ZodNumber;
    remaining: z.ZodNumber;
    adjustments: z.ZodNumber;
    resetFrequency: z.ZodEnum<{
        MONTHLY: "MONTHLY";
        QUARTERLY: "QUARTERLY";
        BIANNUAL: "BIANNUAL";
        ANNUAL: "ANNUAL";
    }>;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    nextResetDate: z.ZodString;
}, z.core.$strip>;
export type SessionBalanceItemContract = z.infer<typeof SessionBalanceItemSchema>;
export declare const UserSessionBalanceSchema: z.ZodObject<{
    userId: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    billingAnchorDate: z.ZodString;
    balances: z.ZodArray<z.ZodObject<{
        sessionType: z.ZodEnum<{
            RECOVERY_SESSION: "RECOVERY_SESSION";
            LABWORK: "LABWORK";
            DXA_SCAN: "DXA_SCAN";
            SLEEP_SCREENING: "SLEEP_SCREENING";
            FITNESS_SESSION: "FITNESS_SESSION";
            CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
            CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
            MOBILE_SESSION: "MOBILE_SESSION";
        }>;
        allocated: z.ZodNumber;
        rolledOver: z.ZodNumber;
        used: z.ZodNumber;
        remaining: z.ZodNumber;
        adjustments: z.ZodNumber;
        resetFrequency: z.ZodEnum<{
            MONTHLY: "MONTHLY";
            QUARTERLY: "QUARTERLY";
            BIANNUAL: "BIANNUAL";
            ANNUAL: "ANNUAL";
        }>;
        periodStart: z.ZodString;
        periodEnd: z.ZodString;
        nextResetDate: z.ZodString;
    }, z.core.$strip>>;
    lastUpdated: z.ZodString;
}, z.core.$strip>;
export type UserSessionBalanceContract = z.infer<typeof UserSessionBalanceSchema>;
export declare const SessionAllocationSchema: z.ZodObject<{
    sessionType: z.ZodEnum<{
        RECOVERY_SESSION: "RECOVERY_SESSION";
        LABWORK: "LABWORK";
        DXA_SCAN: "DXA_SCAN";
        SLEEP_SCREENING: "SLEEP_SCREENING";
        FITNESS_SESSION: "FITNESS_SESSION";
        CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
        CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
        MOBILE_SESSION: "MOBILE_SESSION";
    }>;
    quantity: z.ZodNumber;
    resetFrequency: z.ZodEnum<{
        MONTHLY: "MONTHLY";
        QUARTERLY: "QUARTERLY";
        BIANNUAL: "BIANNUAL";
        ANNUAL: "ANNUAL";
    }>;
}, z.core.$strip>;
export type SessionAllocationContract = z.infer<typeof SessionAllocationSchema>;
export declare const TierSessionAllocationsSchema: z.ZodObject<{
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    allocations: z.ZodArray<z.ZodObject<{
        sessionType: z.ZodEnum<{
            RECOVERY_SESSION: "RECOVERY_SESSION";
            LABWORK: "LABWORK";
            DXA_SCAN: "DXA_SCAN";
            SLEEP_SCREENING: "SLEEP_SCREENING";
            FITNESS_SESSION: "FITNESS_SESSION";
            CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
            CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
            MOBILE_SESSION: "MOBILE_SESSION";
        }>;
        quantity: z.ZodNumber;
        resetFrequency: z.ZodEnum<{
            MONTHLY: "MONTHLY";
            QUARTERLY: "QUARTERLY";
            BIANNUAL: "BIANNUAL";
            ANNUAL: "ANNUAL";
        }>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type TierSessionAllocationsContract = z.infer<typeof TierSessionAllocationsSchema>;
/**
 * Mobile session free allocation for CONCIERGE tier.
 * CONCIERGE members receive this many free mobile sessions per billing cycle.
 */
export declare const FREE_MONTHLY_ALLOCATION = 2;
/**
 * Maximum rollover cap for free mobile sessions (CONCIERGE tier).
 * Free sessions cannot exceed this amount, even with rollover.
 */
export declare const FREE_MAX_ROLLOVER = 4;
/**
 * Default tier allocations based on Hollis Health membership structure
 *
 * ESSENTIALS ($749/mo):
 * - 8x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 2x Labwork/year (biannual)
 * - 1x Initial Clinician Consult (annual)
 * - 1x Clinician Followup/year
 * - 1x DXA Scan/year
 * - 2x Sleep Screenings/year (biannual)
 *
 * CORE ($1349/mo):
 * - 16x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 4x Labwork/year (quarterly)
 * - 1x Initial Clinician Consult (annual)
 * - 2x Clinician Followups/year (biannual)
 * - 2x DXA Scans/year (biannual)
 * - 2x Sleep Screenings/month
 *
 * CONCIERGE ($1949/mo):
 * - 24x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 12x Labwork/year (monthly)
 * - 1x Initial Clinician Consult (annual)
 * - 12x Clinician Followups/year (monthly)
 * - 4x DXA Scans/year (quarterly)
 * - 4x Sleep Screenings/month (weekly)
 */
export declare const DEFAULT_TIER_ALLOCATIONS: Record<UserTier, SessionAllocationContract[]>;
/**
 * Sources for session usage records.
 * Tracks how sessions were consumed or credited.
 */
export declare const SESSION_USAGE_SOURCES: readonly ["BOOKING", "ADMIN_DEDUCT", "ADMIN_CREDIT", "BILLING_RESET"];
export declare const SessionUsageSourceSchema: z.ZodEnum<{
    BOOKING: "BOOKING";
    ADMIN_DEDUCT: "ADMIN_DEDUCT";
    ADMIN_CREDIT: "ADMIN_CREDIT";
    BILLING_RESET: "BILLING_RESET";
}>;
export type SessionUsageSource = z.infer<typeof SessionUsageSourceSchema>;
/** Centralized session usage source constants for equality checks */
export declare const SESSION_USAGE_SOURCE: {
    readonly BOOKING: SessionUsageSource;
    readonly ADMIN_DEDUCT: SessionUsageSource;
    readonly ADMIN_CREDIT: SessionUsageSource;
    readonly BILLING_RESET: SessionUsageSource;
};
/** Human-readable labels for session usage sources */
export declare const SESSION_USAGE_SOURCE_LABELS: Record<SessionUsageSource, string>;
/**
 * Check if a string is a valid session usage source
 */
export declare function isSessionUsageSource(value: string): value is SessionUsageSource;
/**
 * Domain error codes for session operations.
 * These codes are surfaced to clients for deterministic handling.
 */
export declare const SESSION_ERROR_CODES: readonly ["INVALID_SESSION_TYPE", "NO_SESSIONS_REMAINING", "CANNOT_ADJUST_UNLIMITED", "USER_NOT_FOUND", "SAME_TIER", "MEMBERSHIP_PAUSED", "ACCOUNT_INACTIVE", "ACCOUNT_SUSPENDED", "ORGANIZATION_SUSPENDED", "ORGANIZATION_ARCHIVED", "SUBSCRIPTION_NOT_ACTIVE", "NO_ACTIVE_SUBSCRIPTION"];
export declare const sessionErrorCodeSchema: z.ZodEnum<{
    INVALID_SESSION_TYPE: "INVALID_SESSION_TYPE";
    NO_SESSIONS_REMAINING: "NO_SESSIONS_REMAINING";
    CANNOT_ADJUST_UNLIMITED: "CANNOT_ADJUST_UNLIMITED";
    USER_NOT_FOUND: "USER_NOT_FOUND";
    SAME_TIER: "SAME_TIER";
    MEMBERSHIP_PAUSED: "MEMBERSHIP_PAUSED";
    ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE";
    ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED";
    ORGANIZATION_SUSPENDED: "ORGANIZATION_SUSPENDED";
    ORGANIZATION_ARCHIVED: "ORGANIZATION_ARCHIVED";
    SUBSCRIPTION_NOT_ACTIVE: "SUBSCRIPTION_NOT_ACTIVE";
    NO_ACTIVE_SUBSCRIPTION: "NO_ACTIVE_SUBSCRIPTION";
}>;
export type SessionErrorCode = z.infer<typeof sessionErrorCodeSchema>;
export declare const SESSION_ERROR_CODE: {
    readonly INVALID_SESSION_TYPE: SessionErrorCode;
    readonly NO_SESSIONS_REMAINING: SessionErrorCode;
    readonly CANNOT_ADJUST_UNLIMITED: SessionErrorCode;
    readonly USER_NOT_FOUND: SessionErrorCode;
    readonly SAME_TIER: SessionErrorCode;
    readonly MEMBERSHIP_PAUSED: SessionErrorCode;
    readonly ACCOUNT_INACTIVE: SessionErrorCode;
    readonly ACCOUNT_SUSPENDED: SessionErrorCode;
    readonly ORGANIZATION_SUSPENDED: SessionErrorCode;
    readonly ORGANIZATION_ARCHIVED: SessionErrorCode;
    readonly SUBSCRIPTION_NOT_ACTIVE: SessionErrorCode;
    readonly NO_ACTIVE_SUBSCRIPTION: SessionErrorCode;
};
/** Human-friendly labels for displaying session errors */
export declare const SESSION_ERROR_LABELS: Record<SessionErrorCode, string>;
/**
 * Map AppointmentType to SessionType for booking integration.
 * Type-safe mapping ensures compile-time errors if new appointment types are added
 * without updating this map.
 *
 * NOTE: ONBOARDING maps to null because onboarding doesn't consume session credits.
 */
export declare const APPOINTMENT_TO_SESSION_MAP: Record<AppointmentType, SessionType | null>;
export declare const SessionUsageSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    sessionType: z.ZodEnum<{
        RECOVERY_SESSION: "RECOVERY_SESSION";
        LABWORK: "LABWORK";
        DXA_SCAN: "DXA_SCAN";
        SLEEP_SCREENING: "SLEEP_SCREENING";
        FITNESS_SESSION: "FITNESS_SESSION";
        CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
        CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
        MOBILE_SESSION: "MOBILE_SESSION";
    }>;
    appointmentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    usedAt: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    source: z.ZodEnum<{
        BOOKING: "BOOKING";
        ADMIN_DEDUCT: "ADMIN_DEDUCT";
        ADMIN_CREDIT: "ADMIN_CREDIT";
        BILLING_RESET: "BILLING_RESET";
    }>;
    quantity: z.ZodNumber;
    balanceAfter: z.ZodNumber;
    periodStart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    periodEnd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type SessionUsageContract = z.infer<typeof SessionUsageSchema>;
export declare const SessionAdjustmentPayloadSchema: z.ZodObject<{
    sessionType: z.ZodEnum<{
        RECOVERY_SESSION: "RECOVERY_SESSION";
        LABWORK: "LABWORK";
        DXA_SCAN: "DXA_SCAN";
        SLEEP_SCREENING: "SLEEP_SCREENING";
        FITNESS_SESSION: "FITNESS_SESSION";
        CLINICIAN_INITIAL: "CLINICIAN_INITIAL";
        CLINICIAN_FOLLOWUP: "CLINICIAN_FOLLOWUP";
        MOBILE_SESSION: "MOBILE_SESSION";
    }>;
    adjustment: z.ZodNumber;
    reason: z.ZodString;
}, z.core.$strip>;
export type SessionAdjustmentPayload = z.infer<typeof SessionAdjustmentPayloadSchema>;
export declare const TierChangePayloadSchema: z.ZodObject<{
    newTier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    prorateSessions: z.ZodOptional<z.ZodBoolean>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TierChangePayload = z.infer<typeof TierChangePayloadSchema>;
export declare const BillingDateUpdatePayloadSchema: z.ZodObject<{
    newBillingAnchorDate: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BillingDateUpdatePayload = z.infer<typeof BillingDateUpdatePayloadSchema>;
export declare const sessionServiceErrorSchema: z.ZodObject<{
    code: z.ZodEnum<{
        INVALID_SESSION_TYPE: "INVALID_SESSION_TYPE";
        NO_SESSIONS_REMAINING: "NO_SESSIONS_REMAINING";
        CANNOT_ADJUST_UNLIMITED: "CANNOT_ADJUST_UNLIMITED";
        USER_NOT_FOUND: "USER_NOT_FOUND";
        SAME_TIER: "SAME_TIER";
        MEMBERSHIP_PAUSED: "MEMBERSHIP_PAUSED";
        ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE";
        ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED";
        ORGANIZATION_SUSPENDED: "ORGANIZATION_SUSPENDED";
        ORGANIZATION_ARCHIVED: "ORGANIZATION_ARCHIVED";
        SUBSCRIPTION_NOT_ACTIVE: "SUBSCRIPTION_NOT_ACTIVE";
        NO_ACTIVE_SUBSCRIPTION: "NO_ACTIVE_SUBSCRIPTION";
    }>;
    message: z.ZodString;
    statusCode: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type SessionServiceErrorContract = z.infer<typeof sessionServiceErrorSchema>;
export declare const createMockSessionError: (overrides?: Partial<SessionServiceErrorContract>) => SessionServiceErrorContract;
/**
 * Helper to check if a session type has sessions available
 */
export declare function hasSessionsAvailable(balance: SessionBalanceItemContract): boolean;
/**
 * Helper to return the effective remaining for a session type.
 *
 * NOTE: `balance.remaining` is computed server-side as:
 *   `Math.max(0, allocated + rolledOver - used + adjustments)`
 * Adjustments are already baked into `remaining`. Do NOT add them again.
 */
export declare function getEffectiveRemaining(balance: SessionBalanceItemContract): number;
/**
 * @deprecated Legacy session history response shape — use canonical paginated shape for new endpoints.
 * The canonical shape is { data: SessionUsageContract[], pagination: { total, limit, offset, hasMore } }.
 * Kept for backward compatibility with mobile clients < v4.0.
 * See: server/src/routes/sessions.ts GET /history endpoint.
 */
export interface LegacySessionHistoryResponse {
    usages: SessionUsageContract[];
    total: number;
    limit: number;
    offset: number;
}
//# sourceMappingURL=sessions.d.ts.map