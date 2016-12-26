var tictactoe = (function () {

    var VERTICAL = 0,
        HORIZONTAL = 1,
        rowAndColumnHeight = 75,
        buffer = 5,
        gameGrid = {
            '1': { origin: { x: 0, y: 0 } },
            '2': { origin: { x: rowAndColumnHeight, y: 0 } },
            '3': { origin: { x: rowAndColumnHeight * 2, y: 0 } },
            '4': { origin: { x: 0, y: rowAndColumnHeight } },
            '5': { origin: { x: rowAndColumnHeight, y: rowAndColumnHeight } },
            '6': { origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight } },
            '7': { origin: { x: 0, y: rowAndColumnHeight*2 } },
            '8': { origin: { x: rowAndColumnHeight, y: rowAndColumnHeight*2 } },
            '9': { origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight*2 } },
        }

    function init() {
        $(function () {
            setEventHandlers();
            drawGame();
        })
    };

    function setEventHandlers() {
        $('canvas').click(function (e) {
            handleCanvasClick(e.offsetX, e.offsetY)
        });
    }

    function handleCanvasClick(x, y) {
        var squareNumber = getSquareNumber(x, y);
        console.log(squareNumber);
        drawX(squareNumber);
    }

    function drawX(squareNumber) {
        var squareOriginX = gameGrid[squareNumber].origin.x,
            squareOriginY = gameGrid[squareNumber].origin.y,
            padding = 0.2 * rowAndColumnHeight,
            startX = squareOriginX + padding,
            startY = squareOriginY + padding,
            endX = startX + rowAndColumnHeight - (2 * padding),
            endY = startY + rowAndColumnHeight - (2 * padding),
            temp;

        $('canvas').drawLine({
            strokeStyle: '#000',
            strokeWidth: 5,
            x1: startX, y1: startY,
            x2: endX, y2: endY
        });

        temp = startY;
        startY = endY;
        endY = temp;

        $('canvas').drawLine({
            strokeStyle: '#000',
            strokeWidth: 5,
            x1: startX, y1: startY,
            x2: endX, y2: endY
        });
    }

    function getSquareNumber(x, y) {
        var squareNumber,
            isFirstRow = buffer < y && y < rowAndColumnHeight - buffer,
            isSecondRow = rowAndColumnHeight + buffer < y && y < rowAndColumnHeight * 2 - buffer,
            isThirdRow = rowAndColumnHeight * 2 + buffer < y && y < rowAndColumnHeight * 3 - buffer,
            isFirstColumn = buffer < x && x < rowAndColumnHeight - buffer,
            isSecondColumn = rowAndColumnHeight + buffer < x && x < rowAndColumnHeight * 2 - buffer,
            isThirdColumn = rowAndColumnHeight * 2 + buffer < x && x < rowAndColumnHeight * 3 - buffer;

        if (isFirstRow) {
            squareNumber = (isFirstColumn) ? 1 : ((isSecondColumn ? 2 : (isThirdColumn ? 3: 0)));
        }

        if (isSecondRow) {
            squareNumber = (isFirstColumn) ? 4 : ((isSecondColumn ? 5 : (isThirdColumn ? 6 : 0)));
        }

        if (isThirdRow) {
            squareNumber = (isFirstColumn) ? 7 : ((isSecondColumn ? 8 : (isThirdColumn ? 9 : 0)));
        }

        return squareNumber;
    }

    function drawGame() {
        $('canvas').drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: rowAndColumnHeight, y1: 0,
            x2: rowAndColumnHeight, y2: rowAndColumnHeight*3
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: rowAndColumnHeight*2, y1: 0,
            x2: rowAndColumnHeight*2, y2: rowAndColumnHeight*3
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: 0, y1: rowAndColumnHeight,
            x2: rowAndColumnHeight*3, y2: rowAndColumnHeight
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: 0, y1: rowAndColumnHeight*2,
            x2: rowAndColumnHeight*3, y2: rowAndColumnHeight*2
        })
    }

    return {
        init: init
    };
}());

tictactoe.init();