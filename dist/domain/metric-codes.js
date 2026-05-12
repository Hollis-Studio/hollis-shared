/**
 * @ai-context Canonical metric definition codes. Every string here MUST match
 * a MetricDefinition.code row in the database. Server startup validates this.
 * Add new metrics here FIRST, then seed/migrate the DB.
 */
// ── Wearable / Daily Metrics ─────────────────────────────────
export const METRIC_BODY_WEIGHT = "body_weight";
export const METRIC_BODY_FAT_PERCENTAGE = "body_fat_percentage";
export const METRIC_LEAN_BODY_MASS = "lean_body_mass";
export const METRIC_DAILY_STEPS = "daily_steps";
export const METRIC_SLEEP_DURATION = "sleep_duration";
export const METRIC_RESTING_HEART_RATE = "resting_heart_rate";
export const METRIC_HRV_RMSSD = "hrv_rmssd";
/**
 * SDNN (Standard Deviation of NN intervals) — provided by Apple HealthKit via
 * HKQuantityTypeIdentifierHeartRateVariabilitySDNN.
 *
 * SDNN measures total heart rate variability (all frequency bands). It is
 * clinically distinct from RMSSD, which captures short-term vagal activity.
 * Typical reference ranges for healthy adults:
 *   SDNN: 20–100 ms  (daily measurement; lower threshold at ~20 ms)
 *   RMSSD: 19–75 ms  (daily measurement)
 *
 * iOS devices report SDNN; Android Health Connect reports RMSSD. Both are
 * stored under separate codes to avoid cross-platform data conflation.
 */
export const METRIC_HRV_SDNN = "hrv_sdnn";
export const METRIC_ACTIVE_CALORIES = "active_calories";
// ── Blood Pressure ───────────────────────────────────────────
export const METRIC_BP_SYSTOLIC = "blood_pressure_systolic";
export const METRIC_BP_DIASTOLIC = "blood_pressure_diastolic";
// ── Performance ──────────────────────────────────────────────
export const METRIC_GRIP_STRENGTH = "grip_strength";
export const METRIC_VO2_MAX = "vo2_max";
// ── Lab Markers ──────────────────────────────────────────────
export const METRIC_HBA1C = "hba1c";
export const METRIC_FASTING_GLUCOSE = "fasting_glucose";
export const METRIC_TOTAL_CHOLESTEROL = "total_cholesterol";
export const METRIC_LDL_CHOLESTEROL = "ldl_cholesterol";
export const METRIC_HDL_CHOLESTEROL = "hdl_cholesterol";
export const METRIC_TESTOSTERONE_TOTAL = "testosterone_total";
// ── Pregnancy-Sensitive Lab Markers ──────────────────────────
export const METRIC_PROLACTIN = "prolactin";
export const METRIC_ESTRADIOL = "estradiol";
export const METRIC_ESTRIOL = "estriol";
export const METRIC_PROGESTERONE = "progesterone";
export const METRIC_TSH = "tsh";
export const METRIC_URIC_ACID = "uric_acid";
export const METRIC_FSH = "fsh";
export const METRIC_GGT = "ggt";
export const METRIC_HOMOCYSTEINE = "homocysteine";
export const METRIC_CALCITONIN = "calcitonin";
export const METRIC_FIBRINOGEN = "fibrinogen";
export const METRIC_IRON_IBC_PERCENT_SAT = "iron_ibc_percent_sat";
/** All wearable/daily metric codes for sync and aggregation */
export const KNOWN_WEARABLE_CODES = [
    METRIC_BODY_WEIGHT,
    METRIC_BODY_FAT_PERCENTAGE,
    METRIC_LEAN_BODY_MASS,
    METRIC_DAILY_STEPS,
    METRIC_SLEEP_DURATION,
    METRIC_RESTING_HEART_RATE,
    METRIC_HRV_RMSSD,
    METRIC_HRV_SDNN,
    METRIC_ACTIVE_CALORIES,
];
/** Pregnancy-sensitive metrics needing modified reference ranges */
export const PREGNANCY_SENSITIVE_CODES = [
    METRIC_PROLACTIN,
    METRIC_ESTRADIOL,
    METRIC_ESTRIOL,
    METRIC_PROGESTERONE,
    METRIC_TSH,
    METRIC_URIC_ACID,
    METRIC_FSH,
    METRIC_GGT,
    METRIC_HOMOCYSTEINE,
    METRIC_CALCITONIN,
    METRIC_FIBRINOGEN,
    METRIC_IRON_IBC_PERCENT_SAT,
];
/** All known metric codes for DB validation */
export const KNOWN_METRIC_CODES = [
    ...KNOWN_WEARABLE_CODES,
    METRIC_BP_SYSTOLIC,
    METRIC_BP_DIASTOLIC,
    METRIC_GRIP_STRENGTH,
    METRIC_VO2_MAX,
    METRIC_HBA1C,
    METRIC_FASTING_GLUCOSE,
    METRIC_TOTAL_CHOLESTEROL,
    METRIC_LDL_CHOLESTEROL,
    METRIC_HDL_CHOLESTEROL,
    METRIC_TESTOSTERONE_TOTAL,
    ...PREGNANCY_SENSITIVE_CODES,
];
//# sourceMappingURL=metric-codes.js.map