# Phase A Shared Extraction Worktree Triage

- **Base:** `main` at `2e777105`
- **Snapshot branch:** `wip/shared-extraction-cleanup-snapshot-2026-05-12-am` at `3fbb208e`
- **Generated:** 2026-05-12T18:27:08.443Z
- **Validators run during triage:** none. Prior logs were read from `docs/temp/`; no preflight/checker reruns were used for this document.
- **Purpose:** classify every path in the 2026-05-12 AM mid-extraction snapshot before any code change is re-applied to `main`.

## Summary

| Bucket | Count | Disposition |
|---|---:|---|
| Keep | 419 | Candidate principled extraction cleanup. Cherry-pick/rebuild only after Phase B-D sequencing confirms the change still matches the revised boundary standard. |
| Unwind | 12 | Do not re-apply as-is. Remove local contract barrels and rewrite consumers to direct public @hollis/* package exports. |
| Regenerate | 0 | Generated output only. Do not commit; regenerate after source/package strategy is final. |
| Unrelated | 7 | Not part of extraction. Flag for Isaac; do not auto-revert or bundle into extraction commits. |

## Notes

- The snapshot branch preserved the dirty state and `main` is clean except for the Phase 0 doc commit.
- The first three shared gates being green in the AM attempt is treated as misleading because local `*/contracts/*` barrels were not gated and Node ESM smoke was absent.
- `package-lock.json` is in Keep for now because the snapshot contains package metadata changes, not a `dist/` artifact. It must be regenerated/reviewed again after the final dependency strategy is chosen.
- No `dist/` path appears in this diff. Prior generated `dist` artifacts remain a known risk from the baseline logs but are not present as dirty snapshot paths.

## Keep

| Status | Path | Reason |
|---|---|---|
| `M` | `app/(auth)/_layout.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(auth)/create-account.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(auth)/mfa-verify.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(auth)/signup.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/appointment-detail.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/billing-detail.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/book-appointment.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/document-viewer.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/documents.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/log-journal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/log-meal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/metric-detail.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(modals)/upload-document.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(tabs)/appointments.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/(tabs)/messages.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/_layout.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/admin/create-appointment.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `app/admin/workouts/[patientId].tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `babel.config.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `metro.config.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `ops/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `package-lock.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-auth-middleware.test.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-contract-duplicates.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-magic-strings.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-mapper-conformance.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-mapper-conformance.test.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-phi-logging.test.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-private-contract-reexports.test.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-route-imports.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `A` | `scripts/check-shared-consumer-boundary.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `A` | `scripts/check-shared-extraction-readiness.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `A` | `scripts/check-shared-package-boundary.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `scripts/check-type-drift.test.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/jest.config.cjs` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/scripts/backfill-metric-approval-status.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/__tests__/services/labInterpretationService.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/__tests__/services/session/sessionResetService.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/__tests__/services/userProfileService.getUserGoals.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/routes/public.router.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/services/__tests__/audit-05-goalDataSource.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/services/ai/index.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/services/email/emailProviders.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/services/email/emailTemplates.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/services/labs/labMetricGovernanceService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/services/metrics/metricLibraryTools.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/src/utils/dateFormat.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/tsconfig.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `server/tsup.config.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `shared/contracts/SCHEMA_INDEX.md` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `shared/contracts/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `shared/design-tokens/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `A` | `shared/utils/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `A` | `shared/utils/tsconfig.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `shared/utils/unitConversions.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/appointment-flow.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/appointments-coordinator-gate.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/appointments-service.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/appointments-store-selectors.native.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/appointments-store.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/auth-feature.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/auth-http-service.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/barcode-sanitization.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/cache-error-handling.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/cache.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/calendar-service-privacy.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/common-enums.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-appointments-journal.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-crm.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-daily.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-dashboardConfig.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-healthData.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-healthProgress.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-messages.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-nutrition.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-permissions.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-phi-clinical.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-phi-labs.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-phiAudit.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-sessions.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-storageKeys.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/contracts-workouts-biometrics.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/daily-checkin-notifications.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/dashboard-card-order-consolidation.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/data-invariants.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/enum-contract.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/errorSanitization.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features-dashboard-service.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features-dashboard-tile-mapping.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/admin-service-registrations-get.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/appointments/useAppointments.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/appointments/useBookAppointment.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/documents/documentsService.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/labs/service.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/logging/useCalories.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/logging/useLogMeal.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/logging/useLoggingTimeline.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/messages/messagesFeature.pagination.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/messages/messagesService.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/plans/usePlans.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/features/pushRegistration/pushRegistration.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/hooks/useHealthConnect.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/hooks/useHealthKit.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/preferences-normalization.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/realtime.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/reference-ranges.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/schema-drift-diagnostic.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/screens/admin-create-appointment.screen.native.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/screens/auth-layout.screen.native.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/screens/onboarding.screen.native.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/screens/root-layout.screen.native.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/services/dashboardAggregation.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/services/plansApi.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/services/pushRegistration-http.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/services/pushTokenStorage.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/services/sse.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/services/timeline-upsert-outcome.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/shared-validation.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/timeline-helpers.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/unit-registry-completeness.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/user-contracts.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/user-journeys.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/__tests__/utils/devData.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/components/RoleGate.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/components/dashboard/DashboardCardRenderer.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/components/mfa/CodeInput.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/components/sections/CalendarSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/components/ui/PasswordStrengthMeter.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/components/ui/SimpleChart.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/admin/hooks.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/admin/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/adminNotifications/hooks.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/adminNotifications/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/algorithms/tdee-bias-aware-filter.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/algorithms/types.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/components/DateRangeSelect.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/components/DraggableCharts.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/components/tiles/CaloriesTile.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/hooks/useAnalytics.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/analytics/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/adminBookingStore.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/hooks/useAdminCreateAppointment.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/hooks/useAppointmentDetail.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/hooks/useAppointments.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/hooks/useBookAppointment.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/appointments/store.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/auth/hooks/useRoleAccess.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/auth/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/auth/types.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/billing/components/MembershipSummary.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/billing/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/bootstrap/useDataPrefetch.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/dashboard/dashboardService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/dashboard/types.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/documents/hooks/useDocuments.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/documents/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/documents/utils.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/health/healthSyncValidation.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/health/useHealthConnect.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/health/useHealthData.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/health/useHealthKit.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/labs/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/labs/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/components/AILogger.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/hooks/useCalories.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/hooks/useDailyCheckIn.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/hooks/useDatabase.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/hooks/useLogMeal.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/hooks/useLoggingTimeline.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/hooks/useNutritionTargets.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/services/ai.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/services/journal.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/services/messages.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/logging/services/timeline.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/messages/hooks/useMessages.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/messages/messagesFeature.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/messages/messagesService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/messages/types.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/mfa/mfaFeature.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/mfa/mfaTypes.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/mfa/useMfa.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/PastGoalsModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/PhaseTimeline.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/ProgressBar.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyCard.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyOverview.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyOverviewBlock.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyOverviewDeload.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyOverviewHealth.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyOverviewLinear.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyOverviewList.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/components/StrategyOverview/StrategyOverviewUndulating.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/hooks/usePlans.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/plans/store.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/pushRegistration/hooks/usePushRegistrationEffect.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/pushRegistration/notificationsServiceShim.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/sessions/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/sessions/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/sessions/store.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/settings/hooks/useUploadAvatar.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/settings/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/strategy/components/GoalProgressList.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/strategy/components/StrategyCard.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/strategy/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/strategy/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/features/strategy/store.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/hooks/useDataQueries.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/hooks/useDataSubscriptions.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/lib/logger.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/apiClient.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/biometrics.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/cache.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/calendar.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/dashboardAggregation.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/db.http.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/db.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/health/healthSyncManager.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/health/offlineMutationQueue.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/health/queueEncryption.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/mfa.http.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/notifications.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/phi.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/plansApi.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/preferences.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/pushRegistration.http.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/pushTokenStorage.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/realtime.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/sessionBalanceApi.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/sse.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/services/tokenStorage.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/store/preferencesNormalization.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/store/useDailySnapshotStore.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/store/useUserProfileStore.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/store/userProfileTypes.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/theme/ThemeProvider.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/devData.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/formatCurrency.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/formatErrorDigest.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/timeFormat.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitDefinitions/converters.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitDefinitions/distanceUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitDefinitions/foodUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitDefinitions/heightUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitDefinitions/temperatureUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitDefinitions/waterUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitDefinitions/weightUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/unitRegistry.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `src/utils/units.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `tsconfig.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/app/task-detail-page.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/components/admin/LogSessionPanel.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/components/admin/LogSetRow.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/contracts/patient-schema.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/contracts/storageKeys.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/features/mfa/feature.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/hooks/useGoalMetrics.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/hooks/useRecentExercises.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/nutritionService.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/services/registrationDraftService.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/__tests__/utils/parseMedicationsLimitations.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/(admin)/AdminShell.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/(admin)/exercise-library/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/(admin)/patient/[id]/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/(admin)/patient/[id]/workouts/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/(admin)/registrations/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/(admin)/tasks/[taskId]/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/(admin)/tasks/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/login/mfa-verify/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/app/login/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/RoleGate.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/BiometricEntryForm.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/ConsultationFlowModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/DailyCheckinPanel.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/DashboardWidgets.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/HealthMetricsSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/HealthTrendSparkline.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/IntakeQuestionnaireModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/LabEntryForm.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/MessagingPanel.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/NotesSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/PatientListTable.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/PatientQuickView.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/PermanentNotesPanel.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/ProfileEditSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/ProfileSettings.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/RegisterPatientModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/RegistrationTable.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/SleepEntryForm.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/StepUpAuthModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/WeightHistorySection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/BillingTab.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/ConsultationFlowModal.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/DailyCheckinPanel.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/MedicationsAndLimitationsFormContainer.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/MessagingPanel.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/PermanentNotesPanel.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/ProfileEditSection.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/ProfileSettings.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/__tests__/SleepEntryForm.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/analytics/ReachOutModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/billing/BillingTab.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/dashboard/PatientListContainer.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/dashboard/StatsOverview.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/exercises/ExerciseModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/ClinicalDataFormContainer.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/InjuriesSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/LimitationsSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/MedicalConditionsSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/MedicationsAndLimitationsFormContainer.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/MedicationsSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/schema.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/medical-limitations/types.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/strategies/AIGenerateStrategyModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/strategies/GoalProgressDisplay.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/strategies/StrategyModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/strategies/UpdateMetricModal.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/strategies/strategy/StrategyBasicInfo.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/strategies/strategy/StrategyGoalsList.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/strategies/strategy/StrategyPhaseEditor.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/wearable/ActivitySummaryChart.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/wearable/WearableSessionRow.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/workouts/ExercisePicker.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/workouts/ExerciseRow.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/workouts/GeneratedPlanPreview.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/workouts/LogSessionPanel.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/workouts/LogSetRow.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/workouts/WorkoutDayCard.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/admin/workouts/__tests__/LogSessionPanel.regression.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/labs/BiomarkerPicker.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/labs/MetricGovernancePanel.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/patients/ClinicalNotesSection.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/patients/ComplianceOverviewPanel.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/patients/HealthProgressCard.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/patients/PatientHeader.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/components/patients/__tests__/HealthProgressCard.test.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/auth/feature.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/auth/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/exercises/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/exercises/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/featureGateway.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/health-goals/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/health-goals/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/messages/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/messages/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/mfa/feature.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/nutrition/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/patients/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/patients/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/preferences/preferencesFeature.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/registration/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/registration/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/strategies/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/strategies/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/workouts/model.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/features/workouts/service.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useExercises.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useGoalMetrics.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useHealthGoals.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useHealthMetrics.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useLabs.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useMfa.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/usePatientNotes.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/usePatients.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useRecentExercises.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useRoleGuard.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useTrainingStrategies.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useUnitFormatter.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useWearableSessions.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/hooks/useWorkouts.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/instrumentation-client.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/jest.config.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/lib/queryKeys.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/metro.config.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/next.config.mjs` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/sentry.edge.config.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/sentry.server.config.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/__tests__/mfaService.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/__tests__/nutritionService.responseSchemas.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/__tests__/trainingService.responseSchemas.test.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/analyticsService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/index.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/labsService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/messagingService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/patientService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/sseService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/tasksService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/admin/trainingService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/logger.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/mfaService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/registrationDraftService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/sseStub.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/webApiClient.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/services/webAuthService.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/store/AuthContext.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/store/queryClient.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/store/usePreferences.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/stubs/timeFormat.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/tsconfig.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/utils/formatCurrency.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/utils/metricUnits.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-admin/utils/parsePatientArrays.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-public/app/account/page.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-public/components/sections/WaitlistForm.tsx` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-public/jest.config.js` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-public/lib/csrf.ts` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-public/next.config.mjs` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-public/package.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |
| `M` | `web-public/tsconfig.json` | Appears aligned with extraction cleanup: package metadata, gate scripts, or direct @hollis/* import/config cleanup. Re-apply only after bucket-specific review. |

## Unwind

| Status | Path | Reason |
|---|---|---|
| `M` | `src/contracts/commonEnums.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/healthProgress/mocks.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/index.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/nutrition.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/nutritionPlan.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/phi/labs.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/preregistration.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/training/index.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/training/types.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/user.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `src/contracts/workouts.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |
| `M` | `web-admin/contracts/index.ts` | Local contracts barrel/shim outside shared; forbidden by revised boundary standard. |

## Regenerate

| Status | Path | Reason |
|---|---|---|

## Unrelated

| Status | Path | Reason |
|---|---|---|
| `R100` | `.github/workflows/ci.yml -> .github/workflows/ci.yml.disabled` | Disables or renames CI/Husky enforcement; not part of shared extraction and requires Isaac review. |
| `R100` | `.github/workflows/dependabot-automerge.yml -> .github/workflows/dependabot-automerge.yml.disabled` | Disables or renames CI/Husky enforcement; not part of shared extraction and requires Isaac review. |
| `R100` | `.github/workflows/eas-build.yml -> .github/workflows/eas-build.yml.disabled` | Disables or renames CI/Husky enforcement; not part of shared extraction and requires Isaac review. |
| `R100` | `.github/workflows/security.yml -> .github/workflows/security.yml.disabled` | Disables or renames CI/Husky enforcement; not part of shared extraction and requires Isaac review. |
| `R100` | `.github/workflows/terraform-plan.yml -> .github/workflows/terraform-plan.yml.disabled` | Disables or renames CI/Husky enforcement; not part of shared extraction and requires Isaac review. |
| `A` | `.husky/pre-commit.disabled` | Disables or renames CI/Husky enforcement; not part of shared extraction and requires Isaac review. |
| `R100` | `.husky/pre-push -> .husky/pre-push.disabled` | Disables or renames CI/Husky enforcement; not part of shared extraction and requires Isaac review. |

