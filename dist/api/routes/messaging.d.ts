/**
 * @ai-context Messaging Routes | message and notification API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Messages API routes.
 * Base path: /api/messages
 *
 * @group MESSAGES
 */
export declare const MESSAGES_ROUTES: {
    /**
     * GET /api/messages - Get messages
     * Query params: userId, role
     */
    readonly LIST: "/api/messages";
    /**
     * POST /api/messages - Send a message
     */
    readonly SEND: "/api/messages";
    /**
     * DELETE /api/messages/:messageId - Delete a message (sender-only)
     */
    readonly DELETE: "/api/messages";
    /**
     * PUT /api/messages/read - Mark messages as read
     */
    readonly MARK_READ: "/api/messages/read";
    /**
     * GET /api/messages/unread - Get unread message counts
     * Query params: userId
     */
    readonly UNREAD: "/api/messages/unread";
};
/**
 * Push notification API routes.
 * Base path: /api/push
 *
 * @group PUSH
 */
export declare const PUSH_ROUTES: {
    /** POST /api/push/register - Register push notification token */
    readonly REGISTER: "/api/push/register";
    /** DELETE /api/push/unregister - Unregister push notification token */
    readonly UNREGISTER: "/api/push/unregister";
    /** POST /api/push/test - Send test notification */
    readonly TEST: "/api/push/test";
};
/** Type for push route values */
export type PushRoute = (typeof PUSH_ROUTES)[keyof typeof PUSH_ROUTES];
/**
 * SSE API routes.
 * Base path: /api/events
 *
 * @group SSE
 */
export declare const SSE_ROUTES: {
    /** POST /api/events/token - Exchange JWT for short-lived SSE token */
    readonly TOKEN: "/api/events/token";
    /** GET /api/events/:userId - SSE stream for user-specific events */
    readonly CONNECT: "/api/events";
    /** GET /api/events/stats - SSE connection statistics (admin only) */
    readonly STATS: "/api/events/stats";
};
/** Type for SSE route values */
export type SseRoute = (typeof SSE_ROUTES)[keyof typeof SSE_ROUTES];
//# sourceMappingURL=messaging.d.ts.map