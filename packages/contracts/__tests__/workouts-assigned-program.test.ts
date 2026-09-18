import {
  AssignedProgramRequestSchema,
  AssignedProgramSnapshotSchema,
  WorkoutsClientRegisterSchema,
  WorkoutsPlanDraftSaveSchema,
  WorkoutsPlanPublishSchema,
  WorkoutsRecipientSearchQuerySchema,
} from "../domain/workouts-assigned-program.js";
import { CoachingProgramSnapshotSchema } from "../domain/coaching.js";

const program = {
  name: "Strength base",
  type: "custom",
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
    }],
  }],
};

const request = {
  assignmentId: "7b395a52-f468-4c69-b986-bf3be18e0e73",
  appUserId: "identity-subject-1",
  source: "admin",
  sourcePlanId: "0c9d0b0e-3f57-4f0e-9a51-1f4f9f1b2a11",
  sourcePlanVersion: "2",
  startDate: "2026-09-18T18:00:00.000Z",
  assignedByUserId: "HH-ADM001",
  program,
};

describe("assigned Workouts program contract", () => {
  it("shares one deliverable program shape with coaching", () => {
    expect(AssignedProgramSnapshotSchema).toBe(CoachingProgramSnapshotSchema);
    expect(AssignedProgramSnapshotSchema.safeParse(program).success).toBe(true);
  });

  it("defaults an admin delivery to an immediate replacement with no predecessor", () => {
    const parsed = AssignedProgramRequestSchema.parse(request);
    expect(parsed.activation).toBe("replace");
    expect(parsed.supersedesAssignmentId).toBeNull();
  });

  it("never accepts a coaching-sourced delivery on the admin bridge", () => {
    expect(AssignedProgramRequestSchema.safeParse({ ...request, source: "coaching" }).success).toBe(false);
    expect(AssignedProgramRequestSchema.safeParse({ ...request, activation: "overwrite" }).success).toBe(false);
  });

  it("rejects an undeliverable program at publish time but lets a draft autosave mid-edit", () => {
    const unfinished = { ...program, schedule: [{ ...program.schedule[0], exercises: [{ ...program.schedule[0]!.exercises[0], cardioTargets: null }] }] };
    expect(AssignedProgramRequestSchema.safeParse({ ...request, program: unfinished }).success).toBe(false);
    expect(WorkoutsPlanDraftSaveSchema.safeParse({ clientId: null, name: "Template", program: unfinished, isTemplate: true }).success).toBe(true);
  });

  it("bounds recipient search and registration inputs", () => {
    expect(WorkoutsRecipientSearchQuerySchema.safeParse({ search: "a" }).success).toBe(false);
    expect(WorkoutsRecipientSearchQuerySchema.parse({ search: "sam@example.com" }).limit).toBe(20);
    expect(WorkoutsClientRegisterSchema.parse({ appUserId: "identity-subject-1" }).healthUserId).toBeNull();
    expect(WorkoutsPlanPublishSchema.safeParse({ startDate: "tomorrow" }).success).toBe(false);
  });
});
