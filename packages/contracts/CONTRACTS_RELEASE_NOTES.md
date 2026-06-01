# @hollis-studio/contracts — Release Notes

## 0.2.0-alpha.23 (2026-06-01)

Progression Engine V2 — prescription feedback loop + modality-neutral fields.

### `progression/engine.ts`

- **Prescription feedback loop (additive).** New schemas
  **`PrescriptionStatusSchema`** (`active`/`completed`/`abandoned`/`superseded`),
  **`PrescriptionTargetSourceSchema`** (`engine`/`program-template`/`manual`),
  **`PrescriptionOutcomeSchema`** (actual top set, reliability-weighted RIR,
  missed, completionRatio), and **`PrescriptionRecordSchema`** (session-linked
  prescription + lifecycle + outcome). `ProgressionEngineState` gains an optional
  **`prescriptionLog`** — a bounded ring buffer of recent records — so the engine
  can score `last prescription → actual work → next prescription`. Persisted
  inside the existing `engineState` Json blob, so **no DB migration** is required.
- **Modality-neutral magnitude fields (rename, backward-compatible).**
  `rawBaselineKg` → **`rawBaselineScore`**, `capacityEstimateKg` →
  **`capacityScore`**, `trainingMaxKg` → **`trainingTargetScore`**. For lifting
  these are still kilograms; for cardio they hold workload scores (removing the
  prior `*Kg`-named-but-not-kg smell). A `z.preprocess` transparently maps the
  legacy `*Kg` keys from any already-persisted blob onto the new names, so
  existing data keeps parsing without a destructive migration.

## 0.2.0-alpha.22 (2026-06-01)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### Workouts AI wire contract — single source of truth for the AI HTTP surface

New module **`ai/workout-ai-wire.ts`** (also exported from the `ai` barrel and as
the leaner subpath **`@hollis-studio/contracts/ai/workout-ai-wire`**). It holds
the request/response Zod schemas that the hollis-workouts **server** and **mobile
client** must agree on; they previously lived as two hand-maintained copies that
drifted. Pure Zod, no `@google/genai` (Gemini structured-output tool schemas stay
server-side).

- **`VoiceLogOperationSchema`** / **`VoiceOpSetSchema`** — voice-log operations.
  Shared numeric bounds (`durationSeconds` ≤ 86400, `distanceKm` ≤ 1000) and the
  `stretch` tracking mode, plus the per-op required-field `superRefine`.
- **`SmartBuilderResponseSchema`** + **`SlottedProgramSchema`** /
  **`SlottedExerciseSchema`** — the Smart Builder program/edits/questions union.
  Cardio slots require at least one target; stretch exercises slot as `timed`.
- **`MatchExercisesResponseSchema`** / **`ExerciseMatchSchema`**,
  **`RecognizeEquipmentResponseSchema`**, **`TagExerciseMusclesResponseSchema`**
  (validated against the canonical `MuscleGroup` enum), **`GymSetupResponseSchema`**.
- **`GYM_EQUIPMENT_TYPES`** / **`RECOGNIZE_EQUIPMENT_TYPES`** — the canonical
  equipment vocabularies (recognition = gym vocab + `none`).

## 0.2.0-alpha.21 (2026-06-01)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### Training session log — bidirectional adaptation & durable signal record

- **`SetSignalSchema`** / **`SetSignal`** added to
  `domain/training-session-log.ts`: the mutually-exclusive classification a set
  produces against its target (`on_target`, `overperformance`, `fatigue_miss`,
  `intentionally_easier`, `suspected_misinput`).
- **`SetTargetSnapshotSchema`** / **`SetTargetSnapshot`** added: a snapshot of
  the prescription a set was judged against.
- **`AdaptationEventSchema`** / **`AdaptationEvent`** added: one in-session
  target adaptation (setIndex, signal, reason, occurredAt).
- **`SessionSetSchema`** gains optional **`target`**, **`signal`**, and
  **`isSuspectedMisinput`** (a flag-only data-quality marker distinct from
  `isOutlier`).
- **`SessionExerciseSchema`** gains optional **`originalTargets`** and
  **`adaptationEvents`** — the basis for undo/recompute of in-session targets.

## 0.2.0-alpha.12 (2026-05-20)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### Consent & HIPAA

- **`HIPAA_NPP`** added to `DOCUMENT_REGISTRY` in
  `admin/legal-documents/index.ts`. The HIPAA Notice of Privacy Practices
  module (`meta`, `content`, `initialsSections`) is now exported alongside the
  other consent documents at `@hollis-studio/contracts/admin/legal-documents`.
  This lets the server drop its local `services/consent/hipaaNpp.ts` bypass and
  treat HIPAA_NPP uniformly with the other registered documents.
- **`HipaaNpp`** namespace and `hipaaNpp` namespaced module export added at
  `@hollis-studio/contracts/admin/legal-documents`.

## 0.2.0-alpha.11 (2026-05-20)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### Consent & HIPAA

- **`HIPAA_NPP`** added to `CONSENT_DOCUMENT_TYPES` enum and `REQUIRED_CONSENT_DOCS`
  array in `admin/consent-schemas.ts`. The NPP (Notice of Privacy Practices,
  45 CFR §164.520) must now be acknowledged at or before first service; the
  contracts package enforces it as a required document type.

### Lead / Contact Sources

- **`PHONE_CALL`** and **`WALK_IN`** added to `CONTACT_SOURCES` in
  `public/contact.ts`, covering admin-initiated, manually-created leads.
- **`LeadSourceSchema`**, **`LEAD_SOURCES`**, and **`LeadSource`** type exported
  from `public/contact.ts` as aliases of `ContactSourceSchema`, `CONTACT_SOURCES`,
  and `ContactSource` respectively — canonical names for lead-CRM UI consumers.

### Clinical Domain

- **`PatientSchema`** (`z.object`) and **`PatientContract`** type added to
  `domain/clinical.ts` — structured Zod schema for the patient demographic
  record used across the clinic admin and lab flows.
- **`LabOrderSchema`** and **`LabOrderContract`** type added to
  `domain/clinical.ts` — schema for lab order payloads (panel, status,
  ordered-by, results).

### Admin API Routes

- **`subscriptions.retryForUser(userId)`** route helper added in
  `admin/admin-routes.ts` → `/api/admin/subscriptions/:userId/retry`.
- **`leads.update(id)`** route helper added →
  `/api/admin/leads/:id` (PATCH).
- **`leads.CREATE`** constant added → `/api/admin/leads` (POST), joining the
  existing `leads.LIST`.

### Admin Schemas

- **`convertedUserId`** (`z.string().uuid().optional()`) added to
  `adminLeadStageUpdateBodySchema` in `admin/admin-schemas.ts`. Allows
  atomically linking a converted lead to its new user account during stage
  transition.

### Environment / App Review

- **`getAppReviewCredentials()`** exported from `domain/app-review.ts` — reads
  `APP_REVIEW_*` env vars and returns structured reviewer credentials; used by
  the server to gate test-account access during App Store review.

---

### Consumer upgrade path

1. Update `@hollis-studio/contracts` to `^0.2.0-alpha.11` in each repo's
   `package.json`.
2. Run `npm install`.
3. Add `HIPAA_NPP` entries to `consentService.ts`, `canonicalDocuments.ts`
   (and any local `DOCUMENT_SECTIONS`/`DOCUMENT_VERSIONS` maps) in
   `hollis-health-app/server/`.
4. Narrow `formState.source` to `LeadSource` (or use `as LeadSource`) in
   `web-admin/components/admin/leads/CreateLeadModal.tsx`.
