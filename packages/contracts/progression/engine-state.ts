import type { CardioCapacityMetric, ProgressionCalibrationState } from "./engine.js";

/**
 * Progression Engine V2 calibration maths: the single implementation behind
 * the persisted `ProgressionEngineState` score fields. The Workouts app builds
 * engine state with it after every workout; the Workouts server uses it to
 * backfill `engineState` on baseline rows that have none. Pure and
 * deterministic: no clock reads (`now` is an input), no I/O, no zod.
 */

/** Tuning constants for engine-state calibration. Change a value here only. */
export const PROGRESSION_ENGINE_TUNING = {
  /** Fewer distinct sessions than this → `calibrating`. */
  calibratingSessionCount: 3,
  /** Fewer distinct sessions than this → at best `provisional`. */
  stableSessionCount: 6,
  /** `uncertaintyPct` above this keeps a baseline `provisional`. */
  highUncertaintyPct: 0.08,
  /** Most recent non-outlier entries used for capacity and spread. */
  recentHistoryWindow: 6,
  /** Cold-start cap: capacity ≤ raw baseline × (1 + this) while calibrating. */
  coldStartCapacityUplift: 0.03,
  /** Newest session older than this many days demotes one calibration step. */
  baselineStaleDays: 60,
  /** Lifting training-target decay per week of gap beyond `baselineStaleDays`. */
  layoffDecayPerWeek: 0.01,
  /** Floor for the lifting layoff decay multiplier. */
  layoffDecayFloor: 0.85,
  /** Lifting capacity = recent effort-adjusted mean × recent + raw baseline × rawBaseline. */
  liftingCapacityBlend: { recent: 0.75, rawBaseline: 0.25 },
  /** Lifting capacity when a metric-basket e1RM is supplied. */
  metricBasketCapacityBlend: { recent: 0.65, metricBasket: 0.35 },
  /** Epley at or below this rep count, Wathan above. */
  e1rmCrossoverReps: 10,
  /** Share of reliable reps-in-reserve credited as extra reps. */
  rirEffectiveRepCredit: 0.5,
  /** Reps in reserve above this are not credited further. */
  rirCreditCap: 4,
  /** Training-target multiplier on capacity, by calibration state. */
  trainingMaxByState: {
    no_data: 0,
    calibrating: 0.82,
    provisional: 0.88,
    stable: 0.92,
  },
} as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type EngineDateInput = Date | string | number;

/** The lifting history fields the maths reads. `BaselineEntry` satisfies it. */
export interface LiftingEngineSample {
  sessionId: string;
  date: EngineDateInput;
  weightKg: number;
  reps: number;
  rir?: number | null;
  isOutlier?: boolean;
}

/** The cardio history fields the maths reads. `CardioBaselineEntry` satisfies it. */
export interface CardioEngineSample {
  sessionId: string;
  date: EngineDateInput;
  durationSeconds: number;
  distanceKm?: number | null;
  mets?: number | null;
  isOutlier?: boolean;
}

/** The cardio baseline PR fields the maths reads. `CardioBaseline` satisfies it. */
export interface CardioEngineBests {
  bestDurationSeconds: number | null;
  bestDistanceKm?: number | null;
  bestMETs?: number | null;
}

/** The metric-basket e1RM fields the maths reads. `MetricBasketSnapshot['e1rmGated']` satisfies it. */
export interface MetricBasketCalibrationInput {
  current?: number | null;
  band?: { value: number; widthKg: number } | null;
}

/** The score fields of `ProgressionEngineState` (everything but provenance and `schemaVersion`). */
export interface EngineStateScores {
  calibrationState: ProgressionCalibrationState;
  rawBaselineScore: number | null;
  capacityScore: number | null;
  trainingTargetScore: number | null;
  uncertaintyPct: number | null;
  distinctSessionCount: number;
}

export interface EffortAdjustedE1RM {
  adjustedE1RMKg: number;
  reliability: number;
  effectiveReps: number;
}

export interface DeriveLiftingEngineScoresInput {
  history: readonly LiftingEngineSample[];
  /** The baseline's all-time PR e1RM (`currentE1RM_Kg`); null when unknown. */
  currentE1RMKg: number | null;
  now: Date;
  metricBasket?: MetricBasketCalibrationInput | null;
}

export interface DeriveCardioEngineScoresInput {
  history: readonly CardioEngineSample[];
  bests: CardioEngineBests;
  now: Date;
}

const CARDIO_METRIC_PRIORITY: readonly CardioCapacityMetric[] = ["mets_min", "distance_km", "duration_min"];

const NO_DATA_SCORES: EngineStateScores = {
  calibrationState: "no_data",
  rawBaselineScore: null,
  capacityScore: null,
  trainingTargetScore: null,
  uncertaintyPct: null,
  distinctSessionCount: 0,
};

/** Epoch ms of a history date; an unparseable value is 0 so sorting stays deterministic. */
export function toEngineEpochMs(value: EngineDateInput): number {
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

/** The most recent `windowSize` entries, oldest → newest, sorted by date (array order is not trusted). */
export function recentHistoryWindow<T extends { date: EngineDateInput }>(
  history: readonly T[],
  windowSize: number,
): T[] {
  return [...history]
    .sort((a, b) => toEngineEpochMs(a.date) - toEngineEpochMs(b.date))
    .slice(-windowSize);
}

/** Sample coefficient of variation; null for fewer than two values or a non-positive mean. */
export function estimateRelativeSpread(values: readonly number[]): number | null {
  if (values.length < 2) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (mean <= 0) return null;
  const variance =
    values.reduce((sum, value) => {
      const diff = value - mean;
      return sum + diff * diff;
    }, 0) /
    (values.length - 1);
  return Math.sqrt(variance) / mean;
}

export function calculateRirReliability(reps: number, rir: number | null | undefined): number {
  if (!Number.isInteger(reps) || reps <= 0) return 0;
  if (rir == null || !Number.isFinite(rir) || rir < 0 || rir > 6) return 0;
  if (reps > 15) return 0;
  if (rir <= 2 && reps <= 10) return 1;
  if (rir <= 4) return 0.6;
  return 0.25;
}

/** Epley up to `e1rmCrossoverReps`, Wathan above; fractional effective reps allowed. */
export function estimateE1RMForEffectiveReps(weightKg: number, effectiveReps: number): number {
  if (weightKg <= 0 || effectiveReps <= 0) return 0;
  if (effectiveReps <= 1) return weightKg;
  if (effectiveReps <= PROGRESSION_ENGINE_TUNING.e1rmCrossoverReps) {
    return weightKg * (1 + effectiveReps / 30);
  }
  return (weightKg * 100) / (48.8 + 53.8 * Math.exp(-0.075 * effectiveReps));
}

/**
 * e1RM with reliable reps-in-reserve credited as extra reps. Null for input
 * that is not a valid set (non-finite or negative load, non-integer or
 * negative reps). A zero-load or zero-rep set is valid and scores 0.
 */
export function estimateEffortAdjustedE1RM(input: {
  weightKg: number;
  reps: number;
  rir?: number | null;
}): EffortAdjustedE1RM | null {
  const { weightKg, reps, rir } = input;
  if (!Number.isFinite(weightKg) || weightKg < 0) return null;
  if (!Number.isInteger(reps) || reps < 0) return null;
  const reliability = calculateRirReliability(reps, rir);
  const creditedRir =
    rir == null || !Number.isFinite(rir)
      ? 0
      : Math.min(Math.max(rir, 0), PROGRESSION_ENGINE_TUNING.rirCreditCap);
  const effectiveReps = reps + creditedRir * reliability * PROGRESSION_ENGINE_TUNING.rirEffectiveRepCredit;
  return {
    adjustedE1RMKg: estimateE1RMForEffectiveReps(weightKg, effectiveReps),
    reliability,
    effectiveReps,
  };
}

/**
 * Calibration confidence from distinct sessions and spread. A newest session
 * older than `baselineStaleDays` demotes one step (stable → provisional →
 * calibrating); a missing, negative or non-finite age never demotes.
 */
export function deriveCalibrationState(
  distinctSessionCount: number,
  uncertaintyPct: number | null,
  mostRecentSessionAgeDays?: number | null,
): ProgressionCalibrationState {
  const tuning = PROGRESSION_ENGINE_TUNING;
  if (distinctSessionCount <= 0) return "no_data";
  const isStale =
    mostRecentSessionAgeDays != null &&
    Number.isFinite(mostRecentSessionAgeDays) &&
    mostRecentSessionAgeDays > tuning.baselineStaleDays;
  if (distinctSessionCount < tuning.calibratingSessionCount) return "calibrating";
  if (distinctSessionCount < tuning.stableSessionCount) {
    return isStale ? "calibrating" : "provisional";
  }
  if (uncertaintyPct != null && uncertaintyPct > tuning.highUncertaintyPct) {
    return isStale ? "calibrating" : "provisional";
  }
  return isStale ? "provisional" : "stable";
}

/**
 * Lifting training-target multiplier for time away: 1 within
 * `baselineStaleDays`, then −`layoffDecayPerWeek` per week of further gap,
 * floored at `layoffDecayFloor`. Never applied to cardio.
 */
export function layoffDecayMultiplier(mostRecentSessionAgeDays: number | null): number {
  const tuning = PROGRESSION_ENGINE_TUNING;
  if (mostRecentSessionAgeDays == null || !Number.isFinite(mostRecentSessionAgeDays)) return 1;
  const gapBeyondStaleDays = mostRecentSessionAgeDays - tuning.baselineStaleDays;
  if (gapBeyondStaleDays <= 0) return 1;
  return Math.max(tuning.layoffDecayFloor, 1 - tuning.layoffDecayPerWeek * (gapBeyondStaleDays / 7));
}

/** Per-entry cardio workload score for one metric; null when that metric is absent. */
export function estimateCardioCapacityScoreForMetric(
  entry: Pick<CardioEngineSample, "durationSeconds" | "distanceKm" | "mets">,
  metric: CardioCapacityMetric,
): number | null {
  if (!(entry.durationSeconds > 0)) return null;
  const durationMinutes = entry.durationSeconds / 60;
  if (metric === "mets_min") {
    return entry.mets != null && entry.mets > 0 ? entry.mets * durationMinutes : null;
  }
  if (metric === "distance_km") {
    return entry.distanceKm != null && entry.distanceKm > 0 ? entry.distanceKm * 10 : null;
  }
  return durationMinutes;
}

/** Raw-baseline cardio score for one metric from the baseline's PR fields. */
export function estimateCardioRawBaselineScoreForMetric(
  bests: CardioEngineBests,
  metric: CardioCapacityMetric,
): number | null {
  const bestDurationSeconds = bests.bestDurationSeconds ?? 0;
  if (metric === "mets_min") {
    return bests.bestMETs != null && bests.bestMETs > 0 && bestDurationSeconds > 0
      ? bests.bestMETs * (bestDurationSeconds / 60)
      : null;
  }
  if (metric === "distance_km") {
    return bests.bestDistanceKm != null && bests.bestDistanceKm > 0 ? bests.bestDistanceKm * 10 : null;
  }
  return bestDurationSeconds > 0 ? bestDurationSeconds / 60 : null;
}

/** Raw-baseline cardio score in priority order mets_min > distance_km > duration_min. */
export function estimateCardioRawBaselineScore(bests: CardioEngineBests): number | null {
  return (
    estimateCardioRawBaselineScoreForMetric(bests, "mets_min") ??
    estimateCardioRawBaselineScoreForMetric(bests, "distance_km") ??
    estimateCardioRawBaselineScoreForMetric(bests, "duration_min")
  );
}

/**
 * The metric with the most positively scored entries; ties go to
 * mets_min > distance_km > duration_min. Scoring every entry on one metric
 * keeps incompatible units (METs·min ≈ 270 vs distance × 10 ≈ 50) out of one spread.
 */
export function pickDominantCardioMetric(
  entries: readonly Pick<CardioEngineSample, "durationSeconds" | "distanceKm" | "mets">[],
): CardioCapacityMetric {
  let bestMetric: CardioCapacityMetric = "duration_min";
  let bestCount = -1;
  for (const metric of CARDIO_METRIC_PRIORITY) {
    const count = entries.filter((entry) => (estimateCardioCapacityScoreForMetric(entry, metric) ?? 0) > 0).length;
    if (count > bestCount) {
      bestCount = count;
      bestMetric = metric;
    }
  }
  return bestMetric;
}

function countDistinctSessions(history: readonly { sessionId: string }[]): number {
  const sessionIds = new Set<string>();
  for (const entry of history) {
    if (typeof entry.sessionId === "string" && entry.sessionId.length > 0) sessionIds.add(entry.sessionId);
  }
  return sessionIds.size;
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function mostRecentAgeDays(history: readonly { date: EngineDateInput }[], now: Date): number | null {
  let mostRecentMs = 0;
  for (const entry of history) {
    const ms = toEngineEpochMs(entry.date);
    if (ms > mostRecentMs) mostRecentMs = ms;
  }
  return mostRecentMs > 0 ? (now.getTime() - mostRecentMs) / MS_PER_DAY : null;
}

/** Spread is a ratio; a value above 1 is capped so the state always satisfies `uncertaintyPct ≤ 1`. */
function boundedUncertainty(spread: number | null): number | null {
  return spread == null ? null : Math.min(1, spread);
}

/**
 * Lifting engine-state scores from baseline history.
 *
 * - Empty history → `no_data`.
 * - Every entry an outlier → `calibrating` on the PR e1RM alone (no progression
 *   from unreliable data; no layoff decay).
 * - Otherwise capacity blends the recent effort-adjusted mean with the PR
 *   (or with the metric-basket e1RM when supplied), capped at PR × 1.03 while
 *   calibrating; the training target is capacity × the state's training max ×
 *   the layoff decay. The PR itself never decays.
 */
export function deriveLiftingEngineScores(input: DeriveLiftingEngineScoresInput): EngineStateScores {
  const tuning = PROGRESSION_ENGINE_TUNING;
  const { history, now, metricBasket } = input;
  if (history.length === 0) return { ...NO_DATA_SCORES };

  const rawBaselineScore =
    input.currentE1RMKg != null && Number.isFinite(input.currentE1RMKg) && input.currentE1RMKg >= 0
      ? input.currentE1RMKg
      : null;
  const provenRaw = rawBaselineScore != null && rawBaselineScore > 0 ? rawBaselineScore : null;

  const sourceHistory = history.filter((entry) => !entry.isOutlier);
  if (sourceHistory.length === 0) {
    return {
      calibrationState: "calibrating",
      rawBaselineScore,
      capacityScore: provenRaw,
      trainingTargetScore: provenRaw != null ? provenRaw * tuning.trainingMaxByState.calibrating : null,
      uncertaintyPct: null,
      distinctSessionCount: 0,
    };
  }

  const recentHistory = recentHistoryWindow(sourceHistory, tuning.recentHistoryWindow);
  const adjustedValues: number[] = [];
  for (const entry of recentHistory) {
    const adjusted = estimateEffortAdjustedE1RM(entry);
    if (adjusted != null) adjustedValues.push(adjusted.adjustedE1RMKg);
  }

  const distinctSessionCount = countDistinctSessions(sourceHistory);
  const recentAdjustedMean = adjustedValues.length > 0 ? mean(adjustedValues) : rawBaselineScore;
  const metricBasketCurrent = metricBasket?.current;

  let capacityScore: number | null;
  if (recentAdjustedMean == null) {
    capacityScore = null;
  } else if (metricBasketCurrent != null && metricBasketCurrent > 0) {
    const blend = tuning.metricBasketCapacityBlend;
    capacityScore = recentAdjustedMean * blend.recent + metricBasketCurrent * blend.metricBasket;
  } else if (rawBaselineScore != null) {
    const blend = tuning.liftingCapacityBlend;
    capacityScore = recentAdjustedMean * blend.recent + rawBaselineScore * blend.rawBaseline;
  } else {
    capacityScore = recentAdjustedMean;
  }
  if (capacityScore != null && provenRaw != null && distinctSessionCount <= tuning.calibratingSessionCount) {
    capacityScore = Math.min(capacityScore, provenRaw * (1 + tuning.coldStartCapacityUplift));
  }

  const band = metricBasket?.band;
  const uncertaintyPct = boundedUncertainty(
    band != null && band.value > 0 ? band.widthKg / band.value : estimateRelativeSpread(adjustedValues),
  );
  const ageDays = mostRecentAgeDays(sourceHistory, now);
  const calibrationState = deriveCalibrationState(distinctSessionCount, uncertaintyPct, ageDays);
  const trainingMax = tuning.trainingMaxByState[calibrationState];
  const trainingTargetScore =
    capacityScore != null && trainingMax > 0
      ? capacityScore * trainingMax * layoffDecayMultiplier(ageDays)
      : null;

  return {
    calibrationState,
    rawBaselineScore,
    capacityScore,
    trainingTargetScore,
    uncertaintyPct,
    distinctSessionCount,
  };
}

/**
 * Cardio engine-state scores from baseline history. Scores are workload units
 * (METs·min, distance × 10, or minutes) on one dominant metric; capacity is a
 * plain mean (no PR blend) and there is no layoff decay.
 */
export function deriveCardioEngineScores(input: DeriveCardioEngineScoresInput): EngineStateScores {
  const tuning = PROGRESSION_ENGINE_TUNING;
  const { history, bests, now } = input;
  if (history.length === 0) return { ...NO_DATA_SCORES };

  const sourceHistory = history.filter((entry) => !entry.isOutlier);
  if (sourceHistory.length === 0) {
    const rawBaselineScore = estimateCardioRawBaselineScore(bests);
    return {
      calibrationState: "calibrating",
      rawBaselineScore,
      capacityScore: rawBaselineScore,
      trainingTargetScore:
        rawBaselineScore != null && rawBaselineScore > 0
          ? rawBaselineScore * tuning.trainingMaxByState.calibrating
          : null,
      uncertaintyPct: null,
      distinctSessionCount: 0,
    };
  }

  const recentHistory = recentHistoryWindow(sourceHistory, tuning.recentHistoryWindow);
  const dominantMetric = pickDominantCardioMetric(recentHistory);
  const capacityScores = recentHistory
    .map((entry) => estimateCardioCapacityScoreForMetric(entry, dominantMetric))
    .filter((score): score is number => score != null && score > 0);
  const distinctSessionCount = countDistinctSessions(sourceHistory);
  const rawBaselineScore = estimateCardioRawBaselineScore(bests) ?? capacityScores.at(-1) ?? null;
  const capacityScore = capacityScores.length > 0 ? mean(capacityScores) : rawBaselineScore;
  const uncertaintyPct = boundedUncertainty(estimateRelativeSpread(capacityScores));
  const ageDays = mostRecentAgeDays(sourceHistory, now);
  const calibrationState = deriveCalibrationState(distinctSessionCount, uncertaintyPct, ageDays);
  const trainingMax = tuning.trainingMaxByState[calibrationState];
  const trainingTargetScore = capacityScore != null && trainingMax > 0 ? capacityScore * trainingMax : null;

  return {
    calibrationState,
    rawBaselineScore,
    capacityScore,
    trainingTargetScore,
    uncertaintyPct,
    distinctSessionCount,
  };
}
