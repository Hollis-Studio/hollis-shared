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
/** Tuple of valid lab order status values (source of truth) */
export declare const LAB_ORDER_STATUSES: readonly ["ORDERED", "KIT_SENT", "SAMPLE_RECEIVED", "RESULTS_PENDING", "RESULTS_REVIEWED", "RESULTS_PUBLISHED"];
/** Zod schema for lab order status - derived from tuple */
export declare const LabOrderStatusSchema: z.ZodEnum<{
    ORDERED: "ORDERED";
    KIT_SENT: "KIT_SENT";
    SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
    RESULTS_PENDING: "RESULTS_PENDING";
    RESULTS_REVIEWED: "RESULTS_REVIEWED";
    RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
}>;
export type LabOrderStatus = z.infer<typeof LabOrderStatusSchema>;
/** Constant object for lab order status comparisons */
export declare const LAB_ORDER_STATUS: {
    readonly ORDERED: "ORDERED";
    readonly KIT_SENT: "KIT_SENT";
    readonly SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
    readonly RESULTS_PENDING: "RESULTS_PENDING";
    readonly RESULTS_REVIEWED: "RESULTS_REVIEWED";
    readonly RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
};
/** Human-readable labels for lab order statuses */
export declare const LAB_ORDER_STATUS_LABELS: Record<LabOrderStatus, string>;
/**
 * Type guard to check if a string is a valid lab order status
 */
export declare function isLabOrderStatus(value: string): value is LabOrderStatus;
/** Tuple of valid lead stage values (source of truth) */
export declare const LEAD_STAGES: readonly ["INQUIRY", "CONSULTATION_BOOKED", "CONSULTATION_COMPLETED", "PROPOSAL_SENT", "ACTIVE_MEMBER", "CHURNED"];
/** Zod schema for lead stage - derived from tuple */
export declare const LeadStageSchema: z.ZodEnum<{
    INQUIRY: "INQUIRY";
    CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
    CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
    PROPOSAL_SENT: "PROPOSAL_SENT";
    ACTIVE_MEMBER: "ACTIVE_MEMBER";
    CHURNED: "CHURNED";
}>;
export type LeadStage = z.infer<typeof LeadStageSchema>;
/** Constant object for lead stage comparisons */
export declare const LEAD_STAGE: {
    readonly INQUIRY: LeadStage;
    readonly CONSULTATION_BOOKED: LeadStage;
    readonly CONSULTATION_COMPLETED: LeadStage;
    readonly PROPOSAL_SENT: LeadStage;
    readonly ACTIVE_MEMBER: LeadStage;
    readonly CHURNED: LeadStage;
};
/** Human-readable labels for lead stages */
export declare const LEAD_STAGE_LABELS: Record<LeadStage, string>;
/**
 * Type guard to check if a string is a valid lead stage
 */
export declare function isLeadStage(value: string): value is LeadStage;
/** Tuple of valid user event type values (source of truth) */
export declare const USER_EVENT_TYPES: readonly ["WORKOUT_COMPLETED", "APPOINTMENT_CANCELLED", "APPOINTMENT_RESCHEDULED", "MEAL_LOGGED", "DAILY_CHECKIN_COMPLETED", "PLAN_PUBLISHED", "LAB_PANEL_CREATED", "LAB_PANEL_DELETED", "NOTIFICATION_SENT", "BILLING_DATE_CHANGED", "TIER_CHANGED", "PARTIAL_REFUND_FLAGGED", "SCA_NOTIFICATION_SENT", "SCA_INVOICE_NOTIFICATION_SENT", "EMAIL_SEND_FAILED", "TRIAL_ENDING_NOTIFICATION_SENT"];
/** Zod schema for user event type - derived from tuple */
export declare const UserEventTypeSchema: z.ZodEnum<{
    WORKOUT_COMPLETED: "WORKOUT_COMPLETED";
    APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED";
    APPOINTMENT_RESCHEDULED: "APPOINTMENT_RESCHEDULED";
    MEAL_LOGGED: "MEAL_LOGGED";
    DAILY_CHECKIN_COMPLETED: "DAILY_CHECKIN_COMPLETED";
    PLAN_PUBLISHED: "PLAN_PUBLISHED";
    LAB_PANEL_CREATED: "LAB_PANEL_CREATED";
    LAB_PANEL_DELETED: "LAB_PANEL_DELETED";
    NOTIFICATION_SENT: "NOTIFICATION_SENT";
    BILLING_DATE_CHANGED: "BILLING_DATE_CHANGED";
    TIER_CHANGED: "TIER_CHANGED";
    PARTIAL_REFUND_FLAGGED: "PARTIAL_REFUND_FLAGGED";
    SCA_NOTIFICATION_SENT: "SCA_NOTIFICATION_SENT";
    SCA_INVOICE_NOTIFICATION_SENT: "SCA_INVOICE_NOTIFICATION_SENT";
    EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED";
    TRIAL_ENDING_NOTIFICATION_SENT: "TRIAL_ENDING_NOTIFICATION_SENT";
}>;
export type UserEventType = z.infer<typeof UserEventTypeSchema>;
/** Constant object for user event type comparisons */
export declare const USER_EVENT_TYPE: {
    readonly WORKOUT_COMPLETED: UserEventType;
    readonly APPOINTMENT_CANCELLED: UserEventType;
    readonly APPOINTMENT_RESCHEDULED: UserEventType;
    readonly MEAL_LOGGED: UserEventType;
    readonly DAILY_CHECKIN_COMPLETED: UserEventType;
    readonly PLAN_PUBLISHED: UserEventType;
    readonly LAB_PANEL_CREATED: UserEventType;
    readonly LAB_PANEL_DELETED: UserEventType;
    readonly NOTIFICATION_SENT: UserEventType;
    readonly BILLING_DATE_CHANGED: UserEventType;
    readonly TIER_CHANGED: UserEventType;
    /** Partial refund received on a subscription invoice — flagged for admin review */
    readonly PARTIAL_REFUND_FLAGGED: UserEventType;
    /** SCA/3DS verification email sent for payment_intent.requires_action */
    readonly SCA_NOTIFICATION_SENT: UserEventType;
    /** SCA/3DS verification email sent for invoice.payment_action_required */
    readonly SCA_INVOICE_NOTIFICATION_SENT: UserEventType;
    /** Transactional email send failed — queued for retry or admin review */
    readonly EMAIL_SEND_FAILED: UserEventType;
    /** Trial-ending notification sent 3 days before trial end */
    readonly TRIAL_ENDING_NOTIFICATION_SENT: UserEventType;
};
/** Human-readable labels for user event types */
export declare const USER_EVENT_TYPE_LABELS: Record<UserEventType, string>;
/**
 * Type guard to check if a string is a valid user event type
 */
export declare function isUserEventType(value: string): value is UserEventType;
/**
 * Known event types should come from USER_EVENT_TYPES.
 *
 * We still allow uppercase SNAKE_CASE extensions for forward compatibility so
 * newly emitted events do not hard-break consumers before this tuple is updated.
 * Free-form strings remain intentionally blocked.
 */
export declare const ForwardCompatibleUserEventTypeSchema: z.ZodUnion<readonly [z.ZodEnum<{
    WORKOUT_COMPLETED: "WORKOUT_COMPLETED";
    APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED";
    APPOINTMENT_RESCHEDULED: "APPOINTMENT_RESCHEDULED";
    MEAL_LOGGED: "MEAL_LOGGED";
    DAILY_CHECKIN_COMPLETED: "DAILY_CHECKIN_COMPLETED";
    PLAN_PUBLISHED: "PLAN_PUBLISHED";
    LAB_PANEL_CREATED: "LAB_PANEL_CREATED";
    LAB_PANEL_DELETED: "LAB_PANEL_DELETED";
    NOTIFICATION_SENT: "NOTIFICATION_SENT";
    BILLING_DATE_CHANGED: "BILLING_DATE_CHANGED";
    TIER_CHANGED: "TIER_CHANGED";
    PARTIAL_REFUND_FLAGGED: "PARTIAL_REFUND_FLAGGED";
    SCA_NOTIFICATION_SENT: "SCA_NOTIFICATION_SENT";
    SCA_INVOICE_NOTIFICATION_SENT: "SCA_INVOICE_NOTIFICATION_SENT";
    EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED";
    TRIAL_ENDING_NOTIFICATION_SENT: "TRIAL_ENDING_NOTIFICATION_SENT";
}>, z.ZodString]>;
export type ForwardCompatibleUserEventType = z.infer<typeof ForwardCompatibleUserEventTypeSchema>;
export declare const UserEventContractSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodUnion<readonly [z.ZodEnum<{
        WORKOUT_COMPLETED: "WORKOUT_COMPLETED";
        APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED";
        APPOINTMENT_RESCHEDULED: "APPOINTMENT_RESCHEDULED";
        MEAL_LOGGED: "MEAL_LOGGED";
        DAILY_CHECKIN_COMPLETED: "DAILY_CHECKIN_COMPLETED";
        PLAN_PUBLISHED: "PLAN_PUBLISHED";
        LAB_PANEL_CREATED: "LAB_PANEL_CREATED";
        LAB_PANEL_DELETED: "LAB_PANEL_DELETED";
        NOTIFICATION_SENT: "NOTIFICATION_SENT";
        BILLING_DATE_CHANGED: "BILLING_DATE_CHANGED";
        TIER_CHANGED: "TIER_CHANGED";
        PARTIAL_REFUND_FLAGGED: "PARTIAL_REFUND_FLAGGED";
        SCA_NOTIFICATION_SENT: "SCA_NOTIFICATION_SENT";
        SCA_INVOICE_NOTIFICATION_SENT: "SCA_INVOICE_NOTIFICATION_SENT";
        EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED";
        TRIAL_ENDING_NOTIFICATION_SENT: "TRIAL_ENDING_NOTIFICATION_SENT";
    }>, z.ZodString]>;
    occurredAt: z.ZodString;
    source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
/**
 * User event entry for analytics and timeline tracking.
 * Records significant user actions and system events.
 */
export type UserEventContract = z.infer<typeof UserEventContractSchema>;
/**
 * Canonical paginated user events list response.
 * Shape: { data: UserEventContract[], pagination: PaginationMeta }
 */
export declare const UserEventListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        type: z.ZodUnion<readonly [z.ZodEnum<{
            WORKOUT_COMPLETED: "WORKOUT_COMPLETED";
            APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED";
            APPOINTMENT_RESCHEDULED: "APPOINTMENT_RESCHEDULED";
            MEAL_LOGGED: "MEAL_LOGGED";
            DAILY_CHECKIN_COMPLETED: "DAILY_CHECKIN_COMPLETED";
            PLAN_PUBLISHED: "PLAN_PUBLISHED";
            LAB_PANEL_CREATED: "LAB_PANEL_CREATED";
            LAB_PANEL_DELETED: "LAB_PANEL_DELETED";
            NOTIFICATION_SENT: "NOTIFICATION_SENT";
            BILLING_DATE_CHANGED: "BILLING_DATE_CHANGED";
            TIER_CHANGED: "TIER_CHANGED";
            PARTIAL_REFUND_FLAGGED: "PARTIAL_REFUND_FLAGGED";
            SCA_NOTIFICATION_SENT: "SCA_NOTIFICATION_SENT";
            SCA_INVOICE_NOTIFICATION_SENT: "SCA_INVOICE_NOTIFICATION_SENT";
            EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED";
            TRIAL_ENDING_NOTIFICATION_SENT: "TRIAL_ENDING_NOTIFICATION_SENT";
        }>, z.ZodString]>;
        occurredAt: z.ZodString;
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UserEventListResponse = z.infer<typeof UserEventListResponseSchema>;
/**
 * Schema for business daily snapshot
 */
export declare const BusinessDailySnapshotSchema: z.ZodObject<{
    id: z.ZodString;
    date: z.ZodString;
    totalRevenue: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    mrr: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    activeUsers: z.ZodDefault<z.ZodNumber>;
    atRiskUsers: z.ZodDefault<z.ZodNumber>;
    avgComplianceScore: z.ZodDefault<z.ZodNumber>;
    studioTotalLbsLost: z.ZodDefault<z.ZodNumber>;
    studioTotalKgLost: z.ZodDefault<z.ZodNumber>;
    avgSleepScore: z.ZodDefault<z.ZodNumber>;
    avgVo2MaxImprovement: z.ZodDefault<z.ZodNumber>;
    clientsWithImprovedBiomarkers: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type BusinessDailySnapshot = z.infer<typeof BusinessDailySnapshotSchema>;
/**
 * Schema for trend data comparing snapshots
 */
export declare const BusinessSnapshotTrendSchema: z.ZodObject<{
    current: z.ZodObject<{
        id: z.ZodString;
        date: z.ZodString;
        totalRevenue: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        mrr: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        activeUsers: z.ZodDefault<z.ZodNumber>;
        atRiskUsers: z.ZodDefault<z.ZodNumber>;
        avgComplianceScore: z.ZodDefault<z.ZodNumber>;
        studioTotalLbsLost: z.ZodDefault<z.ZodNumber>;
        studioTotalKgLost: z.ZodDefault<z.ZodNumber>;
        avgSleepScore: z.ZodDefault<z.ZodNumber>;
        avgVo2MaxImprovement: z.ZodDefault<z.ZodNumber>;
        clientsWithImprovedBiomarkers: z.ZodDefault<z.ZodNumber>;
        createdAt: z.ZodString;
    }, z.core.$strip>;
    previous: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        date: z.ZodString;
        totalRevenue: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        mrr: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        activeUsers: z.ZodDefault<z.ZodNumber>;
        atRiskUsers: z.ZodDefault<z.ZodNumber>;
        avgComplianceScore: z.ZodDefault<z.ZodNumber>;
        studioTotalLbsLost: z.ZodDefault<z.ZodNumber>;
        studioTotalKgLost: z.ZodDefault<z.ZodNumber>;
        avgSleepScore: z.ZodDefault<z.ZodNumber>;
        avgVo2MaxImprovement: z.ZodDefault<z.ZodNumber>;
        clientsWithImprovedBiomarkers: z.ZodDefault<z.ZodNumber>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    changes: z.ZodOptional<z.ZodObject<{
        mrr: z.ZodOptional<z.ZodNumber>;
        mrrPercent: z.ZodOptional<z.ZodNumber>;
        activeUsers: z.ZodOptional<z.ZodNumber>;
        avgComplianceScore: z.ZodOptional<z.ZodNumber>;
        studioTotalLbsLost: z.ZodOptional<z.ZodNumber>;
        studioTotalKgLost: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BusinessSnapshotTrend = z.infer<typeof BusinessSnapshotTrendSchema>;
/**
 * Schema for individual client compliance score
 */
export declare const ComplianceScoreSchema: z.ZodObject<{
    userId: z.ZodString;
    score: z.ZodNumber;
    nutritionLogging: z.ZodNumber;
    workoutCompletion: z.ZodNumber;
    wearableSync: z.ZodNumber;
    lastActivityDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ComplianceScore = z.infer<typeof ComplianceScoreSchema>;
/**
 * Schema for compliance heatmap data
 */
export declare const ComplianceHeatmapSchema: z.ZodObject<{
    clients: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        name: z.ZodString;
        tier: z.ZodString;
        score: z.ZodNumber;
        nutritionLogging: z.ZodNumber;
        workoutCompletion: z.ZodNumber;
        wearableSync: z.ZodNumber;
        trend: z.ZodEnum<{
            improving: "improving";
            stable: "stable";
            declining: "declining";
        }>;
        lastActivityDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    averageScore: z.ZodNumber;
    totalClients: z.ZodNumber;
}, z.core.$strip>;
export type ComplianceHeatmap = z.infer<typeof ComplianceHeatmapSchema>;
/**
 * Schema for trainer effectiveness metrics
 */
export declare const TrainerEffectivenessSchema: z.ZodObject<{
    trainerId: z.ZodString;
    name: z.ZodString;
    clientCount: z.ZodDefault<z.ZodNumber>;
    avgRetention: z.ZodDefault<z.ZodNumber>;
    avgGoalAchievement: z.ZodDefault<z.ZodNumber>;
    avgClientSatisfaction: z.ZodOptional<z.ZodNumber>;
    totalSessionsCompleted: z.ZodDefault<z.ZodNumber>;
    avgWeightLossPerClient: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type TrainerEffectiveness = z.infer<typeof TrainerEffectivenessSchema>;
/**
 * Schema for trainer leaderboard response
 */
export declare const TrainerLeaderboardSchema: z.ZodObject<{
    trainers: z.ZodArray<z.ZodObject<{
        trainerId: z.ZodString;
        name: z.ZodString;
        clientCount: z.ZodDefault<z.ZodNumber>;
        avgRetention: z.ZodDefault<z.ZodNumber>;
        avgGoalAchievement: z.ZodDefault<z.ZodNumber>;
        avgClientSatisfaction: z.ZodOptional<z.ZodNumber>;
        totalSessionsCompleted: z.ZodDefault<z.ZodNumber>;
        avgWeightLossPerClient: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    totalTrainers: z.ZodNumber;
    avgClientCount: z.ZodNumber;
    avgRetention: z.ZodNumber;
}, z.core.$strip>;
export type TrainerLeaderboard = z.infer<typeof TrainerLeaderboardSchema>;
/**
 * Schema for lab pipeline item
 */
export declare const LabPipelineItemSchema: z.ZodObject<{
    labId: z.ZodString;
    clientId: z.ZodString;
    clientName: z.ZodString;
    testName: z.ZodString;
    panelCode: z.ZodString;
    status: z.ZodEnum<{
        ORDERED: "ORDERED";
        KIT_SENT: "KIT_SENT";
        SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
        RESULTS_PENDING: "RESULTS_PENDING";
        RESULTS_REVIEWED: "RESULTS_REVIEWED";
        RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
    }>;
    orderedAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    daysInStatus: z.ZodDefault<z.ZodNumber>;
    hasObservations: z.ZodDefault<z.ZodBoolean>;
    observationCount: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type LabPipelineItem = z.infer<typeof LabPipelineItemSchema>;
/**
 * Schema for lab pipeline response (Kanban-style grouped by status)
 */
export declare const LabPipelineSchema: z.ZodObject<{
    ordered: z.ZodArray<z.ZodObject<{
        labId: z.ZodString;
        clientId: z.ZodString;
        clientName: z.ZodString;
        testName: z.ZodString;
        panelCode: z.ZodString;
        status: z.ZodEnum<{
            ORDERED: "ORDERED";
            KIT_SENT: "KIT_SENT";
            SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
            RESULTS_PENDING: "RESULTS_PENDING";
            RESULTS_REVIEWED: "RESULTS_REVIEWED";
            RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
        }>;
        orderedAt: z.ZodString;
        lastUpdatedAt: z.ZodString;
        daysInStatus: z.ZodDefault<z.ZodNumber>;
        hasObservations: z.ZodDefault<z.ZodBoolean>;
        observationCount: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    kitSent: z.ZodArray<z.ZodObject<{
        labId: z.ZodString;
        clientId: z.ZodString;
        clientName: z.ZodString;
        testName: z.ZodString;
        panelCode: z.ZodString;
        status: z.ZodEnum<{
            ORDERED: "ORDERED";
            KIT_SENT: "KIT_SENT";
            SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
            RESULTS_PENDING: "RESULTS_PENDING";
            RESULTS_REVIEWED: "RESULTS_REVIEWED";
            RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
        }>;
        orderedAt: z.ZodString;
        lastUpdatedAt: z.ZodString;
        daysInStatus: z.ZodDefault<z.ZodNumber>;
        hasObservations: z.ZodDefault<z.ZodBoolean>;
        observationCount: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    sampleReceived: z.ZodArray<z.ZodObject<{
        labId: z.ZodString;
        clientId: z.ZodString;
        clientName: z.ZodString;
        testName: z.ZodString;
        panelCode: z.ZodString;
        status: z.ZodEnum<{
            ORDERED: "ORDERED";
            KIT_SENT: "KIT_SENT";
            SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
            RESULTS_PENDING: "RESULTS_PENDING";
            RESULTS_REVIEWED: "RESULTS_REVIEWED";
            RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
        }>;
        orderedAt: z.ZodString;
        lastUpdatedAt: z.ZodString;
        daysInStatus: z.ZodDefault<z.ZodNumber>;
        hasObservations: z.ZodDefault<z.ZodBoolean>;
        observationCount: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    resultsPending: z.ZodArray<z.ZodObject<{
        labId: z.ZodString;
        clientId: z.ZodString;
        clientName: z.ZodString;
        testName: z.ZodString;
        panelCode: z.ZodString;
        status: z.ZodEnum<{
            ORDERED: "ORDERED";
            KIT_SENT: "KIT_SENT";
            SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
            RESULTS_PENDING: "RESULTS_PENDING";
            RESULTS_REVIEWED: "RESULTS_REVIEWED";
            RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
        }>;
        orderedAt: z.ZodString;
        lastUpdatedAt: z.ZodString;
        daysInStatus: z.ZodDefault<z.ZodNumber>;
        hasObservations: z.ZodDefault<z.ZodBoolean>;
        observationCount: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    resultsReviewed: z.ZodArray<z.ZodObject<{
        labId: z.ZodString;
        clientId: z.ZodString;
        clientName: z.ZodString;
        testName: z.ZodString;
        panelCode: z.ZodString;
        status: z.ZodEnum<{
            ORDERED: "ORDERED";
            KIT_SENT: "KIT_SENT";
            SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
            RESULTS_PENDING: "RESULTS_PENDING";
            RESULTS_REVIEWED: "RESULTS_REVIEWED";
            RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
        }>;
        orderedAt: z.ZodString;
        lastUpdatedAt: z.ZodString;
        daysInStatus: z.ZodDefault<z.ZodNumber>;
        hasObservations: z.ZodDefault<z.ZodBoolean>;
        observationCount: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    totalCount: z.ZodNumber;
    avgDaysToCompletion: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type LabPipeline = z.infer<typeof LabPipelineSchema>;
/**
 * Schema for lead pipeline item
 */
export declare const LeadPipelineItemSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    stage: z.ZodEnum<{
        INQUIRY: "INQUIRY";
        CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
        CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
        PROPOSAL_SENT: "PROPOSAL_SENT";
        ACTIVE_MEMBER: "ACTIVE_MEMBER";
        CHURNED: "CHURNED";
    }>;
    stageChangedAt: z.ZodString;
    source: z.ZodNullable<z.ZodString>;
    interestedTier: z.ZodNullable<z.ZodString>;
    referredByName: z.ZodNullable<z.ZodString>;
    consultationDate: z.ZodNullable<z.ZodString>;
    daysInPipeline: z.ZodNumber;
    daysInCurrentStage: z.ZodNumber;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type LeadPipelineItem = z.infer<typeof LeadPipelineItemSchema>;
export declare const LeadListParamsSchema: z.ZodObject<{
    stage: z.ZodOptional<z.ZodEnum<{
        INQUIRY: "INQUIRY";
        CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
        CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
        PROPOSAL_SENT: "PROPOSAL_SENT";
        ACTIVE_MEMBER: "ACTIVE_MEMBER";
        CHURNED: "CHURNED";
    }>>;
    interestedTier: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type LeadListParams = z.infer<typeof LeadListParamsSchema>;
export declare const LeadListResponseSchema: z.ZodObject<{
    leads: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        name: z.ZodNullable<z.ZodString>;
        phone: z.ZodNullable<z.ZodString>;
        stage: z.ZodEnum<{
            INQUIRY: "INQUIRY";
            CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
            CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
            PROPOSAL_SENT: "PROPOSAL_SENT";
            ACTIVE_MEMBER: "ACTIVE_MEMBER";
            CHURNED: "CHURNED";
        }>;
        stageChangedAt: z.ZodString;
        source: z.ZodNullable<z.ZodString>;
        interestedTier: z.ZodNullable<z.ZodString>;
        referredByName: z.ZodNullable<z.ZodString>;
        consultationDate: z.ZodNullable<z.ZodString>;
        daysInPipeline: z.ZodNumber;
        daysInCurrentStage: z.ZodNumber;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        pages: z.ZodNumber;
        total: z.ZodNumber;
        limit: z.ZodNumber;
    }, z.core.$strip>;
    stats: z.ZodObject<{
        totalActive: z.ZodNumber;
        pipelineMrr: z.ZodNumber;
        byStage: z.ZodRecord<z.ZodString, z.ZodNumber>;
        conversionRate: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type LeadListResponse = z.infer<typeof LeadListResponseSchema>;
/**
 * Schema for lead pipeline/sales funnel response
 */
export declare const SalesFunnelSchema: z.ZodObject<{
    stages: z.ZodObject<{
        inquiry: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodNullable<z.ZodString>;
            phone: z.ZodNullable<z.ZodString>;
            stage: z.ZodEnum<{
                INQUIRY: "INQUIRY";
                CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
                CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
                PROPOSAL_SENT: "PROPOSAL_SENT";
                ACTIVE_MEMBER: "ACTIVE_MEMBER";
                CHURNED: "CHURNED";
            }>;
            stageChangedAt: z.ZodString;
            source: z.ZodNullable<z.ZodString>;
            interestedTier: z.ZodNullable<z.ZodString>;
            referredByName: z.ZodNullable<z.ZodString>;
            consultationDate: z.ZodNullable<z.ZodString>;
            daysInPipeline: z.ZodNumber;
            daysInCurrentStage: z.ZodNumber;
            notes: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        consultationBooked: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodNullable<z.ZodString>;
            phone: z.ZodNullable<z.ZodString>;
            stage: z.ZodEnum<{
                INQUIRY: "INQUIRY";
                CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
                CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
                PROPOSAL_SENT: "PROPOSAL_SENT";
                ACTIVE_MEMBER: "ACTIVE_MEMBER";
                CHURNED: "CHURNED";
            }>;
            stageChangedAt: z.ZodString;
            source: z.ZodNullable<z.ZodString>;
            interestedTier: z.ZodNullable<z.ZodString>;
            referredByName: z.ZodNullable<z.ZodString>;
            consultationDate: z.ZodNullable<z.ZodString>;
            daysInPipeline: z.ZodNumber;
            daysInCurrentStage: z.ZodNumber;
            notes: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        consultationCompleted: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodNullable<z.ZodString>;
            phone: z.ZodNullable<z.ZodString>;
            stage: z.ZodEnum<{
                INQUIRY: "INQUIRY";
                CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
                CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
                PROPOSAL_SENT: "PROPOSAL_SENT";
                ACTIVE_MEMBER: "ACTIVE_MEMBER";
                CHURNED: "CHURNED";
            }>;
            stageChangedAt: z.ZodString;
            source: z.ZodNullable<z.ZodString>;
            interestedTier: z.ZodNullable<z.ZodString>;
            referredByName: z.ZodNullable<z.ZodString>;
            consultationDate: z.ZodNullable<z.ZodString>;
            daysInPipeline: z.ZodNumber;
            daysInCurrentStage: z.ZodNumber;
            notes: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        proposalSent: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodNullable<z.ZodString>;
            phone: z.ZodNullable<z.ZodString>;
            stage: z.ZodEnum<{
                INQUIRY: "INQUIRY";
                CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
                CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
                PROPOSAL_SENT: "PROPOSAL_SENT";
                ACTIVE_MEMBER: "ACTIVE_MEMBER";
                CHURNED: "CHURNED";
            }>;
            stageChangedAt: z.ZodString;
            source: z.ZodNullable<z.ZodString>;
            interestedTier: z.ZodNullable<z.ZodString>;
            referredByName: z.ZodNullable<z.ZodString>;
            consultationDate: z.ZodNullable<z.ZodString>;
            daysInPipeline: z.ZodNumber;
            daysInCurrentStage: z.ZodNumber;
            notes: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        activeMember: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodNullable<z.ZodString>;
            phone: z.ZodNullable<z.ZodString>;
            stage: z.ZodEnum<{
                INQUIRY: "INQUIRY";
                CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
                CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
                PROPOSAL_SENT: "PROPOSAL_SENT";
                ACTIVE_MEMBER: "ACTIVE_MEMBER";
                CHURNED: "CHURNED";
            }>;
            stageChangedAt: z.ZodString;
            source: z.ZodNullable<z.ZodString>;
            interestedTier: z.ZodNullable<z.ZodString>;
            referredByName: z.ZodNullable<z.ZodString>;
            consultationDate: z.ZodNullable<z.ZodString>;
            daysInPipeline: z.ZodNumber;
            daysInCurrentStage: z.ZodNumber;
            notes: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        churned: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodNullable<z.ZodString>;
            phone: z.ZodNullable<z.ZodString>;
            stage: z.ZodEnum<{
                INQUIRY: "INQUIRY";
                CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
                CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
                PROPOSAL_SENT: "PROPOSAL_SENT";
                ACTIVE_MEMBER: "ACTIVE_MEMBER";
                CHURNED: "CHURNED";
            }>;
            stageChangedAt: z.ZodString;
            source: z.ZodNullable<z.ZodString>;
            interestedTier: z.ZodNullable<z.ZodString>;
            referredByName: z.ZodNullable<z.ZodString>;
            consultationDate: z.ZodNullable<z.ZodString>;
            daysInPipeline: z.ZodNumber;
            daysInCurrentStage: z.ZodNumber;
            notes: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    counts: z.ZodObject<{
        inquiry: z.ZodNumber;
        consultationBooked: z.ZodNumber;
        consultationCompleted: z.ZodNumber;
        proposalSent: z.ZodNumber;
        activeMember: z.ZodNumber;
        churned: z.ZodNumber;
        total: z.ZodNumber;
    }, z.core.$strip>;
    conversionRates: z.ZodObject<{
        inquiryToConsultation: z.ZodNumber;
        consultationToProposal: z.ZodNumber;
        proposalToMember: z.ZodNumber;
        overallConversion: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SalesFunnel = z.infer<typeof SalesFunnelSchema>;
/** Risk factor types for at-risk identification */
export declare const RISK_FACTORS: readonly ["low_compliance", "no_recent_activity", "missed_appointments", "declining_engagement", "no_weight_progress", "expired_sessions", "sessions_expiring_soon", "no_wearable_sync", "low_nutrition_logging"];
export declare const RiskFactorSchema: z.ZodEnum<{
    low_compliance: "low_compliance";
    no_recent_activity: "no_recent_activity";
    missed_appointments: "missed_appointments";
    declining_engagement: "declining_engagement";
    no_weight_progress: "no_weight_progress";
    expired_sessions: "expired_sessions";
    sessions_expiring_soon: "sessions_expiring_soon";
    no_wearable_sync: "no_wearable_sync";
    low_nutrition_logging: "low_nutrition_logging";
}>;
export type RiskFactor = z.infer<typeof RiskFactorSchema>;
/** Human-readable labels for risk factors */
export declare const RISK_FACTOR_LABELS: Record<RiskFactor, string>;
/**
 * Churn risk levels
 */
export declare const CHURN_RISK_LEVELS: readonly ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export declare const ChurnRiskLevelSchema: z.ZodEnum<{
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    HIGH: "HIGH";
    CRITICAL: "CRITICAL";
}>;
export type ChurnRiskLevel = z.infer<typeof ChurnRiskLevelSchema>;
export declare const CHURN_RISK_LEVEL: {
    readonly LOW: ChurnRiskLevel;
    readonly MEDIUM: ChurnRiskLevel;
    readonly HIGH: ChurnRiskLevel;
    readonly CRITICAL: ChurnRiskLevel;
};
/**
 * Tier-specific thresholds for churn risk calculation (in days of inactivity)
 *
 * Concierge clients train 4x/week so gaps are more concerning
 * Essentials clients train 1x/week so longer gaps are expected
 */
export declare const TIER_CHURN_THRESHOLDS: {
    readonly CONCIERGE: {
        readonly MEDIUM: 2;
        readonly HIGH: 4;
        readonly CRITICAL: 7;
    };
    readonly CORE: {
        readonly MEDIUM: 4;
        readonly HIGH: 7;
        readonly CRITICAL: 14;
    };
    readonly ESSENTIALS: {
        readonly MEDIUM: 7;
        readonly HIGH: 14;
        readonly CRITICAL: 21;
    };
};
export type TierChurnThresholds = typeof TIER_CHURN_THRESHOLDS;
/**
 * Calculate churn risk level based on tier and days of inactivity
 * @param tier - User's membership tier
 * @param daysInactive - Days since last activity
 * @returns ChurnRiskLevel
 */
export declare function calculateChurnRiskLevel(tier: "ESSENTIALS" | "CORE" | "CONCIERGE", daysInactive: number): ChurnRiskLevel;
/**
 * Schema for retention cohort data
 * Tracks user retention over time by signup month
 */
export declare const RetentionCohortSchema: z.ZodObject<{
    month: z.ZodString;
    cohortSize: z.ZodNumber;
    retentionMonth1: z.ZodNumber;
    retentionMonth3: z.ZodNumber;
    retentionMonth6: z.ZodNumber;
    retentionMonth12: z.ZodNumber;
}, z.core.$strip>;
export type RetentionCohort = z.infer<typeof RetentionCohortSchema>;
/**
 * Schema for individual churn risk assessment
 */
export declare const ChurnRiskSchema: z.ZodObject<{
    patientId: z.ZodString;
    patientName: z.ZodString;
    lastLoginDate: z.ZodString;
    daysSinceLastLogin: z.ZodNumber;
    riskLevel: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    predictedChurnDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ChurnRisk = z.infer<typeof ChurnRiskSchema>;
/**
 * Schema for revenue breakdown by membership tier
 */
export declare const RevenueTierSchema: z.ZodObject<{
    tierName: z.ZodString;
    patientCount: z.ZodNumber;
    monthlyRevenue: z.ZodNumber;
    churnRate: z.ZodNumber;
}, z.core.$strip>;
export type RevenueTier = z.infer<typeof RevenueTierSchema>;
/**
 * Schema for comprehensive CRM analytics response
 * Used by admin dashboard for business intelligence
 */
export declare const CRMAnalyticsSchema: z.ZodObject<{
    retentionCohorts: z.ZodArray<z.ZodObject<{
        month: z.ZodString;
        cohortSize: z.ZodNumber;
        retentionMonth1: z.ZodNumber;
        retentionMonth3: z.ZodNumber;
        retentionMonth6: z.ZodNumber;
        retentionMonth12: z.ZodNumber;
    }, z.core.$strip>>;
    churnRisks: z.ZodArray<z.ZodObject<{
        patientId: z.ZodString;
        patientName: z.ZodString;
        lastLoginDate: z.ZodString;
        daysSinceLastLogin: z.ZodNumber;
        riskLevel: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>;
        predictedChurnDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    revenueByTier: z.ZodArray<z.ZodObject<{
        tierName: z.ZodString;
        patientCount: z.ZodNumber;
        monthlyRevenue: z.ZodNumber;
        churnRate: z.ZodNumber;
    }, z.core.$strip>>;
    totalActivePatients: z.ZodNumber;
    averageEngagementScore: z.ZodNumber;
}, z.core.$strip>;
export type CRMAnalytics = z.infer<typeof CRMAnalyticsSchema>;
/**
 * Schema for at-risk client
 */
export declare const AtRiskClientSchema: z.ZodObject<{
    userId: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    tier: z.ZodString;
    riskFactors: z.ZodArray<z.ZodEnum<{
        low_compliance: "low_compliance";
        no_recent_activity: "no_recent_activity";
        missed_appointments: "missed_appointments";
        declining_engagement: "declining_engagement";
        no_weight_progress: "no_weight_progress";
        expired_sessions: "expired_sessions";
        sessions_expiring_soon: "sessions_expiring_soon";
        no_wearable_sync: "no_wearable_sync";
        low_nutrition_logging: "low_nutrition_logging";
    }>>;
    complianceScore: z.ZodNumber;
    daysSinceLastActivity: z.ZodNumber;
    lastActivityDate: z.ZodNullable<z.ZodString>;
    predictedChurnDate: z.ZodOptional<z.ZodString>;
    assignedTrainerName: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    expiringSessionsCount: z.ZodOptional<z.ZodNumber>;
    expiringSessionsDays: z.ZodOptional<z.ZodNumber>;
    expiringSessionsDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AtRiskClient = z.infer<typeof AtRiskClientSchema>;
/**
 * Schema for at-risk clients response
 */
export declare const AtRiskClientsResponseSchema: z.ZodObject<{
    clients: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        tier: z.ZodString;
        riskFactors: z.ZodArray<z.ZodEnum<{
            low_compliance: "low_compliance";
            no_recent_activity: "no_recent_activity";
            missed_appointments: "missed_appointments";
            declining_engagement: "declining_engagement";
            no_weight_progress: "no_weight_progress";
            expired_sessions: "expired_sessions";
            sessions_expiring_soon: "sessions_expiring_soon";
            no_wearable_sync: "no_wearable_sync";
            low_nutrition_logging: "low_nutrition_logging";
        }>>;
        complianceScore: z.ZodNumber;
        daysSinceLastActivity: z.ZodNumber;
        lastActivityDate: z.ZodNullable<z.ZodString>;
        predictedChurnDate: z.ZodOptional<z.ZodString>;
        assignedTrainerName: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        expiringSessionsCount: z.ZodOptional<z.ZodNumber>;
        expiringSessionsDays: z.ZodOptional<z.ZodNumber>;
        expiringSessionsDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    totalAtRisk: z.ZodNumber;
    criticalCount: z.ZodNumber;
    highCount: z.ZodNumber;
    moderateCount: z.ZodNumber;
}, z.core.$strip>;
export type AtRiskClientsResponse = z.infer<typeof AtRiskClientsResponseSchema>;
/**
 * Schema for trainer assignment
 */
export declare const TrainerAssignmentSchema: z.ZodObject<{
    id: z.ZodString;
    clientId: z.ZodString;
    trainerId: z.ZodString;
    trainerName: z.ZodString;
    assignedAt: z.ZodString;
    unassignedAt: z.ZodNullable<z.ZodString>;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type TrainerAssignment = z.infer<typeof TrainerAssignmentSchema>;
/**
 * Schema for creating a trainer assignment
 */
export declare const CreateTrainerAssignmentSchema: z.ZodObject<{
    clientId: z.ZodString;
    trainerId: z.ZodString;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateTrainerAssignment = z.infer<typeof CreateTrainerAssignmentSchema>;
/**
 * Schema for clinical impact / population health improvements
 */
export declare const ClinicalImpactSchema: z.ZodObject<{
    totalClients: z.ZodNumber;
    avgWeightChange: z.ZodNumber;
    clientsLosingWeight: z.ZodNumber;
    clientsGainingWeight: z.ZodNumber;
    clientsStable: z.ZodNumber;
    totalWeightLostKg: z.ZodNumber;
    clientsWithImprovedA1C: z.ZodNumber;
    clientsWithImprovedCholesterol: z.ZodNumber;
    clientsWithImprovedBloodPressure: z.ZodNumber;
    clientsWithImprovedTestosterone: z.ZodNumber;
    avgVo2MaxImprovement: z.ZodNumber;
    avgStrengthImprovement: z.ZodNumber;
    avgSleepScoreImprovement: z.ZodNumber;
    clientsWithImprovedSleep: z.ZodNumber;
    periodDays: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type ClinicalImpact = z.infer<typeof ClinicalImpactSchema>;
/**
 * Training limitation types that trainers need to know about
 * These are derived from clinical data but don't expose PHI
 */
export declare const TRAINING_LIMITATIONS: readonly ["cardiovascular", "musculoskeletal", "respiratory", "metabolic", "neurological", "recovery", "medication", "other"];
export declare const TrainingLimitationSchema: z.ZodEnum<{
    other: "other";
    recovery: "recovery";
    cardiovascular: "cardiovascular";
    metabolic: "metabolic";
    musculoskeletal: "musculoskeletal";
    respiratory: "respiratory";
    neurological: "neurological";
    medication: "medication";
}>;
export type TrainingLimitation = z.infer<typeof TrainingLimitationSchema>;
/** Human-readable labels for training limitations */
export declare const TRAINING_LIMITATION_LABELS: Record<TrainingLimitation, string>;
/**
 * Schema for a single training limitation/recommendation
 */
export declare const TrainingLimitationDetailSchema: z.ZodObject<{
    category: z.ZodEnum<{
        other: "other";
        recovery: "recovery";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        musculoskeletal: "musculoskeletal";
        respiratory: "respiratory";
        neurological: "neurological";
        medication: "medication";
    }>;
    description: z.ZodString;
    severity: z.ZodEnum<{
        caution: "caution";
        avoid: "avoid";
        monitor: "monitor";
    }>;
    expiresAt: z.ZodNullable<z.ZodString>;
    addedAt: z.ZodString;
    addedBy: z.ZodString;
}, z.core.$strip>;
export type TrainingLimitationDetail = z.infer<typeof TrainingLimitationDetailSchema>;
/**
 * Schema for training-relevant heart rate zones
 * Derived from clinical assessment but safe for trainers to see
 */
export declare const HeartRateZonesSchema: z.ZodObject<{
    restingHR: z.ZodOptional<z.ZodNumber>;
    maxHR: z.ZodOptional<z.ZodNumber>;
    zone1: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
    zone2: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
    zone3: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
    zone4: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
    zone5: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
    notes: z.ZodNullable<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type HeartRateZones = z.infer<typeof HeartRateZonesSchema>;
/**
 * Schema for training-relevant summary (safe for trainers to access)
 *
 * This contract bridges clinical data to training needs without exposing PHI.
 * Clinicians populate this; trainers consume it.
 *
 * DOES include: injury flags, movement limitations, HR zones, cleared activities
 * DOES NOT include: diagnoses, lab values, medications, care team notes
 */
export declare const TrainingRelevantSummarySchema: z.ZodObject<{
    userId: z.ZodString;
    limitations: z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<{
            other: "other";
            recovery: "recovery";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            musculoskeletal: "musculoskeletal";
            respiratory: "respiratory";
            neurological: "neurological";
            medication: "medication";
        }>;
        description: z.ZodString;
        severity: z.ZodEnum<{
            caution: "caution";
            avoid: "avoid";
            monitor: "monitor";
        }>;
        expiresAt: z.ZodNullable<z.ZodString>;
        addedAt: z.ZodString;
        addedBy: z.ZodString;
    }, z.core.$strip>>;
    heartRateZones: z.ZodNullable<z.ZodObject<{
        restingHR: z.ZodOptional<z.ZodNumber>;
        maxHR: z.ZodOptional<z.ZodNumber>;
        zone1: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, z.core.$strip>>;
        zone2: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, z.core.$strip>>;
        zone3: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, z.core.$strip>>;
        zone4: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, z.core.$strip>>;
        zone5: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, z.core.$strip>>;
        notes: z.ZodNullable<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    avoidMovements: z.ZodArray<z.ZodString>;
    clearedActivities: z.ZodArray<z.ZodString>;
    clinicianNotes: z.ZodNullable<z.ZodString>;
    requiresWarmupExtension: z.ZodDefault<z.ZodBoolean>;
    requiresCooldownExtension: z.ZodDefault<z.ZodBoolean>;
    requiresFrequentBreaks: z.ZodDefault<z.ZodBoolean>;
    requiresHRMonitoring: z.ZodDefault<z.ZodBoolean>;
    lastUpdatedAt: z.ZodString;
    lastUpdatedBy: z.ZodString;
}, z.core.$strip>;
export type TrainingRelevantSummary = z.infer<typeof TrainingRelevantSummarySchema>;
/**
 * Schema for time to first victory metric
 */
export declare const TimeToFirstVictorySchema: z.ZodObject<{
    userId: z.ZodString;
    daysToFirstVictory: z.ZodNullable<z.ZodNumber>;
    victoryType: z.ZodNullable<z.ZodString>;
    victoryDate: z.ZodNullable<z.ZodString>;
    onboardingDate: z.ZodString;
}, z.core.$strip>;
export type TimeToFirstVictory = z.infer<typeof TimeToFirstVictorySchema>;
/**
 * Schema for credit/session utilization rate
 */
export declare const CreditUtilizationSchema: z.ZodObject<{
    userId: z.ZodString;
    totalCredits: z.ZodNumber;
    usedCredits: z.ZodNumber;
    remainingCredits: z.ZodNumber;
    utilizationRate: z.ZodNumber;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
}, z.core.$strip>;
export type CreditUtilization = z.infer<typeof CreditUtilizationSchema>;
/**
 * Schema for AI analytics query request
 */
export declare const AIQueryRequestSchema: z.ZodObject<{
    query: z.ZodString;
}, z.core.$strip>;
export type AIQueryRequest = z.infer<typeof AIQueryRequestSchema>;
/**
 * Schema for data points returned in AI query responses
 * Key-value pairs extracted from database queries
 */
export declare const AIQueryDataPointSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
export type AIQueryDataPoint = z.infer<typeof AIQueryDataPointSchema>;
/**
 * Schema for AI analytics query response
 */
export declare const AIQueryResponseSchema: z.ZodObject<{
    query: z.ZodString;
    answer: z.ZodString;
    dataPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>>;
    generatedAt: z.ZodString;
}, z.core.$strip>;
export type AIQueryResponse = z.infer<typeof AIQueryResponseSchema>;
/** Message role in AI chat — matches Prisma AIChatRole enum (USER | ASSISTANT) */
export declare const AI_CHAT_ROLES: readonly ["USER", "ASSISTANT"];
export declare const AIChatRoleSchema: z.ZodEnum<{
    USER: "USER";
    ASSISTANT: "ASSISTANT";
}>;
export type AIChatRole = z.infer<typeof AIChatRoleSchema>;
/** Supported file types for AI chat attachments */
export declare const AI_CHAT_FILE_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/plain", "text/csv", "text/markdown", "application/json", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export type AIChatFileType = (typeof AI_CHAT_FILE_TYPES)[number];
/**
 * Attachment in an AI chat message
 */
export declare const AIChatAttachmentSchema: z.ZodObject<{
    id: z.ZodString;
    filename: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    data: z.ZodOptional<z.ZodString>;
    previewUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AIChatAttachment = z.infer<typeof AIChatAttachmentSchema>;
/**
 * Single message in an AI chat session
 */
export declare const AIChatMessageSchema: z.ZodObject<{
    id: z.ZodString;
    sessionId: z.ZodString;
    role: z.ZodEnum<{
        USER: "USER";
        ASSISTANT: "ASSISTANT";
    }>;
    content: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        filename: z.ZodString;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        data: z.ZodOptional<z.ZodString>;
        previewUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    dataPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type AIChatMessage = z.infer<typeof AIChatMessageSchema>;
/**
 * AI chat session metadata
 */
export declare const AIChatSessionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    title: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    lastMessagePreview: z.ZodOptional<z.ZodString>;
    messageCount: z.ZodNumber;
}, z.core.$strip>;
export type AIChatSession = z.infer<typeof AIChatSessionSchema>;
/**
 * Full session with messages
 */
export declare const AIChatSessionWithMessagesSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    title: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    lastMessagePreview: z.ZodOptional<z.ZodString>;
    messageCount: z.ZodNumber;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        role: z.ZodEnum<{
            USER: "USER";
            ASSISTANT: "ASSISTANT";
        }>;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            filename: z.ZodString;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            data: z.ZodOptional<z.ZodString>;
            previewUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        dataPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AIChatSessionWithMessages = z.infer<typeof AIChatSessionWithMessagesSchema>;
/**
 * Request to send a message in a chat session
 */
export declare const AIChatSendMessageRequestSchema: z.ZodObject<{
    sessionId: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        filename: z.ZodString;
        mimeType: z.ZodString;
        base64: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AIChatSendMessageRequest = z.infer<typeof AIChatSendMessageRequestSchema>;
/**
 * Response from sending a message
 */
export declare const AIChatSendMessageResponseSchema: z.ZodObject<{
    session: z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        title: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        lastMessagePreview: z.ZodOptional<z.ZodString>;
        messageCount: z.ZodNumber;
    }, z.core.$strip>;
    userMessage: z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        role: z.ZodEnum<{
            USER: "USER";
            ASSISTANT: "ASSISTANT";
        }>;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            filename: z.ZodString;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            data: z.ZodOptional<z.ZodString>;
            previewUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        dataPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>>;
        createdAt: z.ZodString;
    }, z.core.$strip>;
    assistantMessage: z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        role: z.ZodEnum<{
            USER: "USER";
            ASSISTANT: "ASSISTANT";
        }>;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            filename: z.ZodString;
            mimeType: z.ZodString;
            size: z.ZodNumber;
            data: z.ZodOptional<z.ZodString>;
            previewUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        dataPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>>;
        createdAt: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AIChatSendMessageResponse = z.infer<typeof AIChatSendMessageResponseSchema>;
/**
 * List sessions response — canonical paginated shape { data: AIChatSession[], pagination: {...} }
 */
export declare const AIChatSessionListSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        title: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        lastMessagePreview: z.ZodOptional<z.ZodString>;
        messageCount: z.ZodNumber;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AIChatSessionList = z.infer<typeof AIChatSessionListSchema>;
/**
 * Base type for referral tree node (without recursive children)
 */
interface BaseReferralNode {
    /** User ID or Lead ID */
    id: string;
    /** Display name (anonymized if needed for PHI) */
    name: string;
    /** Email address */
    email: string;
    /** User tier if converted to member */
    tier: string | null;
    /** Is this an active user or just a lead? */
    isActiveMember: boolean;
    /** Number of direct referrals */
    directReferralCount: number;
    /** Total referrals in subtree (direct + indirect) */
    totalReferralCount: number;
    /** Lead stage if still in pipeline */
    leadStage: LeadStage | null;
    /** When they were referred or joined */
    joinedAt: string;
}
/**
 * Recursive referral tree node type
 */
export interface ReferralNode extends BaseReferralNode {
    /** Child referrals (recursive structure) */
    referrals: ReferralNode[];
}
/**
 * Schema for referral tree node
 * Note: Zod schema validates the shape but cannot fully type recursive structures
 */
export declare const ReferralNodeSchema: z.ZodType<ReferralNode>;
/**
 * Schema for referral tree response
 */
export declare const ReferralTreeSchema: z.ZodObject<{
    roots: z.ZodArray<z.ZodType<ReferralNode, unknown, z.core.$ZodTypeInternals<ReferralNode, unknown>>>;
    totalReferrers: z.ZodNumber;
    vipReferrers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        directReferralCount: z.ZodNumber;
        totalReferralCount: z.ZodNumber;
        tier: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    maxDepth: z.ZodNumber;
}, z.core.$strip>;
export type ReferralTree = z.infer<typeof ReferralTreeSchema>;
/**
 * A single Stripe chargeback/dispute record.
 * Runtime Zod schema for the DisputeItem interface defined in domain/analytics.ts.
 */
export declare const DisputeItemSchema: z.ZodObject<{
    id: z.ZodString;
    stripeDisputeId: z.ZodString;
    stripeChargeId: z.ZodString;
    status: z.ZodEnum<{
        NEEDS_RESPONSE: "NEEDS_RESPONSE";
        UNDER_REVIEW: "UNDER_REVIEW";
        WON: "WON";
        LOST: "LOST";
    }>;
    reason: z.ZodString;
    amount: z.ZodNumber;
    userId: z.ZodString;
    userName: z.ZodNullable<z.ZodString>;
    userEmail: z.ZodNullable<z.ZodString>;
    subscriptionId: z.ZodNullable<z.ZodString>;
    subscriptionTier: z.ZodNullable<z.ZodString>;
    subscriptionStatus: z.ZodNullable<z.ZodString>;
    accountSuspendedAt: z.ZodNullable<z.ZodString>;
    accountRestoredAt: z.ZodNullable<z.ZodString>;
    resolution: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type DisputeItemContract = z.infer<typeof DisputeItemSchema>;
/**
 * Canonical paginated disputes response.
 * Shape: { data: DisputeItemContract[], pagination: PaginationMeta }
 */
export declare const DisputeListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        stripeDisputeId: z.ZodString;
        stripeChargeId: z.ZodString;
        status: z.ZodEnum<{
            NEEDS_RESPONSE: "NEEDS_RESPONSE";
            UNDER_REVIEW: "UNDER_REVIEW";
            WON: "WON";
            LOST: "LOST";
        }>;
        reason: z.ZodString;
        amount: z.ZodNumber;
        userId: z.ZodString;
        userName: z.ZodNullable<z.ZodString>;
        userEmail: z.ZodNullable<z.ZodString>;
        subscriptionId: z.ZodNullable<z.ZodString>;
        subscriptionTier: z.ZodNullable<z.ZodString>;
        subscriptionStatus: z.ZodNullable<z.ZodString>;
        accountSuspendedAt: z.ZodNullable<z.ZodString>;
        accountRestoredAt: z.ZodNullable<z.ZodString>;
        resolution: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type DisputeListResponse = z.infer<typeof DisputeListResponseSchema>;
/**
 * Revenue trend data point — one entry per granularity bucket (e.g. month).
 */
export declare const RevenueTrendDataPointSchema: z.ZodObject<{
    date: z.ZodString;
    revenue: z.ZodNumber;
}, z.core.$strip>;
export type RevenueTrendDataPoint = z.infer<typeof RevenueTrendDataPointSchema>;
/**
 * Revenue trend response from the billing analytics endpoint.
 * Keyed by granularity (day/week/month).
 */
export declare const RevenueTrendResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        revenue: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type RevenueTrendResponse = z.infer<typeof RevenueTrendResponseSchema>;
/**
 * Churn metrics response from the billing analytics endpoint.
 * Captures subscription cancellation / acquisition delta for a period.
 */
export declare const ChurnMetricsResponseSchema: z.ZodObject<{
    churnRate: z.ZodNumber;
    canceledSubscriptions: z.ZodNumber;
    newSubscriptions: z.ZodNumber;
    netGrowth: z.ZodNumber;
}, z.core.$strip>;
export type ChurnMetricsResponse = z.infer<typeof ChurnMetricsResponseSchema>;
/**
 * LTV breakdown by membership tier.
 */
export declare const LTVByTierSchema: z.ZodObject<{
    tier: z.ZodString;
    averageLTVCents: z.ZodNumber;
    totalCustomers: z.ZodNumber;
}, z.core.$strip>;
export type LTVByTier = z.infer<typeof LTVByTierSchema>;
/**
 * LTV metrics response from the billing analytics endpoint.
 * Amounts are in cents to avoid floating-point issues.
 */
export declare const LTVMetricsResponseSchema: z.ZodObject<{
    overallAverageLTVCents: z.ZodNumber;
    overallAverageLifetimeMonths: z.ZodNumber;
    byTier: z.ZodArray<z.ZodObject<{
        tier: z.ZodString;
        averageLTVCents: z.ZodNumber;
        totalCustomers: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type LTVMetricsResponse = z.infer<typeof LTVMetricsResponseSchema>;
export {};
//# sourceMappingURL=businessAnalytics.d.ts.map