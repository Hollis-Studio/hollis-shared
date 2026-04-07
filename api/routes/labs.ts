/**
 * @ai-context Labs Routes | lab results and panels API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// ============================================================================
// LABS ROUTES
// ============================================================================

/**
 * Labs API routes.
 * Base path: /api/labs
 *
 * @group LABS
 */
export const LABS_ROUTES = {
  /**
   * GET /api/labs - Get lab panels for user
   * Query params: userId, includePanels
   */
  LIST: '/api/labs',

  /**
   * GET /api/labs?userId={userId}&includeReports=true - Get lab reports for user
   * @param userId - User's unique identifier
   */
  getReports: (userId: string) => `/api/labs?userId=${userId}&includeReports=true` as const,

  /**
   * GET /api/labs/reports/:reportId - Get specific lab report
   * @param reportId - Lab report's unique identifier
   */
  getReport: (reportId: string) => `/api/labs/reports/${reportId}` as const,

  /**
   * GET /api/labs/panels/:panelId - Get specific lab panel
   * @param panelId - Lab panel's unique identifier
   */
  getPanel: (panelId: string) => `/api/labs/panels/${panelId}` as const,

  /**
   * GET /api/labs/metric-definitions - List canonical lab metric definitions
   * Query params: search, category, page, limit
   * Used for biomarker picker dropdown
   */
  METRIC_DEFINITIONS: '/api/labs/metric-definitions',
} as const;
