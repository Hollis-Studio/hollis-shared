/**
 * @ai-context Admin Routes | admin, CRM, and management API endpoints
 *
 * deps: ./types | consumers: src/services/*, web-admin/services/*, server/src/*
 */
import type { RouteMetadata } from './types.js';
/**
 * Admin/CRM API routes.
 * Base path: /admin
 * Requires admin or clinician role.
 *
 * @group ADMIN
 */
export declare const ADMIN_ROUTES: {
    /** GET /admin/analytics - Get CRM analytics data */
    readonly ANALYTICS: "/admin/analytics";
    /** GET /admin/cache-metrics - Get cache performance metrics */
    readonly CACHE_METRICS: "/admin/cache-metrics";
    /** POST /admin/lab-extraction - Extract lab data from document */
    readonly LAB_EXTRACTION: "/admin/lab-extraction";
};
/** Type for admin route values */
export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];
/**
 * CRM events API routes.
 * Base path: /api/crm
 *
 * @group CRM
 */
export declare const CRM_ROUTES: {
    /** POST /api/crm/events - Create user event for compliance tracking */
    readonly EVENTS: "/api/crm/events";
};
/** Type for CRM route values */
export type CrmRoute = (typeof CRM_ROUTES)[keyof typeof CRM_ROUTES];
/**
 * Upload API routes.
 * Base path: /api/upload
 *
 * @group UPLOAD
 */
export declare const UPLOAD_ROUTES: {
    /**
     * POST /api/upload - Upload a file
     */
    readonly UPLOAD: "/api/upload";
};
/**
 * Documents API routes.
 * Base path: /api/documents
 *
 * @group DOCUMENTS
 */
export declare const DOCUMENTS_ROUTES: {
    /** GET /api/documents - List all documents for user */
    readonly LIST: "/api/documents";
    /** POST /api/documents - Create/upload document */
    readonly CREATE: "/api/documents";
    /**
     * GET /api/documents/:documentId - Get single document
     * @param documentId - Document's unique identifier
     */
    readonly get: (documentId: string) => `/api/documents/${string}`;
    /**
     * DELETE /api/documents/:documentId - Delete document
     * @param documentId - Document's unique identifier
     */
    readonly delete: (documentId: string) => `/api/documents/${string}`;
};
/** Type for documents route values */
export type DocumentsRoute = (typeof DOCUMENTS_ROUTES)['LIST'] | (typeof DOCUMENTS_ROUTES)['CREATE'] | ReturnType<Exclude<(typeof DOCUMENTS_ROUTES)[keyof typeof DOCUMENTS_ROUTES], string>>;
/**
 * Route metadata for admin routes.
 */
export declare const ADMIN_ROUTE_METADATA: Record<string, RouteMetadata>;
//# sourceMappingURL=admin.d.ts.map