/**
 * @ai-context Admin domain types | Types for admin/CRM operations
 *
 * This module provides type definitions for admin-specific operations:
 * - Clinician and trainer management
 * - Training strategies (create/update inputs)
 * - Lab results and extraction
 * - Workout generation
 * - Exercise filtering
 *
 * IMPORTANT: All admin-related types MUST be imported from here.
 *
 * NOTE: This module defines self-contained types for admin operations.
 * Complex nested types (like PatientDetails) use generic typing to allow
 * consumers to inject their platform-specific contract types.
 *
 * deps: domain types | consumers: web-admin/services/*, server/src/routes/admin/*
 */
// ============================================================================
// COMPLIANCE STATUS (admin-specific)
// ============================================================================
/**
 * Granular compliance status levels for admin views.
 */
export const ADMIN_COMPLIANCE_STATUSES = [
    "excellent",
    "good",
    "at-risk",
    "non-compliant",
];
//# sourceMappingURL=admin-types.js.map