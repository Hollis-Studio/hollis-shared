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
// Legacy ./routes.ts takes precedence over ./routes/index.ts during resolution,
// so route modules added under ./routes/* need explicit re-exports here until
// the legacy aggregator is retired.
export { HEALTH_METRICS_ROUTES } from "./routes/health-metrics.js";
// MFA and Assignment routes are defined in the modular routes/ directory (not in routes.ts).
// Explicitly re-exported here so they are available via @hollis/contracts/api.
export { ASSIGNMENT_ROUTES, MFA_ROUTES } from "./routes/mfa.js";
// Workout Plans routes are defined in the modular routes/ directory (not in routes.ts).
// Explicitly re-exported here so they are available via @hollis/contracts/api.
export { WORKOUT_PLANS_ROUTES } from "./routes/workouts.js";
//# sourceMappingURL=index.js.map