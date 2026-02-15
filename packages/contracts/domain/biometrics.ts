/**
 * @ai-context Biometric Key Registry | Canonical biometric keys for validation
 *
 * This module defines the canonical set of valid biometric keys used throughout
 * the application for health metrics tracking. Uses camelCase convention.
 *
 * IMPORTANT: This is the single source of truth for valid biometric keys.
 * All new biometric data should use these canonical keys.
 *
 * Legacy PascalCase keys are supported via the BIOMETRIC_KEY_ALIASES map
 * and the toCanonicalKey() helper function.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';
import { type BiometricSource, BiometricSourceSchema } from './clinical';
import { baseDocumentSchema, isoDateSchema } from './common';

// ============================================================================
// BIOMETRIC ENTRY CONTRACT
// ============================================================================

export const BiometricEntryContractSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  key: z.string(),
  value: z.number(),
  unit: z.string(),
  source: BiometricSourceSchema,
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Backward-compatible schema using baseDocumentSchema.
 * Includes optional id and labPanelId fields.
 */
export const biometricEntrySchema = baseDocumentSchema.extend({
  id: z.string().optional(),
  userId: z.string(),
  labPanelId: z.string().optional().nullable(),
  date: isoDateSchema,
  key: z.string().min(1),
  value: z.number(),
  unit: z.string().min(1),
  source: BiometricSourceSchema,
  isVerified: z.boolean(),
});

export type BiometricEntryContract = z.infer<typeof biometricEntrySchema>;

/**
 * Input type for creating a new biometric entry.
 * Contains only the fields required by the server's create endpoint.
 * Server-generated fields (id, userId, isVerified, createdAt, updatedAt) are excluded.
 */
export interface BiometricCreateInput {
  key: string;
  value: number;
  unit: string;
  source: BiometricSource;
  date: string; // ISO Date String (yyyy-mm-dd)
}

// ============================================================================
// BIOMETRIC KEYS (Canonical Registry)
// ============================================================================

/**
 * All valid biometric keys.
 *
 * Convention: camelCase for consistency with modern codebase standards.
 * Legacy PascalCase keys are mapped via BIOMETRIC_KEY_ALIASES.
 */
export const BIOMETRIC_KEYS = [
  // Body Composition
  'weight',
  'bodyFatPercent',
  'leanMass',
  'bmi',

  // Heart Rate & Cardiovascular
  'restingHr',
  'activeHr',
  'hrv',
  'vo2Max',
  'bloodPressureSystolic',
  'bloodPressureDiastolic',

  // Activity & Performance
  'steps',
  'caloriesBurned',
  'activeMinutes',
  'strain',
  'trainingLoad',
  'gripStrength',

  // Sleep
  'sleepDuration',
  'deepSleepPercent',
  'remSleepPercent',

  // Recovery
  'recoveryScore',
] as const;

export type BiometricKey = (typeof BIOMETRIC_KEYS)[number];

/**
 * Zod schema for validating biometric keys.
 * Use this in validation schemas instead of z.string().
 */
export const BiometricKeySchema = z.enum(BIOMETRIC_KEYS, {
  errorMap: () => ({
    message: `biometricKey must be one of: ${BIOMETRIC_KEYS.join(', ')}`,
  }),
});

// ============================================================================
// BIOMETRIC KEY CONSTANTS
// ============================================================================

/** Centralized biometric key constants for equality checks */
export const BIOMETRIC_KEY = {
  // Body Composition
  WEIGHT: 'weight' as BiometricKey,
  BODY_FAT_PERCENT: 'bodyFatPercent' as BiometricKey,
  LEAN_MASS: 'leanMass' as BiometricKey,
  BMI: 'bmi' as BiometricKey,

  // Heart Rate & Cardiovascular
  RESTING_HR: 'restingHr' as BiometricKey,
  ACTIVE_HR: 'activeHr' as BiometricKey,
  HRV: 'hrv' as BiometricKey,
  VO2_MAX: 'vo2Max' as BiometricKey,
  BLOOD_PRESSURE_SYSTOLIC: 'bloodPressureSystolic' as BiometricKey,
  BLOOD_PRESSURE_DIASTOLIC: 'bloodPressureDiastolic' as BiometricKey,

  // Activity & Performance
  STEPS: 'steps' as BiometricKey,
  CALORIES_BURNED: 'caloriesBurned' as BiometricKey,
  ACTIVE_MINUTES: 'activeMinutes' as BiometricKey,
  STRAIN: 'strain' as BiometricKey,
  TRAINING_LOAD: 'trainingLoad' as BiometricKey,
  GRIP_STRENGTH: 'gripStrength' as BiometricKey,

  // Sleep
  SLEEP_DURATION: 'sleepDuration' as BiometricKey,
  DEEP_SLEEP_PERCENT: 'deepSleepPercent' as BiometricKey,
  REM_SLEEP_PERCENT: 'remSleepPercent' as BiometricKey,

  // Recovery
  RECOVERY_SCORE: 'recoveryScore' as BiometricKey,
} as const;

// ============================================================================
// BIOMETRIC KEY LABELS
// ============================================================================

/**
 * Human-readable labels for biometric keys
 */
export const BIOMETRIC_KEY_LABELS: Record<BiometricKey, string> = {
  // Body Composition
  weight: 'Body Weight',
  bodyFatPercent: 'Body Fat Percentage',
  leanMass: 'Lean Body Mass',
  bmi: 'BMI',

  // Heart Rate & Cardiovascular
  restingHr: 'Resting Heart Rate',
  activeHr: 'Active Heart Rate',
  hrv: 'Heart Rate Variability',
  vo2Max: 'VO2 Max',
  bloodPressureSystolic: 'Blood Pressure (Systolic)',
  bloodPressureDiastolic: 'Blood Pressure (Diastolic)',

  // Activity & Performance
  steps: 'Daily Steps',
  caloriesBurned: 'Calories Burned',
  activeMinutes: 'Active Minutes',
  strain: 'Strain Score',
  trainingLoad: 'Training Load',
  gripStrength: 'Grip Strength',

  // Sleep
  sleepDuration: 'Sleep Duration',
  deepSleepPercent: 'Deep Sleep Percentage',
  remSleepPercent: 'REM Sleep Percentage',

  // Recovery
  recoveryScore: 'Recovery Score',
};

// ============================================================================
// LEGACY KEY ALIASES
// ============================================================================

/**
 * Maps legacy PascalCase and other variant keys to canonical camelCase keys.
 * Used for backwards compatibility with existing database records.
 */
export const BIOMETRIC_KEY_ALIASES: Record<string, BiometricKey> = {
  // Weight variants
  Weight: 'weight',
  WEIGHT: 'weight',

  // Body Fat variants
  BodyFat: 'bodyFatPercent',
  BodyFatPercentage: 'bodyFatPercent',
  BodyFatPercent: 'bodyFatPercent',
  BODY_FAT: 'bodyFatPercent',
  body_fat_percent: 'bodyFatPercent',

  // Lean Mass variants
  LeanMass: 'leanMass',
  MuscleMass: 'leanMass',
  MuscleMassKg: 'leanMass',
  lean_mass: 'leanMass',

  // BMI variants
  BMI: 'bmi',

  // Resting HR variants
  RestingHeartRate: 'restingHr',
  RestingHR: 'restingHr',
  RestingHr: 'restingHr',
  resting_hr: 'restingHr',

  // Active HR variants
  ActiveHeartRate: 'activeHr',
  ActiveHR: 'activeHr',
  ActiveHr: 'activeHr',
  active_hr: 'activeHr',

  // HRV variants
  HRV: 'hrv',
  HeartRateVariability: 'hrv',

  // VO2 Max variants
  VO2Max: 'vo2Max',
  Vo2Max: 'vo2Max',
  vo2_max: 'vo2Max',

  // Blood Pressure variants
  BloodPressureSystolic: 'bloodPressureSystolic',
  SystolicBP: 'bloodPressureSystolic',
  blood_pressure_systolic: 'bloodPressureSystolic',
  BloodPressureDiastolic: 'bloodPressureDiastolic',
  DiastolicBP: 'bloodPressureDiastolic',
  blood_pressure_diastolic: 'bloodPressureDiastolic',

  // Steps variants
  Steps: 'steps',
  DailySteps: 'steps',

  // Calories variants
  CaloriesBurned: 'caloriesBurned',
  Calories: 'caloriesBurned',
  calories_burned: 'caloriesBurned',

  // Active Minutes variants
  ActiveMinutes: 'activeMinutes',
  active_minutes: 'activeMinutes',

  // Sleep variants
  SleepDuration: 'sleepDuration',
  Sleep: 'sleepDuration',
  sleep_duration: 'sleepDuration',
  DeepSleepPercent: 'deepSleepPercent',
  DeepSleep: 'deepSleepPercent',
  deep_sleep_percent: 'deepSleepPercent',
  RemSleepPercent: 'remSleepPercent',
  REMSleep: 'remSleepPercent',
  rem_sleep_percent: 'remSleepPercent',

  // Recovery variants
  RecoveryScore: 'recoveryScore',
  Recovery: 'recoveryScore',
  recovery_score: 'recoveryScore',

  // Strain variants
  Strain: 'strain',
  StrainScore: 'strain',

  // Training Load variants
  TrainingLoad: 'trainingLoad',
  training_load: 'trainingLoad',

  // Grip Strength variants
  GripStrength: 'gripStrength',
  grip_strength: 'gripStrength',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a string is a valid canonical biometric key
 */
export function isBiometricKey(value: string): value is BiometricKey {
  return (BIOMETRIC_KEYS as readonly string[]).includes(value);
}

/**
 * Convert a legacy/variant key to the canonical biometric key.
 * Returns undefined if the key is not recognized.
 *
 * @param dbKey - The key from database or external source (may be PascalCase, snake_case, etc.)
 * @returns The canonical camelCase BiometricKey, or undefined if not found
 *
 * @example
 * toCanonicalKey('Weight') // => 'weight'
 * toCanonicalKey('BodyFatPercentage') // => 'bodyFatPercent'
 * toCanonicalKey('restingHr') // => 'restingHr' (already canonical)
 * toCanonicalKey('unknown') // => undefined
 */
export function toCanonicalKey(dbKey: string): BiometricKey | undefined {
  // Check if already canonical
  if (isBiometricKey(dbKey)) {
    return dbKey;
  }

  // Check aliases
  return BIOMETRIC_KEY_ALIASES[dbKey];
}

/**
 * Get biometric key label by key.
 * Falls back to the key itself if not found in labels.
 */
export function getBiometricKeyLabel(key: BiometricKey): string {
  return BIOMETRIC_KEY_LABELS[key];
}

/**
 * Normalize a key and get its label.
 * Useful for displaying legacy keys with proper labels.
 *
 * @param key - Any biometric key variant
 * @returns The human-readable label, or the original key if not recognized
 */
export function getBiometricLabel(key: string): string {
  const canonical = toCanonicalKey(key);
  if (canonical) {
    return BIOMETRIC_KEY_LABELS[canonical];
  }
  // Fallback: check legacy PascalCase labels
  if (BIOMETRIC_DB_KEY_LABELS[key]) {
    return BIOMETRIC_DB_KEY_LABELS[key];
  }
  // Last resort: convert camelCase/PascalCase to spaced words
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

// ============================================================================
// LEGACY PASCALCASE LABELS (Database Field Names)
// ============================================================================

/**
 * User-facing labels for biometric keys stored in the database.
 * Maps database field names (e.g., "RestingHeartRate") to readable labels (e.g., "Resting Heart Rate").
 *
 * NOTE: These are legacy PascalCase keys from the database. For canonical camelCase
 * labels, use BIOMETRIC_KEY_LABELS above.
 */
export const BIOMETRIC_DB_KEY_LABELS: Record<string, string> = {
  // Heart metrics
  RestingHeartRate: 'Resting Heart Rate',
  HeartRate: 'Heart Rate',
  HRV: 'Heart Rate Variability',
  HeartRateVariability: 'Heart Rate Variability',

  // Sleep metrics
  RemSleep: 'REM Sleep',
  DeepSleep: 'Deep Sleep',
  LightSleep: 'Light Sleep',
  TotalSleep: 'Total Sleep',
  SleepDuration: 'Sleep Duration',
  SleepEfficiency: 'Sleep Efficiency',
  SleepLatency: 'Sleep Latency',

  // Readiness/Recovery
  ReadinessScore: 'Readiness Score',
  RecoveryScore: 'Recovery Score',
  StrainScore: 'Strain Score',

  // Activity metrics
  Steps: 'Steps',
  ActiveCalories: 'Active Calories',
  TotalCalories: 'Total Calories',
  ActiveMinutes: 'Active Minutes',

  // Body metrics
  Weight: 'Weight',
  BodyFat: 'Body Fat',
  MuscleMass: 'Muscle Mass',
  BMI: 'BMI',

  // Respiratory
  RespiratoryRate: 'Respiratory Rate',
  SpO2: 'Blood Oxygen (SpO2)',
  OxygenSaturation: 'Oxygen Saturation',

  // Temperature
  BodyTemperature: 'Body Temperature',
  SkinTemperature: 'Skin Temperature',

  // Blood pressure
  BloodPressureSystolic: 'Blood Pressure (Systolic)',
  BloodPressureDiastolic: 'Blood Pressure (Diastolic)',

  // Other
  Stress: 'Stress Level',
  Energy: 'Energy Level',
};

// ============================================================================
// BIOMETRIC DESCRIPTIONS
// ============================================================================

/**
 * Informational descriptions for biometric keys (wearable metrics).
 * Maps database field names to educational descriptions about what each metric measures.
 */
export const BIOMETRIC_DESCRIPTIONS: Record<string, string> = {
  // Heart metrics
  RestingHeartRate: 'Resting heart rate (RHR) is the number of times your heart beats per minute when you\'re completely at rest. A lower RHR generally indicates better cardiovascular fitness and more efficient heart function. Normal range is 60-100 bpm, though well-trained athletes may have RHR as low as 40 bpm. Elevated RHR can indicate stress, dehydration, illness, or overtraining. It\'s best measured first thing in the morning before getting out of bed.',
  HeartRate: 'Heart rate measures how many times your heart beats per minute. During rest, a normal heart rate is 60-100 bpm. During exercise, it increases to meet oxygen demands. Maximum heart rate is roughly 220 minus your age. Monitoring heart rate during exercise helps ensure appropriate training intensity\u2014different zones target different adaptations from fat burning to peak performance.',
  HRV: 'Heart Rate Variability (HRV) measures the variation in time between consecutive heartbeats, controlled by your autonomic nervous system. Higher HRV indicates a more adaptable, resilient nervous system with good recovery capacity. Low HRV suggests stress, fatigue, illness, or overtraining. HRV is best measured during sleep or upon waking. It\'s a powerful indicator of readiness to train and overall nervous system health. Improving sleep, managing stress, and aerobic fitness increase HRV.',
  HeartRateVariability: 'Heart Rate Variability (HRV) measures the variation in time between consecutive heartbeats, controlled by your autonomic nervous system. Higher HRV indicates a more adaptable, resilient nervous system with good recovery capacity. Low HRV suggests stress, fatigue, illness, or overtraining. HRV is best measured during sleep or upon waking. It\'s a powerful indicator of readiness to train and overall nervous system health. Improving sleep, managing stress, and aerobic fitness increase HRV.',

  // Sleep metrics
  RemSleep: 'REM (Rapid Eye Movement) sleep is the dream stage, critical for memory consolidation, emotional processing, and learning. Adults typically need 90-120 minutes of REM per night (about 20-25% of total sleep). REM sleep predominates in the second half of the night, so cutting sleep short particularly reduces REM. Insufficient REM impairs cognitive function, creativity, and emotional regulation. Alcohol significantly suppresses REM sleep even if total sleep time seems adequate.',
  DeepSleep: 'Deep sleep (slow-wave sleep) is the most restorative phase, when tissue repair, immune function, and memory consolidation occur. Growth hormone is primarily released during deep sleep. Adults need 60-90 minutes of deep sleep nightly (about 15-20% of total sleep). Deep sleep predominates early in the night and decreases with age. Factors that reduce deep sleep include alcohol, caffeine, irregular schedules, and sleep disorders. Exercise and cool bedroom temperatures promote deep sleep.',
  LightSleep: 'Light sleep (stages N1 and N2) serves as a transition between wakefulness and deeper sleep stages. It typically comprises 50-60% of total sleep time. While less restorative than deep or REM sleep, light sleep still supports memory and learning. Easy awakening during light sleep is normal. Excessive light sleep relative to deep and REM may indicate sleep fragmentation or disorders. Sleep architecture naturally changes across the night, cycling through light, deep, and REM stages.',
  TotalSleep: 'Total sleep time measures the complete duration of sleep, excluding time spent awake. Adults need 7-9 hours for optimal health. Chronic sleep deprivation (less than 6 hours) increases risk of obesity, diabetes, cardiovascular disease, and cognitive decline. Both too little and too much sleep (over 9-10 hours consistently) are associated with health issues. Quality matters as much as quantity\u2014time spent in deep and REM sleep determines how restorative sleep is.',
  SleepDuration: 'Sleep duration tracks the total time spent asleep. Optimal duration is 7-9 hours for most adults, though individual needs vary. Consistently getting less than 6 hours impairs immune function, hormone balance, cognitive performance, and metabolic health. Sleep need is influenced by age, activity level, stress, and genetics. Time in bed doesn\'t equal sleep time\u2014tracking actual sleep duration provides more accurate health insights than bedtime alone.',
  SleepEfficiency: 'Sleep efficiency is the percentage of time in bed actually spent sleeping. Healthy efficiency is 85% or higher\u2014meaning if you\'re in bed for 8 hours, you sleep at least 6.8 hours. Low efficiency (frequent waking, long time falling asleep) fragments sleep and reduces its benefits. Causes include sleep disorders, anxiety, poor sleep hygiene, or spending too much time in bed. Cognitive behavioral therapy for insomnia and consistent sleep schedules improve efficiency.',
  SleepLatency: 'Sleep latency is the time it takes to fall asleep after going to bed. Healthy sleep latency is 10-20 minutes. Falling asleep instantly (under 5 minutes) typically indicates sleep deprivation. Taking longer than 30 minutes suggests insomnia or circadian rhythm issues. Factors affecting sleep latency include caffeine, screen exposure, stress, irregular schedules, and exercise timing. Consistent improvement in sleep latency often reflects better sleep health overall.',

  // Readiness/Recovery
  ReadinessScore: 'Readiness score is a composite metric (usually 0-100) calculated by wearables using HRV, resting heart rate, sleep quality, activity levels, and other inputs. Higher scores suggest your body is recovered and ready for physical or mental demands. Lower scores indicate a need for rest, lighter activity, or recovery focus. While algorithms vary between devices, readiness scores help personalize training loads and identify when to push versus recover.',
  RecoveryScore: 'Recovery score assesses how well your body has recovered from prior stress and activity, typically using sleep quality, HRV, and resting heart rate. A high recovery score means your nervous system has restored balance and you\'re prepared for training or demanding tasks. Low recovery warrants reduced intensity or rest days. Tracking recovery over time reveals patterns\u2014how different activities, foods, or stressors affect your ability to bounce back.',
  StrainScore: 'Strain score quantifies the physiological load on your body from activity, typically using heart rate data. Higher strain reflects more intense or prolonged exertion\u2014not just exercise, but also stress and lack of sleep. Balancing strain with recovery prevents overtraining and injury. The goal isn\'t to minimize strain but to match it with adequate recovery. Accumulating moderate strain while maintaining high recovery scores indicates sustainable training.',

  // Activity metrics
  Steps: 'Daily steps measure walking and running activity throughout the day. While 10,000 steps is a popular target, research shows health benefits begin around 4,000-5,000 steps with additional gains up to 8,000-10,000. More steps correlate with lower mortality risk, improved cardiovascular health, and better metabolic markers. Steps are an accessible metric for overall activity level. Increasing daily steps is one of the simplest interventions for sedentary individuals.',
  ActiveCalories: 'Active calories measure energy expended through physical activity, excluding the calories your body burns at rest (basal metabolic rate). Higher active calorie burn indicates more physical activity. This metric helps gauge workout intensity and daily activity levels. Active calorie goals should be personalized\u2014they vary based on body size, fitness level, and goals. Consistency matters more than hitting specific numbers.',
  TotalCalories: 'Total calories burned combines your basal metabolic rate (calories burned at rest to maintain basic functions) plus active calories from movement and exercise. Larger, more muscular, and more active individuals burn more total calories. Understanding total calorie expenditure helps with nutrition planning for weight management. Note that calorie estimates from wearables have significant error margins (10-25%); use trends rather than absolute numbers.',
  ActiveMinutes: 'Active minutes track time spent in moderate to vigorous physical activity, where heart rate is elevated above baseline. Guidelines recommend 150+ minutes of moderate or 75+ minutes of vigorous activity weekly for health benefits. Active minutes capture not just formal exercise but also activities like brisk walking, climbing stairs, or active chores. Achieving regular active minutes reduces cardiovascular disease, diabetes, and mortality risk.',

  // Body metrics
  Weight: 'Body weight is the total mass of your body. While often used as a health indicator, it\'s important to consider body composition (muscle vs. fat) rather than weight alone. Weight fluctuates daily by 2-5 lbs due to hydration, food intake, and hormonal changes. Tracking trends over weeks provides more meaningful insights than day-to-day changes. Optimal weight is highly individual and depends on height, muscle mass, age, and health goals.',
  BodyFat: 'Body fat percentage measures the proportion of your total body weight that is fat tissue. It\'s a more accurate indicator of health than weight alone. Healthy ranges are typically 10-20% for men and 18-28% for women, varying by age. Consumer devices use bioelectrical impedance, which has significant error\u2014use for trend tracking rather than absolute values. Very low body fat impairs hormone function; high body fat increases metabolic disease risk.',
  MuscleMass: 'Muscle mass measures the weight of skeletal muscle tissue in your body. Higher muscle mass improves metabolic health, insulin sensitivity, bone strength, and functional capacity with aging. Muscle is metabolically active, burning more calories than fat tissue. Resistance training and adequate protein intake (1.6-2.2g/kg body weight) are essential for building and maintaining muscle. Muscle mass naturally declines with age (sarcopenia), making preservation crucial.',
  BMI: 'Body Mass Index (BMI) is weight (kg) divided by height (m) squared. It categorizes individuals as underweight (<18.5), normal (18.5-24.9), overweight (25-29.9), or obese (>=30). While useful for population studies, BMI doesn\'t distinguish muscle from fat\u2014a muscular person may be classified as overweight. Waist circumference, body fat percentage, and metabolic health markers provide better individual health assessment than BMI alone.',

  // Respiratory
  RespiratoryRate: 'Respiratory rate is the number of breaths taken per minute. Normal resting rate is 12-20 breaths/min for adults. Lower rates often indicate good cardiovascular fitness and relaxation. Elevated resting respiratory rate can signal illness, anxiety, heart failure, lung conditions, or metabolic disturbance. During sleep, rates of 12-16 are typical. Significant changes in baseline respiratory rate\u2014especially increases\u2014warrant medical attention as an early indicator of health changes.',
  SpO2: 'SpO2 (peripheral oxygen saturation) measures the percentage of hemoglobin carrying oxygen. Normal levels are 95-100%. Values below 94% indicate hypoxemia and warrant medical evaluation. SpO2 drops can occur with respiratory infections, sleep apnea, high altitude, or lung conditions. Consumer wearables measure SpO2 during sleep to screen for sleep-disordered breathing. Consistently low readings need professional assessment.',
  OxygenSaturation: 'Oxygen saturation indicates how much oxygen your red blood cells are carrying. Normal is 95-100%. Values below 94% suggest inadequate oxygen delivery to tissues. Low oxygen saturation can result from lung disease, sleep apnea, altitude, or cardiovascular problems. Brief dips during sleep may indicate obstructive events. Persistent low readings require medical evaluation. Pulse oximetry accuracy decreases with cold extremities, motion, and dark nail polish.',

  // Temperature
  BodyTemperature: 'Body temperature reflects core metabolic activity. Normal is around 98.6\u00B0F (37\u00B0C) but varies by individual, time of day (lower in morning), menstrual cycle, and age. Fever (above 100.4\u00B0F/38\u00B0C) indicates immune activation. Low body temperature can suggest hypothyroidism, infection, or metabolic dysfunction. Wearables typically measure skin temperature as a proxy. Tracking trends helps identify illness onset or menstrual cycle phases.',
  SkinTemperature: 'Skin temperature measured by wearables reflects peripheral blood flow and thermoregulation. It varies significantly with ambient temperature, activity, and time of day\u2014lower in extremities, higher at core. Nighttime skin temperature tracking can detect fever onset, menstrual cycle phases, and illness patterns. Deviations from personal baseline (rather than absolute values) are most meaningful. Consistently elevated skin temperature during sleep may indicate impending illness.',

  // Blood pressure
  BloodPressureSystolic: 'Systolic blood pressure is the top number in a blood pressure reading, measuring arterial pressure when the heart beats. Normal is below 120 mmHg. Elevated (120-129), Stage 1 hypertension (130-139), and Stage 2 hypertension (140+) indicate increasing cardiovascular risk. Lifestyle factors like diet (DASH diet, reducing sodium), exercise, weight management, and stress reduction significantly impact blood pressure.',
  BloodPressureDiastolic: 'Diastolic blood pressure is the bottom number, measuring arterial pressure between heartbeats when the heart rests. Normal is below 80 mmHg. Readings of 80-89 indicate Stage 1 hypertension, 90+ is Stage 2. Diastolic pressure tends to decrease after age 60 even as systolic rises. Both numbers matter for health risk assessment. Blood pressure varies throughout the day and with stress, activity, and caffeine.',

  // Other
  Stress: 'Stress level scores from wearables typically use HRV analysis to assess sympathetic (fight-or-flight) versus parasympathetic (rest-and-digest) nervous system balance. Higher stress scores indicate sympathetic dominance. While some stress is necessary and beneficial, chronic elevated stress impairs recovery, immune function, sleep, and overall health. Tracking stress patterns helps identify triggers and evaluate the effectiveness of stress management techniques like breathwork, meditation, or lifestyle changes.',
  Energy: 'Energy level tracking combines multiple inputs\u2014sleep quality, activity, HRV, and sometimes user-reported data\u2014to estimate perceived energy and vitality. Low energy scores may indicate poor sleep, overtraining, illness onset, or chronic stress. Consistently low energy despite adequate sleep warrants investigation of underlying causes like nutrition, thyroid function, or mental health. Optimizing sleep, activity balance, and recovery typically improves energy metrics.',

  // Fitness metrics
  VO2Max: 'VO2 max estimates the maximum oxygen your body can use during intense exercise, expressed as milliliters per kilogram per minute. It\'s the gold standard for cardiovascular fitness and strongly predicts longevity. Higher VO2 max means more efficient oxygen delivery and utilization. Values above 40 for men and 35 for women are considered good; elite athletes exceed 70. VO2 max improves significantly with consistent aerobic and high-intensity interval training.',

  // Habit/Compliance metrics
  workoutsPerWeek: 'Workouts per week measures the average number of logged workout sessions over the past 30 days, normalized to a weekly rate. This metric is derived by counting all completed workout entries in your training log and dividing by the number of weeks in the measurement period. Consistent training frequency is associated with better fitness outcomes\u2014research suggests 3-5 sessions per week supports most health and performance goals.',
  foodLoggingDaysPerWeek: 'Food logged days per week tracks how many days you recorded at least one meal in your nutrition log, averaged over the past 30 days. This metric measures logging consistency rather than diet quality. Consistent food logging is strongly correlated with successful nutrition goals\u2014studies show people who track food intake are more likely to make informed dietary choices and maintain awareness of eating patterns.',
  checkinsPerWeek: 'Check-ins per week measures how often you complete your daily evening check-in, averaged over the past 30 days. Check-ins capture subjective wellness data like energy, mood, and recovery that wearables cannot detect. Regular check-ins provide valuable context for interpreting objective metrics and help identify patterns between lifestyle factors and how you feel. Aim for 5-7 check-ins per week for the most complete picture.',
  nutritionQuality: 'Nutrition quality score (0-100) is calculated from your logged meals by analyzing macronutrient balance, micronutrient density, and food variety. The algorithm evaluates protein adequacy, fiber intake, processed food ratio, and overall dietary diversity. Higher scores indicate meals that align with evidence-based nutrition guidelines. This metric rewards consistent healthy eating patterns rather than perfection\u2014small improvements compound over time.',
};

/**
 * Gets the informational description for a biometric key.
 * Returns undefined if no description exists.
 */
export function getBiometricDescription(key: string): string | undefined {
  return BIOMETRIC_DESCRIPTIONS[key];
}
