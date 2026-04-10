# r-components — Session Boot Prompt

Use this prompt at the start of any new AI session working on this project.

---

## Prompt

I'm working on **r-components**, a zero-dependency vanilla JS web component library. Before we do anything, read these files in order to get full context:

1. `.ai/README.md` — how this context system works and how to maintain it
2. `.ai/context.md` — project overview, stack, token system, folder structure, component inventory
3. `.ai/decisions.md` — all architecture decision records (ADRs)
4. `.ai/handoffs/` — read the most recent handoff file (highest number)

Once you've read those, confirm you understand:
- The `:host` variable convention (ADR-006)
- Why `--transition-*` tokens must never be used in `animation:` shorthand (ADR-011)
- The doc site structure (sidebar shell + iframe, `doc.js` shared import)
- The source folder tier system (primitives / layout / composites / viz)
- Definition of done: every component needs a doc page, entry in `doc/doc.js`, and a nav link in `index.html`

Then ask me what I'd like to work on.

---

## Checklist before starting any new component

- [ ] Correct source folder: `src/primitives/`, `src/layout/`, `src/composites/`, or `src/viz/`
- [ ] Uses `:host` variable convention (all internal values exposed as `--component-*` vars)
- [ ] Global tokens referenced only through component-level vars, never directly in shadow styles
- [ ] If using animation, uses a bare duration token (not `--transition-*`)
- [ ] Custom element sets explicit `display` (not relying on browser `inline` default)
- [ ] Added to `doc/doc.js`
- [ ] Doc page created in `doc/`
- [ ] Nav link added to `index.html` under correct section
- [ ] `disconnectedCallback` cleans up any MutationObservers, event listeners, timers

---

## Checklist before ending a session

- [ ] All planned work is complete and tested in browser
- [ ] `doc/doc.js` has been updated with new imports
- [ ] `index.html` has new nav links
- [ ] A new handoff file created in `.ai/handoffs/` (increment the number)
- [ ] `.ai/decisions.md` updated with any new ADRs
- [ ] `.ai/context.md` component inventory updated if new components were added

---

## Common pitfalls

**Animation bug**: `--transition-base: 250ms ease` — if used in `animation: name var(--transition-base) linear infinite`, the browser sees two easing values and drops the entire rule. Always use a dedicated `--component-duration: Xms` token in `animation:`.

**Custom element display**: Browsers default custom elements to `display: inline`. Always set display explicitly in `connectedCallback` or via `:host { display: block }` (for shadow DOM components) or `this.style.display` (for no-shadow components).

**Shadow DOM and CSS selectors**: `:has(slot > *)` and similar selectors targeting slotted content from within shadow styles do not work — assigned nodes live in light DOM. Use `slotchange` events and `slot.assignedElements()` instead.

**Radio grouping**: Native `input[type="radio"]` name-based grouping does not work across shadow root boundaries. Use the `_uncheckSiblings()` pattern (see `src/primitives/radio.js`).

**Select options**: `<option>` elements in light DOM are not automatically available inside a shadow DOM `<select>`. Use MutationObserver to clone them (see `src/primitives/select.js`).
