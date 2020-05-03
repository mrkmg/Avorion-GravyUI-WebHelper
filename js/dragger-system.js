define([
    "require",
    "js/eventing"
], function (require) {
    const Eventing = require("js/eventing");

    const leftCol = document.getElementById("leftCol")
    const rightCol = document.getElementById("rightCol")
    const dragger = document.getElementById("dragger")
    
    const onStart = new Eventing("drgger:onStart")
    const onEnd = new Eventing("drgger:onEnd")

    let leftWidth = Math.min(800, window.innerWidth / 2);
    leftCol.width = leftWidth;

    let draggerDownX = null;
    dragger.addEventListener("mousedown", (e) => {
        draggerDownX = e.x;
        onStart.trigger();
    });

    window.addEventListener("mousemove", (e) => {
        if (draggerDownX === null) return;
        leftCol.width = leftWidth + e.x - draggerDownX
    });

    window.addEventListener("mouseup", () => {
        if (draggerDownX === null) return;
        draggerDownX = null;
        leftWidth = leftCol.clientWidth;
        onEnd.trigger();
    });

    return {
        onStart,
        onEnd
    }
});