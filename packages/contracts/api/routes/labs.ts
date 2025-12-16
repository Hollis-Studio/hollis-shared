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
   * GET /api/labs/panels/:panelId - Get specific lab panel
   * @param panelId - Lab panel's unique identifier
   */
  getPanel: (panelId: string) => `/api/labs/panels/${panelId}` as const,

  /**
   * POST /api/labs/panels - Create new lab panel
   */
  CREATE_PANEL: '/api/labs/panels',

  /**
   * POST /api/labs/auto-ingest - Auto-ingest lab data
   */
  AUTO_INGEST: '/api/labs/auto-ingest',
} as const;
