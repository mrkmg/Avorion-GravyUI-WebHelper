define([
], function () {
    class Eventing {
        #callbacks = [];
        name = ""

        constructor(name) {
            this.name = name;
        }

        listen(cb) {
            this.#callbacks.push(cb)
        }

        trigger() {
            this.#callbacks.forEach(cb => {
                setTimeout(() => cb.apply(null, arguments), 0)
            });
        }
    }

    return Eventing;
})