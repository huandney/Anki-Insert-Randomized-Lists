"""
Anki Add-on: Insert Randomized Lists

By: huandney (2024), huandney@gmail.com

Special thanks to kleinerpirat for the Anki CSS Injector add-on (https://github.com/kleinerpirat/anki-css-injector), 
from which parts of the code were used for implementing custom styles in the editor fields in this project.

License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

import json
from typing import Any

from aqt import mw
from aqt.editor import Editor
from aqt.gui_hooks import editor_did_load_note, webview_will_set_content
from aqt.webview import WebContent
from .config import custom_style

addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r".*\.js")


# Função para carregar pacotes JS necessários
def load_packages(webcontent: WebContent, context: Any) -> None:
    if isinstance(context, Editor):
        base_path = f"/_addons/{addon_package}"
        webcontent.js.append(f"{base_path}/injector.js")


# Função para injetar estilos personalizados no editor
def inject(editor: Editor) -> None:
    note = editor.note
    attributes = {
        "notetype": note.note_type()["name"],
        "mid": note.mid,
    }
    editor.web.eval(f"""if (typeof StyleInjector !== 'undefined') {{
        StyleInjector.update({{
            fieldNames: {note.keys()},
            attrs: {json.dumps(attributes)},
            customStyle: `{custom_style}`
        }});
    }}""")


# Registrar ganchos
editor_did_load_note.append(inject)
webview_will_set_content.append(load_packages)
