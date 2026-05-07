import type { MealDbRecipe } from "@/types/mealdb";
import type { Recipe, RecipeIngredient } from "@/types/recipes";

const INGREDIENT_FIELD_COUNT = 20;

export function extractIngredients(meal: MealDbRecipe): RecipeIngredient[] {
  const ingredients: RecipeIngredient[] = [];

  for (let index = 1; index <= INGREDIENT_FIELD_COUNT; index += 1) {
    const rawName = meal[`strIngredient${index}`];
    const name = rawName?.trim();

    if (!name) {
      continue;
    }

    ingredients.push({
      name,
      measure: meal[`strMeasure${index}`]?.trim() ?? "",
    });
  }

  return ingredients;
}

export function mapMealDbRecipe(meal: MealDbRecipe): Recipe {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    thumbnail: meal.strMealThumb,
    category: meal.strCategory?.trim() || "Uncategorised",
    area: meal.strArea?.trim() || "Unknown origin",
    instructions: meal.strInstructions?.trim() || "No instructions supplied.",
    youtubeUrl: meal.strYoutube?.trim() || undefined,
    sourceUrl: meal.strSource?.trim() || undefined,
    ingredients: extractIngredients(meal),
  };
}
