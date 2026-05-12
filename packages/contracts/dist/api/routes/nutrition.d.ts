/**
 * @ai-context Nutrition Routes | nutrition and meal API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Nutrition log API routes.
 * Base path: /users/:userId/nutrition
 *
 * @group NUTRITION
 */
export declare const NUTRITION_ROUTES: {
    /**
     * GET /users/:userId/nutrition/:date - Get nutrition log for date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly get: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
    /**
     * GET /users/:userId/nutrition - List nutrition logs for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/nutrition`;
    /**
     * PUT /users/:userId/nutrition/:date - Upsert nutrition log for date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly upsert: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
    /**
     * POST /users/:userId/nutrition/:date/entries - Add food entries to one hourly bucket
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly addFoodEntries: (userId: string, date: string) => `/users/${string}/nutrition/${string}/entries`;
    /**
     * DELETE /users/:userId/nutrition/:date/entries/:foodId - Delete one food entry from a daily log
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     * @param foodId - Food entry identifier
     */
    readonly deleteFoodEntry: (userId: string, date: string, foodId: string) => `/users/${string}/nutrition/${string}/entries/${string}`;
    /**
     * POST /users/:userId/nutrition/analyze - Analyze nutrition data
     * @param userId - User's unique identifier
     */
    readonly analyze: (userId: string) => `/users/${string}/nutrition/analyze`;
};
/**
 * Nutrition Plans API routes.
 * Base path: /api/plans/nutrition
 *
 * @group PLANS
 */
export declare const NUTRITION_PLANS_ROUTES: {
    /**
     * GET /api/plans/nutrition - Get nutrition plan
     * Query params: userId, date
     */
    readonly GET: "/api/plans/nutrition";
    /**
     * POST /api/plans/nutrition - Create/update nutrition plan
     */
    readonly UPSERT: "/api/plans/nutrition";
    /**
     * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
     */
    readonly SIMPLE: "/api/plans/nutrition/simple";
};
//# sourceMappingURL=nutrition.d.ts.map