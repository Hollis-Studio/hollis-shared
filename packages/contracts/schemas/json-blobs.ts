/**
 * @ai-context JSON Blob Schemas | Zod schemas for all JSON fields stored in Prisma
 *
 * This module provides the canonical Zod schemas for JSON blob fields
 * that aren't already defined in other domain-specific contract modules.
 *
 * JSON Fields Defined Here:
 * - UserPreferences.dashboardCardOrder: string[] of card IDs
 * - DailyLog.supplements: string[] of supplement names
 * - DailyLog.foodEntries: Record<hour, FoodLogEntry[]>
 * - JournalEntry.tags: string[] of tag names
 * - JournalEntry.attachments: string[] of attachment URLs
 * - DailyMetrics.notes: string[] of metric notes
 * - DailyMetrics.recommendations: string[] of recommendations
 * - ClinicalNote.tags: string[] of note tags
 * - PatientDocument.tags: string[] of document tags
 * - PatientDocument.extractedData: Flexible extracted document data
 * - UserEvent.metadata: Flexible event metadata
 * - ProviderAvailability.slots: Array of availability slots (Prisma format)
 * - Blood pressure schema: For measurement JSON fields
 *
 * JSON Fields Defined Elsewhere (canonical sources):
 * - User.prefilledProfile: admin/admin-schemas.ts (prefilledProfileSchema)
 * - ClinicalProfile.medications: src/contracts/clinical.ts (medicationsSchema)
 * - ClinicalProfile.limitations: src/contracts/clinical.ts (limitationsSchema)
 * - UserPreferences.dashboard: src/contracts/user/preferences.ts (dashboardPreferencesSchema)
 * - UserPreferences.dashboardSections: src/contracts/user/preferences.ts (dashboardSectionsSchema)
 * - UserPreferences.advancedUnits: src/contracts/user/preferences.ts (advancedUnitPreferencesSchema)
 * - UserPreferences.notifications: src/contracts/user/preferences.ts (notificationPreferencesSchema)
 * - WorkoutPlan.blocks: src/contracts/workouts.ts (workoutSectionSchema[])
 * - DailyLog.totalMacros: src/contracts/commonEnums.ts (MacroShorthandSchema)
 * - DailyLog.meals: src/contracts/nutrition.ts (mealSchema[])
 * - JournalEntry.aiAssessment: src/contracts/journal.ts (journalAssessmentSchema)
 * - HealthProgressSnapshot: src/contracts/healthProgress (MetricChangeSchema, etc.)
 * - SessionBalance.balances: src/contracts/sessions.ts (SessionBalanceItemSchema[])
 *
 * deps: zod | consumers: server validation, client validation, type safety
 */

import { z } from "zod";

// ============================================================================
// STRING ARRAY SCHEMAS (Simple JSON Arrays)
// ============================================================================

/**
 * Schema for generic string array fields.
 * Used by: DailyLog.supplements, JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 *
 * @prisma DailyLog.supplements, JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 */
export const stringArraySchema = z.array(z.string());
export type StringArrayContract = z.infer<typeof stringArraySchema>;

/**
 * Schema for DailyLog.supplements JSON field.
 * Array of supplement names taken on a given day.
 *
 * @prisma DailyLog.supplements
 */
export const supplementsArraySchema = stringArraySchema;
export type SupplementsArrayContract = z.infer<typeof supplementsArraySchema>;

/**
 * Schema for tag arrays used across multiple models.
 * Used by: JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 *
 * @prisma JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 */
export const tagsArraySchema = stringArraySchema;
export type TagsArrayContract = z.infer<typeof tagsArraySchema>;

/**
 * Schema for JournalEntry.attachments JSON field.
 * Array of URLs pointing to attached files.
 *
 * @prisma JournalEntry.attachments
 */
export const attachmentsArraySchema = z.array(z.string().url());
export type AttachmentsArrayContract = z.infer<typeof attachmentsArraySchema>;

/**
 * Schema for DailyMetrics.notes JSON field.
 * Array of note strings for a given day's metrics.
 *
 * @prisma DailyMetrics.notes
 */
export const metricsNotesArraySchema = stringArraySchema;
export type MetricsNotesArrayContract = z.infer<typeof metricsNotesArraySchema>;

/**
 * Schema for DailyMetrics.recommendations JSON field.
 * Array of recommendation strings generated for a given day.
 *
 * @prisma DailyMetrics.recommendations
 */
export const metricsRecommendationsArraySchema = stringArraySchema;
export type MetricsRecommendationsArrayContract = z.infer<
  typeof metricsRecommendationsArraySchema
>;

/**
 * Schema for UserPreferences.dashboardCardOrder JSON field.
 * Array of card IDs defining the display order on the dashboard.
 *
 * @prisma UserPreferences.dashboardCardOrder
 */
export const dashboardCardOrderSchema = z.array(z.string());
export type DashboardCardOrderContract = z.infer<
  typeof dashboardCardOrderSchema
>;

// ============================================================================
// PROVIDER AVAILABILITY SLOTS (Prisma-compatible format)
// ============================================================================

/**
 * Schema for a single availability slot in Prisma ProviderAvailability model.
 * Uses hour numbers (0-23/24) instead of HH:MM time strings.
 *
 * Note: admin/admin-schemas.ts has availabilitySlotSchema with HH:MM strings
 * for API payloads. This schema matches the Prisma storage format.
 *
 * @prisma ProviderAvailability.slots
 * @example { dayOfWeek: 1, startHour: 9, endHour: 17 } // Monday 9 AM - 5 PM
 */
export const prismaAvailabilitySlotSchema = z.object({
  /** Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday */
  dayOfWeek: z.number().int().min(0).max(6),
  /** Start hour in 24-hour format (0-23) */
  startHour: z.number().int().min(0).max(23),
  /** End hour in 24-hour format (1-24, where 24 = midnight) */
  endHour: z.number().int().min(0).max(24),
});

export type PrismaAvailabilitySlotContract = z.infer<
  typeof prismaAvailabilitySlotSchema
>;

/**
 * Schema for ProviderAvailability.slots JSON field.
 * Array of availability slots defining a provider's weekly schedule.
 *
 * @prisma ProviderAvailability.slots
 */
export const prismaAvailabilitySlotsArraySchema = z.array(
  prismaAvailabilitySlotSchema,
);
export type PrismaAvailabilitySlotsArrayContract = z.infer<
  typeof prismaAvailabilitySlotsArraySchema
>;

// ============================================================================
// FLEXIBLE RECORD SCHEMAS (Extensible JSON Objects)
// ============================================================================

/**
 * Schema for UserEvent.metadata JSON field.
 * Flexible key-value object for event-specific data.
 * Shape varies by event type.
 *
 * @prisma UserEvent.metadata
 */
export const eventMetadataSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
);
export type EventMetadataContract = z.infer<typeof eventMetadataSchema>;

/**
 * Structured schema for extracted lab report data.
 * Uses `.passthrough()` to allow extra fields from different extraction pipelines.
 *
 * @prisma PatientDocument.extractedData (when document is a lab result)
 */
export const extractedLabDataSchema = z
  .object({
    panelName: z.string().optional(),
    observations: z
      .array(
        z.object({
          name: z.string(),
          value: z.union([z.string(), z.number()]).optional(),
          unit: z.string().optional(),
          referenceRange: z.string().optional(),
          flag: z.string().optional(),
        }),
      )
      .optional(),
    reportDate: z.string().optional(),
    notes: z.string().optional(),
  })
  .passthrough();

export type ExtractedLabDataContract = z.infer<typeof extractedLabDataSchema>;

/**
 * Schema for PatientDocument.extractedData JSON field.
 * Accepts structured lab data shape.
 * Other document types should use the extractedLabDataSchema with passthrough.
 *
 * @prisma PatientDocument.extractedData
 */
export const extractedDataSchema = extractedLabDataSchema.nullable();
export type ExtractedDataContract = z.infer<typeof extractedDataSchema>;

// ============================================================================
// PRE-FILLED PROFILE (User Registration)
// ============================================================================

/**
 * Note: The canonical prefilledProfileSchema is defined in admin/admin-schemas.ts
 * and should be used for User.prefilledProfile validation.
 *
 * The schema defines: firstName, lastName, phone, heightCm, weightKg,
 * dateOfBirth, sex (BiologicalSex), and goals.
 *
 * Import from '@contracts/admin' or '@shared/contracts/admin'.
 */

// ============================================================================
// FOOD ENTRIES (DailyLog.foodEntries)
// ============================================================================

/**
 * Schema for individual food log entries.
 * Used within DailyLog.foodEntries record.
 */
export const foodLogEntrySchema = z.object({
  /** Unique identifier for this entry */
  id: z.string(),
  /** Name of the food item */
  name: z.string(),
  /** Quantity consumed */
  quantity: z.number().min(0),
  /** Unit of measurement (g, oz, serving, etc.) */
  unit: z.string(),
  /** Calories in kcal */
  calories: z.number().min(0),
  /** Protein in grams */
  protein: z.number().min(0),
  /** Carbohydrates in grams */
  carbs: z.number().min(0),
  /** Fat in grams */
  fat: z.number().min(0),
  /** Fiber in grams (optional) */
  fiber: z.number().min(0).optional(),
  /** Brand name (optional) */
  brand: z.string().optional(),
  /** Product barcode (optional) */
  barcode: z.string().optional(),
  /** Display icon (optional) */
  icon: z.string().optional(),
  /** When the entry was logged (ISO timestamp) */
  loggedAt: z.string(),
  /** When the food was consumed (ISO timestamp, optional) */
  consumedAt: z.string().optional(),
  /** How the food was logged */
  source: z.enum(["search", "barcode", "custom", "manual"]).optional(),
  /** Sugar in grams (optional) */
  sugar: z.number().min(0).optional(),
  /** Sodium in mg (optional) */
  sodium: z.number().min(0).optional(),
  /** Cholesterol in mg (optional) */
  cholesterol: z.number().min(0).optional(),
  /** Saturated fat in grams (optional) */
  saturatedFat: z.number().min(0).optional(),
  /**
   * @computed Nutrition quality index (1-100), calculated by AI analysis.
   */
  nutritionQualityIndex: z.number().min(1).max(100).optional(),
});

export type FoodLogEntryContract = z.infer<typeof foodLogEntrySchema>;

/**
 * Schema for DailyLog.foodEntries JSON field.
 * Record mapping hour strings to arrays of food log entries.
 *
 * @prisma DailyLog.foodEntries
 * @example { "08": [{ id: "...", name: "Oatmeal", ... }], "12": [...] }
 */
export const foodEntriesRecordSchema = z.record(
  z.string(),
  z.array(foodLogEntrySchema),
);
export type FoodEntriesRecordContract = z.infer<typeof foodEntriesRecordSchema>;

// ============================================================================
// BLOOD PRESSURE (Used in Measurements)
// ============================================================================

/**
 * Schema for blood pressure measurements.
 * Used when storing blood pressure as a JSON object.
 */
export const bloodPressureSchema = z.object({
  /** Systolic pressure in mmHg */
  systolic: z.number().min(60).max(260),
  /** Diastolic pressure in mmHg */
  diastolic: z.number().min(30).max(200),
});

export type BloodPressureContract = z.infer<typeof bloodPressureSchema>;
