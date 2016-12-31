var tictactoe = (function () {

    var ROW = 1,
        COLUMN = 2,
        COMPUTER = true,
        PLAYER = false,
        X = 'X',
        O = 'O',
        rowAndColumnHeight = 75,
        nonClickableDivider = 5,
        padding = 0.2 * rowAndColumnHeight,
        whoseTurn = COMPUTER,
        XXX = 'XXX',
        OOO = 'OOO',
        gameStatus,
        GAME_IN_PLAY = 0,
        GAME_OVER = 1,
        whoGoesFirst = COMPUTER,
        playNumber = 0,
        CENTER_SQUARE = 4;

    function init() {
        $(function () {
            setEventHandlers();
            gameStatus = GAME_IN_PLAY;
            gameGrid.drawGame($('canvas'));
            if (whoGoesFirst === COMPUTER) {
                $('#whoseTurn').text('computer\'s turn');
                setTimeout(function () {
                    doComputersTurn();
                }, 2000);
            }
        })
    };

    function setWhoseTurn(who) {
        whoseTurn = who;
        $('#whoseTurn').text(whoseTurn === PLAYER ? 'your turn' : 'computer\'s turn');
    }

    function setEventHandlers() {
        $('canvas').click(function (e) {
            handleCanvasClick(e.offsetX, e.offsetY)
        });
    }

    function restartGame() {
        gameGrid.refreshGame($('canvas'));
        gameStatus = GAME_IN_PLAY;
        whoGoesFirst = !whoGoesFirst;
        setWhoseTurn(whoGoesFirst)
        if (whoGoesFirst === COMPUTER) {
            setTimeout(function () {
                doComputersTurn();
            }, 2000);
        }
    }

    function handleCanvasClick(x, y) {
        if (gameStatus === GAME_OVER) {
            restartGame();
            return;
        }

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

        doPlayersTurn(squareNumber);

    }

    function doPlayersTurn(squareNumber) {
        playNumber++;

        setSquareSelected(squareNumber, X);
        drawX(squareNumber);

        if (checkIfGameOver()) {
            gameStatus = GAME_OVER;
            $('#whoseTurn').text('gane over!')
        } else {
            setWhoseTurn(!whoseTurn);

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
        var iminentPlayerWin,
            iminentComputerWin,
            squareToPlay = -1;

        playNumber++;

        if (iminentComputerWin = findIminentWin(O)) {
            squareToPlay = iminentComputerWin.unoccupiedSquare;
        }

        if (iminentPlayerWin = findIminentWin(X)) {
            squareToPlay = iminentPlayerWin.unoccupiedSquare;
        } 

        if (whoGoesFirst === COMPUTER && 1 === playNumber) {
            squareToPlay = 0; //always start in top left corner if computer first
        }

        if (whoGoesFirst === COMPUTER && 3 === playNumber) {
            var playerSquare = gameGrid.getSquaresMeetingCriteria(function (square) {
                return square.xOrO && square.xOrO === X;
            })[0],
            isEdge = !playerSquare.isCorner;
            
            squareToPlay = CENTER_SQUARE; 
        }
        
        if (-1 === squareToPlay) {
            squareToPlay = Math.floor(Math.random() * 9);

            while (gameGrid.squares[squareToPlay].xOrO) {
                squareToPlay = ++squareToPlay % 8;
            };
        }

        setSquareSelected(squareToPlay, O);
        drawO(squareToPlay);

        if (checkIfGameOver()) {
            gameStatus = GAME_OVER;
            $('#whoseTurn').text('gane over!')
        } else {
            setWhoseTurn(!whoseTurn);
        }
    }

    function findIminentWin(xOrO) {
        //identify square to occupy to prevent opponent win on next move
        var iminentWinStripes = gameGrid.getStripesMeetingCriteria(function (stripe) {
            var twoXsOrOs = xOrO + xOrO;
            return twoXsOrOs === gameGrid.getXsAndOs(stripe);
        });

        if (iminentWinStripes.length) {
            var unoccupiedSquare = iminentWinStripes[0].filter(function (square) {
                return !square.xOrO;  //unoccuied square is the square to block to prevent player win
            })[0].squareNumber
            return { unoccupiedSquare: unoccupiedSquare }
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

    return {
        init: init
    };
}());

tictactoe.init();