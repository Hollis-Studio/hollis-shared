import {
  CreateMealTemplateBodySchema,
  NutritionFoodEntryMoveBodySchema,
  UpdateMealTemplateBodySchema,
  aiAnalysisResultSchema,
} from "../domain/nutrition";

const templateFood = {
  name: "Greek yogurt",
  quantity: 1,
  unit: "cup",
  calories: 140,
  protein: 20,
  carbs: 8,
  fat: 0,
  source: "manual" as const,
};

describe("nutrition library contracts", () => {
  it("defaults favorites only on create, not on partial update", () => {
    expect(
      CreateMealTemplateBodySchema.parse({
        name: "Breakfast",
        foods: [templateFood],
      }).isFavorite,
    ).toBe(false);
    expect(UpdateMealTemplateBodySchema.parse({ name: "New name" })).toEqual({
      name: "New name",
    });
  });

  it("rejects unusable template food rows", () => {
    expect(
      CreateMealTemplateBodySchema.safeParse({
        name: "Breakfast",
        foods: [{ ...templateFood, name: " ", quantity: 0, unit: " " }],
      }).success,
    ).toBe(false);
  });

  it("accepts a server-atomic move with a stable food identifier", () => {
    const move = NutritionFoodEntryMoveBodySchema.parse({
      targetDate: "2026-07-18",
      targetHour: 12,
      entry: {
        ...templateFood,
        id: "food-stable-id",
        loggedAt: "2026-07-18T12:00:00.000Z",
      },
      timezone: "America/Chicago",
    });

    expect(move.entry.id).toBe("food-stable-id");
  });

  it("rejects impossible target dates for atomic moves", () => {
    expect(
      NutritionFoodEntryMoveBodySchema.safeParse({
        targetDate: "2026-02-31",
        targetHour: 12,
        entry: {
          ...templateFood,
          id: "food-stable-id",
          loggedAt: "2026-07-18T12:00:00.000Z",
        },
      }).success,
    ).toBe(false);
  });

  it("preserves individually decomposed foods in an AI result", () => {
    const result = aiAnalysisResultSchema.parse({
      rejected: false,
      foodName: "Eggs and toast",
      description: "Two foods",
      macros: { calories: 320, protein: 18, carbs: 28, fat: 14 },
      nutritionQualityIndex: 72,
      confidence: 0.86,
      foods: [
        {
          foodName: "Eggs",
          quantity: 2,
          unit: "eggs",
          macros: { calories: 160, protein: 14, carbs: 2, fat: 10 },
          nutritionQualityIndex: 80,
          confidence: 0.9,
        },
        {
          foodName: "Toast",
          quantity: 2,
          unit: "slices",
          macros: { calories: 160, protein: 4, carbs: 26, fat: 4 },
          nutritionQualityIndex: 64,
          confidence: 0.82,
        },
      ],
    });

    expect(result.foods).toHaveLength(2);
  });
});
