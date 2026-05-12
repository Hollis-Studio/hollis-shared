/**
 * @ai-context Appointment Routes | appointment and scheduling API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
// ============================================================================
// APPOINTMENTS ROUTES
// ============================================================================
/**
 * Appointments API routes.
 * Base path: /users/:userId/appointments
 *
 * @group APPOINTMENTS
 */
export const APPOINTMENTS_ROUTES = {
    /**
     * GET /users/:userId/appointments/upcoming - Get upcoming appointments
     * @param userId - User's unique identifier
     */
    upcoming: (userId) => `/users/${userId}/appointments/upcoming`,
    /**
     * GET /users/:userId/appointments - List appointments for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    list: (userId) => `/users/${userId}/appointments`,
    /**
     * GET /users/:userId/appointments/:appointmentId - Get single appointment by ID
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    get: (userId, appointmentId) => `/users/${userId}/appointments/${appointmentId}`,
    /**
     * POST /users/:userId/appointments - Create appointment
     * @param userId - User's unique identifier
     */
    create: (userId) => `/users/${userId}/appointments`,
    /**
     * PUT /users/:userId/appointments/:appointmentId - Update appointment
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    update: (userId, appointmentId) => `/users/${userId}/appointments/${appointmentId}`,
    /**
     * PATCH /users/:userId/appointments/:appointmentId/cancel - Cancel appointment
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    cancel: (userId, appointmentId) => `/users/${userId}/appointments/${appointmentId}/cancel`,
};
// ============================================================================
// PROVIDERS ROUTES
// ============================================================================
/**
 * Providers API routes.
 * Base path: /api/providers
 *
 * @group PROVIDERS
 */
export const PROVIDERS_ROUTES = {
    /** GET /api/providers - List all providers */
    LIST: '/api/providers',
    /**
     * GET /api/providers/:providerId - Get single provider
     * @param providerId - Provider's unique identifier
     * @note B-13: No known client caller — server route exists but is currently unused by mobile/web-admin
     */
    get: (providerId) => `/api/providers/${providerId}`,
    /**
     * GET /api/providers/:providerId/availability - Get available booking slots
     * Query params: date, days
     * @param providerId - Provider's unique identifier
     */
    availability: (providerId) => `/api/providers/${providerId}/availability`,
    /**
     * GET/PUT /api/providers/:providerId/schedule - Get or update provider schedule
     * @param providerId - Provider's unique identifier
     */
    schedule: (providerId) => `/api/providers/${providerId}/schedule`,
};
//# sourceMappingURL=appointments.js.map