# Architecture Decision Records

Each ADR documents a significant technical or design decision, why it was made, and what alternatives were considered.

---

## ADR-001 — Zero-dependency vanilla JS web components

**Status**: Accepted  
**Date**: Project start

**Decision**: All components are built with vanilla JS, Custom Elements v1, and Shadow DOM. No frameworks, no build pipeline for component code.

**Reasoning**: Maximum portability. The components can be dropped into any project regardless of framework. Shadow DOM provides style encapsulation without any tooling. Keeping zero dependencies means no version conflicts for consumers.

**Alternatives considered**: Lit (too opinionated for a learning/personal project), Stencil (requires build step), React (loses web-native portability).

---

## ADR-002 — Gruvbox colour theme

**Status**: Accepted  
**Date**: Project start

**Decision**: Use the Gruvbox palette (warm beiges, browns, and muted jewel-tone accents) as the sole colour foundation.

**Reasoning**: Personal preference. The retro-terminal aesthetic is intentional and consistent. The palette has clear dark/light variants which map naturally to `prefers-color-scheme`.

---

## ADR-003 — Fira Code as the sole typeface

**Status**: Accepted  
**Date**: Project start

**Decision**: Fira Code (monospace) loaded from Google Fonts is the only typeface used across the entire library.

**Reasoning**: Consistent with the terminal/developer aesthetic. Monospace fonts give a distinctive, intentional look to UI components in this library.

---

## ADR-004 — Numeric spacing scale

**Status**: Accepted  
**Date**: Early build session

**Decision**: Use a numeric spacing scale (`--space-1` through `--space-12`) rather than named sizes (xs, sm, md, lg).

**Reasoning**: Numeric scales are more flexible and composable. They don't imply semantic meaning that constrains usage. Convention matches Tailwind's spacing scale which is familiar.

**Scale**: 4px base unit — `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-8: 32px`, `--space-10: 40px`, `--space-12: 48px`.

---

## ADR-005 — Global `--radius` token with per-component deviation

**Status**: Accepted  
**Date**: Early build session

**Decision**: A single `--radius` token (default 4px) provides the global border radius. Components expose `--component-radius` on `:host` defaulting to `--radius`, allowing per-instance overrides.

**Reasoning**: Consistent rounding across the system while preserving flexibility. Some components intentionally deviate (e.g. `r-badge` is always pill-shaped at `9999px`).

---

## ADR-006 — `:host` CSS variable convention

**Status**: Accepted  
**Date**: Early build session

**Decision**: Every component exposes `--component-*` CSS custom properties on `:host` that reference global tokens as defaults. Shadow DOM internal styles only reference these component-level vars.

```css
/* Good */
:host { --button-bg: var(--color-bg-primary); }
.btn  { background: var(--button-bg); }

/* Never */
.btn  { background: var(--color-bg-primary); }
```

**Reasoning**: CSS custom properties inherit through shadow DOM boundaries, but you cannot pierce shadow DOM from outside to style internals. Exposing component-level vars on `:host` gives consumers a clean override API without needing `::part()` or open shadow DOM.

---

## ADR-007 — `doc.js` as single shared import module

**Status**: Accepted  
**Date**: Doc site build session

**Decision**: All doc pages load a single `<script type="module" src="./doc.js">` which imports every component. New components only need to be added to `doc.js` (plus an `index.html` nav entry).

**Reasoning**: Avoids each doc page maintaining its own import list. Central registry for all components.

---

## ADR-008 — `r-select` uses MutationObserver to clone options into shadow DOM

**Status**: Accepted  
**Date**: Component build session

**Decision**: The native `<select>` element inside `r-select`'s shadow DOM cannot receive `<option>` children from light DOM. A MutationObserver watches for child list changes and clones `OPTION`/`OPTGROUP` nodes into the shadow `<select>`.

**Reasoning**: This is the only way to make a styled select wrapper work with declarative HTML option lists. The alternative (full custom dropdown) is significantly more complex and less accessible.

---

## ADR-009 — Radio button cross-shadow-DOM grouping via `_uncheckSiblings()`

**Status**: Accepted  
**Date**: Component build session

**Decision**: Native `input[type="radio"]` grouping via the `name` attribute does not work across shadow root boundaries. Each `r-radio` instance uses `_uncheckSiblings()` which calls `this.getRootNode().querySelectorAll('r-radio[name="..."]')` and removes the `checked` attribute from all siblings when one is selected.

**Reasoning**: The shadow DOM isolation is intentional and cannot be bypassed for native radio grouping. The JS-based approach replicates the correct mutual-exclusion behaviour.

---

## ADR-010 — Native `<dialog>` for `r-modal`

**Status**: Accepted  
**Date**: Component build session

**Decision**: `r-modal` wraps the native `<dialog>` element using `showModal()` / `close()`. The native `::backdrop` pseudo-element is used for the overlay.

**Reasoning**: Native dialog provides free keyboard management (Escape closes, focus trapping), accessibility semantics (`role="dialog"`, `aria-modal`), and the backdrop. No need to reimplement any of this.

**Known limitation**: The `slotchange` event approach is required to detect footer slot content because `:has(slot > *)` CSS selectors do not work across shadow DOM boundaries (slot assigned nodes live in light DOM, not as shadow DOM children of the slot element).

---

## ADR-011 — `--transition-*` tokens include easing; use bare durations in `animation:`

**Status**: Accepted  
**Date**: Bug fix session

**Decision**: The `--transition-fast/base/slow` tokens are full shorthand values (e.g. `250ms ease`) suitable for `transition:` properties only. For `animation:` properties, use a separate bare-duration token (e.g. `--spinner-duration: 800ms`, `--toast-duration: 250ms`).

**Reasoning**: Embedding `250ms ease` inside `animation: name 250ms ease ease forwards` produces two easing functions — browsers silently discard the entire animation declaration. This was a bug in both `r-spinner` and `r-toast`.

---

## ADR-012 — Layout components have no shadow DOM

**Status**: Accepted  
**Date**: Layout component session

**Decision**: `r-stack`, `r-cluster`, `r-grid`, and `r-container` apply styles directly to the host element via `this.style.*` rather than using shadow DOM.

**Reasoning**: Layout components are structural wrappers — their only job is to apply CSS layout properties. Shadow DOM would add a slot + render tree with no benefit. Direct host styling is simpler and ensures children are in natural document flow.

---

## ADR-013 — Source folder structure mirrors future package split

**Status**: Accepted  
**Date**: Architecture discussion session

**Decision**: Components live in `src/primitives/`, `src/layout/`, and future `src/composites/` and `src/viz/` directories. This mirrors the intended future npm package split (`@r-components/primitives`, etc.).

**Reasoning**: Separating concerns at the folder level now means the eventual monorepo split requires adding `package.json` files, not moving code. It also makes the tier boundaries explicit — a component in `src/composites/` should only depend on things in `src/primitives/` or `src/layout/`, not the reverse.

**Tier definitions**:
- **Tokens**: pure CSS, no JS
- **Primitives**: single-responsibility, no dependency on other components
- **Layout**: structural wrappers, no dependency on primitives
- **Composites**: built from primitives (e.g. data table uses checkbox, button, select)
- **Viz**: charts/graphs, separate dep tree

---

## ADR-014 — `RToast.show()` static API pattern

**Status**: Accepted  
**Date**: Component build session

**Decision**: `r-toast` exposes a static class method `RToast.show({ message, variant, duration })` that creates and appends toast elements to an auto-created `#r-toast-container` div in `document.body`. The class is exported as a named export from `toast.js`.

**Reasoning**: Toasts are ephemeral and triggered programmatically — requiring developers to place `<r-toast>` elements in HTML would be cumbersome. The static API matches how notification systems (e.g. Notyf, SweetAlert) are typically consumed. The auto-container means zero setup for consumers.

---

## ADR-015 — Doc site as iframe shell

**Status**: Accepted  
**Date**: 2026-04-10

**Decision**: A `.ai/` directory is committed to the repository containing `context.md` (living project brief), `decisions.md` (append-only ADR log), `handoffs/` (immutable per-session summaries), `prompts/` (reusable boot prompts), and a `README.md` explaining the maintenance contract.

**Reasoning**: AI coding assistants have no memory across sessions. Without explicit context files, each session requires re-explaining the project stack, conventions, and decisions from scratch — or risks undoing deliberate choices. The structured format (context vs. ADR vs. handoff vs. prompt) keeps each concern in the right place and makes the system maintainable by both humans and AI.

**Maintenance contract**: See `.ai/README.md` for when and how to update each file. Key rules: `context.md` stays current, `decisions.md` is append-only, handoffs are immutable after the session ends.


**Status**: Accepted  
**Date**: Doc site layout session

**Decision**: `index.html` is a persistent shell with a fixed 220px sidebar nav and a full-height `<iframe name="content">` for the main area. Sidebar links use `target="content"`. Each doc page is a fully self-contained HTML file.

**Reasoning**: Keeps doc pages independently navigable (each page works standalone without the shell). The iframe approach gives persistent sidebar navigation without a JavaScript router or single-page app architecture. Self-contained pages are also easier to test in isolation during development.
