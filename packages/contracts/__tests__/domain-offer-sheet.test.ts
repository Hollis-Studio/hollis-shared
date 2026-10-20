import {
  CONTRACT_DURATIONS,
  CreateSubscriptionRequestSchema,
  MASTER_OFFER_INTRO_MONTH,
  MASTER_OFFER_SHEET,
  MASTER_OFFER_TIER_ORDER,
  MasterOfferSheetSchema,
  USER_TIERS,
  USER_TIER,
  allowedContractDurationsForTier,
  allowedTermMonthsForTier,
  getIntroWindowEndDate,
  getTermsForTier,
  isContractDurationAllowedForTier,
  isIntroMonthEligible,
  isIntroMonthEligibleForDuration,
  isMonthToMonthTier,
  isTermAllowedForTier,
  USER_TIER_PRICES_DOLLARS,
  formatUsd,
  getDiscountedMonthlyPriceDollars,
  getTierCardHighlights,
} from "@hollis-studio/contracts";

describe("master offer sheet", () => {
  it("distinguishes Training's next-billing-date cancellation from other tier notice", () => {
    expect(MASTER_OFFER_SHEET.policies.noticePeriod).toContain(
      "Hollis Training: written cancellation anytime before the next billing date",
    );
    expect(MASTER_OFFER_SHEET.policies.noticePeriod).toContain(
      "Essentials, Core, and Concierge: at least 7 days' written notice",
    );
  });

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
    expect(getDiscountedMonthlyPriceDollars(749, 5)).toBe(711.55);
    expect(getDiscountedMonthlyPriceDollars(1349, 5)).toBe(1281.55);
    expect(getDiscountedMonthlyPriceDollars(1949, 10)).toBe(1754.1);
  });

  it("formats dollars consistently for site and legal surfaces", () => {
    expect(formatUsd(749)).toBe("$749");
    expect(formatUsd(1281.55)).toBe("$1,281.55");
  });

  it("keeps TRAINING price aligned with the offer sheet", () => {
    expect(USER_TIER_PRICES_DOLLARS.TRAINING).toBe(399);
    expect(MASTER_OFFER_SHEET.tiers.TRAINING.baseMonthlyPriceDollars).toBe(399);
    expect(MASTER_OFFER_SHEET.tiers.TRAINING.displayName).toBe("Hollis Training");
    expect(MASTER_OFFER_TIER_ORDER).toEqual([...USER_TIERS]);
  });

  it("includes the third-party disclosure in tier card highlights", () => {
    const highlights = getTierCardHighlights(USER_TIER.CORE);

    expect(highlights).toContain(
      MASTER_OFFER_SHEET.policies.thirdPartyDisclosure,
    );
  });
});

describe("terms per tier", () => {
  it("offers TRAINING month-to-month only and the other tiers 4/8/12", () => {
    expect(allowedTermMonthsForTier("TRAINING")).toEqual([1]);
    for (const tier of ["ESSENTIALS", "CORE", "CONCIERGE"] as const) {
      expect(allowedTermMonthsForTier(tier)).toEqual([4, 8, 12]);
      expect(isTermAllowedForTier(tier, 1)).toBe(false);
      expect(isMonthToMonthTier(tier)).toBe(false);
    }
    expect(isMonthToMonthTier("TRAINING")).toBe(true);
    expect(isTermAllowedForTier("TRAINING", 4)).toBe(false);
    expect(getTermsForTier("TRAINING")[0]).toMatchObject({
      months: 1,
      discountPercent: 0,
    });
  });

  it("maps contract durations onto the same eligibility", () => {
    expect(allowedContractDurationsForTier("TRAINING")).toEqual(["MONTH_1"]);
    expect(allowedContractDurationsForTier("CORE")).toEqual([
      "MONTH_4",
      "MONTH_8",
      "MONTH_12",
    ]);
    expect(isContractDurationAllowedForTier("TRAINING", "MONTH_4")).toBe(false);
    expect(isContractDurationAllowedForTier("ESSENTIALS", "MONTH_1")).toBe(false);
    // Every duration is offered to at least one tier.
    for (const duration of CONTRACT_DURATIONS) {
      expect(
        USER_TIERS.some((tier) => isContractDurationAllowedForTier(tier, duration)),
      ).toBe(true);
    }
  });
});

describe("intro month", () => {
  it("is a 30-day window on the 4-month term at Essentials/Core/Concierge", () => {
    expect(MASTER_OFFER_INTRO_MONTH).toMatchObject({
      eligibleTiers: ["ESSENTIALS", "CORE", "CONCIERGE"],
      termMonths: 4,
      windowDays: 30,
      countsAsFirstMonthOfTerm: true,
      sponsoredPanelDeferredUntilWindowEnds: true,
    });
  });

  it.each([
    ["ESSENTIALS", 4, true],
    ["CORE", 4, true],
    ["CONCIERGE", 4, true],
    ["CORE", 8, false],
    ["CONCIERGE", 12, false],
    ["TRAINING", 1, false],
    ["TRAINING", 4, false],
  ] as const)("%s with %d months → eligible %s", (tier, months, expected) => {
    expect(isIntroMonthEligible(tier, months)).toBe(expected);
  });

  it("checks eligibility by contract duration", () => {
    expect(isIntroMonthEligibleForDuration("CORE", "MONTH_4")).toBe(true);
    expect(isIntroMonthEligibleForDuration("CORE", "MONTH_8")).toBe(false);
    expect(isIntroMonthEligibleForDuration("TRAINING", "MONTH_1")).toBe(false);
  });

  it("states the window as on-or-before day 30, never 'before day 30'", () => {
    const text = JSON.stringify(MASTER_OFFER_INTRO_MONTH);
    expect(text).toContain("on or before that date");
    expect(text).not.toMatch(/before day 30|before the 30th/);
  });

  it("computes day 30 of the intro month counting the Start Date as day 1", () => {
    expect(getIntroWindowEndDate("2026-10-17")).toBe("2026-11-15");
    expect(getIntroWindowEndDate("2026-12-15")).toBe("2027-01-13");
    expect(() => getIntroWindowEndDate("not-a-date")).toThrow();
  });

  it("accepts an optional introMonth flag on subscription create", () => {
    const base = {
      userId: "HH-ABC123",
      tier: "CORE",
      contractDuration: "MONTH_4",
      pendingConsentKey: "consent/key.pdf",
    };
    expect(CreateSubscriptionRequestSchema.parse(base).introMonth).toBeUndefined();
    expect(
      CreateSubscriptionRequestSchema.parse({ ...base, introMonth: true }).introMonth,
    ).toBe(true);
  });

  it("rejects an offer sheet whose intro term is not offered to an intro tier", () => {
    const broken = structuredClone(MASTER_OFFER_SHEET);
    broken.introMonth.eligibleTiers = ["TRAINING"];
    expect(MasterOfferSheetSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects an offer sheet that leaves a tier without any term", () => {
    const broken = structuredClone(MASTER_OFFER_SHEET);
    broken.terms = broken.terms.filter((term) => term.months !== 1);
    expect(MasterOfferSheetSchema.safeParse(broken).success).toBe(false);
  });
});

describe("offer copy", () => {
  const sheetText = JSON.stringify(MASTER_OFFER_SHEET);

  it("no longer offers cold plunge, red light, or cupping", () => {
    expect(sheetText).not.toMatch(/cold plunge|red light|cupping/i);
    for (const tier of USER_TIERS) {
      expect(
        MASTER_OFFER_SHEET.comparisonRows.find((r) => r.key === "recoveryAccess")
          ?.values[tier],
      ).toBe("Within coaching sessions");
    }
  });

  it("describes the biomarker panel as 160+ per year across two draws", () => {
    const row = MASTER_OFFER_SHEET.comparisonRows.find(
      (r) => r.key === "sponsoredBiomarkerPanel",
    );
    expect(row?.label).toBe(
      "Sponsored blood biomarker panel (160+ biomarkers per year across two draws)",
    );
    expect(sheetText).not.toMatch(/twice yearly|twice-yearly/i);
    expect(row?.values.TRAINING).toBe("Not included");
    expect(row?.values.ESSENTIALS).toBe("Not included");
  });

  it("gives TRAINING four sessions per month", () => {
    expect(
      MASTER_OFFER_SHEET.comparisonRows.find(
        (r) => r.key === "coachingSessionsPerWeek",
      )?.values.TRAINING,
    ).toBe("4 / month");
  });

  it("only prints the sponsored-testing paragraph for panel tiers", () => {
    const benefit = MASTER_OFFER_SHEET.policies.sponsoredTestingBenefit;
    expect(getTierCardHighlights("TRAINING")).not.toContain(benefit);
    expect(getTierCardHighlights("ESSENTIALS")).not.toContain(benefit);
    expect(getTierCardHighlights("CORE")).toContain(benefit);
    expect(getTierCardHighlights("TRAINING")).toContain(
      "Billing: month-to-month, no fixed term",
    );
  });
});
