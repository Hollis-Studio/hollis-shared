# No-Show and Cancellation Policy

**Purpose:** Define the patient-facing cancellation policy and the internal workflow for assessing late-cancellation fees manually via Stripe. The Hollis platform does not yet enforce these fees automatically — this document is the controlling procedure until automation is implemented.

**Related docs:**
- [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md)
- [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md)

---

## Part 1 — Patient-Facing Policy

*This text is suitable for inclusion in the patient handbook, the booking confirmation email, and the website. Use as-is or with minor formatting adjustment.*

---

### Hollis Health — Appointment Cancellation and No-Show Policy

We reserve appointment time exclusively for you. Out of respect for your clinician's time and other patients who may need that slot, we ask that you give adequate notice when you need to cancel or reschedule.

**Cancellation with 24+ hours notice**
No fee. Cancel anytime through the Hollis app, at hollis.health, or by calling (210) 891-9005.

**Late cancellation (less than 24 hours notice)**
A late-cancellation fee of **$50** may be assessed. We understand that life happens — this fee may be waived at the clinician's discretion for genuine emergencies.

**No-show (missed appointment without notice)**
A no-show fee of **$75** may be assessed. Repeat no-shows (two or more in a 90-day period) may result in suspension of scheduling privileges or termination of membership per Section 6.5 of the Membership Agreement.

**How to cancel**
- App: tap your upcoming appointment and select "Cancel."
- Website: hollis.health > My Appointments.
- Phone: (210) 891-9005. Leave a voicemail if we do not answer — the timestamp of your call is your cancellation record.
- Email: isaac@hollis.health (not recommended for time-sensitive cancellations).

**Fee waiver requests**
If you believe a late-cancel or no-show fee should be waived, contact us within 7 days at isaac@hollis.health. We will respond within 2 business days.

---

## Part 2 — Internal Procedure

### 2.1 Identifying a late cancel or no-show

**Late cancel:** Patient cancels with less than 24 hours notice. The system logs the cancellation timestamp. Compare to the appointment start time.

**No-show:** Appointment time passes. Patient did not arrive and did not cancel. Wait 15 minutes past the scheduled start time before marking as a no-show in web-admin.

### 2.2 Decision to assess a fee

The fee is not automatic. Isaac reviews each case before assessing.

Assess the fee if:
- This is the patient's second or subsequent late cancel or no-show within 90 days.
- No explanation was provided.
- The cancellation was clearly non-urgent (e.g., patient messaged to reschedule for convenience with less than 2 hours notice).

Do NOT assess the fee if:
- The patient documented a genuine emergency (illness, family emergency, accident).
- This is the patient's first offense with no history of no-shows.
- The appointment was booked within the last 48 hours (patient may not have had 24-hour notice to cancel in time).

When in doubt, do not assess the fee. Patient relationship is the priority in the early launch period.

### 2.3 Assessing the fee manually via Stripe

The platform does not charge late-cancel or no-show fees automatically. Follow these steps:

1. Log into [dashboard.stripe.com](https://dashboard.stripe.com).
2. Navigate to Customers and search for the patient by name or email.
3. Open the customer record and confirm the card on file is valid and current.
4. Click "Create payment" (or use a Payment Link if the customer record does not support direct charge from the dashboard without a saved payment method).
   - Amount: $50 (late cancel) or $75 (no-show).
   - Description: "Late cancellation fee — [appointment date]" or "No-show fee — [appointment date]."
5. Process the charge.
6. Send a receipt. Stripe sends an automatic email receipt if the customer's email is on file and receipts are enabled. Confirm this happened.
7. Log the action in web-admin: add a note to the patient's account (e.g., "Late cancel fee $50 charged via Stripe on [date] for [appointment date] cancellation").

### 2.4 Communicating the fee to the patient

Before or at the time of charging, send the patient a message via secure messaging in the app or via email:

> "Hi [First Name], I'm following up on your [appointment date] appointment [that was cancelled with less than 24 hours notice / that you missed]. Per our cancellation policy, a [$50 / $75] fee applies. This has been charged to the card on file. If you have questions or believe this should be waived, please reply here or email isaac@hollis.health within 7 days. Thank you."

DO NOT charge the fee without notifying the patient. DO NOT argue the policy over the phone.

### 2.5 Waiver procedure

If a patient requests a waiver and you approve it:
1. Refund the charge in Stripe Dashboard: open the payment > Refund.
2. Note the refund in web-admin: "Late cancel fee waived — [reason] — refunded [date]."
3. Reply to the patient confirming the waiver and refund.

If you deny the waiver request:
1. Reply within 2 business days: "Thank you for reaching out. After review, I'm not able to waive this fee. The charge will remain. If you have further questions, please let me know."

### 2.6 Repeat offenders

Two or more late cancels or no-shows within a 90-day period may trigger membership suspension or termination. Before taking that step:
1. Send a written warning after the second offense.
2. If a third offense occurs within 90 days, contact legal@hollis.health (yourself) and document the decision to suspend or terminate in writing.
3. Termination follows Section 6.5 of the Membership Agreement.

---

Last reviewed: 2026-05-19
