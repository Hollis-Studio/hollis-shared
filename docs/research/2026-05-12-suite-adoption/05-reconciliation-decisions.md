# Phase I′ — Per-Concept Reconciliation Decision Register

- **Created:** 2026-05-12
- **Status:** All 16 entries ruled 2026-05-12 PM. Rulings drive Phase I′ execution.
- **Ruled by:** Claude (Workouts repo session), delegated by user "you handle it all, all the decisions and stuff".
- **Decision policy:** Case-by-case. Domain content flows from Workouts (the fitness app) up into shared because Workouts has the production data and the canonical shape. Health-safe defaults for security-sensitive concepts. Workouts conforms to Health on pure conventions where the choice is stylistic.
- **Inputs:** audits 01–04 in this directory.
- **Output:** `hollis-shared` `v0.2.0-alpha.1` content; both apps re-consume.

## Ruling vocabulary

- **WORKOUTS_PROMOTE** — shared adopts Workouts' shape verbatim.
- **HEALTH_KEEP** — shared keeps Health's existing shape; Workouts migrates.
- **MERGE_SUPERSET** — shared adopts the union.
- **NAMESPACE_SPLIT** — both shapes coexist under different names.
- **RENAME_ONE_SIDE** — keep both concepts; one gets a non-colliding name.
- **DEFER** — punt past Phase I′ (with explicit re-evaluation trigger).

---

## A. Domain-content concepts

### A.1 `MuscleGroup` enum

- **Conflict:** Workouts 23 values; shared 11.
- **Ruling:** **WORKOUTS_PROMOTE**
- **Rationale:** Workouts has production Firestore documents containing values shared can't validate. Dropping muscles silently invalidates real user data. Shared expands to Workouts' 23-value set; Health gains a richer vocabulary it never had reason to constrain.

### A.2 `EquipmentType` enum

- **Conflict:** Non-overlapping sets. Workouts: `cable_machine`, treadmill, stationary_bike; shared: `cable`, squat_rack, bench, pull_up_bar.
- **Ruling:** **MERGE_SUPERSET**
- **Rationale:** Both repos have legitimate values backed by real usage. Union the enums. Resolve the `cable_machine` vs `cable` naming by adopting `cable` (shorter, matches shared's convention) and adding a Workouts-side migration that rewrites `cable_machine` → `cable` in Firestore docs before adoption. Cardio machines and gym fixtures coexist in one canonical enum.

### A.3 `ExerciseCategory` enum

- **Conflict:** Different taxonomies (Workouts = routing; shared = classification).
- **Ruling:** **RENAME_ONE_SIDE** — Workouts renames its enum to `TrackingMode`.
- **Rationale:** Same name → different concepts is the worst possible state. The shared name (`ExerciseCategory`) maps to the more universal meaning (movement-pattern classification). Workouts' meaning is genuinely a tracking-mode concern (`weightlifting | cardio | stretching`), so the rename clarifies intent and removes ambiguity.

### A.4 `WorkoutSession` shape

- **Conflict:** Same name, opposite meanings. Workouts = executed log; shared = planned day in a program template.
- **Ruling:** **RENAME_ONE_SIDE** — Workouts renames `WorkoutSession` → `TrainingSessionLog`.
- **Rationale:** Workouts has ~15 internal hook/service consumers to update; shared has more downstream impact across the planned suite (every future app's program builder). Rename the side with the smaller blast radius. `TrainingSessionLog` clearly names the executed-log meaning. Workouts side picks up an `import { WorkoutSession as TrainingSessionLog }` shim at the boundary for one release cycle, then removes it.

### A.5 `UserProfile` shape

- **Conflict:** Same name, different shape per repo.
- **Ruling:** **MERGE_SUPERSET** with nested fitness subfield.
- **Rationale:** Most fields are shared identity (name, email, dob, role). Workouts-specific profile fields (preferred unit, training experience, etc.) nest under `UserProfile.fitness`. Workouts and Health both get a single `UserProfile` shape with all common fields plus the optional `fitness` block.

### A.6 `passwordSchema`

- **Conflict:** Workouts lenient (8 chars + 1 upper + 1 number); shared enforces zxcvbn + HIBP.
- **Ruling:** **HEALTH_KEEP** — Workouts adopts shared's stricter rules.
- **Rationale:** Production auth security is non-negotiable. Workouts signup UX gets an update to surface zxcvbn strength meter and HIBP check feedback. The cost is one signup-flow refactor; the alternative is the Identity Service silently rejecting passwords Workouts accepted at registration time.

### A.7 `CardioSessionDataSchema`

- **Conflict:** Workouts has cardio data shapes; shared doesn't.
- **Ruling:** **WORKOUTS_PROMOTE**
- **Rationale:** No conflict to resolve. Workouts has the canonical cardio shape; shared adopts it as-is.

### A.8 Progression schemas (`ProgressionBaselineSchema`, `SessionSetSchema`, `SessionExerciseSchema`, metric basket)

- **Conflict:** Workouts has 13 progression/metric schemas; shared has none.
- **Ruling:** **WORKOUTS_PROMOTE** all 13, preserving cross-field invariants.
- **Rationale:** No conflict. **Critical:** preserve `SessionExerciseSchema.refine()` at `src/schemas/session.ts:142–156` (canonicalExerciseId ↔ canonicalizationStatus invariant). The refinement is load-bearing; tests must cover it in the shared package post-move. Adoption order per `04-schema-parity-audit.md` §4.

### A.9 `ProgramSchema` family

- **Conflict:** Depends on A.4 resolution.
- **Ruling:** **NAMESPACE_SPLIT** — both program shapes coexist under their respective domain contexts.
- **Rationale:** Workouts' `ProgramSchema` references `TrainingSessionLog` (per A.4 rename) and lives at `@hollis-studio/contracts/progression/program`. Shared's existing program model continues to reference `WorkoutSession` (plan-day) and stays at `@hollis-studio/contracts/domain/program`. Two distinct concepts, two distinct subpaths.

---

## B. Cross-cutting infrastructure

### B.1 `Result<T>` + `ok()` + `err()`

- **Conflict:** Shared has no `Result<T>`. Health throws. Workouts has 102 files using a production-hardened result-monad pattern.
- **Ruling:** **WORKOUTS_PROMOTE** — exact field-for-field copy.
- **Rationale:** Workouts is the only suite app with a proven Result pattern. Shared adopts the exact signatures so Workouts adoption is a one-line import change across 102 files. Health migrates throw → Result on its own schedule; the shared API is ready when Health wants it.

### B.2 `AppErrorCode` enum

- **Conflict:** 21 Workouts codes vs. 7 Health codes. 3 semantic overlaps; rest are mostly Workouts-domain.
- **Ruling:** **MERGE_SUPERSET** — union in shared. Workouts-mobile-only codes flagged with `// scope: workouts-mobile` JSDoc comment.
- **Rationale:** Single source of truth for error codes across the suite. Workouts-only and Health-only codes coexist in the enum; usage discipline (not the type system) governs scope. The 3 semantic overlaps (AUTH_REQUIRED/UNAUTHORIZED, VALIDATION_FAILED/VALIDATION_ERROR, SESSION_CONFLICT/CONFLICT) resolve by keeping the more specific name (`AUTH_REQUIRED`, `VALIDATION_FAILED`, `SESSION_CONFLICT`) and adding the Health spelling as an alias.

### B.3 Cloud Functions `Result<T>` duplicate

- **Conflict:** Workouts' `functions/src/utils/result.ts` has a flat shape that diverges from the mobile-side `Result<T>`.
- **Ruling:** **DEFER**
- **Re-evaluation trigger:** When Workouts mobile finishes Step 3 of the suite migration plan (adopting `@hollis-studio/contracts/errors`), Cloud Functions follows in a separate cleanup commit.
- **Rationale:** Out of shared-package scope and not blocking Phase I′. The mobile/CF parity issue is a Workouts-internal cleanup, not a shared-contract decision.
- **Status (2026-05-12 PM): trigger satisfied.** Workouts mobile completed Step 3 in `v1.6.8`. Cloud Functions cleanup is now queued for `v1.6.10`. See canonical plan §4.5 Step 4 sequencing for the order of operations.

### B.4 `weightKgSchema` split

- **Conflict:** Shared's `weightKgSchema` enforces min 20 kg (clinical body weight). Workouts barbell weights legitimately go to 0 kg.
- **Ruling:** **NAMESPACE_SPLIT** — `bodyWeightKgSchema` (clinical, min 20) + `loadWeightKgSchema` (training, min 0).
- **Rationale:** Two clinically different concepts that just happen to share a unit. Splitting names makes intent unambiguous and prevents accidental cross-use.

### B.5 Primitives — `VolumeLevel`, `isRecord`

- **Conflict:** Trivial.
- **Ruling:** **resolved — straight adoption**
- **Rationale:** Shared exports are usable today.

---

## C. Design tokens

### C.1 Clay palette

- **Conflict:** Shared has only Blue/Navy. Workouts has ~40 Clay tokens.
- **Ruling:** **WORKOUTS_PROMOTE**
- **Rationale:** Shared adds a Clay preset alongside Blue. Future Workouts-clone apps can pick Clay without re-vendoring tokens. Three trivial mappers (secondary, borderStrong, accentAmber all = brandColors.tan #C6B2A1) collapse into existing Blue equivalents where appropriate.

### C.2 Spacing scale shift (`md/lg/xl/xxl`)

- **Conflict:** Workouts `{md:12, lg:16, xl:24, xxl:32}` vs shared `{md:16, lg:24, xl:32, xxl:48}`. Same names, different values.
- **Ruling:** **NAMESPACE_SPLIT** — `spacingBlue` and `spacingClay`. Active scale chosen at theme bootstrap.
- **Rationale:** Silent re-numbering would break every Workouts layout. Two named scales make the choice explicit and prevent cross-contamination. Shared exports both; consumer picks the one matching its palette.

### C.3 Typography weight name collision (`extraBold` vs `heavy` for 800)

- **Conflict:** Same weight value, different names.
- **Ruling:** **HEALTH_KEEP** — Workouts renames `extraBold` → `heavy`.
- **Rationale:** Pure mechanical refactor. Health is the older codebase; convention defers to it per the user's earlier ruling.

### C.4 Shadow object shape

- **Conflict:** Workouts uses combined iOS+Android shadows; shared uses `Platform.select` split.
- **Ruling:** **HEALTH_KEEP** — Workouts adopts `Platform.select` shape.
- **Rationale:** Convention alignment, no design impact. Same as C.3.

### C.5 Layout sub-domain (32 component sizes, border widths, chart geometry)

- **Conflict:** Workouts-only sub-domain.
- **Ruling:** **SUBSET_PROMOTE** — RIR scale, heatmap opacity, chart geometry promote to `@hollis-studio/design-tokens/workouts` sub-export. Component sizes stay Workouts-local.
- **Rationale:** Suite-wide reusability for fitness-domain visuals (chart geometry, RIR coloring) without polluting general design tokens with screen-specific component sizes.

### C.6 Unistyles vs direct Context

- **Conflict:** Workouts uses Unistyles 2.x; shared/Health uses Context + `@hollis-studio/design-tokens/native`.
- **Ruling:** **NO_MIGRATION** — Workouts keeps Unistyles. Feed a Clay-flavored `NativeTheme` from shared into `UnistylesRegistry`.
- **Rationale:** Styling-engine migration is out of scope and high-risk for zero design benefit. Workouts uses shared as a token source; Unistyles consumes those tokens.

---

## D. Execution status (updated 2026-05-12 PM)

| Phase                                                | Status                                                                                  | Reference                                                                                          |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Phase I′ (shared accepts contributions)              | ✅ Done — `hollis-shared v0.2.0-alpha.1` (then `alpha.2` adding missing server exports) | [`../../reports/2026-05-12-phase-i-prime-report.md`](../../reports/2026-05-12-phase-i-prime-report.md)                          |
| Health re-consume                                    | ✅ Done — Health `v3.7.49` + `v3.7.50`                                                  | [`../../reports/2026-05-12-phase-i-prime-followup-report.md`](../../reports/2026-05-12-phase-i-prime-followup-report.md)        |
| Workouts Step 2 (design-tokens)                      | ✅ Done — Workouts `v1.6.7`                                                             | This directory `06-steps-2-3-adoption-report.md`                                                   |
| Workouts Step 3 (contracts/errors)                   | ✅ Done — Workouts `v1.6.8`                                                             | Same                                                                                               |
| Cloud Functions B.3 cleanup                          | Pending — `v1.6.10` candidate                                                           | This file §B.3                                                                                     |
| Adopt shared `MuscleGroup` (A.1)                     | Pending — `v1.6.10` candidate                                                           | Canonical plan §4.5 Step 4                                                                         |
| Firestore `cable_machine` → `cable` migration        | Pending — `v1.6.11` candidate (gates A.2)                                               | Canonical plan §4.5 Step 4                                                                         |
| Adopt shared `EquipmentType` (A.2)                   | Pending — `v1.6.12` candidate (after migration above)                                   | Canonical plan §4.5 Step 4                                                                         |
| `WorkoutSession` deprecated alias removal            | Pending — one-release courtesy, drop whenever                                           | This file §A.4                                                                                     |
| `src/types/errors.ts` shim cleanup (optional)        | Optional — transition aid; can stay                                                     | Canonical plan §4.4 Step 3 status note                                                             |
| Verify Health upgrades to `contracts-v0.2.0-alpha.2` | Pending — one-line dep bump in Health if `alpha.2` exports are actually needed          | Canonical plan §4.1 Phase H/I' status note                                                         |
| Phase I (`v1.0.0` to GH Packages)                    | Deferred — unblocked but waiting for Step 4 enum adoption to finish                     | Canonical plan §4.1                                                                                |

## E. Original Phase I′ Execution Plan (driven by these rulings, kept for historical reference)

### Workstream 1 — Domain content (`packages/contracts/`)

- Promote `MuscleGroup` (23 values) — A.1.
- Promote `EquipmentType` (union; rename `cable_machine` → `cable` migration noted) — A.2.
- Rename Workouts side: `ExerciseCategory` → `TrackingMode` (A.3), `WorkoutSession` → `TrainingSessionLog` (A.4).
- Merge `UserProfile` with `.fitness` subfield (A.5).
- Adopt shared `passwordSchema` on Workouts side (A.6) — UX update on signup flow.
- Promote `CardioSessionDataSchema` (A.7).
- Promote 13 progression/metric schemas with `.refine()` preserved (A.8).
- Namespace-split `ProgramSchema` family (A.9).

### Workstream 2 — Cross-cutting (`packages/contracts/errors`, `packages/contracts/schemas`)

- Promote `Result<T>`, `ok()`, `err()` field-for-field (B.1).
- Merge `AppErrorCode` superset with scope JSDoc and 3 aliases (B.2).
- Split `weightKgSchema` → `bodyWeightKgSchema` + `loadWeightKgSchema` (B.4).
- Defer Cloud Functions duplicate (B.3).

### Workstream 3 — Design tokens (`packages/design-tokens/`)

- Add Clay palette preset (C.1).
- Add `spacingClay` namespace (C.2).
- Add `@hollis-studio/design-tokens/workouts` sub-export with RIR scale, heatmap opacity, chart geometry (C.5).
- Workouts-side: rename `extraBold` → `heavy` (C.3), adopt `Platform.select` shadow shape (C.4).
- Workouts-side: keep Unistyles; add Clay-NativeTheme adapter (C.6).

### Workstream 4 — Release and reconsume

- Tag `hollis-shared` as `v0.2.0-alpha.1` (or per-package equivalents).
- Health updates package.json refs, re-installs, runs full preflight.
- Workouts smoke-tests installing the new tag against current code (does not adopt yet; Step 2/3 of the canonical plan does that).

### Critical preservation invariants

- **`SessionExerciseSchema.refine()`** — canonicalExerciseId ↔ canonicalizationStatus relationship must survive the promotion (A.8).
- **`MuscleGroup` enum value preservation** — every Firestore production value continues to validate.
- **`Result<T>` signature parity** — Workouts 102-file migration must be one-line import change.

Cross-references: 01-type-collision-audit.md, 02-design-tokens-audit.md, 03-errors-and-primitives-audit.md, 04-schema-parity-audit.md.
