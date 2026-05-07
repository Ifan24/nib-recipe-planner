"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Recipe } from "@/types/recipes";

type RecipeModalProps = {
  recipe: Recipe | null;
  onClose: () => void;
  onAddToShoppingList: (recipe: Recipe) => void;
};

export function RecipeModal({ recipe, onClose, onAddToShoppingList }: RecipeModalProps) {
  useEffect(() => {
    if (!recipe) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, recipe]);

  if (!recipe) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="recipe-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-media">
          <Image
            src={recipe.thumbnail}
            alt={recipe.title}
            fill
            sizes="(max-width: 800px) 100vw, 40vw"
            priority
            unoptimized
          />
        </div>
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <p className="eyebrow">
                {recipe.category} / {recipe.area}
              </p>
              <h2 id="recipe-modal-title">{recipe.title}</h2>
            </div>
            <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          <div className="modal-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => onAddToShoppingList(recipe)}
            >
              add to my shopping list
            </button>
            {recipe.youtubeUrl ? (
              <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer">
                YouTube
              </a>
            ) : null}
            {recipe.sourceUrl ? (
              <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                Source
              </a>
            ) : null}
          </div>

          <div className="modal-section">
            <h3>Ingredients</h3>
            <ul className="ingredient-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`${ingredient.name}-${ingredient.measure}-${index}`}>
                  <span>{ingredient.name}</span>
                  <span>{ingredient.measure || "As needed"}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h3>Instructions</h3>
            <p className="instructions">{recipe.instructions}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
