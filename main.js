require.config({ paths: { 
    'vs': './monaco/min/vs'
 }});

let editor;
require(['vs/editor/editor.main'], function() {
    const renderEle = document.getElementById("render")
    const selector = document.getElementById("selector")
    const renderCtx = renderEle.getContext("2d");
    const dragger = document.getElementById("dragger")
    const leftCol = document.getElementById("leftCol")
    const rightCol = document.getElementById("rightCol")
    const help = document.getElementById("help")
    const overlay = document.getElementById("overlay")


    let defaultText = "";

    if ("localStorage" in window ) {
        const saved = localStorage.getItem("Saved Text")
        if (saved != "") {
            defaultText = saved;
        }

        const sawHelp = localStorage.getItem("Saw Help");
        console.log(sawHelp)
        if (sawHelp !== "yes") {
            localStorage.setItem("Saw Help", "yes");
            getHelp();
        }
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
        runLua();
    })


    editor = monaco.editor.create(document.getElementById('input'), {
        value: defaultText,
        minimap: {enabled: false},
        language: 'lua'
    });

    const lua = fengari.lua;

    renderCtx.imagesSmoothingEnabled = false

    let lastPrintOffset = 0;
    let globalFontColor = "black";

    function onResize() {
        renderEle.width = renderEle.parentElement.clientWidth;
        renderEle.height = renderEle.parentElement.clientHeight;
        const width = editor.getDomNode().parentElement.parentElement.parentElement.clientWidth;
        const height = editor.getDomNode().parentElement.parentElement.parentElement.clientHeight;
        editor.layout({width: width, height: height});
    }

    function runLua() {
        const L = fengari.lauxlib.luaL_newstate();
        const value = editor.getValue();
        if ("localStorage" in window ) {
            localStorage.setItem("Saved Text", value)
        }        
        const luaCode = fengari.to_luastring(value);

        fengari.lualib.luaL_openlibs(L);
        lua.lua_register(L, "getResolution", getResolution);
        lua.lua_register(L, "sprint", sprint);
        lua.lua_register(L, "DrawText", DrawText);
        lua.lua_register(L, "DrawTextL", DrawTextL);
        lua.lua_register(L, "DrawRect", DrawRect);

        fengari.lauxlib.luaL_loadstring(L, luaCode)

        try {
            renderCtx.clearRect(0, 0, renderEle.width, renderEle.height);
            lastPrintOffset = 0;
            globalFontColor = "black";
            lua.lua_call(L, 0, -1)
            lua.lua_getglobal(L, "FONTCOLOR")
            if (!lua.lua_isnil(L, -1)) {
                globalFontColor = lua.lua_tojsstring(L, -1)
                lua.lua_pop(L, 1)
            }
            lua.lua_getglobal(L, "main")
            if (!lua.lua_isnil(L, -1)) {
                lua.lua_call(L, 0, 0)
            }
            lua.lua_close(L)
        } catch (e) {
            renderCtx.clearRect(0, 0, renderEle.width, renderEle.height);
            renderCtx.fillStyle = 'red';
            renderCtx.fillText(e.toString(), 0, 48, renderEle.width);
            console.log(e)
        }
    }

    function getResolution(L) {
        lua.lua_pushnumber(L, renderEle.clientWidth)
        lua.lua_pushnumber(L, renderEle.clientHeight)
        return 2
    }

    function sprint(L) {
        const s = [];
        while (lua.lua_gettop(L) > 0) {
            s.unshift(lua.lua_tojsstring(L, -1))
            lua.lua_pop(L, 1)
        }
        renderCtx.fillStyle = 'white';
        renderCtx.fillText(s.join(", "), 0, 20 * (lastPrintOffset + 1), renderEle.width);
        lastPrintOffset++;
        return 0
    }

    function processDisplayTable(L) {
        lua.lua_pushliteral(L, "rect")
        lua.lua_gettable(L, -2)

        lua.lua_pushliteral(L, "topLeft")
        lua.lua_gettable(L, -2)

        lua.lua_pushliteral(L, "x")
        lua.lua_gettable(L, -2)
        const x1 = lua.lua_tonumber(L, -1)
        lua.lua_pop(L, 1)

        lua.lua_pushliteral(L, "y")
        lua.lua_gettable(L, -2)
        const y1 = lua.lua_tonumber(L, -1)
        lua.lua_pop(L, 2)

        lua.lua_pushliteral(L, "bottomRight")
        lua.lua_gettable(L, -2)

        lua.lua_pushliteral(L, "x")
        lua.lua_gettable(L, -2)
        const x2 = lua.lua_tonumber(L, -1)
        lua.lua_pop(L, 1)

        lua.lua_pushliteral(L, "y")
        lua.lua_gettable(L, -2)
        const y2 = lua.lua_tonumber(L, -1)
        lua.lua_pop(L, 3)

        return {x1: x1, y1: y1, x2: x2, y2: y2}
    }

    function DrawRect(L) {
        let color = null;
        if (lua.lua_gettop(L) == 2) {
            color = lua.lua_tojsstring(L, -1)
            lua.lua_pop(L, 1)
        }
        const pos = processDisplayTable(L)
        renderCtx.strokeStyle = "black";
        renderCtx.lineWidth = "1"
        const w = pos.x2 - pos.x1;
        const h = pos.y2 - pos.y1
        if (color !== null) {
            renderCtx.fillStyle = color;
            renderCtx.fillRect(pos.x1, pos.y1, w, h);
        }
        renderCtx.strokeRect(pos.x1, pos.y1, w, h);
        return 0;
    }

    function DrawTextL(L) {
        return DrawText(L, true)
    }

    function DrawText(L, left) {
        let color = null;
        let size = null;
        while (lua.lua_gettop(L) >= 3) {
            if (lua.lua_isnumber(L, -1) && size === null) {
                size = lua.lua_tonumber(L, -1)
                lua.lua_pop(L, 1)
            } else if (lua.lua_isstring(L, -1) && color === null) {
                color = lua.lua_tojsstring(L, -1)
                lua.lua_pop(L, 1)
            } else {
                throw new Error("Unexpected Argument");
            }
        }
        if (color === null) color = globalFontColor;
        if (size === null) size = 20;
        const text = lua.lua_tojsstring(L, -1)
        lua.lua_pop(L, 1)
        const pos = processDisplayTable(L)
        lua.lua_pop(L, 1)
        const rectWidth = pos.x2 - pos.x1;
        const rectHeight = pos.y2 - pos.y1
        renderCtx.fillStyle = color;
        if ((size * 1.5) > rectHeight) {
            size *= rectHeight / (size * 1.5);
        }
        let textWidth;
        do {
            renderCtx.font = "600 " + size.toString() + "px 'Open Sans'";
            textWidth = renderCtx.measureText(text).width
        } while (textWidth > rectWidth && --size)
        renderCtx.font = "600 " + size.toString() + "px 'Open Sans'";
        mWidth = renderCtx.measureText(text).width
        const lOffset = left ? 0 : (rectWidth/2 - mWidth/2)
        renderCtx.fillText(text, Math.round(pos.x1 + lOffset), Math.round(pos.y1 + rectHeight/2 + size * .35));
        return 0;
    }

    function loadScript(name) {
        fetch("./lua/examples/" + name)
            .then((r) => {
                return r.text()
            })
            .then((t) => {
                editor.setValue(t)
                runLua()
            });
    }


    selector.onchange = function () {
        if (this.value != "") {
            loadScript(this.value)
        }
    }


    let debounceTimeout;
    editor.onKeyUp(() => {
            clearTimeout(debounceTimeout);
            setTimeout(runLua, 400);
    });

    window.addEventListener("resize", function () {
        onResize()
        runLua()
    });


    const cachedNames = [
        "./lua/5.3/lib.lua",
        "./lua/5.3/gravyui/node.lua",
        "./lua/5.3/gravyui/plugins/splitting.lua",
        "./lua/5.3/gravyui/plugins/resizing.lua",
        "./lua/5.3/gravyui/plugins/translating.lua",
    ]
    const cachedResults = [];
    const promises = [];
    cachedNames.forEach((name, index) => {
        promises.push(
            fetch(name + "?2").then(r => r.text()).then(r => cachedResults[index] = r)
        )
    });

    Promise.all(promises)
    .then(function () {
        if (!defaultText) {
            selector.value = "orderbook.lua"
            loadScript("orderbook.lua")
        }

        onResize()
        runLua()
    });

    var rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        if (cachedNames.includes(arguments[1])) {
            this.intercepted = true;
            Object.defineProperty(this, "response", {
                get: () => {
                    return cachedResults[cachedNames.indexOf(arguments[1])]
                }
            })
            Object.defineProperty(this, "readyState", {
                get: () => 2
            })
            Object.defineProperty(this, "status", {
                get: () => 200
            })
            return
        }
        return rawOpen.apply(this, arguments);
    }

    var rawSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this.intercepted) {
            return;
        }
        return rawSend.apply(this, arguments);
    }
});