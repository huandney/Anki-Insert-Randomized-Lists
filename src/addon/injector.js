// Adds the configured ul.shuffle style to every editor field; each field lives in its own shadow root
(() => {
    const NoteEditor = require("anki/NoteEditor");
    const { get } = require("svelte/store");

    async function styleFields(css) {
        while (!NoteEditor.instances[0]?.fields?.length) await new Promise(requestAnimationFrame);

        for (const field of NoteEditor.instances[0].fields) {
            const editable = await get(field.editingArea.editingInputs)[0].element;
            const root = editable.getRootNode();
            if (root.querySelector("style[data-randomized-lists]")) continue;

            const style = document.createElement("style");
            style.dataset.randomizedLists = "";
            style.textContent = `ul.shuffle { ${css} }`;
            root.appendChild(style);
        }
    }

    globalThis.RandomizedLists = { styleFields };
})();
