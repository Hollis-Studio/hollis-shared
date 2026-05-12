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
    LIST: "/api/admin/patients",
    /** GET - Get patient details by ID */
    get: (userId) => `/api/admin/patients/${userId}`,
    /** GET - Get patient compliance metrics */
    compliance: (userId) => `/api/admin/patients/${userId}/compliance`,
    /** GET - Get patient health progress */
    healthProgress: (userId) => `/api/admin/patients/${userId}/health-progress`,
    /** GET - Get patient health progress history */
    healthProgressHistory: (userId) => `/api/admin/patients/${userId}/health-progress/history`,
    /** POST - Assign clinician to patient */
    assignClinician: (patientId) => `/api/admin/patients/${patientId}/assign-clinician`,
    /** GET - Get patient journal entries */
    journal: (userId) => `/api/admin/patients/${userId}/journal`,
    /** GET - Get patient events */
    events: (userId) => `/api/admin/patients/${userId}/events`,
    /** GET - Get patient health goals */
    healthGoals: (userId) => `/api/admin/patients/${userId}/health-goals`,
    /** PUT - Update patient health goal by metric key */
    updateHealthGoal: (userId, metricKey) => `/api/admin/patients/${userId}/health-goals/${metricKey}`,
    /** DELETE - Reset patient health goal by metric key */
    resetHealthGoal: (userId, metricKey) => `/api/admin/patients/${userId}/health-goals/${metricKey}`,
    /** GET - Get patient workouts */
    workouts: (userId) => `/api/admin/patients/${userId}/workouts`,
    /** DELETE - Delete patient workout by date */
    deleteWorkout: (userId, date) => `/api/admin/patients/${userId}/workouts/${date}`,
    /** GET - Get patient session notes */
    sessionNotes: (userId) => `/api/admin/patients/${userId}/session-notes`,
    /** GET - Get patient AI context */
    aiContext: (userId) => `/api/admin/patients/${userId}/ai-context`,
    /** GET - Get patient permanent notes */
    permanentNotes: (userId) => `/api/admin/patients/${userId}/permanent-notes`,
    /** POST - Create patient permanent note */
    createPermanentNote: (userId) => `/api/admin/patients/${userId}/permanent-notes`,
    /** PATCH - Update patient permanent note */
    updatePermanentNote: (userId, noteId) => `/api/admin/patients/${userId}/permanent-notes/${noteId}`,
    /** DELETE - Delete patient permanent note */
    deletePermanentNote: (userId, noteId) => `/api/admin/patients/${userId}/permanent-notes/${noteId}`,
    /** POST - Add patient clinical note */
    addNote: (patientId) => `/api/admin/patients/${patientId}/notes`,
    /** PUT - Update patient clinical note */
    updateNote: (userId, noteId) => `/api/admin/patients/${userId}/notes/${noteId}`,
    /** DELETE - Delete patient clinical note */
    deleteNote: (userId, noteId) => `/api/admin/patients/${userId}/notes/${noteId}`,
    /** POST - Create lab report */
    createLabReport: (userId) => `/api/admin/patients/${userId}/labs/reports`,
    /** POST - Create DXA ingest for a patient */
    createDxaResult: (userId) => `/api/admin/patients/${userId}/dxa-results`,
    /** DELETE - Delete lab report */
    deleteLabReport: (userId, reportId) => `/api/admin/patients/${userId}/labs/reports/${reportId}`,
    /** GET - Get patient intake questionnaire */
    intakeQuestionnaire: (userId) => `/api/admin/patients/${userId}/intake-questionnaire`,
    /** POST - Submit client intake */
    submitIntake: (userId) => `/api/admin/patients/${userId}/intake`,
    /** PUT - Update patient profile */
    updateProfile: (userId) => `/api/admin/patients/${userId}/profile`,
    /** PUT - Update patient goals */
    updateGoals: (userId) => `/api/admin/patients/${userId}/goals`,
    /** PUT - Update patient admin controls */
    updateAdminControls: (userId) => `/api/admin/patients/${userId}/admin-controls`,
    /** POST - Archive (soft-delete) a patient */
    archive: (userId) => `/api/admin/patients/${userId}/archive`,
    /** PUT - Update patient daily metrics */
    updateDailyMetrics: (userId, date) => `/api/admin/patients/${userId}/daily-metrics/${date}`,
    /** GET - Unified health metrics summary (biometrics + goals merged) */
    healthMetricsSummary: (userId) => `/api/admin/patients/${userId}/health-metrics/summary`,
    /** GET - Paginated biometric history for a single metric (admin-scoped) */
    biometricHistory: (userId) => `/api/admin/patients/${userId}/biometrics`,
    /**
     * POST - Admin create/upsert a biometric reading for a patient.
     * Body includes patientId — no userId in URL (flat admin endpoint).
     * See POST /api/biometrics (biometricsRouter) with requireAdmin middleware.
     */
    biometricCreate: () => `/api/biometrics`,
    /** GET - Paginated list of wearable workout sessions for a patient */
    wearableSessions: (userId) => `/api/admin/patients/${userId}/wearable-sessions`,
    /** GET - Aggregated activity summary (bar chart data) for a patient */
    wearableActivitySummary: (userId) => `/api/admin/patients/${userId}/wearable-activity-summary`,
};
// ============================================================================
// ADMIN STRATEGY ROUTES
// ============================================================================
/**
 * Admin training strategy routes.
 * Base path: /api/admin/patients/:userId/strategies
 */
export const ADMIN_STRATEGY_ROUTES = {
    /** GET - List patient strategies */
    list: (userId) => `/api/admin/patients/${userId}/strategies`,
    /** POST - Create patient strategy */
    create: (userId) => `/api/admin/patients/${userId}/strategies`,
    /** GET - Get patient strategy by ID */
    get: (userId, strategyId) => `/api/admin/patients/${userId}/strategies/${strategyId}`,
    /** PUT - Update patient strategy */
    update: (userId, strategyId) => `/api/admin/patients/${userId}/strategies/${strategyId}`,
    /** DELETE - Delete patient strategy */
    delete: (userId, strategyId) => `/api/admin/patients/${userId}/strategies/${strategyId}`,
    /** PUT - Update strategy goal */
    updateGoal: (userId, strategyId, goalId) => `/api/admin/patients/${userId}/strategies/${strategyId}/goals/${goalId}`,
    /** PUT - Update strategy progress */
    updateProgress: (userId, strategyId) => `/api/admin/patients/${userId}/strategies/${strategyId}/progress`,
    /** POST - Activate strategy phase */
    activatePhase: (userId, strategyId, phaseId) => `/api/admin/patients/${userId}/strategies/${strategyId}/phases/${phaseId}/activate`,
    /** POST - Complete strategy phase */
    completePhase: (userId, strategyId, phaseId) => `/api/admin/patients/${userId}/strategies/${strategyId}/phases/${phaseId}/complete`,
    /** POST - Add strategy goal */
    addGoal: (userId, strategyId) => `/api/admin/patients/${userId}/strategies/${strategyId}/goals`,
    /** DELETE - Delete strategy goal */
    deleteGoal: (userId, strategyId, goalId) => `/api/admin/patients/${userId}/strategies/${strategyId}/goals/${goalId}`,
    /** POST - Sync strategy progress */
    syncProgress: (userId, strategyId) => `/api/admin/patients/${userId}/strategies/${strategyId}/sync`,
    /** POST - Fetch goal value */
    fetchValue: (userId) => `/api/admin/patients/${userId}/strategies/fetch-value`,
    /** POST - Generate strategy via SSE */
    generate: (userId) => `/api/admin/patients/${userId}/strategies/generate`,
    /** POST - Continue strategy generation after clarification */
    continueGeneration: (userId) => `/api/admin/patients/${userId}/strategies/generate/continue`,
};
// ============================================================================
// ADMIN CLINICIAN ROUTES
// ============================================================================
/**
 * Admin clinician management routes.
 * Base path: /api/admin/clinicians
 */
export const ADMIN_CLINICIAN_ROUTES = {
    /** GET - List all clinicians */
    LIST: "/api/admin/clinicians",
    /** GET - Get clinician availability */
    availability: (clinicianId) => `/api/admin/clinicians/${clinicianId}/availability`,
    /** POST - Upsert clinician availability */
    upsertAvailability: (clinicianId) => `/api/admin/clinicians/${clinicianId}/availability`,
};
// ============================================================================
// ADMIN PROVIDER ROUTES
// ============================================================================
/**
 * Admin provider schedule routes.
 * Base path: /api/admin/providers
 */
export const ADMIN_PROVIDER_ROUTES = {
    /** GET - Get provider schedule */
    schedule: (providerId) => `/api/admin/providers/${providerId}/schedule`,
    /** PUT - Update provider schedule */
    updateSchedule: (providerId) => `/api/admin/providers/${providerId}/schedule`,
};
// ============================================================================
// ADMIN MESSAGING ROUTES
// ============================================================================
/**
 * Admin messaging routes.
 * Base path: /api/admin/messages
 */
export const ADMIN_MESSAGE_ROUTES = {
    /** POST - Send message */
    SEND: "/api/admin/messages",
    /** GET - Get user conversations */
    conversations: (userId) => `/api/admin/messages/${userId}/conversations`,
    /** GET - Get message thread */
    thread: (userId, partnerId) => `/api/admin/messages/${userId}/thread/${partnerId}`,
    /** DELETE - Delete a message */
    delete: (messageId) => `/api/admin/messages/${messageId}`,
    /** POST - Mark messages as read */
    markRead: (userId) => `/api/admin/messages/${userId}/mark-read`,
};
// ============================================================================
// ADMIN EXERCISE ROUTES
// ============================================================================
/**
 * Admin exercise management routes.
 * Base path: /api/admin/exercises
 */
export const ADMIN_EXERCISE_ROUTES = {
    /** GET - List exercises (with filters) */
    LIST: "/api/admin/exercises",
    /** GET - Get exercise categories */
    CATEGORIES: "/api/admin/exercises/categories",
    /** GET - Get exercise by ID */
    get: (id) => `/api/admin/exercises/${id}`,
    /** POST - Create exercise */
    CREATE: "/api/admin/exercises",
    /** PUT - Update exercise */
    update: (id) => `/api/admin/exercises/${id}`,
    /** DELETE - Delete exercise */
    delete: (id) => `/api/admin/exercises/${id}`,
};
// ============================================================================
// ADMIN BOOKING ROUTES
// ============================================================================
/**
 * Admin appointment/booking management routes.
 * Base path: /api/admin/appointments
 */
export const ADMIN_BOOKING_ROUTES = {
    /** GET - List appointments with optional filters */
    LIST: "/api/admin/appointments",
    /** GET - Get single appointment by ID */
    get: (appointmentId) => `/api/admin/appointments/${appointmentId}`,
    /** POST - Create appointment for a patient */
    CREATE: "/api/admin/appointments",
    /** PUT - Update appointment */
    update: (appointmentId) => `/api/admin/appointments/${appointmentId}`,
    /** POST - Cancel appointment */
    cancel: (appointmentId) => `/api/admin/appointments/${appointmentId}/cancel`,
};
// ============================================================================
// ADMIN WORKOUT ROUTES
// ============================================================================
/**
 * Admin workout management routes.
 * Base path: /api/admin/workouts
 */
export const ADMIN_WORKOUT_ROUTES = {
    /** POST - Upsert workout plan */
    UPSERT: "/api/admin/workouts/upsert",
};
// ============================================================================
// ADMIN SESSION NOTES ROUTES
// ============================================================================
/**
 * Admin session notes routes.
 * Base path: /api/admin/session-notes
 */
export const ADMIN_SESSION_NOTES_ROUTES = {
    /** POST - Create session note */
    CREATE: "/api/admin/session-notes",
    /** PUT - Update session note */
    update: (noteId) => `/api/admin/session-notes/${noteId}`,
    /** DELETE - Delete session note */
    delete: (noteId) => `/api/admin/session-notes/${noteId}`,
};
// ============================================================================
// ADMIN REGISTRATION ROUTES
// ============================================================================
/**
 * Admin registration management routes.
 * Base path: /api/admin/registrations
 */
export const ADMIN_REGISTRATION_ROUTES = {
    /** GET - List registrations */
    LIST: "/api/admin/registrations",
    /** POST - Create registration */
    CREATE: "/api/admin/registrations",
    /** POST - Approve registration */
    approve: (id) => `/api/admin/registrations/${id}/approve`,
    /** POST - Reject registration */
    reject: (id) => `/api/admin/registrations/${id}/reject`,
    /** DELETE - Delete registration */
    delete: (barcode) => `/api/admin/registrations/${barcode}`,
};
// ============================================================================
// ADMIN ANALYTICS ROUTES
// ============================================================================
/**
 * Admin analytics routes.
 * Base path: /api/admin
 */
export const ADMIN_ANALYTICS_ROUTES = {
    /** GET - Get CRM analytics */
    ANALYTICS: "/api/admin/analytics",
    /** GET - Get health progress overview */
    HEALTH_PROGRESS_OVERVIEW: "/api/admin/health-progress/overview",
    /** GET - Latest snapshot + trend data */
    BUSINESS_SNAPSHOT: "/api/admin/analytics/business-snapshot",
    /** GET - Population health improvements */
    CLINICAL_IMPACT: "/api/admin/analytics/clinical-impact",
    /** GET - All clients with compliance scores */
    COMPLIANCE_HEATMAP: "/api/admin/analytics/compliance-heatmap",
    /** GET - Trainers ranked by effectiveness */
    TRAINER_LEADERBOARD: "/api/admin/analytics/trainer-leaderboard",
    /** GET - Lab orders by status (Kanban data) */
    LAB_PIPELINE: "/api/admin/analytics/lab-pipeline",
    /** GET - Lead pipeline stages with counts */
    SALES_FUNNEL: "/api/admin/analytics/sales-funnel",
    /** GET - Red flag watchlist */
    AT_RISK_CLIENTS: "/api/admin/analytics/at-risk-clients",
    /** GET - Referral tree */
    REFERRAL_TREE: "/api/admin/analytics/referral-tree",
    /** POST - AI-powered natural language analytics query */
    AI_QUERY: "/api/admin/analytics/ai-query",
};
// ============================================================================
// ADMIN USERS ROUTES
// ============================================================================
/**
 * Admin user search routes.
 * Base path: /api/admin/users
 */
export const ADMIN_USERS_ROUTES = {
    /** GET - Search users */
    SEARCH: "/api/admin/users/search",
    /** POST - Admin-initiated MFA reset for locked-out users (requires step-up auth) */
    resetMfa: (userId) => `/api/admin/users/${userId}/mfa/reset`,
    /** GET - Get MFA status for a specific user */
    mfaStatus: (userId) => `/api/admin/users/${userId}/mfa/status`,
};
// ============================================================================
// ADMIN LAB ROUTES
// ============================================================================
/**
 * Admin lab data routes.
 * Base path: /api/admin/labs (non-patient) or /api/admin/patients/:userId/labs (patient-scoped)
 */
export const ADMIN_LAB_ROUTES = {
    /** POST - Extract lab data from PDF */
    EXTRACT: "/api/admin/labs/extract",
    /** POST - Create verified lab report for a patient */
    reports: (userId) => `/api/admin/patients/${userId}/labs/reports`,
    /** DELETE - Delete lab report for a patient */
    deleteReport: (userId, reportId) => `/api/admin/patients/${userId}/labs/reports/${reportId}`,
    /** GET - Search lab metric definitions */
    METRIC_SEARCH: "/api/admin/labs/metrics/search",
    /** POST - Create lab metric definition */
    METRIC_CREATE: "/api/admin/labs/metrics",
    /** Base path for metric governance operations */
    METRICS: "/api/admin/labs/metrics",
    /** PATCH - Update lab order status */
    status: (labId) => `/api/admin/labs/${labId}/status`,
    // Order-First Workflow Routes
    /** GET - Get single lab order by ID (with observations) */
    getOrder: (orderId) => `/api/admin/labs/orders/${orderId}`,
    /** DELETE - Delete lab order by ID */
    deleteOrder: (orderId) => `/api/admin/labs/orders/${orderId}`,
    /** POST - Create lab order (without observations) */
    createOrder: (userId) => `/api/admin/patients/${userId}/labs/orders`,
    /** GET - Get pending orders for a patient */
    pendingOrders: (userId) => `/api/admin/patients/${userId}/labs/orders/pending`,
    /** PATCH - Attach observations to existing order */
    attachObservations: (userId, orderId) => `/api/admin/patients/${userId}/labs/orders/${orderId}/observations`,
};
// ============================================================================
// ADMIN DXA ROUTES
// ============================================================================
/**
 * Admin DXA data routes.
 * Base path: /api/admin/dxa or /api/admin/patients/:userId/dxa-results
 */
export const ADMIN_DXA_ROUTES = {
    /** POST - Extract DXA data from a PDF/image without persisting it */
    EXTRACT: "/api/admin/dxa/extract",
};
// ============================================================================
// ADMIN TRAINER ROUTES
// ============================================================================
/**
 * Admin trainer assignment routes.
 * Base path: /api/admin/trainers
 */
export const ADMIN_TRAINER_ROUTES = {
    /** GET - List all trainers (users with TRAINER or ADMIN role) */
    LIST: "/api/admin/trainers",
    /** POST - Create trainer assignment */
    ASSIGNMENTS: "/api/admin/trainer-assignments",
    /** DELETE - Remove trainer assignment */
    deleteAssignment: (id) => `/api/admin/trainer-assignments/${id}`,
    /** GET - Get client's trainer assignments */
    clientAssignments: (clientId) => `/api/admin/clients/${clientId}/trainer-assignments`,
    /** GET - Get primary trainer for a client */
    primaryTrainer: (clientId) => `/api/admin/clients/${clientId}/primary-trainer`,
};
// ============================================================================
// ADMIN NUTRITION ROUTES
// ============================================================================
/**
 * Admin nutrition routes.
 * Base path: /api/admin/nutrition
 */
export const ADMIN_NUTRITION_ROUTES = {
    /** POST - Generate nutrition plan */
    GENERATE: "/api/admin/nutrition/generate",
};
// ============================================================================
// AI ROUTES (used by admin)
// ============================================================================
/**
 * AI generation routes (admin-accessible).
 * Base path: /api/ai
 */
export const ADMIN_AI_ROUTES = {
    /** POST - Generate workout plan */
    GENERATE_WORKOUT_PLAN: "/api/ai/generate-workout-plan",
};
// ============================================================================
// UPLOAD ROUTES (used by admin)
// ============================================================================
/**
 * File upload routes (admin-accessible).
 * Base path: /api/upload
 */
export const ADMIN_UPLOAD_ROUTES = {
    /** POST - Upload file */
    UPLOAD: "/api/upload",
};
// ============================================================================
// ADMIN BILLING ANALYTICS ROUTES
// ============================================================================
/**
 * Admin billing analytics routes.
 * Base path: /api/admin/billing-analytics
 */
export const ADMIN_BILLING_ANALYTICS_ROUTES = {
    /** GET - Monthly Recurring Revenue */
    MRR: "/api/admin/billing-analytics/mrr",
    /** GET - Churn metrics */
    CHURN: "/api/admin/billing-analytics/churn",
    /** GET - Lifetime Value metrics */
    LTV: "/api/admin/billing-analytics/ltv",
    /** GET - Inventory analytics */
    INVENTORY: "/api/admin/billing-analytics/inventory",
    /** GET - Revenue over time */
    REVENUE: "/api/admin/billing-analytics/revenue",
    /** GET - Combined analytics summary */
    SUMMARY: "/api/admin/billing-analytics/summary",
    /** GET - List delinquent users */
    DELINQUENT_USERS: "/api/admin/billing-analytics/delinquent-users",
    /** POST - Send delinquent user to collections */
    sendToCollections: (userId) => `/api/admin/billing-analytics/delinquent-users/${userId}/collections`,
    /** PATCH - Update delinquency notes */
    updateDelinquencyNotes: (userId) => `/api/admin/billing-analytics/delinquent-users/${userId}/notes`,
    /** GET - List payment disputes */
    DISPUTES: "/api/admin/billing-analytics/disputes",
    /** PATCH - Update dispute resolution */
    updateDisputeResolution: (disputeId) => `/api/admin/billing-analytics/disputes/${disputeId}/resolution`,
};
// ============================================================================
// ADMIN PAYMENT ROUTES
// ============================================================================
/**
 * Admin payment management routes.
 * Base path: /api/admin/payments
 */
export const ADMIN_PAYMENT_ROUTES = {
    /** GET - Stripe publishable key config */
    CONFIG: "/api/admin/payments/config",
    /** POST - Create SetupIntent for saving payment method */
    SETUP_INTENT: "/api/admin/payments/setup-intent",
    /** GET - List payment methods for user */
    paymentMethods: (userId) => `/api/admin/payments/payment-methods/${userId}`,
    /** POST - Attach payment method to user */
    attachPaymentMethod: (userId) => `/api/admin/payments/payment-methods/${userId}`,
    /** DELETE - Remove payment method */
    detachPaymentMethod: (userId, paymentMethodId) => `/api/admin/payments/payment-methods/${userId}/${paymentMethodId}`,
    /** POST - Set default payment method */
    setDefaultPaymentMethod: (userId) => `/api/admin/payments/payment-methods/${userId}/default`,
    /** POST - Collect one-time payment */
    COLLECT: "/api/admin/payments/collect",
    /** POST - Refund a payment */
    REFUND: "/api/admin/payments/refund",
    /** POST - Retry failed invoice payment */
    RETRY_INVOICE: "/api/admin/payments/retry-invoice",
    /** GET - Get payment history for user */
    history: (userId) => `/api/admin/payments/history/${userId}`,
};
// ============================================================================
// ADMIN SUBSCRIPTION ROUTES
// ============================================================================
/**
 * Admin subscription management routes.
 * Base path: /api/admin/subscriptions
 */
export const ADMIN_SUBSCRIPTION_ROUTES = {
    /** GET - List subscriptions with optional filters */
    LIST: "/api/admin/subscriptions",
    /** POST - Create subscription */
    CREATE: "/api/admin/subscriptions",
    /** GET - Get subscription by ID */
    get: (id) => `/api/admin/subscriptions/${id}`,
    /** GET - Get user's active subscription */
    forUser: (userId) => `/api/admin/subscriptions/user/${userId}`,
    /** GET - Get early termination fee quote */
    terminationQuote: (id) => `/api/admin/subscriptions/${id}/early-termination-quote`,
    /** POST - Cancel subscription */
    cancel: (id) => `/api/admin/subscriptions/${id}/cancel`,
    /** PATCH - Pause subscription */
    pause: (id) => `/api/admin/subscriptions/${id}/pause`,
    /** PATCH - Resume subscription */
    resume: (id) => `/api/admin/subscriptions/${id}/resume`,
    /** PATCH - Change subscription tier */
    changeTier: (id) => `/api/admin/subscriptions/${id}/tier`,
    /** DELETE - Cancel scheduled tier change */
    cancelScheduledTierChange: (id) => `/api/admin/subscriptions/${id}/scheduled-tier-change`,
    /** POST - Upload signed contract PDF */
    uploadContract: (id) => `/api/admin/subscriptions/${id}/contract`,
    /** GET - Get presigned URL for signed contract */
    getContract: (id) => `/api/admin/subscriptions/${id}/contract`,
    /** DELETE - Delete signed contract */
    deleteContract: (id) => `/api/admin/subscriptions/${id}/contract`,
};
// ============================================================================
// ADMIN TERMINAL ROUTES
// ============================================================================
/**
 * Admin Stripe Terminal (POS) routes.
 * Base path: /api/admin/terminal
 */
export const ADMIN_TERMINAL_ROUTES = {
    /** GET - Check if Terminal is enabled */
    STATUS: "/api/admin/terminal/status",
    /** POST - Get connection token for reader auth */
    CONNECTION_TOKEN: "/api/admin/terminal/connection-token",
    /** POST - Create PaymentIntent for Terminal */
    PAYMENT_INTENT: "/api/admin/terminal/payment-intent",
    /** POST - Capture Terminal payment */
    capture: (paymentIntentId) => `/api/admin/terminal/capture/${paymentIntentId}`,
    /** POST - Cancel Terminal payment */
    cancel: (paymentIntentId) => `/api/admin/terminal/cancel/${paymentIntentId}`,
    /** GET - List all registered readers */
    READERS: "/api/admin/terminal/readers",
    /** GET - Get specific reader */
    reader: (readerId) => `/api/admin/terminal/readers/${readerId}`,
    /** POST - Process payment on reader */
    processPayment: (readerId) => `/api/admin/terminal/readers/${readerId}/process`,
    /** POST - Cancel current reader action */
    cancelReaderAction: (readerId) => `/api/admin/terminal/readers/${readerId}/cancel`,
    /** POST - Set reader display */
    setDisplay: (readerId) => `/api/admin/terminal/readers/${readerId}/display`,
};
// ============================================================================
// ADMIN ORDER ROUTES
// ============================================================================
/**
 * Admin order management routes.
 * Base path: /api/admin/orders
 */
export const ADMIN_ORDER_ROUTES = {
    /** GET - List orders with optional filters */
    LIST: "/api/admin/orders",
    /** GET - Get order by ID */
    get: (id) => `/api/admin/orders/${id}`,
    /** PATCH - Update order fulfillment status */
    updateFulfillment: (id) => `/api/admin/orders/${id}/fulfillment`,
    /** POST - Cancel order */
    cancel: (id) => `/api/admin/orders/${id}/cancel`,
};
// ============================================================================
// ADMIN INVENTORY ROUTES
// ============================================================================
/**
 * Admin inventory management routes.
 * Base path: /api/admin/inventory
 */
export const ADMIN_INVENTORY_ROUTES = {
    /** GET - List inventory for tracked products */
    LIST: "/api/admin/inventory",
    /** GET - Low stock products */
    LOW_STOCK: "/api/admin/inventory/low-stock",
    /** GET - Out of stock products */
    OUT_OF_STOCK: "/api/admin/inventory/out-of-stock",
    /** PATCH - Adjust inventory for a product */
    adjust: (productId) => `/api/admin/inventory/${productId}`,
};
// ============================================================================
// ADMIN MOBILE SESSION ROUTES
// ============================================================================
/**
 * Admin mobile session management routes.
 * Base path: /api/admin/mobile-sessions
 */
export const ADMIN_MOBILE_SESSION_ROUTES = {
    /** GET - Get mobile session balance for user */
    balance: (userId) => `/api/admin/mobile-sessions/${userId}`,
    /** POST - Use a mobile session */
    use: (userId) => `/api/admin/mobile-sessions/${userId}/use`,
    /** POST - Create mobile session purchase */
    purchase: (userId) => `/api/admin/mobile-sessions/${userId}/purchase`,
    /** GET - Get mobile session usage history */
    history: (userId) => `/api/admin/mobile-sessions/${userId}/history`,
    /** GET - Get mobile session purchase history */
    purchases: (userId) => `/api/admin/mobile-sessions/${userId}/purchases`,
};
// ============================================================================
// ADMIN AI CHAT ROUTES
// ============================================================================
/**
 * Admin AI chat routes for natural language analytics.
 * Base path: /api/admin/ai-chat
 */
export const ADMIN_AI_CHAT_ROUTES = {
    /** GET - List all AI chat sessions for current user */
    SESSIONS: "/api/admin/ai-chat/sessions",
    /** GET - Get specific AI chat session with all messages */
    session: (sessionId) => `/api/admin/ai-chat/sessions/${sessionId}`,
    /** POST - Send message in AI chat (creates session if needed) */
    SEND_MESSAGE: "/api/admin/ai-chat/messages",
    /** DELETE - Delete AI chat session */
    deleteSession: (sessionId) => `/api/admin/ai-chat/sessions/${sessionId}`,
    /** PATCH - Rename AI chat session */
    renameSession: (sessionId) => `/api/admin/ai-chat/sessions/${sessionId}`,
};
// ============================================================================
// ADMIN TASK ROUTES
// ============================================================================
/**
 * Admin task management routes.
 * Base path: /api/admin/tasks
 */
export const ADMIN_TASK_ROUTES = {
    /** GET - List pending/in-progress admin tasks */
    LIST: "/api/admin/tasks",
    /** GET - Get a single admin task by ID */
    detail: (taskId) => `/api/admin/tasks/${taskId}`,
    /** POST - Resolve an admin task */
    resolve: (taskId) => `/api/admin/tasks/${taskId}/resolve`,
    /** POST - Dismiss an admin task */
    dismiss: (taskId) => `/api/admin/tasks/${taskId}/dismiss`,
    /** POST - Assign an admin task */
    assign: (taskId) => `/api/admin/tasks/${taskId}/assign`,
};
// ============================================================================
// ADMIN LEADS ROUTES
// ============================================================================
/**
 * Admin lead pipeline routes.
 * Base path: /api/admin/leads
 */
export const ADMIN_LEADS_ROUTES = {
    /** GET - List leads with optional filters */
    LIST: "/api/admin/leads",
    /** PATCH - Update lead stage */
    updateStage: (id) => `/api/admin/leads/${id}/stage`,
};
// ============================================================================
// ADMIN CONSENT ROUTES
// ============================================================================
/**
 * Admin consent / legal document signing routes.
 * Base path: /api/admin/consent
 */
export const ADMIN_CONSENT_ROUTES = {
    /** POST - Submit all signed documents for a user (atomic) */
    SUBMIT: "/api/admin/consent",
    /** GET - List consent records for a user (admin audit) */
    list: (userId) => `/api/admin/consent/${userId}`,
    /** GET - Get presigned URL for composite consent PDF */
    pdf: (userId) => `/api/admin/consent/${userId}/pdf`,
};
// ============================================================================
// ADMIN MARKETING ROUTES
// ============================================================================
/**
 * Admin marketing asset image routes.
 * Base path: /api/admin/marketing/images
 */
export const ADMIN_MARKETING_ROUTES = {
    /** GET - List all generated marketing images */
    LIST_IMAGES: "/api/admin/marketing/images",
    /** POST - Generate a new marketing image via OpenAI */
    GENERATE: "/api/admin/marketing/images",
    /** DELETE - Delete a marketing image by ID */
    deleteImage: (imageId) => `/api/admin/marketing/images/${imageId}`,
};
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
    DXA: ADMIN_DXA_ROUTES,
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
    TASKS: ADMIN_TASK_ROUTES,
    LEADS: ADMIN_LEADS_ROUTES,
    CONSENT: ADMIN_CONSENT_ROUTES,
    MARKETING: ADMIN_MARKETING_ROUTES,
};
//# sourceMappingURL=admin-routes.js.map