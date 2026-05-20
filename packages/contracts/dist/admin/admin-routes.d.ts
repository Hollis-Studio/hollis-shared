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
/**
 * Admin patient management routes.
 * Base path: /api/admin/patients
 */
export declare const ADMIN_PATIENT_ROUTES: {
    /** GET - List all patients */
    readonly LIST: "/api/admin/patients";
    /** GET - Get patient details by ID */
    readonly get: (userId: string) => `/api/admin/patients/${string}`;
    /** GET - Get patient compliance metrics */
    readonly compliance: (userId: string) => `/api/admin/patients/${string}/compliance`;
    /** GET - Get patient health progress */
    readonly healthProgress: (userId: string) => `/api/admin/patients/${string}/health-progress`;
    /** GET - Get patient health progress history */
    readonly healthProgressHistory: (userId: string) => `/api/admin/patients/${string}/health-progress/history`;
    /** POST - Assign clinician to patient */
    readonly assignClinician: (patientId: string) => `/api/admin/patients/${string}/assign-clinician`;
    /** GET - Get patient journal entries */
    readonly journal: (userId: string) => `/api/admin/patients/${string}/journal`;
    /** GET - Get patient events */
    readonly events: (userId: string) => `/api/admin/patients/${string}/events`;
    /** GET - Get patient health goals */
    readonly healthGoals: (userId: string) => `/api/admin/patients/${string}/health-goals`;
    /** PUT - Update patient health goal by metric key */
    readonly updateHealthGoal: (userId: string, metricKey: string) => `/api/admin/patients/${string}/health-goals/${string}`;
    /** DELETE - Reset patient health goal by metric key */
    readonly resetHealthGoal: (userId: string, metricKey: string) => `/api/admin/patients/${string}/health-goals/${string}`;
    /** GET - Get patient workouts */
    readonly workouts: (userId: string) => `/api/admin/patients/${string}/workouts`;
    /** DELETE - Delete patient workout by date */
    readonly deleteWorkout: (userId: string, date: string) => `/api/admin/patients/${string}/workouts/${string}`;
    /** GET - Get patient session notes */
    readonly sessionNotes: (userId: string) => `/api/admin/patients/${string}/session-notes`;
    /** GET - Get patient AI context */
    readonly aiContext: (userId: string) => `/api/admin/patients/${string}/ai-context`;
    /** GET - Get patient permanent notes */
    readonly permanentNotes: (userId: string) => `/api/admin/patients/${string}/permanent-notes`;
    /** POST - Create patient permanent note */
    readonly createPermanentNote: (userId: string) => `/api/admin/patients/${string}/permanent-notes`;
    /** PATCH - Update patient permanent note */
    readonly updatePermanentNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/permanent-notes/${string}`;
    /** DELETE - Delete patient permanent note */
    readonly deletePermanentNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/permanent-notes/${string}`;
    /** POST - Add patient clinical note */
    readonly addNote: (patientId: string) => `/api/admin/patients/${string}/notes`;
    /** PUT - Update patient clinical note */
    readonly updateNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/notes/${string}`;
    /** DELETE - Delete patient clinical note */
    readonly deleteNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/notes/${string}`;
    /** POST - Create lab report */
    readonly createLabReport: (userId: string) => `/api/admin/patients/${string}/labs/reports`;
    /** POST - Create DXA ingest for a patient */
    readonly createDxaResult: (userId: string) => `/api/admin/patients/${string}/dxa-results`;
    /** DELETE - Delete lab report */
    readonly deleteLabReport: (userId: string, reportId: string) => `/api/admin/patients/${string}/labs/reports/${string}`;
    /** GET - Get patient intake questionnaire */
    readonly intakeQuestionnaire: (userId: string) => `/api/admin/patients/${string}/intake-questionnaire`;
    /** POST - Submit client intake */
    readonly submitIntake: (userId: string) => `/api/admin/patients/${string}/intake`;
    /** GET - Fetch patient clinical intake v1 (admin-scoped read) */
    readonly intakeV1: (userId: string) => `/api/admin/patients/${string}/intake-v1`;
    /** PUT - Update patient profile */
    readonly updateProfile: (userId: string) => `/api/admin/patients/${string}/profile`;
    /** PUT - Update patient goals */
    readonly updateGoals: (userId: string) => `/api/admin/patients/${string}/goals`;
    /** PUT - Update patient admin controls */
    readonly updateAdminControls: (userId: string) => `/api/admin/patients/${string}/admin-controls`;
    /** POST - Archive (soft-delete) a patient */
    readonly archive: (userId: string) => `/api/admin/patients/${string}/archive`;
    /** PUT - Update patient daily metrics */
    readonly updateDailyMetrics: (userId: string, date: string) => `/api/admin/patients/${string}/daily-metrics/${string}`;
    /** GET - Unified health metrics summary (biometrics + goals merged) */
    readonly healthMetricsSummary: (userId: string) => `/api/admin/patients/${string}/health-metrics/summary`;
    /** GET - Paginated biometric history for a single metric (admin-scoped) */
    readonly biometricHistory: (userId: string) => `/api/admin/patients/${string}/biometrics`;
    /**
     * POST - Admin create/upsert a biometric reading for a patient.
     * Body includes patientId — no userId in URL (flat admin endpoint).
     * See POST /api/biometrics (biometricsRouter) with requireAdmin middleware.
     */
    readonly biometricCreate: () => "/api/biometrics";
    /** GET - Paginated list of wearable workout sessions for a patient */
    readonly wearableSessions: (userId: string) => `/api/admin/patients/${string}/wearable-sessions`;
    /** GET - Aggregated activity summary (bar chart data) for a patient */
    readonly wearableActivitySummary: (userId: string) => `/api/admin/patients/${string}/wearable-activity-summary`;
};
/**
 * Admin training strategy routes.
 * Base path: /api/admin/patients/:userId/strategies
 */
export declare const ADMIN_STRATEGY_ROUTES: {
    /** GET - List patient strategies */
    readonly list: (userId: string) => `/api/admin/patients/${string}/strategies`;
    /** POST - Create patient strategy */
    readonly create: (userId: string) => `/api/admin/patients/${string}/strategies`;
    /** GET - Get patient strategy by ID */
    readonly get: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}`;
    /** PUT - Update patient strategy */
    readonly update: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}`;
    /** DELETE - Delete patient strategy */
    readonly delete: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}`;
    /** PUT - Update strategy goal */
    readonly updateGoal: (userId: string, strategyId: string, goalId: string) => `/api/admin/patients/${string}/strategies/${string}/goals/${string}`;
    /** PUT - Update strategy progress */
    readonly updateProgress: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}/progress`;
    /** POST - Activate strategy phase */
    readonly activatePhase: (userId: string, strategyId: string, phaseId: string) => `/api/admin/patients/${string}/strategies/${string}/phases/${string}/activate`;
    /** POST - Complete strategy phase */
    readonly completePhase: (userId: string, strategyId: string, phaseId: string) => `/api/admin/patients/${string}/strategies/${string}/phases/${string}/complete`;
    /** POST - Add strategy goal */
    readonly addGoal: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}/goals`;
    /** DELETE - Delete strategy goal */
    readonly deleteGoal: (userId: string, strategyId: string, goalId: string) => `/api/admin/patients/${string}/strategies/${string}/goals/${string}`;
    /** POST - Sync strategy progress */
    readonly syncProgress: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}/sync`;
    /** POST - Fetch goal value */
    readonly fetchValue: (userId: string) => `/api/admin/patients/${string}/strategies/fetch-value`;
    /** POST - Generate strategy via SSE */
    readonly generate: (userId: string) => `/api/admin/patients/${string}/strategies/generate`;
    /** POST - Continue strategy generation after clarification */
    readonly continueGeneration: (userId: string) => `/api/admin/patients/${string}/strategies/generate/continue`;
};
/**
 * Admin clinician management routes.
 * Base path: /api/admin/clinicians
 */
export declare const ADMIN_CLINICIAN_ROUTES: {
    /** GET - List all clinicians */
    readonly LIST: "/api/admin/clinicians";
    /** GET - Get clinician availability */
    readonly availability: (clinicianId: string) => `/api/admin/clinicians/${string}/availability`;
    /** POST - Upsert clinician availability */
    readonly upsertAvailability: (clinicianId: string) => `/api/admin/clinicians/${string}/availability`;
};
/**
 * Admin provider schedule routes.
 * Base path: /api/admin/providers
 */
export declare const ADMIN_PROVIDER_ROUTES: {
    /** GET - Get provider schedule */
    readonly schedule: (providerId: string) => `/api/admin/providers/${string}/schedule`;
    /** PUT - Update provider schedule */
    readonly updateSchedule: (providerId: string) => `/api/admin/providers/${string}/schedule`;
};
/**
 * Admin messaging routes.
 * Base path: /api/admin/messages
 */
export declare const ADMIN_MESSAGE_ROUTES: {
    /** POST - Send message */
    readonly SEND: "/api/admin/messages";
    /** GET - Get user conversations */
    readonly conversations: (userId: string) => `/api/admin/messages/${string}/conversations`;
    /** GET - Get message thread */
    readonly thread: (userId: string, partnerId: string) => `/api/admin/messages/${string}/thread/${string}`;
    /** DELETE - Delete a message */
    readonly delete: (messageId: string) => `/api/admin/messages/${string}`;
    /** POST - Mark messages as read */
    readonly markRead: (userId: string) => `/api/admin/messages/${string}/mark-read`;
};
/**
 * Admin exercise management routes.
 * Base path: /api/admin/exercises
 */
export declare const ADMIN_EXERCISE_ROUTES: {
    /** GET - List exercises (with filters) */
    readonly LIST: "/api/admin/exercises";
    /** GET - Get exercise categories */
    readonly CATEGORIES: "/api/admin/exercises/categories";
    /** GET - Get exercise by ID */
    readonly get: (id: string) => `/api/admin/exercises/${string}`;
    /** POST - Create exercise */
    readonly CREATE: "/api/admin/exercises";
    /** PUT - Update exercise */
    readonly update: (id: string) => `/api/admin/exercises/${string}`;
    /** DELETE - Delete exercise */
    readonly delete: (id: string) => `/api/admin/exercises/${string}`;
};
/**
 * Admin appointment/booking management routes.
 * Base path: /api/admin/appointments
 */
export declare const ADMIN_BOOKING_ROUTES: {
    /** GET - List appointments with optional filters */
    readonly LIST: "/api/admin/appointments";
    /** GET - Get single appointment by ID */
    readonly get: (appointmentId: string) => `/api/admin/appointments/${string}`;
    /** POST - Create appointment for a patient */
    readonly CREATE: "/api/admin/appointments";
    /** PUT - Update appointment */
    readonly update: (appointmentId: string) => `/api/admin/appointments/${string}`;
    /** POST - Cancel appointment */
    readonly cancel: (appointmentId: string) => `/api/admin/appointments/${string}/cancel`;
};
/**
 * Admin workout management routes.
 * Base path: /api/admin/workouts
 */
export declare const ADMIN_WORKOUT_ROUTES: {
    /** POST - Upsert workout plan */
    readonly UPSERT: "/api/admin/workouts/upsert";
};
/**
 * Admin session notes routes.
 * Base path: /api/admin/session-notes
 */
export declare const ADMIN_SESSION_NOTES_ROUTES: {
    /** POST - Create session note */
    readonly CREATE: "/api/admin/session-notes";
    /** PUT - Update session note */
    readonly update: (noteId: string) => `/api/admin/session-notes/${string}`;
    /** DELETE - Delete session note */
    readonly delete: (noteId: string) => `/api/admin/session-notes/${string}`;
};
/**
 * Admin registration management routes.
 * Base path: /api/admin/registrations
 */
export declare const ADMIN_REGISTRATION_ROUTES: {
    /** GET - List registrations */
    readonly LIST: "/api/admin/registrations";
    /** POST - Create registration */
    readonly CREATE: "/api/admin/registrations";
    /** POST - Approve registration */
    readonly approve: (id: string) => `/api/admin/registrations/${string}/approve`;
    /** POST - Reject registration */
    readonly reject: (id: string) => `/api/admin/registrations/${string}/reject`;
    /** DELETE - Delete registration */
    readonly delete: (barcode: string) => `/api/admin/registrations/${string}`;
};
/**
 * Admin analytics routes.
 * Base path: /api/admin
 */
export declare const ADMIN_ANALYTICS_ROUTES: {
    /** GET - Get CRM analytics */
    readonly ANALYTICS: "/api/admin/analytics";
    /** GET - Get health progress overview */
    readonly HEALTH_PROGRESS_OVERVIEW: "/api/admin/health-progress/overview";
    /** GET - Latest snapshot + trend data */
    readonly BUSINESS_SNAPSHOT: "/api/admin/analytics/business-snapshot";
    /** GET - Population health improvements */
    readonly CLINICAL_IMPACT: "/api/admin/analytics/clinical-impact";
    /** GET - All clients with compliance scores */
    readonly COMPLIANCE_HEATMAP: "/api/admin/analytics/compliance-heatmap";
    /** GET - Trainers ranked by effectiveness */
    readonly TRAINER_LEADERBOARD: "/api/admin/analytics/trainer-leaderboard";
    /** GET - Lab orders by status (Kanban data) */
    readonly LAB_PIPELINE: "/api/admin/analytics/lab-pipeline";
    /** GET - Lead pipeline stages with counts */
    readonly SALES_FUNNEL: "/api/admin/analytics/sales-funnel";
    /** GET - Red flag watchlist */
    readonly AT_RISK_CLIENTS: "/api/admin/analytics/at-risk-clients";
    /** GET - Referral tree */
    readonly REFERRAL_TREE: "/api/admin/analytics/referral-tree";
    /** POST - AI-powered natural language analytics query */
    readonly AI_QUERY: "/api/admin/analytics/ai-query";
};
/**
 * Admin user search routes.
 * Base path: /api/admin/users
 */
export declare const ADMIN_USERS_ROUTES: {
    /** GET - Search users */
    readonly SEARCH: "/api/admin/users/search";
    /** POST - Admin-initiated MFA reset for locked-out users (requires step-up auth) */
    readonly resetMfa: (userId: string) => `/api/admin/users/${string}/mfa/reset`;
    /** GET - Get MFA status for a specific user */
    readonly mfaStatus: (userId: string) => `/api/admin/users/${string}/mfa/status`;
};
/**
 * Admin lab data routes.
 * Base path: /api/admin/labs (non-patient) or /api/admin/patients/:userId/labs (patient-scoped)
 */
export declare const ADMIN_LAB_ROUTES: {
    /** POST - Extract lab data from PDF */
    readonly EXTRACT: "/api/admin/labs/extract";
    /** POST - Create verified lab report for a patient */
    readonly reports: (userId: string) => `/api/admin/patients/${string}/labs/reports`;
    /** DELETE - Delete lab report for a patient */
    readonly deleteReport: (userId: string, reportId: string) => `/api/admin/patients/${string}/labs/reports/${string}`;
    /** GET - Search lab metric definitions */
    readonly METRIC_SEARCH: "/api/admin/labs/metrics/search";
    /** POST - Create lab metric definition */
    readonly METRIC_CREATE: "/api/admin/labs/metrics";
    /** Base path for metric governance operations */
    readonly METRICS: "/api/admin/labs/metrics";
    /** PATCH - Update lab order status */
    readonly status: (labId: string) => `/api/admin/labs/${string}/status`;
    /** GET - Get single lab order by ID (with observations) */
    readonly getOrder: (orderId: string) => `/api/admin/labs/orders/${string}`;
    /** DELETE - Delete lab order by ID */
    readonly deleteOrder: (orderId: string) => `/api/admin/labs/orders/${string}`;
    /** POST - Create lab order (without observations) */
    readonly createOrder: (userId: string) => `/api/admin/patients/${string}/labs/orders`;
    /** GET - Get pending orders for a patient */
    readonly pendingOrders: (userId: string) => `/api/admin/patients/${string}/labs/orders/pending`;
    /** PATCH - Attach observations to existing order */
    readonly attachObservations: (userId: string, orderId: string) => `/api/admin/patients/${string}/labs/orders/${string}/observations`;
};
/**
 * Admin DXA data routes.
 * Base path: /api/admin/dxa or /api/admin/patients/:userId/dxa-results
 */
export declare const ADMIN_DXA_ROUTES: {
    /** POST - Extract DXA data from a PDF/image without persisting it */
    readonly EXTRACT: "/api/admin/dxa/extract";
};
/**
 * Admin trainer assignment routes.
 * Base path: /api/admin/trainers
 */
export declare const ADMIN_TRAINER_ROUTES: {
    /** GET - List all trainers (users with TRAINER or ADMIN role) */
    readonly LIST: "/api/admin/trainers";
    /** POST - Create trainer assignment */
    readonly ASSIGNMENTS: "/api/admin/trainer-assignments";
    /** DELETE - Remove trainer assignment */
    readonly deleteAssignment: (id: string) => `/api/admin/trainer-assignments/${string}`;
    /** GET - Get client's trainer assignments */
    readonly clientAssignments: (clientId: string) => `/api/admin/clients/${string}/trainer-assignments`;
    /** GET - Get primary trainer for a client */
    readonly primaryTrainer: (clientId: string) => `/api/admin/clients/${string}/primary-trainer`;
};
/**
 * Admin nutrition routes.
 * Base path: /api/admin/nutrition
 */
export declare const ADMIN_NUTRITION_ROUTES: {
    /** POST - Generate nutrition plan */
    readonly GENERATE: "/api/admin/nutrition/generate";
};
/**
 * AI generation routes (admin-accessible).
 * Base path: /api/ai
 */
export declare const ADMIN_AI_ROUTES: {
    /** POST - Generate workout plan */
    readonly GENERATE_WORKOUT_PLAN: "/api/ai/generate-workout-plan";
};
/**
 * File upload routes (admin-accessible).
 * Base path: /api/upload
 */
export declare const ADMIN_UPLOAD_ROUTES: {
    /** POST - Upload file */
    readonly UPLOAD: "/api/upload";
};
/**
 * Admin billing analytics routes.
 * Base path: /api/admin/billing-analytics
 */
export declare const ADMIN_BILLING_ANALYTICS_ROUTES: {
    /** GET - Monthly Recurring Revenue */
    readonly MRR: "/api/admin/billing-analytics/mrr";
    /** GET - Churn metrics */
    readonly CHURN: "/api/admin/billing-analytics/churn";
    /** GET - Lifetime Value metrics */
    readonly LTV: "/api/admin/billing-analytics/ltv";
    /** GET - Inventory analytics */
    readonly INVENTORY: "/api/admin/billing-analytics/inventory";
    /** GET - Revenue over time */
    readonly REVENUE: "/api/admin/billing-analytics/revenue";
    /** GET - Combined analytics summary */
    readonly SUMMARY: "/api/admin/billing-analytics/summary";
    /** GET - List delinquent users */
    readonly DELINQUENT_USERS: "/api/admin/billing-analytics/delinquent-users";
    /** POST - Send delinquent user to collections */
    readonly sendToCollections: (userId: string) => `/api/admin/billing-analytics/delinquent-users/${string}/collections`;
    /** PATCH - Update delinquency notes */
    readonly updateDelinquencyNotes: (userId: string) => `/api/admin/billing-analytics/delinquent-users/${string}/notes`;
    /** GET - List payment disputes */
    readonly DISPUTES: "/api/admin/billing-analytics/disputes";
    /** PATCH - Update dispute resolution */
    readonly updateDisputeResolution: (disputeId: string) => `/api/admin/billing-analytics/disputes/${string}/resolution`;
};
/**
 * Admin payment management routes.
 * Base path: /api/admin/payments
 */
export declare const ADMIN_PAYMENT_ROUTES: {
    /** GET - Stripe publishable key config */
    readonly CONFIG: "/api/admin/payments/config";
    /** POST - Create SetupIntent for saving payment method */
    readonly SETUP_INTENT: "/api/admin/payments/setup-intent";
    /** GET - List payment methods for user */
    readonly paymentMethods: (userId: string) => `/api/admin/payments/payment-methods/${string}`;
    /** POST - Attach payment method to user */
    readonly attachPaymentMethod: (userId: string) => `/api/admin/payments/payment-methods/${string}`;
    /** DELETE - Remove payment method */
    readonly detachPaymentMethod: (userId: string, paymentMethodId: string) => `/api/admin/payments/payment-methods/${string}/${string}`;
    /** POST - Set default payment method */
    readonly setDefaultPaymentMethod: (userId: string) => `/api/admin/payments/payment-methods/${string}/default`;
    /** POST - Collect one-time payment */
    readonly COLLECT: "/api/admin/payments/collect";
    /** POST - Refund a payment */
    readonly REFUND: "/api/admin/payments/refund";
    /** POST - Retry failed invoice payment */
    readonly RETRY_INVOICE: "/api/admin/payments/retry-invoice";
    /** GET - Get payment history for user */
    readonly history: (userId: string) => `/api/admin/payments/history/${string}`;
};
/**
 * Admin subscription management routes.
 * Base path: /api/admin/subscriptions
 */
export declare const ADMIN_SUBSCRIPTION_ROUTES: {
    /** GET - List subscriptions with optional filters */
    readonly LIST: "/api/admin/subscriptions";
    /** POST - Create subscription */
    readonly CREATE: "/api/admin/subscriptions";
    /** GET - Get subscription by ID */
    readonly get: (id: string) => `/api/admin/subscriptions/${string}`;
    /** GET - Get user's active subscription */
    readonly forUser: (userId: string) => `/api/admin/subscriptions/user/${string}`;
    /** GET - Get early termination fee quote */
    readonly terminationQuote: (id: string) => `/api/admin/subscriptions/${string}/early-termination-quote`;
    /** POST - Cancel subscription */
    readonly cancel: (id: string) => `/api/admin/subscriptions/${string}/cancel`;
    /** PATCH - Pause subscription */
    readonly pause: (id: string) => `/api/admin/subscriptions/${string}/pause`;
    /** PATCH - Resume subscription */
    readonly resume: (id: string) => `/api/admin/subscriptions/${string}/resume`;
    /** PATCH - Change subscription tier */
    readonly changeTier: (id: string) => `/api/admin/subscriptions/${string}/tier`;
    /** DELETE - Cancel scheduled tier change */
    readonly cancelScheduledTierChange: (id: string) => `/api/admin/subscriptions/${string}/scheduled-tier-change`;
    /** POST - Upload signed contract PDF */
    readonly uploadContract: (id: string) => `/api/admin/subscriptions/${string}/contract`;
    /** GET - Get presigned URL for signed contract */
    readonly getContract: (id: string) => `/api/admin/subscriptions/${string}/contract`;
    /** DELETE - Delete signed contract */
    readonly deleteContract: (id: string) => `/api/admin/subscriptions/${string}/contract`;
};
/**
 * Admin Stripe Terminal (POS) routes.
 * Base path: /api/admin/terminal
 */
export declare const ADMIN_TERMINAL_ROUTES: {
    /** GET - Check if Terminal is enabled */
    readonly STATUS: "/api/admin/terminal/status";
    /** POST - Get connection token for reader auth */
    readonly CONNECTION_TOKEN: "/api/admin/terminal/connection-token";
    /** POST - Create PaymentIntent for Terminal */
    readonly PAYMENT_INTENT: "/api/admin/terminal/payment-intent";
    /** POST - Capture Terminal payment */
    readonly capture: (paymentIntentId: string) => `/api/admin/terminal/capture/${string}`;
    /** POST - Cancel Terminal payment */
    readonly cancel: (paymentIntentId: string) => `/api/admin/terminal/cancel/${string}`;
    /** GET - List all registered readers */
    readonly READERS: "/api/admin/terminal/readers";
    /** GET - Get specific reader */
    readonly reader: (readerId: string) => `/api/admin/terminal/readers/${string}`;
    /** POST - Process payment on reader */
    readonly processPayment: (readerId: string) => `/api/admin/terminal/readers/${string}/process`;
    /** POST - Cancel current reader action */
    readonly cancelReaderAction: (readerId: string) => `/api/admin/terminal/readers/${string}/cancel`;
    /** POST - Set reader display */
    readonly setDisplay: (readerId: string) => `/api/admin/terminal/readers/${string}/display`;
};
/**
 * Admin order management routes.
 * Base path: /api/admin/orders
 */
export declare const ADMIN_ORDER_ROUTES: {
    /** GET - List orders with optional filters */
    readonly LIST: "/api/admin/orders";
    /** GET - Get order by ID */
    readonly get: (id: string) => `/api/admin/orders/${string}`;
    /** PATCH - Update order fulfillment status */
    readonly updateFulfillment: (id: string) => `/api/admin/orders/${string}/fulfillment`;
    /** POST - Cancel order */
    readonly cancel: (id: string) => `/api/admin/orders/${string}/cancel`;
};
/**
 * Admin inventory management routes.
 * Base path: /api/admin/inventory
 */
export declare const ADMIN_INVENTORY_ROUTES: {
    /** GET - List inventory for tracked products */
    readonly LIST: "/api/admin/inventory";
    /** GET - Low stock products */
    readonly LOW_STOCK: "/api/admin/inventory/low-stock";
    /** GET - Out of stock products */
    readonly OUT_OF_STOCK: "/api/admin/inventory/out-of-stock";
    /** PATCH - Adjust inventory for a product */
    readonly adjust: (productId: string) => `/api/admin/inventory/${string}`;
};
/**
 * Admin mobile session management routes.
 * Base path: /api/admin/mobile-sessions
 */
export declare const ADMIN_MOBILE_SESSION_ROUTES: {
    /** GET - Get mobile session balance for user */
    readonly balance: (userId: string) => `/api/admin/mobile-sessions/${string}`;
    /** POST - Use a mobile session */
    readonly use: (userId: string) => `/api/admin/mobile-sessions/${string}/use`;
    /** POST - Create mobile session purchase */
    readonly purchase: (userId: string) => `/api/admin/mobile-sessions/${string}/purchase`;
    /** GET - Get mobile session usage history */
    readonly history: (userId: string) => `/api/admin/mobile-sessions/${string}/history`;
    /** GET - Get mobile session purchase history */
    readonly purchases: (userId: string) => `/api/admin/mobile-sessions/${string}/purchases`;
};
/**
 * Admin AI chat routes for natural language analytics.
 * Base path: /api/admin/ai-chat
 */
export declare const ADMIN_AI_CHAT_ROUTES: {
    /** GET - List all AI chat sessions for current user */
    readonly SESSIONS: "/api/admin/ai-chat/sessions";
    /** GET - Get specific AI chat session with all messages */
    readonly session: (sessionId: string) => `/api/admin/ai-chat/sessions/${string}`;
    /** POST - Send message in AI chat (creates session if needed) */
    readonly SEND_MESSAGE: "/api/admin/ai-chat/messages";
    /** DELETE - Delete AI chat session */
    readonly deleteSession: (sessionId: string) => `/api/admin/ai-chat/sessions/${string}`;
    /** PATCH - Rename AI chat session */
    readonly renameSession: (sessionId: string) => `/api/admin/ai-chat/sessions/${string}`;
};
/**
 * Admin task management routes.
 * Base path: /api/admin/tasks
 */
export declare const ADMIN_TASK_ROUTES: {
    /** GET - List pending/in-progress admin tasks */
    readonly LIST: "/api/admin/tasks";
    /** GET - Get a single admin task by ID */
    readonly detail: (taskId: string) => `/api/admin/tasks/${string}`;
    /** POST - Resolve an admin task */
    readonly resolve: (taskId: string) => `/api/admin/tasks/${string}/resolve`;
    /** POST - Dismiss an admin task */
    readonly dismiss: (taskId: string) => `/api/admin/tasks/${string}/dismiss`;
    /** POST - Assign an admin task */
    readonly assign: (taskId: string) => `/api/admin/tasks/${string}/assign`;
};
/**
 * Admin lead pipeline routes.
 * Base path: /api/admin/leads
 */
export declare const ADMIN_LEADS_ROUTES: {
    /** GET - List leads with optional filters */
    readonly LIST: "/api/admin/leads";
    /** PATCH - Update lead stage */
    readonly updateStage: (id: string) => `/api/admin/leads/${string}/stage`;
};
/**
 * Admin consent / legal document signing routes.
 * Base path: /api/admin/consent
 */
export declare const ADMIN_CONSENT_ROUTES: {
    /** POST - Submit all signed documents for a user (atomic) */
    readonly SUBMIT: "/api/admin/consent";
    /** GET - List consent records for a user (admin audit) */
    readonly list: (userId: string) => `/api/admin/consent/${string}`;
    /** GET - Get presigned URL for composite consent PDF */
    readonly pdf: (userId: string) => `/api/admin/consent/${string}/pdf`;
};
/**
 * Admin marketing asset image routes.
 * Base path: /api/admin/marketing/images
 */
export declare const ADMIN_MARKETING_ROUTES: {
    /** GET - List all generated marketing images */
    readonly LIST_IMAGES: "/api/admin/marketing/images";
    /** POST - Generate a new marketing image via OpenAI */
    readonly GENERATE: "/api/admin/marketing/images";
    /** DELETE - Delete a marketing image by ID */
    readonly deleteImage: (imageId: string) => `/api/admin/marketing/images/${string}`;
};
/**
 * Complete admin routes registry.
 * Use this for centralized access to all admin route definitions.
 *
 * @example
 * ```ts
 * import { ADMIN_API_ROUTES } from '@hollis-studio/contracts/admin';
 *
 * // Static route
 * await apiClient.get(ADMIN_API_ROUTES.PATIENTS.LIST);
 *
 * // Dynamic route
 * await apiClient.get(ADMIN_API_ROUTES.PATIENTS.get(userId));
 * ```
 */
export declare const ADMIN_API_ROUTES: {
    readonly PATIENTS: {
        /** GET - List all patients */
        readonly LIST: "/api/admin/patients";
        /** GET - Get patient details by ID */
        readonly get: (userId: string) => `/api/admin/patients/${string}`;
        /** GET - Get patient compliance metrics */
        readonly compliance: (userId: string) => `/api/admin/patients/${string}/compliance`;
        /** GET - Get patient health progress */
        readonly healthProgress: (userId: string) => `/api/admin/patients/${string}/health-progress`;
        /** GET - Get patient health progress history */
        readonly healthProgressHistory: (userId: string) => `/api/admin/patients/${string}/health-progress/history`;
        /** POST - Assign clinician to patient */
        readonly assignClinician: (patientId: string) => `/api/admin/patients/${string}/assign-clinician`;
        /** GET - Get patient journal entries */
        readonly journal: (userId: string) => `/api/admin/patients/${string}/journal`;
        /** GET - Get patient events */
        readonly events: (userId: string) => `/api/admin/patients/${string}/events`;
        /** GET - Get patient health goals */
        readonly healthGoals: (userId: string) => `/api/admin/patients/${string}/health-goals`;
        /** PUT - Update patient health goal by metric key */
        readonly updateHealthGoal: (userId: string, metricKey: string) => `/api/admin/patients/${string}/health-goals/${string}`;
        /** DELETE - Reset patient health goal by metric key */
        readonly resetHealthGoal: (userId: string, metricKey: string) => `/api/admin/patients/${string}/health-goals/${string}`;
        /** GET - Get patient workouts */
        readonly workouts: (userId: string) => `/api/admin/patients/${string}/workouts`;
        /** DELETE - Delete patient workout by date */
        readonly deleteWorkout: (userId: string, date: string) => `/api/admin/patients/${string}/workouts/${string}`;
        /** GET - Get patient session notes */
        readonly sessionNotes: (userId: string) => `/api/admin/patients/${string}/session-notes`;
        /** GET - Get patient AI context */
        readonly aiContext: (userId: string) => `/api/admin/patients/${string}/ai-context`;
        /** GET - Get patient permanent notes */
        readonly permanentNotes: (userId: string) => `/api/admin/patients/${string}/permanent-notes`;
        /** POST - Create patient permanent note */
        readonly createPermanentNote: (userId: string) => `/api/admin/patients/${string}/permanent-notes`;
        /** PATCH - Update patient permanent note */
        readonly updatePermanentNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/permanent-notes/${string}`;
        /** DELETE - Delete patient permanent note */
        readonly deletePermanentNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/permanent-notes/${string}`;
        /** POST - Add patient clinical note */
        readonly addNote: (patientId: string) => `/api/admin/patients/${string}/notes`;
        /** PUT - Update patient clinical note */
        readonly updateNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/notes/${string}`;
        /** DELETE - Delete patient clinical note */
        readonly deleteNote: (userId: string, noteId: string) => `/api/admin/patients/${string}/notes/${string}`;
        /** POST - Create lab report */
        readonly createLabReport: (userId: string) => `/api/admin/patients/${string}/labs/reports`;
        /** POST - Create DXA ingest for a patient */
        readonly createDxaResult: (userId: string) => `/api/admin/patients/${string}/dxa-results`;
        /** DELETE - Delete lab report */
        readonly deleteLabReport: (userId: string, reportId: string) => `/api/admin/patients/${string}/labs/reports/${string}`;
        /** GET - Get patient intake questionnaire */
        readonly intakeQuestionnaire: (userId: string) => `/api/admin/patients/${string}/intake-questionnaire`;
        /** POST - Submit client intake */
        readonly submitIntake: (userId: string) => `/api/admin/patients/${string}/intake`;
        /** GET - Fetch patient clinical intake v1 (admin-scoped read) */
        readonly intakeV1: (userId: string) => `/api/admin/patients/${string}/intake-v1`;
        /** PUT - Update patient profile */
        readonly updateProfile: (userId: string) => `/api/admin/patients/${string}/profile`;
        /** PUT - Update patient goals */
        readonly updateGoals: (userId: string) => `/api/admin/patients/${string}/goals`;
        /** PUT - Update patient admin controls */
        readonly updateAdminControls: (userId: string) => `/api/admin/patients/${string}/admin-controls`;
        /** POST - Archive (soft-delete) a patient */
        readonly archive: (userId: string) => `/api/admin/patients/${string}/archive`;
        /** PUT - Update patient daily metrics */
        readonly updateDailyMetrics: (userId: string, date: string) => `/api/admin/patients/${string}/daily-metrics/${string}`;
        /** GET - Unified health metrics summary (biometrics + goals merged) */
        readonly healthMetricsSummary: (userId: string) => `/api/admin/patients/${string}/health-metrics/summary`;
        /** GET - Paginated biometric history for a single metric (admin-scoped) */
        readonly biometricHistory: (userId: string) => `/api/admin/patients/${string}/biometrics`;
        /**
         * POST - Admin create/upsert a biometric reading for a patient.
         * Body includes patientId — no userId in URL (flat admin endpoint).
         * See POST /api/biometrics (biometricsRouter) with requireAdmin middleware.
         */
        readonly biometricCreate: () => "/api/biometrics";
        /** GET - Paginated list of wearable workout sessions for a patient */
        readonly wearableSessions: (userId: string) => `/api/admin/patients/${string}/wearable-sessions`;
        /** GET - Aggregated activity summary (bar chart data) for a patient */
        readonly wearableActivitySummary: (userId: string) => `/api/admin/patients/${string}/wearable-activity-summary`;
    };
    readonly STRATEGIES: {
        /** GET - List patient strategies */
        readonly list: (userId: string) => `/api/admin/patients/${string}/strategies`;
        /** POST - Create patient strategy */
        readonly create: (userId: string) => `/api/admin/patients/${string}/strategies`;
        /** GET - Get patient strategy by ID */
        readonly get: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}`;
        /** PUT - Update patient strategy */
        readonly update: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}`;
        /** DELETE - Delete patient strategy */
        readonly delete: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}`;
        /** PUT - Update strategy goal */
        readonly updateGoal: (userId: string, strategyId: string, goalId: string) => `/api/admin/patients/${string}/strategies/${string}/goals/${string}`;
        /** PUT - Update strategy progress */
        readonly updateProgress: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}/progress`;
        /** POST - Activate strategy phase */
        readonly activatePhase: (userId: string, strategyId: string, phaseId: string) => `/api/admin/patients/${string}/strategies/${string}/phases/${string}/activate`;
        /** POST - Complete strategy phase */
        readonly completePhase: (userId: string, strategyId: string, phaseId: string) => `/api/admin/patients/${string}/strategies/${string}/phases/${string}/complete`;
        /** POST - Add strategy goal */
        readonly addGoal: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}/goals`;
        /** DELETE - Delete strategy goal */
        readonly deleteGoal: (userId: string, strategyId: string, goalId: string) => `/api/admin/patients/${string}/strategies/${string}/goals/${string}`;
        /** POST - Sync strategy progress */
        readonly syncProgress: (userId: string, strategyId: string) => `/api/admin/patients/${string}/strategies/${string}/sync`;
        /** POST - Fetch goal value */
        readonly fetchValue: (userId: string) => `/api/admin/patients/${string}/strategies/fetch-value`;
        /** POST - Generate strategy via SSE */
        readonly generate: (userId: string) => `/api/admin/patients/${string}/strategies/generate`;
        /** POST - Continue strategy generation after clarification */
        readonly continueGeneration: (userId: string) => `/api/admin/patients/${string}/strategies/generate/continue`;
    };
    readonly CLINICIANS: {
        /** GET - List all clinicians */
        readonly LIST: "/api/admin/clinicians";
        /** GET - Get clinician availability */
        readonly availability: (clinicianId: string) => `/api/admin/clinicians/${string}/availability`;
        /** POST - Upsert clinician availability */
        readonly upsertAvailability: (clinicianId: string) => `/api/admin/clinicians/${string}/availability`;
    };
    readonly PROVIDERS: {
        /** GET - Get provider schedule */
        readonly schedule: (providerId: string) => `/api/admin/providers/${string}/schedule`;
        /** PUT - Update provider schedule */
        readonly updateSchedule: (providerId: string) => `/api/admin/providers/${string}/schedule`;
    };
    readonly MESSAGES: {
        /** POST - Send message */
        readonly SEND: "/api/admin/messages";
        /** GET - Get user conversations */
        readonly conversations: (userId: string) => `/api/admin/messages/${string}/conversations`;
        /** GET - Get message thread */
        readonly thread: (userId: string, partnerId: string) => `/api/admin/messages/${string}/thread/${string}`;
        /** DELETE - Delete a message */
        readonly delete: (messageId: string) => `/api/admin/messages/${string}`;
        /** POST - Mark messages as read */
        readonly markRead: (userId: string) => `/api/admin/messages/${string}/mark-read`;
    };
    readonly EXERCISES: {
        /** GET - List exercises (with filters) */
        readonly LIST: "/api/admin/exercises";
        /** GET - Get exercise categories */
        readonly CATEGORIES: "/api/admin/exercises/categories";
        /** GET - Get exercise by ID */
        readonly get: (id: string) => `/api/admin/exercises/${string}`;
        /** POST - Create exercise */
        readonly CREATE: "/api/admin/exercises";
        /** PUT - Update exercise */
        readonly update: (id: string) => `/api/admin/exercises/${string}`;
        /** DELETE - Delete exercise */
        readonly delete: (id: string) => `/api/admin/exercises/${string}`;
    };
    readonly WORKOUTS: {
        /** POST - Upsert workout plan */
        readonly UPSERT: "/api/admin/workouts/upsert";
    };
    readonly BOOKINGS: {
        /** GET - List appointments with optional filters */
        readonly LIST: "/api/admin/appointments";
        /** GET - Get single appointment by ID */
        readonly get: (appointmentId: string) => `/api/admin/appointments/${string}`;
        /** POST - Create appointment for a patient */
        readonly CREATE: "/api/admin/appointments";
        /** PUT - Update appointment */
        readonly update: (appointmentId: string) => `/api/admin/appointments/${string}`;
        /** POST - Cancel appointment */
        readonly cancel: (appointmentId: string) => `/api/admin/appointments/${string}/cancel`;
    };
    readonly SESSION_NOTES: {
        /** POST - Create session note */
        readonly CREATE: "/api/admin/session-notes";
        /** PUT - Update session note */
        readonly update: (noteId: string) => `/api/admin/session-notes/${string}`;
        /** DELETE - Delete session note */
        readonly delete: (noteId: string) => `/api/admin/session-notes/${string}`;
    };
    readonly REGISTRATIONS: {
        /** GET - List registrations */
        readonly LIST: "/api/admin/registrations";
        /** POST - Create registration */
        readonly CREATE: "/api/admin/registrations";
        /** POST - Approve registration */
        readonly approve: (id: string) => `/api/admin/registrations/${string}/approve`;
        /** POST - Reject registration */
        readonly reject: (id: string) => `/api/admin/registrations/${string}/reject`;
        /** DELETE - Delete registration */
        readonly delete: (barcode: string) => `/api/admin/registrations/${string}`;
    };
    readonly ANALYTICS: {
        /** GET - Get CRM analytics */
        readonly ANALYTICS: "/api/admin/analytics";
        /** GET - Get health progress overview */
        readonly HEALTH_PROGRESS_OVERVIEW: "/api/admin/health-progress/overview";
        /** GET - Latest snapshot + trend data */
        readonly BUSINESS_SNAPSHOT: "/api/admin/analytics/business-snapshot";
        /** GET - Population health improvements */
        readonly CLINICAL_IMPACT: "/api/admin/analytics/clinical-impact";
        /** GET - All clients with compliance scores */
        readonly COMPLIANCE_HEATMAP: "/api/admin/analytics/compliance-heatmap";
        /** GET - Trainers ranked by effectiveness */
        readonly TRAINER_LEADERBOARD: "/api/admin/analytics/trainer-leaderboard";
        /** GET - Lab orders by status (Kanban data) */
        readonly LAB_PIPELINE: "/api/admin/analytics/lab-pipeline";
        /** GET - Lead pipeline stages with counts */
        readonly SALES_FUNNEL: "/api/admin/analytics/sales-funnel";
        /** GET - Red flag watchlist */
        readonly AT_RISK_CLIENTS: "/api/admin/analytics/at-risk-clients";
        /** GET - Referral tree */
        readonly REFERRAL_TREE: "/api/admin/analytics/referral-tree";
        /** POST - AI-powered natural language analytics query */
        readonly AI_QUERY: "/api/admin/analytics/ai-query";
    };
    readonly USERS: {
        /** GET - Search users */
        readonly SEARCH: "/api/admin/users/search";
        /** POST - Admin-initiated MFA reset for locked-out users (requires step-up auth) */
        readonly resetMfa: (userId: string) => `/api/admin/users/${string}/mfa/reset`;
        /** GET - Get MFA status for a specific user */
        readonly mfaStatus: (userId: string) => `/api/admin/users/${string}/mfa/status`;
    };
    readonly LABS: {
        /** POST - Extract lab data from PDF */
        readonly EXTRACT: "/api/admin/labs/extract";
        /** POST - Create verified lab report for a patient */
        readonly reports: (userId: string) => `/api/admin/patients/${string}/labs/reports`;
        /** DELETE - Delete lab report for a patient */
        readonly deleteReport: (userId: string, reportId: string) => `/api/admin/patients/${string}/labs/reports/${string}`;
        /** GET - Search lab metric definitions */
        readonly METRIC_SEARCH: "/api/admin/labs/metrics/search";
        /** POST - Create lab metric definition */
        readonly METRIC_CREATE: "/api/admin/labs/metrics";
        /** Base path for metric governance operations */
        readonly METRICS: "/api/admin/labs/metrics";
        /** PATCH - Update lab order status */
        readonly status: (labId: string) => `/api/admin/labs/${string}/status`;
        /** GET - Get single lab order by ID (with observations) */
        readonly getOrder: (orderId: string) => `/api/admin/labs/orders/${string}`;
        /** DELETE - Delete lab order by ID */
        readonly deleteOrder: (orderId: string) => `/api/admin/labs/orders/${string}`;
        /** POST - Create lab order (without observations) */
        readonly createOrder: (userId: string) => `/api/admin/patients/${string}/labs/orders`;
        /** GET - Get pending orders for a patient */
        readonly pendingOrders: (userId: string) => `/api/admin/patients/${string}/labs/orders/pending`;
        /** PATCH - Attach observations to existing order */
        readonly attachObservations: (userId: string, orderId: string) => `/api/admin/patients/${string}/labs/orders/${string}/observations`;
    };
    readonly DXA: {
        /** POST - Extract DXA data from a PDF/image without persisting it */
        readonly EXTRACT: "/api/admin/dxa/extract";
    };
    readonly NUTRITION: {
        /** POST - Generate nutrition plan */
        readonly GENERATE: "/api/admin/nutrition/generate";
    };
    readonly AI: {
        /** POST - Generate workout plan */
        readonly GENERATE_WORKOUT_PLAN: "/api/ai/generate-workout-plan";
    };
    readonly UPLOAD: {
        /** POST - Upload file */
        readonly UPLOAD: "/api/upload";
    };
    readonly TRAINERS: {
        /** GET - List all trainers (users with TRAINER or ADMIN role) */
        readonly LIST: "/api/admin/trainers";
        /** POST - Create trainer assignment */
        readonly ASSIGNMENTS: "/api/admin/trainer-assignments";
        /** DELETE - Remove trainer assignment */
        readonly deleteAssignment: (id: string) => `/api/admin/trainer-assignments/${string}`;
        /** GET - Get client's trainer assignments */
        readonly clientAssignments: (clientId: string) => `/api/admin/clients/${string}/trainer-assignments`;
        /** GET - Get primary trainer for a client */
        readonly primaryTrainer: (clientId: string) => `/api/admin/clients/${string}/primary-trainer`;
    };
    readonly BILLING_ANALYTICS: {
        /** GET - Monthly Recurring Revenue */
        readonly MRR: "/api/admin/billing-analytics/mrr";
        /** GET - Churn metrics */
        readonly CHURN: "/api/admin/billing-analytics/churn";
        /** GET - Lifetime Value metrics */
        readonly LTV: "/api/admin/billing-analytics/ltv";
        /** GET - Inventory analytics */
        readonly INVENTORY: "/api/admin/billing-analytics/inventory";
        /** GET - Revenue over time */
        readonly REVENUE: "/api/admin/billing-analytics/revenue";
        /** GET - Combined analytics summary */
        readonly SUMMARY: "/api/admin/billing-analytics/summary";
        /** GET - List delinquent users */
        readonly DELINQUENT_USERS: "/api/admin/billing-analytics/delinquent-users";
        /** POST - Send delinquent user to collections */
        readonly sendToCollections: (userId: string) => `/api/admin/billing-analytics/delinquent-users/${string}/collections`;
        /** PATCH - Update delinquency notes */
        readonly updateDelinquencyNotes: (userId: string) => `/api/admin/billing-analytics/delinquent-users/${string}/notes`;
        /** GET - List payment disputes */
        readonly DISPUTES: "/api/admin/billing-analytics/disputes";
        /** PATCH - Update dispute resolution */
        readonly updateDisputeResolution: (disputeId: string) => `/api/admin/billing-analytics/disputes/${string}/resolution`;
    };
    readonly PAYMENTS: {
        /** GET - Stripe publishable key config */
        readonly CONFIG: "/api/admin/payments/config";
        /** POST - Create SetupIntent for saving payment method */
        readonly SETUP_INTENT: "/api/admin/payments/setup-intent";
        /** GET - List payment methods for user */
        readonly paymentMethods: (userId: string) => `/api/admin/payments/payment-methods/${string}`;
        /** POST - Attach payment method to user */
        readonly attachPaymentMethod: (userId: string) => `/api/admin/payments/payment-methods/${string}`;
        /** DELETE - Remove payment method */
        readonly detachPaymentMethod: (userId: string, paymentMethodId: string) => `/api/admin/payments/payment-methods/${string}/${string}`;
        /** POST - Set default payment method */
        readonly setDefaultPaymentMethod: (userId: string) => `/api/admin/payments/payment-methods/${string}/default`;
        /** POST - Collect one-time payment */
        readonly COLLECT: "/api/admin/payments/collect";
        /** POST - Refund a payment */
        readonly REFUND: "/api/admin/payments/refund";
        /** POST - Retry failed invoice payment */
        readonly RETRY_INVOICE: "/api/admin/payments/retry-invoice";
        /** GET - Get payment history for user */
        readonly history: (userId: string) => `/api/admin/payments/history/${string}`;
    };
    readonly SUBSCRIPTIONS: {
        /** GET - List subscriptions with optional filters */
        readonly LIST: "/api/admin/subscriptions";
        /** POST - Create subscription */
        readonly CREATE: "/api/admin/subscriptions";
        /** GET - Get subscription by ID */
        readonly get: (id: string) => `/api/admin/subscriptions/${string}`;
        /** GET - Get user's active subscription */
        readonly forUser: (userId: string) => `/api/admin/subscriptions/user/${string}`;
        /** GET - Get early termination fee quote */
        readonly terminationQuote: (id: string) => `/api/admin/subscriptions/${string}/early-termination-quote`;
        /** POST - Cancel subscription */
        readonly cancel: (id: string) => `/api/admin/subscriptions/${string}/cancel`;
        /** PATCH - Pause subscription */
        readonly pause: (id: string) => `/api/admin/subscriptions/${string}/pause`;
        /** PATCH - Resume subscription */
        readonly resume: (id: string) => `/api/admin/subscriptions/${string}/resume`;
        /** PATCH - Change subscription tier */
        readonly changeTier: (id: string) => `/api/admin/subscriptions/${string}/tier`;
        /** DELETE - Cancel scheduled tier change */
        readonly cancelScheduledTierChange: (id: string) => `/api/admin/subscriptions/${string}/scheduled-tier-change`;
        /** POST - Upload signed contract PDF */
        readonly uploadContract: (id: string) => `/api/admin/subscriptions/${string}/contract`;
        /** GET - Get presigned URL for signed contract */
        readonly getContract: (id: string) => `/api/admin/subscriptions/${string}/contract`;
        /** DELETE - Delete signed contract */
        readonly deleteContract: (id: string) => `/api/admin/subscriptions/${string}/contract`;
    };
    readonly TERMINAL: {
        /** GET - Check if Terminal is enabled */
        readonly STATUS: "/api/admin/terminal/status";
        /** POST - Get connection token for reader auth */
        readonly CONNECTION_TOKEN: "/api/admin/terminal/connection-token";
        /** POST - Create PaymentIntent for Terminal */
        readonly PAYMENT_INTENT: "/api/admin/terminal/payment-intent";
        /** POST - Capture Terminal payment */
        readonly capture: (paymentIntentId: string) => `/api/admin/terminal/capture/${string}`;
        /** POST - Cancel Terminal payment */
        readonly cancel: (paymentIntentId: string) => `/api/admin/terminal/cancel/${string}`;
        /** GET - List all registered readers */
        readonly READERS: "/api/admin/terminal/readers";
        /** GET - Get specific reader */
        readonly reader: (readerId: string) => `/api/admin/terminal/readers/${string}`;
        /** POST - Process payment on reader */
        readonly processPayment: (readerId: string) => `/api/admin/terminal/readers/${string}/process`;
        /** POST - Cancel current reader action */
        readonly cancelReaderAction: (readerId: string) => `/api/admin/terminal/readers/${string}/cancel`;
        /** POST - Set reader display */
        readonly setDisplay: (readerId: string) => `/api/admin/terminal/readers/${string}/display`;
    };
    readonly ORDERS: {
        /** GET - List orders with optional filters */
        readonly LIST: "/api/admin/orders";
        /** GET - Get order by ID */
        readonly get: (id: string) => `/api/admin/orders/${string}`;
        /** PATCH - Update order fulfillment status */
        readonly updateFulfillment: (id: string) => `/api/admin/orders/${string}/fulfillment`;
        /** POST - Cancel order */
        readonly cancel: (id: string) => `/api/admin/orders/${string}/cancel`;
    };
    readonly INVENTORY: {
        /** GET - List inventory for tracked products */
        readonly LIST: "/api/admin/inventory";
        /** GET - Low stock products */
        readonly LOW_STOCK: "/api/admin/inventory/low-stock";
        /** GET - Out of stock products */
        readonly OUT_OF_STOCK: "/api/admin/inventory/out-of-stock";
        /** PATCH - Adjust inventory for a product */
        readonly adjust: (productId: string) => `/api/admin/inventory/${string}`;
    };
    readonly MOBILE_SESSIONS: {
        /** GET - Get mobile session balance for user */
        readonly balance: (userId: string) => `/api/admin/mobile-sessions/${string}`;
        /** POST - Use a mobile session */
        readonly use: (userId: string) => `/api/admin/mobile-sessions/${string}/use`;
        /** POST - Create mobile session purchase */
        readonly purchase: (userId: string) => `/api/admin/mobile-sessions/${string}/purchase`;
        /** GET - Get mobile session usage history */
        readonly history: (userId: string) => `/api/admin/mobile-sessions/${string}/history`;
        /** GET - Get mobile session purchase history */
        readonly purchases: (userId: string) => `/api/admin/mobile-sessions/${string}/purchases`;
    };
    readonly AI_CHAT: {
        /** GET - List all AI chat sessions for current user */
        readonly SESSIONS: "/api/admin/ai-chat/sessions";
        /** GET - Get specific AI chat session with all messages */
        readonly session: (sessionId: string) => `/api/admin/ai-chat/sessions/${string}`;
        /** POST - Send message in AI chat (creates session if needed) */
        readonly SEND_MESSAGE: "/api/admin/ai-chat/messages";
        /** DELETE - Delete AI chat session */
        readonly deleteSession: (sessionId: string) => `/api/admin/ai-chat/sessions/${string}`;
        /** PATCH - Rename AI chat session */
        readonly renameSession: (sessionId: string) => `/api/admin/ai-chat/sessions/${string}`;
    };
    readonly TASKS: {
        /** GET - List pending/in-progress admin tasks */
        readonly LIST: "/api/admin/tasks";
        /** GET - Get a single admin task by ID */
        readonly detail: (taskId: string) => `/api/admin/tasks/${string}`;
        /** POST - Resolve an admin task */
        readonly resolve: (taskId: string) => `/api/admin/tasks/${string}/resolve`;
        /** POST - Dismiss an admin task */
        readonly dismiss: (taskId: string) => `/api/admin/tasks/${string}/dismiss`;
        /** POST - Assign an admin task */
        readonly assign: (taskId: string) => `/api/admin/tasks/${string}/assign`;
    };
    readonly LEADS: {
        /** GET - List leads with optional filters */
        readonly LIST: "/api/admin/leads";
        /** PATCH - Update lead stage */
        readonly updateStage: (id: string) => `/api/admin/leads/${string}/stage`;
    };
    readonly CONSENT: {
        /** POST - Submit all signed documents for a user (atomic) */
        readonly SUBMIT: "/api/admin/consent";
        /** GET - List consent records for a user (admin audit) */
        readonly list: (userId: string) => `/api/admin/consent/${string}`;
        /** GET - Get presigned URL for composite consent PDF */
        readonly pdf: (userId: string) => `/api/admin/consent/${string}/pdf`;
    };
    readonly MARKETING: {
        /** GET - List all generated marketing images */
        readonly LIST_IMAGES: "/api/admin/marketing/images";
        /** POST - Generate a new marketing image via OpenAI */
        readonly GENERATE: "/api/admin/marketing/images";
        /** DELETE - Delete a marketing image by ID */
        readonly deleteImage: (imageId: string) => `/api/admin/marketing/images/${string}`;
    };
};
//# sourceMappingURL=admin-routes.d.ts.map