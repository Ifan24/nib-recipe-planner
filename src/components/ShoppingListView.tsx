import type { ShoppingListItem } from "@/types/recipes";

type ShoppingListViewProps = {
  items: ShoppingListItem[];
  onClearList: () => void;
  onBackToSearch: () => void;
};

export function ShoppingListView({ items, onClearList, onBackToSearch }: ShoppingListViewProps) {
  return (
    <section className="shopping-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Local shopping list</p>
          <h1>Ingredients to buy</h1>
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
        <ul className="shopping-list">
          {items.map((item) => (
            <li key={item.key}>
              <div>
                <strong>{item.name}</strong>
                <span>From {item.sourceMeals.join(", ")}</span>
              </div>
              <p>{item.measures.length > 0 ? item.measures.join(" + ") : "As needed"}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
