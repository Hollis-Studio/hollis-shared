# Schema Index

> Quick reference for finding Zod schemas in the Hollis Health contracts module.

**Last Updated:** 2026-02-27

---

## How to Use This Index

1. **API request/response validation** → See [API Request/Response Schemas](#api-requestresponse-schemas)
2. **Domain enums and types** → See [Domain Schemas](#domain-schemas)
3. **Prisma JSON field validation** → See [JSON Blob Schemas](#json-blob-schemas)
4. **Admin portal operations** → See [Admin Schemas](#admin-schemas)
5. **AI/Agent function calls** → See [AI Schemas](#ai-schemas)
6. **Password validation and reset** → See [Password Schemas](#password-schemas)
7. **Mobile/web-specific schemas** → See [Platform-Specific Schemas](#platform-specific-schemas)

---

## Canonical Response Shapes

### Paginated Lists

All list endpoints return a **single canonical paginated shape**:

```ts
{ data: T[], pagination: { total, limit, offset, hasMore } }
```

Use `createPaginatedListSchema(itemSchema)` from `domain/pagination.ts` to define list response schemas. **Do not** use `z.union()` to accept both paginated and raw array shapes — unions were removed in the schema drift cleanup.

### Nullable vs Optional

For fields sourced from nullable Prisma columns, use `.nullable().optional()` (accepts `null`, `undefined`, and absent). This eliminates the need for `?? undefined` coercions in server mappers. Use `.optional()` alone only for fields that are truly never `null` from the database.

---

## API Request/Response Schemas

**Location:** `schemas/index.ts`

Core validation schemas for HTTP request/response payloads.

| Schema                      | Purpose                               | Prisma/API Reference          |
| --------------------------- | ------------------------------------- | ----------------------------- |
| `barcodeSchema`             | Strict barcode format (HH-XXXXXX)     | Barcode issuance              |
| `userIdSchema`              | Permissive user ID format (HH-XXXXXX) | User ID validation            |
| `userIdParamSchema`         | Route param with :userId              | GET/PUT /users/:userId/\*     |
| `dateParamSchema`           | Route param with :date (ISO)          | Routes with date params       |
| `userIdAndDateParamsSchema` | Combined :userId and :date            | GET /users/:userId/logs/:date |
| `dateRangeQuerySchema`      | Query params for date ranges          | ?startDate=&endDate=          |
| `paginationQuerySchema`     | limit/offset query params             | Paginated endpoints           |
| `userIdQuerySchema`         | Query param for userId                | ?userId=                      |
| `loginBodySchema`           | Login request body                    | POST /auth/login              |
| `refreshBodySchema`         | Token refresh request                 | POST /auth/refresh            |
| `signupBodySchema`          | Signup/registration request           | POST /auth/signup             |
| `signupSexSchema`           | Simplified sex options for signup     | Registration forms            |
| `emailSchema`               | Email validation                      | Various                       |
| `legacyPasswordSchema`      | Password validation (8 char min)      | Legacy flows                  |
| `uuidSchema`                | UUID format validation                | Various                       |
| `phoneSchema`               | International phone format            | Various                       |
| `urlSchema`                 | URL format validation                 | Various                       |

---

## Domain Schemas

Domain-specific enum schemas live alongside their tuples/constants. Import from `@hollis/contracts` or the specific domain module.

### common.ts

| Schema               | Purpose                                |
| -------------------- | -------------------------------------- |
| `isoDateSchema`      | ISO date (YYYY-MM-DD) validation       |
| `isoTimestampSchema` | ISO 8601 timestamp validation          |
| `baseDocumentSchema` | Base document with createdAt/updatedAt |

### user.ts

| Schema                         | Purpose                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| `UserRoleSchema`               | ADMIN, CLINICIAN, TRAINER, CLIENT                                  |
| `UserTierSchema`               | ESSENTIALS, CORE, CONCIERGE                                        |
| `BiologicalSexSchema`          | female, male, non_binary, intersex, prefer_not_to_say              |
| `ActivityLevelSchema`          | sedentary, lightly_active, moderately_active, very_active, athlete |
| `PrimaryGoalSchema`            | lose_weight, gain_muscle, maintain, improve_health                 |
| `FitnessExperienceSchema`      | beginner, intermediate, advanced, expert                           |
| `NotificationFrequencySchema`  | daily, weekly, biweekly, monthly, custom                           |
| `WeekdaySchema`                | MONDAY through SUNDAY                                              |
| `AccountStatusSchema`          | active, suspended, inactive                                        |
| `PregnancyStatusSchema`        | not_pregnant, trimester_1, trimester_2, trimester_3, postpartum    |
| `MessagingRecipientRoleSchema` | Message recipient roles                                            |

### appointments.ts

| Schema                    | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `AppointmentStatusSchema` | SCHEDULED, COMPLETED, CANCELLED, NO_SHOW       |
| `AppointmentTypeSchema`   | CHECK_IN, CONSULTATION, TRAINING_SESSION, etc. |
| `BookingStepSchema`       | Client booking workflow steps                  |
| `AdminBookingStepSchema`  | Admin booking workflow steps                   |

### training.ts

| Schema                 | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `StrategyTypeSchema`   | LINEAR_PROGRESSION, UNDULATING, BLOCK, MESOCYCLE, DELOAD, CUSTOM |
| `StrategyStatusSchema` | ACTIVE, COMPLETED, PAUSED, CANCELLED                             |
| `GoalCategorySchema`   | fitness, body_composition, cardiovascular, etc.                  |
| `GoalDataSourceSchema` | biometric, lab, exercise_log, manual                             |

### sessions.ts

| Schema                     | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `SessionTypeSchema`        | FITNESS_SESSION, CLINICIAN_INITIAL, etc. |
| `ResetFrequencySchema`     | MONTHLY, QUARTERLY, BIANNUAL, ANNUAL     |
| `SessionUsageSourceSchema` | How sessions are consumed                |
| `sessionErrorCodeSchema`   | Session operation error codes            |

### nutrition.ts

| Schema                    | Purpose                               |
| ------------------------- | ------------------------------------- |
| `MealTypeSchema`          | breakfast, lunch, dinner, snack, etc. |
| `LocationTypeSchema`      | home, restaurant, work, etc.          |
| `PreparationMethodSchema` | homemade, takeout, delivery, etc.     |
| `FoodUnitSchema`          | g, oz, serving, cup, etc.             |
| `MoodLevelSchema`         | 1-5 mood rating                       |
| `EnergyLevelSchema`       | 1-5 energy rating                     |
| `DigestionQualitySchema`  | poor, fair, good, excellent           |

### clinical.ts

| Schema                         | Purpose                               |
| ------------------------------ | ------------------------------------- |
| `LimitationSeveritySchema`     | mild, moderate, severe                |
| `BiometricSourceSchema`        | manual, device, lab, clinical         |
| `InjuryRecoveryStatusSchema`   | active, recovering, healed, chronic   |
| `MedicalConditionStatusSchema` | active, managed, resolved, monitoring |
| `medicationSchema`             | Medication object structure           |
| `medicationsSchema`            | Array of medications                  |
| `limitationSchema`             | Limitation object structure           |
| `limitationsSchema`            | Array of limitations                  |
| `injurySchema`                 | Injury object structure               |
| `injuriesSchema`               | Array of injuries                     |
| `medicalConditionSchema`       | Medical condition structure           |
| `medicalConditionsSchema`      | Array of medical conditions           |
| `CareTeamRoleSchema`           | Care team member roles                |

### labs.ts

| Schema                          | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| `LabResultStatusSchema`         | PRELIMINARY, FINAL, CORRECTED, CANCELLED         |
| `LabResultFlagSchema`           | normal, low, high, critical_low, critical_high   |
| `LabMappingStatusSchema`        | MATCHED, CREATED, REVIEW_NEEDED, MANUAL_OVERRIDE |
| `LabMetricDirectionalitySchema` | higher_better, lower_better, target_range        |
| `LabChangeSignificanceSchema`   | minimal, moderate, significant                   |
| `LabClinicalDirectionSchema`    | improving, stable, worsening                     |
| `LabRangeStatusSchema`          | optimal, normal, borderline, out_of_range        |
| `LabMetricCategorySchema`       | Lab metric categories                            |
| `MetricApprovalStatusSchema`    | pending, approved, rejected                      |
| `ClinicianGoalStatusSchema`     | active, achieved, paused, cancelled              |
| `GoalTargetDirectionSchema`     | increase, decrease, maintain                     |

### biometrics.ts

| Schema                         | Purpose                          |
| ------------------------------ | -------------------------------- |
| `BiometricEntryContractSchema` | Biometric entry validation       |
| `biometricEntrySchema`         | Backward-compatible entry schema |

### exercise.ts

| Schema                   | Purpose                             |
| ------------------------ | ----------------------------------- |
| `ExerciseCategorySchema` | strength, cardio, flexibility, etc. |
| `MovementPatternSchema`  | push, pull, squat, hinge, etc.      |
| `MuscleGroupSchema`      | chest, back, legs, shoulders, etc.  |
| `EquipmentTypeSchema`    | barbell, dumbbell, cable, etc.      |
| `DifficultyLevelSchema`  | beginner, intermediate, advanced    |

### workouts.ts

| Schema                     | Purpose                            |
| -------------------------- | ---------------------------------- |
| `WorkoutSectionTypeSchema` | warmup, main, cooldown, superset   |
| `workoutSetSchema`         | Set structure (reps, weight, etc.) |
| `workoutSectionSchema`     | Section with exercises             |
| `workoutSessionSchema`     | Complete workout session           |

### journal.ts

| Schema                | Purpose                            |
| --------------------- | ---------------------------------- |
| `JournalMoodSchema`   | Mood options for journal entries   |
| `JournalEnergySchema` | Energy options for journal entries |

### documents.ts

| Schema                   | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| `DocumentCategorySchema` | lab_report, imaging, clinical_note, etc. |

### analytics.ts

| Schema                    | Purpose                            |
| ------------------------- | ---------------------------------- |
| `TrendIndicatorSchema`    | up, down, stable                   |
| `WeightTrendSchema`       | gaining, losing, maintaining       |
| `TrainingStatusSchema`    | on_track, overreaching, detraining |
| `RecoveryStatusSchema`    | recovered, partial, fatigued       |
| `TrainingRiskLevelSchema` | low, moderate, high                |
| `ChartCategorySchema`     | Chart display categories           |
| `TimeRangeSchema`         | 7d, 30d, 90d, 1y, all              |
| `ChartTypeSchema`         | line, bar, area, pie               |
| `ChartDataPointSchema`    | Chart data point structure         |
| `ChartItemSchema`         | Chart item structure               |

### health-progress.ts

| Schema                   | Purpose                           |
| ------------------------ | --------------------------------- |
| `HealthTrendSchema`      | improving, stable, declining      |
| `DataQualityLevelSchema` | high, moderate, low, insufficient |

### organization.ts

| Schema                            | Purpose                |
| --------------------------------- | ---------------------- |
| `OrganizationBillingInfoSchema`   | Billing info structure |
| `OrganizationSettingsSchema`      | Org settings structure |
| `OrganizationAddressSchema`       | Address structure      |
| `OrganizationSchema`              | Complete organization  |
| `CreateOrganizationRequestSchema` | Create org request     |
| `UpdateOrganizationRequestSchema` | Update org request     |
| `OrganizationSummarySchema`       | Org summary            |
| `OrganizationJwtClaimsSchema`     | JWT claims for orgs    |

### registration.ts

| Schema                     | Purpose                     |
| -------------------------- | --------------------------- |
| `RegistrationStatusSchema` | pending, completed, expired |

### phi-audit.ts

| Schema                  | Purpose                               |
| ----------------------- | ------------------------------------- |
| `PhiResourceSchema`     | PHI resource types                    |
| `PhiActionSchema`       | PHI action types (view, export, etc.) |
| `PhiAccessReasonSchema` | Reasons for PHI access                |

### ai-notes.ts

| Schema                   | Purpose                   |
| ------------------------ | ------------------------- |
| `AINoteCategorySchema`   | AI note categories        |
| `AINoteSourceTypeSchema` | Source types for AI notes |

### push.ts

| Schema               | Purpose           |
| -------------------- | ----------------- |
| `PushPlatformSchema` | ios, android, web |
| `PushAppRoleSchema`  | client, admin     |

### realtime.ts

| Schema                  | Purpose            |
| ----------------------- | ------------------ |
| `sseEventTypeSchema`    | SSE event types    |
| `sseResourceTypeSchema` | SSE resource types |

### compliance.ts

| Schema                   | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `ComplianceStatusSchema` | excellent, good, at_risk, non_compliant |

### clinical-registry.schema.ts

| Schema                             | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `ClinicalMetricCategorySchema`     | Metric categories                 |
| `ClinicalMetricDirectionSchema`    | higher_better, lower_better, etc. |
| `ClinicalValueTypeSchema`          | numeric, ratio, text              |
| `ClinicalAgeBracketSchema`         | Age brackets for ranges           |
| `ClinicalSexSchema`                | Sex options for clinical contexts |
| `ClinicalPregnancyStatusSchema`    | Pregnancy status for clinical     |
| `ClinicalModifierLogicSchema`      | Logic types for modifiers         |
| `ClinicalUnitVariantSchema`        | Unit conversion variant           |
| `ClinicalBaseRangeSchema`          | Base reference range              |
| `ClinicalOptimalRangeSchema`       | Optimal range structure           |
| `ClinicalHardLimitsSchema`         | Hard limits structure             |
| `ClinicalModifierConditionsSchema` | Modifier conditions               |
| `ClinicalPopulationModifierSchema` | Population-specific modifiers     |
| `ClinicalPanelComponentSchema`     | Panel component structure         |
| `ClinicalMetricDefinitionSchema`   | Complete metric definition        |
| `ClinicalMetricRegistrySchema`     | Full metric registry              |

---

## JSON Blob Schemas

**Location:** `schemas/json-blobs.ts`

Schemas for JSON fields stored in Prisma. Use these for validating data going into/out of JSON columns.

| Schema                               | Purpose                   | Prisma Field                                               |
| ------------------------------------ | ------------------------- | ---------------------------------------------------------- |
| `stringArraySchema`                  | Generic string array      | Various                                                    |
| `supplementsArraySchema`             | Daily supplements         | DailyLog.supplements                                       |
| `tagsArraySchema`                    | Tag arrays                | JournalEntry.tags, ClinicalNote.tags, PatientDocument.tags |
| `attachmentsArraySchema`             | URL array for attachments | JournalEntry.attachments                                   |
| `metricsNotesArraySchema`            | Metric notes              | DailyMetrics.notes                                         |
| `metricsRecommendationsArraySchema`  | Recommendations           | DailyMetrics.recommendations                               |
| `dashboardCardOrderSchema`           | Card ID order             | UserPreferences.dashboardCardOrder                         |
| `prismaAvailabilitySlotSchema`       | Single availability slot  | ProviderAvailability.slots (element)                       |
| `prismaAvailabilitySlotsArraySchema` | Availability slots array  | ProviderAvailability.slots                                 |
| `eventMetadataSchema`                | Flexible event metadata   | UserEvent.metadata                                         |
| `extractedDataSchema`                | Extracted document data   | PatientDocument.extractedData                              |
| `foodLogEntrySchema`                 | Single food log entry     | DailyLog.foodEntries (value element)                       |
| `foodEntriesRecordSchema`            | Hour → entries mapping    | DailyLog.foodEntries                                       |
| `bloodPressureSchema`                | Blood pressure object     | Measurement JSON fields                                    |

### JSON Schemas Defined Elsewhere

Some JSON field schemas are canonically defined in other modules:

| Schema                          | Location                            | Prisma Field                      |
| ------------------------------- | ----------------------------------- | --------------------------------- |
| `prefilledProfileSchema`        | `admin/admin-schemas.ts`            | User.prefilledProfile             |
| `medicationsSchema`             | `domain/clinical.ts`                | ClinicalProfile.medications       |
| `limitationsSchema`             | `domain/clinical.ts`                | ClinicalProfile.limitations       |
| `dashboardPreferencesSchema`    | `src/contracts/user/preferences.ts` (mobile app only) | UserPreferences.dashboard         |
| `dashboardSectionsSchema`       | `src/contracts/user/preferences.ts` (mobile app only) | UserPreferences.dashboardSections |
| `advancedUnitPreferencesSchema` | `src/contracts/user/preferences.ts` (mobile app only) | UserPreferences.advancedUnits     |
| `notificationPreferencesSchema` | `src/contracts/user/preferences.ts` (mobile app only) | UserPreferences.notifications     |
| `workoutSectionSchema[]`        | `domain/workouts.ts`                | WorkoutPlan.blocks                |
| `MacroShorthandSchema`          | `shared/contracts/domain/nutrition.ts` | DailyLog.totalMacros              |
| ~~`mealSchema[]`~~              | _(removed — schema no longer exists)_ | DailyLog.meals                   |
| `journalAssessmentSchema`       | `src/contracts/journal.ts`          | JournalEntry.aiAssessment         |
| `SessionBalanceItemSchema[]`    | `shared/contracts/domain/sessions.ts` | SessionBalance.balances           |

---

## Admin Schemas

**Location:** `admin/admin-schemas.ts`

Schemas for admin portal operations, patient management, and clinical workflows.

### Admin-Specific Enums

| Schema                         | Purpose                                 |
| ------------------------------ | --------------------------------------- |
| `adminComplianceStatusSchema`  | excellent, good, at-risk, non-compliant |
| `volumeLevelSchema`            | low, moderate, high (training phases)   |
| `limitationSeveritySchema`     | mild, moderate, severe                  |
| `injuryRecoveryStatusSchema`   | active, recovering, healed, chronic     |
| `medicalConditionStatusSchema` | active, managed, resolved, monitoring   |

### Patient Management

| Schema                              | Purpose                            |
| ----------------------------------- | ---------------------------------- |
| `patientSummarySchema`              | Patient list summary               |
| `adminMedicationSchema`             | Admin medication entry             |
| `adminLimitationSchema`             | Admin limitation entry             |
| `adminInjurySchema`                 | Admin injury entry                 |
| `adminMedicalConditionSchema`       | Admin condition entry              |
| `patientProfileUpdatePayloadSchema` | Update patient profile             |
| `patientGoalsUpdatePayloadSchema`   | Update patient goals               |
| `patientAdminControlsPayloadSchema` | Update admin controls (tier, role) |

### Clinician Management

| Schema                        | Purpose                  |
| ----------------------------- | ------------------------ |
| `clinicianSummarySchema`      | Clinician list summary   |
| `availabilitySlotSchema`      | HH:MM time-based slot    |
| `clinicianAvailabilitySchema` | Clinician schedule       |
| `providerScheduleSlotSchema`  | Hour-based schedule slot |
| `providerScheduleDataSchema`  | Provider schedule        |

### Registration

| Schema                            | Purpose                       |
| --------------------------------- | ----------------------------- |
| `prefilledProfileSchema`          | Pre-registration profile data |
| `registeredUserSchema`            | Registered user response      |
| `createRegistrationPayloadSchema` | Create registration request   |

### Training Strategy

| Schema                      | Purpose                   |
| --------------------------- | ------------------------- |
| `createPhaseInputSchema`    | Create training phase     |
| `createGoalInputSchema`     | Create goal input         |
| `updateGoalInputSchema`     | Update goal input         |
| `createStrategyInputSchema` | Create strategy input     |
| `fetchValueRequestSchema`   | Fetch goal value request  |
| `fetchValueResponseSchema`  | Fetch goal value response |

### Smart Assist / AI Generation

| Schema                                 | Purpose                |
| -------------------------------------- | ---------------------- |
| `smartAssistActivitySchema`            | Agent activity entry   |
| `smartAssistProgressSchema`            | Real-time progress     |
| `workoutPlanGenerationParamsSchema`    | Workout plan params    |
| `nutritionPreferencesSchema`           | Nutrition preferences  |
| `macroTargetsSchema`                   | Macro targets          |
| `nutritionPlanGenerationRequestSchema` | Nutrition plan request |

### Lab Results

| Schema                             | Purpose                   |
| ---------------------------------- | ------------------------- |
| `labMetricDefinitionSummarySchema` | Metric definition summary |
| `LabPopulationQualifierSchema`     | Population qualifier      |
| `extractedLabObservationSchema`    | Extracted lab observation |
| `extractedLabReportSchema`         | Extracted lab report      |
| `labDataExtractionResultSchema`    | Extraction result         |
| `labObservationInputSchema`        | Create observation input  |
| `createLabReportPayloadSchema`     | Create lab report         |

### Intake & Questionnaires

| Schema                              | Purpose                |
| ----------------------------------- | ---------------------- |
| `intakeQuestionnaireResponseSchema` | Questionnaire response |
| `clientIntakePayloadSchema`         | Client intake payload  |

### Exercise Library

| Schema                       | Purpose                 |
| ---------------------------- | ----------------------- |
| `exerciseFilterParamsSchema` | Exercise search filters |

### Analytics

| Schema                     | Purpose                   |
| -------------------------- | ------------------------- |
| `adminAnalyticsDataSchema` | Admin dashboard analytics |

### Metric Governance

| Schema                         | Purpose               |
| ------------------------------ | --------------------- |
| `pendingMetricReviewSchema`    | Pending metric review |
| `suggestedNewMetricSchema`     | Suggested new metric  |
| `metricGovernanceActionSchema` | Approve/reject action |
| `mergeMetricsPayloadSchema`    | Merge metrics request |
| `metricGovernanceResultSchema` | Governance result     |

---

## AI Schemas

**Location:** `ai/ai-validation.ts`

Schemas for AI function call validation and generation request/response payloads.

### Exercise & Workout Generation

| Schema                              | Purpose                                     |
| ----------------------------------- | ------------------------------------------- |
| `generatedExerciseSchema`           | AI-generated exercise (requires exerciseId) |
| `generatedSectionSchema`            | AI-generated workout section                |
| `generatedDaySchema`                | AI-generated workout day                    |
| `generateWorkoutPlanArgsSchema`     | generate_workout_plan function args         |
| `generatedWorkoutPlanSchema`        | Workout plan structure                      |
| `unresolvedExerciseSchema`          | Exercise needing review                     |
| `workoutPlanGenerationResultSchema` | Workout plan result                         |

### Nutrition Generation

| Schema                                | Purpose                         |
| ------------------------------------- | ------------------------------- |
| `generateNutritionTargetsArgsSchema`  | generate_nutrition_targets args |
| `nutritionPlanGenerationResultSchema` | Nutrition plan result           |

### Permanent Notes

| Schema                        | Purpose                  |
| ----------------------------- | ------------------------ |
| `savePermanentNoteArgsSchema` | save_permanent_note args |

### Training Strategy

| Schema                            | Purpose                         |
| --------------------------------- | ------------------------------- |
| `createStrategyGoalArgsSchema`    | Strategy goal input             |
| `createPhaseArgsSchema`           | Training phase input            |
| `generateStrategyArgsSchema`      | generate_training_strategy args |
| `requestClarificationArgsSchema`  | request_clarification args      |
| `strategyGenerationRequestSchema` | Strategy generation request     |

### Exercise Library Search

| Schema                            | Purpose                      |
| --------------------------------- | ---------------------------- |
| `searchExerciseLibraryArgsSchema` | search_exercise_library args |
| `batchSearchExercisesArgsSchema`  | batch_search_exercises args  |
| `createExerciseArgsSchema`        | create_exercise args         |

---

## Password Schemas

**Location:** `password/index.ts`

Schemas for password validation and password reset flows.

| Schema                        | Purpose                                      | Used By                              |
| ----------------------------- | -------------------------------------------- | ------------------------------------ |
| `passwordSchema`              | Basic password validation (10-128 chars)     | Forms, registration, password change |
| `passwordLengthSchema`        | Length constraints based on PASSWORD_POLICY  | Building block for other schemas     |
| `forgotPasswordRequestSchema` | Request to initiate password reset via email | POST /auth/forgot-password           |
| `resetPasswordRequestSchema`  | Reset password with token and new password   | POST /auth/reset-password            |

> **Note:** For complete password security validation (zxcvbn strength + HIBP breach check), use the async `validatePassword()` function from this module rather than the sync schemas alone.

---

## Platform-Specific Schemas

**Location:** `src/contracts/*.ts`

These schemas extend or supplement shared contracts with platform-specific (mobile/web) concerns.

> **Note:** Many of these re-export from `@hollis/contracts`. Only platform-specific additions are listed here.

### auth.ts

| Schema                    | Purpose                         |
| ------------------------- | ------------------------------- |
| `oAuthProviderSchema`     | OAuth providers (apple, google) |
| `authProviderSchema`      | All auth providers              |
| `authProfileSchema`       | Client auth profile             |
| `authSessionSchema`       | Client auth session             |
| `oAuthCredentialsSchema`  | OAuth credentials               |
| `loginCredentialsSchema`  | Login credentials               |
| `signupCredentialsSchema` | Signup credentials              |

### clinical.ts

| Schema             | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `medicationSchema` | Medication (re-exported with extensions) |
| `limitationSchema` | Limitation (re-exported with extensions) |

### phiAudit.ts

| Schema                  | Purpose                            |
| ----------------------- | ---------------------------------- |
| `phiResourceSchema`     | PHI resources (platform-specific)  |
| `phiActionSchema`       | PHI actions (platform-specific)    |
| `phiAccessReasonSchema` | Access reasons (platform-specific) |

### adminNotifications.ts

| Schema                                | Purpose                  |
| ------------------------------------- | ------------------------ |
| `adminRealtimeNotificationKindSchema` | Admin notification kinds |

### dashboardConfig.ts

| Schema                  | Purpose            |
| ----------------------- | ------------------ |
| `DashboardCardIdSchema` | Dashboard card IDs |

### push.ts

| Schema               | Purpose        |
| -------------------- | -------------- |
| `pushPlatformSchema` | Push platforms |
| `pushAppRoleSchema`  | Push app roles |

### utils.ts

| Schema                  | Purpose           |
| ----------------------- | ----------------- |
| `DataSourceSchema`      | Data source types |
| `TimestampFieldsSchema` | Timestamp fields  |

### healthMetricGoals.ts

| Schema                      | Purpose                |
| --------------------------- | ---------------------- |
| `RangeDerivationStepSchema` | Range derivation steps |

---

## Quick Lookup by Use Case

### "I need to validate a route parameter"

→ `schemas/index.ts`: `userIdParamSchema`, `dateParamSchema`, `userIdAndDateParamsSchema`

### "I need to validate a request body"

→ `schemas/index.ts`: `loginBodySchema`, `signupBodySchema`, `refreshBodySchema`
→ `admin/admin-schemas.ts`: `patientProfileUpdatePayloadSchema`, `createLabReportPayloadSchema`, etc.

### "I need to validate a domain enum value"

→ `domain/*.ts`: Each domain file has its `*Schema` (e.g., `UserRoleSchema`, `MealTypeSchema`)

### "I need to validate JSON going into Prisma"

→ `schemas/json-blobs.ts`: `foodEntriesRecordSchema`, `eventMetadataSchema`, etc.

### "I need to validate AI function call arguments"

→ `ai/ai-validation.ts`: `generateWorkoutPlanArgsSchema`, `searchExerciseLibraryArgsSchema`, etc.

### "I need to add a new enum"

→ Follow the pattern in existing domain files:

1. Add tuple: `export const MY_THINGS = [...] as const`
2. Add type: `export type MyThing = (typeof MY_THINGS)[number]`
3. Add schema: `export const MyThingSchema = z.enum(MY_THINGS)`
4. Add constants: `export const MY_THING = { ... } as const`
5. Add labels: `export const MY_THING_LABELS: Record<MyThing, string> = { ... }`

---

## Maintenance

When adding new schemas:

1. **Domain enums** → Add to appropriate `domain/*.ts` file
2. **API validation** → Add to `schemas/index.ts`
3. **JSON blobs** → Add to `schemas/json-blobs.ts` with `@prisma` JSDoc
4. **Admin operations** → Add to `admin/admin-schemas.ts`
5. **AI functions** → Add to `ai/ai-validation.ts`
6. **Update this index** when adding significant schemas

Run `npm run check:contract-duplicates` to ensure no duplicate definitions exist.

---

## Undocumented Modules

The following domain contract files exist but have not yet been added to this index. Schemas pending documentation.

| File                     | Location                        |
| ------------------------ | ------------------------------- |
| `admin-notifications.ts` | `domain/admin-notifications.ts` |
| `admin-tasks.ts`         | `domain/admin-tasks.ts`         |
| `auth-tokens.ts`         | `domain/auth-tokens.ts`         |
| `billing.ts`             | `domain/billing.ts`             |
| `businessAnalytics.ts`   | `domain/businessAnalytics.ts`   |
| `daily-metrics.ts`       | `domain/daily-metrics.ts`       |
| `enumContract.ts`        | `domain/enumContract.ts`        |
| `health-metric-types.ts` | `domain/health-metric-types.ts` |
| `health-metrics.ts`      | `domain/health-metrics.ts`      |
| `jobs.ts`                | `domain/jobs.ts`                |
| `messages.ts`            | `domain/messages.ts`            |
| `metric-codes.ts`        | `domain/metric-codes.ts`        |
| `metric-definition.ts`   | `domain/metric-definition.ts`   |
| `mfa.ts`                 | `domain/mfa.ts`                 |
| `nutrition-plan.ts`      | `domain/nutrition-plan.ts`      |
| `offer-sheet.ts`         | `domain/offer-sheet.ts`         |
| `pagination.ts`          | `domain/pagination.ts`          |
| `sleep.ts`               | `domain/sleep.ts`               |
| `training-strategy.ts`   | `domain/training-strategy.ts`   |
| `units.ts`               | `domain/units.ts`               |
