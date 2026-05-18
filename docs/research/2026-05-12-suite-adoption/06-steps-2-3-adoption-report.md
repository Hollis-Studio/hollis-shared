# Workouts Suite Adoption — Steps 2 & 3 Report

- **Date:** 2026-05-12
- **Scope:** Canonical migration plan Step 2 (`@hollis-studio/design-tokens`) and Step 3 (`@hollis-studio/contracts` primitives + errors).
- **Status:** Both functionally complete.

## Commits

| Hash      | Version  | Summary                                                                                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `8e370a1` | `v1.6.6` | WIP rollup: strip `@line-count` JSDoc tags from 81 hook files, expand entitlements (+208 lines), add new components/hooks, commit Phase I′ research artifacts and plan updates |
| `e5c3b85` | `v1.6.7` | Adopt `@hollis-studio/design-tokens` (Clay palette, `spacingClay`, `workouts` sub-export)                                                                                             |
| `5617295` | `v1.6.8` | Rename `ExerciseCategory` → `TrackingMode`, adopt `@hollis-studio/contracts/password` schema                                                                                          |

## Step 2 — `@hollis-studio/design-tokens` adoption

### Decisions executed

- **C.1 Clay palette** — sourced from `@hollis-studio/design-tokens/clay`.
- **C.2 Spacing scale** — NAMESPACE_SPLIT: Workouts uses `spacingClay` from `@hollis-studio/design-tokens/spacing-clay`.
- **C.3 Typography weight rename** — local `extraBold` renamed to `heavy` across `src/theme/` and callers.
- **C.4 Shadow shape** — adopted `Platform.select({ ios, android })` shape.
- **C.5 Workouts-specific tokens** — RIR scale, heatmap opacity, chart geometry sourced from `@hollis-studio/design-tokens/workouts`.
- **C.6 Unistyles compatibility** — Unistyles 2.x retained; Clay `NativeTheme` adapter feeds shared tokens into `UnistylesRegistry`. No styling-engine migration.

### Dependency

```
"@hollis-studio/design-tokens": "git+https://github.com/idlandes04/hollis-shared.git#design-tokens-v0.2.0-alpha.1"
```

## Step 3 — `@hollis-studio/contracts` primitives + errors adoption

### Decisions executed

- **B.1 `Result<T>` + `ok()` + `err()`** — Workouts' 102+ callers retained their `@/types/errors` import path. `src/types/errors.ts` is now a single-file re-export shim of `@hollis-studio/contracts/errors`. The shim is intentional: type-level migration with zero downstream churn. Approved per Phase I′ prompt: "the local `src/types/errors.ts` either becomes a one-line re-export of `@hollis-studio/contracts/errors` for backward compatibility OR is deleted."
- **B.2 `AppErrorCode` superset** — same path; all suite codes available via the shim.
- **B.3 Cloud Functions `Result` duplicate** — DEFERRED per decision register. `functions/src/utils/result.ts` untouched.
- **B.4 Weight schemas split** — all 5 schema files (`baseline`, `metrics`, `program`, `session`, `slidePayloads`) import `loadWeightKgSchema` from `@hollis-studio/contracts/schemas/weight`.
- **A.3 `ExerciseCategory` → `TrackingMode`** — Workouts-side rename across 12+ call sites. Shared keeps its own (different-meaning) `ExerciseCategory`.
- **A.4 `WorkoutSession` → `TrainingSessionLog`** — canonical Workouts type renamed in `src/schemas/session`. `src/types/models.ts` keeps `WorkoutSession` as a deprecated one-release alias to `TrainingSessionLog`.
- **A.6 Password schema** — adopted `passwordSchema` from `@hollis-studio/contracts/password` in `src/schemas/auth.ts` and the signup screen at `app/auth/signup.tsx`.

### Dependency

```
"@hollis-studio/contracts": "git+https://github.com/idlandes04/hollis-shared.git#contracts-v0.2.0-alpha.1"
```

## Verification

- `npm run typecheck` — passes on both v1.6.7 and v1.6.8 commits.
- `node_modules/@hollis-studio/contracts@0.2.0-alpha.1` and `@hollis-studio/design-tokens@0.2.0-alpha.1` install cleanly from the GitHub remote.

## Items deferred

- **B.3 Cloud Functions `Result` duplicate:** still pending. Re-evaluation trigger from decision register: "when Workouts mobile finishes Step 3, do same for Cloud Functions." Step 3 is now done — Cloud Functions cleanup is a candidate for v1.6.9 or later.
- **A.1 `MuscleGroup` and A.2 `EquipmentType` adoption from shared:** not yet attempted in `src/types/constants.ts`. Step 3 of the canonical plan covers errors + primitives; full enum adoption (with A.2's `cable_machine` → `cable` Firestore data migration concern) is Step 4 territory ("Promote overlapping domain types upstream") and was scoped out of Steps 2/3.
- **`WorkoutSession` deprecated alias removal:** intentional one-release courtesy. Remove in v1.7.x or whenever the team decides.

## Process notes

The orchestrating sub-agent for Steps 2/3 hit a context-overflow ("Prompt is too long") part-way through Step 3 after 227 tool uses. Step 2 (`v1.6.7`) committed cleanly. Step 3 work was checkpointed via a partial commit (`v1.6.8`) by the orchestrating Workouts session because the typecheck on the dirty working tree was already green at the agent's stopping point — the `src/types/errors.ts` re-export shim made the bulk of B.1/B.2 a no-op for downstream files, and B.4 + A.3 + A.6 + A.4 were already in flight in the working tree.

## What this unblocks

- The canonical plan can move to Step 4 ("Promote overlapping domain types upstream") whenever ready.
- Phase I (`v1.0.0` to GH Packages) is unblocked once Step 4 lands and both Health and Workouts are stable on `0.2.0-alpha.1`.

## Cross-references

- [`../../architecture/suite-infrastructure-migration.md`](../../architecture/suite-infrastructure-migration.md) §4.3, §4.4.
- [`./05-reconciliation-decisions.md`](./05-reconciliation-decisions.md) for the 16 rulings driving these commits.
- [`../../reports/2026-05-12-phase-i-prime-report.md`](../../reports/2026-05-12-phase-i-prime-report.md) for the package-side contributions consumed here.
- `hollis-health-app` `v3.7.49` and `v3.7.50` for the parallel Health re-consumption work.
