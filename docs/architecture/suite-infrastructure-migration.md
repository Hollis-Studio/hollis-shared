# Hollis Suite — Infrastructure Migration Plan

> **Status:** Approved direction. Owner: Isaac. AI-driven execution.
> **Captured:** 2026-05-11
> **Scope:** Restructure the Hollis suite (currently Health + Workouts; 4 more
> apps planned) so every app consumes a single versioned source-of-truth for
> types, schemas, design tokens, errors, and identity.
> **Companion docs:**
>
> - End-state architecture: [`./suite-strategy.md`](./suite-strategy.md)
> - Suite vision: [`../vision/2026-05-18-suite-vision.md`](../vision/2026-05-18-suite-vision.md)
> - Workouts mass-market punch list: [`Hollis-Workouts/docs/archive/plans/2026-05-11-mass-market-todo.md`](https://github.com/hollis-studio/Hollis-Workouts/blob/main/docs/archive/plans/2026-05-11-mass-market-todo.md)
> - Health-side extraction tracking: [`hollis-health-app/docs/audits/POST_LAUNCH_BACKLOG.md`](https://github.com/hollis-studio/hollis-health-app/blob/main/docs/audits/POST_LAUNCH_BACKLOG.md)

---

## 1. End-state architecture

```
                  ┌────────────────────────────────────────┐
                  │            hollis-shared                │
                  │  (GitHub Packages, semver, pinned)      │
                  │                                          │
                  │  @hollis-studio/contracts        (types, Zod)   │
                  │  @hollis-studio/design-tokens   (theme tokens)  │
                  │  @hollis-studio/utils            (pure utils)   │
                  └────────────────────────────────────────┘
                              ▲              ▲
                              │              │
            ┌─────────────────┘              └─────────────────┐
            │                                                   │
   ┌────────┴────────────┐                       ┌──────────────┴────────┐
   │  hollis-health-app  │                       │  Hollis-Workouts       │
   │                     │                       │                        │
   │  • Mobile (Expo)    │                       │  • Mobile (Expo)       │
   │  • Web Admin (Next) │                       │  • workouts-server     │
   │  • Web Public (Next)│                       │    (Express + Prisma)  │
   │  • server (Express  │                       │  • Postgres RDS        │
   │    + Prisma + RDS)  │                       │  • ECS Fargate         │
   │  • ECS Fargate      │                       │                        │
   └──────────┬──────────┘                       └────────────┬───────────┘
              │                                                │
              └────────────────┬──────────────────────────────┘
                               │
                               ▼
                  ┌────────────────────────────┐
                  │   Hollis Identity Service   │
                  │   (extracted from Health    │
                  │    server/src/services/     │
                  │    authService.ts)          │
                  │                              │
                  │   JWT issuer, bcrypt, MFA,   │
                  │   token denylist, audit log  │
                  └────────────────────────────┘
```

**Invariants:**

- Every app consumes `@hollis-studio/*` packages from GitHub Packages, pinned by semver.
- Every app has its own backend, own Postgres DB, own deployment, own release cadence.
- One identity service issues JWTs valid across the entire suite. One user = one login.
- Every app's API routes validate input with Zod schemas imported from `@hollis-studio/contracts`.
- HIPAA boundary is declared per-app in package metadata. Cross-app PHI flows are typed contracts only — no shared DB access.

---

## 2. Decisions and rationale

### 2.1 Identity: extract Health's JWT auth into a standalone service. Not Cognito.

Health's `server/src/services/authService.ts` + `server/src/middleware/auth.ts` already provide:

- JWT issuance with minimal claims (`userId`, `role`, `jti`) — no PHI in tokens.
- bcrypt password hashing with high cost factor.
- httpOnly cookie for web + Authorization Bearer for mobile — dual-mode covers all suite apps.
- Token denylist (`tokenDenylistService`) for logout / forced revocation.
- MFA middleware (`middleware/mfa.ts`).
- PHI audit logging integration.
- Role-based authorization (CLIENT, CLINICIAN, ADMIN, TRAINER) extensible to suite-wide roles.

Cognito would add nothing capability-wise and forces one of:

- Mass forced password reset (poor UX for existing Health clients).
- Custom Cognito migration Lambda that validates against bcrypt hashes on first sign-in, then rewrites the hash into Cognito's format. Multi-week effort, replaces tested code with new code.

Decision: extract the existing auth into `hollis-identity` (separate ECS service, own Postgres for the user/session/MFA tables). Both Health and Workouts consume it as a client.

Cognito stays on the table only if/when we need federated identity (Sign in with Google/Apple), at which point we put Cognito _in front of_ the Hollis identity service via OIDC federation rather than replacing it.

### 2.2 Registry: GitHub Packages

- Authenticates against the same GitHub tokens the suite already uses.
- Zero new IAM surface to manage.
- Private repos publish private packages by default.
- Trivial migration to AWS CodeArtifact later if scale demands.

### 2.3 Shared repo name: `hollis-shared`

Other candidates considered: `hollis-platform` (too overloaded), `hollis-core` (implies app logic; this is contracts only). `hollis-shared` is unambiguous.

### 2.4 Backend stack convergence

Workouts moves off Firebase to Express + Prisma + Postgres on ECS Fargate, mirroring Health. Reasons:

- Cross-suite reads (clinician views client's workouts) require typed APIs, not Firebase SDK access from another origin.
- Suite-wide ops tooling (`ops/triage-service.ts` in Health, log shipping, audit log shape) assumes the Health stack.
- One stack = one runbook, one CI pattern, one Terraform module shape, one set of agent tools.

Firebase Auth gets replaced by the Hollis identity service in the same cutover.

---

## 3. Dependency DAG (cannot be reordered)

```
1. Extract hollis-shared repo
        │
        ├──► 2. Workouts adopts @hollis-studio/design-tokens (smoke test)
        │
        ├──► 3. Workouts adopts @hollis-studio/contracts primitives + errors
        │            │
        │            └──► 4. Promote overlapping domain types upstream
        │                       │
        │                       └──► 5. Build workouts-server (Express + Prisma + Postgres)
        │                                  │
        │                                  ├──► 7. Firestore → Postgres ETL
        │                                  │
        │                                  └──► 8. Mobile client cutover
        │                                             │
        ├──► 6. Extract Hollis Identity Service ──────┘
        │            │
        │            └──► (Health migrates to consume identity service as a client too)
        │
        └──► (every app: contracts package upgrades flow through normal PR review)

                                                      │
                                                      ▼
                                    9. Sunset Firebase
                                                      │
                                                      ▼
                                    10. Cross-suite features go live
```

---

## 4. Step-by-step plan

### Step 1 — Extract `hollis-shared` repo

**Source:** `hollis-health-app/shared/{contracts,design-tokens,utils}/`

**Target:** new repo `hollis-shared/` containing four workspace packages.

**Boundary standard (updated 2026-05-12, revised 2026-05-12 PM):** zero
exceptions. The extraction is not complete until Health and Workouts
consume shared code exactly like future suite apps will: through published
`@hollis-studio/*` packages and explicit package exports.

Hard rules:

- No consumer imports from `shared/*` by relative path.
- No `@contracts` compatibility alias in app code or tooling.
- No `file:../shared/*` dependencies pointing back into the same repo.
- No TS/Babel/Metro/Jest/Next aliases that map `@hollis-studio/*` packages to local
  shared source after extraction.
- No private deep imports unless the package explicitly exposes that subpath
  in `exports`.
- **No local "compatibility barrel" directories that re-export shared
  contracts under a different alias (e.g. `src/contracts/*`, `web-admin/contracts/*`,
  `server/src/contracts/*`).** Consumers either use a public `@hollis-studio/*`
  entrypoint directly or the package adds an explicit `exports` entry —
  intermediate shim layers are forbidden because they silently defeat the
  boundary gates while reshaping the public surface per-consumer. Lesson
  encoded after the 2026-05-12 cleanup attempt introduced `src/contracts/`
  in Health to paper over consumer-side coupling, passed the three named
  gates, and still left the package non-consumable.
- Package `main`, `types`, and every `exports` target point at compiled
  `dist`, not `.ts` source.
- Compiled `dist` output must be valid Node ESM: every re-export resolves
  to a concrete file path with extension (e.g. `./primitives/index.js`),
  not a directory shorthand. Verified by a Node ESM smoke import in CI,
  not just static analysis.
- Shared packages stay platform-neutral: no React, React Native, Expo, Next,
  Prisma, AWS SDK, Stripe SDK, app aliases, storage, DB, or network I/O in
  runtime code.
- `@hollis-studio/design-tokens` remains tokens and platform adapters, not a shared
  UI component library.

**Health-side deterministic gates added 2026-05-12 (strengthened 2026-05-12 PM):**

```bash
npm run check:shared-package-boundary
npm run check:shared-consumer-boundary
npm run check:shared-extraction
npm run check:shared-no-local-barrels   # added after 2026-05-12 PM lesson
npm run check:shared-node-esm-smoke     # added after 2026-05-12 PM lesson
```

The first three gates were green on 2026-05-12 with the cleanup work in
progress, but `typecheck`, `lint`, and `check:suite:sanity` were still red,
and the package emitted invalid Node ESM. The added gates close those
loopholes. **Treat all five as the minimum bar; passing the first three
alone does not mean the boundary is clean.**

Baseline counts on 2026-05-12 (pre-attempt, against the original three gates):

- `check:shared-package-boundary`: 47 violations.
- `check:shared-consumer-boundary`: 552 violations.
- Main buckets: package manifests still source-based/private, generated
  manifest artifacts in `dist`, missing `@hollis-studio/utils` package metadata,
  `@contracts` alias usage, direct `shared/*` imports, file dependencies,
  config aliases to local source, and private subpath imports.

Lessons baked in after the 2026-05-12 attempt:

- A passing gate suite ≠ a clean boundary. Run `typecheck`, `lint`,
  `check:suite:sanity`, and a Node ESM smoke import every time before
  declaring a category done.
- Local re-export barrels are the most attractive shortcut and the most
  damaging one. They must be banned by gate, not by prose.
- The medial cascade (typecheck + lint cascades from shape drift between
  local-shadow types and shared contracts) is part of the cleanup, not a
  follow-up. A 426-file dirty worktree with 18k lint errors is a sign the
  cleanup is structurally wrong, not nearly done.

**Order of operations (revised 2026-05-12 PM after first cleanup attempt):**

The 2026-05-12 AM attempt extracted in spirit (set up package configs,
removed alias mappings) without first unwinding the consumer-side coupling
and without verifying the package was actually consumable. Result: the
three named gates went green, a 426-file dirty worktree appeared, a local
`src/contracts/` compatibility-barrel directory was introduced, the
emitted `dist` was invalid Node ESM, typecheck had hundreds of errors,
and lint had ~18k errors. The revised order below prevents that:

**Phase A — Triage and contain (in Health repo).** Snapshot the current
mid-flight worktree on a WIP branch so nothing is lost. Audit every dirty
file into four buckets: keep, unwind, regenerate, unrelated. Write the
bucket assignment to [`../reports/2026-05-12-extraction-triage.md`](../reports/2026-05-12-extraction-triage.md) before
changing anything.

**Phase B — Unwind compatibility barrels (in Health repo).** Delete every
local `*/contracts/*` re-export layer (`src/contracts/`, `web-admin/contracts/`,
`server/src/contracts/`, etc.). For each consumer that imported from those
shims, rewrite to one of two outcomes: (i) import directly from a public
`@hollis-studio/contracts` entrypoint, or (ii) flag the case for a deliberate
public-export decision in Phase D. No new shim layers.

**Phase C — Fix the package emit (in Health repo).** Make `tsc` produce
Node-ESM-valid `dist`. Every internal re-export resolves to a concrete file
path with extension. Validate with a tiny throwaway script that
`import { ok, err } from "@hollis-studio/contracts"` and a representative subpath
import both work from a plain Node ESM context, with no TS resolution help.

**Phase D — Harden the gates (in Health repo).** Add
`check:shared-no-local-barrels` (flags any `**/contracts/**.ts` outside
`shared/` that re-exports from `@hollis-studio/*` or `shared/*`) and
`check:shared-node-esm-smoke` (runs the Phase C smoke import as a CI step).
Re-run all five gates. **Expect them to go red** — that is the true
violation count. The original 47 / 552 baseline understated the work
because the gates were not yet looking for barrels.

**Phase E — Re-do the consumer rewrite (in Health repo).** Drive the
strengthened gate suite to zero by the rule already declared: each
violation resolves to either using an existing public entrypoint or adding
a deliberate `exports` entry (documented in `SCHEMA_INDEX.md`). No
intermediate barrels under any name. Use Serena for find-references on
every type rename and export move. Sub-agents parallelize across the
disjoint consumer codebases (`server/`, `web-admin/`, `web-public/`, mobile
`app/` + `src/`).

**Phase F — Drive the medial cascade to zero (in Health repo).** Once the
strengthened gates are green, `typecheck` and `lint` must also be green
and `check:suite:sanity` must pass. Cascades from shape drift between
formerly-local-shadow types and shared contracts (`strategyType` vs `type`,
`WorkoutPlanContract`, `STRATEGIES_ROUTES`, auth schema casing, etc.) get
resolved here. The shared contract is source of truth; consumers update
to match.

**Phase G — Extract `hollis-shared` to a sibling local repo.** Once
Phases A-F are green in Health repo:

1. Create `~/Documents/SRC/Hollis/hollis-shared/` (sibling to `hollis-health-app/`
   and `Hollis-Workouts/`).
2. Use `git filter-repo --path shared/` against a clone of `hollis-health-app`
   to preserve commit history for the extracted directory. Push to the
   sibling repo (local-only initially; pushed to `Hollis-Studio/hollis-shared`
   on GitHub under the `Hollis-Studio` org).
3. Restructure as an npm workspace:
   ```
   hollis-shared/
     packages/
       contracts/         (was shared/contracts/)
       design-tokens/     (was shared/design-tokens/)
       utils/             (was shared/utils/)
       auth-client/       (thin server-side JWT verification middleware)
     package.json         (workspaces: ["packages/*"])
     .github/workflows/
       publish.yml        (publish on tag push — wired but dormant)
       typecheck.yml      (PR gate)
   ```
   Note: no `.github/workflows/` directory exists in the repo as of 2026-05-19; CI/CD pipeline is still outstanding.
4. Update each package's `package.json`:
   - `"name": "@hollis-studio/contracts"` (already correct)
   - `"version": "0.1.0-alpha.1"` (alpha tags during transition; cut to
     `1.0.0` only when Workouts also consumes cleanly)
   - `"publishConfig": { "registry": "https://npm.pkg.github.com" }`
   - `"repository": "https://github.com/Hollis-Studio/hollis-shared"`
5. Verify `main`, `types`, and every `exports` target point at compiled
   `dist` (re-confirm Phase C still holds after the move).
6. Tag `v0.1.0-alpha.1` in the sibling repo.

**Phase H — Apps consume the sibling repo (no GitHub Packages yet).**

> **Correction 2026-05-17 (during Workouts EAS unblock):** The
> `git+...#tag&path=packages/<name>` syntax shown below is **not supported
> by npm** — npm has no native subdirectory selection for git URLs and
> treats `&path=...` as part of the ref. The original plan as written
> cannot be followed verbatim. See "Actual Phase H (Workouts, 2026-05-17)"
> below for the path Workouts took as an interim, plus the implications
> for Health when it ports off `shared/`.

_(Original plan, kept for context — do not copy the snippet verbatim:)_
Install via git-tag references in `package.json`, e.g. something like
`git+ssh://...#tag` (with subdir selection that was never validated).
Iterate as a 2-repo cycle for fixes: change in `hollis-shared` → bump
alpha tag → bump in consumer → `npm install`. **Local `file:` resolution
into a relative `../hollis-shared` path is permitted only as a dev-loop
shortcut, never committed.** Committed references must be reproducible
(git-tag pinned for an external clone, or vendored-into-consumer for an
in-repo copy).

**Actual Phase H (Workouts, 2026-05-17).** Workouts is on a vendored
interim: `Hollis-Workouts/vendor/@hollis-studio/{contracts,design-tokens,utils}`
holds a copy of each package's `dist/` + `package.json`, and
`package.json` deps use `file:./vendor/@hollis-studio/<name>`. Pros: zero new
infra, EAS-friendly because everything is inside the project upload, no
auth, no third-party registry. Cons: bumping `@hollis-studio/*` is a recopy +
commit instead of an `npm update`; structural drift from the suite plan.
`scripts/checks/check-shared-consumption.js` (`SC-1`) was updated to
expect the in-repo `file:./vendor/...` paths. Tag
`utils-v0.1.0-alpha.3` was pushed to `hollis-shared` so the next
attempt (Phase I) has a usable utils tag with `dist/` committed.
Triggered by: EAS iOS bundling `ENOENT` on `/Users/expo/workingdir/hollis-shared`
because Metro's `watchFolders` and the `@hollis-studio/*` symlinks both pointed
out of the project tree.

**Phase I′ — Shared accepts cross-suite contributions (inserted 2026-05-12 PM).**
Before `1.0.0` is cut, the sibling repo absorbs Workouts' richer domain
content that the 2026-05-12 Workouts adoption audits surfaced as drift.
Without this phase, "Workouts adopts" silently destroys production data
(muscle groups, equipment categories, workout-session log shape, Result\<T\>
pattern, Clay palette tokens, spacing scale). Each disputed concept gets a
**case-by-case ruling** recorded in
[`../research/2026-05-12-suite-adoption/05-reconciliation-decisions.md`](../research/2026-05-12-suite-adoption/05-reconciliation-decisions.md)
— no wholesale "Workouts wins" or "Health wins" defaults. Phase I′ output is
a `v0.2.0-alpha.N` (or higher pre-release) tag in `hollis-shared/` that both
apps can consume.

Phase I′ work breaks into three concern lanes that run in parallel after
Phase H lands:

1. **Domain content lane:** for each contested concept (MuscleGroup,
   EquipmentType, ExerciseCategory, WorkoutSession naming, passwordSchema,
   the 9 schema-drift entries from
   `04-schema-parity-audit.md`), land a per-concept decision and update
   `hollis-shared/packages/contracts/` accordingly. Includes promoting
   Workouts' progression-baseline + metric-basket schemas.
2. **Cross-cutting infrastructure lane:** promote Workouts' `Result<T>` +
   `ok()` + `err()` + cross-app `AppErrorCode` subset into
   `@hollis-studio/contracts/errors`. Field-for-field identical to Workouts so
   consumer migration is a one-line import change.
3. **Design lane:** add Clay palette preset, `spacingClay`, `chartPaletteClay`,
   RIR scale, heatmap opacity, and Workouts-specific font sizes to
   `@hollis-studio/design-tokens`. Spacing-scale collision (`md/lg/xl/xxl` shifted)
   resolved by namespacing (`spacingBlue` / `spacingClay`) rather than
   re-numbering either side.

**Phase I — Cut `1.0.0` and publish to GitHub Packages (deferred).** Only
once Workouts is also consuming cleanly (Step 2 + Step 3 below land green
**against the Phase I′ output**, not the Phase G/H baseline). At that point
bump pre-release → 1.0.0, push to GitHub Packages, and flip both
Health and Workouts to registry consumption. This is the boring final
cutover, not the artifact of cleanup.

**Health-side import rewrites that happen across Phases B + E (not Phase H):**

- `@contracts` → `@hollis-studio/contracts`
- relative `shared/utils/*` → `@hollis-studio/utils`
- relative `shared/contracts/*` → `@hollis-studio/contracts`
- any `src/contracts/*` / `web-admin/contracts/*` / `server/src/contracts/*`
  shim → direct `@hollis-studio/contracts` import or a deliberate new public export
- `file:../shared/*` deps → removed (Health stops resolving into its own
  workspace once Phase H lands; pre-Phase H, these become workspace refs
  inside the sibling repo)
- TS/Babel/Metro/Jest/Next config aliases pointing at local source →
  removed

**GitHub Packages `.npmrc` setup (deferred to Phase I):**

```
@hollis:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Not added until Phase I cutover.

**Success criteria (per phase):**

- After Phase A: triage doc exists; WIP snapshot branch pushed.
- After Phase B: no `*/contracts/*` shim directory exists outside `shared/`.
- After Phase C: `node -e "import('@hollis-studio/contracts').then(...)"` resolves
  successfully against the in-repo workspace.
- After Phase D: all five gates produce a deterministic violation count
  (red is fine; the point is they see everything they should).
- After Phase E: all five gates green.
- After Phase F: `typecheck`, `lint`, `check:suite:sanity`, and full
  `preflight` all green.
- After Phase G: `hollis-shared` repo exists at `~/Documents/SRC/Hollis/hollis-shared/`,
  history preserved via `git filter-repo`, `v0.1.0-alpha.1` tagged, no
  consumer code yet.
- Phase H/I status superseded: `hollis-shared` repo exists and publishes to GitHub Packages under `Hollis-Studio` org. <!-- UNVERIFIED: whether Health and Workouts are both actively consuming from GitHub Packages by semver — cannot confirm consumer-side lockfiles from this repo --> Identity consuming `@hollis-studio/contracts` is per the plan. Workouts Server still needs package-name normalization and registry consumption.
- After Phase I′: all 9 schema-drift decisions in
  `05-reconciliation-decisions.md` are rulings (no "needs ruling" rows).
  `hollis-shared` tagged `v0.2.0-alpha.N` includes Workouts' contributions per
  decision. Health re-consumes the new tag with `typecheck`, `lint`, `check:suite:sanity`,
  and preflight green. Workouts can now `npm install` the new tag against its
  current types without runtime data corruption.
- Stable `1.0.0` remains future work; the current package line is alpha semver
  through GitHub Packages.

**Convention-alignment guidance (applies during Step 2 onward, not Phase I′ itself):**
Where Workouts and Health diverge on **conventions** rather than **domain
content** — file naming, import order, doc style, error-message format, log
patterns, test layout — Workouts conforms to Health's existing style. Health
is the older and more polished codebase; aligning conventions makes the suite
feel like one product. Only **domain content** disagreements get the
case-by-case Phase I′ treatment. Convention deltas land in routine Workouts
PRs without a separate decision register.

---

### Step 2 — Workouts adopts `@hollis-studio/design-tokens`

**Why first:** lowest-risk migration. Pure visual layer. If publishing/consuming pipeline is broken, we find out before touching types.

**Source:** `Hollis-Workouts/src/theme/tokens.ts`, `Hollis-Workouts/src/theme/unistyles.ts`

**Target:** `@hollis-studio/design-tokens` provides Clay light/dark + Blue light/dark palettes. Workouts becomes a consumer.

**Actions:**

1. Diff `Hollis-Workouts/src/theme/tokens.ts` against `hollis-shared/packages/design-tokens/tokens/`. Identify Clay-specific tokens missing in shared.
2. PR to `hollis-shared`: add Clay palette to the tokens package. This landed in
   the alpha line; current package is `@hollis-studio/design-tokens@0.2.0-alpha.2`.
   Do not reference `1.1.0` unless a stable release plan exists.
3. In Workouts, replace `src/theme/tokens.ts` with a thin re-export from `@hollis-studio/design-tokens`. `src/theme/unistyles.ts` continues to register themes locally but pulls token values from the package.
4. Health's web-admin and web-public pick up the Clay palette automatically on next `npm update`.

**Success criteria:**

- `npm run check:theme` in Workouts passes against shared tokens.
- Visual diff: no regression in any screen.

**Status (2026-05-12 PM): DONE in Workouts `v1.6.7 adopt @hollis-studio/design-tokens (clay palette, spacingClay, workouts tokens)`.** Adopted via Clay `NativeTheme` adapter feeding Unistyles 2.x; mechanical Workouts-side renames `extraBold` → `heavy` (C.3) and shadows to `Platform.select` shape (C.4). See [`../research/2026-05-12-suite-adoption/06-steps-2-3-adoption-report.md`](../research/2026-05-12-suite-adoption/06-steps-2-3-adoption-report.md) for the full outcome and [`05-reconciliation-decisions.md`](../research/2026-05-12-suite-adoption/05-reconciliation-decisions.md) §C for the rulings driving it.

---

### Step 3 — Workouts adopts `@hollis-studio/contracts` primitives and errors

**Source:** `Hollis-Workouts/src/types/errors.ts`, parts of `src/types/models.ts`

**Target:** `@hollis-studio/contracts/errors`, `@hollis-studio/contracts/primitives`

**Actions:**

1. Map Workouts' `AppErrorCode` enum onto Health's existing error-code set in `@hollis-studio/contracts/errors`. Identify Workouts-specific codes that should be promoted vs. kept local.
2. Map `Result<T>`, `ok()`, `err()` — confirm shape matches `@hollis-studio/contracts/primitives`. Replace local definitions with imports.
3. Replace ID brands (UserId, SessionId, etc.) with shared primitives where they overlap with Health's user identity.
4. Update Workouts' ESLint rules: forbid local `Result`/`ok`/`err` definitions; require import from `@hollis-studio/contracts`.
5. Add `check:shared-no-local-barrels` to Workouts' preflight from day one of adopting `@hollis-studio/contracts`. **No directory under `src/` may re-export shared contract types under a different alias.** Lesson from Health's 2026-05-12 cleanup attempt: a local `src/contracts/` shim layer silently defeats the boundary gates while reshaping the public surface per-consumer, then cascades into ~18k lint errors when the shimmed shapes drift. Forbid the pattern by gate before any consumer rewrite begins.
6. When a Workouts consumer needs a shape not currently exported by `@hollis-studio/contracts`, the resolution is one of:
   (a) use an existing public entrypoint, or
   (b) PR the package to expose a deliberate new entrypoint and document it in `SCHEMA_INDEX.md`.
   Never a third option, especially not an intermediate file in `src/`.

**Workouts cleanup:** `src/types/errors.ts` shrinks to Workouts-only error codes; everything else gets removed. No re-export barrel left behind.

**Success criteria:**

- `npm run typecheck` clean.
- `npm run lint` clean.
- `npm run check:shared-no-local-barrels` passes (zero violations).
- No local re-declarations of shared primitives.
- A Node ESM smoke import of `@hollis-studio/contracts` succeeds from a Workouts dev script.

**Status (2026-05-12 PM): DONE in Workouts `v1.6.8 rename ExerciseCategory to TrackingMode, adopt @hollis-studio/contracts password schema`.** Result\<T\>, ok(), err(), AppError, AppErrorCode, APP_ERROR_CODES are now sourced from `@hollis-studio/contracts/errors` via a single-file thin re-export at `src/types/errors.ts` (kept intentionally so all 102+ downstream imports stay on `@/types/errors` with zero churn). `loadWeightKgSchema` adopted in 5 schema files (`baseline`, `metrics`, `program`, `session`, `slidePayloads`). Workouts-side renames: `ExerciseCategory` → `TrackingMode` (A.3) and `WorkoutSession` → `TrainingSessionLog` with one-release deprecated alias (A.4). Stricter `passwordSchema` adopted in `src/schemas/auth.ts` and `app/auth/signup.tsx` (A.6). See `06-steps-2-3-adoption-report.md` for the full outcome.

**Open follow-ups from Step 3 (not blocking; tracked here for visibility):**

- **Cloud Functions `Result<T>` duplicate (decision register B.3).** `functions/src/utils/result.ts` still uses Workouts' flat pre-promotion shape. Re-evaluation trigger from B.3 is now satisfied (Workouts mobile has finished Step 3). Candidate for `v1.6.10` cleanup: migrate Cloud Functions to import from `@hollis-studio/contracts/errors` and delete the local duplicate.
- **Deprecated `WorkoutSession` type alias.** Kept in `src/types/models.ts` as a one-release courtesy. Remove in a future release once any consumer code that still references the old name has been migrated to `TrainingSessionLog`.
- **`src/types/errors.ts` re-export shim.** Single-file barrel pointing at `@hollis-studio/contracts/errors`. Acceptable per the canonical plan's prompt language; treat as a transition aid. Optional later cleanup: inline all 102+ imports to `@hollis-studio/contracts/errors` directly and delete the shim. Not urgent; not required for any downstream step.

---

### Step 4 — Promote overlapping domain types upstream

**Source:** parts of `Hollis-Workouts/src/types/models.ts`, `src/schemas/*`

**Target:** new `@hollis-studio/contracts/domain/identity`, `@hollis-studio/contracts/domain/audit-log`, `@hollis-studio/contracts/domain/ai-surface`

**Promotion criteria (must satisfy all):**

- Type is used in 2+ suite apps OR has clear future cross-app use.
- Type is platform-agnostic (no React, no Firestore-specific shapes).
- Owner has thought through versioning impact.

**Likely candidates from Workouts:**

- User profile basics (auth user, display name, photo, preferences common across apps).
- Settings shape and theme preference.
- Audit log shape (when Workouts gets its server, audit logs must match Health's shape).
- AI surface naming (already standardized in Workouts v1.6.2; align with Health's AI contracts).

**Stays in Workouts:**

- All workout-domain types (Set, Exercise, GymProfile, Program, etc.).
- AI threshold configs (`src/types/aiThresholds.ts`).
- Periodization-specific types.

**Status (2026-05-12 PM): pending. The Phase I′ promotion work already landed the Workouts-canonical shapes in `hollis-shared` `v0.2.0-alpha.1` (MuscleGroup 23-value set, EquipmentType superset, Result\<T\>, AppErrorCode merged superset, Clay palette, spacing-clay, progression schemas including `SessionExerciseSchema.refine()` invariant). What remains is Workouts-side _consumption_ of the promoted enums:**

- **A.1 — Adopt `MuscleGroup` from `@hollis-studio/contracts`** in `src/types/constants.ts`. The shared enum is a 1:1 superset of Workouts' current values; this is a one-line `export { MuscleGroup } from '@hollis-studio/contracts/domain/muscles'` plus deleting the local definition. Low risk; should land in `v1.6.10` or `v1.6.11`.
- **A.2 — Adopt `EquipmentType` from `@hollis-studio/contracts`** with **data migration prerequisite**. Shared adopted the merged superset with `cable` as canonical (replacing `cable_machine`). Workouts cannot adopt the shared enum until existing Firestore documents containing `cable_machine` are migrated to `cable`. Action: write a Firestore migration script (Cloud Functions one-off task), run against production data, verify zero `cable_machine` values remain, _then_ adopt the shared enum. This is Step 4's biggest gating item.
- **User profile basics, audit log shape, AI surface naming alignment** — original Step 4 candidates per the plan. Lower priority than the enum adoptions; revisit when `workouts-server` (Step 5) starts.

**Recommended Step 4 sequencing:**

1. **`v1.6.10`** — Cloud Functions Result\<T\> cleanup (decision register B.3) + adopt `MuscleGroup` from shared (A.1).
2. **`v1.6.11`** — Write + run Firestore migration for `cable_machine` → `cable`. Land the migration script and a one-off operations runbook in `docs/runbooks/`.
3. **`v1.6.12`** — Adopt `EquipmentType` from shared (A.2). Remove local enum.
4. **Later** — User profile + audit log + AI surface alignment as part of Step 5 prep.

---

### Step 5 — Build `workouts-server`

**Target stack:** Express + Prisma + Postgres + Docker, mirroring `hollis-health-app/server/`.

**Layout:**

```
Hollis-Workouts/
  workouts-server/
    src/
      routes/
      services/
      middleware/      (rateLimiter, audit, auth-client)
      validation/      (Zod from @hollis-studio/contracts)
      lib/
      jobs/
      events/
    prisma/
      schema.prisma
      migrations/
    package.json
    Dockerfile
  infrastructure/
    workouts-server.tf  (ECS Fargate, RDS Postgres, ALB target)
```

**Prisma schema:** model the full workout domain — exercises, gyms, sessions, sets, programs, AI suggestions, plateau context, audit logs, sync state. Mirror Firestore collections from `src/state/syncConfig.ts` but normalize for relational integrity.

**Routes:** every route validated by Zod schemas from `@hollis-studio/contracts/api/workouts` (new namespace to be added to shared during this step). Audit-log middleware identical in shape to Health's `phiAuditLog` even though workout data isn't PHI — keeps log shipping/analysis tooling uniform.

**Auth:** all routes behind `authClient.authenticateToken` middleware that validates JWTs against the Hollis Identity Service (Step 6). Until Step 6 lands, use a local JWT verifier with the same key — direct swap later.

**Deployment:** Terraform module mirroring Health's `server/` ECS setup. Own RDS Postgres instance (small for now). CloudFront not needed (mobile-only consumer).

---

### Step 6 — Extract Hollis Identity Service

**Detailed backlog:** see
[`shared-auth-migration-checklist.md`](./shared-auth-migration-checklist.md)
for the dependency-ordered checklist covering shared identity contracts,
`@hollis-studio/auth-client`, Health extraction, Workouts backend auth, mobile cutover,
UID mapping, and production verification gates.

**Source:** `hollis-health-app/server/src/services/authService.ts`, `server/src/middleware/auth.ts`, `server/src/middleware/mfa.ts`, `server/src/services/tokenDenylistService.ts`, related Prisma User/Session/MfaSetup models.

**Target:** standalone sibling repo `hollis-identity/`. It exists locally and now contains the extracted Health auth core adapted to Identity's suite boundary; it is not deployed yet.

**Layout:**

```
hollis-identity/
  src/
    routes/
      auth.ts          (POST /login, /register, /logout, /refresh, /verify, /me, /oauth,
                        /forgot-password, /reset-password, /change-password, /biometric-token,
                        /v1/auth/verify, /v1/auth/verify-email/send, /v1/auth/verify-email/confirm)
      mfa.ts
    services/
    lib/
  prisma/
    schema.prisma      (User, RefreshToken, MfaCredential, MfaEvent, StepUpToken,
                        PendingMfaSession, PasswordResetToken, OAuthAccount,
                        EmailVerificationToken, AuthAuditLog; AuthAuditEventType enum)
    migrations/
      20260519000000_initial/migration.sql
  package.json
  Dockerfile
```
<!-- Route layout updated 2026-05-19 to match locally-implemented state per suite-strategy.md -->

**Database:** own RDS Postgres instance. Source of truth for user identity across the suite. Each app's local DB has a `userId` foreign-key reference; user profile lives in identity service.

**JWT claims:** `userId`, `role`, `jti`, `aud` (which apps the token is valid for — single-app or suite-wide), `exp`, plus app-specific data under namespaced `claims.*` only. Identity currently dual-emits `claims.hollisHealth.{role, organizationId}` for Health compatibility during cutover.

**Client libraries:** `@hollis-studio/auth-client` exports `createAuthClient`, `requireAuth`, local JWT verification, audience validation, and a remote root `POST /verify` path. `getMe`, revocation/session helpers, and JWKS fetch/cache remain to finish or explicitly remove from the plan.

**Health migration:** Health's mobile + web-admin + web-public switch from calling local `/api/auth/*` to calling `https://identity.hollis.health/*`. Health's `server/` keeps a thin auth-client middleware that delegates to the identity service. Health's User table stays — identity service owns auth state, Health server owns clinical-relationship state, linked by `userId`.

**Workouts integration:** mobile needs a separate mobile Identity wrapper/client.
Workouts Server currently wraps auth-client in `src/middleware/auth.ts`; normalize
the dependency from `@hollis/auth-client` to `@hollis-studio/auth-client`.

**Cutover plan for existing Health users:**

- All current bcrypt hashes migrate as-is into the identity service's User table (same Prisma schema). No password reset required.
- JWT signing key migrates with them. Active tokens remain valid through cutover.
- DNS: `identity.hollis.health` points to the new ECS service.

---

### Step 7 — Firestore → Postgres ETL

**Source:** Workouts' Firestore collections defined in `src/state/syncConfig.ts`.

**Target:** workouts-server Postgres schema from Step 5.

**Actions:**

1. Write an ETL script (`workouts-server/scripts/migrate-from-firestore.ts`) that:
   - Reads every document from each synced collection via Firebase Admin SDK.
   - Transforms into Prisma create operations honoring referential integrity.
   - Maps Firebase UIDs to Hollis Identity userIds (Step 6 creates the mapping table).
   - Writes atomically per-user (transaction per user; partial-failure-safe).
2. Dry-run against a Firestore clone. Compare row counts and spot-check 10 random user sessions end-to-end.
3. Real cutover: read-only Firestore for 1 hour, run ETL, flip mobile client to new server, retire Firestore writes.

**Success criteria:**

- All user sessions, sets, gyms, programs, AI suggestions, audit logs migrated.
- Random-sample integrity check passes.

---

### Step 8 — Workouts mobile client cutover

**Source files to modify:**

- `src/services/firebase.ts` — delete.
- `src/services/firestoreSync.ts` — replace with REST client.
- `src/state/*` — Legend State observables keep their shape; persistence layer swaps from Firestore to a REST-backed client with local cache.
- `src/services/auth.ts` — replace Firebase Auth with Hollis Identity SDK.
- `functions/` — delete (Cloud Functions sunset).
- `firestore.rules`, `firestore.indexes.json`, `firebase.json` — delete.
- `google-services.json`, `GoogleService-Info.plist` — delete.

**New client:**

- `src/services/api.ts` — typed REST client generated from `@hollis-studio/contracts/api/workouts` (zod-to-fetch wrapper).
- `src/services/identity.ts` — Hollis Identity SDK wrapper.
- Offline behavior: Legend State + a local SQLite cache (via `expo-sqlite`). Writes queue locally and flush when online — same UX guarantees Firestore provided, with explicit sync state.

**Architecture rule update:** `src/state/syncConfig.ts` becomes route definitions instead of collection paths. SO-1 ("State owns synced writes") still applies — only `src/state/` writes through `api.ts`.

**Success criteria:**

- All cruise-test golden paths still work offline (Bugs §1 verification).
- No Firebase imports anywhere except in the ETL script (Step 7, run-once).

---

### Step 9 — Sunset Firebase

**Actions:**

1. Decommission Firebase project (after 2-week soak with new backend in prod).
2. Remove `firebase`, `@react-native-firebase/*`, `firebase-functions`, `@google/genai` (if only used by functions) from `package.json`.
3. Strip iOS Firebase pods and Android Firebase Gradle config.
4. Update `CLAUDE.md` and `AGENTS.md` — remove Firebase-specific rules (SO-1 stays but rewords from "Firestore" to "synced API"). AB-8 (no auth-race Firestore reads) becomes "no auth-race API reads."
5. Update `docs/` — replace Firebase references with the new stack.

---

### Step 10 — Cross-suite features go live

**First feature (validates the architecture):** Health Admin gets a read-only workouts panel on the client detail page. Trainer or PCP sees the client's last 4 weeks of lifting sessions, weekly volume, and any AI plateau coaching the client received.

**Implementation:**

- Web-admin calls `https://api.workouts.hollis.health/clients/:userId/sessions?since=...` with a service-token-scoped JWT issued by Hollis Identity for `aud: ["workouts:read"]`.
- workouts-server validates the JWT, checks RBAC (only CLINICIAN/TRAINER/ADMIN roles), audit-logs the access, returns the data.
- Web-admin renders. No PHI is involved — workout data isn't PHI on its own — but the access is logged with the same shape PHI access would be, so the audit posture is consistent across the suite.

**This step is the proof that the suite architecture works.**

---

## 5. Risk register

| Risk                                                                       | Mitigation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hollis-shared` boundary remains fuzzy after extraction                    | Health-side `check:shared-extraction` must go to zero before cutover; equivalent package/consumer gates move into `hollis-shared` CI afterward                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Boundary gates report green while consumers are still coupled              | **Realized 2026-05-12.** Local "compatibility barrel" directories (`src/contracts/`, `web-admin/contracts/`, `server/src/contracts/`) re-export shared types under a per-consumer alias, defeating the named gates without resolving coupling. Mitigation: `check:shared-no-local-barrels` flags any `**/contracts/**.ts` outside the package that re-exports `@hollis-studio/*` or `shared/*`. Plus a Node ESM smoke import in CI so a passing gate suite proves the package is actually consumable, not just statically clean. Never declare a category done from gates alone — typecheck + lint + sanity + smoke import must also be green. |
| Package emits invalid Node ESM (extensionless directory exports in `dist`) | **Realized 2026-05-12.** `tsc` output re-exports directory paths without `/index.js` or extension, so `import { ... } from "@hollis-studio/contracts"` fails from a plain Node process even though the gates pass. Mitigation: emit fully-resolved file paths in re-exports (or explicit `exports` entries for every subpath) and verify with `check:shared-node-esm-smoke` running a real Node ESM import in CI.                                                                                                                                                                                                                              |
| `hollis-shared` releases break consumers silently                          | Semver discipline + automated typecheck of every consumer against pre-release versions in CI. During the alpha-tag period (Phase H), every consumer bumps deliberately and runs full preflight; no auto-update.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Two-repo iteration friction during the alpha-tag period                    | Originally planned: git-tag refs with `&path=` subdir selection. That npm syntax doesn't exist — see Phase H correction (2026-05-17). Actual interim for Workouts: vendor `packages/<name>/{dist,package.json}` into `Hollis-Workouts/vendor/@hollis-studio/<name>` and reference via `file:./vendor/@hollis-studio/<name>`. Use uncommitted local `file:../hollis-shared` overrides only for dev-loop iteration; the vendored copy is the committed reference. Phase I cutover (real registry) supersedes both.                                                                                                                               |
| Health identity service downtime takes down all apps                       | Planned mitigation: deploy Identity on multi-AZ ECS with RDS Multi-AZ. Until AWS deployment is complete, this is not an active mitigation. Tokens are stateless JWTs — short outages only affect login, not active sessions                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Workouts Firestore → Postgres ETL drops data                               | Read-only window + atomic per-user transactions + sample integrity check. Keep Firestore data for 90 days after cutover for restore-from-source                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Offline behavior regresses after Firebase removal                          | Build the local SQLite cache + sync queue _before_ cutover. Verify against cruise-test golden paths                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Cross-app JWT validation adds latency to every API call                    | Cache verification results in workouts-server for the token's `exp` window (still respects denylist via short-TTL denylist check)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Health team can't ship features during shared-repo extraction              | Step 1 is a single PR with a same-day cutover. No long-running fork                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

---

## 6. What doesn't change

Listed for clarity:

- Workouts' product features and golden paths.
- Workouts' offline-first stance — only the persistence mechanism changes.
- Workouts' Legend State observables and 8-layer architecture inside `src/`.
- Health's mobile/web-admin/web-public UX.
- Stripe billing, SES email, Vertex AI integration in Health.

---

## 7. Cross-doc updates that ship with this plan

- [`Hollis-Workouts/docs/archive/plans/2026-05-11-mass-market-todo.md`](https://github.com/hollis-studio/Hollis-Workouts/blob/main/docs/archive/plans/2026-05-11-mass-market-todo.md) — Suite Infrastructure section (§8) rewritten to point at this plan and reflect the resolved decisions.
- [`hollis-health-app/docs/audits/POST_LAUNCH_BACKLOG.md`](https://github.com/hollis-studio/hollis-health-app/blob/main/docs/audits/POST_LAUNCH_BACKLOG.md) — entries for shared-repo extraction, identity service extraction, entitlement service, and the current zero-exception shared-boundary cleanup baseline.
- [`./suite-strategy.md`](./suite-strategy.md) — companion doc carrying the suite end-state architecture and the zero-exception shared-boundary standard.
- `hollis-health-app/CLAUDE.md` — note that `shared/` will be extracted to `hollis-shared` repo; existing references stay valid until Step 1 cuts over.
