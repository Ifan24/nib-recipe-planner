import type { MealDbSearchResponse } from "@/types/mealdb";
import type { Recipe } from "@/types/recipes";
import { mapMealDbRecipe } from "./recipes";

const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function fetchMealDb(path: string): Promise<MealDbSearchResponse> {
  const response = await fetch(`${MEALDB_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error("The recipe service is unavailable. Please try again.");
  }

  return response.json() as Promise<MealDbSearchResponse>;
}

export async function searchRecipes(term: string): Promise<Recipe[]> {
  const trimmedTerm = term.trim();

  if (!trimmedTerm) {
    return [];
  }

  const data = await fetchMealDb(`/search.php?s=${encodeURIComponent(trimmedTerm)}`);
  return data.meals?.map(mapMealDbRecipe) ?? [];
}

export async function getRandomRecipe(): Promise<Recipe> {
  const data = await fetchMealDb("/random.php");
  const meal = data.meals?.[0];

  if (!meal) {
    throw new Error("No surprise recipe was returned. Please try again.");
  }

  return mapMealDbRecipe(meal);
}
