# AGENTS.md

## Project

Recipe Search & Meal Planner take-home assessment.

Build an app that searches recipes via a public API and allows users to build a shopping list, with good user experience to find and navigate through recipes.

## Core Requirements

### Recipe Search & Display

- Search recipes using TheMealDB API.
- Provide a search box for the user to input a search term.
- When the user presses Enter, display matching results in a grid.
- Each result must show:
  - image from `strMealThumb`
  - title from `strMeal`
  - category
  - area
- Clicking a result must show detailed recipe information in a modal or popup panel.
- Recipe detail must include:
  - ingredients
  - instructions
  - YouTube link when available
  - source link when available

### Shopping List Builder

- On the detailed recipe view, add a button with the text `add to my shopping list`.
- When clicked, iterate through the ingredient and measure fields and save the items to local storage.
- On all pages in the app, include a button with the text `view my shopping list`.
- When clicked, list all ingredients in alphabetical order, with measures as extracted from local storage.
- If more than one meal has been added and the same ingredient appears in both, combine them into one shopping-list item with the total amount to be bought when safe to do so.

### Navigation

- Provide easy navigation to:
  - search
  - shopping list
  - surprise me
- When `surprise me` is clicked, fetch a random recipe from `https://www.themealdb.com/api/json/v1/1/random.php` and show it in the recipe modal or popup panel.

## API Examples

- `https://www.themealdb.com/api/json/v1/1/search.php?s=beef`
- `https://www.themealdb.com/api/json/v1/1/search.php?s=pudding`
- `https://www.themealdb.com/api/json/v1/1/random.php`

## Technical Preferences

- Use TypeScript and React.
- Next.js is preferred for this implementation.
- Keep the app easy to clone and run locally.
- Keep code structured so API access, recipe parsing, shopping-list storage, and UI components can be discussed independently.
- Before UI work, read `.codex/skills/nib-recipe-ui/SKILL.md` and follow its design direction.

## Working Rules

- Do not include private email content, recruiter names, calendar or meeting details, access codes, or private assessment documents in this repository.
- Keep commit messages in conventional commit style.
- Keep commits logical and reviewable. Do not combine setup, domain logic, UI, tests, and docs in one commit.
- Use `pnpm`.
- Before finishing meaningful changes, run:
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
