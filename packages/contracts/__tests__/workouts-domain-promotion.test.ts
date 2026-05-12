import {
  CardioSessionDataSchema,
  EQUIPMENT_TYPES,
  EquipmentTypeSchema,
  MUSCLE_GROUPS,
  MuscleGroupSchema,
  TrainingSessionLogSchema,
  UserProfileSchema,
} from "../domain";
import {
  BaselineEntrySchema,
  BestQualifyingSetSchema,
  CardioBaselineSchema,
  ConfidenceBandSchema,
  GatedE1RMSampleSchema,
  MetricBasketSnapshotSchema,
  ProgramSchema,
  ProgressionBaselineSchema,
  RelativeStrengthScoreSchema,
  RepRangePivotSchema,
  SessionExerciseSchema,
  WeeklyHardSetsEntrySchema,
} from "../progression";

const now = new Date("2026-05-12T12:00:00.000Z");

describe("Workouts domain promotion", () => {
  it("preserves Workouts muscle groups and rejects unknown groups", () => {
    expect(MUSCLE_GROUPS).toHaveLength(23);
    expect(MuscleGroupSchema.parse("lats")).toBe("lats");
    expect(MuscleGroupSchema.safeParse("cable_machine").success).toBe(false);
  });

  it("merges equipment with cable as the canonical cable value", () => {
    expect(EQUIPMENT_TYPES).toContain("cable");
    expect(EQUIPMENT_TYPES).not.toContain("cable_machine");
    expect(EquipmentTypeSchema.parse("treadmill")).toBe("treadmill");
    expect(EquipmentTypeSchema.safeParse("cable_machine").success).toBe(false);
  });

  it("parses cardio session data and rejects invalid heart rate", () => {
    const valid = {
      durationSeconds: 1800,
      distanceKm: 5,
      avgSpeedKmh: 10,
      avgHeartRate: 150,
      maxHeartRate: 180,
      incline: 1,
      resistance: null,
      caloriesBurned: 300,
      mets: 8,
    };

    expect(CardioSessionDataSchema.parse(valid).durationSeconds).toBe(1800);
    expect(CardioSessionDataSchema.safeParse({ ...valid, avgHeartRate: 10 }).success).toBe(false);
  });

  it("enforces SessionExercise canonicalization status refinement", () => {
    const valid = {
      canonicalExerciseId: "ex-1",
      freestyleName: null,
      freestyleMuscleGroups: null,
      gymExerciseInstanceId: null,
      order: 0,
      sets: [],
      isFromProgram: true,
      canonicalizationStatus: "matched",
      cardioData: null,
      stretchData: null,
    };

    expect(SessionExerciseSchema.safeParse(valid).success).toBe(true);
    expect(
      SessionExerciseSchema.safeParse({
        ...valid,
        canonicalExerciseId: null,
        canonicalizationStatus: "matched",
      }).success,
    ).toBe(false);
  });

  it("parses TrainingSessionLog and rejects completed sessions without exercises", () => {
    const base = {
      id: "session-1",
      userId: "user-1",
      programId: null,
      programDayName: null,
      gymProfileId: null,
      startedAt: now,
      completedAt: now,
      isFreestyle: true,
      isSubstitution: false,
      status: "completed",
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
      durationMinutes: 45,
    };

    const exercise = {
      canonicalExerciseId: null,
      freestyleName: "Push Up",
      freestyleMuscleGroups: ["chest"],
      gymExerciseInstanceId: null,
      order: 0,
      sets: [],
      isFromProgram: false,
      canonicalizationStatus: "unmatched",
      cardioData: null,
      stretchData: null,
    };

    expect(TrainingSessionLogSchema.safeParse({ ...base, exercises: [exercise] }).success).toBe(true);
    expect(TrainingSessionLogSchema.safeParse({ ...base, exercises: [] }).success).toBe(false);
  });

  it("parses UserProfile fitness slice and rejects invalid fitness values", () => {
    const valid = {
      userId: "HH-ABC123",
      email: "user@example.com",
      fullName: "User Example",
      onboardingCompleted: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      fitness: { defaultWeightUnit: "kg", trainingPhase: "build" },
    };

    expect(UserProfileSchema.safeParse(valid).success).toBe(true);
    expect(UserProfileSchema.safeParse({ ...valid, fitness: { trainingPhase: "bulk" } }).success).toBe(false);
  });
});

describe("progression schemas", () => {
  it("validates promoted progression and metric schemas", () => {
    const baselineEntry = {
      sessionId: "s1",
      date: now,
      weightKg: 100,
      reps: 5,
      rir: 2,
      e1rm: 120,
      e1rmFormula: "wathan",
      isOutlier: false,
      goEasier: false,
    };
    const gated = {
      exerciseId: "ex-1",
      sessionId: "s1",
      setIndex: 0,
      weightKg: 100,
      reps: 5,
      rir: 2,
      e1rmKg: 120,
      recordedAt: now,
      qualifying: true,
    };
    const band = { value: 120, lowerKg: 115, upperKg: 125, sampleCount: 3, widthKg: 10 };

    expect(BaselineEntrySchema.safeParse(baselineEntry).success).toBe(true);
    expect(ProgressionBaselineSchema.safeParse({
      canonicalExerciseId: "ex-1",
      userId: "u1",
      currentE1RM_Kg: 120,
      topSetWeightKg: 100,
      topSetReps: 5,
      topSetRIR: 2,
      lastUpdated: now,
      history: [baselineEntry],
    }).success).toBe(true);
    expect(CardioBaselineSchema.safeParse({
      canonicalExerciseId: "run",
      userId: "u1",
      bestDurationSeconds: 1800,
      bestDistanceKm: 5,
      bestPaceSecondsPerKm: 360,
      bestMETs: 8,
      lowestHRAtPace: 150,
      lastDurationSeconds: 1800,
      lastDistanceKm: 5,
      lastAvgSpeedKmh: 10,
      lastPaceSecondsPerKm: 360,
      lastIncline: 0,
      lastResistance: null,
      lastAvgHeartRate: 150,
      lastUpdated: now,
      history: [],
    }).success).toBe(true);
    expect(GatedE1RMSampleSchema.safeParse(gated).success).toBe(true);
    expect(BestQualifyingSetSchema.safeParse({ ...gated, windowDays: 28 }).success).toBe(true);
    expect(WeeklyHardSetsEntrySchema.safeParse({
      muscleGroup: "lats",
      weekStart: now,
      hardSetCount: 8,
      totalSetCount: 12,
    }).success).toBe(true);
    expect(RelativeStrengthScoreSchema.safeParse({
      exerciseId: "ex-1",
      recordedAt: now,
      e1rmKg: 120,
      bodyWeightKg: 80,
      score: 1.5,
      bodyWeightSourceAgeDays: 1,
    }).success).toBe(true);
    expect(RepRangePivotSchema.safeParse({
      exerciseId: "ex-1",
      detectedAt: now,
      priorMedianReps: 5,
      currentMedianReps: 8,
      deltaReps: 3,
      windowDays: 28,
      acknowledged: false,
    }).success).toBe(true);
    expect(ConfidenceBandSchema.safeParse(band).success).toBe(true);
    expect(MetricBasketSnapshotSchema.safeParse({
      exerciseId: "ex-1",
      e1rmGated: { current: 120, band, samples: 3 },
    }).success).toBe(true);
  });

  it("rejects invalid progression and program shapes", () => {
    expect(BaselineEntrySchema.safeParse({}).success).toBe(false);
    expect(GatedE1RMSampleSchema.safeParse({ exerciseId: "" }).success).toBe(false);
    expect(ProgramSchema.safeParse({
      id: "p1",
      userId: "u1",
      name: "Program",
      type: "linear",
      startDate: now,
      durationWeeks: 4,
      isActive: true,
      deloadWeekNumbers: [],
      deloadPercent: 0.1,
      schedule: [],
      createdAt: now,
      updatedAt: now,
    }).success).toBe(false);
  });
});
