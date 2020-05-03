define([
    "require", 
    "js/lua-system",
    "js/render-system",
    "js/xhr-intercepter",
    "js/editor-system",
    "js/dragger-system",
    "js/script-disk-system",
    "js/user-scripts-system",
    "js/help-system"
], function (require) {
    const LuaSystem = require("js/lua-system");
    const renderSystem = require("js/render-system");
    const editorSystem = require('js/editor-system');
    const draggerSystem = require("js/dragger-system");
    const diskSystem = require("js/script-disk-system");
    const userScriptsSystem = require("js/user-scripts-system");

    editorSystem.onChange.listen(() => {
        runLua(false);
    })

    draggerSystem.onStart.listen(() => {
        editorSystem.hide();
        renderSystem.hide();
    });

    draggerSystem.onEnd.listen(() => {
        editorSystem.show();
        renderSystem.show();
        onResize();
    });

    function onResize() {
        renderSystem.resize();
        editorSystem.resize();
        runLua(false);
    }

    let lua;
    let debounceTimeout;
    function runLua(now) {
        if (lua) {
            lua.stop();
        }
        clearTimeout(debounceTimeout);
        if (!now) {
            debounceTimeout = setTimeout(() => runLua(true), 600);
            return;
        }
        lua = new LuaSystem();
        const code = editorSystem.getCode();
        lua.run(code).then(() => {
            lua = null;
            userScriptsSystem.storeLast(code);
        }, (e) => {
            console.error(e);
        });
    }

    window.addEventListener("resize", function () {
        onResize()
    });

    diskSystem.init().then(() => {
        userScriptsSystem.init();
        onResize()
    });
});