# Hollis Suite — Unified Vision (Bifurcation Rewrite)

> **Status:** Canonical north star, 2026-05-19. Supersedes [`2026-05-18-suite-vision.md`](2026-05-18-suite-vision.md).
> **Owners:** Isaac Landes — Hollis Health LLC CEO; Hollis Health clinic lead. Samuel — Hollis Studio lead, effective 2026-05-19.
> **Audience:** Founders, engineers, future hires, legal counsel, prospective investors.
> **Revision log:**
> - 2026-05-18 — initial vision capture (single business unit, 6-app suite).
> - 2026-05-18 (addendum 1) — execution caveats, narrower niche framing.
> - 2026-05-18 (addendum 2) — sharpened thesis: "the only consumer fitness app a clinician will trust."
> - **2026-05-19 — bifurcation rewrite (this doc).** Hollis Health LLC reorganizes into two business units (Hollis Health clinic + Hollis Studio consumer suite). Hollis Health mobile app re-scoped to clinic patient portal. App slate reduced from 6 to 4. India primary international expansion target, Philippines as second move, China deferred with explicit preconditions. Concrete server topology with Compass federation (Option B), Identity Service extension, contracts package split, PHI Bridge model. Twelve parallel research agents informed this version (Compass deployment, Identity B2B+B2C, Health app scoping, Health backend audit, workouts-server promotion, suite topology, India market, China/SEA reality check, PHI sovereignty, contracts split, Health re-scope migration, Android-first global), plus one Strength readiness audit.

---

## Positioning line (preserved verbatim)

> **AI explains. Hollis verifies. You decide.**

The consumer-facing version of the deterministic-core / AI-shell architecture. Every Hollis Studio surface leads with some variation of this line — paywall hero, onboarding intro, Sunday Review opening slide, landing page. It is the single most under-marketed claim in the entire vision: every competitor now claims "AI"; almost none can claim *constrained, verified, user-authoritative* AI. That is the defensible difference and it belongs on every surface, not buried in an architecture doc.

---

## 1. The bifurcation (the new central fact)

Hollis Health LLC operates two distinct business units as of 2026-05-19. Both are wholly owned by Hollis Health LLC; the company runs them with different cadences, different P&Ls, different go-to-market motions, and different regulatory postures.

### Hollis Health — the clinic business

- **What it is:** Direct-to-patient clinical care. First physical location opening 2-3 weeks from this rewrite (lease signing imminent).
- **Business model:** B2C clinical care delivered through a HIPAA-covered entity. Clinical fees, session packages (CLINICIAN_INITIAL, CLINICIAN_FOLLOWUP, LABWORK, DXA_SCAN, SLEEP_SCREENING — already modeled in the data layer), subscription memberships, ancillary product sales.
- **App role:** The Hollis Health mobile app is the **patient portal** — appointments, labs, vitals, clinician messaging, billing, documents, patient-side intake. Workout/nutrition/dashboard-recovery surfaces currently in the app are moving out to the Hollis Studio consumer apps (see §8). PHI-bound. HIPAA-controlled.
- **Web surface:** existing `web-admin` (clinician-facing Next.js admin) is the clinic operating system; existing `web-public` is marketing.
- **Owner:** Isaac Landes.

### Hollis Studio — the consumer suite

- **What it is:** Global consumer fitness apps. Mass market. Shipped through App Store / Play Store / regional Android stores.
- **Business model:** Subscription (RevenueCat-managed), tiered pricing per region. B2B trainer/clinician fleet sales as secondary motion.
- **App role:** Hollis Strength (currently shipping as "Hollis Workouts", rebrand before paid launch) is the flagship. Future apps gated on signal (see §13).
- **Web surface:** new `hollis-dashboard` (consumer + clinician/trainer dashboard, web-only, recommended Vercel deploy — see §4.6).
- **Owner:** Samuel, reporting up to Isaac as a Hollis Health LLC business unit. (Recommended legal structuring: Hollis Studio LLC as a wholly-owned subsidiary of Hollis Health LLC, for HIPAA boundary clarity — see §11.)

### Why the bifurcation matters

The 2026-05-18 vision argued for one company expressing six apps. The 2026-05-19 bifurcation refines this: **one company, two business units, four apps (down from six), one shared intelligence layer (Compass).** Each business unit operates at its native velocity:

- The clinic needs slow, audited, HIPAA-compliant change cycles (clinical accuracy, patient safety, regulatory exposure).
- The consumer suite needs fast, A/B-tested, market-responsive iteration (subscription conversion, retention, international ASO).

Trying to ship both inside one codebase, one team, one App Store listing was a structural risk the prior vision didn't address.

The bifurcation also creates the single highest-priority legal question this rewrite cannot answer: **does Hollis Health LLC operating both the clinic (HIPAA covered entity) and Hollis Studio (consumer app) make the entire LLC a single covered entity under HIPAA?** If yes, all Studio data falls under HIPAA. If no (e.g., via Hollis Studio as a separate subsidiary), Studio operates under FTC consumer-health-app rules and only crosses the HIPAA boundary via explicit per-patient consent (see §11). Resolve with counsel before any cross-business code ships.

---

## 2. Strategic refinement (v3)

### The thesis, sharpened by bifurcation

> **Hollis Health is the only clinical care brand a fitness-tech consumer will trust. Hollis Studio is the only consumer fitness app a clinician will trust.**

The two halves of the brand mutually validate. Clinicians trust Hollis Studio's training data because it's produced by software whose sibling business is a real clinic operating under HIPAA. Consumers trust Hollis Health as a clinic because it's bundled with a fitness suite they already respect. Neither side stands alone as well as together — but each can operate independently if needed.

### What changes with 2 people + AI dev velocity

The 2026-05-18 vision assumed 1-person velocity and gated Phase 4 (Recovery / Move / Mind) on wedge revenue. The 2026-05-19 reality is 2 people (Isaac + Samuel) plus modern AI-assisted development:

- **Scope can grow in parallel.** Strength launch, Compass server build, Health app re-scope, clinic opening, India ASO can all run in the same 12-week window with disciplined sequencing.
- **But the suite-wide engine (Compass) is more important, not less.** Faster ability to ship apps does not change the fact that without a strong engine, apps don't compound. The vision-doc-as-of-2026-05-18 was right that the engine is what makes a multi-app suite anything other than a bag of mediocre apps.
- **App slate decision matters MORE, not less.** Faster shipping means faster sunk cost. The research returned 2026-05-19 (Hollis Health already runs the recovery EMA in production; Strength already consumes the readiness signals via a Pearson-correlation questionnaire) argues for a leaner 4-app slate, not the original 6.

### Final app slate decision (revised down from 6 to 4)

| App                  | Status                              | Rationale                                                                                                                                                                                                                              |
| -------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hollis Health**    | Ship (clinic portal)                | Already exists; re-scope underway; clinic opens in 2-3 weeks.                                                                                                                                                                          |
| **Hollis Strength**  | Ship (Phase 1 flagship)             | Flagship Studio app. Rebrand from "Hollis Workouts" before paid launch.                                                                                                                                                                |
| **Hollis Nutrition** | Phase 2 (gated)                     | Build native only if MFP/Cronometer import via Compass doesn't deliver equivalent cross-app value. The vision-doc-as-of-2026-05-18 already framed this as gated; the bifurcation does not change the gate.                             |
| **Hollis Compass**   | Build now (server, not consumer)    | Cross-app intelligence engine. Not a consumer-facing app — a service that powers Strength, Health, and the web dashboard. See §5.                                                                                                      |
| ~~Hollis Recovery~~  | **KILLED as standalone app**        | Hollis Health backend already runs HRV + RHR + sleep recovery EMA in production (`metricsEngine.ts`). Strength already consumes these signals via the readiness questionnaire. A standalone Recovery app would be UI shells over data the suite already reads. Folds into Compass + Strength. |
| ~~Hollis Move~~      | **Deferred / folded into Strength** | ClassPass growth (Pilates +66%, low-impact +112%, sports recovery +155% YoY) is real, but a standalone app would fight Apple Fitness+ / Peloton / Nike on content — a fight to lose. Prescribed movement (mobility from lift pattern + soreness) folds into Strength as a Compass content surface. |
| ~~Hollis Mind~~      | **Deferred indefinitely**           | 3.9% Day-15 retention (mental-health app median) is disqualifying without a clinical anchor. If pursued later, must be clinician-prescribed via the Health surface, not consumer-direct.                                              |

**Net:** 3 native apps (Health, Strength, Nutrition-when-gated) + 1 server service (Compass) + 1 web dashboard. The 6-app vision is preserved as long-term optionality; the 4-app reality is what this rewrite commits to.

The shared protocol/habit layer ("Hollis Protocols") from the 2026-05-18 vision is preserved as a Compass concept, not a separate app. Protocols are emitted by Compass and surfaced inside each app's own UI.

---

## 3. Organizational structure (2026-05-19)

```
                       ┌─────────────────────────┐
                       │   Hollis Health LLC     │
                       │   (parent, Isaac)       │
                       └────────────┬────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                │                                       │
        ┌───────▼────────┐                     ┌────────▼────────┐
        │  Hollis Health │                     │  Hollis Studio  │
        │  (clinic BU)   │                     │  (consumer BU)  │
        │  Isaac         │                     │  Samuel         │
        └───────┬────────┘                     └────────┬────────┘
                │                                       │
   ┌────────────┼────────────┐            ┌─────────────┼────────────┐
   ▼            ▼            ▼            ▼             ▼            ▼
hollis-       clinic-     web-admin    hollis-       hollis-    hollis-
health-app    api         (Next.js)    strength      studio-    dashboard
(patient      (Express +  (clinician   (RN/Expo      server     (Next.js,
 portal,       Prisma +    ops)        mobile)       (Express,  web)
 RN/Expo)      Postgres)                             promoted
                                                     from
                                                     workouts-
                                                     server)

                       ┌─────────────────────────┐
                       │ Shared infrastructure   │
                       │ (operated under LLC)    │
                       └────────────┬────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                ▼                   ▼                   ▼
         hollis-identity    hollis-compass        hollis-shared
         (auth, JWTs,       (cross-app             (contracts,
          MFA, OAuth)        intelligence)         design-tokens,
                                                  auth-client)
```

### Owner / repo map

| Layer                      | Repo                  | Stack                                                            | Business unit / lead                 |
| -------------------------- | --------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| Clinic mobile patient portal | `hollis-health-app` | React Native / Expo SDK 54                                       | Hollis Health (Isaac)                |
| Clinic API                 | `hollis-health-app/server` | Express 5 / Prisma 7 / Postgres / Redis / Vertex AI Gemini | Hollis Health (Isaac)                |
| Clinic admin web           | `hollis-health-app/web-admin` | Next.js                                                  | Hollis Health (Isaac)                |
| Strength mobile app        | `hollis-workouts` → rebrand to `hollis-strength` post-launch | React Native / Expo SDK 54 | Hollis Studio (Samuel)          |
| Studio API server          | `hollis-workouts-server` → rename to `hollis-studio-server` once second app lands | Express 5 / Prisma 7 / Postgres | Hollis Studio (Samuel) |
| Web dashboard              | `hollis-dashboard` (NEW) | Next.js 16 / Tailwind                                          | Hollis Studio (Samuel)               |
| Identity service           | `hollis-identity`     | Express / Prisma / Postgres / RS256 JWTs                         | Shared (operated under LLC)          |
| Compass engine             | `hollis-compass` (NEW) | Express / Prisma / Postgres / SQS / Anthropic Claude API        | Shared (operated under LLC)          |
| Shared contracts/utilities | `hollis-shared`       | TypeScript monorepo, GitHub Packages distribution                | Shared (operated under LLC)          |

### Cadences

- **Hollis Health clinic:** weekly release cadence; PHI-touching changes go through audit + clinical safety review before merge.
- **Hollis Studio:** daily/twice-daily release cadence; OTA updates via Expo EAS for JS-only changes; App Store / Play Store submissions weekly.
- **Identity / Compass / shared:** staging-first, soak-tested before each consumer-side adoption.

---

## 4. Server topology (the architecture map)

This section is the concrete answer to "how is this all going to be architected." It supersedes all prior architecture sketches.

### 4.1 ASCII diagram

```
                            ┌───────────────────────────────────────┐
                            │           hollis-shared                │
                            │  @hollis-studio/contracts-core         │
                            │  @hollis-studio/contracts-clinical     │
                            │  @hollis-studio/contracts-consumer     │
                            │  @hollis-studio/contracts-compass      │
                            │  @hollis-studio/auth-client            │
                            │  @hollis-studio/design-tokens          │
                            └─────────────────┬─────────────────────┘
                                              │ npm semver (GitHub Packages)
        ┌─────────────────────────────────────┼─────────────────────────────────────┐
        │                                     │                                     │
        ▼                                     ▼                                     ▼
┌────────────────┐                  ┌─────────────────────┐                ┌─────────────────────┐
│ hollis-identity│◄── verify ───────│  clinic-api         │── verify ─────►│  studio-api         │
│                │◄── verify ───────│  (Hollis Health      │                │  (promoted from     │
│  JWT issuer    │                  │   server, scoped)   │                │   workouts-server)  │
│  RS256 + JWKS  │                  │                     │                │                     │
│  MFA, OAuth    │                  │  PHI-bound, HIPAA   │                │  Consumer-bound     │
│  Consent grants│                  │  RDS-A (Postgres)   │                │  RDS-B (Postgres,   │
│  ServiceAccounts                  │  S3 (PHI, SSE-KMS)  │                │   schemas per app)  │
│  RDS-D         │                  │  ECS Fargate (US)   │                │  ECS Fargate        │
│  ECS Fargate   │                  │                     │                │  (US + ap-south-1)  │
└────────┬───────┘                  └──────────┬──────────┘                └──────────┬──────────┘
         │                                     │                                      │
         │                                     │ daily PHI-redacted push              │ training-state read
         │                                     │ ClinicalContextSnapshot              │ via service token
         │                                     │ (signed JWT, consent-gated,          │ (aud:
         │                                     │  booleans/enums only)                │   service:compass-read)
         │                                     └────────────────┬─────────────────────┘
         │                                                      │
         │                                                      ▼
         │                                          ┌──────────────────────┐
         └─────────── service tokens ──────────────►│  compass-engine      │
                                                    │  (hollis-compass)    │
                                                    │                      │
                                                    │  Deterministic       │
                                                    │  daily snapshot      │
                                                    │  AI narration        │
                                                    │  Protocol generation │
                                                    │  Today Card          │
                                                    │  ECS Fargate (US +   │
                                                    │   ap-south-1)        │
                                                    │  RDS-C (Postgres)    │
                                                    │  SQS queues          │
                                                    └──────────┬───────────┘
                                                               │
                                                    ┌──────────▼───────────┐
                                                    │  Background workers  │
                                                    │  (hollis-compass)    │
                                                    │                      │
                                                    │  snapshot-job        │
                                                    │  wearable-poll       │
                                                    │  ETL scripts         │
                                                    └──────────┬───────────┘
                                                               │
                ┌──────────────────────────────────────────────┼──────────────────────────────────────┐
                ▼                                              ▼                                      ▼
   ┌──────────────────────┐                ┌──────────────────────────┐               ┌──────────────────────┐
   │  Hollis Health app   │                │  Hollis Strength app     │               │  hollis-dashboard    │
   │  (clinic portal,     │                │  (consumer, RN/Expo)     │               │  (Next.js web)       │
   │   RN/Expo)           │                │  + SQLite offline cache  │               │  Consumer + clinician│
   │  + web-admin         │                │                          │               │   views, one codebase│
   │  (Next.js)           │                │                          │               │  Vercel              │
   └──────────────────────┘                └──────────────────────────┘               └──────────────────────┘

Data stores summary:
  RDS-A (clinic-api)   Postgres 15, Multi-AZ, db.t3.medium — Clinical records, PHI, PHI audit log
  RDS-B (studio-api)   Postgres 15, Multi-AZ, db.t3.small — Training, programs, gyms (Postgres schemas per app)
  RDS-C (compass)      Postgres 15, single-AZ — Snapshots, protocols, consent ledger, external-data signals
  RDS-D (identity)     Postgres 15, Multi-AZ — Users, MFA, refresh tokens, consent grants, service accounts
  ElastiCache Redis    JWT denylist hot-cache, rate limiter state
  S3 (PHI bucket)      SSE-KMS, versioning on, PHI-audit-logged
  S3 (assets bucket)   Exercise media, exports, Compass report PDFs
  SQS                  snapshot-queue, wearable-poll-queue, etl-queue, notification-queue
```

### 4.2 hollis-identity (existing repo, deploy pending)

- **Hostname:** `identity.hollis.health`
- **Owns:** user credentials, password hashes, MFA state, refresh tokens, token denylist, account lockout, OAuth account links, identity audit log. **New:** `ClinicMembership`, `StudioSubscription`, `TrainerClient`, `ConsentGrant`, `ServiceAccount`, `Clinic`/`ClinicLocation` tables (see §7).
- **Issues:** JWTs with audiences `hollis-health`, `hollis-workouts` (→ `hollis-strength`), `hollis-compass`, `hollis-dashboard`, plus service audiences `service:compass-read`, `service:clinic-workouts-read`.
- **Token TTL:** access 15 min, refresh 7 days. Service tokens 5 min, non-refreshable.

### 4.3 clinic-api (existing — `hollis-health-app/server`)

- **Hostname:** `api.hollis.health`
- **Stack:** Express 5 / Prisma 7 / Postgres 15 / Redis / Vertex AI Gemini. **Already substantially production-ready** per the 2026-05-19 backend audit: multi-tenant MSO with organization scoping, tamper-evident hash-chained PHI audit log, MFA step-up on every PHI route, AES-256-GCM field encryption, Vertex AI under Google BAA.
- **Owns:** clinical records, appointments, labs (LabPanel / LabReport / LabObservation), DXA scans, clinical notes, messaging, patient documents (S3-backed), Stripe subscriptions for Health-side, recovery EMA engine (`metricsEngine.ts`), `MetricDefinition` registry, biometric ingest from HealthKit / Health Connect.
- **Gaps to close before central-clinic-API promotion:** (1) integrate `@hollis-studio/auth-client` against hollis-identity (currently issues its own JWTs); (2) enable PostgreSQL RLS on `PhiAccessLog`; (3) codify S3 SSE-KMS configuration; (4) implement the audit-archival job to S3 Glacier (HIPAA 6-year retention); (5) extract the recovery EMA + TDEE Kalman filter into `@hollis-studio/metrics` so Compass can share without duplication.
- **JWT audiences accepted:** `hollis-health`, plus outbound use of `service:clinic-workouts-read` to call studio-api.

### 4.4 studio-api (promote from `hollis-workouts-server`)

- **Hostname:** `api.strength.hollis.health` initially; rename to `api.studio.hollis.health` when Nutrition lands.
- **Verdict from 2026-05-19 promotion audit: promote, do not rebuild.** The scaffold is already suite-generic (auth middleware, error handling, rate limiting, Docker, Prisma singleton, env validation). What's Workouts-specific is ~4 string changes + a Postgres schema namespacing decision. A rebuild would reproduce 95% of this infrastructure before writing a single Workouts route.
- **Deployment model:** **Single server, single Postgres, multiple Postgres schemas** (`CREATE SCHEMA workouts; CREATE SCHEMA nutrition;`) rather than microservices. One ECS service to operate, hard DB-level isolation, shared auth + rate limiter, cross-app queries possible without network hops when Compass needs to join.
- **Critical remaining work (W5c):** all 12 CRUD route handlers are stubbed (`TODO(W5c)`). Estimated 1.5-2 weeks for a 2-person team with AI assistance. Plus: Redis-backed rate limiter (for multi-instance), multi-audience support in auth middleware, Firestore → Postgres ETL script, mobile client cutover (SQLite + REST replacing Firebase sync).
- **JWT audiences accepted:** `hollis-workouts` (today; → `hollis-strength` on rebrand), `service:clinic-workouts-read` (inbound from clinic-api), `service:compass-read` (inbound from compass-engine).

### 4.5 compass-engine (new repo)

- **Hostname:** `compass.hollis.health` (internal; not consumer-facing).
- **Stack:** Express + Prisma + Postgres + SQS + Anthropic Claude API (BAA-required for any PHI inference).
- **Deployment model: Option B from the 2026-05-19 Compass design — two Compass instances + federation.** clinic-Compass lives inside the HIPAA boundary (small, purpose-built, BAA-scoped); consumer-Compass is the scaled consumer-facing intelligence service. clinic-Compass pushes a daily redacted `ClinicalContextSnapshot` (booleans/enums only, never raw PHI) into consumer-Compass's cache for consented users. Consumer-Compass never makes a synchronous cross-boundary call at serving time. See §5 and §11 for the full design + rationale (vs Options A/C/D).
- **Owns:** deterministic daily snapshots, protocol generation, insight candidates, Today Card content, Pre-Lift Readiness Card data, consent ledger, cross-app signal aggregation.
- **What it never does:** mutate app state. AI is the explainer over the deterministic snapshot, never the authority.
- **Estimate:** 10-14 weeks for v1 (deterministic snapshot + AI narration + consent ledger). LLM cost projected at $0.01-0.05 / user / day depending on model.

### 4.6 hollis-dashboard (new repo, Next.js 16, Vercel)

- **Hostname:** `hollis.health/dashboard` (proxied via existing domain).
- **Two surfaces, one codebase:** `/dashboard` is the consumer Today Card / training-week-at-a-glance / Compass insights view; `/admin` is the clinician/trainer fleet view (client list, training history, Compass clinical summary, PHI-gated flags). Server components for data fetching.
- **JWT audiences accepted:** `hollis-health` (clinician routes), `hollis-workouts/hollis-strength` (consumer routes), `hollis-dashboard` (dashboard-specific routes).
- **Why web before more native apps:** the 2026-05-18 vision identified this as Phase 2.5 leverage (Move #2). The bifurcation reinforces it — clinicians work on desktop, not phones, and consumers want a "look at everything" view that doesn't fit in a phone tab.
- **Estimate:** 4-6 weeks for v1 consumer + clinician views.

### 4.7 Background workers + queues

- **Where they live:** inside the `hollis-compass` repo, deployed as separate ECS tasks or Lambda. Queue infrastructure: **AWS SQS, not Kafka.** Reasoning: SQS is sufficient at our scale (async snapshot generation, wearable polling, ETL); MSK costs $200+/mo minimum with no fan-out benefit until ≥3 consumers per event.
- **Named queues:** `hollis-snapshot-queue` (daily Compass snapshot per user), `hollis-wearable-poll-queue` (WHOOP/Oura polls), `hollis-etl-queue` (Firestore→Postgres migration, decommissioned post-ETL), `hollis-notification-queue` (push dispatch for insight candidates).

### 4.8 External-data integration layer

- **Where it lives:** inside `hollis-compass` (`compass/src/integrations/`), not a separate deployed service. Co-located because external data is Compass's raw material — one service, one consent ledger.
- **Integrations:**
  - Apple Health / Health Connect: mobile app writes a summary payload to studio-api at session end; SQS event triggers Compass ingest.
  - WHOOP / Oura: OAuth2 polled by a worker on a per-user cadence; encrypted tokens in RDS-C.
  - MFP / Cronometer: CSV import v1, OAuth when API access permits (MFP API is restricted; Cronometer has a paid API).

### 4.9 Auth flows (three representative scenarios)

**Consumer logs into Hollis Strength**
```
Mobile → POST /login (identity) → returns access + refresh tokens (aud: hollis-strength, RS256)
Mobile → GET /me (studio-api) → studio-api validates JWT via JWKS + Redis denylist → returns user profile
Mobile → POST /identity (RevenueCat) → syncs Hollis userId as RevenueCat customerID
```

**Clinician views patient's training data in Health admin**
```
Browser → GET /clients/:id/training (clinic-api web-admin) [httpOnly cookie]
clinic-api → validates JWT, confirms role=CLINICIAN + orgId, checks consent ledger
clinic-api → GET /clients/:userId/sessions (studio-api) [service token, aud: service:clinic-workouts-read]
studio-api → validates service token via JWKS, checks RBAC=CLINICIAN, PHI-audit log entry, returns training summary (non-PHI)
Browser ← rendered training panel
```

**Compass generates daily snapshot for a consented user (mixed clinical + consumer data)**
```
SQS message: userId, date=today → compass-engine consumer-side worker
consumer-Compass → check consent ledger (RDS-C); user consented to [strength, clinical-flags]
consumer-Compass → GET /snapshot-inputs/:userId (studio-api) [service token, aud: service:compass-read]
                ← training state {volume, E1RM, RIR trend, plateau flags}
consumer-Compass → reads cached ClinicalContextSnapshot (pushed daily by clinic-Compass)
                   {boolean injury flags, cleared movements, NO raw PHI}
consumer-Compass → run deterministic snapshot (pure function, Result<T>, no LLM in this step)
consumer-Compass → send narration prompt + deterministic snapshot to Anthropic Claude (no PHI in prompt)
                ← Today Card text
consumer-Compass → write snapshot + Today Card to RDS-C; push notification (SQS)
```

---

## 5. Compass — engine spec

This section preserves and extends the 2026-05-18 Compass concept with concrete deployment, contracts, and primitive specs developed 2026-05-19.

### 5.1 Design axioms (all have prior art in Hollis Strength code)

- **AI never owns numbers.** Deterministic snapshot is produced first; AI narrates it. (Prior art: `src/services/preLiftReadiness.ts` rule: "AI must never replace the recommendedAction or reductionPercent.")
- **Sample-size gating is hard.** No claim until N events accumulated. (Prior art: `src/types/aiThresholds.ts` — `MIN_HISTORY_WEEKS_FOR_RCA: 3`, `MIN_SESSIONS_FOR_CORRELATIONS: 12`, `CORRELATION_R_CUTOFF: 0.4`.)
- **EWMA with hot-start.** Recency-weighted baselines (α = 0.3, 8-week window); hot-start α = 0.7 after gaps ≥ `STALE_GAP_DAYS = 14`.
- **Noise floor before claims.** 1.5σ outlier threshold; 3 consecutive sub-baseline sessions before deload trigger.
- **Result\<T\>, never throw.** All engine functions return `ok(data)` or `err(code, msg)`.

### 5.2 Canonical event shapes (belongs in `@hollis-studio/contracts-compass`)

The minimum set every Hollis app must emit for Compass to do cross-app correlation. Full TypeScript signatures in the 2026-05-19 engine spec; summary below:

| Event                          | Owning app          | Key fields                                                                          |
| ------------------------------ | ------------------- | ----------------------------------------------------------------------------------- |
| `TrainingSessionCompleted`     | hollis-strength     | sessionId, duration, totalVolumeKg, hardSetCount, programPhase, topExercises[], questionnaire, goEasierApplied, deloadPercent |
| `NutritionDayLogged`           | hollis-nutrition / external (MFP, Cronometer) | dateLocal, totalCalories, proteinG, proteinAdequate, calorieTarget, isPartialDay |
| `SleepRecorded`                | external (HealthKit/Oura/WHOOP) | dateLocal, durationHours, deepSleep%, REM%, qualityScore, hrv, rhr, wearableSource |
| `MoodCheckIn`                  | (deferred, future Mind / lightweight widget) | checkInAt, moodScore, stressScore, motivationScore, context              |
| `BodyweightRecorded`           | hollis-health / hollis-nutrition / hollis-strength | dateLocal, bodyweightKg, source                                       |
| `WearableMetricImported`       | external                                          | dateLocal, metricKey, value, unit, wearableSource                     |
| `ProtocolCompleted`            | any (cross-app)     | protocolId, protocolSlug, completedAt, prescribedByApp, wasSkipped                   |

### 5.3 `UserDailySnapshot` shape (Compass's deterministic output)

One per user per calendar day. Read-only to AI. Renders to Today Card and Pre-Lift Readiness Card. Has nested `training` / `nutrition` / `sleep` / `mood` / `body` / `candidateInsights` / `protocolsDueToday` / `clinicianFlags` sections, each with explicit `dataConfidence: 'none' | 'low' | 'medium' | 'high'` driven by sample-count gates.

### 5.4 Engine primitives (six)

1. **Per-user baseline** — `updateBaseline(prior, newValue, alpha)` → EWMA + EWMA variance + sample count + last-updated timestamp.
2. **Drift detection** — `detectDrift(current, baseline, sigmaThreshold, minSamples)` → signed σ deviation + outlier flag + confidence level.
3. **Co-occurrence candidate generation** — `generateCoOccurrenceCandidates(snapshots, minSamples, rCutoff)` → Pearson r between aligned signal pairs.
4. **Confounder identification** — `identifyConfounders(candidates, rCutoff)` → for each pair (A, B), any signal C with |r(A,C)| ≥ cutoff AND |r(B,C)| ≥ cutoff is a confounder. `isolationPossible = false` drives the honest-hedge output.
5. **Sample-size gate** — `meetsMinSampleGate(sampleCount, requiredSamples)` → trivial but named function so it appears in the call graph and can be audited.
6. **Intervention proposal** — `proposeIntervention(candidate, snapshot, confounders)` → never proposes when isolation impossible AND the action is load-affecting. Magnitude capped to existing `goEasierSuggestion` bands (mild 7% / moderate 12% / severe 20%).

### 5.5 Honest-hedge output (first-class type)

```typescript
interface CompassInsightCandidate {
  candidateId: string;
  type: 'correlation' | 'drift' | 'co_occurrence' | 'protocol_adherence';
  headline: string;          // deterministic, no AI
  hedgeStatement: string | null;
  evidence: { observationCount, windowDays, correlatedSignals[], confoundedBy[], sampleGatePassed };
  aiNarrationPromptSlot: string | null;  // AI may rephrase but cannot remove the hedge
  interventionProposal: InterventionProposal | null;
  suppressedUntilSamples: number | null;
}
```

User-visible example for a hedged insight:

> "We've noticed your squat tends to dip when your sleep is short — 18 sessions, r = −0.61. However, on most of those nights your calories were also low and your stress was elevated. We can't separate which factor matters most. The clearest action: protect sleep and hit protein first."

### 5.6 What Compass produces vs what apps own

- **Compass produces:** `UserDailySnapshot`, `CompassInsightCandidate[]`, `InterventionProposal[]`, `Protocol[]`.
- **Compass never:** writes to any app's state, surfaces insights without sample-gate passed, surfaces a load-affecting `InterventionProposal` directly to the user.
- **Each app owns:** whether and where to render a candidate, the confirmation dialog for any state-changing proposal (the same diff-preview pattern as `usePreLiftReadinessFlow`), the AI narration call.

### 5.7 Validation — Today Card stress test

The engine spec is good if it can produce a defined set of 10 concrete Today Card outputs (defined in the 2026-05-19 Today Card stress test). Key finding: **6 of 10 cards work with Strength + external imports alone** (Apple Health / WHOOP / Oura / MFP), before any other native Hollis app exists. This is the decisive argument for building Compass *now* against Strength + imports rather than waiting for Nutrition or Recovery to ship.

---

## 6. Contracts package strategy

The `@hollis-studio/contracts` package currently ships 100+ files spanning identity, training, nutrition, sleep, biometrics, labs, PHI, admin, AI, billing — across both business units. Shipping the full set inside a consumer Strength bundle is wrong: clinical-bound types should not live in a consumer SDK, and the inverse is wasted weight in the clinic.

**Decision:** Split into 4 packages, with `core` first (non-breaking), the rest in a 6-week transition via re-export shims.

| Package                              | Contents                                                                                                                                                                          | Consumers                                |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `@hollis-studio/contracts-core`      | errors/, primitives/, password/, common, units, pagination, enumContract, auth-tokens (`AUDIENCES`, `AccessTokenClaims`, `REVOKED_REASON`), api/csrf, api/endpoints, api/response, HTTP_STATUS, UNIT_CONVERSION, STORAGE_KEYS, UPLOAD_LIMITS, sentrySanitization, errorSanitization | **All 5 surfaces** (Strength, Health, identity, studio-server, web-admin) |
| `@hollis-studio/contracts-consumer`  | training, training-strategy, workouts, training-session-log, exercise, muscles, equipment, cardio-session, progression/, nutrition, nutrition-plan, sleep, recovery-sessions, journal (minus PHI fields), analytics, USER_TIER + USER_ROLE + BIOLOGICAL_SEX + PRIMARY_GOAL, ai/ (workout/nutrition AI only), ai-notes | Strength, studio-server, consumer Health surfaces |
| `@hollis-studio/contracts-clinical`  | clinical, clinical-registry.schema, labs, admin/labs, biometrics, phi-audit, health-metrics, health-progress, health-metric-types, metric-codes, metric-definition, appointments, appointment-config, sessions (clinical billing), mfa (ASSIGNMENT_STATUS / clinician), compliance, messages, organization, documents, push, realtime, registration, billing, jobs, admin-tasks, admin-notifications, businessAnalytics, marketing, admin/ | clinic-api, web-admin, Health app |
| `@hollis-studio/contracts-compass` (NEW) | DailySuiteSnapshot, SuiteEvent, TodayCard, Protocol, ProtocolTrigger, ProtocolCompletion, AdherenceWindow, NudgePolicy, SuppressionReason, CrossAppInsight, UserConsentScope, InterventionSuggestion, WearableIntegrationConfig | compass-engine, all consumer apps (read), clinic-api (PHI-redacted clinical snapshot writes) |

### Reconciliation items the split forces

- **`DailyMetricsContract` vs `QuestionnaireResponse`** — parallel representations of the user's daily readiness state. Unify under `DailyUserState` in `contracts-compass`; both feed into it from their domains.
- **`DailySummaryContract` vs `DailyMetricsContract`** — rename clinic-side to `ClinicalDailySummary`.
- **`SLEEP_SOURCE` in `daily-metrics.ts`** — wrong location; move to `domain/sleep.ts`.
- **`MfaCredentialType` vs clinician assignment types** — split `domain/mfa.ts` into `mfa-identity.ts` (core) and `mfa-clinical.ts` (clinical).
- **`calculateTrimesterFromDueDate`** — clinical obstetric calculation living in `user.ts`; move to contracts-clinical.

### Security item (urgent, ship before any 2026-05-19 release)

**`APP_REVIEW_CREDENTIALS` and `APP_REVIEW_PASSWORD` are hardcoded** in `domain/app-review.ts` and currently ship inside every consumer bundle that imports `@hollis-studio/contracts`. Reviewer credentials are publicly bundled. Extract to a dev-only package or env-gate. Independent of the broader split decision.

---

## 7. Identity Service — extension for bifurcation

The existing `hollis-identity` schema has a flat `User` table with `role` ∈ `ADMIN | CLINICIAN | TRAINER | CLIENT` and a nullable `organizationId`. No multi-tenancy, no per-app subscription model, no service tokens, no locale/region. Insufficient for the bifurcated suite.

### Extended JWT claims (proposed)

```typescript
interface ExtendedAccessTokenClaims {
  // Standard (unchanged)
  sub, userId, type, jti, aud[], iss, iat, exp, mfaVerifiedAt?, mfaEnabled?

  // NEW
  subject_type: 'patient' | 'clinician' | 'admin' | 'consumer' | 'trainer' | 'service';
  locale?: string;       // BCP-47, e.g. "en-US", "hi-IN", "zh-CN"
  region?: 'us' | 'in' | 'cn' | 'eu';

  claims: {
    hollisHealth?: {
      clinic_memberships: Array<{ clinicId, locationId?, role: 'patient'|'clinician'|'admin',
                                  phi_access_level: 'none'|'own'|'panel'|'full' }>;
    };
    hollisStudio?: {
      studio_subscriptions: Array<{ appId, plan_tier: 'free'|'pro'|'elite', expires_at? }>;
      trainer_clients?: string[];   // userIds
    };
    hollisCompass?: {
      acting_as_user: string;             // for service-read tokens
      consented_scopes: ConsentScope[];
      consent_grant_id: string;
    };
  };
}
```

### Schema additions (Postgres)

New tables: `Clinic`, `ClinicLocation`, `ClinicMembership` (replaces `User.organizationId`), `StudioSubscription`, `TrainerClient`, `ConsentGrant` (patient opts in to share Studio data with clinic), `ServiceAccount`. New columns on `User`: `locale`, `region`, `subject_type`.

### Service tokens for cross-app reads

New endpoint: `POST /v1/token/service-read` (clinician-authenticated). Returns a 5-minute, non-refreshable token with `claims.hollisCompass.{acting_as_user, consented_scopes, consent_grant_id, requester_user_id, requester_clinic_id}`. studio-api verifies via JWKS, checks `consented_scopes` before returning data, audit-logs every call. Pattern reused for compass-engine reads.

### Migration

Additive only in Phase 1 (no breaking changes; legacy `User.organizationId` kept nullable, backfill `ClinicMembership` from existing data). Token enrichment in Phase 2 (consumers ignore new namespaces safely). Health-app cutover in Phase 3 (feature flag). Mandatory MFA enforcement for clinicians in Phase 4.

---

## 8. Hollis Health app — re-scope

The Hollis Health app currently does too much. The re-scope removes consumer-fitness surfaces and focuses the app on the clinic patient portal. The clinic opens in 2-3 weeks; consumer rip-out MUST NOT happen concurrently.

### Stays / moves / dies (summary; full table in 2026-05-19 Health app audit)

**STAYS (clinic portal):** Appointments tab + booking/detail modals, Clinician messaging, Lab results viewer, Biometrics dashboard with clinician goals, Documents (upload/view), Clinical intake / onboarding, Consent records, Billing / membership, MFA / security, Admin panel (clinician tools, patient detail, DXA, lab management), HealthKit/Health Connect vitals sync (clinical ingest stays), Auth / session management.

**MOVES to Hollis Strength:** Training plans / workout plans, Training strategies (programming blocks, goal periods), Daily check-in (re-framed as clinical wellness check-in if kept), Admin workout builder (trainer-side logging — likely moves to Strength trainer view or web-admin), Compliance / habits analytics, Sleep detail modal (already on the clinical side per audit findings).

**MOVES to Hollis Nutrition (when gated and built):** Nutrition logging / food timeline / macro tracking.

**DIES:** `web-public` marketing site (replaced by `hollis.health` + `hollisstudio.com`). The radial log FAB.

**DUAL-DEPLOYED:** Apple Health / Health Connect sync infrastructure — extract to a shared `@hollis-studio/health-sync` package so both clinic ingest and consumer recovery scoring can use it.

### Recovery engine verdict (the most important sub-decision)

**Split: ingest stays clinic-side, interpretation moves to Compass.** The `LatentRecoveryEMA` class + `training-load-enhanced.ts` (TRIMP-based ACWR) + `tdee-bias-aware-filter.ts` (multi-state Kalman) extract to `@hollis-studio/metrics` so Compass can consume without re-implementing. The raw biometric ingest pipeline (`biometrics.ts`, `dailyMetrics.ts`, the HealthKit/Health Connect adapters) stays clinic-side — clinicians need raw values, and they're PHI-adjacent.

**Do not dual-deploy the scoring algorithms.** Showing two different recovery scores in two apps from the same underlying data would create user confusion and potential liability.

### Sequencing (clinic-opening-aware)

| Week | Work | Risk |
| ---- | ---- | ---- |
| **W1-2 (NOW, pre-clinic-opening)** | Fix the 7 clinic-readiness gaps (see below). Feature-flag consumer tiles OFF for *new* registrations only. Existing users unchanged. Harden Appointments, Messages, Documents. Smoke-test booking flow on physical devices. | Low (additive) |
| **W2 (clinic opens)** | Clinic goes live. Freeze all changes to booking, messaging, billing. Incident-response posture only. | Medium |
| **W3-4 (stabilization)** | Monitor crash rates, fix any P0s from real-patient usage. Do NOT touch consumer features. | Medium |
| **W5** | Send "Heads Up" email to existing users announcing Hollis Strength is coming. No action required from them. | Low |
| **W6** | Hide Nutrition + Plans tabs behind feature flag for all users (`href: null`; routes still exist). Remove RadialLogSheet FAB. Add deep-link banner pointing to Strength TestFlight/beta. OTA via Expo EAS Update — no App Store review needed. | Low |
| **W7** | Refocus Dashboard: remove workout/nutrition/TDEE/plan-adherence tiles from default card order. Surface Appointments card prominently. OTA push. | Low |
| **W8** | Hollis Strength launches (or enters public beta). Send "Action Required" email prompting users to download Strength and link their account. 30-day data-access window. | Medium |
| **W9** | Remove consumer routes + backing screens from the build. Run `check:dead-code`. Submit to App Store. | Medium (review lag) |
| **W10** | App Store approval. Staged rollout 10% → 50% → 100% over 48h. | Low |
| **W11-12** | Backend: mark consumer API routes deprecated with sunset headers. Add clinic-only features: appointment reminders (24h/1h), lab result ready notifications, prescription-plan clinician UI. | Low |

### Clinic-readiness gaps that MUST close before W2

1. **The Appointments tab is currently hidden** (`href: null` in `app/(tabs)/_layout.tsx:243`). Screen exists and works; tab bar doesn't expose it. **Most urgent single fix.**
2. **No push when a clinician creates / modifies / cancels an appointment.** Patients need real-time notification.
3. **No lab-result-ready push.** Patients won't know when results are published.
4. **No 24h / 1h pre-appointment reminders.** Table-stakes for clinic; absent causes no-shows.
5. **No patient-facing intake form in the mobile app.** Only admin-assisted intake exists in web-admin.
6. **No in-app access to signed consent PDFs** post-signing (`compositeContractKey` stored but no patient-facing download route).
7. **No "message your care team" onboarding prompt** for new clinic patients.

### User-data migration (no forced movement)

Same Postgres rows, same `userId` via hollis-identity. Hollis Strength reads via API; no data movement required. Data export endpoint (GDPR-style) exists for users who want a JSON snapshot before any consumer surface is removed. The `DailyLog` table retains both clinical (sleep, HR, steps) and consumer (food entries) columns; the consumer columns simply stop being read by the Health app UI. No deletion.

### Communication copy (drafts)

Email 1 (W5): "Your Hollis workout history is safe — here's what's changing." Email 2 (W8): "Hollis Strength is here." In-app banner (W6): "Workouts and nutrition logging are moving to Hollis Strength. [Learn more →]" — gated on whether the user has ever logged food or a workout.

---

## 9. Hollis Strength — global-launch + Compass readiness

The Hollis Strength flagship app (`hollis-workouts` repo, rebranding) is the first Studio app to ship and the first to be Compass-integrated. The 2026-05-19 readiness audit identified the gaps below; quick wins ship in week 1.

### Readiness scorecard (abridged)

| Capability                              | Status                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Offline-first session logging           | Ready (MMKV synchronous write; Firestore async)                                                         |
| Offline-first history browse            | Ready                                                                                                   |
| Workouts-server REST integration        | **Missing** — zero API calls; all writes still to Firestore                                              |
| Structured event emission (TrainingSessionCompleted) | **Missing** — `processWorkout` writes baselines + Firestore + Health sync but no Compass event |
| Consent infrastructure (GDPR / DPDPA)   | **Missing** — no in-app consent gate, no ATT prompt, no clinician-share toggle                          |
| Localization library                    | `i18n-js` wired; 35 locale bundles present **but only 3 registered at runtime** — instant 0.5-day fix   |
| Localization UI coverage                | **Partial — 10 of 270 components use `t()`** (96% of strings hardcoded)                                  |
| RTL layout                              | Partial — detection works, but no layout consumes `isRTL`                                                |
| Time-zone correctness                   | Partial — 4 hardcoded `'en-US'` date formats; cold-start on new device could produce off-by-one         |
| Product analytics                       | **Missing** — no Mixpanel/Amplitude/PostHog                                                              |
| Hermes / New Arch                       | Ready                                                                                                   |
| R8 minification                         | **Disabled** — enabling cuts APK 15-25%                                                                  |
| Bundle ID                               | `com.isaac.woapp` (personal namespace) — must change to `com.hollis.strength` before alternative stores |
| Rebrand                                 | Partial — `BRAND_NAME` constant exists but bypassed in `app.json`, plist, several components            |

### Quick wins (1-2 days each, ship in W1)

1. Enable R8 + resource shrinking in `gradle.properties` (1 hour) — material APK size drop.
2. Register Hindi / Indonesian / Malay / Vietnamese / Thai in `locale.ts` (afternoon) — unlocks 5 markets, zero engineering cost.
3. Switch Firestore to `persistentLocalCache({ tabManager: singleTabManager() })` (2 hours) — offline write durability defense-in-depth.
4. Fix package ID mismatch `com.isaac.woapp` → `com.hollis.workouts` in `build.gradle` (before any alternative store submission, or IDs lock in).
5. Fix 4 hardcoded `'en-US'` date formats (0.5 days).
6. Stub `POST /api/crm/events` call from `processWorkout` with `TrainingSessionCompleted` payload (2 days; even if server just logs it initially — unblocks Compass).

### Phase 1 launch path (full plan in `docs/TODO.md` §A, §B, §N.2, §O)

Sim-verify v1.6.0 bugs → session UX P0s + AI photo button → onboarding P0s + Pre-Lift Suggestion → **Hollis Strength rebrand (pre-paid-launch)** → exercise library 80% coverage → iOS submission blockers → user-side launch ops (App Store Connect, Play Console, RevenueCat dashboards) → set Firebase → Postgres cutover date.

### Compass integration (Phase 2 for Strength; built in parallel by Compass team)

External-data integrations (WHOOP, Oura, MFP, Cronometer) feed Compass directly. Strength emits `TrainingSessionCompleted` events. Pre-Lift Readiness Card v2 (currently shipped as v1 with Workouts-only data) consumes `ClinicalContextSnapshot` from Compass when user has clinical consent.

---

## 10. International expansion

### Sequence (recommended)

1. **US + UK + EN-speaking commonwealth** — launch market, Apple/Google IAP, USD pricing.
2. **India** — primary international expansion, 6-12 weeks post-US launch. See §10.1.
3. **Philippines** — second international move, ~3-6 months post-India. English-native, GCash/GrabPay on standard App Store/Play infra. Lowest-friction move available.
4. **Indonesia** — after Philippines. 270M population, 81% smartphone penetration, requires Bahasa Indonesia localization.
5. **Vietnam / Thailand** — after Indonesia. Smaller but growing fitness markets, partial localization needed.
6. **EU** — after SEA expansion. GDPR overhead is real but manageable; EU users are higher ARPU.
7. **China** — DEFERRED. See §10.3.

### 10.1 India — primary expansion target

**Opportunity:** India fitness app market growing ~22% CAGR toward $2.4B by 2033; 19B+ annual app downloads. **The gap:** no app combines (a) structured strength programming, (b) intelligent progressive overload, (c) offline-first logging at an accessible price. Healthify (40M users) is calorie-focused; Cult.fit is live classes; Hevy/Strong have no India presence.

**Pricing (recommended):** ₹99/week · ₹299/month · ₹1,499/year (~$15-21/year). 40-50% of US pricing. Weekly plans outperform monthly in emerging markets. 7-14 day free trial. Day-0 conversion is critical: 50.6% of all conversions happen on download day — paywall trigger in onboarding at the first "wow" moment.

**Language:** English-only at launch. Defer Hindi until 10K India DAU. Then Hindi → Tamil → Telugu → Marathi → Bengali → Gujarati. Activating the existing 32 dormant locale JSON files in `src/services/locale.ts` is a half-day task that unlocks the runtime path; UI string extraction across 260 components is 8-12 days when justified.

**Distribution:** Play Store + **Indus Appstore** (PhonePe, preinstalled on every Xiaomi/Redmi sold in India, **0% commission**). 30-minute APK upload, real upside. Add Samsung Galaxy Store in Month 2-3 (same AAB, free, ~1 week to live). Xiaomi GetApps in Month 4-6. Skip Huawei AppGallery (negligible India share). Skip F-Droid (Firebase + RevenueCat disqualify). Skip Amazon Appstore.

**Payments:** Apple App Store + Play Store IAP. **Apple supports UPI Autopay for subscriptions in India** (PhonePe / GPay / Paytm through App Store IAP — removes biggest historical friction). Do NOT build direct Razorpay integration until $50K/mo India ARR — regulatory overhead kills 2-person team velocity.

**Regulatory checklist (pre-launch):**
- **GST registration as OIDAR provider** — mandatory from first rupee earned. 18% standard rate.
- **DPDPA privacy policy** with explicit opt-in consent for health data.
- **Verifiable parental consent** for under-18 users — simplest path is 18+ age gate at signup.
- **Data breach notification runbook** documented.
- **Medical device classification** — fitness apps are NOT medical devices under CDSCO rules unless they diagnose conditions. Confirm this remains true as Compass features expand.

**Cultural fit features (genuine differentiation):**
- Vegetarian-default nutrition (40% of India is vegetarian; gym protein sources differ).
- Fasting protocols (intermittent + religious — Navratri, Ramadan, Ekadashi, Karva Chauth) — flag in session context that adjusts Compass recommendations.
- Festival/seasonal periodization (Diwali Oct-Nov; summer April-June). Time ASO + email cadences.
- Home + dumbbell-only programming as first-class mode.
- Phone-number OTP onboarding (banking-style, Indian users are conditioned to it). Firebase Auth supports.
- Female fitness framing (private/gender-filtered community options).

**Go-to-market sequence (first 6 months in India):**
- M1-2: Soft launch, zero spend. Submit Play Store + Indus Appstore. GST registration. ~500 organic installs. Watch retention.
- M3-4: Micro-influencer seeding (10-15 strength/powerlifting micros at 10K-100K followers, ₹5K-25K per post, total ₹2-3 lakh budget). Bengaluru/Mumbai/Delhi English-speaking gym coaches.
- M5-6: Paid acquisition test (~₹50K-1L on Google UAC). Acceptable CPI ₹40-60. India-specific creative vs generic A/B.

### 10.2 Philippines — second international move

Highest leverage for 2-person team. ~85% smartphone penetration, English near-universal (zero localization cost), GCash + GrabPay work via standard App Store / Play Store IAP, fitness app CAGR ~22.5%, no dominant strength competitor locked in, light regulatory environment (DPA 2012, lightly enforced). Same app, same backend, same payment stack, same support language. Estimated incremental effort: 6-8 weeks ASO + marketing.

### 10.3 China — DEFERRED with explicit preconditions

**Verdict from 2026-05-19 reality check: do not pursue China in the next 18 months.**

- **Cost:** $78K-$195K one-time + $62K-$130K/year. WFOE legal entity ($8-20K + registered capital + $10-20K/year maintenance). ICP filing + 25+ Android app stores. PIPL compliance ($30-80K legal + $12-30K/year infra). Separate WeChat Pay / Alipay integration ($15-40K). Mandarin-native support ($15-30K/year).
- **WeChat mini-program is not a shortcut.** Overseas companies cannot obtain the WeChat Mini Program Filing; requires Chinese business license or trusted local partner who holds the license (you lose product control). Stripped-down product with 40% of capability under someone else's entity. **Do not pursue.**
- **Preconditions for China to become realistic (all required):**
  1. Hollis is generating $2M+ ARR and can sustain $100K-$200K of pre-revenue China burn without jeopardizing core business.
  2. Dedicated China business lead — Mandarin-native, China-based, existing relationships with at least one major Android app store + payments/compliance provider. **Cannot be one of the two current founders.**
  3. Verified JV or WFOE structure in place, or established trusted local partner with skin in the game.
  4. Decision to run a separate China-region stack accepted as permanent and resourced.
  5. Demonstrated demand signal from Chinese diaspora users on the existing product (Chinese-language review volume, organic installs from HK/TW/SG) before mainland commitment.

### 10.4 Android-first global build readiness

Current build pipeline (Expo SDK 54 / RN 0.81.5 / Hermes / New Architecture / EAS Build / AAB output) is correct. Gaps:

- **R8 disabled** — enable in `gradle.properties`. APK -15-25%.
- **Package ID mismatch** — `app.json` says `com.hollis.workouts`, `build.gradle` still says `com.isaac.woapp`. Unify before alternative-store submissions.
- **Brooklyn font bundles 6 TTF files** — convert to `.woff2` or subset (Latin + Devanagari) for India build. 1-3MB savings on metered connections.
- **No FlatList → FlashList migration** — likely scroll-jank on 2GB RAM devices with 500-session history. FlashList is a drop-in replacement.
- **Huawei Push Kit not integrated** — only matters if China or MENA expansion activates.

### 10.5 Localization stack decision

**Now:** stick with `i18n-js` short-term. Activate the 32 dormant locale bundles (0.5-day fix). **6-month:** migrate to `i18next + react-i18next` (~3-5 engineering days). **TMS:** Crowdin (~$50/month, content-volume pricing, free translator seats) — significantly cheaper than Lokalise at our scale.

---

## 11. PHI / data-sovereignty model

This is the single highest-priority legal section. None of the cross-business intelligence (Compass mixing clinical context + consumer activity) can ship until these questions are answered.

### 11.1 When does Studio fitness data become PHI?

Under HIPAA (45 CFR § 164.514), information is PHI when it (a) relates to an individual's health AND (b) is held by or transmitted to a covered entity (CE) or business associate (BA). Hollis Studio standalone is neither — it's a consumer wellness app under FTC rules. The boundary shifts when:

1. **Data shared with a clinician inside the clinic** — becomes PHI at point of transfer.
2. **Company-level bridging** — per HHS OCR's December 2022 tracking-technology guidance, a CE operating a consumer app that shares data back into clinic workflows may create a CE-controlled environment for that data even if the consumer app is labeled wellness. **This is the open legal question for Hollis Health LLC operating both entities.**
3. **De-identification failure** — if Compass combines workout data with diagnoses/treatment-plans, the inference output is PHI.

**Default architectural posture (until counsel rules otherwise):** treat the consent opt-in as the bright line. Studio data is non-PHI until the user opts in to share with their clinician. Once opted in, the shared portion becomes PHI.

### 11.2 Compass deployment: Option B (federation), the recommended pattern

The 2026-05-19 design evaluated four options for Compass deployment:

| Option                                              | PHI handling                                | Verdict                                                                                            |
| --------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| A — Single Compass with service tokens + consent gates | PHI in one service; BAA = entire Compass    | Compliance overhead on every consumer engineering decision forever. **Rejected.**                  |
| **B — Two Compass instances + federation**          | Clinic-Compass HIPAA-scoped; consumer-Compass never sees raw PHI | **Recommended.** Clear blast radius. Maps to existing suite pattern (service-token-scoped cross-app reads). |
| C — Compass-as-library deployed per side            | Algorithm crate shared; data planes separate | Conflates "shared algorithm" with "no service" — makes Today Card delivery awkward server-side. Use the shared-algorithm idea (extract `@hollis-studio/compass-core` package), but keep both sides as proper services. |
| D — Single Compass with cell-based tenancy          | Logical separation in one process           | Hardest to audit credibly. **Rejected.**                                                           |

**Option B detail:** clinic-Compass produces a daily `ClinicalContextSnapshot` per consented user (boolean flags + ordinal categories + constraint enumerations — never raw strings, conditions, medications). It signs the snapshot and pushes it to consumer-Compass's read path. Consumer-Compass never makes a synchronous cross-boundary call at serving time. Consent revocation triggers an immediate webhook that purges the cached snapshot within seconds.

### 11.3 Consent model

**Default state (no opt-in):** all Hollis Strength training data lives exclusively in Studio. Hollis Health clinic has no access. Compass runs Studio-side inference only — no PHI in any prompt.

**Opt-in UI (on Hollis Health patient record screen):**

> **"Share your Hollis Strength training data with your care team"**
> Your strength training, cardio, and readiness data from Hollis Strength can inform your clinician's view. Your clinician cannot edit your training data. You can revoke access at any time in Hollis Strength → Settings → Privacy.
> [Share with my care team] [Not now]

Second screen confirms granular data categories (`workout_logs`, `cardio`, `readiness`, `compass_trends`, `ai_insights`) and states the right to revoke.

**Legal characterization:** HIPAA Authorization (45 CFR § 164.508) + consumer consent. Stored with timestamp, version of authorization text, explicit affirmation.

**Revocation:** Honored near-real-time. Writes `revokedAt` to consent record. Clinic-side Compass gates on consent validity before any read. **Data already shared with the clinic remains in clinic records** (HIPAA does not require retroactive deletion of disclosed PHI from CE records); the authorization copy must say so.

### 11.4 Audit trail

Every cross-boundary read produces an append-only `CrossBoundaryAuditLog` entry in the clinic-side database. Service account has INSERT only — no UPDATE, no DELETE. Retention: 6 years minimum (HIPAA § 164.530(j)).

### 11.5 BAA vendor map

| Vendor                       | BAA needed when                                 | Notes                                                                                                                  |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| AWS                          | Clinic workloads run on platform                | Sign via AWS Business Associate Addendum (console). Configure PHI-eligible services only.                              |
| Anthropic Claude API         | PHI in any prompt                               | Anthropic offers BAAs (2025). Use a scrubbing layer to strip 18 Safe Harbor identifiers before any LLM call — minimizes BAA exposure and cost. Sign BAA anyway as belt-and-suspenders. |
| Pinecone / vector DB         | Embeddings from PHI-containing text             | Embeddings of PHI are PHI. If vector search is Studio-only (non-PHI), no BAA needed for that pipeline.                 |
| Sentry                       | If exceptions capture PHI in stack traces       | Sentry HIPAA plan + BAA available. Better: scrub PHI before logging.                                                   |
| Datadog                      | Same as Sentry                                  | HIPAA-compliant config + BAA available.                                                                                |
| **Firebase / Firestore**     | **NEVER for PHI**                               | **Firebase does not offer HIPAA BAAs (2025).** Hard blocker: clinic side must not use Firestore for PHI. The Workouts → Postgres migration resolves this for Studio side; for Health, never put PHI in Firestore. |
| RevenueCat                   | Unlikely — subscription data not PHI            | Review if health-related entitlements map to clinical context.                                                         |
| Apple HealthKit              | Apple is not a BA; governed by Apple's policies | Comply with Apple's health data policies (no selling, no advertising).                                                 |

### 11.6 International overlay

- **GDPR (EU):** Explicit consent (Art. 6(1)(a) + Art. 9(2)(a) for health data). Right to erasure honored on Studio side; clinic-side derived snapshots may be retained per medical-record retention exception. DPAs with all EU-processing vendors.
- **DPDPA (India):** Consent Manager API path if Hollis hits Significant Data Fiduciary threshold (TBD by rulemaking, expected May 2027 full enforcement). Data residency: store India-resident user data in ap-south-1 (Mumbai). Cross-border transfers require explicit consent in opt-in flow.
- **PIPL (China, if ever pursued):** No cross-border transfer without CAC approval. Local storage mandatory. Real-name verification mandatory. Treat all China expansion as a separate engineering workstream.

### 11.7 Open questions for legal counsel (urgent)

1. **Corporate entity structure and HIPAA.** Does Hollis Health LLC operating both clinic (CE) and Studio (consumer app) make the entire LLC a single CE? Or does a subsidiary structure (Hollis Studio LLC) provide clean isolation? **Single most consequential architectural question.**
2. Authorization vs Consent semantics for the opt-in flow.
3. Minimum-necessary standard application — recommend Bridge produces only aggregated summaries, not raw session data.
4. State-law overlay (California CMIA, Texas HB 300, Illinois GIPA) — CCPA/CPRA applies to Studio regardless of HIPAA.
5. Clinician write-back direction — recommend scoping v1 to read-only from Studio (no PHI-to-Studio data flow in the reverse direction).
6. DPDPA SDF threshold monitoring (late 2025 rulemaking).
7. Anthropic BAA scope for Safe-Harbor-de-identified data.
8. **Firebase hard stop.** Confirm legal deadline by which Firestore must be entirely out of any PHI data path.

---

## 12. Subscription strategy

### Pricing tiers

| Region        | Free                  | Hollis Intelligence Individual                  | Trial            |
| ------------- | --------------------- | ----------------------------------------------- | ---------------- |
| US / UK / EU  | Core logging          | $14.99/mo · $119/yr (when ≥3 consumer apps live) | 7 days           |
| US / UK (now) | Core logging          | $9.99/mo · $79.99/yr (single-app pricing)        | 7 days           |
| India         | Core logging          | ₹299/mo · ₹1,499/yr · ₹99/wk                     | 7-14 days        |
| SEA (PH, ID)  | Core logging          | $4.99/mo · $39.99/yr (calibrate per country)     | 7-14 days        |

**Hollis Pro (B2B):** trainer/clinician dashboard, client visibility, compliance/audit features, client seats. 3-10× consumer ARPU; price set per fleet deal.

**Family plan:** later, not at launch.

**Founders / early adopters:** grandfather $79/yr.

### Paywall rules

- Do not interrupt workouts.
- Do not block basic logging.
- Do show locked insights when the data is clearly valuable: *"We found a likely reason your bench stalled. Unlock Smart Coach to view the full explanation."*
- Suite bundle (when ≥3 consumer apps live): one subscription unlocks intelligence across all owned Hollis apps. Do not split subscriptions by app.

### Billing reliability

- ~30% of Play Store subscription cancellations are involuntary billing failures (vs 14% iOS). Implement RevenueCat grace period + retry logic + payment-failure push notifications from day one.
- Apple App Store India supports UPI Autopay for subscriptions natively — no separate integration needed.

---

## 13. App slate detail

### 13.1 Hollis Health (clinic patient portal)

**Standalone promise:** *"Your clinic, in your pocket."* Appointments, labs, vitals, clinician messaging, billing.

**Suite role:** the clinical context source. Pushes redacted `ClinicalContextSnapshot` to consumer-Compass for consented Studio users. Receives nothing back (write-back is v2+, gated on legal review).

### 13.2 Hollis Strength (flagship Studio app)

**Standalone promise:** *"Log as fast as paper. Progress smarter than paper."*
**Suite promise:** *"Your training adapts to your food, sleep, stress, recovery, and real gym equipment."*

**Standalone differentiators:** The Ratchet · Machine-aware Gym Profiles · Best Qualifying Set · Simple Mode · Sunday Review · Plateau diagnosis · Freestyle-to-canonical matching · Program-and-freestyle parity · Offline-first logging.

**Suite differentiators:** Nutrition-aware progression (via Compass) · Recovery-aware session modification · Mind-aware intensity adjustment (when Mood signal exists) · Move-aware mobility prescriptions (Compass-generated, surfaced inside Strength) · Health-aware safety flags (from clinician restrictions, consent-gated) · Clinician/trainer read-only summaries.

**Highest-leverage flow:** Pre-Lift Readiness Card. v1 shipped 2026-05-18 (Workouts-only data). v2 consumes cross-suite inputs via Compass federation.

### 13.3 Hollis Nutrition (Phase 2, gated)

**Standalone promise:** *"Eat for your actual goal, not a generic calorie target."*
**Suite promise:** *"Your nutrition targets understand your training phase, recovery, bodyweight trend, GLP-1 status, hunger, and adherence pattern."*

**Gate criteria:** If MFP / Cronometer import via Compass delivers equivalent cross-app value for paying Strength users, defer native build indefinitely. Greenlight only if users explicitly hit the ceiling of import quality.

**MVP if greenlit:** food logging by search/barcode/saved meals/photo/voice · macros · protein sufficiency · weight trend · weekly check-in · training-phase-aware targets · GLP-1 support · workout-aware meal timing. **Don't fight MyFitnessPal on database size; beat them on interpretation.**

### 13.4 Hollis Compass (server-side intelligence layer)

Not a consumer app. A service. Powers Today Card, Pre-Lift Readiness Card v2, plateau root-cause analysis, prescribed movement, weekly suite recap.

### 13.5 ~~Hollis Recovery~~ (killed as standalone)

Recovery EMA already runs in Hollis Health backend (production). Strength already consumes the readiness signals. A standalone Recovery app would be UI shells over data the suite already reads. Recovery interpretation = Compass surface inside Strength. Recovery clinical data = Health surface.

### 13.6 ~~Hollis Move~~ (deferred, folded into Strength)

ClassPass growth numbers are real (Pilates +66%, low-impact +112%, sports recovery +155% YoY). But a standalone app would lose the content fight to Apple Fitness+, Peloton, and Nike. **Prescribed movement** (mobility flow generated from lift pattern + soreness, via Compass) folds into Strength as a content surface. Revisit only if B2B trainer wedge demand for standalone prescription surfaces emerges.

### 13.7 ~~Hollis Mind~~ (deferred indefinitely)

3.9% Day-15 retention (mental-health app median) is disqualifying. Regulatory exposure for AI in mental health is real. If ever pursued: must be clinician-prescribed via Health, not consumer-direct. Mood / stress signals captured today in the Strength pre-lift questionnaire are sufficient cross-app input for Compass.

---

## 14. Build order (12-month parallel plan)

Two people + AI dev velocity. Tracks below run in parallel where feasible.

### Months 1-2 (immediate, pre-clinic-opening overlap)

**Track A — Clinic opening (Isaac):**
- Fix 7 clinic-readiness gaps (Appointments tab visible, appointment notifications, lab result push, reminders, patient intake, signed-consent download, messaging onboarding prompt).
- Smoke-test on physical devices with real patients.
- Clinic opens W2.

**Track B — Strength launch path (Samuel):**
- Strength rebrand (`app.json`, plist, in-app strings, App Store metadata).
- Quick-win readiness fixes: R8, locale activation, persistentLocalCache, date formats, bundle ID, stub event emission.
- Submission blockers: Sign in with Apple verification, demo account, IAP products, screenshots.

**Track C — Shared infrastructure (both, async):**
- Hollis Identity Service AWS staging deploy.
- Health → Identity feature-flag cutover (D-week soak).
- workouts-server W5c CRUD handlers (start).
- `@hollis-studio/contracts-core` extraction (non-breaking).

### Months 3-4

**Track A — Clinic operational:**
- Stabilization. Monitor crash rates, fix P0s. No consumer-feature touching.

**Track B — Strength launched + Compass groundwork:**
- US + UK launch.
- Workouts → Postgres ETL script.
- Mobile client cutover off Firebase (Steps 5-9 of suite migration).
- New Compass repo scaffold. Consent ledger schema.

**Track C — Health re-scope begins (W5+):**
- W5 heads-up email.
- W6 hide Nutrition + Plans tabs via feature flag (OTA).
- W7 dashboard refocus (OTA).
- contracts split phases 2-3 (consumer + clinical + compass packages, with re-export shims).

### Months 4-6

**Track A — India entry:**
- Submit Play Store + Indus Appstore India.
- GST OIDAR registration.
- DPDPA privacy policy.
- ASO + micro-influencer seeding.

**Track B — Compass v1:**
- Deterministic snapshot function (pure, no LLM): training state + external data.
- Apple Health / Health Connect ingestion path (mobile → studio-api → SQS → Compass).
- WHOOP / Oura OAuth2 poll workers.
- AI narration layer (Anthropic Claude API, narration only).
- Today Card + Pre-Lift Readiness Card v2 data endpoints.

**Track C — Web dashboard v1:**
- Consumer view: Today Card, training week, Compass insights.
- Clinician/trainer view: client list, training history, Compass clinical summary.
- Cross-app service tokens (clinic-api → studio-api, clinic-api → Compass).

### Months 6-9

**Track A — Cross-suite proof + B2B:**
- studio-api `GET /clients/:userId/sessions` route (service token, RBAC-gated).
- clinic-api consumes it in web-admin training panel (suite migration Step 10).
- B2B trainer fleet: multi-client trainer view in web dashboard, fleet pricing, Stripe metered-seat billing.

**Track B — Compass v2:**
- MFP / Cronometer import (CSV v1, OAuth when API access permits).
- Plateau root-cause analysis across imported nutrition + Apple Health recovery + Strength data.
- Protocol generation v1.
- Honest-hedge output type wired through AI prompt builders.

**Track C — Philippines launch:**
- Same app, regional pricing, ASO localization for tagalog/English keywords.

### Months 9-12

**Track A — Suite consolidation:**
- Suite-level Smart Recap (vision §369-379).
- Prescribed movement flows in Strength.
- Assess Nutrition native build vs continued import-only based on import-quality data.

**Track B — Scale + Indonesia prep:**
- Multi-region studio-api (ap-south-1 for India residency comfort).
- Compass second-region read replica.
- GitHub Packages 1.0.0 for `@hollis-studio/*` packages.
- Bahasa Indonesia localization (4 weeks for UI).

**Track C — Evaluate Move / Mind reopening:**
- If B2B wedge revenue justifies a standalone surface, revisit. Otherwise maintain as Compass surfaces inside Strength.

---

## 15. Naming

- **Hollis Strength** (not "Hollis Lifting," not "Hollis Workouts" long-term, not "Hollis Training"). Clean market positioning. Broad enough to include cardio + Move-adjacent features without a future rebrand. Rebrand happens **before paid launch.**
- Rebrand scope: App Store / Play Console metadata, `app.json` display name, landing page copy, in-app brand strings (Settings → About, splash), `BRAND_NAME` constant + `i18n/en/common.json brand.appName`, social handles. **Bundle ID rename (`com.isaac.woapp` → `com.hollis.strength`) is more invasive** — requires new provisioning profile and an App Store Connect migration. Do bundle ID rename before alternative-store submissions or accept the legacy ID forever.
- Suite naming preserved: Hollis Health, Hollis Strength, Hollis Nutrition, Hollis Compass. The killed/deferred apps (Recovery, Move, Mind) remain valid names if ever reopened.

---

## 16. Main risks (updated 2026-05-19)

1. **Corporate-entity HIPAA exposure.** The single biggest unresolved legal risk. Operating both businesses inside one LLC may extend HIPAA coverage to all Studio data, which would compound compliance overhead. Counsel must resolve before any cross-business code ships. Mitigation: structure Hollis Studio as a separate subsidiary LLC.
2. **Confusing the moat with the surface.** Defensible moat = clinician trust + architectural posture. Surface = consumer Strength + AI explanation + cross-app insights. The risk is investing as if consumer breadth is the moat — building apps to fight Apple/Google/MFP on their own ground — instead of investing in the wedge that incumbents can't replicate. The §2 thesis is the structural defense.
3. **Clinic-opening + consumer-rip-out collision.** If the Health app re-scope runs concurrent with the clinic opening, a botched tab removal could leave actual patients unable to book or message care team. §8 sequencing (rip-out starts W5+, not W1-2) is the structural defense.
4. **Compass without W5c.** Compass cannot read from Strength until workouts-server CRUD handlers exist and Workouts is off Firestore. Sequencing in §14 keeps these dependencies honest.
5. **Time-to-suite-value.** The "Hollis knows why today is different" promise activates when ≥3 data sources exist for a user. External-data integrations (Phase 2.5 from prior vision, preserved here) collapse the timeline from years to months and reframe competitive narrative from "Hollis vs WHOOP" to "Hollis interprets WHOOP."
6. **Schema drift across parallel app teams.** With 2 people building Strength + Compass + Health re-scope concurrently, contracts package design has to lead the apps, not co-evolve. §6 split is the structural defense.
7. **Hardcoded reviewer credentials in shipped bundles.** `APP_REVIEW_CREDENTIALS` ships in every consumer app importing `@hollis-studio/contracts`. Security finding. Fix before any 2026-05-19 release.
8. **Firebase as PHI hard stop.** No HIPAA BAA available. Any PHI in Firestore is a violation. Migration must complete before clinic-side data crosses into Firestore-touching code paths.
9. **Romanticizing China.** Population number is real; the path to those users through a legitimate Western indie-scale product is not. §10.3 preconditions are non-negotiable.
10. **Six-app commitment as default direction.** Even sequenced, the cumulative App Store / paywall / onboarding / support / marketing overhead is enormous. 4-app slate (§2) is the right answer.

---

## 17. Bottom line

The strongest version of Hollis is not "six apps producing one health brain." It is:

> **One company. Two business units. Four apps (down from six). One shared intelligence layer. The only consumer fitness app a clinician trusts. The only clinical care brand a fitness-tech consumer trusts.**

Lead consumer-facing surfaces with:

> **AI explains. Hollis verifies. You decide.**

Lead the clinician / trainer surface with the architectural and compliance posture that incumbents cannot retrofit.

### The 18-month bet (sequenced, parallel-track):

1. **Stabilize the clinic opening** (Track A, Isaac, M1-3). Get the Health app to clinic-portal quality. Don't touch consumer surfaces until W5+.
2. **Ship Hollis Strength on the suite-native stack** (Track B, Samuel, M1-4). Rebrand. R8. India quick-wins. Compass event emission stub. Off Firebase by M4.
3. **Build Compass as a server-side intelligence service** (Track C/B handoff, M3-6) that interprets Strength data + external data from Apple Health, Health Connect, WHOOP, Oura, Cronometer, MFP — so the suite promise activates for one-app users immediately.
4. **Sell the platform to trainers and clinicians as a fleet** (Track A/C, M6-9). This is the actual business.
5. **Cross-promote from Hollis Health's installed base** (Track A, M3+, continuous).
6. **Use the web dashboard to give consumers and clinicians one place to see everything** (Track C, M4-6).
7. **Enter India primary international, Philippines second** (Track A/C, M4-9).
8. **Defer China** until preconditions in §10.3 are met.
9. **Resolve the corporate-entity HIPAA question** (Track A, M1, with counsel) — single highest-priority dependency.
10. **Phase 3 (Nutrition native build) gated on import-via-Compass signal**, not pre-committed.

The six-app consumer expansion (Nutrition, Recovery, Move, Mind plus Hollis Compass as a habit/protocol layer across all of them) remains valid long-term direction. It is now explicitly **scoped down to 4 native + Compass for the 18-month bet**, with the others gated on wedge revenue and explicit demand signal.

The winning product surface is not a dashboard. It is a daily answer the user trusts because a clinician *also* trusts the system that produced it:

> *"Given everything Hollis knows, what should I do today?"*

---

## 18. Citations

Carried forward from the 2026-05-18 vision; new sources from 2026-05-19 research appended.

[1]: https://macrofactor.com/workouts/ "MacroFactor Workouts"
[2]: https://www.grandviewresearch.com/industry-analysis/fitness-app-market "Fitness Apps Market Size & Share — Industry Report, 2033"
[3]: https://sensortower.com/blog/state-of-mobile-health-and-fitness-in-2025 "State of Mobile Health & Fitness Apps 2025"
[4]: https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/future-of-wellness-trends "Future of Wellness Trends Survey 2025 — McKinsey"
[5]: https://acsm.org/top-fitness-trends-2026/ "Top Fitness Trends 2026 — ACSM"
[6]: https://www.revenuecat.com/state-of-subscription-apps/ "State of Subscription Apps 2026 — RevenueCat"
[7]: https://www.strong.app/ "Strong — Workout Tracker & Gym Log"
[8]: https://www.hevyapp.com/ "Hevy — Workout Tracker & Gym Logger App"
[9]: https://fitbod.me/ "Fitbod"
[10]: https://www.onepeloton.com/strength-plus-app "Peloton Strength+ app"
[11]: https://apps.apple.com/us/app/myfitnesspal-calorie-counter/id341232718 "MyFitnessPal — App Store"
[12]: https://www.noom.com/health/glp1companion/ "Noom GLP-1 Companion"
[13]: https://www.whoop.com/us/en/thelocker/new-ai-guidance-from-whoop/ "WHOOP AI Coach"
[14]: https://www.wired.com/story/google-is-rebranding-the-fitbit-app-to-google-health "Google Health Rebrand — WIRED"
[15]: https://developer.apple.com/health-fitness/ "Apple Health & Fitness Developer"
[16]: https://classpass.com/blog/2025-classpass-look-back-report/ "2025 ClassPass Look Back Report"
[17]: https://www.nature.com/articles/s41746-025-01567-5 "Meta-analysis of 92 RCTs — npj Digital Medicine"
[18]: https://formative.jmir.org/2024/1/e62725 "JMIR Formative Research — Digital Phenotyping"
[20]: https://www.grandviewresearch.com/industry-analysis/ai-personalized-nutrition-market-report "AI in Personalized Nutrition Market"
[21]: https://www.marketsandmarkets.com/Market-Reports/mental-health-apps-market-179040407.html "Mental Health Apps Market — MarketsandMarkets"

**Added 2026-05-19:**

[22]: https://msadvisory.com/icp-license-china/ "China ICP License (2026)"
[23]: https://sesamedisk.com/china-pipl-compliance-2026/ "China PIPL Compliance 2026"
[24]: https://fdichina.com/blog/wfoe-registration-in-china-2026/ "WFOE Registration in China (2026)"
[25]: https://en.wikipedia.org/wiki/HealthifyMe "HealthifyMe Wikipedia"
[26]: https://valueforstartups.in/21-healthify "Healthify 2026 investor report"
[27]: https://www.outlookbusiness.com/in-depth/sweat-tech-and-a-funding-freeze-indias-fitness-tech-isnt-slowing-down-even-after-capital-crunch "Cult.fit Series G funding — Outlook Business"
[28]: https://www.cookieyes.com/blog/india-digital-personal-data-protection-act-dpdpa/ "India DPDPA compliance guide — CookieYes"
[29]: https://www.india-briefing.com/news/oidar-compliance-india-gst-registration-ntor-gstr5a-digital-tax-43951.html/ "OIDAR GST compliance — India Briefing"
[30]: https://techcrunch.com/2025/03/13/xiaomi-to-preinstall-phonepes-app-store-on-smartphones-sold-in-india/ "Indus Appstore replaces Xiaomi GetApps — TechCrunch"
[31]: https://support.apple.com/en-kw/108110 "Apple subscriptions India billing"
[32]: https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html "HIPAA Privacy Rule — HHS"
[33]: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html "OCR Tracking Technologies Bulletin (Dec 2022)"
[34]: https://gdpr.eu/ "GDPR official"
[35]: https://www.meity.gov.in/data-protection-framework "DPDPA — MEITY India"
[36]: https://developer.samsung.com/galaxy-store/faq.html "Samsung Galaxy Store Developer FAQ"
[37]: https://global.developer.mi.com/document?doc=quickStart.aboutGetApps "Xiaomi GetApps About"
[38]: https://gs.statcounter.com/os-market-share/mobile/india "India Mobile OS Market Share — StatCounter"
[39]: https://www.rapidnative.com/blogs/react-native-performance-optimization-2026-playbook "React Native Performance Optimization 2026"

---

## Appendix A — Today Card stress test (validation suite)

The Compass engine spec is good if it can produce these 10 concrete Today Card outputs. **6 of 10 work with Strength + external imports alone** (no other Hollis native app required). Full text per card in the 2026-05-19 Today Card stress test deliverable; titles only here:

1. Pre-lift readiness modification (sleep + nutrition + soreness aware).
2. Plateau root-cause analysis across the suite.
3. Minimum viable session offer (when skip is statistically likely).
4. GLP-1 nutrition × training adjustment.
5. Move/mobility prescription from lifting pattern + soreness.
6. Mind-state-aware intervention (stress + skip pattern history).
7. Recovery-debt warning from wearable + training load.
8. Cross-app weekly review insight.
9. Clinician-restriction-aware safety flag (Health context).
10. **"I can't tell yet" honest hedge** — engine refuses to make a claim despite data.

Cards 1, 2, 5, 7, 8, 10 viable with Strength + external imports (no other Hollis app). Card 9 requires Health. Card 4 fully trustworthy only with native Nutrition. Cards 3, 6 require a lightweight mood/stress widget if not a full Mind app.

---

## Appendix B — Open decisions tracker

| # | Decision                                                            | Owner          | Deadline                                  | Status              |
| - | ------------------------------------------------------------------- | -------------- | ----------------------------------------- | ------------------- |
| 1 | Corporate-entity HIPAA structure (single LLC vs subsidiary)         | Legal counsel  | Before any cross-business code ships      | Open, urgent        |
| 2 | Anthropic BAA scope confirmation                                    | Legal counsel  | Before any PHI in LLM prompts             | Open                |
| 3 | Firebase deadline for full PHI exit                                 | Legal counsel  | Before Compass cross-boundary federation  | Open                |
| 4 | Machine-aware gym translation data-acquisition (user / curated / hybrid) | Isaac     | Before marketing the moat                 | Open (from 2026-05-18) |
| 5 | Nutrition native build greenlight (vs import-only indefinitely)     | Samuel + Isaac | Month 9 (post import-quality measurement) | Pending data        |
| 6 | Bundle ID rename (`com.isaac.woapp` → `com.hollis.strength`)        | Samuel         | Before any alternative-store submission   | Open                |
| 7 | Localization tier-2 trigger (when to invest in Hindi UI strings)    | Samuel         | At 10K India DAU                          | Pending metric      |
| 8 | China feasibility re-evaluation                                     | Isaac          | At $2M ARR + dedicated China lead         | Deferred            |
| 9 | App slate re-expansion to 5/6 apps                                  | Both           | At wedge revenue + cross-app activation floors | Deferred       |
| 10| Workouts-server → Studio-server rename                              | Samuel         | Before Nutrition native build, if greenlit | Pending dependency |

End of document.
