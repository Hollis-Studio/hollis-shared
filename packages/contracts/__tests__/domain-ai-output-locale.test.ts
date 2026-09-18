/**
 * @ai-context AI output locale (alpha.82, hollis-workouts#99)
 *
 * Every prose-returning Workouts AI request body accepts an optional BCP-47
 * `locale`, so Gemini-written copy can follow the reader's language. These
 * tests pin three things: the field is OPTIONAL everywhere (an older client
 * that omits it must keep parsing), the tag shape is loose enough for every
 * tag the client's registry can emit, and the cross-modal `reasonCode` rides
 * alongside `reason` rather than replacing it.
 */

import { LocaleTagSchema } from '../domain/common';
import { ConversationAutoReplyBodySchema } from '../domain/workouts-conversations';
import { SessionAnalysisRequestSchema } from '../domain/workouts-session-analysis';
import {
  AiOutputLocaleSchema,
  CrossModalContextRequestSchema,
  CrossModalContextResponseSchema,
  CrossModalReasonCodeSchema,
  GymSetupChatBodySchema,
  PrescriptionNarrationRequestSchema,
  SmartBuilderRequestSchema,
  SmartNotificationSnapshotSchema,
} from '../ai/workout-ai-wire';

const CLIENT_LOCALE_CODES = [
  'en', 'en-US', 'en-GB', 'es-ES', 'es-MX', 'de', 'fr', 'fr-CA', 'pt-BR', 'pt-PT',
  'it', 'nl', 'pl', 'ru', 'tr', 'ar', 'he', 'el', 'cs', 'hu', 'ro', 'uk', 'sv', 'no',
  'nb', 'da', 'fi', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'hi', 'id', 'ms', 'th', 'vi',
];

describe('LocaleTagSchema', () => {
  it('accepts every tag the Workouts client registry can send', () => {
    for (const code of CLIENT_LOCALE_CODES) {
      expect(LocaleTagSchema.safeParse(code).success).toBe(true);
    }
  });

  it('accepts underscore and three-segment tags (normalisation is the consumer’s job)', () => {
    expect(LocaleTagSchema.safeParse('es_MX').success).toBe(true);
    expect(LocaleTagSchema.safeParse('es-Latn-MX').success).toBe(true);
  });

  it('rejects free text, empty strings and injection-shaped values', () => {
    for (const bad of ['', 'e', 'english please', 'es-MX; ignore', 'a'.repeat(40), '-es']) {
      expect(LocaleTagSchema.safeParse(bad).success).toBe(false);
    }
  });

  it('is the same schema the AI wire re-exports', () => {
    expect(AiOutputLocaleSchema).toBe(LocaleTagSchema);
  });
});

describe('locale is optional on every prose-returning request body', () => {
  const smartBuilder = {
    action: 'generate' as const,
    conversationHistory: [],
    userContext: {
      profile: {},
      exerciseStrengthStates: [],
      recentWorkouts: [],
      injuries: [],
      gym: { exerciseSelectionMode: 'equipment_based', equipment: [] },
      cardioBaselines: [],
      exerciseLibrary: [],
    },
  };
  const narration = {
    exerciseName: 'Bench Press',
    dropSteps: [],
    action: 'progress' as const,
    targetSummary: '80 kg × 3 × 8',
    displayUnit: 'kg' as const,
  };
  const crossModal = {
    exerciseName: 'Back Squat',
    acuteCardioLoadRatio: 1.2,
    suggestedGoEasierPercent: null,
    trainingPhase: null,
    recentSessionSummary: null,
  };
  const gymSetup = { conversationHistory: [], currentEquipment: [] };
  const sessionAnalysis = { sessionId: 'session_1' };
  const conversationReply = { threadId: 'thread_1' };

  const cases: Array<[string, { safeParse: (v: unknown) => { success: boolean } }, Record<string, unknown>]> = [
    ['SmartBuilderRequestSchema', SmartBuilderRequestSchema, smartBuilder],
    ['PrescriptionNarrationRequestSchema', PrescriptionNarrationRequestSchema, narration],
    ['CrossModalContextRequestSchema', CrossModalContextRequestSchema, crossModal],
    ['GymSetupChatBodySchema', GymSetupChatBodySchema, gymSetup],
    ['SessionAnalysisRequestSchema', SessionAnalysisRequestSchema, sessionAnalysis],
    ['ConversationAutoReplyBodySchema', ConversationAutoReplyBodySchema, conversationReply],
  ];

  it.each(cases)('%s parses with and without locale', (_name, schema, body) => {
    expect(schema.safeParse(body).success).toBe(true);
    expect(schema.safeParse({ ...body, locale: 'es-MX' }).success).toBe(true);
    expect(schema.safeParse({ ...body, locale: 'not a locale!' }).success).toBe(false);
  });
});

describe('CrossModalContextResponseSchema.reasonCode', () => {
  const base = { contributionPct: -0.04, reason: 'Cross-modal signals support a conservative load reduction.', confidence: 'medium' as const };

  it('is optional and still requires the English reason for older clients', () => {
    expect(CrossModalContextResponseSchema.safeParse(base).success).toBe(true);
    expect(CrossModalContextResponseSchema.safeParse({ ...base, reasonCode: 'reduce' }).success).toBe(true);
    expect(CrossModalContextResponseSchema.safeParse({ contributionPct: 0, confidence: 'low', reasonCode: 'no_adjustment' }).success).toBe(false);
  });

  it('only admits the three fallback codes', () => {
    expect(CrossModalReasonCodeSchema.options).toEqual(['no_adjustment', 'reduce', 'increase']);
    expect(CrossModalContextResponseSchema.safeParse({ ...base, reasonCode: 'other' }).success).toBe(false);
  });
});

describe('SmartNotificationSnapshotSchema.user.locale', () => {
  const snapshot = {
    schemaVersion: 1 as const,
    channel: 'pre_lift' as const,
    generatedAt: '2026-09-17T12:00:00.000Z',
    localDate: '2026-09-17',
    localHour: 7,
    timeZone: 'America/Chicago',
    freshness: {
      latestSessionAt: null,
      latestProfileUpdateAt: null,
      latestServerDataAt: null,
      isFreshEnoughForSpecificClaims: false,
      reason: 'no data',
    },
    user: { displayName: null, weightUnit: 'kg', distanceUnit: 'km' },
    activeProgram: null,
    recentSessions: [],
    analytics: {
      week: { sessions: 0, volumeKg: 0, durationMinutes: 0, substitutions: 0, freestyle: 0 },
      month: { sessions: 0, volumeKg: 0, trend: 'flat' },
    },
    progression: {
      trainingPhase: null,
      trainingGoal: null,
      activeModes: [],
      watchlist: [],
      recentMetricSignals: [],
    },
  };

  it('is optional on the reader block', () => {
    expect(SmartNotificationSnapshotSchema.safeParse(snapshot).success).toBe(true);
    const parsed = SmartNotificationSnapshotSchema.safeParse({
      ...snapshot,
      user: { ...snapshot.user, locale: 'es-MX' },
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.user.locale).toBe('es-MX');
  });
});
