import {
  CustomerSubscriptionSchema,
  toCustomerSubscription,
} from "../stripe/account";
import type { SubscriptionContract } from "../stripe/subscription";

const base = {
  id: "7d0f8a2e-5c1b-4b8e-9a51-0c6f2f3d4e5a",
  tier: "CORE",
  status: "ACTIVE",
  contractDuration: "MONTH_4",
  contractStartDate: "2026-10-17",
  contractEndDate: "2027-02-16",
  discountPercent: 0,
  billingSource: "DIRECT",
  monthlyPriceInCents: 100000,
  currentPeriodStart: "2026-10-17",
  currentPeriodEnd: "2026-11-16",
  billingAnchorDay: 17,
  isInGracePeriod: false,
  gracePeriodEndsAt: null,
  isPaused: false,
  pausedAt: null,
  pauseResumeDate: null,
  isCanceled: false,
  canceledAt: null,
  cancelEffectiveDate: null,
  scheduledTierChange: null,
  tierChangeEffectiveDate: null,
  createdAt: "2026-10-17T00:00:00.000Z",
};

describe("customer subscription intro-month fields", () => {
  it("passes the intro window end date through to the customer contract", () => {
    const customer = toCustomerSubscription({
      ...base,
      stripeSubscriptionId: "sub_123",
      introMonthElected: true,
      introWindowEndsAt: "2026-11-15",
    } as unknown as SubscriptionContract);
    expect(customer.introMonthElected).toBe(true);
    expect(customer.introWindowEndsAt).toBe("2026-11-15");
    expect(customer).not.toHaveProperty("stripeSubscriptionId");
  });

  it("defaults to no intro month when the source subscription has none", () => {
    const customer = toCustomerSubscription(
      base as unknown as SubscriptionContract,
    );
    expect(customer.introMonthElected).toBe(false);
    expect(customer.introWindowEndsAt).toBeNull();
  });

  it("still accepts responses from servers that omit the intro fields", () => {
    const parsed = CustomerSubscriptionSchema.safeParse(base);
    expect(parsed.success).toBe(true);
  });
});
