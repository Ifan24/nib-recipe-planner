"use client";

import { useCallback, useEffect, useState } from "react";
import { getRandomRecipe, searchRecipes } from "@/lib/mealdb";
import { addRecipeToShoppingList } from "@/lib/shopping-list";
import { clearShoppingList, readShoppingList, writeShoppingList } from "@/lib/storage";
import type { Recipe, ShoppingListItem } from "@/types/recipes";
import { AppHeader } from "./AppHeader";
import { RecipeGrid } from "./RecipeGrid";
import { RecipeModal } from "./RecipeModal";
import { SearchForm } from "./SearchForm";
import { ShoppingListView } from "./ShoppingListView";

type View = "search" | "shopping-list";

const INITIAL_RECIPE_COUNT = 12;
const RECIPE_LOAD_INCREMENT = 8;

export function RecipePlannerApp() {
  const [view, setView] = useState<View>("search");
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [visibleRecipeCount, setVisibleRecipeCount] = useState(INITIAL_RECIPE_COUNT);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [isLoadingSurprise, setIsLoadingSurprise] = useState(false);
  const [message, setMessage] = useState("Search for a meal to begin.");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setShoppingList(readShoppingList());
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  async function handleSearch() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setRecipes([]);
      setVisibleRecipeCount(INITIAL_RECIPE_COUNT);
      setStatus("idle");
      setMessage("Enter a recipe search term to begin.");
      return;
    }

    setStatus("loading");
    setMessage(`Searching for ${trimmedQuery}...`);

    try {
      const results = await searchRecipes(trimmedQuery);
      setRecipes(results);
      setVisibleRecipeCount(INITIAL_RECIPE_COUNT);
      setMessage(results.length === 0 ? `No recipes found for ${trimmedQuery}.` : "");
    } catch (error) {
      setRecipes([]);
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("error");
      return;
    }

    setStatus("idle");
  }

  async function handleSurpriseMe() {
    setIsLoadingSurprise(true);
    setMessage("");

    try {
      const recipe = await getRandomRecipe();
      setSelectedRecipe(recipe);
      setStatus("idle");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("error");
    } finally {
      setIsLoadingSurprise(false);
    }
  }

  const handleShowSearch = useCallback(() => {
    setView("search");
  }, []);

  const handleShowShoppingList = useCallback(() => {
    setView("shopping-list");
  }, []);

  const handleSelectRecipe = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleLoadMoreRecipes = useCallback(() => {
    setVisibleRecipeCount((currentCount) =>
      Math.min(currentCount + RECIPE_LOAD_INCREMENT, recipes.length),
    );
  }, [recipes.length]);

  const handleCloseRecipe = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  const handleAddToShoppingList = useCallback((recipe: Recipe) => {
    setShoppingList((currentItems) => {
      const nextList = addRecipeToShoppingList(currentItems, recipe);
      writeShoppingList(nextList);
      return nextList;
    });
    setStatus("idle");
    setMessage(`${recipe.title} was added to your shopping list.`);
  }, []);

  const handleClearShoppingList = useCallback(() => {
    clearShoppingList();
    setShoppingList([]);
  }, []);

  const visibleRecipes = recipes.slice(0, visibleRecipeCount);
  const remainingRecipeCount = Math.max(recipes.length - visibleRecipes.length, 0);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <AppHeader
        currentView={view}
        isLoadingSurprise={isLoadingSurprise}
        shoppingListCount={shoppingList.length}
        onShowSearch={handleShowSearch}
        onShowShoppingList={handleShowShoppingList}
        onSurpriseMe={handleSurpriseMe}
      />

      <main id="main-content">
        {view === "search" ? (
          <section className="search-panel">
            <div className="search-stage">
              <div className="hero">
                <div className="hero-copy">
                  <p className="eyebrow">MealDB recipe search</p>
                  <h1>
                    <span>Find recipes</span>
                    <span>Build your list</span>
                  </h1>
                  <SearchForm
                    query={query}
                    isSearching={status === "loading"}
                    onQueryChange={setQuery}
                    onSearch={handleSearch}
                  />
                </div>
                <p className="hero-note">
                  Type a keyword, open a recipe for the full method, then add its ingredients to a
                  local shopping list you can filter and tick off.
                </p>
              </div>

              {message ? (
                <div
                  className={status === "error" ? "notice error" : "notice"}
                  role={status === "error" ? "alert" : "status"}
                  aria-live={status === "error" ? "assertive" : "polite"}
                  aria-atomic="true"
                >
                  {message}
                </div>
              ) : null}
            </div>

            {status === "loading" ? (
              <div
                className="loading-grid"
                role="status"
                aria-live="polite"
                aria-label="Loading recipes"
              >
                <span className="sr-only">Loading recipes...</span>
              </div>
            ) : null}

            {recipes.length > 0 && status !== "loading" ? (
              <>
                <div className="results-toolbar" role="status" aria-live="polite">
                  <p>
                    Showing {visibleRecipes.length} of {recipes.length} recipes
                    {query.trim() ? ` for ${query.trim()}` : ""}.
                  </p>
                </div>

                <RecipeGrid recipes={visibleRecipes} onSelectRecipe={handleSelectRecipe} />

                {remainingRecipeCount > 0 ? (
                  <div className="load-more-panel">
                    <button
                      className="primary-button"
                      type="button"
                      onClick={handleLoadMoreRecipes}
                    >
                      show more recipes
                      <span>{remainingRecipeCount} left</span>
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </section>
        ) : (
          <ShoppingListView
            items={shoppingList}
            onClearList={handleClearShoppingList}
            onBackToSearch={handleShowSearch}
          />
        )}
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={handleCloseRecipe}
        onAddToShoppingList={handleAddToShoppingList}
      />
    </div>
  );
}
