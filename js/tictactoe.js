var tictactoe = (function () {

    var VERTICAL = 0,
        HORIZONTAL = 1,
        rowAndColumnHeight = 75,
        nonClickableDivider = 5,
        gameGrid = [
            { origin: { x: 0, y: 0 } },
            { origin: { x: rowAndColumnHeight, y: 0 } },
            { origin: { x: rowAndColumnHeight * 2, y: 0 } },
            { origin: { x: 0, y: rowAndColumnHeight } },
            { origin: { x: rowAndColumnHeight, y: rowAndColumnHeight } },
            { origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight } },
            { origin: { x: 0, y: rowAndColumnHeight * 2 } },
            { origin: { x: rowAndColumnHeight, y: rowAndColumnHeight * 2 } },
            { origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight * 2 } }
        ],
        padding = 0.2 * rowAndColumnHeight;

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
        if (isNaN(squareNumber)) {
            return;
        }
        squareNumber % 2 === 0 ? drawO(squareNumber) : drawX(squareNumber);
    }

    function drawX(squareNumber) {
        var squareOriginX = gameGrid[squareNumber].origin.x,
            squareOriginY = gameGrid[squareNumber].origin.y,
            startX = squareOriginX + padding,
            startY = squareOriginY + padding,
            endX = startX + rowAndColumnHeight - (2 * padding),
            endY = startY + rowAndColumnHeight - (2 * padding),
            temp;

        $('canvas').drawLine({
            strokeStyle: '#F00',
            strokeWidth: 5,
            x1: startX, y1: startY,
            x2: endX, y2: endY
        });

        temp = startY;
        startY = endY;
        endY = temp;

        $('canvas').drawLine({
            strokeStyle: '#F00',
            strokeWidth: 5,
            x1: startX, y1: startY,
            x2: endX, y2: endY
        });
    }

    function drawO(squareNumber) {
        var squareOriginX = gameGrid[squareNumber].origin.x,
            squareOriginY = gameGrid[squareNumber].origin.y,
            centerX = squareOriginX + rowAndColumnHeight / 2,
            centerY = squareOriginY + rowAndColumnHeight / 2,
            circleWidthAndHeight = rowAndColumnHeight - (2 * padding);

        $('canvas').drawEllipse({
            strokeStyle: '#0F0',
            strokeWidth: 5,
            x: centerX, y: centerY,
            width: circleWidthAndHeight, height: circleWidthAndHeight
        });

    }

    function getSquareNumber(x, y) {
        var squareNumber,
            isFirstRow = nonClickableDivider < y && y < rowAndColumnHeight - nonClickableDivider,
            isSecondRow = rowAndColumnHeight + nonClickableDivider < y && y < rowAndColumnHeight * 2 - nonClickableDivider,
            isThirdRow = rowAndColumnHeight * 2 + nonClickableDivider < y && y < rowAndColumnHeight * 3 - nonClickableDivider,
            isFirstColumn = nonClickableDivider < x && x < rowAndColumnHeight - nonClickableDivider,
            isSecondColumn = rowAndColumnHeight + nonClickableDivider < x && x < rowAndColumnHeight * 2 - nonClickableDivider,
            isThirdColumn = rowAndColumnHeight * 2 + nonClickableDivider < x && x < rowAndColumnHeight * 3 - nonClickableDivider;

        if (isFirstRow) {
            squareNumber = (isFirstColumn) ? 0 : ((isSecondColumn ? 1 : (isThirdColumn ? 2: 0)));
        }

        if (isSecondRow) {
            squareNumber = (isFirstColumn) ? 3 : ((isSecondColumn ? 4 : (isThirdColumn ? 5 : 0)));
        }

        if (isThirdRow) {
            squareNumber = (isFirstColumn) ? 6 : ((isSecondColumn ? 7 : (isThirdColumn ? 8 : 0)));
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