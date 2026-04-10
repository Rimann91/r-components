# r-components — Project Context

## What this is

A zero-dependency, framework-free web component primitive library built with vanilla JS and the Web Components API (Custom Elements v1, Shadow DOM). It serves as a personal design system and component toolkit.

## Stack

- **Language**: Vanilla JS (ES modules, no build step for components)
- **Dev server**: Vite (`npm run dev`)
- **Components**: Custom Elements v1 + Shadow DOM
- **No frameworks**: No React, Vue, Angular, etc.

## Design Language

- **Theme**: Gruvbox (retro groove color palette — warm beiges/browns, muted accent colors)
- **Font**: Fira Code (monospace, Google Fonts)
- **Dark/light**: Automatic via `@media (prefers-color-scheme: dark)` — all tokens swap
- **Style**: Minimalist, terminal-inspired

## Token Foundation (`styles/gruvbox_dark_colors.css`)

All design tokens live here. Every component inherits from these via CSS custom property inheritance through shadow DOM boundaries.

| Category | Tokens |
|---|---|
| Spacing | `--space-1` through `--space-12` (numeric scale) |
| Typography | `--text-xs` through `--text-4xl`, `--font-weight-*`, `--line-height-*` |
| Radius | `--radius` (global, 4px default) |
| Shadows | `--shadow-sm`, `--shadow-base`, `--shadow-lg` |
| Transitions | `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (400ms) |
| Focus | `--focus-ring`, `--color-focus` |
| Z-index | `--z-dropdown`, `--z-modal`, `--z-toast` |
| Semantic bg | `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-hover`, `--color-bg-active` |
| Semantic fg | `--color-fg-primary`, `--color-fg-secondary`, `--color-fg-muted`, `--color-fg-dark` |
| Semantic status | `--color-success`, `--color-warning`, `--color-danger` |
| Divider | `--color-divider` |

> **Note**: `--transition-*` tokens include easing (e.g. `250ms ease`). Never embed them in `animation:` shorthand — use a bare duration instead (see ADR-009).

## Component Architecture

### `:host` variable convention
Every component exposes `--component-*` CSS custom properties on `:host` that fall back to global tokens. Internal shadow styles only reference these component-level vars. This allows per-instance overrides from outside shadow DOM.

```css
:host {
  --button-bg: var(--color-bg-primary);
  --button-color: var(--color-fg-primary);
}
.btn { background: var(--button-bg); color: var(--button-color); }
```

### Shadow DOM
All primitives use closed or open shadow DOM. Layout components (`r-stack`, `r-cluster`, `r-grid`, `r-container`) have **no shadow DOM** — they apply styles directly to the host element so children are in natural flow.

### Slot pattern
Components use `<slot>` for content projection. Named slots used for compound layouts (e.g. `r-modal` has `slot="footer"`).

## Folder Structure

```
r-components/
  .ai/                    ← inter-session AI context (this folder)
  doc/                    ← documentation pages (one per component)
    doc.js                ← single shared import — add every new component here
    home.html             ← iframe landing page
    *.html                ← per-component doc pages
  src/
    primitives/           ← single-responsibility web components
      typography/
        heading.js
        text.js
      button.js, card.js, badge.js, alert.js, spinner.js
      input*.js, select.js, checkbox.js, radio.js, switch.js
      tooltip.js, modal.js, toast.js
      collapse.js, divider.js
    layout/               ← structural wrapper components (no shadow DOM)
      stack.js, cluster.js, grid.js, container.js
  styles/
    gruvbox_dark_colors.css   ← ALL design tokens
  shared.css              ← global doc-site styles
  index.html              ← doc site shell (sidebar nav + iframe)
  package.json
```

## Doc Site

- **Shell**: `index.html` — sidebar nav + `<iframe name="content">`
- **Nav links**: `target="content"` to load doc pages in iframe
- **Per-component pages**: self-contained HTML pages in `doc/`
- **Shared imports**: all pages load only `./doc.js`, which imports every component
- **Definition of done**: a component is not complete without a doc page

## Current Component Inventory

### Primitives
| Component | Tag | File |
|---|---|---|
| Button | `r-button` | `src/primitives/button.js` |
| Card | `r-card` | `src/primitives/card.js` |
| Badge | `r-badge` | `src/primitives/badge.js` |
| Alert | `r-alert` | `src/primitives/alert.js` |
| Spinner | `r-spinner` | `src/primitives/spinner.js` |
| Collapse | `r-collapse` | `src/primitives/collapse.js` |
| Divider | `r-divider` | `src/primitives/divider.js` |
| Input Text | `r-input-text` | `src/primitives/inputText.js` |
| Input Number | `r-input-number` | `src/primitives/inputNumber.js` |
| Input Money | `r-input-money` | `src/primitives/inputMoney.js` |
| Input Date | `r-input-date` | `src/primitives/inputDate.js` |
| Input Datetime | `r-input-datetime` | `src/primitives/inputDatetime.js` |
| Select | `r-select` | `src/primitives/select.js` |
| Checkbox | `r-checkbox` | `src/primitives/checkbox.js` |
| Radio | `r-radio` | `src/primitives/radio.js` |
| Switch | `r-switch` | `src/primitives/switch.js` |
| Tooltip | `r-tooltip` | `src/primitives/tooltip.js` |
| Modal | `r-modal` | `src/primitives/modal.js` |
| Toast | `r-toast` | `src/primitives/toast.js` |
| Heading | `r-heading` | `src/primitives/typography/heading.js` |
| Text | `r-text` | `src/primitives/typography/text.js` |

### Layout
| Component | Tag | File |
|---|---|---|
| Stack | `r-stack` | `src/layout/stack.js` |
| Cluster | `r-cluster` | `src/layout/cluster.js` |
| Grid | `r-grid` | `src/layout/grid.js` |
| Container | `r-container` | `src/layout/container.js` |

## Future Roadmap

- **Composites** (`src/composites/`): data table, advanced table — components built from primitives
- **Viz** (`src/viz/`): charts, graphs — separate dependency tree
- **Package split**: when ready to publish, each `src/` subfolder becomes an npm package (`@r-components/tokens`, `@r-components/primitives`, `@r-components/layout`, etc.)
