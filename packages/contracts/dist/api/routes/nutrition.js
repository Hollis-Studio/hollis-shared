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
    get: (userId, date) => `/users/${userId}/nutrition/${date}`,
    /**
     * GET /users/:userId/nutrition - List nutrition logs for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    list: (userId) => `/users/${userId}/nutrition`,
    /**
     * PUT /users/:userId/nutrition/:date - Upsert nutrition log for date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    upsert: (userId, date) => `/users/${userId}/nutrition/${date}`,
    /**
     * POST /users/:userId/nutrition/:date/entries - Add food entries to one hourly bucket
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    addFoodEntries: (userId, date) => `/users/${userId}/nutrition/${date}/entries`,
    /**
     * DELETE /users/:userId/nutrition/:date/entries/:foodId - Delete one food entry from a daily log
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     * @param foodId - Food entry identifier
     */
    deleteFoodEntry: (userId, date, foodId) => `/users/${userId}/nutrition/${date}/entries/${encodeURIComponent(foodId)}`,
    /**
     * POST /users/:userId/nutrition/analyze - Analyze nutrition data
     * @param userId - User's unique identifier
     */
    analyze: (userId) => `/users/${userId}/nutrition/analyze`,
};
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
};
//# sourceMappingURL=nutrition.js.map