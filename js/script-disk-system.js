define([

], function () {
    const diskSystem = {};
    const builtInScripts = [
        "lib.lua",
        "gravyui/node.lua",
        "gravyui/plugins/splitting.lua",
        "gravyui/plugins/resizing.lua",
        "gravyui/plugins/translating.lua",
        "examples/showcase.lua",
        "examples/orderbook.lua",
        "examples/windmill.lua",
        "examples/dialog.lua",
        "examples/extending.lua",
        "examples/face.lua",
        "examples/tradingui.lua"
    ];
    
    function init() {
        const promises = [];
        builtInScripts.forEach((name) => {
            promises.push(
                fetch(`./lua/${name}`)
                    .then(response => response.text())
                    .then(text => diskSystem[name] = text)
            )
        });
        return Promise.all(promises);
    }

    return {
        init,
        get(script) {
            if (diskSystem.hasOwnProperty(script))
            return diskSystem[script];
        },
        set(script, code) {
            diskSystem[script] = code;
        },
        remove(script) {
            diskSystem[script] = "";
            delete diskSystem[script];
        }
    }
});