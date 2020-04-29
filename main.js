const defaultText = `require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()
local w, h = 300, 300

local window = Node(w, h):offset(x/2 - w/2, y/2 - h/2)
local left, right = window:cols(2, 40)

Display(window, "red")
Display(left, "green")
Display(right, "blue")

-- Add more nodes yourself!

`;

require.config({ paths: { 
    'vs': './monaco/min/vs'
 }});

let editor;
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('input'), {
        value: defaultText,
        language: 'lua'
    });

    const renderEle = document.getElementById("render")
    const selector = document.getElementById("selector")
    const renderCtx = renderEle.getContext("2d");
    const lua = fengari.lua;

    renderCtx.imagesSmoothingEnabled = false
    renderEle.width = renderEle.parentElement.clientWidth;
    renderEle.height = renderEle.parentElement.clientHeight - 2;

    let lastPrintOffset = 0;

    function runLua() {
        const L = fengari.lauxlib.luaL_newstate();
        const luaCode = fengari.to_luastring(editor.getValue());

        fengari.lualib.luaL_openlibs(L);
        lua.lua_register(L, "Display", Display);
        lua.lua_register(L, "getResolution", getResolution);
        lua.lua_register(L, "sprint", sprint);

        fengari.lauxlib.luaL_loadstring(L, luaCode)

        try {
            renderCtx.clearRect(0, 0, renderEle.width, renderEle.height);
            lastPrintOffset = 0;
            lua.lua_call(L, 0, -1)
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

    function Display(L) {
        let strokeColor = "#000000";
        let fillColor = "#FFFFFF";

        if (lua.lua_gettop(L) == 3) {
            strokeColor = lua.lua_tojsstring(L, -1)
            lua.lua_pop(L, 1)
        }
        if (lua.lua_gettop(L) == 2) {
            fillColor = lua.lua_tojsstring(L, -1)
            lua.lua_pop(L, 1)
        }

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
        lua.lua_pop(L, 2)

        console.log("Rendering", x1, x2, y1, y2)
        renderCtx.fillStyle = fillColor;
        renderCtx.strokeStyle = strokeColor;
        renderCtx.lineWidth = "1"
        renderCtx.fillRect(x1, y1, x2 - x1, y2 - y1);
        renderCtx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        return 0
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
        renderEle.width = renderEle.parentElement.clientWidth;
        renderEle.height = renderEle.parentElement.clientHeight - 2;
        editor.layout();
        runLua()
    })


    const cachedNames = [
        "./lua/5.3/lib.lua",
        "./lua/5.3/gravyui/node.lua",
        "./lua/5.3/gravyui/plugins/cols.lua",
        "./lua/5.3/gravyui/plugins/grid.lua",
        "./lua/5.3/gravyui/plugins/offset.lua",
        "./lua/5.3/gravyui/plugins/rows.lua",
        "./lua/5.3/gravyui/plugins/pad.lua"
    ]
    const cachedResults = [];
    const promises = [];
    cachedNames.forEach((name, index) => {
        promises.push(
            fetch(name).then(r => r.text()).then(r => cachedResults[index] = r)
        )
    });

    Promise.all(promises)
    .then(function () {
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