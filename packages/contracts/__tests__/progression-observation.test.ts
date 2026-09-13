import { describe, expect, it } from "@jest/globals";
import { BaselineEntrySchema } from "../progression/baseline.js";

const entry = {
  sessionId: "s",
  date: new Date(),
  weightKg: 0,
  reps: 10,
  rir: 0,
  e1rm: 100,
  e1rmFormula: "epley",
  isOutlier: false,
  goEasier: false,
};
describe("progression observation persistence", () => {
  it("retains missing effort and total load across a JSON round trip", () => {
    const observation = {
      effectiveLoadKg: 80,
      rir: null,
      capacityMultiplier: 0.8,
      bodyWeightKg: 80,
    };
    expect(
      BaselineEntrySchema.parse(
        JSON.parse(JSON.stringify({ ...entry, observation })),
      ).observation,
    ).toEqual(observation);
    expect(BaselineEntrySchema.parse(entry).observation).toBeUndefined();
  });
  it("rejects invalid capacity transformations", () => {
    for (const capacityMultiplier of [0, -1, 1.1, NaN, Infinity]) {
      expect(
        BaselineEntrySchema.safeParse({
          ...entry,
          observation: {
            effectiveLoadKg: 80,
            rir: null,
            capacityMultiplier,
            bodyWeightKg: 80,
          },
        }).success,
      ).toBe(false);
    }
  });
});
