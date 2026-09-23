import { BaselineEntrySchema } from "../progression/baseline";

const entry = {
  sessionId: "s1",
  date: "2026-09-20T00:00:00.000Z",
  weightKg: 100,
  reps: 5,
  rir: 0,
  e1rm: 116,
  e1rmFormula: "epley" as const,
  isOutlier: false,
  goEasier: false,
};
const observation = { effectiveLoadKg: 100, rir: null, capacityMultiplier: 1, bodyWeightKg: null };

describe("BaselineEntry.observation prescription", () => {
  it("round-trips prescribedReps and prescribedRir instead of stripping them", () => {
    const parsed = BaselineEntrySchema.parse({
      ...entry,
      observation: { ...observation, prescribedReps: 10, prescribedRir: 2 },
    });
    expect(parsed.observation).toMatchObject({ prescribedReps: 10, prescribedRir: 2 });
  });

  it("still accepts observations without a prescription", () => {
    expect(BaselineEntrySchema.parse({ ...entry, observation }).observation).toEqual(observation);
  });

  it("rejects an out-of-range prescribed RIR", () => {
    expect(() =>
      BaselineEntrySchema.parse({ ...entry, observation: { ...observation, prescribedRir: 11 } }),
    ).toThrow();
  });
});
