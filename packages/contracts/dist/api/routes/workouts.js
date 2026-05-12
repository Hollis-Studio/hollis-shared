/**
 * @ai-context Workout Routes | workout plans, sessions, and exercise API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
// ============================================================================
// WORKOUT PLANS ROUTES
// ============================================================================
/**
 * Workout Plans API routes.
 * Base path: /api/plans/workout
 *
 * @group PLANS
 */
export const WORKOUT_PLANS_ROUTES = {
    /**
     * GET /api/plans/workout - Get workout plan
     * Query params: userId, date (or userId, startDate, endDate for range)
     */
    GET: '/api/plans/workout',
    /**
     * POST /api/plans/workout - Create/update workout plan
     */
    UPSERT: '/api/plans/workout',
    /**
     * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
     * @param workoutId - Workout's unique identifier
     */
    toggleComplete: (workoutId) => `/api/plans/workout/${workoutId}/toggle-complete`,
    /**
     * PUT /api/plans/workout/:workoutId/log-performance - Log actual exercise performance
     * Body: { sets: Array<{ exerciseId, setNumber, reps?, weight?, weightUnit?, rpe? }> }
     * @param workoutId - Workout's unique identifier
     */
    logPerformance: (workoutId) => `/api/plans/workout/${workoutId}/log-performance`,
    /**
     * GET /api/plans/workout/:workoutId/log-performance - Get actual logged performance for a workout
     * @param workoutId - Workout's unique identifier
     */
    getLoggedPerformance: (workoutId) => `/api/plans/workout/${workoutId}/log-performance`,
    /**
     * DELETE /api/plans/workout/:workoutId/log-performance/:exerciseId/:setNumber
     * Remove a single logged set from a workout.
     * @param workoutId - Workout's unique identifier
     * @param exerciseId - Exercise UUID for the logged set
     * @param setNumber - 1-based set number for the logged set
     */
    deleteLoggedPerformance: (workoutId, exerciseId, setNumber) => `/api/plans/workout/${workoutId}/log-performance/${exerciseId}/${setNumber}`,
};
// ============================================================================
// PLANS ROUTES (Combined for backward compatibility)
// ============================================================================
/**
 * Plans API routes (workout and nutrition plans).
 * Base path: /api/plans
 *
 * @group PLANS
 */
export const PLANS_ROUTES = {
    /**
     * GET /api/plans/workout - Get workout plan
     * Query params: userId, date (or userId, startDate, endDate for range)
     */
    WORKOUT: '/api/plans/workout',
    /**
     * POST /api/plans/workout - Create/update workout plan
     */
    WORKOUT_UPSERT: '/api/plans/workout',
    /**
     * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
     * @param workoutId - Workout's unique identifier
     */
    toggleWorkoutComplete: (workoutId) => `/api/plans/workout/${workoutId}/toggle-complete`,
    /**
     * GET /api/plans/nutrition - Get nutrition plan
     * Query params: userId, date
     */
    NUTRITION: '/api/plans/nutrition',
    /**
     * POST /api/plans/nutrition - Create/update nutrition plan
     */
    NUTRITION_UPSERT: '/api/plans/nutrition',
    /**
     * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
     */
    NUTRITION_SIMPLE: '/api/plans/nutrition/simple',
};
// ============================================================================
// TRAINING STRATEGIES ROUTES
// ============================================================================
/**
 * Training strategies API routes.
 * Base path: /users/:userId/strategies
 *
 * @group STRATEGIES
 */
export const STRATEGIES_ROUTES = {
    /**
     * GET /users/:userId/strategies - List user's training strategies
     * Query params: status, includePhases
     * @param userId - User's unique identifier
     */
    list: (userId) => `/users/${userId}/strategies`,
    /**
     * GET /users/:userId/strategies/active - Get active strategy (deprecated, use list with status filter)
     * @param userId - User's unique identifier
     */
    active: (userId) => `/users/${userId}/strategies/active`,
    /**
     * GET /users/:userId/strategies/:strategyId - Get strategy details
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    get: (userId, strategyId) => `/users/${userId}/strategies/${strategyId}`,
    /**
     * POST /users/:userId/strategies - Create new strategy
     * @param userId - User's unique identifier
     */
    create: (userId) => `/users/${userId}/strategies`,
    /**
     * PUT /users/:userId/strategies/:strategyId - Update strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    update: (userId, strategyId) => `/users/${userId}/strategies/${strategyId}`,
    /**
     * DELETE /users/:userId/strategies/:strategyId - Delete strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    delete: (userId, strategyId) => `/users/${userId}/strategies/${strategyId}`,
    /**
     * POST /users/:userId/strategies/:strategyId/sync - Sync progress from data source
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    sync: (userId, strategyId) => `/users/${userId}/strategies/${strategyId}/sync`,
    /**
     * PUT /users/:userId/strategies/:strategyId/progress - Update goal progress
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    updateProgress: (userId, strategyId) => `/users/${userId}/strategies/${strategyId}/progress`,
    /**
     * POST /users/:userId/strategies/:strategyId/goals - Add goal to strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    addGoal: (userId, strategyId) => `/users/${userId}/strategies/${strategyId}/goals`,
    /**
     * PUT /users/:userId/strategies/:strategyId/goals/:goalId - Update goal
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     * @param goalId - Goal's unique identifier
     */
    updateGoal: (userId, strategyId, goalId) => `/users/${userId}/strategies/${strategyId}/goals/${goalId}`,
    /**
     * DELETE /users/:userId/strategies/:strategyId/goals/:goalId - Remove goal
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     * @param goalId - Goal's unique identifier
     */
    deleteGoal: (userId, strategyId, goalId) => `/users/${userId}/strategies/${strategyId}/goals/${goalId}`,
};
//# sourceMappingURL=workouts.js.map