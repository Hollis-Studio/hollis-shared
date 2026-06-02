/**
 * @ai-context Workouts AI wire-contract schema tests.
 *
 * Verifies the schemas shared by the hollis-workouts server and mobile client:
 * voice-log operations (numeric bounds + stretch + per-op required fields),
 * the Smart Builder slotted program (cardio needs a target, stretch slots as
 * timed), the flat AI response shapes, and the controlled equipment/muscle
 * vocabularies. These are the exact behaviors that previously drifted between
 * the two copies.
 */

import {
  VoiceLogOperationSchema,
  SmartBuilderResponseSchema,
  MatchExercisesResponseSchema,
  RecognizeEquipmentResponseSchema,
  TagExerciseMusclesResponseSchema,
  GymSetupResponseSchema,
  GYM_EQUIPMENT_TYPES,
  RECOGNIZE_EQUIPMENT_TYPES,
  PrescriptionNarrationRequestSchema,
  PrescriptionNarrationResponseSchema,
  SetSignalTiebreakerRequestSchema,
  SetSignalTiebreakerResponseSchema,
  CrossModalContextRequestSchema,
  CrossModalContextResponseSchema,
} from "../workout-ai-wire.js";

describe("VoiceLogOperationSchema", () => {
  it("accepts a stretch add_exercise and the max numeric bounds", () => {
    expect(
      VoiceLogOperationSchema.safeParse({
        op: "add_exercise",
        exerciseName: "Couch Stretch",
        trackingMode: "stretch",
        confidence: 0.9,
      }).success,
    ).toBe(true);
    expect(
      VoiceLogOperationSchema.safeParse({
        op: "log_set",
        exerciseIndex: 0,
        durationSeconds: 86400,
        distanceKm: 1000,
        confidence: 0.8,
      }).success,
    ).toBe(true);
  });

  it("rejects out-of-bound numerics and missing per-op fields", () => {
    expect(
      VoiceLogOperationSchema.safeParse({ op: "log_set", exerciseIndex: 0, durationSeconds: 86401, confidence: 0.8 })
        .success,
    ).toBe(false);
    expect(
      VoiceLogOperationSchema.safeParse({ op: "log_set", exerciseIndex: 0, distanceKm: 1001, confidence: 0.8 })
        .success,
    ).toBe(false);
    expect(
      VoiceLogOperationSchema.safeParse({ op: "modify_set", exerciseIndex: 0, confidence: 0.8 }).success,
    ).toBe(false);
    expect(
      VoiceLogOperationSchema.safeParse({ op: "add_exercise", exerciseName: "X", confidence: 0.9 }).success,
    ).toBe(false);
  });
});

describe("SmartBuilderResponseSchema", () => {
  const programWith = (cardio: Record<string, unknown>) => ({
    type: "program" as const,
    program: {
      name: "P",
      description: "d",
      type: "linear" as const,
      durationWeeks: 8,
      schedule: [
        {
          dayOfWeek: 1,
          name: "Day A",
          exercises: [
            { slotId: "d0-e0", canonicalExerciseId: "ex_pigeon", exerciseType: "timed", sets: 3, durationSeconds: 60, progressionMode: "duration_first" },
            { slotId: "d0-e1", canonicalExerciseId: "ex_run", exerciseType: "cardio", ...cardio },
          ],
        },
      ],
    },
  });

  it("accepts a cardio slot with at least one target (and a stretch-as-timed slot)", () => {
    expect(
      SmartBuilderResponseSchema.safeParse(
        programWith({ durationSeconds: 1800, targetDistanceKm: null, targetSpeedKmh: null }),
      ).success,
    ).toBe(true);
  });

  it("rejects a cardio slot with all targets null", () => {
    expect(
      SmartBuilderResponseSchema.safeParse(
        programWith({ durationSeconds: null, targetDistanceKm: null, targetSpeedKmh: null }),
      ).success,
    ).toBe(false);
  });
});

describe("flat AI response schemas", () => {
  it("MatchExercisesResponseSchema validates shape", () => {
    expect(MatchExercisesResponseSchema.safeParse({ matches: [] }).success).toBe(true);
    expect(MatchExercisesResponseSchema.safeParse({ matches: [{ freestyleName: "x" }] }).success).toBe(false);
  });

  it("RecognizeEquipmentResponseSchema enforces the equipment enum", () => {
    expect(
      RecognizeEquipmentResponseSchema.safeParse({ equipmentType: "barbell", suggestedExerciseName: "Bench", confidence: 0.9, clarifyingQuestions: [] }).success,
    ).toBe(true);
    expect(
      RecognizeEquipmentResponseSchema.safeParse({ equipmentType: "spaceship", suggestedExerciseName: "x", confidence: 0.5, clarifyingQuestions: [] }).success,
    ).toBe(false);
  });

  it("TagExerciseMusclesResponseSchema enforces the canonical MuscleGroup enum", () => {
    expect(
      TagExerciseMusclesResponseSchema.safeParse({ tags: [{ name: "Bench", muscleGroups: ["chest", "triceps"] }] }).success,
    ).toBe(true);
    expect(
      TagExerciseMusclesResponseSchema.safeParse({ tags: [{ name: "Bench", muscleGroups: ["chesticles"] }] }).success,
    ).toBe(false);
    expect(
      TagExerciseMusclesResponseSchema.safeParse({ tags: [{ name: "Bench", muscleGroups: [] }] }).success,
    ).toBe(false);
  });

  it("GymSetupResponseSchema enforces the equipment-type enum", () => {
    expect(
      GymSetupResponseSchema.safeParse({ type: "confirm", message: "ok", equipment: [{ type: "dumbbell", count: 2 }] }).success,
    ).toBe(true);
    expect(
      GymSetupResponseSchema.safeParse({ type: "confirm", message: "ok", equipment: [{ type: "spaceship", count: 2 }] }).success,
    ).toBe(false);
  });
});

describe("vocabulary", () => {
  it("recognition vocab is the gym vocab plus 'none'", () => {
    expect(RECOGNIZE_EQUIPMENT_TYPES).toContain("none");
    expect(GYM_EQUIPMENT_TYPES).not.toContain("none");
    for (const t of GYM_EQUIPMENT_TYPES) {
      expect(RECOGNIZE_EQUIPMENT_TYPES).toContain(t);
    }
  });
});

describe("PrescriptionNarrationRequestSchema / PrescriptionNarrationResponseSchema", () => {
  it("accepts a valid narration request", () => {
    expect(
      PrescriptionNarrationRequestSchema.safeParse({
        exerciseName: "Bench Press",
        dropSteps: [
          { kind: "anchor", label: "Training Max", pctChange: -0.05, reason: "Fatigue detected" },
        ],
        action: "reduce",
        targetSummary: "95 kg x 5",
        displayUnit: "kg",
      }).success,
    ).toBe(true);
  });

  it("rejects a narration request with an invalid action", () => {
    expect(
      PrescriptionNarrationRequestSchema.safeParse({
        exerciseName: "Bench Press",
        dropSteps: [],
        action: "explode",
        targetSummary: "95 kg x 5",
        displayUnit: "kg",
      }).success,
    ).toBe(false);
  });

  it("accepts a valid narration response", () => {
    expect(
      PrescriptionNarrationResponseSchema.safeParse({
        shortReason: "Fatigue detected",
        fullNarration: "Based on recent session data, your training max is reduced slightly.",
        confidence: "high",
      }).success,
    ).toBe(true);
  });

  it("rejects a narration response with an invalid confidence value", () => {
    expect(
      PrescriptionNarrationResponseSchema.safeParse({
        shortReason: "ok",
        fullNarration: "ok",
        confidence: "very_high",
      }).success,
    ).toBe(false);
  });
});

describe("SetSignalTiebreakerRequestSchema / SetSignalTiebreakerResponseSchema", () => {
  it("accepts a valid tiebreaker request", () => {
    expect(
      SetSignalTiebreakerRequestSchema.safeParse({
        exerciseName: "Squat",
        targetWeightKg: 120,
        targetReps: 5,
        targetRIR: 2,
        actualWeightKg: 120,
        actualReps: 7,
        actualRir: 0,
        historicalMaxWeightKg: 130,
        ambiguityReason: "More reps than prescribed but same weight",
      }).success,
    ).toBe(true);
  });

  it("rejects a tiebreaker request missing required actualReps", () => {
    expect(
      SetSignalTiebreakerRequestSchema.safeParse({
        exerciseName: "Squat",
        targetWeightKg: 120,
        targetReps: 5,
        targetRIR: 2,
        actualWeightKg: 120,
        actualRir: 0,
        historicalMaxWeightKg: null,
        ambiguityReason: null,
      }).success,
    ).toBe(false);
  });

  it("accepts a valid tiebreaker response (AiSetSignalOverride shape)", () => {
    expect(
      SetSignalTiebreakerResponseSchema.safeParse({
        signal: "overperformance",
        confidence: "high",
        reason: "Achieved more reps than target at same weight",
      }).success,
    ).toBe(true);
  });

  it("rejects a tiebreaker response with an unknown signal", () => {
    expect(
      SetSignalTiebreakerResponseSchema.safeParse({
        signal: "unknown_signal",
        confidence: "high",
        reason: "x",
      }).success,
    ).toBe(false);
  });
});

describe("CrossModalContextRequestSchema / CrossModalContextResponseSchema", () => {
  it("accepts a valid cross-modal context request", () => {
    expect(
      CrossModalContextRequestSchema.safeParse({
        exerciseName: "Deadlift",
        acuteCardioLoadRatio: 1.3,
        suggestedGoEasierPercent: 0.05,
        trainingPhase: "accumulation",
        recentSessionSummary: "Hard 10km run yesterday",
      }).success,
    ).toBe(true);
  });

  it("accepts a cross-modal context request with all nullable fields null", () => {
    expect(
      CrossModalContextRequestSchema.safeParse({
        exerciseName: "Deadlift",
        acuteCardioLoadRatio: null,
        suggestedGoEasierPercent: null,
        trainingPhase: null,
        recentSessionSummary: null,
      }).success,
    ).toBe(true);
  });

  it("accepts a valid cross-modal context response (AiContextDriverInput shape)", () => {
    expect(
      CrossModalContextResponseSchema.safeParse({
        contributionPct: -0.03,
        reason: "High acute cardio load detected",
        confidence: "medium",
      }).success,
    ).toBe(true);
  });

  it("rejects a cross-modal context response with contributionPct out of range", () => {
    expect(
      CrossModalContextResponseSchema.safeParse({
        contributionPct: 0.5,
        reason: "x",
        confidence: "low",
      }).success,
    ).toBe(false);
  });
});
