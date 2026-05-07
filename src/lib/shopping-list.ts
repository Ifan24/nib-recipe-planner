import type {
  Recipe,
  RecipeIngredient,
  ShoppingListItem,
  ShoppingListRecipe,
} from "@/types/recipes";

export const SHOPPING_LIST_STORAGE_KEY = "recipe-planner-shopping-list-v1";

type ParsedMeasure = {
  quantity: number;
  unit: string;
};

const FRACTIONS: Record<string, number> = {
  "1/2": 0.5,
  "1/3": 1 / 3,
  "2/3": 2 / 3,
  "1/4": 0.25,
  "3/4": 0.75,
  "1/8": 0.125,
};

const UNIT_ALIASES: Record<string, string> = {
  cups: "cup",
  cup: "cup",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  grams: "g",
  gram: "g",
  g: "g",
  kilograms: "kg",
  kilogram: "kg",
  kg: "kg",
  ml: "ml",
  millilitres: "ml",
  milliliters: "ml",
  litres: "l",
  liters: "l",
  l: "l",
};

export function normalizeIngredientName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function parseMeasure(measure: string): ParsedMeasure | null {
  const normalized = measure.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  const [amount, maybeFraction, maybeUnit] = normalized.split(/\s+/);
  const mixedFraction = FRACTIONS[maybeFraction];
  const wholeNumber = Number(amount);

  if (Number.isFinite(wholeNumber) && mixedFraction !== undefined && maybeUnit) {
    return {
      quantity: wholeNumber + mixedFraction,
      unit: UNIT_ALIASES[maybeUnit] ?? maybeUnit,
    };
  }

  const quantity = FRACTIONS[amount] ?? Number(amount);
  const unit = maybeFraction;

  if (!Number.isFinite(quantity) || !unit) {
    return null;
  }

  return {
    quantity,
    unit: UNIT_ALIASES[unit] ?? unit,
  };
}

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : String(Number(quantity.toFixed(2)));
}

function createShoppingListRecipe(recipe: Recipe): ShoppingListRecipe {
  return {
    title: recipe.title,
    instructions: recipe.instructions,
    youtubeUrl: recipe.youtubeUrl,
    sourceUrl: recipe.sourceUrl,
  };
}

function mergeSourceRecipes(
  currentRecipes: ShoppingListRecipe[] = [],
  nextRecipes: ShoppingListRecipe[] = [],
): ShoppingListRecipe[] | undefined {
  const byTitle = new Map<string, ShoppingListRecipe>();

  for (const recipe of [...currentRecipes, ...nextRecipes]) {
    byTitle.set(normalizeIngredientName(recipe.title), recipe);
  }

  const sourceRecipes = Array.from(byTitle.values());

  return sourceRecipes.length > 0 ? sourceRecipes : undefined;
}

function createShoppingListItem(ingredient: RecipeIngredient, recipe: Recipe): ShoppingListItem {
  const key = normalizeIngredientName(ingredient.name);
  const parsedMeasure = parseMeasure(ingredient.measure);
  const sourceRecipe = createShoppingListRecipe(recipe);

  return {
    key,
    name: ingredient.name.trim(),
    measures: ingredient.measure ? [ingredient.measure] : [],
    quantity: parsedMeasure?.quantity,
    unit: parsedMeasure?.unit,
    sourceMeals: [recipe.title],
    sourceRecipes: [sourceRecipe],
  };
}

function mergeMeasures(current: ShoppingListItem, next: ShoppingListItem): ShoppingListItem {
  const sourceMeals = Array.from(new Set([...current.sourceMeals, ...next.sourceMeals]));
  const sourceRecipes = mergeSourceRecipes(current.sourceRecipes, next.sourceRecipes);
  const recipeMetadata = sourceRecipes ? { sourceRecipes } : {};

  if (
    current.quantity !== undefined &&
    next.quantity !== undefined &&
    current.unit &&
    current.unit === next.unit
  ) {
    const quantity = current.quantity + next.quantity;

    return {
      ...current,
      quantity,
      measures: [`${formatQuantity(quantity)} ${current.unit}`],
      sourceMeals,
      ...recipeMetadata,
    };
  }

  return {
    ...current,
    measures: Array.from(new Set([...current.measures, ...next.measures])).filter(Boolean),
    sourceMeals,
    ...recipeMetadata,
  };
}

export function mergeShoppingListItems(items: ShoppingListItem[]): ShoppingListItem[] {
  const byIngredient = new Map<string, ShoppingListItem>();

  for (const item of items) {
    const existing = byIngredient.get(item.key);
    byIngredient.set(item.key, existing ? mergeMeasures(existing, item) : item);
  }

  return Array.from(byIngredient.values()).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

export function addRecipeToShoppingList(
  currentItems: ShoppingListItem[],
  recipe: Recipe,
): ShoppingListItem[] {
  const newItems = recipe.ingredients.map((ingredient) => createShoppingListItem(ingredient, recipe));

  return mergeShoppingListItems([...currentItems, ...newItems]);
}

export function serializeShoppingList(items: ShoppingListItem[]): string {
  return JSON.stringify(items);
}

export function parseStoredShoppingList(value: string | null): ShoppingListItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is ShoppingListItem => {
        return (
          typeof item?.key === "string" &&
          typeof item?.name === "string" &&
          Array.isArray(item?.measures) &&
          Array.isArray(item?.sourceMeals)
        );
      })
      .map((item) => {
        const sourceRecipes = Array.isArray(item.sourceRecipes)
          ? item.sourceRecipes
              .filter((recipe): recipe is ShoppingListRecipe => {
                return (
                  typeof recipe?.title === "string" && typeof recipe?.instructions === "string"
                );
              })
              .map((recipe) => ({
                title: recipe.title,
                instructions: recipe.instructions,
                youtubeUrl:
                  typeof recipe.youtubeUrl === "string" ? recipe.youtubeUrl : undefined,
                sourceUrl: typeof recipe.sourceUrl === "string" ? recipe.sourceUrl : undefined,
              }))
          : undefined;

        if (sourceRecipes && sourceRecipes.length > 0) {
          return { ...item, sourceRecipes };
        }

        return {
          key: item.key,
          name: item.name,
          measures: item.measures,
          quantity: item.quantity,
          unit: item.unit,
          sourceMeals: item.sourceMeals,
        };
      });
  } catch {
    return [];
  }
}
