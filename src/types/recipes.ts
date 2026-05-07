export type RecipeIngredient = {
  name: string;
  measure: string;
};

export type Recipe = {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  area: string;
  instructions: string;
  youtubeUrl?: string;
  sourceUrl?: string;
  ingredients: RecipeIngredient[];
};

export type ShoppingListRecipe = {
  title: string;
  instructions: string;
  youtubeUrl?: string;
  sourceUrl?: string;
};

export type ShoppingListItem = {
  key: string;
  name: string;
  measures: string[];
  quantity?: number;
  unit?: string;
  sourceMeals: string[];
  sourceRecipes?: ShoppingListRecipe[];
};
