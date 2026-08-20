# Sponsored Biomarker Panel Program SOP (Function Health)

**Purpose:** Define exactly how the Hollis-sponsored blood biomarker panel works — who pays, who does what, how a member's results reach their Hollis dashboard, and the hard limits on what Hollis does with them.

**Effective:** 2026-08-19. Replaces [`labs-manual-workflow.md`](./labs-manual-workflow.md) (superseded).

**Related docs:**
- [`../reports/2026-08-19-business-model-change.md`](../reports/2026-08-19-business-model-change.md) — why this changed
- [`client-acquisition-flow.md`](./client-acquisition-flow.md) — where enrollment sits in the funnel
- [`walk-in-and-phone-sop.md`](./walk-in-and-phone-sop.md) — what to say when a member asks about results
- [`baa-tracker.md`](./baa-tracker.md) — vendor PHI assessment

---

## 1. The one-paragraph version

Hollis Health pays for a Function Health membership for CORE and CONCIERGE members. Function Health is an independent company; the member's account is in the member's name, under Function Health's terms, with Function Health's own ordering providers. Function Health handles **all** of it — the order, the draw, the panel, the results, and any clinical follow-up. Hollis never sees results unless the member downloads their own PDF and chooses to share it. If they do share it, and only with written consent on file, Isaac uploads it to their Hollis record so it appears as trend data alongside their training and body composition. **Hollis does not read those results for anything clinical, does not flag abnormal values, and never tells a member what a result means.**

## 2. Roles and hard limits

| Who | Does | Never does |
|---|---|---|
| **Function Health** (and its independent providers) | Orders the panel, arranges the draw, runs the labs, delivers results to the member, handles clinical questions and abnormal findings. | — |
| **Member** | Holds the account. Books their own draw through Function Health. Receives their own results. Decides whether to share the export with Hollis. | — |
| **Hollis / Isaac** | Pays the sponsorship. Tells the member the benefit exists and helps them get enrolled. Reminds them a draw is available. Captures consent. Uploads the PDF they hand over. Uses the numbers as context for training and nutrition programming, the same way body weight or sleep is used. | Order or select a panel. Book the draw. Contact Function Health about a member's results. Read results looking for problems. Say a value is high, low, normal, concerning, or fine. Tell a member to see a doctor because of a value. Notify a member of an abnormal result. |

> If a member asks **"what does this number mean?"** the answer is always: *"That's a question for the provider who ordered it — Function Health has clinicians for exactly that, and they're who you should ask. I use these numbers to shape your training and nutrition, not to tell you what they mean medically."* Say it plainly, every time, no matter how obvious the answer seems.

## 3. Enrollment

### 3.1 Who gets it
- **CONCIERGE** — sponsored.
- **CORE** — sponsored.
- **ESSENTIALS** — not sponsored. Do not offer it, do not imply it, do not "throw it in."

If a member downgrades from CORE/CONCIERGE to ESSENTIALS, the sponsorship does not renew at the next Function Health billing date. Tell them that at the time of the downgrade, in writing.

### 3.2 Steps (at signup, Stage 3 of the acquisition flow)

1. Confirm the member's tier is CORE or CONCIERGE.
2. Explain the benefit in plain terms: a standard 160+ biomarker blood panel membership, twice yearly, sponsored by Hollis and run by an independent company on that company's own terms. Their account, their results, their choice whether to share.
3. **Say the limits out loud, before they sign up for it:**
   - "The medical side is entirely theirs — they order it, they run it, their clinicians answer questions about it."
   - "I don't get your results automatically. You'd have to send them to me."
   - "If you do share them, I use them for programming. I don't read them for medical problems, and I won't tell you what they mean."
4. Get the member enrolled with Function Health in **their own name and their own email**. Never create an account under a Hollis address, and never use a shared Hollis login for a member's account.
5. Record it in web-admin: **member's record → Profile tab → Sponsored Blood Panel**. Set status to Enrolled and fill in the enrolment date and the sponsorship renewal date. Tier at enrollment is stamped automatically the first time you mark someone Enrolled.
   - The section is admin-only. Trainers cannot see or change it — it is a billing commitment.
   - You cannot mark an ESSENTIALS member Enrolled; the option is disabled and the server refuses it.
   - **The renewal date is when Hollis pays again. It is not a draw date.** Never tell a member they are "due" based on it.
6. **Do not** take custody of the member's Function Health password, and do not log into their account for them. Not once, not "just to help."

### 3.3 Cadence — theirs, not ours

It is a **standard Function Health membership: 160+ biomarkers, twice yearly.** Cadence, panel contents, scheduling windows, and every clinical aspect are governed by **Function Health's own terms and conditions, not ours.** We do not set the schedule, cannot change it, and should never quote a date as though it were a Hollis commitment.

If a member asks when their next panel is: *"That's on their schedule, not ours — it's twice a year and they'll let you know. Check your account with them."*

### 3.4 Ongoing
- Check sponsorship renewal dates monthly against active CORE/CONCIERGE membership.
- If a membership lapses or downgrades, do not renew the sponsorship.
- A reminder that a draw is available is fine ("your second panel of the year should be open, worth booking"). Scheduling it for them is not.

## 4. Getting results into Hollis

### 4.1 Consent — the gate

**No consent on file, no upload. There is no exception, including "the member just handed it to me."**

Two things must both be true before any report is uploaded:

1. The member has signed the **Informed Consent for Health Services**, including the initials block for *Member-Shared Laboratory Records (Section 2)*. This is captured in the signing packet at membership signup and stored as a `ConsentRecord`.
2. The member has affirmatively said, for **this specific report**, that they want it in their Hollis record. Text, email, or in person is acceptable; verbal-in-person must be logged the same day.

Log the second one in the member's record: date, how they gave it, what report it covers. *(A per-upload consent attestation field is planned — see the admin dashboard plan. Until it ships, this goes in a note on the member's record, dated, before the upload.)*

If a member ever asks you to remove a shared report, remove it. Do not ask why. Confirm in writing when it's done.

### 4.2 What the member sends you

Function Health provides a **PDF** export. The member gets it from `my.functionhealth.com/documents` and downloads it themselves. There is no CSV or structured export as of 2026-08 — if a member sends a spreadsheet, they built it themselves or used a third-party tool, and you should treat it as unverified.

Accept the PDF by any channel the member chooses that is appropriate for health information: in the Hollis app's secure messaging, in person on a USB/printout, or by an email they initiate. **Do not ask a member to text you a results PDF.**

### 4.3 Upload procedure

1. Open web-admin → the member's record → Labs → add report.
2. Upload the PDF. The extraction step reads the biomarkers, values, units, and reference ranges out of the document.
3. **Verify every extracted value against the PDF.** The extraction is AI-assisted and can misread. Low-confidence rows are flagged; resolve all of them. You are checking transcription accuracy — *did the number get copied correctly* — not clinical meaning.
4. Set the report source/lab name so the provenance is obvious on the record.
5. Save. The member sees the report and their trends in the app.

### 4.4 After the upload — what you do and don't do

- **Do:** let the numbers inform training load, recovery, and nutrition targets the same way any other tracked metric does.
- **Do:** tell the member the report is now in their dashboard.
- **Don't:** review the report for abnormal or urgent findings. That is not a service Hollis offers, and Informed Consent §2.3 states affirmatively that we have no duty to identify, flag, or notify.
- **Don't:** send any message that characterizes a result — no "everything looks good," no "you might want to get that rechecked." *"Everything looks good"* is an interpretation and it is the single easiest way to cross the line.
- **Don't:** call a member about a result. Ever. If something in a report worries you personally, the correct action is: *"I'd encourage you to go over your panel with the clinicians at the service that ran it — that's what they're there for."* Nothing more specific than that.

### 4.5 If a member reports an urgent finding to you

They may come to you upset about a value. You are not the responder.

> "I'm glad you told me. The people who ran that panel have clinicians whose job is exactly this — call them today. If you're having symptoms right now that feel serious, go to urgent care or call 911. I'm not able to tell you what that number means, and I'd be doing you a disservice if I guessed."

Log that the conversation happened and that you referred them out. Do not log your opinion of the value.

## 5. Marketing constraints

- **No Function Health branding on any Hollis public surface.** No logo, no wordmark, no brand colors, no screenshots of their app or reports. This applies to `web-public`, ads, social posts, printed collateral, and the offer sheet.
- Describe the benefit in Hollis's own words and typography: what it is (a 160+ biomarker blood panel program), that it's sponsored at CORE and CONCIERGE, and why knowing how your body is actually doing is worth having.
- Do not describe it in a way that implies Hollis provides, performs, or interprets the testing. "Sponsored," "included in your membership," and "we cover it" are fine. "Our lab panel," "our testing," and "we test your bloodwork" are not.
- **Nothing sponsored-panel-related goes live publicly until counsel signs off** — see `../reports/2026-08-19-business-model-change.md` §4.

## 6. Records

For each sponsored member, retain: enrollment date, tier at enrollment, renewal date, and the consent log entries for each shared report. Retain uploaded reports under the standard retention policy — they are member health records and are subject to the same encryption, access control, and audit logging as everything else in the member record, regardless of how the covered-entity question resolves.

---

Last reviewed: 2026-08-19
