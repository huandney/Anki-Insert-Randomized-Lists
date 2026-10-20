"""
Entry point for the add-on into Anki
Please do not edit this if you do not know what you are doing.

Based on Glutanimate's Insert Randomized List (2017), https://github.com/glutanimate/anki-addons-misc
Reformulated for recent Anki versions by: huandney (2024), huandney@gmail.com
License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

from . import randomize_lists
from .config import enable_custom_style

if enable_custom_style:
    from . import apply_styles
