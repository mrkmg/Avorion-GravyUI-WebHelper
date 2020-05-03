define([
    "require",
    "js/script-disk-system",
    "js/editor-system",
], function (require) {
    const diskSystem = require("js/script-disk-system");
    const editorSystem = require("js/editor-system")

    const selector = document.getElementById("selector");
    const saveInput = document.getElementById("savename");
    const deleteButton = document.getElementById("delete");

    let currentFile = null;

    function openFile(name) {
        const code = diskSystem.get(name);
        if (name.startsWith("user/")) {
            deleteButton.hidden = false;
            currentFile = name;
        } else {
            deleteButton.hidden = true;
            currentFile = null;
        }
        
        if (name.startsWith("examples/") || name.startsWith("gravyui/")) {
            selector.value = name;
        }

        if (code !== null) {
            editorSystem.setCode(code);
        }
    }

    function saveFile(name, code) {
        diskSystem.set(name, code);
        localStorage.setItem(`saved-script:${name}`, code);
    }

    function init() {
        deleteButton.hidden = true;

        for ( let i = 0, len = localStorage.length; i < len; ++i ) {
            const key = localStorage.key(i);
            if (!key.startsWith("saved-script:user/"))
                continue;
            const name = key.substr(13);
            const code = localStorage.getItem(`saved-script:${name}`);
            diskSystem.set(name, code);
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = name;
            selector.childNodes[3].appendChild(opt);
        }

        const lastFile = localStorage.getItem("last-file")
        if (lastFile && lastFile.startsWith("user/")) {
            currentFile = lastFile;
            selector.value = lastFile;
            deleteButton.hidden = false;
        }

        const lastCode = localStorage.getItem(`last-code`);
        if (lastCode) {
            editorSystem.setCode(lastCode);
        }
        else {
            openFile("examples/orderbook.lua");
        }

    }

    selector.addEventListener("change", () => {
        const value = selector.value;
        if (value) {
            openFile(value);
        } else {
            currentFile = null;
            saveInput.value = "";
            editorSystem.setCode("");
        }
    });

    saveInput.addEventListener("keydown", (e) => {
        if (e.key == "Enter" && saveInput.value) {
            const name = `user/${saveInput.value}.lua`
            const code = editorSystem.getCode();
            saveFile(name, code);
            let inSelector = false;
            selector.childNodes[3].childNodes.forEach((c) => {
                if (c.value == name) inSelector = true;
            });
            if (!inSelector) {
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = name;
                selector.childNodes[3].appendChild(opt);
            }        
            selector.value = name;
        }
    });

    editorSystem.onChange.listen((code) => {
        if (currentFile && currentFile.startsWith("user/")) {
            saveFile(currentFile, code);
        }
    });

    deleteButton.addEventListener("click", () => {
        if (currentFile !== null && currentFile.startsWith("user/")) {
            selector.value = "";
            editorSystem.setCode("")
            diskSystem.remove(currentFile);
            localStorage.removeItem(`saved-script:${currentFile}`);
            
            for(let i in selector.childNodes[3].childNodes) {
                const c = selector.childNodes[3].childNodes[i];
                if (c.value == currentFile) {
                    selector.childNodes[3].removeChild(c)
                    break;
                }
            }
        }
    });

    return {
        init,
        storeLast: (code) => {
            localStorage.setItem("last-file", currentFile)
            localStorage.setItem("last-code", code);
        }
    };
});