/**
 * @ai-context Biometrics Routes | biometric data API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// ============================================================================
// BIOMETRICS ROUTES
// ============================================================================

/**
 * Biometrics data API routes.
 * Base path: /users/:userId/biometrics
 *
 * @group BIOMETRICS
 */
export const BIOMETRICS_ROUTES = {
  /**
   * GET /users/:userId/biometrics - List biometric entries
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/biometrics` as const,

  /**
   * POST /users/:userId/biometrics - Create biometric entry
   * @param userId - User's unique identifier
   */
  create: (userId: string) => `/users/${userId}/biometrics` as const,

  /**
   * DELETE /users/:userId/biometrics/:entryId - Delete biometric entry
   * @param userId - User's unique identifier
   * @param entryId - Entry's unique identifier
   */
  delete: (userId: string, entryId: string) => `/users/${userId}/biometrics/${entryId}` as const,
} as const;
