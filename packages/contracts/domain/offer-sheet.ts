/**
 * @ai-context Master offer sheet contract | canonical commercial terms for memberships
 *
 * This module provides the typed source of truth for:
 * - Membership tier pricing and positioning
 * - Contract term discounts
 * - Included-service comparison rows
 * - Standard third-party billing disclosures
 *
 * Consumers:
 * - web-public pricing surfaces
 * - legal document sync scripts
 * - any future sales or ops tooling
 */

import * as z from "zod";

import offerSheetData from "./offer-sheet.json" with { type: "json" };
import {
  USER_TIER,
  UserTierSchema,
  isSponsoredPanelTier,
  type UserTier,
} from "./user.js";

export const OfferSheetStatusSchema = z.enum(["draft", "active", "archived"]);
export type OfferSheetStatus = z.infer<typeof OfferSheetStatusSchema>;

/**
 * Contract lengths offered, in months. `1` is the month-to-month Hollis
 * Training plan (offer sheet v3.5.0); 4/8/12 are the fixed terms for
 * Essentials, Core and Concierge. Which tier may use which term is data —
 * see `OfferTermSchema.eligibleTiers` and `allowedTermMonthsForTier`.
 */
export const OfferTermMonthsSchema = z.union([
  z.literal(1),
  z.literal(4),
  z.literal(8),
  z.literal(12),
]);
export type OfferTermMonths = z.infer<typeof OfferTermMonthsSchema>;

/** Month count of the month-to-month (no fixed term) plan. */
export const MONTH_TO_MONTH_TERM_MONTHS = 1 as const satisfies OfferTermMonths;

export const OfferTermSchema = z.object({
  months: OfferTermMonthsSchema,
  discountPercent: z.number().int().min(0).max(100),
  label: z.string().min(1),
  /**
   * Tiers that may enrol on this term (offer sheet v3.5.0). Month-to-month is
   * Hollis Training only; the fixed terms are Essentials/Core/Concierge only.
   */
  eligibleTiers: z.array(UserTierSchema).min(1),
});
export type OfferTerm = z.infer<typeof OfferTermSchema>;

export const OfferTierSummarySchema = z.object({
  displayName: z.string().min(1),
  baseMonthlyPriceDollars: z.number().int().positive(),
  tagline: z.string().min(1),
  publicDescription: z.string().min(1),
  isPopular: z.boolean().optional(),
});
export type OfferTierSummary = z.infer<typeof OfferTierSummarySchema>;

export const OfferTierMapSchema = z.object({
  TRAINING: OfferTierSummarySchema,
  ESSENTIALS: OfferTierSummarySchema,
  CORE: OfferTierSummarySchema,
  CONCIERGE: OfferTierSummarySchema,
});
export type OfferTierMap = z.infer<typeof OfferTierMapSchema>;

export const OfferTierValueMapSchema = z.object({
  TRAINING: z.string().min(1),
  ESSENTIALS: z.string().min(1),
  CORE: z.string().min(1),
  CONCIERGE: z.string().min(1),
});
export type OfferTierValueMap = z.infer<typeof OfferTierValueMapSchema>;

export const OfferComparisonRowSchema = z.object({
  key: z.string().min(1),
  category: z.string().min(1),
  label: z.string().min(1),
  values: OfferTierValueMapSchema,
});
export type OfferComparisonRow = z.infer<typeof OfferComparisonRowSchema>;

export const OfferPolicySetSchema = z.object({
  enrollmentScheduleControl: z.string().min(1),
  autoRenewal: z.string().min(1),
  noticePeriod: z.string().min(1),
  pauseRights: z.string().min(1),
  earlyTermination: z.string().min(1),
  thirdPartyDisclosure: z.string().min(1),
  partnerFacilityDisclosure: z.string().min(1),
  /**
   * Added in offer sheet v3.1.0 (2026-08-19). Describes the Hollis-sponsored
   * third-party biomarker panel membership at CORE/CONCIERGE and, critically,
   * the limits on it — Hollis pays a subscription fee on the member's behalf
   * and is not the provider of any testing.
   */
  sponsoredTestingBenefit: z.string().min(1),
});
export type OfferPolicySet = z.infer<typeof OfferPolicySetSchema>;

/**
 * Optional paid intro month (offer sheet v3.5.0, effective 2026-10-14).
 *
 * Elected at enrollment, only with the 4-month term at Essentials/Core/
 * Concierge. It is billed at the regular 4-month monthly rate (same Stripe
 * price, no discount) and IS month 1 of that 4-month term. The member may
 * cancel by written notice received on or before day `windowDays` with no early
 * termination amount; otherwise the membership simply continues as the
 * 4-month term. Any sponsored biomarker panel is issued only after the window
 * ends without cancellation.
 */
export const OfferIntroMonthSchema = z.object({
  label: z.string().min(1),
  eligibleTiers: z.array(UserTierSchema).min(1),
  /** The only term the intro month may be combined with (and counts toward). */
  termMonths: OfferTermMonthsSchema,
  /** Intro Window length: Start Date (day 1) through the end of day `windowDays`; cancellation is timely if received on or before that day. */
  windowDays: z.number().int().positive(),
  /** The intro month is month 1 of the term, not an extra month. */
  countsAsFirstMonthOfTerm: z.literal(true),
  /** Sponsored biomarker panel is not paid for or issued until the window ends. */
  sponsoredPanelDeferredUntilWindowEnds: z.literal(true),
  /** One-paragraph public summary for pricing/enrollment surfaces. */
  summary: z.string().min(1),
  /** Full policy statement mirrored by Membership Agreement Section 3.5. */
  policy: z.string().min(1),
});
export type OfferIntroMonth = z.infer<typeof OfferIntroMonthSchema>;

export const MasterOfferSheetSchema = z
  .object({
    meta: z.object({
      version: z.string().min(1),
      effectiveDate: z.string().min(1),
      status: OfferSheetStatusSchema,
    }),
    terms: z.array(OfferTermSchema).min(1),
    introMonth: OfferIntroMonthSchema,
    policies: OfferPolicySetSchema,
    tiers: OfferTierMapSchema,
    comparisonRows: z.array(OfferComparisonRowSchema).min(1),
    separatelyBilledThirdPartyItems: z.array(z.string().min(1)).min(1),
  })
  .superRefine((sheet, ctx) => {
    const seenMonths = new Set<number>();
    sheet.terms.forEach((term, index) => {
      if (seenMonths.has(term.months)) {
        ctx.addIssue({
          code: "custom",
          path: ["terms", index, "months"],
          message: `Duplicate ${term.months}-month term`,
        });
      }
      seenMonths.add(term.months);
    });

    for (const tier of UserTierSchema.options) {
      if (!sheet.terms.some((term) => term.eligibleTiers.includes(tier))) {
        ctx.addIssue({
          code: "custom",
          path: ["terms"],
          message: `Tier ${tier} has no eligible term`,
        });
      }
    }

    const introTerm = sheet.terms.find(
      (term) => term.months === sheet.introMonth.termMonths,
    );
    for (const tier of sheet.introMonth.eligibleTiers) {
      if (!introTerm || !introTerm.eligibleTiers.includes(tier)) {
        ctx.addIssue({
          code: "custom",
          path: ["introMonth", "eligibleTiers"],
          message: `Intro month tier ${tier} is not eligible for the ${sheet.introMonth.termMonths}-month term`,
        });
      }
    }
  });
export type MasterOfferSheet = z.infer<typeof MasterOfferSheetSchema>;

export const MASTER_OFFER_SHEET: MasterOfferSheet =
  MasterOfferSheetSchema.parse(offerSheetData);

export const MASTER_OFFER_TERMS = MASTER_OFFER_SHEET.terms;
export const MASTER_OFFER_INTRO_MONTH = MASTER_OFFER_SHEET.introMonth;
export const MASTER_OFFER_ROWS = MASTER_OFFER_SHEET.comparisonRows;
export const MASTER_OFFER_TIER_ORDER: readonly UserTier[] = [
  USER_TIER.TRAINING,
  USER_TIER.ESSENTIALS,
  USER_TIER.CORE,
  USER_TIER.CONCIERGE,
];

export function getMasterOfferTier(tier: UserTier): OfferTierSummary {
  return MASTER_OFFER_SHEET.tiers[tier];
}

/** Offer-sheet terms a tier may enrol on, in offer-sheet order. */
export function getTermsForTier(tier: UserTier): OfferTerm[] {
  return MASTER_OFFER_TERMS.filter((term) => term.eligibleTiers.includes(tier));
}

/**
 * Contract lengths (months) a tier may enrol on.
 * TRAINING → [1] (month-to-month); ESSENTIALS/CORE/CONCIERGE → [4, 8, 12].
 */
export function allowedTermMonthsForTier(tier: UserTier): OfferTermMonths[] {
  return getTermsForTier(tier).map((term) => term.months);
}

/** Whether `months` is an offered term for `tier`. */
export function isTermAllowedForTier(tier: UserTier, months: number): boolean {
  return getTermsForTier(tier).some((term) => term.months === months);
}

/** Whether a tier is billed month-to-month with no fixed term (Hollis Training). */
export function isMonthToMonthTier(tier: UserTier): boolean {
  const months = allowedTermMonthsForTier(tier);
  return months.length > 0 && months.every((m) => m === MONTH_TO_MONTH_TERM_MONTHS);
}

/**
 * Whether the optional intro month may be elected for this tier + term.
 * True only for ESSENTIALS/CORE/CONCIERGE with the 4-month term.
 */
export function isIntroMonthEligible(tier: UserTier, months: number): boolean {
  return (
    MASTER_OFFER_INTRO_MONTH.eligibleTiers.includes(tier) &&
    months === MASTER_OFFER_INTRO_MONTH.termMonths &&
    isTermAllowedForTier(tier, months)
  );
}

/**
 * Day `windowDays` of the intro month (ISO yyyy-mm-dd, UTC calendar
 * arithmetic), counting the Start Date as day 1: Start Date + windowDays − 1.
 * Example: Start Date 2026-10-17 → 2026-11-15 (day 30).
 *
 * This is the Intro Window end date: an intro-month cancellation RECEIVED on
 * or before this date (through the end of the day) avoids the early
 * termination amount, and the sponsored biomarker panel may be issued
 * on or after it if no such cancellation was received.
 */
export function getIntroWindowEndDate(startDateIso: string): string {
  const start = new Date(`${startDateIso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Invalid intro-month start date: ${startDateIso}`);
  }
  start.setUTCDate(start.getUTCDate() + MASTER_OFFER_INTRO_MONTH.windowDays - 1);
  return start.toISOString().slice(0, 10);
}

export function getOfferComparisonValue(
  rowKey: string,
  tier: UserTier,
): string | null {
  const row = MASTER_OFFER_ROWS.find((candidate) => candidate.key === rowKey);
  return row ? row.values[tier] : null;
}

export function getDiscountedMonthlyPriceDollars(
  baseMonthlyPriceDollars: number,
  discountPercent: number,
): number {
  return (baseMonthlyPriceDollars * (100 - discountPercent)) / 100;
}

export function formatUsd(amount: number): string {
  const hasCents = amount % 1 !== 0;

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export function getTierCardHighlights(tier: UserTier): string[] {
  const coachingSessions =
    getOfferComparisonValue("coachingSessionsPerWeek", tier) ??
    MASTER_OFFER_SHEET.tiers[tier].baseMonthlyPriceDollars.toString();
  const recoveryAccess =
    getOfferComparisonValue("recoveryAccess", tier) ?? "Within coaching sessions";
  const nutritionCoaching =
    getOfferComparisonValue("nutritionCoaching", tier) ?? "Included";
  const careCoordination =
    getOfferComparisonValue("careCoordination", tier) ?? "Included";
  const sponsoredBiomarkerPanel =
    getOfferComparisonValue("sponsoredBiomarkerPanel", tier) ?? "Not included";

  const highlights = [
    `Private coaching sessions: ${coachingSessions}`,
    `Recovery (stretch and mobility): ${recoveryAccess}`,
    `Nutrition: ${nutritionCoaching}`,
    `Care coordination: ${careCoordination}`,
    `Sponsored blood biomarker panel: ${sponsoredBiomarkerPanel}`,
  ];
  if (isMonthToMonthTier(tier)) {
    highlights.push("Billing: month-to-month, no fixed term");
  }
  highlights.push(
    MASTER_OFFER_SHEET.policies.thirdPartyDisclosure,
    MASTER_OFFER_SHEET.policies.partnerFacilityDisclosure,
  );
  // The sponsored-testing limits paragraph only describes a benefit the tier
  // actually has; printing it on Training/Essentials cards implied inclusion.
  if (isSponsoredPanelTier(tier)) {
    highlights.push(MASTER_OFFER_SHEET.policies.sponsoredTestingBenefit);
  }
  return highlights;
}
