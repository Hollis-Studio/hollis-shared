/**
 * @ai-context Admin API Routes | Typed constants for admin/CRM HTTP endpoints
 *
 * This file provides typed route constants for all admin-related API endpoints.
 * Routes are organized by domain and use typed functions for dynamic routes.
 *
 * IMPORTANT: All admin API calls MUST use paths from this registry, not hardcoded strings.
 *
 * Pattern:
 * - Static routes: string constants
 * - Dynamic routes: functions returning template literal types for type safety
 *
 * deps: none | consumers: web-admin/services/*, server/src/routes/admin/*
 */

// ============================================================================
// ADMIN PATIENT ROUTES
// ============================================================================

/**
 * Admin patient management routes.
 * Base path: /api/admin/patients
 */
export const ADMIN_PATIENT_ROUTES = {
  /** GET - List all patients */
  LIST: '/api/admin/patients',

  /** GET - Get patient details by ID */
  get: (userId: string) => `/api/admin/patients/${userId}` as const,

  /** GET - Get patient compliance metrics */
  compliance: (userId: string) => `/api/admin/patients/${userId}/compliance` as const,

  /** GET - Get patient health progress */
  healthProgress: (userId: string) => `/api/admin/patients/${userId}/health-progress` as const,

  /** GET - Get patient health progress history */
  healthProgressHistory: (userId: string) => `/api/admin/patients/${userId}/health-progress/history` as const,

  /** POST - Assign clinician to patient */
  assignClinician: (patientId: string) => `/api/admin/patients/${patientId}/assign-clinician` as const,

  /** GET - Get patient journal entries */
  journal: (userId: string) => `/api/admin/patients/${userId}/journal` as const,

  /** GET - Get patient events */
  events: (userId: string) => `/api/admin/patients/${userId}/events` as const,

  /** GET - Get patient health goals */
  healthGoals: (userId: string) => `/api/admin/patients/${userId}/health-goals` as const,

  /** PUT - Update patient health goal by metric key */
  updateHealthGoal: (userId: string, metricKey: string) =>
    `/api/admin/patients/${userId}/health-goals/${metricKey}` as const,

  /** DELETE - Reset patient health goal by metric key */
  resetHealthGoal: (userId: string, metricKey: string) =>
    `/api/admin/patients/${userId}/health-goals/${metricKey}` as const,

  /** GET - Get patient workouts */
  workouts: (userId: string) => `/api/admin/patients/${userId}/workouts` as const,

  /** DELETE - Delete patient workout by date */
  deleteWorkout: (userId: string, date: string) => `/api/admin/patients/${userId}/workouts/${date}` as const,

  /** GET - Get patient session notes */
  sessionNotes: (userId: string) => `/api/admin/patients/${userId}/session-notes` as const,

  /** GET - Get patient AI context */
  aiContext: (userId: string) => `/api/admin/patients/${userId}/ai-context` as const,

  /** GET - Get patient permanent notes */
  permanentNotes: (userId: string) => `/api/admin/patients/${userId}/permanent-notes` as const,

  /** POST - Create patient permanent note */
  createPermanentNote: (userId: string) => `/api/admin/patients/${userId}/permanent-notes` as const,

  /** PATCH - Update patient permanent note */
  updatePermanentNote: (userId: string, noteId: string) =>
    `/api/admin/patients/${userId}/permanent-notes/${noteId}` as const,

  /** DELETE - Delete patient permanent note */
  deletePermanentNote: (userId: string, noteId: string) =>
    `/api/admin/patients/${userId}/permanent-notes/${noteId}` as const,

  /** POST - Add patient clinical note */
  addNote: (patientId: string) => `/api/admin/patients/${patientId}/notes` as const,

  /** PUT - Update patient clinical note */
  updateNote: (userId: string, noteId: string) => `/api/admin/patients/${userId}/notes/${noteId}` as const,

  /** DELETE - Delete patient clinical note */
  deleteNote: (userId: string, noteId: string) => `/api/admin/patients/${userId}/notes/${noteId}` as const,

  /** POST - Create lab report */
  createLabReport: (userId: string) => `/api/admin/patients/${userId}/labs/reports` as const,

  /** DELETE - Delete lab report */
  deleteLabReport: (userId: string, reportId: string) => `/api/admin/patients/${userId}/labs/reports/${reportId}` as const,

  /** GET - Get patient intake questionnaire */
  intakeQuestionnaire: (userId: string) => `/api/admin/patients/${userId}/intake-questionnaire` as const,

  /** POST - Submit client intake */
  submitIntake: (userId: string) => `/api/admin/patients/${userId}/intake` as const,

  /** PUT - Update patient profile */
  updateProfile: (userId: string) => `/api/admin/patients/${userId}/profile` as const,

  /** PUT - Update patient goals */
  updateGoals: (userId: string) => `/api/admin/patients/${userId}/goals` as const,

  /** PUT - Update patient admin controls */
  updateAdminControls: (userId: string) => `/api/admin/patients/${userId}/admin-controls` as const,

  /** PUT - Update patient daily metrics */
  updateDailyMetrics: (userId: string, date: string) =>
    `/api/admin/patients/${userId}/daily-metrics/${date}` as const,
} as const;

// ============================================================================
// ADMIN STRATEGY ROUTES
// ============================================================================

/**
 * Admin training strategy routes.
 * Base path: /api/admin/patients/:userId/strategies
 */
export const ADMIN_STRATEGY_ROUTES = {
  /** GET - List patient strategies */
  list: (userId: string) => `/api/admin/patients/${userId}/strategies` as const,

  /** POST - Create patient strategy */
  create: (userId: string) => `/api/admin/patients/${userId}/strategies` as const,

  /** GET - Get patient strategy by ID */
  get: (userId: string, strategyId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}` as const,

  /** PUT - Update patient strategy */
  update: (userId: string, strategyId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}` as const,

  /** DELETE - Delete patient strategy */
  delete: (userId: string, strategyId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}` as const,

  /** PUT - Update strategy goal */
  updateGoal: (userId: string, strategyId: string, goalId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}/goals/${goalId}` as const,

  /** PUT - Update strategy progress */
  updateProgress: (userId: string, strategyId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}/progress` as const,

  /** POST - Activate strategy phase */
  activatePhase: (userId: string, strategyId: string, phaseId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}/phases/${phaseId}/activate` as const,

  /** POST - Complete strategy phase */
  completePhase: (userId: string, strategyId: string, phaseId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}/phases/${phaseId}/complete` as const,

  /** POST - Add strategy goal */
  addGoal: (userId: string, strategyId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}/goals` as const,

  /** DELETE - Delete strategy goal */
  deleteGoal: (userId: string, strategyId: string, goalId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}/goals/${goalId}` as const,

  /** POST - Sync strategy progress */
  syncProgress: (userId: string, strategyId: string) =>
    `/api/admin/patients/${userId}/strategies/${strategyId}/sync` as const,

  /** POST - Fetch goal value */
  fetchValue: (userId: string) => `/api/admin/patients/${userId}/strategies/fetch-value` as const,

  /** POST - Generate strategy via SSE */
  generate: (userId: string) => `/api/admin/patients/${userId}/strategies/generate` as const,

  /** POST - Continue strategy generation after clarification */
  continueGeneration: (userId: string) =>
    `/api/admin/patients/${userId}/strategies/generate/continue` as const,
} as const;

// ============================================================================
// ADMIN CLINICIAN ROUTES
// ============================================================================

/**
 * Admin clinician management routes.
 * Base path: /api/admin/clinicians
 */
export const ADMIN_CLINICIAN_ROUTES = {
  /** GET - List all clinicians */
  LIST: '/api/admin/clinicians',

  /** GET - Get clinician availability */
  availability: (clinicianId: string) => `/api/admin/clinicians/${clinicianId}/availability` as const,

  /** POST - Upsert clinician availability */
  upsertAvailability: (clinicianId: string) =>
    `/api/admin/clinicians/${clinicianId}/availability` as const,
} as const;

// ============================================================================
// ADMIN PROVIDER ROUTES
// ============================================================================

/**
 * Admin provider schedule routes.
 * Base path: /api/admin/providers
 */
export const ADMIN_PROVIDER_ROUTES = {
  /** GET - Get provider schedule */
  schedule: (providerId: string) => `/api/admin/providers/${providerId}/schedule` as const,

  /** PUT - Update provider schedule */
  updateSchedule: (providerId: string) => `/api/admin/providers/${providerId}/schedule` as const,
} as const;

// ============================================================================
// ADMIN MESSAGING ROUTES
// ============================================================================

/**
 * Admin messaging routes.
 * Base path: /api/admin/messages
 */
export const ADMIN_MESSAGE_ROUTES = {
  /** POST - Send message */
  SEND: '/api/admin/messages',

  /** GET - Get user conversations */
  conversations: (userId: string) => `/api/admin/messages/${userId}/conversations` as const,

  /** GET - Get message thread */
  thread: (userId: string, partnerId: string) =>
    `/api/admin/messages/${userId}/thread/${partnerId}` as const,

  /** DELETE - Delete a message */
  delete: (messageId: string) => `/api/admin/messages/${messageId}` as const,

  /** POST - Mark messages as read */
  markRead: (userId: string) => `/api/admin/messages/${userId}/mark-read` as const,
} as const;

// ============================================================================
// ADMIN EXERCISE ROUTES
// ============================================================================

/**
 * Admin exercise management routes.
 * Base path: /api/admin/exercises
 */
export const ADMIN_EXERCISE_ROUTES = {
  /** GET - List exercises (with filters) */
  LIST: '/api/admin/exercises',

  /** GET - Get exercise categories */
  CATEGORIES: '/api/admin/exercises/categories',

  /** GET - Get exercise by ID */
  get: (id: string) => `/api/admin/exercises/${id}` as const,

  /** POST - Create exercise */
  CREATE: '/api/admin/exercises',

  /** PUT - Update exercise */
  update: (id: string) => `/api/admin/exercises/${id}` as const,

  /** DELETE - Delete exercise */
  delete: (id: string) => `/api/admin/exercises/${id}` as const,
} as const;

// ============================================================================
// ADMIN BOOKING ROUTES
// ============================================================================

/**
 * Admin appointment/booking management routes.
 * Base path: /api/admin/appointments
 */
export const ADMIN_BOOKING_ROUTES = {
  /** GET - List appointments with optional filters */
  LIST: '/api/admin/appointments',

  /** GET - Get single appointment by ID */
  get: (appointmentId: string) => `/api/admin/appointments/${appointmentId}` as const,

  /** POST - Create appointment for a patient */
  CREATE: '/api/admin/appointments',

  /** PUT - Update appointment */
  update: (appointmentId: string) => `/api/admin/appointments/${appointmentId}` as const,

  /** POST - Cancel appointment */
  cancel: (appointmentId: string) => `/api/admin/appointments/${appointmentId}/cancel` as const,
} as const;

// ============================================================================
// ADMIN WORKOUT ROUTES
// ============================================================================

/**
 * Admin workout management routes.
 * Base path: /api/admin/workouts
 */
export const ADMIN_WORKOUT_ROUTES = {
  /** POST - Upsert workout plan */
  UPSERT: '/api/admin/workouts/upsert',
} as const;

// ============================================================================
// ADMIN SESSION NOTES ROUTES
// ============================================================================

/**
 * Admin session notes routes.
 * Base path: /api/admin/session-notes
 */
export const ADMIN_SESSION_NOTES_ROUTES = {
  /** POST - Create session note */
  CREATE: '/api/admin/session-notes',

  /** PUT - Update session note */
  update: (noteId: string) => `/api/admin/session-notes/${noteId}` as const,

  /** DELETE - Delete session note */
  delete: (noteId: string) => `/api/admin/session-notes/${noteId}` as const,
} as const;

// ============================================================================
// ADMIN REGISTRATION ROUTES
// ============================================================================

/**
 * Admin registration management routes.
 * Base path: /api/admin/registrations
 */
export const ADMIN_REGISTRATION_ROUTES = {
  /** GET - List registrations */
  LIST: '/api/admin/registrations',

  /** POST - Create registration */
  CREATE: '/api/admin/registrations',

  /** POST - Approve registration */
  approve: (id: string) => `/api/admin/registrations/${id}/approve` as const,

  /** POST - Reject registration */
  reject: (id: string) => `/api/admin/registrations/${id}/reject` as const,

  /** DELETE - Delete registration */
  delete: (barcode: string) => `/api/admin/registrations/${barcode}` as const,
} as const;

// ============================================================================
// ADMIN ANALYTICS ROUTES
// ============================================================================

/**
 * Admin analytics routes.
 * Base path: /api/admin
 */
export const ADMIN_ANALYTICS_ROUTES = {
  /** GET - Get CRM analytics */
  ANALYTICS: '/api/admin/analytics',

  /** GET - Get health progress overview */
  HEALTH_PROGRESS_OVERVIEW: '/api/admin/health-progress/overview',

  /** GET - Latest snapshot + trend data */
  BUSINESS_SNAPSHOT: '/api/admin/analytics/business-snapshot',

  /** GET - Population health improvements */
  CLINICAL_IMPACT: '/api/admin/analytics/clinical-impact',

  /** GET - All clients with compliance scores */
  COMPLIANCE_HEATMAP: '/api/admin/analytics/compliance-heatmap',

  /** GET - Trainers ranked by effectiveness */
  TRAINER_LEADERBOARD: '/api/admin/analytics/trainer-leaderboard',

  /** GET - Lab orders by status (Kanban data) */
  LAB_PIPELINE: '/api/admin/analytics/lab-pipeline',

  /** GET - Lead pipeline stages with counts */
  SALES_FUNNEL: '/api/admin/analytics/sales-funnel',

  /** GET - Red flag watchlist */
  AT_RISK_CLIENTS: '/api/admin/analytics/at-risk-clients',

  /** GET - Referral tree */
  REFERRAL_TREE: '/api/admin/analytics/referral-tree',

  /** POST - AI-powered natural language analytics query */
  AI_QUERY: '/api/admin/analytics/ai-query',
} as const;

// ============================================================================
// ADMIN USERS ROUTES
// ============================================================================

/**
 * Admin user search routes.
 * Base path: /api/admin/users
 */
export const ADMIN_USERS_ROUTES = {
  /** GET - Search users */
  SEARCH: '/api/admin/users/search',

  /** POST - Admin-initiated MFA reset for locked-out users (requires step-up auth) */
  resetMfa: (userId: string) => `/api/admin/users/${userId}/mfa/reset` as const,

  /** GET - Get MFA status for a specific user */
  mfaStatus: (userId: string) => `/api/admin/users/${userId}/mfa/status` as const,
} as const;

// ============================================================================
// ADMIN LAB ROUTES
// ============================================================================

/**
 * Admin lab data routes.
 * Base path: /api/admin/labs (non-patient) or /api/admin/patients/:userId/labs (patient-scoped)
 */
export const ADMIN_LAB_ROUTES = {
  /** POST - Extract lab data from PDF */
  EXTRACT: '/api/admin/labs/extract',

  /** POST - Create verified lab report for a patient */
  reports: (userId: string) => `/api/admin/patients/${userId}/labs/reports` as const,

  /** DELETE - Delete lab report for a patient */
  deleteReport: (userId: string, reportId: string) =>
    `/api/admin/patients/${userId}/labs/reports/${reportId}` as const,

  /** GET - Search lab metric definitions */
  METRIC_SEARCH: '/api/admin/labs/metrics/search',

  /** POST - Create lab metric definition */
  METRIC_CREATE: '/api/admin/labs/metrics',

  /** Base path for metric governance operations */
  METRICS: '/api/admin/labs/metrics',

  /** PATCH - Update lab order status */
  status: (labId: string) => `/api/admin/labs/${labId}/status` as const,

  // Order-First Workflow Routes
  /** GET - Get single lab order by ID (with observations) */
  getOrder: (orderId: string) => `/api/admin/labs/orders/${orderId}` as const,

  /** DELETE - Delete lab order by ID */
  deleteOrder: (orderId: string) => `/api/admin/labs/orders/${orderId}` as const,

  /** POST - Create lab order (without observations) */
  createOrder: (userId: string) => `/api/admin/patients/${userId}/labs/orders` as const,

  /** GET - Get pending orders for a patient */
  pendingOrders: (userId: string) => `/api/admin/patients/${userId}/labs/orders/pending` as const,

  /** PATCH - Attach observations to existing order */
  attachObservations: (userId: string, orderId: string) =>
    `/api/admin/patients/${userId}/labs/orders/${orderId}/observations` as const,
} as const;

// ============================================================================
// ADMIN TRAINER ROUTES
// ============================================================================

/**
 * Admin trainer assignment routes.
 * Base path: /api/admin/trainers
 */
export const ADMIN_TRAINER_ROUTES = {
  /** GET - List all trainers (users with TRAINER or ADMIN role) */
  LIST: '/api/admin/trainers',

  /** POST - Create trainer assignment */
  ASSIGNMENTS: '/api/admin/trainer-assignments',

  /** DELETE - Remove trainer assignment */
  deleteAssignment: (id: string) => `/api/admin/trainer-assignments/${id}` as const,

  /** GET - Get client's trainer assignments */
  clientAssignments: (clientId: string) => `/api/admin/clients/${clientId}/trainer-assignments` as const,

  /** GET - Get primary trainer for a client */
  primaryTrainer: (clientId: string) => `/api/admin/clients/${clientId}/primary-trainer` as const,
} as const;

// ============================================================================
// ADMIN NUTRITION ROUTES
// ============================================================================

/**
 * Admin nutrition routes.
 * Base path: /api/admin/nutrition
 */
export const ADMIN_NUTRITION_ROUTES = {
  /** POST - Generate nutrition plan */
  GENERATE: '/api/admin/nutrition/generate',
} as const;

// ============================================================================
// AI ROUTES (used by admin)
// ============================================================================

/**
 * AI generation routes (admin-accessible).
 * Base path: /api/ai
 */
export const ADMIN_AI_ROUTES = {
  /** POST - Generate workout plan */
  GENERATE_WORKOUT_PLAN: '/api/ai/generate-workout-plan',
} as const;

// ============================================================================
// UPLOAD ROUTES (used by admin)
// ============================================================================

/**
 * File upload routes (admin-accessible).
 * Base path: /api/upload
 */
export const ADMIN_UPLOAD_ROUTES = {
  /** POST - Upload file */
  UPLOAD: '/api/upload',
} as const;

// ============================================================================
// ADMIN BILLING ANALYTICS ROUTES
// ============================================================================

/**
 * Admin billing analytics routes.
 * Base path: /api/admin/billing-analytics
 */
export const ADMIN_BILLING_ANALYTICS_ROUTES = {
  /** GET - Monthly Recurring Revenue */
  MRR: '/api/admin/billing-analytics/mrr',

  /** GET - Churn metrics */
  CHURN: '/api/admin/billing-analytics/churn',

  /** GET - Lifetime Value metrics */
  LTV: '/api/admin/billing-analytics/ltv',

  /** GET - Inventory analytics */
  INVENTORY: '/api/admin/billing-analytics/inventory',

  /** GET - Revenue over time */
  REVENUE: '/api/admin/billing-analytics/revenue',

  /** GET - Combined analytics summary */
  SUMMARY: '/api/admin/billing-analytics/summary',

  /** GET - List delinquent users */
  DELINQUENT_USERS: '/api/admin/billing-analytics/delinquent-users',

  /** POST - Send delinquent user to collections */
  sendToCollections: (userId: string) =>
    `/api/admin/billing-analytics/delinquent-users/${userId}/collections` as const,

  /** PATCH - Update delinquency notes */
  updateDelinquencyNotes: (userId: string) =>
    `/api/admin/billing-analytics/delinquent-users/${userId}/notes` as const,

  /** GET - List payment disputes */
  DISPUTES: '/api/admin/billing-analytics/disputes',

  /** PATCH - Update dispute resolution */
  updateDisputeResolution: (disputeId: string) =>
    `/api/admin/billing-analytics/disputes/${disputeId}/resolution` as const,
} as const;

// ============================================================================
// ADMIN PAYMENT ROUTES
// ============================================================================

/**
 * Admin payment management routes.
 * Base path: /api/admin/payments
 */
export const ADMIN_PAYMENT_ROUTES = {
  /** GET - Stripe publishable key config */
  CONFIG: '/api/admin/payments/config',

  /** POST - Create SetupIntent for saving payment method */
  SETUP_INTENT: '/api/admin/payments/setup-intent',

  /** GET - List payment methods for user */
  paymentMethods: (userId: string) => `/api/admin/payments/payment-methods/${userId}` as const,

  /** POST - Attach payment method to user */
  attachPaymentMethod: (userId: string) => `/api/admin/payments/payment-methods/${userId}` as const,

  /** DELETE - Remove payment method */
  detachPaymentMethod: (userId: string, paymentMethodId: string) =>
    `/api/admin/payments/payment-methods/${userId}/${paymentMethodId}` as const,

  /** POST - Set default payment method */
  setDefaultPaymentMethod: (userId: string) =>
    `/api/admin/payments/payment-methods/${userId}/default` as const,

  /** POST - Collect one-time payment */
  COLLECT: '/api/admin/payments/collect',

  /** POST - Refund a payment */
  REFUND: '/api/admin/payments/refund',

  /** POST - Retry failed invoice payment */
  RETRY_INVOICE: '/api/admin/payments/retry-invoice',

  /** GET - Get payment history for user */
  history: (userId: string) => `/api/admin/payments/history/${userId}` as const,
} as const;

// ============================================================================
// ADMIN SUBSCRIPTION ROUTES
// ============================================================================

/**
 * Admin subscription management routes.
 * Base path: /api/admin/subscriptions
 */
export const ADMIN_SUBSCRIPTION_ROUTES = {
  /** GET - List subscriptions with optional filters */
  LIST: '/api/admin/subscriptions',

  /** POST - Create subscription */
  CREATE: '/api/admin/subscriptions',

  /** GET - Get subscription by ID */
  get: (id: string) => `/api/admin/subscriptions/${id}` as const,

  /** GET - Get user's active subscription */
  forUser: (userId: string) => `/api/admin/subscriptions/user/${userId}` as const,

  /** GET - Get early termination fee quote */
  terminationQuote: (id: string) => `/api/admin/subscriptions/${id}/early-termination-quote` as const,

  /** POST - Cancel subscription */
  cancel: (id: string) => `/api/admin/subscriptions/${id}/cancel` as const,

  /** PATCH - Pause subscription */
  pause: (id: string) => `/api/admin/subscriptions/${id}/pause` as const,

  /** PATCH - Resume subscription */
  resume: (id: string) => `/api/admin/subscriptions/${id}/resume` as const,

  /** PATCH - Change subscription tier */
  changeTier: (id: string) => `/api/admin/subscriptions/${id}/tier` as const,

  /** DELETE - Cancel scheduled tier change */
  cancelScheduledTierChange: (id: string) =>
    `/api/admin/subscriptions/${id}/scheduled-tier-change` as const,

  /** POST - Upload signed contract PDF */
  uploadContract: (id: string) => `/api/admin/subscriptions/${id}/contract` as const,

  /** GET - Get presigned URL for signed contract */
  getContract: (id: string) => `/api/admin/subscriptions/${id}/contract` as const,

  /** DELETE - Delete signed contract */
  deleteContract: (id: string) => `/api/admin/subscriptions/${id}/contract` as const,
} as const;

// ============================================================================
// ADMIN TERMINAL ROUTES
// ============================================================================

/**
 * Admin Stripe Terminal (POS) routes.
 * Base path: /api/admin/terminal
 */
export const ADMIN_TERMINAL_ROUTES = {
  /** GET - Check if Terminal is enabled */
  STATUS: '/api/admin/terminal/status',

  /** POST - Get connection token for reader auth */
  CONNECTION_TOKEN: '/api/admin/terminal/connection-token',

  /** POST - Create PaymentIntent for Terminal */
  PAYMENT_INTENT: '/api/admin/terminal/payment-intent',

  /** POST - Capture Terminal payment */
  capture: (paymentIntentId: string) => `/api/admin/terminal/capture/${paymentIntentId}` as const,

  /** POST - Cancel Terminal payment */
  cancel: (paymentIntentId: string) => `/api/admin/terminal/cancel/${paymentIntentId}` as const,

  /** GET - List all registered readers */
  READERS: '/api/admin/terminal/readers',

  /** GET - Get specific reader */
  reader: (readerId: string) => `/api/admin/terminal/readers/${readerId}` as const,

  /** POST - Process payment on reader */
  processPayment: (readerId: string) => `/api/admin/terminal/readers/${readerId}/process` as const,

  /** POST - Cancel current reader action */
  cancelReaderAction: (readerId: string) => `/api/admin/terminal/readers/${readerId}/cancel` as const,

  /** POST - Set reader display */
  setDisplay: (readerId: string) => `/api/admin/terminal/readers/${readerId}/display` as const,
} as const;

// ============================================================================
// ADMIN ORDER ROUTES
// ============================================================================

/**
 * Admin order management routes.
 * Base path: /api/admin/orders
 */
export const ADMIN_ORDER_ROUTES = {
  /** GET - List orders with optional filters */
  LIST: '/api/admin/orders',

  /** GET - Get order by ID */
  get: (id: string) => `/api/admin/orders/${id}` as const,

  /** PATCH - Update order fulfillment status */
  updateFulfillment: (id: string) => `/api/admin/orders/${id}/fulfillment` as const,

  /** POST - Cancel order */
  cancel: (id: string) => `/api/admin/orders/${id}/cancel` as const,
} as const;

// ============================================================================
// ADMIN INVENTORY ROUTES
// ============================================================================

/**
 * Admin inventory management routes.
 * Base path: /api/admin/inventory
 */
export const ADMIN_INVENTORY_ROUTES = {
  /** GET - List inventory for tracked products */
  LIST: '/api/admin/inventory',

  /** GET - Low stock products */
  LOW_STOCK: '/api/admin/inventory/low-stock',

  /** GET - Out of stock products */
  OUT_OF_STOCK: '/api/admin/inventory/out-of-stock',

  /** PATCH - Adjust inventory for a product */
  adjust: (productId: string) => `/api/admin/inventory/${productId}` as const,
} as const;

// ============================================================================
// ADMIN MOBILE SESSION ROUTES
// ============================================================================

/**
 * Admin mobile session management routes.
 * Base path: /api/admin/mobile-sessions
 */
export const ADMIN_MOBILE_SESSION_ROUTES = {
  /** GET - Get mobile session balance for user */
  balance: (userId: string) => `/api/admin/mobile-sessions/${userId}` as const,

  /** POST - Use a mobile session */
  use: (userId: string) => `/api/admin/mobile-sessions/${userId}/use` as const,

  /** POST - Create mobile session purchase */
  purchase: (userId: string) => `/api/admin/mobile-sessions/${userId}/purchase` as const,

  /** GET - Get mobile session usage history */
  history: (userId: string) => `/api/admin/mobile-sessions/${userId}/history` as const,

  /** GET - Get mobile session purchase history */
  purchases: (userId: string) => `/api/admin/mobile-sessions/${userId}/purchases` as const,
} as const;

// ============================================================================
// ADMIN AI CHAT ROUTES
// ============================================================================

/**
 * Admin AI chat routes for natural language analytics.
 * Base path: /api/admin/ai-chat
 */
export const ADMIN_AI_CHAT_ROUTES = {
  /** GET - List all AI chat sessions for current user */
  SESSIONS: '/api/admin/ai-chat/sessions',

  /** GET - Get specific AI chat session with all messages */
  session: (sessionId: string) => `/api/admin/ai-chat/sessions/${sessionId}` as const,

  /** POST - Send message in AI chat (creates session if needed) */
  SEND_MESSAGE: '/api/admin/ai-chat/messages',

  /** DELETE - Delete AI chat session */
  deleteSession: (sessionId: string) => `/api/admin/ai-chat/sessions/${sessionId}` as const,

  /** PATCH - Rename AI chat session */
  renameSession: (sessionId: string) => `/api/admin/ai-chat/sessions/${sessionId}` as const,
} as const;

// ============================================================================
// AGGREGATED ADMIN ROUTES
// ============================================================================

/**
 * Complete admin routes registry.
 * Use this for centralized access to all admin route definitions.
 *
 * @example
 * ```ts
 * import { ADMIN_API_ROUTES } from '@hollis/contracts/admin';
 *
 * // Static route
 * await apiClient.get(ADMIN_API_ROUTES.PATIENTS.LIST);
 *
 * // Dynamic route
 * await apiClient.get(ADMIN_API_ROUTES.PATIENTS.get(userId));
 * ```
 */
export const ADMIN_API_ROUTES = {
  PATIENTS: ADMIN_PATIENT_ROUTES,
  STRATEGIES: ADMIN_STRATEGY_ROUTES,
  CLINICIANS: ADMIN_CLINICIAN_ROUTES,
  PROVIDERS: ADMIN_PROVIDER_ROUTES,
  MESSAGES: ADMIN_MESSAGE_ROUTES,
  EXERCISES: ADMIN_EXERCISE_ROUTES,
  WORKOUTS: ADMIN_WORKOUT_ROUTES,
  BOOKINGS: ADMIN_BOOKING_ROUTES,
  SESSION_NOTES: ADMIN_SESSION_NOTES_ROUTES,
  REGISTRATIONS: ADMIN_REGISTRATION_ROUTES,
  ANALYTICS: ADMIN_ANALYTICS_ROUTES,
  USERS: ADMIN_USERS_ROUTES,
  LABS: ADMIN_LAB_ROUTES,
  NUTRITION: ADMIN_NUTRITION_ROUTES,
  AI: ADMIN_AI_ROUTES,
  UPLOAD: ADMIN_UPLOAD_ROUTES,
  TRAINERS: ADMIN_TRAINER_ROUTES,
  BILLING_ANALYTICS: ADMIN_BILLING_ANALYTICS_ROUTES,
  PAYMENTS: ADMIN_PAYMENT_ROUTES,
  SUBSCRIPTIONS: ADMIN_SUBSCRIPTION_ROUTES,
  TERMINAL: ADMIN_TERMINAL_ROUTES,
  ORDERS: ADMIN_ORDER_ROUTES,
  INVENTORY: ADMIN_INVENTORY_ROUTES,
  MOBILE_SESSIONS: ADMIN_MOBILE_SESSION_ROUTES,
  AI_CHAT: ADMIN_AI_CHAT_ROUTES,
} as const;
