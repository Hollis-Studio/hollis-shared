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
export declare const FEEDBACK_KINDS: readonly ["bug", "feature"];
export declare const FeedbackKindSchema: z.ZodEnum<{
    bug: "bug";
    feature: "feature";
}>;
export type FeedbackKind = z.infer<typeof FeedbackKindSchema>;
export declare const FEEDBACK_SOURCES: readonly ["app", "web"];
export declare const FeedbackSourceSchema: z.ZodEnum<{
    web: "web";
    app: "app";
}>;
export type FeedbackSource = z.infer<typeof FeedbackSourceSchema>;
export declare const FEEDBACK_PRODUCTS: readonly ["workouts"];
export declare const FeedbackProductSchema: z.ZodEnum<{
    workouts: "workouts";
}>;
export type FeedbackProduct = z.infer<typeof FeedbackProductSchema>;
export declare const FEEDBACK_MODERATION_STATES: readonly ["pending", "published", "rejected", "merged"];
export declare const FeedbackModerationStateSchema: z.ZodEnum<{
    rejected: "rejected";
    pending: "pending";
    merged: "merged";
    published: "published";
}>;
export type FeedbackModerationState = z.infer<typeof FeedbackModerationStateSchema>;
/** The public label. Meaningful once a post is published. */
export declare const FEEDBACK_STATUSES: readonly ["new", "investigating", "planned", "in_progress", "fixed", "shipped", "declined"];
export declare const FeedbackStatusSchema: z.ZodEnum<{
    fixed: "fixed";
    new: "new";
    investigating: "investigating";
    planned: "planned";
    in_progress: "in_progress";
    shipped: "shipped";
    declined: "declined";
}>;
export type FeedbackStatus = z.infer<typeof FeedbackStatusSchema>;
export declare const FEEDBACK_ENTRY_POINTS: readonly ["settings", "crash_screen", "sync_failure", "web"];
export declare const FeedbackEntryPointSchema: z.ZodEnum<{
    web: "web";
    settings: "settings";
    crash_screen: "crash_screen";
    sync_failure: "sync_failure";
}>;
export type FeedbackEntryPoint = z.infer<typeof FeedbackEntryPointSchema>;
export declare const FEEDBACK_PLATFORMS: readonly ["ios", "android", "web"];
export declare const FeedbackPlatformSchema: z.ZodEnum<{
    web: "web";
    ios: "ios";
    android: "android";
}>;
export type FeedbackPlatform = z.infer<typeof FeedbackPlatformSchema>;
export declare const FEEDBACK_SORTS: readonly ["top", "new"];
export declare const FeedbackSortSchema: z.ZodEnum<{
    new: "new";
    top: "top";
}>;
export type FeedbackSort = z.infer<typeof FeedbackSortSchema>;
export declare const FEEDBACK_MODERATION_ACTIONS: readonly ["publish", "reject", "merge", "update"];
export declare const FeedbackModerationActionSchema: z.ZodEnum<{
    merge: "merge";
    reject: "reject";
    publish: "publish";
    update: "update";
}>;
export type FeedbackModerationAction = z.infer<typeof FeedbackModerationActionSchema>;
/** Audit-trail actions: the four decisions plus triage suggestions and refused triage decisions. */
export declare const FEEDBACK_MODERATION_EVENT_ACTIONS: readonly ["publish", "reject", "merge", "update", "suggest", "decision_blocked"];
export declare const FeedbackModerationEventActionSchema: z.ZodEnum<{
    merge: "merge";
    reject: "reject";
    publish: "publish";
    update: "update";
    suggest: "suggest";
    decision_blocked: "decision_blocked";
}>;
export type FeedbackModerationEventAction = z.infer<typeof FeedbackModerationEventActionSchema>;
export declare const FEEDBACK_TITLE_MIN = 4;
export declare const FEEDBACK_TITLE_MAX = 120;
export declare const FEEDBACK_BODY_MIN = 10;
export declare const FEEDBACK_BODY_MAX = 4000;
/** Decoded JPEG bytes, before and after the server re-encode. */
export declare const FEEDBACK_SCREENSHOT_MAX_BYTES = 1200000;
/** Long edge after the server re-encode. */
export declare const FEEDBACK_SCREENSHOT_MAX_EDGE_PX = 2048;
export declare const FEEDBACK_SIMILAR_MAX_RESULTS = 5;
export declare const FEEDBACK_LABEL_MAX_LEN = 32;
export declare const FEEDBACK_LABELS_MAX = 8;
export declare const FEEDBACK_LIST_DEFAULT_LIMIT = 20;
export declare const FEEDBACK_LIST_MAX_LIMIT = 50;
export declare const FeedbackTitleSchema: z.ZodString;
export declare const FeedbackBodySchema: z.ZodString;
/** Labels are open strings; the set in use lives in the server's data, not here. */
export declare const FeedbackLabelSchema: z.ZodString;
export declare const FeedbackLabelsSchema: z.ZodArray<z.ZodString>;
/** JPEG bytes as base64; the bound is on the decoded size. */
export declare const FeedbackScreenshotBase64Schema: z.ZodString;
/**
 * Device context attached to a report. Shown to the user before sending and
 * optional per report. Every field is optional and bounded; none is free text.
 */
export declare const FeedbackDiagnosticsSchema: z.ZodObject<{
    appVersion: z.ZodOptional<z.ZodString>;
    buildNumber: z.ZodOptional<z.ZodString>;
    updateId: z.ZodOptional<z.ZodString>;
    runtimeVersion: z.ZodOptional<z.ZodString>;
    platform: z.ZodOptional<z.ZodEnum<{
        web: "web";
        ios: "ios";
        android: "android";
    }>>;
    osVersion: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodString>;
    entryPoint: z.ZodOptional<z.ZodEnum<{
        web: "web";
        settings: "settings";
        crash_screen: "crash_screen";
        sync_failure: "sync_failure";
    }>>;
    diagnosticCode: z.ZodOptional<z.ZodString>;
    sentryEventId: z.ZodOptional<z.ZodString>;
    sync: z.ZodOptional<z.ZodObject<{
        pendingCount: z.ZodOptional<z.ZodNumber>;
        failedCount: z.ZodOptional<z.ZodNumber>;
        lastBackupAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    route: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FeedbackDiagnostics = z.infer<typeof FeedbackDiagnosticsSchema>;
/** POST /v1/feedback body. The server stamps product, userId and moderation state. */
export declare const FeedbackCreateSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        bug: "bug";
        feature: "feature";
    }>;
    title: z.ZodString;
    body: z.ZodString;
    source: z.ZodEnum<{
        web: "web";
        app: "app";
    }>;
    diagnostics: z.ZodOptional<z.ZodObject<{
        appVersion: z.ZodOptional<z.ZodString>;
        buildNumber: z.ZodOptional<z.ZodString>;
        updateId: z.ZodOptional<z.ZodString>;
        runtimeVersion: z.ZodOptional<z.ZodString>;
        platform: z.ZodOptional<z.ZodEnum<{
            web: "web";
            ios: "ios";
            android: "android";
        }>>;
        osVersion: z.ZodOptional<z.ZodString>;
        locale: z.ZodOptional<z.ZodString>;
        entryPoint: z.ZodOptional<z.ZodEnum<{
            web: "web";
            settings: "settings";
            crash_screen: "crash_screen";
            sync_failure: "sync_failure";
        }>>;
        diagnosticCode: z.ZodOptional<z.ZodString>;
        sentryEventId: z.ZodOptional<z.ZodString>;
        sync: z.ZodOptional<z.ZodObject<{
            pendingCount: z.ZodOptional<z.ZodNumber>;
            failedCount: z.ZodOptional<z.ZodNumber>;
            lastBackupAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
        route: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    screenshotBase64: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FeedbackCreate = z.infer<typeof FeedbackCreateSchema>;
/** GET /v1/public/feedback and GET /v1/feedback/board query. */
export declare const FeedbackPublicListQuerySchema: z.ZodObject<{
    kind: z.ZodEnum<{
        bug: "bug";
        feature: "feature";
    }>;
    status: z.ZodOptional<z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>>;
    sort: z.ZodDefault<z.ZodEnum<{
        new: "new";
        top: "top";
    }>>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type FeedbackPublicListQuery = z.infer<typeof FeedbackPublicListQuerySchema>;
/** GET /v1/public/feedback/similar query. Published posts only. */
export declare const FeedbackSimilarQuerySchema: z.ZodObject<{
    kind: z.ZodEnum<{
        bug: "bug";
        feature: "feature";
    }>;
    q: z.ZodString;
}, z.core.$strip>;
export type FeedbackSimilarQuery = z.infer<typeof FeedbackSimilarQuerySchema>;
/** GET /v1/feedback/mine query. */
export declare const FeedbackMineQuerySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type FeedbackMineQuery = z.infer<typeof FeedbackMineQuerySchema>;
/** GET /v1/feedback-moderation/queue and GET /v1/feedback-triage/queue query. */
export declare const FeedbackModerationQueueQuerySchema: z.ZodObject<{
    state: z.ZodDefault<z.ZodEnum<{
        rejected: "rejected";
        pending: "pending";
        merged: "merged";
        published: "published";
    }>>;
    kind: z.ZodOptional<z.ZodEnum<{
        bug: "bug";
        feature: "feature";
    }>>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type FeedbackModerationQueueQuery = z.infer<typeof FeedbackModerationQueueQuerySchema>;
/** The submitter's view of their own post, including their original text. */
export declare const FeedbackOwnPostSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        bug: "bug";
        feature: "feature";
    }>;
    title: z.ZodString;
    body: z.ZodString;
    moderationState: z.ZodEnum<{
        rejected: "rejected";
        pending: "pending";
        merged: "merged";
        published: "published";
    }>;
    status: z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>;
    publicTitle: z.ZodNullable<z.ZodString>;
    publicBody: z.ZodNullable<z.ZodString>;
    mergedIntoId: z.ZodNullable<z.ZodString>;
    hasScreenshot: z.ZodBoolean;
    voteCount: z.ZodNumber;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type FeedbackOwnPost = z.infer<typeof FeedbackOwnPostSchema>;
/**
 * A published post as anyone sees it. No user fields, no submitter text, no
 * diagnostics: parsing a full row through this schema strips them.
 * `viewerHasVoted` is present only on signed-in reads (GET /v1/feedback/board).
 */
export declare const FeedbackPublicPostSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        bug: "bug";
        feature: "feature";
    }>;
    status: z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>;
    labels: z.ZodArray<z.ZodString>;
    publicTitle: z.ZodString;
    publicBody: z.ZodString;
    voteCount: z.ZodNumber;
    publishedAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    viewerHasVoted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type FeedbackPublicPost = z.infer<typeof FeedbackPublicPostSchema>;
/** GET /v1/public/feedback/similar response, best match first. */
export declare const FeedbackSimilarResponseSchema: z.ZodObject<{
    posts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            bug: "bug";
            feature: "feature";
        }>;
        status: z.ZodEnum<{
            fixed: "fixed";
            new: "new";
            investigating: "investigating";
            planned: "planned";
            in_progress: "in_progress";
            shipped: "shipped";
            declined: "declined";
        }>;
        labels: z.ZodArray<z.ZodString>;
        publicTitle: z.ZodString;
        publicBody: z.ZodString;
        voteCount: z.ZodNumber;
        publishedAt: z.ZodCoercedDate<unknown>;
        updatedAt: z.ZodCoercedDate<unknown>;
        viewerHasVoted: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type FeedbackSimilarResponse = z.infer<typeof FeedbackSimilarResponseSchema>;
/** PUT/DELETE /v1/feedback/:id/vote response. */
export declare const FeedbackVoteAckSchema: z.ZodObject<{
    postId: z.ZodString;
    voted: z.ZodBoolean;
    voteCount: z.ZodNumber;
}, z.core.$strip>;
export type FeedbackVoteAck = z.infer<typeof FeedbackVoteAckSchema>;
/** Screenshot reads (submitter, moderation, triage). Always the server's re-encoded JPEG. */
export declare const FeedbackScreenshotResponseSchema: z.ZodObject<{
    imageBase64: z.ZodString;
    mimeType: z.ZodLiteral<"image/jpeg">;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strip>;
export type FeedbackScreenshotResponse = z.infer<typeof FeedbackScreenshotResponseSchema>;
/**
 * POST /v1/feedback-moderation/:id/decision body. Publishing requires the
 * admin-written public text: nothing the user wrote is public verbatim.
 */
export declare const FeedbackModerationDecisionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    action: z.ZodLiteral<"publish">;
    publicTitle: z.ZodString;
    publicBody: z.ZodString;
    status: z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>;
    labels: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"reject">;
    reason: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"merge">;
    intoId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"update">;
    status: z.ZodOptional<z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    publicTitle: z.ZodOptional<z.ZodString>;
    publicBody: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "action">;
export type FeedbackModerationDecision = z.infer<typeof FeedbackModerationDecisionSchema>;
/**
 * POST /v1/feedback-triage/:id/decision body. Same shape as a moderation
 * decision; the server answers 403 unless triage decisions are enabled.
 */
export declare const FeedbackTriageDecisionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    action: z.ZodLiteral<"publish">;
    publicTitle: z.ZodString;
    publicBody: z.ZodString;
    status: z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>;
    labels: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"reject">;
    reason: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"merge">;
    intoId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"update">;
    status: z.ZodOptional<z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    publicTitle: z.ZodOptional<z.ZodString>;
    publicBody: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "action">;
export type FeedbackTriageDecision = FeedbackModerationDecision;
/** POST /v1/feedback-triage/:id/suggestion body. Advisory only; an admin decides. */
export declare const FeedbackTriageSuggestionSchema: z.ZodObject<{
    labels: z.ZodArray<z.ZodString>;
    duplicateOfId: z.ZodOptional<z.ZodString>;
    piiFlag: z.ZodBoolean;
    piiNotes: z.ZodOptional<z.ZodString>;
    proposedPublicTitle: z.ZodOptional<z.ZodString>;
    proposedPublicBody: z.ZodOptional<z.ZodString>;
    recommendedAction: z.ZodEnum<{
        merge: "merge";
        reject: "reject";
        publish: "publish";
        update: "update";
    }>;
    recommendedStatus: z.ZodOptional<z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FeedbackTriageSuggestion = z.infer<typeof FeedbackTriageSuggestionSchema>;
/** A stored suggestion, as returned by the suggestion route and on the admin post. */
export declare const FeedbackTriageSuggestionRecordSchema: z.ZodObject<{
    labels: z.ZodArray<z.ZodString>;
    duplicateOfId: z.ZodOptional<z.ZodString>;
    piiFlag: z.ZodBoolean;
    piiNotes: z.ZodOptional<z.ZodString>;
    proposedPublicTitle: z.ZodOptional<z.ZodString>;
    proposedPublicBody: z.ZodOptional<z.ZodString>;
    recommendedAction: z.ZodEnum<{
        merge: "merge";
        reject: "reject";
        publish: "publish";
        update: "update";
    }>;
    recommendedStatus: z.ZodOptional<z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>>;
    note: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type FeedbackTriageSuggestionRecord = z.infer<typeof FeedbackTriageSuggestionRecordSchema>;
/** One row of the append-only moderation audit trail. Holds no submitter id. */
export declare const FeedbackModerationEventSchema: z.ZodObject<{
    id: z.ZodString;
    postId: z.ZodString;
    actor: z.ZodString;
    action: z.ZodEnum<{
        merge: "merge";
        reject: "reject";
        publish: "publish";
        update: "update";
        suggest: "suggest";
        decision_blocked: "decision_blocked";
    }>;
    fromState: z.ZodNullable<z.ZodEnum<{
        rejected: "rejected";
        pending: "pending";
        merged: "merged";
        published: "published";
    }>>;
    toState: z.ZodNullable<z.ZodEnum<{
        rejected: "rejected";
        pending: "pending";
        merged: "merged";
        published: "published";
    }>>;
    data: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type FeedbackModerationEvent = z.infer<typeof FeedbackModerationEventSchema>;
/** The moderation and triage view: everything, including diagnostics and history. */
export declare const FeedbackAdminPostSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        bug: "bug";
        feature: "feature";
    }>;
    title: z.ZodString;
    body: z.ZodString;
    moderationState: z.ZodEnum<{
        rejected: "rejected";
        pending: "pending";
        merged: "merged";
        published: "published";
    }>;
    status: z.ZodEnum<{
        fixed: "fixed";
        new: "new";
        investigating: "investigating";
        planned: "planned";
        in_progress: "in_progress";
        shipped: "shipped";
        declined: "declined";
    }>;
    publicTitle: z.ZodNullable<z.ZodString>;
    publicBody: z.ZodNullable<z.ZodString>;
    mergedIntoId: z.ZodNullable<z.ZodString>;
    hasScreenshot: z.ZodBoolean;
    voteCount: z.ZodNumber;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    userId: z.ZodNullable<z.ZodString>;
    source: z.ZodEnum<{
        web: "web";
        app: "app";
    }>;
    product: z.ZodEnum<{
        workouts: "workouts";
    }>;
    labels: z.ZodArray<z.ZodString>;
    diagnostics: z.ZodNullable<z.ZodObject<{
        appVersion: z.ZodOptional<z.ZodString>;
        buildNumber: z.ZodOptional<z.ZodString>;
        updateId: z.ZodOptional<z.ZodString>;
        runtimeVersion: z.ZodOptional<z.ZodString>;
        platform: z.ZodOptional<z.ZodEnum<{
            web: "web";
            ios: "ios";
            android: "android";
        }>>;
        osVersion: z.ZodOptional<z.ZodString>;
        locale: z.ZodOptional<z.ZodString>;
        entryPoint: z.ZodOptional<z.ZodEnum<{
            web: "web";
            settings: "settings";
            crash_screen: "crash_screen";
            sync_failure: "sync_failure";
        }>>;
        diagnosticCode: z.ZodOptional<z.ZodString>;
        sentryEventId: z.ZodOptional<z.ZodString>;
        sync: z.ZodOptional<z.ZodObject<{
            pendingCount: z.ZodOptional<z.ZodNumber>;
            failedCount: z.ZodOptional<z.ZodNumber>;
            lastBackupAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
        route: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    publishedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    triageSuggestion: z.ZodNullable<z.ZodObject<{
        labels: z.ZodArray<z.ZodString>;
        duplicateOfId: z.ZodOptional<z.ZodString>;
        piiFlag: z.ZodBoolean;
        piiNotes: z.ZodOptional<z.ZodString>;
        proposedPublicTitle: z.ZodOptional<z.ZodString>;
        proposedPublicBody: z.ZodOptional<z.ZodString>;
        recommendedAction: z.ZodEnum<{
            merge: "merge";
            reject: "reject";
            publish: "publish";
            update: "update";
        }>;
        recommendedStatus: z.ZodOptional<z.ZodEnum<{
            fixed: "fixed";
            new: "new";
            investigating: "investigating";
            planned: "planned";
            in_progress: "in_progress";
            shipped: "shipped";
            declined: "declined";
        }>>;
        note: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
    moderationHistory: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        postId: z.ZodString;
        actor: z.ZodString;
        action: z.ZodEnum<{
            merge: "merge";
            reject: "reject";
            publish: "publish";
            update: "update";
            suggest: "suggest";
            decision_blocked: "decision_blocked";
        }>;
        fromState: z.ZodNullable<z.ZodEnum<{
            rejected: "rejected";
            pending: "pending";
            merged: "merged";
            published: "published";
        }>>;
        toState: z.ZodNullable<z.ZodEnum<{
            rejected: "rejected";
            pending: "pending";
            merged: "merged";
            published: "published";
        }>>;
        data: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type FeedbackAdminPost = z.infer<typeof FeedbackAdminPostSchema>;
export declare const FeedbackPublicPostListSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            bug: "bug";
            feature: "feature";
        }>;
        status: z.ZodEnum<{
            fixed: "fixed";
            new: "new";
            investigating: "investigating";
            planned: "planned";
            in_progress: "in_progress";
            shipped: "shipped";
            declined: "declined";
        }>;
        labels: z.ZodArray<z.ZodString>;
        publicTitle: z.ZodString;
        publicBody: z.ZodString;
        voteCount: z.ZodNumber;
        publishedAt: z.ZodCoercedDate<unknown>;
        updatedAt: z.ZodCoercedDate<unknown>;
        viewerHasVoted: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type FeedbackPublicPostList = z.infer<typeof FeedbackPublicPostListSchema>;
export declare const FeedbackOwnPostListSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            bug: "bug";
            feature: "feature";
        }>;
        title: z.ZodString;
        body: z.ZodString;
        moderationState: z.ZodEnum<{
            rejected: "rejected";
            pending: "pending";
            merged: "merged";
            published: "published";
        }>;
        status: z.ZodEnum<{
            fixed: "fixed";
            new: "new";
            investigating: "investigating";
            planned: "planned";
            in_progress: "in_progress";
            shipped: "shipped";
            declined: "declined";
        }>;
        publicTitle: z.ZodNullable<z.ZodString>;
        publicBody: z.ZodNullable<z.ZodString>;
        mergedIntoId: z.ZodNullable<z.ZodString>;
        hasScreenshot: z.ZodBoolean;
        voteCount: z.ZodNumber;
        createdAt: z.ZodCoercedDate<unknown>;
        updatedAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type FeedbackOwnPostList = z.infer<typeof FeedbackOwnPostListSchema>;
export declare const FeedbackAdminPostListSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            bug: "bug";
            feature: "feature";
        }>;
        title: z.ZodString;
        body: z.ZodString;
        moderationState: z.ZodEnum<{
            rejected: "rejected";
            pending: "pending";
            merged: "merged";
            published: "published";
        }>;
        status: z.ZodEnum<{
            fixed: "fixed";
            new: "new";
            investigating: "investigating";
            planned: "planned";
            in_progress: "in_progress";
            shipped: "shipped";
            declined: "declined";
        }>;
        publicTitle: z.ZodNullable<z.ZodString>;
        publicBody: z.ZodNullable<z.ZodString>;
        mergedIntoId: z.ZodNullable<z.ZodString>;
        hasScreenshot: z.ZodBoolean;
        voteCount: z.ZodNumber;
        createdAt: z.ZodCoercedDate<unknown>;
        updatedAt: z.ZodCoercedDate<unknown>;
        userId: z.ZodNullable<z.ZodString>;
        source: z.ZodEnum<{
            web: "web";
            app: "app";
        }>;
        product: z.ZodEnum<{
            workouts: "workouts";
        }>;
        labels: z.ZodArray<z.ZodString>;
        diagnostics: z.ZodNullable<z.ZodObject<{
            appVersion: z.ZodOptional<z.ZodString>;
            buildNumber: z.ZodOptional<z.ZodString>;
            updateId: z.ZodOptional<z.ZodString>;
            runtimeVersion: z.ZodOptional<z.ZodString>;
            platform: z.ZodOptional<z.ZodEnum<{
                web: "web";
                ios: "ios";
                android: "android";
            }>>;
            osVersion: z.ZodOptional<z.ZodString>;
            locale: z.ZodOptional<z.ZodString>;
            entryPoint: z.ZodOptional<z.ZodEnum<{
                web: "web";
                settings: "settings";
                crash_screen: "crash_screen";
                sync_failure: "sync_failure";
            }>>;
            diagnosticCode: z.ZodOptional<z.ZodString>;
            sentryEventId: z.ZodOptional<z.ZodString>;
            sync: z.ZodOptional<z.ZodObject<{
                pendingCount: z.ZodOptional<z.ZodNumber>;
                failedCount: z.ZodOptional<z.ZodNumber>;
                lastBackupAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>>;
            route: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        publishedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
        triageSuggestion: z.ZodNullable<z.ZodObject<{
            labels: z.ZodArray<z.ZodString>;
            duplicateOfId: z.ZodOptional<z.ZodString>;
            piiFlag: z.ZodBoolean;
            piiNotes: z.ZodOptional<z.ZodString>;
            proposedPublicTitle: z.ZodOptional<z.ZodString>;
            proposedPublicBody: z.ZodOptional<z.ZodString>;
            recommendedAction: z.ZodEnum<{
                merge: "merge";
                reject: "reject";
                publish: "publish";
                update: "update";
            }>;
            recommendedStatus: z.ZodOptional<z.ZodEnum<{
                fixed: "fixed";
                new: "new";
                investigating: "investigating";
                planned: "planned";
                in_progress: "in_progress";
                shipped: "shipped";
                declined: "declined";
            }>>;
            note: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodCoercedDate<unknown>;
        }, z.core.$strip>>;
        moderationHistory: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            postId: z.ZodString;
            actor: z.ZodString;
            action: z.ZodEnum<{
                merge: "merge";
                reject: "reject";
                publish: "publish";
                update: "update";
                suggest: "suggest";
                decision_blocked: "decision_blocked";
            }>;
            fromState: z.ZodNullable<z.ZodEnum<{
                rejected: "rejected";
                pending: "pending";
                merged: "merged";
                published: "published";
            }>>;
            toState: z.ZodNullable<z.ZodEnum<{
                rejected: "rejected";
                pending: "pending";
                merged: "merged";
                published: "published";
            }>>;
            data: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            createdAt: z.ZodCoercedDate<unknown>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type FeedbackAdminPostList = z.infer<typeof FeedbackAdminPostListSchema>;
export declare const WORKOUTS_FEEDBACK_ROUTES: {
    /** No auth. Published posts only, `X-Robots-Tag: noindex`. */
    readonly public: {
        readonly list: "/v1/public/feedback";
        readonly similar: "/v1/public/feedback/similar";
        readonly post: (value: string) => string;
    };
    /** Signed-in user. */
    readonly user: {
        /** POST */
        readonly create: "/v1/feedback";
        readonly mine: "/v1/feedback/mine";
        readonly board: "/v1/feedback/board";
        /** PUT to vote, DELETE to remove the vote. */
        readonly vote: (value: string) => string;
        /** Owner only. */
        readonly screenshot: (value: string) => string;
    };
    /** App admins. */
    readonly moderation: {
        readonly queue: "/v1/feedback-moderation/queue";
        readonly post: (value: string) => string;
        readonly screenshot: (value: string) => string;
        readonly decision: (value: string) => string;
    };
    /** Triage token. */
    readonly triage: {
        readonly queue: "/v1/feedback-triage/queue";
        readonly post: (value: string) => string;
        readonly screenshot: (value: string) => string;
        readonly suggestion: (value: string) => string;
        readonly decision: (value: string) => string;
    };
};
//# sourceMappingURL=workouts-feedback.d.ts.map