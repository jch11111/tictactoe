var tictactoe = (function () {

    var ROW = 1,
        COLUMN = 2,
        COMPUTER = true,
        USER = false,
        X = 'X',
        O = 'O',
        rowAndColumnHeight = 75,
        nonClickableDivider = 5,
        gameGrid = {
            squares: [
                {squareNumber: 0, origin: { x: 0, y: 0 }, position: {row: 0, col: 0, diag1: true } },
                {squareNumber: 1,  origin: { x: rowAndColumnHeight, y: 0 }, position: {row: 0, col: 1} },
                {squareNumber: 2,  origin: { x: rowAndColumnHeight * 2, y: 0 }, position: {row: 0, col: 2, diag2: true } },
                {squareNumber: 3,  origin: { x: 0, y: rowAndColumnHeight }, position: {row: 1, col: 0 } },
                {squareNumber: 4,  origin: { x: rowAndColumnHeight, y: rowAndColumnHeight }, position: {row: 1, col: 1, diag1: true, diag2: true } },
                {squareNumber: 5,  origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight }, position: {row: 1, col: 2 } },
                {squareNumber: 6,  origin: { x: 0, y: rowAndColumnHeight * 2 }, position: {row: 2, col: 0, diag2: true } },
                {squareNumber: 7,  origin: { x: rowAndColumnHeight, y: rowAndColumnHeight * 2 }, position: {row: 2, col: 1 } },
                {squareNumber: 8,  origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight * 2 }, position: {row: 2, col: 2, diag1: true } }
            ],
            getRowOrColumn: function (rowOrColumn, rowOrColumnNumber) {
                return this.squares.filter(function (square) {
                    if ('diag1' === rowOrColumn || 'diag2' === rowOrColumn) {
                        return square.position[rowOrColumn];
                    } else {
                        return square.position[rowOrColumn] === rowOrColumnNumber;
                    }
                })
            },
            getRowOrColumnXsAndOs: function (rowOrColumn, rowOrColumnNumber) {
                return this.getRowOrColumn(rowOrColumn, rowOrColumnNumber)
                        .map(function (square) {
                            return square.xOrO;
                        })
            }
        },
        padding = 0.2 * rowAndColumnHeight,
        whoseTurn = USER,
        XXX = 'XXX',
        OOO = 'OOO';

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

        var squareNumber = getSquareNumberFromXYCoord(x, y);

        if (isNaN(squareNumber)) {
            return;
        }

        if (gameGrid.squares[squareNumber].xOrO) {
            return;  //square is already taken
        }

        setSquareSelected(squareNumber, X);
        drawX(squareNumber);

        if (checkIfGameOver()) {
            console.log('game over');
        } else {
            whoseTurn = !whoseTurn;

            setTimeout(function () {
                doComputersTurn();
            }, 1000)
        }
    }

    function checkIfGameOver() {
        var howManySquaresTaken = gameGrid.squares.filter(function (square) {
            return square.xOrO;
        }).length;

        if (9 === howManySquaresTaken) {
            return true;
        }

        if (checkForWin('row')
            || checkForWin('col')
            || checkForWin('diag1')
            || checkForWin('diag2')) {
            return true;
        }

        function checkForWin(rowColumnOrDiagonal) {
            for (var rowOrColumn = 0; rowOrColumn <= 2; rowOrColumn++) {
                var gameRowColumnOrDiagonal = gameGrid.getRowOrColumnXsAndOs(rowColumnOrDiagonal, rowOrColumn).join('');
                        if (gameRowColumnOrDiagonal === XXX || gameRowColumnOrDiagonal === OOO) {
                    return true;
                }
            }
            return false;
        }

        return false;
    }

    function setSquareSelected(squareNumber, xOrO) {
        gameGrid.squares[squareNumber].xOrO = xOrO;
    }

    function doComputersTurn() {
        var iminentWin = findIminentWin(),
            squareToPlay;

        if (iminentWin) {
            squareToPlay = iminentWin.squareToBlock;
        } else {
            squareToPlay = Math.floor(Math.random() * 9);

            while (gameGrid.squares[squareToPlay].xOrO) {
                squareToPlay = ++squareToPlay % 8;
            };
        }

        setSquareSelected(squareToPlay, O);
        drawO(squareToPlay);

        if (checkIfGameOver()) {
            console.log('game over!');
        }

        whoseTurn = !whoseTurn;
    }

    function findIminentWin() {
        //identify square to occupy to prevent opponent win on next move
        return checkForIminentWin('row') || checkForIminentWin('col') || checkForIminentWin('diag1') || checkForIminentWin('diag2');

        function checkForIminentWin(rowColumnOrDiagonal) {
            for (var rowOrColumn = 0; rowOrColumn <= 2; rowOrColumn++) {
                var gameRowColumnOrDiagonal = gameGrid.getRowOrColumn(rowColumnOrDiagonal, rowOrColumn),
                    xsAndOs = gameRowColumnOrDiagonal.map(function (square) {
                        return square.xOrO;
                    })
                    .join('');
                if ('XX' === xsAndOs) {
                    var squareToBlock = gameRowColumnOrDiagonal.filter(function (square) {
                        return !square.xOrO;
                    })[0].squareNumber
                    return { squareToBlock: squareToBlock }
                }
            }
        }
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

    function getSquareNumberFromXYCoord(x, y) {
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

    function getSquareNumberFromRowColumnOrDiagonal(rowColumnOrDiagonal, rowColumnOrDiagonalNumber, positionInRowColumnOrDiagonal) {
        //rowColumnOrDiagonalNumber - 1 based
        //positionInRowColumnOrDiagonal - 0 based
        var squareNumber;

        switch (rowColumnOrDiagonal) {
            case 'row':
                squareNumber = (rowColumnOrDiagonalNumber - 1) * 3 + positionInRowColumnOrDiagonal;
                break;
            case 'col':
                switch (position) {
                }
                break;
            case 'diag1':
                switch (position) {
                }
                break;
            case 'diag2':
                switch (position) {
                }
                break;
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