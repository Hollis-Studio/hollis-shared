# Imaging Orders and Referrals SOP

**Purpose:** Document the manual process for ordering imaging studies and making referrals to other providers. There is no automated imaging order or referral management in the Hollis platform at launch. This SOP defines the workflow and tracking method until a system is built.

**Related docs:**
- [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md)
- [`labs-manual-workflow.md`](./labs-manual-workflow.md)
- [`prescribing-workflow-sop.md`](./prescribing-workflow-sop.md)

---

## 1. Imaging Orders

### 1.1 When to order imaging
Order imaging when clinically indicated. Hollis does not have on-site imaging — all orders are sent to an external imaging center. Confirm with the patient which imaging centers accept their insurance (if they have insurance) or which are nearest.

### 1.2 Writing the imaging order
Write the order on clinic letterhead or a pre-printed imaging order form. Include:
- Patient full name and date of birth
- Date of order
- Type of study (e.g., X-ray, MRI, ultrasound) and anatomical area
- Clinical indication (brief, e.g., "rule out fracture," "evaluate joint effusion")
- Urgency: routine, soon (within 1 week), or urgent (within 24–48 hours)
- Your name, NPI, clinic address, and phone number
- Your signature

### 1.3 Patient instructions
- Hand the order form to the patient.
- Instruct them to call the imaging center to schedule and to bring the order form.
- Advise them to request that the imaging center fax results to: [insert fax number when established].
- If no fax is yet established: instruct the patient to obtain the results CD or report and bring it to their next visit or scan/upload it through the Hollis app.

### 1.4 Tracking imaging orders
Add a clinical note tag `[IMAGING ORDERED]` to the patient's chart note for the visit on which you placed the order. Include:
- Date ordered
- Study type and body part
- Imaging center (if known)
- Status: "Pending" at the time of ordering

When results come in:
1. Update the chart note tag to `[IMAGING COMPLETE]`.
2. Upload the result report to the patient's chart (web-admin > Patient > Documents).
3. Review results and document your clinical interpretation in a follow-up note.
4. Notify the patient of results via secure message or a scheduled results visit — within 5 business days of receipt.

---

## 2. Referrals

### 2.1 When to refer
Refer when the patient's presenting condition is outside your scope, requires specialist management, or would benefit from co-management with another provider.

### 2.2 Referral letter template

Use this template. Fill in the bracketed fields.

---

**[Date]**

**To:** [Specialist Name, Credential]
**Practice:** [Practice Name]
**Address:** [Address]
**Fax:** [Fax number]

**Re:** [Patient Full Name], DOB [DOB]

Dear [Specialist Name or "Colleague"],

I am referring the above-named patient for evaluation and management of [presenting concern / diagnosis].

**Relevant history:**
[2–4 sentence summary: chief complaint, relevant past medical history, pertinent medications, allergies.]

**Reason for referral:**
[1–2 sentences: what you want the specialist to assess or manage.]

**Relevant findings:**
[Pertinent exam findings, recent labs, or imaging results as applicable.]

**Questions for you:**
[Optional: specific questions you want answered.]

Please send a consultation note to:
Isaac D. Landes
Hollis Health
691 S Seguin, New Braunfels, TX 78130
Phone: (210) 891-9005
Email: isaac@hollis.health

Thank you for seeing [Patient First Name]. Please feel free to contact me with any questions.

Sincerely,

Isaac D. Landes
[Credential]
NPI: [Your NPI]
Hollis Health

---

### 2.3 Sending the referral
- Print and hand to the patient, or fax to the specialist practice if you have their fax number.
- Instruct the patient to call the specialist office to schedule the appointment.
- Provide the patient with the specialist's contact information if available.

### 2.4 Tracking referrals
Add a clinical note tag `[REFERRAL SENT]` to the chart note for the visit on which you made the referral. Include:
- Date referred
- Specialist name and specialty
- Referring concern
- Status: "Pending specialist contact"

When the consultation note is received:
1. Update the tag to `[REFERRAL COMPLETE]`.
2. Upload the consultation note to the patient's chart.
3. Document any changes to the care plan in a follow-up note.
4. Follow up with the patient if they have not seen the specialist within 30 days of the referral.

### 2.5 Urgent referrals
If the referral is urgent (same-day or within 24–48 hours):
1. Call the specialist office directly to notify them of the urgent referral.
2. Document the call: who you spoke with, what was communicated, and the expected appointment time.
3. Call the patient to confirm they made the appointment.
4. If the concern is emergent, redirect to 911 or the ER rather than making a referral. (See [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md) §1.4.)

---

## 3. General Notes

- DO NOT order imaging or make referrals without documenting the clinical indication in the chart.
- DO NOT assume the patient will follow up on a referral. Note in the chart when you have not received a consultation report within 30 days and consider a follow-up message to the patient.
- All referral letters involving PHI must be transmitted via fax or secure mail — not plain email — until a secure direct message system is in place.

---

Last reviewed: 2026-05-19
