/**
 * @ai-context Admin Contracts Module | SHARED TYPES for admin operations
 *
 * This module provides the SHARED admin-specific contracts used by:
 * - web-admin/services/adminService.ts (THE admin service implementation)
 * - server/src/routes/admin/* (backend admin routes)
 *
 * CONTRACT COVERAGE:
 * - Patient and clinician management types
 * - Training strategy operations (create/update inputs)
 * - Lab result handling and extraction
 * - Workout/nutrition generation parameters
 * - Availability and scheduling
 * - Analytics types
 *
 * ARCHITECTURE NOTES:
 * - The mobile app does NOT use admin contracts (patients aren't admins)
 * - All admin functionality lives in web-admin only
 * - This module ensures type consistency between web-admin and server
 *
 * Usage:
 * ```ts
 * import {
 *   PatientSummary,
 *   ADMIN_API_ROUTES,
 *   patientSummarySchema,
 * } from '@hollis-studio/contracts/admin';
 * ```
 *
 * deps: zod, domain types | consumers: web-admin/services/*, server/src/routes/admin/*
 */
export * from "./admin-types.js";
export * from "./admin-routes.js";
export * from "./admin-schemas.js";
export * from "./notifications.js";
export * from "./labs.js";
export * from "./dxa.js";
export * from "./consent-schemas.js";
//# sourceMappingURL=index.d.ts.map