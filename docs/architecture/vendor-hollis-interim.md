# Vendoring `@hollis-studio/*` into Workouts — interim Phase H

**Date:** 2026-05-17 (commit `71fcbb5`, `v1.9.2`)
**Status:** Historical. Superseded by GitHub Packages semver consumption in
Workouts; retained only for the 2026-05-17 EAS incident record.
**Related:** [`suite-infrastructure-migration.md`](./suite-infrastructure-migration.md), Workouts [`docs/TODO.md`](https://github.com/hollis-studio/Hollis-Workouts/blob/main/docs/TODO.md) §C.3

## TL;DR

This document is no longer the active package-consumption plan. Workouts now
consumes `@hollis-studio/*` packages from GitHub Packages by semver. The details
below explain the short-lived vendoring fix that unblocked a 2026-05-17 EAS
build failure.

EAS iOS production builds were failing at the Metro bundle step with
`ENOENT: ... /Users/expo/workingdir/hollis-shared`. `metro.config.js`
watched the sibling `../hollis-shared` repo, and the three `@hollis-studio/*`
deps in `package.json` resolved to symlinks into it — neither of which
exist on EAS's build server.

Fix: vendor `dist/` + `package.json` for each of the three `@hollis-studio/*`
packages into `vendor/@hollis-studio/<name>` and point `package.json` at the
in-repo copies via `file:./vendor/@hollis-studio/<name>`. EAS uploads the
project tree, so everything Metro needs is present.

The original Phase H plan (git-tag refs to the sibling repo with a
subdirectory selector) turned out to be unbuildable — see "Things that
don't work" below.

## The failing build

```
Bundle JavaScript
env: load .env
Starting Metro Bundler
Failed to construct transformer:  Error: ENOENT: no such file or directory,
stat '/Users/expo/workingdir/hollis-shared'
    at verifyRootExists (.../metro/src/DeltaBundler/Transformer.js:156:17)
```

Two contributing causes in this repo:

1. `metro.config.js` added `path.resolve(__dirname, '..', 'hollis-shared')`
   to `watchFolders`. Metro calls `statSync` on every watch folder at
   startup; the missing path crashed bundling before any source was read.
2. `package.json` declared each `@hollis-studio/*` dep as
   `file:../hollis-shared/packages/<name>`. `npm install` had created
   symlinks `node_modules/@hollis-studio/<name> -> ../../../hollis-shared/...`
   on the dev machine; on EAS those targets don't exist, so even if
   Metro had survived (1), every import would fail to resolve.

## Things that don't work

### `git+...#tag&path=subdir` (the original Phase H syntax)

The archived migration plan specifies:

```json
"@hollis-studio/contracts": "git+ssh://github.com/.../hollis-shared.git#tag&path=packages/contracts"
```

**npm does not support this.** Reproduced 2026-05-17 with npm 10 against
a public `hollis-shared` tag:

```
npm error command git --no-replace-objects checkout utils-v0.1.0-alpha.3&path=packages/utils
npm error error: pathspec 'utils-v0.1.0-alpha.3&path=packages/utils' did not match any file(s) known to git
```

npm has no concept of a "subdirectory of a monorepo git URL" — it treats
the entire fragment after `#` as a single git ref. The `&path=` (or
`&subdirectory=`) extension is from third-party tools (Yarn Berry has
`workspace:`, pnpm has its own protocols, `gitpkg.vercel.app` is a
community proxy) — none of them are npm-native.

If a future plan revisits git-URL installs, options that actually work:

- pure git URL pointing at a repo whose root _is_ the package
  (i.e. split each `@hollis-studio/*` into its own repo)
- a third-party proxy like `gitpkg`
- a `prepare` script that runs the build post-install (requires dev deps
  available at install time)

### Publishing `@hollis-studio/*` to GitHub Packages today

> **2026-05-19 update:** This section describes the blocker as it existed on 2026-05-17. It has since been resolved. The `Hollis-Studio` GitHub org was created and `hollis-shared` was transferred into it. GitHub Packages publishing under `@hollis-studio` is now the canonical path. See Route B in "What's still pending" below, which is marked DONE.

GitHub Packages requires the npm scope to match a real GitHub user or
org name. Verified 2026-05-17 (at the time of this incident, before `Hollis-Studio` org existed):

```
gh api users/hollis  → 404
gh api orgs/hollis   → 404
```

At the time, options were either create a GitHub org and transfer, or rename packages. This was resolved by creating the `Hollis-Studio` org and transferring the repo — a real Phase I task that has since been completed.

### Publishing to npmjs.org today

`@hollis` scope is unclaimed on npmjs (`npm view @hollis-studio/contracts` → 404).
This is a viable Phase I path — claim the scope under an npmjs account,
add `publishConfig: { "access": "public" }` to each package, `npm publish`
each one — but it still requires npmjs auth + scope claim, which is more
work than the user wanted for the immediate TestFlight unblock.

## What landed

### `hollis-shared` (sibling repo, pushed to `origin/main`)

- Commit `a642eeb`: `build: regenerate dist across packages + sync
pending source updates`. Rebuilt all four workspaces and committed
  outstanding local source changes (contracts + design-tokens) plus the
  regenerated dist so source/dist are consistent at HEAD.
- New tag `utils-v0.1.0-alpha.3` at `a642eeb` — the first `@hollis-studio/utils`
  tag that has `dist/` committed. Kept around even though Workouts ended
  up vendoring; future Phase I publishing should start from this tag.

### `Hollis-Workouts` (commit `71fcbb5`, `v1.9.2`)

- `vendor/@hollis-studio/{contracts,design-tokens,utils}/{dist,package.json}` —
  copies of the three packages at the new `hollis-shared` HEAD. Only
  `dist/` + `package.json` are vendored; source `.ts` files, tests,
  README, and tsconfig are not, because nothing in Workouts imports them.
- `package.json` deps:
  ```json
  "@hollis-studio/contracts":     "file:./vendor/@hollis-studio/contracts",
  "@hollis-studio/design-tokens": "file:./vendor/@hollis-studio/design-tokens",
  "@hollis-studio/utils":         "file:./vendor/@hollis-studio/utils"
  ```
- `metro.config.js` — dropped the `../hollis-shared` `watchFolders` entry
  and updated the comment.
- `scripts/checks/check-shared-consumption.js` — `SC-1` expected deps
  updated from `file:../hollis-shared/...` to `file:./vendor/@hollis-studio/...`.
- `.gitignore` — added `!vendor/**/dist/` exception so the global
  `dist/` rule doesn't exclude vendored builds.
- `ios/Podfile.lock` — `npx pod-install ios` ran to reconcile EXUpdates
  (a leftover from `v1.9.1` adding `expo-updates` without pod-installing).
  `ios/` is gitignored so this didn't land in the commit, but the local
  state now passes `check:native-modules`.

### What was _not_ committed

- `.serena/` in `hollis-shared` (Serena MCP local state)
- Any of Workouts' `ios/` regeneration output (gitignored)

## Bumping vendored packages (while we're still on the interim)

When `hollis-shared` ships a new `dist/`:

```bash
# in hollis-shared (or wherever a fresh dist lives)
cd ~/Documents/SRC/Hollis/hollis-shared
npm run build   # ensure dist is fresh
# tag + push if you want a record (optional while vendored)

# in Workouts
cd ~/Documents/SRC/Hollis/hollis-workouts
for p in contracts design-tokens utils; do
  rm -rf vendor/@hollis-studio/$p/dist
  cp -R ../hollis-shared/packages/$p/dist vendor/@hollis-studio/$p/
  cp ../hollis-shared/packages/$p/package.json vendor/@hollis-studio/$p/
done
rm -rf node_modules/@hollis
npm install
npm run typecheck && npm run check:shared-consumption
git add vendor && git commit -m "vX.Y.Z bump vendored @hollis-studio/* to <ref>"
```

There is no automated bump path — the whole point of vendoring is that
each bump is a deliberate commit. Don't add a CI job that auto-syncs;
that erodes the reason vendoring buys reproducibility.

## What's still pending — Phase I cutover

The vendor approach has two real costs:

1. **Code duplication.** ~64 files of compiled JS live in two repos.
   Anything wrong in `hollis-shared`'s `dist/` ships into Workouts on
   the next vendor sync.
2. **No semver.** `npm update` does nothing here. Drift between
   Workouts' vendored copy and Health's `file:../hollis-shared` install
   is invisible until something breaks.

Phase I is the proper destination. Two viable routes (pick when ready):

**Route A — npmjs.org (lower friction).** Claim `@hollis` scope under an
npmjs account, `publishConfig.access: public` on each package, publish
each from `hollis-shared`. Workouts deps become standard semver:
`"@hollis-studio/contracts": "^0.2.0-alpha.6"`. No `.npmrc` needed. No EAS
secrets needed.

**Route B — GitHub Packages (matches original suite plan).** ~~Create a
`hollis` GitHub org~~ **DONE**: the `Hollis-Studio` GitHub org was created and `hollis-shared` transferred into it. `publishConfig.registry: https://npm.pkg.github.com` and `repository: github.com/Hollis-Studio/hollis-shared` are set in each package's `package.json`. Consumers need an `.npmrc` with `@hollis-studio:registry=https://npm.pkg.github.com` and `NODE_AUTH_TOKEN`.

Either way, the Workouts cleanup is the same:

```bash
# update package.json deps to standard semver
# delete vendor/@hollis
# update scripts/checks/check-shared-consumption.js SC-1 expected deps
# update .gitignore (remove the !vendor/**/dist/ exception)
rm -rf vendor/@hollis node_modules/@hollis
npm install
```

The `docs/TODO.md` §C.3 entry "`@hollis-studio/*` Phase I cutover" tracks this.

## Lessons captured

- **Plan docs that contain unvalidated syntax are landmines.** The
  `git+...#tag&path=` line in the migration plan looked authoritative
  but was never run. A future plan that wants to specify a not-yet-tried
  install command should call that out explicitly and verify before
  another consumer adopts it.
- **EAS uploads the project root and only the project root.** Anything
  in metro `watchFolders`, `nodeModulesPaths`, or `file:` deps that
  resolves outside `Hollis-Workouts/` will silently work in local dev
  and break in CI. Worth a check (`check:eas-self-contained`?) at some
  point.
- **`dist/` getting silently gitignored under `vendor/`.** The repo's
  top-level `dist/` rule applied to nested vendored builds too. Easy
  to miss; explicit `!vendor/**/dist/` exception is now in place.

## Side note: ASC submission failure (post-build, separate issue)

The `v1.9.2` build (id `2a83f4ee`) finished successfully — proving the
vendor fix worked end-to-end. The `--auto-submit` step then failed:

```
[altool] *** Error: No suitable application records were found.
Verify your bundle identifier "com.hollis.workouts" is correct and
that you are signed in with an Apple ID that has access to the app
in App Store Connect.
```

This is unrelated to the vendoring work. Likely causes:

- App record with bundle ID `com.hollis.workouts` doesn't exist in App
  Store Connect for team `HXWNA7C5C4`
- The ASC App ID `6761510420` in `eas.json` points at a record with a
  different bundle ID
- The ASC API key `SBSU9X63FK` doesn't have access to the app

Fix is a manual ASC step (create/verify the app record, link it to the
right team and bundle ID, then re-run `eas submit -p ios --latest`).
