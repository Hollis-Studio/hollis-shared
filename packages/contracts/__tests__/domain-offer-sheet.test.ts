import {
  MASTER_OFFER_SHEET,
  USER_TIER,
  USER_TIER_PRICES_DOLLARS,
  formatUsd,
  getDiscountedMonthlyPriceDollars,
  getTierCardHighlights,
} from "@hollis/contracts";

describe("master offer sheet", () => {
  it("keeps user tier prices aligned with the master offer sheet", () => {
    expect(USER_TIER_PRICES_DOLLARS.ESSENTIALS).toBe(
      MASTER_OFFER_SHEET.tiers.ESSENTIALS.baseMonthlyPriceDollars,
    );
    expect(USER_TIER_PRICES_DOLLARS.CORE).toBe(
      MASTER_OFFER_SHEET.tiers.CORE.baseMonthlyPriceDollars,
    );
    expect(USER_TIER_PRICES_DOLLARS.CONCIERGE).toBe(
      MASTER_OFFER_SHEET.tiers.CONCIERGE.baseMonthlyPriceDollars,
    );
  });

  it("calculates discounted monthly rates exactly for the legal agreement table", () => {
    expect(getDiscountedMonthlyPriceDollars(799, 5)).toBe(759.05);
    expect(getDiscountedMonthlyPriceDollars(1349, 5)).toBe(1281.55);
    expect(getDiscountedMonthlyPriceDollars(1999, 10)).toBe(1799.1);
  });

  it("formats dollars consistently for site and legal surfaces", () => {
    expect(formatUsd(799)).toBe("$799");
    expect(formatUsd(1281.55)).toBe("$1,281.55");
  });

  it("includes the third-party disclosure in tier card highlights", () => {
    const highlights = getTierCardHighlights(USER_TIER.CORE);

    expect(highlights).toContain(
      MASTER_OFFER_SHEET.policies.thirdPartyDisclosure,
    );
  });
});
