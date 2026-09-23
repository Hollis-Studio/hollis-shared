import { SetTargetSnapshotSchema } from "../domain/training-session-log";

const base = { setNumber: 1, weightKg: 90, reps: 12, rir: 2, isWarmup: false };
const chosenLoadBasis = {
  row: {
    weightKg: 100,
    reps: 8,
    rir: 2,
    fatigueBasis: { schemaVersion: 1 as const, weightKg: 100, reps: 8, appliedWeightKg: 100, appliedReps: 8 },
  },
  applied: { weightKg: 90, reps: 12, rir: 2 },
};

describe("SetTargetSnapshot.chosenLoadBasis", () => {
  it("round-trips instead of being stripped", () => {
    expect(SetTargetSnapshotSchema.parse({ ...base, chosenLoadBasis }).chosenLoadBasis).toEqual(
      chosenLoadBasis,
    );
  });

  it("accepts a blank authored load and stays optional", () => {
    const blank = { ...chosenLoadBasis, row: { weightKg: null, reps: 8, rir: 2 } };
    expect(SetTargetSnapshotSchema.safeParse({ ...base, chosenLoadBasis: blank }).success).toBe(true);
    expect(SetTargetSnapshotSchema.parse(base).chosenLoadBasis).toBeUndefined();
  });

  it("rejects an out-of-range applied RIR", () => {
    const bad = { ...chosenLoadBasis, applied: { weightKg: 90, reps: 12, rir: 11 } };
    expect(SetTargetSnapshotSchema.safeParse({ ...base, chosenLoadBasis: bad }).success).toBe(false);
  });
});
