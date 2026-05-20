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
 *   const markdown = renderEnrollmentSummaryMarkdown(summary, "Jane Smith");
 */

import {
  MASTER_OFFER_SHEET,
  getDiscountedMonthlyPriceDollars,
  formatUsd,
} from "../../domain/offer-sheet.js";
import {
  CONTRACT_DURATION_MONTHS,
  CONTRACT_DURATION_DISCOUNTS,
  type ContractDuration,
} from "../../stripe/subscription.js";
import type { UserTier } from "../../domain/user.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EnrollmentSummaryData {
  /** Membership tier key, e.g. "CORE" */
  tier: UserTier;
  /** Display name for the tier, e.g. "Core" */
  tierDisplayName: string;
  /** Contract duration key, e.g. "MONTH_8" */
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
  /** ISO date string for contract end (calculated from start + duration) */
  endDate: string;
  /** Included services comparison rows drawn from the offer sheet */
  includedServices: Array<{ label: string; value: string }>;
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
 * @param contractDurationMonths - Number of months: 4, 8, or 12
 * @param startDateIso - ISO date string for the contract start date (defaults to today)
 */
export function generateEnrollmentSummary(
  tier: UserTier,
  contractDurationMonths: number,
  startDateIso?: string,
): EnrollmentSummaryData {
  const tierData = MASTER_OFFER_SHEET.tiers[tier];
  const contractDuration = monthsToContractDuration(contractDurationMonths);
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
    includedServices,
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

  return `# Exhibit A — Enrollment Summary and Service Schedule

**Hollis Health LLC**
Home Office: 691 S Seguin, New Braunfels, TX 78130
(210) 891-9005 | legal@hollis.health

---

## Member and Enrollment Details

| Item | Value |
|---|---|
| Member Name | ${clientName} |
| Selected Tier | ${summary.tierDisplayName} |
| Contract Term | ${summary.contractDurationMonths} months |
| Discount | ${discountLabel} |
| Monthly Rate | ${summary.monthlyRateFormatted} |
| Total Contract Value | ${summary.totalContractFormatted} |
| Start Date | ${summary.startDate} |
| End Date | ${summary.endDate} |
| Initial Program Location | To be confirmed at enrollment |
| Included Supplement Allowance / Package | None unless separately listed |
| Included Diagnostic / Assessment Allowance | None unless separately listed |
| Add-On Services | None unless separately listed |

---

## Included Services — ${summary.tierDisplayName} Tier

| Service | Included |
|---|---|
${includedServicesRows}

---

## Separately Billed Third-Party Items

The following are **not** included in Membership fees unless this Exhibit A expressly lists them as included:

${separatelyBilledRows}

---

*This Exhibit A is incorporated into and governed by the Membership Agreement executed on the same date. If any term in this Exhibit A conflicts with the body of the Membership Agreement, this Exhibit A controls for the specific commercial terms listed herein.*`;
}
