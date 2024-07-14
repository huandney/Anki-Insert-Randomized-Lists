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
Regardless of the card type, you'll need to add the following script, which is responsible for randomizing the lists:
```html
<script data-name="Randomized Lists" data-version="v2.1.0">
// https://github.com/huandney/Anki-Insert-Randomized-Lists
    
function reorder(elements, indices) {
    indices.forEach(index => elements.appendChild(elements.children[index]));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function run() {
    const uls = document.querySelectorAll('ul.shuffle');
    let indices = JSON.parse(sessionStorage.getItem('allIndices')) || {};

    if (!document.getElementById('back')) {
        uls.forEach((ul, i) => indices[i] = shuffle([...Array(ul.children.length).keys()]));
        sessionStorage.setItem('allIndices', JSON.stringify(indices));
    }

    uls.forEach((ul, i) => reorder(ul, indices[i]));
}

run();
</script>
```
> For more details on the script, [click here](https://github.com/huandney/Anki-Insert-Randomized-Lists/tree/main/src/card).

4. ### Adding Code to the Back Side
These codes are responsible for identifying and maintaining the order of the randomization previously done on the front side.
The instructions for inserting the code on the back of the card vary depending on the specific configuration of your card:

<details>
  <summary><strong>Cards without the FrontSide Field on the Back</strong></summary>
    
If your card does not have the `{{FrontSide}}` field, you should add the entire script with the addition of the `id="back"` to the metadata, as shown below:
  
```html
<script data-name="Randomized Lists" data-version="v2.1.0" id="back">
// https://github.com/huandney/Anki-Insert-Randomized-Lists
    
function reorder(elements, indices) {
    indices.forEach(index => elements.appendChild(elements.children[index]));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function run() {
    const uls = document.querySelectorAll('ul.shuffle');
    let indices = JSON.parse(sessionStorage.getItem('allIndices')) || {};

    if (!document.getElementById('back')) {
        uls.forEach((ul, i) => indices[i] = shuffle([...Array(ul.children.length).keys()]));
        sessionStorage.setItem('allIndices', JSON.stringify(indices));
    }

    uls.forEach((ul, i) => reorder(ul, indices[i]));
}

run();
</script>
```
</details>

<details>
  <summary><strong>Cards with FrontSide Field on the Back</strong></summary>
    
For cards that use the FrontSide field on the back, you don't need to add the entire script again. Simply insert the following metatag before the `{{FrontSide}}` field:
    
```html
<meta id="back">
```
> - This metatag ensures that the script correctly recognizes the back of the card and maintains the randomization order previously set on the front.
> - Placing this metatag before the `{{FrontSide}}` field is crucial for proper functioning on AnkiDroid.
</details>

## Add-on Configuration

Modify the add-on settings via **Tools → Add-ons (or use `CTRL+SHIFT+A`) → Insert Randomized Lists**, and then click **Config**. Available options:

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

* Make sure that the JavaScript code is [correctly inserted](#adding-the-code-to-the-front-side) into the card template.
* For cards without the FrontSide field on the back, make sure the script includes `id="back"`. For cards that use the FrontSide field, the `<meta id="back">` tag must be present and should be placed **before** the `{{FrontSide}}` field for proper functioning on AnkiDroid. [Details here](#4-adding-code-to-the-back-side).
* See the compatibility section above.

If you are still encountering issues, or have any suggestions, do not hesitate to open a [new issue](https://github.com/huandney/Anki-Insert-Randomized-Lists/issues) or PR here. Describe what you are facing in detail, including the Anki version and any error messages you may be receiving.

## License

This project is licensed under the GNU General Public License v3.0.

## Acknowledgements

We would like to thank [Glutanimate](https://github.com/glutanimate/anki-addons-misc/tree/master/src/editor_random_list), the original developer of this add-on. This version has been reformulated and updated for recent Anki versions, but Glutanimate's initial work was instrumental in the development of this project.

Special thanks to [kleinerpirat](https://github.com/kleinerpirat) for the [Anki CSS Injector add-on](https://github.com/kleinerpirat/anki-css-injector), which provided the code for implementing custom styles in the editor fields.
