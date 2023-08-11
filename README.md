# Insert Randomized Lists

This repository contains two main components: an Anki add-on and a randomization script:

1. **[Add-on](https://github.com/huandney/Anki-Insert-Randomized-Lists/tree/main/src/addon)**: Is an extension for Anki that allows the creation of lists with the "shuffle" class. These lists can then be randomized using the randomization script.
2. **[Randomization script](https://github.com/huandney/Anki-Insert-Randomized-Lists/tree/main/src/card)**: A JavaScript script that can be inserted into the front and back of an Anki card to randomize lists that have the "shuffle" class.

## Instalação

1. ### Instalação
    - Install the add-on from [AnkiWeb](https://ankiweb.net/shared/info/1610249201).

2. ### Modificando os Templates
    
    - In the main Anki window, go to **Tools → Manage Note Types**.
    - Find the note type where you want to enable list randomization (for example, Cloze).
    - Proceed by clicking on **Cards** to invoke the card template editor.

> Agora, podemos ter duas situações possíveis:

#### Para cartões que **NÃO** possuem o campo `{{FrontSide}}` no verso:

<details><summary><b>Template Frontal</b></summary>
   
```html
<script data-name="Randomized Lists" data-version="v2.0.0">
// https://github.com/huandney/Anki-Insert-Randomized-Lists
    
function reorderList(ul, indices) {
    indices.forEach(index => ul.appendChild(ul.children[index]));
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function run() {
    var ulElements = document.querySelectorAll('ul.shuffle');
    var isBack = !!document.getElementById('back');
    var allIndices = isBack ? JSON.parse(sessionStorage.getItem('allIndices')) : {};

    ulElements.forEach((ul, i) => {
        var indices = allIndices[i] || shuffleArray(Array.from({length: ul.children.length}, (_, idx) => idx));
        if (!isBack) allIndices[i] = indices;
        reorderList(ul, indices);
    });

    if (!isBack) sessionStorage.setItem('allIndices', JSON.stringify(allIndices));
}

run();
</script>
```

</details> <details><summary><b>Template Verso</b></summary>
   
```html
<script data-name="Randomized Lists" data-version="v2.0.0" id="black">
// https://github.com/huandney/Anki-Insert-Randomized-Lists
    
function reorderList(ul, indices) {
    indices.forEach(index => ul.appendChild(ul.children[index]));
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function run() {
    var ulElements = document.querySelectorAll('ul.shuffle');
    var isBack = !!document.getElementById('back');
    var allIndices = isBack ? JSON.parse(sessionStorage.getItem('allIndices')) : {};

    ulElements.forEach((ul, i) => {
        var indices = allIndices[i] || shuffleArray(Array.from({length: ul.children.length}, (_, idx) => idx));
        if (!isBack) allIndices[i] = indices;
        reorderList(ul, indices);
    });

    if (!isBack) sessionStorage.setItem('allIndices', JSON.stringify(allIndices));
}

run();
</script>
```

</details>

---

#### Para cartões que possuem o campo `{{FrontSide}}` no verso:

<details><summary><b>Template Frontal</b></summary>

```html
<script data-name="Randomized Lists" data-version="v2.0.0">
// https://github.com/huandney/Anki-Insert-Randomized-Lists
    
function reorderList(ul, indices) {
    indices.forEach(index => ul.appendChild(ul.children[index]));
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function run() {
    var ulElements = document.querySelectorAll('ul.shuffle');
    var isBack = !!document.getElementById('back');
    var allIndices = isBack ? JSON.parse(sessionStorage.getItem('allIndices')) : {};

    ulElements.forEach((ul, i) => {
        var indices = allIndices[i] || shuffleArray(Array.from({length: ul.children.length}, (_, idx) => idx));
        if (!isBack) allIndices[i] = indices;
        reorderList(ul, indices);
    });

    if (!isBack) sessionStorage.setItem('allIndices', JSON.stringify(allIndices));
}

run();
</script>
```

</details> <details><summary><b>Template Verso</b></summary>

```html
<meta id="back">`
```
</details>

---

> Aplique as seguintes mudanças ao adicionar o script acima aos seus modelos de cartão conforme indicado.






## Add-on Configuration

There is no configuration for this add-on, except for the hotkey. You can set a custom hotkey for inserting randomized lists by following these steps:

On Anki 2.1:

1. Go to **Tools → Add-ons**, select the add-on in the list, and then click **Config**.
2. In the Hotkey field, enter the hotkey that you want to use.
3. Click **Save**.

The default hotkey is `Alt+Shift+L`.

### Optional
If you want to differentiate, only in the Editor, the random lists from the regular lists we can use the excellent [add-on](https://ankiweb.net/shared/info/181103283) made by [@kleinerpirat](https://github.com/kleinerpirat). For example:

![Captura de tela de 2023-07-26 19-23-22](https://github.com/huandney/Anki-Insert-Randomized-Lists/assets/19948348/1facd2a6-a565-4124-bc45-eaf105a2124a)


1. Navigate to the add-on folder (Tools → Add-ons → CSS Injector - Change default editor styles → click "View Files")
2. Add the code below or another style of your choice in `field.css` inside `user_files`.
 ```css
ul.shuffle {
    border: 2px dotted gray;
}
```
3. restart the editor.

* This style will not appear when reviewing your cards.

## Compatibility

The randomization [script](https://github.com/huandney/Anki-Insert-Randomized-Lists/blob/main/src/card/template.html) and the add-on have been tested across various Anki platforms and versions to ensure maximum compatibility. Here are the details:

- **AnkiWeb and AnkiDroid (tested on the latest versions)**: The randomization script works correctly on these platforms.
    
- **Anki Desktop (version 2.1.50 and later)**: The script works natively due to the implementation of `sessionStorage`.
    
- **Anki Desktop (version 2.1.49 and earlier)**: For these versions, it is necessary to use the [Cookie Monster](https://ankiweb.net/shared/info/1501583548) add-on to ensure the functionality of the randomization script.
    
- **AnkiMobile**: The functionality of the script has not been officially tested, but it is likely to work correctly.
    
- **Add-on Compatibility**: The add-on has been tested and confirmed to work correctly on all Anki versions, from 2.1.15 to 2.1.65 (and later).

## Troubleshooting

If you are having problems with the add-on, please check the following:

* Make sure that the JavaScript code is correctly inserted into the card template.
* And that the content of the Front Template field is wrapped with `<span id="front">CONTENTS HERE</span>`.
* See the compatibility section above.

If you are still encountering issues, or have any suggestions, do not hesitate to open a [new issue](https://github.com/huandney/Anki-Insert-Randomized-Lists/issues) or PR here. Describe what you are facing in detail, including the Anki version and any error messages you may be receiving.

## License

This project is licensed under the GNU General Public License v3.0.

## Acknowledgements

We would like to thank [Glutanimate](https://github.com/glutanimate/anki-addons-misc/tree/master/src/editor_random_list), the original developer of this add-on. This version has been reformulated and updated for recent Anki versions, but Glutanimate's initial work was instrumental in the development of this project.


