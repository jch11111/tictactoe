var tictactoe = (function () {

    var ROW = 1,
        COLUMN = 2,
        COMPUTER = true,
        USER = false,
        X = 'X',
        O = 'O',
        rowAndColumnHeight = 75,
        nonClickableDivider = 5,
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
        if (9 === gameGrid.getNumberOfOccupiedSquares()) {
            return true;
        }

        var winningStripe = gameGrid.getStripesMeetingCriteria(function (stripe) {
            var stripeXsAndOs = gameGrid.getXsAndOs(stripe);
            return stripeXsAndOs === XXX || stripeXsAndOs === OOO;
        })

        return winningStripe.length > 0 && winningStripe[0];
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
        var iminentWinningStripe = gameGrid.getStripesMeetingCriteria(function (stripe) {
            return 'XX' === gameGrid.getXsAndOs(stripe);
        });

        if (iminentWinningStripe.length > 0) {
            var squareToBlock = iminentWinningStripe[0].filter(function (square) {
                return !square.xOrO;
            })[0].squareNumber
            return { squareToBlock: squareToBlock }
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