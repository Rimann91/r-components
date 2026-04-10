# Session Handoff — 001

**Date**: 2026-04-10  
**Session scope**: Initial build through layout components + doc site shell

---

## What was accomplished

### Phase 0 — Token foundation
- Expanded `styles/gruvbox_dark_colors.css` with full token set:
  - Spacing scale (`--space-1` through `--space-12`, 4px base)
  - Typography scale (`--text-xs` through `--text-4xl`)
  - `--radius: 4px` global border radius
  - Transitions (`--transition-fast/base/slow`)
  - Focus ring (`--focus-ring`, `--color-focus`)
  - Z-index scale (`--z-dropdown`, `--z-modal`, `--z-toast`)
  - Shadows (`--shadow-sm/base/lg`)
  - Semantic tokens: `--color-bg-hover`, `--color-bg-active`, `--color-fg-secondary`, `--color-fg-muted`

### Phase 1 — Existing component bug fixes
- Fixed `r-button` CSS var typos
- Fixed `r-divider` ARIA role typo (`seperator` → `separator`)
- Removed stray `console.log` from `r-collapse`
- Fixed `width-device-width` viewport typo across all pages
- Fixed root `index.html` inverted `<html>/<head>` tags and bad asset paths
- Added Vite dev server (`npm run dev`)

### Phase 2 — Component refactor
- All existing components refactored to `:host` variable convention

### Phase 3 — Doc site
- Built `doc/doc.js` as shared import module
- Created missing doc pages (collapse, divider, input-text, etc.)
- Refactored all doc pages to use `doc.js`

### Phase 4 — Primitives built
All components below are complete with doc pages:
- `r-badge` (pill-shaped, filled)
- `r-spinner` (CSS animation)
- `r-alert` (dismissible)
- `r-select` (native select wrapper, MutationObserver options)
- `r-checkbox`
- `r-radio` (cross-shadow-DOM grouping fix)
- `r-switch`
- `r-tooltip` (pure CSS, 4 positions)
- `r-modal` (native `<dialog>`, footer via `slotchange`)
- `r-toast` (static `RToast.show()` API, slide animation)
- `r-input-number` (± buttons, min/max/step)
- `r-input-money` (currency prefix, 2dp format)
- `r-input-date` (calendar popup)
- `r-input-datetime` (calendar + time + confirm)

### Phase 5 — Layout components (`src/layout/`)
- `r-stack`, `r-cluster`, `r-grid`, `r-container`
- No shadow DOM — styles applied directly to host

### Phase 6 — Doc site shell
- `index.html` refactored to persistent sidebar + iframe shell
- `doc/home.html` created as default landing page
- HOME links removed from all doc pages
- Active link highlighting in sidebar

### Bugs fixed along the way
- Spinner animation: `--spinner-speed` used `transition` shorthand in `animation:` → broke animation. Fixed with bare `--spinner-duration: 800ms`
- Toast animation: same issue with `--toast-duration`
- Modal footer: `:has(slot > *)` CSS doesn't work across shadow DOM → fixed with `slotchange` event
- `r-container`: custom elements default to `display: inline` → fixed with explicit `display: block`
- Radio unselect: native radio grouping broken across shadow roots → fixed with `_uncheckSiblings()`

---

## Current state

All 45 todos done. No known outstanding bugs.

### Complete component list
Primitives: Alert, Badge, Button, Card, Checkbox, Collapse, Divider, Input Date, Input Datetime, Input Money, Input Number, Input Text, Modal, Radio, Select, Spinner, Switch, Toast, Tooltip, Heading, Text

Layout: Stack, Cluster, Grid, Container

---

## Next session starting points

### Likely next work (not yet planned)
1. **Composites**: Data table (`r-table`) — would live in `src/composites/`, built from `r-checkbox`, `r-button`, `r-select`
2. **More inputs**: Time-only input, phone input, search input with clear button
3. **Navigation components**: Tabs, breadcrumb, pagination
4. **`r-split`**: Two-column layout (sidebar + main) for the layout tier

### Things to watch
- `--transition-*` tokens include easing. Never use in `animation:` shorthand — always use a dedicated bare duration token
- Custom elements default to `display: inline` — always set `display: block` or `display: flex` etc. explicitly
- `r-select` MutationObserver must be disconnected in `disconnectedCallback()` (verify this is done)

---

## Key files

| File | Purpose |
|---|---|
| `styles/gruvbox_dark_colors.css` | All design tokens — the single source of truth |
| `doc/doc.js` | Import registry — add every new component here |
| `index.html` | Doc site shell — add nav link for every new component |
| `.ai/context.md` | Project brief for new AI sessions |
| `.ai/decisions.md` | All ADRs |
| `.ai/prompts/boot.md` | Boot prompt for new sessions |
