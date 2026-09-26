import { describe, expect, it } from "@jest/globals";

import {
  PROGRESSION_ENGINE_TUNING,
  calculateRirReliability,
  deriveCalibrationState,
  deriveCardioEngineScores,
  deriveLiftingEngineScores,
  estimateCardioCapacityScoreForMetric,
  estimateCardioRawBaselineScore,
  estimateCardioRawBaselineScoreForMetric,
  estimateE1RMForEffectiveReps,
  estimateEffortAdjustedE1RM,
  estimateRelativeSpread,
  layoffDecayMultiplier,
  pickDominantCardioMetric,
  recentHistoryWindow,
  type CardioEngineBests,
  type CardioEngineSample,
  type LiftingEngineSample,
} from "../progression/engine-state.js";

// Golden values. Sources:
//   [app]    Hollis-Workouts __tests__/services/progression/engine.test.ts
//   [server] Hollis-Workouts server/__tests__/schemas/progressionEngine.parity.test.ts
//   [new]    behaviour the app had but the server lacked, now pinned for both
// Every case passes an explicit `now`; nothing reads the wall clock.

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-05-01T12:00:00Z");
const daysAgo = (days: number): Date => new Date(NOW.getTime() - days * DAY_MS);

function lift(overrides: Partial<LiftingEngineSample> & { ago?: number } = {}): LiftingEngineSample {
  const { ago = 5, ...rest } = overrides;
  return { sessionId: "s1", date: daysAgo(ago), weightKg: 100, reps: 5, rir: null, isOutlier: false, ...rest };
}

function cardio(overrides: Partial<CardioEngineSample> & { ago?: number } = {}): CardioEngineSample {
  const { ago = 5, ...rest } = overrides;
  return {
    sessionId: "s1",
    date: daysAgo(ago),
    durationSeconds: 1800,
    distanceKm: null,
    mets: null,
    isOutlier: false,
    ...rest,
  };
}

function bests(overrides: Partial<CardioEngineBests> = {}): CardioEngineBests {
  return { bestDurationSeconds: 1800, bestDistanceKm: null, bestMETs: null, ...overrides };
}

/** Six sessions, one per `stepDays`, newest `newestAgo` days before NOW. */
function sixLifts(newestAgo: number, overrides: Partial<LiftingEngineSample> = {}, stepDays = 3): LiftingEngineSample[] {
  return Array.from({ length: 6 }, (_v, i) => lift({ sessionId: `s${i}`, ago: newestAgo + i * stepDays, ...overrides }));
}

describe("PROGRESSION_ENGINE_TUNING", () => {
  it("pins every calibration constant", () => {
    expect(PROGRESSION_ENGINE_TUNING).toEqual({
      calibratingSessionCount: 3,
      stableSessionCount: 6,
      highUncertaintyPct: 0.08,
      recentHistoryWindow: 6,
      coldStartCapacityUplift: 0.03,
      baselineStaleDays: 60,
      layoffDecayPerWeek: 0.01,
      layoffDecayFloor: 0.85,
      liftingCapacityBlend: { recent: 0.75, rawBaseline: 0.25 },
      metricBasketCapacityBlend: { recent: 0.65, metricBasket: 0.35 },
      e1rmCrossoverReps: 10,
      rirEffectiveRepCredit: 0.5,
      rirCreditCap: 4,
      trainingMaxByState: { no_data: 0, calibrating: 0.82, provisional: 0.88, stable: 0.92 },
    });
  });
});

describe("calculateRirReliability [app]", () => {
  it("gives full reliability to close-to-failure low-rep reports", () => {
    expect(calculateRirReliability(5, 2)).toBe(1);
    expect(calculateRirReliability(10, 0)).toBe(1);
  });

  it("down-weights noisy reports and ignores invalid ones", () => {
    expect(calculateRirReliability(12, 3)).toBe(0.6);
    expect(calculateRirReliability(8, 5)).toBe(0.25);
    expect(calculateRirReliability(16, 1)).toBe(0);
    expect(calculateRirReliability(5, null)).toBe(0);
    expect(calculateRirReliability(5, undefined)).toBe(0);
    expect(calculateRirReliability(5, 7)).toBe(0);
    expect(calculateRirReliability(5.5, 2)).toBe(0);
    expect(calculateRirReliability(0, 2)).toBe(0);
  });
});

describe("estimateE1RMForEffectiveReps", () => {
  it("uses Epley up to 10 reps and Wathan above", () => {
    expect(estimateE1RMForEffectiveReps(100, 1)).toBe(100);
    expect(estimateE1RMForEffectiveReps(100, 5)).toBeCloseTo(116.666667, 5);
    expect(estimateE1RMForEffectiveReps(100, 10)).toBeCloseTo(133.333333, 5);
    expect(estimateE1RMForEffectiveReps(100, 12)).toBeCloseTo(141.495856, 5);
  });

  it("returns 0 for no load or no reps", () => {
    expect(estimateE1RMForEffectiveReps(0, 5)).toBe(0);
    expect(estimateE1RMForEffectiveReps(100, 0)).toBe(0);
  });
});

describe("estimateEffortAdjustedE1RM [app]", () => {
  it("credits half of reliable reps in reserve", () => {
    expect(estimateEffortAdjustedE1RM({ weightKg: 100, reps: 5, rir: 2 })).toEqual({
      adjustedE1RMKg: 120,
      reliability: 1,
      effectiveReps: 6,
    });
  });

  it("bounds high-RIR influence below counting every reserve rep", () => {
    const result = estimateEffortAdjustedE1RM({ weightKg: 100, reps: 5, rir: 4 });
    expect(result?.reliability).toBe(0.6);
    expect(result?.effectiveReps).toBeCloseTo(6.2, 10);
    expect(result?.adjustedE1RMKg).toBeCloseTo(120.666667, 5);
    expect(result?.adjustedE1RMKg ?? 0).toBeLessThan(100 * (1 + 9 / 30));
  });

  it("treats missing RIR as neutral", () => {
    const result = estimateEffortAdjustedE1RM({ weightKg: 100, reps: 5, rir: null });
    expect(result?.reliability).toBe(0);
    expect(result?.effectiveReps).toBe(5);
    expect(result?.adjustedE1RMKg).toBeCloseTo(116.666667, 5);
  });

  it("rejects invalid sets and scores zero-load or zero-rep sets as 0", () => {
    expect(estimateEffortAdjustedE1RM({ weightKg: Number.NaN, reps: 5 })).toBeNull();
    expect(estimateEffortAdjustedE1RM({ weightKg: -1, reps: 5 })).toBeNull();
    expect(estimateEffortAdjustedE1RM({ weightKg: 100, reps: 4.5 })).toBeNull();
    expect(estimateEffortAdjustedE1RM({ weightKg: 100, reps: -1 })).toBeNull();
    expect(estimateEffortAdjustedE1RM({ weightKg: 0, reps: 10 })?.adjustedE1RMKg).toBe(0);
    expect(estimateEffortAdjustedE1RM({ weightKg: 100, reps: 0, rir: 2 })?.adjustedE1RMKg).toBe(0);
  });
});

describe("estimateRelativeSpread", () => {
  it("is the sample coefficient of variation", () => {
    expect(estimateRelativeSpread([100])).toBeNull();
    expect(estimateRelativeSpread([0, 0])).toBeNull();
    expect(estimateRelativeSpread([100, 100, 100])).toBe(0);
    expect(estimateRelativeSpread([120, 360, 120, 360, 120, 360])).toBeCloseTo(0.547723, 5);
  });
});

describe("recentHistoryWindow", () => {
  it("sorts by date before keeping the newest entries, oldest first", () => {
    const entries = [lift({ sessionId: "c", ago: 1 }), lift({ sessionId: "a", ago: 9 }), lift({ sessionId: "b", ago: 5 })];
    expect(recentHistoryWindow(entries, 2).map((e) => e.sessionId)).toEqual(["b", "c"]);
  });

  it("accepts ISO strings and sorts unparseable dates first", () => {
    const entries = [
      { sessionId: "iso", date: daysAgo(1).toISOString() },
      { sessionId: "bad", date: "not a date" },
      { sessionId: "date", date: daysAgo(3) },
    ];
    expect(recentHistoryWindow(entries, 3).map((e) => e.sessionId)).toEqual(["bad", "date", "iso"]);
  });
});

describe("deriveCalibrationState [app]", () => {
  it("uses distinct sessions and uncertainty", () => {
    expect(deriveCalibrationState(0, null)).toBe("no_data");
    expect(deriveCalibrationState(1, null)).toBe("calibrating");
    expect(deriveCalibrationState(3, null)).toBe("provisional");
    expect(deriveCalibrationState(6, 0.03)).toBe("stable");
    expect(deriveCalibrationState(6, 0.09)).toBe("provisional");
  });

  it("demotes stable to provisional only past 60 days", () => {
    expect(deriveCalibrationState(6, 0.03, 30)).toBe("stable");
    expect(deriveCalibrationState(6, 0.03, 60)).toBe("stable");
    expect(deriveCalibrationState(6, 0.03, 61)).toBe("provisional");
    expect(deriveCalibrationState(6, 0.03, null)).toBe("stable");
    expect(deriveCalibrationState(6, 0.03, undefined)).toBe("stable");
  });

  it("walks the full staleness ladder", () => {
    expect(deriveCalibrationState(3, null, 90)).toBe("calibrating");
    expect(deriveCalibrationState(3, null, 30)).toBe("provisional");
    expect(deriveCalibrationState(6, 0.09, 90)).toBe("calibrating");
    expect(deriveCalibrationState(6, 0.09, 30)).toBe("provisional");
    expect(deriveCalibrationState(2, null, 90)).toBe("calibrating");
    expect(deriveCalibrationState(0, null, 90)).toBe("no_data");
  });

  it("never demotes on a future-dated or non-finite age", () => {
    expect(deriveCalibrationState(6, 0.03, -10)).toBe("stable");
    expect(deriveCalibrationState(3, null, -10)).toBe("provisional");
    expect(deriveCalibrationState(6, 0.03, Number.NaN)).toBe("stable");
  });
});

describe("layoffDecayMultiplier [server L6]", () => {
  it("is 1 inside the stale window, −1%/week beyond it, floored at 0.85", () => {
    expect(layoffDecayMultiplier(null)).toBe(1);
    expect(layoffDecayMultiplier(Number.NaN)).toBe(1);
    expect(layoffDecayMultiplier(60)).toBe(1);
    expect(layoffDecayMultiplier(67)).toBeCloseTo(0.99, 10);
    expect(layoffDecayMultiplier(95)).toBeCloseTo(0.95, 10);
    expect(layoffDecayMultiplier(200)).toBe(0.85);
  });
});

describe("deriveLiftingEngineScores", () => {
  it("[app] returns no_data for empty history", () => {
    expect(deriveLiftingEngineScores({ history: [], currentE1RMKg: 100, now: NOW })).toEqual({
      calibrationState: "no_data",
      rawBaselineScore: null,
      capacityScore: null,
      trainingTargetScore: null,
      uncertaintyPct: null,
      distinctSessionCount: 0,
    });
  });

  it("[app] counts distinct sessions, not sets", () => {
    const history = sixLifts(1, { rir: 2 }, 1).map((e, i) => ({ ...e, sessionId: i < 3 ? "a" : "b" }));
    const scores = deriveLiftingEngineScores({ history, currentE1RMKg: 116.67, now: NOW });
    // adjusted e1RM 120 each; capacity 120×0.75 + 116.67×0.25 = 119.1675 (under the 120.1701 cap)
    expect(scores.distinctSessionCount).toBe(2);
    expect(scores.calibrationState).toBe("calibrating");
    expect(scores.rawBaselineScore).toBe(116.67);
    expect(scores.capacityScore).toBeCloseTo(119.1675, 6);
    expect(scores.uncertaintyPct).toBe(0);
    expect(scores.trainingTargetScore).toBeCloseTo(97.71735, 6);
  });

  it("[app] marks a consistent six-session history stable", () => {
    const scores = deriveLiftingEngineScores({ history: sixLifts(1, { rir: 2 }, 1), currentE1RMKg: 116.67, now: NOW });
    expect(scores.calibrationState).toBe("stable");
    expect(scores.distinctSessionCount).toBe(6);
    expect(scores.capacityScore).toBeCloseTo(119.1675, 6);
    expect(scores.trainingTargetScore).toBeCloseTo(109.6341, 6);
  });

  it("[app] blends the metric-basket e1RM and uses its band as uncertainty", () => {
    const scores = deriveLiftingEngineScores({
      history: sixLifts(1, { rir: 2 }, 1),
      currentE1RMKg: 116.67,
      now: NOW,
      metricBasket: { current: 118, band: { value: 118, widthKg: 24 } },
    });
    // capacity 120×0.65 + 118×0.35 = 119.3; uncertainty 24/118 > 0.08 → provisional (0.88)
    expect(scores.capacityScore).toBeCloseTo(119.3, 6);
    expect(scores.uncertaintyPct).toBeCloseTo(0.20339, 5);
    expect(scores.calibrationState).toBe("provisional");
    expect(scores.trainingTargetScore).toBeCloseTo(104.984, 6);
  });

  it("[server L1] blends 0.75 recent mean with 0.25 PR", () => {
    const history = [
      lift({ sessionId: "s1", weightKg: 100, ago: 14 }),
      lift({ sessionId: "s2", weightKg: 102.5, ago: 7 }),
    ];
    const scores = deriveLiftingEngineScores({ history, currentE1RMKg: 120, now: NOW });
    expect(scores.capacityScore).toBeCloseTo(118.59375, 6);
  });

  it("[server L2] caps cold-start capacity at PR × 1.03", () => {
    const scores = deriveLiftingEngineScores({ history: [lift({ weightKg: 130, ago: 7 })], currentE1RMKg: 100, now: NOW });
    expect(scores.capacityScore).toBeCloseTo(103, 10);
  });

  it("[server L3] credits reliable RIR in capacity", () => {
    const eight = (rir: number | null) =>
      Array.from({ length: 8 }, (_v, i) => lift({ sessionId: `s${i}`, rir, ago: i * 5 + 1 }));
    expect(deriveLiftingEngineScores({ history: eight(null), currentE1RMKg: 100, now: NOW }).capacityScore).toBeCloseTo(112.5, 6);
    expect(deriveLiftingEngineScores({ history: eight(2), currentE1RMKg: 100, now: NOW }).capacityScore).toBeCloseTo(115, 6);
  });

  it("[server L4 / L6] demotes a stale baseline and decays only the training target", () => {
    const at = (newestAgo: number) => deriveLiftingEngineScores({ history: sixLifts(newestAgo), currentE1RMKg: 100, now: NOW });
    expect(at(65).calibrationState).toBe("provisional");
    expect(at(95)).toMatchObject({ calibrationState: "provisional", rawBaselineScore: 100 });
    expect(at(95).capacityScore).toBeCloseTo(112.5, 6);
    expect(at(95).trainingTargetScore).toBeCloseTo(94.05, 6);
    expect(at(200).trainingTargetScore).toBeCloseTo(84.15, 6);
    expect(at(10).calibrationState).toBe("stable");
    expect(at(10).trainingTargetScore).toBeCloseTo(103.5, 6);
  });

  it("[app] treats a future-dated newest session as fresh", () => {
    const history = sixLifts(1, { rir: 2 }, 1).map((e, i) => (i === 0 ? { ...e, date: daysAgo(-10) } : e));
    expect(deriveLiftingEngineScores({ history, currentE1RMKg: 116.67, now: NOW }).calibrationState).toBe("stable");
  });

  it("[new] all-outlier history calibrates on the PR alone, without layoff decay", () => {
    const history = [lift({ sessionId: "s1", isOutlier: true, ago: 300 }), lift({ sessionId: "s2", isOutlier: true, ago: 290 })];
    expect(deriveLiftingEngineScores({ history, currentE1RMKg: 100, now: NOW })).toEqual({
      calibrationState: "calibrating",
      rawBaselineScore: 100,
      capacityScore: 100,
      trainingTargetScore: 82,
      uncertaintyPct: null,
      distinctSessionCount: 0,
    });
  });

  it("[new] a zero PR skips the cold-start cap", () => {
    const scores = deriveLiftingEngineScores({ history: [lift()], currentE1RMKg: 0, now: NOW });
    // 116.6667 × 0.75 + 0 × 0.25 = 87.5; calibrating → × 0.82
    expect(scores.rawBaselineScore).toBe(0);
    expect(scores.capacityScore).toBeCloseTo(87.5, 6);
    expect(scores.trainingTargetScore).toBeCloseTo(71.75, 6);
  });

  it("[new] an unknown PR uses the recent mean alone", () => {
    const scores = deriveLiftingEngineScores({ history: [lift()], currentE1RMKg: null, now: NOW });
    expect(scores.rawBaselineScore).toBeNull();
    expect(scores.capacityScore).toBeCloseTo(116.666667, 5);
    expect(scores.trainingTargetScore).toBeCloseTo(95.666667, 5);
  });

  it("[new] skips invalid sets, counts zero-load sets as 0 and caps uncertainty at 1", () => {
    const history = [
      lift({ sessionId: "s1", ago: 3 }),
      lift({ sessionId: "s2", weightKg: 0, reps: 10, ago: 2 }),
      lift({ sessionId: "s3", reps: 4.5, ago: 1 }),
    ];
    const scores = deriveLiftingEngineScores({ history, currentE1RMKg: 100, now: NOW });
    // adjusted [116.6667, 0] → mean 58.3333; capacity 43.75 + 25 = 68.75; spread 1.414 → 1
    expect(scores.distinctSessionCount).toBe(3);
    expect(scores.capacityScore).toBeCloseTo(68.75, 6);
    expect(scores.uncertaintyPct).toBe(1);
    expect(scores.calibrationState).toBe("provisional");
    expect(scores.trainingTargetScore).toBeCloseTo(60.5, 6);
  });

  it("[new] gives the same scores for ISO-string dates as for Date objects", () => {
    const withDates = sixLifts(95);
    const withStrings = withDates.map((e) => ({ ...e, date: (e.date as Date).toISOString() }));
    expect(deriveLiftingEngineScores({ history: withStrings, currentE1RMKg: 100, now: NOW })).toEqual(
      deriveLiftingEngineScores({ history: withDates, currentE1RMKg: 100, now: NOW }),
    );
  });
});

describe("cardio scorers [app]", () => {
  it("scores each metric from its own field only", () => {
    const entry = { durationSeconds: 1800, distanceKm: 5, mets: null };
    expect(estimateCardioCapacityScoreForMetric(entry, "distance_km")).toBe(50);
    expect(estimateCardioCapacityScoreForMetric(entry, "mets_min")).toBeNull();
    expect(estimateCardioCapacityScoreForMetric(entry, "duration_min")).toBe(30);
    expect(estimateCardioCapacityScoreForMetric({ durationSeconds: 0, mets: 9 }, "mets_min")).toBeNull();
  });

  it("never scores speed × duration", () => {
    const entry = { durationSeconds: 1800, distanceKm: null, mets: null, avgSpeedKmh: 10 };
    expect(estimateCardioCapacityScoreForMetric(entry, "duration_min")).toBe(30);
  });

  it("scores the raw baseline in priority order", () => {
    expect(estimateCardioRawBaselineScore(bests({ bestMETs: 12, bestDurationSeconds: 2400 }))).toBe(480);
    expect(estimateCardioRawBaselineScore(bests({ bestDistanceKm: 8 }))).toBe(80);
    expect(estimateCardioRawBaselineScore(bests({ bestDurationSeconds: 3000 }))).toBe(50);
    expect(estimateCardioRawBaselineScore(bests({ bestDurationSeconds: 0 }))).toBeNull();
    expect(estimateCardioRawBaselineScoreForMetric(bests({ bestDistanceKm: 5 }), "distance_km")).toBe(50);
  });

  it("picks the metric with the most scored entries; ties go to mets_min", () => {
    const allMets = [1, 2, 3].map((i) => cardio({ sessionId: `s${i}`, mets: 8 }));
    expect(pickDominantCardioMetric(allMets)).toBe("mets_min");
    const allDistance = [1, 2, 3].map((i) => cardio({ sessionId: `s${i}`, distanceKm: 5 }));
    expect(pickDominantCardioMetric(allDistance)).toBe("distance_km");
    // Every valid entry has a duration score, so mixed METs/distance history is scored on duration.
    const mixed = [...allMets, ...allDistance];
    expect(pickDominantCardioMetric(mixed)).toBe("duration_min");
  });
});

describe("deriveCardioEngineScores", () => {
  it("[app] derives a stable state from consistent MET history", () => {
    const history = Array.from({ length: 6 }, (_v, i) =>
      cardio({ sessionId: `s${i}`, ago: 6 - i, distanceKm: 5, mets: 9 }),
    );
    const scores = deriveCardioEngineScores({
      history,
      bests: bests({ bestMETs: 9.2, bestDurationSeconds: 1900, bestDistanceKm: 5.2 }),
      now: NOW,
    });
    expect(scores.calibrationState).toBe("stable");
    expect(scores.capacityScore).toBeCloseTo(270, 6);
    expect(scores.rawBaselineScore).toBeCloseTo(291.333333, 5);
    expect(scores.trainingTargetScore).toBeCloseTo(248.4, 6);
  });

  it("[app] demotes genuinely high-variance history", () => {
    const history = Array.from({ length: 6 }, (_v, i) => cardio({ sessionId: `s${i}`, ago: 6 - i, mets: i % 2 === 0 ? 4 : 12 }));
    const scores = deriveCardioEngineScores({ history, bests: bests({ bestMETs: 12 }), now: NOW });
    expect(scores.uncertaintyPct).toBeCloseTo(0.547723, 5);
    expect(scores.calibrationState).toBe("provisional");
    expect(scores.trainingTargetScore).toBeCloseTo(211.2, 6);
  });

  it("[app] scores mixed METs/distance history on one metric, so spread stays 0", () => {
    const history = [
      ...[5, 4, 3].map((ago) => cardio({ sessionId: `d${ago}`, ago, distanceKm: 5 })),
      ...[2, 1, 0].map((ago) => cardio({ sessionId: `m${ago}`, ago, mets: 9 })),
    ];
    const scores = deriveCardioEngineScores({ history, bests: bests({ bestMETs: 9, bestDistanceKm: 5 }), now: NOW });
    expect(scores.capacityScore).toBe(30);
    expect(scores.uncertaintyPct).toBe(0);
    expect(scores.calibrationState).toBe("stable");
  });

  it("[server C1–C3, C7] means per-entry scores on the dominant metric, with no PR blend", () => {
    const run = (entries: CardioEngineSample[], b: CardioEngineBests) =>
      deriveCardioEngineScores({ history: entries, bests: b, now: NOW });
    const c1 = run([8, 9, 10].map((mets, i) => cardio({ sessionId: `s${i}`, mets, ago: 20 - i * 6 })), bests({ bestMETs: 10 }));
    expect(c1.capacityScore).toBeCloseTo(270, 6);
    expect(c1.rawBaselineScore).toBeCloseTo(300, 6);
    const c2 = run([5, 6, 7].map((distanceKm, i) => cardio({ sessionId: `s${i}`, distanceKm, ago: 20 - i * 6 })), bests({ bestDistanceKm: 7 }));
    expect(c2.capacityScore).toBeCloseTo(60, 6);
    expect(c2.rawBaselineScore).toBeCloseTo(70, 6);
    const c3 = run(
      [1800, 2400, 3000].map((durationSeconds, i) => cardio({ sessionId: `s${i}`, durationSeconds, ago: 20 - i * 6 })),
      bests({ bestDurationSeconds: 3000 }),
    );
    expect(c3.capacityScore).toBeCloseTo(40, 6);
    expect(c3.rawBaselineScore).toBeCloseTo(50, 6);
    const c7 = run([4, 6].map((distanceKm, i) => cardio({ sessionId: `s${i}`, distanceKm, ago: 14 - i * 7 })), bests({ bestDistanceKm: 10 }));
    expect(c7.capacityScore).toBeCloseTo(50, 6);
  });

  it("[server C8, C9] derives calibration from sessions and staleness", () => {
    const run = (count: number, newestAgo: number) =>
      deriveCardioEngineScores({
        history: Array.from({ length: count }, (_v, i) => cardio({ sessionId: `s${i}`, ago: newestAgo + i * 3 })),
        bests: bests(),
        now: NOW,
      }).calibrationState;
    expect(deriveCardioEngineScores({ history: [], bests: bests(), now: NOW }).calibrationState).toBe("no_data");
    expect(run(1, 5)).toBe("calibrating");
    expect(run(3, 5)).toBe("provisional");
    expect(run(6, 5)).toBe("stable");
    expect(run(6, 65)).toBe("provisional");
  });

  it("[server C13] applies no layoff decay to cardio", () => {
    const scores = deriveCardioEngineScores({
      history: Array.from({ length: 6 }, (_v, i) => cardio({ sessionId: `s${i}`, ago: 200 + i * 3 })),
      bests: bests(),
      now: NOW,
    });
    expect(scores.calibrationState).toBe("provisional");
    expect(scores.trainingTargetScore).toBeCloseTo(26.4, 10);
  });

  it("[new, replaces server C10] all-outlier history calibrates on the PR alone", () => {
    const history = [cardio({ sessionId: "s1", isOutlier: true, ago: 5 }), cardio({ sessionId: "s2", isOutlier: true, ago: 10 })];
    const scores = deriveCardioEngineScores({ history, bests: bests(), now: NOW });
    expect(scores).toMatchObject({
      calibrationState: "calibrating",
      rawBaselineScore: 30,
      capacityScore: 30,
      uncertaintyPct: null,
      distinctSessionCount: 0,
    });
    expect(scores.trainingTargetScore).toBeCloseTo(24.6, 10);
  });

  it("[new] falls back to the PR when no entry can be scored", () => {
    const scores = deriveCardioEngineScores({ history: [cardio({ durationSeconds: 0 })], bests: bests(), now: NOW });
    expect(scores.capacityScore).toBe(30);
    expect(scores.calibrationState).toBe("calibrating");
    expect(scores.trainingTargetScore).toBeCloseTo(24.6, 10);
  });
});
