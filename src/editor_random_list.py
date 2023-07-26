# -*- coding: utf-8 -*-

"""
Anki Add-on: Insert Randomized Lists

Inserts an unordered list with the 'shuffle' CSS class. 

This can be used to randomize list items when coupled with
a special card template.

Originally developed by: Glutanimate (2017), https://glutanimate.com/
Reformulated and updated for recent Anki versions by: huandney (2023), huandney@gmail.com

License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

from aqt import editor, mw
from anki.hooks import addHook

def get_hotkey():
    config = mw.addonManager.getConfig(__name__)
    return config.get("hotkeyToggleList", "Alt+Shift+L")

def insertShuffledList(self):
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

def setupButtons21(btns, editor):
    editor.insertShuffledList = insertShuffledList
    hotkey = get_hotkey()
    btn = editor.addButton(None, "randUlBtn", editor.insertShuffledList,
                           label="RL", keys=hotkey,
                           tip="Insert randomized list ({})".format(hotkey))
    btns.append(btn)
    return btns

# Conectar os ganchos
addHook("setupEditorButtons", setupButtons21)
