import {
  FEEDBACK_BODY_MAX,
  FEEDBACK_LABELS_MAX,
  FEEDBACK_LABEL_MAX_LEN,
  FEEDBACK_SCREENSHOT_MAX_BYTES,
  FEEDBACK_SIMILAR_MAX_RESULTS,
  FEEDBACK_TITLE_MAX,
  FeedbackAdminPostSchema,
  FeedbackCreateSchema,
  FeedbackDiagnosticsSchema,
  FeedbackModerationDecisionSchema,
  FeedbackModerationEventSchema,
  FeedbackModerationQueueQuerySchema,
  FeedbackPublicListQuerySchema,
  FeedbackPublicPostListSchema,
  FeedbackPublicPostSchema,
  FeedbackScreenshotBase64Schema,
  FeedbackScreenshotResponseSchema,
  FeedbackSimilarQuerySchema,
  FeedbackSimilarResponseSchema,
  FeedbackTriageDecisionSchema,
  FeedbackTriageSuggestionSchema,
  WORKOUTS_FEEDBACK_ROUTES,
} from '../domain/workouts-feedback.js';

const create = {
  kind: 'bug',
  title: 'Timer stops',
  body: 'The rest timer stops when the screen locks.',
  source: 'app',
};

const row = {
  id: 'post-1',
  kind: 'bug',
  title: 'Timer stops for me, Jane Doe',
  body: 'My email is jane@example.com and the timer stops.',
  moderationState: 'published',
  status: 'investigating',
  publicTitle: 'Rest timer stops when the screen locks',
  publicBody: 'The rest timer pauses while the phone is locked.',
  mergedIntoId: null,
  hasScreenshot: true,
  voteCount: 3,
  createdAt: '2026-10-13T10:00:00.000Z',
  updatedAt: '2026-10-13T12:00:00.000Z',
  publishedAt: '2026-10-13T11:00:00.000Z',
  userId: 'user-1',
  source: 'app',
  product: 'workouts',
  labels: ['timer'],
  diagnostics: { appVersion: '4.32.446', platform: 'ios', osVersion: '19.0' },
  triageSuggestion: null,
  moderationHistory: [],
};

describe('feedback submission', () => {
  it('accepts a minimal report and trims text', () => {
    const parsed = FeedbackCreateSchema.parse({ ...create, title: '  Timer stops  ' });
    expect(parsed.title).toBe('Timer stops');
  });

  it('enforces title and body bounds after trimming', () => {
    for (const body of [
      { ...create, title: '   abc   ' },
      { ...create, title: 'a'.repeat(FEEDBACK_TITLE_MAX + 1) },
      { ...create, body: '  too short ' },
      { ...create, body: 'a'.repeat(FEEDBACK_BODY_MAX + 1) },
      { ...create, kind: 'question' },
      { ...create, source: 'email' },
    ]) expect(FeedbackCreateSchema.safeParse(body).success).toBe(false);
    expect(FeedbackCreateSchema.safeParse({ ...create, title: 'a'.repeat(FEEDBACK_TITLE_MAX) }).success).toBe(true);
  });

  it('strips server-owned fields from the body', () => {
    const parsed = FeedbackCreateSchema.parse({ ...create, userId: 'victim', product: 'health', moderationState: 'published' });
    expect(parsed).not.toHaveProperty('userId');
    expect(parsed).not.toHaveProperty('product');
    expect(parsed).not.toHaveProperty('moderationState');
  });

  it('bounds every diagnostics field', () => {
    expect(FeedbackDiagnosticsSchema.parse({})).toEqual({});
    const full = {
      appVersion: '4.32.446', buildNumber: '41666', updateId: 'b3c1d2e4-0000-4000-8000-000000000000',
      runtimeVersion: '4.32.0', platform: 'android', osVersion: '36', locale: 'en-GB',
      entryPoint: 'crash_screen', diagnosticCode: 'SYNC_PUSH_FAILED', sentryEventId: 'A'.repeat(32),
      sync: { pendingCount: 2, failedCount: 1, lastBackupAt: null }, route: '/settings/feedback',
    };
    expect(FeedbackDiagnosticsSchema.parse(full).sentryEventId).toBe('a'.repeat(32));
    for (const diagnostics of [
      { appVersion: 'x'.repeat(65) },
      { diagnosticCode: 'x'.repeat(65) },
      { route: '/'.repeat(129) },
      { sentryEventId: 'g'.repeat(32) },
      { sentryEventId: 'a'.repeat(31) },
      { platform: 'windows' },
      { entryPoint: 'push' },
      { sync: { pendingCount: -1 } },
      { sync: { lastBackupAt: 'yesterday' } },
    ]) expect(FeedbackDiagnosticsSchema.safeParse(diagnostics).success).toBe(false);
  });

  it('bounds the screenshot by decoded size and rejects non-base64', () => {
    expect(FeedbackCreateSchema.safeParse({ ...create, screenshotBase64: '/9j/4A==' }).success).toBe(true);
    const maxChars = 4 * Math.ceil(FEEDBACK_SCREENSHOT_MAX_BYTES / 3);
    expect(FeedbackScreenshotBase64Schema.safeParse('A'.repeat(maxChars)).success).toBe(true);
    for (const value of ['A'.repeat(maxChars + 4), 'https://example.com/a.jpg', 'a===', 'abc']) {
      expect(FeedbackScreenshotBase64Schema.safeParse(value).success).toBe(false);
    }
  });
});

describe('feedback views', () => {
  it('leaks no user, submitter-text or diagnostics fields into the public schema', () => {
    const parsed = FeedbackPublicPostSchema.parse(row);
    expect(Object.keys(parsed).sort()).toEqual(
      ['id', 'kind', 'labels', 'publicBody', 'publicTitle', 'publishedAt', 'status', 'updatedAt', 'voteCount'].sort(),
    );
    const json = JSON.stringify(parsed);
    expect(json).not.toContain('user-1');
    expect(json).not.toContain('jane@example.com');
    expect(json).not.toContain('4.32.446');
    expect(parsed.publishedAt).toBeInstanceOf(Date);
  });

  it('carries viewerHasVoted only when supplied', () => {
    expect(FeedbackPublicPostSchema.parse({ ...row, viewerHasVoted: true }).viewerHasVoted).toBe(true);
    expect(FeedbackPublicPostSchema.parse(row)).not.toHaveProperty('viewerHasVoted');
  });

  it('parses the admin view and paginated public lists', () => {
    expect(FeedbackAdminPostSchema.parse(row).diagnostics?.platform).toBe('ios');
    expect(FeedbackAdminPostSchema.parse({ ...row, userId: null, diagnostics: null }).userId).toBeNull();
    const list = FeedbackPublicPostListSchema.parse({ data: [row], pagination: { limit: 20, hasMore: true, nextCursor: 'c1' } });
    expect(list.data[0]).not.toHaveProperty('userId');
  });

  it('caps similar results and screenshot output', () => {
    const posts = Array.from({ length: FEEDBACK_SIMILAR_MAX_RESULTS + 1 }, () => row);
    expect(FeedbackSimilarResponseSchema.safeParse({ posts }).success).toBe(false);
    expect(FeedbackScreenshotResponseSchema.safeParse({ imageBase64: '/9j/4A==', mimeType: 'image/png', width: 10, height: 10 }).success).toBe(false);
    expect(FeedbackScreenshotResponseSchema.safeParse({ imageBase64: '/9j/4A==', mimeType: 'image/jpeg', width: 2049, height: 10 }).success).toBe(false);
  });
});

describe('feedback queries', () => {
  it('defaults sort, limit and queue state, and coerces limit', () => {
    expect(FeedbackPublicListQuerySchema.parse({ kind: 'feature', limit: '5' })).toEqual({ kind: 'feature', sort: 'top', limit: 5 });
    expect(FeedbackModerationQueueQuerySchema.parse({})).toEqual({ state: 'pending', limit: 20 });
    expect(FeedbackPublicListQuerySchema.safeParse({ kind: 'feature', limit: '51' }).success).toBe(false);
    expect(FeedbackPublicListQuerySchema.safeParse({ kind: 'feature', sort: 'hot' }).success).toBe(false);
  });

  it('bounds similar search text', () => {
    expect(FeedbackSimilarQuerySchema.safeParse({ kind: 'bug', q: ' ab ' }).success).toBe(false);
    expect(FeedbackSimilarQuerySchema.safeParse({ kind: 'bug', q: 'a'.repeat(201) }).success).toBe(false);
    expect(FeedbackSimilarQuerySchema.parse({ kind: 'bug', q: ' timer ' }).q).toBe('timer');
  });
});

describe('moderation and triage', () => {
  it('discriminates decisions on action', () => {
    const publish = { action: 'publish', publicTitle: 'Rest timer stops', publicBody: 'The rest timer pauses when locked.', status: 'planned', labels: ['timer'] };
    expect(FeedbackModerationDecisionSchema.parse(publish).action).toBe('publish');
    expect(FeedbackModerationDecisionSchema.parse({ action: 'reject', reason: 'Spam' }).action).toBe('reject');
    expect(FeedbackModerationDecisionSchema.parse({ action: 'merge', intoId: 'post-2' }).action).toBe('merge');
    expect(FeedbackModerationDecisionSchema.parse({ action: 'update', status: 'fixed' }).action).toBe('update');
    for (const decision of [
      { ...publish, publicTitle: undefined },
      { action: 'publish', status: 'planned', labels: [] },
      { action: 'reject' },
      { action: 'merge', reason: 'dupe' },
      { action: 'update' },
      { action: 'delete' },
      { ...publish, labels: Array.from({ length: FEEDBACK_LABELS_MAX + 1 }, (_, i) => `l${i}`) },
      { ...publish, labels: ['x'.repeat(FEEDBACK_LABEL_MAX_LEN + 1)] },
    ]) expect(FeedbackModerationDecisionSchema.safeParse(decision).success).toBe(false);
    expect(FeedbackTriageDecisionSchema).toBe(FeedbackModerationDecisionSchema);
  });

  it('validates triage suggestions', () => {
    const suggestion = { labels: ['timer'], piiFlag: true, piiNotes: 'Email in body', recommendedAction: 'publish', proposedPublicTitle: 'Rest timer stops' };
    expect(FeedbackTriageSuggestionSchema.safeParse(suggestion).success).toBe(true);
    expect(FeedbackTriageSuggestionSchema.safeParse({ ...suggestion, recommendedAction: 'suggest' }).success).toBe(false);
    expect(FeedbackTriageSuggestionSchema.safeParse({ ...suggestion, piiFlag: undefined }).success).toBe(false);
  });

  it('accepts admin and triage actors only', () => {
    const event = { id: 'e1', postId: 'post-1', actor: 'triage', action: 'suggest', fromState: 'pending', toState: 'pending', data: {}, createdAt: '2026-10-13T10:00:00Z' };
    expect(FeedbackModerationEventSchema.safeParse(event).success).toBe(true);
    expect(FeedbackModerationEventSchema.safeParse({ ...event, actor: 'admin:user-9' }).success).toBe(true);
    expect(FeedbackModerationEventSchema.safeParse({ ...event, actor: 'user-9' }).success).toBe(false);
  });
});

describe('feedback routes', () => {
  it('builds /v1 paths and encodes ids', () => {
    expect(WORKOUTS_FEEDBACK_ROUTES.public.list).toBe('/v1/public/feedback');
    expect(WORKOUTS_FEEDBACK_ROUTES.public.post('a/b')).toBe('/v1/public/feedback/a%2Fb');
    expect(WORKOUTS_FEEDBACK_ROUTES.user.vote('a?b')).toBe('/v1/feedback/a%3Fb/vote');
    expect(WORKOUTS_FEEDBACK_ROUTES.moderation.decision('p1')).toBe('/v1/feedback-moderation/p1/decision');
    expect(WORKOUTS_FEEDBACK_ROUTES.triage.suggestion('p1')).toBe('/v1/feedback-triage/p1/suggestion');
  });
});
