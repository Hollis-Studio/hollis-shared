/**
 * @ai-context Cost-estimation tests for ai/pricing.ts (workouts #62).
 *
 * Pins the two properties the Workouts cost telemetry depends on:
 *   1. DEFAULT_PRICING over-estimates — an unattributed row can never look
 *      cheaper than the most expensive real model, long-context tiers included.
 *   2. The long-context tier is applied ONLY to the sub-bucket the recorder
 *      classified per request, never inferred from a monthly aggregate.
 */

import {
  DEFAULT_PRICING,
  MODEL_PRICING,
  estimateCostUsd,
  estimateCostUsdDetailed,
  estimateUsageCostUsd,
  longContextThresholdFor,
} from "../pricing.js";

const PRO = "gemini-3.1-pro-preview";
const FLASH = "gemini-3.7-flash";
const LITE = "gemini-3.1-flash-lite";

describe("DEFAULT_PRICING over-estimate invariant", () => {
  it("is at least as expensive as every rate in MODEL_PRICING", () => {
    for (const price of Object.values(MODEL_PRICING)) {
      const maxInput = Math.max(
        price.inputPerMillion,
        price.longContextInputPerMillion ?? 0,
        price.audioInputPerMillion ?? 0,
      );
      const maxOutput = Math.max(price.outputPerMillion, price.longContextOutputPerMillion ?? 0);
      expect(DEFAULT_PRICING.inputPerMillion).toBeGreaterThanOrEqual(maxInput);
      expect(DEFAULT_PRICING.outputPerMillion).toBeGreaterThanOrEqual(maxOutput);
      expect(DEFAULT_PRICING.cacheStoragePerMillionPerHour ?? 0).toBeGreaterThanOrEqual(
        price.cacheStoragePerMillionPerHour ?? 0,
      );
    }
  });

  it("prices an unknown model off DEFAULT_PRICING", () => {
    expect(estimateCostUsd(1_000_000, 0, "no-such-model")).toBeCloseTo(
      DEFAULT_PRICING.inputPerMillion,
      10,
    );
  });
});

describe("longContextThresholdFor", () => {
  it("reports the tier boundary only for models that have one", () => {
    expect(longContextThresholdFor(PRO)).toBe(200_000);
    expect(longContextThresholdFor(FLASH)).toBeUndefined();
  });
});

describe("estimateUsageCostUsd — token classes", () => {
  it("charges cache hits at the cache rate, not the input rate", () => {
    const flat = estimateUsageCostUsd({ input: 1_000_000, output: 0 }, FLASH);
    const cached = estimateUsageCostUsd(
      { input: 1_000_000, output: 0, cachedInput: 1_000_000 },
      FLASH,
    );
    expect(flat).toBeCloseTo(0.75, 10);
    expect(cached).toBeCloseTo(0.075, 10);
  });

  it("charges audio apart on a model that prices audio, and as input where it does not", () => {
    const lite = estimateUsageCostUsd({ input: 1_000_000, output: 0, audioInput: 1_000_000 }, LITE);
    expect(lite).toBeCloseTo(0.5, 10);
    const flash = estimateUsageCostUsd(
      { input: 1_000_000, output: 0, audioInput: 1_000_000 },
      FLASH,
    );
    expect(flash).toBeCloseTo(0.75, 10);
  });

  it("treats imageInput as attribution only — it does not change the price", () => {
    const withImage = estimateUsageCostUsd(
      { input: 1_000_000, output: 0, imageInput: 400_000 },
      FLASH,
    );
    expect(withImage).toBeCloseTo(0.75, 10);
  });

  it("keeps the classes as SUBSETS of input (remainder is charged at the plain rate)", () => {
    const cost = estimateUsageCostUsd({ input: 1_000_000, output: 0, cachedInput: 250_000 }, FLASH);
    expect(cost).toBeCloseTo(0.75 * 0.75 + 0.075 * 0.25, 10);
  });
});

describe("estimateUsageCostUsd — long-context tier", () => {
  it("does NOT infer the tier from a monthly aggregate that merely sums past the threshold", () => {
    const aggregate = estimateUsageCostUsd({ input: 500_000, output: 0 }, PRO);
    expect(aggregate).toBeCloseTo(1.0, 10);
  });

  it("prices the recorder-classified long-context sub-bucket at the long-context rate", () => {
    const cost = estimateUsageCostUsd(
      { input: 500_000, output: 100_000, longContext: { input: 300_000, output: 60_000 } },
      PRO,
    );
    const expected =
      (200_000 / 1_000_000) * 2.0 +
      (40_000 / 1_000_000) * 12.0 +
      (300_000 / 1_000_000) * 4.0 +
      (60_000 / 1_000_000) * 18.0;
    expect(cost).toBeCloseTo(expected, 10);
  });

  it("prices long-context cache hits at the long-context cached rate", () => {
    const cost = estimateUsageCostUsd(
      {
        input: 100_000,
        output: 0,
        cachedInput: 100_000,
        longContext: { input: 100_000, output: 0, cachedInput: 100_000 },
      },
      PRO,
    );
    expect(cost).toBeCloseTo((100_000 / 1_000_000) * 0.4, 10);
  });

  it("clamps a long-context bucket that over-reports against its parent totals", () => {
    const cost = estimateUsageCostUsd(
      { input: 100, output: 10, longContext: { input: 10_000, output: 10_000 } },
      PRO,
    );
    const clamped = estimateUsageCostUsd(
      { input: 100, output: 10, longContext: { input: 100, output: 10 } },
      PRO,
    );
    expect(cost).toBeCloseTo(clamped, 10);
  });

  it("is byte-identical to estimateCostUsd for a row with no breakdown at all", () => {
    expect(estimateUsageCostUsd({ input: 12_345, output: 678 }, FLASH)).toBe(
      estimateCostUsd(12_345, 678, FLASH),
    );
  });
});

describe("estimateCostUsdDetailed", () => {
  it("switches tiers on the per-request prompt size", () => {
    const short = estimateCostUsdDetailed({ inputTokens: 100_000, outputTokens: 0 }, PRO);
    const long = estimateCostUsdDetailed({ inputTokens: 300_000, outputTokens: 0 }, PRO);
    expect(short).toBeCloseTo(0.2, 10);
    expect(long).toBeCloseTo(1.2, 10);
  });

  it("bills context-cache storage token-hours when the model prices them", () => {
    const cost = estimateCostUsdDetailed(
      { inputTokens: 0, outputTokens: 0, cacheStorageTokenHours: 1_000_000 },
      FLASH,
    );
    expect(cost).toBeCloseTo(0.5, 10);
  });
});
