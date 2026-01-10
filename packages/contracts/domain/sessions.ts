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

import { z } from 'zod';
import { USER_TIERS, type UserTier } from './user';

// ============================================================================
// SESSION TYPES
// ============================================================================

/**
 * All bookable session types in the Hollis Health system
 */
export const SESSION_TYPES = [
  'FITNESS_SESSION',      // 1:1 Training sessions
  'RECOVERY_SESSION',     // Sauna, Ice Bath, Red Light (unlimited in all tiers, but tracked)
  'LABWORK',              // CMP + hormones blood panel
  'CLINICIAN_INITIAL',    // Initial PCP/RN consultation
  'CLINICIAN_FOLLOWUP',   // Regular PCP check-ins
  'DXA_SCAN',             // Body composition DEXA scan
  'SLEEP_SCREENING',      // Overnight O2/sleep health screening
] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export const SessionTypeSchema = z.enum(SESSION_TYPES);

/** Centralized session type constants for equality checks */
export const SESSION_TYPE = {
  FITNESS_SESSION: 'FITNESS_SESSION' as SessionType,
  RECOVERY_SESSION: 'RECOVERY_SESSION' as SessionType,
  LABWORK: 'LABWORK' as SessionType,
  CLINICIAN_INITIAL: 'CLINICIAN_INITIAL' as SessionType,
  CLINICIAN_FOLLOWUP: 'CLINICIAN_FOLLOWUP' as SessionType,
  DXA_SCAN: 'DXA_SCAN' as SessionType,
  SLEEP_SCREENING: 'SLEEP_SCREENING' as SessionType,
} as const;

/** Human-readable labels for session types */
export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  FITNESS_SESSION: 'Fitness Session',
  RECOVERY_SESSION: 'Recovery Session',
  LABWORK: 'Lab Work',
  CLINICIAN_INITIAL: 'Initial Consultation',
  CLINICIAN_FOLLOWUP: 'Follow-up Check-in',
  DXA_SCAN: 'DXA Scan',
  SLEEP_SCREENING: 'Sleep Screening',
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
  'MONTHLY',
  'QUARTERLY',
  'BIANNUAL',
  'ANNUAL',
] as const;

export type ResetFrequency = (typeof RESET_FREQUENCIES)[number];

export const ResetFrequencySchema = z.enum(RESET_FREQUENCIES);

/** Centralized reset frequency constants for equality checks */
export const RESET_FREQUENCY = {
  MONTHLY: 'MONTHLY' as ResetFrequency,
  QUARTERLY: 'QUARTERLY' as ResetFrequency,
  BIANNUAL: 'BIANNUAL' as ResetFrequency,
  ANNUAL: 'ANNUAL' as ResetFrequency,
} as const;

/** Human-readable labels for reset frequencies */
export const RESET_FREQUENCY_LABELS: Record<ResetFrequency, string> = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  BIANNUAL: 'Biannual',
  ANNUAL: 'Annual',
};

// ============================================================================
// SESSION BALANCE
// ============================================================================

/**
 * User's current session balance for a specific session type
 */
export interface SessionBalanceItemContract {
  sessionType: SessionType;
  allocated: number;        // Total allocated for this period (-1 for unlimited)
  used: number;             // Number used so far this period
  remaining: number;        // allocated - used (or -1 if unlimited)
  adjustments: number;      // Manual admin adjustments (+ or -)
  resetFrequency: ResetFrequency;
  periodStart: string;      // ISO date - start of current billing period for this session type
  periodEnd: string;        // ISO date - end of current billing period
  nextResetDate: string;    // ISO date - when this balance resets
}

export const SessionBalanceItemSchema: z.ZodType<SessionBalanceItemContract> = z.object({
  sessionType: SessionTypeSchema,
  allocated: z.number().int().min(-1),
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

/**
 * Complete session balance for a user.
 * Aggregates all session type balances for the user's current tier.
 */
export interface UserSessionBalanceContract {
  userId: string;
  tier: UserTier;
  billingAnchorDate: string;  // ISO date - user's billing cycle start date (day of month they signed up)
  balances: SessionBalanceItemContract[];
  lastUpdated: string;
}

export const UserSessionBalanceSchema: z.ZodType<UserSessionBalanceContract> = z.object({
  userId: z.string(),
  tier: z.enum(USER_TIERS),
  billingAnchorDate: z.string(),
  balances: z.array(SessionBalanceItemSchema),
  lastUpdated: z.string(),
});

// ============================================================================
// SESSION ALLOCATIONS
// ============================================================================

/**
 * Session allocation definition for a specific session type
 */
export interface SessionAllocationContract {
  sessionType: SessionType;
  quantity: number;         // How many sessions allocated per reset period (-1 for unlimited)
  resetFrequency: ResetFrequency;
}

export const SessionAllocationSchema: z.ZodType<SessionAllocationContract> = z.object({
  sessionType: SessionTypeSchema,
  quantity: z.number().int().min(-1),  // -1 = unlimited
  resetFrequency: ResetFrequencySchema,
});

/**
 * Complete tier session allocations - defines what each tier gets
 */
export interface TierSessionAllocationsContract {
  tier: UserTier;
  allocations: SessionAllocationContract[];
}

export const TierSessionAllocationsSchema: z.ZodType<TierSessionAllocationsContract> = z.object({
  tier: z.enum(USER_TIERS),
  allocations: z.array(SessionAllocationSchema),
});

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
 * CORE ($1199/mo):
 * - 8x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 4x Labwork/year (quarterly)
 * - 1x Initial Clinician Consult (annual)
 * - 2x Clinician Followups/year (biannual)
 * - 4x DXA Scans/year (quarterly)
 * - 2x Sleep Screenings/month
 * 
 * CONCIERGE ($1699/mo):
 * - 16x Fitness Sessions/mo
 * - Unlimited Recovery (tracked)
 * - 12x Labwork/year (monthly)
 * - 1x Initial Clinician Consult (annual)
 * - 12x Clinician Followups/year (monthly)
 * - 12x DXA Scans/year (monthly)
 * - 4x Sleep Screenings/month (weekly)
 */
export const DEFAULT_TIER_ALLOCATIONS: Record<UserTier, SessionAllocationContract[]> = {
  ESSENTIALS: [
    { sessionType: SESSION_TYPE.FITNESS_SESSION, quantity: 4, resetFrequency: RESET_FREQUENCY.MONTHLY },
    { sessionType: SESSION_TYPE.RECOVERY_SESSION, quantity: -1, resetFrequency: RESET_FREQUENCY.MONTHLY }, // Unlimited
    { sessionType: SESSION_TYPE.LABWORK, quantity: 1, resetFrequency: RESET_FREQUENCY.BIANNUAL },
    { sessionType: SESSION_TYPE.CLINICIAN_INITIAL, quantity: 1, resetFrequency: RESET_FREQUENCY.ANNUAL },
    { sessionType: SESSION_TYPE.CLINICIAN_FOLLOWUP, quantity: 1, resetFrequency: RESET_FREQUENCY.ANNUAL },
    { sessionType: SESSION_TYPE.DXA_SCAN, quantity: 1, resetFrequency: RESET_FREQUENCY.BIANNUAL },
    { sessionType: SESSION_TYPE.SLEEP_SCREENING, quantity: 1, resetFrequency: RESET_FREQUENCY.BIANNUAL },
  ],
  CORE: [
    { sessionType: SESSION_TYPE.FITNESS_SESSION, quantity: 8, resetFrequency: RESET_FREQUENCY.MONTHLY },
    { sessionType: SESSION_TYPE.RECOVERY_SESSION, quantity: -1, resetFrequency: RESET_FREQUENCY.MONTHLY }, // Unlimited
    { sessionType: SESSION_TYPE.LABWORK, quantity: 1, resetFrequency: RESET_FREQUENCY.QUARTERLY },
    { sessionType: SESSION_TYPE.CLINICIAN_INITIAL, quantity: 1, resetFrequency: RESET_FREQUENCY.ANNUAL },
    { sessionType: SESSION_TYPE.CLINICIAN_FOLLOWUP, quantity: 1, resetFrequency: RESET_FREQUENCY.BIANNUAL },
    { sessionType: SESSION_TYPE.DXA_SCAN, quantity: 1, resetFrequency: RESET_FREQUENCY.QUARTERLY },
    { sessionType: SESSION_TYPE.SLEEP_SCREENING, quantity: 2, resetFrequency: RESET_FREQUENCY.MONTHLY },
  ],
  CONCIERGE: [
    { sessionType: SESSION_TYPE.FITNESS_SESSION, quantity: 16, resetFrequency: RESET_FREQUENCY.MONTHLY },
    { sessionType: SESSION_TYPE.RECOVERY_SESSION, quantity: -1, resetFrequency: RESET_FREQUENCY.MONTHLY }, // Unlimited
    { sessionType: SESSION_TYPE.LABWORK, quantity: 1, resetFrequency: RESET_FREQUENCY.MONTHLY },
    { sessionType: SESSION_TYPE.CLINICIAN_INITIAL, quantity: 1, resetFrequency: RESET_FREQUENCY.ANNUAL },
    { sessionType: SESSION_TYPE.CLINICIAN_FOLLOWUP, quantity: 1, resetFrequency: RESET_FREQUENCY.MONTHLY },
    { sessionType: SESSION_TYPE.DXA_SCAN, quantity: 1, resetFrequency: RESET_FREQUENCY.MONTHLY },
    { sessionType: SESSION_TYPE.SLEEP_SCREENING, quantity: 4, resetFrequency: RESET_FREQUENCY.MONTHLY },
  ],
};

// ============================================================================
// SESSION USAGE SOURCES
// ============================================================================

/**
 * Sources for session usage records.
 * Tracks how sessions were consumed or credited.
 */
export const SESSION_USAGE_SOURCES = ['BOOKING', 'ADMIN_DEDUCT', 'ADMIN_CREDIT', 'BILLING_RESET'] as const;

export type SessionUsageSource = (typeof SESSION_USAGE_SOURCES)[number];

export const SessionUsageSourceSchema = z.enum(SESSION_USAGE_SOURCES);

/** Centralized session usage source constants for equality checks */
export const SESSION_USAGE_SOURCE = {
  BOOKING: 'BOOKING' as SessionUsageSource,
  ADMIN_DEDUCT: 'ADMIN_DEDUCT' as SessionUsageSource,
  ADMIN_CREDIT: 'ADMIN_CREDIT' as SessionUsageSource,
  BILLING_RESET: 'BILLING_RESET' as SessionUsageSource,
} as const;

/** Human-readable labels for session usage sources */
export const SESSION_USAGE_SOURCE_LABELS: Record<SessionUsageSource, string> = {
  BOOKING: 'Appointment Booking',
  ADMIN_DEDUCT: 'Admin Deduction',
  ADMIN_CREDIT: 'Admin Credit',
  BILLING_RESET: 'Billing Reset',
};

/**
 * Check if a string is a valid session usage source
 */
export function isSessionUsageSource(value: string): value is SessionUsageSource {
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
  'INVALID_SESSION_TYPE',
  'NO_SESSIONS_REMAINING',
  'CANNOT_ADJUST_UNLIMITED',
  'USER_NOT_FOUND',
  'SAME_TIER',
] as const;

export type SessionErrorCode = (typeof SESSION_ERROR_CODES)[number];
export const sessionErrorCodeSchema = z.enum(SESSION_ERROR_CODES);

export const SESSION_ERROR_CODE = {
  INVALID_SESSION_TYPE: 'INVALID_SESSION_TYPE' as SessionErrorCode,
  NO_SESSIONS_REMAINING: 'NO_SESSIONS_REMAINING' as SessionErrorCode,
  CANNOT_ADJUST_UNLIMITED: 'CANNOT_ADJUST_UNLIMITED' as SessionErrorCode,
  USER_NOT_FOUND: 'USER_NOT_FOUND' as SessionErrorCode,
  SAME_TIER: 'SAME_TIER' as SessionErrorCode,
} as const;

/** Human-friendly labels for displaying session errors */
export const SESSION_ERROR_LABELS: Record<SessionErrorCode, string> = {
  INVALID_SESSION_TYPE: 'Invalid session type',
  NO_SESSIONS_REMAINING: 'No sessions remaining',
  CANNOT_ADJUST_UNLIMITED: 'Cannot adjust unlimited session types',
  USER_NOT_FOUND: 'User not found',
  SAME_TIER: 'User is already on this tier',
};

// ============================================================================
// APPOINTMENT TO SESSION MAPPING
// ============================================================================

// Import AppointmentType from appointments.ts for type-safe mapping
import { type AppointmentType } from './appointments';

/**
 * Map AppointmentType to SessionType for booking integration.
 * Type-safe mapping ensures compile-time errors if new appointment types are added
 * without updating this map.
 * 
 * NOTE: ONBOARDING maps to null because onboarding doesn't consume session credits.
 */
export const APPOINTMENT_TO_SESSION_MAP: Record<AppointmentType, SessionType | null> = {
  CHECK_IN: SESSION_TYPE.CLINICIAN_FOLLOWUP,
  CONSULTATION: SESSION_TYPE.CLINICIAN_INITIAL,
  TRAINING_SESSION: SESSION_TYPE.FITNESS_SESSION,
  ONBOARDING: null, // Onboarding doesn't consume sessions
  RECOVERY_SESSION: SESSION_TYPE.RECOVERY_SESSION,
  LABWORK: SESSION_TYPE.LABWORK,
  DXA_SCAN: SESSION_TYPE.DXA_SCAN,
  SLEEP_SCREENING: SESSION_TYPE.SLEEP_SCREENING,
};
