# Add-on - Anki - Insert Randomized Lists
This add-on allows you to create lists with the class "shuffle", which, combined with the script below, serves to randomize these lists.  . Originally developed by [Glutanimate](https://github.com/glutanimate/anki-addons-misc/tree/master/src/editor_random_list), this version has been reformulated and updated for recent Anki versions.

## Installation  
1. Install the add-on from [AnkiWeb](https://ankiweb.net/shared/info/xxxxxx)
2. In the main Anki window, go to **Tools → Manage Note Types** and find the note type where you want to enable list randomization (for example, Cloze). Proceed by clicking on **Cards** to invoke the card template editor.  Now apply the following changes:  - Wrap the content of the Front Template field with `<span id="front">CONTENTS HERE</span>`.
3. Copy and paste the content of [`template.html`](https://github.com/huandney/Anki-Insert-Randomized-Lists/blob/main/template.html) into the front and back template of your cards.

   
**Here is how the results should look, for example, for the Cloze grade type:**

**Front Template**

```html
<span id="front">
{{cloze:Text}}
</span>

<script>
function run() {
    var ulElements = document.querySelectorAll('ul.shuffle');
    var isFront = document.getElementById("front");

    for (var i = 0; i < ulElements.length; i++) {
        var ul = ulElements[i];
        var children = Array.from(ul.children);
        var indices;

        if (isFront) {
            // When the front of the card is displayed, randomize and store the order
            indices = Array.from({length: children.length}, (_, i) => i);
            for (var j = indices.length - 1; j > 0; j--) {
                var k = Math.floor(Math.random() * (j + 1));
                [indices[j], indices[k]] = [indices[k], indices[j]];  // Swap elements
            }
            sessionStorage.setItem('indices' + i, JSON.stringify(indices));
        } else {
            // When the answer is displayed, retrieve the stored order
            indices = JSON.parse(sessionStorage.getItem('indices' + i));
        }

        // Reorder elements based on indices
        indices.forEach(function(index) {
            ul.appendChild(children[index]);
        });
    }
}

run();
</script>

```

**Back Template**

```html
{{cloze:Text}}<br>
{{Extra}}

<script>
function run() {
    var ulElements = document.querySelectorAll('ul.shuffle');
    var isFront = document.getElementById("front");

    for (var i = 0; i < ulElements.length; i++) {
        var ul = ulElements[i];
        var children = Array.from(ul.children);
        var indices;

        if (isFront) {
            // When the front of the card is displayed, randomize and store the order
            indices = Array.from({length: children.length}, (_, i) => i);
            for (var j = indices.length - 1; j > 0; j--) {
                var k = Math.floor(Math.random() * (j + 1));
                [indices[j], indices[k]] = [indices[k], indices[j]];  // Swap elements
            }
            sessionStorage.setItem('indices' + i, JSON.stringify(indices));
        } else {
            // When the answer is displayed, retrieve the stored order
            indices = JSON.parse(sessionStorage.getItem('indices' + i));
        }

        // Reorder elements based on indices
        indices.forEach(function(index) {
            ul.appendChild(children[index]);
        });
    }
}

run();
</script>
```

**Note**

The above JS script may change over time (as a result of updates, etc.). Make sure to always use the code in [`template.html`](https://github.com/huandney/Anki-Insert-Randomized-Lists/blob/main/template.html) for the most up-to-date version of the script.

## Configuration

There is no configuration for this add-on, except for the hotkey. You can set a custom hotkey for inserting randomized lists by following these steps:

On Anki 2.1:

1. Go to **Tools → Add-ons**, select the add-on in the list, and then click **Config**.
2. In the Hotkey field, enter the hotkey that you want to use.
3. Click **Save**.

The default hotkey is `Alt+Shift+L`.

## Troubleshooting

If you are having problems with the add-on, please check the following:

* Make sure that the JavaScript code is correctly inserted into the card template.

If you are still having problems, please contact the author of the add-on.

## Compatibility

This add-on has been tested on AnkiDroid, Ankiewb, and AnkiDesktop.
