# .ai/ — Inter-Session AI Context System

This folder keeps AI coding assistants (GitHub Copilot, Claude, etc.) oriented across sessions. Without it, each session starts cold with no memory of decisions, patterns, or history.

---

## File Map

```
.ai/
  README.md          ← you are here — how this system works
  context.md         ← living project brief (always current)
  decisions.md       ← append-only ADR log
  handoffs/          ← one file per session, never edited after creation
  prompts/           ← reusable boot prompts, update as the project grows
```

---

## When and How to Update Each File

### `context.md` — Update when the project state changes

**Update when:**
- A new component is added → update the component inventory table
- A new source folder is created (`src/composites/`, etc.) → update the folder structure
- A new token category is added → update the token table
- The stack changes (new tool, new dependency)
- The doc site structure changes

**Do not put in `context.md`:**
- Session-specific work logs (those go in `handoffs/`)
- Decision rationale (that goes in `decisions.md`)
- Bug fixes or one-off changes

**Format rule:** Keep it scannable. Use tables. Avoid prose paragraphs except in the intro.

---

### `decisions.md` — Append only, never edit past entries

**Add a new ADR when:**
- A non-obvious technical choice was made that a future session might question or undo
- A workaround was used for a browser/platform limitation (always document *why*)
- A naming convention, pattern, or structure was deliberately chosen over alternatives
- A bug was fixed by changing an approach (document the root cause and the fix pattern)

**Do not add an ADR for:**
- Obvious or conventional choices (e.g. "we used a for loop")
- Implementation details that may change (e.g. specific pixel values)
- Things already fully explained in `context.md`

**Format:**
```markdown
## ADR-NNN — Short title

**Status**: Accepted | Superseded by ADR-NNN  
**Date**: YYYY-MM-DD

**Decision**: One sentence.

**Reasoning**: Why this and not something else.

**Alternatives considered**: (optional)

**Known limitations / caveats**: (if relevant)
```

**Numbering:** Increment from the last ADR. Never reuse numbers. If a decision is reversed, mark the old ADR `Superseded by ADR-NNN` and write a new one explaining the change.

---

### `handoffs/NNN-short-title.md` — Write at end of session, never edit after

**Create when:** Any session ends where meaningful work was done.

**Naming:** Zero-padded incrementing number + kebab-case title, e.g. `002-composites-and-table.md`.

**Contents (fill in all sections):**
```markdown
# Session Handoff — NNN

**Date**: YYYY-MM-DD  
**Session scope**: One-line summary

## What was accomplished
- Bullet list of completed work

## Bugs fixed
- Bug description → root cause → fix applied

## Current state
- What is complete, what is not
- Any known issues left open intentionally

## Next session starting points
- Suggested next work items
- Anything that was started but not finished

## Key files touched
| File | What changed |
```

**Do not edit a handoff after the session ends.** They are a historical log. If you need to correct something, note it in the next handoff.

---

### `prompts/boot.md` — Update when the project or workflow evolves

**Update when:**
- New common pitfalls are discovered
- The definition of done changes
- New source tiers are added (`src/composites/` etc.)
- The checklist items change

**Do not put in the boot prompt:**
- Specific component implementation details (those are in `context.md`)
- Historical session notes (those are in `handoffs/`)

---

## End-of-Session Checklist

Before closing a session, the AI assistant should:

1. **Write a handoff file** in `handoffs/` with the next increment number
2. **Update `context.md`** if the component inventory, folder structure, or token system changed
3. **Append to `decisions.md`** if any new non-obvious decisions were made
4. **Update `prompts/boot.md`** if new pitfalls were discovered or the workflow changed

---

## Starting a New Session

1. Open `prompts/boot.md` and paste its prompt into the new session
2. The AI will read `context.md`, `decisions.md`, and the latest handoff in order
3. The AI should confirm understanding before beginning work

---

## What does NOT belong in `.ai/`

- API keys, tokens, passwords, or any secrets
- Generated files or build artifacts
- Large data files
- Personal notes unrelated to the codebase

`.ai/` is committed to the repository. Treat everything in it as public.
