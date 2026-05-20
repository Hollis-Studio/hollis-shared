# HIPAA Breach Notification Runbook

**Purpose:** Define the internal procedure for responding to a suspected or confirmed HIPAA breach. This runbook implements the HIPAA Breach Notification Rule (45 CFR §§164.400–414) and supplements the HIPAA-DR-PLAN (located at `hollis-health-app/docs/07-Security/HIPAA-DR-PLAN.md`). Resolves the undefined patient communication channel noted in HIPAA-DR-PLAN §4.6.

**Applies when:** Any workforce member (currently: Isaac D. Landes) discovers or suspects that unsecured PHI has been impermissibly accessed, acquired, used, or disclosed.

---

## 1. The 60-Day Rule

The HIPAA Breach Notification Rule requires:
- **Individual notification** within **60 calendar days** of the date the breach is discovered.
- **HHS notification** within **60 calendar days** of discovery for breaches affecting fewer than 500 individuals (annual submission); for breaches affecting 500 or more individuals in a state or jurisdiction, HHS must be notified **immediately** (within 60 days of discovery) and simultaneously with individual notification.
- **Media notice** for breaches affecting 500 or more residents of a state or jurisdiction — required within 60 days of discovery.

**Day 0 = the date Hollis Health first knows, or reasonably should have known, of the breach.** The 60-day clock starts running even if the investigation is not complete.

DO NOT wait until the investigation is finished to start the notification process. You can notify while investigation continues, or you can complete a risk assessment first — but neither extends the 60-day deadline.

---

## 2. Initial Response (Day 0–3)

### 2.1 Stop the breach if ongoing
- If a system is actively leaking data, isolate it immediately. Follow HIPAA-DR-PLAN §3.5 (isolation steps).
- If a workforce member improperly disclosed PHI, cease the disclosure and secure the information.
- If a device is lost or stolen, initiate remote wipe if technically feasible.

### 2.2 Document what you know
Create a breach incident record (plain text file, dated, stored securely). Include:
- Date and time breach was discovered
- Who discovered it
- Nature of the breach (what happened)
- Type of information involved (what PHI was affected)
- Number of individuals potentially affected (estimate if unknown)
- How the breach occurred (preliminary)
- Immediate containment steps taken

### 2.3 Conduct the 4-factor risk assessment
HIPAA requires a risk assessment to determine whether the incident constitutes a "breach" requiring notification. An impermissible use or disclosure is presumed to be a breach unless you can demonstrate a low probability that PHI was compromised, evaluated by:

1. **Nature and extent of the PHI involved** — What types of information were involved? (Name only? Full medical record? SSN? Financial?)
2. **Who accessed or could have accessed the PHI** — Was it another covered entity, a business associate, or a member of the public?
3. **Whether the PHI was actually acquired or viewed** — Evidence that the information was not seen or used mitigates risk.
4. **Extent to which the risk has been mitigated** — Did you retrieve the information? Did you get satisfactory assurances it will not be further disclosed?

Document your risk assessment in writing. If the risk assessment concludes low probability of compromise, you may not be required to notify — but you must document that conclusion thoroughly. When in doubt, notify.

---

## 3. Notification Requirements

### 3.1 Individual notification

**Method (in order of preference):**
1. **First-class mail** to the patient's last known address on file. This is the defined patient communication channel for breach notification at Hollis Health.
2. **Email** — only if the patient has affirmatively agreed to receive notifications electronically. This agreement must be on file.
3. If the patient's contact information is insufficient or out of date: post a substitute notice on the hollis.health website for 90 days AND contact major print or broadcast media serving the area.

**Content of individual notification (see §5 for template):**
- Brief description of what happened and when
- Types of PHI involved
- Steps individuals should take to protect themselves
- What Hollis is doing to investigate and mitigate
- Contact information for questions: isaac@hollis.health or (210) 891-9005

**Timing:** Mail individual letters no later than Day 55 to ensure delivery within the 60-day window.

### 3.2 HHS notification

**For breaches affecting fewer than 500 individuals:**
- Submit via the HHS online portal: https://www.hhs.gov/hipaa/for-professionals/breach-notification/breach-reporting/index.html
- Annual submission — submit within 60 days after the end of the calendar year in which the breach occurred.
- Keep records of all breaches even if you believe they do not require reporting — the annual submission covers all breaches of the year.

**For breaches affecting 500 or more individuals:**
- Submit to HHS within 60 days of discovery.
- Submit a media notice to major media outlets serving the affected area.

### 3.3 When to involve counsel

Involve a HIPAA-knowledgeable attorney when:
- The breach affects 500 or more individuals.
- The breach involves sensitive categories of PHI (mental health, substance use, HIV/AIDS, reproductive health).
- There is any possibility of regulatory investigation, patient lawsuit, or OCR enforcement.
- You are uncertain about the scope of your notification obligations.
- A business associate caused the breach.

Contact: legal@hollis.health (currently Isaac) + engage an external healthcare attorney. Do not make public statements about the breach without counsel review.

---

## 4. Internal Documentation Requirements

HIPAA requires you to retain breach-related documentation for 6 years from the date of creation or last effective date.

Retain:
- The initial incident record (§2.2)
- The written risk assessment (§2.3)
- Copies of all notification letters sent to individuals
- HHS submission confirmation
- Any media notice (if applicable)
- Logs of all actions taken and by whom
- Any communications with business associates regarding the breach

Store in: a locked folder or encrypted file storage accessible only to Isaac as Privacy Officer. Label: "Breach Records — [Year]."

---

## 5. Patient Notification Template

Use this text as the basis for individual breach notification letters. Fill in the bracketed fields.

---

[Date]

[Patient Full Name]
[Patient Address]

**Re: Notice of Privacy Breach — Hollis Health**

Dear [Patient First Name],

We are writing to inform you of a privacy incident that may have affected your health information.

**What happened:**
[1–2 sentences: what occurred, approximate date it was discovered.]

**What information was involved:**
[List the types of PHI: e.g., name and date of birth; name, date of birth, and appointment records. Be specific but do not include more PHI than necessary.]

**What we have done:**
[1–2 sentences: immediate steps taken to stop the breach and prevent recurrence.]

**What you can do:**
We recommend you:
- Monitor your health accounts and records for any unexpected activity.
- [If financial information was involved: consider placing a fraud alert with the major credit bureaus.]
- Contact us if you believe your information has been misused.

**Questions:**
If you have questions or concerns, please contact:

Isaac D. Landes, Privacy Officer
Hollis Health
691 S Seguin, New Braunfels, TX 78130
(210) 891-9005
isaac@hollis.health

We sincerely regret that this occurred and are committed to protecting your information.

Sincerely,

Isaac D. Landes
Privacy Officer
Hollis Health LLC

---

**Note:** This template requires legal review before use in any actual breach notification. Do not send without confirming it meets applicable legal requirements with counsel.

---

## 6. Post-Incident Review

Within 30 days after the breach is resolved:
1. Conduct a root cause analysis: how did this happen?
2. Identify and implement technical or administrative controls to prevent recurrence.
3. Update the HIPAA-DR-PLAN or relevant security policies if gaps were identified.
4. Document the post-incident review and file with the breach record.

---

Last reviewed: 2026-05-19
