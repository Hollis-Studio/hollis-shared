/**
 * @ai-context Biometrics Routes | biometric data API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Biometrics data API routes.
 * Base path: /users/:userId/biometrics
 *
 * @group BIOMETRICS
 */
export declare const BIOMETRICS_ROUTES: {
    /**
     * GET /users/:userId/biometrics - List biometric entries
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/biometrics`;
    /**
     * POST /users/:userId/biometrics - Create biometric entry
     * @param userId - User's unique identifier
     */
    readonly create: (userId: string) => `/users/${string}/biometrics`;
    /**
     * DELETE /users/:userId/biometrics/:entryId - Delete biometric entry
     * @param userId - User's unique identifier
     * @param entryId - Entry's unique identifier
     */
    readonly delete: (userId: string, entryId: string) => `/users/${string}/biometrics/${string}`;
};
//# sourceMappingURL=biometrics.d.ts.map