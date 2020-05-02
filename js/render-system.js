define([
    "require",
], function (require) {
    const element = document.getElementById("render");
    const context = element.getContext("2d");

    // context.imagesSmoothingEnabled = false

    return {
        getResolution: () => ({
            x: element.clientWidth,
            y: element.clientHeight,
        }),
        clear: () => context.clearRect(0, 0, element.clientWidth, element.clientHeight),
        hide: () => element.hidden = true,
        show: () => element.hidden = false,
        resize: () => {
            element.hidden = true;
            element.width = element.parentElement.clientWidth;
            element.height = element.parentElement.clientHeight;
            element.hidden = false;
        },
        drawRect: (x1, y1, x2, y2, fillColor, strokeColor) => {
            const w = x2 - x1;
            const h = y2 - y1
            if (fillColor !== null) {
                context.fillStyle = fillColor;
                context.fillRect(x1, y1, w, h);
            }
            if (strokeColor !== null) {
                context.strokeStyle = strokeColor;
                context.lineWidth = "1"
                context.strokeRect(x1, y1, w, h);
            }
        },
        drawText: (x1, y1, x2, y2, text, color, size, align) => {
            const rectWidth = x2 - x1;
            const rectHeight = y2 - y1
            context.fillStyle = color;
            if ((size * 1.5) > rectHeight) {
                size *= rectHeight / (size * 1.5);
            }
            let textWidth;
            do {
                context.font = "600 " + size.toString() + "px 'Open Sans'";
                textWidth = context.measureText(text).width
            } while (textWidth > rectWidth && --size)
            context.font = "600 " + size.toString() + "px 'Open Sans'";
            mWidth = context.measureText(text).width
            const lOffset = align == "left" ? 0 // left
                          : align == "middle" ? (rectWidth/2 - mWidth/2) // middle
                          : (rectWidth - mWidth); // Right
            context.fillText(text, Math.round(x1 + lOffset), Math.round(y1 + rectHeight/2 + size * .35));
        }
    }
});