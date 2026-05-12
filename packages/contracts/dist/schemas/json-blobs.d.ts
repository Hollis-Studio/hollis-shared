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
/**
 * Schema for generic string array fields.
 * Used by: DailyLog.supplements, JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 *
 * @prisma DailyLog.supplements, JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 */
export declare const stringArraySchema: z.ZodArray<z.ZodString>;
export type StringArrayContract = z.infer<typeof stringArraySchema>;
/**
 * Schema for DailyLog.supplements JSON field.
 * Array of supplement names taken on a given day.
 *
 * @prisma DailyLog.supplements
 */
export declare const supplementsArraySchema: z.ZodArray<z.ZodString>;
export type SupplementsArrayContract = z.infer<typeof supplementsArraySchema>;
/**
 * Schema for tag arrays used across multiple models.
 * Used by: JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 *
 * @prisma JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags
 */
export declare const tagsArraySchema: z.ZodArray<z.ZodString>;
export type TagsArrayContract = z.infer<typeof tagsArraySchema>;
/**
 * Schema for JournalEntry.attachments JSON field.
 * Array of URLs pointing to attached files.
 *
 * @prisma JournalEntry.attachments
 */
export declare const attachmentsArraySchema: z.ZodArray<z.ZodString>;
export type AttachmentsArrayContract = z.infer<typeof attachmentsArraySchema>;
/**
 * Schema for DailyMetrics.notes JSON field.
 * Array of note strings for a given day's metrics.
 *
 * @prisma DailyMetrics.notes
 */
export declare const metricsNotesArraySchema: z.ZodArray<z.ZodString>;
export type MetricsNotesArrayContract = z.infer<typeof metricsNotesArraySchema>;
/**
 * Schema for DailyMetrics.recommendations JSON field.
 * Array of recommendation strings generated for a given day.
 *
 * @prisma DailyMetrics.recommendations
 */
export declare const metricsRecommendationsArraySchema: z.ZodArray<z.ZodString>;
export type MetricsRecommendationsArrayContract = z.infer<typeof metricsRecommendationsArraySchema>;
/**
 * Schema for UserPreferences.dashboardCardOrder JSON field.
 * Array of card IDs defining the display order on the dashboard.
 *
 * @prisma UserPreferences.dashboardCardOrder
 */
export declare const dashboardCardOrderSchema: z.ZodArray<z.ZodString>;
export type DashboardCardOrderContract = z.infer<typeof dashboardCardOrderSchema>;
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
export declare const prismaAvailabilitySlotSchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    startHour: z.ZodNumber;
    endHour: z.ZodNumber;
}, z.core.$strip>;
export type PrismaAvailabilitySlotContract = z.infer<typeof prismaAvailabilitySlotSchema>;
/**
 * Schema for ProviderAvailability.slots JSON field.
 * Array of availability slots defining a provider's weekly schedule.
 *
 * @prisma ProviderAvailability.slots
 */
export declare const prismaAvailabilitySlotsArraySchema: z.ZodArray<z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    startHour: z.ZodNumber;
    endHour: z.ZodNumber;
}, z.core.$strip>>;
export type PrismaAvailabilitySlotsArrayContract = z.infer<typeof prismaAvailabilitySlotsArraySchema>;
/**
 * Schema for UserEvent.metadata JSON field.
 * Flexible key-value object for event-specific data.
 * Shape varies by event type.
 *
 * @prisma UserEvent.metadata
 */
export declare const eventMetadataSchema: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>;
export type EventMetadataContract = z.infer<typeof eventMetadataSchema>;
/**
 * Structured schema for extracted lab report data.
 * Uses `.passthrough()` to allow extra fields from different extraction pipelines.
 *
 * @prisma PatientDocument.extractedData (when document is a lab result)
 */
export declare const extractedLabDataSchema: z.ZodObject<{
    panelName: z.ZodOptional<z.ZodString>;
    observations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        unit: z.ZodOptional<z.ZodString>;
        referenceRange: z.ZodOptional<z.ZodString>;
        flag: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    reportDate: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export type ExtractedLabDataContract = z.infer<typeof extractedLabDataSchema>;
/**
 * Schema for PatientDocument.extractedData JSON field.
 * Accepts structured lab data shape.
 * Other document types should use the extractedLabDataSchema with passthrough.
 *
 * @prisma PatientDocument.extractedData
 */
export declare const extractedDataSchema: z.ZodNullable<z.ZodObject<{
    panelName: z.ZodOptional<z.ZodString>;
    observations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        unit: z.ZodOptional<z.ZodString>;
        referenceRange: z.ZodOptional<z.ZodString>;
        flag: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    reportDate: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$loose>>;
export type ExtractedDataContract = z.infer<typeof extractedDataSchema>;
/**
 * Note: The canonical prefilledProfileSchema is defined in admin/admin-schemas.ts
 * and should be used for User.prefilledProfile validation.
 *
 * The schema defines: firstName, lastName, phone, heightCm, weightKg,
 * dateOfBirth, sex (BiologicalSex), and goals.
 *
 * Import from '@contracts/admin' or '@shared/contracts/admin'.
 */
/**
 * Schema for individual food log entries.
 * Used within DailyLog.foodEntries record.
 */
export declare const foodLogEntrySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    quantity: z.ZodNumber;
    unit: z.ZodString;
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    brand: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    loggedAt: z.ZodString;
    consumedAt: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        barcode: "barcode";
        search: "search";
        manual: "manual";
        ai: "ai";
        ai_edited: "ai_edited";
    }>>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
    cholesterol: z.ZodOptional<z.ZodNumber>;
    saturatedFat: z.ZodOptional<z.ZodNumber>;
    nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type FoodLogEntryContract = z.infer<typeof foodLogEntrySchema>;
/**
 * Schema for DailyLog.foodEntries JSON field.
 * Record mapping hour strings to arrays of food log entries.
 *
 * @prisma DailyLog.foodEntries
 * @example { "08": [{ id: "...", name: "Oatmeal", ... }], "12": [...] }
 */
export declare const foodEntriesRecordSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    quantity: z.ZodNumber;
    unit: z.ZodString;
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    brand: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    loggedAt: z.ZodString;
    consumedAt: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        barcode: "barcode";
        search: "search";
        manual: "manual";
        ai: "ai";
        ai_edited: "ai_edited";
    }>>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
    cholesterol: z.ZodOptional<z.ZodNumber>;
    saturatedFat: z.ZodOptional<z.ZodNumber>;
    nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>>>;
export type FoodEntriesRecordContract = z.infer<typeof foodEntriesRecordSchema>;
/**
 * Schema for blood pressure measurements.
 * Used when storing blood pressure as a JSON object.
 */
export declare const bloodPressureSchema: z.ZodObject<{
    systolic: z.ZodNumber;
    diastolic: z.ZodNumber;
}, z.core.$strip>;
export type BloodPressureContract = z.infer<typeof bloodPressureSchema>;
//# sourceMappingURL=json-blobs.d.ts.map