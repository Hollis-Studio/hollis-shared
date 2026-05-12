/**
 * @ai-context Canonical metric definition codes. Every string here MUST match
 * a MetricDefinition.code row in the database. Server startup validates this.
 * Add new metrics here FIRST, then seed/migrate the DB.
 */
export declare const METRIC_BODY_WEIGHT: "body_weight";
export declare const METRIC_BODY_FAT_PERCENTAGE: "body_fat_percentage";
export declare const METRIC_LEAN_BODY_MASS: "lean_body_mass";
export declare const METRIC_DAILY_STEPS: "daily_steps";
export declare const METRIC_SLEEP_DURATION: "sleep_duration";
export declare const METRIC_RESTING_HEART_RATE: "resting_heart_rate";
export declare const METRIC_HRV_RMSSD: "hrv_rmssd";
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
export declare const METRIC_HRV_SDNN: "hrv_sdnn";
export declare const METRIC_ACTIVE_CALORIES: "active_calories";
export declare const METRIC_BP_SYSTOLIC: "blood_pressure_systolic";
export declare const METRIC_BP_DIASTOLIC: "blood_pressure_diastolic";
export declare const METRIC_GRIP_STRENGTH: "grip_strength";
export declare const METRIC_VO2_MAX: "vo2_max";
export declare const METRIC_HBA1C: "hba1c";
export declare const METRIC_FASTING_GLUCOSE: "fasting_glucose";
export declare const METRIC_TOTAL_CHOLESTEROL: "total_cholesterol";
export declare const METRIC_LDL_CHOLESTEROL: "ldl_cholesterol";
export declare const METRIC_HDL_CHOLESTEROL: "hdl_cholesterol";
export declare const METRIC_TESTOSTERONE_TOTAL: "testosterone_total";
export declare const METRIC_PROLACTIN: "prolactin";
export declare const METRIC_ESTRADIOL: "estradiol";
export declare const METRIC_ESTRIOL: "estriol";
export declare const METRIC_PROGESTERONE: "progesterone";
export declare const METRIC_TSH: "tsh";
export declare const METRIC_URIC_ACID: "uric_acid";
export declare const METRIC_FSH: "fsh";
export declare const METRIC_GGT: "ggt";
export declare const METRIC_HOMOCYSTEINE: "homocysteine";
export declare const METRIC_CALCITONIN: "calcitonin";
export declare const METRIC_FIBRINOGEN: "fibrinogen";
export declare const METRIC_IRON_IBC_PERCENT_SAT: "iron_ibc_percent_sat";
/** All wearable/daily metric codes for sync and aggregation */
export declare const KNOWN_WEARABLE_CODES: readonly ["body_weight", "body_fat_percentage", "lean_body_mass", "daily_steps", "sleep_duration", "resting_heart_rate", "hrv_rmssd", "hrv_sdnn", "active_calories"];
/** Pregnancy-sensitive metrics needing modified reference ranges */
export declare const PREGNANCY_SENSITIVE_CODES: readonly ["prolactin", "estradiol", "estriol", "progesterone", "tsh", "uric_acid", "fsh", "ggt", "homocysteine", "calcitonin", "fibrinogen", "iron_ibc_percent_sat"];
/** All known metric codes for DB validation */
export declare const KNOWN_METRIC_CODES: readonly ["body_weight", "body_fat_percentage", "lean_body_mass", "daily_steps", "sleep_duration", "resting_heart_rate", "hrv_rmssd", "hrv_sdnn", "active_calories", "blood_pressure_systolic", "blood_pressure_diastolic", "grip_strength", "vo2_max", "hba1c", "fasting_glucose", "total_cholesterol", "ldl_cholesterol", "hdl_cholesterol", "testosterone_total", "prolactin", "estradiol", "estriol", "progesterone", "tsh", "uric_acid", "fsh", "ggt", "homocysteine", "calcitonin", "fibrinogen", "iron_ibc_percent_sat"];
export type KnownMetricCode = (typeof KNOWN_METRIC_CODES)[number];
//# sourceMappingURL=metric-codes.d.ts.map