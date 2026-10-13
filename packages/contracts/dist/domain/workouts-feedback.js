/**
 * @ai-context Hollis Workouts feedback board wire shapes: bug reports and
 * feature ideas submitted from the app or hollis.health, moderated before
 * anything user-written is public.
 *
 * Surfaces:
 *   /v1/public/feedback      → no auth; published posts only (FeedbackPublicPost)
 *   /v1/feedback             → signed-in user; submit, own posts, board, votes
 *   /v1/feedback-moderation  → app admins; queue, detail, screenshot, decision
 *   /v1/feedback-triage      → triage token; queue, detail, suggestion, decision
 *
 * Privacy boundary: FeedbackPublicPostSchema carries no user id, raw text,
 * diagnostics or screenshot. Only the admin-written publicTitle/publicBody are
 * ever public. Screenshots are served to the submitter, admins and triage only.
 *
 * deps: zod, domain/pagination
 * consumers: hollis-workouts server + mobile client, hollis-health-app web-public
 */
import * as z from 'zod';
import { createPaginatedListSchema } from './pagination.js';
// ---------------------------------------------------------------------------
// Enums and limits
// ---------------------------------------------------------------------------
export const FEEDBACK_KINDS = ['bug', 'feature'];
export const FeedbackKindSchema = z.enum(FEEDBACK_KINDS);
export const FEEDBACK_SOURCES = ['app', 'web'];
export const FeedbackSourceSchema = z.enum(FEEDBACK_SOURCES);
export const FEEDBACK_PRODUCTS = ['workouts'];
export const FeedbackProductSchema = z.enum(FEEDBACK_PRODUCTS);
export const FEEDBACK_MODERATION_STATES = ['pending', 'published', 'rejected', 'merged'];
export const FeedbackModerationStateSchema = z.enum(FEEDBACK_MODERATION_STATES);
/** The public label. Meaningful once a post is published. */
export const FEEDBACK_STATUSES = [
    'new', 'investigating', 'planned', 'in_progress', 'fixed', 'shipped', 'declined',
];
export const FeedbackStatusSchema = z.enum(FEEDBACK_STATUSES);
export const FEEDBACK_ENTRY_POINTS = ['settings', 'crash_screen', 'sync_failure', 'web'];
export const FeedbackEntryPointSchema = z.enum(FEEDBACK_ENTRY_POINTS);
export const FEEDBACK_PLATFORMS = ['ios', 'android', 'web'];
export const FeedbackPlatformSchema = z.enum(FEEDBACK_PLATFORMS);
export const FEEDBACK_SORTS = ['top', 'new'];
export const FeedbackSortSchema = z.enum(FEEDBACK_SORTS);
export const FEEDBACK_MODERATION_ACTIONS = ['publish', 'reject', 'merge', 'update'];
export const FeedbackModerationActionSchema = z.enum(FEEDBACK_MODERATION_ACTIONS);
/** Audit-trail actions: the four decisions plus triage suggestions and refused triage decisions. */
export const FEEDBACK_MODERATION_EVENT_ACTIONS = [
    ...FEEDBACK_MODERATION_ACTIONS, 'suggest', 'decision_blocked',
];
export const FeedbackModerationEventActionSchema = z.enum(FEEDBACK_MODERATION_EVENT_ACTIONS);
export const FEEDBACK_TITLE_MIN = 4;
export const FEEDBACK_TITLE_MAX = 120;
export const FEEDBACK_BODY_MIN = 10;
export const FEEDBACK_BODY_MAX = 4000;
/** Decoded JPEG bytes, before and after the server re-encode. */
export const FEEDBACK_SCREENSHOT_MAX_BYTES = 1_200_000;
/** Long edge after the server re-encode. */
export const FEEDBACK_SCREENSHOT_MAX_EDGE_PX = 2048;
export const FEEDBACK_SIMILAR_MAX_RESULTS = 5;
export const FEEDBACK_LABEL_MAX_LEN = 32;
export const FEEDBACK_LABELS_MAX = 8;
export const FEEDBACK_LIST_DEFAULT_LIMIT = 20;
export const FEEDBACK_LIST_MAX_LIMIT = 50;
// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------
const id = z.string().min(1).max(128);
const short = z.string().trim().min(1).max(64);
const reason = z.string().trim().min(1).max(1000);
export const FeedbackTitleSchema = z.string().trim().min(FEEDBACK_TITLE_MIN).max(FEEDBACK_TITLE_MAX);
export const FeedbackBodySchema = z.string().trim().min(FEEDBACK_BODY_MIN).max(FEEDBACK_BODY_MAX);
/** Labels are open strings; the set in use lives in the server's data, not here. */
export const FeedbackLabelSchema = z.string().trim().min(1).max(FEEDBACK_LABEL_MAX_LEN);
export const FeedbackLabelsSchema = z.array(FeedbackLabelSchema).max(FEEDBACK_LABELS_MAX);
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const decodedBytes = (value) => (value.length / 4) * 3 - (value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0);
/** JPEG bytes as base64; the bound is on the decoded size. */
export const FeedbackScreenshotBase64Schema = z
    .string()
    .min(4)
    .max(4 * Math.ceil(FEEDBACK_SCREENSHOT_MAX_BYTES / 3))
    .regex(BASE64)
    .refine(value => decodedBytes(value) <= FEEDBACK_SCREENSHOT_MAX_BYTES, {
    message: `screenshot exceeds ${FEEDBACK_SCREENSHOT_MAX_BYTES} bytes`,
});
// ---------------------------------------------------------------------------
// Submission
// ---------------------------------------------------------------------------
/**
 * Device context attached to a report. Shown to the user before sending and
 * optional per report. Every field is optional and bounded; none is free text.
 */
export const FeedbackDiagnosticsSchema = z.object({
    appVersion: short.optional(),
    buildNumber: short.optional(),
    updateId: short.optional(),
    runtimeVersion: short.optional(),
    platform: FeedbackPlatformSchema.optional(),
    osVersion: short.optional(),
    locale: short.optional(),
    entryPoint: FeedbackEntryPointSchema.optional(),
    diagnosticCode: short.optional(),
    sentryEventId: z.string().trim().toLowerCase().regex(/^[0-9a-f]{32}$/).optional(),
    sync: z
        .object({
        pendingCount: z.number().int().min(0).optional(),
        failedCount: z.number().int().min(0).optional(),
        lastBackupAt: z.string().datetime().nullable().optional(),
    })
        .optional(),
    route: z.string().trim().min(1).max(128).optional(),
});
/** POST /v1/feedback body. The server stamps product, userId and moderation state. */
export const FeedbackCreateSchema = z.object({
    kind: FeedbackKindSchema,
    title: FeedbackTitleSchema,
    body: FeedbackBodySchema,
    source: FeedbackSourceSchema,
    diagnostics: FeedbackDiagnosticsSchema.optional(),
    screenshotBase64: FeedbackScreenshotBase64Schema.optional(),
});
// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
const cursor = z.string().min(1).max(512);
const limit = z.coerce.number().int().min(1).max(FEEDBACK_LIST_MAX_LIMIT).default(FEEDBACK_LIST_DEFAULT_LIMIT);
/** GET /v1/public/feedback and GET /v1/feedback/board query. */
export const FeedbackPublicListQuerySchema = z.object({
    kind: FeedbackKindSchema,
    status: FeedbackStatusSchema.optional(),
    sort: FeedbackSortSchema.default('top'),
    cursor: cursor.optional(),
    limit,
});
/** GET /v1/public/feedback/similar query. Published posts only. */
export const FeedbackSimilarQuerySchema = z.object({
    kind: FeedbackKindSchema,
    q: z.string().trim().min(3).max(200),
});
/** GET /v1/feedback/mine query. */
export const FeedbackMineQuerySchema = z.object({
    cursor: cursor.optional(),
    limit,
});
/** GET /v1/feedback-moderation/queue and GET /v1/feedback-triage/queue query. */
export const FeedbackModerationQueueQuerySchema = z.object({
    state: FeedbackModerationStateSchema.default('pending'),
    kind: FeedbackKindSchema.optional(),
    cursor: cursor.optional(),
    limit,
});
// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------
/** The submitter's view of their own post, including their original text. */
export const FeedbackOwnPostSchema = z.object({
    id,
    kind: FeedbackKindSchema,
    title: z.string().max(FEEDBACK_TITLE_MAX),
    body: z.string().max(FEEDBACK_BODY_MAX),
    moderationState: FeedbackModerationStateSchema,
    status: FeedbackStatusSchema,
    publicTitle: z.string().max(FEEDBACK_TITLE_MAX).nullable(),
    publicBody: z.string().max(FEEDBACK_BODY_MAX).nullable(),
    mergedIntoId: id.nullable(),
    hasScreenshot: z.boolean(),
    voteCount: z.number().int().min(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
/**
 * A published post as anyone sees it. No user fields, no submitter text, no
 * diagnostics: parsing a full row through this schema strips them.
 * `viewerHasVoted` is present only on signed-in reads (GET /v1/feedback/board).
 */
export const FeedbackPublicPostSchema = z.object({
    id,
    kind: FeedbackKindSchema,
    status: FeedbackStatusSchema,
    labels: FeedbackLabelsSchema,
    publicTitle: z.string().min(1).max(FEEDBACK_TITLE_MAX),
    publicBody: z.string().min(1).max(FEEDBACK_BODY_MAX),
    voteCount: z.number().int().min(0),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    viewerHasVoted: z.boolean().optional(),
});
/** GET /v1/public/feedback/similar response, best match first. */
export const FeedbackSimilarResponseSchema = z.object({
    posts: z.array(FeedbackPublicPostSchema).max(FEEDBACK_SIMILAR_MAX_RESULTS),
});
/** PUT/DELETE /v1/feedback/:id/vote response. */
export const FeedbackVoteAckSchema = z.object({
    postId: id,
    voted: z.boolean(),
    voteCount: z.number().int().min(0),
});
/** Screenshot reads (submitter, moderation, triage). Always the server's re-encoded JPEG. */
export const FeedbackScreenshotResponseSchema = z.object({
    imageBase64: FeedbackScreenshotBase64Schema,
    mimeType: z.literal('image/jpeg'),
    width: z.number().int().min(1).max(FEEDBACK_SCREENSHOT_MAX_EDGE_PX),
    height: z.number().int().min(1).max(FEEDBACK_SCREENSHOT_MAX_EDGE_PX),
});
// ---------------------------------------------------------------------------
// Moderation and triage
// ---------------------------------------------------------------------------
/**
 * POST /v1/feedback-moderation/:id/decision body. Publishing requires the
 * admin-written public text: nothing the user wrote is public verbatim.
 */
export const FeedbackModerationDecisionSchema = z.discriminatedUnion('action', [
    z.object({
        action: z.literal('publish'),
        publicTitle: FeedbackTitleSchema,
        publicBody: FeedbackBodySchema,
        status: FeedbackStatusSchema,
        labels: FeedbackLabelsSchema,
    }),
    z.object({ action: z.literal('reject'), reason }),
    z.object({ action: z.literal('merge'), intoId: id }),
    z
        .object({
        action: z.literal('update'),
        status: FeedbackStatusSchema.optional(),
        labels: FeedbackLabelsSchema.optional(),
        publicTitle: FeedbackTitleSchema.optional(),
        publicBody: FeedbackBodySchema.optional(),
    })
        .refine(value => value.status !== undefined ||
        value.labels !== undefined ||
        value.publicTitle !== undefined ||
        value.publicBody !== undefined, { message: 'update needs at least one field' }),
]);
/**
 * POST /v1/feedback-triage/:id/decision body. Same shape as a moderation
 * decision; the server answers 403 unless triage decisions are enabled.
 */
export const FeedbackTriageDecisionSchema = FeedbackModerationDecisionSchema;
/** POST /v1/feedback-triage/:id/suggestion body. Advisory only; an admin decides. */
export const FeedbackTriageSuggestionSchema = z.object({
    labels: FeedbackLabelsSchema,
    duplicateOfId: id.optional(),
    /** True when the submitter's text or screenshot holds personal data. */
    piiFlag: z.boolean(),
    piiNotes: z.string().trim().min(1).max(500).optional(),
    proposedPublicTitle: FeedbackTitleSchema.optional(),
    proposedPublicBody: FeedbackBodySchema.optional(),
    recommendedAction: FeedbackModerationActionSchema,
    recommendedStatus: FeedbackStatusSchema.optional(),
    note: z.string().trim().min(1).max(1000).optional(),
});
/** A stored suggestion, as returned by the suggestion route and on the admin post. */
export const FeedbackTriageSuggestionRecordSchema = FeedbackTriageSuggestionSchema.extend({
    createdAt: z.coerce.date(),
});
/** One row of the append-only moderation audit trail. Holds no submitter id. */
export const FeedbackModerationEventSchema = z.object({
    id,
    postId: id,
    /** `admin:<userId>` or `triage`. */
    actor: z.string().regex(/^(?:admin:\S{1,128}|triage)$/),
    action: FeedbackModerationEventActionSchema,
    fromState: FeedbackModerationStateSchema.nullable(),
    toState: FeedbackModerationStateSchema.nullable(),
    data: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.coerce.date(),
});
/** The moderation and triage view: everything, including diagnostics and history. */
export const FeedbackAdminPostSchema = FeedbackOwnPostSchema.extend({
    /** Null once the submitter deleted their account (published and merged posts survive). */
    userId: id.nullable(),
    source: FeedbackSourceSchema,
    product: FeedbackProductSchema,
    labels: FeedbackLabelsSchema,
    diagnostics: FeedbackDiagnosticsSchema.nullable(),
    publishedAt: z.coerce.date().nullable(),
    /** The latest triage suggestion; earlier ones are `suggest` events in the history. */
    triageSuggestion: FeedbackTriageSuggestionRecordSchema.nullable(),
    /** Oldest first. */
    moderationHistory: z.array(FeedbackModerationEventSchema),
});
// ---------------------------------------------------------------------------
// Paginated lists ({ data, pagination: { limit, hasMore, nextCursor? } })
// ---------------------------------------------------------------------------
export const FeedbackPublicPostListSchema = createPaginatedListSchema(FeedbackPublicPostSchema);
export const FeedbackOwnPostListSchema = createPaginatedListSchema(FeedbackOwnPostSchema);
export const FeedbackAdminPostListSchema = createPaginatedListSchema(FeedbackAdminPostSchema);
// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
const post = (base, value) => `${base}/${encodeURIComponent(value)}`;
export const WORKOUTS_FEEDBACK_ROUTES = {
    /** No auth. Published posts only, `X-Robots-Tag: noindex`. */
    public: {
        list: '/v1/public/feedback',
        similar: '/v1/public/feedback/similar',
        post: (value) => post('/v1/public/feedback', value),
    },
    /** Signed-in user. */
    user: {
        /** POST */
        create: '/v1/feedback',
        mine: '/v1/feedback/mine',
        board: '/v1/feedback/board',
        /** PUT to vote, DELETE to remove the vote. */
        vote: (value) => `${post('/v1/feedback', value)}/vote`,
        /** Owner only. */
        screenshot: (value) => `${post('/v1/feedback', value)}/screenshot`,
    },
    /** App admins. */
    moderation: {
        queue: '/v1/feedback-moderation/queue',
        post: (value) => post('/v1/feedback-moderation', value),
        screenshot: (value) => `${post('/v1/feedback-moderation', value)}/screenshot`,
        decision: (value) => `${post('/v1/feedback-moderation', value)}/decision`,
    },
    /** Triage token. */
    triage: {
        queue: '/v1/feedback-triage/queue',
        post: (value) => post('/v1/feedback-triage', value),
        screenshot: (value) => `${post('/v1/feedback-triage', value)}/screenshot`,
        suggestion: (value) => `${post('/v1/feedback-triage', value)}/suggestion`,
        decision: (value) => `${post('/v1/feedback-triage', value)}/decision`,
    },
};
//# sourceMappingURL=workouts-feedback.js.map