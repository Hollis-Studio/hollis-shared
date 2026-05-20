# Day-1 Clinic Runbook

**Purpose:** Master checklist for opening and running the clinic on day 1 (and every day thereafter until SOPs are automated). Applies to Isaac operating solo with no front desk.

**Related docs:**
- [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md)
- [`no-show-cancellation-policy.md`](./no-show-cancellation-policy.md)
- [`labs-manual-workflow.md`](./labs-manual-workflow.md)
- [`prescribing-workflow-sop.md`](./prescribing-workflow-sop.md)

---

## 1. Morning Opening Procedure (60 minutes before first patient)

### 1.1 Physical space
- [ ] Unlock clinic door and turn on lights.
- [ ] Confirm exam room is clean, stocked, and equipment is powered on.
- [ ] Verify paper supply: Rx pads, lab requisition forms, Release of Information forms, NPP handouts, intake paper forms (emergency backup).
- [ ] Post the clinic phone number and hours on the door.

### 1.2 Technology
- [ ] Open web-admin dashboard and confirm login succeeds.
- [ ] Check the day's appointment list. Print or screenshot it — this is your fallback if the platform goes down.
- [ ] Confirm Stripe Terminal reader is powered on and connected.
- [ ] Confirm phone is charged and ringer is on.

### 1.3 Inbox sweep
- [ ] Check `isaac@hollis.health` for any patient messages sent since last evening.
- [ ] Check platform secure messages (web-admin > Messages).
- [ ] Respond to or triage any urgent messages before the first appointment.

---

## 2. Patient Check-In Flow (Solo Clinician, No Front Desk)

Isaac greets and checks in each patient personally. The check-in happens in the reception area before moving to the exam room.

### 2.1 Steps
1. **Greet patient.** Confirm full name and date of birth.
2. **Verify consent on record.** In web-admin, confirm the patient has a signed Membership Agreement, HIPAA NPP acknowledgment, and Liability Waiver. If any are missing, have the patient complete them on the tablet before the encounter proceeds.
   - DO use the tablet consent flow in the app.
   - DON'T proceed to the exam room without all three documents signed.
3. **Collect co-pay or session charge** if applicable (see §4 for payment).
4. **Hand NPP handout** to any patient who has not previously acknowledged it in-system. (See [`hipaa-npp-content.md`](./hipaa-npp-content.md).)
5. **Direct patient to waiting area.** Return to finish any outstanding tasks, then call patient into exam room.

### 2.2 New patient (first visit)
- Walk patient through Membership Agreement on the tablet signing flow.
- Collect and verify photo ID.
- Confirm emergency contact information matches what is in the system. If not, update in web-admin before the encounter.
- Note any allergies or medications not yet in the chart.

---

## 3. If the API / Platform Goes Down

DO NOT cancel appointments because the system is unavailable. The clinic continues operating.

### 3.1 Immediate steps
1. Confirm it is a platform outage and not a local network issue (check your phone's mobile data; try loading the web-admin from a mobile hotspot).
2. If outage is confirmed, switch to **paper mode**:
   - Pull the printed (or screenshotted) appointment list from morning prep.
   - Use paper intake forms (stored in the supply cabinet) for any new clinical data.
   - Document the visit in a dated paper SOAP note (pad in the exam room).
3. **Do not write any ePHI in unencrypted text messages or email** during the outage period.
4. **Notify patients** if their secure message access is affected. You may send a plain email: "Our patient portal is temporarily unavailable. Your appointment is confirmed. I will update your chart as soon as systems are restored. For clinical needs, call (210) 891-9005."

### 3.2 After restoration
- Enter all paper encounter notes into the system within 24 hours.
- Upload any paper forms to the patient's chart.
- Note in each chart entry: "Documented from paper note due to system outage on [date]."
- Log the outage in your incident tracking (email chain to yourself or a note in `docs/temp/` is fine for now).

### 3.3 Emergency ePHI access during outage
Per the HIPAA-DR-PLAN §4.3: if you need to access a patient record and the platform is down, you as both clinician and Privacy Officer authorize your own emergency access. Document the clinical justification in a dated note, access the most recent backup export (contact AWS support if needed), and log the access in the post-incident record.

---

## 4. Payment

### 4.1 Normal flow
- Stripe Terminal reader processes card-present payments.
- Subscription billing runs automatically via Stripe.
- New charges (add-ons, labs pass-through, etc.) are entered in web-admin > Billing.

### 4.2 If Stripe Terminal fails

**DO NOT** tell a patient you cannot collect payment. You have two fallbacks:

**Option A — Stripe Payment Link (preferred)**
1. Log into [dashboard.stripe.com](https://dashboard.stripe.com) on your phone or laptop.
2. Create a Payment Link for the amount due.
3. Text or email the link to the patient.
4. Wait for confirmation that payment processed before the patient leaves, or agree on a 24-hour deadline.

**Option B — Manual paper receipt**
1. Record in a dated paper ledger: patient name, date, amount, service description, and payment method.
2. If the patient pays cash: issue a handwritten receipt. Keep a copy.
3. If the patient pays check: make it payable to "Hollis Health LLC." Hold the check securely.
4. Enter the manual payment into Stripe (Dashboard > Customers > [patient] > Add payment) as soon as the system is back, or manually record it in web-admin billing.

**DO NOT** accept payment and fail to record it. Every transaction gets a paper trail.

### 4.3 Membership billing failures
- If a membership charge declines, do not deny the patient care for that day's visit.
- Send a follow-up message through secure messaging or email within 24 hours requesting updated payment info.
- Per Section 4.5 of the Membership Agreement, Hollis may re-attempt the charge after notice.

---

## 5. End-of-Day Close

- [ ] All encounter notes finalized in the system.
- [ ] Any paper forms scanned or photographed and uploaded to the patient chart.
- [ ] Paper Rx copies filed in the locked Rx log binder (see [`prescribing-workflow-sop.md`](./prescribing-workflow-sop.md)).
- [ ] Lab requisitions for specimens sent out today — logged in the lab order tracker (see [`labs-manual-workflow.md`](./labs-manual-workflow.md)).
- [ ] Stripe Terminal powered down.
- [ ] Clinic locked.
- [ ] After-hours auto-reply active (see [`after-hours-messaging-sop.md`](./after-hours-messaging-sop.md)).

---

Last reviewed: 2026-05-19
