/**
 * @ai-context Contact validation schema tests
 * Tests: emailSchema, phoneSchema, phoneSchemaLenient
 *
 * Validates that shared email and phone schemas correctly handle:
 * - Valid formats
 * - Invalid formats
 * - Edge cases (empty strings, special characters, etc.)
 */

import { describe, expect, it } from "@jest/globals";
import {
  emailSchema,
  normalizePhoneToE164,
  phoneSchema,
  phoneSchemaLenient,
} from "../schemas";

describe("Contact Validation Schemas", () => {
  describe("emailSchema", () => {
    describe("valid emails", () => {
      it("should accept standard email format", () => {
        const result = emailSchema.safeParse("user@example.com");
        expect(result.success).toBe(true);
      });

      it("should accept email with subdomain", () => {
        const result = emailSchema.safeParse("user@mail.example.com");
        expect(result.success).toBe(true);
      });

      it("should accept email with plus addressing", () => {
        const result = emailSchema.safeParse("user+tag@example.com");
        expect(result.success).toBe(true);
      });

      it("should accept email with dots in local part", () => {
        const result = emailSchema.safeParse("first.last@example.com");
        expect(result.success).toBe(true);
      });

      it("should accept email with numbers", () => {
        const result = emailSchema.safeParse("user123@example123.com");
        expect(result.success).toBe(true);
      });
    });

    describe("invalid emails", () => {
      it("should reject email without @", () => {
        const result = emailSchema.safeParse("userexample.com");
        expect(result.success).toBe(false);
      });

      it("should reject email without domain", () => {
        const result = emailSchema.safeParse("user@");
        expect(result.success).toBe(false);
      });

      it("should reject email without local part", () => {
        const result = emailSchema.safeParse("@example.com");
        expect(result.success).toBe(false);
      });

      it("should reject email without TLD", () => {
        const result = emailSchema.safeParse("user@example");
        expect(result.success).toBe(false);
      });

      it("should reject email with spaces", () => {
        const result = emailSchema.safeParse("user @example.com");
        expect(result.success).toBe(false);
      });

      it("should reject empty string", () => {
        const result = emailSchema.safeParse("");
        expect(result.success).toBe(false);
      });

      it("should reject plain text", () => {
        const result = emailSchema.safeParse("not an email");
        expect(result.success).toBe(false);
      });
    });
  });

  describe("phoneSchema (strict E.164)", () => {
    describe("valid phone numbers", () => {
      it("should accept E.164 format with country code", () => {
        const result = phoneSchema.safeParse("+14155552671");
        expect(result.success).toBe(true);
      });

      it("should accept international numbers", () => {
        const result = phoneSchema.safeParse("+442071234567");
        expect(result.success).toBe(true);
      });

      it("should accept the shortest plausible E.164 number", () => {
        const result = phoneSchema.safeParse("+12345678");
        expect(result.success).toBe(true);
      });
    });

    describe("invalid phone numbers", () => {
      it("should reject numbers missing the leading plus", () => {
        const result = phoneSchema.safeParse("14155552671");
        expect(result.success).toBe(false);
      });

      it("should reject numbers with a 0 country-code prefix", () => {
        const result = phoneSchema.safeParse("+04155552671");
        expect(result.success).toBe(false);
      });

      it("should reject numbers with spaces", () => {
        const result = phoneSchema.safeParse("+1 415 555 2671");
        expect(result.success).toBe(false);
      });

      it("should reject numbers with dashes", () => {
        const result = phoneSchema.safeParse("+1-415-555-2671");
        expect(result.success).toBe(false);
      });

      it("should reject numbers with parentheses", () => {
        const result = phoneSchema.safeParse("+1 (415) 555-2671");
        expect(result.success).toBe(false);
      });

      it("should reject too short numbers", () => {
        const result = phoneSchema.safeParse("+1234567");
        expect(result.success).toBe(false);
      });

      it("should reject too long numbers", () => {
        const result = phoneSchema.safeParse("+141555526711234567");
        expect(result.success).toBe(false);
      });

      it("should reject empty string", () => {
        const result = phoneSchema.safeParse("");
        expect(result.success).toBe(false);
      });
    });
  });

  describe("phoneSchemaLenient (formatted)", () => {
    describe("valid phone numbers", () => {
      it("should accept E.164 format", () => {
        const result = phoneSchemaLenient.safeParse("+14155552671");
        expect(result.success).toBe(true);
      });

      it("should accept numbers with spaces", () => {
        const result = phoneSchemaLenient.safeParse("+1 415 555 2671");
        expect(result.success).toBe(true);
      });

      it("should accept numbers with dashes", () => {
        const result = phoneSchemaLenient.safeParse("415-555-2671");
        expect(result.success).toBe(true);
      });

      it("should accept numbers with parentheses", () => {
        const result = phoneSchemaLenient.safeParse("(415) 555-2671");
        expect(result.success).toBe(true);
      });

      it("should accept numbers with dots", () => {
        const result = phoneSchemaLenient.safeParse("415.555.2671");
        expect(result.success).toBe(true);
      });

      it("should accept mixed formatting", () => {
        const result = phoneSchemaLenient.safeParse("+1 (415) 555-2671");
        expect(result.success).toBe(true);
      });

      it("should accept plain digits (minimum 7)", () => {
        const result = phoneSchemaLenient.safeParse("5552671");
        expect(result.success).toBe(true);
      });
    });

    describe("invalid phone numbers", () => {
      it("should reject too short numbers (less than 7 chars)", () => {
        const result = phoneSchemaLenient.safeParse("555267");
        expect(result.success).toBe(false);
      });

      it("should reject numbers with only formatting chars", () => {
        const result = phoneSchemaLenient.safeParse("().---+");
        expect(result.success).toBe(false);
      });

      it("should reject long formatted strings with fewer than 7 digits", () => {
        const result = phoneSchemaLenient.safeParse("(12) 34-56");
        expect(result.success).toBe(false);
      });

      it("should reject letters", () => {
        const result = phoneSchemaLenient.safeParse("415-CALL-NOW");
        expect(result.success).toBe(false);
      });

      it("should reject empty string", () => {
        const result = phoneSchemaLenient.safeParse("");
        expect(result.success).toBe(false);
      });

      it("should reject special characters not allowed", () => {
        const result = phoneSchemaLenient.safeParse("415*555*2671");
        expect(result.success).toBe(false);
      });
    });

    describe("edge cases", () => {
      it("should accept exactly 7 characters", () => {
        const result = phoneSchemaLenient.safeParse("5551234");
        expect(result.success).toBe(true);
      });

      it("should accept very long formatted numbers", () => {
        const result = phoneSchemaLenient.safeParse(
          "+1 (415) 555-2671 ext. 1234",
        );
        // This will fail because 'ext.' contains letters
        expect(result.success).toBe(false);
      });

      it("should accept international format with spaces", () => {
        const result = phoneSchemaLenient.safeParse("+44 20 7123 4567");
        expect(result.success).toBe(true);
      });
    });
  });

  describe("schema comparison", () => {
    it("phoneSchema should be stricter than phoneSchemaLenient", () => {
      const formattedNumber = "(415) 555-2671";

      const strictResult = phoneSchema.safeParse(formattedNumber);
      const lenientResult = phoneSchemaLenient.safeParse(formattedNumber);

      expect(strictResult.success).toBe(false);
      expect(lenientResult.success).toBe(true);
    });

    it("both schemas should accept clean E.164 format", () => {
      const e164Number = "+14155552671";

      const strictResult = phoneSchema.safeParse(e164Number);
      const lenientResult = phoneSchemaLenient.safeParse(e164Number);

      expect(strictResult.success).toBe(true);
      expect(lenientResult.success).toBe(true);
    });
  });

  describe("normalizePhoneToE164", () => {
    it("normalizes formatted US numbers by adding +1", () => {
      expect(normalizePhoneToE164("(415) 555-2671")).toBe("+14155552671");
    });

    it("normalizes international numbers with punctuation when they already include +", () => {
      expect(normalizePhoneToE164("+44 20 7123 4567")).toBe("+442071234567");
    });

    it("normalizes 11-digit US numbers that already include the country code", () => {
      expect(normalizePhoneToE164("1-415-555-2671")).toBe("+14155552671");
    });

    it("prefers the default country code for bare 10-digit numbers", () => {
      expect(normalizePhoneToE164("4155552671")).toBe("+14155552671");
    });

    it("returns null for invalid characters", () => {
      expect(normalizePhoneToE164("415-CALL-NOW")).toBeNull();
    });
  });
});
