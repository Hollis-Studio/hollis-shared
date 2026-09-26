/**
 * @ai-context Canonical exercise catalog modification clock (alpha.91,
 * hollis-workouts#225).
 *
 * Pins the wire decision the catalog delta rests on: every catalog row carries
 * a server `updatedAt`, a submission record inherits it through `.extend`, and
 * the coaching/Health catalog picks are untouched by it.
 */

import { CoachingExerciseCatalogSchema } from "../domain/coaching.js";
import { CanonicalExerciseRecordSchema } from "../domain/exercise-workouts.js";
import { ExerciseSubmissionRecordSchema } from "../domain/workouts-exercise-moderation.js";

const libraryRow = {
  id: "barbell_back_squat",
  name: "Barbell Back Squat",
  description: "",
  modality: "weightlifting",
  primaryMuscleGroups: ["quadriceps"],
  secondaryMuscleGroups: ["glutes"],
  equipmentType: "barbell",
  requiredEquipment: [],
  isBodyweight: false,
  isUnilateral: false,
  defaultRestTimerSec: 180,
  defaultWeightMode: "absolute",
  illustrationUrl: "",
  metadata: {},
  minimumIncrementKg: 2.5,
  source: "library",
  isActive: true,
  trackingMode: "reps",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2026-09-25T12:00:00.000Z",
};

describe("CanonicalExerciseRecordSchema.updatedAt", () => {
  it("coerces the server clock to a Date", () => {
    const parsed = CanonicalExerciseRecordSchema.parse(libraryRow);
    expect(parsed.updatedAt).toEqual(new Date("2026-09-25T12:00:00.000Z"));
  });

  it("is required: a catalog row without it is rejected", () => {
    const { updatedAt: _omitted, ...withoutClock } = libraryRow;
    const result = CanonicalExerciseRecordSchema.safeParse(withoutClock);
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain("updatedAt");
  });

  it("rejects a value that is not a date", () => {
    expect(
      CanonicalExerciseRecordSchema.safeParse({ ...libraryRow, updatedAt: "not-a-date" }).success,
    ).toBe(false);
  });
});

describe("ExerciseSubmissionRecordSchema inherits the clock", () => {
  const submission = {
    ...libraryRow,
    id: "7b395a52-f468-4c69-b986-bf3be18e0e73",
    source: "user_created",
    ownerUserId: "user_123",
    submittedForReview: true,
    moderationStatus: "pending",
    note: "Seen at my gym",
  };

  it("parses a submission with updatedAt and keeps the note", () => {
    const parsed = ExerciseSubmissionRecordSchema.parse(submission);
    expect(parsed.updatedAt).toEqual(new Date("2026-09-25T12:00:00.000Z"));
    expect(parsed.note).toBe("Seen at my gym");
  });

  it("rejects a submission without updatedAt", () => {
    const { updatedAt: _omitted, ...withoutClock } = submission;
    expect(ExerciseSubmissionRecordSchema.safeParse(withoutClock).success).toBe(false);
  });
});

describe("catalog picks stay independent of the clock", () => {
  it("CoachingExerciseCatalogSchema accepts entries without updatedAt", () => {
    const entry = { id: "barbell_back_squat", name: "Barbell Back Squat", modality: "weightlifting", equipmentType: "barbell" };
    expect(CoachingExerciseCatalogSchema.parse([entry])).toEqual([entry]);
  });
});
