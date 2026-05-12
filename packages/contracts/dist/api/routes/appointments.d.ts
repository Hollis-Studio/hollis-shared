/**
 * @ai-context Appointment Routes | appointment and scheduling API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Appointments API routes.
 * Base path: /users/:userId/appointments
 *
 * @group APPOINTMENTS
 */
export declare const APPOINTMENTS_ROUTES: {
    /**
     * GET /users/:userId/appointments/upcoming - Get upcoming appointments
     * @param userId - User's unique identifier
     */
    readonly upcoming: (userId: string) => `/users/${string}/appointments/upcoming`;
    /**
     * GET /users/:userId/appointments - List appointments for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/appointments`;
    /**
     * GET /users/:userId/appointments/:appointmentId - Get single appointment by ID
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    readonly get: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
    /**
     * POST /users/:userId/appointments - Create appointment
     * @param userId - User's unique identifier
     */
    readonly create: (userId: string) => `/users/${string}/appointments`;
    /**
     * PUT /users/:userId/appointments/:appointmentId - Update appointment
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    readonly update: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
    /**
     * PATCH /users/:userId/appointments/:appointmentId/cancel - Cancel appointment
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    readonly cancel: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}/cancel`;
};
/**
 * Providers API routes.
 * Base path: /api/providers
 *
 * @group PROVIDERS
 */
export declare const PROVIDERS_ROUTES: {
    /** GET /api/providers - List all providers */
    readonly LIST: "/api/providers";
    /**
     * GET /api/providers/:providerId - Get single provider
     * @param providerId - Provider's unique identifier
     * @note B-13: No known client caller — server route exists but is currently unused by mobile/web-admin
     */
    readonly get: (providerId: string) => `/api/providers/${string}`;
    /**
     * GET /api/providers/:providerId/availability - Get available booking slots
     * Query params: date, days
     * @param providerId - Provider's unique identifier
     */
    readonly availability: (providerId: string) => `/api/providers/${string}/availability`;
    /**
     * GET/PUT /api/providers/:providerId/schedule - Get or update provider schedule
     * @param providerId - Provider's unique identifier
     */
    readonly schedule: (providerId: string) => `/api/providers/${string}/schedule`;
};
/** Type for providers route values */
export type ProvidersRoute = (typeof PROVIDERS_ROUTES)['LIST'] | ReturnType<Exclude<(typeof PROVIDERS_ROUTES)[keyof typeof PROVIDERS_ROUTES], string>>;
//# sourceMappingURL=appointments.d.ts.map