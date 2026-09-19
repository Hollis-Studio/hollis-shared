import {
  SessionExerciseSchema,
  SetTargetSnapshotSchema,
} from "../domain/training-session-log.js";

const base = { setNumber: 1, weightKg: 60, reps: 8, rir: 2, isWarmup: false };

describe("SetTargetSnapshotSchema superset stamps (alpha.77)", () => {
  it("parses a legacy snapshot without stamps unchanged", () => {
    const parsed = SetTargetSnapshotSchema.parse(base);
    expect(parsed.setType).toBeUndefined();
    expect(parsed.setGroupId).toBeUndefined();
    expect(parsed.originExerciseId).toBeUndefined();
  });

  it("round-trips setType / setGroupId / originExerciseId", () => {
    const stamped = {
      ...base,
      setType: "superset" as const,
      setGroupId: "grp-1",
      originExerciseId: "ex-curl",
    };
    expect(SetTargetSnapshotSchema.parse(stamped)).toMatchObject(stamped);
  });

  it("accepts null group / origin and rejects unknown set types", () => {
    expect(
      SetTargetSnapshotSchema.parse({ ...base, setGroupId: null, originExerciseId: null }),
    ).toMatchObject({ setGroupId: null, originExerciseId: null });
    expect(SetTargetSnapshotSchema.safeParse({ ...base, setType: "giant" }).success).toBe(false);
  });
});

describe("session progression ownership and provenance", () => {
  it("round-trips athlete-owned load while legacy snapshots remain valid", () => {
    expect(SetTargetSnapshotSchema.parse(base).loadIsUserOwned).toBeUndefined();
    expect(SetTargetSnapshotSchema.parse({ ...base, loadIsUserOwned: true })).toMatchObject({
      loadIsUserOwned: true,
    });
  });

  it("retains a program row's mode and target source through the wire schema", () => {
    const exercise = {
      slotId: "slot-1",
      canonicalExerciseId: "bench",
      freestyleName: null,
      freestyleMuscleGroups: null,
      gymExerciseInstanceId: null,
      order: 0,
      sets: [],
      isFromProgram: true,
      prescribedGoalMode: "progress" as const,
      targetSource: "engine" as const,
      canonicalizationStatus: "matched" as const,
      cardioData: null,
      stretchData: null,
      originalTargets: [{ ...base, loadIsUserOwned: true }],
    };
    expect(SessionExerciseSchema.parse(exercise)).toMatchObject(exercise);
  });
});
