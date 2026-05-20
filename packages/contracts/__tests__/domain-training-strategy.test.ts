/**
 * @ai-context Training Strategy Domain Contracts Tests
 *
 * This test suite verifies:
 * 1. VolumeLevel re-exports (from primitives)
 * 2. DetailedStrategyGoalSchema: valid/invalid data
 * 3. DetailedTrainingPhaseSchema: valid/invalid data
 * 4. DetailedTrainingStrategySchema: full strategy
 * 5. Create/update schemas
 * 6. GoalSyncResultSchema, SyncAllGoalsResultSchema
 * 7. Draft schemas (goal, phase, strategy)
 * 8. AI generation progress/result schemas
 * 9. calculateGoalProgress helper function
 * 10. calculateStrategyProgress helper function
 * 11. getCurrentPhase helper
 * 12. Mock factories
 *
 * Run: npx jest shared/contracts/__tests__/domain-training-strategy.test.ts
 */

import {
  calculateGoalProgress,
  calculateStrategyProgress,
  createMockDetailedStrategyGoal,
  createMockDetailedTrainingPhase,
  createMockDetailedTrainingStrategy,
  createMockStrategyDraft,
  createMockStrategyGenerationResult,
  createMockStrategyClarificationNeeded,
  CreateDetailedStrategyGoalSchema,
  CreateDetailedTrainingPhaseSchema,
  CreateDetailedTrainingStrategySchema,
  DetailedStrategyGoalSchema,
  DetailedTrainingPhaseSchema,
  DetailedTrainingStrategySchema,
  GOAL_SYNC_ERROR_CODES,
  getCurrentPhase,
  GoalSyncResultSchema,
  VOLUME_LEVEL,
  VOLUME_LEVELS,
  StrategyDraftSchema,
  StrategyGenerationActivitySchema,
  StrategyGenerationProgressSchema,
  StrategyGenerationResponseSchema,
  StrategyGenerationResultSchema,
  StrategyClarificationNeededSchema,
  SyncAllGoalsResultSchema,
  TrainingPhaseDraftSchema,
  UpdateDetailedTrainingStrategySchema,
  VolumeLevelSchema,
} from '../domain/training-strategy';

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();
const TODAY = NOW_ISO.slice(0, 10);
const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';
const STRATEGY_UUID = '223e4567-e89b-12d3-a456-426614174001';

function validGoal() {
  return {
    id: VALID_UUID,
    strategyId: STRATEGY_UUID,
    goalMetric: 'squat_1rm',
    goalCategory: 'fitness' as const,
    goalUnit: 'lbs',
    goalDirection: 'higher_better' as const,
    goalTarget: 315,
    weight: 1.0,
    dataSource: 'manual' as const,
    progressPercent: 50,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

function validPhase() {
  return {
    id: VALID_UUID,
    strategyId: STRATEGY_UUID,
    name: 'Accumulation',
    order: 0,
    weekCount: 4,
    focusAreas: ['hypertrophy', 'technique'],
    isActive: false,
    isCompleted: false,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

// ============================================================================
// VOLUME LEVEL
// ============================================================================

describe('Training Strategy Domain Contracts', () => {
  describe('VolumeLevel (re-export from primitives)', () => {
    it('should have expected volume levels', () => {
      expect(VOLUME_LEVELS).toContain('low');
      expect(VOLUME_LEVELS).toContain('moderate');
      expect(VOLUME_LEVELS).toContain('high');
    });

    it.each(VOLUME_LEVELS)('schema should accept: %s', (value) => {
      expect(VolumeLevelSchema.safeParse(value).success).toBe(true);
    });

    it('should have constants for volume levels', () => {
      expect(VOLUME_LEVEL.LOW).toBe('low');
      expect(VOLUME_LEVEL.MODERATE).toBe('moderate');
      expect(VOLUME_LEVEL.HIGH).toBe('high');
    });
  });

  // ============================================================================
  // DETAILED STRATEGY GOAL
  // ============================================================================

  describe('DetailedStrategyGoalSchema', () => {
    it('should accept a valid strategy goal', () => {
      expect(DetailedStrategyGoalSchema.safeParse(validGoal()).success).toBe(true);
    });

    it('should accept null optional fields', () => {
      const result = DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        linkedExerciseId: null,
        baselineValue: null,
        currentValue: null,
        dataKey: null,
        notes: null,
      });
      expect(result.success).toBe(true);
    });

    it('should reject weight outside 0.1-10 range', () => {
      expect(DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        weight: 0,
      }).success).toBe(false);

      expect(DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        weight: 10.1,
      }).success).toBe(false);
    });

    it('should reject progressPercent outside 0-100', () => {
      expect(DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        progressPercent: -1,
      }).success).toBe(false);

      expect(DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        progressPercent: 101,
      }).success).toBe(false);
    });

    it('should reject empty goalMetric string', () => {
      expect(DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        goalMetric: '',
      }).success).toBe(false);
    });

    it('should reject invalid goalDirection', () => {
      expect(DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        goalDirection: 'neutral',
      }).success).toBe(false);
    });

    it('should reject invalid UUID for id', () => {
      expect(DetailedStrategyGoalSchema.safeParse({
        ...validGoal(),
        id: 'not-a-uuid',
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // DETAILED TRAINING PHASE
  // ============================================================================

  describe('DetailedTrainingPhaseSchema', () => {
    it('should accept a valid training phase', () => {
      expect(DetailedTrainingPhaseSchema.safeParse(validPhase()).success).toBe(true);
    });

    it('should accept optional volumeLevel, intensityRange, startDate, endDate', () => {
      const result = DetailedTrainingPhaseSchema.safeParse({
        ...validPhase(),
        volumeLevel: 'high',
        intensityRange: '65-75% 1RM',
        startDate: TODAY,
        endDate: TODAY,
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-positive weekCount', () => {
      expect(DetailedTrainingPhaseSchema.safeParse({
        ...validPhase(),
        weekCount: 0,
      }).success).toBe(false);
    });

    it('should reject negative order', () => {
      expect(DetailedTrainingPhaseSchema.safeParse({
        ...validPhase(),
        order: -1,
      }).success).toBe(false);
    });

    it('should reject empty name', () => {
      expect(DetailedTrainingPhaseSchema.safeParse({
        ...validPhase(),
        name: '',
      }).success).toBe(false);
    });

    it('should reject invalid volumeLevel', () => {
      expect(DetailedTrainingPhaseSchema.safeParse({
        ...validPhase(),
        volumeLevel: 'extreme',
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // DETAILED TRAINING STRATEGY
  // ============================================================================

  describe('DetailedTrainingStrategySchema', () => {
    it('should accept a valid strategy', () => {
      const result = DetailedTrainingStrategySchema.safeParse({
        id: STRATEGY_UUID,
        userId: 'user-123',
        name: '12-Week Strength Block',
        type: 'BLOCK',
        goal: 'Increase squat 1RM to 315lbs',
        startDate: TODAY,
        status: 'ACTIVE',
        goals: [validGoal()],
        overallProgress: 35,
        phases: [validPhase()],
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should accept strategy with empty goals and phases', () => {
      const result = DetailedTrainingStrategySchema.safeParse({
        id: STRATEGY_UUID,
        userId: 'user-123',
        name: 'New Strategy',
        type: 'LINEAR_PROGRESSION',
        goal: 'Lose body fat',
        startDate: TODAY,
        status: 'ACTIVE',
        goals: [],
        overallProgress: 0,
        phases: [],
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should reject overallProgress outside 0-100', () => {
      expect(DetailedTrainingStrategySchema.safeParse({
        id: STRATEGY_UUID,
        userId: 'user-123',
        name: 'Strategy',
        type: 'BLOCK',
        goal: 'Goal',
        startDate: TODAY,
        status: 'ACTIVE',
        goals: [],
        overallProgress: 101,
        phases: [],
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(false);
    });

    it('should reject empty goal string', () => {
      expect(DetailedTrainingStrategySchema.safeParse({
        id: STRATEGY_UUID,
        userId: 'user-123',
        name: 'Strategy',
        type: 'BLOCK',
        goal: '',
        startDate: TODAY,
        status: 'ACTIVE',
        goals: [],
        overallProgress: 0,
        phases: [],
        createdAt: NOW_ISO,
        updatedAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // CREATE/UPDATE SCHEMAS
  // ============================================================================

  describe('CreateDetailedStrategyGoalSchema', () => {
    it('should omit id, strategyId, progressPercent, timestamps', () => {
      const { id: _i, strategyId: _s, progressPercent: _p, createdAt: _c, updatedAt: _u, ...createFields } = validGoal();
      expect(CreateDetailedStrategyGoalSchema.safeParse(createFields).success).toBe(true);
    });
  });

  describe('CreateDetailedTrainingPhaseSchema', () => {
    it('should omit id, strategyId, and timestamps', () => {
      const { id: _i, strategyId: _s, createdAt: _c, updatedAt: _u, ...createFields } = validPhase();
      expect(CreateDetailedTrainingPhaseSchema.safeParse(createFields).success).toBe(true);
    });
  });

  describe('CreateDetailedTrainingStrategySchema', () => {
    it('should accept a valid create payload', () => {
      const result = CreateDetailedTrainingStrategySchema.safeParse({
        userId: 'user-123',
        name: 'New Strategy',
        type: 'BLOCK',
        goal: 'Gain strength',
        startDate: TODAY,
        status: 'ACTIVE',
        goals: [],
        phases: [],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('UpdateDetailedTrainingStrategySchema', () => {
    it('should accept an empty partial update', () => {
      expect(UpdateDetailedTrainingStrategySchema.safeParse({}).success).toBe(true);
    });

    it('should accept partial update with single field', () => {
      expect(UpdateDetailedTrainingStrategySchema.safeParse({
        status: 'COMPLETED',
      }).success).toBe(true);
    });
  });

  // ============================================================================
  // GOAL SYNC SCHEMAS
  // ============================================================================

  describe('GOAL_SYNC_ERROR_CODES', () => {
    it('should contain all expected error codes', () => {
      expect(GOAL_SYNC_ERROR_CODES).toContain('NO_DATA');
      expect(GOAL_SYNC_ERROR_CODES).toContain('MISSING_EXERCISE_LINK');
      expect(GOAL_SYNC_ERROR_CODES).toContain('UNKNOWN_DATA_SOURCE');
      expect(GOAL_SYNC_ERROR_CODES).toContain('FETCH_FAILED');
    });
  });

  describe('GoalSyncResultSchema', () => {
    it('should accept a successful sync result', () => {
      const result = GoalSyncResultSchema.safeParse({
        goalId: VALID_UUID,
        goalMetric: 'squat_1rm',
        success: true,
        previousValue: 275,
        newValue: 285,
        dataSource: 'manual',
        dataKey: 'squat_1rm',
        lastDataDate: TODAY,
      });
      expect(result.success).toBe(true);
    });

    it('should accept a failed sync result', () => {
      const result = GoalSyncResultSchema.safeParse({
        goalId: VALID_UUID,
        goalMetric: 'body_fat_percent',
        success: false,
        error: 'No data available for the last 30 days',
        dataSource: 'biometric',
        dataKey: null,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty goalMetric', () => {
      expect(GoalSyncResultSchema.safeParse({
        goalId: VALID_UUID,
        goalMetric: '',
        success: true,
        dataSource: 'manual',
      }).success).toBe(false);
    });
  });

  describe('SyncAllGoalsResultSchema', () => {
    it('should accept a valid sync all result', () => {
      const result = SyncAllGoalsResultSchema.safeParse({
        strategyId: STRATEGY_UUID,
        syncedCount: 3,
        failedCount: 1,
        skippedCount: 0,
        results: [],
        syncedAt: NOW_ISO,
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative counts', () => {
      expect(SyncAllGoalsResultSchema.safeParse({
        strategyId: STRATEGY_UUID,
        syncedCount: -1,
        failedCount: 0,
        skippedCount: 0,
        results: [],
        syncedAt: NOW_ISO,
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // DRAFT SCHEMAS
  // ============================================================================

  describe('TrainingPhaseDraftSchema', () => {
    it('should accept a valid phase draft', () => {
      const result = TrainingPhaseDraftSchema.safeParse({
        name: 'Accumulation',
        order: 0,
        weekCount: 4,
        focusAreas: ['hypertrophy'],
        isActive: false,
        isCompleted: false,
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-positive weekCount', () => {
      expect(TrainingPhaseDraftSchema.safeParse({
        name: 'Phase',
        order: 0,
        weekCount: 0,
        focusAreas: [],
        isActive: false,
        isCompleted: false,
      }).success).toBe(false);
    });
  });

  describe('StrategyDraftSchema', () => {
    it('should accept a valid strategy draft', () => {
      const result = StrategyDraftSchema.safeParse({
        name: '12-Week Block',
        type: 'BLOCK',
        goal: 'Increase 1RM',
        startDate: TODAY,
        status: 'ACTIVE',
        goals: [{ goalMetric: 'squat_1rm', goalTarget: 315 }],
      });
      expect(result.success).toBe(true);
    });

    it('should reject draft with empty goals array', () => {
      expect(StrategyDraftSchema.safeParse({
        name: 'Strategy',
        type: 'BLOCK',
        goal: 'Goal',
        startDate: TODAY,
        status: 'ACTIVE',
        goals: [], // min(1) violation
      }).success).toBe(false);
    });
  });

  // ============================================================================
  // AI GENERATION SCHEMAS
  // ============================================================================

  describe('StrategyGenerationActivitySchema', () => {
    it('should accept a valid activity entry', () => {
      const result = StrategyGenerationActivitySchema.safeParse({
        timestamp: NOW_ISO,
        type: 'search',
        message: 'Searching for exercises matching client goals',
        data: { exerciseName: 'squat', count: 3 },
      });
      expect(result.success).toBe(true);
    });

    it('should accept an activity without data', () => {
      const result = StrategyGenerationActivitySchema.safeParse({
        timestamp: NOW_ISO,
        type: 'thinking',
        message: 'Analyzing client context',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid activity type', () => {
      expect(StrategyGenerationActivitySchema.safeParse({
        timestamp: NOW_ISO,
        type: 'pause',
        message: 'Pausing',
      }).success).toBe(false);
    });
  });

  describe('StrategyGenerationProgressSchema', () => {
    it('should accept a valid progress update', () => {
      const result = StrategyGenerationProgressSchema.safeParse({
        step: 2,
        totalSteps: 5,
        phase: 'planning',
        detail: 'Creating training phases',
      });
      expect(result.success).toBe(true);
    });

    it('should accept with stats', () => {
      const result = StrategyGenerationProgressSchema.safeParse({
        step: 3,
        totalSteps: 5,
        phase: 'creating',
        stats: {
          goalsIdentified: 2,
          phasesCreated: 3,
          exercisesSearched: 10,
          exercisesCreated: 2,
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-positive totalSteps', () => {
      expect(StrategyGenerationProgressSchema.safeParse({
        step: 0,
        totalSteps: 0,
        phase: 'analyzing',
      }).success).toBe(false);
    });
  });

  describe('StrategyGenerationResultSchema', () => {
    it('should accept a valid generation result', () => {
      const draft = createMockStrategyDraft();
      const result = StrategyGenerationResultSchema.safeParse({
        needsClarification: false,
        strategy: draft,
        reasoning: 'Generated based on client profile',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when needsClarification is true', () => {
      expect(StrategyGenerationResultSchema.safeParse({
        needsClarification: true,
        strategy: createMockStrategyDraft(),
        reasoning: 'Reasoning',
      }).success).toBe(false);
    });
  });

  describe('StrategyClarificationNeededSchema', () => {
    it('should accept a valid clarification needed response', () => {
      const result = StrategyClarificationNeededSchema.safeParse({
        needsClarification: true,
        questions: ['What is your primary goal?', 'How many days per week?'],
        requestId: VALID_UUID,
      });
      expect(result.success).toBe(true);
    });

    it('should reject when needsClarification is false', () => {
      expect(StrategyClarificationNeededSchema.safeParse({
        needsClarification: false,
        questions: ['Question?'],
        requestId: VALID_UUID,
      }).success).toBe(false);
    });
  });

  describe('StrategyGenerationResponseSchema (union)', () => {
    it('should accept a result (needsClarification: false)', () => {
      const result = StrategyGenerationResponseSchema.safeParse({
        needsClarification: false,
        strategy: createMockStrategyDraft(),
        reasoning: 'Based on analysis',
      });
      expect(result.success).toBe(true);
    });

    it('should accept clarification needed (needsClarification: true)', () => {
      const result = StrategyGenerationResponseSchema.safeParse({
        needsClarification: true,
        questions: ['What are your goals?'],
        requestId: VALID_UUID,
      });
      expect(result.success).toBe(true);
    });
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  describe('calculateGoalProgress', () => {
    it('should return 0 when baseline is null', () => {
      const goal = createMockDetailedStrategyGoal({ baselineValue: null });
      expect(calculateGoalProgress(goal)).toBe(0);
    });

    it('should return 0 when currentValue is null', () => {
      const goal = createMockDetailedStrategyGoal({ currentValue: null });
      expect(calculateGoalProgress(goal)).toBe(0);
    });

    it('should calculate correct progress for higher_better goal', () => {
      // baseline=200, current=225, target=250 → 50%
      const goal = createMockDetailedStrategyGoal({
        goalDirection: 'higher_better',
        baselineValue: 200,
        currentValue: 225,
        goalTarget: 250,
      });
      expect(calculateGoalProgress(goal)).toBe(50);
    });

    it('should return 100 for higher_better goal that meets/exceeds target', () => {
      const goal = createMockDetailedStrategyGoal({
        goalDirection: 'higher_better',
        baselineValue: 200,
        currentValue: 250,
        goalTarget: 250,
      });
      expect(calculateGoalProgress(goal)).toBe(100);
    });

    it('should calculate correct progress for lower_better goal', () => {
      // baseline=25, current=22, target=20 → 60%
      const goal = createMockDetailedStrategyGoal({
        goalDirection: 'lower_better',
        baselineValue: 25,
        currentValue: 22,
        goalTarget: 20,
      });
      expect(calculateGoalProgress(goal)).toBe(60);
    });

    it('should cap progress at 100', () => {
      const goal = createMockDetailedStrategyGoal({
        goalDirection: 'higher_better',
        baselineValue: 200,
        currentValue: 350,
        goalTarget: 250,
      });
      expect(calculateGoalProgress(goal)).toBe(100);
    });

    it('should not return negative progress', () => {
      const goal = createMockDetailedStrategyGoal({
        goalDirection: 'higher_better',
        baselineValue: 250,
        currentValue: 200,
        goalTarget: 300,
      });
      expect(calculateGoalProgress(goal)).toBeGreaterThanOrEqual(0);
    });

    it('should infer direction from baseline/target for context goals', () => {
      // context: target > baseline → infer higher_better
      const goal = createMockDetailedStrategyGoal({
        goalDirection: 'context',
        baselineValue: 100,
        currentValue: 125,
        goalTarget: 150,
      });
      expect(calculateGoalProgress(goal)).toBe(50);
    });
  });

  describe('calculateStrategyProgress', () => {
    it('should return 0 for strategy with no goals', () => {
      const strategy = createMockDetailedTrainingStrategy({ goals: [] });
      expect(calculateStrategyProgress(strategy)).toBe(0);
    });

    it('should return weighted average of goal progresses', () => {
      const strategy = createMockDetailedTrainingStrategy({
        goals: [
          createMockDetailedStrategyGoal({ progressPercent: 60, weight: 1 }),
          createMockDetailedStrategyGoal({ progressPercent: 40, weight: 1 }),
        ],
      });
      expect(calculateStrategyProgress(strategy)).toBe(50);
    });

    it('should weight goals with different weights correctly', () => {
      const strategy = createMockDetailedTrainingStrategy({
        goals: [
          createMockDetailedStrategyGoal({ progressPercent: 100, weight: 3 }),
          createMockDetailedStrategyGoal({ progressPercent: 0, weight: 1 }),
        ],
      });
      // (100*3 + 0*1) / 4 = 75
      expect(calculateStrategyProgress(strategy)).toBe(75);
    });
  });

  describe('getCurrentPhase', () => {
    it('should return the active phase', () => {
      const activePhase = createMockDetailedTrainingPhase({ isActive: true, order: 1 });
      const strategy = createMockDetailedTrainingStrategy({
        phases: [
          createMockDetailedTrainingPhase({ isActive: false, order: 0 }),
          activePhase,
        ],
      });
      const result = getCurrentPhase(strategy);
      expect(result?.id).toBe(activePhase.id);
    });

    it('should return undefined if no phase is active', () => {
      const strategy = createMockDetailedTrainingStrategy({
        phases: [
          createMockDetailedTrainingPhase({ isActive: false }),
          createMockDetailedTrainingPhase({ isActive: false }),
        ],
      });
      expect(getCurrentPhase(strategy)).toBeUndefined();
    });
  });

  // ============================================================================
  // MOCK FACTORIES
  // ============================================================================

  describe('Mock factories', () => {
    it('createMockDetailedStrategyGoal should produce valid schema data', () => {
      const mock = createMockDetailedStrategyGoal();
      expect(DetailedStrategyGoalSchema.safeParse(mock).success).toBe(true);
    });

    it('createMockDetailedTrainingPhase should produce valid schema data', () => {
      const mock = createMockDetailedTrainingPhase();
      expect(DetailedTrainingPhaseSchema.safeParse(mock).success).toBe(true);
    });

    it('createMockDetailedTrainingStrategy should produce valid schema data', () => {
      const mock = createMockDetailedTrainingStrategy();
      expect(DetailedTrainingStrategySchema.safeParse(mock).success).toBe(true);
    });

    it('createMockStrategyGenerationResult should produce valid schema data', () => {
      const mock = createMockStrategyGenerationResult();
      expect(StrategyGenerationResultSchema.safeParse(mock).success).toBe(true);
    });

    it('createMockStrategyClarificationNeeded should produce valid schema data', () => {
      const mock = createMockStrategyClarificationNeeded();
      expect(StrategyClarificationNeededSchema.safeParse(mock).success).toBe(true);
    });
  });
});
