/**
 * @ai-context Canonical metric definition codes. Every string here MUST match
 * a MetricDefinition.code row in the database. Server startup validates this.
 * Add new metrics here FIRST, then seed/migrate the DB.
 */

// ── Wearable / Daily Metrics ─────────────────────────────────
export const METRIC_BODY_WEIGHT = "body_weight" as const;
export const METRIC_DAILY_STEPS = "daily_steps" as const;
export const METRIC_SLEEP_DURATION = "sleep_duration" as const;
export const METRIC_RESTING_HEART_RATE = "resting_heart_rate" as const;
export const METRIC_HRV_RMSSD = "hrv_rmssd" as const;
export const METRIC_ACTIVE_CALORIES = "active_calories" as const;

// ── Blood Pressure ───────────────────────────────────────────
export const METRIC_BP_SYSTOLIC = "blood_pressure_systolic" as const;
export const METRIC_BP_DIASTOLIC = "blood_pressure_diastolic" as const;

// ── Performance ──────────────────────────────────────────────
export const METRIC_GRIP_STRENGTH = "grip_strength" as const;
export const METRIC_VO2_MAX = "vo2_max" as const;

// ── Lab Markers ──────────────────────────────────────────────
export const METRIC_HBA1C = "hba1c" as const;
export const METRIC_FASTING_GLUCOSE = "fasting_glucose" as const;
export const METRIC_TOTAL_CHOLESTEROL = "total_cholesterol" as const;
export const METRIC_LDL_CHOLESTEROL = "ldl_cholesterol" as const;
export const METRIC_HDL_CHOLESTEROL = "hdl_cholesterol" as const;
export const METRIC_TESTOSTERONE_TOTAL = "testosterone_total" as const;

// ── Pregnancy-Sensitive Lab Markers ──────────────────────────
export const METRIC_PROLACTIN = "prolactin" as const;
export const METRIC_ESTRADIOL = "estradiol" as const;
export const METRIC_ESTRIOL = "estriol" as const;
export const METRIC_PROGESTERONE = "progesterone" as const;
export const METRIC_TSH = "tsh" as const;
export const METRIC_URIC_ACID = "uric_acid" as const;
export const METRIC_FSH = "fsh" as const;
export const METRIC_GGT = "ggt" as const;
export const METRIC_HOMOCYSTEINE = "homocysteine" as const;
export const METRIC_CALCITONIN = "calcitonin" as const;
export const METRIC_FIBRINOGEN = "fibrinogen" as const;
export const METRIC_IRON_IBC_PERCENT_SAT = "iron_ibc_percent_sat" as const;

/** All wearable/daily metric codes for sync and aggregation */
export const KNOWN_WEARABLE_CODES = [
  METRIC_BODY_WEIGHT,
  METRIC_DAILY_STEPS,
  METRIC_SLEEP_DURATION,
  METRIC_RESTING_HEART_RATE,
  METRIC_HRV_RMSSD,
  METRIC_ACTIVE_CALORIES,
] as const;

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
] as const;

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
] as const;

export type KnownMetricCode = (typeof KNOWN_METRIC_CODES)[number];
