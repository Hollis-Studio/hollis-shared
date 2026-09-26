import type { CardioCapacityMetric, ProgressionCalibrationState } from "./engine.js";
/**
 * Progression Engine V2 calibration maths: the single implementation behind
 * the persisted `ProgressionEngineState` score fields. The Workouts app builds
 * engine state with it after every workout; the Workouts server uses it to
 * backfill `engineState` on baseline rows that have none. Pure and
 * deterministic: no clock reads (`now` is an input), no I/O, no zod.
 */
/** Tuning constants for engine-state calibration. Change a value here only. */
export declare const PROGRESSION_ENGINE_TUNING: {
    /** Fewer distinct sessions than this → `calibrating`. */
    readonly calibratingSessionCount: 3;
    /** Fewer distinct sessions than this → at best `provisional`. */
    readonly stableSessionCount: 6;
    /** `uncertaintyPct` above this keeps a baseline `provisional`. */
    readonly highUncertaintyPct: 0.08;
    /** Most recent non-outlier entries used for capacity and spread. */
    readonly recentHistoryWindow: 6;
    /** Cold-start cap: capacity ≤ raw baseline × (1 + this) while calibrating. */
    readonly coldStartCapacityUplift: 0.03;
    /** Newest session older than this many days demotes one calibration step. */
    readonly baselineStaleDays: 60;
    /** Lifting training-target decay per week of gap beyond `baselineStaleDays`. */
    readonly layoffDecayPerWeek: 0.01;
    /** Floor for the lifting layoff decay multiplier. */
    readonly layoffDecayFloor: 0.85;
    /** Lifting capacity = recent effort-adjusted mean × recent + raw baseline × rawBaseline. */
    readonly liftingCapacityBlend: {
        readonly recent: 0.75;
        readonly rawBaseline: 0.25;
    };
    /** Lifting capacity when a metric-basket e1RM is supplied. */
    readonly metricBasketCapacityBlend: {
        readonly recent: 0.65;
        readonly metricBasket: 0.35;
    };
    /** Epley at or below this rep count, Wathan above. */
    readonly e1rmCrossoverReps: 10;
    /** Share of reliable reps-in-reserve credited as extra reps. */
    readonly rirEffectiveRepCredit: 0.5;
    /** Reps in reserve above this are not credited further. */
    readonly rirCreditCap: 4;
    /** Training-target multiplier on capacity, by calibration state. */
    readonly trainingMaxByState: {
        readonly no_data: 0;
        readonly calibrating: 0.82;
        readonly provisional: 0.88;
        readonly stable: 0.92;
    };
};
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
    band?: {
        value: number;
        widthKg: number;
    } | null;
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
/** Epoch ms of a history date; an unparseable value is 0 so sorting stays deterministic. */
export declare function toEngineEpochMs(value: EngineDateInput): number;
/** The most recent `windowSize` entries, oldest → newest, sorted by date (array order is not trusted). */
export declare function recentHistoryWindow<T extends {
    date: EngineDateInput;
}>(history: readonly T[], windowSize: number): T[];
/** Sample coefficient of variation; null for fewer than two values or a non-positive mean. */
export declare function estimateRelativeSpread(values: readonly number[]): number | null;
export declare function calculateRirReliability(reps: number, rir: number | null | undefined): number;
/** Epley up to `e1rmCrossoverReps`, Wathan above; fractional effective reps allowed. */
export declare function estimateE1RMForEffectiveReps(weightKg: number, effectiveReps: number): number;
/**
 * e1RM with reliable reps-in-reserve credited as extra reps. Null for input
 * that is not a valid set (non-finite or negative load, non-integer or
 * negative reps). A zero-load or zero-rep set is valid and scores 0.
 */
export declare function estimateEffortAdjustedE1RM(input: {
    weightKg: number;
    reps: number;
    rir?: number | null;
}): EffortAdjustedE1RM | null;
/**
 * Calibration confidence from distinct sessions and spread. A newest session
 * older than `baselineStaleDays` demotes one step (stable → provisional →
 * calibrating); a missing, negative or non-finite age never demotes.
 */
export declare function deriveCalibrationState(distinctSessionCount: number, uncertaintyPct: number | null, mostRecentSessionAgeDays?: number | null): ProgressionCalibrationState;
/**
 * Lifting training-target multiplier for time away: 1 within
 * `baselineStaleDays`, then −`layoffDecayPerWeek` per week of further gap,
 * floored at `layoffDecayFloor`. Never applied to cardio.
 */
export declare function layoffDecayMultiplier(mostRecentSessionAgeDays: number | null): number;
/** Per-entry cardio workload score for one metric; null when that metric is absent. */
export declare function estimateCardioCapacityScoreForMetric(entry: Pick<CardioEngineSample, "durationSeconds" | "distanceKm" | "mets">, metric: CardioCapacityMetric): number | null;
/** Raw-baseline cardio score for one metric from the baseline's PR fields. */
export declare function estimateCardioRawBaselineScoreForMetric(bests: CardioEngineBests, metric: CardioCapacityMetric): number | null;
/** Raw-baseline cardio score in priority order mets_min > distance_km > duration_min. */
export declare function estimateCardioRawBaselineScore(bests: CardioEngineBests): number | null;
/**
 * The metric with the most positively scored entries; ties go to
 * mets_min > distance_km > duration_min. Scoring every entry on one metric
 * keeps incompatible units (METs·min ≈ 270 vs distance × 10 ≈ 50) out of one spread.
 */
export declare function pickDominantCardioMetric(entries: readonly Pick<CardioEngineSample, "durationSeconds" | "distanceKm" | "mets">[]): CardioCapacityMetric;
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
export declare function deriveLiftingEngineScores(input: DeriveLiftingEngineScoresInput): EngineStateScores;
/**
 * Cardio engine-state scores from baseline history. Scores are workload units
 * (METs·min, distance × 10, or minutes) on one dominant metric; capacity is a
 * plain mean (no PR blend) and there is no layoff decay.
 */
export declare function deriveCardioEngineScores(input: DeriveCardioEngineScoresInput): EngineStateScores;
//# sourceMappingURL=engine-state.d.ts.map