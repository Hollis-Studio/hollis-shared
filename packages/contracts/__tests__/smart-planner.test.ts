import { SmartPlannerResponseSchema } from "../ai/workout-ai-wire";
import { SetTargetSnapshotSchema } from "../domain/training-session-log";

const target = { weightKg: 40, reps: 8, rir: 2, isWarmup: false };
const plan = { name: "Today", reasoning: "Next logical session", exercises: [{ canonicalExerciseId: "squat", trackingMode: "reps", sets: [target] }] };
describe("Smart Planner contracts", () => {
  it("accepts a complete lifting plan and rejects unsafe target bounds", () => {
    expect(SmartPlannerResponseSchema.parse(plan)).toEqual(plan);
    expect(SmartPlannerResponseSchema.safeParse({ ...plan, exercises: [{ ...plan.exercises[0], sets: [{ ...target, weightKg: Infinity }] }] }).success).toBe(false);
  });
  it("preserves AI authority through a portable snapshot roundtrip", () => {
    const snapshot = { ...target, setNumber: 1, aiAuthoritative: true };
    expect(SetTargetSnapshotSchema.parse(JSON.parse(JSON.stringify(snapshot)))).toEqual(snapshot);
    expect(SetTargetSnapshotSchema.parse({ ...target, setNumber: 1 }).aiAuthoritative).toBeUndefined();
  });
});
