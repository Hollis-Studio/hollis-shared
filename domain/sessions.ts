/**
 * @ai-context Sessions domain contracts | session types, reset frequencies, allocations
 *
 * Session types map to the services offered by Hollis Health:
 * - FITNESS_SESSION: 1:1 personal training sessions
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
import { type AppointmentType } from "./appointments";
import { baseDocumentSchema, isoTimestampSchema } from "./common";
import { USER_TIERS, type UserTier } from "./user";

// ============================================================================
// SESSION TYPES
// ============================================================================

/**
 * All bookable session types in the Hollis Health system
 */
export const SESSION_TYPES = [
  "FITNESS_SESSION", // 1:1 Training sessions
  "RECOVERY_SESSION", // Sauna, Ice Bath, Red Light (unlimited in all tiers, but tracked)
  "LABWORK", // CMP + hormones blood panel
  "CLINICIAN_INITIAL", // Initial PCP/RN consultation
  "CLINICIAN_FOLLOWUP", // Regular PCP check-ins
  "DXA_SCAN", // Body composition DEXA scan
  "SLEEP_SCREENING", // Overnight O2/sleep health screening
  "MOBILE_SESSION", // Mobile/on-location sessions (CONCIERGE only)
] as const;

export const SessionTypeSchema = z.enum(SESSION_TYPES);
export type SessionType = z.infer<typeof SessionTypeSchema>;

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
} as const satisfies Record<SessionType, SessionType>;

/** Human-readable labels for session types */
export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
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
export function isSessionType(value: string): value is SessionType {
  return (SESSION_TYPES as readonly string[]).includes(value);
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
] as const;

export const ResetFrequencySchema = z.enum(RESET_FREQUENCIES);
export type ResetFrequency = z.infer<typeof ResetFrequencySchema>;

/** Centralized reset frequency constants for equality checks */
export const RESET_FREQUENCY = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  BIANNUAL: "BIANNUAL",
  ANNUAL: "ANNUAL",
} as const satisfies Record<ResetFrequency, ResetFrequency>;

/** Human-readable labels for reset frequencies */
export const RESET_FREQUENCY_LABELS: Record<ResetFrequency, string> = {
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

export type SessionBalanceItemContract = z.infer<
  typeof SessionBalanceItemSchema
>;

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

export type UserSessionBalanceContract = z.infer<
  typeof UserSessionBalanceSchema
>;

// ============================================================================
// SESSION ALLOCATIONS
// ============================================================================

export const SessionAllocationSchema = z.object({
  sessionType: SessionTypeSchema,
  quantity: z.number().int().min(-1), // -1 = unlimited
  resetFrequency: ResetFrequencySchema,
});

export type SessionAllocationContract = z.infer<typeof SessionAllocationSchema>;

// zod-manual: type exported as TierSessionAllocationsContract
export const TierSessionAllocationsSchema = z.object({
  tier: z.enum(USER_TIERS),
  allocations: z.array(SessionAllocationSchema),
});

export type TierSessionAllocationsContract = z.infer<
  typeof TierSessionAllocationsSchema
>;

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
 * Default tier allocations based on Hollis Health membership structure
 *
 * ESSENTIALS ($799/mo):
 * - 4x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 2x Labwork/year (biannual)
 * - 1x Initial Clinician Consult (annual)
 * - 1x Clinician Followup/year
 * - 2x DXA Scans/year (initial + 6mo)
 * - 2x Sleep Screenings/year (biannual)
 *
 * CORE ($1349/mo):
 * - 8x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 4x Labwork/year (quarterly)
 * - 1x Initial Clinician Consult (annual)
 * - 2x Clinician Followups/year (biannual)
 * - 4x DXA Scans/year (quarterly)
 * - 2x Sleep Screenings/month
 *
 * CONCIERGE ($1999/mo):
 * - 16x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 12x Labwork/year (monthly)
 * - 1x Initial Clinician Consult (annual)
 * - 12x Clinician Followups/year (monthly)
 * - 12x DXA Scans/year (monthly)
 * - 4x Sleep Screenings/month (weekly)
 */
export const DEFAULT_TIER_ALLOCATIONS: Record<
  UserTier,
  SessionAllocationContract[]
> = {
  ESSENTIALS: [
    {
      sessionType: SESSION_TYPE.FITNESS_SESSION,
      quantity: 4,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    },
    {
      sessionType: SESSION_TYPE.RECOVERY_SESSION,
      quantity: -1,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    }, // Unlimited
    {
      sessionType: SESSION_TYPE.LABWORK,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.BIANNUAL,
    },
    {
      sessionType: SESSION_TYPE.CLINICIAN_INITIAL,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.ANNUAL,
    },
    {
      sessionType: SESSION_TYPE.CLINICIAN_FOLLOWUP,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.ANNUAL,
    },
    {
      sessionType: SESSION_TYPE.DXA_SCAN,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.BIANNUAL,
    },
    {
      sessionType: SESSION_TYPE.SLEEP_SCREENING,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.BIANNUAL,
    },
  ],
  CORE: [
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
    {
      sessionType: SESSION_TYPE.LABWORK,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.QUARTERLY,
    },
    {
      sessionType: SESSION_TYPE.CLINICIAN_INITIAL,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.ANNUAL,
    },
    {
      sessionType: SESSION_TYPE.CLINICIAN_FOLLOWUP,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.BIANNUAL,
    },
    {
      sessionType: SESSION_TYPE.DXA_SCAN,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.QUARTERLY,
    },
    {
      sessionType: SESSION_TYPE.SLEEP_SCREENING,
      quantity: 2,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    },
  ],
  CONCIERGE: [
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
    {
      sessionType: SESSION_TYPE.LABWORK,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    },
    {
      sessionType: SESSION_TYPE.CLINICIAN_INITIAL,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.ANNUAL,
    },
    {
      sessionType: SESSION_TYPE.CLINICIAN_FOLLOWUP,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    },
    {
      sessionType: SESSION_TYPE.DXA_SCAN,
      quantity: 1,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    },
    {
      sessionType: SESSION_TYPE.SLEEP_SCREENING,
      quantity: 4,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    },
    {
      sessionType: SESSION_TYPE.MOBILE_SESSION,
      quantity: 2,
      resetFrequency: RESET_FREQUENCY.MONTHLY,
    },
  ],
};

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
] as const;

export const SessionUsageSourceSchema = z.enum(SESSION_USAGE_SOURCES);
export type SessionUsageSource = z.infer<typeof SessionUsageSourceSchema>;

/** Centralized session usage source constants for equality checks */
export const SESSION_USAGE_SOURCE = {
  BOOKING: "BOOKING" as SessionUsageSource,
  ADMIN_DEDUCT: "ADMIN_DEDUCT" as SessionUsageSource,
  ADMIN_CREDIT: "ADMIN_CREDIT" as SessionUsageSource,
  BILLING_RESET: "BILLING_RESET" as SessionUsageSource,
} as const;

/** Human-readable labels for session usage sources */
export const SESSION_USAGE_SOURCE_LABELS: Record<SessionUsageSource, string> = {
  BOOKING: "Appointment Booking",
  ADMIN_DEDUCT: "Admin Deduction",
  ADMIN_CREDIT: "Admin Credit",
  BILLING_RESET: "Billing Reset",
};

/**
 * Check if a string is a valid session usage source
 */
export function isSessionUsageSource(
  value: string,
): value is SessionUsageSource {
  return (SESSION_USAGE_SOURCES as readonly string[]).includes(value);
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
] as const;

export const sessionErrorCodeSchema = z.enum(SESSION_ERROR_CODES);
export type SessionErrorCode = z.infer<typeof sessionErrorCodeSchema>;

export const SESSION_ERROR_CODE = {
  INVALID_SESSION_TYPE: "INVALID_SESSION_TYPE" as SessionErrorCode,
  NO_SESSIONS_REMAINING: "NO_SESSIONS_REMAINING" as SessionErrorCode,
  CANNOT_ADJUST_UNLIMITED: "CANNOT_ADJUST_UNLIMITED" as SessionErrorCode,
  USER_NOT_FOUND: "USER_NOT_FOUND" as SessionErrorCode,
  SAME_TIER: "SAME_TIER" as SessionErrorCode,
  MEMBERSHIP_PAUSED: "MEMBERSHIP_PAUSED" as SessionErrorCode,
  // Access control error codes (billing/account status)
  ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE" as SessionErrorCode,
  ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED" as SessionErrorCode,
  ORGANIZATION_SUSPENDED: "ORGANIZATION_SUSPENDED" as SessionErrorCode,
  ORGANIZATION_ARCHIVED: "ORGANIZATION_ARCHIVED" as SessionErrorCode,
  SUBSCRIPTION_NOT_ACTIVE: "SUBSCRIPTION_NOT_ACTIVE" as SessionErrorCode,
  NO_ACTIVE_SUBSCRIPTION: "NO_ACTIVE_SUBSCRIPTION" as SessionErrorCode,
} as const;

/** Human-friendly labels for displaying session errors */
export const SESSION_ERROR_LABELS: Record<SessionErrorCode, string> = {
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
export const APPOINTMENT_TO_SESSION_MAP: Record<
  AppointmentType,
  SessionType | null
> = {
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

export type SessionUsageContract = z.infer<typeof SessionUsageSchema>;

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

export type SessionAdjustmentPayload = z.infer<
  typeof SessionAdjustmentPayloadSchema
>;

// ============================================================================
// TIER CHANGE
// ============================================================================

export const TierChangePayloadSchema = z.object({
  newTier: z.enum(USER_TIERS),
  effectiveDate: z.string().optional(),
  prorateSessions: z.boolean().optional(),
  reason: z.string().optional(),
});

export type TierChangePayload = z.infer<typeof TierChangePayloadSchema>;

// ============================================================================
// BILLING DATE UPDATE
// ============================================================================

export const BillingDateUpdatePayloadSchema = z.object({
  newBillingAnchorDate: z.string(),
  reason: z.string().optional(),
});

export type BillingDateUpdatePayload = z.infer<
  typeof BillingDateUpdatePayloadSchema
>;

// ============================================================================
// SESSION SERVICE ERROR
// ============================================================================

// zod-manual: type exported as SessionServiceErrorContract
export const sessionServiceErrorSchema = z.object({
  code: sessionErrorCodeSchema,
  message: z.string(),
  statusCode: z.number().int().positive().optional(),
});

export type SessionServiceErrorContract = z.infer<
  typeof sessionServiceErrorSchema
>;

export const createMockSessionError = (
  overrides: Partial<SessionServiceErrorContract> = {},
): SessionServiceErrorContract => ({
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
export function hasSessionsAvailable(
  balance: SessionBalanceItemContract,
): boolean {
  if (balance.allocated === -1) return true; // Unlimited
  return balance.remaining > 0;
}

/**
 * Helper to return the effective remaining for a session type.
 *
 * NOTE: `balance.remaining` is computed server-side as:
 *   `Math.max(0, allocated + rolledOver - used + adjustments)`
 * Adjustments are already baked into `remaining`. Do NOT add them again.
 */
export function getEffectiveRemaining(
  balance: SessionBalanceItemContract,
): number {
  if (balance.allocated === -1) return -1; // Unlimited
  return Math.max(0, balance.remaining);
}
