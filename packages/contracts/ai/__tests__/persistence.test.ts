/**
 * @ai-context Smart Builder draft-persistence schema tests.
 *
 * Pins the alpha.49 write-side hygiene bounds on
 * `SmartBuilderDraftPayloadSchema` AND the deliberate permissiveness that
 * keeps converse-era rows readable. The bounds cap what a client may newly
 * persist; the server's GET route must safeParse-quarantine stored rows and
 * never throw, because rows written before these bounds existed may violate
 * them.
 */

import {
  AiFeatureModelUsageSchema,
  AiFeatureUsageSchema,
  AiTokenUsageAdminSummarySchema,
  SmartBuilderDraftPayloadSchema,
} from "../persistence.js";

const turn = (content: string, role: "user" | "assistant" = "user") => ({
  role,
  content,
  timestamp: 1_754_870_400_000,
});

const basePayload = {
  conversationHistory: [turn("build me a push/pull/legs program")],
  currentProgram: null,
  phase: "preview" as const,
  userAnswers: {},
  createdAt: 1_754_870_400_000,
  updatedAt: 1_754_870_400_000,
};

describe("SmartBuilderDraftPayloadSchema", () => {
  it("parses a valid minimal payload", () => {
    expect(SmartBuilderDraftPayloadSchema.safeParse(basePayload).success).toBe(true);
  });

  it("still parses a converse-era row (phase 'conversing' + questionGroups)", () => {
    // Retired from the wire, NOT from the database. `phase`, `questionGroups`,
    // and `currentProgram` stay permissive so drafts written during the
    // converse flow remain readable forever.
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        phase: "conversing",
        questionGroups: [
          { topic: "goals", questions: [{ id: "q1", question: "Goal?", type: "chips" }] },
        ],
        readyMessage: "Ready when you are",
      }).success,
    ).toBe(true);
  });

  it("caps a conversation turn's content at 24k chars", () => {
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        conversationHistory: [turn("x".repeat(24_000))],
      }).success,
    ).toBe(true);
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        conversationHistory: [turn("x".repeat(24_001))],
      }).success,
    ).toBe(false);
  });

  it("ACCEPTS an empty turn content", () => {
    // No .min(1): an edits-branch turn could historically carry an empty
    // message, and those rows must stay readable.
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        conversationHistory: [turn("")],
      }).success,
    ).toBe(true);
  });

  it("caps conversationHistory at 50 turns (the wire request cap)", () => {
    const history = (n: number) => Array.from({ length: n }, (_, i) => turn(`turn ${i}`));
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({ ...basePayload, conversationHistory: history(50) })
        .success,
    ).toBe(true);
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({ ...basePayload, conversationHistory: history(51) })
        .success,
    ).toBe(false);
  });

  it("accepts pinnedConstraints and stays optional for pre-alpha.51 rows (workouts #60c)", () => {
    const pin = {
      id: "c-9f2a",
      text: "never program deadlifts on a Monday",
      label: "Never deadlifts on Monday",
      kind: "prohibition" as const,
      pinnedAt: 1_754_870_400_000,
    };
    // Absent (every pre-alpha.51 row) parses — covered by basePayload above.
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        pinnedConstraints: [pin, { ...pin, id: "c-1b3c", kind: "schedule" as const }],
      }).success,
    ).toBe(true);
  });

  it("bounds pinnedConstraints: text 1000, label 120, 20 entries, known kinds only", () => {
    const pin = (over: Record<string, unknown> = {}) => ({
      id: "c-9f2a",
      text: "no squats",
      label: "No squats",
      kind: "prohibition",
      pinnedAt: 1_754_870_400_000,
      ...over,
    });
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        pinnedConstraints: [pin({ text: "x".repeat(1001) })],
      }).success,
    ).toBe(false);
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        pinnedConstraints: [pin({ label: "x".repeat(121) })],
      }).success,
    ).toBe(false);
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        pinnedConstraints: [pin({ kind: "vendetta" })],
      }).success,
    ).toBe(false);
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        pinnedConstraints: Array.from({ length: 21 }, (_, i) => pin({ id: `c-${i}` })),
      }).success,
    ).toBe(false);
  });

  it("bounds userAnswers string values and readyMessage", () => {
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        userAnswers: { goal: "x".repeat(1000), days: 4, cardio: true },
      }).success,
    ).toBe(true);
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        userAnswers: { goal: "x".repeat(1001) },
      }).success,
    ).toBe(false);
    expect(
      SmartBuilderDraftPayloadSchema.safeParse({
        ...basePayload,
        readyMessage: "x".repeat(4001),
      }).success,
    ).toBe(false);
  });
});

describe("AiFeatureModelUsageSchema / AiFeatureUsageSchema token classes (workouts #62)", () => {
  const base = { input: 100, output: 40, total: 140, calls: 2 };

  it("legacy rows without cached/audio classes still parse (alpha.51 back-compat)", () => {
    expect(AiFeatureModelUsageSchema.safeParse(base).success).toBe(true);
    expect(AiFeatureUsageSchema.safeParse(base).success).toBe(true);
  });

  it("accepts the enriched token classes on both per-model and per-feature shapes", () => {
    const enriched = { ...base, cachedInput: 60, audioInput: 900, cachedAudioInput: 300 };
    expect(AiFeatureModelUsageSchema.safeParse(enriched).success).toBe(true);
    expect(
      AiFeatureUsageSchema.safeParse({
        ...enriched,
        byModel: { "gemini-3.6-flash": enriched },
      }).success,
    ).toBe(true);
  });

  it("rejects negative or fractional token-class counts", () => {
    expect(AiFeatureModelUsageSchema.safeParse({ ...base, cachedInput: -1 }).success).toBe(false);
    expect(AiFeatureModelUsageSchema.safeParse({ ...base, audioInput: 1.5 }).success).toBe(false);
  });
});

describe("AiFeatureModelUsageSchema — alpha.58 image + long-context classes", () => {
  const base = { input: 100, output: 40, total: 140, calls: 2 };

  it("accepts imageInput and a longContext sub-bucket", () => {
    const enriched = {
      ...base,
      cachedInput: 30,
      imageInput: 20,
      longContext: { input: 60, output: 10, cachedInput: 30 },
    };
    expect(AiFeatureModelUsageSchema.safeParse(enriched).success).toBe(true);
    expect(
      AiFeatureUsageSchema.safeParse({ ...enriched, byModel: { "gemini-3.1-pro-preview": enriched } })
        .success,
    ).toBe(true);
  });

  it("still parses a row that carries no image / long-context fields", () => {
    expect(AiFeatureModelUsageSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a longContext bucket missing its required input/output", () => {
    expect(
      AiFeatureModelUsageSchema.safeParse({ ...base, longContext: { input: 10 } }).success,
    ).toBe(false);
  });

  it("rejects negative image counts", () => {
    expect(AiFeatureModelUsageSchema.safeParse({ ...base, imageInput: -1 }).success).toBe(false);
  });
});

describe("AiTokenUsageAdminSummarySchema — classed cost rollups (workouts #62)", () => {
  const rollupCounts = {
    input: 1_000,
    output: 200,
    total: 1_200,
    calls: 3,
    cachedInput: 400,
    imageInput: 100,
    costUsd: 0.0021,
    users: 1,
  };

  const { users: _users, ...accountCounts } = rollupCounts;

  it("requires costUsd on every rollup grain and defaults byFeatureModel", () => {
    const parsed = AiTokenUsageAdminSummarySchema.safeParse({
      month: "2026-08",
      totals: { ...rollupCounts },
      byFeature: [{ feature: "smart_builder_chat", ...rollupCounts }],
      byModel: [{ model: "gemini-3.7-flash", ...rollupCounts }],
      topAccounts: [{ userId: "u1", ...accountCounts, lastActiveMonth: "2026-08" }],
      rowsScanned: 1,
      truncated: false,
      generatedAt: "2026-08-24T00:00:00.000Z",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.byFeatureModel).toEqual([]);
  });

  it("rejects a feature rollup with no costUsd", () => {
    const { costUsd: _costUsd, ...noCost } = rollupCounts;
    expect(
      AiTokenUsageAdminSummarySchema.safeParse({
        month: null,
        totals: { ...rollupCounts },
        byFeature: [{ feature: "smart_builder_chat", ...noCost }],
        byModel: [],
        topAccounts: [],
        rowsScanned: 0,
        truncated: false,
        generatedAt: "2026-08-24T00:00:00.000Z",
      }).success,
    ).toBe(false);
  });
});
