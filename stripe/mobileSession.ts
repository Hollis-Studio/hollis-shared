/**
 * @ai-context Mobile session contracts | Types for mobile session management
 *
 * CONCIERGE tier gets 2 free mobile sessions/month (cap at 4).
 * A-la-carte sessions are $80 each and never expire.
 *
 * deps: zod | consumers: server routes, web-admin
 */

import { z } from 'zod';

// ============================================================================
// MOBILE SESSION BALANCE
// ============================================================================

export interface MobileSessionBalanceContract {
  userId: string;

  // Free sessions (CONCIERGE only)
  freeAllocationPerMonth: number; // 2 for CONCIERGE, 0 for others
  freeAvailable: number;          // Current available (max 4)
  freeMaxRollover: number;        // 4

  // Paid sessions (never expire)
  paidBalance: number;

  // Total available (free + paid)
  totalAvailable: number;

  lastFreeResetDate: string | null;
}

export const MobileSessionBalanceSchema = z.object({
  userId: z.string().uuid(),
  freeAllocationPerMonth: z.number().int(),
  freeAvailable: z.number().int(),
  freeMaxRollover: z.number().int(),
  paidBalance: z.number().int(),
  totalAvailable: z.number().int(),
  lastFreeResetDate: z.string().nullable(),
});

// ============================================================================
// MOBILE SESSION USAGE
// ============================================================================

export const MOBILE_SESSION_SOURCES = ['TIER_ALLOCATION', 'A_LA_CARTE'] as const;

export type MobileSessionSource = (typeof MOBILE_SESSION_SOURCES)[number];

export interface MobileSessionUsageContract {
  id: string;
  userId: string;
  source: MobileSessionSource;
  usedAt: string;
  appointmentId: string | null;
  notes: string | null;
}

export const MobileSessionUsageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  source: z.enum(MOBILE_SESSION_SOURCES),
  usedAt: z.string(),
  appointmentId: z.string().nullable(),
  notes: z.string().nullable(),
});

// ============================================================================
// PURCHASE REQUEST
// ============================================================================

export interface PurchaseMobileSessionsRequest {
  quantity: number;
}

export const PurchaseMobileSessionsRequestSchema = z.object({
  quantity: z.number().int().positive().max(10), // Max 10 at once
});

// ============================================================================
// PURCHASE RESPONSE
// ============================================================================

export interface MobileSessionPurchaseContract {
  id: string;
  userId: string;
  quantity: number;
  unitPriceInCents: number;  // $80 = 8000
  totalInCents: number;
  purchasedAt: string;
}

export const MobileSessionPurchaseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPriceInCents: z.number().int(),
  totalInCents: z.number().int(),
  purchasedAt: z.string(),
});

// ============================================================================
// CONSTANTS
// ============================================================================

/** Price per mobile session in cents ($80) */
export const MOBILE_SESSION_PRICE_CENTS = 8000;

/** Maximum free mobile sessions that can accumulate */
export const MOBILE_SESSION_FREE_MAX = 4;

/** Free mobile sessions per month for CONCIERGE */
export const MOBILE_SESSION_CONCIERGE_MONTHLY = 2;
