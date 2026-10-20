# Insert Randomized Lists

This repository contains two main components: an Anki add-on and a randomization script:

1. **[Add-on](https://github.com/huandney/Anki-Insert-Randomized-Lists/tree/main/src/addon)**: Is an extension for Anki that allows the creation of lists with the "shuffle" class. These lists can then be randomized using the randomization script.
2. **[Randomization script](https://github.com/huandney/Anki-Insert-Randomized-Lists/tree/main/src/card)**: A JavaScript script that can be inserted into the front and back of an Anki card to randomize lists that have the "shuffle" class.

## Setup and Integration

1. ### Installation
    - Install the add-on from [AnkiWeb](https://ankiweb.net/shared/info/1610249201).

2. ### Accessing the Templates
    
    - In the main Anki window, go to **Tools → Manage Note Types** or use the shortcut `CTRL+SHIFT+N`.
    - Find the note type where you want to enable list randomization (for example, Cloze).
    - Proceed by clicking on **Cards** to invoke the card template editor.

3. ### Adding the Code to the Front Side
Paste the script below at the **end** of the front template, after all fields. If the card has other scripts that read the lists (such as [Cloze Interactive](https://github.com/huandney/Anki-Cloze-Interactive)), keep this one **before** them so they see the shuffled order.
```html
<script data-name="Randomized Lists" data-version="v2.4.0">
// https://github.com/huandney/Anki-Insert-Randomized-Lists
(() => {
    const KEY = "randomizedLists";

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Reapplies the saved order when it fits the list, otherwise shuffles; returns the order used
    function reorder(ul, saved) {
        // Tab-indented sublists are sibling <ul>s and must move with the preceding item
        const groups = [];
        for (const el of ul.children) {
            if (el.tagName === "UL" && groups.length) groups[groups.length - 1].push(el);
            else groups.push([el]);
        }
        const order = saved?.length === groups.length ? saved : shuffle([...groups.keys()]);
        ul.append(...order.flatMap(i => groups[i]));
        return order;
    }

    function run() {
        const lists = document.querySelectorAll("ul.shuffle:not([data-shuffled])");
        if (!lists.length) return;

        // The back side is marked by id="back" on this script or on a <meta> placed before FrontSide
        const isBack = Boolean(document.getElementById("back"));
        const saved = isBack ? JSON.parse(sessionStorage.getItem(KEY)) || [] : [];

        const orders = [...lists].map((ul, i) => {
            // A second copy of this script (FrontSide + back) must not permute the list again
            ul.dataset.shuffled = "true";
            return reorder(ul, saved[i]);
        });

        if (isBack) return;
        sessionStorage.setItem(KEY, JSON.stringify(orders));
    }

    // Pasted above the content, AnkiDroid has not parsed the lists yet
    if (document.querySelector("ul.shuffle") || document.readyState !== "loading") return run();
    document.addEventListener("DOMContentLoaded", run, { once: true });
})();
</script>
```
> The same code lives in [`src/card/template.html`](https://github.com/huandney/Anki-Insert-Randomized-Lists/blob/main/src/card/template.html).

4. ### Adding Code to the Back Side
The back side must be marked with `id="back"` so the script restores the order shuffled on the front instead of shuffling again.

<details>
  <summary><strong>Cards without the FrontSide Field on the Back</strong></summary>

Paste the script at the end of the back template. It is the same code as the front, with `id="back"` added to the opening tag:

```html
<script data-name="Randomized Lists" data-version="v2.4.0" id="back">
// https://github.com/huandney/Anki-Insert-Randomized-Lists
(() => {
    const KEY = "randomizedLists";

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Reapplies the saved order when it fits the list, otherwise shuffles; returns the order used
    function reorder(ul, saved) {
        // Tab-indented sublists are sibling <ul>s and must move with the preceding item
        const groups = [];
        for (const el of ul.children) {
            if (el.tagName === "UL" && groups.length) groups[groups.length - 1].push(el);
            else groups.push([el]);
        }
        const order = saved?.length === groups.length ? saved : shuffle([...groups.keys()]);
        ul.append(...order.flatMap(i => groups[i]));
        return order;
    }

    function run() {
        const lists = document.querySelectorAll("ul.shuffle:not([data-shuffled])");
        if (!lists.length) return;

        // The back side is marked by id="back" on this script or on a <meta> placed before FrontSide
        const isBack = Boolean(document.getElementById("back"));
        const saved = isBack ? JSON.parse(sessionStorage.getItem(KEY)) || [] : [];

        const orders = [...lists].map((ul, i) => {
            // A second copy of this script (FrontSide + back) must not permute the list again
            ul.dataset.shuffled = "true";
            return reorder(ul, saved[i]);
        });

        if (isBack) return;
        sessionStorage.setItem(KEY, JSON.stringify(orders));
    }

    // Pasted above the content, AnkiDroid has not parsed the lists yet
    if (document.querySelector("ul.shuffle") || document.readyState !== "loading") return run();
    document.addEventListener("DOMContentLoaded", run, { once: true });
})();
</script>
```
</details>

<details>
  <summary><strong>Cards with FrontSide Field on the Back</strong></summary>

The script comes along with `{{FrontSide}}`, so you don't need to paste it again. Simply insert the following metatag before the `{{FrontSide}}` field:

```html
<meta id="back">
```
> Placing this metatag **before** the `{{FrontSide}}` field is crucial for proper functioning on AnkiDroid.
</details>

5. ### How It Works
    - On the front, each `ul.shuffle` list is shuffled and the order is saved in `sessionStorage` under the `randomizedLists` key.
    - On the back (`id="back"` present), the saved order is reapplied. If it is missing or does not match the list (e.g. previewing the back directly), the list is shuffled again instead of breaking.
    - Sublists created by indenting with Tab move together with the item above them.
    - Lists are marked as shuffled, so a second copy of the script on the same side does nothing.

## Add-on Configuration

Modify the add-on settings via **Tools → Add-ons** (or use `CTRL+SHIFT+A`) **→ Insert Randomized Lists**, and then click **Config**. Available options:

- `hotkey_toggle_list`: The hotkey for inserting randomized lists. Default: `Alt+Shift+L`.
- `enable_custom_style`: Enable custom styles for the editor fields. Default: `true`.
- `custom_style`: CSS style to apply to the editor fields.

> Custom Styles is only for differentiating random lists from regular lists in the editor. This style will not appear when reviewing your cards.
> If your Anki version is below 2.1.50, the custom style feature is not supported and will be automatically disabled.

![Captura de tela de 2023-07-26 19-23-22](https://github.com/huandney/Anki-Insert-Randomized-Lists/assets/19948348/1facd2a6-a565-4124-bc45-eaf105a2124a)

## Compatibility

### Randomization Script

- **AnkiWeb, AnkiDroid, AnkiMobile:** The randomization script works correctly on these platforms.
- **Anki Desktop (2.1.50+):** The script works natively due to the implementation of `sessionStorage`.
- **Anki Desktop (2.1.49 and earlier):** Requires the [Cookie Monster](https://ankiweb.net/shared/info/1501583548) add-on for the randomization script to function properly.

### Add-on

- **Compatibility:** The add-on Works froms 2.1.15+, with custom styles supported from 2.1.50+. For Anki 2.1.49 and below, custom styles can be applied using [Anki CSS Injector](https://ankiweb.net/shared/info/181103283).

## Troubleshooting

If you are having problems with the add-on, please check the following:

* Make sure that the JavaScript code is [correctly inserted](#adding-the-code-to-the-front-side) at the end of the card template.
* For cards without the FrontSide field on the back, make sure the script includes `id="back"`. For cards that use the FrontSide field, the `<meta id="back">` tag must be present and should be placed **before** the `{{FrontSide}}` field for proper functioning on AnkiDroid. [Details here](#4-adding-code-to-the-back-side).
* See the compatibility section above.

If you are still encountering issues, or have any suggestions, do not hesitate to open a [new issue](https://github.com/huandney/Anki-Insert-Randomized-Lists/issues) or PR here. Describe what you are facing in detail, including the Anki version and any error messages you may be receiving.

## License

This project is licensed under the GNU General Public License v3.0.

## Acknowledgements

We would like to thank [Glutanimate](https://github.com/glutanimate/anki-addons-misc/tree/master/src/editor_random_list), the original developer of this add-on. This version has been reformulated and updated for recent Anki versions, but Glutanimate's initial work was instrumental in the development of this project.

Special thanks to [kleinerpirat](https://github.com/kleinerpirat) for the [Anki CSS Injector add-on](https://github.com/kleinerpirat/anki-css-injector), which provided the code for implementing custom styles in the editor fields.
