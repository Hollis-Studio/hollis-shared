/**
 * @ai-context Business Analytics Domain Contracts Tests
 *
 * This test suite verifies:
 * 1. LAB_ORDER_STATUS tuple, schema, constants, labels, type guard
 * 2. LEAD_STAGE tuple, schema, constants, labels, type guard
 * 3. USER_EVENT_TYPE tuple, schema, constants, labels, type guard
 * 4. ForwardCompatibleUserEventTypeSchema (known + uppercase SNAKE_CASE extension)
 * 5. UserEventContractSchema and paginated list shape
 * 6. BusinessDailySnapshotSchema (coerce.number defaults)
 * 7. ComplianceScoreSchema
 * 8. TrainerEffectivenessSchema
 * 9. LabPipelineItemSchema + LabPipelineSchema
 * 10. LeadPipelineItemSchema, LeadListParamsSchema, LeadListResponseSchema
 * 11. SalesFunnelSchema
 * 12. RISK_FACTORS tuple, schema, labels
 * 13. CHURN_RISK_LEVELS tuple, schema, constants
 * 14. calculateChurnRiskLevel() — tier-specific thresholds
 * 15. CRMAnalyticsSchema
 * 16. AtRiskClientSchema + AtRiskClientsResponseSchema
 * 17. TRAINING_LIMITATIONS tuple, schema, labels
 * 18. TrainingLimitationDetailSchema + HeartRateZonesSchema + TrainingRelevantSummarySchema
 * 19. AIChatRoleSchema + AIChatMessageSchema + AIChatSessionSchema + send/response schemas
 * 20. ReferralNodeSchema (recursive via z.lazy)
 * 21. DisputeItemSchema + paginated list
 * 22. RevenueTrendResponseSchema, ChurnMetricsResponseSchema, LTVMetricsResponseSchema
 *
 * Run: npx jest shared/contracts/__tests__/domain-business-analytics.test.ts
 */

import {
  AI_CHAT_ROLES,
  AIChatMessageSchema,
  AIChatRoleSchema,
  AIChatSendMessageRequestSchema,
  AIChatSendMessageResponseSchema,
  AIChatSessionSchema,
  AIChatSessionWithMessagesSchema,
  AtRiskClientSchema,
  AtRiskClientsResponseSchema,
  BusinessDailySnapshotSchema,
  BusinessSnapshotTrendSchema,
  calculateChurnRiskLevel,
  CHURN_RISK_LEVEL,
  CHURN_RISK_LEVELS,
  ChurnMetricsResponseSchema,
  ChurnRiskLevelSchema,
  ComplianceScoreSchema,
  CRMAnalyticsSchema,
  DisputeItemSchema,
  DisputeListResponseSchema,
  ForwardCompatibleUserEventTypeSchema,
  HeartRateZonesSchema,
  isLabOrderStatus,
  isLeadStage,
  isUserEventType,
  LAB_ORDER_STATUS,
  LAB_ORDER_STATUS_LABELS,
  LAB_ORDER_STATUSES,
  LabOrderStatusSchema,
  LabPipelineItemSchema,
  LabPipelineSchema,
  LEAD_STAGE,
  LEAD_STAGE_LABELS,
  LEAD_STAGES,
  LeadListParamsSchema,
  LeadPipelineItemSchema,
  LeadStageSchema,
  LTVMetricsResponseSchema,
  ReferralNodeSchema,
  RevenueTrendResponseSchema,
  RISK_FACTOR_LABELS,
  RISK_FACTORS,
  RiskFactorSchema,
  SalesFunnelSchema,
  TIER_CHURN_THRESHOLDS,
  TrainerEffectivenessSchema,
  TRAINING_LIMITATION_LABELS,
  TRAINING_LIMITATIONS,
  TrainingLimitationDetailSchema,
  TrainingLimitationSchema,
  TrainingRelevantSummarySchema,
  USER_EVENT_TYPE,
  USER_EVENT_TYPE_LABELS,
  USER_EVENT_TYPES,
  UserEventContractSchema,
  UserEventListResponseSchema,
  UserEventTypeSchema,
} from '../domain/businessAnalytics';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();
const TODAY = '2024-06-15';

function validBusinessDailySnapshot(id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11') {
  return {
    id,
    date: TODAY,
    totalRevenue: 50000,
    mrr: 48000,
    activeUsers: 120,
    atRiskUsers: 8,
    avgComplianceScore: 78,
    studioTotalLbsLost: 340,
    studioTotalKgLost: 154.2,
    avgSleepScore: 82,
    avgVo2MaxImprovement: 3.5,
    clientsWithImprovedBiomarkers: 45,
    createdAt: NOW_ISO,
  };
}

function validLeadPipelineItem(id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12') {
  return {
    id,
    email: 'lead@example.com',
    name: 'Jane Smith',
    phone: null,
    stage: 'INQUIRY' as const,
    stageChangedAt: NOW_ISO,
    source: 'instagram',
    interestedTier: 'CORE',
    referredByName: null,
    consultationDate: null,
    daysInPipeline: 5,
    daysInCurrentStage: 5,
    notes: null,
    createdAt: NOW_ISO,
  };
}

function validLabPipelineItem(labId = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13') {
  return {
    labId,
    clientId: 'user-123',
    clientName: 'John Doe',
    testName: 'Comprehensive Metabolic Panel',
    panelCode: 'CMP',
    status: 'ORDERED' as const,
    orderedAt: NOW_ISO,
    lastUpdatedAt: NOW_ISO,
    daysInStatus: 2,
    hasObservations: false,
    observationCount: 0,
  };
}

function validAIChatSession() {
  return {
    id: 'session-abc',
    userId: 'user-123',
    title: 'Compliance Report Q1',
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
    messageCount: 4,
  };
}

function validAIChatMessage() {
  return {
    id: 'msg-001',
    sessionId: 'session-abc',
    role: 'USER' as const,
    content: 'What is the average compliance score?',
    createdAt: NOW_ISO,
  };
}

function validAtRiskClient() {
  return {
    userId: 'user-789',
    name: 'Bob Jones',
    email: 'bob@example.com',
    tier: 'CORE',
    riskFactors: ['low_compliance' as const, 'no_wearable_sync' as const],
    complianceScore: 42,
    daysSinceLastActivity: 8,
    lastActivityDate: NOW_ISO,
    assignedTrainerName: 'Alice Trainer',
    notes: null,
  };
}

// ============================================================================
// LAB ORDER STATUS
// ============================================================================

describe('Business Analytics Domain Contracts', () => {
  describe('LAB_ORDER_STATUS', () => {
    it('should contain exactly 6 statuses', () => {
      expect(LAB_ORDER_STATUSES).toHaveLength(6);
    });

    it('should contain all expected status values', () => {
      expect(LAB_ORDER_STATUSES).toContain('ORDERED');
      expect(LAB_ORDER_STATUSES).toContain('KIT_SENT');
      expect(LAB_ORDER_STATUSES).toContain('SAMPLE_RECEIVED');
      expect(LAB_ORDER_STATUSES).toContain('RESULTS_PENDING');
      expect(LAB_ORDER_STATUSES).toContain('RESULTS_REVIEWED');
      expect(LAB_ORDER_STATUSES).toContain('RESULTS_PUBLISHED');
    });

    it.each(LAB_ORDER_STATUSES)('LabOrderStatusSchema should accept: %s', (value) => {
      expect(LabOrderStatusSchema.safeParse(value).success).toBe(true);
    });

    it('LabOrderStatusSchema should reject invalid values', () => {
      expect(LabOrderStatusSchema.safeParse('COMPLETED').success).toBe(false);
      expect(LabOrderStatusSchema.safeParse('ordered').success).toBe(false);
      expect(LabOrderStatusSchema.safeParse('').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(LAB_ORDER_STATUS.ORDERED).toBe('ORDERED');
      expect(LAB_ORDER_STATUS.KIT_SENT).toBe('KIT_SENT');
      expect(LAB_ORDER_STATUS.SAMPLE_RECEIVED).toBe('SAMPLE_RECEIVED');
      expect(LAB_ORDER_STATUS.RESULTS_PENDING).toBe('RESULTS_PENDING');
      expect(LAB_ORDER_STATUS.RESULTS_REVIEWED).toBe('RESULTS_REVIEWED');
      expect(LAB_ORDER_STATUS.RESULTS_PUBLISHED).toBe('RESULTS_PUBLISHED');
    });

    it('should have labels for all statuses', () => {
      for (const status of LAB_ORDER_STATUSES) {
        expect(LAB_ORDER_STATUS_LABELS[status]).toBeDefined();
        expect(LAB_ORDER_STATUS_LABELS[status].length).toBeGreaterThan(0);
      }
    });

    describe('isLabOrderStatus type guard', () => {
      it.each(LAB_ORDER_STATUSES)('should return true for: %s', (value) => {
        expect(isLabOrderStatus(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isLabOrderStatus('COMPLETED')).toBe(false);
        expect(isLabOrderStatus('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // LEAD STAGE
  // ============================================================================

  describe('LEAD_STAGE', () => {
    it('should contain exactly 6 stages', () => {
      expect(LEAD_STAGES).toHaveLength(6);
    });

    it('should contain all expected stage values', () => {
      expect(LEAD_STAGES).toContain('INQUIRY');
      expect(LEAD_STAGES).toContain('CONSULTATION_BOOKED');
      expect(LEAD_STAGES).toContain('CONSULTATION_COMPLETED');
      expect(LEAD_STAGES).toContain('PROPOSAL_SENT');
      expect(LEAD_STAGES).toContain('ACTIVE_MEMBER');
      expect(LEAD_STAGES).toContain('CHURNED');
    });

    it.each(LEAD_STAGES)('LeadStageSchema should accept: %s', (value) => {
      expect(LeadStageSchema.safeParse(value).success).toBe(true);
    });

    it('LeadStageSchema should reject invalid values', () => {
      expect(LeadStageSchema.safeParse('PROSPECT').success).toBe(false);
      expect(LeadStageSchema.safeParse('inquiry').success).toBe(false);
      expect(LeadStageSchema.safeParse('').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(LEAD_STAGE.INQUIRY).toBe('INQUIRY');
      expect(LEAD_STAGE.CONSULTATION_BOOKED).toBe('CONSULTATION_BOOKED');
      expect(LEAD_STAGE.CONSULTATION_COMPLETED).toBe('CONSULTATION_COMPLETED');
      expect(LEAD_STAGE.PROPOSAL_SENT).toBe('PROPOSAL_SENT');
      expect(LEAD_STAGE.ACTIVE_MEMBER).toBe('ACTIVE_MEMBER');
      expect(LEAD_STAGE.CHURNED).toBe('CHURNED');
    });

    it('should have labels for all stages', () => {
      for (const stage of LEAD_STAGES) {
        expect(LEAD_STAGE_LABELS[stage]).toBeDefined();
        expect(LEAD_STAGE_LABELS[stage].length).toBeGreaterThan(0);
      }
    });

    describe('isLeadStage type guard', () => {
      it.each(LEAD_STAGES)('should return true for: %s', (value) => {
        expect(isLeadStage(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isLeadStage('PROSPECT')).toBe(false);
        expect(isLeadStage('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // USER EVENT TYPE
  // ============================================================================

  describe('USER_EVENT_TYPE', () => {
    it('should contain exactly 16 event types', () => {
      expect(USER_EVENT_TYPES).toHaveLength(16);
    });

    it('should contain all expected event types', () => {
      expect(USER_EVENT_TYPES).toContain('WORKOUT_COMPLETED');
      expect(USER_EVENT_TYPES).toContain('APPOINTMENT_CANCELLED');
      expect(USER_EVENT_TYPES).toContain('MEAL_LOGGED');
      expect(USER_EVENT_TYPES).toContain('DAILY_CHECKIN_COMPLETED');
      expect(USER_EVENT_TYPES).toContain('PLAN_PUBLISHED');
      expect(USER_EVENT_TYPES).toContain('LAB_PANEL_CREATED');
      expect(USER_EVENT_TYPES).toContain('BILLING_DATE_CHANGED');
      expect(USER_EVENT_TYPES).toContain('TIER_CHANGED');
    });

    it.each(USER_EVENT_TYPES)('UserEventTypeSchema should accept: %s', (value) => {
      expect(UserEventTypeSchema.safeParse(value).success).toBe(true);
    });

    it('UserEventTypeSchema should reject invalid values', () => {
      expect(UserEventTypeSchema.safeParse('LOGIN').success).toBe(false);
      expect(UserEventTypeSchema.safeParse('workout_completed').success).toBe(false);
      expect(UserEventTypeSchema.safeParse('').success).toBe(false);
    });

    it('should have constants matching tuple values', () => {
      expect(USER_EVENT_TYPE.WORKOUT_COMPLETED).toBe('WORKOUT_COMPLETED');
      expect(USER_EVENT_TYPE.APPOINTMENT_CANCELLED).toBe('APPOINTMENT_CANCELLED');
      expect(USER_EVENT_TYPE.MEAL_LOGGED).toBe('MEAL_LOGGED');
      expect(USER_EVENT_TYPE.TIER_CHANGED).toBe('TIER_CHANGED');
    });

    it('should have labels for all event types', () => {
      for (const eventType of USER_EVENT_TYPES) {
        expect(USER_EVENT_TYPE_LABELS[eventType]).toBeDefined();
        expect(USER_EVENT_TYPE_LABELS[eventType].length).toBeGreaterThan(0);
      }
    });

    describe('isUserEventType type guard', () => {
      it.each(USER_EVENT_TYPES)('should return true for: %s', (value) => {
        expect(isUserEventType(value)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isUserEventType('LOGIN')).toBe(false);
        expect(isUserEventType('')).toBe(false);
      });
    });
  });

  // ============================================================================
  // FORWARD COMPATIBLE USER EVENT TYPE SCHEMA
  // ============================================================================

  describe('ForwardCompatibleUserEventTypeSchema', () => {
    it.each(USER_EVENT_TYPES)('should accept known type: %s', (value) => {
      expect(ForwardCompatibleUserEventTypeSchema.safeParse(value).success).toBe(true);
    });

    it('should accept uppercase SNAKE_CASE extension types', () => {
      expect(ForwardCompatibleUserEventTypeSchema.safeParse('NEW_FEATURE_FIRED').success).toBe(true);
      expect(ForwardCompatibleUserEventTypeSchema.safeParse('A').success).toBe(true);
      expect(ForwardCompatibleUserEventTypeSchema.safeParse('AB_CD_EF').success).toBe(true);
    });

    it('should reject lowercase or mixed-case free-form strings', () => {
      expect(ForwardCompatibleUserEventTypeSchema.safeParse('login').success).toBe(false);
      expect(ForwardCompatibleUserEventTypeSchema.safeParse('workout-completed').success).toBe(false);
      expect(ForwardCompatibleUserEventTypeSchema.safeParse('Workout_Completed').success).toBe(false);
    });

    it('should reject empty string', () => {
      expect(ForwardCompatibleUserEventTypeSchema.safeParse('').success).toBe(false);
    });
  });

  // ============================================================================
  // USER EVENT CONTRACT
  // ============================================================================

  describe('UserEventContractSchema', () => {
    it('should accept a valid user event', () => {
      expect(UserEventContractSchema.safeParse({
        id: 'evt-001',
        userId: 'user-123',
        type: 'WORKOUT_COMPLETED',
        occurredAt: NOW_ISO,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should accept optional source and metadata', () => {
      expect(UserEventContractSchema.safeParse({
        id: 'evt-002',
        userId: 'user-123',
        type: 'MEAL_LOGGED',
        occurredAt: NOW_ISO,
        source: 'mobile_app',
        metadata: { mealId: 'meal-456', calories: 600 },
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should accept null source and metadata', () => {
      expect(UserEventContractSchema.safeParse({
        id: 'evt-003',
        userId: 'user-123',
        type: 'TIER_CHANGED',
        occurredAt: NOW_ISO,
        source: null,
        metadata: null,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should accept forward-compatible event type', () => {
      expect(UserEventContractSchema.safeParse({
        id: 'evt-004',
        userId: 'user-123',
        type: 'NEW_FUTURE_EVENT_TYPE',
        occurredAt: NOW_ISO,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should reject lowercase event type', () => {
      expect(UserEventContractSchema.safeParse({
        id: 'evt-005',
        userId: 'user-123',
        type: 'workout_completed',
        occurredAt: NOW_ISO,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  describe('UserEventListResponseSchema', () => {
    it('should accept a valid paginated list of user events', () => {
      const result = UserEventListResponseSchema.safeParse({
        data: [{
          id: 'evt-001',
          userId: 'user-123',
          type: 'WORKOUT_COMPLETED',
          occurredAt: NOW_ISO,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        }],
        pagination: { total: 1, limit: 25, offset: 0, hasMore: false },
      });
      expect(result.success).toBe(true);
    });
  });

  // ============================================================================
  // BUSINESS DAILY SNAPSHOT
  // ============================================================================

  describe('BusinessDailySnapshotSchema', () => {
    it('should accept a valid snapshot', () => {
      expect(BusinessDailySnapshotSchema.safeParse(validBusinessDailySnapshot()).success).toBe(true);
    });

    it('should apply defaults for missing optional numeric fields', () => {
      const result = BusinessDailySnapshotSchema.safeParse({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        date: TODAY,
        createdAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalRevenue).toBe(0);
        expect(result.data.mrr).toBe(0);
        expect(result.data.activeUsers).toBe(0);
        expect(result.data.avgComplianceScore).toBe(0);
        expect(
          "studioTotalLbsLost" in result.data
            ? result.data.studioTotalLbsLost
            : undefined,
        ).toBe(0);
        expect(result.data.studioTotalKgLost).toBe(0);
      }
    });

    it('should coerce string revenue to number', () => {
      const result = BusinessDailySnapshotSchema.safeParse({
        ...validBusinessDailySnapshot(),
        totalRevenue: '75000',
        mrr: '72000',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.totalRevenue).toBe('number');
        expect(result.data.totalRevenue).toBe(75000);
      }
    });

    it('should reject avgComplianceScore outside 0-100', () => {
      expect(BusinessDailySnapshotSchema.safeParse({
        ...validBusinessDailySnapshot(),
        avgComplianceScore: 101,
      }).success).toBe(false);
    });

    it('should reject non-UUID id', () => {
      expect(BusinessDailySnapshotSchema.safeParse({
        ...validBusinessDailySnapshot(),
        id: 'not-a-uuid',
      }).success).toBe(false);
    });
  });

  describe('BusinessSnapshotTrendSchema', () => {
    it('should accept current and trend changes with both kg and backward-compatible lbs field names', () => {
      const result = BusinessSnapshotTrendSchema.safeParse({
        current: validBusinessDailySnapshot(),
        previous: {
          ...validBusinessDailySnapshot('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
          studioTotalLbsLost: 331,
          studioTotalKgLost: 150.1,
        },
        changes: {
          studioTotalLbsLost: 9,
          studioTotalKgLost: 4.1,
          mrr: 2000,
        },
      });

      expect(result.success).toBe(true);
    });
  });

  // ============================================================================
  // COMPLIANCE SCORE
  // ============================================================================

  describe('ComplianceScoreSchema', () => {
    it('should accept a valid compliance score', () => {
      expect(ComplianceScoreSchema.safeParse({
        userId: 'user-123',
        score: 78,
        nutritionLogging: 85,
        workoutCompletion: 70,
        wearableSync: 90,
      }).success).toBe(true);
    });

    it('should accept optional lastActivityDate', () => {
      expect(ComplianceScoreSchema.safeParse({
        userId: 'user-123',
        score: 50,
        nutritionLogging: 50,
        workoutCompletion: 50,
        wearableSync: 50,
        lastActivityDate: NOW_ISO,
      }).success).toBe(true);
    });

    it('should reject score outside 0-100', () => {
      expect(ComplianceScoreSchema.safeParse({
        userId: 'user-123',
        score: 101,
        nutritionLogging: 50,
        workoutCompletion: 50,
        wearableSync: 50,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // TRAINER EFFECTIVENESS
  // ============================================================================

  describe('TrainerEffectivenessSchema', () => {
    it('should accept a valid trainer effectiveness entry', () => {
      expect(TrainerEffectivenessSchema.safeParse({
        trainerId: 'trainer-001',
        name: 'Alice Trainer',
        clientCount: 20,
        avgRetention: 88,
        avgGoalAchievement: 75,
        totalSessionsCompleted: 180,
        avgWeightLossPerClient: 4.2,
      }).success).toBe(true);
    });

    it('should apply defaults for omitted numeric fields', () => {
      const result = TrainerEffectivenessSchema.safeParse({
        trainerId: 'trainer-002',
        name: 'Bob Trainer',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.clientCount).toBe(0);
        expect(result.data.avgRetention).toBe(0);
        expect(result.data.totalSessionsCompleted).toBe(0);
      }
    });

    it('should accept optional avgClientSatisfaction up to 5', () => {
      expect(TrainerEffectivenessSchema.safeParse({
        trainerId: 'trainer-003',
        name: 'Carol',
        avgClientSatisfaction: 4.8,
      }).success).toBe(true);
    });

    it('should reject avgClientSatisfaction above 5', () => {
      expect(TrainerEffectivenessSchema.safeParse({
        trainerId: 'trainer-004',
        name: 'Dave',
        avgClientSatisfaction: 5.5,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // LAB PIPELINE
  // ============================================================================

  describe('LabPipelineItemSchema', () => {
    it('should accept a valid lab pipeline item', () => {
      expect(LabPipelineItemSchema.safeParse(validLabPipelineItem()).success).toBe(true);
    });

    it('should apply defaults for daysInStatus, hasObservations, observationCount', () => {
      const result = LabPipelineItemSchema.safeParse({
        labId: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        clientId: 'user-123',
        clientName: 'John',
        testName: 'CBC',
        panelCode: 'CBC',
        status: 'KIT_SENT',
        orderedAt: NOW_ISO,
        lastUpdatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.daysInStatus).toBe(0);
        expect(result.data.hasObservations).toBe(false);
        expect(result.data.observationCount).toBe(0);
      }
    });

    it('should reject invalid lab order status', () => {
      expect(LabPipelineItemSchema.safeParse({
        ...validLabPipelineItem(),
        status: 'COMPLETED',
      }).success).toBe(false);
    });
  });

  describe('LabPipelineSchema', () => {
    it('should accept a valid lab pipeline (empty arrays)', () => {
      expect(LabPipelineSchema.safeParse({
        ordered: [],
        kitSent: [],
        sampleReceived: [],
        resultsPending: [],
        resultsReviewed: [],
        totalCount: 0,
      }).success).toBe(true);
    });

    it('should accept optional avgDaysToCompletion', () => {
      expect(LabPipelineSchema.safeParse({
        ordered: [validLabPipelineItem()],
        kitSent: [],
        sampleReceived: [],
        resultsPending: [],
        resultsReviewed: [],
        totalCount: 1,
        avgDaysToCompletion: 14.3,
      }).success).toBe(true);
    });
  });

  // ============================================================================
  // LEAD PIPELINE
  // ============================================================================

  describe('LeadPipelineItemSchema', () => {
    it('should accept a valid lead pipeline item', () => {
      expect(LeadPipelineItemSchema.safeParse(validLeadPipelineItem()).success).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(LeadPipelineItemSchema.safeParse({
        ...validLeadPipelineItem(),
        email: 'not-an-email',
      }).success).toBe(false);
    });

    it('should reject invalid stage', () => {
      expect(LeadPipelineItemSchema.safeParse({
        ...validLeadPipelineItem(),
        stage: 'PROSPECT',
      }).success).toBe(false);
    });
  });

  describe('LeadListParamsSchema', () => {
    it('should accept empty params (all optional with defaults)', () => {
      const result = LeadListParamsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(25);
      }
    });

    it('should coerce string page and limit to numbers', () => {
      const result = LeadListParamsSchema.safeParse({ page: '2', limit: '50' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(50);
      }
    });

    it('should reject limit over 100', () => {
      expect(LeadListParamsSchema.safeParse({ limit: 101 }).success).toBe(false);
    });

    it('should reject page below 1', () => {
      expect(LeadListParamsSchema.safeParse({ page: 0 }).success).toBe(false);
    });

    it('should accept optional stage filter', () => {
      const result = LeadListParamsSchema.safeParse({ stage: 'INQUIRY' });
      expect(result.success).toBe(true);
    });
  });

  // ============================================================================
  // SALES FUNNEL
  // ============================================================================

  describe('SalesFunnelSchema', () => {
    it('should accept a valid sales funnel with empty arrays', () => {
      const result = SalesFunnelSchema.safeParse({
        stages: {
          inquiry: [],
          consultationBooked: [],
          consultationCompleted: [],
          proposalSent: [],
          activeMember: [],
          churned: [],
        },
        counts: {
          inquiry: 0,
          consultationBooked: 0,
          consultationCompleted: 0,
          proposalSent: 0,
          activeMember: 0,
          churned: 0,
          total: 0,
        },
        conversionRates: {
          inquiryToConsultation: 30,
          consultationToProposal: 60,
          proposalToMember: 80,
          overallConversion: 20,
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject conversion rate above 100', () => {
      expect(SalesFunnelSchema.safeParse({
        stages: {
          inquiry: [],
          consultationBooked: [],
          consultationCompleted: [],
          proposalSent: [],
          activeMember: [],
          churned: [],
        },
        counts: { inquiry: 0, consultationBooked: 0, consultationCompleted: 0, proposalSent: 0, activeMember: 0, churned: 0, total: 0 },
        conversionRates: { inquiryToConsultation: 101, consultationToProposal: 60, proposalToMember: 80, overallConversion: 20 },
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // RISK FACTORS
  // ============================================================================

  describe('RISK_FACTORS', () => {
    it('should contain exactly 9 risk factors', () => {
      expect(RISK_FACTORS).toHaveLength(9);
    });

    it('should contain all expected risk factors', () => {
      expect(RISK_FACTORS).toContain('low_compliance');
      expect(RISK_FACTORS).toContain('no_recent_activity');
      expect(RISK_FACTORS).toContain('missed_appointments');
      expect(RISK_FACTORS).toContain('declining_engagement');
      expect(RISK_FACTORS).toContain('expired_sessions');
      expect(RISK_FACTORS).toContain('sessions_expiring_soon');
      expect(RISK_FACTORS).toContain('no_wearable_sync');
      expect(RISK_FACTORS).toContain('low_nutrition_logging');
    });

    it.each(RISK_FACTORS)('RiskFactorSchema should accept: %s', (value) => {
      expect(RiskFactorSchema.safeParse(value).success).toBe(true);
    });

    it('RiskFactorSchema should reject invalid values', () => {
      expect(RiskFactorSchema.safeParse('bad_actor').success).toBe(false);
      expect(RiskFactorSchema.safeParse('LOW_COMPLIANCE').success).toBe(false);
      expect(RiskFactorSchema.safeParse('').success).toBe(false);
    });

    it('should have labels for all risk factors', () => {
      for (const factor of RISK_FACTORS) {
        expect(RISK_FACTOR_LABELS[factor]).toBeDefined();
        expect(RISK_FACTOR_LABELS[factor].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // CHURN RISK LEVELS
  // ============================================================================

  describe('CHURN_RISK_LEVELS', () => {
    it('should contain exactly 4 risk levels', () => {
      expect(CHURN_RISK_LEVELS).toHaveLength(4);
    });

    it('should contain LOW, MEDIUM, HIGH, CRITICAL', () => {
      expect(CHURN_RISK_LEVELS).toContain('LOW');
      expect(CHURN_RISK_LEVELS).toContain('MEDIUM');
      expect(CHURN_RISK_LEVELS).toContain('HIGH');
      expect(CHURN_RISK_LEVELS).toContain('CRITICAL');
    });

    it.each(CHURN_RISK_LEVELS)('ChurnRiskLevelSchema should accept: %s', (value) => {
      expect(ChurnRiskLevelSchema.safeParse(value).success).toBe(true);
    });

    it('ChurnRiskLevelSchema should reject invalid values', () => {
      expect(ChurnRiskLevelSchema.safeParse('EXTREME').success).toBe(false);
      expect(ChurnRiskLevelSchema.safeParse('low').success).toBe(false);
    });

    it('should have constants matching all risk levels', () => {
      expect(CHURN_RISK_LEVEL.LOW).toBe('LOW');
      expect(CHURN_RISK_LEVEL.MEDIUM).toBe('MEDIUM');
      expect(CHURN_RISK_LEVEL.HIGH).toBe('HIGH');
      expect(CHURN_RISK_LEVEL.CRITICAL).toBe('CRITICAL');
    });
  });

  // ============================================================================
  // calculateChurnRiskLevel
  // ============================================================================

  describe('calculateChurnRiskLevel', () => {
    describe('CONCIERGE tier (thresholds: MEDIUM=2, HIGH=4, CRITICAL=7)', () => {
      it('should return LOW for 0 days inactive', () => {
        expect(calculateChurnRiskLevel('CONCIERGE', 0)).toBe('LOW');
      });

      it('should return LOW for exactly 2 days inactive (threshold is >2)', () => {
        expect(calculateChurnRiskLevel('CONCIERGE', 2)).toBe('LOW');
      });

      it('should return MEDIUM for 3 days inactive (> MEDIUM threshold of 2)', () => {
        expect(calculateChurnRiskLevel('CONCIERGE', 3)).toBe('MEDIUM');
      });

      it('should return HIGH for 5 days inactive (> HIGH threshold of 4)', () => {
        expect(calculateChurnRiskLevel('CONCIERGE', 5)).toBe('HIGH');
      });

      it('should return CRITICAL for 8 days inactive (> CRITICAL threshold of 7)', () => {
        expect(calculateChurnRiskLevel('CONCIERGE', 8)).toBe('CRITICAL');
      });
    });

    describe('CORE tier (thresholds: MEDIUM=4, HIGH=7, CRITICAL=14)', () => {
      it('should return LOW for 4 days inactive (threshold is >4)', () => {
        expect(calculateChurnRiskLevel('CORE', 4)).toBe('LOW');
      });

      it('should return MEDIUM for 5 days inactive', () => {
        expect(calculateChurnRiskLevel('CORE', 5)).toBe('MEDIUM');
      });

      it('should return HIGH for 8 days inactive', () => {
        expect(calculateChurnRiskLevel('CORE', 8)).toBe('HIGH');
      });

      it('should return CRITICAL for 15 days inactive', () => {
        expect(calculateChurnRiskLevel('CORE', 15)).toBe('CRITICAL');
      });
    });

    describe('ESSENTIALS tier (thresholds: MEDIUM=7, HIGH=14, CRITICAL=21)', () => {
      it('should return LOW for 7 days inactive (threshold is >7)', () => {
        expect(calculateChurnRiskLevel('ESSENTIALS', 7)).toBe('LOW');
      });

      it('should return MEDIUM for 8 days inactive', () => {
        expect(calculateChurnRiskLevel('ESSENTIALS', 8)).toBe('MEDIUM');
      });

      it('should return HIGH for 15 days inactive', () => {
        expect(calculateChurnRiskLevel('ESSENTIALS', 15)).toBe('HIGH');
      });

      it('should return CRITICAL for 22 days inactive', () => {
        expect(calculateChurnRiskLevel('ESSENTIALS', 22)).toBe('CRITICAL');
      });
    });

    it('gives TRAINING (4 sessions/month) the most lenient thresholds', () => {
      expect(calculateChurnRiskLevel('TRAINING', 10)).toBe('LOW');
      expect(calculateChurnRiskLevel('TRAINING', 11)).toBe('MEDIUM');
      expect(calculateChurnRiskLevel('TRAINING', 18)).toBe('HIGH');
      expect(calculateChurnRiskLevel('TRAINING', 25)).toBe('CRITICAL');
      expect(TIER_CHURN_THRESHOLDS.TRAINING.CRITICAL).toBeGreaterThan(
        TIER_CHURN_THRESHOLDS.ESSENTIALS.CRITICAL,
      );
    });

    it('TIER_CHURN_THRESHOLDS should have stricter thresholds for CONCIERGE than ESSENTIALS', () => {
      expect(TIER_CHURN_THRESHOLDS.CONCIERGE.CRITICAL).toBeLessThan(TIER_CHURN_THRESHOLDS.ESSENTIALS.CRITICAL);
    });
  });

  // ============================================================================
  // CRM ANALYTICS
  // ============================================================================

  describe('CRMAnalyticsSchema', () => {
    it('should accept a valid CRM analytics response', () => {
      const result = CRMAnalyticsSchema.safeParse({
        retentionCohorts: [{
          month: '2024-01',
          cohortSize: 50,
          retentionMonth1: 80,
          retentionMonth3: 60,
          retentionMonth6: 45,
          retentionMonth12: 30,
        }],
        churnRisks: [{
          patientId: 'patient-001',
          patientName: 'Bob',
          lastLoginDate: NOW_ISO,
          daysSinceLastLogin: 3,
          riskLevel: 'MEDIUM',
        }],
        revenueByTier: [{
          tierName: 'CORE',
          patientCount: 80,
          monthlyRevenue: 32000,
          churnRate: 5,
        }],
        totalActivePatients: 120,
        averageEngagementScore: 74,
      });
      expect(result.success).toBe(true);
    });

    it('should reject totalActivePatients below 0', () => {
      expect(CRMAnalyticsSchema.safeParse({
        retentionCohorts: [],
        churnRisks: [],
        revenueByTier: [],
        totalActivePatients: -1,
        averageEngagementScore: 74,
      }).success).toBe(false);
    });

    it('should reject averageEngagementScore above 100', () => {
      expect(CRMAnalyticsSchema.safeParse({
        retentionCohorts: [],
        churnRisks: [],
        revenueByTier: [],
        totalActivePatients: 0,
        averageEngagementScore: 101,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // AT-RISK CLIENT
  // ============================================================================

  describe('AtRiskClientSchema', () => {
    it('should accept a valid at-risk client', () => {
      expect(AtRiskClientSchema.safeParse(validAtRiskClient()).success).toBe(true);
    });

    it('should accept optional expiring session fields', () => {
      expect(AtRiskClientSchema.safeParse({
        ...validAtRiskClient(),
        riskFactors: ['sessions_expiring_soon'],
        expiringSessionsCount: 3,
        expiringSessionsDays: 7,
        expiringSessionsDate: NOW_ISO,
      }).success).toBe(true);
    });

    it('should reject invalid risk factor', () => {
      expect(AtRiskClientSchema.safeParse({
        ...validAtRiskClient(),
        riskFactors: ['not_a_factor'],
      }).success).toBe(false);
    });

    it('should reject invalid email', () => {
      expect(AtRiskClientSchema.safeParse({
        ...validAtRiskClient(),
        email: 'bad-email',
      }).success).toBe(false);
    });

    it('should reject complianceScore outside 0-100', () => {
      expect(AtRiskClientSchema.safeParse({
        ...validAtRiskClient(),
        complianceScore: -1,
      }).success).toBe(false);
    });
  });

  describe('AtRiskClientsResponseSchema', () => {
    it('should accept a valid at-risk response', () => {
      expect(AtRiskClientsResponseSchema.safeParse({
        clients: [validAtRiskClient()],
        totalAtRisk: 1,
        criticalCount: 0,
        highCount: 1,
        moderateCount: 0,
      }).success).toBe(true);
    });
  });

  // ============================================================================
  // TRAINING LIMITATIONS
  // ============================================================================

  describe('TRAINING_LIMITATIONS', () => {
    it('should contain exactly 8 training limitations', () => {
      expect(TRAINING_LIMITATIONS).toHaveLength(8);
    });

    it('should contain all expected limitations', () => {
      expect(TRAINING_LIMITATIONS).toContain('cardiovascular');
      expect(TRAINING_LIMITATIONS).toContain('musculoskeletal');
      expect(TRAINING_LIMITATIONS).toContain('respiratory');
      expect(TRAINING_LIMITATIONS).toContain('metabolic');
      expect(TRAINING_LIMITATIONS).toContain('neurological');
      expect(TRAINING_LIMITATIONS).toContain('recovery');
      expect(TRAINING_LIMITATIONS).toContain('medication');
      expect(TRAINING_LIMITATIONS).toContain('other');
    });

    it.each(TRAINING_LIMITATIONS)('TrainingLimitationSchema should accept: %s', (value) => {
      expect(TrainingLimitationSchema.safeParse(value).success).toBe(true);
    });

    it('TrainingLimitationSchema should reject invalid values', () => {
      expect(TrainingLimitationSchema.safeParse('CARDIOVASCULAR').success).toBe(false);
      expect(TrainingLimitationSchema.safeParse('injury').success).toBe(false);
      expect(TrainingLimitationSchema.safeParse('').success).toBe(false);
    });

    it('should have labels for all limitations', () => {
      for (const limitation of TRAINING_LIMITATIONS) {
        expect(TRAINING_LIMITATION_LABELS[limitation]).toBeDefined();
        expect(TRAINING_LIMITATION_LABELS[limitation].length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // TRAINING LIMITATION DETAIL
  // ============================================================================

  describe('TrainingLimitationDetailSchema', () => {
    it('should accept a valid limitation detail', () => {
      expect(TrainingLimitationDetailSchema.safeParse({
        category: 'musculoskeletal',
        description: 'Avoid overhead pressing - shoulder impingement',
        severity: 'avoid',
        expiresAt: null,
        addedAt: NOW_ISO,
        addedBy: 'Dr. Smith',
      }).success).toBe(true);
    });

    it('should accept caution and monitor severity values', () => {
      expect(TrainingLimitationDetailSchema.safeParse({
        category: 'cardiovascular',
        description: 'Monitor HR during aerobic work',
        severity: 'monitor',
        expiresAt: NOW_ISO,
        addedAt: NOW_ISO,
        addedBy: 'Dr. Jones',
      }).success).toBe(true);
    });

    it('should reject invalid severity', () => {
      expect(TrainingLimitationDetailSchema.safeParse({
        category: 'metabolic',
        description: 'Check blood sugar',
        severity: 'warning',
        expiresAt: null,
        addedAt: NOW_ISO,
        addedBy: 'Dr. Brown',
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // HEART RATE ZONES
  // ============================================================================

  describe('HeartRateZonesSchema', () => {
    it('should require notes while allowing all numeric zone fields to remain optional', () => {
      expect(
        HeartRateZonesSchema.safeParse({ notes: null }).success,
      ).toBe(true);
    });

    it('should accept a fully populated heart rate zones object', () => {
      expect(HeartRateZonesSchema.safeParse({
        restingHR: 55,
        maxHR: 185,
        zone1: { min: 93, max: 111 },
        zone2: { min: 111, max: 130 },
        zone3: { min: 130, max: 148 },
        zone4: { min: 148, max: 166 },
        zone5: { min: 166, max: 185 },
        notes: 'Keep below zone 4 until cleared by cardiologist',
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should accept null notes', () => {
      expect(HeartRateZonesSchema.safeParse({ notes: null }).success).toBe(true);
    });
  });

  // ============================================================================
  // TRAINING RELEVANT SUMMARY
  // ============================================================================

  describe('TrainingRelevantSummarySchema', () => {
    it('should accept a valid training relevant summary', () => {
      const result = TrainingRelevantSummarySchema.safeParse({
        userId: 'user-123',
        limitations: [{
          category: 'musculoskeletal',
          description: 'Shoulder issue',
          severity: 'avoid',
          expiresAt: null,
          addedAt: NOW_ISO,
          addedBy: 'Dr. Smith',
        }],
        heartRateZones: null,
        avoidMovements: ['overhead press', 'pull-ups'],
        clearedActivities: ['walking', 'cycling'],
        clinicianNotes: 'Monitor progress closely.',
        requiresWarmupExtension: true,
        requiresCooldownExtension: false,
        requiresFrequentBreaks: false,
        requiresHRMonitoring: true,
        lastUpdatedAt: NOW_ISO,
        lastUpdatedBy: 'Dr. Smith',
      });
      expect(result.success).toBe(true);
    });

    it('should apply defaults for boolean flag fields', () => {
      const result = TrainingRelevantSummarySchema.safeParse({
        userId: 'user-123',
        limitations: [],
        heartRateZones: null,
        avoidMovements: [],
        clearedActivities: [],
        clinicianNotes: null,
        lastUpdatedAt: NOW_ISO,
        lastUpdatedBy: 'Dr. Smith',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requiresWarmupExtension).toBe(false);
        expect(result.data.requiresCooldownExtension).toBe(false);
        expect(result.data.requiresFrequentBreaks).toBe(false);
        expect(result.data.requiresHRMonitoring).toBe(false);
      }
    });

    it('should reject invalid limitation category', () => {
      expect(TrainingRelevantSummarySchema.safeParse({
        userId: 'user-123',
        limitations: [{
          category: 'INJURY',
          description: 'Something',
          severity: 'avoid',
          expiresAt: null,
          addedAt: NOW_ISO,
          addedBy: 'Dr.',
        }],
        heartRateZones: null,
        avoidMovements: [],
        clearedActivities: [],
        clinicianNotes: null,
        lastUpdatedAt: NOW_ISO,
        lastUpdatedBy: 'Dr.',
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // AI CHAT SCHEMAS
  // ============================================================================

  describe('AIChatRoleSchema', () => {
    it('should contain exactly 2 roles', () => {
      expect(AI_CHAT_ROLES).toHaveLength(2);
    });

    it('should accept USER and ASSISTANT', () => {
      expect(AIChatRoleSchema.safeParse('USER').success).toBe(true);
      expect(AIChatRoleSchema.safeParse('ASSISTANT').success).toBe(true);
    });

    it('should reject invalid roles', () => {
      expect(AIChatRoleSchema.safeParse('SYSTEM').success).toBe(false);
      expect(AIChatRoleSchema.safeParse('user').success).toBe(false);
    });
  });

  describe('AIChatMessageSchema', () => {
    it('should accept a valid chat message', () => {
      expect(AIChatMessageSchema.safeParse(validAIChatMessage()).success).toBe(true);
    });

    it('should accept optional attachments and dataPoints', () => {
      expect(AIChatMessageSchema.safeParse({
        ...validAIChatMessage(),
        attachments: [{
          id: 'att-001',
          filename: 'report.pdf',
          mimeType: 'application/pdf',
          size: 204800,
        }],
        dataPoints: [{ key: 'activeUsers', value: '120' }],
      }).success).toBe(true);
    });

    it('should reject invalid role', () => {
      expect(AIChatMessageSchema.safeParse({
        ...validAIChatMessage(),
        role: 'SYSTEM',
      }).success).toBe(false);
    });
  });

  describe('AIChatSessionSchema', () => {
    it('should accept a valid chat session', () => {
      expect(AIChatSessionSchema.safeParse(validAIChatSession()).success).toBe(true);
    });

    it('should accept optional lastMessagePreview', () => {
      expect(AIChatSessionSchema.safeParse({
        ...validAIChatSession(),
        lastMessagePreview: 'Active users this month...',
      }).success).toBe(true);
    });
  });

  describe('AIChatSessionWithMessagesSchema', () => {
    it('should accept a session with messages array', () => {
      expect(AIChatSessionWithMessagesSchema.safeParse({
        ...validAIChatSession(),
        messages: [validAIChatMessage()],
      }).success).toBe(true);
    });

    it('should accept empty messages array', () => {
      expect(AIChatSessionWithMessagesSchema.safeParse({
        ...validAIChatSession(),
        messages: [],
      }).success).toBe(true);
    });
  });

  describe('AIChatSendMessageRequestSchema', () => {
    it('should accept a valid send message request', () => {
      expect(AIChatSendMessageRequestSchema.safeParse({
        content: 'What is the MRR this month?',
      }).success).toBe(true);
    });

    it('should accept optional sessionId and attachments', () => {
      expect(AIChatSendMessageRequestSchema.safeParse({
        sessionId: 'session-abc',
        content: 'Show compliance trends',
        attachments: [{
          filename: 'data.csv',
          mimeType: 'text/csv',
          base64: 'dGVzdA==',
        }],
      }).success).toBe(true);
    });

    it('should reject content over 2000 characters', () => {
      expect(AIChatSendMessageRequestSchema.safeParse({
        content: 'a'.repeat(2001),
      }).success).toBe(false);
    });

    it('should reject empty content', () => {
      expect(AIChatSendMessageRequestSchema.safeParse({
        content: '',
      }).success).toBe(false);
    });

    it('should reject more than 5 attachments', () => {
      expect(AIChatSendMessageRequestSchema.safeParse({
        content: 'test',
        attachments: Array(6).fill({ filename: 'f.pdf', mimeType: 'application/pdf', base64: 'dA==' }),
      }).success).toBe(false);
    });
  });

  describe('AIChatSendMessageResponseSchema', () => {
    it('should accept a valid send message response', () => {
      expect(AIChatSendMessageResponseSchema.safeParse({
        session: validAIChatSession(),
        userMessage: validAIChatMessage(),
        assistantMessage: {
          ...validAIChatMessage(),
          id: 'msg-002',
          role: 'ASSISTANT',
          content: 'The MRR this month is $48,000.',
        },
      }).success).toBe(true);
    });
  });

  // ============================================================================
  // REFERRAL NODE (recursive)
  // ============================================================================

  describe('ReferralNodeSchema', () => {
    it('should accept a leaf referral node with no children', () => {
      const result = ReferralNodeSchema.safeParse({
        id: 'user-001',
        name: 'Alice',
        email: 'alice@example.com',
        tier: 'CORE',
        isActiveMember: true,
        directReferralCount: 0,
        totalReferralCount: 0,
        leadStage: null,
        joinedAt: NOW_ISO,
        referrals: [],
      });
      expect(result.success).toBe(true);
    });

    it('should accept a recursive node with nested children', () => {
      const leafNode = {
        id: 'user-002',
        name: 'Bob',
        email: 'bob@example.com',
        tier: null,
        isActiveMember: false,
        directReferralCount: 0,
        totalReferralCount: 0,
        leadStage: 'INQUIRY' as const,
        joinedAt: NOW_ISO,
        referrals: [],
      };
      const result = ReferralNodeSchema.safeParse({
        id: 'user-001',
        name: 'Alice',
        email: 'alice@example.com',
        tier: 'CORE',
        isActiveMember: true,
        directReferralCount: 1,
        totalReferralCount: 1,
        leadStage: null,
        joinedAt: NOW_ISO,
        referrals: [leafNode],
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(ReferralNodeSchema.safeParse({
        id: 'user-001',
        name: 'Alice',
        email: 'not-an-email',
        tier: null,
        isActiveMember: false,
        directReferralCount: 0,
        totalReferralCount: 0,
        leadStage: null,
        joinedAt: NOW_ISO,
        referrals: [],
      }).success).toBe(false);
    });

    it('should reject invalid leadStage', () => {
      expect(ReferralNodeSchema.safeParse({
        id: 'user-001',
        name: 'Alice',
        email: 'alice@example.com',
        tier: null,
        isActiveMember: false,
        directReferralCount: 0,
        totalReferralCount: 0,
        leadStage: 'PROSPECT',
        joinedAt: NOW_ISO,
        referrals: [],
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // DISPUTE ITEM
  // ============================================================================

  describe('DisputeItemSchema', () => {
    it('should accept a valid dispute item', () => {
      expect(DisputeItemSchema.safeParse({
        id: 'dispute-001',
        stripeDisputeId: 'dp_123',
        stripeChargeId: 'ch_456',
        status: 'NEEDS_RESPONSE',
        reason: 'product_unacceptable',
        amount: 9900,
        userId: 'user-789',
        userName: 'Bob Client',
        userEmail: 'bob@example.com',
        subscriptionId: 'sub_abc',
        subscriptionTier: 'CORE',
        subscriptionStatus: 'active',
        accountSuspendedAt: null,
        accountRestoredAt: null,
        resolution: null,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(true);
    });

    it('should accept all valid dispute statuses', () => {
      const validStatuses = ['NEEDS_RESPONSE', 'UNDER_REVIEW', 'WON', 'LOST'];
      for (const status of validStatuses) {
        expect(DisputeItemSchema.safeParse({
          id: 'dispute-001',
          stripeDisputeId: 'dp_123',
          stripeChargeId: 'ch_456',
          status,
          reason: 'test',
          amount: 100,
          userId: 'user-789',
          userName: null,
          userEmail: null,
          subscriptionId: null,
          subscriptionTier: null,
          subscriptionStatus: null,
          accountSuspendedAt: null,
          accountRestoredAt: null,
          resolution: null,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        }).success).toBe(true);
      }
    });

    it('should reject invalid dispute status', () => {
      expect(DisputeItemSchema.safeParse({
        id: 'dispute-001',
        stripeDisputeId: 'dp_123',
        stripeChargeId: 'ch_456',
        status: 'PENDING',
        reason: 'test',
        amount: 100,
        userId: 'user-789',
        userName: null,
        userEmail: null,
        subscriptionId: null,
        subscriptionTier: null,
        subscriptionStatus: null,
        accountSuspendedAt: null,
        accountRestoredAt: null,
        resolution: null,
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  describe('DisputeListResponseSchema', () => {
    it('should accept a valid paginated disputes list', () => {
      expect(DisputeListResponseSchema.safeParse({
        data: [],
        pagination: { total: 0, limit: 25, offset: 0, hasMore: false },
      }).success).toBe(true);
    });
  });

  // ============================================================================
  // BILLING ANALYTICS RESPONSE SHAPES
  // ============================================================================

  describe('RevenueTrendResponseSchema', () => {
    it('should accept a valid revenue trend response', () => {
      expect(RevenueTrendResponseSchema.safeParse({
        data: [
          { date: '2024-01', revenue: 45000 },
          { date: '2024-02', revenue: 48000 },
        ],
      }).success).toBe(true);
    });

    it('should accept empty data array', () => {
      expect(RevenueTrendResponseSchema.safeParse({ data: [] }).success).toBe(true);
    });
  });

  describe('ChurnMetricsResponseSchema', () => {
    it('should accept a valid churn metrics response', () => {
      expect(ChurnMetricsResponseSchema.safeParse({
        churnRate: 3.5,
        canceledSubscriptions: 4,
        newSubscriptions: 12,
        netGrowth: 8,
      }).success).toBe(true);
    });

    it('should reject non-integer canceledSubscriptions', () => {
      expect(ChurnMetricsResponseSchema.safeParse({
        churnRate: 3.5,
        canceledSubscriptions: 4.5,
        newSubscriptions: 12,
        netGrowth: 8,
      }).success).toBe(false);
    });
  });

  describe('LTVMetricsResponseSchema', () => {
    it('should accept a valid LTV metrics response', () => {
      expect(LTVMetricsResponseSchema.safeParse({
        overallAverageLTVCents: 360000,
        overallAverageLifetimeMonths: 24.5,
        byTier: [
          { tier: 'CONCIERGE', averageLTVCents: 720000, totalCustomers: 15 },
          { tier: 'CORE', averageLTVCents: 360000, totalCustomers: 80 },
          { tier: 'ESSENTIALS', averageLTVCents: 180000, totalCustomers: 25 },
        ],
      }).success).toBe(true);
    });

    it('should reject non-integer averageLTVCents', () => {
      expect(LTVMetricsResponseSchema.safeParse({
        overallAverageLTVCents: 360000.50,
        overallAverageLifetimeMonths: 24,
        byTier: [],
      }).success).toBe(false);
    });
  });
});
