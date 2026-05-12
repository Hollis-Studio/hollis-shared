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
    "plans",
];
/** Centralized resource type constants for equality checks */
export const SSE_RESOURCE_TYPE = {
    NUTRITION: "nutrition",
    DAILY_METRICS: "daily-metrics",
    DAILY_SUMMARY: "daily-summary",
    BIOMETRICS: "biometrics",
    JOURNAL: "journal",
    APPOINTMENTS: "appointments",
    SESSIONS: "sessions",
    USER_ACCOUNT: "user-account",
    MESSAGES: "messages",
    EXERCISE_PERFORMANCE: "exercise-performance",
    LABS: "labs",
    PLANS: "plans",
};
/**
 * Type guard to check if a string is a valid SSE resource type
 */
export function isSSEResourceType(value) {
    return SSE_RESOURCE_TYPES.includes(value);
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
];
/** Centralized event type constants for equality checks */
export const SSE_EVENT_TYPE = {
    INVALIDATE: "invalidate",
    CONNECTED: "connected",
    HEARTBEAT: "heartbeat",
    NOTIFICATION: "notification",
};
export const sseEventTypeSchema = z.enum(SSE_EVENT_TYPES);
// ============================================================================
// Zod Schema (derived from tuple for single source of truth)
// ============================================================================
export const sseResourceTypeSchema = z.enum(SSE_RESOURCE_TYPES);
//# sourceMappingURL=realtime.js.map