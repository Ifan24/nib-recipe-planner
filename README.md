# Recipe Planner

A small Next.js app for searching recipes with [TheMealDB](https://www.themealdb.com/) and building a local shopping list from selected meals.

Live app: [https://nib-recipe-planner.vercel.app/](https://nib-recipe-planner.vercel.app/)

## Features

- Search recipes by pressing Enter in the search box
- Display recipe results in a responsive grid
- Browse longer result sets with a load-more control
- View recipe details in a modal panel
- Add recipe ingredients to a shopping list stored in `localStorage`
- View the shopping list from anywhere in the app
- Tick off shopping-list items while keeping the list available between visits
- Merge matching ingredients when quantities and units can be safely combined
- Preserve ambiguous measures instead of showing misleading totals
- Fetch a random recipe with `surprise me`

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm lint
pnpm test
pnpm build
```

## Technical Notes

- The app uses Next.js App Router, React, and TypeScript.
- TheMealDB responses are mapped into a smaller app-level `Recipe` type before rendering.
- Ingredient extraction iterates through `strIngredient1..20` and `strMeasure1..20`.
- Shopping-list data and checked-item state are versioned under separate `localStorage` keys.
- Measures are only added together when they have compatible parsed units. For free-text or incompatible measures, the app keeps the original measure text.

## Tradeoffs

TheMealDB measure fields are semi-structured, so full unit conversion is intentionally out of scope. The app combines safe cases such as `1 cup + 2 cups`, but keeps values like `to taste` or incompatible units as separate notes.

## Deploy on Vercel

This project uses the default Next.js setup and can be deployed directly to Vercel. No API key is required for the public TheMealDB endpoints.
