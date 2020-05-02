define([
    "require", 
    "vs/editor/editor.main", 
    "js/lua-system",
    "js/render-system",
    "js/xhr-intercepter",
], function (require) {
    const monaco = require("vs/editor/editor.main");
    const LuaSystem = require("js/lua-system");
    const renderSystem = require("js/render-system");

    let editor;
    const selector = document.getElementById("selector")
    const dragger = document.getElementById("dragger")
    const leftCol = document.getElementById("leftCol")
    const rightCol = document.getElementById("rightCol")
    const help = document.getElementById("help")
    const overlay = document.getElementById("overlay")
    const saveInput = document.getElementById("savename")

    let defaultText = "";
    let savedScripts = {};

    if ("localStorage" in window ) {
        saveInput.addEventListener("keyup", (e) => {
            if (e.key == "Enter") {
                const name = "user/" + saveInput.value;
                localStorage.setItem("script:" + name, editor.getValue())
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = name;
                selector.appendChild(opt)

                const savedScriptsKeys = localStorage.getItem("Saved Scripts")
                if (savedScriptsKeys) {
                    const keys = savedScriptsKeys.split(",");
                    if (!(name in keys)) {
                        keys.push(name);
                        localStorage.setItem("Saved Scripts", JSON.stringify(keys))
                    }
                } else {
                    localStorage.setItem("Saved Scripts", JSON.stringify([name]))
                }
                saveInput.style.backgroundColor = "rgb(200, 255, 200)"
            }
        })

        const saved = localStorage.getItem("Saved Text")
        if (saved != "") {
            defaultText = saved;
        }

        const sawHelp = localStorage.getItem("Saw Help");
        if (sawHelp !== "yes") {
            localStorage.setItem("Saw Help", "yes");
            getHelp();
        }

        const savedScriptsKeys = localStorage.getItem("Saved Scripts")
        if (savedScriptsKeys) {
            JSON.parse(savedScriptsKeys).forEach(function (key) {
                let code = localStorage.getItem("script:" + key);
                if (code) {
                    savedScripts[key] = code;
                    const opt = document.createElement("option");
                    opt.value = key;
                    opt.textContent = key;
                    selector.appendChild(opt)
                }
            });
        }
    } else {
        input.hidden = true;
    }
    
    function toggleHelp() {
        if (help.classList.contains("show")) {
            hideHelp();
        } else {
            getHelp();
        }
    }
    window.toggleHelp = toggleHelp;

    function getHelp() {
        help.classList.add("show");
        overlay.classList.add("show");
    }

    function hideHelp() {
        help.classList.remove("show");
        overlay.classList.remove("show");
    }

    // Draggerbar
    let leftWidth = Math.min(800, window.innerWidth / 2);
    leftCol.width = leftWidth;

    let draggerDownX = null;
    dragger.addEventListener("mousedown", (e) => {
        draggerDownX = e.x;
        editor.getDomNode().hidden = true;
        renderSystem.hide();
    });

    window.addEventListener("mousemove", (e) => {
        if (draggerDownX === null) return;
        leftCol.width = leftWidth + e.x - draggerDownX
    });

    window.addEventListener("mouseup", () => {
        if (draggerDownX === null) return;
        draggerDownX = null;
        leftWidth = leftCol.clientWidth;
        onResize()
        editor.getDomNode().hidden = false;
        renderSystem.show();
        runLua();
    })


    editor = monaco.editor.create(document.getElementById('input'), {
        value: defaultText,
        minimap: {enabled: false},
        language: 'lua'
    });

    function onResize() {
        renderSystem.resize();
        const width = editor.getDomNode().parentElement.parentElement.parentElement.clientWidth;
        const height = editor.getDomNode().parentElement.parentElement.parentElement.clientHeight;
        editor.layout({width: width, height: height});
    }

    let lastCode = "";
    let lua;


    let debounceTimeout;
    let isRunning = false;
    function runLua(now) {
        if (lua) {
            lua.stop();
        }
        if (!now) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => runLua(true), 400);
            return;
        }
        lua = new LuaSystem();
        try {
            renderSystem.clear();
            renderSystem.resize()
            const value = editor.getValue();
            lua.run(value);
            if ("localStorage" in window ) {
                localStorage.setItem("Saved Text", value)
            }   
        } catch (e) {
        }
    }

    function loadScript(name) {
        if (name.startsWith("user/")) {
            const code = localStorage.getItem("script:" + name);
            if (code) {
                editor.setValue(code)
                saveInput.style.backgroundColor = "#FFFFFF"
                lastCode = code;
                runLua()
            }
        }
        else
        {
            fetch("./lua/examples/" + name)
            .then((r) => {
                return r.text()
            })
            .then((t) => {
                editor.setValue(t)
                saveInput.style.backgroundColor = "#FFFFFF"
                lastCode = t;
                runLua()
            });
        }
        
    }


    selector.onchange = function () {
        if (this.value != "") {
            loadScript(this.value)
        }
    }
    editor.onKeyUp(() => {
        runLua();
    });

    window.addEventListener("resize", function () {
        onResize()
        runLua()
    });

    require("js/xhr-intercepter")().then(() => {
        if (!defaultText) {
            selector.value = "orderbook.lua"
            loadScript("orderbook.lua")
        }
        onResize()
        runLua()
    });
});