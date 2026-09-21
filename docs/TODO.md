# hollis-shared — Engineering TODO

> Structural items surfaced by the 2026-07-05 suite-wide CI/CD RCA, re-verified
> against the registry, consumer manifests, and current source on **2026-09-20**.
> Suite-wide process items live here because shared is the canonical cross-app repo.

## Open

### OPS — dist-tag writes Isaac must run (nothing in the repo can do it)

All four commands below are one-off fixes to **already-published** versions.
New publishes no longer need them: `.github/workflows/publish.yml` sets both
`alpha` and `latest` on every release it makes. Verify current state first, and
re-verify after:

```sh
cd hollis-shared && node scripts/dist-tag-health.mjs   # exits 1 while any of the below is outstanding
```

```sh
# contracts: 'latest' (and the legacy 'next') lag the alpha channel
npm dist-tag add @hollis-studio/contracts@0.2.0-alpha.89 latest  --registry=https://npm.pkg.github.com
npm dist-tag add @hollis-studio/contracts@0.2.0-alpha.89 next    --registry=https://npm.pkg.github.com

# design-tokens / utils / auth-client: these have an 'alpha' tag but NO 'latest'
npm dist-tag add @hollis-studio/design-tokens@0.2.0-alpha.2 latest --registry=https://npm.pkg.github.com
npm dist-tag add @hollis-studio/utils@0.1.0-alpha.1         latest --registry=https://npm.pkg.github.com
npm dist-tag add @hollis-studio/auth-client@0.1.0-alpha.4   latest --registry=https://npm.pkg.github.com
```

- **`contracts` `latest` and `next` lag the `alpha` channel.** Verified against
  the registry 2026-09-20: `alpha` → `0.2.0-alpha.89`, `latest` →
  `0.2.0-alpha.87`, `next` → `0.2.0-alpha.87`. (`latest` was stuck on
  `0.2.0-alpha.54` for months; it has since been moved forward twice by hand,
  but never to the head.) Consumers that pin exact versions are unaffected —
  all of them do — but a bare `npm install @hollis-studio/contracts` resolves
  `latest` and installs two releases of drift.
- **`design-tokens`, `utils`, and `auth-client` have an `alpha` tag but no
  `latest`.** Each has exactly one published version (`0.2.0-alpha.2`,
  `0.1.0-alpha.1`, `0.1.0-alpha.4`). Because a bare package spec resolves
  through `latest` first, `npm view @hollis-studio/utils` and
  `npm view @hollis-studio/utils versions` print **nothing at all** — which is
  why registry checks on these three keep getting misread as auth failures.
  `npm view @hollis-studio/utils@alpha versions` does work and is the
  workaround until `latest` is set.
- **Publishing still mostly bypasses CI.** The gated workflow exists
  (`.github/workflows/publish.yml`, tag-triggered, one job holding the only
  package-write credential) but has run **exactly once**, for
  `auth-client-v0.1.0-alpha.4` on 2026-09-20. contracts `0.2.0-alpha.88` and
  `0.2.0-alpha.89` were both published from a laptop, bypassing the gate. Fix:
  release by pushing a `<package>-v<version>` tag, never `npm publish` by hand.
- **Legacy git tags collide with the publish trigger.** `utils-v0.1.0-alpha.2`
  and `utils-v0.1.0-alpha.3` already exist on `origin` from the pre-workflow
  tagging era and were never published (the registry has only
  `0.1.0-alpha.1`); `design-tokens-v0.2.0-alpha.2` is likewise taken. The
  workflow triggers on a tag **push**, so reusing one of those numbers produces
  a release that can never be published by tag. Always check
  `git ls-remote --tags origin` before choosing the next version. (This is why
  `packages/utils` is now at `0.1.0-alpha.4`, not `.2`.)
- **`legacy-peer-deps=true` still set in two repo-root `.npmrc` files.**
  Remaining: `hollis-health-app/.npmrc` (pending Expo validation) and
  `hollis-workouts/.npmrc` — plus `hollis-workouts/server/.npmrc`.
  Done: `hollis-identity` ✅ 2026-07-05, `hollis-shared` ✅, and every
  `hollis-health-app` sub-workspace (`server`, `web-admin`, `web-public`, `ops`)
  is already `false`. The two roots are the ones that can regenerate a lockfile
  missing peer entries and break strict `npm ci` in Docker/CI.
- **`@hollis-studio/utils@0.1.0-alpha.4` needs a publish.** The published
  `0.1.0-alpha.1` declares `"@hollis-studio/contracts": "*"`, which resolves off
  `latest` — so installing the published tarball pulls a second, months-old
  nested copy of contracts beside the consumer's own exact pin. The workspace
  now declares contracts as a **peer** range (`^0.2.0-alpha.85`) plus a
  devDependency, mirroring `auth-client`'s DEP_001 resolution, and is bumped to
  `0.1.0-alpha.4`. Until it ships, the fix exists only in this checkout, and
  all five consumers (`hollis-health-app` root/`server`/`web-admin`/
  `web-public`, `hollis-workouts`) still install the `"*"` version. Release it
  the gated way:
  ```sh
  git tag utils-v0.1.0-alpha.4 && git push origin utils-v0.1.0-alpha.4
  ```
  Also regenerate the root lockfile so it stops recording the old shape —
  `npm ci` still exits 0 with it stale, so this is hygiene, not a breakage:
  ```sh
  cd hollis-shared && npm install --package-lock-only
  ```
- **Consumers are behind the current contracts release.** Verified 2026-09-20:
  `hollis-health-app` (mobile, `server`, `web-admin`, `web-public`) is on
  `0.2.0-alpha.85`; `hollis-workouts` (app + `server`) and `hollis-identity` are
  on the published head `0.2.0-alpha.89`. Only health-app is behind now.
  Bump via `npm install @hollis-studio/<pkg>@<exact-version>`, never by hand.

## Done

- 2026-09-20 — **`auth-client@0.1.0-alpha.4` published, and consumed.** It is on
  the registry (`alpha` → `0.1.0-alpha.4`), pinned in both
  `hollis-health-app/server` and `hollis-workouts/server`, and installed at that
  version in each. It carries the HS256 algorithm pin
  (`packages/auth-client/index.ts` — `jwt.verify(..., { algorithms: ["HS256"] })`)
  and the contracts peer range. It is also the **only** release ever made
  through the gated workflow.
- 2026-09-20 — **Gated publish workflow covers all four packages.**
  `.github/workflows/publish.yml` triggers on `<package>-v<version>` tags,
  asserts tag version == manifest version, runs the full CI gate, verifies the
  six legal documents in the packed tarball **and again in the tarball
  downloaded back from the registry** (the alpha.57–.62 class of regression),
  then sets both `alpha` and `latest` to the published version and asserts both.
  The dist-tag rule is written down at the top of that file: for these packages
  `latest` tracks the alpha channel, because every consumer pins exact versions
  and a missing/stale `latest` only ever causes confusion.
- 2026-09-20 — **`packages/utils` contracts declaration fixed.** It had been
  pinned to published `@hollis-studio/contracts@0.2.0-alpha.8` — 79 releases
  behind — so utils built against a contracts API nothing else in the suite
  used. It is now a peer range `^0.2.0-alpha.85` plus a matching devDependency,
  consistent with `auth-client`. (Re-check with
  `grep -A2 peerDependencies packages/utils/package.json`. Still unpublished —
  see Open.)
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
