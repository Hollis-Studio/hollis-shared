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
import { type UserTier } from "./user.js";
export declare const OfferSheetStatusSchema: z.ZodEnum<{
    active: "active";
    archived: "archived";
    draft: "draft";
}>;
export type OfferSheetStatus = z.infer<typeof OfferSheetStatusSchema>;
/**
 * Contract lengths offered, in months. `1` is the month-to-month Hollis
 * Training plan (offer sheet v3.5.0); 4/8/12 are the fixed terms for
 * Essentials, Core and Concierge. Which tier may use which term is data —
 * see `OfferTermSchema.eligibleTiers` and `allowedTermMonthsForTier`.
 */
export declare const OfferTermMonthsSchema: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
export type OfferTermMonths = z.infer<typeof OfferTermMonthsSchema>;
/** Month count of the month-to-month (no fixed term) plan. */
export declare const MONTH_TO_MONTH_TERM_MONTHS: 1;
export declare const OfferTermSchema: z.ZodObject<{
    months: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
    discountPercent: z.ZodNumber;
    label: z.ZodString;
    eligibleTiers: z.ZodArray<z.ZodEnum<{
        TRAINING: "TRAINING";
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
}, z.core.$strip>;
export type OfferTerm = z.infer<typeof OfferTermSchema>;
export declare const OfferTierSummarySchema: z.ZodObject<{
    displayName: z.ZodString;
    baseMonthlyPriceDollars: z.ZodNumber;
    tagline: z.ZodString;
    publicDescription: z.ZodString;
    isPopular: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type OfferTierSummary = z.infer<typeof OfferTierSummarySchema>;
export declare const OfferTierMapSchema: z.ZodObject<{
    TRAINING: z.ZodObject<{
        displayName: z.ZodString;
        baseMonthlyPriceDollars: z.ZodNumber;
        tagline: z.ZodString;
        publicDescription: z.ZodString;
        isPopular: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    ESSENTIALS: z.ZodObject<{
        displayName: z.ZodString;
        baseMonthlyPriceDollars: z.ZodNumber;
        tagline: z.ZodString;
        publicDescription: z.ZodString;
        isPopular: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    CORE: z.ZodObject<{
        displayName: z.ZodString;
        baseMonthlyPriceDollars: z.ZodNumber;
        tagline: z.ZodString;
        publicDescription: z.ZodString;
        isPopular: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    CONCIERGE: z.ZodObject<{
        displayName: z.ZodString;
        baseMonthlyPriceDollars: z.ZodNumber;
        tagline: z.ZodString;
        publicDescription: z.ZodString;
        isPopular: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type OfferTierMap = z.infer<typeof OfferTierMapSchema>;
export declare const OfferTierValueMapSchema: z.ZodObject<{
    TRAINING: z.ZodString;
    ESSENTIALS: z.ZodString;
    CORE: z.ZodString;
    CONCIERGE: z.ZodString;
}, z.core.$strip>;
export type OfferTierValueMap = z.infer<typeof OfferTierValueMapSchema>;
export declare const OfferComparisonRowSchema: z.ZodObject<{
    key: z.ZodString;
    category: z.ZodString;
    label: z.ZodString;
    values: z.ZodObject<{
        TRAINING: z.ZodString;
        ESSENTIALS: z.ZodString;
        CORE: z.ZodString;
        CONCIERGE: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type OfferComparisonRow = z.infer<typeof OfferComparisonRowSchema>;
export declare const OfferPolicySetSchema: z.ZodObject<{
    enrollmentScheduleControl: z.ZodString;
    autoRenewal: z.ZodString;
    noticePeriod: z.ZodString;
    pauseRights: z.ZodString;
    earlyTermination: z.ZodString;
    thirdPartyDisclosure: z.ZodString;
    partnerFacilityDisclosure: z.ZodString;
    sponsoredTestingBenefit: z.ZodString;
}, z.core.$strip>;
export type OfferPolicySet = z.infer<typeof OfferPolicySetSchema>;
/**
 * Optional paid intro month (offer sheet v3.5.0, effective 2026-10-14).
 *
 * Elected at enrollment, only with the 4-month term at Essentials/Core/
 * Concierge. It is billed at the regular 4-month monthly rate (same Stripe
 * price, no discount) and IS month 1 of that 4-month term. The member may
 * cancel by written notice received before day `windowDays` with no early
 * termination amount; otherwise the membership simply continues as the
 * 4-month term. Any sponsored biomarker panel is issued only after the window
 * ends without cancellation.
 */
export declare const OfferIntroMonthSchema: z.ZodObject<{
    label: z.ZodString;
    eligibleTiers: z.ZodArray<z.ZodEnum<{
        TRAINING: "TRAINING";
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    termMonths: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
    windowDays: z.ZodNumber;
    countsAsFirstMonthOfTerm: z.ZodLiteral<true>;
    sponsoredPanelDeferredUntilWindowEnds: z.ZodLiteral<true>;
    summary: z.ZodString;
    policy: z.ZodString;
}, z.core.$strip>;
export type OfferIntroMonth = z.infer<typeof OfferIntroMonthSchema>;
export declare const MasterOfferSheetSchema: z.ZodObject<{
    meta: z.ZodObject<{
        version: z.ZodString;
        effectiveDate: z.ZodString;
        status: z.ZodEnum<{
            active: "active";
            archived: "archived";
            draft: "draft";
        }>;
    }, z.core.$strip>;
    terms: z.ZodArray<z.ZodObject<{
        months: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
        discountPercent: z.ZodNumber;
        label: z.ZodString;
        eligibleTiers: z.ZodArray<z.ZodEnum<{
            TRAINING: "TRAINING";
            ESSENTIALS: "ESSENTIALS";
            CORE: "CORE";
            CONCIERGE: "CONCIERGE";
        }>>;
    }, z.core.$strip>>;
    introMonth: z.ZodObject<{
        label: z.ZodString;
        eligibleTiers: z.ZodArray<z.ZodEnum<{
            TRAINING: "TRAINING";
            ESSENTIALS: "ESSENTIALS";
            CORE: "CORE";
            CONCIERGE: "CONCIERGE";
        }>>;
        termMonths: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
        windowDays: z.ZodNumber;
        countsAsFirstMonthOfTerm: z.ZodLiteral<true>;
        sponsoredPanelDeferredUntilWindowEnds: z.ZodLiteral<true>;
        summary: z.ZodString;
        policy: z.ZodString;
    }, z.core.$strip>;
    policies: z.ZodObject<{
        enrollmentScheduleControl: z.ZodString;
        autoRenewal: z.ZodString;
        noticePeriod: z.ZodString;
        pauseRights: z.ZodString;
        earlyTermination: z.ZodString;
        thirdPartyDisclosure: z.ZodString;
        partnerFacilityDisclosure: z.ZodString;
        sponsoredTestingBenefit: z.ZodString;
    }, z.core.$strip>;
    tiers: z.ZodObject<{
        TRAINING: z.ZodObject<{
            displayName: z.ZodString;
            baseMonthlyPriceDollars: z.ZodNumber;
            tagline: z.ZodString;
            publicDescription: z.ZodString;
            isPopular: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        ESSENTIALS: z.ZodObject<{
            displayName: z.ZodString;
            baseMonthlyPriceDollars: z.ZodNumber;
            tagline: z.ZodString;
            publicDescription: z.ZodString;
            isPopular: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        CORE: z.ZodObject<{
            displayName: z.ZodString;
            baseMonthlyPriceDollars: z.ZodNumber;
            tagline: z.ZodString;
            publicDescription: z.ZodString;
            isPopular: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        CONCIERGE: z.ZodObject<{
            displayName: z.ZodString;
            baseMonthlyPriceDollars: z.ZodNumber;
            tagline: z.ZodString;
            publicDescription: z.ZodString;
            isPopular: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    comparisonRows: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        category: z.ZodString;
        label: z.ZodString;
        values: z.ZodObject<{
            TRAINING: z.ZodString;
            ESSENTIALS: z.ZodString;
            CORE: z.ZodString;
            CONCIERGE: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    separatelyBilledThirdPartyItems: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type MasterOfferSheet = z.infer<typeof MasterOfferSheetSchema>;
export declare const MASTER_OFFER_SHEET: MasterOfferSheet;
export declare const MASTER_OFFER_TERMS: {
    months: 1 | 12 | 4 | 8;
    discountPercent: number;
    label: string;
    eligibleTiers: ("TRAINING" | "ESSENTIALS" | "CORE" | "CONCIERGE")[];
}[];
export declare const MASTER_OFFER_INTRO_MONTH: {
    label: string;
    eligibleTiers: ("TRAINING" | "ESSENTIALS" | "CORE" | "CONCIERGE")[];
    termMonths: 1 | 12 | 4 | 8;
    windowDays: number;
    countsAsFirstMonthOfTerm: true;
    sponsoredPanelDeferredUntilWindowEnds: true;
    summary: string;
    policy: string;
};
export declare const MASTER_OFFER_ROWS: {
    key: string;
    category: string;
    label: string;
    values: {
        TRAINING: string;
        ESSENTIALS: string;
        CORE: string;
        CONCIERGE: string;
    };
}[];
export declare const MASTER_OFFER_TIER_ORDER: readonly UserTier[];
export declare function getMasterOfferTier(tier: UserTier): OfferTierSummary;
/** Offer-sheet terms a tier may enrol on, in offer-sheet order. */
export declare function getTermsForTier(tier: UserTier): OfferTerm[];
/**
 * Contract lengths (months) a tier may enrol on.
 * TRAINING → [1] (month-to-month); ESSENTIALS/CORE/CONCIERGE → [4, 8, 12].
 */
export declare function allowedTermMonthsForTier(tier: UserTier): OfferTermMonths[];
/** Whether `months` is an offered term for `tier`. */
export declare function isTermAllowedForTier(tier: UserTier, months: number): boolean;
/** Whether a tier is billed month-to-month with no fixed term (Hollis Training). */
export declare function isMonthToMonthTier(tier: UserTier): boolean;
/**
 * Whether the optional intro month may be elected for this tier + term.
 * True only for ESSENTIALS/CORE/CONCIERGE with the 4-month term.
 */
export declare function isIntroMonthEligible(tier: UserTier, months: number): boolean;
/**
 * Day `windowDays` of the intro month (ISO yyyy-mm-dd, UTC calendar
 * arithmetic), counting the Start Date as day 1: Start Date + windowDays − 1.
 * Example: Start Date 2026-10-17 → 2026-11-15 (day 30).
 *
 * An intro-month cancellation must be RECEIVED before this date to avoid the
 * early termination amount, and the sponsored biomarker panel may be issued
 * on or after it if no such cancellation was received.
 */
export declare function getIntroWindowEndDate(startDateIso: string): string;
export declare function getOfferComparisonValue(rowKey: string, tier: UserTier): string | null;
export declare function getDiscountedMonthlyPriceDollars(baseMonthlyPriceDollars: number, discountPercent: number): number;
export declare function formatUsd(amount: number): string;
export declare function getTierCardHighlights(tier: UserTier): string[];
//# sourceMappingURL=offer-sheet.d.ts.map