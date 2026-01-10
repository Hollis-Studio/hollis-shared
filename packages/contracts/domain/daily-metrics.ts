/**
 * @ai-context Daily metrics domain contracts | TDEE, recovery, training load schemas
 *
 * This module provides the canonical definitions for daily metrics:
 * - TDEE estimates, recovery scores, training load
 * - Sleep performance, readiness scores
 * - Caloric balance, strain metrics
 *
 * IMPORTANT: All daily metrics types MUST be imported from here.
 *
 * deps: zod, common.ts | consumers: all codebases
 */

import { z } from 'zod';
import { baseDocumentSchema, isoDateSchema, type IsoDateString, type IsoTimestampString } from './common';

// ============================================================================
// DAILY METRICS CONTRACT
// ============================================================================

/**
 * Daily metrics contract - aggregated health metrics for a single day.
 * These values are typically computed from wearable data and other sources.
 */
export interface DailyMetricsContract {
  id?: string;
  /**
   * User identifier in HH-XXXXXX barcode format.
   * References the patient this metrics record belongs to.
   *
   * @format HH-XXXXXX
   */
  userId: string;
  date: IsoDateString;
  /**
   * @computed Calculated by metricsEngine.computeDailyMetrics() using BMR + active calories.
   */
  tdeeEstimate: number;
  /**
   * @computed Calculated by metricsEngine based on data completeness.
   */
  tdeeConfidence?: number | null; // 0-1
  /**
   * @computed Calculated by metricsEngine as weighted combination: sleepScore (60%) + rhrScore (40%).
   */
  recoveryScore: number; // 0-100
  /**
   * @computed Calculated by metricsEngine as activeCalories / 10 (simplified TRIMP).
   */
  trainingLoad: number; // arbitrary TRIMP-style score
  /**
   * @computed Calculated by metricsEngine comparing today's vs yesterday's training load.
   */
  strainDelta?: number; // change vs prior day
  /**
   * @computed Calculated by metricsEngine as (sleepHours / 8) * 100, capped at 100.
   */
  sleepScore?: number; // 0-100
  /**
   * @computed Calculated by metricsEngine (currently aliased to recoveryScore).
   */
  readinessScore?: number; // 0-100
  /**
   * @computed Calculated as TDEE - consumed calories.
   */
  caloricBalance?: number;
  /**
   * @computed Acute:Chronic workload ratio for injury risk assessment.
   */
  acuteChronicRatio?: number;
  notes?: string[];
  recommendations?: string[];
  createdAt: IsoTimestampString;
  updatedAt: IsoTimestampString;
}

export const dailyMetricsSchema: z.ZodType<DailyMetricsContract> = baseDocumentSchema.extend({
  id: z.string().optional(),
  userId: z.string(),
  date: isoDateSchema,
  tdeeEstimate: z.number().min(0),
  tdeeConfidence: z.number().min(0).max(1).optional().nullable(),
  recoveryScore: z.number().min(0).max(100),
  trainingLoad: z.number().min(0),
  strainDelta: z.number().optional(),
  sleepScore: z.number().min(0).max(100).optional(),
  readinessScore: z.number().min(0).max(100).optional(),
  caloricBalance: z.number().optional(),
  acuteChronicRatio: z.number().min(0).optional(),
  notes: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});

// ============================================================================
// MOCK FACTORY
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockDailyMetrics = (
  overrides: Partial<DailyMetricsContract> = {},
): DailyMetricsContract => {
  const timestamp = nowIso();
  const base: DailyMetricsContract = {
    id: overrides.id ?? overrides.date ?? '2024-01-01',
    userId: overrides.userId ?? 'HH-ABC123',
    date: overrides.date ?? '2024-01-01',
    tdeeEstimate: overrides.tdeeEstimate ?? 2150,
    tdeeConfidence: overrides.tdeeConfidence ?? 0.72,
    recoveryScore: overrides.recoveryScore ?? 82,
    trainingLoad: overrides.trainingLoad ?? 45,
    strainDelta: overrides.strainDelta ?? -5,
    sleepScore: overrides.sleepScore ?? 78,
    readinessScore: overrides.readinessScore ?? 80,
    caloricBalance: overrides.caloricBalance ?? -250,
    acuteChronicRatio: overrides.acuteChronicRatio ?? 1.05,
    notes: overrides.notes ?? ['Maintain hydration throughout the day.'],
    recommendations: overrides.recommendations ?? ['Consider a light recovery ride.'],
    createdAt: overrides.createdAt ?? timestamp,
    updatedAt: overrides.updatedAt ?? timestamp,
  };
  return { ...base, ...overrides };
};
