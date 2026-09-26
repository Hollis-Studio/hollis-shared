import {
  ActiveTrainingSessionLogSchema,
  LEGACY_SET_TOMBSTONE_PREFIX,
  SESSION_TOMBSTONES_MAX,
  TrainingSessionLogSchema,
  encodeLegacySessionTombstones,
  normalizeSessionTombstones,
} from "../domain/training-session-log";

const now = new Date("2026-09-25T12:00:00.000Z");
const base = {
  id: "session-1",
  userId: "user-1",
  programId: null,
  programDayName: null,
  gymProfileId: null,
  startedAt: now,
  completedAt: null,
  isFreestyle: true,
  isSubstitution: false,
  status: "active" as const,
  questionnaire: {
    sleepHours: 8,
    sleepQuality: 4,
    energyLevel: 4,
    stressLevel: 1,
    sorenessLevel: 2,
    hitMacrosYesterday: true,
    hydrationLevel: 4,
    goEasier: false,
    autoFilledSleep: false,
  },
  totalVolumeKg: 0,
  durationMinutes: 0,
  exercises: [],
};
const ids = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index}`);

describe("TrainingSessionLog.deletedSetIds", () => {
  it("round-trips instead of being stripped, and stays absent when omitted", () => {
    expect(ActiveTrainingSessionLogSchema.parse({ ...base, deletedSetIds: ["set-a"] }).deletedSetIds)
      .toEqual(["set-a"]);
    expect(ActiveTrainingSessionLogSchema.parse(base).deletedSetIds).toBeUndefined();
  });

  it("is carried by the completed-session schema too", () => {
    const exercise = {
      canonicalExerciseId: "barbell_bench_press",
      freestyleName: null,
      freestyleMuscleGroups: null,
      gymExerciseInstanceId: null,
      order: 0,
      sets: [],
      isFromProgram: false,
      // Completed-session exercises must carry a canonicalization outcome.
      canonicalizationStatus: "matched" as const,
    };
    const parsed = TrainingSessionLogSchema.safeParse({
      ...base,
      status: "completed",
      completedAt: now,
      exercises: [exercise],
      deletedSetIds: ["set-a"],
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.deletedSetIds).toEqual(["set-a"]);
  });

  it("rejects empty ids and non-strings", () => {
    expect(ActiveTrainingSessionLogSchema.safeParse({ ...base, deletedSetIds: [""] }).success).toBe(false);
    expect(ActiveTrainingSessionLogSchema.safeParse({ ...base, deletedSetIds: [42] }).success).toBe(false);
  });

  it("accepts exactly the cap and rejects one more, on both tombstone arrays", () => {
    const atCap = ids("x", SESSION_TOMBSTONES_MAX);
    const overCap = ids("x", SESSION_TOMBSTONES_MAX + 1);
    for (const field of ["deletedSetIds", "deletedExerciseSlotIds"] as const) {
      expect(ActiveTrainingSessionLogSchema.safeParse({ ...base, [field]: atCap }).success).toBe(true);
      expect(ActiveTrainingSessionLogSchema.safeParse({ ...base, [field]: overCap }).success).toBe(false);
    }
  });

  it("still parses legacy set: entries inside deletedExerciseSlotIds", () => {
    const legacy = ["slot-a", `${LEGACY_SET_TOMBSTONE_PREFIX}set-b`];
    expect(ActiveTrainingSessionLogSchema.parse({ ...base, deletedExerciseSlotIds: legacy })
      .deletedExerciseSlotIds).toEqual(legacy);
  });
});

describe("normalizeSessionTombstones", () => {
  it("moves legacy set: entries to deletedSetIds and keeps slot ids pure", () => {
    expect(
      normalizeSessionTombstones({ deletedExerciseSlotIds: ["slot-a", "set:b", "slot-c"] }),
    ).toEqual({ deletedExerciseSlotIds: ["slot-a", "slot-c"], deletedSetIds: ["b"] });
  });

  it("unions sources in order, first position wins, legacy and new encodings dedupe", () => {
    const stored = { deletedExerciseSlotIds: ["slot-a", "set:x"], deletedSetIds: ["y"] };
    const incoming = { deletedExerciseSlotIds: ["slot-b", "slot-a"], deletedSetIds: ["x", "z"] };
    expect(normalizeSessionTombstones(stored, incoming)).toEqual({
      deletedExerciseSlotIds: ["slot-a", "slot-b"],
      deletedSetIds: ["x", "y", "z"],
    });
  });

  it("drops empty ids, including a bare prefix", () => {
    expect(normalizeSessionTombstones({ deletedExerciseSlotIds: ["", "set:"], deletedSetIds: [""] }))
      .toEqual({ deletedExerciseSlotIds: [], deletedSetIds: [] });
  });

  it("tolerates missing, null and undefined sources", () => {
    expect(normalizeSessionTombstones(undefined, null, {}, { deletedSetIds: null })).toEqual({
      deletedExerciseSlotIds: [],
      deletedSetIds: [],
    });
  });

  it("keeps the newest entries when the union exceeds the cap", () => {
    const stored = { deletedSetIds: ids("old", SESSION_TOMBSTONES_MAX) };
    const incoming = { deletedSetIds: ["new-1", "new-2"] };
    const { deletedSetIds } = normalizeSessionTombstones(stored, incoming);
    expect(deletedSetIds).toHaveLength(SESSION_TOMBSTONES_MAX);
    expect(deletedSetIds.slice(-2)).toEqual(["new-1", "new-2"]);
    expect(deletedSetIds).not.toContain("old-0");
    expect(deletedSetIds).not.toContain("old-1");
  });

  it("is idempotent", () => {
    const once = normalizeSessionTombstones({ deletedExerciseSlotIds: ["slot-a", "set:b"], deletedSetIds: ["c"] });
    expect(normalizeSessionTombstones(once)).toEqual(once);
  });
});

describe("encodeLegacySessionTombstones", () => {
  it("lists slots, then each set id under the legacy prefix", () => {
    expect(encodeLegacySessionTombstones({ deletedExerciseSlotIds: ["slot-a"], deletedSetIds: ["b", "c"] }))
      .toEqual(["slot-a", "set:b", "set:c"]);
  });

  it("is empty for an empty value", () => {
    expect(encodeLegacySessionTombstones({ deletedExerciseSlotIds: [], deletedSetIds: [] })).toEqual([]);
  });

  it("round-trips through normalizeSessionTombstones", () => {
    const canonical = { deletedExerciseSlotIds: ["slot-a"], deletedSetIds: ["b", "c"] };
    expect(normalizeSessionTombstones({ deletedExerciseSlotIds: encodeLegacySessionTombstones(canonical) }))
      .toEqual(canonical);
  });

  it("stays within the cap: slots first, then the newest set ids that fit", () => {
    const slots = ids("slot", SESSION_TOMBSTONES_MAX - 2);
    const encoded = encodeLegacySessionTombstones({ deletedExerciseSlotIds: slots, deletedSetIds: ["a", "b", "c"] });
    expect(encoded).toHaveLength(SESSION_TOMBSTONES_MAX);
    expect(encoded.slice(-2)).toEqual(["set:b", "set:c"]);
    expect(ActiveTrainingSessionLogSchema.safeParse({ ...base, deletedExerciseSlotIds: encoded }).success).toBe(true);
  });

  it("emits no set entries when the slots alone fill the cap", () => {
    const slots = ids("slot", SESSION_TOMBSTONES_MAX);
    expect(encodeLegacySessionTombstones({ deletedExerciseSlotIds: slots, deletedSetIds: ["a"] })).toEqual(slots);
  });
});
