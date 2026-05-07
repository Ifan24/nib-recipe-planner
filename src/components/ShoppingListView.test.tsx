import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShoppingListView } from "./ShoppingListView";
import type { ShoppingListItem } from "@/types/recipes";

const shoppingListItems: ShoppingListItem[] = [
  {
    key: "basil",
    name: "Basil",
    measures: ["Handful"],
    sourceMeals: ["Beef pho"],
    sourceRecipes: [{ title: "Beef pho", instructions: "Simmer the broth." }],
  },
  {
    key: "onion",
    name: "Onion",
    measures: ["1 large"],
    sourceMeals: ["Soup"],
    sourceRecipes: [{ title: "Soup", instructions: "Cook until tender." }],
  },
];

describe("ShoppingListView", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lets users tick shopping-list items without removing them", () => {
    render(
      <ShoppingListView
        items={shoppingListItems}
        onBackToSearch={vi.fn()}
        onClearList={vi.fn()}
        onFindRecipeInstructions={vi.fn(async () => null)}
      />,
    );

    const summary = screen.getByRole("status", {
      name: "2 ingredients from 2 recipes · 2 to buy",
    });

    expect(within(summary).getByText("total")).toBeInTheDocument();
    expect(within(summary).getByText("to buy")).toBeInTheDocument();
    expect(within(summary).getByText("checked")).toBeInTheDocument();

    const basilCheckbox = screen.getByRole("checkbox", { name: "Mark Basil as bought" });

    expect(screen.getByText("recipe instructions")).toBeInTheDocument();
    expect(screen.getAllByText("view instructions")).toHaveLength(2);

    fireEvent.click(basilCheckbox);

    expect(basilCheckbox).toBeChecked();
    expect(
      screen.getByRole("status", {
        name: "2 ingredients from 2 recipes · 1 to buy, 1 checked",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Basil")).toBeInTheDocument();
    expect(screen.getByText("ready to cook")).toBeInTheDocument();
    expect(screen.getByText("Simmer the broth.")).toBeInTheDocument();
  });
});
