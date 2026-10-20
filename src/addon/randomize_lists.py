"""
Anki Add-on: Insert Randomized Lists

Toggles the 'shuffle' CSS class on the unordered list at the cursor,
creating the list first when the cursor is not inside one.

Based on Glutanimate's Insert Randomized List (2017), https://github.com/glutanimate/anki-addons-misc
Reformulated for recent Anki versions by: huandney (2024), huandney@gmail.com
License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

from aqt import gui_hooks
from aqt.editor import Editor

from .config import hotkey_toggle_list

TOGGLE_SHUFFLE_LIST = """
(() => {
    // Fields are contenteditables inside shadow roots; follow the focus down to the one being edited
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    const selection = active?.getRootNode().getSelection?.();
    if (!selection?.anchorNode) return;

    const listAtCursor = () => {
        const node = selection.anchorNode;
        return (node.nodeType === Node.TEXT_NODE ? node.parentElement : node).closest("ul");
    };
    let ul = listAtCursor();
    if (!ul) {
        // The native command keeps formatting, clozes and images, like Anki's own list button
        document.execCommand("insertUnorderedList");
        ul = listAtCursor();
    }
    if (!ul) return;

    ul.classList.toggle("shuffle");
    if (!ul.classList.length) ul.removeAttribute("class");
})();
"""


def toggle_shuffle_list(editor: Editor) -> None:
    editor.web.eval(TOGGLE_SHUFFLE_LIST)


def add_button(buttons: list[str], editor: Editor) -> None:
    buttons.append(editor.addButton(
        None, "randUlBtn", toggle_shuffle_list,
        tip=f"Toggle randomized list ({hotkey_toggle_list})",
        label="RL", keys=hotkey_toggle_list,
    ))


gui_hooks.editor_did_init_buttons.append(add_button)
