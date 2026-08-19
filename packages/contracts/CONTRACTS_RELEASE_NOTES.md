# @hollis-studio/contracts — Release Notes

## 0.2.0-alpha.51 (2026-08-19)

**Three pending additive fields from the Workouts 2026-08-19 batch (§AD
decision round). Purely additive — every new field is optional; no existing
payload changes validity.**

### `ai/persistence.ts`

- **`SmartBuilderPinnedConstraintSchema`** (new) and
  **`SmartBuilderDraftPayloadSchema.pinnedConstraints`** (new, optional,
  max 20) — standing user instructions the builder agent pins and re-injects
  past the client history trim (workouts #60c). Persisting them on the draft
  makes pins cross-device durable. NOTE: the payload schema strips unknown
  keys, so a client older than alpha.51 that round-trips a draft silently
  drops another device's pins — clients must treat pins as
  device-authoritative until their own pin is >= alpha.51.
- **`AiFeatureModelUsageSchema` / `AiFeatureUsageSchema`** gain optional
  `cachedInput`, `audioInput`, `cachedAudioInput` token-class counts
  (workouts #62) — mirrors the aiPricing dimensions (cached text/image/video
  input, audio input, cached audio input) so recorded usage can carry every
  class its price row knows about. Readers treat a missing field as 0.

### `ai/workout-ai-wire.ts`

- **`PrescriptionNarrationRequestSchema.engineConfidence`** (new, optional,
  `low | medium | high`) — carries the deterministic engine's own
  `PrescriptionDecision.confidence` so the server caps narration
  self-reports to it directly instead of inferring a ceiling from
  action + dropSteps (workouts #39 residue; removes the calibrate-only
  heuristic once both sides adopt it).

## 0.2.0-alpha.50 (2026-08-12)

**One-line fix from the alpha.49 dual audit (issue hollis-workouts#10):
`SlottedDaySchema.dayOfWeek` floor lowered to -1. No other changes.**

### `ai/workout-ai-wire.ts`

- **`SlottedDaySchema.dayOfWeek`** (`.min(0)` -> `.min(-1)`) — the
  persisted `ProgramDaySchema` uses `-1` as the "Flex day" sentinel and
  saved programs re-project through this schema on every refine turn;
  the 0 floor 400'd the AI editor permanently for any program with a
  flexible day. Weekday-assigning edit ops (`add_day.dayOfWeek`,
  `rename_or_reschedule_day.newDayOfWeek`) keep their 0..6 bounds.

## 0.2.0-alpha.49 (2026-08-12)

**Smart Builder wire hardening plus one additive session field for the
Workouts "Edited" marker (issue hollis-workouts#10). Breaking for the
Smart Builder wire only: prescription rep/cardio ceilings are tightened,
name/message fields gain length caps, and the retired converse flow is
removed (`action:"converse"`, the `questions` response branch,
`AIQuestionSchema`/`AIQuestionGroupSchema`, and the deprecated
`LegacyProgramEditSchema`). Everything outside `ai/workout-ai-wire.ts`
and `ai/persistence.ts` is additive.**

### `domain/training-session-log.ts`

- **`TrainingSessionLogBaseSchema.correctedAt`** (new,
  `z.coerce.date().nullable().optional()`) — set when the user corrects a
  completed session after the fact (metadata edit, set edit, or set
  delete); powers the "Edited" marker on history surfaces. Nullable so a
  NULL Prisma column round-trips the serializer without a strip-list
  entry; last-write-wins across devices (merge keeps the newest non-null
  stamp). Inherited by both `ActiveTrainingSessionLogSchema` and
  `TrainingSessionLogSchema`.

### `ai/workout-ai-wire.ts` — new bound constants

New prescription-side constants, deliberately separate from the
voice-logging `REPS_MAX`/`DURATION_SECONDS_MAX`/`DISTANCE_KM_MAX` (which
are unchanged): voice logging records what actually happened, these bound
what the builder may *prescribe*. `PRESCRIBED_REPS_MAX` (30),
`PRESCRIBED_CARDIO_DURATION_SECONDS_MAX` (86_400),
`PRESCRIBED_CARDIO_DISTANCE_KM_MAX` (500),
`PRESCRIBED_CARDIO_SPEED_KMH_MAX` (60), `RESPONSE_MESSAGE_MAX` (4000),
`PROGRAM_NAME_MAX` (120), `DAY_NAME_MAX` (120),
`PROGRAM_DESCRIPTION_MAX` (2000).

### `ai/workout-ai-wire.ts` — names, descriptions, messages

- **`SlottedDaySchema.name`** — now `.min(1).max(DAY_NAME_MAX)`. The
  `min(1)` is safe because the persisted `ProgramDaySchema` already
  requires a non-empty day name, so no legal saved program re-projects an
  empty one on refine.
- **`SlottedProgramSchema.name`** — now
  `.min(1).max(PROGRAM_NAME_MAX)`.
- **`SlottedProgramSchema.description`** — now
  `.max(PROGRAM_DESCRIPTION_MAX)` with **no** `.min(1)`: the client's
  program editor emits `description: ''` for description-less programs,
  and a `min(1)` would 400 every refine on them.
- **`SmartBuilderResponseSchema`** — all `message` fields (on the `ready`,
  `program`, and `edits` branches) capped at `RESPONSE_MESSAGE_MAX`
  (4000). This cap must stay at or below the request-side
  `ConversationMessageSchema.content` cap, because the client feeds the
  response message back as the next request's assistant turn.
- **`rename_program`** — `name` and `description` gain
  `.max(PROGRAM_NAME_MAX)` / `.max(PROGRAM_DESCRIPTION_MAX)`. Both keep
  their existing `.min(1)`: a rename *to* empty is meaningless (unlike the
  program schema's `description`, which legitimately round-trips `''`).
- **`add_day.name`** and **`rename_or_reschedule_day.newName`** — gain
  `.max(DAY_NAME_MAX)` on top of their existing `.min(1)`.

### `ai/workout-ai-wire.ts` — rep ceiling unified at 30

- **`LiftingSlottedExerciseSchema.reps`** — `.max(100)` →
  `.max(PRESCRIBED_REPS_MAX)` (30).
- **`EditParamsSchema.reps`** — `.max(REPS_MAX)` (200) →
  `.max(PRESCRIBED_REPS_MAX)` (30). The wire now matches the product truth
  already enforced by the server guards' `REPS_SANITY_MAX` and the client
  `EDIT_BOUNDS`. `sets` (1..10) and the `rir` bounds are untouched.

### `ai/workout-ai-wire.ts` — cardio maxima + floor reconciliation

- **`CardioSlottedExerciseSchema.durationSeconds`** — `.min(60)` →
  `.min(1).max(PRESCRIBED_CARDIO_DURATION_SECONDS_MAX)`. The persisted
  `CardioTargetsSchema` floor is 1 s, so saved sub-60 s cardio targets
  must re-project legally here; the old 60 s floor 400'd every refine for
  those programs. The 60 s floor for AI-*generated* cardio remains a
  server guard concern.
- **`CardioSlottedExerciseSchema.targetDistanceKm`** — gains
  `.max(PRESCRIBED_CARDIO_DISTANCE_KM_MAX)` (500).
- **`CardioSlottedExerciseSchema.targetSpeedKmh`** — gains
  `.max(PRESCRIBED_CARDIO_SPEED_KMH_MAX)` (60).
- **`EditParamsSchema.targetDistanceKm`** — `.max(DISTANCE_KM_MAX)`
  (1000) → `.max(PRESCRIBED_CARDIO_DISTANCE_KM_MAX)` (500).
- **`EditParamsSchema.targetSpeedKmh`** — gains
  `.max(PRESCRIBED_CARDIO_SPEED_KMH_MAX)` (60).
- **`EditParamsSchema.durationSeconds`** — unchanged
  (`.min(1).max(DURATION_SECONDS_MAX)`); one shared field serves timed
  holds and cardio efforts, so per-exercise-type floors/ceilings stay a
  server-guard concern. `TimedSlottedExerciseSchema` is untouched.

### `ai/workout-ai-wire.ts` — request content cap raised

- **`ConversationMessageSchema.content`** — `.max(4000)` →
  `.max(24_000)`. The client prepends a `=== SLOT MAP ===` preamble turn
  (~60 chars/slot) on refine, and a large legal program exceeded the old
  4000 cap and 400'd every refine. The response `message` stays capped at
  4000, so echoed assistant turns always fit.

### `ai/workout-ai-wire.ts` — new 422 error envelopes

- **`SmartBuilderHallucinationExhaustedEnvelopeSchema`** (new) and
  **`SmartBuilderGuardExhaustedEnvelopeSchema`** (new) — 422 bodies for
  the Smart Builder chat route in the Workouts server's
  `{ok:false, err:{...}}` shape (NOT `errors/errorResponseSchema.ts`,
  which is the `{success:false}` Health shape). Carry
  `err.code: "HALLUCINATION_EXHAUSTED"` with
  `details.invalidIds: string[]`, and `err.code: "AI_GUARD_EXHAUSTED"`
  with `details.reason: string`, respectively. The route `.parse()`s these
  before send; the client keys off `err.code` and the typed details.

### `ai/workout-ai-wire.ts` — retirements (breaking)

- **`SmartBuilderResponseSchema`** — the `type:"questions"` branch is
  removed, along with the (unexported) `AIQuestionSchema` and
  `AIQuestionGroupSchema`. The build-first redesign made the builder
  generate a program immediately; it no longer asks question batteries.
  The gym-setup wizard's own `GymSetupQuestionSchema` /
  `GymSetupQuestionGroupSchema` / `GymSetupResponseSchema` `questions`
  branch are **untouched** — that flow is live.
- **`SmartBuilderRequestSchema.action`** —
  `z.enum(["converse","generate","refine"])` →
  `z.enum(["generate","refine"])`. The build-first redesign removed the
  converse gate and the server has rejected `converse` since.
- **`LegacyProgramEditSchema`** and its `LegacyProgramEdit` type are
  deleted. Introduced as deprecated in alpha.27 for one cycle; grep
  verified zero consumers across every suite repo, so the cycle is over.

### `ai/persistence.ts`

Write-side hygiene bounds on the Smart Builder draft blob. These cap what
a client may newly persist — the server's GET route must
`safeParse`-quarantine stored rows and never throw, because rows written
before these bounds existed may violate them.

- **`SmartBuilderConversationTurnSchema.content`** — gains
  `.max(24_000)`, mirroring the wire content cap. Deliberately not 4000:
  verbose assistant replies written before the response cap existed may
  already sit in stored drafts.
- **`SmartBuilderDraftPayloadSchema.conversationHistory`** — gains
  `.max(50)`, matching the wire request history cap (the client trims to
  24).
- **`SmartBuilderDraftPayloadSchema.userAnswers`** — the string branch of
  the value union gains `.max(1000)`.
- **`SmartBuilderDraftPayloadSchema.readyMessage`** — gains `.max(4000)`;
  it stores a response `message`.
- **`phase`** (including the converse-era `'conversing'`),
  **`questionGroups`**, and **`currentProgram`** are deliberately
  **unchanged and permissive** — converse-era rows are still in the
  database even though the flow is retired from the wire.

## 0.2.0-alpha.48 (2026-08-12)

**Two additive optional fields for Workouts data durability (issue
hollis-workouts#9). No breaking changes.**

### `domain/training-session-log.ts`

- **`TrainingSessionLogBaseSchema.deletedExerciseSlotIds`** (new,
  `z.array(z.string()).optional()`) — append-only tombstone set of
  `SessionExercise.slotId` values the user deleted from the session. Makes an
  exercise delete expressible cross-device: without it, the client's loss-free
  merge union resurrects a deleted exercise whenever the other side still
  carries confirmed sets. Inherited by both `ActiveTrainingSessionLogSchema`
  and `TrainingSessionLogSchema`. Absent means "no exercise deletes recorded".

### `domain/workouts-user-profile.ts`

- **`UserSettingsSchema.onboardingCompletedAt`** (new,
  `z.number().optional()`, epoch ms) — server-durable record that the user
  completed Workouts onboarding. Declared for discoverability; the settings
  schema is `.passthrough()` so older servers/clients round-trip it
  regardless.

## 0.2.0-alpha.47 (2026-08-11)

**Exports-only change (published without release notes; documented
retroactively).** Added package.json subpath exports + typesVersions for
`./api/routes/auth`, `./error-sanitization`, and `./sentry-sanitization`;
extended the smoke-import script to cover them. No schema shape changes.

## 0.2.0-alpha.46 (2026-08-01)

**Nutrition contracts.** Added meal-template, food-catalog, and
food-entry-move nutrition contracts (see commit `85217ca`). Documented
retroactively alongside alpha.47.

## 0.2.0-alpha.45 (2026-07-17)

**Content-only change to static legal documents; no schema shape change.**
Ports the attorney-drafted rewrites of the Informed Consent and HIPAA Notice
of Privacy Practices into the canonical legal-document modules, completing
the DXA/labs-ordering descope started in alpha.44's offer-sheet update.
Hollis Health no longer orders, schedules, coordinates, or interprets
laboratory testing or DXA scanning; both documents are rewritten to reflect
a member-shared-records model (members may voluntarily share outside lab
results for display/organization only, with no monitoring duty) and to drop
DXA body-composition assessment entirely. Consumers' consent validation and
document rendering auto-derive from these modules (`DOCUMENT_REGISTRY`,
`renderSignedDocumentContent`, etc.) — **no consumer code changes are
required beyond bumping the installed contracts version.**

### `admin/legal-documents/informedConsent.ts`

- **`meta.version`** `1.1.0` → `2.0.0`; **`meta.effectiveDate`**
  `2026-03-04` → `2026-07-17`.
- **Section 2** retitled "Member-Shared Laboratory Records" (was
  "Laboratory Testing Coordination"): Company no longer orders, schedules,
  or coordinates lab testing; it only displays/organizes results a member
  voluntarily shares from their own independent provider, with an explicit
  new "No Monitoring of Shared Records" clause (no duty to flag urgent/
  abnormal findings).
- **Section 3** — removed DXA scanning from the body-composition
  assessment description and deleted the "DXA Risks and Limitations"
  subsection outright (old 3.3); BIA is now the only offered modality.
- **Section 5** — "Authorization for Information Sharing" reworded from a
  broad program-coordination authorization to a narrower member-directed
  authorization: display/organize what the member shares, plus limited
  referral-coordination disclosure at the member's request only.
- **Signature block / `initialsSections`** — deleted the `DXA` initials row
  and the `dxa` entry from `initialsSections` (was 5 entries, now 4);
  relabeled the `lab_testing` entry's title/excerpt to match the
  member-shared-records framing.
- `meta.contentHash` (`"917ccfac"`) is unchanged from the pre-rewrite value.
  No script in this repo regenerates this field (searched for
  `createHash`/`sha256`/`contentHash` generators — none found); it is a
  static, manually-set display label, not runtime-validated (the API's
  `SignedDocumentPayloadSchema.displayedContentHash` field is a separate,
  independently-computed SHA-256 of rendered content, unrelated to this
  `meta.contentHash`). Left as-is, matching the source rewrite; flagged here
  as cosmetic tech debt.

### `admin/legal-documents/hipaaNpp.ts`

- **`meta.version`** `1.0.0` → `1.1.0`; **`meta.effectiveDate`** /
  in-document "Effective Date" `2026-06-01` → `2026-07-17`.
- **"For Treatment" paragraph** reworded to match the member-shared-records
  model: examples now describe receiving/organizing information a member
  authorizes their independent providers to share, and sharing information
  with providers the member designates for a requested referral — no
  language implying Company originates or directs clinical coordination.

### `admin/consent-schemas.ts`

- **`INFORMED_CONSENT_INITIALS`** — removed the `DXA: "dxa"` entry (kept
  `LAB_TESTING`, `BIA`, `WELLNESS_SCREENING`, `COORDINATION_AUTH`). Verified
  zero other references to this constant or its `dxa` value anywhere in the
  package (its only consumers were its own type derivation and a doc
  comment in `informedConsent.ts`); the DXA extraction/admin-routes module
  (`admin/dxa.ts`, covered by `__tests__/dxa-contracts.test.ts`) is an
  unrelated domain (DXA scan-result OCR ingestion admin tooling) and was
  not touched.

## 0.2.0-alpha.44 (2026-07-17)

**Content-only change to static data; no schema shape change.** Descopes the
commercial master offer sheet (`domain/offer-sheet.json`, `meta.version`
2.4.0 → 3.0.0) to drop services Hollis Health no longer offers for legal
reasons: bloodwork/labs, registered dietitian (RD) sessions, PCP/medical-
provider access, and DXA scan allowances. Care coordination remains
referrals-only to independent providers; outside labs/medical data a member
chooses to share remain view-only (no ordering or interpretation); nutrition
guidance remains coach-led (coaches set macro/micronutrient targets, not
RD-directed). Pricing is unchanged ($749/$1,349/$1,949). `status` stays
`"draft"` pending legal sign-off.

### `domain/offer-sheet.json`

- **`tiers.ESSENTIALS/CORE/CONCIERGE.publicDescription`** — removed all DXA
  scan allowance and registered-dietitian-session language; CORE keeps
  "biomarker-informed planning when outside labs are shared with consent"
  and CONCIERGE keeps "dashboard integration for outside medical data shared
  with consent" (both describe view-only display, not ordering/interpretation,
  so they match the surviving model).
- **`comparisonRows`** — deleted the `dxaScanAllowance` and
  `registeredDietitianSessions` rows outright; reworded the
  `nutritionCoaching` row values to drop "RD"/"RD-guided" phrasing in favor
  of coach-led macro/micronutrient language.
- **`separatelyBilledThirdPartyItems`** — dropped the now-inaccurate "beyond
  the included DXA scan allowance" qualifier from the imaging/CGM/IV-therapy
  line (nothing DXA-related is included anymore).
- `policies.thirdPartyDisclosure` / `policies.partnerFacilityDisclosure` are
  unchanged — both already describe independent third-party care generically.
- No Zod schema change in `domain/offer-sheet.ts`; `comparisonRows` entries
  are generic `{ key, category, label, values }`, so row deletion needed no
  schema edit. Verified via `MasterOfferSheetSchema.parse()` at module load
  (`npm run smoke:import`) and `__tests__/domain-offer-sheet.test.ts`.

## 0.2.0-alpha.43 (2026-07-05)

**Bug fix (additive / backward-compatible).** Declares the previously missing
`notificationSettings.smart` object on the Workouts `UserSettingsSchema`
(`domain/workouts-user-profile.ts`).

### `domain/workouts-user-profile.ts`

- **`UserSettingsSchema.notificationSettings.smart`** (optional) — smart (AI)
  notification channel preferences: `enabled`, plus per-channel
  `preLift` / `restDayPulse` / `missedSlot` / `weeklyReview`
  (`{ enabled, hourLocal 0-23 }`) and `postWorkoutRecap` (`{ enabled }`).
  Before this release the key was **undeclared**, so `z.object()`'s default
  strip silently discarded every smart-channel toggle on both the Workouts
  server's `PUT /profile` parse and the app's client-side settings parse —
  the smart-notification preference feature was non-persistent end to end
  (found in the 2026-07-05 Workouts notification audit). Pinned by
  `__tests__/domain-workouts-user-profile-smart.test.ts`.

## 0.2.0-alpha.42 (2026-07-05)

All changes are **additive / backward-compatible** for well-formed payloads
(new fields are `optional`; the new `.max()` bounds only reject degenerate
oversized payloads no legitimate client sends). Closes three queued Workouts
TODOs: per-exercise engine overrides → first-class `GymExerciseInstance`
columns (engine v3 plan Wave 3 follow-through), the smart-builder draft
delete-ack, and the `.max()` bounds sweep (Workouts TODO §F.6).

### `domain/gym.ts`

- **`AUTOREGULATION_STYLES` / `AutoregulationStyleSchema` / `AutoregulationStyle`**
  (`'pyramid_down' | 'hold_weight'`) — per-exercise within-session set-style
  intent for progression engine v3 (spec DEC6/DEC12).
- **`GymExerciseInstanceSchema.repRangeMin` / `.repRangeMax`**
  (`int().min(1).max(100).nullable().optional()`) and
  **`.autoregulationStyle`** (`AutoregulationStyleSchema.nullable().optional()`)
  — the per-exercise engine overrides, replacing the interim
  `UserSettings.exerciseEngineOverrides` passthrough map. Both rep bounds are
  written together or not at all; the app enforces `min ≤ max` as UX logic.
- **`GymExerciseInstanceSchema.notes`** now `.max(500)` — matches
  `GymEquipmentItemSchema.notes` two schemas up (was unbounded).

### `ai/persistence.ts`

- **`SmartBuilderDraftDeleteAckSchema`** (`{ deleted: literal(true) }`) — the
  DELETE ack for the Workouts smart-builder draft route, which previously
  responded with inline server Zod (WC straggler).

### `ai/workout-ai-wire.ts` — `.max()` bounds sweep

Bounds added to previously unbounded fields (defense-in-depth; generous):
`SlottedProgramSchema.schedule ≤ 31`, `UserTrainingContextSchema.injuries
≤ 100` / `.cardioBaselines ≤ 200` / `.exerciseLibrary ≤ 5000`,
`PrescriptionNarrationRequestSchema.exerciseName ≤ 200` / `.dropSteps ≤ 25` /
`.targetSummary ≤ 300`, `SetSignalTiebreakerRequestSchema.exerciseName ≤ 200`
/ `.ambiguityReason ≤ 1000`, `CrossModalContextRequestSchema.exerciseName
≤ 200` / `.trainingPhase ≤ 50` / `.recentSessionSummary ≤ 4000`,
`RecognizeEquipmentBodySchema.imageBase64 ≤ 15_000_000`,
`LogWorkoutAudioBodySchema.audioBase64 ≤ 30_000_000`,
`GymSetupChatBodySchema.gymName ≤ 200`, `AudioExerciseContextSchema.loggedSets
≤ 300`. The `z.unknown()` blobs in `ai/persistence.ts` (AI audit log,
smart-builder draft payload) are left opaque intentionally — they are
passthrough persistence, not parsed surfaces.

## 0.2.0-alpha.41 (2026-07-05)

All changes are **additive / backward-compatible**. Wire contract for the
Workouts smart-notifications feature (preview/send). Backfilled entry — this
version was published 2026-07-05; alpha.38–40 (SessionSet.rir nullable +
engine schema-version const; modality-profiled cardio metrics; CardioTargets
floors/steps/jumps) shipped without notes entries and are recorded only in
their commit messages.

### `ai/workout-ai-wire.ts`

- **Smart notifications preview/send section**: `SmartNotificationChannelSchema`
  (`pre_lift` | `rest_day_pulse` | `post_workout_recap` | `missed_slot` |
  `weekly_review`), snapshot sub-schemas (recent session, program today, active
  program, analytics summary, progression summary) composed into
  `SmartNotificationSnapshotSchema` (schemaVersion literal 1),
  `SmartNotificationCopySchema` (title ≤ 40, body ≤ 140) +
  `SmartNotificationCopySourceSchema` (`ai` | `fallback`), and the
  request/response quartet `SmartNotificationPreviewRequestSchema` /
  `SmartNotificationSendRequestSchema` (preview + `dryRun`) /
  `SmartNotificationPreviewResponseSchema` / `SmartNotificationSendResponseSchema`
  (adds `delivery: {status, reason?, providerMessageId?}`).

## 0.2.0-alpha.37 (2026-06-18)

All changes are **additive / backward-compatible** (every new field is
`optional`). They close three data-permanence follow-ups from the 2026-06-18
Workouts audit — see
`hollis-workouts/.../memory/project_data_permanence_audit_2026_06_18.md`.

### `ai/persistence.ts`

- **`AiAuditLogCreateSchema.clientIdempotencyKey`** (`uuid().optional()`) — the
  stable client-generated key the Workouts outbox already sends on every retry
  of one logical append. Lets the server upsert on `(userId,
  clientIdempotencyKey)` so at-least-once outbox delivery can never duplicate an
  immutable audit entry. `AiAuditLogEntrySchema` now `.omit`s the key, so it is a
  write-time dedup hint only and is never echoed in the GET/POST response record.

### `domain/training-session-log.ts`

- **`SessionSetSchema.setId`** (`string().min(1).optional()`, UUID) — a stable,
  collision-free set identity. `sessionMerge.unionSets` can key on it instead of
  the mutable `setNumber` ordinal (two devices can reuse an ordinal after a
  delete/re-number and silently collapse distinct sets). Legacy sets carry no
  `setId`; consumers fall back to `setNumber` when absent.
- **`TrainingSessionLog.healthSyncedAt`** (`coerce.date().nullable().optional()`)
  — when the session was written to the platform Health store. Persisted on the
  synced record so the Health-write dedup guard survives reinstall (the
  device-local MMKV guard resets on reinstall; a synced timestamp does not).

## 0.2.0-alpha.33 (2026-06-04)

All changes are **additive / backward-compatible**. Foundation for the Workouts
token-usage dashboard rehab (per-model + input/output split + call counts +
cross-user admin summary). See
`hollis-workouts/docs/plans/2026-06-04-token-usage-dashboard-rehab.md`.

### `ai/persistence.ts`

- **`AiFeatureModelUsageSchema`** `{ input, output, total, calls }` and
  **`AiFeatureUsageSchema`** `{ input, output, total, calls, byModel }` — the
  enriched (v2) per-feature token value. Servers now record the input/output
  split, call counts, and a per-model breakdown instead of a single total.
- **`AiTokenValueSchema`** = `union(number, AiFeatureUsageSchema)`. A stored
  token value is either a legacy bare total (rows written before v2) or the
  enriched object; readers normalize both. `AiTokenUsageSchema.tokens` now uses
  this union (was `record(string, number)`), so old rows still parse.
- **Admin cross-user summary** for `GET /v1/ai-token-usage/admin/summary`:
  `AiTokenUsageAdminQuerySchema` (optional `month`),
  `AiTokenUsageFeatureRollupSchema`, `AiTokenUsageModelRollupSchema`,
  `AiTokenUsageAccountRollupSchema`, and `AiTokenUsageAdminSummarySchema`
  (totals incl. distinct `users`, byFeature, byModel, topAccounts, plus
  `rowsScanned`/`truncated` so the UI never implies full coverage when capped).

## 0.2.0-alpha.31 (2026-06-03)

All changes are **additive / backward-compatible**. Foundation for the Workouts
Adaptive Coach work (mid-workout live adaptation + per-user personalization +
coach UX). See `hollis-workouts/docs/plans/2026-06-03-adaptive-coach-spec.md`.

### `domain/training-session-log.ts`

- **`PerceivedEffortSchema`** (`"easy" | "right" | "hard"`) + new optional
  `SessionSet.perceivedEffort`. A one-tap, mass-market alternative to numeric
  RIR: inferred effort stays the default; this is an explicit override that
  refines the set signal. Never required.

### `progression/engine.ts`

- **`PrescriptionRecord.liveAdaptedTopSetKg`** (optional, nullable). The best-set
  load the live-adapted in-session plan actually asked for by session end, so the
  next prescription reasons from what the user was coached toward rather than the
  untouched pre-session plan. Null for cardio / when no live adaptation occurred.
- **`ProgressionPersonalizationSchema`** + optional
  `ProgressionEngineState.personalization`. Per-exercise learned scalars (Kalman
  e1RM estimate + variance, progression success rate, trend slope %/wk, fatigue
  percent, sampleSize, updatedAt). Every field is one inspectable number so a
  load decision stays explainable in one sentence; all nullable with population
  fallback until enough user history exists. Respects the first-lift imperative.

## 0.2.0-alpha.27 (2026-06-02)

All changes are **additive / backward-compatible**. Foundation for the Workouts
conversational program-agent refactor.

### `ai/workout-ai-wire.ts`

- **`UserTrainingContext` family.** A fully-typed context payload that replaces
  the Smart Builder server's previous `userContext: z.record(string, unknown)`
  (which silently dropped every rich field): `UserProfileContext`,
  `ExerciseStrengthState`, `ActiveProgramSummary`, `CardioBaselineSummary`,
  `GymContext` / `GymExerciseConfig`, `InjuryContext`, `WorkoutSummary`,
  `ReadinessContext`, `ExerciseLibraryEntry`, and the top-level
  `UserTrainingContextSchema`. The server now renders every tier into the prompt.
- **8-op `EditOperation` discriminated union** (replaces the old 5-op edit union,
  retained as deprecated **`LegacyProgramEditSchema`** for one cycle):
  `replace_exercise`, `update_set_params`, `remove_exercise`, `add_exercise`,
  `move_or_swap_days`, `reorder_within_day`, `rename_or_reschedule_day`,
  `apply_to_all_days`. Adds semantic addressing — **`DayRef`** (exactly one of
  name | index | dayOfWeek) and **`SlotRef`** (`slotId` | `{day, exercise}`) —
  schema-level numeric bounds (**`EditParams`**), and server-generated slot IDs
  for `add_exercise`. Cross-field rules enforced via a union-level `superRefine`
  (discriminated-union members cannot carry their own refinements).
- **`SmartBuilderRequest` / `ProgramRef` / `ConversationMessage`** wire envelope.
  `SmartBuilderResponseSchema`'s `"edits"` branch now yields `EditOperation[]`.

## 0.2.0-alpha.26 (2026-06-02)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### `domain/training-session-log.ts`

- **`SetTargetSnapshot` new optional cardio fields.** Two new optional+nullable
  fields added: **`distanceKm`** and **`paceSecondsPerKm`**. These let a
  cold-start cardio session (the first session of a brand-new cardio exercise,
  before any baseline/engine state exists) snapshot the full prescribed target —
  distance and pace, not just duration — into `originalTargets`. The post-workout
  cold-start resolver can then rebuild a distance- or pace-focused prescription
  record instead of being forced to `duration`. Older snapshots without these
  fields continue to parse unchanged.

## 0.2.0-alpha.24 (2026-06-01)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### `progression/engine.ts`

- **Discriminated-union `PrescriptionOutcome` (backward-compatible).** The flat
  `PrescriptionOutcomeSchema` is replaced by a discriminated union of
  **`LiftingPrescriptionOutcomeSchema`** (`kind: "lifting"`) and
  **`CardioPrescriptionOutcomeSchema`** (`kind: "cardio"`). A `z.preprocess`
  silently promotes legacy kind-less persisted lifting outcomes to
  `kind: "lifting"`, so existing data keeps parsing without any DB migration.
  Inferred types **`LiftingPrescriptionOutcome`** and
  **`CardioPrescriptionOutcome`** are also exported.
- **`PrescriptionRecord` new optional cardio fields.** Three new optional+nullable
  fields added: **`prescribedDurationSeconds`**, **`prescribedDistanceKm`**, and
  **`cardioOutcome`** (`CardioPrescriptionOutcomeSchema`). Older records without
  these fields continue to parse.
- **`PrescriptionDropStepSchema`** / **`PrescriptionDropStep`** — a single step
  in the prescription drop trace (anchor or driver, label, pctChange, reason).
- **`CardioCapacityMetricSchema`** / **`CardioCapacityMetric`** — enum
  `"mets_min" | "distance_km" | "duration_min"` for cardio capacity accounting.
- **`CardioMetricCapacitySchema`** / **`CardioMetricCapacity`** — per-metric
  capacity record (metric, score, sessionCount).
- **`AiContextDriverInputSchema`** / **`AiContextDriverInput`** — AI seam type
  for cross-modal context contribution (contributionPct, reason, confidence).
- **`AiSetSignalOverrideSchema`** / **`AiSetSignalOverride`** — AI seam type for
  set-signal tiebreaking (signal reuses `SetSignalSchema` from
  `domain/training-session-log`, confidence, reason).

### `ai/workout-ai-wire.ts`

Three new request/response schema pairs (additive):

- **`PrescriptionNarrationRequestSchema`** / **`PrescriptionNarrationRequest`**
  and **`PrescriptionNarrationResponseSchema`** / **`PrescriptionNarrationResponse`**
  — AI endpoint that narrates a prescription decision in human-readable form.
- **`SetSignalTiebreakerRequestSchema`** / **`SetSignalTiebreakerRequest`** and
  **`SetSignalTiebreakerResponseSchema`** / **`SetSignalTiebreakerResponse`**
  (aliased to `AiSetSignalOverrideSchema`) — AI endpoint that resolves ambiguous
  set-signal classification.
- **`CrossModalContextRequestSchema`** / **`CrossModalContextRequest`** and
  **`CrossModalContextResponseSchema`** / **`CrossModalContextResponse`**
  (aliased to `AiContextDriverInputSchema`) — AI endpoint that derives a
  cross-modal (cardio→lifting) context driver.

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
