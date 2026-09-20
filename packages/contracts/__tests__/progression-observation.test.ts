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


describe("progression correction and target persistence", () => {
  it("round trips revision clocks and deletion metadata without confusing performance dates", async () => {
    const { ProgressionEngineStateSchema } = await import("../progression/engine.js");
    const revisedAt = Date.UTC(2026, 8, 20);
    expect(BaselineEntrySchema.parse(JSON.parse(JSON.stringify({...entry, revisedAt}))).revisedAt).toBe(revisedAt);
    const state = {calibrationState: "no_data", rawBaselineScore: null, capacityScore: null, trainingTargetScore: null, uncertaintyPct: null, distinctSessionCount: 0, schemaVersion: 1, historyTombstones: {s: revisedAt}};
    expect(ProgressionEngineStateSchema.parse(JSON.parse(JSON.stringify(state))).historyTombstones).toEqual({s: revisedAt});
    expect(ProgressionEngineStateSchema.safeParse({...state, historyTombstones: {s: -1}}).success).toBe(false);
  });
  it("round trips the exact fatigue authoring basis and rejects nonfinite loads", async () => {
    const { SetTargetSnapshotSchema } = await import("../domain/training-session-log.js");
    const fatigueBasis = {schemaVersion: 1, capacityMultiplier: 0.8, weightKg: 100, reps: 10, appliedWeightKg: 90, appliedReps: 10};
    const snapshot = {setNumber: 1, weightKg: 90, reps: 10, rir: 2, isWarmup: false, fatigueBasis};
    expect(SetTargetSnapshotSchema.parse(JSON.parse(JSON.stringify(snapshot))).fatigueBasis).toEqual(fatigueBasis);
    expect(SetTargetSnapshotSchema.safeParse({...snapshot, fatigueBasis: {...fatigueBasis, weightKg: Infinity}}).success).toBe(false);
  });
});
