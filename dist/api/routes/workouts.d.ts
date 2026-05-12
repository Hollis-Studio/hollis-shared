/**
 * @ai-context Workout Routes | workout plans, sessions, and exercise API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Workout Plans API routes.
 * Base path: /api/plans/workout
 *
 * @group PLANS
 */
export declare const WORKOUT_PLANS_ROUTES: {
    /**
     * GET /api/plans/workout - Get workout plan
     * Query params: userId, date (or userId, startDate, endDate for range)
     */
    readonly GET: "/api/plans/workout";
    /**
     * POST /api/plans/workout - Create/update workout plan
     */
    readonly UPSERT: "/api/plans/workout";
    /**
     * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
     * @param workoutId - Workout's unique identifier
     */
    readonly toggleComplete: (workoutId: string) => `/api/plans/workout/${string}/toggle-complete`;
    /**
     * PUT /api/plans/workout/:workoutId/log-performance - Log actual exercise performance
     * Body: { sets: Array<{ exerciseId, setNumber, reps?, weight?, weightUnit?, rpe? }> }
     * @param workoutId - Workout's unique identifier
     */
    readonly logPerformance: (workoutId: string) => `/api/plans/workout/${string}/log-performance`;
    /**
     * GET /api/plans/workout/:workoutId/log-performance - Get actual logged performance for a workout
     * @param workoutId - Workout's unique identifier
     */
    readonly getLoggedPerformance: (workoutId: string) => `/api/plans/workout/${string}/log-performance`;
    /**
     * DELETE /api/plans/workout/:workoutId/log-performance/:exerciseId/:setNumber
     * Remove a single logged set from a workout.
     * @param workoutId - Workout's unique identifier
     * @param exerciseId - Exercise UUID for the logged set
     * @param setNumber - 1-based set number for the logged set
     */
    readonly deleteLoggedPerformance: (workoutId: string, exerciseId: string, setNumber: number) => `/api/plans/workout/${string}/log-performance/${string}/${number}`;
};
/**
 * Plans API routes (workout and nutrition plans).
 * Base path: /api/plans
 *
 * @group PLANS
 */
export declare const PLANS_ROUTES: {
    /**
     * GET /api/plans/workout - Get workout plan
     * Query params: userId, date (or userId, startDate, endDate for range)
     */
    readonly WORKOUT: "/api/plans/workout";
    /**
     * POST /api/plans/workout - Create/update workout plan
     */
    readonly WORKOUT_UPSERT: "/api/plans/workout";
    /**
     * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
     * @param workoutId - Workout's unique identifier
     */
    readonly toggleWorkoutComplete: (workoutId: string) => `/api/plans/workout/${string}/toggle-complete`;
    /**
     * GET /api/plans/nutrition - Get nutrition plan
     * Query params: userId, date
     */
    readonly NUTRITION: "/api/plans/nutrition";
    /**
     * POST /api/plans/nutrition - Create/update nutrition plan
     */
    readonly NUTRITION_UPSERT: "/api/plans/nutrition";
    /**
     * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
     */
    readonly NUTRITION_SIMPLE: "/api/plans/nutrition/simple";
};
/**
 * Training strategies API routes.
 * Base path: /users/:userId/strategies
 *
 * @group STRATEGIES
 */
export declare const STRATEGIES_ROUTES: {
    /**
     * GET /users/:userId/strategies - List user's training strategies
     * Query params: status, includePhases
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/strategies`;
    /**
     * GET /users/:userId/strategies/active - Get active strategy (deprecated, use list with status filter)
     * @param userId - User's unique identifier
     */
    readonly active: (userId: string) => `/users/${string}/strategies/active`;
    /**
     * GET /users/:userId/strategies/:strategyId - Get strategy details
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly get: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
    /**
     * POST /users/:userId/strategies - Create new strategy
     * @param userId - User's unique identifier
     */
    readonly create: (userId: string) => `/users/${string}/strategies`;
    /**
     * PUT /users/:userId/strategies/:strategyId - Update strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly update: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
    /**
     * DELETE /users/:userId/strategies/:strategyId - Delete strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly delete: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
    /**
     * POST /users/:userId/strategies/:strategyId/sync - Sync progress from data source
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly sync: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/sync`;
    /**
     * PUT /users/:userId/strategies/:strategyId/progress - Update goal progress
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly updateProgress: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/progress`;
    /**
     * POST /users/:userId/strategies/:strategyId/goals - Add goal to strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly addGoal: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/goals`;
    /**
     * PUT /users/:userId/strategies/:strategyId/goals/:goalId - Update goal
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     * @param goalId - Goal's unique identifier
     */
    readonly updateGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
    /**
     * DELETE /users/:userId/strategies/:strategyId/goals/:goalId - Remove goal
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     * @param goalId - Goal's unique identifier
     */
    readonly deleteGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
};
//# sourceMappingURL=workouts.d.ts.map