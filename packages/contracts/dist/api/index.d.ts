/**
 * @ai-context API Module Barrel | exports all API route definitions and types
 *
 * This module provides typed constants for all HTTP API endpoints used across:
 * - Mobile app services
 * - Web admin services
 * - Backend route validation/documentation
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
export * from "./csrf.js";
export * from "./endpoints.js";
export * from "./response.js";
export * from "./routes.js";
export { HEALTH_METRICS_ROUTES, type HealthMetricsRoute } from "./routes/health-metrics.js";
export { ASSIGNMENT_ROUTES, MFA_ROUTES, type AssignmentRoute, type MfaRoute } from "./routes/mfa.js";
export { WORKOUT_PLANS_ROUTES } from "./routes/workouts.js";
//# sourceMappingURL=index.d.ts.map