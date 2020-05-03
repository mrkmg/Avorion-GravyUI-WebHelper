define([
    "require",
    "js/eventing",
    "vs/editor/editor.main", 
], function(require) {
    const editor = monaco.editor.create(document.getElementById('input'), {
        value: "",
        minimap: {enabled: false},
        language: 'lua'
    });

    const onChange = new (require("js/eventing"))("editor:onChange");
    editor.onDidChangeModelContent((e) => {
        onChange.trigger(editor.getValue());
    });
    
    return {
        onChange,
        getCode: () => editor.getValue(),
        setCode: (code) => editor.setValue(code),
        hide: () => editor.getDomNode().hidden = true,
        show: () => editor.getDomNode().hidden = false,
        resize: () => {
            editor.getDomNode().hidden = true;
            const width = editor.getDomNode().parentElement.parentElement.parentElement.clientWidth;
            const height = editor.getDomNode().parentElement.parentElement.parentElement.clientHeight;
            editor.layout({width, height});
            editor.getDomNode().hidden = false;
        }
    }
});