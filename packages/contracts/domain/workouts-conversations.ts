/**
 * @ai-context Workouts AI conversation threads | ConversationThreadSchema,
 * ConversationAppendBodySchema, ConversationAutoReplyBodySchema,
 * ConversationAutoReplyResponseSchema, ConversationAutoReplyDecisionSchema.
 *
 * The durable per-week conversational layer behind the Sunday Review reply
 * affordance and the AI Conversations inbox (Workouts AI spec §9.4.7 / §10).
 * A thread is scoped to (week, source, slideId) — every user reply on a given
 * Sunday Review slide appends to the same thread rather than starting a new one.
 *
 * Name note: `ConversationTurn`, not `ConversationMessage` — the latter is
 * already taken by the Smart Builder wire in ai/workout-ai-wire.ts and both
 * modules are re-exported from the package root.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';

/** ISO week key, e.g. "2026-W34". Matches the weeks/rolling-summary contracts. */
const weekIsoSchema = z.string().regex(/^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/);

/**
 * Every AI surface that can produce a message a user may reply to (spec §10).
 * Closed vocabulary — a new surface is a contracts change, not a runtime string.
 */
export const CONVERSATION_SOURCES = [
  'sunday_review',
  'daily_notification',
  'weekly_notification',
  'plateau',
  'critique',
  'chatbot',
] as const;
export const ConversationSourceSchema = z.enum(CONVERSATION_SOURCES);
export type ConversationSource = z.infer<typeof ConversationSourceSchema>;

/** Max characters in a single conversational turn (user reply or AI response). */
export const CONVERSATION_TURN_TEXT_MAX = 2000;
/** Max turns retained on one thread; the server drops the oldest beyond this. */
export const CONVERSATION_THREAD_TURN_MAX = 100;

/**
 * Points at the Sunday Review slide a thread hangs off. Present only when
 * `source === 'sunday_review'`; the deck is frozen at generation, so the slide
 * is addressed by (weekIso, slideId) rather than by a threadId written back
 * into the deck document.
 */
export const ConversationSlideRefSchema = z.object({
  weekIso: weekIsoSchema,
  slideId: z.string().min(1).max(200),
});
export type ConversationSlideRef = z.infer<typeof ConversationSlideRefSchema>;

/** One turn in a thread. */
export const ConversationTurnSchema = z.object({
  role: z.enum(['ai', 'user']),
  text: z.string().min(1).max(CONVERSATION_TURN_TEXT_MAX),
  timestamp: z.string().datetime(),
});
export type ConversationTurn = z.infer<typeof ConversationTurnSchema>;

/** A full thread as served to the client. */
export const ConversationThreadSchema = z.object({
  id: z.string().min(1),
  weekIso: weekIsoSchema,
  source: ConversationSourceSchema,
  slideRef: ConversationSlideRefSchema.nullable().optional(),
  /**
   * The AI message the first user reply was answering, quoted verbatim so the
   * inbox and the reply sheet can render the thread without re-reading the
   * frozen deck. Null for surfaces that carried no quotable copy.
   */
  quotedText: z.string().max(CONVERSATION_TURN_TEXT_MAX).nullable().optional(),
  messages: z.array(ConversationTurnSchema).max(CONVERSATION_THREAD_TURN_MAX),
  /** Deterministic signal keys the source surface had on screen (spec §10). */
  surfacedSignals: z.array(z.string().max(120)).max(20),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
export type ConversationThread = z.infer<typeof ConversationThreadSchema>;

/**
 * POST /v1/conversations — append one user turn, creating the thread on first
 * reply. Deliberately NOT entitlement-gated: a user's own words must persist
 * whether or not their AI subscription is active. The AI response is a separate
 * call (see ConversationAutoReplyBodySchema).
 */
export const ConversationAppendBodySchema = z.object({
  weekIso: weekIsoSchema,
  source: ConversationSourceSchema,
  slideRef: ConversationSlideRefSchema.nullable().optional(),
  quotedText: z.string().max(CONVERSATION_TURN_TEXT_MAX).nullable().optional(),
  text: z.string().min(1).max(CONVERSATION_TURN_TEXT_MAX),
  surfacedSignals: z.array(z.string().max(120)).max(20).optional(),
});
export type ConversationAppendBody = z.infer<typeof ConversationAppendBodySchema>;

/**
 * POST /v1/ai/conversation-reply — ask the model whether this thread earns a
 * one-sentence acknowledgment or follow-up question (spec §9.4.7 threshold),
 * appending it to the thread when it does. Entitlement-gated and metered.
 */
export const ConversationAutoReplyBodySchema = z.object({
  threadId: z.string().min(1),
});
export type ConversationAutoReplyBody = z.infer<typeof ConversationAutoReplyBodySchema>;

/**
 * Structured model output for the auto-response decision. `reply` is required
 * to be empty when `shouldRespond` is false so a declined turn cannot smuggle
 * copy through.
 */
export const ConversationAutoReplyDecisionSchema = z.object({
  shouldRespond: z.boolean(),
  reply: z.string().max(400),
});
export type ConversationAutoReplyDecision = z.infer<typeof ConversationAutoReplyDecisionSchema>;

export const ConversationAutoReplyResponseSchema = z.object({
  thread: ConversationThreadSchema,
  /** False when the model judged the reply did not earn a response. */
  responded: z.boolean(),
});
export type ConversationAutoReplyResponse = z.infer<typeof ConversationAutoReplyResponseSchema>;
