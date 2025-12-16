/**
 * @ai-context AI Routes | AI-related API endpoints
 *
 * Currently this module is a placeholder for future AI-specific routes.
 * AI-related functionality is currently handled through other routes like
 * ADMIN_ROUTES.LAB_EXTRACTION.
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// ============================================================================
// AI ROUTES (Placeholder for future expansion)
// ============================================================================

/**
 * AI API routes.
 * Base path: /api/ai
 *
 * @group AI
 */
export const AI_ROUTES = {
  // Future AI-specific routes will be added here
  // Examples:
  // - /api/ai/analyze-labs
  // - /api/ai/meal-suggestions
  // - /api/ai/workout-recommendations
} as const;

/** Type for AI route values */
export type AiRoute = (typeof AI_ROUTES)[keyof typeof AI_ROUTES];
