# Walk-In and Phone Triage SOP

**Purpose:** Define how Isaac handles walk-in prospects/members and inbound phone calls. Applies from day 1 through any period of solo operation.

**Critical role clarification:** Isaac is the **Care Coordinator**, not a medical clinician. Isaac holds ISSA-CPT (Certified Personal Trainer), ISSA Nutrition, ISSA Strength & Conditioning, and current CPR certification. All **medical** services — diagnosis, prescription, lab interpretation, clinical evaluation — are provided by Dr. Tavie at **White Horse Holistic Health (WHH)**, our partner medical facility. Isaac may give fitness, nutrition, and program-design guidance under his ISSA credentials. Isaac may NOT diagnose, prescribe, evaluate medical complaints, or provide any service that requires a medical license.

**Related docs:**
- [`client-acquisition-flow.md`](./client-acquisition-flow.md) — full lead → first-visit flow
- [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md)
- [`after-hours-messaging-sop.md`](./after-hours-messaging-sop.md)
- [`no-show-cancellation-policy.md`](./no-show-cancellation-policy.md)

---

## Guiding Principles

- **Safety first.** Any potential emergency is redirected to 911 or the ER immediately.
- **No medical advice.** Isaac never diagnoses, never recommends medications or dosing, never tells a member "that's probably nothing" or "you should be fine." Medical questions → Tavie / WHH or 911.
- **Fitness and nutrition are fair game.** Form, programming, macros, sleep habits, supplement education at a general level — these are within Isaac's ISSA scope.
- You cannot run a coaching session mid-conversation with a walk-in. Your existing member comes first.
- Declining a walk-in is not refusing care — it is managing capacity honestly.
- Every interaction, including declines, gets a brief note (paper or digital).

---

## 1. Walk-In Triage

### 1.1 When you are between sessions (available)

1. Greet the walk-in at the front.
2. Ask: "Are you experiencing anything that feels like an emergency right now — chest pain, difficulty breathing, or something else urgent?"
   - If YES → go to §1.4 (Emergency Redirect).
3. Ask what brings them in today.
4. **Classify the visit purpose:**
   - **Prospective new member** (sales/intro inquiry) → §1.2.
   - **Existing member, fitness/nutrition question** → answer within ISSA scope; if longer than 5 min, schedule a proper coaching slot.
   - **Existing member, medical question or symptom** → §1.5 (Medical Redirect).
   - **Existing member, here for a scheduled session that you forgot/missed** → apologize, look up their record, reschedule.

### 1.2 Prospective new member walk-in

1. Welcome them. Brief tour if you have ≥15 min free.
2. Capture name, email, phone. Create a `LeadPipeline` row at stage `INQUIRY` (or move directly to `CONSULTATION_BOOKED` if you book on the spot).
3. Either:
   - **Book a phone screen** for the next available slot ("Let me give you a real conversation when I'm not between members — I'll call you [today/tomorrow] at [time]"), OR
   - **Book the in-person intro directly** if you have a 60-90 min block free in the next few days.
4. Hand them a business card; text the booking confirmation from the shop phone (210) 891-9005.
5. See [`client-acquisition-flow.md`](./client-acquisition-flow.md) §3-5 for the full flow they're entering.

### 1.3 When you are with a member (unavailable)

Use the posted sign at the front:

> "Currently with a member. Please call (210) 891-9005 or text the same number to leave a message. I'll be with you as soon as I'm free."

When you are free:
1. Check if the walk-in is still present.
2. If yes: proceed per §1.1.
3. If they left without leaving contact info: log the date and time of the attempted visit. No further action required.

### 1.4 Emergency Redirect

If the person shows or describes any of the following, redirect immediately. Do not attempt to treat on site.

**Redirect triggers:**
- Chest pain or pressure
- Difficulty breathing
- Altered mental status or confusion
- Stroke symptoms (facial droop, arm weakness, slurred speech)
- Severe allergic reaction
- Active bleeding that is not controlled
- Any symptom they describe as "the worst [pain/symptom] of my life"
- Suicidal ideation with plan or intent

**Script:**

> "What you're describing needs immediate emergency care. Please call 911 now, or I can call for you. Do not drive yourself. Go to the nearest emergency room."

If you call 911 on their behalf, stay with them until emergency services arrive or someone else takes over. Apply CPR or basic first aid only if needed and within your CPR certification scope.

**DO NOT** attempt to treat a true emergency in the clinic. **DO NOT** delay the 911 call to assess further.

After they leave: document the interaction in your daily log (no PHI in plain text unless inside the secure system). If they are an existing member, note the referral in their chart.

### 1.5 Medical Redirect (non-emergency)

Any non-emergency medical complaint from a member or prospect — symptoms, medication questions, "is this normal," prescription refills, lab interpretation, anything diagnostic — goes to Dr. Tavie at White Horse Holistic Health.

**Script for a member:**

> "That's a great question for Dr. Tavie. She handles all the medical side at White Horse Holistic Health, our partner clinic. Let me get you connected — either she or her office will reach out to schedule you, and I'll put the appointment on your Hollis calendar as soon as it's set. In the meantime, if it worsens or feels urgent, go to urgent care or call 911."

**Script for a prospect (not yet a member):**

> "Our medical services are provided through our partner Dr. Tavie at White Horse Holistic Health, and they're included in the membership. The way to start is to come in for a free intro — I'll show you the space and walk you through how it works. Want to set that up now?"

After the conversation:
1. If member: send Tavie a secure message (her HIPAA-secure channel — NOT plain SMS for clinical content). Note in the member's Hollis chart that you referred to Tavie and why.
2. If prospect: enter as a `LeadPipeline` row per §1.2.

### 1.6 Declining or Deferring a Walk-In

Use this script verbatim or adapt naturally:

> "I appreciate you coming in. I'm not able to take walk-ins today, but I'd like to get you on the calendar for the soonest available time. Can I get your name and phone number? I'll text you a booking link, or you can fill out the form at hollis.health/waitlist and I'll call you back today."

Steps:
1. Take name and phone number.
2. Text them the waitlist link within 15 minutes from (210) 891-9005.
3. Log the walk-in attempt in your daily notes: date, time, first name, reason if stated, outcome (deferred / lead-created / emergency redirect).

**DO NOT** apologize for the clinic's existence or imply they have been wronged. You are managing a schedule honestly.

---

## 2. Inbound Phone Triage

### 2.1 When to answer

- Answer if you are between members and the call takes less than 5 minutes to resolve.
- Let calls go to voicemail if you are mid-session. Return calls within 2 hours during clinic hours.
- After hours: calls go to voicemail automatically. See [`after-hours-messaging-sop.md`](./after-hours-messaging-sop.md).

### 2.2 Call opener

> "Hollis Health, this is Isaac. How can I help you?"

### 2.3 New-prospect call

> "Glad you called. The best next step is a quick 15-minute conversation with me — I'll learn about your goals and we'll figure out if Hollis is a fit, no pressure. Are you free for a few minutes now, or want me to call you back at a better time?"

If now: run the phone screen per [`client-acquisition-flow.md`](./client-acquisition-flow.md) §4.2.

If later: capture name + best number + best time → create `LeadPipeline` row at `INQUIRY` → book the callback in your calendar.

### 2.4 Existing member — fitness/nutrition question

- If answerable within ISSA scope in under 2 minutes: answer it.
- If longer: "Good question — let me get you scheduled for a quick coaching call where I can give it proper attention. Does [time] work?"
- Log a note in the member's chart.

### 2.5 Existing member — medical question

Use the §1.5 Medical Redirect script. **Do NOT improvise medical advice over the phone, even if you "kind of know" the answer.**

### 2.6 Caller asking to speak with a doctor

> "Our medical provider is Dr. Tavie at White Horse Holistic Health, our partner clinic. I coordinate scheduling with her — would you like me to set up a visit, or do you have a quick question I can pass along?"

If urgent / they want to speak to her directly: take a clear message, then contact Tavie's office. Do not promise a callback time you cannot guarantee Tavie will meet.

### 2.7 Angry or difficult caller

- Stay calm. Do not match their tone.
- Acknowledge: "I hear that you're frustrated."
- Redirect: "I want to help. Here's what I can do: [specific action]."
- If the call becomes abusive: "I need to end this call now, but I'm happy to help when we can speak calmly. You can reach me by email at isaac@hollis.health." Then end the call.
- Log the call in your daily notes without including PHI in plain text.

### 2.8 Emergency call

If a caller describes an emergency:

> "Please hang up and call 911 immediately. I cannot provide emergency services over the phone. Call 911."

Stay on the line only if they refuse to call 911 and are in immediate danger, and in that case call 911 yourself from another line or device.

---

## 3. Record-Keeping

Every walk-in and every returned call involving meaningful content gets a brief log entry:
- Date and time
- First name (or "unknown walk-in")
- Purpose (general, e.g., "prospect inquiry", "fitness question", "medical redirect to Tavie") — no detailed PHI outside the secure system
- Outcome (scheduled, deferred, lead-created, emergency redirect, voicemail left, referred to Tavie)

Keep this log in a dated section of your daily paper notes or as a draft note in the web-admin messaging system.

---

## 4. What Isaac CAN and CANNOT do (quick reference)

| Topic | CAN | CANNOT |
|-------|-----|--------|
| Form, exercise selection, programming | ✅ Yes (ISSA-CPT/S&C) | — |
| Macros, meal planning, supplement education | ✅ Yes (ISSA Nutrition) | Recommend prescription supplements or treat conditions |
| Sleep, stress, lifestyle coaching | ✅ Yes (general wellness) | Diagnose sleep disorders or prescribe sleep meds |
| CPR / basic first aid | ✅ Yes (CPR cert) | Advanced interventions |
| Membership signup, scheduling, billing | ✅ Yes (Care Coordinator) | — |
| Symptom evaluation, diagnosis | ❌ — | All → Dr. Tavie / WHH or 911 |
| Prescriptions, refills, dosing | ❌ — | All → Dr. Tavie / WHH |
| Lab orders or interpretation | ❌ — | All → Dr. Tavie / WHH |
| "Should I see a doctor for this?" | "Yes — let me get you connected with Dr. Tavie. If it feels urgent, 911 or urgent care." | Imply it's nothing |

When in doubt: **defer to Tavie**. There is no penalty for over-referring; there is significant liability for under-referring.

---

Last reviewed: 2026-05-20
