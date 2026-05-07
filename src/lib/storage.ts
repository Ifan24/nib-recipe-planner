import type { ShoppingListItem } from "@/types/recipes";
import {
  parseStoredShoppingList,
  serializeShoppingList,
  SHOPPING_LIST_STORAGE_KEY,
} from "./shopping-list";

export function readShoppingList(): ShoppingListItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return parseStoredShoppingList(window.localStorage.getItem(SHOPPING_LIST_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function writeShoppingList(items: ShoppingListItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, serializeShoppingList(items));
  } catch {
    // Ignore storage failures in private browsing or quota-limited environments.
  }
}

export function clearShoppingList(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(SHOPPING_LIST_STORAGE_KEY);
  } catch {
    // Ignore storage failures in private browsing or quota-limited environments.
  }
}
