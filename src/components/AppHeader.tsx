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
          aria-current={currentView === "search" ? "page" : undefined}
        >
          search
        </button>
        <button
          className="nav-button"
          type="button"
          onClick={onSurpriseMe}
          disabled={isLoadingSurprise}
          aria-busy={isLoadingSurprise || undefined}
        >
          {isLoadingSurprise ? "finding..." : "surprise me"}
        </button>
        <button
          className={currentView === "shopping-list" ? "nav-button active" : "nav-button"}
          type="button"
          onClick={onShowShoppingList}
          aria-current={currentView === "shopping-list" ? "page" : undefined}
          aria-label={
            shoppingListCount > 0
              ? `view my shopping list, ${shoppingListCount} items`
              : "view my shopping list"
          }
        >
          view my shopping list
          {shoppingListCount > 0 ? (
            <span className="nav-count" aria-hidden="true">
              {shoppingListCount}
            </span>
          ) : null}
        </button>
      </nav>
    </header>
  );
}
