/**
 * @ai-context Shared Sentry PHI sanitization helpers | strips sensitive fields from Sentry events across all surfaces
 *
 * This module must remain platform-agnostic so it can be used by React Native,
 * Next.js, and the backend server without importing Sentry runtime packages.
 */
type UnknownRecord = Record<string, unknown>;
export interface SentryEventLike {
    user?: UnknownRecord;
    request?: UnknownRecord;
    extra?: UnknownRecord;
    contexts?: UnknownRecord;
    tags?: UnknownRecord;
    breadcrumbs?: unknown;
    exception?: UnknownRecord;
    message?: string;
    [key: string]: unknown;
}
export interface SentryLogLike {
    level?: string;
    message?: string;
    timestamp?: number;
    attributes?: UnknownRecord;
    [key: string]: unknown;
}
/**
 * Sanitizes a Sentry log entry for use in `beforeSendLog`.
 * Scrubs PHI from the message string and all attributes.
 */
export declare function sanitizeSentryLog<T>(log: T): T;
/**
 * Sanitizes a Sentry event in place and returns it for convenience in `beforeSend`.
 */
export declare function sanitizeSentryEvent<T>(event: T): T;
export {};
//# sourceMappingURL=sentrySanitization.d.ts.map