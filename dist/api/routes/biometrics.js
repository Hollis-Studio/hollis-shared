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
    list: (userId) => `/users/${userId}/biometrics`,
    /**
     * POST /users/:userId/biometrics - Create biometric entry
     * @param userId - User's unique identifier
     */
    create: (userId) => `/users/${userId}/biometrics`,
    /**
     * DELETE /users/:userId/biometrics/:entryId - Delete biometric entry
     * @param userId - User's unique identifier
     * @param entryId - Entry's unique identifier
     */
    delete: (userId, entryId) => `/users/${userId}/biometrics/${entryId}`,
};
//# sourceMappingURL=biometrics.js.map