define([
    "require",
    "js/script-disk-system"
], function () {
    const diskSystem = require("js/script-disk-system");

    function fakeIt(script) {
        this.intercepted = true;
        Object.defineProperty(this, "response", {
            get: () => {
                return script
            }
        })
        Object.defineProperty(this, "readyState", {
            get: () => 2
        })
        Object.defineProperty(this, "status", {
            get: () => 200
        });
    }

    function cancelIt(script) {
        this.intercepted = true;
        Object.defineProperty(this, "response", {
            get: () => {
                return `error("${script} does not exist")`
            }
        })
        Object.defineProperty(this, "readyState", {
            get: () => 2
        })
        Object.defineProperty(this, "status", {
            get: () => 200
        });
        console.log(this);
    }

    const rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        const path = arguments[1];

        if (path.startsWith("/internal/")) {
            let name = arguments[1].substr(10);
            const code = diskSystem.get(name);
            if (code) {
                fakeIt.call(this, code)
            }
            return
        }

        /**
         * This is to prevent the built in lua
         * require() from making XHR calls lua/
         */
        if (path.startsWith("lua/")) {
            let name = arguments[1].substr(4);
            cancelIt.call(this, name)
            return
        }
        return rawOpen.apply(this, arguments);
    }

    const rawSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this.intercepted) {
            return;
        }
        return rawSend.apply(this, arguments);
    }
});