import { describe, expect, it } from "vitest";
import { extractIngredients } from "./recipes";
import type { MealDbRecipe } from "@/types/mealdb";

describe("extractIngredients", () => {
  it("extracts populated ingredient and measure fields", () => {
    const meal = {
      idMeal: "1",
      strMeal: "Test meal",
      strMealThumb: "",
      strCategory: null,
      strArea: null,
      strInstructions: null,
      strYoutube: null,
      strSource: null,
      strIngredient1: " Beef ",
      strMeasure1: " 200 g ",
      strIngredient2: "",
      strMeasure2: "",
      strIngredient3: "Onion",
      strMeasure3: "1",
    } satisfies MealDbRecipe;

    expect(extractIngredients(meal)).toEqual([
      { name: "Beef", measure: "200 g" },
      { name: "Onion", measure: "1" },
    ]);
  });
});
