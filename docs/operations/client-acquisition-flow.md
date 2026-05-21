# Client Acquisition Flow — Lead to First Visit

**Purpose:** Define exactly what happens from the moment a prospect first sees a Hollis Health ad (or hears about us) through their first coaching session and their first medical visit with our partner clinician. This SOP is the source of truth for both operational training and end-to-end (E2E) flow testing prior to clinic opening.

**Scope:** Hollis Health LLC clinic only. Does not cover Hollis Studio (consumer Strength/Nutrition apps).

**Audience:** Care Coordinator (Isaac), future Trainer hire, Partner Clinician (Dr. Tavie / White Horse Holistic Health), engineering for code references and gap-closure.

**Related docs:**
- [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md) — open/close procedures
- [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md) — unscheduled walk-ins and inbound phone
- [`no-show-cancellation-policy.md`](./no-show-cancellation-policy.md) — applies once a member
- [`after-hours-messaging-sop.md`](./after-hours-messaging-sop.md) — after-hours auto-reply

---

## 1. Roles

Hollis Health operates with **three distinct roles**, and most acquisition steps cross at least one role boundary. Mis-attributing a step to the wrong role is the #1 source of operational confusion.

| Role | Person (today) | Responsible for |
|------|----------------|-----------------|
| **Care Coordinator** | Isaac (owner) | All lead handling, phone screens, in-person intros, membership signup, payment, data entry, scheduling, interpreter between client and clinician. Holds ISSA-CPT, ISSA Nutrition, ISSA Strength & Conditioning, CPR. **Not a medical provider.** |
| **Trainer** | TBD hire — Isaac covers until hired | All hands-on coaching/PT sessions, weekly/daily training, recovery modality supervision, day-to-day fitness programming. |
| **Partner Clinician** | Dr. Tavie (White Horse Holistic Health) | All medical visits, intake history, prescriptions, lab interpretation, clinical decision-making. Sees patients at most monthly (CONCIERGE), quarterly (CORE), or twice yearly (ESSENTIALS). External contractor; per-visit pay; uses her own scheduling system. |

> When Isaac is on a call or in an intro and someone describes a clinical/medical concern, the answer is *always* "our medical provider is Dr. Tavie at White Horse Holistic Health — let me get you connected" or 911 if an emergency. Isaac may discuss fitness, nutrition, and program design freely under his ISSA credentials.

---

## 2. The Four-Stage Funnel

```
        STAGE 1                 STAGE 2                 STAGE 3                       STAGE 4
        ─────────               ─────────               ─────────                     ─────────
Ad/word → Lead Capture  ─→  Phone Screen        ─→  In-Person Intro + Signup    ─→  First Visits
of mouth (web form,         (15 min, free,          (60-90 min, free, in-clinic,    (trainer: ≤1 wk
         phone, walk-in)    Isaac calls back)      ConsultationFlowModal wizard)   Tavie: when WHH books)

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
3. **Brief overview of our model.** "We're a coordinated coaching + medical clinic. You work weekly with a trainer for fitness and nutrition, and you see Dr. Tavie at our partner medical clinic for periodic clinical visits and labs — frequency depends on tier. I coordinate all of it for you."
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

### 5.3 ConsultationFlowModal — 11 steps

`hollis-health-app/web-admin/components/admin/ConsultationFlowModal.tsx` walks through these in order. All run on Isaac's laptop with the prospect sitting next to him.

1. **client-info** — Full name, DOB, email, phone, address, emergency contact. Issues a pre-issued patient barcode at flow start.
2. **intake** — Reason for visit, current medications, allergies, past medical history, family history, social history (writes to `ClinicalProfile.intake*` fields).
3. **tier-selection** — ESSENTIALS / CORE / CONCIERGE.
4. **contract-duration** — 4 mo (0% off) / 8 mo (5% off) / 12 mo (10% off).
5. **sign-membership** — Membership Agreement. Signed on tablet. Stored in `ConsentRecord` with version hash + IP + UA.
6. **sign-liability** — Liability Waiver. Same.
7. **sign-consent** — Informed Consent. Same.
8. **sign-comms** — Electronic Communications Consent. Same.
9. **sign-release** *(optional)* — Photo/Video Release if you want to use their image in marketing.
10. **payment** — Stripe payment. See §5.4 for the two paths.
11. **success** — Generates a scannable QR-encoded barcode for the new member. Member uses this in the patient app on first launch.

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
- Tell them: "You'll see your first trainer session on your calendar already. For your first visit with Dr. Tavie, she or her assistant will reach out to you directly to coordinate, and I'll add it to your calendar as soon as it's set. That usually happens within a week or two."

---

## 6. Stage 4 — First Visits

Two visits, two different scheduling paths.

### 6.1 First trainer / PT session

- **Booked at signup** (Stage 3 §5.6). Already on Isaac's (or trainer's) calendar.
- Member sees it in patient app `appointments` tab.
- 24h and 1h push reminders fire automatically per existing `notifyAppointmentReminder*` infrastructure.
- Standard `TRAINING_SESSION` appointment type.

### 6.2 First medical visit with Dr. Tavie (White Horse Holistic Health)

Tavie operates her own scheduling system at White Horse Holistic Health. There is **no calendar integration** between WHH and the Hollis platform. Coordination is manual and SMS-driven.

**Path A (default):** Isaac texts Tavie from the shop number after signup: "Hi Tavie, new member [first name only, no PHI] signed up today, [tier] — needs first clinical visit. Please reach out at [phone]. Thanks." Tavie or her assistant contacts the member directly, schedules within her own system, then texts Isaac the confirmed date/time.

**Path B (if WHH workflow shifts):** Tavie tells Isaac available slots in batch (e.g. "Hollis members can take Mon/Wed 9–11 next two weeks"). Isaac books against that block during Stage 3 §5.6, then notifies Tavie.

**Once a slot is confirmed (either path):**
1. Isaac opens web-admin `/schedule` (or the patient's detail page).
2. Creates a `CONSULTATION` appointment with `appointmentType=CONSULTATION`, the confirmed date/time, location = "White Horse Holistic Health" (free-text in notes today; no `PartnerClinic` model exists — see §11).
3. Member sees the appointment in their patient app immediately.
4. 24h and 1h push reminders fire automatically.

### 6.3 PHI-handling note on Tavie coordination

When Isaac texts Tavie about a new member, use **first name only** plus tier — no DOB, no diagnoses, no symptoms in plain SMS. If Tavie needs full clinical context before the visit, send it through her HIPAA-secure channel at WHH, not via SMS. (BAA with WHH must be signed before any PHI is shared in either direction — tracked in `project_clinic_launch.md` remaining must-dos.)

---

## 7. Ongoing Care Coordination (Post-First-Visit)

Once both first visits are complete, the member enters steady state:

- **Trainer sessions** per tier (1/wk ESSENTIALS, 2/wk CORE, 4/wk CONCIERGE). Booked recurring or per-week by trainer/coordinator.
- **Recovery modalities** (infrared sauna, cold plunge, red light) — unlimited at all tiers. No appointment needed; first-come.
- **Clinician visits with Tavie** at tier cadence (2×/yr / quarterly / monthly). Each one coordinated SMS-style same as the first.
- **Lab panels** at WHH, results flow back into Hollis system via existing lab workflow (`labs-manual-workflow.md`).
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

From `offer-sheet.json` v2.1.0 (effective 2026-04-09):

| Tier | Base monthly | 4mo (0% off) | 8mo (5% off) | 12mo (10% off) | Coaching/wk | Tavie visits |
|------|-------------|-------------|-------------|---------------|------------|--------------|
| ESSENTIALS | $799 | $799 | $759 | $719 | 1 | 2×/yr |
| CORE | $1,599 | $1,599 | $1,519 | $1,439 | 2 | Quarterly |
| CONCIERGE | $2,499 | $2,499 | $2,374 | $2,249 | 4 | Monthly |

All tiers include unlimited recovery modalities, health dashboard, and care coordination. CORE and CONCIERGE include DEXA scans. CONCIERGE includes CGM. All medical services are provided through White Horse Holistic Health.

> **Always verify against the current `offer-sheet.json`** before quoting — pricing is the source of truth there, not this doc.

---

## 11. Gaps Before Launch

Status snapshot as of **2026-05-20** (post 7-fix engineering batch). See [`../reports/2026-05-20-launch-readiness-snapshot.md`](../reports/2026-05-20-launch-readiness-snapshot.md) for the full audit and fix log.

### ✅ Closed in 2026-05-20 batch (no further engineering work)
- Manual card entry in `ConsultationFlowModal` payment step — confirmed: Stripe Payment Element renders in `setup` mode, always available regardless of Terminal connectivity.
- `LeadPipeline.consultationDate` admin UI — date picker added to `/leads` rows, auto-opens when stage transitions to `CONSULTATION_BOOKED`.
- "Create lead manually" admin UI — `CreateLeadModal` + `POST /api/admin/leads` for phone/walk-in leads.
- Lead → `ConsultationFlowModal` conversion on success — `convertedUserId` set and stage moves to `ACTIVE_MEMBER` automatically.
- Walk-in/phone SOP rewritten — now correctly reflects Care Coordinator role + ISSA credentials.
- Subscription creation atomicity — wizard no longer silently advances to success on Stripe failure; new `POST /api/admin/subscriptions/:userId/retry` endpoint + UI retry path + "Subscription Pending" success state.
- CAN-SPAM for waitlist confirmations — `unsubscribeToken` / `emailOptIn` / `consentedAt` now populated; unsubscribe link in confirmation email.
- Notification permission proactively requested in patient-app onboarding (new step before `complete`).
- `location` field surfaced in `NewAppointmentModal` with WHH auto-suggest for `CONSULTATION` type.

### 🔴 P0 — owner/ops actions still required (no code work)
1. **BAA with White Horse Holistic Health** — must be signed before any PHI flows between systems.
2. **BAA with Sentry** — error payloads visible to Sentry even with PHI scrubbing.
3. **`HIPAA_NPP` consent type** — Agent K wrote NPP content (`hipaa-npp-content.md`) but the `ConsentDocumentType.HIPAA_NPP` enum value, migration, and `ConsultationFlowModal` enrollment integration are not yet shipped. Patients must acknowledge NPP before or at first service per 45 CFR §164.520.
4. **Apply pending Prisma migrations to prod** — `20260520000000_phi_access_log_rls` (then `ALTER ROLE <app_service> BYPASSRLS;`) and `hollis-identity` initial migration.
5. **Stripe prod keys → AWS Secrets Manager** — currently only test keys in `server/.env`.
6. **`SENTRY_DSN` → AWS Secrets Manager** — blank in all environments today; prod crashes will be silent.
7. **Rotate Gemini API key** if `server/.env` is in git history (`server/.env:45` and `.env:62` both contain it). Verify with `git log --all -- server/.env`.
8. **Confirm `RDS Multi-AZ` is applied** — tfvars value was ambiguous in the audit; verify with `terraform plan`.

### 🟠 P0 — engineering follow-ups from 2026-05-20 batch
1. **Republish `@hollis-studio/contracts`** to propagate the new admin routes (`subscriptions.retryForUser`, `leads.update`, `leads.CREATE`) and the `convertedUserId` field on `adminLeadStageUpdateBodySchema`. Local dist is rebuilt and synced into all `node_modules/` for now, but a fresh `npm install` would clobber it. After republish, clean up the TODO workarounds in `web-admin/services/admin/leadsService.ts`, `web-admin/services/billingService.ts`, and `server/src/routes/admin/leads.ts`.
2. **Set `SERVER_PUBLIC_URL=https://api.hollis.health`** (or equivalent) in prod env — without it, the CAN-SPAM unsubscribe links built by `lib/urls.ts` fall back to `FRONTEND_URL` which may not be the API origin.
3. **Add `PHONE_CALL` and `WALK_IN`** to a published `LeadSourceSchema` enum on next contracts bump (currently only in local server Zod schema).

### 🟡 P1 — desirable but not blocking
1. **24h lead-reminder email cron** — no equivalent of `appointmentReminders.ts` exists for `LeadPipeline.consultationDate`. Today: Isaac sends consultation reminders manually.
2. **Email templates** for: (a) `CONSULTATION_BOOKED` confirmation, (b) 24h-before reminder, (c) post-signup welcome with app download links. (`INQUIRY` confirmation already exists.)
3. **Pre-fill patient-app intake from `ClinicalProfile`** so members aren't asked the same intake questions twice. (Today: the intake-step filter correctly skips them if `intake.isComplete === true` server-side — verify the in-clinic wizard sets that flag.)
4. **"Convert lead to registration" pre-fill** — clicking a lead row should open `ConsultationFlowModal` pre-populated with name/email/phone/tier from the lead, eliminating re-typing.
5. **Lead detail/edit page** — today coordinator can update stage + consultationDate inline, but cannot edit name/phone/email/notes after creation.
6. **Add a step inside `ConsultationFlowModal` to book the first `TRAINING_SESSION`** so it happens inside the wizard instead of as a separate flow on the patient detail page.
7. **CloudWatch alarm** on the log line `"Orphaned Stripe subscription canceled successfully"` (already emitted by `subscriptionService.ts`) to catch any future orphaned-state escapes.
8. **Stripe Terminal provisioning** — `ENABLE_STRIPE_TERMINAL=false` and `STRIPE_TERMINAL_LOCATION_ID=` empty. Create a Stripe Terminal Location in Dashboard, paste its ID into prod env, set the enable flag, redeploy. Required before first card-present transaction.
9. **`ENABLE_AUDIT_CHAIN_VERIFY=true`** in prod env — the daily 04:00 UTC audit-chain verify cron exists but is gated behind this flag.
10. **PagerDuty endpoint** + CloudWatch canary S3 bucket — both blank in `prod/terraform.tfvars`.
11. **DMARC DNS record** — DKIM and SPF are in Terraform; DMARC is missing. Major ISPs increasingly route to spam without it.
12. **Re-run pre-commit suite against current HEAD** — the green 59/59 report is 8 days stale (pre-batch).

### 🟢 P2 — post-launch
- UTM / ad attribution (skip until paid ads start).
- `PartnerClinic` model + `ExternalClinician` reference (today: WHH location is free-text on appointments).
- WHH calendar bridge (iCal/Google sync) — depends on Tavie's office committing.
- SMS provider (Twilio HIPAA-eligible) — today: email-only, Isaac texts manually from (210) 891-9005.
- Self-serve online checkout on `web-public` for prospects who want to skip the in-person intro.
- Lab/DXA/sleep-screening appointment types auto-creating downstream records.
- Per-appointment deep-linking from push notifications (today: deep-links to appointments tab list).
- Identity Service consumption (the standalone service exists but `hollis-health-app/server` doesn't consume it yet).

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
- [ ] **(deferred — P1)** 24h reminder cron not yet implemented; manually note this step is skipped.
- [ ] **Test the new admin "Add Lead" button:** open the `CreateLeadModal`, create a fake walk-in lead with source `WALK_IN`, verify it appears at stage `INQUIRY`.

### 12.4 Stage 3 — In-person intro + signup
- [ ] In web-admin, open `/registrations` and launch `ConsultationFlowModal`.
- [ ] Walk through all 11 steps with test data.
- [ ] At step 10 (payment): the wizard uses Stripe `SetupIntent` (mode=`setup`) — coordinator sees a "Save Payment Method" UI, **not** a dollar amount. This is correct. Use test card `4242 4242 4242 4242`.
- [ ] Verify wizard reaches step 11 (success) with a QR barcode in the GREEN success state (not the amber "Subscription Pending" state).
- [ ] Verify in DB: new `User` row, `Subscription` row, 4 `ConsentRecord` rows, `ClinicalProfile` row.
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

### 12.6 Stage 4 — First Tavie visit
- [ ] In web-admin, create a `CONSULTATION` appointment for the new member. **The location field should auto-suggest "White Horse Holistic Health"** when CONSULTATION is selected — verify the auto-fill. Set the date to 7 days out.
- [ ] Verify it appears in member's patient app with the WHH location string.
- [ ] Verify 24h reminder push fires (advance time or trigger manually).

### 12.7 Patient app first-run
- [ ] Install patient app on a clean device or simulator.
- [ ] Scan or enter the test member's barcode.
- [ ] Set password.
- [ ] Walk through onboarding wizard. **Verify the new `notifications-permission` step appears before `complete`** — tap "Enable Notifications" and grant the iOS/Android system prompt. Confirm push token registers (check `DevicePushToken` row in DB).
- [ ] Repeat with a fresh install and tap "Skip" instead — verify the wizard still completes and lands on the dashboard.
- [ ] Verify `appointments` tab shows both first visits (trainer + Tavie/WHH).
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
- HIPAA NPP: [`hipaa-npp-content.md`](./hipaa-npp-content.md)

---

Last reviewed: 2026-05-20 (post 7-fix engineering batch — see [`../reports/2026-05-20-launch-readiness-snapshot.md`](../reports/2026-05-20-launch-readiness-snapshot.md))
