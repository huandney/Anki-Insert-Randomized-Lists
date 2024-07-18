"""
Anki Add-on: Insert Randomized Lists

Inserts an unordered list with the 'shuffle' CSS class.

Originally developed by: Glutanimate (2017-2018), https://glutanimate.com/
Reformulated and updated for recent Anki versions by: huandney (2024), huandney@gmail.com
License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

from aqt import editor, mw
from anki.hooks import addHook
from .config import hotkey_toggle_list


def insert_shuffled_list(self):
    self.web.eval("""
        var selectedText = window.getSelection().toString();
        var list = document.createElement('ul');
        list.className = 'shuffle';
        var lines = selectedText.split('\\n');
        for (var i = 0; i < lines.length; i++) {
            var listItem = document.createElement('li');
            listItem.innerHTML = lines[i];
            list.appendChild(listItem);
        }
        document.execCommand('insertHTML', false, list.outerHTML);
    """)


def setup_buttons(buttons, editor):
    editor.insert_shuffled_list = insert_shuffled_list
    hotkey = hotkey_toggle_list
    btn = editor.addButton(None, "randUlBtn", editor.insert_shuffled_list,
                           label="RL", keys=hotkey,
                           tip="Insert randomized list ({})".format(hotkey))
    buttons.append(btn)
    return buttons


addHook("setupEditorButtons", setup_buttons)
