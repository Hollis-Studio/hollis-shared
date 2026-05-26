/**
 * Membership Agreement — dynamically generated document content for the signing flow.
 *
 * Source: docs/09-Legal/HH Legal/internal/membership-agreement.mdx
 *
 * Sections 2.1 (comparison table), 2.3 (separately-billed items), and 3.2
 * (pricing grid) are generated from MASTER_OFFER_SHEET so they stay in sync
 * with offer-sheet.json. All other sections are static markdown with template
 * tokens for the signing flow.
 *
 * Exhibit A is omitted here — it is generated dynamically by
 * enrollmentSummary.ts and injected at render time.
 */

import {
  MASTER_OFFER_SHEET,
  getDiscountedMonthlyPriceDollars,
  formatUsd,
} from "../../domain/offer-sheet.js";

// ---------------------------------------------------------------------------
// Dynamic section generators (from MASTER_OFFER_SHEET)
// ---------------------------------------------------------------------------

const TIER_ORDER = ["ESSENTIALS", "CORE", "CONCIERGE"] as const;

function generateComparisonTable(): string {
  const headers = [
    "Service Category",
    ...TIER_ORDER.map((t) => MASTER_OFFER_SHEET.tiers[t].displayName),
  ];
  const headerRow = `| ${headers.join(" | ")} |`;
  const divider = `|${headers.map(() => "---").join("|")}|`;
  const bodyRows = MASTER_OFFER_SHEET.comparisonRows.map(
    (row) =>
      `| ${row.label} | ${TIER_ORDER.map((t) => row.values[t]).join(" | ")} |`,
  );

  return [headerRow, divider, ...bodyRows].join("\n");
}

function generateSeparatelyBilledItems(): string {
  return MASTER_OFFER_SHEET.separatelyBilledThirdPartyItems
    .map((item) => `- ${item}`)
    .join("\n");
}

function generatePricingGrid(): string {
  const headers = [
    "Tier",
    ...MASTER_OFFER_SHEET.terms.map(
      (term) => `${term.months}-Month (${term.discountPercent}% off)`,
    ),
  ];
  const headerRow = `| ${headers.join(" | ")} |`;
  const divider = `|${headers.map(() => "---").join("|")}|`;
  const bodyRows = TIER_ORDER.map((tier) => {
    const tierData = MASTER_OFFER_SHEET.tiers[tier];
    const prices = MASTER_OFFER_SHEET.terms.map((term) =>
      formatUsd(
        getDiscountedMonthlyPriceDollars(
          tierData.baseMonthlyPriceDollars,
          term.discountPercent,
        ),
      ),
    );
    return `| ${tierData.displayName} | ${prices.join(" | ")} |`;
  });

  return [headerRow, divider, ...bodyRows].join("\n");
}

// ---------------------------------------------------------------------------
// Content assembly
// ---------------------------------------------------------------------------

function generateMembershipAgreementContent(): string {
  return `**DRAFT — FOR ATTORNEY REVIEW**

# Membership Agreement

**Hollis Health LLC**
Home Office: 691 S Seguin, New Braunfels, TX 78130
(210) 891-9005 | legal@hollis.health

---

## Section 1. Parties

This Membership Agreement ("Agreement") is entered into as of the date of Member's electronic or physical signature ("Effective Date") by and between:

**Hollis Health LLC**, a Texas limited liability company, doing business as Hollis Health, with its home office at 691 S Seguin, New Braunfels, TX 78130 ("Company," "we," "us," or "our"); and

**Member:**

| Field | Value |
|---|---|
| Full Legal Name | {{MEMBER_NAME}} |
| Date of Birth | {{DATE_OF_BIRTH}} |
| Address | {{ADDRESS}} |
| City, State, ZIP | {{CITY_STATE_ZIP}} |
| Phone Number | {{PHONE}} |
| Email Address | {{EMAIL}} |
| Emergency Contact Name | {{EMERGENCY_CONTACT_NAME}} |
| Emergency Contact Phone | {{EMERGENCY_CONTACT_PHONE}} |

(collectively, "Member," "you," or "your").

Company and Member are each individually referred to as a "Party" and collectively as the "Parties."

PLEASE READ THIS AGREEMENT CAREFULLY BEFORE SIGNING. THIS AGREEMENT CONTAINS A BINDING ARBITRATION PROVISION AND CLASS ACTION WAIVER IN SECTION 10, AN ASSUMPTION OF RISK AND RELEASE OF LIABILITY IN SECTION 7, AND EARLY TERMINATION OBLIGATIONS IN SECTION 6. BY SIGNING BELOW, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS AGREEMENT.

---

## Section 2. Membership Election and Service Schedule

Member hereby selects the following membership tier (check one):

- {{CHECK_TIER_ESSENTIALS}} **Essentials**
- {{CHECK_TIER_CORE}} **Core**
- {{CHECK_TIER_CONCIERGE}} **Concierge**

### 2.1 Core Wellness Services

The table below describes the standard wellness-service framework for each membership tier. All services are subject to availability, scheduling capacity, operating hours, safety screening, and Member's compliance with this Agreement and all incorporated policies.

${generateComparisonTable()}

### 2.2 Enrollment Summary and Service Schedule

The specific commercial and operational details of Member's selected membership are set forth in the **Enrollment Summary and Service Schedule** attached as **Exhibit A** and incorporated herein by reference. Exhibit A is intended to capture the individualized details of Member's enrollment, including:

- Selected tier;
- Selected contract term;
- Monthly rate;
- Start Date and End Date;
- Any included supplement allowance or curated supplement package;
- Any included non-clinical screening or assessment allowance;
- Any add-on services;
- The initial program location, if one has been designated as of the Effective Date; and
- Any separately billed third-party clinical services disclosed at enrollment.

### 2.3 Third-Party Clinical Services and Pass-Through Charges

Member acknowledges that Hollis Health LLC is a wellness company and not a hospital, clinic, physician practice, or licensed medical provider. Hollis Health does not practice medicine and does not bill for or sell medical services. Medical care, clinical evaluations, laboratory services, imaging, prescriptions, and other clinical services are furnished only by independent licensed providers chosen by Member, including providers in Company's referral network. Those third-party charges are **not** included in Membership fees and may be billed separately by the applicable provider.

${MASTER_OFFER_SHEET.policies.partnerFacilityDisclosure}

The following items are billed separately by independent providers or third parties and are not included in Hollis Health membership fees:

${generateSeparatelyBilledItems()}

### 2.4 Session Rollovers

Unused private coaching sessions do not roll over from month to month unless expressly authorized in writing by Company. Sessions not used within the applicable calendar month are forfeited without credit or refund.

### 2.5 Recovery Modalities

Access to recovery modalities, where made available by Company, is subject to posted operating rules, safety screening, the separately executed Liability Waiver, and the separately executed Informed Consent for Health Services where applicable. Member is responsible for obtaining physician guidance regarding any contraindication or restriction relevant to recovery modality use.

---

## Section 3. Contract Term

### 3.1 Term Selection

Member selects the following contract term (check one):

- {{CHECK_TERM_4MO}} **4-Month Term** — No discount
- {{CHECK_TERM_8MO}} **8-Month Term** — 5% discount
- {{CHECK_TERM_12MO}} **12-Month Term** — 10% discount

### 3.2 Discounted Monthly Rates by Tier and Term

${generatePricingGrid()}

Amounts are rounded to the nearest cent. If Exhibit A lists a different monthly rate due to a written promotion, introductory offer, add-on bundle, or attorney-approved revision, Exhibit A controls.

### 3.3 Term Commencement and Expiration

The contract term shall commence on {{START_DATE}} ("Start Date") and expire on {{END_DATE}} ("End Date"), unless earlier terminated in accordance with Section 6.

### 3.4 Auto-Renewal

Unless either Party gives at least thirty (30) days' written notice of non-renewal before the End Date, this Agreement will automatically convert to a month-to-month arrangement at the then-current standard monthly rate for the selected tier, plus any continuing add-ons then in effect, to the extent permitted by applicable law. During month-to-month continuation, either Party may terminate on thirty (30) days' written notice.

---

## Section 4. Payment Terms

### 4.1 Monthly Payment Amount

Member agrees to pay the monthly Membership fee corresponding to Member's selected tier and term, as reflected in Section 3.2 and confirmed in Exhibit A. The first monthly payment is due on the Start Date unless otherwise stated in Exhibit A. Subsequent payments are due on the same calendar day of each succeeding month ("Billing Date").

### 4.2 Card-on-File Authorization

By executing this Agreement, Member authorizes Company to charge the payment method on file, through Stripe or any successor payment processor designated by Company, for all amounts due under this Agreement, including Membership fees, approved add-ons, supplement purchases, late fees, and any other charges expressly authorized by this Agreement or by a separate signed addendum. Member agrees to maintain a valid payment method on file at all times during the term of this Agreement.

### 4.3 Payment Method Updates

Member is responsible for ensuring that payment method information remains current and accurate. Member may update payment information by contacting Company at legal@hollis.health or (210) 891-9005.

### 4.4 Late Payment

If any payment is not received by Company within five (5) calendar days after the Billing Date, Company may assess a late fee of thirty-five dollars ($35.00), or the lesser amount required by applicable law. Continued failure to cure a payment default within fifteen (15) calendar days after written notice may constitute a material breach of this Agreement and may result in suspension or termination of services pursuant to Section 6.

### 4.5 Declined Payment

If a charge is declined, Company may re-attempt the charge after notice to Member. Company may suspend access to services while the account remains delinquent. Time during which services are suspended due to non-payment does not extend the contract term unless required by applicable law or expressly approved by Company in writing.

### 4.6 Refunds

Except as expressly required by applicable law or by Company's written policies, Membership fees are non-refundable after services for the applicable billing period have become available. Where a refund is required, it will be calculated in accordance with the Company's then-current cancellation and refund policy and any controlling law.

---

## Section 5. Texas Health Spa and Pre-Opening Disclosures

This Section is intended to preserve Member's rights under applicable Texas law. The Parties acknowledge that the exact statutory disclosures required for a particular membership sale may depend on facts including, without limitation, whether a physical facility has opened, whether the Agreement is executed before the program location is open for use, and whether pre-opening payments are accepted.

### 5.1 Three-Day Right of Rescission

IF APPLICABLE LAW PROVIDES A THREE (3) BUSINESS DAY RIGHT TO CANCEL THIS AGREEMENT WITHOUT PENALTY OR OBLIGATION, MEMBER MAY EXERCISE THAT RIGHT BY DELIVERING WRITTEN NOTICE TO COMPANY WITHIN THE APPLICABLE PERIOD.

### 5.2 Home Office for Notices

Written notices to Company under this Agreement may be sent to:

**Hollis Health LLC**
691 S Seguin, New Braunfels, TX 78130
Email: legal@hollis.health

### 5.3 Program Location

If a physical program location has been designated as of the Effective Date, it shall be listed in Exhibit A. If no physical location has yet been designated or opened for member use, Exhibit A or a separate pre-opening addendum should describe the anticipated location and any special pre-opening cancellation rights or timing disclosures.

### 5.4 Services Not Included

The following are not included in Membership fees: medical diagnosis, medical treatment, prescriptions, insurance-billed clinical services, and any other medical service furnished by an independent third party. Hollis Health does not bill for or sell medical services.

---

## Section 6. Cancellation and Early Termination

### 6.1 Governing Policy

Member's rights and obligations with respect to cancellation are governed by this Section 6, the Company's cancellation and refund policy, any pre-opening addendum if applicable, and controlling law. In the event of a conflict, controlling law shall govern.

### 6.2 Cancellation for Medical Reasons

If Member becomes medically unable to participate in the core wellness services covered by this Agreement, Member may request cancellation by providing a written certification from a licensed physician. Company will review the request in good faith and, where cancellation is required by law or approved by Company, will refund prepaid but unused fees on a pro-rata basis.

### 6.3 Cancellation Due to Relocation

If Member permanently relocates the Member's primary residence to a location materially beyond reasonable use of the designated program location reflected in Exhibit A, Member may request cancellation by providing reasonable documentation of relocation. Company will review the request in good faith and, where cancellation is required by law or approved by Company, will refund prepaid but unused fees on a pro-rata basis.

### 6.4 Early Termination for Convenience

If Member elects to terminate this Agreement before the End Date for any reason other than an approved or legally required cancellation under Sections 6.2 or 6.3, Member remains responsible for the remaining discounted contract value through the End Date, calculated using the discounted monthly rate actually selected under Section 3.2 or reflected in Exhibit A. The Parties acknowledge that the selected term discount is offered in reliance on Member's commitment to the full term and that this early termination amount is intended to preserve that bargain, not to impose a penalty.

### 6.5 Company Termination

Company may suspend or terminate this Agreement for material breach, non-payment, fraud, threatening or unsafe conduct, repeated policy violations, or conduct that materially interferes with operations or the safety of any person. If Company terminates without cause, Company will refund prepaid but unused Membership fees on a pro-rata basis, and no early termination amount will apply.

### 6.6 Notice of Cancellation

Cancellation requests must be submitted in writing to legal@hollis.health or delivered by certified mail to the home office listed in Section 5.2. Oral cancellations are not effective.

---

## Section 7. Assumption of Risk and Release

### 7.1 Incorporation of Liability Waiver

MEMBER ACKNOWLEDGES AND AGREES THAT THE SEPARATELY EXECUTED LIABILITY WAIVER AND ASSUMPTION OF RISK AGREEMENT IS INCORPORATED INTO THIS AGREEMENT BY REFERENCE AS THOUGH FULLY SET FORTH HEREIN. MEMBER'S EXECUTION OF THAT WAIVER IS A CONDITION OF PARTICIPATION IN PHYSICAL SERVICES.

### 7.2 Acknowledgment of Risk

MEMBER ACKNOWLEDGES THAT PHYSICAL TRAINING, RECOVERY MODALITIES, AND OTHER WELLNESS ACTIVITIES OFFERED THROUGH COMPANY INVOLVE INHERENT RISKS OF PHYSICAL INJURY, ILLNESS, DISABILITY, AND DEATH. MEMBER VOLUNTARILY ASSUMES THOSE RISKS TO THE FULLEST EXTENT PERMITTED BY LAW.

### 7.3 Release

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MEMBER AGREES THAT THE RELEASE, ASSUMPTION OF RISK, AND COVENANT NOT TO SUE SET FORTH IN THE SEPARATELY EXECUTED LIABILITY WAIVER SHALL GOVERN CLAIMS ARISING FROM MEMBER'S PARTICIPATION IN THE APPLICABLE ACTIVITIES.

Member's Initials Acknowledging Assumption of Risk and Release: {{INITIALS_ASSUMPTION_OF_RISK}}

---

## Section 8. Privacy and Health Data Acknowledgments

### 8.1 Direct Member Data

Member acknowledges that information provided directly to Company, including account information, payment information, scheduling history, training information, wellness questionnaires, supplement preferences, and non-clinical communications, is governed by Company's Privacy Policy and related member-facing privacy notices.

### 8.2 Clinical Information and Independent Providers

To the extent independent licensed physicians, laboratories, or other clinical providers furnish services, order tests, interpret results, or transmit clinical information for Member's program, those providers remain responsible for their own clinical decisions, billing, records, and notices of privacy practices where applicable. With Member's written consent or as otherwise permitted by law, Company may receive and handle certain health information from those providers for care coordination, platform display, or administrative support, subject to applicable law and contractual arrangements.

### 8.3 Authorization for Program Coordination

Member authorizes Company to share Member's wellness-program information, training data, screening data, supplement usage records, and other program-related information with independent clinicians and providers to the extent reasonably necessary for care coordination, program administration, safety review, or related services requested by Member. Member also authorizes Company to receive information from such providers when reasonably necessary to coordinate Member's program or display results through Company's systems.

### 8.4 Applicable Notices

Member acknowledges receipt of, or access to, Company's Privacy Policy and Company's Health Data Privacy Notice. To the extent Member receives clinical services from an independent provider, Member acknowledges that the provider's own notice of privacy practices may separately apply.

---

## Section 9. Member Representations and Warranties

Member represents and warrants to Company as of the Effective Date and continuing throughout the term of this Agreement that:

(a) Member is at least eighteen (18) years of age;

(b) Member has the legal authority to enter into this Agreement;

(c) Member has disclosed, or will promptly disclose, any material health condition, restriction, contraindication, or medication information reasonably relevant to safe participation in Company-facilitated wellness services;

(d) Member's information provided to Company is accurate, complete, and not misleading in any material respect; and

(e) Member will promptly notify Company in writing of any material change in health status that may affect safe participation.

---

## Section 10. Dispute Resolution

### 10.1 Mandatory Arbitration

ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE SERVICES SHALL BE RESOLVED BY FINAL AND BINDING ARBITRATION BEFORE A SINGLE ARBITRATOR ADMINISTERED BY THE AMERICAN ARBITRATION ASSOCIATION ("AAA") UNDER ITS CONSUMER ARBITRATION RULES, EXCEPT AS OTHERWISE EXPRESSLY PROVIDED HEREIN.

### 10.2 Small Claims Court Carve-Out

Either Party may bring an individual action in small claims court for disputes within that court's jurisdiction, so long as the matter remains an individual action.

### 10.3 Class Action Waiver

TO THE EXTENT PERMITTED BY LAW, MEMBER AND COMPANY AGREE THAT EACH MAY BRING CLAIMS ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF, CLASS MEMBER, OR REPRESENTATIVE IN ANY PURPORTED CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.

Member's Initials Acknowledging Arbitration and Class Action Waiver: {{INITIALS_BINDING_ARBITRATION}}

### 10.4 Venue and Governing Law

This Agreement shall be governed by Texas law. Any court proceeding permitted under this Agreement shall be brought in Bexar County, Texas, unless applicable consumer law requires otherwise.

### 10.5 Prevailing Party and Fee Shifting

Any award of attorneys' fees or costs shall be governed by applicable law and the applicable arbitration rules.

---

## Section 11. Entire Agreement; Integration

### 11.1 Integration Clause

This Agreement, together with Exhibit A, the separately executed Liability Waiver, the separately executed Informed Consent for Health Services (if applicable), the separately executed Electronic Communications Consent, and any signed addenda, constitutes the entire agreement between the Parties with respect to the subject matter hereof.

### 11.2 Amendments

This Agreement may be amended only by a written instrument signed by authorized representatives of both Parties.

### 11.3 Waiver

No waiver of any provision of this Agreement shall be effective unless in writing.

### 11.4 Severability

If any provision of this Agreement is held invalid, illegal, or unenforceable, such provision shall be modified or severed to the minimum extent necessary, and the remaining provisions shall remain in effect.

### 11.5 Electronic Signatures

Electronic signatures shall be deemed valid and binding to the same extent as original ink signatures under applicable law.

---

## Section 12. Signature Block

By signing below, Member acknowledges that Member has read, understood, and agrees to the terms of this Agreement, including the incorporated dispute resolution provisions and cancellation obligations.

**MEMBER:**

Signature: {{SIGNATURE}} Date: {{SIGNING_DATE}}

Printed Name: {{MEMBER_NAME}}

**Initials Required for Material Terms:**

| Term | Member's Initials |
|---|---|
| Section 7 — Assumption of Risk and Release | {{INITIALS_ASSUMPTION_OF_RISK}} |
| Section 10.1 — Binding Arbitration | {{INITIALS_BINDING_ARBITRATION}} |
| Section 10.3 — Class Action Waiver | {{INITIALS_CLASS_ACTION_WAIVER}} |
| Section 6.4 — Early Termination Obligation | {{INITIALS_EARLY_TERMINATION}} |

---

**FOR HOLLIS HEALTH LLC:**

Signature: ______________________________________ Date: ______________

Printed Name: ______________________________________

Title: ______________________________________

---

*This document was prepared for attorney review and is not a final legal instrument. Hollis Health LLC makes no representation that this document is legally sufficient without independent legal counsel review.*`;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const meta = {
  title: "Membership Agreement",
  version: "2.2.0",
  effectiveDate: "2026-05-26",
  /** Placeholder — will be recalculated by npm run sync:legal-docs */
  contentHash: "PENDING_SYNC",
};

/**
 * Full markdown content with {{TEMPLATE_TOKEN}} placeholders.
 * Sections 2.1, 2.3, and 3.2 are dynamically generated from
 * MASTER_OFFER_SHEET (offer-sheet.json) at module load time.
 */
export const content = generateMembershipAgreementContent();

/**
 * Initials sections required in the Membership Agreement.
 * Keys match MEMBERSHIP_INITIALS constants in shared/contracts/admin/consent-schemas.ts.
 */
export const initialsSections = [
  {
    key: "assumption_of_risk",
    title: "Assumption of Risk and Release (Section 7)",
    excerpt:
      "You acknowledge that physical training, recovery modalities, and other wellness activities involve inherent risks of physical injury, illness, disability, and death, and you voluntarily assume those risks.",
  },
  {
    key: "binding_arbitration",
    title: "Binding Arbitration (Section 10.1)",
    excerpt:
      "Any dispute arising under this Agreement shall be resolved by final and binding arbitration before the AAA — you are waiving your right to a jury trial.",
  },
  {
    key: "class_action_waiver",
    title: "Class Action Waiver (Section 10.3)",
    excerpt:
      "You agree to bring claims only in an individual capacity and not as a plaintiff or class member in any class, collective, or representative proceeding.",
  },
  {
    key: "early_termination",
    title: "Early Termination Obligation (Section 6.4)",
    excerpt:
      "If you terminate before the End Date for reasons other than an approved or legally required cancellation, you remain responsible for the remaining discounted contract value.",
  },
] as const;

export type MembershipInitialsKey =
  (typeof initialsSections)[number]["key"];
