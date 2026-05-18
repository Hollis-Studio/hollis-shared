# Legacy Contract Alias Audit — 2026-05-12

## Scope

Audit of the lowercase legacy root aliases exported by
`/Users/isaaclandes/Documents/SRC/hollis-shared/packages/contracts/index.ts`
under the block labeled:

> Legacy root aliases retained for consumers migrating off the old local barrels.

Aliases audited:

- `accountStatusSchema`
- `activityLevelSchema`
- `biologicalSexSchema`
- `EXPERIENCE_LEVELS`
- `experienceLevelSchema`
- `pregnancyStatusSchema`
- `primaryGoalSchema`
- `userAccountSchema`
- `userGoalsSchema`
- `userMetricsSchema`
- `userPreferencesSchema`
- `userProfileSchema`
- `foodSourceSchema`
- `dailySummarySchema`
- `wearablesDataSchema`

## Decision

Do not remove the legacy alias block yet.

`npm run check:shared-extraction` is passing in Health, but lowercase root alias
usages remain in Health consumers. Removing the block now would break existing
imports from `@hollis/contracts`.

## Evidence

Command run from `/Users/isaaclandes/Documents/SRC/hollis-health-app`:

```bash
rg -n "\b(accountStatusSchema|activityLevelSchema|biologicalSexSchema|EXPERIENCE_LEVELS|experienceLevelSchema|pregnancyStatusSchema|primaryGoalSchema|userAccountSchema|userGoalsSchema|userMetricsSchema|userPreferencesSchema|userProfileSchema|foodSourceSchema|dailySummarySchema|wearablesDataSchema)\b" --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**' --glob '!coverage/**'
```

Direct `@hollis/contracts` root-alias imports found:

- `src/services/db.http.ts:51` imports `userAccountSchema`
- `src/__tests__/schema-drift-diagnostic.test.ts:23` imports `userAccountSchema`
- `scripts/check-mapper-conformance.test.js:101` imports `userProfileSchema`
- `scripts/check-mapper-conformance.test.js:410` imports `userProfileSchema`
- `scripts/check-mapper-conformance.test.js:432` imports `userProfileSchema`
- `scripts/check-mapper-conformance.test.js:479` imports `userProfileSchema`
- `scripts/check-mapper-conformance.test.js:609` imports `userProfileSchema`
- `scripts/check-mapper-conformance.test.js:815` imports `userProfileSchema`

Additional Health test usages depend on lowercase root aliases through
`@hollis/contracts`, including:

- `src/__tests__/shared-validation.test.ts`
- `src/__tests__/user-contracts.test.ts`
- `src/__tests__/contracts-daily.test.ts`

Workouts consumer scan result:

- No matches in `/Users/isaaclandes/Documents/SRC/Hollis-Workouts` for the
  audited alias names, excluding `node_modules`, `dist`, `build`, and
  `coverage`.

Shared package scan result:

- Matches in `/Users/isaaclandes/Documents/SRC/hollis-shared` are limited to
  the compatibility export block in `packages/contracts/index.ts`.

Extraction gate:

```bash
npm run check:shared-extraction
```

Result:

- Pass. `shared-package-boundary` and `shared-consumer-boundary` are both green.

## Blockers

- Replace Health imports of lowercase root aliases with canonical exported names
  from `@hollis/contracts`, or move the compatibility expectation into a
  deliberate public API contract.
- Update tests that still assert the old lowercase barrel shape before deleting
  the shared compatibility block.

## Residual Risk

The alias block is still public root API surface until these consumers are
migrated. Keeping it is safer than removal today, but it can mask incomplete
consumer cleanup during the final GitHub Packages cutover.
