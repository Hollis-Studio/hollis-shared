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
export * from './admin-types';

// Routes
export * from './admin-routes';

// Schemas
export * from './admin-schemas';

// Notifications - admin realtime notification kinds
export * from './notifications';
