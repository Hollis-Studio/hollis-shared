/**
 * @ai-context Messaging Routes | message and notification API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// ============================================================================
// MESSAGES ROUTES
// ============================================================================

/**
 * Messages API routes.
 * Base path: /api/messages
 *
 * @group MESSAGES
 */
export const MESSAGES_ROUTES = {
  /**
   * GET /api/messages - Get messages
   * Query params: userId, role
   */
  LIST: '/api/messages',

  /**
   * POST /api/messages - Send a message
   */
  SEND: '/api/messages',

  /**
   * DELETE /api/messages/:messageId - Delete a message (sender-only)
   */
  DELETE: '/api/messages',

  /**
   * PUT /api/messages/read - Mark messages as read
   */
  MARK_READ: '/api/messages/read',

  /**
   * GET /api/messages/unread - Get unread message counts
   * Query params: userId
   */
  UNREAD: '/api/messages/unread',
} as const;

// ============================================================================
// PUSH NOTIFICATION ROUTES
// ============================================================================

/**
 * Push notification API routes.
 * Base path: /api/push
 *
 * @group PUSH
 */
export const PUSH_ROUTES = {
  /** POST /api/push/register - Register push notification token */
  REGISTER: '/api/push/register',

  /** DELETE /api/push/unregister - Unregister push notification token */
  UNREGISTER: '/api/push/unregister',

  /** POST /api/push/test - Send test notification */
  TEST: '/api/push/test',
} as const;

/** Type for push route values */
export type PushRoute = (typeof PUSH_ROUTES)[keyof typeof PUSH_ROUTES];

// ============================================================================
// SSE (Server-Sent Events) ROUTES
// ============================================================================

/**
 * SSE API routes.
 * Base path: /api/sse
 *
 * @group SSE
 */
export const SSE_ROUTES = {
  /** POST /api/sse/token - Exchange JWT for SSE token */
  TOKEN: '/api/sse/token',

  /** GET /api/sse/connect - SSE stream connection */
  CONNECT: '/api/sse/connect',

  /** GET /api/sse/stats - Get connection stats (admin only) */
  STATS: '/api/sse/stats',
} as const;

/** Type for SSE route values */
export type SseRoute = (typeof SSE_ROUTES)[keyof typeof SSE_ROUTES];
