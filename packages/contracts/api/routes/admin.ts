/**
 * @ai-context Admin Routes | admin, CRM, and management API endpoints
 *
 * deps: ./types | consumers: src/services/*, web-admin/services/*, server/src/*
 */

import type { RouteMetadata } from './types';

// ============================================================================
// ADMIN ROUTES
// ============================================================================

/**
 * Admin/CRM API routes.
 * Base path: /admin
 * Requires admin or clinician role.
 *
 * @group ADMIN
 */
export const ADMIN_ROUTES = {
  /** GET /admin/analytics - Get CRM analytics data */
  ANALYTICS: '/admin/analytics',
  /** GET /admin/cache-metrics - Get cache performance metrics */
  CACHE_METRICS: '/admin/cache-metrics',
  /** POST /admin/lab-extraction - Extract lab data from document */
  LAB_EXTRACTION: '/admin/lab-extraction',
} as const;

/** Type for admin route values */
export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];

// ============================================================================
// CRM/EVENTS ROUTES
// ============================================================================

/**
 * CRM events API routes.
 * Base path: /api/crm
 *
 * @group CRM
 */
export const CRM_ROUTES = {
  /** POST /api/crm/events - Create user event for compliance tracking */
  EVENTS: '/api/crm/events',
} as const;

/** Type for CRM route values */
export type CrmRoute = (typeof CRM_ROUTES)[keyof typeof CRM_ROUTES];

// ============================================================================
// UPLOAD ROUTES
// ============================================================================

/**
 * Upload API routes.
 * Base path: /api/upload
 *
 * @group UPLOAD
 */
export const UPLOAD_ROUTES = {
  /**
   * POST /api/upload - Upload a file
   */
  UPLOAD: '/api/upload',
} as const;

// ============================================================================
// DOCUMENTS ROUTES
// ============================================================================

/**
 * Documents API routes.
 * Base path: /api/documents
 *
 * @group DOCUMENTS
 */
export const DOCUMENTS_ROUTES = {
  /** GET /api/documents - List all documents for user */
  LIST: '/api/documents',

  /** POST /api/documents - Create/upload document */
  CREATE: '/api/documents',

  /**
   * GET /api/documents/:documentId - Get single document
   * @param documentId - Document's unique identifier
   */
  get: (documentId: string) => `/api/documents/${documentId}` as const,

  /**
   * DELETE /api/documents/:documentId - Delete document
   * @param documentId - Document's unique identifier
   */
  delete: (documentId: string) => `/api/documents/${documentId}` as const,
} as const;

/** Type for documents route values */
export type DocumentsRoute =
  | (typeof DOCUMENTS_ROUTES)['LIST']
  | (typeof DOCUMENTS_ROUTES)['CREATE']
  | ReturnType<Exclude<(typeof DOCUMENTS_ROUTES)[keyof typeof DOCUMENTS_ROUTES], string>>;

// ============================================================================
// ADMIN ROUTE METADATA
// ============================================================================

/**
 * Route metadata for admin routes.
 */
export const ADMIN_ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ADMIN_ROUTES.ANALYTICS]: {
    method: 'GET',
    description: 'Get CRM analytics dashboard data',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [ADMIN_ROUTES.CACHE_METRICS]: {
    method: 'GET',
    description: 'Get cache performance metrics',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [ADMIN_ROUTES.LAB_EXTRACTION]: {
    method: 'POST',
    description: 'Extract lab data from uploaded document using AI',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [CRM_ROUTES.EVENTS]: {
    method: 'POST',
    description: 'Create user event for compliance tracking',
    requiresAuth: true,
  },
} as const;
