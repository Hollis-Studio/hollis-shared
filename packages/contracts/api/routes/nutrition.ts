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

  /**
   * POST /users/:userId/nutrition/:date/entries - Add food entries to one hourly bucket
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  addFoodEntries: (userId: string, date: string) =>
    `/users/${userId}/nutrition/${date}/entries` as const,

  /**
   * DELETE /users/:userId/nutrition/:date/entries/:foodId - Delete one food entry from a daily log
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   * @param foodId - Food entry identifier
   */
  deleteFoodEntry: (userId: string, date: string, foodId: string) =>
    `/users/${userId}/nutrition/${date}/entries/${encodeURIComponent(foodId)}` as const,

  /** Atomically edit and move one food entry to another date/hour. */
  moveFoodEntry: (userId: string, sourceDate: string, foodId: string) =>
    `/users/${userId}/nutrition/${sourceDate}/entries/${encodeURIComponent(foodId)}/move` as const,

  /** List and create reusable named meal templates. */
  templates: (userId: string) =>
    `/users/${userId}/nutrition/templates` as const,

  /** Update or delete one reusable named meal template. */
  template: (userId: string, templateId: string) =>
    `/users/${userId}/nutrition/templates/${encodeURIComponent(templateId)}` as const,

  /** Search the server-backed food catalog. */
  catalogSearch: (userId: string) =>
    `/users/${userId}/nutrition/catalog/search` as const,

  /** Resolve one product barcode through the server-backed food catalog. */
  catalogBarcode: (userId: string, barcode: string) =>
    `/users/${userId}/nutrition/catalog/barcode/${encodeURIComponent(barcode)}` as const,

  /**
   * POST /users/:userId/nutrition/analyze - Analyze nutrition data
   * @param userId - User's unique identifier
   */
  analyze: (userId: string) => `/users/${userId}/nutrition/analyze` as const,
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
