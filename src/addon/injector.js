// Adds the configured ul.shuffle style to every rich-text field as it mounts; each field lives in its own shadow root
(css) => {
    const { lifecycle, instances } = require("anki/RichTextInput");

    async function styleField(input) {
        const editable = await input.element;
        const root = editable.getRootNode();
        if (root.querySelector("style[data-randomized-lists]")) return;

        const style = document.createElement("style");
        style.dataset.randomizedLists = "";
        style.textContent = `ul.shuffle { ${css} }`;
        root.appendChild(style);
    }

    // The fields already on the page, then each one mounted later (another note type, another note).
    // The mount callback returns nothing: older Anki versions call a returned value as its cleanup
    instances.forEach(styleField);
    lifecycle.onMount((input) => {
        styleField(input);
    });
}
