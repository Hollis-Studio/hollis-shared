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

import { SmartBuilderDraftPayloadSchema } from "../persistence.js";

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
