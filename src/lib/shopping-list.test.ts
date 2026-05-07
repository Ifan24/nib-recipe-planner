import { describe, expect, it } from "vitest";
import {
  addRecipeToShoppingList,
  mergeShoppingListItems,
  normalizeIngredientName,
  parseMeasure,
  parseStoredShoppingList,
} from "./shopping-list";
import type { Recipe, ShoppingListItem } from "@/types/recipes";

describe("shopping-list helpers", () => {
  it("normalizes ingredient names for matching", () => {
    expect(normalizeIngredientName("  Brown   Sugar ")).toBe("brown sugar");
  });

  it("parses simple and fractional measures", () => {
    expect(parseMeasure("2 cups")).toEqual({ quantity: 2, unit: "cup" });
    expect(parseMeasure("1/2 tsp")).toEqual({ quantity: 0.5, unit: "tsp" });
    expect(parseMeasure("1 1/2 cup")).toEqual({ quantity: 1.5, unit: "cup" });
  });

  it("combines duplicate ingredients with compatible units", () => {
    const items: ShoppingListItem[] = [
      {
        key: "sugar",
        name: "Sugar",
        measures: ["1 cup"],
        quantity: 1,
        unit: "cup",
        sourceMeals: ["Pudding"],
      },
      {
        key: "sugar",
        name: "sugar",
        measures: ["2 cups"],
        quantity: 2,
        unit: "cup",
        sourceMeals: ["Cake"],
      },
    ];

    expect(mergeShoppingListItems(items)).toEqual([
      {
        key: "sugar",
        name: "Sugar",
        measures: ["3 cup"],
        quantity: 3,
        unit: "cup",
        sourceMeals: ["Pudding", "Cake"],
      },
    ]);
  });

  it("preserves raw measures when automatic addition would be unsafe", () => {
    const recipe = {
      id: "1",
      title: "Pudding",
      thumbnail: "",
      category: "Dessert",
      area: "British",
      instructions: "",
      ingredients: [
        { name: "Sugar", measure: "1 cup" },
        { name: "Sugar", measure: "to taste" },
      ],
    } satisfies Recipe;

    expect(addRecipeToShoppingList([], recipe)[0].measures).toEqual(["1 cup", "to taste"]);
  });

  it("falls back to an empty list for invalid stored data", () => {
    expect(parseStoredShoppingList("not json")).toEqual([]);
    expect(parseStoredShoppingList(JSON.stringify({ key: "x" }))).toEqual([]);
  });
});
