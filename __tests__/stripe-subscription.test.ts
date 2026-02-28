/**
 * @ai-context Stripe Subscription Contracts Tests | validates all subscription domain contracts
 *
 * This test suite verifies:
 * 1. SubscriptionSchema validates valid subscription data and rejects invalid
 * 2. CreateSubscriptionRequestSchema validates valid requests and rejects missing fields
 * 3. EarlyTerminationQuoteSchema validates valid quotes
 * 4. PauseSubscriptionRequestSchema validates valid pause requests
 * 5. TierChangeRequestSchema validates tier change data
 * 6. SUBSCRIPTION_STATUS tuple/constants contain all expected values
 * 7. CONTRACT_DURATION_MONTHS maps correctly
 * 8. CONTRACT_DURATION_DISCOUNTS has correct discount values
 *
 * Run: npx jest shared/contracts/__tests__/stripe-subscription.test.ts
 */

import {
    // Billing Source
    BILLING_SOURCES,
    BillingSourceSchema,
    CONTRACT_DURATION_DISCOUNTS,
    CONTRACT_DURATION_MONTHS,
    // Contract Duration
    CONTRACT_DURATIONS,
    ContractDurationSchema,
    CreateSubscriptionRequestSchema,
    EarlyTerminationQuoteSchema,
    PauseSubscriptionRequestSchema,
    STRIPE_SCHEDULE_STATUS,
    // Stripe Schedule Status
    STRIPE_SCHEDULE_STATUSES,
    SUBSCRIPTION_STATUS,
    // Subscription Status
    SUBSCRIPTION_STATUSES,
    // Schemas
    SubscriptionSchema,
    SubscriptionStatusSchema,
    TierChangeRequestSchema,
} from "../stripe/subscription";

// ============================================================================
// HELPERS
// ============================================================================

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_UUID_2 = "660e8400-e29b-41d4-a716-446655440001";
const NOW_ISO = new Date().toISOString();

function validSubscription() {
  return {
    id: VALID_UUID,
    userId: VALID_UUID_2,
    stripeSubscriptionId: "sub_1234567890",
    stripeCustomerId: "cus_1234567890",
    tier: "CORE" as const,
    status: "ACTIVE" as const,
    contractDuration: "MONTH_12" as const,
    contractStartDate: "2025-01-01",
    contractEndDate: "2026-01-01",
    discountPercent: 10,
    billingSource: "DIRECT" as const,
    billingOrganizationId: null,
    monthlyPriceInCents: 119900,
    currentPeriodStart: "2025-06-01",
    currentPeriodEnd: "2025-07-01",
    billingAnchorDay: 1,
    isInGracePeriod: false,
    gracePeriodEndsAt: null,
    isPaused: false,
    pausedAt: null,
    pauseResumeDate: null,
    pauseMonthsUsed: 0,
    pauseMonthsRemaining: 6,
    isCanceled: false,
    canceledAt: null,
    cancelEffectiveDate: null,
    scheduledTierChange: null,
    tierChangeEffectiveDate: null,
    signedContractKey: null,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

// ============================================================================
// SUBSCRIPTION STATUS TESTS
// ============================================================================

describe("Stripe Subscription Contracts", () => {
  describe("SubscriptionStatus", () => {
    describe("tuple values", () => {
      it("should contain exactly 8 values", () => {
        expect(SUBSCRIPTION_STATUSES).toHaveLength(8);
      });

      it("should contain all expected values", () => {
        expect(SUBSCRIPTION_STATUSES).toContain("PENDING");
        expect(SUBSCRIPTION_STATUSES).toContain("TRIAL");
        expect(SUBSCRIPTION_STATUSES).toContain("ACTIVE");
        expect(SUBSCRIPTION_STATUSES).toContain("PAUSED");
        expect(SUBSCRIPTION_STATUSES).toContain("PAST_DUE");
        expect(SUBSCRIPTION_STATUSES).toContain("CANCELED");
        expect(SUBSCRIPTION_STATUSES).toContain("TERMINATED");
        expect(SUBSCRIPTION_STATUSES).toContain("SUSPENDED");
      });
    });

    describe("schema validation", () => {
      it.each(SUBSCRIPTION_STATUSES)(
        "should accept valid value: %s",
        (value) => {
          const result = SubscriptionStatusSchema.safeParse(value);
          expect(result.success).toBe(true);
        },
      );

      it("should reject invalid values", () => {
        expect(SubscriptionStatusSchema.safeParse("invalid").success).toBe(
          false,
        );
        expect(SubscriptionStatusSchema.safeParse("active").success).toBe(
          false,
        ); // lowercase
        expect(SubscriptionStatusSchema.safeParse("").success).toBe(false);
        expect(SubscriptionStatusSchema.safeParse(123).success).toBe(false);
        expect(SubscriptionStatusSchema.safeParse(null).success).toBe(false);
        expect(SubscriptionStatusSchema.safeParse(undefined).success).toBe(
          false,
        );
      });
    });

    describe("constants object", () => {
      it("should have keys that map to tuple values", () => {
        expect(SUBSCRIPTION_STATUS.PENDING).toBe("PENDING");
        expect(SUBSCRIPTION_STATUS.TRIAL).toBe("TRIAL");
        expect(SUBSCRIPTION_STATUS.ACTIVE).toBe("ACTIVE");
        expect(SUBSCRIPTION_STATUS.PAUSED).toBe("PAUSED");
        expect(SUBSCRIPTION_STATUS.PAST_DUE).toBe("PAST_DUE");
        expect(SUBSCRIPTION_STATUS.CANCELED).toBe("CANCELED");
        expect(SUBSCRIPTION_STATUS.TERMINATED).toBe("TERMINATED");
        expect(SUBSCRIPTION_STATUS.SUSPENDED).toBe("SUSPENDED");
      });

      it("should have all values present in tuple", () => {
        const constantValues = Object.values(SUBSCRIPTION_STATUS);
        expect(constantValues).toHaveLength(8);
        for (const value of constantValues) {
          expect(SUBSCRIPTION_STATUSES).toContain(value);
        }
      });
    });
  });

  // ============================================================================
  // STRIPE SCHEDULE STATUS TESTS
  // ============================================================================

  describe("StripeScheduleStatus", () => {
    describe("tuple values", () => {
      it("should contain exactly 5 values", () => {
        expect(STRIPE_SCHEDULE_STATUSES).toHaveLength(5);
      });

      it("should contain all expected Stripe schedule statuses", () => {
        expect(STRIPE_SCHEDULE_STATUSES).toContain("not_started");
        expect(STRIPE_SCHEDULE_STATUSES).toContain("active");
        expect(STRIPE_SCHEDULE_STATUSES).toContain("completed");
        expect(STRIPE_SCHEDULE_STATUSES).toContain("released");
        expect(STRIPE_SCHEDULE_STATUSES).toContain("canceled");
      });
    });

    describe("constants object", () => {
      it("should map keys to Stripe schedule status values", () => {
        expect(STRIPE_SCHEDULE_STATUS.NOT_STARTED).toBe("not_started");
        expect(STRIPE_SCHEDULE_STATUS.ACTIVE).toBe("active");
        expect(STRIPE_SCHEDULE_STATUS.COMPLETED).toBe("completed");
        expect(STRIPE_SCHEDULE_STATUS.RELEASED).toBe("released");
        expect(STRIPE_SCHEDULE_STATUS.CANCELED).toBe("canceled");
      });
    });
  });

  // ============================================================================
  // CONTRACT DURATION TESTS
  // ============================================================================

  describe("ContractDuration", () => {
    describe("tuple values", () => {
      it("should contain exactly 3 durations", () => {
        expect(CONTRACT_DURATIONS).toHaveLength(3);
      });

      it("should contain all expected values", () => {
        expect(CONTRACT_DURATIONS).toContain("MONTH_4");
        expect(CONTRACT_DURATIONS).toContain("MONTH_8");
        expect(CONTRACT_DURATIONS).toContain("MONTH_12");
      });
    });

    describe("schema validation", () => {
      it.each(CONTRACT_DURATIONS)("should accept valid value: %s", (value) => {
        const result = ContractDurationSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it("should reject invalid values", () => {
        expect(ContractDurationSchema.safeParse("MONTH_1").success).toBe(false);
        expect(ContractDurationSchema.safeParse("MONTH_6").success).toBe(false);
        expect(ContractDurationSchema.safeParse("invalid").success).toBe(false);
        expect(ContractDurationSchema.safeParse(null).success).toBe(false);
      });
    });

    describe("CONTRACT_DURATION_MONTHS", () => {
      it("should map MONTH_4 to 4", () => {
        expect(CONTRACT_DURATION_MONTHS.MONTH_4).toBe(4);
      });

      it("should map MONTH_8 to 8", () => {
        expect(CONTRACT_DURATION_MONTHS.MONTH_8).toBe(8);
      });

      it("should map MONTH_12 to 12", () => {
        expect(CONTRACT_DURATION_MONTHS.MONTH_12).toBe(12);
      });

      it("should have an entry for every contract duration", () => {
        for (const duration of CONTRACT_DURATIONS) {
          expect(CONTRACT_DURATION_MONTHS[duration]).toBeDefined();
          expect(typeof CONTRACT_DURATION_MONTHS[duration]).toBe("number");
          expect(CONTRACT_DURATION_MONTHS[duration]).toBeGreaterThan(0);
        }
      });
    });

    describe("CONTRACT_DURATION_DISCOUNTS", () => {
      it("should have 5% discount for MONTH_4", () => {
        expect(CONTRACT_DURATION_DISCOUNTS.MONTH_4).toBe(5);
      });

      it("should have 10% discount for MONTH_8", () => {
        expect(CONTRACT_DURATION_DISCOUNTS.MONTH_8).toBe(10);
      });

      it("should have 15% discount for MONTH_12", () => {
        expect(CONTRACT_DURATION_DISCOUNTS.MONTH_12).toBe(15);
      });

      it("should have an entry for every contract duration", () => {
        for (const duration of CONTRACT_DURATIONS) {
          expect(CONTRACT_DURATION_DISCOUNTS[duration]).toBeDefined();
          expect(typeof CONTRACT_DURATION_DISCOUNTS[duration]).toBe("number");
          expect(CONTRACT_DURATION_DISCOUNTS[duration]).toBeGreaterThanOrEqual(
            0,
          );
        }
      });

      it("should have discounts that increase with longer durations", () => {
        expect(CONTRACT_DURATION_DISCOUNTS.MONTH_4).toBeLessThanOrEqual(
          CONTRACT_DURATION_DISCOUNTS.MONTH_8,
        );
        expect(CONTRACT_DURATION_DISCOUNTS.MONTH_8).toBeLessThanOrEqual(
          CONTRACT_DURATION_DISCOUNTS.MONTH_12,
        );
      });
    });
  });

  // ============================================================================
  // BILLING SOURCE TESTS
  // ============================================================================

  describe("BillingSource", () => {
    describe("tuple values", () => {
      it("should contain exactly 2 values", () => {
        expect(BILLING_SOURCES).toHaveLength(2);
      });

      it("should contain DIRECT and ORGANIZATION", () => {
        expect(BILLING_SOURCES).toContain("DIRECT");
        expect(BILLING_SOURCES).toContain("ORGANIZATION");
      });
    });

    describe("schema validation", () => {
      it.each(BILLING_SOURCES)("should accept valid value: %s", (value) => {
        const result = BillingSourceSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it("should reject invalid values", () => {
        expect(BillingSourceSchema.safeParse("INVOICE").success).toBe(false);
        expect(BillingSourceSchema.safeParse("direct").success).toBe(false); // lowercase
        expect(BillingSourceSchema.safeParse(null).success).toBe(false);
      });
    });
  });

  // ============================================================================
  // SUBSCRIPTION SCHEMA TESTS
  // ============================================================================

  describe("SubscriptionSchema", () => {
    describe("valid objects", () => {
      it("should accept a fully valid subscription", () => {
        const result = SubscriptionSchema.safeParse(validSubscription());
        expect(result.success).toBe(true);
      });

      it("should accept subscription with paused state", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          status: "PAUSED",
          isPaused: true,
          pausedAt: NOW_ISO,
          pauseResumeDate: "2025-09-01",
          pauseMonthsUsed: 2,
          pauseMonthsRemaining: 4,
        });
        expect(result.success).toBe(true);
      });

      it("should accept subscription with cancellation", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          status: "CANCELED",
          isCanceled: true,
          canceledAt: NOW_ISO,
          cancelEffectiveDate: "2025-12-31",
        });
        expect(result.success).toBe(true);
      });

      it("should accept subscription with organization billing", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          billingSource: "ORGANIZATION",
          billingOrganizationId: VALID_UUID,
        });
        expect(result.success).toBe(true);
      });

      it("should accept subscription with scheduled tier change", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          scheduledTierChange: "CONCIERGE",
          tierChangeEffectiveDate: "2025-08-01",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("invalid objects", () => {
      it("should reject invalid UUID for id", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          id: "not-a-uuid",
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid status", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          status: "UNKNOWN_STATUS",
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid tier", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          tier: "PLATINUM",
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid contract duration", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          contractDuration: "MONTH_6",
        });
        expect(result.success).toBe(false);
      });

      it("should reject billingAnchorDay outside 1-28", () => {
        const tooLow = SubscriptionSchema.safeParse({
          ...validSubscription(),
          billingAnchorDay: 0,
        });
        expect(tooLow.success).toBe(false);

        const tooHigh = SubscriptionSchema.safeParse({
          ...validSubscription(),
          billingAnchorDay: 29,
        });
        expect(tooHigh.success).toBe(false);
      });

      it("should reject non-integer monthlyPriceInCents", () => {
        const result = SubscriptionSchema.safeParse({
          ...validSubscription(),
          monthlyPriceInCents: 119.99,
        });
        expect(result.success).toBe(false);
      });

      it("should reject missing required fields", () => {
        const result = SubscriptionSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it("should reject null", () => {
        expect(SubscriptionSchema.safeParse(null).success).toBe(false);
      });

      it("should reject undefined", () => {
        expect(SubscriptionSchema.safeParse(undefined).success).toBe(false);
      });
    });
  });

  // ============================================================================
  // CREATE SUBSCRIPTION REQUEST TESTS
  // ============================================================================

  describe("CreateSubscriptionRequestSchema", () => {
    const validRequest = {
      userId: VALID_UUID,
      tier: "CORE" as const,
      contractDuration: "MONTH_12" as const,
    };

    describe("valid objects", () => {
      it("should accept request with required fields only", () => {
        const result = CreateSubscriptionRequestSchema.safeParse(validRequest);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.billingSource).toBe("DIRECT"); // default
        }
      });

      it("should accept request with all optional fields", () => {
        const result = CreateSubscriptionRequestSchema.safeParse({
          ...validRequest,
          billingSource: "ORGANIZATION",
          billingOrganizationId: VALID_UUID_2,
          paymentMethodId: "pm_1234567890",
        });
        expect(result.success).toBe(true);
      });

      it("should default billingSource to DIRECT when omitted", () => {
        const result = CreateSubscriptionRequestSchema.safeParse(validRequest);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.billingSource).toBe("DIRECT");
        }
      });

      it.each(["ESSENTIALS", "CORE", "CONCIERGE"] as const)(
        "should accept tier: %s",
        (tier) => {
          const result = CreateSubscriptionRequestSchema.safeParse({
            ...validRequest,
            tier,
          });
          expect(result.success).toBe(true);
        },
      );

      it.each(CONTRACT_DURATIONS)(
        "should accept contract duration: %s",
        (duration) => {
          const result = CreateSubscriptionRequestSchema.safeParse({
            ...validRequest,
            contractDuration: duration,
          });
          expect(result.success).toBe(true);
        },
      );
    });

    describe("invalid objects", () => {
      it("should reject missing userId", () => {
        const { userId: _u, ...rest } = validRequest;
        const result = CreateSubscriptionRequestSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it("should reject missing tier", () => {
        const { tier: _t, ...rest } = validRequest;
        const result = CreateSubscriptionRequestSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it("should reject missing contractDuration", () => {
        const { contractDuration: _c, ...rest } = validRequest;
        const result = CreateSubscriptionRequestSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it("should reject invalid userId (not UUID)", () => {
        const result = CreateSubscriptionRequestSchema.safeParse({
          ...validRequest,
          userId: "not-a-uuid",
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid tier", () => {
        const result = CreateSubscriptionRequestSchema.safeParse({
          ...validRequest,
          tier: "PLATINUM",
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid billingOrganizationId (not UUID)", () => {
        const result = CreateSubscriptionRequestSchema.safeParse({
          ...validRequest,
          billingOrganizationId: "not-a-uuid",
        });
        expect(result.success).toBe(false);
      });

      it("should reject empty object", () => {
        const result = CreateSubscriptionRequestSchema.safeParse({});
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // EARLY TERMINATION QUOTE TESTS
  // ============================================================================

  describe("EarlyTerminationQuoteSchema", () => {
    const validQuote = {
      subscriptionId: VALID_UUID,
      remainingMonths: 6,
      monthlyPriceInCents: 119900,
      remainingDueInCents: 719400,
      terminationFeeInCents: 359700,
      effectiveImmediately: true,
    };

    describe("valid objects", () => {
      it("should accept a valid early termination quote", () => {
        const result = EarlyTerminationQuoteSchema.safeParse(validQuote);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.subscriptionId).toBe(VALID_UUID);
          expect(result.data.remainingMonths).toBe(6);
          expect(result.data.terminationFeeInCents).toBe(359700);
        }
      });

      it("should accept quote with zero remaining months", () => {
        const result = EarlyTerminationQuoteSchema.safeParse({
          ...validQuote,
          remainingMonths: 0,
          remainingDueInCents: 0,
          terminationFeeInCents: 0,
        });
        expect(result.success).toBe(true);
      });

      it("should accept quote where effectiveImmediately is false", () => {
        const result = EarlyTerminationQuoteSchema.safeParse({
          ...validQuote,
          effectiveImmediately: false,
        });
        expect(result.success).toBe(true);
      });
    });

    describe("invalid objects", () => {
      it("should reject missing subscriptionId", () => {
        const { subscriptionId: _s, ...rest } = validQuote;
        const result = EarlyTerminationQuoteSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it("should reject invalid subscriptionId (not UUID)", () => {
        const result = EarlyTerminationQuoteSchema.safeParse({
          ...validQuote,
          subscriptionId: "not-a-uuid",
        });
        expect(result.success).toBe(false);
      });

      it("should reject non-integer monthlyPriceInCents", () => {
        const result = EarlyTerminationQuoteSchema.safeParse({
          ...validQuote,
          monthlyPriceInCents: 119.99,
        });
        expect(result.success).toBe(false);
      });

      it("should reject empty object", () => {
        const result = EarlyTerminationQuoteSchema.safeParse({});
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // PAUSE SUBSCRIPTION REQUEST TESTS
  // ============================================================================

  describe("PauseSubscriptionRequestSchema", () => {
    describe("valid objects", () => {
      it("should accept valid pause request with months only", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: 3,
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid pause request with reason", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: 1,
          reason: "Going on vacation",
        });
        expect(result.success).toBe(true);
      });

      it("should accept minimum pause months (1)", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: 1,
        });
        expect(result.success).toBe(true);
      });

      it("should accept maximum pause months (6)", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: 6,
        });
        expect(result.success).toBe(true);
      });
    });

    describe("invalid objects", () => {
      it("should reject pauseMonths less than 1", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: 0,
        });
        expect(result.success).toBe(false);
      });

      it("should reject pauseMonths greater than 6", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: 7,
        });
        expect(result.success).toBe(false);
      });

      it("should reject non-integer pauseMonths", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: 2.5,
        });
        expect(result.success).toBe(false);
      });

      it("should reject negative pauseMonths", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          pauseMonths: -1,
        });
        expect(result.success).toBe(false);
      });

      it("should reject missing pauseMonths", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it("should reject missing pauseMonths with only reason", () => {
        const result = PauseSubscriptionRequestSchema.safeParse({
          reason: "Travel",
        });
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // TIER CHANGE REQUEST TESTS
  // ============================================================================

  describe("TierChangeRequestSchema", () => {
    describe("valid objects", () => {
      it("should accept tier change with newTier only", () => {
        const result = TierChangeRequestSchema.safeParse({
          newTier: "CONCIERGE",
        });
        expect(result.success).toBe(true);
      });

      it("should accept tier change with effectiveDate", () => {
        const result = TierChangeRequestSchema.safeParse({
          newTier: "ESSENTIALS",
          effectiveDate: "2025-08-01",
        });
        expect(result.success).toBe(true);
      });

      it.each(["ESSENTIALS", "CORE", "CONCIERGE"] as const)(
        "should accept tier: %s",
        (tier) => {
          const result = TierChangeRequestSchema.safeParse({ newTier: tier });
          expect(result.success).toBe(true);
        },
      );
    });

    describe("invalid objects", () => {
      it("should reject missing newTier", () => {
        const result = TierChangeRequestSchema.safeParse({});
        expect(result.success).toBe(false);
      });

      it("should reject invalid tier", () => {
        const result = TierChangeRequestSchema.safeParse({
          newTier: "PLATINUM",
        });
        expect(result.success).toBe(false);
      });

      it("should reject lowercase tier", () => {
        const result = TierChangeRequestSchema.safeParse({ newTier: "core" });
        expect(result.success).toBe(false);
      });

      it("should reject null", () => {
        const result = TierChangeRequestSchema.safeParse(null);
        expect(result.success).toBe(false);
      });
    });
  });
});
