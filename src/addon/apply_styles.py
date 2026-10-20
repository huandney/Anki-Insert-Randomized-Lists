"""
Anki Add-on: Insert Randomized Lists

Highlights randomized lists in the editor fields with the configured custom style.

By: huandney (2024), huandney@gmail.com
Editor field styling based on kleinerpirat's Anki CSS Injector, https://github.com/kleinerpirat/anki-css-injector
License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

import json
from typing import Any

from aqt import gui_hooks, mw
from aqt.editor import Editor
from aqt.webview import WebContent

from .config import custom_style

addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r".*\.js")


def load_injector(web_content: WebContent, context: Any) -> None:
    if isinstance(context, Editor):
        web_content.js.append(f"/_addons/{addon_package}/injector.js")


def style_fields(editor: Editor) -> None:
    editor.web.eval(f"globalThis.RandomizedLists?.styleFields({json.dumps(custom_style)});")


gui_hooks.webview_will_set_content.append(load_injector)
gui_hooks.editor_did_load_note.append(style_fields)
