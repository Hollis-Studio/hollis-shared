/**
 * Enrollment Summary (Exhibit A) — dynamic generator.
 *
 * Generates the Enrollment Summary and Service Schedule that is attached as
 * Exhibit A to the Membership Agreement. Pricing data is derived from the
 * canonical MASTER_OFFER_SHEET (offer-sheet.json) so that the summary always
 * reflects current commercial terms.
 *
 * Usage:
 *   const summary = generateEnrollmentSummary("CORE", 8);
 *   const intro = generateEnrollmentSummary("CORE", 4, "2026-10-17", { introMonth: true });
 *   const training = generateEnrollmentSummary("TRAINING", 1);
 *   const markdown = renderEnrollmentSummaryMarkdown(summary, "Jane Smith");
 *
 * Throws on a tier + term the offer sheet does not offer (e.g. TRAINING with
 * 4 months, CORE with 1 month) and on an ineligible intro-month election.
 */

import {
  MASTER_OFFER_SHEET,
  MASTER_OFFER_INTRO_MONTH,
  MONTH_TO_MONTH_TERM_MONTHS,
  allowedTermMonthsForTier,
  getDiscountedMonthlyPriceDollars,
  getIntroWindowEndDate,
  formatUsd,
  isIntroMonthEligible,
  isTermAllowedForTier,
} from "../../domain/offer-sheet.js";
import {
  CONTRACT_DURATION_MONTHS,
  CONTRACT_DURATION_DISCOUNTS,
  type ContractDuration,
} from "../../stripe/subscription.js";
import { isSponsoredPanelTier, type UserTier } from "../../domain/user.js";

/** Options for generateEnrollmentSummary. */
export interface EnrollmentSummaryOptions {
  /**
   * Elect the optional Intro Month (Membership Agreement Section 3.5).
   * Valid only with the 4-month term at ESSENTIALS/CORE/CONCIERGE.
   */
  introMonth?: boolean;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EnrollmentSummaryData {
  /** Membership tier key, e.g. "CORE" */
  tier: UserTier;
  /** Display name for the tier, e.g. "Core" */
  tierDisplayName: string;
  /** Contract duration key, e.g. "MONTH_8" ("MONTH_1" = month-to-month Hollis Training) */
  contractDuration: ContractDuration;
  /** Contract duration in months, e.g. 8 */
  contractDurationMonths: number;
  /** Discount percentage applied, e.g. 5 */
  discountPercent: number;
  /** Monthly rate in whole dollars (discounted), e.g. 1281.55 */
  monthlyRateDollars: number;
  /** Monthly rate formatted as currency string, e.g. "$1,281.55" */
  monthlyRateFormatted: string;
  /** Total contract value in whole dollars */
  totalContractDollars: number;
  /** Total contract value formatted as currency string */
  totalContractFormatted: string;
  /** ISO date string for contract start (populated at signing time) */
  startDate: string;
  /**
   * ISO date string for contract end (calculated from start + duration). For
   * month-to-month enrollment there is no fixed end: this is the last day of
   * the first monthly billing period (Membership Agreement Section 3.3).
   */
  endDate: string;
  /** True for month-to-month enrollment (Hollis Training): no fixed term, no early termination amount. */
  isMonthToMonth: boolean;
  /** Whether the optional Intro Month was elected (Membership Agreement Section 3.5). */
  introMonthElected: boolean;
  /**
   * Day 30 of the Intro Month (ISO date): the Intro Window end date. A
   * cancellation is timely if received on or before this date. Null when no Intro Month was elected.
   */
  introWindowEndsAt: string | null;
  /** Included services comparison rows drawn from the offer sheet */
  includedServices: Array<{ label: string; value: string }>;
  /**
   * Whether this tier includes the Company-sponsored third-party testing
   * membership (CORE and CONCIERGE only; never TRAINING or ESSENTIALS).
   */
  sponsoredTestingIncluded: boolean;
  /** Standard third-party billing disclosure items from the offer sheet */
  separatelyBilledItems: string[];
}

// ---------------------------------------------------------------------------
// Helper — derive ContractDuration key from month count
// ---------------------------------------------------------------------------

/**
 * Maps a raw month count to the corresponding ContractDuration key.
 * Throws if the month count is not one of the canonical durations.
 */
function monthsToContractDuration(months: number): ContractDuration {
  const entry = Object.entries(CONTRACT_DURATION_MONTHS).find(
    ([, v]) => v === months,
  );
  if (!entry) {
    throw new Error(
      `Invalid contract duration: ${months} months. Valid durations are ${Object.values(CONTRACT_DURATION_MONTHS).join(", ")}.`,
    );
  }
  return entry[0] as ContractDuration;
}

// ---------------------------------------------------------------------------
// Helper — add months to a date string
// ---------------------------------------------------------------------------

function addMonthsToIso(isoDate: string, months: number): string {
  const date = new Date(isoDate);
  date.setMonth(date.getMonth() + months);
  // Subtract one day so End Date is the last day of the final billing month
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Core generator
// ---------------------------------------------------------------------------

/**
 * Generates a fully populated EnrollmentSummaryData object from tier + duration.
 *
 * @param tier - UserTier key, e.g. "CORE"
 * @param contractDurationMonths - Number of months: 1 (TRAINING only) or 4, 8, 12 (other tiers)
 * @param startDateIso - ISO date string for the contract start date (defaults to today)
 * @param options - `{ introMonth: true }` to elect the Intro Month (4-month term only)
 * @throws if the tier is not offered on that term, or the intro month is ineligible
 */
export function generateEnrollmentSummary(
  tier: UserTier,
  contractDurationMonths: number,
  startDateIso?: string,
  options: EnrollmentSummaryOptions = {},
): EnrollmentSummaryData {
  const tierData = MASTER_OFFER_SHEET.tiers[tier];
  const contractDuration = monthsToContractDuration(contractDurationMonths);
  if (!isTermAllowedForTier(tier, contractDurationMonths)) {
    throw new Error(
      `${tierData.displayName} is not offered on a ${contractDurationMonths}-month term. Valid terms are ${allowedTermMonthsForTier(tier).join(", ")} months.`,
    );
  }
  const introMonthElected = options.introMonth === true;
  if (introMonthElected && !isIntroMonthEligible(tier, contractDurationMonths)) {
    throw new Error(
      `The intro month is available only with the ${MASTER_OFFER_INTRO_MONTH.termMonths}-month term at ${MASTER_OFFER_INTRO_MONTH.eligibleTiers.join(", ")}.`,
    );
  }
  const discountPercent = CONTRACT_DURATION_DISCOUNTS[contractDuration];

  const monthlyRateDollars = getDiscountedMonthlyPriceDollars(
    tierData.baseMonthlyPriceDollars,
    discountPercent,
  );
  // Round to 2 decimal places to match pricing table display
  const monthlyRateRounded = Math.round(monthlyRateDollars * 100) / 100;
  const totalContractDollars =
    Math.round(monthlyRateRounded * contractDurationMonths * 100) / 100;

  const startDate =
    startDateIso ?? new Date().toISOString().slice(0, 10);
  const endDate = addMonthsToIso(startDate, contractDurationMonths);

  // Build included services from the comparison rows filtered to this tier
  const includedServices = MASTER_OFFER_SHEET.comparisonRows.map((row) => ({
    label: row.label,
    value: row.values[tier],
  }));

  return {
    tier,
    tierDisplayName: tierData.displayName,
    contractDuration,
    contractDurationMonths,
    discountPercent,
    monthlyRateDollars: monthlyRateRounded,
    monthlyRateFormatted: formatUsd(monthlyRateRounded),
    totalContractDollars,
    totalContractFormatted: formatUsd(totalContractDollars),
    startDate,
    endDate,
    isMonthToMonth: contractDurationMonths === MONTH_TO_MONTH_TERM_MONTHS,
    introMonthElected,
    introWindowEndsAt: introMonthElected ? getIntroWindowEndDate(startDate) : null,
    includedServices,
    sponsoredTestingIncluded: isSponsoredPanelTier(tier),
    separatelyBilledItems: MASTER_OFFER_SHEET.separatelyBilledThirdPartyItems,
  };
}

// ---------------------------------------------------------------------------
// Markdown renderer
// ---------------------------------------------------------------------------

/**
 * Renders an EnrollmentSummaryData as a Markdown table suitable for display
 * in the signing flow and for embedding in the composite PDF as Exhibit A.
 *
 * @param summary - The summary data from generateEnrollmentSummary()
 * @param clientName - The member's full legal name (pre-filled from form state)
 */
export function renderEnrollmentSummaryMarkdown(
  summary: EnrollmentSummaryData,
  clientName: string,
): string {
  const discountLabel =
    summary.discountPercent > 0
      ? `${summary.discountPercent}% term discount applied`
      : "No discount (standard rate)";

  const includedServicesRows = summary.includedServices
    .map((s) => `| ${s.label} | ${s.value} |`)
    .join("\n");

  const separatelyBilledRows = summary.separatelyBilledItems
    .map((item) => `- ${item}`)
    .join("\n");

  const sponsoredTestingValue = summary.sponsoredTestingIncluded
    ? "Included — Company pays an independent third-party health-testing company's membership fee on Member's behalf"
    : "Not included at this tier";

  const sponsoredTestingNote = summary.sponsoredTestingIncluded
    ? `## Sponsored Third-Party Testing Membership

Membership at the ${summary.tierDisplayName} tier includes Company's payment of a membership or subscription fee with an independent third-party health-testing company on Member's behalf.

The account is Member's — established in Member's name and governed by that company's own terms and privacy practices. That company and its own independent licensed providers order, arrange, and perform any testing and are solely responsible for interpretation of results and clinical follow-up. Company does not select Member's test panel, does not arrange or schedule Member's specimen collection, does not receive Member's results from that company, and has no access to Member's account with that company. Company's payment of a subscription fee on Member's behalf does not make Company the provider of, or responsible for, any testing, laboratory, or clinical service.

The benefit has no cash value and is not refundable, creditable, or exchangeable if declined or unused. Specimen collection fees, additional or add-on panels, and clinical consultation charges are not covered and are billed separately.${summary.introMonthElected ? " Because Member elected the Intro Month, Company does not pay for, issue, or arrange this benefit until the Intro Window ends without a timely cancellation by Member." : ""} See Membership Agreement Sections 2.3 and 2.4.

---

`
    : "";

  const introMonthNote = summary.introMonthElected
    ? `## Intro Month

Member elected the Intro Month under Membership Agreement Section 3.5. The Intro Month is month 1 of Member's ${summary.contractDurationMonths}-month term and is billed at the regular monthly rate shown above, with no discount. The Intro Window ends at the end of ${summary.introWindowEndsAt} (day ${MASTER_OFFER_INTRO_MONTH.windowDays}, counting the Start Date as day one). Member may cancel by written notice that Company receives on or before ${summary.introWindowEndsAt}; a timely cancellation takes effect at the end of the Intro Month, no early termination amount is due, and any second monthly payment already charged is refunded. If no timely cancellation is received, the membership continues for the remainder of the ${summary.contractDurationMonths}-month term.

---

`
    : "";

  const contractTermValue = summary.isMonthToMonth
    ? "Month-to-month (no fixed term)"
    : `${summary.contractDurationMonths} months`;
  const totalContractRow = summary.isMonthToMonth
    ? "| Total Contract Value | Not applicable — month-to-month; no early termination amount |"
    : `| Total Contract Value | ${summary.totalContractFormatted} |`;
  const endDateRow = summary.isMonthToMonth
    ? `| First Billing Period Ends | ${summary.endDate} (no fixed End Date) |`
    : `| End Date | ${summary.endDate} |`;
  const introMonthValue = summary.introMonthElected
    ? `Elected — Intro Window ends ${summary.introWindowEndsAt}; cancellation must be received on or before that date`
    : "Not elected";

  return `# Exhibit A — Enrollment Summary and Service Schedule

**Hollis Health LLC**
Home Office: 818 Knights Cross Dr, Suite 5104, San Antonio, TX 78258
(210) 891-9005 | admin@hollis.health

---

## Member and Enrollment Details

| Item | Value |
|---|---|
| Member Name | ${clientName} |
| Selected Tier | ${summary.tierDisplayName} |
| Contract Term | ${contractTermValue} |
| Intro Month | ${introMonthValue} |
| Discount | ${discountLabel} |
| Monthly Rate | ${summary.monthlyRateFormatted} |
${totalContractRow}
| Start Date | ${summary.startDate} |
${endDateRow}
| Initial Program Location | To be confirmed at enrollment |
| Supplements and Other Physical Products | Not sold by Company; not included or available as add-ons |
| Included Non-Clinical Assessment Allowance | None unless separately listed |
| Sponsored Third-Party Testing Membership | ${sponsoredTestingValue} |
| Add-On Services | None unless separately listed |

---

## Included Services — ${summary.tierDisplayName} Tier

| Service | Included |
|---|---|
${includedServicesRows}

---

${introMonthNote}${sponsoredTestingNote}## Separately Billed Third-Party Items

The following are **not** included in Membership fees unless this Exhibit A expressly lists them as included:

${separatelyBilledRows}

---

*This Exhibit A is incorporated into and governed by the Membership Agreement executed on the same date. If any term in this Exhibit A conflicts with the body of the Membership Agreement, this Exhibit A controls for the specific commercial terms listed herein.*`;
}
