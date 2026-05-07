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

  return parseStoredShoppingList(window.localStorage.getItem(SHOPPING_LIST_STORAGE_KEY));
}

export function writeShoppingList(items: ShoppingListItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, serializeShoppingList(items));
}

export function clearShoppingList(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SHOPPING_LIST_STORAGE_KEY);
}
