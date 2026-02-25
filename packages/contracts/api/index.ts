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

export * from "./csrf";
export * from "./endpoints";
export * from "./response";
export * from "./routes";

// MFA and Assignment routes are defined in the modular routes/ directory (not in routes.ts).
// Explicitly re-exported here so they are available via @hollis/contracts/api.
export {
    ASSIGNMENT_ROUTES,
    MFA_ROUTES,
    type AssignmentRoute,
    type MfaRoute
} from "./routes/mfa";

