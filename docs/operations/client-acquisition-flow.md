# Client Acquisition Flow — Lead to First Visit

**Purpose:** Define exactly what happens from the moment a prospect first sees a Hollis Health ad (or hears about us) through their first coaching session. This SOP is the source of truth for both operational training and end-to-end (E2E) flow testing prior to clinic opening.

> **Updated 2026-08-19.** The partner-clinician stage is gone. There is no Dr. Tavie, no White Horse Holistic Health, no external clinical scheduling, and no medical visit in the funnel. Booking and coordination are entirely in-house. Blood work is a sponsored third-party program at CORE and CONCIERGE. See [`../reports/2026-08-19-business-model-change.md`](../reports/2026-08-19-business-model-change.md) and [`biomarker-panel-program-sop.md`](./biomarker-panel-program-sop.md).

**Scope:** Hollis Health LLC clinic only. Does not cover Hollis Studio (consumer Strength/Nutrition apps).

**Audience:** Care Coordinator (Isaac), future Trainer hire, engineering for code references and gap-closure.

**Related docs:**
- [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md) — open/close procedures
- [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md) — unscheduled walk-ins and inbound phone
- [`no-show-cancellation-policy.md`](./no-show-cancellation-policy.md) — applies once a member
- [`after-hours-messaging-sop.md`](./after-hours-messaging-sop.md) — after-hours auto-reply

---

## 1. Roles

Hollis Health operates with **two distinct roles**, both in-house. (There was a third — an external Partner Clinician — through 2026-08-18. There is not one now, and no step in this flow may be attributed to one.)

| Role | Person (today) | Responsible for |
|------|----------------|-----------------|
| **Care Coordinator** | Isaac (owner) | All lead handling, phone screens, in-person intros, membership signup, payment, data entry, scheduling, interpreter between client and clinician. Holds ISSA-CPT, ISSA Nutrition, ISSA Strength & Conditioning, CPR. **Not a medical provider.** |
| **Trainer** | TBD hire — Isaac covers until hired | All hands-on coaching/PT sessions, weekly/daily training, recovery modality supervision, day-to-day fitness programming. |

> When Isaac is on a call or in an intro and someone describes a clinical/medical concern, the answer is *always* "that's one for your own doctor" — or 911 if an emergency. There is no Hollis clinician to hand it to. Isaac may discuss fitness, nutrition, and program design freely under his ISSA credentials. See [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md) §1.5 for the scripts.

---

## 2. The Four-Stage Funnel

```
        STAGE 1                 STAGE 2                 STAGE 3                       STAGE 4
        ─────────               ─────────               ─────────                     ─────────
Ad/word → Lead Capture  ─→  Phone Screen        ─→  In-Person Intro + Signup    ─→  First Session
of mouth (web form,         (15 min, free,          (60-90 min, free, in-clinic,    (trainer: ≤1 wk,
         phone, walk-in)    Isaac calls back)      ConsultationFlowModal wizard)   booked at signup)

LeadPipeline       LeadPipeline           LeadPipeline                  User (CLIENT role)
stage=INQUIRY      stage=CONSULTATION_    stage=CONSULTATION_COMPLETED   + Subscription
                   BOOKED                  → ACTIVE_MEMBER on signup     + ConsentRecord ×4
                                                                          + barcode issued
                                                                          + Appointment(s)
```

The funnel is asymmetric: phone screens are FREE and SHORT, in-person intros are FREE and LONG, and money only changes hands at Stage 3 step 9 (Stripe payment inside the wizard).

---

## 3. Stage 1 — Lead Capture

**Goal:** Get prospect's name, email, phone, and tier interest into `LeadPipeline` at stage `INQUIRY`.

### 3.1 Entry channels

A prospect can reach us through any of these. All four converge on the same `LeadPipeline` row.

1. **Waitlist form** — `web-public` `/waitlist` page → `WaitlistForm` component → `POST /public/contact` → creates `LeadPipeline` row. Form captures: name, email, phone, goals (free text), interested tier (ESSENTIALS/CORE/CONCIERGE via `?tier=` query param or in-form selector), referral source. (`hollis-health-app/web-public/components/sections/WaitlistForm.tsx`; server `hollis-health-app/server/src/routes/public.router.ts:60`.)
2. **Contact form** — `web-public` `/contact` page → `ContactForm` component → same `POST /public/contact` endpoint.
3. **Direct phone call** — Prospect calls (210) 891-9005. If between patients, answer per [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md) §2.2; if not, voicemail. Coordinator manually creates a `LeadPipeline` row from the call. **Today there is no admin UI to create a Lead manually** — this is a known gap; today it requires direct DB insert or just keeping a note and creating the row at first system contact.
4. **Walk-in** — Prospect walks into the clinic without an appointment. Per [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md) §1.3, capture name and phone, text booking info. Manually create a `LeadPipeline` row.

### 3.2 What happens after `INQUIRY` is created

- The `/leads` admin page (`hollis-health-app/web-admin/app/(admin)/leads/page.tsx`) lists all leads with stage, days-in-stage, MRR potential, and conversion stats.
- An automated **email** confirmation is sent to the lead acknowledging receipt (via `emailService.ts`, SES).
- Isaac is responsible for calling every `INQUIRY` lead back within **24 business hours**.

### 3.3 Ad attribution

For launch, **no UTM/pixel tracking is wired up**. `LeadPipeline.source` is populated manually during the phone screen ("How did you hear about us?"). Acceptable until lead volume exceeds ~10/wk; revisit when paid ads start.

---

## 4. Stage 2 — Phone Screen

**Goal:** Qualify fit, answer the prospect's questions, book a free in-person intro. Advance the lead from `INQUIRY` to `CONSULTATION_BOOKED` with a `consultationDate` set.

### 4.1 Before calling

1. Open the lead in `/leads` admin. Note their stated tier interest, goals, and referral source.
2. Have your calendar open in a second window (web-admin `/schedule`) so you can pick an intro slot in real-time.

### 4.2 Call script (target 10–15 min)

> "Hi [name], this is Isaac with Hollis Health, returning your inquiry. I've got about 15 minutes — is now still a good time?"

Then cover, in order:

1. **What they're trying to accomplish.** Listen. Take notes in the lead `notes` field.
2. **How they heard about us.** Set `LeadPipeline.source` accordingly.
3. **Brief overview of our model.** "We're a private coaching studio — training, nutrition, and recovery, with everything tracked in one place so you can actually see what's changing. We're not a medical clinic and we don't provide medical care; you keep your own doctor for that. At Core and Concierge we also sponsor a blood panel membership, 160-plus markers, run by an independent company — the account is yours and their clinicians handle the medical side. If you share those results with me, I use them to shape your training and nutrition."
4. **Tier fit.** Match their goal to ESSENTIALS / CORE / CONCIERGE. (Confirm tier interest from form; offer the tier you think actually fits and explain why.)
5. **Pricing transparency.** Quote the base monthly rate and 4/8/12-month term discount (see §10 for current numbers).
6. **Book the in-person intro.** "The next step is a free in-person visit at our clinic — about an hour. You'll meet me, see the space, walk through your goals in detail, and if it feels right, you can sign up that same visit. I have [Tue 2pm] or [Wed 10am] open this week — which works?"
7. **Confirm logistics.** Get them to commit to a slot. Tell them you'll send a calendar invite by email; you'll also text the address from the shop phone.

### 4.3 After the call

1. **In `/leads`**, advance lead from `INQUIRY` → `CONSULTATION_BOOKED` (PATCH `/api/admin/leads/:id/stage`).
2. **Set `consultationDate`** to the agreed slot. **Today there is no UI for this** — it must be set via direct DB write or by editing the lead row. This is a tracked gap (see §11).
3. **Email** the prospect a confirmation with the date/time and clinic address. Automated via `emailService.ts` (template needed; see §11).
4. **Text** them manually from the shop number (210) 891-9005 with the address and a brief "see you Tue at 2!"
5. **24-hour email reminder** fires automatically (cron job keyed off `consultationDate`; see §11 for what exists vs. what's needed).

### 4.4 If the prospect doesn't pick up

- Voicemail: "Hi [name], this is Isaac with Hollis Health returning your inquiry. I'd love to chat about your goals and get you in to see the clinic. Call me back at (210) 891-9005 or reply to my email and we'll find a time. Talk soon."
- Send a follow-up email within 1 hour.
- Try again in 48 hours. After 3 attempts with no response, move lead stage back to `INQUIRY` and note "non-responsive after 3 attempts." Do not delete.

---

## 5. Stage 3 — In-Person Intro + Membership Signup

**Goal:** Convert the prospect to a paying member same-visit. Run the in-clinic `ConsultationFlowModal` wizard end-to-end.

### 5.1 Before the prospect arrives

- Day-1 opening procedures complete per [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md) §1.
- `/leads` open in browser; lead row in `CONSULTATION_BOOKED` visible.
- **Manual card entry only at launch.** Stripe Terminal is gated off (`ENABLE_STRIPE_TERMINAL=false`) until the post-launch Terminal provisioning milestone (see §11 P1 item 8). Do not power on the reader expecting it to process payments — it will not. Confirm Wi-Fi connectivity for the iPad/tablet so the wizard can reach the Stripe API. Terminal will be enabled post-launch once the Stripe Terminal Location is created and the flag is toggled.
- Tablet with web-admin loaded for consent signing.

### 5.2 The visit (target 60–90 min)

1. **Greet at the door.** Brief tour of the space. Walk to the consultation area.
2. **Conversation (~20 min).** Restate what you learned on the phone. Hear it again, look for new info, observe in person. Ask: "What does success look like a year from now?"
3. **Walk the offer.** Show the tier comparison (use the offer sheet at `hollis-shared/packages/contracts/domain/offer-sheet.json` or the `/memberships` page on web-public). Confirm the tier and term length.
4. **Ask for the sign-up.** "Does this feel right? If so, I'll get you set up today so we can start this week."
5. **If yes:** open `/registrations` in web-admin and launch `ConsultationFlowModal`. If no: thank them, ask if they want to stay in the pipeline, and either move lead to `PROPOSAL_SENT` (will follow up) or `CHURNED` (with reason).

### 5.3 ConsultationFlowModal — 12 steps

`hollis-health-app/web-admin/components/admin/ConsultationFlowModal.tsx` walks through these in order (`CONSULTATION_FLOW_STEPS` in `ConsultationFlowTransitions.ts` is the authoritative list). All run on Isaac's laptop with the prospect sitting next to him.

1. **client-info** — Full name, DOB, email, phone, address, emergency contact.
2. **intake** — Reason for visit, current medications, allergies, past medical history, family history, social history (writes to `ClinicalProfile.intake*` fields).
3. **tier-selection** — ESSENTIALS / CORE / CONCIERGE.
4. **contract-duration** — 4 mo (0% off) / 8 mo (5% off) / 12 mo (10% off). **The registration record — and with it the patient barcode — is created on leaving this step**, not at flow start: the wizard needs the tier and term before it can create the user. If registration creation fails here the wizard refuses to advance.
5. **sign-npp** — HIPAA Notice of Privacy Practices. Acknowledgment-only (45 CFR §164.520 requires it at or before first service). Stored in `ConsentRecord` with version hash + IP + UA, like every other signed document.
6. **sign-membership** — Membership Agreement. Signed on tablet. Same storage.
7. **sign-liability** — Liability Waiver. Same.
8. **sign-consent** — Informed Consent. Same.
9. **sign-comms** — Electronic Communications Consent. Same.
10. **sign-release** *(optional)* — Photo/Video Release if you want to use their image in marketing. The only signing step not in `REQUIRED_CONSENT_DOCS`.
11. **payment** — Stripe payment. See §5.4 for the two paths.
12. **success** — Displays the scannable QR-encoded barcode created at step 4. Member uses this in the patient app on first launch.

### 5.4 Payment — manual entry at launch; Terminal post-launch

**At launch — Manual card entry (the only active path).**
- `ENABLE_STRIPE_TERMINAL=false`. The Stripe Terminal reader is not active. Isaac keys in PAN/exp/CVC from the prospect's card via the Stripe Payment Element in the wizard's payment step while seated next to them. Card data never touches Hollis servers — Stripe Elements sends it directly to Stripe.
- If the wizard's manual entry path fails: send a Stripe Payment Link to the prospect's phone (per `day-1-clinic-runbook.md` §4.2 Option A). Wait for payment confirmation before they leave.

**Post-launch — Stripe Terminal (once provisioned).**
- After the Terminal provisioning milestone (§11 P1 item 8): reader will connect and show `Ready`; tap card or insert chip; payment confirmation flows through `payment_intent.succeeded` webhook (`hollis-health-app/server/src/webhooks/stripe/handlers/`). Update this section when Terminal is enabled.

### 5.5 What the wizard creates

On successful completion:
- `User` row with `role=CLIENT`, the membership tier, and the barcode.
- `Subscription` row linked to a Stripe subscription ID.
- 4 `ConsentRecord` rows (or 5 if ROI signed) with version-at-signing and content hash.
- `ClinicalProfile` row with all intake fields.
- Lead is marked `convertedUserId` and moved to `ACTIVE_MEMBER` stage automatically (verify this happens — if not, manual update is the workaround).

### 5.6 Book the first PT/coaching session before they leave

After payment success, while the new member is still in the room:
1. Navigate to the member's patient detail page (or stay in the wizard if step 12 is added — see §11).
2. Create a `TRAINING_SESSION` appointment with the new member, on Isaac's calendar (or the trainer's once hired), for the nearest available slot — target within **7 days**.
3. The new member sees this appointment in their patient app `appointments` tab as soon as they log in.

### 5.7 Hand off

- Give the new member the QR barcode (printed receipt or shown on phone).
- Walk them through downloading the patient app from the App Store / Play Store and scanning the barcode on first launch.
- Tell them: "Your first session is already on your calendar in the app. Everything you book with us, you'll see there."
- If CORE or CONCIERGE: walk them through enrolling in the sponsored blood panel program per [`biomarker-panel-program-sop.md`](./biomarker-panel-program-sop.md) §3.2, and say the limits out loud — their account, their results, we don't read them medically.

---

## 6. Stage 4 — First Session

One visit, one scheduling path, entirely in-house. (Through 2026-08-18 this stage had a second, externally-scheduled medical visit. It is gone. Nothing in this flow depends on an outside calendar any more.)

### 6.1 First trainer / PT session

- **Booked at signup** (Stage 3 §5.6). Already on Isaac's (or trainer's) calendar.
- Member sees it in patient app `appointments` tab.
- 24h and 1h push reminders fire automatically per existing `notifyAppointmentReminder*` infrastructure.
- Standard `TRAINING_SESSION` appointment type.

### 6.2 Sponsored blood panel enrollment (CORE and CONCIERGE only)

Not a Hollis visit and not a Hollis appointment. Do not create an appointment for it, and do not put a draw on the Hollis calendar — scheduling the draw is the member's business with the testing company, and putting it on our calendar makes it look like ours.

1. Member is enrolled in their own name at signup (Stage 3 §5.7).
2. They book their own draw through the testing company.
3. If and when they want results in their Hollis dashboard, they export the PDF and share it, and Isaac uploads it against a logged consent.

Full procedure and the hard limits: [`biomarker-panel-program-sop.md`](./biomarker-panel-program-sop.md).

### 6.3 Health information handling

The only member health information Hollis receives is what the member gives Hollis directly: intake answers, in-house measurements, app-tracked data, and any records they choose to share. Hollis does not exchange information with any outside clinical entity on its own initiative, and does not text or email member details to any provider. If a member requests a referral and wants records sent, they sign a release first — [`imaging-and-referrals-sop.md`](./imaging-and-referrals-sop.md) §2.

---

## 7. Ongoing Care Coordination (Post-First-Visit)

Once the first session is complete, the member enters steady state:

- **Trainer sessions** per tier (2/wk ESSENTIALS, 4/wk CORE, 6/wk CONCIERGE per offer sheet v3.1.0). Booked recurring or per-week by trainer/coordinator.
- **Recovery modalities** (infrared sauna, cold plunge, red light) — unlimited at all tiers. No appointment needed; first-come.
- **Sponsored blood panel** at CORE/CONCIERGE — member-run, on the testing company's own cadence. Isaac may remind them a draw is available; Isaac does not schedule it. Shared results are uploaded per [`biomarker-panel-program-sop.md`](./biomarker-panel-program-sop.md).
- **Push reminders** at 24h and 1h before every appointment (existing).
- **Member messages** Isaac/care team in-app; Isaac triages per `walk-in-and-phone-sop.md` §2.

---

## 8. The Patient App First-Run

What the new member experiences after the in-person signup:

1. Downloads "Hollis Health" from App Store / Play Store.
2. Opens app → barcode scan or manual barcode entry (`hollis-health-app/app/(auth)/signup.tsx`).
3. Sets password (`app/(auth)/create-account.tsx`).
4. Onboarding wizard (`app/(auth)/onboarding.tsx`): basic (height/weight) → personal (DOB/sex) → goals → health permissions (Apple Health / Google Fit) → intake-history → intake-meds-allergies → intake-lifestyle → intake-acknowledge.
   - Note: intake fields were already collected in the in-clinic wizard (Stage 3 step 2). This is a duplication today — either pre-fill from `ClinicalProfile` or skip the in-app intake if it's already complete. **Tracked as a polish item, not a blocker.**
5. Lands on the `appointments` tab and sees the first trainer session already on calendar.
6. Can view signed consent documents via `app/(modals)/consent-documents.tsx`.

---

## 9. Code Path Reference (what's built)

| Step | Code |
|------|------|
| Lead capture form | `hollis-health-app/web-public/components/sections/WaitlistForm.tsx`, `ContactForm.tsx` |
| Lead intake endpoint | `hollis-health-app/server/src/routes/public.router.ts:60` (`POST /public/contact`) |
| Lead pipeline model | `hollis-health-app/server/prisma/schema.prisma:2192` (`LeadPipeline`) |
| Leads admin dashboard | `hollis-health-app/web-admin/app/(admin)/leads/page.tsx` |
| Lead stage update | `PATCH /api/admin/leads/:id/stage` |
| In-clinic signup wizard | `hollis-health-app/web-admin/components/admin/ConsultationFlowModal.tsx` |
| Registrations page (entry point) | `hollis-health-app/web-admin/app/(admin)/registrations/page.tsx` |
| Subscription creation | `hollis-health-app/server/src/routes/admin/subscriptions.ts:76` (`POST /api/admin/subscriptions`) |
| Stripe webhooks | `hollis-health-app/server/src/webhooks/stripe/handlers/` |
| Appointment creation (admin) | `POST /api/admin/appointments` |
| Appointment creation (self-serve) | `POST /users/:userId/appointments` (excludes ONBOARDING + CLINICIAN_INITIAL) |
| Patient app onboarding | `hollis-health-app/app/(auth)/onboarding.tsx` |
| Patient app intake | `hollis-health-app/app/(modals)/intake.tsx` |
| Patient app appointments tab | `hollis-health-app/app/(tabs)/appointments.tsx` |
| Patient app barcode signup | `hollis-health-app/app/(auth)/signup.tsx` |
| Email sending | `hollis-health-app/server/src/services/emailService.ts` (SES) |
| Tier/term definitions | `hollis-shared/packages/contracts/domain/offer-sheet.json` |

---

## 10. Current Pricing (for phone-screen reference)

From `offer-sheet.json` v3.1.0 (effective 2026-08-19). **The table below was three versions stale until 2026-08-19 — it still quoted the pre-descope $799/$1,599/$2,499 pricing.** Verify against the source before quoting anything.

| Tier | Base monthly | 4mo (0% off) | 8mo (5% off) | 12mo (10% off) | Coaching/wk | Sponsored blood panel |
|------|-------------|-------------|-------------|---------------|------------|----------------------|
| ESSENTIALS | $749 | $749 | $711.55 | $674.10 | 2 | Not included |
| CORE | $1,349 | $1,349 | $1,281.55 | $1,214.10 | 4 | Included |
| CONCIERGE | $1,949 | $1,949 | $1,851.55 | $1,754.10 | 6 | Included |

All tiers include recovery modality access (infrared sauna, cold plunge, red light), the health progress dashboard, and care coordination support.

**No tier includes medical services of any kind.** No physician access, no DXA, no registered-dietitian sessions, no imaging, no prescribing — all removed in the 2026-07-17 descope. Nutrition is coach-led under ISSA credentials. The sponsored blood panel at CORE/CONCIERGE is a third-party membership Hollis pays for; it is not a Hollis medical service.

> **Always verify against the current `offer-sheet.json`** before quoting — pricing is the source of truth there, not this doc.

---

## 11. Gaps Before Launch

**Re-verified 2026-09-20** against the live prod task definition
(`hollis-prod-api:443`), live AWS (`rds`, `ses`), public DNS, git history, the
published `@hollis-studio/contracts@0.2.0-alpha.87` tarball, and current source.
Clinic opens **2026-10-17**. See
[`../reports/2026-05-20-launch-readiness-snapshot.md`](../reports/2026-05-20-launch-readiness-snapshot.md)
for the original audit and fix log.

### 🔴 The actual blockers — 6 items, all owner actions

Everything below this heading is either closed or non-blocking. These six are
the list.

| # | Blocker | Evidence (2026-09-20) | What closing it takes |
|---|---|---|---|
| 1 | ~~Sentry BAA is unsigned~~ — **resolved by exclusion 2026-09-21** | The owner kept the free (no-BAA) plan and excluded Health runtime reporting instead: every Health initializer (mobile, API, web-admin, web-public) is `enabled: false` with zero sampling and drop-all hooks. The Health ingestion key stays enabled, so already-installed mobile builds and any not-yet-replaced deployment can still send until updated. See [`baa-tracker.md`](./baa-tracker.md). | Engineering: verify each replaced deployment and the next store builds. Isaac: revisit before any runtime re-enable. |
| 2 | **RDS single-AZ risk accepted 2026-09-20** | `hollis-prod-postgres` remains `MultiAZ: false` (`db.t3.micro`, 50 GiB, encrypted, 30-day PITR); the owner accepted the lower-cost single-AZ posture with the existing disaster-recovery process. | Keep the documented backup/restore checks current and revisit Multi-AZ when availability requirements or budget change. |
| 3 | ~~No DMARC record~~ — **closed 2026-09-21** | A targeted Terraform apply added authoritative `_dmarc.hollis.health` TXT `v=DMARC1; p=none`; post-apply authoritative DNS verification matched. No reporting mailbox (`rua`) was invented. | Monitor deliverability and tighten policy only after reviewing legitimate senders. |
| 4 | ~~No 24h consultation reminder~~ — **built 2026-09-20 (health-app v3.8.148)** | `server/src/jobs/consultationReminderJob.ts` runs every 15 min and emails leads whose `LeadPipeline.consultationDate` is 2–24h out (idempotent, suppression-list aware, watched by the job watchdog). Email only: leads have no app account for push and no SMS provider exists. | Do one real end-to-end send with a test lead before relying on it. |
| 5 | ~~After-hours SOP claimed nonexistent automation~~ — **corrected 2026-09-21** | `web-admin` has no Messaging tab or auto-reply implementation. The SOP now states the actual day-one process: voicemail plus manual review of app and email queues on the next business day. Isaac is identified as care coordinator, not clinician. | Verify the posted hours and voicemail greeting before opening; no new automation or staffing is assumed. |
| 6 | **Stripe Terminal not provisioned** | `ENABLE_STRIPE_TERMINAL` and `STRIPE_TERMINAL_LOCATION_ID` are **absent from the prod task definition entirely** — not set to empty, just not there. | Isaac: create a Stripe Terminal Location in the Dashboard, put its ID in prod env, set the flag, redeploy. Blocks the **first card-present transaction**, not signup — the `ConsultationFlowModal` uses a `SetupIntent` and keys cards in. |

**Deliverability, stated precisely** (the old wording was wrong): SES is out of
sandbox (`ProductionAccess: true`, 50k/day), the `hollis.health` domain identity
is verified, DKIM is `SUCCESS` and signing, and the custom MAIL FROM domain
`mail.hollis.health` publishes `v=spf1 include:amazonses.com -all`. The apex
`hollis.health` SPF record is `v=spf1 include:_spf.google.com ~all` — that is
**correct as-is** and governs Google Workspace mail; do **not** bolt
`include:amazonses.com` onto it, because SES authenticates on the MAIL FROM
domain instead. So SPF and DKIM both pass and both align. The only DNS gap is
blocker 3. (One caveat: `BehaviorOnMxFailure: USE_DEFAULT_VALUE` means that if
the `mail.hollis.health` MX lookup ever fails, SES falls back to an
`amazonses.com` envelope domain — SPF still passes but SPF *alignment* breaks,
leaving DKIM as the only aligned signal. That is survivable under `p=none`.)

**Sentry PHI scrubbing — historical (verified 2026-09-20; Health runtime
reporting has since been disabled, see blocker 1).** Every
initializer routes events through `sanitizeSentryEvent` / `sanitizeSentryLog`
from `@hollis-studio/contracts`, with `sendDefaultPii: false`:

- `hollis-health-app/server/src/index.ts:35` — `beforeSend`, `beforeSendTransaction`, `beforeSendLog`, **plus** `googleGenAIIntegration({ recordInputs: false, recordOutputs: false })` so Vertex AI prompts/responses never reach Sentry
- `hollis-health-app/web-admin/instrumentation-client.ts:17` and `web-admin/sentry.server.config.ts:14` / `sentry.edge.config.ts:14`
- `hollis-health-app/web-public/instrumentation-client.ts:19` and `web-public/sentry.server.config.ts:9` / `sentry.edge.config.ts:9`
- `hollis-health-app/app/_layout.tsx:115` — also `beforeBreadcrumb`, which is the only thing covering SDK-assembled breadcrumbs (the static `check:phi-logging` scanner cannot see them)
- `hollis-identity/src/index.ts:26`
- `hollis-workouts/server/src/lib/sentry.ts:63`

This is real, defence-in-depth scrubbing. It is **not** a substitute for a BAA,
because a scrubber can only remove fields it knows about.

### ✅ Closed since the 2026-05-20 snapshot — verified 2026-09-20, do not re-litigate

| Item | Verification |
|---|---|
| **Stripe prod keys → Secrets Manager** | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` and `STRIPE_DATA_REF_SECRET` are all `secrets` (Secrets Manager refs), not env values, on `hollis-prod-api:443`. The 11 tier/coaching price IDs (9 membership + 2 coaching) are plain env vars; they were confirmed resolvable against live Stripe on 2026-09-15 — not re-checked on 2026-09-20, so re-verify against the Stripe Dashboard if a signup fails. |
| **`SENTRY_DSN` → Secrets Manager** | Present as a Secrets Manager `secret` on `hollis-prod-api:443`. Superseded 2026-09-21: Health runtime Sentry is disabled in source (blocker 1), so the secret is inert once the replacement API is deployed; crash visibility is CloudWatch logs and alarms. |
| **`server/.env` in git history / rotate the Gemini key** | **Never happened.** `git log --all -- server/.env` and `git log --all -- .env` both return **0 commits** in `hollis-health-app`; the only tracked `*.env` path ever added is `ios/.xcode.env`. Prod does not use a Gemini API key at all — Vertex AI authenticates via the `GCP_SA_KEY_JSON` secret (ADC), with `GOOGLE_CLOUD_PROJECT=hollis-health-app-473921`. **Separate, real, and still open:** the prod RDS password and `PASSWORD_PEPPER` *are* in git history via committed Terraform plan archives and have not been rotated — that is tracked in `hollis-health-app`, not here. |
| **`ENABLE_AUDIT_CHAIN_VERIFY=true` in prod** | Set on `hollis-prod-api:443`, with `AUDIT_CHAIN_VERIFY_START_AT=2026-09-15T22:44:05Z` and `ENABLE_AUDIT_LOG_ARCHIVAL=true`. |
| **`SERVER_PUBLIC_URL` in prod** | Set on `hollis-prod-api:443`. CAN-SPAM unsubscribe links no longer fall back to `FRONTEND_URL`. |
| **`PHONE_CALL` / `WALK_IN` in a published enum** | In the published alpha.87 tarball: `dist/public/contact.js` → `LEAD_SOURCES = ["PHONE_CALL", "WALK_IN", "WEBSITE", "REFERRAL", "SOCIAL_MEDIA", "GOOGLE", "OTHER"]`. No longer local-only. |
| **`HIPAA_NPP` consent type** | `HIPAA_NPP` at `server/prisma/schema.prisma:357`; `ALL_CONSENT_DOCS` in published alpha.87 `dist/admin/legal-documents/index.d.ts:75` leads with it; `hipaaNpp` ships as its own module; `ConsultationFlowModal` collects it at the `sign-npp` step (§5.3 step 5). Satisfies 45 CFR §164.520. |
| **BAA with White Horse Holistic Health** | Closed 2026-08-19 by the relationship ending, not by signing. No data ever flowed. See [`baa-tracker.md`](./baa-tracker.md). |
| **Republish `@hollis-studio/contracts`** | Done many times over — published channel is now `0.2.0-alpha.87` and the admin routes/fields are in it. ⚠️ **But pin exact versions:** the `latest` dist-tag is stuck on an old alpha with superseded legal-document versions. See [`../TODO.md`](../TODO.md). |
| **Health services parked in AWS** | Unparked. `hollis-prod-api` and `hollis-prod-web-admin` both 1/1, both canaries running. Residual park items (Container Insights, 3 muted alarm actions, Identity still at 1×0.25 vCPU) are tracked in [`aws-cost-scaledown-runbook.md`](./aws-cost-scaledown-runbook.md). |

**Prisma migrations to prod — closed, with one honest caveat.** Both named
migrations exist and are committed:
`server/prisma/migrations/20260520000000_phi_access_log_rls/` is present with a
clean `git status`, the newest Health migration is
`20260918210000_workouts_plan_builder`, and `hollis-identity` has four applied
migrations (its service could not be serving traffic otherwise). The
2026-09-20 debts re-verification recorded all migrations deployed. **Caveat:**
nothing outside the VPC can read `_prisma_migrations`, so "every row is applied"
is inference, not direct evidence. If you want certainty, run a one-off read-only
Fargate task (see the prod ad-hoc query pattern in the Health repo runbooks)
rather than assuming.

### ✅ Closed in the 2026-05-20 batch (no further engineering work)
- Manual card entry in `ConsultationFlowModal` payment step — confirmed: Stripe Payment Element renders in `setup` mode, always available regardless of Terminal connectivity.
- `LeadPipeline.consultationDate` admin UI — date picker added to `/leads` rows, auto-opens when stage transitions to `CONSULTATION_BOOKED`.
- "Create lead manually" admin UI — `CreateLeadModal` + `POST /api/admin/leads` for phone/walk-in leads.
- Lead → `ConsultationFlowModal` conversion on success — `convertedUserId` set and stage moves to `ACTIVE_MEMBER` automatically.
- Walk-in/phone SOP rewritten — now correctly reflects Care Coordinator role + ISSA credentials.
- Subscription creation atomicity — wizard no longer silently advances to success on Stripe failure; new `POST /api/admin/subscriptions/:userId/retry` endpoint + UI retry path + "Subscription Pending" success state.
- CAN-SPAM for waitlist confirmations — `unsubscribeToken` / `emailOptIn` / `consentedAt` now populated; unsubscribe link in confirmation email.
- Notification permission proactively requested in patient-app onboarding (new step before `complete`).
- `location` field surfaced in `NewAppointmentModal`. *(The WHH auto-suggest shipped with it is now wrong and must be removed — tracked in the admin dashboard alignment plan.)*

### 🟡 P1 — desirable but not blocking (re-verified 2026-09-20)
1. **Promote 4 lead/billing fields into published contracts.** The contracts republish landed, but `TODO(contracts)` workarounds remain where the server sends fields the published schema does not declare: `server/src/routes/admin/leads.ts:146`, `web-admin/services/admin/leadsService.ts:66`, `web-admin/services/billingService.ts:72` and `:237`. Harmless today (the client tolerates the extras); tidy on the next contracts bump.
2. **Email templates** for: (a) 24h-before consultation reminder, (b) post-signup welcome with app download links. `INQUIRY` and `CONSULTATION_BOOKED` confirmations already exist in `server/src/services/emailService.ts`.
3. **Pre-fill patient-app intake from `ClinicalProfile`** so members aren't asked the same intake questions twice. (Today: the intake-step filter correctly skips them if `intake.isComplete === true` server-side — verify the in-clinic wizard sets that flag.)
4. **"Convert lead to registration" pre-fill** — clicking a lead row should open `ConsultationFlowModal` pre-populated with name/email/phone/tier from the lead, eliminating re-typing.
5. **Lead detail/edit page** — today coordinator can update stage + consultationDate inline, but cannot edit name/phone/email/notes after creation.
6. **Add a step inside `ConsultationFlowModal` to book the first `TRAINING_SESSION`** so it happens inside the wizard instead of as a separate flow on the patient detail page.
7. **CloudWatch alarm** on the log line `"Orphaned Stripe subscription canceled successfully"` (already emitted by `subscriptionService.ts`) to catch any future orphaned-state escapes.
8. **Container Insights + 3 muted alarm actions.** Health is live again but `web-admin-down`, `canary-admin-failed` and `alb-5xx-spike` still have actions disabled, and Container Insights is still off. Tracked with the exact commands in [`aws-cost-scaledown-runbook.md`](./aws-cost-scaledown-runbook.md) §4–5. Note that enabling an alarm action is not the same as alarm *delivery* — confirm the SNS topic has a confirmed subscriber.
9. **PagerDuty endpoint** — **deliberately deferred, not an oversight.** `infrastructure/terraform/environments/prod/terraform.tfvars:96` documents it as intentionally unwired because there is no on-call rotation for a solo operator, and lists the three edits needed to enable it. Revisit when someone else is on call.
10. **Re-run the pre-commit suite against current `main`.** The 59/59 green report is now four months old, and `hollis-health-app` CI has been paused since 2026-09-04.

### 🟢 P2 — post-launch
- UTM / ad attribution (skip until paid ads start).
- ~~`PartnerClinic` model + `ExternalClinician` reference~~ — **dropped 2026-08-19.** There is no partner clinic to model.
- ~~WHH calendar bridge (iCal/Google sync)~~ — **dropped 2026-08-19.** All booking is in-house; there is no external calendar to bridge.
- SMS provider (Twilio HIPAA-eligible) — today: email-only, Isaac texts manually from (210) 891-9005.
- Self-serve online checkout on `web-public` for prospects who want to skip the in-person intro.
- Sleep-screening appointment type auto-creating downstream records. (Lab and DXA appointment types are dormant — Hollis performs neither.)
- Per-appointment deep-linking from push notifications (today: deep-links to appointments tab list).
- **Identity Service cutover for Health.** The service is **deployed** (`hollis-identity-prod`, 1/1, routed at `identity.hollis.health`) and `hollis-workouts/server` verifies through it, but `hollis-health-app/server` still issues its own JWTs — `IDENTITY_SERVICE_URL` and `IDENTITY_JWT_SECRET` are wired on the prod task definition without the auth path being switched over. Deliberately post-launch: do not attempt an auth cutover near the clinic opening. See [`../architecture/shared-auth-migration-checklist.md`](../architecture/shared-auth-migration-checklist.md).

---

## 12. End-to-End Test Plan (with Stripe test cards)

Run this full sequence in a staging environment with Stripe in test mode before launch. Use test card `4242 4242 4242 4242` for the happy path; `4000 0000 0000 0002` for decline.

### 12.1 Setup
- [ ] Confirm Stripe is in TEST mode (`pk_test_…` / `sk_test_…`).
- [ ] Create test email account or use plus-addressing (`isaac+test1@hollis.health`).
- [ ] Test phone number you can receive texts on.

### 12.2 Stage 1 — Lead capture
- [ ] Open `web-public` `/waitlist` in browser.
- [ ] Submit form with test name/email/phone, interest=CORE, source="Test E2E".
- [ ] Verify in `/leads` admin: row appears at stage `INQUIRY`, all fields populated.
- [ ] Verify email confirmation arrives at test inbox.

### 12.3 Stage 2 — Phone screen
- [ ] In `/leads`, advance the test lead `INQUIRY` → `CONSULTATION_BOOKED`. The date picker for `consultationDate` should auto-open on transition.
- [ ] Set `consultationDate` to tomorrow 2pm via the inline picker. Verify it persists on page refresh.
- [ ] Verify confirmation email sent and contains an unsubscribe link.
- [ ] Verify the 24h reminder email arrives (job runs every 15 min for consultations 2–24h out; health-app v3.8.148). Check it shows the right local time and the Knights Cross address.
- [ ] **Test the new admin "Add Lead" button:** open the `CreateLeadModal`, create a fake walk-in lead with source `WALK_IN`, verify it appears at stage `INQUIRY`.

### 12.4 Stage 3 — In-person intro + signup
- [ ] In web-admin, open `/registrations` and launch `ConsultationFlowModal`.
- [ ] Walk through all 12 steps with test data (including `sign-npp`).
- [ ] At step 11 (payment): the wizard uses Stripe `SetupIntent` (mode=`setup`) — coordinator sees a "Save Payment Method" UI, **not** a dollar amount. This is correct. Use test card `4242 4242 4242 4242`.
- [ ] Verify wizard reaches step 12 (success) with a QR barcode in the GREEN success state (not the amber "Subscription Pending" state).
- [ ] Verify in DB: new `User` row, `Subscription` row, `ClinicalProfile` row, and **5 required `ConsentRecord` rows** — `HIPAA_NPP`, `MEMBERSHIP_AGREEMENT`, `LIABILITY_WAIVER`, `INFORMED_CONSENT`, `ELECTRONIC_COMMS_CONSENT` (the full `REQUIRED_CONSENT_DOCS` set) — plus a 6th `PHOTO_VIDEO_RELEASE` row if the optional release was signed. Each row must carry the `contentHash` of the version presented.
- [ ] **Verify lead `convertedUserId` is set and stage moved to `ACTIVE_MEMBER` automatically** (no manual stage update required).
- [ ] **Failure path test:** repeat with a card that will cause the subscription POST to fail (e.g. mock Stripe to throw, or use a card that triggers webhook decline). Verify:
  - Wizard stays on the payment step (does NOT silently advance).
  - "Retry Subscription" button appears.
  - Clicking Retry calls `POST /api/admin/subscriptions/:userId/retry` and recovers cleanly on success.
  - Clicking "Skip — create manually later" advances to success but shows the amber "Subscription Pending" banner.
- [ ] **Manual card entry test:** the Stripe Payment Element is always available (Terminal is not used in setup mode within the wizard). Verify a card can be keyed in directly.

### 12.5 Stage 3.5 — First trainer session
- [ ] In web-admin, create a `TRAINING_SESSION` appointment for the new member, tomorrow.
- [ ] Verify it appears in the member's patient app `appointments` tab.

### 12.6 Stage 4 — Shared results upload (CORE/CONCIERGE)
- [ ] Confirm the test member's Informed Consent is signed and the Section 2 initials block is present.
- [ ] Log the per-report consent note on the member's record.
- [ ] In web-admin, upload a sample biomarker PDF against the member.
- [ ] Verify every extracted value against the source PDF and resolve all low-confidence rows.
- [ ] Verify the report and its trends appear in the member's patient app.
- [ ] Verify **no** notification is generated that characterizes any result.
- [ ] Delete the report and verify removal propagates to the app.

### 12.7 Patient app first-run
- [ ] Install patient app on a clean device or simulator.
- [ ] Scan or enter the test member's barcode.
- [ ] Set password.
- [ ] Walk through onboarding wizard. **Verify the new `notifications-permission` step appears before `complete`** — tap "Enable Notifications" and grant the iOS/Android system prompt. Confirm push token registers (check `DevicePushToken` row in DB).
- [ ] Repeat with a fresh install and tap "Skip" instead — verify the wizard still completes and lands on the dashboard.
- [ ] Verify `appointments` tab shows the first trainer session.
- [ ] Verify `consent-documents` modal shows all 4 signed docs.

### 12.8 Cleanup
- [ ] Cancel the test Stripe subscription via Dashboard → verify `customer.subscription.deleted` webhook fires and member subscription status updates.
- [ ] Delete test data from DB.

---

## 13. References

- Tier/term definitions: `hollis-shared/packages/contracts/domain/offer-sheet.json`
- Suite vision: `hollis-shared/docs/vision/2026-05-19-suite-vision.md`
- Day-1 runbook: [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md)
- Walk-in/phone SOP: [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md)
- No-show/cancel policy: [`no-show-cancellation-policy.md`](./no-show-cancellation-policy.md)
- Membership agreement: `hollis-health-app/web-admin/lib/legalDocuments/membershipAgreement.ts`
- Sponsored blood panel: [`biomarker-panel-program-sop.md`](./biomarker-panel-program-sop.md)
- Business model change record: [`../reports/2026-08-19-business-model-change.md`](../reports/2026-08-19-business-model-change.md)
- HIPAA NPP: [`hipaa-npp-content.md`](./hipaa-npp-content.md)

---

Last reviewed: 2026-09-20 (§11 re-verified against live prod/AWS/DNS/registry and rewritten: 5 of the 8 P0 owner items were already closed; the real blocker list is now 6 items)

Prior review: 2026-08-19 (partner-clinician exit + sponsored biomarker panel — see [`../reports/2026-08-19-business-model-change.md`](../reports/2026-08-19-business-model-change.md))

Prior review: 2026-05-20 (post 7-fix engineering batch — see [`../reports/2026-05-20-launch-readiness-snapshot.md`](../reports/2026-05-20-launch-readiness-snapshot.md))
