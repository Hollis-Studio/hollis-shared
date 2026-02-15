/**
 * @ai-context Health Metric Definitions Registry | Complete registry of all trackable health metrics
 *
 * This module contains the comprehensive HEALTH_METRIC_DEFINITIONS registry with:
 * - 100+ health metrics across 8 categories
 * - Unit specifications, improvement directions, normal ranges
 * - Detailed clinical descriptions for each metric
 *
 * CRITICAL: The `unit` field defines the ONLY acceptable unit for each metric.
 * Any data with a different unit MUST be converted before comparison or rejected.
 *
 * NOTE: All lab values use US standard units (mg/dL, ng/dL, etc.)
 *
 * BUSINESS CONTEXT:
 * This registry enables Hollis Health to track actual health outcomes (not just activity),
 * demonstrating ROI to clients and providing data to referring physicians.
 *
 * deps: none (pure data) | consumers: ./health-progress.ts, all services
 */

import type { HealthMetricCategory, HealthMetricDirection } from './health-metric-types';

/**
 * Definition for a single health metric including its expected unit,
 * improvement direction, and optional normal range.
 */
export interface HealthMetricDefinition {
  /** Expected unit for this metric - MUST match for safe comparison */
  unit: string;
  /** Direction of improvement */
  direction: HealthMetricDirection;
  /** Category for grouping */
  category: HealthMetricCategory;
  /** Human-friendly label for UI display */
  displayLabel: string;
  /** Optional normal/healthy range (for lab values) */
  normalRange?: { min: number; max: number };
  /** Informational description explaining what this metric measures and how to interpret it */
  description?: string;
}

/**
 * Central registry of all trackable health metrics.
 *
 * CRITICAL: The `unit` field defines the ONLY acceptable unit for each metric.
 * Any data with a different unit MUST be converted before comparison or rejected.
 *
 * NOTE: All lab values use US standard units (mg/dL, ng/dL, etc.)
 */
export const HEALTH_METRIC_DEFINITIONS = {
  // -------------------------------------------------------------------------
  // Body Composition
  // -------------------------------------------------------------------------
  /** Body weight in kilograms */
  weight: {
    unit: 'kg',
    direction: 'context',
    category: 'body_composition',
    displayLabel: 'Body Weight',
    description: 'Body weight is the total mass of your body. While often used as a health indicator, it\'s important to consider body composition (muscle vs. fat) rather than weight alone. Weight fluctuates daily due to hydration, food intake, and hormonal changes. Tracking trends over weeks provides more meaningful insights than day-to-day changes. Optimal weight is highly individual and depends on factors like height, muscle mass, age, and health goals.',
  },
  /** Body fat percentage from DEXA scan */
  bodyFatPercent: {
    unit: '%',
    direction: 'lower_better',
    category: 'body_composition',
    displayLabel: 'Body Fat %',
    description: 'Body fat percentage measures the proportion of your total body weight that is fat tissue. It\'s a more accurate indicator of health than weight alone, as it accounts for muscle mass. Healthy ranges vary by age and sex—typically 10-20% for men and 18-28% for women. Very low body fat can impair hormone function and immune health, while high body fat increases risk of metabolic diseases. DEXA scans provide the most accurate measurements.',
  },
  /** Lean (fat-free) mass in kilograms */
  leanMassKg: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'body_composition',
    displayLabel: 'Lean Mass',
    description: 'Lean body mass represents everything in your body except fat—including muscle, bone, organs, and water. Higher lean mass is associated with better metabolic health, stronger bones, improved insulin sensitivity, and greater functional capacity. Preserving lean mass during weight loss is crucial for maintaining metabolic rate and long-term health. Resistance training and adequate protein intake are key factors in building and maintaining lean mass.',
  },

  // -------------------------------------------------------------------------
  // Cardiovascular
  // -------------------------------------------------------------------------
  /** Resting heart rate */
  restingHR: {
    unit: 'bpm',
    direction: 'lower_better',
    category: 'cardiovascular',
    displayLabel: 'Resting Heart Rate',
    description: 'Resting heart rate (RHR) is the number of times your heart beats per minute when you\'re completely at rest. A lower RHR generally indicates better cardiovascular fitness and more efficient heart function. Normal range is 60-100 bpm, though well-trained athletes may have RHR as low as 40 bpm. Elevated RHR can indicate stress, dehydration, illness, or overtraining. It\'s best measured first thing in the morning before getting out of bed.',
  },
  /** Estimated VO2 max (cardiorespiratory fitness) */
  vo2MaxEstimate: {
    unit: 'ml/kg/min',
    direction: 'higher_better',
    category: 'cardiovascular',
    displayLabel: 'VO2 Max (Estimate)',
    description: 'VO2 max measures the maximum amount of oxygen your body can use during intense exercise, expressed as milliliters of oxygen per kilogram of body weight per minute. It\'s considered the gold standard for cardiorespiratory fitness. Higher VO2 max is strongly associated with longevity and reduced risk of cardiovascular disease. Values above 40 for men and 35 for women are considered good; elite endurance athletes often exceed 70. It can be improved through consistent aerobic training.',
  },
  /** Systolic blood pressure */
  bloodPressureSystolic: {
    unit: 'mmHg',
    direction: 'lower_better',
    category: 'cardiovascular',
    normalRange: { min: 90, max: 120 },
    displayLabel: 'Systolic BP',
    description: 'Systolic blood pressure is the top number in a blood pressure reading, measuring the pressure in your arteries when your heart beats. Normal systolic pressure is below 120 mmHg. Readings between 120-129 are elevated, 130-139 is stage 1 hypertension, and 140+ is stage 2 hypertension. Chronically elevated systolic pressure increases risk of heart attack, stroke, and kidney disease. Lifestyle factors like diet, exercise, stress management, and sodium intake significantly impact blood pressure.',
  },
  /** Diastolic blood pressure */
  bloodPressureDiastolic: {
    unit: 'mmHg',
    direction: 'lower_better',
    category: 'cardiovascular',
    normalRange: { min: 60, max: 80 },
    displayLabel: 'Diastolic BP',
    description: 'Diastolic blood pressure is the bottom number in a blood pressure reading, measuring the pressure in your arteries between heartbeats when the heart is resting. Normal diastolic pressure is below 80 mmHg. Readings of 80-89 indicate stage 1 hypertension, while 90+ indicates stage 2 hypertension. Unlike systolic pressure, diastolic pressure tends to decrease after age 60. Optimal blood pressure management requires attention to both numbers.',
  },

  // -------------------------------------------------------------------------
  // Metabolic (Lab Values)
  // -------------------------------------------------------------------------
  /** Hemoglobin A1C - 3-month average blood sugar */
  hba1c: {
    unit: '%',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 4.0, max: 5.6 },
    displayLabel: 'Hemoglobin A1C',
    description: 'Hemoglobin A1C (HbA1c) measures your average blood sugar level over the past 2-3 months by showing what percentage of hemoglobin proteins are coated with sugar. It\'s the primary test for diagnosing and monitoring diabetes. Normal is below 5.7%, prediabetes is 5.7-6.4%, and diabetes is 6.5% or higher. Unlike fasting glucose, A1C isn\'t affected by daily fluctuations, making it a reliable long-term marker. Every 1% reduction in A1C significantly reduces risk of diabetic complications.',
  },
  /** Fasting insulin */
  insulin: {
    unit: 'uIU/mL',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Insulin',
    description: 'Fasting insulin measures the amount of insulin in your blood after 8-12 hours without eating. Insulin is the hormone that regulates blood sugar by helping cells absorb glucose. High fasting insulin levels—even with normal blood sugar—can indicate insulin resistance, a precursor to type 2 diabetes. Optimal levels are typically 2-6 uIU/mL. Elevated insulin promotes fat storage and inflammation. Improving insulin sensitivity through diet, exercise, and sleep is fundamental to metabolic health.',
  },
  /** C-Peptide */
  cPeptide: {
    unit: 'ng/mL',
    direction: 'context',
    category: 'metabolic',
    displayLabel: 'C-Peptide',
    description: 'C-peptide is a byproduct of insulin production, released in equal amounts when the pancreas makes insulin. It measures how much insulin your body is naturally producing, unaffected by external insulin therapy. High levels suggest insulin resistance, while low levels may indicate type 1 diabetes or pancreatic dysfunction. Normal fasting range is 0.5-2.0 ng/mL. C-peptide helps distinguish between type 1 and type 2 diabetes and monitors pancreatic function over time.',
  },
  /** Fasting blood glucose */
  fastingGlucose: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 70, max: 99 },
    displayLabel: 'Fasting Glucose',
    description: 'Fasting blood glucose measures sugar levels in your blood after 8-12 hours of fasting. It\'s a primary screening tool for diabetes and prediabetes. Normal is 70-99 mg/dL, prediabetes is 100-125 mg/dL, and diabetes is 126 mg/dL or higher on two separate tests. Morning readings tend to be higher due to the "dawn phenomenon." While important, it should be interpreted alongside HbA1c for a complete picture of glucose metabolism.',
  },
  /** Adiponectin */
  adiponectin: {
    unit: 'ug/mL',
    direction: 'higher_better',
    category: 'metabolic',
    displayLabel: 'Adiponectin',
    description: 'Adiponectin is a protein hormone produced by fat cells that helps regulate glucose levels and fatty acid breakdown. Unlike most fat-derived hormones, higher adiponectin levels are beneficial—they improve insulin sensitivity, reduce inflammation, and protect against cardiovascular disease. Low adiponectin is associated with obesity, type 2 diabetes, and metabolic syndrome. Levels increase with weight loss, exercise, and diets rich in omega-3 fatty acids.',
  },
  /** Total cholesterol */
  totalCholesterol: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 0, max: 200 },
    displayLabel: 'Total Cholesterol',
    description: 'Total cholesterol measures the combined amount of LDL, HDL, and other lipids in your blood. While traditionally used as a cardiovascular risk marker, it\'s less informative than looking at individual components. Desirable levels are under 200 mg/dL. However, high total cholesterol driven by high HDL (protective) is very different from high total cholesterol driven by high LDL (harmful). Always interpret alongside your lipid panel breakdown.',
  },
  /** LDL ("bad") cholesterol */
  ldlCholesterol: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 0, max: 100 },
    displayLabel: 'LDL Cholesterol',
    description: 'LDL (low-density lipoprotein) cholesterol carries cholesterol to your arteries, where it can accumulate as plaque, narrowing blood vessels and increasing heart disease risk. Optimal is under 100 mg/dL; under 70 is recommended for high-risk individuals. LDL particle number and size matter too—small, dense LDL is more atherogenic. Reducing saturated fat, increasing fiber, exercise, and sometimes medications can effectively lower LDL.',
  },
  /** HDL ("good") cholesterol */
  hdlCholesterol: {
    unit: 'mg/dL',
    direction: 'higher_better',
    category: 'metabolic',
    normalRange: { min: 40, max: 999 },
    displayLabel: 'HDL Cholesterol',
    description: 'HDL (high-density lipoprotein) cholesterol is called "good" cholesterol because it transports cholesterol away from arteries back to the liver for removal. Higher levels are protective against heart disease. Optimal is above 60 mg/dL for men and 50 mg/dL for women; below 40 is a cardiovascular risk factor. Exercise, moderate alcohol, omega-3s, and quitting smoking can raise HDL. Very high HDL (over 100) may paradoxically increase risk in some genetic variants.',
  },
  /** Triglycerides */
  triglycerides: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 0, max: 150 },
    displayLabel: 'Triglycerides',
    description: 'Triglycerides are fats in your blood used for energy. High levels increase cardiovascular risk, especially when combined with low HDL. Normal is under 150 mg/dL, borderline is 150-199, high is 200-499, and very high is 500+. Unlike cholesterol, triglycerides respond dramatically to diet—reducing sugar, refined carbs, and alcohol can drop levels significantly within weeks. High triglycerides often indicate insulin resistance.',
  },
  /** Apolipoprotein B */
  apolipoproteinB: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Apolipoprotein B',
    description: 'Apolipoprotein B (ApoB) is a protein that carries atherogenic lipid particles (including LDL and VLDL) in the blood. Unlike LDL-C, which measures cholesterol content, ApoB counts the actual number of harmful particles. Many experts consider it the best single marker of cardiovascular risk from lipids. Optimal is under 90 mg/dL, with under 60 recommended for high-risk individuals. It\'s especially useful when LDL-C and particle count discordance is suspected.',
  },
  /** Oxidized LDL */
  oxidizedLdl: {
    unit: 'U/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Oxidized LDL',
    description: 'Oxidized LDL (oxLDL) is LDL cholesterol that has been damaged by free radicals. This oxidized form is significantly more atherogenic—it penetrates artery walls more easily and triggers inflammatory responses that accelerate plaque formation. Lower levels indicate better antioxidant status and reduced cardiovascular risk. Diet rich in antioxidants (colorful vegetables, berries), avoiding processed foods, and managing blood sugar help reduce oxLDL.',
  },
  /** Lipoprotein (a) */
  lipoproteinA: {
    unit: 'nmol/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Lipoprotein (a)',
    description: 'Lipoprotein(a) or Lp(a) is a genetic variant of LDL with an additional protein attached. High levels significantly increase cardiovascular and stroke risk, independent of other lipids. Unlike most lipids, Lp(a) is largely determined by genetics and doesn\'t respond well to lifestyle changes. Levels above 50 nmol/L (or 30 mg/dL) indicate elevated risk. Testing once in a lifetime is often sufficient. Those with high Lp(a) should aggressively manage other risk factors.',
  },
  /** Standard lipid panel */
  lipidPanel: {
    unit: 'panel',
    direction: 'context',
    category: 'metabolic',
    displayLabel: 'Lipid Panel',
    description: 'A standard lipid panel is a blood test measuring total cholesterol, LDL-C, HDL-C, and triglycerides. It provides a baseline assessment of cardiovascular lipid risk and is typically performed fasting. Results should be interpreted together rather than focusing on any single value. The ratios (triglyceride:HDL, total cholesterol:HDL) can provide additional risk insight. Most adults should have lipid panels checked every 4-6 years, more frequently if abnormal.',
  },
  /** NMR lipofraction with insulin */
  lipofractionNmr: {
    unit: 'panel',
    direction: 'context',
    category: 'metabolic',
    displayLabel: 'Lipofraction NMR',
    description: 'NMR lipofraction (Nuclear Magnetic Resonance) provides advanced lipid analysis beyond standard panels. It measures LDL particle number and size, small dense LDL, HDL particle characteristics, and insulin resistance markers. Small, dense LDL particles are more atherogenic than large, buoyant ones. This advanced testing is valuable when standard lipids appear normal but cardiovascular risk persists, or when there\'s discordance between LDL-C and particle number.',
  },
  /** Leptin */
  leptin: {
    unit: 'ng/mL',
    direction: 'context',
    category: 'metabolic',
    displayLabel: 'Leptin',
    description: 'Leptin is a hormone produced by fat cells that signals satiety to the brain and regulates energy balance. Higher body fat produces more leptin, but obesity often causes leptin resistance—where the brain stops responding to the hormone, leading to persistent hunger despite adequate energy stores. Context matters: high leptin with high body fat suggests resistance; low leptin can indicate insufficient fat stores. Weight loss temporarily reduces leptin, increasing hunger.',
  },
  /** Uric Acid */
  uricAcid: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Uric Acid',
    description: 'Uric acid is a waste product from the breakdown of purines (found in certain foods and produced by the body). High levels can crystallize in joints causing gout, and are associated with kidney stones, hypertension, and cardiovascular disease. Normal range is 2.5-7.0 mg/dL for men and 2.0-6.0 mg/dL for women. Reducing alcohol, fructose, red meat, and shellfish can lower levels. Emerging research links uric acid to metabolic syndrome.',
  },
  /** Lactate */
  lactate: {
    unit: 'mmol/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Lactate',
    description: 'Blood lactate is produced when cells generate energy without sufficient oxygen (anaerobic metabolism). Resting levels should be 0.5-2.2 mmol/L. Elevated resting lactate can indicate tissue hypoxia, mitochondrial dysfunction, liver disease, or medication effects. In exercise contexts, lactate threshold testing identifies the intensity at which lactate accumulates faster than it clears—a key marker for endurance training prescription.',
  },
  /** Lactate dehydrogenase */
  ldh: {
    unit: 'U/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'LDH',
    description: 'Lactate dehydrogenase (LDH) is an enzyme found in nearly all body tissues. Elevated levels indicate tissue damage or disease affecting the heart, liver, kidneys, muscles, or blood cells. Normal range is roughly 140-280 U/L. LDH rises after intense exercise, hemolysis, heart attack, liver disease, and certain cancers. It\'s a non-specific marker—elevations warrant further investigation to identify the source.',
  },
  /** Ammonia */
  ammonia: {
    unit: 'umol/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Ammonia',
    description: 'Blood ammonia is a waste product from protein metabolism, normally converted to urea by the liver for excretion. Elevated levels typically indicate liver dysfunction, as a healthy liver efficiently clears ammonia. Normal range is 15-45 umol/L. Very high ammonia is toxic to the brain, causing confusion or hepatic encephalopathy. Causes include liver disease, certain medications, genetic urea cycle disorders, and rarely, extreme protein intake.',
  },
  /** Gamma-glutamyl transferase */
  ggt: {
    unit: 'U/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'GGT',
    description: 'GGT (gamma-glutamyl transferase) is a liver enzyme that helps metabolize drugs and toxins. It\'s the most sensitive marker for bile duct problems and rises with alcohol use, fatty liver, and certain medications. Normal is under 55 U/L. Elevated GGT—even within normal range—is associated with increased cardiovascular risk, diabetes, and mortality. It reflects oxidative stress and metabolic dysfunction. Reducing alcohol and improving metabolic health lowers GGT.',
  },
  /** Amylase */
  amylase: {
    unit: 'U/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Amylase',
    description: 'Amylase is an enzyme produced by the pancreas and salivary glands that breaks down starches into sugars. Normal serum level is 25-125 U/L. Elevated amylase primarily suggests pancreatitis (inflammation of the pancreas), but can also rise with salivary gland issues, bowel obstruction, or kidney disease. In acute pancreatitis, levels spike 3-5 times normal within hours. Chronic elevation warrants investigation for pancreatic disorders.',
  },
  /** Lipase */
  lipase: {
    unit: 'U/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Lipase',
    description: 'Lipase is a pancreatic enzyme that breaks down dietary fats. It\'s more specific to pancreatic function than amylase. Normal range is 0-160 U/L. Elevated lipase is the preferred marker for diagnosing pancreatitis—levels rise within hours and remain elevated longer than amylase. Very high levels (3+ times normal) strongly suggest acute pancreatitis. Persistent mild elevations may indicate chronic pancreatitis or other abdominal conditions.',
  },
  /** Creatine Kinase */
  creatineKinase: {
    unit: 'U/L',
    direction: 'context',
    category: 'metabolic',
    displayLabel: 'Creatine Kinase (CK)',
    description: 'Creatine kinase (CK) is an enzyme found in muscles, heart, and brain. Levels rise when these tissues are damaged. Normal range varies widely (30-200 U/L) and is higher in muscular individuals. Intense exercise temporarily elevates CK—this is normal. Pathological causes include heart attack (CK-MB fraction), muscle disorders, statin medications, and rhabdomyolysis. Interpretation requires context: post-exercise elevation is expected, unexplained elevation needs investigation.',
  },
  /** Comprehensive Metabolic Panel */
  comprehensiveMetabolicPanel: {
    unit: 'panel',
    direction: 'context',
    category: 'metabolic',
    displayLabel: 'CMP (Comprehensive Metabolic Panel)',
    description: 'The Comprehensive Metabolic Panel (CMP) is a group of 14 blood tests providing a broad assessment of metabolism. It includes glucose, electrolytes (sodium, potassium, chloride, CO2), kidney function (BUN, creatinine), liver function (ALT, AST, ALP, bilirubin), and proteins (albumin, total protein). CMP is commonly used for annual checkups, monitoring chronic conditions, and evaluating symptoms. Abnormalities point toward specific organs for further investigation.',
  },
  /** Homocysteine */
  homocysteine: {
    unit: 'umol/L',
    direction: 'lower_better',
    category: 'metabolic',
    displayLabel: 'Homocysteine',
    description: 'Homocysteine is an amino acid produced during protein metabolism. Elevated levels damage blood vessel walls, increase clotting risk, and are associated with cardiovascular disease, stroke, and cognitive decline. Normal is under 15 umol/L; optimal is under 10. High homocysteine often results from B-vitamin deficiencies (B12, folate, B6) or MTHFR gene variants affecting folate metabolism. Supplementing B vitamins typically lowers levels, though cardiovascular benefit is debated.',
  },

  // -------------------------------------------------------------------------
  // Hormonal
  // -------------------------------------------------------------------------
  /** Calcitonin */
  calcitonin: {
    unit: 'pg/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Calcitonin',
    description: 'Calcitonin is a hormone produced by the thyroid gland that helps regulate calcium levels by inhibiting bone breakdown and promoting calcium excretion. Normal levels are under 10 pg/mL. It\'s primarily used as a tumor marker for medullary thyroid cancer, where levels become significantly elevated. Elevated calcitonin without thyroid cancer can occur with kidney disease, other thyroid conditions, or certain medications. It\'s not routinely tested in healthy individuals.',
  },
  /** Serum cortisol */
  cortisolSerum: {
    unit: 'ug/dL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Cortisol (Serum)',
    description: 'Cortisol is the body\'s primary stress hormone, following a daily rhythm—highest in the morning (6-23 ug/dL), lowest at midnight. It regulates metabolism, immune response, and blood sugar. Chronically elevated cortisol (Cushing\'s syndrome) causes weight gain, muscle weakness, and metabolic issues. Low cortisol (Addison\'s disease) causes fatigue and weakness. Cortisol is highly variable; testing requires specific timing. Chronic stress can dysregulate the cortisol rhythm.',
  },
  /** DHEA-S */
  dheaSulfate: {
    unit: 'ug/dL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'DHEA Sulfate',
    description: 'DHEA-S (dehydroepiandrosterone sulfate) is a hormone produced by the adrenal glands that serves as a precursor to sex hormones. It peaks in your 20s and declines with age—often used as a marker of adrenal function and biological aging. Low levels are associated with fatigue, depression, and reduced immune function. High levels may indicate PCOS, adrenal tumors, or overactive adrenals. Reference ranges vary significantly by age and sex.',
  },
  /** Estradiol */
  estradiol: {
    unit: 'pg/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Estradiol',
    description: 'Estradiol (E2) is the most potent and prevalent form of estrogen, essential for reproductive function, bone health, cardiovascular protection, and brain function. In women, levels fluctuate dramatically with the menstrual cycle (30-400 pg/mL), drop at menopause (<30 pg/mL), and are highest during pregnancy. In men, estradiol (10-40 pg/mL) is important for bone health and libido but shouldn\'t be too high. Interpretation requires context of age, sex, and cycle phase.',
  },
  /** Estriol */
  estriol: {
    unit: 'ng/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Estriol',
    description: 'Estriol (E3) is a weak estrogen primarily produced during pregnancy by the placenta. In non-pregnant individuals, levels are very low. During pregnancy, estriol levels rise significantly and can be used to assess fetal and placental health. Low levels during pregnancy may indicate chromosomal abnormalities or placental issues. Estriol is sometimes used in hormone replacement therapy as a milder alternative to estradiol.',
  },
  /** Estrone (E1) */
  estrone: {
    unit: 'pg/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Estrone (E1)',
    description: 'Estrone (E1) is a weaker estrogen that becomes the predominant form after menopause, produced primarily in fat tissue from adrenal precursors. Pre-menopause, levels are 30-200 pg/mL; post-menopause, 10-60 pg/mL. Higher estrone in postmenopausal women (especially with obesity) is associated with increased breast cancer risk. Understanding the balance of E1, E2, and E3 is important for hormone optimization and cancer risk assessment.',
  },
  /** Follicle-stimulating hormone */
  fsh: {
    unit: 'mIU/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'FSH',
    description: 'FSH (follicle-stimulating hormone) is produced by the pituitary gland to stimulate egg production in women and sperm production in men. In women, levels vary with the menstrual cycle and rise significantly at menopause (>30 mIU/mL) as ovarian function declines. Low FSH may indicate pituitary problems; high FSH suggests ovarian or testicular failure. It\'s essential for fertility assessment and diagnosing menopause or primary gonadal disorders.',
  },
  /** Free T3 */
  freeT3: {
    unit: 'pg/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Free T3',
    description: 'Free T3 (triiodothyronine) is the active thyroid hormone that regulates metabolism, energy, and body temperature. "Free" means it\'s not bound to proteins and is available for use. Normal range is 2.3-4.2 pg/mL. Low free T3 with normal TSH may indicate "low T3 syndrome" from illness, stress, or caloric restriction. T3 is converted from T4, so poor conversion (common with stress, inflammation, or deficiencies) can cause symptoms despite normal TSH.',
  },
  /** Free T4 */
  freeT4: {
    unit: 'ng/dL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Free T4',
    description: 'Free T4 (thyroxine) is the thyroid\'s main hormone output, serving as a precursor to active T3. Normal range is 0.8-1.8 ng/dL. TSH and free T4 together diagnose thyroid conditions: high TSH with low T4 indicates hypothyroidism; low TSH with high T4 indicates hyperthyroidism. Free T4 responds more quickly to thyroid changes than TSH, making it useful for monitoring treatment. It\'s less affected by binding protein variations than total T4.',
  },
  /** Progesterone */
  progesterone: {
    unit: 'ng/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Progesterone',
    description: 'Progesterone is produced by the ovaries after ovulation (and placenta during pregnancy) to prepare and maintain the uterus for pregnancy. Levels are low (<1 ng/mL) in the follicular phase, rise to 5-20 ng/mL after ovulation, and increase significantly during pregnancy. Low progesterone relative to estrogen ("estrogen dominance") is associated with PMS, irregular periods, and difficulty maintaining pregnancy. In men, progesterone plays roles in testosterone production.',
  },
  /** Prolactin */
  prolactin: {
    unit: 'ng/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Prolactin',
    description: 'Prolactin is produced by the pituitary gland, primarily known for stimulating breast milk production. Normal levels are under 25 ng/mL in women and under 20 ng/mL in men. High prolactin (hyperprolactinemia) can suppress sex hormones, causing irregular periods, infertility, low libido, and erectile dysfunction. Causes include pituitary tumors (prolactinomas), medications, hypothyroidism, and chronic stress. Mildly elevated levels should be retested; very high levels warrant imaging.',
  },
  /** Prostate-specific antigen */
  psa: {
    unit: 'ng/mL',
    direction: 'lower_better',
    category: 'hormonal',
    displayLabel: 'PSA',
    description: 'PSA (prostate-specific antigen) is a protein produced by the prostate gland. It\'s used as a screening tool for prostate cancer, though it\'s imperfect—PSA rises with age, benign enlargement, infections, and sexual activity, not just cancer. Generally, under 4.0 ng/mL is normal, but context matters greatly. PSA velocity (rate of change) and ratio of free to total PSA help distinguish benign from malignant causes. Discuss screening timing and implications with your doctor.',
  },
  /** Parathyroid hormone */
  pth: {
    unit: 'pg/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'PTH',
    description: 'PTH (parathyroid hormone) regulates calcium and phosphorus levels by increasing calcium release from bones, absorption from intestines, and retention by kidneys. Normal range is 15-65 pg/mL. High PTH with high calcium indicates primary hyperparathyroidism; high PTH with low calcium suggests secondary hyperparathyroidism (often from vitamin D deficiency or kidney disease). PTH should always be interpreted alongside calcium and vitamin D levels.',
  },
  /** Reverse T3 */
  reverseT3: {
    unit: 'ng/dL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Reverse T3',
    description: 'Reverse T3 (rT3) is an inactive form of thyroid hormone produced when the body converts T4 away from active T3. High rT3 (>25 ng/dL) often indicates the body is in "conservation mode" due to stress, illness, inflammation, caloric restriction, or chronic disease. This is sometimes called "euthyroid sick syndrome." The ratio of T3 to rT3 can reveal thyroid hormone utilization issues missed by standard TSH testing, especially in chronic fatigue scenarios.',
  },
  /** Total testosterone (context-dependent: age, gender, goals) */
  testosteroneTotal: {
    unit: 'ng/dL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Testosterone (Total)',
    description: 'Total testosterone measures all testosterone in blood, both free (active) and protein-bound. Normal ranges are 300-1000 ng/dL for men and 15-70 ng/dL for women. Levels peak in the 20s and decline 1-2% yearly thereafter. Low testosterone causes fatigue, reduced muscle mass, low libido, and mood changes. Interpretation requires considering free testosterone, SHBG, symptoms, and time of day (levels are highest in the morning). Optimization depends on individual health goals.',
  },
  /** Testosterone panel (Free / Total / SHBG) */
  testosteronePanel: {
    unit: 'ng/dL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Testosterone (Free / Total / SHBG)',
    description: 'A comprehensive testosterone panel includes total testosterone, free testosterone (the active, unbound fraction), and SHBG (sex hormone-binding globulin). Free testosterone matters most for symptoms—even with normal total testosterone, high SHBG reduces the available hormone. This panel provides a complete picture: total availability, actual usable hormone, and binding status. It\'s essential for accurate assessment, especially when symptoms don\'t match total testosterone levels.',
  },
  /** Thyroglobulin antibodies */
  thyroglobulinAb: {
    unit: 'IU/mL',
    direction: 'lower_better',
    category: 'hormonal',
    displayLabel: 'Thyroglobulin Ab',
    description: 'Thyroglobulin antibodies (TgAb) are autoantibodies that target thyroglobulin, a protein used in thyroid hormone production. Elevated levels (>4 IU/mL) indicate autoimmune thyroid disease, present in 70-80% of Hashimoto\'s thyroiditis and 50-70% of Graves\' disease. TgAb is also used to monitor thyroid cancer patients—presence can interfere with thyroglobulin tumor marker testing. Elevated antibodies can exist for years before thyroid dysfunction develops.',
  },
  /** Thyroperoxidase antibodies */
  thyroperoxidaseAb: {
    unit: 'IU/mL',
    direction: 'lower_better',
    category: 'hormonal',
    displayLabel: 'Thyroperoxidase Ab',
    description: 'TPO antibodies (thyroperoxidase antibodies) attack the enzyme needed for thyroid hormone production. They\'re the most sensitive marker for autoimmune thyroid disease, elevated in 90%+ of Hashimoto\'s thyroiditis. Positive TPO with normal TSH predicts future hypothyroidism—risk increases with higher antibody levels. Some people have elevated TPO for years with normal thyroid function. Elevated antibodies warrant monitoring and optimization of factors that may trigger autoimmunity (gut health, vitamin D, selenium).',
  },
  /** Thyroid-stimulating hormone */
  tsh: {
    unit: 'uIU/mL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'TSH',
    description: 'TSH (thyroid-stimulating hormone) from the pituitary gland tells the thyroid how much hormone to produce. It\'s the primary screening test for thyroid function. Normal range is 0.4-4.0 uIU/mL, though optimal is debated (many feel best at 1-2). High TSH indicates hypothyroidism (thyroid isn\'t producing enough); low TSH indicates hyperthyroidism (too much thyroid hormone). TSH alone can miss central hypothyroidism and conversion issues—free T3 and T4 provide a fuller picture.',
  },

  // -------------------------------------------------------------------------
  // Performance (Unique to Fitness Business)
  // -------------------------------------------------------------------------
  /** Grip strength - longevity marker, strong predictor of all-cause mortality */
  gripStrength: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'performance',
    displayLabel: 'Grip Strength',
    description: 'Grip strength is measured using a hand dynamometer and is one of the most powerful predictors of overall health and longevity. Research consistently shows grip strength correlates with all-cause mortality, cardiovascular disease risk, and cognitive decline better than blood pressure or activity levels. Normal varies by age and sex: 30-55 kg for men, 20-35 kg for women. It reflects total body strength, nutritional status, and neurological function. Improving grip strength through resistance training benefits overall health.',
  },

  // -------------------------------------------------------------------------
  // Hematology
  // -------------------------------------------------------------------------
  /** CBC with differential */
  cbcWithDifferential: {
    unit: 'panel',
    direction: 'context',
    category: 'hematology',
    displayLabel: 'CBC with Differential',
    description: 'A Complete Blood Count with Differential is a comprehensive blood test measuring red blood cells (oxygen carriers), white blood cells (immune function), platelets (clotting), hemoglobin, and hematocrit. The "differential" breaks down white cell types: neutrophils, lymphocytes, monocytes, eosinophils, and basophils. This panel screens for anemia, infections, immune disorders, bleeding problems, and blood cancers. It\'s one of the most commonly ordered tests for overall health assessment.',
  },
  /** Ferritin */
  ferritin: {
    unit: 'ng/mL',
    direction: 'context',
    category: 'hematology',
    displayLabel: 'Ferritin',
    description: 'Ferritin is the body\'s iron storage protein. Low ferritin (<30 ng/mL) indicates depleted iron stores, often causing fatigue, weakness, and hair loss before anemia develops. Optimal ferritin for energy and performance is typically 50-150 ng/mL. However, ferritin also rises with inflammation, making it unreliable during illness. Very high ferritin (>300) can indicate iron overload (hemochromatosis), inflammation, or liver disease. Context and other iron markers (iron, TIBC) help interpretation.',
  },
  /** Iron, IBC, % Saturation */
  ironIbcPercentSat: {
    unit: '%',
    direction: 'context',
    category: 'hematology',
    displayLabel: 'Iron, IBC, % Sat',
    description: 'This iron panel measures serum iron, iron-binding capacity (IBC or TIBC), and transferrin saturation percentage. Together they reveal iron availability and transport. Low iron with high IBC and low saturation (<20%) indicates iron deficiency. High saturation (>45%) may suggest iron overload. Normal saturation is 20-45%. Unlike ferritin, these markers aren\'t affected by inflammation. Athletes, menstruating women, and vegetarians are at higher risk for deficiency.',
  },
  /** G6PD */
  g6pd: {
    unit: 'U/g Hb',
    direction: 'context',
    category: 'hematology',
    displayLabel: 'G6PD',
    description: 'G6PD (glucose-6-phosphate dehydrogenase) is an enzyme that protects red blood cells from oxidative damage. G6PD deficiency is the most common enzyme deficiency worldwide, affecting 400+ million people. Those with low G6PD activity may experience hemolytic anemia when exposed to certain medications (antimalarials, sulfa drugs), fava beans, or infections. Testing is important before prescribing certain medications. Normal values vary by lab method.',
  },
  /** Fibrinogen */
  fibrinogen: {
    unit: 'mg/dL',
    direction: 'context',
    category: 'hematology',
    displayLabel: 'Fibrinogen',
    description: 'Fibrinogen is a protein produced by the liver essential for blood clotting—it converts to fibrin to form clots. Normal range is 200-400 mg/dL. Low fibrinogen increases bleeding risk; high fibrinogen (>400) is associated with cardiovascular disease, stroke, and is an acute phase reactant that rises with inflammation. Chronically elevated fibrinogen is an independent cardiovascular risk factor. Exercise, omega-3s, and reducing inflammation can help lower elevated levels.',
  },

  // -------------------------------------------------------------------------
  // Inflammatory / Immune
  // -------------------------------------------------------------------------
  /** ANA (Antinuclear Antibody) */
  antinuclearAntibody: {
    unit: 'titer',
    direction: 'context',
    category: 'inflammatory',
    displayLabel: 'ANA (Antinuclear Antibody)',
    description: 'Antinuclear Antibodies (ANA) are autoantibodies that mistakenly target the body\'s own cell nuclei. A positive ANA test (typically 1:80 or higher) is associated with autoimmune diseases like lupus, Sjögren\'s syndrome, and rheumatoid arthritis. However, 15-20% of healthy people have positive ANA without disease. The pattern and titer matter—higher titers and specific patterns suggest particular conditions. A positive ANA requires clinical correlation and often additional specific antibody testing.',
  },
  /** High-sensitivity CRP */
  hsCrp: {
    unit: 'mg/L',
    direction: 'lower_better',
    category: 'inflammatory',
    displayLabel: 'HS CRP',
    description: 'High-sensitivity C-reactive protein (hs-CRP) is a precise measure of low-grade systemic inflammation and a powerful predictor of cardiovascular disease. Optimal is under 1.0 mg/L, moderate risk is 1-3 mg/L, and high risk is over 3 mg/L. It rises with infections, injuries, and chronic conditions, so interpret in context. Persistent elevation despite no acute illness suggests chronic inflammation from metabolic dysfunction, periodontal disease, or other sources. Diet, exercise, and addressing root causes lower hs-CRP.',
  },
  /** Myeloperoxidase */
  myeloperoxidase: {
    unit: 'pmol/L',
    direction: 'lower_better',
    category: 'inflammatory',
    displayLabel: 'Myeloperoxidase (MPO)',
    description: 'Myeloperoxidase (MPO) is an enzyme released by white blood cells during inflammation that can damage blood vessel walls. Elevated MPO is an independent predictor of cardiovascular events and arterial plaque vulnerability, even when cholesterol is normal. It reflects active arterial inflammation and oxidative stress. Normal is under 400 pmol/L. High MPO suggests aggressive atherosclerosis requiring enhanced risk reduction strategies beyond standard lipid management.',
  },
  /** Cytokine Panel 13 */
  cytokinePanel13: {
    unit: 'panel',
    direction: 'context',
    category: 'inflammatory',
    displayLabel: 'Cytokine Panel 13',
    description: 'A cytokine panel measures inflammatory signaling molecules like interleukins (IL-6, IL-1β, IL-10), TNF-α, and others. Cytokines are the communication system of the immune response—some promote inflammation, others resolve it. Elevated pro-inflammatory cytokines are associated with chronic diseases from heart disease to depression. This advanced panel identifies specific inflammatory pathways and can guide targeted interventions. Interpretation requires expertise as patterns matter more than individual values.',
  },
  /** PLAC Test (Lp-PLA2) */
  placTest: {
    unit: 'ng/mL',
    direction: 'lower_better',
    category: 'inflammatory',
    displayLabel: 'PLAC Test',
    description: 'The PLAC test measures Lp-PLA2 (lipoprotein-associated phospholipase A2), an enzyme produced in arterial plaque. Unlike hs-CRP which reflects systemic inflammation, elevated Lp-PLA2 (>200 ng/mL) specifically indicates unstable, rupture-prone arterial plaque. High Lp-PLA2 significantly increases stroke and heart attack risk, independent of cholesterol levels. It\'s especially valuable for assessing risk in people with otherwise "normal" lipids but other risk factors.',
  },
  /** Rheumatoid Factor */
  rheumatoidFactor: {
    unit: 'IU/mL',
    direction: 'lower_better',
    category: 'inflammatory',
    displayLabel: 'Rheumatoid Factor',
    description: 'Rheumatoid Factor (RF) is an autoantibody found in about 80% of rheumatoid arthritis patients. Normal is under 14 IU/mL. However, RF isn\'t specific—it\'s elevated in other autoimmune conditions, chronic infections, and even 5-10% of healthy older adults. High RF with symptoms strongly suggests rheumatoid arthritis; isolated elevation requires further investigation. RF levels can indicate disease severity and prognosis but don\'t always correlate with symptom intensity.',
  },
  /** Sedimentation Rate */
  sedRate: {
    unit: 'mm/hr',
    direction: 'lower_better',
    category: 'inflammatory',
    displayLabel: 'Sed Rate',
    description: 'Erythrocyte Sedimentation Rate (ESR or "sed rate") measures how quickly red blood cells settle in a tube over one hour—faster settling indicates inflammation. Normal is 0-20 mm/hr for men and 0-30 mm/hr for women (increases with age). ESR is a non-specific marker; elevations occur with infections, autoimmune diseases, cancer, and chronic conditions. It\'s useful for monitoring disease activity in conditions like rheumatoid arthritis and polymyalgia rheumatica, though it responds slowly to changes.',
  },

  // -------------------------------------------------------------------------
  // Nutritional (Micronutrients)
  // -------------------------------------------------------------------------
  /** Vitamin D (25-hydroxy) */
  vitaminD: {
    unit: 'ng/mL',
    direction: 'higher_better',
    category: 'nutritional',
    normalRange: { min: 30, max: 100 },
    displayLabel: 'Vitamin D (25-Hydroxy)',
    description: 'Vitamin D (25-hydroxy) is actually a hormone critical for bone health, immune function, mood, and muscle function. Deficiency (<30 ng/mL) is extremely common and linked to increased infections, depression, and chronic diseases. Optimal levels are 40-60 ng/mL. Most people need 2,000-5,000 IU daily to maintain optimal levels, more if deficient. Sun exposure helps but isn\'t sufficient for most. Vitamin D should be taken with fat and vitamin K2 for optimal absorption and safety.',
  },
  /** Vitamin B12 */
  vitaminB12: {
    unit: 'pg/mL',
    direction: 'higher_better',
    category: 'nutritional',
    displayLabel: 'Vitamin B12',
    description: 'Vitamin B12 is essential for nerve function, DNA synthesis, and red blood cell production. Deficiency causes fatigue, neurological symptoms (numbness, balance issues), and cognitive problems. Normal range is 200-900 pg/mL, but optimal is above 500 pg/mL. Deficiency is common in vegans, older adults (reduced absorption), and those on metformin or acid blockers. Serum B12 can be normal despite functional deficiency—MMA and homocysteine are more sensitive markers.',
  },
  /** Folate (RBC) */
  folateRBC: {
    unit: 'ng/mL',
    direction: 'higher_better',
    category: 'nutritional',
    displayLabel: 'Folate (RBC)',
    description: 'RBC folate measures long-term folate status by looking at folate inside red blood cells, reflecting levels over the past 3 months. It\'s more stable than serum folate. Folate is essential for DNA synthesis, cell division, and preventing neural tube defects in pregnancy. Normal is 280-791 ng/mL. Low folate causes anemia and elevated homocysteine. MTHFR gene variants affect folate metabolism—some people require methylfolate rather than folic acid supplementation.',
  },
  /** Magnesium (Serum) */
  magnesiumSerum: {
    unit: 'mg/dL',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Magnesium (Serum)',
    description: 'Serum magnesium measures magnesium in blood, but only 1% of body magnesium is in serum—it\'s tightly regulated and often normal despite deficiency. Normal range is 1.7-2.4 mg/dL. Magnesium is involved in 300+ enzymatic reactions including energy production, muscle function, and nervous system regulation. Deficiency (common due to soil depletion and processed foods) causes muscle cramps, anxiety, poor sleep, and arrhythmias. RBC magnesium is a better indicator of tissue stores.',
  },
  /** Magnesium (RBC) */
  magnesiumRBC: {
    unit: 'mg/dL',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Magnesium (RBC)',
    description: 'RBC magnesium measures magnesium inside red blood cells, better reflecting intracellular and tissue levels than serum magnesium. Optimal is 5.0-6.5 mg/dL (varies by lab). Low RBC magnesium with normal serum magnesium confirms tissue deficiency. Symptoms include fatigue, muscle cramps, anxiety, insomnia, and constipation. Stress depletes magnesium; high performers and athletes often need 400-600 mg daily. Magnesium glycinate, citrate, or threonate are well-absorbed forms.',
  },
  /** Manganese (RBC) */
  manganeseRBC: {
    unit: 'ug/L',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Manganese (RBC)',
    description: 'Manganese is a trace mineral essential for bone formation, antioxidant function, and metabolism of carbohydrates, amino acids, and cholesterol. RBC manganese reflects longer-term status than serum. Deficiency is rare but can impair bone health and glucose metabolism. Excess is also problematic—high levels from environmental exposure can cause neurological damage similar to Parkinson\'s. Normal ranges vary by lab. Dietary sources include whole grains, nuts, leafy greens, and tea.',
  },
  /** Copper (RBC) */
  copperRBC: {
    unit: 'ug/dL',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Copper (RBC)',
    description: 'Copper is an essential trace mineral involved in iron metabolism, connective tissue formation, and nerve function. RBC copper reflects tissue stores. Deficiency causes anemia, neutropenia, and neurological symptoms; excess can cause liver damage and oxidative stress. Copper and zinc have an important balance—too much zinc can deplete copper. Wilson\'s disease causes dangerous copper accumulation. Normal ranges are 70-140 ug/dL. Sources include shellfish, nuts, seeds, and organ meats.',
  },
  /** Selenium (RBC) */
  seleniumRBC: {
    unit: 'ug/L',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Selenium (RBC)',
    description: 'Selenium is a trace mineral critical for thyroid function, antioxidant defense (glutathione peroxidase), and immune health. RBC selenium reflects long-term status. Optimal is 200-250 ug/L. Deficiency impairs thyroid conversion and increases autoimmune thyroid risk. However, excess selenium is toxic—don\'t supplement without testing. Soil selenium varies geographically, affecting food content. Brazil nuts are extremely high in selenium—1-2 daily provides adequate intake.',
  },
  /** Zinc (RBC) */
  zincRBC: {
    unit: 'ug/dL',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Zinc (RBC)',
    description: 'Zinc is essential for immune function, wound healing, taste/smell, and testosterone production—involved in 300+ enzymatic processes. RBC zinc reflects tissue status better than serum. Deficiency is common, causing frequent infections, slow healing, hair loss, and low testosterone. Optimal RBC zinc is 1,000-1,500 ug/dL. Vegetarians, athletes, and those with GI issues are at higher risk. High-dose zinc supplementation can deplete copper and should be balanced.',
  },
  /** Iodine (Serum) */
  iodineSerum: {
    unit: 'ug/L',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Iodine (Serum)',
    description: 'Iodine is essential for thyroid hormone production. Deficiency causes hypothyroidism, goiter, and developmental issues in pregnancy. While overt deficiency is uncommon due to iodized salt, marginal deficiency may be increasing as salt intake declines. Normal serum iodine is 40-92 ug/L. Excess iodine can also cause thyroid dysfunction, especially in those with underlying thyroid disease. Kelp and high-dose iodine supplements can provide excessive amounts.',
  },
  /** Molybdenum (Serum) */
  molybdenumSerum: {
    unit: 'ug/L',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Molybdenum (Serum)',
    description: 'Molybdenum is a trace mineral serving as a cofactor for enzymes that process sulfites and purines. Deficiency is extremely rare in humans with normal diet. It\'s important for proper detoxification of sulfites (found in wine, dried fruit) and uric acid metabolism. Some individuals with genetic sulfite oxidase deficiency benefit from supplementation. Normal serum levels are 0.5-1.5 ug/L. Dietary sources include legumes, grains, and leafy vegetables.',
  },
  /** Phosphorus */
  phosphorus: {
    unit: 'mg/dL',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Phosphorus',
    description: 'Phosphorus is the second most abundant mineral in the body after calcium, essential for bone structure, energy production (ATP), and cell function. Normal serum level is 2.5-4.5 mg/dL. Low phosphorus causes muscle weakness, bone pain, and confusion. High phosphorus (common in kidney disease) accelerates cardiovascular calcification and bone loss. Phosphorus levels are regulated by PTH, vitamin D, and kidney function. High intake from processed foods and cola may be harmful.',
  },
  /** CoQ10 */
  coq10: {
    unit: 'ug/mL',
    direction: 'higher_better',
    category: 'nutritional',
    displayLabel: 'CoQ10',
    description: 'Coenzyme Q10 is vital for mitochondrial energy production and serves as a powerful antioxidant. Levels decline with age and statin use (statins block CoQ10 synthesis). Low CoQ10 contributes to statin muscle side effects, fatigue, and potentially heart failure. Optimal levels are 1.0-3.0 ug/mL. Supplementation (100-300 mg/day) benefits those on statins, with heart failure, migraines, or fatigue. Ubiquinol form is better absorbed, especially over age 40.',
  },
  /** OmegaCheck (omega-3 index) */
  omegaCheck: {
    unit: '%',
    direction: 'higher_better',
    category: 'nutritional',
    displayLabel: 'OmegaCheck',
    description: 'The Omega-3 Index measures the percentage of EPA and DHA in red blood cell membranes, reflecting tissue omega-3 status over 3 months. Values above 8% are associated with lowest cardiovascular risk; below 4% indicates high risk. Most Americans are 4-5%. Omega-3s reduce inflammation, triglycerides, and cardiovascular events. Achieving optimal levels typically requires eating fatty fish 3x weekly or supplementing with 2-4g of EPA/DHA daily. This is one of the most actionable nutritional markers.',
  },
  /** Methylmalonic Acid */
  methylmalonicAcid: {
    unit: 'nmol/L',
    direction: 'lower_better',
    category: 'nutritional',
    displayLabel: 'MMA (Methylmalonic Acid)',
    description: 'Methylmalonic Acid (MMA) is a sensitive marker of vitamin B12 status at the cellular level. Elevated MMA (>270 nmol/L) indicates functional B12 deficiency, even when serum B12 appears normal. This matters because neurological damage can occur before anemia develops. MMA rises before serum B12 falls, making it an early warning marker. It\'s especially useful for vegetarians, older adults, and those with GI issues affecting B12 absorption.',
  },
  /** Ceruloplasmin */
  ceruloplasmin: {
    unit: 'mg/dL',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'Ceruloplasmin',
    description: 'Ceruloplasmin is the main copper-carrying protein in blood, also important for iron metabolism. Normal range is 20-50 mg/dL. Low ceruloplasmin suggests Wilson\'s disease (copper accumulation disorder), copper deficiency, or liver disease. High levels occur with inflammation, infection, and estrogen use. Interpreting ceruloplasmin requires considering serum copper—their ratio helps distinguish between conditions. It\'s also an acute phase reactant that rises with inflammation.',
  },
  /** MTHFR */
  mthfr: {
    unit: 'genotype',
    direction: 'context',
    category: 'nutritional',
    displayLabel: 'MTHFR',
    description: 'MTHFR is a genetic test for variants in the methylenetetrahydrofolate reductase gene, which affects folate metabolism and methylation. Common variants (C677T, A1298C) reduce enzyme efficiency by 30-70%, potentially elevating homocysteine and affecting detoxification, neurotransmitter production, and DNA repair. Individuals with variants may benefit from methylated B vitamins (methylfolate, methylcobalamin) rather than synthetic forms. Significance is debated—not everyone with variants has problems.',
  },

  // -------------------------------------------------------------------------
  // Snake_case Aliases (for goal-metrics compatibility)
  // -------------------------------------------------------------------------
  /** Body fat percentage (snake_case alias) */
  body_fat_percent: {
    unit: '%',
    direction: 'lower_better',
    category: 'body_composition',
    displayLabel: 'Body Fat %',
    description: 'Body fat percentage measures the proportion of your total body weight that is fat tissue. It\'s a more accurate indicator of health than weight alone, as it accounts for muscle mass. Healthy ranges vary by age and sex—typically 10-20% for men and 18-28% for women.',
  },
  /** Lean body mass (snake_case alias) */
  lean_mass: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'body_composition',
    displayLabel: 'Lean Mass',
    description: 'Lean body mass represents everything in your body except fat—including muscle, bone, organs, and water. Higher lean mass is associated with better metabolic health, stronger bones, and improved insulin sensitivity.',
  },
  /** Resting heart rate (snake_case alias) */
  resting_hr: {
    unit: 'bpm',
    direction: 'lower_better',
    category: 'cardiovascular',
    displayLabel: 'Resting Heart Rate',
    description: 'Resting heart rate is the number of times your heart beats per minute when you\'re completely at rest. A lower RHR generally indicates better cardiovascular fitness and more efficient heart function. Normal range is 60-100 bpm.',
  },
  /** Systolic blood pressure (snake_case alias) */
  blood_pressure_systolic: {
    unit: 'mmHg',
    direction: 'lower_better',
    category: 'cardiovascular',
    normalRange: { min: 90, max: 120 },
    displayLabel: 'Systolic BP',
    description: 'Systolic blood pressure is the top number in a blood pressure reading, measuring the pressure in your arteries when your heart beats. Normal systolic pressure is below 120 mmHg.',
  },
  /** Diastolic blood pressure (snake_case alias) */
  blood_pressure_diastolic: {
    unit: 'mmHg',
    direction: 'lower_better',
    category: 'cardiovascular',
    normalRange: { min: 60, max: 80 },
    displayLabel: 'Diastolic BP',
    description: 'Diastolic blood pressure is the bottom number in a blood pressure reading, measuring the pressure in your arteries between heartbeats when the heart is resting. Normal diastolic pressure is below 80 mmHg.',
  },
  /** VO2 max (snake_case alias) */
  vo2_max: {
    unit: 'ml/kg/min',
    direction: 'higher_better',
    category: 'cardiovascular',
    displayLabel: 'VO2 Max (Estimate)',
    description: 'VO2 max measures the maximum amount of oxygen your body can use during intense exercise. It\'s considered the gold standard for cardiorespiratory fitness. Higher VO2 max is strongly associated with longevity and reduced risk of cardiovascular disease.',
  },
  /** Fasting glucose (snake_case alias) */
  fasting_glucose: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 70, max: 99 },
    displayLabel: 'Fasting Glucose',
    description: 'Fasting blood glucose measures sugar levels in your blood after 8-12 hours of fasting. Normal is 70-99 mg/dL, prediabetes is 100-125 mg/dL, and diabetes is 126 mg/dL or higher.',
  },
  /** Total cholesterol (snake_case alias) */
  total_cholesterol: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 0, max: 200 },
    displayLabel: 'Total Cholesterol',
    description: 'Total cholesterol measures the combined amount of LDL, HDL, and other lipids in your blood. Desirable levels are under 200 mg/dL.',
  },
  /** HDL cholesterol (snake_case alias) */
  hdl_cholesterol: {
    unit: 'mg/dL',
    direction: 'higher_better',
    category: 'metabolic',
    normalRange: { min: 40, max: 999 },
    displayLabel: 'HDL Cholesterol',
    description: 'HDL (high-density lipoprotein) cholesterol is called "good" cholesterol because it transports cholesterol away from arteries back to the liver for removal. Optimal is above 60 mg/dL for men and 50 mg/dL for women.',
  },
  /** LDL cholesterol (snake_case alias) */
  ldl_cholesterol: {
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    normalRange: { min: 0, max: 100 },
    displayLabel: 'LDL Cholesterol',
    description: 'LDL (low-density lipoprotein) cholesterol carries cholesterol to your arteries, where it can accumulate as plaque. Optimal is under 100 mg/dL; under 70 is recommended for high-risk individuals.',
  },
  /** Total testosterone (snake_case alias) */
  testosterone_total: {
    unit: 'ng/dL',
    direction: 'context',
    category: 'hormonal',
    displayLabel: 'Testosterone (Total)',
    description: 'Total testosterone measures all testosterone in blood, both free (active) and protein-bound. Normal ranges are 300-1000 ng/dL for men and 15-70 ng/dL for women.',
  },
  /** Vitamin D (snake_case alias) */
  vitamin_d: {
    unit: 'ng/mL',
    direction: 'higher_better',
    category: 'nutritional',
    displayLabel: 'Vitamin D',
    description: 'Vitamin D (25-hydroxyvitamin D) is essential for bone health, immune function, mood, and muscle function. Optimal levels are 40-60 ng/mL. Deficiency (<30 ng/mL) is extremely common.',
  },
  /** Grip strength (snake_case alias) */
  grip_strength: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'performance',
    displayLabel: 'Grip Strength',
    description: 'Grip strength is one of the most powerful predictors of overall health and longevity. Research consistently shows grip strength correlates with all-cause mortality, cardiovascular disease risk, and cognitive decline.',
  },
  /** Squat 1RM (snake_case alias) */
  squat_1rm: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'performance',
    displayLabel: 'Squat 1RM',
    description: 'Squat one-rep max measures the maximum weight you can squat for a single repetition with proper form. It\'s a key indicator of lower body strength and overall athletic performance.',
  },
  /** Bench press 1RM (snake_case alias) */
  bench_1rm: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'performance',
    displayLabel: 'Bench Press 1RM',
    description: 'Bench press one-rep max measures the maximum weight you can press for a single repetition. It\'s a primary indicator of upper body pushing strength.',
  },
  /** Deadlift 1RM (snake_case alias) */
  deadlift_1rm: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'performance',
    displayLabel: 'Deadlift 1RM',
    description: 'Deadlift one-rep max measures the maximum weight you can deadlift for a single repetition. It\'s one of the best indicators of total body strength and posterior chain development.',
  },
  /** Overhead press 1RM (snake_case alias) */
  overhead_press_1rm: {
    unit: 'kg',
    direction: 'higher_better',
    category: 'performance',
    displayLabel: 'Overhead Press 1RM',
    description: 'Overhead press one-rep max measures the maximum weight you can press overhead for a single repetition. It indicates shoulder and upper body pressing strength.',
  },
  /** Pull-up max (snake_case alias) */
  pull_up_max: {
    unit: 'reps',
    direction: 'higher_better',
    category: 'performance',
    displayLabel: 'Max Pull-ups',
    description: 'Maximum pull-ups measures the most consecutive pull-ups you can perform with proper form. It\'s a key indicator of upper body pulling strength and relative strength.',
  },
  /** Mile run time (snake_case alias) */
  mile_time: {
    unit: 'minutes',
    direction: 'lower_better',
    category: 'performance',
    displayLabel: 'Mile Run Time',
    description: 'Mile run time measures how fast you can run one mile. It\'s a classic test of cardiovascular fitness and running economy. Faster times indicate better aerobic capacity.',
  },
} as const satisfies Record<string, HealthMetricDefinition>;

// ============================================================================
// DERIVED CONSTANTS
// ============================================================================

/** All valid health metric keys */
export type HealthMetricKey = keyof typeof HEALTH_METRIC_DEFINITIONS;

/** Array of all metric keys for iteration */
export const HEALTH_METRIC_KEYS = Object.keys(HEALTH_METRIC_DEFINITIONS) as HealthMetricKey[];

/** Human-readable labels lookup for UI display */
export const HEALTH_METRIC_LABELS: Record<HealthMetricKey, string> = Object.fromEntries(
  HEALTH_METRIC_KEYS.map((key) => [key, HEALTH_METRIC_DEFINITIONS[key].displayLabel])
) as Record<HealthMetricKey, string>;
