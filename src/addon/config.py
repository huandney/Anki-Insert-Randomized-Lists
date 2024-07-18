# config.py

from aqt import mw

addon_config = mw.addonManager.getConfig(__name__)
enable_custom_style = addon_config.get("enable_custom_style", True)
custom_style = addon_config.get("custom_style", "").strip()
hotkey_toggle_list = addon_config.get("hotkey_toggle_list", "Alt+Shift+L")
