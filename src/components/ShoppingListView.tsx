"use client";

import { useMemo, useState } from "react";
import type { ShoppingListItem } from "@/types/recipes";

type ShoppingListViewProps = {
  items: ShoppingListItem[];
  onClearList: () => void;
  onBackToSearch: () => void;
};

const ALL_SOURCES = "all";

export function ShoppingListView({ items, onClearList, onBackToSearch }: ShoppingListViewProps) {
  const [selectedSource, setSelectedSource] = useState(ALL_SOURCES);

  const sourceMeals = useMemo(() => {
    return Array.from(new Set(items.flatMap((item) => item.sourceMeals))).sort((left, right) =>
      left.localeCompare(right),
    );
  }, [items]);

  const activeSource =
    selectedSource === ALL_SOURCES || sourceMeals.includes(selectedSource)
      ? selectedSource
      : ALL_SOURCES;

  const filteredItems = useMemo(() => {
    if (activeSource === ALL_SOURCES) {
      return items;
    }

    return items.filter((item) => item.sourceMeals.includes(activeSource));
  }, [activeSource, items]);

  const listSummary =
    activeSource === ALL_SOURCES
      ? `${items.length} ingredient${items.length === 1 ? "" : "s"} from ${
          sourceMeals.length
        } recipe${sourceMeals.length === 1 ? "" : "s"}`
      : `${filteredItems.length} ingredient${filteredItems.length === 1 ? "" : "s"} from ${activeSource}`;

  function getSourceCount(sourceMeal: string) {
    return items.filter((item) => item.sourceMeals.includes(sourceMeal)).length;
  }

  return (
    <section className="shopping-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Local shopping list</p>
          <h1>Ingredients to buy</h1>
          {items.length > 0 ? <p className="shopping-summary">{listSummary}</p> : null}
        </div>
        <div className="section-actions">
          <button type="button" onClick={onBackToSearch}>
            back to search
          </button>
          <button type="button" onClick={onClearList} disabled={items.length === 0}>
            clear list
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Your shopping list is empty.</h2>
          <p>Search for a recipe or try surprise me, then add ingredients from the recipe detail.</p>
        </div>
      ) : (
        <>
          {sourceMeals.length > 1 ? (
            <div
              className="shopping-tools"
              role="group"
              aria-labelledby="shopping-filter-label"
            >
              <span className="shopping-filter-label" id="shopping-filter-label">
                show ingredients from
              </span>
              <div className="source-filters">
                <button
                  className={activeSource === ALL_SOURCES ? "filter-chip active" : "filter-chip"}
                  type="button"
                  aria-pressed={activeSource === ALL_SOURCES}
                  onClick={() => setSelectedSource(ALL_SOURCES)}
                >
                  all
                  <span>{items.length}</span>
                </button>
                {sourceMeals.map((sourceMeal) => (
                  <button
                    className={activeSource === sourceMeal ? "filter-chip active" : "filter-chip"}
                    type="button"
                    aria-pressed={activeSource === sourceMeal}
                    key={sourceMeal}
                    onClick={() => setSelectedSource(sourceMeal)}
                  >
                    {sourceMeal}
                    <span>{getSourceCount(sourceMeal)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <ul className="shopping-list">
            {filteredItems.map((item) => (
              <li key={item.key}>
                <div>
                  <strong>{item.name}</strong>
                  <span className="source-chips" aria-label={`From ${item.sourceMeals.join(", ")}`}>
                    {item.sourceMeals.map((sourceMeal) => (
                      <span className="source-chip" key={sourceMeal}>
                        {sourceMeal}
                      </span>
                    ))}
                  </span>
                </div>
                <p>{item.measures.length > 0 ? item.measures.join(" + ") : "As needed"}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
