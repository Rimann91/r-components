# Session Handoff — 002

**Date**: 2026-04-10  
**Session scope**: Bug fixes, toast component, layout components, doc site shell, `.ai/` system

---

## What was accomplished

### Bug fixes (carried over from previous work)
- **Spinner animation**: `--spinner-speed` used `--transition-slow` (which includes easing) inside `animation:` → two easing values → browser dropped the rule. Renamed to `--spinner-duration: 800ms` (bare duration). Doc updated.
- **Modal footer always hidden**: `.modal-footer:not(:has(slot[name="footer"] > *))` CSS selector doesn't work across shadow DOM — slotted nodes live in light DOM. Removed the CSS rule, added `slotchange` listener using `footerSlot.assignedElements()` to toggle `display`.
- **Toast animation**: Same animation/easing bug as spinner. Fixed with `--toast-duration: 250ms`.
- **`r-container` invisible**: Custom elements default to `display: inline` — container had no explicit display, rendering as empty inline box. Fixed with `this.style.display = 'block'` in `_apply()`.

### New component: `r-toast` (`src/primitives/toast.js`)
- Static `RToast.show({ message, variant, duration })` API
- Auto-creates `#r-toast-container` in `document.body`
- Variants: `info`, `success`, `warning`, `danger`
- Slide-in/out animation, auto-dismiss, manual ✕ button
- Added fallback `setTimeout` in `_dismiss()` in case `animationend` misfires
- Named export: `export { RToast }`

### Layout components (`src/layout/`)
- `r-stack` — vertical flex column, `gap` + `align` attrs
- `r-cluster` — horizontal flex row (wrapping), `gap` + `align` + `justify` attrs
- `r-grid` — CSS Grid, fixed columns / raw template / responsive auto-fill via `min-col-width`
- `r-container` — max-width centering wrapper, `size` attr (`sm/md/lg/xl/2xl/full`)
- All four: no shadow DOM, styles applied to host element directly

### Doc site shell (`index.html` refactor)
- `index.html` rewritten as persistent shell: 220px sidebar + full-height `<iframe name="content">`
- All nav links use `target="content"`
- Active link highlighted on iframe load via `contentWindow.location.pathname`
- `doc/home.html` created as default iframe landing page
- HOME links removed from all 22 doc pages (navigation now in sidebar)

### New semantic tokens added (`styles/gruvbox_dark_colors.css`)
- `--color-fg-secondary`, `--color-fg-muted`
- `--color-bg-hover`, `--color-bg-active`
- Added to both light mode `:root` and dark mode `@media` block

### `.ai/` inter-session context system
- `README.md` — maintenance contract: when/how to update each file, ADR format, handoff format
- `context.md` — full project brief (already included `r-toast` and layout components)
- `decisions.md` — 16 ADRs covering all major decisions
- `handoffs/001-initial-build.md` — full history prior to this session
- `prompts/boot.md` — reusable boot prompt, updated to include `README.md` as first read

---

## Current state

All 45 todos done. No known open bugs.

### Complete component inventory
**Primitives**: Alert, Badge, Button, Card, Checkbox, Collapse, Divider, Heading, Input Date, Input Datetime, Input Money, Input Number, Input Text, Modal, Radio, Select, Spinner, Switch, Text, Toast, Tooltip

**Layout**: Stack, Cluster, Grid, Container

---

## Next session starting points

- `r-split`: two-column sidebar + main layout component (natural next layout component)
- Navigation composites: Tabs, Breadcrumb, Pagination
- Input variants: Search input (with clear), Phone input, Time-only input
- Composites: `r-table` (data table) — would live in `src/composites/`, use `r-checkbox`, `r-button`, `r-select`

---

## Key files touched this session

| File | What changed |
|---|---|
| `src/primitives/spinner.js` | Fixed animation bug: `--spinner-duration: 800ms` |
| `src/primitives/modal.js` | Fixed footer: slotchange event replaces broken `:has()` CSS |
| `src/primitives/toast.js` | New component |
| `src/layout/stack.js` | New component |
| `src/layout/cluster.js` | New component |
| `src/layout/grid.js` | New component |
| `src/layout/container.js` | New component |
| `doc/doc.js` | Added toast + all 4 layout imports |
| `doc/home.html` | New landing page |
| `doc/toast.html` | New doc page |
| `doc/stack.html` | New doc page |
| `doc/cluster.html` | New doc page |
| `doc/grid.html` | New doc page |
| `doc/container.html` | New doc page |
| `index.html` | Full rewrite: sidebar+iframe shell |
| `styles/gruvbox_dark_colors.css` | Added 4 semantic tokens |
| `.ai/README.md` | New — maintenance contract |
| `.ai/context.md` | New |
| `.ai/decisions.md` | New — 16 ADRs including ADR-016 for this system |
| `.ai/prompts/boot.md` | New |
| `.ai/handoffs/001-initial-build.md` | New |
| `.gitignore` | New |
