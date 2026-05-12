# Phase I Prime Report

Date: 2026-05-12

## Scope

Phase I prime promoted Workouts domain, error/result, and design-token content into `hollis-shared` before Workouts adoption.

## Workstream Commits

- `a053202` - `v0.2.0-alpha.0 ws2 promote workouts result and error codes, split weight schemas`
- `d0c859f` - `v0.2.0-alpha.0 ws1 promote workouts domain content`
- `211194a` - `v0.2.0-alpha.0 ws3 add clay palette and workouts design tokens`
- `aa20fcc` - `v0.2.0-alpha.0 prepare generated package artifacts`
- `960ef73` - `v0.2.0-alpha.1 bump changed package versions`

## Tags

- `v0.2.0-alpha.1`
- `contracts-v0.2.0-alpha.1`
- `design-tokens-v0.2.0-alpha.1`
- No `utils-v0.2.0-alpha.1` tag was created because utils was unchanged.

## Sibling Verification

- `npm install`: passed.
- `npm run build`: passed.
- `npm run typecheck`: passed.
- `npm run smoke:import`: passed, 71 public entrypoints.
- Targeted invariant test:
  `npm --workspace @hollis/contracts run test -- --runInBand packages/contracts/__tests__/workouts-domain-promotion.test.ts -t "canonicalization status refinement"` passed.

Preserved invariants:

- `MuscleGroup` now validates the 23-value Workouts production set.
- `EquipmentType` is the merged superset with canonical `cable`; `cable_machine` is intentionally not accepted.
- `TrainingSessionLog` exists alongside the existing plan-day `WorkoutSession` contracts.
- `SessionExerciseSchema.refine()` rejects `canonicalizationStatus: "matched"` when `canonicalExerciseId` is null.
- `Result<T>` keeps the Workouts success/error field shape and constructor signatures.

## Health Re-consumption

Updated Health package refs to:

- `@hollis/contracts`: `git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#contracts-v0.2.0-alpha.1`
- `@hollis/design-tokens`: `git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#design-tokens-v0.2.0-alpha.1`

Verification:

- Root `npm install`: completed. Husky prepare could not write `.git/config` under sandbox permissions, but npm exited successfully.
- Subproject installs for `server`, `web-admin`, `web-public`, and `ops`: completed.
- Five shared boundary gates: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed with the two inherited warnings in `server/src/services/userDataService.ts`.
- `npm run check:suite:sanity -- --quick --fail-fast`: blocked at `typecheck:server`.

Health blocker:

`check:suite:sanity` failed on existing server TypeScript errors unrelated to the new shared package surface, including `SystemOperationReason` string mismatches, route validation typing, Stripe request option typing, and several nullable/implicit-any issues. No Health source fixes were made in this phase.

## Workouts Smoke Test

Command:

```bash
npm install @hollis/contracts@git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#contracts-v0.2.0-alpha.1 --no-save --package-lock=false
npm run typecheck
rm -rf node_modules/@hollis && npm install
```

Result:

- Smoke install completed.
- `npm run typecheck`: passed.
- Restore install completed. Husky prepare could not write `.git/config` under sandbox permissions.
- Workouts had substantial pre-existing WIP. No source files were intentionally modified; `package-lock.json` remains dirty after the install cycle and should be reviewed with the user's in-flight WIP.

## Pending Workouts Adoption Items

- C.3: Workouts-side typography rename `extraBold` -> `heavy`.
- C.4: Workouts-side shadow object adoption through `Platform.select`.
- C.6: Workouts keeps Unistyles and should add a Clay native-theme adapter during Step 2 adoption.

## Definition-of-Done Status

Completed:

- Workstream 1, 2, and 3 commits landed.
- Sibling package builds, typechecks, smoke-imports, and targeted invariant test pass.
- Release and package subtree tags were created locally.
- Health re-consumption package refs and lockfiles were updated and left dirty for deliberate review.
- Workouts smoke typecheck passed against the new contracts tag.

Not complete:

- Health sanity did not stay 67/67 because `typecheck:server` failed on existing server TypeScript errors.

