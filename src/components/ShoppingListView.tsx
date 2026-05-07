"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ShoppingListItem } from "@/types/recipes";

type ShoppingListViewProps = {
  items: ShoppingListItem[];
  onClearList: () => void;
  onBackToSearch: () => void;
};

const ALL_SOURCES = "all";
const CHECKED_ITEMS_STORAGE_KEY = "recipe-planner-checked-shopping-items-v1";

function readCheckedItemKeys(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const storedValue = window.localStorage.getItem(CHECKED_ITEMS_STORAGE_KEY);
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? new Set(parsedValue.filter((item): item is string => typeof item === "string"))
      : new Set();
  } catch {
    return new Set();
  }
}

function writeCheckedItemKeys(itemKeys: Set<string>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CHECKED_ITEMS_STORAGE_KEY, JSON.stringify(Array.from(itemKeys)));
  } catch {
    // Ignore storage failures in private browsing or quota-limited environments.
  }
}

function clearCheckedItemKeys(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(CHECKED_ITEMS_STORAGE_KEY);
  } catch {
    // Ignore storage failures in private browsing or quota-limited environments.
  }
}

export function ShoppingListView({ items, onClearList, onBackToSearch }: ShoppingListViewProps) {
  const [selectedSource, setSelectedSource] = useState(ALL_SOURCES);
  const [checkedItemKeys, setCheckedItemKeys] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setCheckedItemKeys(readCheckedItemKeys());
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

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
  const checkedVisibleItemCount = filteredItems.filter((item) =>
    checkedItemKeys.has(item.key),
  ).length;
  const remainingVisibleItemCount = filteredItems.length - checkedVisibleItemCount;
  const visibleProgressPercent =
    filteredItems.length > 0
      ? Math.round((checkedVisibleItemCount / filteredItems.length) * 100)
      : 0;
  const checklistSummary =
    items.length > 0
      ? `${listSummary} · ${remainingVisibleItemCount} to buy${
          checkedVisibleItemCount > 0 ? `, ${checkedVisibleItemCount} checked` : ""
        }`
      : "";

  const handleToggleItem = useCallback((itemKey: string) => {
    setCheckedItemKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);

      if (nextKeys.has(itemKey)) {
        nextKeys.delete(itemKey);
      } else {
        nextKeys.add(itemKey);
      }

      writeCheckedItemKeys(nextKeys);
      return nextKeys;
    });
  }, []);

  function handleClearList() {
    clearCheckedItemKeys();
    setCheckedItemKeys(new Set());
    onClearList();
  }

  function getSourceCount(sourceMeal: string) {
    return items.filter((item) => item.sourceMeals.includes(sourceMeal)).length;
  }

  return (
    <section className="shopping-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Local shopping list</p>
          <h1>Ingredients to buy</h1>
          {items.length > 0 ? (
            <div
              className="shopping-summary"
              role="status"
              aria-live="polite"
              aria-label={checklistSummary}
            >
              <dl className="shopping-summary-metrics">
                <div className="summary-metric">
                  <dt>total</dt>
                  <dd>{filteredItems.length}</dd>
                  <span>
                    {activeSource === ALL_SOURCES ? `${sourceMeals.length} recipes` : "filtered"}
                  </span>
                </div>
                <div className="summary-metric">
                  <dt>to buy</dt>
                  <dd>{remainingVisibleItemCount}</dd>
                  <span>left in list</span>
                </div>
                <div className="summary-metric summary-metric-done">
                  <dt>checked</dt>
                  <dd>{checkedVisibleItemCount}</dd>
                  <span>{visibleProgressPercent}% done</span>
                </div>
              </dl>
              <div className="shopping-progress" aria-hidden="true">
                <span style={{ width: `${visibleProgressPercent}%` }} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="section-actions">
          <button type="button" onClick={onBackToSearch}>
            <ArrowLeft aria-hidden="true" />
            back to search
          </button>
          <button type="button" onClick={handleClearList} disabled={items.length === 0}>
            <Trash2 aria-hidden="true" />
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
            {filteredItems.map((item) => {
              const isChecked = checkedItemKeys.has(item.key);

              return (
                <li className={isChecked ? "checked" : undefined} key={item.key}>
                  <label className="shopping-check">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleItem(item.key)}
                      aria-label={`Mark ${item.name} as bought`}
                    />
                    <span className="shopping-checkmark" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12.5l4.2 4.2L19 7" />
                      </svg>
                    </span>
                    <span className="shopping-item-text">
                      <strong>{item.name}</strong>
                      <span
                        className="source-chips"
                        aria-label={`From ${item.sourceMeals.join(", ")}`}
                      >
                        {item.sourceMeals.map((sourceMeal) => (
                          <span className="source-chip" key={sourceMeal}>
                            {sourceMeal}
                          </span>
                        ))}
                      </span>
                    </span>
                  </label>
                  <p>{item.measures.length > 0 ? item.measures.join(" + ") : "As needed"}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
