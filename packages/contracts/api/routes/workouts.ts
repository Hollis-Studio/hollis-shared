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
  toggleComplete: (workoutId: string) => `/api/plans/workout/${workoutId}/toggle-complete` as const,

  /**
   * PUT /api/plans/workout/:workoutId/log-performance - Log actual exercise performance
   * Body: { sets: Array<{ exerciseId, setNumber, reps?, weight?, weightUnit?, rpe? }> }
   * @param workoutId - Workout's unique identifier
   */
  logPerformance: (workoutId: string) => `/api/plans/workout/${workoutId}/log-performance` as const,
} as const;

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
  toggleWorkoutComplete: (workoutId: string) => `/api/plans/workout/${workoutId}/toggle-complete` as const,

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
} as const;

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
  list: (userId: string) => `/users/${userId}/strategies` as const,

  /**
   * GET /users/:userId/strategies/active - Get active strategy (deprecated, use list with status filter)
   * @param userId - User's unique identifier
   */
  active: (userId: string) => `/users/${userId}/strategies/active` as const,

  /**
   * GET /users/:userId/strategies/:strategyId - Get strategy details
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  get: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * POST /users/:userId/strategies - Create new strategy
   * @param userId - User's unique identifier
   */
  create: (userId: string) => `/users/${userId}/strategies` as const,

  /**
   * PUT /users/:userId/strategies/:strategyId - Update strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  update: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * DELETE /users/:userId/strategies/:strategyId - Delete strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  delete: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * POST /users/:userId/strategies/:strategyId/sync - Sync progress from data source
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  sync: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}/sync` as const,

  /**
   * PUT /users/:userId/strategies/:strategyId/progress - Update goal progress
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  updateProgress: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}/progress` as const,

  /**
   * POST /users/:userId/strategies/:strategyId/goals - Add goal to strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  addGoal: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}/goals` as const,

  /**
   * PUT /users/:userId/strategies/:strategyId/goals/:goalId - Update goal
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   * @param goalId - Goal's unique identifier
   */
  updateGoal: (userId: string, strategyId: string, goalId: string) =>
    `/users/${userId}/strategies/${strategyId}/goals/${goalId}` as const,

  /**
   * DELETE /users/:userId/strategies/:strategyId/goals/:goalId - Remove goal
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   * @param goalId - Goal's unique identifier
   */
  deleteGoal: (userId: string, strategyId: string, goalId: string) =>
    `/users/${userId}/strategies/${strategyId}/goals/${goalId}` as const,
} as const;
