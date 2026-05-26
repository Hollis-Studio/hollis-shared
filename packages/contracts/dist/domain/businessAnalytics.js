/**
 * @ai-context Business Analytics domain contracts | CRM dashboard schemas and types
 *
 * This module provides the canonical definitions for business analytics:
 * - Business daily snapshots for trend analysis
 * - Compliance scores for client tracking
 * - Trainer effectiveness metrics
 * - Lab pipeline tracking
 * - Lead/sales funnel pipeline
 * - At-risk client identification
 *
 * IMPORTANT: All business analytics types MUST be imported from here.
 *
 * deps: zod | consumers: server/src/services/*, web-admin/services/*
 */
import { z } from "zod";
import { emailSchema } from "../schemas/index.js";
import { createPaginatedListSchema } from "./pagination.js";
// ============================================================================
// LAB ORDER STATUS (Domain Constants Pattern)
// ============================================================================
/** Tuple of valid lab order status values (source of truth) */
export const LAB_ORDER_STATUSES = [
    "ORDERED",
    "KIT_SENT",
    "SAMPLE_RECEIVED",
    "RESULTS_PENDING",
    "RESULTS_REVIEWED",
    "RESULTS_PUBLISHED",
];
/** Zod schema for lab order status - derived from tuple */
export const LabOrderStatusSchema = z.enum(LAB_ORDER_STATUSES);
/** Constant object for lab order status comparisons */
export const LAB_ORDER_STATUS = {
    ORDERED: "ORDERED",
    KIT_SENT: "KIT_SENT",
    SAMPLE_RECEIVED: "SAMPLE_RECEIVED",
    RESULTS_PENDING: "RESULTS_PENDING",
    RESULTS_REVIEWED: "RESULTS_REVIEWED",
    RESULTS_PUBLISHED: "RESULTS_PUBLISHED",
};
/** Human-readable labels for lab order statuses */
export const LAB_ORDER_STATUS_LABELS = {
    ORDERED: "Ordered",
    KIT_SENT: "Kit Sent",
    SAMPLE_RECEIVED: "Sample Received",
    RESULTS_PENDING: "Results Pending",
    RESULTS_REVIEWED: "Review Pending",
    RESULTS_PUBLISHED: "Published",
};
/**
 * Type guard to check if a string is a valid lab order status
 */
export function isLabOrderStatus(value) {
    return LAB_ORDER_STATUSES.includes(value);
}
// ============================================================================
// LEAD STAGE (Domain Constants Pattern)
// ============================================================================
/** Tuple of valid lead stage values (source of truth) */
export const LEAD_STAGES = [
    "INQUIRY",
    "CONSULTATION_BOOKED",
    "CONSULTATION_COMPLETED",
    "PROPOSAL_SENT",
    "ACTIVE_MEMBER",
    "CHURNED",
];
/** Zod schema for lead stage - derived from tuple */
export const LeadStageSchema = z.enum(LEAD_STAGES);
/** Constant object for lead stage comparisons */
export const LEAD_STAGE = {
    INQUIRY: "INQUIRY",
    CONSULTATION_BOOKED: "CONSULTATION_BOOKED",
    CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED",
    PROPOSAL_SENT: "PROPOSAL_SENT",
    ACTIVE_MEMBER: "ACTIVE_MEMBER",
    CHURNED: "CHURNED",
};
/** Human-readable labels for lead stages */
export const LEAD_STAGE_LABELS = {
    INQUIRY: "Inquiry",
    CONSULTATION_BOOKED: "Consultation Booked",
    CONSULTATION_COMPLETED: "Consultation Completed",
    PROPOSAL_SENT: "Proposal Sent",
    ACTIVE_MEMBER: "Active Member",
    CHURNED: "Churned",
};
/**
 * Type guard to check if a string is a valid lead stage
 */
export function isLeadStage(value) {
    return LEAD_STAGES.includes(value);
}
// ============================================================================
// USER EVENT TYPE (Domain Constants Pattern)
// ============================================================================
/** Tuple of valid user event type values (source of truth) */
export const USER_EVENT_TYPES = [
    "WORKOUT_COMPLETED",
    "APPOINTMENT_CANCELLED",
    "APPOINTMENT_RESCHEDULED",
    "MEAL_LOGGED",
    "DAILY_CHECKIN_COMPLETED",
    "PLAN_PUBLISHED",
    "LAB_PANEL_CREATED",
    "LAB_PANEL_DELETED",
    "NOTIFICATION_SENT",
    "BILLING_DATE_CHANGED",
    "TIER_CHANGED",
    /** Partial refund received on a subscription invoice — flagged for admin review */
    "PARTIAL_REFUND_FLAGGED",
    /** SCA/3DS verification email sent for payment_intent.requires_action */
    "SCA_NOTIFICATION_SENT",
    /** SCA/3DS verification email sent for invoice.payment_action_required */
    "SCA_INVOICE_NOTIFICATION_SENT",
    /** Transactional email send failed — queued for retry or admin review */
    "EMAIL_SEND_FAILED",
    /** Trial-ending notification sent 3 days before trial end */
    "TRIAL_ENDING_NOTIFICATION_SENT",
];
/** Zod schema for user event type - derived from tuple */
export const UserEventTypeSchema = z.enum(USER_EVENT_TYPES);
/** Constant object for user event type comparisons */
export const USER_EVENT_TYPE = {
    WORKOUT_COMPLETED: "WORKOUT_COMPLETED",
    APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED",
    APPOINTMENT_RESCHEDULED: "APPOINTMENT_RESCHEDULED",
    MEAL_LOGGED: "MEAL_LOGGED",
    DAILY_CHECKIN_COMPLETED: "DAILY_CHECKIN_COMPLETED",
    PLAN_PUBLISHED: "PLAN_PUBLISHED",
    LAB_PANEL_CREATED: "LAB_PANEL_CREATED",
    LAB_PANEL_DELETED: "LAB_PANEL_DELETED",
    NOTIFICATION_SENT: "NOTIFICATION_SENT",
    BILLING_DATE_CHANGED: "BILLING_DATE_CHANGED",
    TIER_CHANGED: "TIER_CHANGED",
    /** Partial refund received on a subscription invoice — flagged for admin review */
    PARTIAL_REFUND_FLAGGED: "PARTIAL_REFUND_FLAGGED",
    /** SCA/3DS verification email sent for payment_intent.requires_action */
    SCA_NOTIFICATION_SENT: "SCA_NOTIFICATION_SENT",
    /** SCA/3DS verification email sent for invoice.payment_action_required */
    SCA_INVOICE_NOTIFICATION_SENT: "SCA_INVOICE_NOTIFICATION_SENT",
    /** Transactional email send failed — queued for retry or admin review */
    EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",
    /** Trial-ending notification sent 3 days before trial end */
    TRIAL_ENDING_NOTIFICATION_SENT: "TRIAL_ENDING_NOTIFICATION_SENT",
};
/** Human-readable labels for user event types */
export const USER_EVENT_TYPE_LABELS = {
    WORKOUT_COMPLETED: "Workout Completed",
    APPOINTMENT_CANCELLED: "Appointment Cancelled",
    APPOINTMENT_RESCHEDULED: "Appointment Rescheduled",
    MEAL_LOGGED: "Meal Logged",
    DAILY_CHECKIN_COMPLETED: "Daily Check-in Completed",
    PLAN_PUBLISHED: "Plan Published",
    LAB_PANEL_CREATED: "Lab Panel Created",
    LAB_PANEL_DELETED: "Lab Panel Deleted",
    NOTIFICATION_SENT: "Notification Sent",
    BILLING_DATE_CHANGED: "Billing Date Changed",
    TIER_CHANGED: "Tier Changed",
    PARTIAL_REFUND_FLAGGED: "Partial Refund Flagged",
    SCA_NOTIFICATION_SENT: "SCA Notification Sent",
    SCA_INVOICE_NOTIFICATION_SENT: "SCA Invoice Notification Sent",
    EMAIL_SEND_FAILED: "Email Send Failed",
    TRIAL_ENDING_NOTIFICATION_SENT: "Trial Ending Notification Sent",
};
/**
 * Type guard to check if a string is a valid user event type
 */
export function isUserEventType(value) {
    return USER_EVENT_TYPES.includes(value);
}
/**
 * Known event types should come from USER_EVENT_TYPES.
 *
 * We still allow uppercase SNAKE_CASE extensions for forward compatibility so
 * newly emitted events do not hard-break consumers before this tuple is updated.
 * Free-form strings remain intentionally blocked.
 */
export const ForwardCompatibleUserEventTypeSchema = z.union([
    UserEventTypeSchema,
    z
        .string()
        .trim()
        .min(1)
        .regex(/^[A-Z][A-Z0-9_]*$/, "type must be a known user event type or an uppercase SNAKE_CASE extension"),
]);
// ============================================================================
// USER EVENT CONTRACT
// ============================================================================
export const UserEventContractSchema = z.object({
    id: z.string(),
    userId: z.string(),
    type: ForwardCompatibleUserEventTypeSchema,
    occurredAt: z.string(),
    source: z.string().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
/**
 * Canonical paginated user events list response.
 * Shape: { data: UserEventContract[], pagination: PaginationMeta }
 */
export const UserEventListResponseSchema = createPaginatedListSchema(UserEventContractSchema);
// ============================================================================
// BUSINESS DAILY SNAPSHOT
// ============================================================================
/**
 * Schema for business daily snapshot
 */
export const BusinessDailySnapshotSchema = z.object({
    id: z.string().uuid(),
    date: z.string(), // ISO date string
    // Financials
    totalRevenue: z.coerce.number().min(0).default(0),
    mrr: z.coerce.number().min(0).default(0),
    // Engagement
    activeUsers: z.number().int().default(0),
    atRiskUsers: z.number().int().default(0),
    avgComplianceScore: z.number().min(0).max(100).default(0),
    // Clinical Outcomes
    /** @deprecated Prefer studioTotalKgLost. Kept for backward-compatible API responses. */
    studioTotalLbsLost: z.number().default(0),
    studioTotalKgLost: z.number().default(0),
    avgSleepScore: z.number().min(0).max(100).default(0),
    avgVo2MaxImprovement: z.number().default(0),
    clientsWithImprovedBiomarkers: z.number().int().default(0),
    createdAt: z.string(), // ISO timestamp
});
/**
 * Schema for trend data comparing snapshots
 */
export const BusinessSnapshotTrendSchema = z.object({
    current: BusinessDailySnapshotSchema,
    previous: BusinessDailySnapshotSchema.optional(),
    changes: z
        .object({
        mrr: z.number().optional(),
        mrrPercent: z.number().optional(),
        activeUsers: z.number().optional(),
        avgComplianceScore: z.number().optional(),
        /** @deprecated Prefer studioTotalKgLost. Kept for backward-compatible API responses. */
        studioTotalLbsLost: z.number().optional(),
        studioTotalKgLost: z.number().optional(),
    })
        .optional(),
});
// ============================================================================
// COMPLIANCE SCORE
// ============================================================================
/**
 * Schema for individual client compliance score
 */
export const ComplianceScoreSchema = z.object({
    userId: z.string(),
    score: z.number().min(0).max(100),
    nutritionLogging: z.number().min(0).max(100), // Percentage of days logged
    workoutCompletion: z.number().min(0).max(100), // Percentage of workouts completed
    wearableSync: z.number().min(0).max(100), // Percentage of days synced
    lastActivityDate: z.string().optional(), // ISO timestamp
});
/**
 * Schema for compliance heatmap data
 */
export const ComplianceHeatmapSchema = z.object({
    clients: z.array(z.object({
        userId: z.string(),
        name: z.string(),
        tier: z.string(),
        score: z.number().min(0).max(100),
        nutritionLogging: z.number().min(0).max(100),
        workoutCompletion: z.number().min(0).max(100),
        wearableSync: z.number().min(0).max(100),
        trend: z.enum(["improving", "stable", "declining"]),
        lastActivityDate: z.string().optional(),
    })),
    averageScore: z.number().min(0).max(100),
    totalClients: z.number().int(),
});
// ============================================================================
// TRAINER EFFECTIVENESS
// ============================================================================
/**
 * Schema for trainer effectiveness metrics
 */
export const TrainerEffectivenessSchema = z.object({
    trainerId: z.string(),
    name: z.string(),
    clientCount: z.number().int().default(0),
    avgRetention: z.number().min(0).max(100).default(0), // Percentage
    avgGoalAchievement: z.number().min(0).max(100).default(0), // Percentage
    avgClientSatisfaction: z.number().min(0).max(5).optional(), // 1-5 stars
    totalSessionsCompleted: z.number().int().default(0),
    avgWeightLossPerClient: z.number().min(0).default(0), // In kg
});
/**
 * Schema for trainer leaderboard response
 */
export const TrainerLeaderboardSchema = z.object({
    trainers: z.array(TrainerEffectivenessSchema),
    totalTrainers: z.number().int(),
    avgClientCount: z.number(),
    avgRetention: z.number().min(0).max(100),
});
// ============================================================================
// LAB PIPELINE
// ============================================================================
/**
 * Schema for lab pipeline item
 */
export const LabPipelineItemSchema = z.object({
    labId: z.string().uuid(),
    clientId: z.string(),
    clientName: z.string(),
    testName: z.string(),
    panelCode: z.string(),
    status: LabOrderStatusSchema,
    orderedAt: z.string(), // ISO timestamp
    lastUpdatedAt: z.string(), // ISO timestamp
    daysInStatus: z.number().int().default(0),
    hasObservations: z.boolean().default(false),
    observationCount: z.number().int().default(0),
});
/**
 * Schema for lab pipeline response (Kanban-style grouped by status)
 */
export const LabPipelineSchema = z.object({
    ordered: z.array(LabPipelineItemSchema),
    kitSent: z.array(LabPipelineItemSchema),
    sampleReceived: z.array(LabPipelineItemSchema),
    resultsPending: z.array(LabPipelineItemSchema),
    resultsReviewed: z.array(LabPipelineItemSchema),
    totalCount: z.number().int(),
    avgDaysToCompletion: z.number().optional(),
});
// ============================================================================
// LEAD PIPELINE
// ============================================================================
/**
 * Schema for lead pipeline item
 */
export const LeadPipelineItemSchema = z.object({
    id: z.string().uuid(),
    email: emailSchema,
    name: z.string().nullable(),
    phone: z.string().nullable(),
    stage: LeadStageSchema,
    stageChangedAt: z.string(), // ISO timestamp
    source: z.string().nullable(),
    interestedTier: z.string().nullable(),
    referredByName: z.string().nullable(),
    consultationDate: z.string().nullable(), // ISO timestamp
    daysInPipeline: z.number().int(),
    daysInCurrentStage: z.number().int(),
    notes: z.string().nullable(),
    createdAt: z.string(), // ISO timestamp
});
export const LeadListParamsSchema = z.object({
    stage: LeadStageSchema.optional(),
    interestedTier: z.string().optional(),
    source: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
});
export const LeadListResponseSchema = z.object({
    leads: z.array(LeadPipelineItemSchema),
    pagination: z.object({
        page: z.number().int(),
        pages: z.number().int(),
        total: z.number().int(),
        limit: z.number().int(),
    }),
    stats: z.object({
        totalActive: z.number().int(),
        pipelineMrr: z.number().int(),
        byStage: z.record(z.string(), z.number().int()),
        conversionRate: z.number(),
    }),
});
/**
 * Schema for lead pipeline/sales funnel response
 */
export const SalesFunnelSchema = z.object({
    stages: z.object({
        inquiry: z.array(LeadPipelineItemSchema),
        consultationBooked: z.array(LeadPipelineItemSchema),
        consultationCompleted: z.array(LeadPipelineItemSchema),
        proposalSent: z.array(LeadPipelineItemSchema),
        activeMember: z.array(LeadPipelineItemSchema),
        churned: z.array(LeadPipelineItemSchema),
    }),
    counts: z.object({
        inquiry: z.number().int(),
        consultationBooked: z.number().int(),
        consultationCompleted: z.number().int(),
        proposalSent: z.number().int(),
        activeMember: z.number().int(),
        churned: z.number().int(),
        total: z.number().int(),
    }),
    conversionRates: z.object({
        inquiryToConsultation: z.number().min(0).max(100),
        consultationToProposal: z.number().min(0).max(100),
        proposalToMember: z.number().min(0).max(100),
        overallConversion: z.number().min(0).max(100),
    }),
});
// ============================================================================
// AT-RISK CLIENTS
// ============================================================================
/** Risk factor types for at-risk identification */
export const RISK_FACTORS = [
    "low_compliance",
    "no_recent_activity",
    "missed_appointments",
    "declining_engagement",
    "no_weight_progress",
    "expired_sessions",
    "sessions_expiring_soon",
    "no_wearable_sync",
    "low_nutrition_logging",
];
export const RiskFactorSchema = z.enum(RISK_FACTORS);
/** Human-readable labels for risk factors */
export const RISK_FACTOR_LABELS = {
    low_compliance: "Low Compliance Score",
    no_recent_activity: "No Recent Activity",
    missed_appointments: "Missed Appointments",
    declining_engagement: "Declining Engagement",
    no_weight_progress: "No Weight Progress",
    expired_sessions: "Expired Sessions",
    sessions_expiring_soon: "Sessions Expiring Soon",
    no_wearable_sync: "No Wearable Sync",
    low_nutrition_logging: "Low Nutrition Logging",
};
// ============================================================================
// TIER-AWARE CHURN RISK THRESHOLDS
// ============================================================================
/**
 * Churn risk levels
 */
export const CHURN_RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export const ChurnRiskLevelSchema = z.enum(CHURN_RISK_LEVELS);
export const CHURN_RISK_LEVEL = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL",
};
/**
 * Tier-specific thresholds for churn risk calculation (in days of inactivity)
 *
 * Concierge clients train 5x/week so gaps are more concerning
 * Essentials clients train 1x/week so longer gaps are expected
 */
export const TIER_CHURN_THRESHOLDS = {
    CONCIERGE: {
        MEDIUM: 2, // >2 days = medium risk (missed 2 expected sessions)
        HIGH: 4, // >4 days = high risk (missed a full week)
        CRITICAL: 7, // >7 days = critical (gone for nearly 2 weeks)
    },
    CORE: {
        MEDIUM: 4, // >4 days = medium risk
        HIGH: 7, // >7 days = high risk (missed 2 expected sessions)
        CRITICAL: 14, // >14 days = critical
    },
    ESSENTIALS: {
        MEDIUM: 7, // >7 days = medium risk (missed expected weekly session)
        HIGH: 14, // >14 days = high risk
        CRITICAL: 21, // >21 days = critical (3 weeks without activity)
    },
};
/**
 * Calculate churn risk level based on tier and days of inactivity
 * @param tier - User's membership tier
 * @param daysInactive - Days since last activity
 * @returns ChurnRiskLevel
 */
export function calculateChurnRiskLevel(tier, daysInactive) {
    const thresholds = TIER_CHURN_THRESHOLDS[tier];
    if (daysInactive > thresholds.CRITICAL)
        return CHURN_RISK_LEVEL.CRITICAL;
    if (daysInactive > thresholds.HIGH)
        return CHURN_RISK_LEVEL.HIGH;
    if (daysInactive > thresholds.MEDIUM)
        return CHURN_RISK_LEVEL.MEDIUM;
    return CHURN_RISK_LEVEL.LOW;
}
// ============================================================================
// CRM ANALYTICS (Retention, Churn, Revenue)
// ============================================================================
/**
 * Schema for retention cohort data
 * Tracks user retention over time by signup month
 */
export const RetentionCohortSchema = z.object({
    month: z.string(), // YYYY-MM format
    cohortSize: z.number().int(),
    retentionMonth1: z.number(), // Percentage retained after 1 month
    retentionMonth3: z.number(), // Percentage retained after 3 months
    retentionMonth6: z.number(), // Percentage retained after 6 months
    retentionMonth12: z.number(), // Percentage retained after 12 months
});
/**
 * Schema for individual churn risk assessment
 */
export const ChurnRiskSchema = z.object({
    patientId: z.string(),
    patientName: z.string(),
    lastLoginDate: z.string(),
    daysSinceLastLogin: z.number().int(),
    riskLevel: ChurnRiskLevelSchema,
    predictedChurnDate: z.string().optional(),
});
/**
 * Schema for revenue breakdown by membership tier
 */
export const RevenueTierSchema = z.object({
    tierName: z.string(),
    patientCount: z.number().int().min(0),
    monthlyRevenue: z.number().min(0),
    churnRate: z.number().min(0).max(100),
});
/**
 * Schema for comprehensive CRM analytics response
 * Used by admin dashboard for business intelligence
 */
export const CRMAnalyticsSchema = z.object({
    retentionCohorts: z.array(RetentionCohortSchema),
    churnRisks: z.array(ChurnRiskSchema),
    revenueByTier: z.array(RevenueTierSchema),
    totalActivePatients: z.number().int().min(0),
    averageEngagementScore: z.number().min(0).max(100),
});
/**
 * Schema for at-risk client
 */
export const AtRiskClientSchema = z.object({
    userId: z.string(),
    name: z.string(),
    email: emailSchema,
    tier: z.string(),
    riskFactors: z.array(RiskFactorSchema),
    complianceScore: z.number().min(0).max(100),
    daysSinceLastActivity: z.number().int(),
    lastActivityDate: z.string().nullable(), // ISO timestamp
    predictedChurnDate: z.string().optional(), // ISO timestamp
    assignedTrainerName: z.string().nullable(),
    notes: z.string().nullable(),
    // Metadata for sessions_expiring_soon risk factor
    expiringSessionsCount: z.number().int().optional(),
    expiringSessionsDays: z.number().int().optional(),
    expiringSessionsDate: z.string().optional(), // ISO timestamp
});
/**
 * Schema for at-risk clients response
 */
export const AtRiskClientsResponseSchema = z.object({
    clients: z.array(AtRiskClientSchema),
    totalAtRisk: z.number().int(),
    criticalCount: z.number().int(), // Clients with 3+ risk factors
    highCount: z.number().int(), // Clients with 2 risk factors
    moderateCount: z.number().int(), // Clients with 1 risk factor
});
// ============================================================================
// TRAINER ASSIGNMENT
// ============================================================================
/**
 * Schema for trainer assignment
 */
export const TrainerAssignmentSchema = z.object({
    id: z.string().uuid(),
    clientId: z.string(),
    trainerId: z.string(),
    trainerName: z.string(),
    assignedAt: z.string(), // ISO timestamp
    unassignedAt: z.string().nullable(),
    isPrimary: z.boolean().default(false),
});
/**
 * Schema for creating a trainer assignment
 */
export const CreateTrainerAssignmentSchema = z.object({
    clientId: z.string(),
    trainerId: z.string(),
    isPrimary: z.boolean().default(false),
});
// ============================================================================
// CLINICAL IMPACT
// ============================================================================
/**
 * Schema for clinical impact / population health improvements
 */
export const ClinicalImpactSchema = z.object({
    totalClients: z.number().int(),
    // Weight metrics (in metric - kg)
    avgWeightChange: z.number(), // Negative = loss
    clientsLosingWeight: z.number().int(),
    clientsGainingWeight: z.number().int(),
    clientsStable: z.number().int(),
    totalWeightLostKg: z.number(),
    // Biomarker improvements
    clientsWithImprovedA1C: z.number().int(),
    clientsWithImprovedCholesterol: z.number().int(),
    clientsWithImprovedBloodPressure: z.number().int(),
    clientsWithImprovedTestosterone: z.number().int(),
    // Fitness improvements
    avgVo2MaxImprovement: z.number(),
    avgStrengthImprovement: z.number(), // Percentage
    // Sleep/recovery
    avgSleepScoreImprovement: z.number(),
    clientsWithImprovedSleep: z.number().int(),
    // Period for comparison
    periodDays: z.number().int().default(30),
});
// ============================================================================
// TRAINING RELEVANT SUMMARY (Clinician → Trainer Data Handoff)
// ============================================================================
/**
 * Training limitation types that trainers need to know about
 * These are derived from clinical data but don't expose PHI
 */
export const TRAINING_LIMITATIONS = [
    "cardiovascular", // Heart rate restrictions, BP concerns
    "musculoskeletal", // Joint issues, injury recovery
    "respiratory", // Breathing limitations, asthma
    "metabolic", // Blood sugar management needs
    "neurological", // Balance, coordination considerations
    "recovery", // Post-surgery, post-illness restrictions
    "medication", // Exercise timing around medications
    "other", // Other considerations
];
export const TrainingLimitationSchema = z.enum(TRAINING_LIMITATIONS);
/** Human-readable labels for training limitations */
export const TRAINING_LIMITATION_LABELS = {
    cardiovascular: "Cardiovascular",
    musculoskeletal: "Musculoskeletal",
    respiratory: "Respiratory",
    metabolic: "Metabolic",
    neurological: "Neurological",
    recovery: "Recovery Period",
    medication: "Medication Timing",
    other: "Other",
};
/**
 * Schema for a single training limitation/recommendation
 */
export const TrainingLimitationDetailSchema = z.object({
    category: TrainingLimitationSchema,
    description: z.string(), // e.g., "Avoid overhead pressing - shoulder impingement"
    severity: z.enum(["caution", "avoid", "monitor"]),
    expiresAt: z.string().nullable(), // ISO timestamp - null means ongoing
    addedAt: z.string(), // ISO timestamp
    addedBy: z.string(), // Clinician name (not ID - trainers don't need that)
});
/**
 * Schema for training-relevant heart rate zones
 * Derived from clinical assessment but safe for trainers to see
 */
export const HeartRateZonesSchema = z.object({
    restingHR: z.number().int().optional(),
    maxHR: z.number().int().optional(),
    zone1: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
    zone2: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
    zone3: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
    zone4: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
    zone5: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
    notes: z.string().nullable(), // e.g., "Keep below zone 4 until cleared by cardiologist"
    updatedAt: z.string().optional(), // ISO timestamp
});
/**
 * Schema for training-relevant summary (safe for trainers to access)
 *
 * This contract bridges clinical data to training needs without exposing PHI.
 * Clinicians populate this; trainers consume it.
 *
 * DOES include: injury flags, movement limitations, HR zones, cleared activities
 * DOES NOT include: diagnoses, lab values, medications, care team notes
 */
export const TrainingRelevantSummarySchema = z.object({
    userId: z.string(),
    // Current limitations and considerations
    limitations: z.array(TrainingLimitationDetailSchema),
    // Heart rate training zones (if assessed)
    heartRateZones: HeartRateZonesSchema.nullable(),
    // Movement patterns to avoid or modify
    avoidMovements: z.array(z.string()), // e.g., ["overhead press", "running", "jumping"]
    // Cleared activities (positive list of what's safe)
    clearedActivities: z.array(z.string()), // e.g., ["walking", "swimming", "light resistance"]
    // General notes from clinician (training-relevant only, no PHI)
    clinicianNotes: z.string().nullable(),
    // Flags for trainer awareness
    requiresWarmupExtension: z.boolean().default(false),
    requiresCooldownExtension: z.boolean().default(false),
    requiresFrequentBreaks: z.boolean().default(false),
    requiresHRMonitoring: z.boolean().default(false),
    // Metadata
    lastUpdatedAt: z.string(), // ISO timestamp
    lastUpdatedBy: z.string(), // Clinician name
});
// ============================================================================
// TIME TO FIRST VICTORY
// ============================================================================
/**
 * Schema for time to first victory metric
 */
export const TimeToFirstVictorySchema = z.object({
    userId: z.string(),
    daysToFirstVictory: z.number().int().nullable(),
    victoryType: z.string().nullable(), // weight_loss, strength_pr, sleep_improvement, etc.
    victoryDate: z.string().nullable(), // ISO timestamp
    onboardingDate: z.string(), // ISO timestamp
});
// ============================================================================
// CREDIT UTILIZATION
// ============================================================================
/**
 * Schema for credit/session utilization rate
 */
export const CreditUtilizationSchema = z.object({
    userId: z.string(),
    totalCredits: z.number().int(),
    usedCredits: z.number().int(),
    remainingCredits: z.number().int(),
    utilizationRate: z.number().min(0).max(100), // Percentage
    periodStart: z.string(), // ISO timestamp
    periodEnd: z.string(), // ISO timestamp
});
// ============================================================================
// AI QUERY (Natural Language Analytics)
// ============================================================================
/**
 * Schema for AI analytics query request
 */
export const AIQueryRequestSchema = z.object({
    query: z
        .string()
        .min(1, "Query is required")
        .max(500, "Query must be 500 characters or less"),
});
/**
 * Schema for data points returned in AI query responses
 * Key-value pairs extracted from database queries
 */
export const AIQueryDataPointSchema = z.object({
    key: z.string(),
    value: z.string(),
});
/**
 * Schema for AI analytics query response
 */
export const AIQueryResponseSchema = z.object({
    /** The original query that was asked */
    query: z.string(),
    /** The AI-generated answer */
    answer: z.string(),
    /** Optional structured data points extracted from the query */
    dataPoints: z.array(AIQueryDataPointSchema).optional(),
    /** ISO timestamp when the response was generated */
    generatedAt: z.string(),
});
// ============================================================================
// AI CHAT SESSION (for Smart Assist conversational interface)
// ============================================================================
/** Message role in AI chat — matches Prisma AIChatRole enum (USER | ASSISTANT) */
export const AI_CHAT_ROLES = ["USER", "ASSISTANT"];
export const AIChatRoleSchema = z.enum(AI_CHAT_ROLES);
/** Supported file types for AI chat attachments */
export const AI_CHAT_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "text/csv",
    "text/markdown",
    "application/json",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
];
/**
 * Attachment in an AI chat message
 */
export const AIChatAttachmentSchema = z.object({
    /** Unique ID for the attachment */
    id: z.string(),
    /** Original filename */
    filename: z.string(),
    /** MIME type of the file */
    mimeType: z.string(),
    /** File size in bytes */
    size: z.number(),
    /** Base64 encoded file content (for sending) or URL (for retrieval) */
    data: z.string().optional(),
    /** Preview URL for images */
    previewUrl: z.string().optional(),
});
/**
 * Single message in an AI chat session
 */
export const AIChatMessageSchema = z.object({
    /** Unique ID for the message */
    id: z.string(),
    /** Session this message belongs to */
    sessionId: z.string(),
    /** Role of the message sender */
    role: AIChatRoleSchema,
    /** Message content (markdown for assistant responses) */
    content: z.string(),
    /** File attachments */
    attachments: z.array(AIChatAttachmentSchema).optional(),
    /** Data points extracted from AI response */
    dataPoints: z.array(AIQueryDataPointSchema).optional(),
    /** ISO timestamp when message was created */
    createdAt: z.string(),
});
/**
 * AI chat session metadata
 */
export const AIChatSessionSchema = z.object({
    /** Unique session ID */
    id: z.string(),
    /** User who owns this session */
    userId: z.string(),
    /** Session title (auto-generated from first message or user-provided) */
    title: z.string(),
    /** ISO timestamp when session was created */
    createdAt: z.string(),
    /** ISO timestamp when session was last updated */
    updatedAt: z.string(),
    /** Preview of the last message (truncated) */
    lastMessagePreview: z.string().optional(),
    /** Number of messages in the session */
    messageCount: z.number(),
});
/**
 * Full session with messages
 */
export const AIChatSessionWithMessagesSchema = AIChatSessionSchema.extend({
    messages: z.array(AIChatMessageSchema),
});
/**
 * Request to send a message in a chat session
 */
export const AIChatSendMessageRequestSchema = z.object({
    /** Session ID (omit for new session) */
    sessionId: z.string().optional(),
    /** Message content */
    content: z.string().min(1).max(2000),
    /** File attachments (base64 encoded) */
    attachments: z
        .array(z.object({
        filename: z.string(),
        mimeType: z.string(),
        base64: z.string(),
    }))
        .max(5)
        .optional(),
});
/**
 * Response from sending a message
 */
export const AIChatSendMessageResponseSchema = z.object({
    /** The session (created or existing) */
    session: AIChatSessionSchema,
    /** The user's message */
    userMessage: AIChatMessageSchema,
    /** The assistant's response */
    assistantMessage: AIChatMessageSchema,
});
/**
 * List sessions response — canonical paginated shape { data: AIChatSession[], pagination: {...} }
 */
export const AIChatSessionListSchema = createPaginatedListSchema(AIChatSessionSchema);
/**
 * Schema for referral tree node
 * Note: Zod schema validates the shape but cannot fully type recursive structures
 */
export const ReferralNodeSchema = z.lazy(() => z.object({
    id: z.string(),
    name: z.string(),
    email: emailSchema,
    tier: z.string().nullable(),
    isActiveMember: z.boolean(),
    directReferralCount: z.number().int(),
    totalReferralCount: z.number().int(),
    leadStage: LeadStageSchema.nullable(),
    joinedAt: z.string(),
    referrals: z.array(ReferralNodeSchema),
}));
/**
 * Schema for referral tree response
 */
export const ReferralTreeSchema = z.object({
    /** Root level referrers (VIPs with direct referrals) */
    roots: z.array(ReferralNodeSchema),
    /** Total number of referrers with at least 1 referral */
    totalReferrers: z.number().int(),
    /** VIP referrers (3+ direct referrals) */
    vipReferrers: z.array(z.object({
        id: z.string(),
        name: z.string(),
        directReferralCount: z.number().int(),
        totalReferralCount: z.number().int(),
        tier: z.string().nullable(),
    })),
    /** Max depth of referral chains */
    maxDepth: z.number().int(),
});
// ============================================================================
// DISPUTE ITEM
// ============================================================================
/**
 * A single Stripe chargeback/dispute record.
 * Runtime Zod schema for the DisputeItem interface defined in domain/analytics.ts.
 */
export const DisputeItemSchema = z.object({
    id: z.string(),
    stripeDisputeId: z.string(),
    stripeChargeId: z.string(),
    status: z.enum(["NEEDS_RESPONSE", "UNDER_REVIEW", "WON", "LOST"]),
    reason: z.string(),
    amount: z.number(),
    userId: z.string(),
    userName: z.string().nullable(),
    userEmail: z.string().nullable(),
    subscriptionId: z.string().nullable(),
    subscriptionTier: z.string().nullable(),
    subscriptionStatus: z.string().nullable(),
    accountSuspendedAt: z.string().nullable(),
    accountRestoredAt: z.string().nullable(),
    resolution: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
/**
 * Canonical paginated disputes response.
 * Shape: { data: DisputeItemContract[], pagination: PaginationMeta }
 */
export const DisputeListResponseSchema = createPaginatedListSchema(DisputeItemSchema);
// ============================================================================
// BILLING ANALYTICS RESPONSE SHAPES
// ============================================================================
/**
 * Revenue trend data point — one entry per granularity bucket (e.g. month).
 */
export const RevenueTrendDataPointSchema = z.object({
    date: z.string(),
    revenue: z.number(),
});
/**
 * Revenue trend response from the billing analytics endpoint.
 * Keyed by granularity (day/week/month).
 */
export const RevenueTrendResponseSchema = z.object({
    data: z.array(RevenueTrendDataPointSchema),
});
/**
 * Churn metrics response from the billing analytics endpoint.
 * Captures subscription cancellation / acquisition delta for a period.
 */
export const ChurnMetricsResponseSchema = z.object({
    churnRate: z.number(),
    canceledSubscriptions: z.number().int(),
    newSubscriptions: z.number().int(),
    netGrowth: z.number().int(),
});
/**
 * LTV breakdown by membership tier.
 */
export const LTVByTierSchema = z.object({
    tier: z.string(),
    averageLTVCents: z.number().int(),
    totalCustomers: z.number().int(),
});
/**
 * LTV metrics response from the billing analytics endpoint.
 * Amounts are in cents to avoid floating-point issues.
 */
export const LTVMetricsResponseSchema = z.object({
    overallAverageLTVCents: z.number().int(),
    overallAverageLifetimeMonths: z.number(),
    byTier: z.array(LTVByTierSchema),
});
//# sourceMappingURL=businessAnalytics.js.map