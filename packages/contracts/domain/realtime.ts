/**
 * @ai-context SSE Realtime Contracts | Shared between client and server
 *
 * This module provides:
 * - SSE resource types for cache invalidation
 * - SSE event types for message handling
 * - Zod schemas for validation
 *
 * Used by:
 * - Client: src/services/sse.ts, src/services/realtime.ts
 * - Server: server/src/services/eventBus.ts
 *
 * When adding a new resource type:
 * 1. Add to SSE_RESOURCE_TYPES tuple
 * 2. Add to SSE_RESOURCE_TYPE constant object
 * 3. Update server eventBus to handle it
 * 4. Update client realtime.ts setupSSEInvalidationHandlers
 *
 * deps: zod | consumers: all codebases
 */

import { z } from "zod";

// ============================================================================
// SSE RESOURCE TYPES - Shared between client and server
// ============================================================================

export const SSE_RESOURCE_TYPES = [
  "nutrition",
  "daily-metrics",
  "daily-summary",
  "biometrics",
  "journal",
  "appointments",
  "sessions",
  "user-account",
  "messages",
  "exercise-performance",
  "labs",
] as const;

export type SSEResourceType = (typeof SSE_RESOURCE_TYPES)[number];

/** Centralized resource type constants for equality checks */
export const SSE_RESOURCE_TYPE = {
  NUTRITION: "nutrition" as SSEResourceType,
  DAILY_METRICS: "daily-metrics" as SSEResourceType,
  DAILY_SUMMARY: "daily-summary" as SSEResourceType,
  BIOMETRICS: "biometrics" as SSEResourceType,
  JOURNAL: "journal" as SSEResourceType,
  APPOINTMENTS: "appointments" as SSEResourceType,
  SESSIONS: "sessions" as SSEResourceType,
  USER_ACCOUNT: "user-account" as SSEResourceType,
  MESSAGES: "messages" as SSEResourceType,
  EXERCISE_PERFORMANCE: "exercise-performance" as SSEResourceType,
  LABS: "labs" as SSEResourceType,
} as const;

/**
 * Type guard to check if a string is a valid SSE resource type
 */
export function isSSEResourceType(value: string): value is SSEResourceType {
  return (SSE_RESOURCE_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// SSE EVENT TYPES - Message types for SSE communication
// ============================================================================

/**
 * Event types sent through SSE connections.
 * - invalidate: Signals that cached data should be refreshed
 * - connected: Initial connection confirmation
 * - heartbeat: Keep-alive ping
 * - notification: Push notification event
 */
export const SSE_EVENT_TYPES = [
  "invalidate",
  "connected",
  "heartbeat",
  "notification",
] as const;
export type SSEEventType = (typeof SSE_EVENT_TYPES)[number];

/** Centralized event type constants for equality checks */
export const SSE_EVENT_TYPE = {
  INVALIDATE: "invalidate" as SSEEventType,
  CONNECTED: "connected" as SSEEventType,
  HEARTBEAT: "heartbeat" as SSEEventType,
  NOTIFICATION: "notification" as SSEEventType,
} as const;

export const sseEventTypeSchema = z.enum(SSE_EVENT_TYPES);
export type SseEventType = z.infer<typeof sseEventTypeSchema>;

// ============================================================================
// Zod Schema (derived from tuple for single source of truth)
// ============================================================================

export const sseResourceTypeSchema = z.enum(SSE_RESOURCE_TYPES);
export type SseResourceType = z.infer<typeof sseResourceTypeSchema>;
