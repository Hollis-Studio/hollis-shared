# hollis-shared — Engineering TODO

> Structural items surfaced by the 2026-07-05 suite-wide CI/CD RCA. Suite-wide
> process items live here because shared is the canonical cross-app repo.

## Open

- **`packages/utils` pins published `@hollis-studio/contracts@0.2.0-alpha.8`** —
  34 alpha releases behind the workspace copy (alpha.42). utils builds against a
  contracts API nothing else in the suite still uses. Decide: widen the range so
  the npm workspace link resolves locally, or bump the pin alongside the next
  contracts release, and add a check that keeps it within N releases of current.
- **Publishing is manual with no gate tying it to green CI.** CI (added
  2026-07-05) now runs build/typecheck/smoke/tests on push — but `npm publish`
  still happens from a dev machine at any commit. Consider a tag-triggered
  publish workflow so consumers can only install CI-green versions.
- **Consumer bump SOP.** The alpha.42 bump was hand-edited into consumers'
  package.json/package-lock; combined with `legacy-peer-deps=true` in a dev
  machine's `~/.npmrc`, it produced a lockfile missing peer entries and broke
  identity's Docker `npm ci` (deploy down until 2026-07-05). SOP: bump via
  `npm install @hollis-studio/<pkg>@<version>` (never hand-edit), with
  `legacy-peer-deps=false` pinned in each consumer's repo `.npmrc`
  (identity ✅ 2026-07-05, shared ✅, health-app pending Expo validation,
  workouts pending).
- **README "current published versions" block drifts** (said alpha.12 while
  alpha.42 was live; corrected 2026-07-05). Either update it as part of the
  publish SOP or replace it with a pointer to the GitHub Packages page.

## Done

- 2026-07-05 — First CI workflow added (`.github/workflows/ci.yml`): npm ci +
  `npm run check` (build, typecheck, smoke-import of 85 entrypoints) +
  contracts test suite (2445 tests), on push to main and PRs.
