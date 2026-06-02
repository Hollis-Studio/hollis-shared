import { describe, expect, it } from "@jest/globals";

import {
  PrescriptionRecordSchema,
  ProgressionEngineStateSchema,
  PrescriptionOutcomeSchema,
  CardioPrescriptionOutcomeSchema,
  PrescriptionDropStepSchema,
  CardioMetricCapacitySchema,
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

describe("PrescriptionOutcomeSchema discriminated union", () => {
  it("(i) legacy kind-less lifting outcome defaults kind to 'lifting' via preprocess", () => {
    const result = PrescriptionOutcomeSchema.safeParse({
      actualTopSetKg: 100,
      actualReps: 5,
      reliabilityWeightedRir: 1.5,
      missed: false,
      completionRatio: 1.0,
      resolvedAt: new Date("2026-06-01T11:00:00Z"),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kind).toBe("lifting");
    }
  });

  it("(ii) cardio outcome with kind:'cardio' parses correctly", () => {
    const result = PrescriptionOutcomeSchema.safeParse({
      kind: "cardio",
      durationS: 1800,
      distanceKm: 5.0,
      pace: 360,
      mets: 8.5,
      completionRatio: 0.95,
      resolvedAt: new Date("2026-06-01T11:00:00Z"),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kind).toBe("cardio");
    }
  });

  it("(ii) CardioPrescriptionOutcomeSchema parses a cardio outcome directly", () => {
    const result = CardioPrescriptionOutcomeSchema.safeParse({
      kind: "cardio",
      durationS: null,
      distanceKm: 10.0,
      pace: null,
      mets: null,
      completionRatio: 1.0,
      resolvedAt: new Date("2026-06-01T11:00:00Z"),
    });
    expect(result.success).toBe(true);
  });
});

describe("PrescriptionDropStep / CardioMetricCapacity", () => {
  it("(iii) PrescriptionDropStepSchema parses a valid drop step", () => {
    const result = PrescriptionDropStepSchema.safeParse({
      kind: "anchor",
      label: "Training Max",
      pctChange: -0.05,
      reason: "Fatigue indicator above threshold",
    });
    expect(result.success).toBe(true);
  });

  it("(iii) PrescriptionDropStepSchema rejects an invalid kind", () => {
    const result = PrescriptionDropStepSchema.safeParse({
      kind: "unknown",
      label: "x",
      pctChange: 0,
      reason: "y",
    });
    expect(result.success).toBe(false);
  });

  it("(iii) CardioMetricCapacitySchema parses a valid capacity record", () => {
    const result = CardioMetricCapacitySchema.safeParse({
      metric: "mets_min",
      score: 450,
      sessionCount: 12,
    });
    expect(result.success).toBe(true);
  });

  it("(iii) CardioMetricCapacitySchema rejects an unknown metric", () => {
    const result = CardioMetricCapacitySchema.safeParse({
      metric: "calories",
      score: 300,
      sessionCount: 5,
    });
    expect(result.success).toBe(false);
  });
});

describe("PrescriptionRecord with new optional cardio fields", () => {
  const baseRecord = {
    id: "session-2::run::0",
    sessionId: "session-2",
    programExerciseId: null,
    canonicalExerciseId: "treadmill_run",
    order: 0,
    decision: baseDecision,
    targetSource: "engine" as const,
    prescribedTopSetKg: null,
    prescribedReps: 0,
    status: "completed" as const,
    createdAt: new Date("2026-06-01T10:00:00Z"),
    resolvedAt: new Date("2026-06-01T11:00:00Z"),
    outcome: null,
  };

  it("(iv) PrescriptionRecord with new optional cardio fields parses", () => {
    const result = PrescriptionRecordSchema.safeParse({
      ...baseRecord,
      prescribedDurationSeconds: 1800,
      prescribedDistanceKm: 5.0,
      cardioOutcome: {
        kind: "cardio",
        durationS: 1750,
        distanceKm: 4.9,
        pace: 357,
        mets: 8.2,
        completionRatio: 0.98,
        resolvedAt: new Date("2026-06-01T11:00:00Z"),
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prescribedDurationSeconds).toBe(1800);
      expect(result.data.cardioOutcome?.kind).toBe("cardio");
    }
  });

  it("(iv) PrescriptionRecord without optional cardio fields still parses", () => {
    const result = PrescriptionRecordSchema.safeParse(baseRecord);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prescribedDurationSeconds).toBeUndefined();
      expect(result.data.prescribedDistanceKm).toBeUndefined();
      expect(result.data.cardioOutcome).toBeUndefined();
    }
  });
});
