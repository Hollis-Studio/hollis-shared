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
 * } from '@hollis/contracts/admin';
 * ```
 *
 * deps: zod, domain types | consumers: web-admin/services/*, server/src/routes/admin/*
 */
// Types
export * from "./admin-types.js";
// Routes
export * from "./admin-routes.js";
// Schemas
export * from "./admin-schemas.js";
// Notifications - admin realtime notification kinds
export * from "./notifications.js";
// Labs admin contracts - metric search, creation, extraction, order management
export * from "./labs.js";
// DXA admin contracts - extraction and ingest
export * from "./dxa.js";
// Consent contracts - legal document signing schemas, constants, and route types
export * from "./consent-schemas.js";
//# sourceMappingURL=index.js.map