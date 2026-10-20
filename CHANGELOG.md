# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2026-10-19
> Commits: `3ad65c8`

### Randomization Script
- **Changed**: Wrapped in an IIFE; `shuffle`, `reorder` and `run` no longer leak as globals and collide with other template scripts on Anki Desktop.
- **Changed**: The order is saved under its own `sessionStorage` key (`randomizedLists`) instead of the shared `allIndices` key.
- **Changed**: Runs immediately when the lists are already on the page, so later card scripts (e.g. Cloze Interactive) see the shuffled order; it waits for the page to load only when pasted above the content.
- **Changed**: The back side is detected by `id="back"` only.
- **Fixed**: Opening the back without a saved order (e.g. previewing it directly) no longer throws; the list is shuffled again.
- **Fixed**: A saved order from another list no longer removes items from the back side.
- **Fixed**: A second copy of the script on the same side (`{{FrontSide}}` plus a back script) no longer shuffles the list again.
- **Removed**: `randomized_lists-commented.js`; `src/card/template.html` is the single source of the script.

### Add-on (v2.0.0)
- **Changed**: The RL button toggles the `shuffle` class on the list at the cursor, creating the list with the editor's native list command when needed; existing lists can be turned into randomized lists and back.
- **Fixed**: Creating a list no longer loses formatting, images, or the text after a `<` in the selection (clozes included).
- **Changed**: Requires Anki 2.1.50 or later; the version check and the `anki.version` import were removed.
- **Changed**: The editor style injector was rewritten to add only the `ul.shuffle` style; `custom_style` is passed as JSON, so CSS containing backticks no longer breaks the editor script.
