type AppHeaderProps = {
  currentView: "search" | "shopping-list";
  isLoadingSurprise: boolean;
  shoppingListCount: number;
  onShowSearch: () => void;
  onShowShoppingList: () => void;
  onSurpriseMe: () => void;
};

export function AppHeader({
  currentView,
  isLoadingSurprise,
  shoppingListCount,
  onShowSearch,
  onShowShoppingList,
  onSurpriseMe,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="brand" type="button" onClick={onShowSearch} aria-label="Go to search">
        <span className="brand-mark">RP</span>
        <span>
          <strong>Recipe Planner</strong>
          <small>Search, save, shop</small>
        </span>
      </button>
      <nav className="header-actions" aria-label="Primary navigation">
        <button
          className={currentView === "search" ? "nav-button active" : "nav-button"}
          type="button"
          onClick={onShowSearch}
        >
          search
        </button>
        <button
          className="nav-button"
          type="button"
          onClick={onSurpriseMe}
          disabled={isLoadingSurprise}
        >
          {isLoadingSurprise ? "finding..." : "surprise me"}
        </button>
        <button
          className={currentView === "shopping-list" ? "nav-button active" : "nav-button"}
          type="button"
          onClick={onShowShoppingList}
        >
          view my shopping list
          {shoppingListCount > 0 ? <span className="nav-count">{shoppingListCount}</span> : null}
        </button>
      </nav>
    </header>
  );
}
