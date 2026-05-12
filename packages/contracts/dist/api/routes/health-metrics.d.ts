/**
 * @ai-context Health Metrics Routes | metric-definitions and related API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Health metrics API routes.
 * Base path: /api/metric-definitions
 *
 * @group HEALTH_METRICS
 */
export declare const HEALTH_METRICS_ROUTES: {
    /** GET /api/metric-definitions - List metric definitions (supports ?goalEligible=true filter) */
    readonly METRIC_DEFINITIONS: "/api/metric-definitions";
};
/** Type for health metrics route values */
export type HealthMetricsRoute = (typeof HEALTH_METRICS_ROUTES)[keyof typeof HEALTH_METRICS_ROUTES];
//# sourceMappingURL=health-metrics.d.ts.map