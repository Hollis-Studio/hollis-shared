import { bodyWeightKgSchema, loadWeightKgSchema } from "../schemas/weight";

describe("weight schemas", () => {
  describe("bodyWeightKgSchema", () => {
    it("accepts clinical body weights from 20 to 500 kg", () => {
      expect(bodyWeightKgSchema.safeParse(20).success).toBe(true);
      expect(bodyWeightKgSchema.safeParse(500).success).toBe(true);
    });

    it("rejects clinical body weights below 20 kg or above 500 kg", () => {
      expect(bodyWeightKgSchema.safeParse(19.99).success).toBe(false);
      expect(bodyWeightKgSchema.safeParse(500.01).success).toBe(false);
    });
  });

  describe("loadWeightKgSchema", () => {
    it("accepts training loads from 0 to 500 kg", () => {
      expect(loadWeightKgSchema.safeParse(0).success).toBe(true);
      expect(loadWeightKgSchema.safeParse(500).success).toBe(true);
    });

    it("rejects negative training loads or loads above 500 kg", () => {
      expect(loadWeightKgSchema.safeParse(-0.01).success).toBe(false);
      expect(loadWeightKgSchema.safeParse(500.01).success).toBe(false);
    });
  });
});
