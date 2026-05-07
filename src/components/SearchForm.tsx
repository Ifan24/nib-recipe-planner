import type { FormEvent } from "react";
import { Search } from "lucide-react";

type SearchFormProps = {
  query: string;
  isSearching: boolean;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
};

export function SearchForm({ query, isSearching, onQueryChange, onSearch }: SearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="recipe-search">Search recipes</label>
      <div className="search-row">
        <input
          id="recipe-search"
          name="recipe-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search beef, pudding, chicken..."
          autoComplete="off"
        />
        <button type="submit" disabled={isSearching}>
          <Search aria-hidden="true" />
          {isSearching ? "searching" : "search"}
        </button>
      </div>
    </form>
  );
}
