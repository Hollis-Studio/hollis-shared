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
export declare const SSE_RESOURCE_TYPES: readonly ["nutrition", "daily-metrics", "daily-summary", "biometrics", "journal", "appointments", "sessions", "user-account", "messages", "exercise-performance", "labs", "plans"];
export type SSEResourceType = (typeof SSE_RESOURCE_TYPES)[number];
/** Centralized resource type constants for equality checks */
export declare const SSE_RESOURCE_TYPE: {
    readonly NUTRITION: SSEResourceType;
    readonly DAILY_METRICS: SSEResourceType;
    readonly DAILY_SUMMARY: SSEResourceType;
    readonly BIOMETRICS: SSEResourceType;
    readonly JOURNAL: SSEResourceType;
    readonly APPOINTMENTS: SSEResourceType;
    readonly SESSIONS: SSEResourceType;
    readonly USER_ACCOUNT: SSEResourceType;
    readonly MESSAGES: SSEResourceType;
    readonly EXERCISE_PERFORMANCE: SSEResourceType;
    readonly LABS: SSEResourceType;
    readonly PLANS: SSEResourceType;
};
/**
 * Type guard to check if a string is a valid SSE resource type
 */
export declare function isSSEResourceType(value: string): value is SSEResourceType;
/**
 * Event types sent through SSE connections.
 * - invalidate: Signals that cached data should be refreshed
 * - connected: Initial connection confirmation
 * - heartbeat: Keep-alive ping
 * - notification: Push notification event
 */
export declare const SSE_EVENT_TYPES: readonly ["invalidate", "connected", "heartbeat", "notification"];
export type SSEEventType = (typeof SSE_EVENT_TYPES)[number];
/** Centralized event type constants for equality checks */
export declare const SSE_EVENT_TYPE: {
    readonly INVALIDATE: SSEEventType;
    readonly CONNECTED: SSEEventType;
    readonly HEARTBEAT: SSEEventType;
    readonly NOTIFICATION: SSEEventType;
};
export declare const sseEventTypeSchema: z.ZodEnum<{
    invalidate: "invalidate";
    connected: "connected";
    heartbeat: "heartbeat";
    notification: "notification";
}>;
export type SseEventType = z.infer<typeof sseEventTypeSchema>;
export declare const sseResourceTypeSchema: z.ZodEnum<{
    nutrition: "nutrition";
    messages: "messages";
    biometrics: "biometrics";
    "user-account": "user-account";
    journal: "journal";
    labs: "labs";
    "daily-metrics": "daily-metrics";
    "daily-summary": "daily-summary";
    appointments: "appointments";
    sessions: "sessions";
    "exercise-performance": "exercise-performance";
    plans: "plans";
}>;
export type SseResourceType = z.infer<typeof sseResourceTypeSchema>;
//# sourceMappingURL=realtime.d.ts.map