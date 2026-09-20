# hollis-shared — Engineering TODO

> Structural items surfaced by the 2026-07-05 suite-wide CI/CD RCA, re-verified
> against the registry, consumer manifests, and current source on **2026-09-20**.
> Suite-wide process items live here because shared is the canonical cross-app repo.

## Open

- **`contracts` `latest` dist-tag is stuck at `0.2.0-alpha.54`.** The `alpha`
  channel is at `0.2.0-alpha.87`; `next` is at `0.2.0-alpha.72`. A bare
  `npm install @hollis-studio/contracts` resolves `latest` and installs
  alpha.54 — which carries **superseded legal-document versions/contentHashes
  and the pre-rename studio address**. Consumers that pinned exact versions are
  unaffected; anything that does not pin is silently wrong. Fix: point `latest`
  at the current alpha (or delete the tag so a bare install fails loudly rather
  than resolving to something months old). Requires Isaac to authorize an
  `npm dist-tag` write — nothing in the repo can do it.
  ```sh
  npm run npm:agent -- view @hollis-studio/contracts dist-tags
  ```
- **`design-tokens`, `utils`, and `auth-client` have no dist-tags at all.** Each
  has exactly one published version (`0.2.0-alpha.2`, `0.1.0-alpha.1`,
  `0.1.0-alpha.3`). With no `latest` and no `alpha`, `npm view @hollis-studio/utils`
  prints **nothing** and a bare install cannot resolve, which is why registry
  checks on these three look like an auth failure and get misread as one. Fix:
  set the `alpha` tag on the published version of each.
- **`auth-client@0.1.0-alpha.4` is unpublished.** The workspace is at alpha.4,
  the registry only has alpha.3, and every consumer
  (`hollis-health-app/server`, `hollis-workouts/server`) installs alpha.3.
  alpha.4 is the version that carries the HS256 algorithm pin
  (`packages/auth-client/index.ts` — `jwt.verify(..., { algorithms: ["HS256"] })`)
  plus the contracts peer-dependency range; until it ships, the pin exists only
  in this checkout. Requires an authorized publish.
- **Publishing is manual with no gate tying it to green CI.** CI (added
  2026-07-05) runs build/typecheck/smoke/tests on push — but `npm publish` still
  happens from a dev machine at any commit. Consider a tag-triggered publish
  workflow so consumers can only install CI-green versions.
- **`legacy-peer-deps=true` still set in two repo-root `.npmrc` files.**
  Remaining: `hollis-health-app/.npmrc` (pending Expo validation) and
  `hollis-workouts/.npmrc` — plus `hollis-workouts/server/.npmrc`.
  Done: `hollis-identity` ✅ 2026-07-05, `hollis-shared` ✅, and every
  `hollis-health-app` sub-workspace (`server`, `web-admin`, `web-public`, `ops`)
  is already `false`. The two roots are the ones that can regenerate a lockfile
  missing peer entries and break strict `npm ci` in Docker/CI.
- **Consumers are behind the current contracts release.** `hollis-health-app`
  (mobile, `server`, `web-admin`, `web-public`) is on `0.2.0-alpha.85`,
  `hollis-identity` on `0.2.0-alpha.83`, against a published `0.2.0-alpha.87`.
  Bump via `npm install @hollis-studio/<pkg>@<exact-version>`, never by hand.

## Done

- 2026-09-20 — **`packages/utils` contracts pin fixed.** It had been pinned to
  published `@hollis-studio/contracts@0.2.0-alpha.8` — 79 releases behind — so
  utils built against a contracts API nothing else in the suite used. Now
  `0.2.0-alpha.87`. (Re-check with
  `grep '@hollis-studio/contracts' packages/utils/package.json`; a guard keeping
  it within N releases of current is still worth adding.)
- 2026-09-20 — **README "current published versions" block removed.** It had
  drifted three times (alpha.12, alpha.42) and is now replaced by the commands
  that read the registry, so there is nothing left to go stale. `docs/README.md`
  carries dated published-vs-installed tables instead.
- 2026-07-05 — First CI workflow added (`.github/workflows/ci.yml`): npm ci +
  `npm run check` (build, typecheck, smoke-import of 85 entrypoints) +
  contracts test suite, on push to main and PRs.
- 2026-07-05 — **Consumer bump SOP written down.** The alpha.42 bump was
  hand-edited into consumers' `package.json`/`package-lock.json`; combined with
  `legacy-peer-deps=true` in a dev machine's `~/.npmrc` it produced a lockfile
  missing peer entries and broke identity's Docker `npm ci` (deploy down until
  2026-07-05). SOP: bump via `npm install @hollis-studio/<pkg>@<version>`, never
  hand-edit, and keep `legacy-peer-deps=false` pinned in each consumer's repo
  `.npmrc` (two roots still outstanding — see Open).
- 2026-05-30 — **Workouts server normalized off local `@hollis/*` file deps.**
  `hollis-workouts/server` now consumes `@hollis-studio/contracts` and
  `@hollis-studio/auth-client` as registry semver deps. No `file:` or `git+`
  `@hollis*` dependency remains anywhere in the suite (verified 2026-09-20). Its
  own package *name* is still `@hollis/workouts-server`, which is cosmetic and
  unpublished.

---

Last reviewed: 2026-09-20.
