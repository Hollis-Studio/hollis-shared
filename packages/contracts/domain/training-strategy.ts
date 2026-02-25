/**
 * @ai-context Training strategy detailed contracts | goal sync, drafts, progress calculations, AI generation
 *
 * This module provides the detailed training strategy contracts used across all surfaces:
 * - Detailed strategy goal contracts with full metadata
 * - Goal sync result types
 * - Strategy/goal/phase draft contracts for AI generation
 * - Create/update schemas
 * - Progress calculation helpers
 * - AI strategy generation SSE event contracts
 * - Mock factories for testing
 *
 * IMPORTANT: Enum constants (STRATEGY_TYPE, STRATEGY_STATUS, GOAL_CATEGORY, etc.)
 * and the base TrainingPhaseContract/TrainingStrategyContract/StrategyGoalContract
 * are defined in ./training.ts. This file extends those with detailed contracts.
 *
 * deps: zod, ./common, ./training, ../primitives, ./goal-metrics
 * consumers: mobile app, server, web-admin
 */

import { z } from "zod";
import { VolumeLevelSchema } from "../primitives";
import { baseDocumentSchema, isoDateSchema } from "./common";
import { MetricDefinitionSummarySchema } from "./metric-definition";
import {
    GoalCategorySchema,
    GoalDataSourceSchema,
    GoalDirectionSchema,
    StrategyStatusSchema,
    StrategyTypeSchema,
} from "./training";

// ============================================================================
// VOLUME LEVEL ALIASES (Backward Compatibility)
// ============================================================================

// Re-export volume level types for consumers that import from this module
export {
    VOLUME_LEVEL,
    VOLUME_LEVEL_LABELS,
    VOLUME_LEVELS,
    VolumeLevelSchema,
    type VolumeLevel
} from "../primitives";

/** @deprecated Use VolumeLevelSchema (PascalCase) from primitives. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias
export const volumeLevelSchema = VolumeLevelSchema;

// ============================================================================
// CAMELCASE SCHEMA ALIASES (Backward Compatibility)
// ============================================================================

/** @deprecated Use StrategyTypeSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias
export const strategyTypeSchema = StrategyTypeSchema;
/** @deprecated Use StrategyStatusSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias
export const strategyStatusSchema = StrategyStatusSchema;
/** @deprecated Use GoalCategorySchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias
export const goalCategorySchema = GoalCategorySchema;
/** @deprecated Use GoalDataSourceSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias
export const goalDataSourceSchema = GoalDataSourceSchema;
/** @deprecated Use GoalDirectionSchema (PascalCase) from training. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
// zod-manual: deprecated alias
export const goalDirectionSchema = GoalDirectionSchema;

// ============================================================================
// DETAILED STRATEGY GOAL CONTRACT (Multi-Goal Support)
// ============================================================================

export const DetailedStrategyGoalSchema = z.object({
  id: z.string().uuid(),
  strategyId: z.string().uuid(),
  goalMetric: z.string().min(1),
  goalCategory: GoalCategorySchema,
  goalUnit: z.string(),
  goalDirection: GoalDirectionSchema,
  linkedExerciseId: z.string().uuid().optional(),
  linkedExerciseName: z.string().optional(),
  baselineValue: z.number().optional(),
  currentValue: z.number().optional(),
  goalTarget: z.number(),
  weight: z.number().min(0.1).max(10),
  dataSource: GoalDataSourceSchema,
  dataKey: z.string().optional(),
  progressPercent: z.number().min(0).max(100),
  notes: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metricDefinition: MetricDefinitionSummarySchema.nullable().optional(),
});
export type DetailedStrategyGoal = z.infer<typeof DetailedStrategyGoalSchema>;

/**
 * Individual goal within a training strategy.
 * Strategies can have multiple weighted goals for composite progress tracking.
 *
 * This is the detailed version with full metadata fields (goalCategory, goalUnit,
 * goalDirection, dataSource, etc.). For the simpler version, see StrategyGoalContract
 * in ./training.ts.
 */
export type DetailedStrategyGoalContract = z.infer<
  typeof DetailedStrategyGoalSchema
>;

// ============================================================================
// DETAILED TRAINING PHASE CONTRACT
// ============================================================================

export const DetailedTrainingPhaseSchema = baseDocumentSchema.extend({
  id: z.string().uuid(),
  strategyId: z.string().uuid(),
  name: z.string().min(1),
  order: z.number().int().min(0),
  weekCount: z.number().int().positive(),
  intensityRange: z.string().optional(),
  volumeLevel: VolumeLevelSchema.optional(),
  focusAreas: z.array(z.string()),
  notes: z.string().optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  isActive: z.boolean(),
  isCompleted: z.boolean(),
});
export type DetailedTrainingPhase = z.infer<typeof DetailedTrainingPhaseSchema>;

/**
 * Training phase within a strategy with full validation.
 *
 * Uses baseDocumentSchema for timestamp validation (ISO format enforcement).
 * For the simpler version, see TrainingPhaseContract in ./training.ts.
 */
export type DetailedTrainingPhaseContract = z.infer<
  typeof DetailedTrainingPhaseSchema
>;

// ============================================================================
// DETAILED TRAINING STRATEGY CONTRACT
// ============================================================================

export const DetailedTrainingStrategySchema = baseDocumentSchema.extend({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string().min(1),
  type: StrategyTypeSchema,
  goal: z.string().min(1),
  description: z.string().optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  status: StrategyStatusSchema,
  goals: z.array(DetailedStrategyGoalSchema),
  overallProgress: z.number().min(0).max(100),
  phases: z.array(DetailedTrainingPhaseSchema),
  createdBy: z.string().optional(),
});
export type DetailedTrainingStrategy = z.infer<
  typeof DetailedTrainingStrategySchema
>;

/**
 * Complete training strategy with goals, phases, and progress tracking.
 *
 * Uses `type` field for strategy type (vs `strategyType` in the base version).
 * For the simpler version, see TrainingStrategyContract in ./training.ts.
 */
export type DetailedTrainingStrategyContract = z.infer<
  typeof DetailedTrainingStrategySchema
>;

// ============================================================================
// CREATE/UPDATE SCHEMAS
// ============================================================================

export const CreateDetailedStrategyGoalSchema = DetailedStrategyGoalSchema.omit(
  {
    id: true,
    strategyId: true,
    progressPercent: true,
    createdAt: true,
    updatedAt: true,
  },
);
export type CreateDetailedStrategyGoal = z.infer<
  typeof CreateDetailedStrategyGoalSchema
>;

export const CreateDetailedTrainingPhaseSchema =
  DetailedTrainingPhaseSchema.omit({
    id: true,
    strategyId: true,
    createdAt: true,
    updatedAt: true,
  });
export type CreateDetailedTrainingPhase = z.infer<
  typeof CreateDetailedTrainingPhaseSchema
>;

export const CreateDetailedTrainingStrategySchema =
  DetailedTrainingStrategySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    phases: true,
    goals: true,
    overallProgress: true,
  }).extend({
    phases: z.array(CreateDetailedTrainingPhaseSchema).optional(),
    goals: z.array(CreateDetailedStrategyGoalSchema).optional(),
  });
export type CreateDetailedTrainingStrategy = z.infer<
  typeof CreateDetailedTrainingStrategySchema
>;

export const UpdateDetailedTrainingStrategySchema =
  CreateDetailedTrainingStrategySchema.partial();
export type UpdateDetailedTrainingStrategy = z.infer<
  typeof UpdateDetailedTrainingStrategySchema
>;

// ============================================================================
// GOAL SYNC RESULT TYPES
// ============================================================================

/**
 * Sync error codes for goal sync failures.
 */
export const GOAL_SYNC_ERROR_CODES = [
  "NO_DATA",
  "MISSING_EXERCISE_LINK",
  "UNKNOWN_DATA_SOURCE",
  "FETCH_FAILED",
] as const;
export type GoalSyncErrorCode = (typeof GOAL_SYNC_ERROR_CODES)[number];

export const GoalSyncResultSchema = z.object({
  goalId: z.string().uuid(),
  goalMetric: z.string().min(1),
  success: z.boolean(),
  error: z.string().optional(),
  previousValue: z.number().nullable().optional(),
  newValue: z.number().nullable().optional(),
  dataSource: z.string(),
  dataKey: z.string().nullable().optional(),
  lastDataDate: z.string().nullable().optional(),
});

/**
 * Result of syncing a single goal from its data source.
 */
export type GoalSyncResultContract = z.infer<typeof GoalSyncResultSchema>;

export const SyncAllGoalsResultSchema = z.object({
  strategyId: z.string().uuid(),
  syncedCount: z.number().int().min(0),
  failedCount: z.number().int().min(0),
  skippedCount: z.number().int().min(0),
  results: z.array(GoalSyncResultSchema),
  syncedAt: z.string(),
});
export type SyncAllGoalsResult = z.infer<typeof SyncAllGoalsResultSchema>;

/**
 * Aggregate result of syncing all goals for a strategy.
 */
export type SyncAllGoalsResultContract = z.infer<
  typeof SyncAllGoalsResultSchema
>;

// ============================================================================
// DRAFT SCHEMAS (for AI generation)
// ============================================================================

export const StrategyGoalDraftSchema = z.object({
  goalMetric: z.string().min(1),
  goalTarget: z.number().finite(),
  baselineValue: z.number().finite().optional(),
  weight: z.number().finite().optional(),
  linkedExerciseId: z.string().uuid().optional(),
});

export type StrategyGoalDraftContract = z.infer<typeof StrategyGoalDraftSchema>;

export const TrainingPhaseDraftSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().min(0),
  weekCount: z.number().int().positive(),
  intensityRange: z.string().optional(),
  volumeLevel: VolumeLevelSchema.optional(),
  focusAreas: z.array(z.string()),
  notes: z.string().optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  isActive: z.boolean(),
  isCompleted: z.boolean(),
});
export type TrainingPhaseDraft = z.infer<typeof TrainingPhaseDraftSchema>;

export type TrainingPhaseDraftContract = z.infer<
  typeof TrainingPhaseDraftSchema
>;

export const StrategyDraftSchema = z.object({
  name: z.string().min(1),
  type: StrategyTypeSchema,
  goal: z.string().min(1),
  description: z.string().optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  status: StrategyStatusSchema,
  goals: z.array(StrategyGoalDraftSchema).min(1),
  phases: z.array(TrainingPhaseDraftSchema).optional(),
  reasoning: z.string().optional(),
});

export type StrategyDraftContract = z.infer<typeof StrategyDraftSchema>;

// ============================================================================
// AI STRATEGY GENERATION PROGRESS CONTRACTS
// ============================================================================

/**
 * Activity entry for real-time strategy generation progress display.
 */
/**
 * Activity entry for real-time strategy generation progress display.
 * Derived from StrategyGenerationActivitySchema for schema↔type consistency.
 *
 * Note: The schema restricts `data` values to string | number | boolean | null | string[].
 * The previous manually-defined interface used Record<string, unknown> which was looser.
 */
export type StrategyGenerationActivityContract = z.infer<
  typeof StrategyGenerationActivitySchema
>;

/** @deprecated Use StrategyGenerationActivityContract (derived from schema). */
export interface _StrategyGenerationActivityContractLegacy {
  /** Timestamp of the activity */
  timestamp: string;
  /** Type of activity */
  type:
    | "search"
    | "create"
    | "select"
    | "plan"
    | "note"
    | "thinking"
    | "complete"
    | "analyze";
  /** Short description of the activity */
  message: string;
  /** Optional additional data */
  data?: Record<string, unknown>;
}

export const StrategyGenerationActivitySchema = z.object({
  timestamp: z.string(),
  type: z.enum([
    "search",
    "create",
    "select",
    "plan",
    "note",
    "thinking",
    "complete",
    "analyze",
  ]),
  message: z.string(),
  data: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null(),
        z.array(z.string()),
      ]),
    )
    .optional(),
});
export type StrategyGenerationActivity = z.infer<
  typeof StrategyGenerationActivitySchema
>;

export const StrategyGenerationProgressSchema = z.object({
  step: z.number().int().min(0),
  totalSteps: z.number().int().positive(),
  phase: z.string(),
  detail: z.string().optional(),
  turn: z.number().int().min(0).optional(),
  maxTurns: z.number().int().positive().optional(),
  activities: z.array(StrategyGenerationActivitySchema).optional(),
  stats: z
    .object({
      goalsIdentified: z.number().int().min(0).optional(),
      phasesCreated: z.number().int().min(0).optional(),
      exercisesSearched: z.number().int().min(0).optional(),
      exercisesCreated: z.number().int().min(0).optional(),
    })
    .optional(),
});
export type StrategyGenerationProgress = z.infer<
  typeof StrategyGenerationProgressSchema
>;

export type StrategyGenerationProgressContract = z.infer<
  typeof StrategyGenerationProgressSchema
>;

// ============================================================================
// AI STRATEGY GENERATION RESULT CONTRACTS
// ============================================================================

export const StrategyGenerationResultSchema = z.object({
  needsClarification: z.literal(false),
  strategy: StrategyDraftSchema,
  reasoning: z.string(),
});
export type StrategyGenerationResult = z.infer<
  typeof StrategyGenerationResultSchema
>;

/**
 * @deprecated Use {@link StrategyGenerationResult} instead.
 * This alias was introduced when local mobile contracts used a `Contract` suffix convention.
 * The canonical name is `StrategyGenerationResult` (no suffix).
 * TY-18: duplicate alias for same Zod inference — kept for backward compatibility only.
 */
export type StrategyGenerationResultContract = z.infer<
  typeof StrategyGenerationResultSchema
>;

export const StrategyClarificationNeededSchema = z.object({
  needsClarification: z.literal(true),
  questions: z.array(z.string().min(1)),
  requestId: z.string(),
  partialContext: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null(),
        z.array(z.string()),
      ]),
    )
    .optional(),
});
export type StrategyClarificationNeeded = z.infer<
  typeof StrategyClarificationNeededSchema
>;

export type StrategyClarificationNeededContract = z.infer<
  typeof StrategyClarificationNeededSchema
>;

export const StrategyGenerationResponseSchema = z.union([
  StrategyGenerationResultSchema,
  StrategyClarificationNeededSchema,
]);
export type StrategyGenerationResponse = z.infer<
  typeof StrategyGenerationResponseSchema
>;

export type StrategyGenerationResponseContract = z.infer<
  typeof StrategyGenerationResponseSchema
>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate progress for a single goal.
 * Handles three goal directions:
 * - 'higher_better': Progress measured by value increase (e.g., squat 1RM, testosterone)
 * - 'lower_better': Progress measured by value decrease (e.g., body fat %, A1C)
 * - 'context': Direction inferred from baseline vs target relationship
 */
export function calculateGoalProgress(
  goal: DetailedStrategyGoalContract,
): number {
  // Guard against null/undefined values
  if (goal.baselineValue == null || goal.currentValue == null) {
    return 0;
  }

  const baseline = goal.baselineValue;
  const current = goal.currentValue;
  const target = goal.goalTarget;

  // Determine effective direction:
  // - Explicit 'higher_better' or 'lower_better' is used directly
  // - 'context' (or any other value) infers direction from baseline vs target
  let isHigherBetter: boolean;
  if (goal.goalDirection === "higher_better") {
    isHigherBetter = true;
  } else if (goal.goalDirection === "lower_better") {
    isHigherBetter = false;
  } else {
    // 'context' or unknown: infer from baseline/target relationship
    isHigherBetter = target > baseline;
  }

  if (isHigherBetter) {
    // E.g., squat 1RM: baseline=200, current=220, target=250 -> 40%
    if (target <= baseline) return current >= target ? 100 : 0;
    const rawProgress = ((current - baseline) / (target - baseline)) * 100;
    if (Number.isNaN(rawProgress)) return 0;
    return Math.min(100, Math.max(0, Math.round(rawProgress)));
  } else {
    // E.g., body fat: baseline=200, current=190, target=180 -> 50%
    if (baseline <= target) return current <= target ? 100 : 0;
    const rawProgress = ((baseline - current) / (baseline - target)) * 100;
    if (Number.isNaN(rawProgress)) return 0;
    return Math.min(100, Math.max(0, Math.round(rawProgress)));
  }
}

/**
 * Calculate overall strategy progress as weighted average of goal progresses.
 */
export function calculateStrategyProgress(
  strategy: DetailedTrainingStrategyContract,
): number {
  if (strategy.goals.length === 0) {
    return 0;
  }

  // Normalize weights: use ?? 1 to handle null/undefined weights from old data
  const normalizedGoals = strategy.goals.map((g) => ({
    progressPercent: g.progressPercent,
    weight: g.weight,
  }));

  const totalWeight = normalizedGoals.reduce((sum, g) => sum + g.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = normalizedGoals.reduce(
    (sum, g) => sum + g.progressPercent * g.weight,
    0,
  );

  const result = weightedSum / totalWeight;
  // Guard against NaN
  return Number.isNaN(result) ? 0 : Math.round(result);
}

/**
 * Get the currently active phase from a strategy.
 */
export function getCurrentPhase(
  strategy: DetailedTrainingStrategyContract,
): DetailedTrainingPhaseContract | undefined {
  return strategy.phases.find((p) => p.isActive);
}

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();
const todayIso = () => new Date().toISOString().split("T")[0];

export const createMockDetailedTrainingPhase = (
  overrides: Partial<DetailedTrainingPhaseContract> = {},
): DetailedTrainingPhaseContract => ({
  id: overrides.id ?? crypto.randomUUID(),
  strategyId: overrides.strategyId ?? crypto.randomUUID(),
  name: overrides.name ?? "Accumulation",
  order: overrides.order ?? 0,
  weekCount: overrides.weekCount ?? 4,
  intensityRange: overrides.intensityRange ?? "65-75% 1RM",
  volumeLevel: overrides.volumeLevel ?? "high",
  focusAreas: overrides.focusAreas ?? ["hypertrophy", "technique"],
  isActive: overrides.isActive ?? false,
  isCompleted: overrides.isCompleted ?? false,
  createdAt: overrides.createdAt ?? nowIso(),
  updatedAt: overrides.updatedAt ?? nowIso(),
  ...overrides,
});

export const createMockDetailedStrategyGoal = (
  overrides: Partial<DetailedStrategyGoalContract> = {},
): DetailedStrategyGoalContract => ({
  id: overrides.id ?? crypto.randomUUID(),
  strategyId: overrides.strategyId ?? crypto.randomUUID(),
  goalMetric: overrides.goalMetric ?? "squat_1rm",
  goalCategory: overrides.goalCategory ?? "fitness",
  goalUnit: overrides.goalUnit ?? "lbs",
  goalDirection: overrides.goalDirection ?? "higher_better",
  linkedExerciseId: overrides.linkedExerciseId,
  linkedExerciseName: overrides.linkedExerciseName,
  baselineValue: overrides.baselineValue ?? 275,
  currentValue: overrides.currentValue ?? 295,
  goalTarget: overrides.goalTarget ?? 315,
  weight: overrides.weight ?? 1,
  dataSource: overrides.dataSource ?? "manual",
  dataKey: overrides.dataKey ?? "squat_1rm",
  progressPercent: overrides.progressPercent ?? 50,
  createdAt: overrides.createdAt ?? nowIso(),
  updatedAt: overrides.updatedAt ?? nowIso(),
  ...overrides,
});

export const createMockDetailedTrainingStrategy = (
  overrides: Partial<DetailedTrainingStrategyContract> = {},
): DetailedTrainingStrategyContract => {
  const strategyId = overrides.id ?? crypto.randomUUID();
  const goals = overrides.goals ?? [
    createMockDetailedStrategyGoal({
      strategyId,
      goalMetric: "squat_1rm",
      goalCategory: "fitness",
      goalUnit: "lbs",
      goalDirection: "higher_better",
      baselineValue: 275,
      currentValue: 295,
      goalTarget: 315,
      weight: 0.5,
      dataSource: "manual",
      dataKey: "squat_1rm",
      progressPercent: 50,
    }),
    createMockDetailedStrategyGoal({
      strategyId,
      goalMetric: "body_fat_percent",
      goalCategory: "body_composition",
      goalUnit: "%",
      goalDirection: "lower_better",
      baselineValue: 20,
      currentValue: 18,
      goalTarget: 15,
      weight: 0.5,
      dataSource: "biometric",
      dataKey: "BodyFatPercentage",
      progressPercent: 40,
    }),
  ];

  return {
    id: strategyId,
    userId: overrides.userId ?? "mock-user",
    name: overrides.name ?? "12-Week Strength Block",
    type: overrides.type ?? "BLOCK",
    goal:
      overrides.goal ?? "Increase squat 1RM to 315lbs while reducing body fat",
    description:
      overrides.description ??
      "Progressive strength program with body composition focus",
    startDate: overrides.startDate ?? todayIso(),
    status: overrides.status ?? "ACTIVE",
    goals,
    overallProgress: overrides.overallProgress ?? 45,
    phases: overrides.phases ?? [
      createMockDetailedTrainingPhase({
        strategyId,
        name: "Accumulation",
        order: 0,
        isCompleted: true,
      }),
      createMockDetailedTrainingPhase({
        strategyId,
        name: "Intensification",
        order: 1,
        isActive: true,
      }),
      createMockDetailedTrainingPhase({ strategyId, name: "Peak", order: 2 }),
      createMockDetailedTrainingPhase({
        strategyId,
        name: "Deload",
        order: 3,
        weekCount: 1,
      }),
    ],
    createdAt: overrides.createdAt ?? nowIso(),
    updatedAt: overrides.updatedAt ?? nowIso(),
    ...overrides,
  };
};

export const createMockStrategyGoalDraft = (
  overrides: Partial<StrategyGoalDraftContract> = {},
): StrategyGoalDraftContract => ({
  goalMetric: overrides.goalMetric ?? "squat_1rm",
  goalTarget: overrides.goalTarget ?? 315,
  baselineValue: overrides.baselineValue ?? 275,
  weight: overrides.weight ?? 1,
  linkedExerciseId: overrides.linkedExerciseId,
});

export const createMockTrainingPhaseDraft = (
  overrides: Partial<TrainingPhaseDraftContract> = {},
): TrainingPhaseDraftContract => ({
  name: overrides.name ?? "Accumulation",
  order: overrides.order ?? 0,
  weekCount: overrides.weekCount ?? 4,
  intensityRange: overrides.intensityRange ?? "65-75% 1RM",
  volumeLevel: overrides.volumeLevel ?? "moderate",
  focusAreas: overrides.focusAreas ?? ["hypertrophy", "technique"],
  notes: overrides.notes,
  startDate: overrides.startDate ?? todayIso(),
  endDate: overrides.endDate,
  isActive: overrides.isActive ?? true,
  isCompleted: overrides.isCompleted ?? false,
});

export const createMockStrategyDraft = (
  overrides: Partial<StrategyDraftContract> = {},
): StrategyDraftContract => ({
  name: overrides.name ?? "12-Week Strength Block",
  type: overrides.type ?? "BLOCK",
  goal: overrides.goal ?? "Increase squat 1RM",
  description: overrides.description ?? "Focused block for maximal strength",
  startDate: overrides.startDate ?? todayIso(),
  endDate: overrides.endDate,
  status: overrides.status ?? "ACTIVE",
  goals: overrides.goals ?? [createMockStrategyGoalDraft()],
  phases: overrides.phases ?? [createMockTrainingPhaseDraft()],
});

export const createMockStrategyGenerationProgress = (
  overrides: Partial<StrategyGenerationProgressContract> = {},
): StrategyGenerationProgressContract => ({
  step: overrides.step ?? 1,
  totalSteps: overrides.totalSteps ?? 4,
  phase: overrides.phase ?? "analyzing_context",
  detail: overrides.detail ?? "Analyzing client context",
});

export const createMockStrategyGenerationResult = (
  overrides: Partial<StrategyGenerationResultContract> = {},
): StrategyGenerationResultContract => ({
  needsClarification: false,
  strategy: overrides.strategy ?? createMockStrategyDraft(),
  reasoning:
    overrides.reasoning ??
    "Strategy generated based on client goals and context.",
});

export const createMockStrategyClarificationNeeded = (
  overrides: Partial<StrategyClarificationNeededContract> = {},
): StrategyClarificationNeededContract => ({
  needsClarification: true,
  questions: overrides.questions ?? [
    "What is your primary performance goal for the next 12 weeks?",
  ],
  requestId: overrides.requestId ?? crypto.randomUUID(),
  partialContext: overrides.partialContext,
});
