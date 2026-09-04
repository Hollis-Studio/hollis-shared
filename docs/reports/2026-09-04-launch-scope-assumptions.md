# Launch Scope Assumptions — 2026-09-04

**Status:** Active. Supersedes the software-scope assumptions embedded in
[`2026-08-19-business-model-change.md`](./2026-08-19-business-model-change.md); that document
remains authoritative on the *legal* posture (no partner clinician, sponsored FH panel,
no medical services). This document records what the **software** must do at open, and by
omission, what it must not.

Confirmed with Isaac 2026-09-04 in a scope-reduction pass. Every line here is a decision,
not an inference.

---

## 1. What Hollis sells (offer sheet v3.2.0, unchanged)

| | ESSENTIALS $749 | CORE $1,349 | CONCIERGE $1,949 |
|---|---|---|---|
| Private coaching sessions | 2 / week | 4 / week | 6 / week |
| Recovery access (sauna, plunge, red light) | ✓ | ✓ | ✓ |
| Coach-led macro/micro coaching | ✓ | ✓ | ✓ |
| Sponsored 160+ biomarker panel | — | ✓ | ✓ |
| Health progress dashboard | ✓ | ✓ | ✓ |
| Coordination & scheduling | Standard | Priority | Dedicated |

Terms: 4 / 8 / 12 months at 0 / 5 / 10% discount. 50% ETF. Member gives 7 days' notice,
Hollis gives 30.

## 2. Revenue paths — exactly one is live at open

**The in-person consultation wizard is the only way a MEMBERSHIP is sold.**
`ConsultationFlowModal` → tier → term → six signatures → card → Stripe subscription.
Retail product sales are the one other live revenue path (see below).

Everything else is lead capture:

- `web-public` membership pages route to `/waitlist?tier=…`. **Correct as built** — no change needed.
- The mobile app has no Stripe dependency at all. **Correct as built.**
- Mobile `(auth)/signup.tsx` is barcode/QR entry against a record the wizard already created.
  This is not self-serve signup; it is account claiming. **Keep.**

**The retail storefront is a second live revenue path and it STAYS.** Hollis sells supplements
from day 1 (Isaac, 2026-09-04). `/api/products`, `web-public/products` "Buy Now",
`orderService` / `inventoryService` / `productService`, and `adminOrdersRouter` are all in
scope and must work at open. Its Stripe webhook branch (`checkout.session.completed` → Order)
was revenue-fatal until the 2026-08-23 batch supplied the missing `runAsSystemOperation`; that
fix is load-bearing, not incidental. Treat storefront checkout as a launch-critical path that
needs the same end-to-end test as membership signup.

**Two other secondary revenue paths are NOT part of the day-1 model:**

| Path | State | Decision |
|---|---|---|
| À-la-carte mobile sessions ($80, CONCIERGE 2 free/mo) | `adminMobileSessionsRouter` mounted unconditionally | **Not at open.** Not in offer sheet v3.2.0. Gated `ENABLE_MOBILE_SESSION_PURCHASES`, default false. |
| Stripe Terminal (POS card reader) | Already gated `ENABLE_STRIPE_TERMINAL`, default **false** | **Already correct.** No hardware exists. Leave off. |

## 3. Member mobile app — three jobs, nothing else

1. **Read their progress and data** — dashboard, metrics, wearable data, shared lab results.
2. **Book coaching sessions** — self-service against published availability. Coaching only;
   recovery slots are not self-bookable.
3. **Message Isaac** — one-to-one. Messaging stays.

Intake is **not** a member-app job. Intake is collected in person in the wizard. The mobile
onboarding intake steps and the standalone intake modal duplicate a flow that now happens
before the member ever has an account.

Nutrition self-logging: **deferred, not cut** (Isaac 2026-09-04 — "leave this stuff for now").
Training programming: **kept in full, INCLUDING AI generation.** Plans, strategies, the workout
builder, `AIGenerateModal`, `AIGenerateStrategyModal`, `GeneratedPlanPreview`,
`ExerciseReviewPanel`, `useGenerateWorkoutPlan`, and `useAIContext` — the hook that reads a
patient's history to ground generation — all stay. This was briefly cut on 2026-09-04 and
restored the same day (v3.8.87); do not cut it again. The analytics `AIChatWidget` is a
separate surface and remains cut.

## 4. Staffing

**One admin: Isaac.** No clinicians, no trainers, no coordinator in week one.

Consequences that are now assumptions, not guesses:
- The `CLINICIAN` role dormants itself (per the 2026-08-19 plan §1) — nothing to assign.
- Trainer-comparison and work-routing surfaces have no second party. They are not "empty";
  they are meaningless.
- `RoleGate` and `requireClinical` stay in place, dormant. Do not rip out the gates.

## 5. Labs — the distinction that matters

Two lab systems exist. They are frequently conflated and must not be.

| | Status |
|---|---|
| **Member-shared ingestion** — member exports the FH PDF, shares with written consent, Gemini extracts, staff transcription-checks, values render with trends | **KEEP IN FULL.** Confirmed 2026-09-04. This is the sponsored-panel pipe. |
| **Clinical lab ORDERING** — Hollis orders a panel, tracks it through a pipeline, reviews results | **DEAD since 2026-07-17.** Server gated `ENABLE_CLINICAL_ORDERING` (default false). UI is dormant but still bundled. |

The labelling debt from the 2026-08-19 plan §3 (`RESULTS_REVIEWED`, `verifiedBy`,
"Lab & Clinical") is **still open** and still matters: staff act on the words they see, and
Hollis does not review, interpret, or monitor any result.

## 6. Booking

Members self-book **coaching sessions only**, against Isaac's published availability.
`AvailabilityBuilder` must be accurate and maintained from day one — this is now a hard
dependency, not a nice-to-have.

**Recovery is delivered inside a regular coaching session** (Isaac, 2026-09-04). It is sold at
every tier, but a member never books a modality — they book the session, and sauna / cold
plunge / red light happen within it. `RECOVERY_SESSION` therefore stays in the enum for
historical rows and admin-side calendar use, but was removed from the member booking screen.
There is no separate recovery scheduling, no per-modality capacity, and no resource calendar
to build.

## 7. Retired session types

`SessionType` still contains `LABWORK`, `CLINICIAN_INITIAL`, `CLINICIAN_FOLLOWUP`,
`DXA_SCAN`, `SLEEP_SCREENING`. Per the 2026-08-23 batch these no longer debit or refund
session balances. **Leave the enum values** (deleting enum members historical rows reference
is a migration hazard for no benefit) but they must not appear in any picker, label map, or
filter.

## 8. Explicitly kept — do not cut these in a simplification pass

Consultation wizard · `PaymentModal` · `subscriptionService` · lab PDF extraction + metric
governance · `BiomarkerPicker` · member↔admin messaging · coaching booking + availability ·
wearable/device sync · sponsored-panel tracking · nutrition (deferred) · training plans,
exercise library, strategies, and **AI workout/strategy generation with its history-grounded
`useAIContext`** · the retail storefront.

## 9. Open questions this document does not settle

1. **Photo/video release** — is it required before first session, or can it become an
   optional post-signup document? Removing it takes the wizard from 12 steps to 11.
2. **Storefront readiness** — supplements ship day 1, so the catalogue needs real products,
   real Stripe Prices, real inventory counts, and a tested checkout. None of that is seeded
   today; `prisma.product.deleteMany()` in the seed is the only product code path exercised.
3. **Retired-type consolidation** — the "retired appointment type" list is now duplicated in
   `NewAppointmentModal.tsx` and `book-appointment.tsx`. It belongs in
   `@hollis-studio/contracts` on the next contracts publish.

---

See also: `hollis-health-app/docs/plans/2026-09-04-prelaunch-simplification-hitlist.md`
