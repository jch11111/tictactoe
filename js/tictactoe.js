var tictactoe = (function () {

    var ROW = 1,
        COLUMN = 2,
        COMPUTER = true,
        USER = false,
        X = 'X',
        Y = 'Y',
        rowAndColumnHeight = 75,
        nonClickableDivider = 5,
        gameGrid = {
            squares: [
                { origin: { x: 0, y: 0 }, position: {row: 1, col: 1, diag1: true } },
                { origin: { x: rowAndColumnHeight, y: 0 }, position: {row: 1, col: 2} },
                { origin: { x: rowAndColumnHeight * 2, y: 0 }, position: {row: 1, col: 3, diag2: true } },
                { origin: { x: 0, y: rowAndColumnHeight }, position: {row: 2, col: 1 } },
                { origin: { x: rowAndColumnHeight, y: rowAndColumnHeight }, position: {row: 2, col: 2, diag1: true, diag2: true } },
                { origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight }, position: {row: 2, col: 3 } },
                { origin: { x: 0, y: rowAndColumnHeight * 2 }, position: {row: 3, col: 1, diag2: true } },
                { origin: { x: rowAndColumnHeight, y: rowAndColumnHeight * 2 }, position: {row: 3, col: 2 } },
                { origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight * 2 }, position: {row: 3, col: 3, diag1: true } }
            ],
            getRowOrColumn: function (rowOrColumn, rowOrColumnNumber) {
                return this.squares.filter(function (square) {
                    if ('diag1' === rowOrColumn || 'diag2' === rowOrColumn) {
                        return square.position[rowOrColumn];
                    } else {
                        return square.position[rowOrColumn] === rowOrColumnNumber;
                    }
                })
                .map(function (square) {
                    return square.xOrY;
                })
                .join('');
            }
        },
        padding = 0.2 * rowAndColumnHeight,
        whoseTurn = USER,
        XXX = 'XXX',
        YYY = 'YYY';

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
        if (COMPUTER === whoseTurn) {
            return;
        }

        var squareNumber = getSquareNumber(x, y);

        if (isNaN(squareNumber)) {
            return;
        }

        if (gameGrid.squares[squareNumber].xOrY) {
            return;  //square is already taken
        }

        setSquareSelected(squareNumber, X);
        drawX(squareNumber);

        if (checkIfGameOver()) {
            alert('game over!');
        }

        whoseTurn = !whoseTurn;

        doComputersTurn();
    }

    function checkIfGameOver() {
        var howManySquaresTaken = gameGrid.squares.filter(function (square) {
            return square.xOrY;
        }).length;

        if (9 === howManySquaresTaken) {
            return true;
        }

        for (var row = 1; row <= 3; row++) {
            var gameRow = gameGrid.getRowOrColumn('row', row);
            if (gameRow === XXX || gameRow === YYY) {
                return true;
            }
        }

        if (checkForWinningRowOrColumn('row')
            || checkForWinningRowOrColumn('col')
            || checkForWinningRowOrColumn('diag1')
            || checkForWinningRowOrColumn('diag2')) {
            alert('game over');
        }

        function checkForWinningRowOrColumn(rowsOrColumns) {
            for (var rowOrColumn = 1; rowOrColumn <= 3; rowOrColumn++) {
                var gameRowOrColumn = gameGrid.getRowOrColumn(rowsOrColumns, rowOrColumn);
                if (gameRowOrColumn === XXX || gameRowOrColumn === YYY) {
                    return true;
                }
            }
            return false;
        }

        return false;
    }

    function addSquareValues(squares) {
        squares.reduce(function (a, b) {
            return a + b;
        })
    }

    function setSquareSelected(squareNumber, xOrY) {
        gameGrid.squares[squareNumber].xOrY = xOrY;
    }

    function doComputersTurn() {
        console.log('computers turn');

        whoseTurn = !whoseTurn;
    }

    function drawX(squareNumber) {
        var squareOriginX = gameGrid.squares[squareNumber].origin.x,
            squareOriginY = gameGrid.squares[squareNumber].origin.y,
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
        var squareOriginX = gameGrid.squares[squareNumber].origin.x,
            squareOriginY = gameGrid.squares[squareNumber].origin.y,
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