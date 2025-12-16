/**
 * @ai-context Nutrition Routes | nutrition and meal API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// ============================================================================
// NUTRITION ROUTES
// ============================================================================

/**
 * Nutrition log API routes.
 * Base path: /users/:userId/nutrition
 *
 * @group NUTRITION
 */
export const NUTRITION_ROUTES = {
  /**
   * GET /users/:userId/nutrition/:date - Get nutrition log for date
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  get: (userId: string, date: string) => `/users/${userId}/nutrition/${date}` as const,

  /**
   * GET /users/:userId/nutrition - List nutrition logs for date range
   * Query params: startDate, endDate
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/nutrition` as const,

  /**
   * PUT /users/:userId/nutrition/:date - Upsert nutrition log for date
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  upsert: (userId: string, date: string) => `/users/${userId}/nutrition/${date}` as const,
} as const;

// ============================================================================
// PLANS ROUTES (Nutrition portion)
// ============================================================================

/**
 * Nutrition Plans API routes.
 * Base path: /api/plans/nutrition
 *
 * @group PLANS
 */
export const NUTRITION_PLANS_ROUTES = {
  /**
   * GET /api/plans/nutrition - Get nutrition plan
   * Query params: userId, date
   */
  GET: '/api/plans/nutrition',

  /**
   * POST /api/plans/nutrition - Create/update nutrition plan
   */
  UPSERT: '/api/plans/nutrition',

  /**
   * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
   */
  SIMPLE: '/api/plans/nutrition/simple',
} as const;
