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
  upcoming: (userId: string) => `/users/${userId}/appointments/upcoming` as const,

  /**
   * GET /users/:userId/appointments - List appointments for date range
   * Query params: startDate, endDate
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/appointments` as const,

  /**
   * POST /users/:userId/appointments - Create appointment
   * @param userId - User's unique identifier
   */
  create: (userId: string) => `/users/${userId}/appointments` as const,

  /**
   * PUT /users/:userId/appointments/:appointmentId - Update appointment
   * @param userId - User's unique identifier
   * @param appointmentId - Appointment's unique identifier
   */
  update: (userId: string, appointmentId: string) =>
    `/users/${userId}/appointments/${appointmentId}` as const,

  /**
   * PATCH /users/:userId/appointments/:appointmentId/cancel - Cancel appointment
   * @param userId - User's unique identifier
   * @param appointmentId - Appointment's unique identifier
   */
  cancel: (userId: string, appointmentId: string) =>
    `/users/${userId}/appointments/${appointmentId}/cancel` as const,
} as const;

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
   */
  get: (providerId: string) => `/api/providers/${providerId}` as const,

  /**
   * GET /api/providers/:providerId/available-slots - Get available slots
   * Query params: startDate, endDate
   * @param providerId - Provider's unique identifier
   */
  availableSlots: (providerId: string) => `/api/providers/${providerId}/available-slots` as const,

  /**
   * GET/PUT /api/providers/:providerId/schedule - Get or update provider schedule
   * @param providerId - Provider's unique identifier
   */
  schedule: (providerId: string) => `/api/providers/${providerId}/schedule` as const,
} as const;

/** Type for providers route values */
export type ProvidersRoute =
  | (typeof PROVIDERS_ROUTES)['LIST']
  | ReturnType<Exclude<(typeof PROVIDERS_ROUTES)[keyof typeof PROVIDERS_ROUTES], string>>;
