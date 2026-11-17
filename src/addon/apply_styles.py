"""
Anki Add-on: Insert Randomized Lists

Highlights randomized lists in the editor fields with the configured custom style.

By: huandney (2024), huandney@gmail.com
Editor field styling based on kleinerpirat's Anki CSS Injector, https://github.com/kleinerpirat/anki-css-injector
License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

import json
from pathlib import Path

from aqt import gui_hooks
from aqt.editor import Editor

from .config import custom_style

# Evaluated instead of loaded as a page script: the new editor is a SvelteKit page,
# which never goes through webview_will_set_content
INJECTOR = (Path(__file__).parent / "injector.js").read_text(encoding="utf-8")


def style_fields(editor: Editor) -> None:
    editor.web.eval(f"{INJECTOR}\nglobalThis.RandomizedLists.styleFields({json.dumps(custom_style)});")


gui_hooks.editor_did_load_note.append(style_fields)
