export type MealDbRecipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strYoutube: string | null;
  strSource: string | null;
} & {
  [key in `strIngredient${number}` | `strMeasure${number}`]?: string | null;
};

export type MealDbSearchResponse = {
  meals: MealDbRecipe[] | null;
};
