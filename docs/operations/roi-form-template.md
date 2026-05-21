# Release of Information (ROI) Form Template

**Purpose:** Provide the standard text for a HIPAA-compliant patient Authorization for Release of Information form. Use this when a patient requests that Hollis Health share their PHI with a third party (another provider, attorney, insurer, or other person), or when a third party requests PHI with patient authorization.

**Developer note:** This form text can be used as the basis for a new `ConsentDocumentType` enum value (e.g., `RELEASE_OF_INFORMATION`) in server/prisma/schema.prisma. `ConsentDocumentType.ROI` does not currently exist in the schema. Each signed authorization should be stored in the patient's record with the date signed and the scope of the authorization.

---

## AUTHORIZATION FOR RELEASE OF HEALTH INFORMATION

**Hollis Health LLC**
691 S Seguin, New Braunfels, TX 78130
(210) 891-9005 | isaac@hollis.health

---

### Patient Information

| Field | Value |
|---|---|
| Patient Full Name | |
| Date of Birth | |
| Address | |
| Phone Number | |
| Email Address | |

---

### 1. I authorize Hollis Health LLC to release health information to:

| Field | Value |
|---|---|
| Name of Person or Organization | |
| Address | |
| Phone Number | |
| Fax Number (if applicable) | |
| Relationship to Patient | |

---

### 2. I authorize Hollis Health LLC to receive health information from:
*(Complete this section only if you are authorizing Hollis Health to receive your records from another provider.)*

| Field | Value |
|---|---|
| Name of Person or Organization | |
| Address | |
| Phone Number | |

---

### 3. Purpose of the release

*(Check all that apply.)*

- [ ] Continuing care and treatment
- [ ] Personal use
- [ ] Legal or insurance purposes
- [ ] Transfer to another healthcare provider
- [ ] Workers' compensation
- [ ] Other: _______________________________________________

---

### 4. Description of information to be released

*(Check all that apply.)*

- [ ] Complete medical record
- [ ] Office visit notes (dates: _______________)
- [ ] Lab results
- [ ] Imaging reports
- [ ] Billing records
- [ ] Consultation notes
- [ ] Other: _______________________________________________

**Date range of records:**
From: _______________ To: _______________

---

### 5. Special categories of information

Check the box below ONLY if you want this authorization to include the following categories of sensitive health information. If you do not check the box, records in these categories will NOT be released even if requested.

- [ ] Mental health records (other than psychotherapy notes, which require a separate authorization)
- [ ] Substance use disorder treatment records
- [ ] HIV/AIDS test results or treatment
- [ ] Reproductive health information
- [ ] Genetic information

---

### 6. Expiration

This authorization expires on:

- [ ] Specific date: _______________
- [ ] Specific event: _______________________________________________
- [ ] One year from the date of signature (default if neither box above is checked)

---

### 7. Your rights

- You have the right to revoke this authorization at any time by providing written notice to Hollis Health at isaac@hollis.health or 691 S Seguin, New Braunfels, TX 78130. The revocation will take effect upon receipt by Hollis Health. Hollis Health is not required to retrieve records already released in reliance on this authorization before revocation.
- Signing this authorization is voluntary. Your treatment at Hollis Health is not conditioned on signing this form, except where your authorization is requested to fulfill a treatment-related service that requires the release.
- If you authorize Hollis Health to release your information to a person or organization that is not a covered entity or business associate under HIPAA (such as an employer, attorney, or insurer), that recipient may re-disclose your information and it may no longer be protected by HIPAA.

---

### 8. Signature

By signing below, I confirm that I have read and understand this authorization, that I am the patient or the patient's authorized representative, and that I voluntarily authorize the use or disclosure of my health information as described above.

| Field | Value |
|---|---|
| Signature | |
| Printed Name | |
| Date | |
| Relationship to Patient (if not self) | |
| Authority (e.g., power of attorney, parent) | |

---

### For Hollis Health Use Only

| Field | Value |
|---|---|
| Date received by Hollis Health | |
| Records released (description) | |
| Date of release | |
| Released by (name) | |
| Method of release (fax / mail / secure portal / in-person) | |
| Copy filed in patient chart | Yes / No |

---

### Notes for clinic staff

- DO verify the patient's identity before releasing records.
- DO confirm the authorization is not expired before releasing.
- DO send records via secure method (fax, encrypted email, certified mail) — not plain email.
- DO file a copy of the signed authorization in the patient's chart before releasing any records.
- DON'T release psychotherapy notes under this form. Psychotherapy notes require a separate, specific authorization.
- DON'T release records beyond the scope described in Section 4.
- If the request comes from an attorney and the purpose is litigation, involve Isaac before releasing.

---

Last reviewed: 2026-05-19
