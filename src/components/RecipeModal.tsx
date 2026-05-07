"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Recipe } from "@/types/recipes";

type RecipeModalProps = {
  recipe: Recipe | null;
  onClose: () => void;
  onAddToShoppingList: (recipe: Recipe) => void;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function RecipeModal({ recipe, onClose, onAddToShoppingList }: RecipeModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [addedRecipeId, setAddedRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (!recipe) {
      return undefined;
    }

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialogElement = dialogRef.current;

      if (!dialogElement) {
        return;
      }

      const focusableElements = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [onClose, recipe]);

  if (!recipe) {
    return null;
  }

  const currentRecipe = recipe;
  const addStatus =
    addedRecipeId === currentRecipe.id
      ? `${currentRecipe.title} was added to your shopping list.`
      : "";
  const hasAddedCurrentRecipe = Boolean(addStatus);

  function handleAddToShoppingList() {
    onAddToShoppingList(currentRecipe);
    setAddedRecipeId(currentRecipe.id);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <button
        className="modal-backdrop-hitarea"
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        className="recipe-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
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
            <button
              ref={closeButtonRef}
              className="icon-button"
              type="button"
              onClick={onClose}
              aria-label="Close"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="modal-actions">
            <button
              className={
                hasAddedCurrentRecipe ? "primary-button primary-button-confirmed" : "primary-button"
              }
              type="button"
              onClick={handleAddToShoppingList}
              aria-label={
                hasAddedCurrentRecipe ? "add this recipe to my shopping list again" : undefined
              }
            >
              {hasAddedCurrentRecipe ? "add again" : "add to my shopping list"}
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
            {addStatus ? (
              <p
                className="modal-feedback"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                aria-label={addStatus}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
                added to list
              </p>
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
