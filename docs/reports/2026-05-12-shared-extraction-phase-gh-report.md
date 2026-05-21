# Hollis Shared Extraction Phase G/H Report

Date: 2026-05-12

> **2026-05-19 status note:** Two naming facts in this document reflect the state at extraction time and have since changed: (1) the sibling repo path was `/Users/isaaclandes/Documents/SRC/hollis-shared` (lowercase) at extraction; it is now at `/Users/isaaclandes/Documents/SRC/Hollis/hollis-shared` (capitalized). (2) The initial package scope in the extraction was `@hollis/contracts` / `@hollis/design-tokens` / `@hollis/utils`; those were renamed to `@hollis-studio/contracts`, `@hollis-studio/design-tokens`, `@hollis-studio/utils`, and `@hollis-studio/auth-client` (a new package added post-extraction). Distribution is now via GitHub Packages under the `hollis-studio` org scope — see `2026-05-13-shared-deps-distribution.md` for the current distribution model.

## Scope

Phases G and H moved the in-tree `shared/` packages out of Hollis Health into a sibling local Git repo and rewired Hollis Health to consume the extracted packages from pinned local Git tags.

Phase I GitHub Packages publishing remains deferred.

## Sibling Repo

- Path: `/Users/isaaclandes/Documents/SRC/hollis-shared`
- Branch: `main`
- Initial extraction commit: `a1b8ff9023218454772c80c035b6d8611f612d3c`
- Initial tag: `v0.1.0-alpha.1`
- Commit message: `v0.1.0-alpha.1 initial extraction from hollis-health-app@v3.7.45`
- Packages:
  - `packages/contracts` -> `@hollis/contracts@0.1.0-alpha.1`
  - `packages/design-tokens` -> `@hollis/design-tokens@0.1.0-alpha.1`
  - `packages/utils` -> `@hollis/utils@0.1.0-alpha.1`
- History verification: `git log --oneline -- packages/contracts` shows prior Health commits, including `v3.7.44`, `v3.7.43`, and earlier shared-contract commits.
- Remote: none.
- Push: none.

### Install Ref Fallback

The requested sparse npm ref form failed locally:

```text
git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#v0.1.0-alpha.1&path=packages/contracts
```

The local npm client treated `v0.1.0-alpha.1&path=packages/contracts` as the literal Git ref. The alternate `#tag:packages/contracts` form installed the repo root package instead of the subpackage.

Per the session fallback rule, the sibling repo now has package-specific subtree split tags:

- `contracts-v0.1.0-alpha.1` -> `7ff22f7e013de5188e4282829305dbc81190f7ef`
- `design-tokens-v0.1.0-alpha.1` -> `29a8d6d878ca9c3e6189391827052bfcc39fa27f`
- `utils-v0.1.0-alpha.1` -> `1df16ef6cf7bc6d983212962470ac359fa29effb`

Health consumes those pinned tags through `git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#<package-tag>`. No `file:../shared`, workspace package, or local mirror was introduced.

## Health Commits

- `06ba08d5` - `v3.7.45 close shared extraction phase F follow-ups`
  - Deleted empty `web-admin/contracts/` and `server/src/contracts/` directories.
  - Documented that remaining web-admin validation candidates stay web-admin-local under `web-admin/validation/`.
- `v3.7.46 consume hollis-shared via pinned git-tag dependency`
  - Removed Health's in-tree `shared/` source and rewired consumers to the sibling `hollis-shared` Git tags.

## Health Changes

- Removed `shared/` from the Health repo.
- Bumped Health root package version to `3.7.46`.
- Updated the Health consumers to install extracted packages through sibling Git tags:
  - root `package.json`
  - `server/package.json`
  - `web-admin/package.json`
  - `web-public/package.json`
  - `ops/package.json`
- Removed root npm workspaces for `shared/*`.
- Updated Jest, CI, Docker, and local validation scripts to resolve installed `@hollis/*` packages from `node_modules` instead of in-tree `shared/` source.
- Added `scripts/generate-design-token-css.mjs` so generated token CSS is produced from installed `@hollis/design-tokens`.
- Updated offer-sheet sync to read installed `@hollis/contracts` package data.
- Kept `zod` pinned to `4.3.6` and confirmed root install resolves a single deduped Zod copy across `@hollis/contracts` consumers.

## Verification Results

### Phase G.1 Inheritance

- `git status --short --branch`: clean on `main` before edits.
- `git log --oneline -1`: `eb34f204 v3.7.44 clean up shared extraction fallout`.
- `git branch --list wip/shared-extraction-cleanup-snapshot-2026-05-12-am`: branch exists.
- `npm run check:shared-package-boundary`: pass.
- `npm run check:shared-consumer-boundary`: pass.
- `npm run check:shared-extraction`: pass.
- `npm run check:shared-no-local-barrels`: pass.
- `npm run check:shared-node-esm-smoke`: pass.
- `npm run typecheck`: pass.
- `npm run lint`: pass with two inherited warnings in `server/src/services/userDataService.ts`.
- `npm run check:suite:sanity -- --quick --fail-fast`: pass, 67/67 checks.

### Phase G.2 Cleanup

- Deleted empty `web-admin/contracts/` and `server/src/contracts/`.
- Re-ran:
  - `npm run check:shared-package-boundary`: pass.
  - `npm run check:shared-consumer-boundary`: pass.
  - `npm run check:shared-extraction`: pass.
  - `npm run check:shared-no-local-barrels`: pass.
  - `npm run check:shared-node-esm-smoke`: pass.
  - `npm run typecheck`: pass.
  - `npm run lint`: pass with the same two inherited warnings.
- Commit created: `06ba08d5 v3.7.45 close shared extraction phase F follow-ups`.

### Sibling Repo

- `git filter-repo` ran only in `/tmp/hollis-filter-clone`, not in the live Health repo.
- `npm install`: pass.
- `npm run build`: pass for contracts, design tokens, and utils.
- `npm run typecheck`: pass.
- `npm run smoke:import`: pass; imported 59 public entrypoints under native Node ESM.
- `git status --short --branch`: clean after commit and tag.

### Health Install

- Root: `rm -rf node_modules package-lock.json && npm install`: pass.
- Server: `rm -rf node_modules package-lock.json && npm install`: pass, with an inherited `@prisma/streams-local` Node engine warning under Node 20.
- Web admin: `rm -rf node_modules package-lock.json && npm install`: pass.
- Web public: `rm -rf node_modules package-lock.json && npm install`: pass.
- Ops: `rm -rf node_modules package-lock.json && npm install`: pass.

### Final Health Gates

Combined command:

```bash
npm run check:shared-package-boundary \
  && npm run check:shared-consumer-boundary \
  && npm run check:shared-extraction \
  && npm run check:shared-no-local-barrels \
  && npm run check:shared-node-esm-smoke \
  && npm run typecheck \
  && npm run lint \
  && npm run check:suite:sanity -- --quick --fail-fast
```

Outcome:

- `check:shared-package-boundary`: pass; inspects installed `node_modules/@hollis/*` packages.
- `check:shared-consumer-boundary`: pass; validates consumer dependencies and rejects local shared/workspace refs.
- `check:shared-extraction`: pass.
- `check:shared-no-local-barrels`: pass.
- `check:shared-node-esm-smoke`: pass; installed package smoke import is non-vacuous.
- `typecheck`: pass.
- `lint`: pass with two inherited warnings in `server/src/services/userDataService.ts`.
- `check:suite:sanity --quick --fail-fast`: pass, 67/67 checks.

The sanity suite still reports known warning-mode findings and the known server cold typecheck skip guard, but zero failures.

### Targeted Tests

Root/mobile sample:

```bash
npm test -- --runInBand \
  src/__tests__/auth-feature.test.ts \
  src/__tests__/contracts-sessions.test.ts \
  src/__tests__/services/dashboardAggregation.test.ts \
  src/__tests__/services/sse.test.ts
```

- Pass: 4 suites, 109 tests.

Server unit sample:

```bash
cd server && npm test -- --selectProjects unit --runInBand \
  src/__tests__/validation.test.ts \
  src/__tests__/businessAnalyticsValidation.test.ts \
  src/__tests__/jsonBlobValidation.test.ts \
  src/middleware/__tests__/mfa.test.ts
```

- Pass: 4 suites, 193 tests.

Web admin sample:

```bash
cd web-admin && npm test -- --runInBand \
  services/__tests__/mfaService.test.ts \
  services/__tests__/nutritionService.responseSchemas.test.ts \
  services/__tests__/billingService.responseSchemas.test.ts \
  __tests__/services/admin/trainingService.test.ts \
  services/admin/__tests__/appointmentService.test.ts
```

- Pass: 5 suites, 82 tests.

Server integration attempt:

```bash
cd server && npm test -- --runInBand \
  src/services/email/__tests__/emailTemplates.security.test.ts \
  src/services/compliance/__tests__/complianceEngine.test.ts \
  src/services/__tests__/metricApprovalConstants.test.ts
```

- The initial ESM transform issue for installed `@hollis/contracts` was fixed in Jest config.
- The rerun reached database cleanup and failed with local Prisma `ECONNREFUSED`; this is an environment/database availability block, not a package-resolution failure.

## Deferred Items

- Phase I GitHub Packages publish remains deferred.
- No `.npmrc` registry/auth config was added.
- No `npm publish` was run.
- No GitHub remote was added to `/Users/isaaclandes/Documents/SRC/hollis-shared`.
- No Health or sibling repo push was performed.
- Workouts adoption remains deferred.
- The older `npm run test:contracts` expectation drift remains out of scope per session context.
- Existing lint warnings in `server/src/services/userDataService.ts` were not changed.
- Existing audit/vulnerability output from npm installs was not addressed in this extraction scope.

## Workouts Adoption Notes

Before Workouts consumes `hollis-shared`, Phase I should decide whether consumption is through GitHub Packages or the current local Git-tag fallback.

Phase I prerequisites:

- Add the intended GitHub remote for `hollis-shared`.
- Run sibling repo gates: `npm install`, `npm run build`, `npm run typecheck`, `npm run smoke:import`.
- Verify `zod` remains a peer for `@hollis/contracts` to avoid duplicate type identity.
- Add GitHub Packages auth and registry config only as part of Phase I.
- Publish `@hollis/contracts`, `@hollis/design-tokens`, and `@hollis/utils` with package versions aligned to the chosen release tag.

Local fallback install shape for Workouts, if needed before Phase I:

```bash
npm install \
  "git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#contracts-v0.1.0-alpha.1" \
  "git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#design-tokens-v0.1.0-alpha.1" \
  "git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#utils-v0.1.0-alpha.1"
```

Expected Workouts breakage points:

- Direct private/deep imports that are not declared in package `exports`.
- Local tsconfig, Metro, Jest, or Vite aliases pointing at former shared source paths.
- Jest transforms for installed ESM TypeScript packages.
- Duplicate `zod` versions or nested Zod installs.
- Any offer-sheet, token-generation, or sync scripts that assumed in-repo `shared/` source files.

## Self-Review Checklist

### Core Architecture
- [x] Architecture: Consumers now resolve `@hollis/*` through package boundaries, not source-path aliases.
- [x] Contracts: Public `exports` maps were preserved; no wildcard/internal blanket export was added.
- [x] Barrel Exports: No local compatibility barrels were recreated.
- [x] Circular Deps: `check:circular` passes in the sanity suite; installed contracts are included.
- [x] Type Drift: `check:type-drift`/contract drift checks pass or report only existing warning-mode findings.

### Validation & Safety
- [x] Validation: No backend route validation semantics were changed.
- [x] Response Shapes: No API response shape change was introduced.
- [x] Auth Middleware: No PHI route auth middleware was changed.
- [x] Type Safety: `npm run typecheck` passes.
- [x] Raw SQL: No Prisma raw SQL was added.

### Security & PHI
- [x] PHI Logging: No PHI logging code was added.
- [x] Secrets: No hardcoded secrets or registry tokens were added.
- [x] Error Exposure: No server error exposure path was changed.
- [x] Cache-Control: No PHI endpoint cache behavior was changed.
- [x] CORS: No backend CORS config was changed.
- [x] URLs: Local Git refs are package manager dependency refs; no production API URL was added.
- [x] HTTPS: No production `http://` URL was added.

### Code Quality
- [x] Tests: Targeted consumer tests passed across root/mobile, server unit, and web-admin.
- [x] Test Imports: No new test implementation deep imports were added.
- [x] Test Colocation: No new test files were added.
- [x] File Size: No large application source file was introduced.
- [x] Bundle Size: `check:bundle-size` remains green in sanity.
- [x] Dead Code: `check:dead-code` remains warning-mode only in sanity.
- [x] Query Keys: No React Query keys were changed.
- [x] TODOs: No TODO was added.
- [x] Design Tokens: Token generation now reads `@hollis/design-tokens`.

### Observability & Standards
- [x] Logging: No new logging path was added.
- [x] Console.log: No server `console.log` was added.
- [x] Eval Patterns: No eval-like pattern was added.
- [x] Dependency Versions: `zod` was aligned to `4.3.6`; dependency-version check remains warning-mode only in sanity.
- [x] Tech Debt: npm sparse Git ref incompatibility and deferred Phase I/Workouts items are documented above.
