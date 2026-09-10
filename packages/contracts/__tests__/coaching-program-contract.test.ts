import {
  CoachingAccountProvisionRequestSchema,
  CoachingExerciseCatalogQuerySchema,
  CoachingProgramSnapshotSchema,
} from "../domain/coaching.js";
import { GeneratedExerciseSchema } from "../ai/ai-types.js";

const timestamp = new Date("2026-09-10T18:00:00.000Z");

function coachingProgram(overrides: Record<string, unknown> = {}) {
  return {
    id: "coach-program-1",
    name: "Coaching plan",
    type: "custom",
    startDate: timestamp,
    durationWeeks: 4,
    deloadWeekNumbers: [],
    deloadPercent: 0,
    schedule: [{
      dayOfWeek: 1,
      name: "Monday",
      exercises: [{
        canonicalExerciseId: "stationary_bike",
        order: 0,
        sets: [],
        progressionMode: "duration_first",
        repThresholdForWeightJump: null,
        cardioTargets: { targetDurationSeconds: 1200, targetDistanceKm: null, targetSpeedKmh: null, targetIncline: null, targetResistance: null },
        coachingNotes: "Keep conversational pace.",
        demonstrationUrl: "https://app.hollis.health/exercises/stationary_bike",
        sectionType: "warmup",
        sectionTitle: "Warm up",
        restSeconds: 30,
        tempo: "easy",
      }],
    }],
    schemaVersion: 1,
    ...overrides,
  };
}

describe("coaching program contract", () => {
  it("round-trips cardio and coach instructions needed by Workouts", () => {
    const parsed = CoachingProgramSnapshotSchema.parse(coachingProgram());
    const exercise = parsed.schedule[0]!.exercises[0]!;
    expect(exercise.cardioTargets?.targetDurationSeconds).toBe(1200);
    expect(exercise.coachingNotes).toBe("Keep conversational pace.");
    expect(exercise.sectionType).toBe("warmup");
    expect(exercise.demonstrationUrl).toContain("stationary_bike");
  });

  it("bounds generated data and rejects empty cardio prescriptions", () => {
    expect(GeneratedExerciseSchema.safeParse({ name: "Bike", sets: 21 }).success).toBe(false);
    expect(CoachingProgramSnapshotSchema.safeParse(coachingProgram({ schedule: Array.from({ length: 8 }, (_, dayOfWeek) => ({ ...coachingProgram().schedule[0], dayOfWeek })) })).success).toBe(false);
    const emptyCardio = coachingProgram();
    (emptyCardio.schedule[0]!.exercises[0]!.cardioTargets as { targetDurationSeconds: number | null }).targetDurationSeconds = null;
    expect(CoachingProgramSnapshotSchema.safeParse(emptyCardio).success).toBe(false);
  });

  it("bounds catalog and account-provisioning inputs", () => {
    expect(CoachingExerciseCatalogQuerySchema.safeParse({ limit: 201 }).success).toBe(false);
    expect(CoachingAccountProvisionRequestSchema.safeParse({ coachingMemberId: "7b395a52-f468-4c69-b986-bf3be18e0e73", identitySubject: "identity-1", displayName: "Coaching Member" }).success).toBe(true);
  });
});
