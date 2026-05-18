# Hollis Suite Strategy — end-state architecture

> **Status:** Approved technical direction. Pairs with the
> [suite vision](../vision/2026-05-18-suite-vision.md) (product/strategy)
> and the [suite infrastructure migration plan](./suite-infrastructure-migration.md)
> (sequencing). This doc carries the end-state architecture so every suite
> agent has the picture when planning cross-app changes.
> **Captured:** 2026-05-11. **Relocated to hollis-shared:** 2026-05-18.
>
> **Prioritization note (2026-05-18 strategic refinement):** the end-state
> architecture below — six apps, shared identity, typed contracts, separate
> per-app backends, cross-app reads — is unchanged. What changed is the
> *order* and *commitment*: the wedge is **Strength + external-data
> integration + Compass intelligence service + B2B trainer/clinician fleet
> sales**, not "six consumer apps producing one health brain." Phase 4
> consumer apps (Nutrition / Recovery / Move / Mind) are now explicitly
> gated on wedge revenue. The canonical priority order lives in the vision
> doc's [Build Order](../vision/2026-05-18-suite-vision.md#build-order) and
> [Suite leverage](../vision/2026-05-18-suite-vision.md#suite-leverage--making-the-suite-useful-with-fewer-apps)
> sections — if the prioritization here ever conflicts with the vision,
> the vision wins.

---

## 1. What the suite is

Hollis Health LLC operates a suite of 6 planned apps under one brand,
one identity, one design language, and one set of shared contracts.

| App | Status | Stack |
|---|---|---|
| Hollis Health (mobile + admin + public) | Shipped at `hollis.health` | Express + Prisma + Postgres + RDS, ECS Fargate, Next.js 16, RN/Expo |
| Hollis Workouts | v1.6.3 on Firebase; migrating to suite stack | RN/Expo + (target: Express + Prisma + Postgres + ECS Fargate) |
| 4 additional apps | Planned | Will scaffold on suite stack from day one |

Each app has its own backend, own database, own deployment, own release
cadence. They share: contracts, design tokens, utilities, and identity.
The business reason is direct: Hollis Health is no longer "the app"; it is
app 1 of a suite. Shared code must behave like company infrastructure, not
like a convenient folder inside Health.

---

## 2. Shared infrastructure (target state)

### `hollis-shared` repo (separate from any app repo)

Published to GitHub Packages, consumed by every app via pinned semver:

- **`@hollis-studio/contracts`** — types, Zod schemas, error codes, primitives, API contracts. Pure TypeScript + Zod, no platform code.
- **`@hollis-studio/design-tokens`** — palettes (Blue light/dark, Clay light/dark), typography, spacing, radii. Consumed by all visual surfaces.
- **`@hollis-studio/utils`** — pure utilities (date, currency, unit conversion, CSRF). No I/O.

### `hollis-identity` service (separate from any app repo)

- Standalone Express + Prisma + Postgres service on ECS Fargate at `identity.hollis.health`.
- Extracted from Health's current `server/src/services/authService.ts` + `middleware/auth.ts` + `middleware/mfa.ts` + `services/tokenDenylistService.ts`.
- Owns: user identity, password hashes, MFA setup, token denylist, identity audit log.
- Issues JWTs valid across the suite. Each token carries `aud` claim listing which apps it's valid for.
- Every app server has a thin `auth-client` middleware (from `@hollis-studio/auth-client`, published in hollis-shared) that delegates `verifyToken` / `getMe` / `revokeToken` to this service.

**Current state (2026-05-18)**: scaffolded at `~/Documents/SRC/hollis-identity/` to roughly 70%. Express + Prisma + Zod, routes wired (`/login`, `/register`, `/logout`, `/refresh`, `/verify`, `/oauth`, `/forgot-password`, `/reset-password`, `/change-password`, `/biometric-token`, MFA router), `cookieConfig.ts` + `tokenDenylistService.ts` + `passwordResetService.ts` + `pendingMfaSessionService.ts` + `mfaService.ts` already lifted from Health, Prisma schema with 8 auth models, ECS task def placeholder, `@hollis-studio/contracts` consumed via `file:` ref. **Pushed to GitHub `Hollis-Studio/hollis-identity` 2026-05-18.** Never deployed to AWS.

**Health-side D4 hard blocker CLOSED v3.7.67**: `server/src/services/authService.ts::generateAccessTokenWithJti` now emits `aud: ["hollis-health"]` and dual-emits `claims.hollisHealth.{role, organizationId}` alongside legacy top-level fields. All 4 Hollis-token `jwt.verify` sites in Health enforce `audience: AUDIENCES[0]`. Tokens are now `AccessTokenClaimsSchema.safeParse()`-compatible, unblocking any future `@hollis-studio/auth-client` consumption. 75 new tests cover the change.

**Outstanding for identity prod cutover** (Randy 8-phase plan, ~48-67 engineering hours, ~2-3 wks calendar, gated on 5 ODs for Isaac):

- **Phase 0 — Test scaffolding**: Vitest setup, smoke tests for `authService`, `tokenDenylistService`, routes. Gate for everything else.
- **Phase 1 — P1 runtime wiring**: install + mount `cookie-parser` and `cors`; mount `errorHandler` and rate limiters in `src/index.ts`; call `validateEnvOnStartup()` at startup. Service does not run locally without this.
- **Phase 1b — D2 cookie removal**: 7 call sites in `routes/auth.ts` + `routes/mfa.ts` call `setAuthCookies`/`clearAuthCookies`; delete those and `lib/cookieConfig.ts`. Parallelizable with Phase 1.
- **Phase 2 — D4 claims namespace**: `HollisHealthClaimsSchema` sub-schema in `@hollis-studio/contracts`; `generateAccessTokenWithJti` in identity grows `appClaims` parameter; Health's `req.user` population reads from `claims.hollisHealth.*` with top-level fallback (grace window dual-read).
- **Phase 3 — `@hollis-studio/auth-client` gaps**: configurable `setAuthCookies(res, tokens, posture)` / `clearAuthCookies(res, posture)` helpers; cookie-or-Bearer token extractor; JWKS-fetching path (via `jose` 6.2.3); wire actual HTTP call in `verifyTokenRemote`.
- **Phase 4 — RS256/JWKS in identity**: `lib/keyStore.ts` with 2-key rotation (current + previous); `jose` `SignJWT` with `RS256` + `kid`; `/.well-known/jwks.json` returns real key set; HS256 verification path stays alive during grace window.
- **Phase 5 — External denylist**: `ioredis` + `RedisDenylistStore` (preferred) or shared-Postgres backing.
- **Phase 6 — AWS infra**: ECR repo + ECS cluster + RDS `db.t4g.small` (separate DB for HIPAA blast-radius isolation) + ALB + Route53 record for `identity.hollis.health` + ACM cert + Secrets Manager + KMS. ~$140-145/mo us-east-1.
- **Phase 7 — Health-side cutover**: `USE_IDENTITY_SERVICE` env flag; `server/src/middleware/authIdentity.ts` thin auth-client wrapper does post-verify domain enrichment from Health's Prisma; logout orchestrates `identityClient.logout → pushService.deleteDevicesForUser → clearAuthCookies` (D3); 7-day soak.
- **Phase 8 — Decommission**: remove grace-window dual-reads; remove Health's local auth routes; `middleware/auth.ts` shrinks 214 → ~30 lines.

**5 open product decisions tracked in `docs/CTO_AGENT.md` Item 37 (OD-1..OD-5)**: `onboardingCompleted` ownership, password-reset email mechanism (SES vs webhook), denylist backing (Redis vs Postgres), RS256 rotation mode (Lambda vs manual ops), `UserRole` enum location (shared in `@hollis-studio/contracts` vs duplicated per service).

---

## 3. Decisions and rationale

### Why extract identity instead of using Cognito

Health's current auth is already:
- HIPAA-aware (tokens carry no PHI; PHI audit log integration is built-in).
- Dual-mode: httpOnly cookie for web, Authorization Bearer for mobile.
- Equipped with MFA, token denylist, bcrypt password hashing with high cost factor.
- Role-aware: CLIENT, CLINICIAN, ADMIN, TRAINER (extensible to suite-wide roles).
- Tested in production with paying clients.

Cognito would add zero capability and force one of:
- A forced password reset for every existing client (poor UX).
- A custom Cognito migration Lambda that validates against bcrypt on first sign-in and rewrites the hash (multi-week build, replaces tested code with new code).

**Cognito stays on the table only if/when federated identity (Sign in with Google/Apple) becomes a product requirement.** At that point, we put Cognito *in front of* the Hollis identity service as an OIDC federation source, not as a replacement.

### Identity Service architecture decisions (resolved 2026-05-17)

Five decisions resolved by Isaac after Tier-2 research wave; these set the contract identity exposes to every suite consumer.

- **Cross-DB coupling at login — HYBRID**. Identity issues thin claims only: `{ userId, role, jti, aud }`. Consumer apps enrich domain state post-verify from their own DBs (Health → `organizationId`, `onboardingCompleted`, org-status; Workouts → its own membership/tier state). Identity never opens cross-service DB connections. Tradeoff: one extra per-request lookup in each consumer, matching today's `requireActiveUser` pattern.
- **Cookie strategy — FEDERATED with per-app posture**. Identity returns tokens in JSON body only — never sets cookies. Each consumer app sets its OWN cookies with its OWN security posture: Health uses httpOnly Secure SameSite=Lax (HIPAA-strict). Mass-market suite apps (Workouts and beyond) may choose different postures: JS-readable tokens for analytics, longer TTLs, refresh-on-resume UX. `@hollis-studio/auth-client` exposes `setAuthCookies()` and `clearAuthCookies()` as configurable helpers — not opinionated defaults. Identity stays cookie-agnostic. **No `.hollis.health` parent-domain cookies** — the centralized-cookie path was rejected to avoid forcing one cookie posture across HIPAA and non-HIPAA apps and to keep CORS/SameSite footprint per-app rather than suite-wide.
- **Logout side effects — CONSUMER THIN-CLIENT WRAPPER**. Health's `/auth/logout` handler calls identity `/logout`, then performs Health-domain cleanup (`pushService.deleteDevicesForUser`) before clearing cookies. Same pattern for Workouts if it has logout-time cleanup. Identity stays application-agnostic. No webhook/event-bus infrastructure required.
- **JWT claims migration in Health — DUAL-EMIT GRACE WINDOW**. `generateAccessTokenWithJti` adds `aud: ["hollis-health"]` and dual-emits `claims.hollisHealth.{role, organizationId}` alongside the legacy top-level fields for one release cycle. Middleware reads both locations during grace window; legacy reads removed in follow-up commit. 15-min access TTL makes the cutover invisible to users. Key-rotation alternative was rejected (forced re-login at cutover).
- **Suite design implication**: every new suite app implements its own consumer-side auth wrapper (`@hollis-studio/auth-client` middleware + cookie helpers + post-verify domain enrichment). The boilerplate is small (~30-line middleware + ~20-line cookie config). Workouts will mirror Health's pattern with Workouts-specific domain enrichment and a mass-market cookie posture.

Tracked under `docs/CTO_AGENT.md` Item 37 and `docs/audits/POST_LAUNCH_BACKLOG.md` `[SUITE] Extract identity` for implementation sequencing.

### Why a separate `hollis-shared` repo and not workspaces inside Health

- Health stops being a privileged consumer. It becomes one app of six, all on equal footing.
- "Ground truth" becomes a property of *discipline*, not *hosting*. Health earns ground-truth status by being the most disciplined consumer with the strongest contribution norms — not by virtue of holding the package.
- A separate repo makes versioning explicit: every consumer pins a version, upgrades deliberately, and breaking changes require a coordinated migration. Workspaces silently couple cadences.
- New suite apps scaffold from the shared package without cloning Health.

### Shared boundary standard — zero exceptions

The extraction is not a folder move. It is a boundary correction. "Shared"
means a published package API consumed through GitHub Packages, not a source
tree other apps can reach into.

Hard rules:

- Consumers import only `@hollis-studio/contracts`, `@hollis-studio/design-tokens`, and
  `@hollis-studio/utils` public exports. No `@contracts` compatibility alias.
- Consumers never import `shared/*` by relative path.
- Consumers never depend on `file:../shared/*`.
- Tooling must not alias `@hollis-studio/*` packages back to local source after
  extraction.
- Package `exports` are the public API. A deep import is valid only when the
  package explicitly exports that subpath.
- Consumers must not create local `*/contracts/*` compatibility barrels that
  re-export shared types under a different alias. Consumers import directly
  from `@hollis-studio/contracts` or the package adds a deliberate `exports` entry.
- Shared packages emit and publish `dist`; consumers do not compile TS source
  from another repo.
- `@hollis-studio/contracts` stays TypeScript + Zod only. No React, React Native,
  Expo, Next, Prisma, AWS SDK, Stripe SDK, app aliases, or I/O.
- `@hollis-studio/design-tokens` stays tokens and platform adapters, not a shared UI
  component library.
- `@hollis-studio/utils` stays pure utilities. No network, storage, database, app
  state, or platform APIs.

Current Health-side gates added 2026-05-12 and strengthened 2026-05-12 PM:

```bash
npm run check:shared-package-boundary
npm run check:shared-consumer-boundary
npm run check:shared-extraction
npm run check:shared-no-local-barrels
npm run check:shared-node-esm-smoke
```

Current baseline before cleanup:

- `check:shared-package-boundary`: 47 violations.
- `check:shared-consumer-boundary`: 552 violations.
- Main categories: `@contracts` alias usage, private contract subpaths,
  direct `shared/*` source imports, `file:../shared/*` dependencies, config
  aliases to local shared source, and source-based package manifests.

The 2026-05-12 AM cleanup attempt drove the first three gates green while
introducing a local `src/contracts/` barrel and leaving invalid Node ESM `dist`
output. That state is explicitly not done. The target is exactly zero across
all five gates plus typecheck, lint, suite sanity, preflight, and Node ESM smoke
imports. No suppression comments, carve-outs, or temporary compatibility shims
count as done for Step 1.

### Why GitHub Packages and not AWS CodeArtifact

- Auths against the same GitHub tokens the suite already uses for source.
- Zero new IAM surface to manage.
- Private repos publish private packages by default.
- Migration to CodeArtifact later is trivial if scale demands.

---

## 4. What this changes for Health repo work

**Today (before extraction):** all of Health's existing patterns continue to apply. `shared/` lives in this repo. `@hollis-studio/contracts` resolves locally.
The only exception is extraction work itself: new code should use the final
published-package shape and must not add new `@contracts`, relative `shared/*`,
or private-subpath usage.

### Revised 2026-05-12 PM — Step 1 execution sequence

The canonical Workouts plan is the source of truth. Health mirrors its revised
Step 1 sequence:

1. **Phase A — Triage and contain:** snapshot the dirty mid-extraction worktree
   on a WIP branch, then classify every dirty path into keep, unwind,
   regenerate, or unrelated before further code changes.
2. **Phase B — Unwind compatibility barrels:** delete local `*/contracts/*`
   re-export layers outside `shared/contracts/`; consumers import directly from
   `@hollis-studio/contracts` or are flagged for a deliberate public-export decision.
3. **Phase C — Fix package emit:** make compiled `dist` valid Node ESM, with
   concrete file paths and extensions for re-exports.
4. **Phase D — Harden gates:** add and run `check:shared-no-local-barrels` and
   `check:shared-node-esm-smoke` alongside the existing three boundary gates.
   The post-hardening baseline is re-measured after this point.
5. **Phase E — Re-do consumer rewrites:** drive all five gates to zero without
   local barrels or private reach-through.
6. **Phase F — Drive medial cascade to zero:** typecheck, lint,
   `check:suite:sanity`, and preflight must pass.
7. **Phase G — Extract `hollis-shared`:** create the sibling repo at
   `~/Documents/SRC/hollis-shared/` via `git filter-repo`, preserve history,
   build packages, and tag `v0.1.0-alpha.1`.
8. **Phase H — Health consumes sibling repo:** install pinned git-tag package
   refs, delete Health's `shared/`, and rerun the full bar.
9. **Phase I — Deferred:** publish `1.0.0` to GitHub Packages only after
   Workouts also consumes cleanly.

Minimum Health gate suite during Step 1:

```bash
npm run check:shared-package-boundary
npm run check:shared-consumer-boundary
npm run check:shared-extraction
npm run check:shared-no-local-barrels
npm run check:shared-node-esm-smoke
```

No local `*/contracts/*` re-export barrels are allowed. If a consumer needs a
shape that is not public, the package exports it deliberately and documents the
decision in `SCHEMA_INDEX.md`.

**After Step 1 of the migration plan (extraction):**
- `shared/` is deleted from this repo. Replaced by `npm install @hollis-studio/contracts @hollis-studio/design-tokens @hollis-studio/utils` from GitHub Packages.
- Every import already using `@hollis-studio/contracts` aliases continues to work — only the resolution target changes.
- Adding a new shared type means a PR to `hollis-shared`, releasing a new version, then upgrading Health's pinned version. **This adds review friction by design** — shared types affect every consumer.
- Deep imports are no longer implicitly acceptable. Either expose the subpath
  in package `exports` deliberately, or move the consumer to an existing public
  entrypoint. Package exports are the boundary.

**After Step 6 (identity extraction):**
- `server/src/services/authService.ts` shrinks to a thin client of the identity service.
- `server/src/middleware/auth.ts` becomes ~30 lines that verify the JWT via the identity service (Gary inventory 2026-05-17 refined the earlier ~20-line estimate; cookie extraction + claim mapping to `req.user` shape stays in Health's wrapper).
- Health's User table stays — identity service owns *authentication state*, Health server owns *clinical-relationship state*. Linked by `userId` string (no cross-service DB FK).
- `npm run check:phi-logging` and all other PHI audit checks continue to apply unchanged on Health's domain code.

**Step 6 current state (2026-05-17)**: scaffolding ~70% done in `~/Documents/SRC/hollis-identity/` (see §2 above). Lift-and-shift estimate from Gary's auth surface inventory: ~1,550 lines lift cleanly, ~200 lines need real adaptation (claims format, cookie wrapper), ~750 lines deleted from Health, ~600 lines OAuth/MFA stay in Health initially. Realistic delivery: ~30-46 engineering hours + 7-day grace-window soak. Hard prerequisite in Health: ship `aud: ["hollis-health"]` claim + dual-emit `claims.hollisHealth.{role, organizationId}` so `AccessTokenClaimsSchema.parseClaims()` in `@hollis-studio/auth-client` accepts existing tokens.

---

## 5. What this does NOT change for Health

- Architecture rules (3-layer: Screens → Features → Services).
- PHI logging rules, HIPAA posture, audit log shape.
- Stripe billing, SES email, Vertex AI integration.
- Web admin / web public deployment topology.
- Ops agent (`ops/triage-service.ts`), `DAY_1_RUNBOOK.md`, alarm wiring.
- The 8 specialized agent team and `hollis-explorer` / `hollis-verifier` / etc. workflow.

The Launch Gate stays focused on Health's first-paying-client readiness.
Suite extraction is tracked in `docs/audits/POST_LAUNCH_BACKLOG.md` under
the `[SUITE]` items and runs in parallel without blocking the Launch Gate.

---

## 6. Cross-repo coordination

| Question | Where to look |
|---|---|
| What is Hollis as a product? | [`../vision/2026-05-18-suite-vision.md`](../vision/2026-05-18-suite-vision.md) |
| Why is the suite structured this way? | This doc |
| What is the migration plan with concrete steps? | [`./suite-infrastructure-migration.md`](./suite-infrastructure-migration.md) |
| What are the deferred Health-side suite items? | [`hollis-health-app/docs/audits/POST_LAUNCH_BACKLOG.md`](https://github.com/hollis-studio/hollis-health-app/blob/main/docs/audits/POST_LAUNCH_BACKLOG.md) — `[SUITE]` entries |
| What is Workouts' overall product roadmap? | [`Hollis-Workouts/docs/archive/plans/2026-05-11-mass-market-todo.md`](https://github.com/hollis-studio/Hollis-Workouts/blob/main/docs/archive/plans/2026-05-11-mass-market-todo.md) |
| What are the shared package exports? | [`hollis-shared/README.md`](../../README.md) |
| What verifies extraction readiness? | CI in `hollis-shared` (post-extraction); legacy `npm run check:shared-extraction` ran in Health pre-extraction |

Any change that affects suite architecture must update both this doc and
the Workouts plan doc in the same change set.
