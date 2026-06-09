# Missed Uncommitted UI Changes

This note captures the UI changes that appear not to have survived the emergency restore/history cleanup before `feat/custom-blocks` was pushed.

Pushed branch:

```text
feat/custom-blocks
HEAD: ad0aa98 fix: allow dev cors and configurable hmr port
```

The pushed branch does include the broader recent work, including the premium toolbar redesign commit, panel resizer commits, Vite/CORS fix, media/library work, and left/right panel collapse logic. The items below are the ones that appear missing or uncertain.

## Confirmed Missing

### 1. Rename "Creative Projects" to "Creativity"

Requested change:

```text
Creative Projects -> Creativity
```

Current repo check after push found no matches for either `Creative Projects` or `Creativity`, so this label may have been in a transient UI state or removed/restored during recovery.

Suggested places to check/rebuild:

- Left navigation accordion labels
- Project/workspace switcher labels
- Any creative/project category labels in `framework-builder.html` and `index.html`
- Related JS-rendered labels in `js/`, `src/`, or widget modules

Useful search:

```bash
grep -RInE "Creative Projects|Creativity" . --exclude-dir=.git --exclude-dir=node_modules
```

### 2. Editable Art Direction

Requested change:

```text
I want to be able to edit and change the Art Direction - seems to be hard coded right now?
```

Current repo check found no matches for:

```text
Art Direction
art direction
artDirection
art_direction
```

This likely means the editable Art Direction UI/state work was not committed before the restore.

Suggested rebuild direction:

- Find where the current generated style/brand/creative direction is derived.
- Add an editable field or panel control for Art Direction.
- Store the value in the same state object used by the builder/project settings.
- Ensure it can be changed without editing hard-coded copy.
- If the value feeds prompts, imports, templates, or AI generation, make those consumers read from user-editable state instead of constants.

Useful search:

```bash
grep -RInE "Art Direction|art direction|artDirection|art_direction|direction" . --exclude-dir=.git --exclude-dir=node_modules
```

## Likely Missing Or Partially Restored

### 3. Route/URL Cleanup For App-Like Navigation

User feedback:

```text
URL route is not ideal for an app like this
```

There may have been uncommitted changes intended to make navigation feel less like separate HTML routes and more like a single app shell.

Suggested rebuild direction:

- Prefer one canonical app entry point.
- Avoid making users manually choose between `index.html` and `framework-builder.html`.
- If both files remain temporarily, keep them generated/synced from one source.
- Consider redirecting one to the other during development.

### 4. Top Toolbar Restore State

The pushed branch includes:

```text
7b19246 feat: redesign toolbar for premium creative workspace
```

But after that, there were requests to:

```text
Can you restore previous state to Top Bar please
```

Because the app was then restored to a previous clean commit, the exact preferred top-bar state may not match what was visible during the best browser moment.

Suggested rebuild direction:

- Check the current pushed toolbar against the desired screenshot/browser memory.
- Pay special attention to logo sizing, toolbar grouping, spacing, and visual hierarchy.
- Avoid making the logo feel compressed or secondary.

### 5. Left Nav Fine-Tuning

There were requests around:

```text
Left Nav needs a bit more indent on the left
left side bar to 5px either side of Icons
```

The pushed branch does include left panel collapse/resizer work, but the final exact spacing that caused/preceded the corruption may not be present.

Suggested rebuild direction:

- Review collapsed and expanded left-nav icon padding.
- Keep icon buttons visually centered.
- Avoid reducing the rail so much that labels, hover states, or active states clip.
- Test both collapsed and expanded states.

### 6. Right Panel Hide/Collapse Refinement

The pushed branch contains right panel collapse/resizer code in:

- `framework-builder.html`
- `index.html`
- `css/layout.css`
- `js/app.js`
- `js/panels.js`

However, the exact requested UX was:

```text
ability to retract it to the left to give the screen more real estate
or the option to hide it entirely when not being used
```

Suggested rebuild direction:

- Confirm there are distinct states for expanded, collapsed, and fully hidden if needed.
- Persist the user preference in `localStorage`.
- Ensure canvas/workspace width recalculates cleanly after each state change.
- Add a visible, discoverable reopen control when fully hidden.

### 7. Left Nav Search Functionality

User feedback:

```text
Search Bar on Left Nav is currently useless. It does not work at all
```

This may or may not have been fixed before the restore. It should be retested.

Suggested rebuild direction:

- Wire the search input to filter visible left-nav blocks/items.
- Search should match block label, category, tags, and likely synonyms.
- Empty search should restore the full list.
- No-results state should be quiet and useful.

## Files Most Likely Involved

Start with these:

```text
framework-builder.html
index.html
css/layout.css
js/app.js
js/panels.js
src/main.js
```

Then search within:

```text
js/
src/
widgets/
```

## Notes From Cleanup

To get the branch pushed, the exposed Anthropic-key history had to be cleaned. During that cleanup:

- `popart-spec-generator.html` was removed from branch history.
- Anthropic-key-shaped strings were redacted in remaining historical files.
- The branch was force-pushed with cleaned history.

Current pushed tip:

```text
ad0aa987e66e5bb5ecca9a38c4f237b971988bc3
```

