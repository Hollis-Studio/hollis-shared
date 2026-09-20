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
  SignedDocumentPayloadSchema,
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
  MEMBERSHIP_AGREEMENT: { version: "2.7.0", contentHash: "ee78df0f" },
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
