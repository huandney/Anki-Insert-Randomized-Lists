"""
Entry point for the add-on into Anki
Please do not edit this if you do not know what you are doing.

Originally developed by: Glutanimate (2017-2018), https://glutanimate.com/
Reformulated and updated for recent Anki versions by: huandney (2024), huandney@gmail.com
License: GNU AGPLv3 or later, https://www.gnu.org/licenses/agpl.html
"""

from anki import version as anki_version
from .config import enable_custom_style

# Import randomize_list.py for all versions
from . import randomize_lists

# Check the Anki version
anki_version_parts = anki_version.split('.')
anki_major_version = int(anki_version_parts[0])
anki_minor_version = int(anki_version_parts[1])
anki_patch_version = int(anki_version_parts[2]) if len(anki_version_parts) > 2 else 0

# Check if the version is compatible (2.1.50+ or year >= 23) and if enable_custom_style is True
if enable_custom_style and ((anki_major_version >= 23) or (anki_major_version == 2 and (
        anki_minor_version > 1 or (anki_minor_version == 1 and anki_patch_version >= 50)))):
    from . import apply_styles
