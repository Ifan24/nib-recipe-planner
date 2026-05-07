---
name: nib-recipe-ui
description: Repo-local UI direction for the Recipe Search & Meal Planner assessment.
---

# nib Recipe UI

Use this skill before UI work on the Recipe Search & Meal Planner app.

## Design Goal

Create a polished consumer web app that feels optimistic, clear, trustworthy, and designed by a human product designer.

The visual direction is nib-inspired, not a nib clone. Borrow the public brand feeling and accessibility discipline, but do not use nib logos, copied assets, private material, or text that implies this app is an official nib product.

## Research Anchors

- nib public site: green-led header, warm cream surfaces, large friendly headings, simple pill CTAs, direct service copy.
- nib brand guidance: True Green `#144A38`, Bright Green `#82E578`, Clear White `#FFFFFF`, Sage `#C2D6B5`, Warm White `#F5F0D6`, optimistic and natural imagery.
- nib link guidance: accessible links should remain visibly link-like, with clear underline or strong affordance.
- Variant community reference: high-polish visual gallery, confident black/white contrast, large image tiles, floating composer energy. Use this only as inspiration for craft and density, not as a direct visual copy.

## Visual Rules

- Lead with real recipe imagery from TheMealDB. Do not generate a hero asset for v1.
- Use recipe photos as the main visual texture; keep brand color as structure and emphasis.
- Avoid AI-looking patterns: purple gradients, glow blobs, emoji icons, fake stats, filler icon rows, generic bento grids, and oversized rounded card piles.
- Do not use the nib logo or official nib marks.
- Do not make the app look like a marketing landing page only. The first screen must be the usable recipe search experience.
- Cards and panels should use an 8px radius unless a native control needs a pill shape.
- Use pill buttons for primary actions.
- Keep hover and focus states visible, smooth, and layout-stable.
- Keep all text readable on mobile and desktop. No negative letter spacing.

## Design Tokens

Use these as the starting palette:

- True Green: `#144A38`
- Bright Green: `#82E578`
- Warm White: `#F5F0D6`
- Sage: `#C2D6B5`
- Clear White: `#FFFFFF`
- Ink: `#1F2A24`
- Muted Ink: `#5D665F`
- Food Accent: use sparingly from actual recipe imagery, not as a dominant invented palette.

Typography:

- Prefer a friendly, sturdy sans-serif or bundled Next font if avoiding extra font dependency.
- Headings should be bold and warm, not sterile enterprise SaaS.
- Body and control text should feel service-oriented and readable.

Motion:

- Use subtle 150-250ms transitions for hover, focus, modal entry, and loading states.
- Respect `prefers-reduced-motion`.

## Required UI Behaviors

- Search input must be obvious and reachable immediately.
- Results must render as a responsive gallery with image, title, category, and area.
- Recipe detail must open in a keyboard-friendly modal or panel.
- Shopping-list navigation must always be available.
- Empty, loading, and error states must be intentionally designed.
- Links to YouTube and source must look like links or clearly interactive controls.
- Mobile layout must remain usable at 375px.

## Verification Checklist

- No private assessment or recruiter material appears in UI, docs, or comments.
- No console warnings.
- Keyboard can reach search, result cards, modal close, add-to-list, and shopping-list actions.
- Search `beef`, open a recipe, add it, view shopping list, and use `surprise me`.
- Check desktop and mobile in the browser.
- Check that the page feels recipe-image-led, nib-inspired, and not AI-generated.
