/**
 * @ai-context Tests for canonical metric code constants and known metric registry
 */

import {
    KNOWN_METRIC_CODES,
    METRIC_FASTING_GLUCOSE,
} from "../domain/metric-codes";

describe("metric-codes contracts", () => {
  it("exports fasting glucose as a canonical constant", () => {
    expect(METRIC_FASTING_GLUCOSE).toBe("fasting_glucose");
  });

  it("includes fasting glucose in known metric codes", () => {
    expect(KNOWN_METRIC_CODES).toContain(METRIC_FASTING_GLUCOSE);
  });
});
