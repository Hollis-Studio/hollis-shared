/**
 * @ai-context Workouts Sunday Review contract (alpha.91, hollis-workouts#239)
 *
 * Pins what the server and the app used to agree on by hand: the payload
 * registry covers every slide type, the stored freeform payload is the 2-field
 * form (not the 4-field AI output), phases come from their owning contracts,
 * readers are forward-compatible (unknown keys stripped, unknown slide types
 * accepted), and the snapshot is read at exactly one version.
 */

import * as z from "zod";

import { PROGRAM_PHASES } from "../domain/training-session-log";
import { ProgramRotationPhaseSchema } from "../domain/workouts-program-rotation";
import {
  FreeformPayloadSchema,
  FreeformSlidePayloadSchema,
  RotationSwitchPayloadSchema,
  SUNDAY_REVIEW_SLIDE_TYPES,
  SlidePayloadSchemas,
  SundayReviewDeckSchema,
  WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION,
  WORKOUTS_BODY_REGIONS,
  WeekClientSnapshotSchema,
  WeekRotationSwitchSchema,
} from "../domain/workouts-sunday-review";
import type { SundayReviewSlideType } from "../domain/workouts-sunday-review";

const rotationSwitch = {
  entryId: "entry_winter_maintain",
  programId: null,
  programName: "Winter maintain",
  phase: "maintain" as const,
  fromPhase: "build" as const,
  endingProgramName: "Fall Bulk",
  startDate: "2026-11-30",
  endDate: "2027-02-28",
  switchDate: "2026-11-30",
};

const validPayloads: Record<SundayReviewSlideType, unknown> = {
  week_headline: {
    sessionsCount: 4,
    totalVolumeKg: 12000,
    deltaPctVsLastWeek: 0.052,
    weekRangeLabel: "Jul 6 – Jul 12",
  },
  pr_celebration: {
    count: 1,
    prs: [
      {
        canonicalExerciseId: "bench",
        exerciseName: "Bench Press",
        e1rm: 105,
        previousBest: 102.5,
        sessionId: "session_1",
        dateIso: "2026-07-07",
      },
    ],
  },
  volume_delta: {
    byMuscleGroup: [{ muscleGroup: "chest", volumeKg: 4200, deltaPct: 0.1, avgVolumeKg4w: 3900, prevWeekVolumeKg: 3800 }],
  },
  muscle_group_balance: { regions: [{ region: "chest", percent: 0.25, color: "ok" }] },
  standout_lift: {
    canonicalExerciseId: "squat",
    name: "Back Squat",
    deltaPct4w: 0.08,
    e1rmCurrent: 160,
    e1rmFourWeeksAgo: 148,
    sessionsContributing: 4,
  },
  plateau_watch: {
    canonicalExerciseId: "ohp",
    name: "Overhead Press",
    weeksFlat: 4,
    lastTopSet: { weightKg: 60, reps: 5 },
    e1rmCurrent: 70,
    e1rmFourWeeksAgo: 70,
  },
  consistency_streak: { kind: "streak", weeks: 6, lastSessionDate: "2026-07-11" },
  sleep_correlation: {
    r: 0.62,
    n: 9,
    weeksWindow: 5,
    points: [{ dateIso: "2026-06-01", sleepHours: 6.2, perfNorm: -0.8 }],
  },
  calorie_correlation: {
    r: -0.1,
    n: 8,
    weeksWindow: 4,
    points: [{ dateIso: "2026-06-02", calories: 2400, perfNorm: 0.3 }],
  },
  phase_outlook: {
    from: "hypertrophy",
    to: "strength",
    reason: "Rep PRs have stalled for three weeks.",
    reasonCopy: { key: "sundayReview.phaseOutlook.reason", params: { fromPhase: "build", toPhase: "maintain" } },
    suggestedDiff: { kind: "phase_change", from: "hypertrophy", to: "strength" },
  },
  rotation_switch: rotationSwitch,
  next_week_preview: {
    upcoming: [{ dateIso: "2026-07-13", label: "Mon", sessionSummary: "Push A" }],
    deloadInWeeks: 2,
    jumpThresholdLifts: [{ canonicalExerciseId: "bench", name: "Bench Press", currentE1rm: 102.4, jumpAtE1rm: 105 }],
  },
  freeform: { headline: "Consistent Tuesday sessions", body: "Tuesdays outperform other training days this month." },
  sparse_data_note: { weeksOfData: 2, sessionsTotal: 3 },
};

function payloadSchema(type: SundayReviewSlideType): z.ZodType {
  return SlidePayloadSchemas[type];
}

describe("SlidePayloadSchemas", () => {
  it("has exactly one entry per slide type", () => {
    expect(Object.keys(SlidePayloadSchemas).sort()).toEqual([...SUNDAY_REVIEW_SLIDE_TYPES].sort());
  });

  it.each(SUNDAY_REVIEW_SLIDE_TYPES.map((type) => [type]))("accepts a well-formed %s payload", (type) => {
    const result = payloadSchema(type).safeParse(validPayloads[type]);
    expect(result.success ? [] : result.error.issues).toEqual([]);
  });

  it("strips unknown keys instead of rejecting them (a newer producer cannot break an older reader)", () => {
    const parsed = SlidePayloadSchemas.week_headline.parse({ ...(validPayloads.week_headline as object), addedLater: 1 });
    expect(parsed).not.toHaveProperty("addedLater");
  });

  it("accepts a volume row from a deck frozen before the 4-week fields existed", () => {
    const result = SlidePayloadSchemas.volume_delta.safeParse({
      byMuscleGroup: [{ muscleGroup: "chest", volumeKg: 4200, deltaPct: 0.1 }],
    });
    expect(result.success).toBe(true);
  });

  it("treats the balance percent as a fraction and regions as the closed vocabulary", () => {
    expect(WORKOUTS_BODY_REGIONS).toEqual(["chest", "back", "arms", "shoulders", "core", "legs"]);
    expect(
      SlidePayloadSchemas.muscle_group_balance.safeParse({ regions: [{ region: "chest", percent: 25, color: "ok" }] }).success,
    ).toBe(false);
    expect(
      SlidePayloadSchemas.muscle_group_balance.safeParse({ regions: [{ region: "glutes", percent: 0.2, color: "ok" }] }).success,
    ).toBe(false);
  });
});

describe("freeform: stored payload vs AI output", () => {
  const stored = validPayloads.freeform as { headline: string; body: string };

  it("renders the 2-field payload a deck stores", () => {
    expect(SlidePayloadSchemas.freeform).toBe(FreeformSlidePayloadSchema);
    expect(FreeformSlidePayloadSchema.parse(stored)).toEqual(stored);
  });

  it("keeps the 4-field AI output schema strict about its metadata", () => {
    expect(FreeformPayloadSchema.safeParse(stored).success).toBe(false);
    expect(
      FreeformPayloadSchema.safeParse({ ...stored, confidence: "medium", reasoning: "Six weeks of data." }).success,
    ).toBe(true);
  });

  it("drops AI metadata when a 4-field payload is read as a stored slide", () => {
    const parsed = FreeformSlidePayloadSchema.parse({ ...stored, confidence: "medium", reasoning: "x" });
    expect(Object.keys(parsed).sort()).toEqual(["body", "headline"]);
  });
});

describe("phase vocabularies come from their owning contracts", () => {
  it("phase_outlook uses ProgramPhases, not training phases", () => {
    const base = validPayloads.phase_outlook as Record<string, unknown>;
    for (const phase of PROGRAM_PHASES) {
      const payload = { ...base, from: phase, to: phase, suggestedDiff: { kind: "phase_change", from: phase, to: phase } };
      expect(SlidePayloadSchemas.phase_outlook.safeParse(payload).success).toBe(true);
    }
    expect(SlidePayloadSchemas.phase_outlook.safeParse({ ...base, to: "build" }).success).toBe(false);
  });

  it("rotation_switch uses training phases, not ProgramPhases", () => {
    for (const phase of ProgramRotationPhaseSchema.options) {
      expect(RotationSwitchPayloadSchema.safeParse({ ...rotationSwitch, phase }).success).toBe(true);
    }
    expect(RotationSwitchPayloadSchema.safeParse({ ...rotationSwitch, phase: "hypertrophy" }).success).toBe(false);
  });

  it("rotation dates are local civil dates, never instants", () => {
    expect(
      RotationSwitchPayloadSchema.safeParse({ ...rotationSwitch, switchDate: "2026-11-30T00:00:00.000Z" }).success,
    ).toBe(false);
  });
});

describe("WeekClientSnapshotSchema", () => {
  const snapshot = {
    schemaVersion: WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION,
    weekIso: "2026-W27",
    capturedAt: "2026-07-05T20:00:00.000Z",
    sleepCorrelation: validPayloads.sleep_correlation,
    calorieCorrelation: validPayloads.calorie_correlation,
    jumpThresholdLifts: (validPayloads.next_week_preview as { jumpThresholdLifts: unknown[] }).jumpThresholdLifts,
    phaseOutlook: {
      from: "hypertrophy",
      to: "strength",
      reason: "Rep PRs have stalled for three weeks.",
      confidence: 0.8,
    },
    rotationSwitch,
  };

  it("reads a full version-3 envelope", () => {
    expect(WEEK_CLIENT_SNAPSHOT_SCHEMA_VERSION).toBe(3);
    const result = WeekClientSnapshotSchema.safeParse(snapshot);
    expect(result.success ? [] : result.error.issues).toEqual([]);
  });

  it("reads only the version it knows", () => {
    expect(WeekClientSnapshotSchema.safeParse({ ...snapshot, schemaVersion: 2 }).success).toBe(false);
    expect(WeekClientSnapshotSchema.safeParse({ ...snapshot, schemaVersion: 4 }).success).toBe(false);
  });

  it("carries the rotation rider in the slide payload's exact shape", () => {
    expect(WeekRotationSwitchSchema).toBe(RotationSwitchPayloadSchema);
  });

  it("bounds the device's confidence and never trusts a device-supplied diff", () => {
    expect(
      WeekClientSnapshotSchema.safeParse({ ...snapshot, phaseOutlook: { ...snapshot.phaseOutlook, confidence: 1.2 } }).success,
    ).toBe(false);
    const parsed = WeekClientSnapshotSchema.parse({
      ...snapshot,
      phaseOutlook: { ...snapshot.phaseOutlook, suggestedDiff: { kind: "phase_change", from: "deload", to: "peaking" } },
    });
    expect(parsed.phaseOutlook).not.toHaveProperty("suggestedDiff");
  });
});

describe("SundayReviewDeckSchema", () => {
  const deck = {
    generatedAt: "2026-07-13T08:00:00.000Z",
    modelTier: "flash",
    snapshotVersion: 1,
    slides: [
      { id: "s1", type: "week_headline", payload: validPayloads.week_headline, narrative: "A strong week." },
      {
        id: "s2",
        type: "sparse_data_note",
        payload: validPayloads.sparse_data_note,
        narrative: "Early days.",
        narrativeCopy: { key: "sundayReview.fallbackNarrative.sparse", params: { weeks: 2 } },
      },
      { id: "s3", type: "freeform", payload: validPayloads.freeform, narrative: "Tuesdays outperform." },
    ],
    deckOrdering: [0, 1, 2],
  };

  it("reads a generated deck", () => {
    const result = SundayReviewDeckSchema.safeParse(deck);
    expect(result.success ? [] : result.error.issues).toEqual([]);
  });

  it("accepts a slide type this reader does not know yet (rendered as one error slide, not a lost deck)", () => {
    const withNewType = { ...deck, slides: [...deck.slides, { id: "s4", type: "added_later", payload: {}, narrative: "" }] };
    expect(SundayReviewDeckSchema.safeParse(withNewType).success).toBe(true);
  });

  it("rejects a deck missing its envelope fields or carrying an unknown model tier", () => {
    const { generatedAt: _omitted, ...withoutGeneratedAt } = deck;
    expect(SundayReviewDeckSchema.safeParse(withoutGeneratedAt).success).toBe(false);
    expect(SundayReviewDeckSchema.safeParse({ ...deck, modelTier: "ultra" }).success).toBe(false);
    expect(SundayReviewDeckSchema.safeParse({ ...deck, deckOrdering: [-1] }).success).toBe(false);
  });

  it("rejects a narrativeCopy without a key", () => {
    const badCopy = { ...deck, slides: [{ ...deck.slides[1], narrativeCopy: { key: "" } }] };
    expect(SundayReviewDeckSchema.safeParse(badCopy).success).toBe(false);
  });
});
