import Image from "next/image";
import type { Recipe } from "@/types/recipes";

type RecipeCardProps = {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
};

export function RecipeCard({ recipe, onSelectRecipe }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <button
        type="button"
        onClick={() => onSelectRecipe(recipe)}
        aria-label={`View ${recipe.title} recipe, ${recipe.category}, ${recipe.area}`}
      >
        <span className="recipe-card-image">
          <Image
            src={recipe.thumbnail}
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, (max-width: 1100px) 50vw, 33vw"
            unoptimized
          />
        </span>
        <span className="recipe-card-body">
          <span className="recipe-title">{recipe.title}</span>
          <span className="recipe-meta">
            <span>{recipe.category}</span>
            <span>{recipe.area}</span>
          </span>
        </span>
      </button>
    </article>
  );
}
