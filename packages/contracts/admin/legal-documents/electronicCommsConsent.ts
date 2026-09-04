/**
 * Electronic Communications Consent — static document content.
 *
 * Source: docs/09-Legal/HH Legal/internal/electronic-communications-consent.mdx
 * The docMeta block has been extracted into `meta`. Blank field placeholders
 * replaced by template tokens. No initials sections — signature only.
 */

export const meta = {
  title: "Electronic Communications Consent",
  version: "1.3.0",
  effectiveDate: "2026-08-23",
  contentHash: "bbaa6deb",
};

export const content = `# Electronic Communications Consent

**Hollis Health LLC**
Home Office: 691 S Seguin, New Braunfels, TX 78130
(210) 891-9005 | legal@hollis.health

---

## Section 1. Purpose

This Electronic Communications Consent ("Consent") explains how Hollis Health LLC ("Company," "we," "us," or "our") may communicate with you by electronic means in connection with your membership, account, scheduling, security, independent-provider referrals, third-party subscription benefits included with your tier, and related services. Company is not a medical provider and does not send clinical communications.

This Consent is intended to separate:

- **Operational and safety communications**, which are necessary to provide services and manage your account;
- **Program-support communications**, which support your requested wellness program or independent-provider referrals; and
- **Marketing communications**, which are optional.

---

## Section 2. Contact Methods

By signing below, you acknowledge or consent, as applicable, to communications using the contact information you provide to Company through one or more of the following channels:

- Email;
- SMS/text messages;
- Push notifications through the Hollis Health application, if enabled; and
- Secure in-app messages or portal messages.

| Channel | Contact Information |
|---|---|
| Email | {{EMAIL}} |
| SMS/Text | {{PHONE}} |
| Push Notifications | Enabled via Hollis Health application if installed |

---

## Section 3. Categories of Communications

### 3.1 Operational and Safety Communications

Operational and safety communications are necessary for service delivery, account administration, or safety. They may include:

- Appointment reminders and scheduling confirmations;
- Billing notices, payment receipts, failed-payment notices, and account status messages;
- Security alerts, authentication codes, and suspicious-access notices;
- Service interruptions, facility or schedule changes, and urgent safety notifications; and
- Legally required notices and material membership updates.

These communications are a required part of maintaining an active membership or account relationship with Company.

### 3.2 Program-Support Communications

Program-support communications may include:

- Training program updates;
- Wellness coaching prompts and general nutrition information;
- Notifications that records you've shared or your wellness assessments are available in a secure portal;
- Non-diagnostic check-in reminders;
- Referral logistics for independent providers you've chosen to work with;
- Enrollment, renewal, and administrative logistics for any third-party subscription benefit included with your membership tier — for example, a reminder to complete your own enrollment with an independent third-party health-testing company whose subscription Company pays for on your behalf. These messages are administrative only; Company does not select your test panel, does not arrange or schedule your specimen collection, does not receive your results from that company, and has no access to your account with that company; and
- Non-marketing educational content related to services you requested.

To the extent a communication is essential to a service you requested, Company may treat it as an operational communication even if it also supports your program.

### 3.3 Marketing Communications

Marketing communications may include:

- Promotional offers;
- Newsletters;
- New service announcements;
- Event invitations;
- Referral program messages; and
- Requests for testimonials or public reviews.

Marketing communications are optional and are not required to purchase or maintain services.

---

## Section 4. Automated and Electronic Delivery Systems

You understand that some communications may be sent using automated systems, including automated email, text messaging platforms, or authentication-delivery services. Message frequency may vary based on your account activity, appointment schedule, and selected communication preferences. Standard message and data rates may apply.

---

## Section 5. Sensitive Health Information and Secure Channels

### 5.1 No Sensitive Health Content in Unsecured Notifications

Company will use reasonable efforts not to include detailed laboratory results, diagnoses, prescription instructions, or clinical notes in ordinary unencrypted SMS messages or unencrypted email notifications.

### 5.1.1 No Clinical or Results Notifications

Company does not send, and you should not expect, any communication reporting, interpreting, or alerting you to an abnormal, urgent, or clinically significant finding in any record or result. Company does not review or monitor records or results you share for such findings and has no duty to identify, flag, or notify. A notification that a document is available in your secure portal is an availability notice only and is not a review, an interpretation, or a clinical communication. You must rely on the provider who ordered the test or created the record.

### 5.2 Secure Delivery

Sensitive health information, where made available by Company, is intended to be accessed through secure channels such as:

- The Hollis Health application or member portal;
- Secure in-app or portal messaging; or
- Another encrypted channel approved by Company.

### 5.3 Participant Responsibility

If you choose to send sensitive health information to Company through an unsecured channel, you acknowledge that such transmission may carry additional privacy and security risk.

---

## Section 6. Opt-Out Rights

### 6.1 Marketing Opt-Out

You may opt out of marketing communications at any time by:

- Using the unsubscribe link in a marketing email;
- Replying \`STOP\` to a marketing text message, where supported;
- Adjusting marketing-notification settings in the application, where available; or
- Contacting Company at legal@hollis.health.

### 6.2 Program-Support Preference Changes

You may request to reduce or limit non-essential educational or wellness-content communications. Company may still send communications that are necessary to provide requested services, coordinate scheduling and program logistics, maintain safety, or administer your account. Company does not coordinate medical care.

### 6.3 Operational Communications

You may not opt out of operational and safety communications while maintaining an active membership or active account relationship, because those communications are necessary to service delivery, billing, security, and legal compliance.

---

## Section 7. Voluntary Nature of Marketing Consent

Consent to receive marketing communications is voluntary and is not a condition of purchasing any service from Company. A decision to decline marketing communications will not affect pricing, membership status, or access to purchased services.

---

## Section 8. Updating Contact Information

You are responsible for keeping your contact information accurate and current. Company is not responsible for non-delivery caused by outdated or incorrect information that you provided.

---

## Section 9. Revocation

You may revoke optional portions of this Consent, including marketing consent, by providing written notice to legal@hollis.health. Revocation does not affect communications already sent and does not eliminate Company's ability to send operational and safety communications needed to administer an active account or membership.

---

## Section 10. Signature Block

By signing below, I acknowledge that I have read and understand this Electronic Communications Consent.

**MEMBER/PARTICIPANT:**

Signature: {{SIGNATURE}} Date: {{SIGNING_DATE}}

Printed Name: {{MEMBER_NAME}}

Email Address: {{EMAIL}}

Phone Number (SMS): {{PHONE}}

**Communication Preferences (check as applicable):**

| Category | Acknowledgment / Election |
|---|---|
| Operational and safety communications (required for active services) | [x] Acknowledged |
| Program-support communications necessary to requested services | [x] Acknowledged |
| Optional marketing communications | {{MARKETING_OPT_IN}} |

---

**FOR HOLLIS HEALTH LLC (Witness/Acceptance):**

Signature: ______________________________________ Date: ______________

Printed Name: ______________________________________

Title: ______________________________________
`;

/**
 * No initials sections for this document — only a final signature is required.
 * The signing flow will render SignatureCanvas only (no InitialsBlock).
 */
export const initialsSections = [] as const;
