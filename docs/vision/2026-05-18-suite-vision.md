# Hollis Suite — Unified Long-Term Vision

> **⚠️ SUPERSEDED 2026-05-19 by [`2026-05-19-suite-vision.md`](2026-05-19-suite-vision.md).** This document is preserved for historical context only. The 2026-05-19 rewrite reflects the Hollis Health LLC bifurcation into two business units (Hollis Health clinic + Hollis Studio consumer suite under Samuel), the concrete server topology decisions, the 4-app slate decision (down from 6), the India-primary international expansion plan, the China-deferred verdict, and the PHI/data-sovereignty Bridge model. Read the 2026-05-19 doc for current direction.
>
> ---
>
> **Status:** Canonical north star, 2026-05-18. **Superseded 2026-05-19.**
> **Owner:** Isaac Landes / Hollis Health LLC.
> **Supersedes:** any prior per-app strategy doc when in conflict.
> **Revision log:**
> - 2026-05-18 — initial capture.
> - 2026-05-18 (same-day addendum 1) — folded in four execution caveats: (1) explicit time-to-suite-value risk and narrower defensible niche framing (deep strength + clinical, not breadth-of-signal); (2) data-acquisition strategy required before machine-aware gym translation is claimed as a moat; (3) kill criterion before Phase 4 (Recovery); (4) "AI explains. Hollis verifies. You decide." promoted as the explicit consumer line, with Strength rebrand timed before paid launch.
> - 2026-05-18 (same-day addendum 2 — **strategic refinement**) — sharpened the primary thesis from "six apps producing one health brain" to **"the only consumer fitness app that a clinician will trust."** The clinician/trainer-interoperability wedge becomes the moat; the six-app consumer suite becomes the long-term expansion, gated on the wedge funding it. Added a "Suite leverage" section with five moves to make the suite useful with fewer apps (cross-promote from Health, web dashboard before native apps, external-data integration, server-side Compass before Phase 4, B2B trainer/clinician fleet sales). Engineering rigor reframed as hedge, not moat.
> - 2026-05-19 — **SUPERSEDED by bifurcation rewrite.** See [`2026-05-19-suite-vision.md`](2026-05-19-suite-vision.md).

---

## Positioning line (the one to lead with)

> **AI explains. Hollis verifies. You decide.**

This is the consumer-facing version of the deterministic-core / AI-shell architecture. Every landing page, app store description, and pre-launch communication should lead with some variation of this. It is the most under-marketed line in the entire vision: every competitor now claims "AI" — almost none of them can claim *constrained, verified, user-authoritative* AI. That is the defensible difference, and it should be on the surface, not buried in an architecture doc.

---

## Strategic refinement — the sharper thesis

> **Hollis is the only consumer fitness app that a clinician will trust.**

The original framing — "one health intelligence system expressed through six focused apps" — is directionally right but speculative on a 3–5 year timeline. The defensible asset *today* is the one most fitness competitors cannot replicate at any price: Hollis Health already has medical credibility, real clinical surface area, and the architectural discipline (HIPAA, audit logging, deterministic-core, typed cross-app reads) to back it up. That is the moat. Everything else — gym profiles, AI coaching, machine-aware translation, suite breadth — is contestable. Clinical trust is not, because incumbents have already shipped AI-generated training plans that hallucinate, and consumer-fitness brands cannot retrofit the regulatory posture.

**What this changes in priority order:**

1. The **near-term Hollis product** is Strength + external data + a server-side intelligence service (Compass), sold to consumers on the verified-AI line and to trainers/clinicians on interoperability. Not six native apps.
2. The **six-app suite** is preserved as long-term direction, but the consumer breadth (Nutrition, Recovery, Move, Mind) is **funded by the wedge**, not built ahead of it. Treat them as Phase 4+ optionality contingent on the clinician/trainer business throwing off revenue, not as a five-year roadmap commitment.
3. The **engineering discipline** (deterministic core, Result<T>, 17-checker preflight, layered architecture, type purity) is reframed honestly: it is a *hedge against breakage*, not a *moat*. Consumer users do not buy because of architecture; clinicians/trainers do because architecture is table stakes for the trust they sign their license to.
4. The **marketing wedge is narrow on purpose.** "The strength app for people who think about training the way MFW users think about nutrition, that a clinician can actually trust" is a smaller addressable audience than "everyone with a gym membership" — and that's correct. Win the narrow audience first; expand only when that audience funds it.

This refinement does not replace the six-app vision below. It *gates* it. Read the rest of this doc as the long-term direction; read this section as the bet you're actually making in the next 18 months.

---

## Executive read

Hollis Workouts is technically stronger than most first-launch fitness apps. The problem is that the market has moved. "AI workout builder," "smart progression," "gym profiles," "nutrition integration," and "personalized coaching" are no longer rare claims. MacroFactor Workouts in particular is now a real direct threat because it advertises structured strength programs, rule-based smart progression, RIR, custom exercises, smart swaps, multiple gym profiles, equipment weights, and integration with MacroFactor Nutrition. That means Hollis cannot rely on "gym profiles plus AI" as the headline differentiator anymore.

The real advantage is deeper: **deterministic health intelligence across multiple apps, with AI as the explanation layer, not the authority layer.** The Workouts docs already define this well — clipboard-with-a-pencil logging, Gym Profiles, The Ratchet, and an AI layer that reduces friction while the core analytics stay deterministic. The suite docs already describe the architecture needed to make this real: one identity, separate app backends, typed API contracts, shared JWT claims, and cross-suite reads without direct database coupling.

The strategy:

**Hollis is not six wellness apps. Hollis is one health intelligence system expressed through six focused apps.**

If each app is just "pretty good in its niche," Hollis gets buried by incumbents. If each app produces clean structured data that makes every other app smarter, the suite has a defensible reason to exist.

---

## Market reality, 2026

The opportunity is real, but it is crowded.

The global fitness app market was estimated at **$12.12B in 2025**, projected to reach **$33.58B by 2033**, with exercise and weight loss the largest revenue segment ([Grand View Research][2]). Sensor Tower reported global Health & Fitness app downloads at **3.6B** across iOS and Google Play, up 6% YoY ([Sensor Tower][3]). McKinsey's 2025 wellness survey frames wellness as a **$2T global market** and says millennials and Gen Z treat wellness as a daily, personalized practice rather than an occasional purchase ([McKinsey][4]).

ACSM's 2026 trends line up almost perfectly with where Hollis should go: wearable technology (#1), older-adult fitness, exercise for weight management, mobile exercise apps, and balance / flow / core strength ([ACSM][5]). Strength, nutrition, recovery, low-impact movement, and behavior change.

RevenueCat's 2026 subscription benchmark says Health & Fitness apps have a **37.7% median trial-to-paid conversion rate**, one of the strongest categories ([RevenueCat][6]). The subscription opportunity is there, but the category attracts aggressive competition.

The competitive market is splitting into five buckets:

1. **Pure gym loggers** — Strong, Hevy. "Think less, lift more"; broad features like supersets, custom exercises, Apple Health, charts, export ([Strong][7]). Hevy has pushed social hard, claiming 13M athletes ([Hevy][8]).
2. **Adaptive strength** — Fitbod, MacroFactor Workouts, FitnessAI, Peloton Strength+. Fitbod advertises customized workouts based on goals, equipment, recovery, proprietary algorithms ([Fitbod][9]). MacroFactor Workouts matters most: rule-based, structured programs, multiple gym profiles, equipment weights, nutrition integration ([MacroFactor][1]). Peloton Strength+ at $9.99/mo with coached content ([Peloton][10]).
3. **Nutrition giants** — MyFitnessPal, MacroFactor Nutrition, Cronometer, Noom. MyFitnessPal now positions as AI-powered tracker with GLP-1, meal scanning, macros, 40+ connected trackers ([App Store][11]). Noom pushes GLP-1 companion support, protein, muscle preservation, behavior change ([Noom][12]).
4. **Wearable-first** — WHOOP, Oura, Garmin, Fitbit/Google Health, Apple Health. WHOOP is moving toward AI guidance connecting recovery, sleep, strain ([WHOOP][13]). Google is rebranding Fitbit into Google Health with premium AI Health Coach, medical records, HealthKit/Health Connect support ([WIRED][14]). Apple HealthKit and Android Health Connect both exist explicitly to let apps combine data across domains ([Apple Developer][15]).
5. **Content & wellness** — Nike Training Club, Apple Fitness+, Ladder, Headspace, Calm, Pilates apps. ClassPass data: Pilates the most booked workout globally for the third year in 2025, up 66% YoY; low-impact training up 112%; sports recovery up 155% ([ClassPass][16]). Mental health apps grow but have an evidence/retention problem: a 2025 meta-analysis of 92 RCTs found moderate effects but inconsistent engagement reporting ([Nature][17]); a JMIR study cites median 15-day retention of 3.9% across 93 mental-health apps ([JMIR][18]).

The market does not need another generic habit app, meditation library, AI chatbot, or workout generator. It needs a system that can connect what the user did, how their body responded, what pattern is forming, and what the next small action should be.

---

## Current Hollis Workouts assessment

The best parts of Hollis Workouts are legitimately strong.

**The clipboard philosophy is correct.** Logging must stay fast, obvious, and low-cognitive-load. Strong's staying power comes from this exact instinct. Hollis should not sacrifice that for AI spectacle.

**The Ratchet is a good product idea because it creates trust.** A lot of adaptive systems feel like black boxes that can randomly punish or confuse the user. A baseline that does not go down without explicit consent gives the app a moral stance: "we protect your progress unless you ask us to make things easier." That is marketable.

**The deterministic-core / AI-shell rule is the most important architectural principle in the entire product.** AI never computes numbers affecting training state; every AI prompt gets a fresh deterministic snapshot; high-stakes mutations require diff-preview confirmation; proactive AI is gated by statistical noise floors. This is exactly the right approach for health software. It also gives a sharper message than "AI coach":

> **AI explains. Hollis verifies. You decide.**

**The metric basket is serious:** gated E1RM, EWMA trend smoothing, Best Qualifying Set, weekly hard sets, relative strength score, rep-range pivots, confidence bands, rep-banded PRs, plateau detection requiring both E1RM and BQS flattening. That is more rigorous than most consumer gym apps need, but it gives a strong engine.

The weakness is that the product may currently be stronger as an engine than as a consumer promise.

Mainstream users do not buy "Wathan-gated E1RM with confidence bands." They buy "tell me what to lift today without being wrong." Advanced users may appreciate the details, but even they need the surface workflow to be dead simple.

Gym Profiles alone are no longer enough. MacroFactor Workouts now advertises multiple gym profiles with exact equipment, plate denominations, machines. Hollis can still beat this, but only if the gym system becomes more than "which equipment exists here." It needs to become a **gym translation layer**:

- A Life Fitness chest press at Gym A with 10 lb starting resistance is not the same as a Hammer Strength plate-loaded press at Gym B.
- Both can map to the same canonical movement pattern.
- Progression history stays unified, but local recommendations account for the machine instance.

"Gym Profiles" is now a feature. **"Machine-aware progression translation across gyms" is a product moat.**

---

## What the market lacks most

The gap is not tracking. Tracking is solved.

The gap is **interpretation across domains.**

A user can already track workouts in Strong or Hevy, nutrition in MacroFactor or MyFitnessPal, sleep in Oura or WHOOP, steps in Apple Health, stress in Headspace, habits in Streaks. Each app mostly acts like its own world. Even when apps sync data, they rarely share a deep enough model to produce useful causality.

The missing consumer promise:

> "Your app should know why today is different."

Not "you slept badly." Not "you missed protein." Not "your squat is flat." The useful insight is:

> "Your squat target should stay protected, but today's session should reduce accessory volume because your sleep debt is high, your calories have been low for three days, and your last two sessions showed higher RIR drift than expected."

That is where Hollis can win.

---

## The full six-app suite

Habits should not be one of the six standalone apps. Habit tracking is crowded and usually thin. Hollis builds habits as a **shared protocol layer** across every app, not as a generic checkbox app.

The six apps:

1. **Hollis Health**
2. **Hollis Strength** *(currently "Hollis Workouts")*
3. **Hollis Nutrition**
4. **Hollis Recovery**
5. **Hollis Move**
6. **Hollis Mind**

Shared layer: **Hollis Compass** (intelligence layer + protocols).

### 1. Hollis Health

Clinical and administrative anchor. Identity, provider workflows, health records, labs, vitals, clinician/admin access, permissions, higher-trust health context.

Strategic role is not to compete with Apple Health / Google Health as a passive data dashboard — they own the platform layer. Hollis Health is the **trusted health context layer** for the suite:

> "What medical, biometric, and care-context information should the other Hollis apps be allowed to consider?"

Examples:
- Clinician marks a client as recovering from a shoulder injury → Strength avoids overhead pressing unless cleared.
- User has high BP flagged in Health → Recovery and Strength avoid aggressive "push harder" messaging after poor sleep or high stress.
- Clinician reviews client lifting history from inside Health Admin — the cross-suite proof: Health web-admin reads Workouts data through workouts-server with a service-token-scoped JWT, typed API, RBAC, and audit logging.

Business wedge: most consumer fitness apps cannot credibly bridge consumer self-tracking with clinician/trainer visibility.

### 2. Hollis Strength (was Hollis Workouts)

The strength and gym intelligence app.

**Standalone promise:** "Log as fast as paper. Progress smarter than paper."
**Suite promise:** "Your training adapts to your food, sleep, stress, recovery, and real gym equipment."

Standalone differentiators:
- The Ratchet
- Machine-aware Gym Profiles
- Best Qualifying Set
- Simple Mode
- Sunday Review
- Plateau diagnosis
- Freestyle-to-canonical matching
- Program and freestyle parity
- Offline-first logging

Suite differentiators:
- Nutrition-aware progression
- Recovery-aware session modification
- Mind-aware intensity adjustment
- Move-aware mobility prescriptions
- Health-aware safety flags
- Clinician/trainer read-only summaries

The highest-leverage flow is the **Pre-Lift Readiness Card** — appears before the itinerary, one action, one reason, one override:

> "Today: keep main lifts, reduce accessory volume by 2 sets. Reason: sleep debt high, protein low yesterday, soreness elevated. Your baseline is protected."

### 3. Hollis Nutrition

The next app after Strength. Don't try to beat MyFitnessPal on database size — that is a bad fight. Focus on **training-aware nutrition**.

AI in personalized nutrition was estimated at **$1.54B in 2025**, projected to reach **$10.21B by 2033** ([Grand View Research][20]).

**Standalone promise:** "Eat for your actual goal, not a generic calorie target."
**Suite promise:** "Your nutrition targets understand your training phase, recovery, bodyweight trend, GLP-1 status, hunger, and adherence pattern."

Core:
- Macro targets
- Food logging by search, barcode, saved meals, photo, voice
- Protein sufficiency score
- Weekly weight trend
- Expenditure estimate
- Meal timing around workouts
- GLP-1 support: hunger, satiety, cravings, side-effect logs
- Adherence-neutral check-ins, not shame-based coaching

MyFitnessPal now advertises GLP-1 tracking, reminders, symptoms, side effects, AI food tracking ([App Store][11]). Noom frames GLP-1 around long-term behavior change, protein, muscle preservation ([Noom][12]).

Hollis differentiates by connecting GLP-1 nutrition to resistance training:

> "Your weight is dropping, but your pressing strength and protein are both down. Keep the deficit, but raise protein and reduce volume slightly for 7 days to protect lean mass."

### 4. Hollis Recovery

Device-agnostic. Do not try to become Oura or WHOOP — they have hardware. Hollis Recovery is the **interpretation layer** across Apple Health, Health Connect, wearables, Strength, Nutrition, Mind, and Health.

**Standalone:** "Know what your body can handle today."
**Suite:** "Recovery changes your workout, nutrition, and habit plan automatically, with your approval."

Core: sleep duration/consistency, HRV/RHR trend, training load, recovery debt, soreness/pain, caffeine/alcohol notes, illness watch, deload recs, injury-risk flags, readiness explanation, recovery protocols.

Wearables are #1 in ACSM 2026 ([ACSM][5]). The platform giants are moving toward AI interpretation. Hollis says:

> "Bring your wearable. Hollis makes the data actionable."

This app protects Strength from overtraining and Nutrition from oversimplified dieting.

### 5. Hollis Move

Pilates, mobility, yoga, low-impact strength, corrective movement, core, balance, flow, active recovery.

**Standalone:** "Low-impact training that actually supports your body."
**Suite:** "Mobility, Pilates, and recovery work prescribed from your lifting, soreness, posture, pain, and stress data."

Pilates and low-impact are not fringe — ClassPass reported Pilates up 66% YoY in 2025, low-impact up 112%, sports recovery up 155% ([ClassPass][16]). ACSM has balance, flow, and core strength in the top five for 2026 ([ACSM][5]).

Not a generic video library — Nike, Apple, Peloton, and thousands of Pilates apps will bury that. Build **prescribed movement**:

- Bench plateau + shoulder discomfort → 12-min scapular control and thoracic mobility flow.
- Squat depth limited → hip and ankle mobility sequence.
- High stress + low readiness → low-impact Pilates instead of missed workout.
- Older user → balance and core plan tied to strength preservation.
- Post-workout → automatic 8-min recovery sequence based on trained muscle groups.

Expands the audience beyond male lifters. Stronger female, older-adult, beginner, and recovery-focused channels without diluting Strength.

### 6. Hollis Mind

Mental fitness, not "AI therapist."

**Standalone:** "Understand your stress patterns and regulate faster."
**Suite:** "Your mood, stress, sleep, and motivation patterns help Hollis protect your consistency."

Mental health apps market: **$9.94B in 2025 → $22.73B by 2030** per MarketsandMarkets ([M&M][21]), but the same market faces validation, regulation, and retention problems. Engagement is a persistent issue ([JMIR][18]).

Hollis Mind does not overclaim, diagnose, or replace therapy. Structured, low-risk tools: mood/stress check-ins, guided breathing, journaling, CBT-style reflection, sleep wind-down, motivation state, burnout risk, training anxiety, food-craving context, crisis escalation and safety resources.

Differentiator is context. Not "try breathing" — instead:

> "You usually skip training after two high-stress workdays and poor sleep. Today's plan is a 20-minute minimum session plus a 3-minute downshift before you leave."

---

## The shared layer: Hollis Compass

This is where habits belong.

A standalone habit tracker asks: "Did you do the thing?"
A Hollis Protocol asks: **"Which tiny action moves your current health state forward?"**

A protocol could be: "Protein by 10 a.m." · "Walk 10 min after lunch." · "Start bedtime routine by 10:15." · "Do shoulder prep before push day." · "Log mood before caffeine." · "Take GLP-1 dose reminder." · "6 min breathing before sleep." · "Minimum viable workout today."

Each protocol is generated from app data, not manually invented from scratch.

Define shared objects in `@hollis-studio/contracts`:

- `Protocol`
- `ProtocolTrigger`
- `ProtocolCompletion`
- `AdherenceWindow`
- `NudgePolicy`
- `SuppressionReason`
- `CrossAppInsight`
- `UserConsentScope`
- `InterventionSuggestion`

Each app creates and consumes protocols. Strength prescribes a mobility protocol. Nutrition prescribes a protein protocol. Recovery prescribes a sleep protocol. Mind prescribes a stress protocol. Health restricts or approves protocols based on clinical context.

This avoids the mistake of building a generic "Hollis Habits" app before there's enough cross-suite data to make it special.

---

## The suite data flywheel

Core architecture:

- Each app owns its own database.
- Each app emits typed events.
- Shared contracts define event shape.
- A Hollis Intelligence service builds a weekly and daily deterministic snapshot.
- AI can narrate, prioritize, and explain, but cannot mutate health or training state without deterministic validation and user confirmation.

Matches the existing suite direction: separate app databases, typed API contracts, shared JWT issuer, cross-app reads through service-token-scoped routes rather than direct DB access. See [`architecture/suite-infrastructure-migration.md`](../architecture/suite-infrastructure-migration.md) and [`architecture/shared-auth-migration-checklist.md`](../architecture/shared-auth-migration-checklist.md).

The shared daily snapshot includes:

- **Training state** — volume, intensity, BQS, E1RM confidence, soreness, missed sessions, plateau flags.
- **Nutrition state** — calories, protein, bodyweight trend, deficit/surplus estimate, meal timing, hydration, GLP-1 notes.
- **Recovery state** — sleep, HRV/RHR, recovery debt, illness flags, pain.
- **Mind state** — mood, stress, motivation, anxiety, burnout indicators.
- **Movement state** — mobility, low-impact sessions, pain response, balance/core work.
- **Health state** — vitals, relevant conditions, clinician restrictions, labs if permitted.
- **Habit state** — adherence patterns, friction times, streaks, skipped protocols, recovery wins.

The user-facing output is not a massive dashboard. It is a **Today Card**:

> "Best move today: keep your workout, but cap accessories at 6 hard sets. Your sleep was short, but your protein and bodyweight trend are fine. Main lift target is still safe."

Tap "why" to see the deterministic snapshot. That is the product.

---

## Strength features that separate Hollis fastest

### 1. Machine-aware gym translation

The most important Strength-specific differentiator — *conditional on solving the data-acquisition problem*.

Don't describe it as "Gym Profiles." Describe it as:

> "Progress across every gym without corrupting your numbers."

Flow: user selects gym → Hollis knows the machine instance → app maps local equipment to canonical movement → targets adjusted for base weight, stack increments, resistance type, user history → progress charts unified, local recommendations realistic.

Valuable for commercial gym users, travelers, college students, trainers, anyone switching between home and gym.

**Data-acquisition reality check (do not skip).** This is only a moat if Hollis has the canonical machine-to-movement-pattern map. Three approaches and their honest tradeoffs:

| Approach | Cost | Quality | Defensibility |
|---|---|---|---|
| User-contributed (each user maps their gym) | Low | Inconsistent | None — MacroFactor already does this |
| Curated + crowdsourced (Hollis seeds canonical mappings; users contribute corrections) | Medium ongoing | High | Real, compounds with users |
| Fully curated (Hollis staff maps every machine instance) | Very high | Highest | Real, but burns runway |

**Decision required before claiming this as the differentiator:** which approach, and what's the seed-data plan for the first 200 commercial gyms (or however many is the floor for "useful at launch"). Without that plan committed, the marketing line above is a promise the product can't keep, and MacroFactor's user-defined gym profiles becomes the comparable-enough alternative. Track this decision and its seed-data milestone in [`hollis-shared/docs/architecture/`](../architecture/) when locked.

### 2. One-tap adaptive workout changes

When readiness is low, don't make the user rebuild the workout. Offer:

- Keep plan
- Reduce accessories
- Swap heavy compound for machine variant
- Technique day
- Minimum session
- Full deload

All with diff preview. (Existing AI integration spec already requires diff-preview confirmation for high-stakes suggestions.)

### 3. Plateau root-cause analysis across the suite

Normal app: "You plateaued."
Hollis: "Likely cause: not enough recoverable volume signal. Your hard sets stayed high, but sleep was down 4 of 7 days and protein was below target 5 of 7 days. Recommendation: keep bench target, reduce triceps isolation this week, raise protein target by 20g."

Where the suite beats single apps.

### 4. Minimum viable session

When a user is likely to skip, offer a tiny session that preserves identity: "One main lift, one back-off set, one accessory. 18 minutes."

The product should protect consistency, not just optimize performance.

### 5. Smart Recap becomes suite-level

Current Smart Recap is stories-style and shareable. Eventually the suite's weekly health story:

- Training: PR or plateau
- Nutrition: adherence and bodyweight trend
- Recovery: sleep/recovery debt
- Mind: stress pattern
- Move: mobility/core support
- Protocol: the one habit that mattered most
- Next week: one plan adjustment

Makes the full subscription feel like one product, not six subscriptions.

---

## Suite leverage — making the suite useful with fewer apps

The original vision compounds at the user level only when ≥3 apps share data on the same user. That is a 2–3 year timeline at best. Five moves collapse time-to-suite-value from years to months, in increasing order of leverage:

### 1. Eat Health's installed base
Every Hollis Health user is a pre-warmed Strength lead. The relationship, the trust, and the data permission are already there. Build cross-promotion into Hollis Health *now*: in-app banner, settings entry, post-onboarding suggestion ("you have a fitness goal — try Hollis Strength"). Lowest-cost acquisition channel Hollis has. The suite makes it natural — same brand, same identity, same billing entity, same clinician if applicable. This is doable in the same release cycle as the Strength launch.

### 2. Web dashboard as the suite illusion before native apps exist
A `hollis.health/dashboard` web property that shows training today and reserves placeholders for nutrition / recovery / mind creates the "one health brain" perception cheaply. It gives the landing page somewhere to point, captures email/account creation, and lets clinician/trainer dashboards live on the web (where they belong anyway — clinicians work on desktop, not phones). The web property is cheaper than a native app, requires no App Store cycle, and pre-sells the suite story without spending native-app development on speculative consumer segments.

### 3. External-data integration before more native apps
Apple Health, Health Connect, WHOOP, Oura, Cronometer, MyFitnessPal export. Let single-app users experience the cross-domain interpretation *today* using data they already have. This is the most leveraged version of Phase 4 thinking: you get the suite-promise experience without writing five more apps. It also reframes the competitive narrative from "Hollis vs. WHOOP" (a fight you'd lose) to **"Hollis interprets WHOOP"** (a fight you can win). Compass narrates the imported data; the user gets the cross-app insight; Hollis becomes the layer above the wearables, not a competitor to them.

### 4. Build Compass as a server-side intelligence service *now*, not after Phase 3
The protocols / insights / cross-app narration engine ("Today Card", Pre-Lift Readiness Card, plateau root-cause analysis) is the actual product surface that distinguishes Hollis. It does not have to wait for app 3. Build the service against Strength data + external data integrations (#3) immediately, with extensibility for Nutrition, Recovery, etc. as they come online. When Phase 3 (Nutrition) ships, Compass already exists and just gets a new data source — instead of being built reactively to ship app-3 features. Sequencing this earlier also forces the deterministic-snapshot architecture to be real, not aspirational.

### 5. B2B trainer / clinician fleet sales
One trainer with 10 clients = 10 paying users acquired in a single sale. Hollis Health's admin pieces already exist; extending the model to Strength is incremental. Trainer / clinician seats command 3–10× consumer ARPU and have far longer LTV (clinicians don't churn on a paywall confusion the way consumers do). This is a different funnel, a different sales motion, and a different pricing surface than the consumer subscription — but it is also the closest thing to a defensible business this suite has, because the regulatory and architectural cost-of-entry is genuinely high for competitors.

**The reframe in one sentence:** make the suite useful with fewer apps, and let the apps that *do* ship be funded by the clinician/trainer business, not by speculation that consumer ARPU alone supports a six-app surface.

---

## Subscription strategy

The current Workouts price ($9.99/mo or $79.99/yr) is reasonable for a single fitness app. Once the suite is real, a full six-app intelligence bundle at $79.99/yr is probably underpriced.

Structure:

- **Free** — core logging and basic tracking in each app.
- **Hollis Intelligence Individual** — $14.99/mo or $119/yr once ≥3 consumer apps are live.
- **Founders/early adopters** — grandfather $79/yr.
- **Hollis Pro** — trainer/clinician dashboard, client visibility, compliance/audit features, client seats.
- **Family plan** — later, not at launch.

Do not split subscriptions by app once the suite exists. The value is data sharing. One subscription unlocks the intelligence layer across all owned Hollis apps.

Paywall stays contextual, but the rule is sharper than "never proactively upsell":

- Do not interrupt workouts.
- Do not block basic logging.
- Do show the user the locked insight when the data is clearly valuable.

> "We found a likely reason your bench stalled. Unlock Smart Coach to view the full explanation."

That is relevant, not predatory.

---

## Build order

### Phase 1: Launch Workouts/Strength cleanly

Don't keep expanding before launch. Finish RevenueCat / App Store / Play Console / landing page blockers, polish the demo workout, ship. Paid launch is blocked mainly by user-side subscription setup, landing page, and sandbox/tester work.

Landing page does not over-index on AI. Lead with:

> "Fast gym logging. Progression that doesn't lie. Intelligence that knows the rest of your health."

### Phase 2: Make Strength suite-native

Finish Identity, workouts-server, Firestore → Postgres, local SQLite/REST cutover, first Health Admin cross-suite read. The migration plan in [`architecture/suite-infrastructure-migration.md`](../architecture/suite-infrastructure-migration.md) has the right dependency order; Step 10 proves the architecture.

Do not build four new apps before this is stable. Schema drift and operational drag.

### Phase 2.5: Wedge moves (parallel with or immediately after Phase 2)

**This is the new priority lane created by the strategic refinement.** These moves are not "polish" — they are the actual business. They precede Phase 3 (Nutrition) because they collapse time-to-suite-value and fund the rest of the roadmap.

- **Health cross-promotion to Strength.** In-app banner, settings entry, post-onboarding suggestion in Hollis Health. Lowest-cost acquisition channel; ship in the same release cycle as Strength launch.
- **External-data integrations.** Apple Health, Health Connect, WHOOP, Oura, Cronometer at minimum. Hollis becomes the *interpretation layer above* the wearables, not a competitor to them.
- **Compass server-side intelligence service.** Today Card, Pre-Lift Readiness Card, plateau root-cause analysis, protocol generation. Built against Strength data + imported data, with extensibility for future apps. Forces the deterministic-snapshot architecture to be real now.
- **Hollis web dashboard.** `hollis.health/dashboard` showing training today, placeholders for the rest, full clinician/trainer admin surface (which belongs on web anyway).
- **B2B trainer / clinician fleet sales.** Extend Health's admin model to Strength; build pricing, contracts, and onboarding for fleet customers. Different funnel, different motion, different LTV — and the closest thing to a defensible business in the suite.

### Phase 3: Hollis Nutrition (gated)

Still the highest-leverage second consumer app. Explains weight change, performance dips, recovery problems, GLP-1 muscle-loss risk, adherence. **But gated on Phase 2.5 producing real signal** — specifically on Compass demonstrating cross-app interpretive value against external data, and the clinician/trainer fleet motion proving willingness to pay for the suite proposition.

MVP if and when greenlit: food logging, macros, protein score, weight trend, weekly check-in, training-phase-aware target adjustments, GLP-1 support, workout-aware meal timing. Don't try to beat MyFitnessPal's database in v1. Beat it on interpretation.

If Phase 2.5 produces the signal cheaper through MyFitnessPal *import* than through native Nutrition, consider deferring Phase 3 indefinitely. The wedge is the business; consumer breadth is the speculation.

### Gate before Phase 4 — kill-criterion check (revised under refinement)

Phase 4 (additional consumer native apps) is gated on **the wedge funding it**, not on intuition or sunk cost. Pre-commit to these floors in writing:

- **Wedge-revenue floor:** B2B trainer/clinician fleet revenue + premium consumer ARR covers the cost of an additional consumer-app team for ≥12 months *without dipping into reserves*. If the wedge isn't paying for the next app, the next app doesn't ship.
- **Retention floor:** Strength + Nutrition combined Day-30 retention ≥ a target set when Nutrition launches (suggested floor: comparable to RevenueCat's Health & Fitness median).
- **Cross-app activation floor:** ≥ X% of paying Strength users also use Nutrition within 14 days of Nutrition install — evidence that the suite-promise resonates, not just the standalone-promise.
- **Subscription floor:** Hollis Intelligence bundle trial-to-paid conversion ≥ Y% (calibrate against single-app baseline).
- **Qualitative signal:** at least Z documented examples of users (or clinicians on behalf of users) referencing the cross-app insight as a reason to keep paying.

If any floor is missed by ≥30% at the gate, the response is **not** "build Recovery anyway." The response is: extend Strength + Nutrition + Compass + wedge iteration until the signal is real, or accept that consumer breadth isn't the right expansion and double down on the wedge instead. The point of writing this down now is to make it harder for sunk-cost reasoning to override the signal later.

### Phase 4: Recovery → Move → Mind (gated, optional)

Recovery completes the basic performance triangle: training, food, sleep/recovery. Move comes next because Pilates, mobility, low-impact, and recovery are growing fast and broaden the audience. Mind comes after — strategically important but needs careful guardrails, clinical disclaimers, crisis routing, evidence-sensitive language. **All three are now explicitly optional** — they exist as a roadmap if the wedge funds them, not as a commitment that drives the team's scope. If external-data integrations + Compass deliver the "interpretation layer above wearables" value at lower build cost than native Recovery, native Recovery is deferred indefinitely.

---

## Naming

"Hollis Workouts" is serviceable but generic. Better:

- **Hollis Lift** — if mainly strength and gym training.
- **Hollis Strength** — clearer market positioning.
- **Hollis Training** — strength + cardio + programs.
- **Hollis Workouts** — broad mass-market flexibility.

Pick: **Hollis Strength** for the app, with "Hollis Workouts" as the category descriptor. Sounds more intentional and less like a generic workout-video app.

**When to do the rebrand: before paid launch, not after.** App Store search rank, review history, and ASO keywords compound. Renaming after 5,000 reviews under "Hollis Workouts" is a strictly worse trade than renaming during a pre-launch window. Treat the rebrand as a Phase 1 prerequisite, not a Phase 2 polish. Concrete scope: `app.json` display name, App Store / Play Console metadata, landing page copy, in-app branding strings, social handles, package/folder names *only if cheap* (don't break imports for cosmetics).

Suite:

- Hollis Health
- Hollis Strength
- Hollis Nutrition
- Hollis Recovery
- Hollis Move
- Hollis Mind

Shared layer: **Hollis Compass** — implies direction, not automation.

---

## Main risks

1. **Confusing the moat with the surface.** The defensible moat is *clinician trust + architectural posture* (HIPAA, audit, deterministic core, typed cross-app reads). The surface is *consumer Strength + AI explanation + cross-app insights*. The risk is investing as if consumer breadth is the moat — building six apps to fight Apple, Google, and MFP on their own ground — instead of investing in the wedge that incumbents can't replicate. The Strategic Refinement section is the structural defense against this risk; ignoring it is the most expensive mistake on the board.
2. **Time-to-suite-value.** The "Hollis knows why today is different" promise only activates when ≥3 data sources are live for a user. Without external-data integration (Phase 2.5 §3), that's a 2–3 year wait — during which Apple Health Coach, Google Health, WHOOP, and MFP all race toward the same surface with passive sensor data Hollis cannot replicate. External-data integration collapses this from years to months and reframes the competitive narrative from "Hollis vs. WHOOP" to "Hollis interprets WHOOP."
3. **Engineering rigor mistaken for a moat.** Deterministic core, Result<T>, 17-checker preflight, layered architecture, type purity — these are *hedges against breakage*, not reasons users buy. Consumer users buy "easy to log" and "shows progress." Clinicians buy because architecture is *table stakes* for the trust they sign their license to. The discipline is necessary; it is not sufficient. Marketing has to come from positioning and distribution, not from architecture diagrams.
4. **Overbuilding before product-market signal.** Serious engineering discipline doesn't help unless the first 30 seconds feel obvious. The Phase 4 kill-criterion gate exists to make this risk concrete; the Strategic Refinement makes it actionable by defunding native-app expansion until the wedge pays for it.
5. **Metric overload.** The engine is advanced; the UI should be simple. Most users see "do this today." Advanced users open the math. Clinicians see the audit trail.
6. **Assuming AI is differentiating.** It isn't. Every app claims AI. The differentiator is **verified AI constrained by deterministic health logic** — and that line needs to be on the landing page, not just in the architecture doc.
7. **Underestimating MacroFactor Workouts on the consumer-fitness surface.** They are directly in lane: science-based positioning, structured programming, rule-based progression, RIR, multiple gym profiles, nutrition bundle potential. Hollis does **not** beat MFW by being a slightly better fitness app. Hollis beats MFW by being on a different surface — clinician/trainer interoperability that MFW cannot ship without rebuilding from scratch.
8. **Fragmentation.** Shared identity and typed contracts solve the backend problem; the frontend needs a unifying experience. The web dashboard (Phase 2.5 §2) is the cheapest way to address this without building six native apps.
9. **Six-app commitment is a 5+ year scope from a small team.** Even sequenced, the cumulative App Store / paywall / onboarding / support / marketing overhead is enormous. Under the Strategic Refinement, this risk is largely retired by making Phase 4 explicitly optional and funded by wedge revenue rather than treated as a roadmap commitment.

---

## Bottom line

The strongest version of Hollis is not "MacroFactor + nutrition bundle" or "six apps producing one health brain." It is:

> **The only consumer fitness app that a clinician will trust.**

Lead consumer-facing surfaces with:

> **AI explains. Hollis verifies. You decide.**

Lead the trainer/clinician surface with the architectural and compliance posture that incumbents cannot retrofit.

**The 18-month bet:**
1. Ship Hollis Strength on the suite-native stack with the verified-AI promise.
2. Build Compass as a server-side intelligence service that interprets Strength data plus *external* data from Apple Health, Health Connect, WHOOP, Oura, Cronometer, and MFP — so the suite promise activates for one-app users immediately.
3. Sell the platform to trainers and clinicians as a fleet. This is the actual business.
4. Cross-promote from Hollis Health's installed base.
5. Use the web dashboard to give consumers and clinicians one place to see everything.

The six-app consumer expansion — Nutrition, Recovery, Move, Mind, plus the Hollis Compass habit/protocol layer across all of them — remains the long-term direction. It is now explicitly **gated on the wedge funding it**, not pursued speculatively against incumbent platforms.

The winning product surface is not a dashboard. It is a daily answer the user trusts because a clinician *also* trusts the system that produced it:

> "Given everything Hollis knows, what should I do today?"

---

## Citations

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
[19]: https://straitsresearch.com/report/habit-tracking-apps-market "Habit Tracking Apps Market — Straits Research"
[20]: https://www.grandviewresearch.com/industry-analysis/ai-personalized-nutrition-market-report "AI in Personalized Nutrition Market"
[21]: https://www.marketsandmarkets.com/Market-Reports/mental-health-apps-market-179040407.html "Mental Health Apps Market — MarketsandMarkets"
