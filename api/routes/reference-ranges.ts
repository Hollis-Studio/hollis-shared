/**
 * @ai-context Reference Ranges Routes | admin endpoints for managing clinical reference ranges
 *
 * These routes are admin/clinician-only for managing the dynamic reference range system.
 * Includes CRUD for SystemReferenceRange, ReferenceRangeModifier, and MetricHardLimits.
 *
 * deps: ./types | consumers: web-admin/services/*, server/src/*
 */

import type { RouteMetadata } from './types';

// ============================================================================
// REFERENCE RANGES ROUTES
// ============================================================================

/**
 * Reference Ranges API routes.
 * Base path: /api/admin/reference-ranges
 * Requires admin or clinician role.
 *
 * @group REFERENCE_RANGES
 */
export const REFERENCE_RANGES_ROUTES = {
  // System Reference Ranges
  /** GET /api/admin/reference-ranges - List all system reference ranges */
  LIST: '/api/admin/reference-ranges',

  /** POST /api/admin/reference-ranges - Create a new system reference range */
  CREATE: '/api/admin/reference-ranges',

  /**
   * GET /api/admin/reference-ranges/:rangeId - Get a single reference range with modifiers
   * @param rangeId - Reference range's unique identifier
   */
  get: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}` as const,

  /**
   * PUT /api/admin/reference-ranges/:rangeId - Update a reference range
   * @param rangeId - Reference range's unique identifier
   */
  update: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}` as const,

  /**
   * DELETE /api/admin/reference-ranges/:rangeId - Deactivate a reference range (soft delete)
   * @param rangeId - Reference range's unique identifier
   */
  delete: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}` as const,

  // Modifiers (nested under reference range)
  /**
   * GET /api/admin/reference-ranges/:rangeId/modifiers - List modifiers for a range
   * @param rangeId - Reference range's unique identifier
   */
  listModifiers: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}/modifiers` as const,

  /**
   * POST /api/admin/reference-ranges/:rangeId/modifiers - Create a modifier
   * @param rangeId - Reference range's unique identifier
   */
  createModifier: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}/modifiers` as const,

  /**
   * PUT /api/admin/reference-ranges/:rangeId/modifiers/:modifierId - Update a modifier
   * @param rangeId - Reference range's unique identifier
   * @param modifierId - Modifier's unique identifier
   */
  updateModifier: (rangeId: string, modifierId: string) =>
    `/api/admin/reference-ranges/${rangeId}/modifiers/${modifierId}` as const,

  /**
   * DELETE /api/admin/reference-ranges/:rangeId/modifiers/:modifierId - Delete a modifier
   * @param rangeId - Reference range's unique identifier
   * @param modifierId - Modifier's unique identifier
   */
  deleteModifier: (rangeId: string, modifierId: string) =>
    `/api/admin/reference-ranges/${rangeId}/modifiers/${modifierId}` as const,

  // Hard Limits
  /**
   * GET /api/admin/reference-ranges/:rangeId/hard-limits - Get hard limits for a range
   * @param rangeId - Reference range's unique identifier
   */
  getHardLimits: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}/hard-limits` as const,

  /**
   * PUT /api/admin/reference-ranges/:rangeId/hard-limits - Create or update hard limits
   * @param rangeId - Reference range's unique identifier
   */
  upsertHardLimits: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}/hard-limits` as const,

  // Resolution endpoint (for previewing resolved ranges)
  /** POST /api/admin/reference-ranges/resolve - Resolve a range for given context */
  RESOLVE: '/api/admin/reference-ranges/resolve',

  // Modifier matrix (for UI visualization)
  /**
   * GET /api/admin/reference-ranges/:rangeId/matrix - Get modifier matrix for visualization
   * @param rangeId - Reference range's unique identifier
   */
  getMatrix: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}/matrix` as const,

  // Audit logs
  /**
   * GET /api/admin/reference-ranges/:rangeId/audit - Get audit logs for a range
   * @param rangeId - Reference range's unique identifier
   */
  getAuditLogs: (rangeId: string) => `/api/admin/reference-ranges/${rangeId}/audit` as const,

  /** GET /api/admin/reference-ranges/audit - Get all reference range audit logs */
  LIST_AUDIT_LOGS: '/api/admin/reference-ranges/audit',
} as const;

/** Type for reference ranges route values */
export type ReferenceRangesRoute =
  | (typeof REFERENCE_RANGES_ROUTES)['LIST']
  | (typeof REFERENCE_RANGES_ROUTES)['CREATE']
  | (typeof REFERENCE_RANGES_ROUTES)['RESOLVE']
  | (typeof REFERENCE_RANGES_ROUTES)['LIST_AUDIT_LOGS']
  | ReturnType<Exclude<(typeof REFERENCE_RANGES_ROUTES)[keyof typeof REFERENCE_RANGES_ROUTES], string>>;

// ============================================================================
// REFERENCE RANGES ROUTE METADATA
// ============================================================================

/**
 * Route metadata for reference ranges routes.
 */
export const REFERENCE_RANGES_ROUTE_METADATA: Record<string, RouteMetadata> = {
  [`GET ${REFERENCE_RANGES_ROUTES.LIST}`]: {
    method: 'GET',
    description: 'List all system reference ranges',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [`POST ${REFERENCE_RANGES_ROUTES.CREATE}`]: {
    method: 'POST',
    description: 'Create a new system reference range',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [`POST ${REFERENCE_RANGES_ROUTES.RESOLVE}`]: {
    method: 'POST',
    description: 'Resolve a reference range for a given patient context',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [`GET ${REFERENCE_RANGES_ROUTES.LIST_AUDIT_LOGS}`]: {
    method: 'GET',
    description: 'List all reference range audit logs',
    requiresAuth: true,
    requiresAdmin: true,
  },
} as const;
