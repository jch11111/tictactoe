//var game = (function () {
    var VERTICAL = 0,
        HORIZONTAL = 1;

    function drawLine(fromX, fromY, length, verticalOrHorizontal, width, color) {
        var x2, x3, x4, y2, y3, y4;

        if (VERTICAL === verticalOrHorizontal) {
            x2 = fromX;
            x3 = x4 = fromX - width;
            y2 = y3 = fromY + length;
            y4 = fromY;
        } else {
            y2 = fromY;
            y3 = y4 = fromY - width;
            x2 = x3 = fromX + length;
            x4 = fromX;
        }

        new Path()
            .moveTo(fromX, fromY)
            .lineTo(x2, y2)
            .lineTo(x3, y3)
            .lineTo(x4, y4)
            .closePath()
            .fill(color)
            .addTo(stage);
    }
/*
    return {
        drawLine: drawLine
    }
})();
*/

    drawLine(75, 0, 225, 0, 2, '#0F050E');
    drawLine(150, 0, 225, 0, 2, '#0F050E');
    drawLine(0, 75, 225, 1, 2, '#0F050E');
    drawLine(0, 150, 225, 1, 2, '#0F050E');

