import type { Recipe } from "@/types/recipes";
import { RecipeCard } from "./RecipeCard";

type RecipeGridProps = {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
};

export function RecipeGrid({ recipes, onSelectRecipe }: RecipeGridProps) {
  return (
    <section className="recipe-grid" aria-label="Recipe results">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onSelectRecipe={onSelectRecipe} />
      ))}
    </section>
  );
}
