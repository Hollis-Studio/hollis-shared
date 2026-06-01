import { describe, expect, it } from "@jest/globals";

import {
  PrescriptionRecordSchema,
  ProgressionEngineStateSchema,
} from "../progression/engine.js";

const baseDecision = {
  action: "progress" as const,
  confidence: "high" as const,
  targetSummary: "100 kg x 5",
  drivers: [],
  generatedAt: new Date("2026-06-01T10:00:00Z"),
  schemaVersion: 1,
};

describe("ProgressionEngineStateSchema modality-neutral fields", () => {
  it("parses a state written with the new neutral field names", () => {
    const parsed = ProgressionEngineStateSchema.parse({
      calibrationState: "stable",
      rawBaselineScore: 116.67,
      capacityScore: 118,
      trainingTargetScore: 108,
      uncertaintyPct: 0.02,
      distinctSessionCount: 6,
      schemaVersion: 1,
    });
    expect(parsed.rawBaselineScore).toBe(116.67);
    expect(parsed.capacityScore).toBe(118);
    expect(parsed.trainingTargetScore).toBe(108);
  });

  it("maps legacy *Kg keys from already-persisted blobs onto the neutral names", () => {
    const parsed = ProgressionEngineStateSchema.parse({
      calibrationState: "stable",
      rawBaselineKg: 116.67,
      capacityEstimateKg: 118,
      trainingMaxKg: 108,
      uncertaintyPct: 0.02,
      distinctSessionCount: 6,
      schemaVersion: 1,
    });
    expect(parsed.rawBaselineScore).toBe(116.67);
    expect(parsed.capacityScore).toBe(118);
    expect(parsed.trainingTargetScore).toBe(108);
  });

  it("prefers the new key when both legacy and neutral keys are present", () => {
    const parsed = ProgressionEngineStateSchema.parse({
      calibrationState: "stable",
      rawBaselineScore: 200,
      rawBaselineKg: 116.67,
      capacityScore: 210,
      trainingTargetScore: 190,
      uncertaintyPct: 0.02,
      distinctSessionCount: 6,
      schemaVersion: 1,
    });
    expect(parsed.rawBaselineScore).toBe(200);
  });
});

describe("PrescriptionRecordSchema lifecycle", () => {
  it("accepts an active record with no outcome yet", () => {
    const record = PrescriptionRecordSchema.parse({
      id: "session-1::bench::0",
      sessionId: "session-1",
      programExerciseId: "pe-1",
      canonicalExerciseId: "bench_press",
      order: 0,
      decision: baseDecision,
      targetSource: "engine",
      prescribedTopSetKg: 100,
      prescribedReps: 5,
      status: "active",
      createdAt: new Date("2026-06-01T10:00:00Z"),
      resolvedAt: null,
      outcome: null,
    });
    expect(record.status).toBe("active");
    expect(record.outcome).toBeNull();
  });

  it("accepts a completed record carrying an outcome", () => {
    const record = PrescriptionRecordSchema.parse({
      id: "session-1::bench::0",
      sessionId: "session-1",
      programExerciseId: null,
      canonicalExerciseId: "bench_press",
      order: null,
      decision: baseDecision,
      targetSource: "engine",
      prescribedTopSetKg: 100,
      prescribedReps: 5,
      status: "completed",
      createdAt: new Date("2026-06-01T10:00:00Z"),
      resolvedAt: new Date("2026-06-01T11:00:00Z"),
      outcome: {
        actualTopSetKg: 102.5,
        actualReps: 5,
        reliabilityWeightedRir: 1.5,
        missed: false,
        completionRatio: 1.02,
        resolvedAt: new Date("2026-06-01T11:00:00Z"),
      },
    });
    expect(record.outcome?.actualTopSetKg).toBe(102.5);
  });

  it("carries a bounded prescriptionLog on engine state", () => {
    const parsed = ProgressionEngineStateSchema.parse({
      calibrationState: "stable",
      rawBaselineScore: 116.67,
      capacityScore: 118,
      trainingTargetScore: 108,
      uncertaintyPct: 0.02,
      distinctSessionCount: 6,
      schemaVersion: 1,
      prescriptionLog: [
        {
          id: "session-1::bench::0",
          sessionId: "session-1",
          programExerciseId: null,
          canonicalExerciseId: "bench_press",
          order: 0,
          decision: baseDecision,
          targetSource: "engine",
          prescribedTopSetKg: 100,
          prescribedReps: 5,
          status: "completed",
          createdAt: new Date("2026-06-01T10:00:00Z"),
          resolvedAt: new Date("2026-06-01T11:00:00Z"),
          outcome: null,
        },
      ],
    });
    expect(parsed.prescriptionLog).toHaveLength(1);
  });
});
