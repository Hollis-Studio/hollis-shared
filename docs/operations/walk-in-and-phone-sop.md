# Walk-In and Phone Triage SOP

**Purpose:** Define how Isaac handles walk-in prospects/members and inbound phone calls. Applies from day 1 through any period of solo operation.

**Critical role clarification:** Isaac is the **Care Coordinator**, not a medical clinician. Isaac holds ISSA-CPT (Certified Personal Trainer), ISSA Nutrition, ISSA Strength & Conditioning, and current CPR certification. Isaac may give fitness, nutrition, and program-design guidance under his ISSA credentials. Isaac may NOT diagnose, prescribe, evaluate medical complaints, interpret lab results, or provide any service that requires a medical license.

**Hollis Health does not provide medical services and has no clinician.** As of 2026-08-19 there is no partner clinician and no partner medical facility — the White Horse Holistic Health arrangement ended. Members get medical care from providers of their own choosing. There is nobody on the Hollis side to "pass it along to," which means the redirect scripts below are the entire answer, not a holding pattern. See [`../reports/2026-08-19-business-model-change.md`](../reports/2026-08-19-business-model-change.md).

**Related docs:**
- [`client-acquisition-flow.md`](./client-acquisition-flow.md) — full lead → first-visit flow
- [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md)
- [`after-hours-messaging-sop.md`](./after-hours-messaging-sop.md)
- [`no-show-cancellation-policy.md`](./no-show-cancellation-policy.md)

---

## Guiding Principles

- **Safety first.** Any potential emergency is redirected to 911 or the ER immediately.
- **No medical advice.** Isaac never diagnoses, never recommends medications or dosing, never tells a member "that's probably nothing" or "you should be fine." Medical questions → the member's own provider, urgent care, or 911.
- **"You're fine" is medical advice.** Reassurance is as far out of scope as a diagnosis. There is no safe version of guessing.
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

Any non-emergency medical complaint from a member or prospect — symptoms, medication questions, "is this normal," prescription refills, lab or biomarker interpretation, anything diagnostic — is redirected out. Hollis has no clinician and does not arrange medical visits.

**Script for a member:**

> "That's outside what I do — I'm your coach and coordinator, not a medical provider, and I'd be doing you a disservice if I guessed. That's one for your doctor. If you don't have one, I'm glad to give you names of practices nearby and you can call whoever you like. And if it gets worse or feels urgent, urgent care or 911, don't wait on an appointment."

**Script for a prospect (not yet a member):**

> "I want to be straight with you about what we are: Hollis is coaching, nutrition, and recovery. We're not a medical clinic and we don't provide medical care — you'd keep seeing your own doctor for that. What we do is the training and nutrition side, and we make your health data easy to see in one place. Want to come in for a free intro so I can show you?"

**If they ask about the blood panel:**

> "At Core and Concierge we sponsor a blood panel membership — 160-plus markers. It's run by an independent company, the account's in your name, and their clinicians handle the medical side of it. If you want your results in your Hollis dashboard, you share them with me and I'll put them in. I use them for your training and nutrition. I don't read them medically."

After the conversation:
1. If member: note in the member's Hollis record that a medical question was raised and redirected. **Do not record your impression of the symptom.** Do not contact any provider on their behalf unless they asked for a referral and signed a release.
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

> "We don't have a doctor here — Hollis is coaching, nutrition, and recovery, and we're not a medical practice. For anything medical you'd want your own physician. If you're looking for one, I can give you a couple of names in the area, but you'd be calling them directly."

Do not take a clinical message "to pass along." There is nobody to pass it to, and holding a message implies a duty to act on it. If it sounds urgent, say so and point them at urgent care or 911.

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
- Purpose (general, e.g., "prospect inquiry", "fitness question", "medical question redirected") — no detailed health information outside the secure system
- Outcome (scheduled, deferred, lead-created, emergency redirect, voicemail left, redirected to own provider)

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
| Symptom evaluation, diagnosis | ❌ — | All → member's own provider or 911 |
| Prescriptions, refills, dosing | ❌ — | All → member's own provider |
| Lab or biomarker interpretation | ❌ — | All → the provider who ordered the test |
| Telling a member a value is normal / fine / nothing to worry about | ❌ — | This is interpretation. It is the easiest line to cross and the one most likely to be crossed by accident. |
| Naming outside practices when a member asks for a referral | ✅ Yes (name + contact info only) | Write a referral letter, state a clinical reason, or send records without a signed release |
| "Should I see a doctor for this?" | "That's worth bringing to a doctor. If it feels urgent, 911 or urgent care." | Imply it's nothing |

When in doubt: **redirect out**. There is no penalty for over-redirecting; there is significant liability for handling something you are not licensed to handle.

---

Last reviewed: 2026-08-19
