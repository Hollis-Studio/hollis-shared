import { createHash } from "node:crypto";

import {
  ALL_CONSENT_DOCS,
  DOCUMENT_REGISTRY,
  OPTIONAL_CONSENT_DOCS,
  REQUIRED_CONSENT_DOCS,
  generateEnrollmentSummary,
  renderEnrollmentSummaryMarkdown,
  renderSignedDocumentContent,
} from "../admin/legal-documents";
import {
  CONSENT_DOCUMENT_TYPES,
  EnrollmentSummarySchema,
  SignedDocumentPayloadSchema,
  SigningClientInfoSchema,
} from "../admin/consent-schemas";
import { PHI_RESOURCE } from "../domain/phi-audit";

const VALID_SIGNATURE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";
const VALID_SHA_256 =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

/** The contentHash convention: first 8 hex chars of sha256 over the raw markdown. */
const contentHashOf = (content: string): string =>
  createHash("sha256").update(content).digest("hex").slice(0, 8);

/**
 * Frozen (version, contentHash) fingerprint of every document in
 * DOCUMENT_REGISTRY. This table is the legal hash guard: a ConsentRecord stores
 * `documentVersion` + `displayedContentHash`, so if the text of a signed
 * document changes without BOTH being bumped, already-signed records silently
 * point at text that no longer exists and consent becomes unprovable.
 *
 * Editing any legal text therefore has to touch three places in one commit:
 * the document module's `content`, its `meta.version` + `meta.contentHash`, and
 * this table. A text edit alone fails on the computed-hash assertion; a text +
 * hash edit that forgets the version bump fails here.
 */
const EXPECTED_DOCUMENT_FINGERPRINTS = {
  MEMBERSHIP_AGREEMENT: { version: "2.8.0", contentHash: "9d9d916b" },
  LIABILITY_WAIVER: { version: "1.5.0", contentHash: "c6481b3d" },
  INFORMED_CONSENT: { version: "2.2.0", contentHash: "b6d1d077" },
  ELECTRONIC_COMMS_CONSENT: { version: "1.4.0", contentHash: "0eb4cd16" },
  PHOTO_VIDEO_RELEASE: { version: "1.3.0", contentHash: "a63c032b" },
  HIPAA_NPP: { version: "1.3.0", contentHash: "6aa28428" },
} as const satisfies Record<
  keyof typeof DOCUMENT_REGISTRY,
  { version: string; contentHash: string }
>;

describe("admin consent legal document contracts", () => {
  it("exports consent records as a PHI resource in the typed contract", () => {
    expect(PHI_RESOURCE.CONSENT_RECORD).toBe("consent_record");
  });

  it("exposes a canonical document registry and signing order", () => {
    expect(Object.keys(DOCUMENT_REGISTRY)).toEqual([...CONSENT_DOCUMENT_TYPES]);
    expect(REQUIRED_CONSENT_DOCS).toEqual([
      "HIPAA_NPP",
      "MEMBERSHIP_AGREEMENT",
      "LIABILITY_WAIVER",
      "INFORMED_CONSENT",
      "ELECTRONIC_COMMS_CONSENT",
    ]);
    expect(OPTIONAL_CONSENT_DOCS).toEqual(["PHOTO_VIDEO_RELEASE"]);
    expect(ALL_CONSENT_DOCS).toEqual([
      ...REQUIRED_CONSENT_DOCS,
      ...OPTIONAL_CONSENT_DOCS,
    ]);
  });

  it("fingerprints every document in the registry, not just one", () => {
    // Guards the guard: a document added to the registry without a fingerprint
    // would otherwise be silently exempt from the hash checks below.
    expect(Object.keys(EXPECTED_DOCUMENT_FINGERPRINTS).sort()).toEqual(
      Object.keys(DOCUMENT_REGISTRY).sort(),
    );
  });

  it.each(Object.keys(DOCUMENT_REGISTRY) as (keyof typeof DOCUMENT_REGISTRY)[])(
    "%s declares a contentHash matching its own text",
    (documentType) => {
      const doc = DOCUMENT_REGISTRY[documentType];
      expect(doc.meta.contentHash).toBe(contentHashOf(doc.content));
    },
  );

  it.each(Object.keys(DOCUMENT_REGISTRY) as (keyof typeof DOCUMENT_REGISTRY)[])(
    "%s text change is accompanied by a version bump",
    (documentType) => {
      const doc = DOCUMENT_REGISTRY[documentType];
      const expected = EXPECTED_DOCUMENT_FINGERPRINTS[documentType];
      expect({
        version: doc.meta.version,
        contentHash: doc.meta.contentHash,
      }).toEqual(expected);
      // Bumping the table's hash without bumping its version would still leave
      // signed ConsentRecords pointing at the old version string.
      expect(contentHashOf(doc.content)).toBe(expected.contentHash);
    },
  );

  it("renders canonical signed legal text from shared contracts", () => {
    const summary = generateEnrollmentSummary("CORE", 8, "2026-04-01");
    const exhibitA = renderEnrollmentSummaryMarkdown(summary, "Jane Member");
    const rendered = renderSignedDocumentContent(
      `${DOCUMENT_REGISTRY.MEMBERSHIP_AGREEMENT.content}\n\n${exhibitA}`,
      {
        name: "Jane Member",
        email: "jane@example.com",
        dateOfBirth: "1990-01-02",
        selectedTier: "CORE",
        contractDurationMonths: 8,
        startDate: summary.startDate,
        endDate: summary.endDate,
      },
      "April 1, 2026",
    );

    expect(rendered).toContain("Jane Member");
    expect(rendered).toContain("[x] **Core**");
    expect(rendered).toContain("[x] **8-Month Term**");
    expect(rendered).toContain("# Exhibit A");
    expect(rendered).not.toContain("{{MEMBER_NAME}}");
    expect(createHash("sha256").update(rendered).digest("hex")).toMatch(
      /^[a-f0-9]{64}$/,
    );
  });

  it.each(["ESSENTIALS", "CORE", "CONCIERGE"] as const)(
    "keeps physical products out of new %s enrollment offers",
    (tier) => {
      const agreement = DOCUMENT_REGISTRY.MEMBERSHIP_AGREEMENT;
      const exhibit = renderEnrollmentSummaryMarkdown(
        generateEnrollmentSummary(tier, 8, "2026-09-19"),
        "Jane Member",
      );
      expect(agreement.content).toContain(
        "Supplements and all other physical products are currently unavailable",
      );
      expect(agreement.content).not.toContain("supplement purchases");
      expect(exhibit).toContain(
        "| Supplements and Other Physical Products | Currently unavailable; not included or available as add-ons |",
      );
      expect(exhibit).not.toContain("Included Supplement Allowance");
      expect(agreement.meta.contentHash).toBe(
        createHash("sha256").update(agreement.content).digest("hex").slice(0, 8),
      );
    },
  );

  it("requires a displayed content hash instead of client legal document text", () => {
    expect(
      SignedDocumentPayloadSchema.safeParse({
        documentType: "MEMBERSHIP_AGREEMENT",
        documentVersion: DOCUMENT_REGISTRY.MEMBERSHIP_AGREEMENT.meta.version,
        signatureDataUrl: VALID_SIGNATURE,
        displayedContentHash: VALID_SHA_256,
      }).success,
    ).toBe(true);

    expect(
      SignedDocumentPayloadSchema.safeParse({
        documentType: "MEMBERSHIP_AGREEMENT",
        documentVersion: DOCUMENT_REGISTRY.MEMBERSHIP_AGREEMENT.meta.version,
        signatureDataUrl: VALID_SIGNATURE,
        documentContent: "legacy client-submitted legal text",
      }).success,
    ).toBe(false);
  });

  it("rejects non-SHA-256 displayed content hashes", () => {
    expect(
      SignedDocumentPayloadSchema.safeParse({
        documentType: "LIABILITY_WAIVER",
        documentVersion: DOCUMENT_REGISTRY.LIABILITY_WAIVER.meta.version,
        signatureDataUrl: VALID_SIGNATURE,
        displayedContentHash: "not-a-sha",
      }).success,
    ).toBe(false);
  });
});

describe("membership agreement — Hollis Training and Intro Month (v2.8.0)", () => {
  const agreement = DOCUMENT_REGISTRY.MEMBERSHIP_AGREEMENT;

  function renderFor(
    tier: "TRAINING" | "ESSENTIALS" | "CORE" | "CONCIERGE",
    months: number,
    introMonth = false,
  ): string {
    const summary = generateEnrollmentSummary(tier, months, "2026-10-17", {
      introMonth,
    });
    const exhibitA = renderEnrollmentSummaryMarkdown(summary, "Jane Member");
    return renderSignedDocumentContent(
      `${agreement.content}\n\n${exhibitA}`,
      {
        name: "Jane Member",
        email: "jane@example.com",
        selectedTier: tier,
        contractDurationMonths: months,
        introMonthElected: introMonth,
        startDate: summary.startDate,
        endDate: summary.endDate,
      },
      "October 17, 2026",
    );
  }

  it("offers Hollis Training month-to-month with its own tier and term boxes", () => {
    expect(agreement.content).toContain("{{CHECK_TIER_TRAINING}} **Hollis Training**");
    expect(agreement.content).toContain("{{CHECK_TERM_1MO}} **Month-to-Month**");
    expect(agreement.content).toContain("{{CHECK_INTRO_MONTH}}");
    expect(agreement.content).toContain("| Hollis Training | $399 | Not offered | Not offered | Not offered |");
    expect(agreement.content).toContain("| Private coaching sessions | 4 / month | 2 / week | 4 / week | 6 / week |");
  });

  it("renders a Training enrollment with no fixed term and no early termination amount", () => {
    const rendered = renderFor("TRAINING", 1);
    expect(rendered).toContain("[x] **Hollis Training**");
    expect(rendered).toContain("[x] **Month-to-Month**");
    expect(rendered).toContain("[ ] **4-Month Term**");
    expect(rendered).toContain("[ ] **Member elects the Intro Month");
    expect(rendered).toContain("| Contract Term | Month-to-month (no fixed term) |");
    expect(rendered).toContain("| First Billing Period Ends | 2026-11-16 (no fixed End Date) |");
    expect(rendered).toContain("Not applicable — month-to-month; no early termination amount");
    expect(rendered).toContain("| Sponsored Third-Party Testing Membership | Not included at this tier |");
    expect(rendered).not.toMatch(/\{\{[A-Z_]+\}\}/);
  });

  it("renders the Intro Month election, window date, and deferred panel", () => {
    const rendered = renderFor("CORE", 4, true);
    expect(rendered).toContain("[x] **4-Month Term**");
    expect(rendered).toContain("[x] **Member elects the Intro Month described in Section 3.5**");
    expect(rendered).toContain("| Intro Month | Elected — cancellation must be received before 2026-11-15 |");
    expect(rendered).toContain("## Intro Month");
    expect(rendered).toContain("does not pay for, issue, or arrange this benefit until the Intro Window ends");
  });

  it("contains the intro-month, month-to-month, and early-termination carve-out clauses", () => {
    expect(agreement.content).toContain("### 3.5 Intro Month");
    expect(agreement.content).toContain("It is not an additional month, and Member's total commitment");
    expect(agreement.content).toContain("no early termination amount under Section 6.4 is due");
    expect(agreement.content).toContain(
      "This Section 6.4 applies only to a Fixed Term. It does not apply to Month-to-Month enrollment in Hollis Training",
    );
    expect(agreement.content).toContain("This benefit is not included at the Hollis Training or Essentials tiers.");
    expect(agreement.content).toContain("160+ biomarkers per year across two blood draws");
    expect(agreement.content).not.toMatch(/twice-yearly|twice yearly/i);
  });

  it("limits recovery to stretch and mobility work inside sessions", () => {
    expect(agreement.content).toContain("### 2.6 Recovery\n");
    expect(agreement.content).toContain(
      "\"recovery\" under this Agreement means guided stretching and mobility work",
    );
    expect(agreement.content).not.toMatch(/RECOVERY MODALITIES|recovery modality access/i);
    const table = agreement.content.slice(
      agreement.content.indexOf("### 2.1"),
      agreement.content.indexOf("### 2.2"),
    );
    expect(table).not.toMatch(/cold plunge|red light|cupping/i);
  });

  it("refuses tier + term combinations the offer sheet does not sell", () => {
    expect(() => generateEnrollmentSummary("TRAINING", 4)).toThrow(/not offered/);
    expect(() => generateEnrollmentSummary("CORE", 1)).toThrow(/not offered/);
    expect(() =>
      generateEnrollmentSummary("CORE", 8, "2026-10-17", { introMonth: true }),
    ).toThrow(/intro month/i);
    expect(() =>
      generateEnrollmentSummary("TRAINING", 1, "2026-10-17", { introMonth: true }),
    ).toThrow(/intro month/i);
  });

  it("leaves the intro box unchecked for an ineligible election", () => {
    const rendered = renderSignedDocumentContent(
      agreement.content,
      {
        name: "Jane Member",
        email: "jane@example.com",
        selectedTier: "CORE",
        contractDurationMonths: 8,
        introMonthElected: true,
      },
      "October 17, 2026",
    );
    expect(rendered).toContain("[ ] **Member elects the Intro Month");
  });

  it("carries intro-month fields through the consent payload schemas", () => {
    const summary = generateEnrollmentSummary("ESSENTIALS", 4, "2026-10-17", {
      introMonth: true,
    });
    const parsed = EnrollmentSummarySchema.parse(summary);
    expect(parsed.introMonthElected).toBe(true);
    expect(parsed.introWindowEndsAt).toBe("2026-11-15");
    expect(parsed.isMonthToMonth).toBe(false);
    expect(
      SigningClientInfoSchema.parse({
        name: "Jane",
        email: "jane@example.com",
        selectedTier: "TRAINING",
        contractDurationMonths: 1,
        introMonthElected: false,
      }).selectedTier,
    ).toBe("TRAINING");
  });
});
