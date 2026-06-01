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
