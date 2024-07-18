(() => {
  const { defineProperty: defProp, getOwnPropertyNames, hasOwnProperty: hasOwnProp } = Object;

  const defNormalProp = (obj, key, value) => key in obj ? defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;

  const spreadValues = (a, b) => {
    for (const prop in b || (b = {})) if (hasOwnProp.call(b, prop)) defNormalProp(a, prop, b[prop]);
    return a;
  };

  const asyncWrapper = (thisArg, _arguments, generator) => new Promise((resolve, reject) => {
    const step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(v => step(generator.next(v)), e => step(generator.throw(e)));
    step((generator = generator.apply(thisArg, _arguments)).next());
  });

  const NoteEditor = require("anki/NoteEditor");
  const import_store = require("svelte/store");

  const setAttributes = (el, attrs) => {
    for (const key in attrs) el.setAttribute(key, attrs[key]);
  };

  const injectStylesheet = (root, css) => {
    const style = document.createElement("style");
    style.title = "CSS Injector Field Styles";
    style.type = "text/css";
    style.innerHTML = css;
    root.appendChild(style);
  };

  const inject = (editable, attrs, customStyle) => {
    editable.classList.add(...document.body.classList);
    setAttributes(editable, attrs);
    const root = editable.getRootNode();
    if (!root.querySelector("style[title*='CSS Injector']")) {
      injectStylesheet(root, `ul.shuffle { ${customStyle} }`);
    }
  };

  const StyleInjector = {
    update: function({ fieldNames, attrs, customStyle }) {
      return asyncWrapper(this, arguments, function* () {
        setAttributes(document.documentElement, spreadValues({}, attrs));
        while (!(NoteEditor.instances[0]?.fields?.length)) yield new Promise(requestAnimationFrame);
        NoteEditor.instances[0].fields.forEach((field, i) => {
          const richText = import_store.get(field.editingArea.editingInputs)[0];
          richText.element.then(element => inject(element, spreadValues({ field: fieldNames[i], ord: i + 1 }, attrs), customStyle));
        });
      });
    }
  };

  globalThis.StyleInjector = StyleInjector;
})();