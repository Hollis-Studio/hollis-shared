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
