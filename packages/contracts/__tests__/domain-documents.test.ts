import {
  DOCUMENT_CATEGORIES,
  DocumentCategorySchema,
  MEMBER_UPLOAD_DOCUMENT_CATEGORIES,
} from "../domain/documents";

describe("member upload document categories", () => {
  it("offers only non-clinical categories to members", () => {
    expect([...MEMBER_UPLOAD_DOCUMENT_CATEGORIES]).toEqual([
      "PROGRESS_PHOTO",
      "ID_DOCUMENT",
      "OTHER",
    ]);
    for (const clinical of [
      "LAB_RESULT",
      "INSURANCE_CARD",
      "MEDICAL_RECORD",
      "IMAGING",
      "PRESCRIPTION",
    ]) {
      expect(MEMBER_UPLOAD_DOCUMENT_CATEGORIES).not.toContain(clinical);
    }
  });

  it("keeps every legacy category valid so existing records still validate", () => {
    for (const category of DOCUMENT_CATEGORIES) {
      expect(DocumentCategorySchema.safeParse(category).success).toBe(true);
    }
    expect(DOCUMENT_CATEGORIES).toContain("MEDICAL_RECORD");
    expect(DOCUMENT_CATEGORIES).toContain("INSURANCE_CARD");
  });
});
