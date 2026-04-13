# Session Handoff — 004

**Date**: 2026-04-13  
**Session scope**: `r-button` ghost variant + `r-card` doc page fix

---

## What was accomplished

### New variant: `ghost` on `r-button`
- Added `--button-bg-ghost: transparent` to `:host` vars in `src/primitives/button.js`
- Added `[ghost]` CSS rules: transparent background, `--color-gray-300` border, `--color-fg-primary` text, hover uses `--color-bg-hover`
- Behaviour: identical to `tertiary` except background is always transparent (does not fill with `--color-bg-primary`)
- Updated `doc/button.html`: added `<r-button ghost>Ghost</r-button>` to the demo row and ghost to the attributes list

### Doc fix: `doc/card.html` — full rewrite
Existing page had multiple bugs and was critically incomplete:

**Bugs fixed:**
- Wrong closing tag in code example: `</r-button>` → `</r-card>`
- Broken custom element typo: `<r-tet>` / `</r-tet>` replaced
- Wrong CSS variable name: `--card-color-bg` (does not exist) → `--card-bg`

**Content added:**
- 3 live examples with code snippets: basic with title, with `header-slot-right` action, header hidden via `slot="header"`
- Full **Attributes** section (`title`)
- Full **Slots** section (all 4 slots: `default`, `header-slot-right`, `slot-left`, `header`)
- Full **CSS Variables** section (all 7 `--card-*` vars with default values and descriptions)

---

## Bugs fixed

- `doc/card.html` `</r-button>` closing tag typo → `</r-card>`
- `doc/card.html` `<r-tet>` broken element typo → removed
- `doc/card.html` `--card-color-bg` wrong var name → `--card-bg`

---

## Current state

All work complete. No known open issues.

---

## Next session starting points

From handoff 003 suggestions (still open):
- Navigation composites: Tabs, Breadcrumb, Pagination
- Input variants: Search input (with clear button), Phone input, Time-only input
- `r-table` composite (`src/composites/`) — data table using `r-checkbox`, `r-button`, `r-select`

---

## Key files touched

| File | What changed |
|---|---|
| `src/primitives/button.js` | Added `ghost` variant styles and `--button-bg-ghost` `:host` var |
| `doc/button.html` | Added ghost to demo row and attributes list |
| `doc/card.html` | Full rewrite — fixed bugs, added examples, slots, attributes, and CSS vars |
| `.ai/handoffs/004-ghost-button-card-docs.md` | This file |
