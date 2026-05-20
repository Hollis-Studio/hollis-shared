# Labs Manual Workflow

**Purpose:** Define the end-to-end process for ordering lab tests, handling specimen handoff, and uploading results via the web-admin lab order pipeline. This is the operative workflow until Hollis has a direct lab integration. Applies from day 1.

**Related docs:**
- [`day-1-clinic-runbook.md`](./day-1-clinic-runbook.md)
- [`imaging-and-referrals-sop.md`](./imaging-and-referrals-sop.md)
- [`prescribing-workflow-sop.md`](./prescribing-workflow-sop.md)

---

## 1. Lab Order — Pre-Visit Prep

### 1.1 Required supplies
- Paper lab requisition forms from each external lab you use (Quest Diagnostics, LabCorp, or your contracted local lab).
- A supply of specimen collection tubes appropriate for your test menu (SST/gold, EDTA/purple, etc.).
- Biohazard bags and specimen transport containers.
- Chain-of-custody labels if applicable.
- Cold packs if any ordered tests require cold transport.

Confirm your external lab's specimen acceptance requirements before ordering any test type you haven't processed before.

### 1.2 Patient prep instructions
- Send lab prep instructions to the patient via secure message before the visit.
- Common requirements: fasting (8–12 hours), time-of-day constraints (e.g., cortisol), medication holds.
- Document in the chart that pre-visit instructions were sent.

---

## 2. Ordering Labs — Paper Requisition

### 2.1 Completing the requisition form
Complete one requisition form per lab company. Include:
- Patient full name and date of birth
- Patient address and phone number
- Patient insurance information (if billing to insurance) or "Patient Self-Pay" if not
- Date of collection
- Tests ordered (use the lab's test codes or check boxes — do not use free-text test names alone)
- Diagnosis code (ICD-10) for each test ordered
- Ordering provider: Isaac D. Landes, NPI [your NPI], Hollis Health, (210) 891-9005
- Your signature

### 2.2 Chart documentation
Before drawing any specimen:
- Create a Lab Order entry in web-admin (web-admin > Patient > Lab Orders > New) with:
  - Test name(s)
  - Lab company
  - Date ordered
  - Status: "Ordered"
- Attach the requisition form (photograph or scan it and upload to the Lab Order record).

---

## 3. Specimen Collection and Handoff

### 3.1 In-clinic collection
- Perform venipuncture or other specimen collection per your training and applicable clinical standards.
- Label each tube immediately at the time of draw: patient full name, DOB, date and time of collection, and your initials.
- Never prelabel tubes before the patient is present.
- Place labeled specimens in a biohazard bag with the completed requisition form in the outer pocket (NOT inside the bag with the specimen).

### 3.2 Specimen transport options

**Option A — Patient self-transport (walk-in lab)**
- Give the patient the biohazard bag with specimens and the requisition form.
- Instruct them to go directly to the lab's patient service center.
- Provide the lab's nearest location address.
- Instruct them not to refrigerate SST tubes and to deliver within [lab-specified window, typically 4 hours for most routine tests].

**Option B — Courier pickup**
- If you have established courier service with your lab: call the lab's courier line to schedule a pickup.
- Place specimens in the transport container.
- Keep a copy of the requisition form on file.

**Option C — Drop-off by clinic staff**
- If you are dropping off: note the drop-off time and the name of the lab employee who accepted the specimens.

### 3.3 Chain-of-custody documentation
For any test with legal or clinical significance (e.g., drug screens, DNA, pregnancy in disputed context):
- Use the lab's chain-of-custody form, not the standard requisition.
- Note in the chart: "Chain-of-custody specimen collected [date/time], transported via [method], received by [lab/name] at [time]."

---

## 4. When Results Come In

### 4.1 How results are received
Until direct lab integration is live, results arrive as:
- PDF or fax from the lab (Quest/LabCorp typically fax or make results available in a provider portal)
- Paper report delivered with the patient

Check the lab's provider portal daily. Set up an account with each lab you use and provide your NPI and clinic address.

### 4.2 Uploading results in web-admin
1. Download the result PDF from the lab portal or scan the paper report.
2. Open web-admin > Patient > Lab Orders > find the corresponding order.
3. Upload the result PDF to the Lab Order record.
4. Update the Lab Order status to "Results Received."
5. Open the patient's chart and create a new note (type: Lab Result Review). Document:
   - Which tests were resulted
   - Your interpretation (normal / abnormal — specify which values)
   - Any clinical action taken or planned (e.g., follow up in 3 months, referred to specialist, medication adjusted)

### 4.3 Notifying the patient

**Normal results:**
- Send a secure message via the app: "Your lab results are in and everything looks normal. The results are available in your patient record. Let me know if you have any questions."
- Target: within 5 business days of result receipt.

**Abnormal results:**
- Call the patient before sending a message. Do not send abnormal results via a text-style message without context.
- Schedule a results visit if the findings require a clinical conversation.
- Document your call: "Called patient [date] at [time] to discuss abnormal result [test]. [Brief summary of conversation]."
- Target: contact patient within 1 business day of receipt for critical or significantly abnormal values, within 5 business days for mildly abnormal values.

**Critical values (panic values):**
- Contact the patient immediately — same day, within 2 hours of receiving the result.
- If you cannot reach the patient: leave a voicemail and send a secure message. Document all attempts.
- If the value represents an immediate safety risk and you cannot reach the patient: consider whether emergency services notification is warranted.

### 4.4 Unresulted orders
- Any Lab Order that has not shown a result within 7 business days should be followed up.
- Call the lab's provider line and give the order/accession number.
- Document the follow-up call in the chart.

---

## 5. Lab Order Tracker

Until web-admin lab order tracking is sufficient as a standalone system, maintain a simple paper or spreadsheet tracker:

| Date Ordered | Patient (Last, First) | Test(s) | Lab | Specimen Method | Result Status | Date Resulted | Action |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Review this tracker at the start and end of each clinic day.

---

Last reviewed: 2026-05-19
