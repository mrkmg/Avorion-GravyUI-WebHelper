define([], function () {
    return function () {
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
    
        const rawOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            const fake = (script) => {
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
    
            if (arguments[1].startsWith("./lua/5.3/user/")) {
                let name = arguments[1].substr(10);
                name = name.substr(0, name.length - 4);
                const code = localStorage.getItem("script:" + name)
                if (code) {
                    fake(code)
                    return
                }
            }
    
            if (cachedNames.includes(arguments[1])) {
                fake(cachedResults[cachedNames.indexOf(arguments[1])]);
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

        return Promise.all(promises)
    }
    
});