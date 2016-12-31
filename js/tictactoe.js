var tictactoe = (function () {

    var
        CENTER_SQUARE = 4,
        COMPUTER = true,
        GAME_IN_PLAY = 0,
        GAME_OVER = 1,
        PLAYER = false,
        X = 'X',
        O = 'O',
        XXX = 'XXX',
        OOO = 'OOO',
        isPlayerCentered,
        isPlayerOnEdge,
        isPlayerStartOnCorner,
        isPlayerStartOnEdge,
        gameStatus,
        playNumber = 0,
        whoGoesFirst = PLAYER,
        whoseTurn = PLAYER;

    function checkIfGameOver() {
        if (0 === gameGrid.getAvailableSquares('all').length) {
            return true;
        }

        var winningStripe = gameGrid.getWinningStripe();
        return winningStripe.length > 0 && winningStripe[0];
    }

    function doComputersTurn() {
        var iminentPlayerWin,
            iminentComputerWin,
            checkMateSquareComputer,
            checkMateSquarePlayer,
            squareToPlay = -1;

        playNumber++;

        function getNearestCornerToEdge(edgeSquareNumber) {
            return edgeSquareNumber < 5 ? 0 : 8;
        }

        if (iminentComputerWin = findIminentWin(O)) {
            squareToPlay = iminentComputerWin.unoccupiedSquare;
        }

        if (-1 === squareToPlay && (iminentPlayerWin = findIminentWin(X))) {
            squareToPlay = iminentPlayerWin.unoccupiedSquare;
        }

        if (-1 === squareToPlay && (checkMateSquareComputer = findCheckmate(O))) {
            squareToPlay = checkMateSquareComputer.checkMateSquareNumber
        }

        if (-1 === squareToPlay && (checkMateSquarePlayer = findCheckmate(X))) {
            squareToPlay = checkMateSquarePlayer.checkMateSquareNumber
        }

        if (-1 === squareToPlay && whoGoesFirst === COMPUTER && 1 === playNumber) {
            squareToPlay = 0; //always start in top left corner if computer first
        }

        if (-1 === squareToPlay && whoGoesFirst === COMPUTER && 3 === playNumber) {
            var playerSquare = gameGrid.getXorOSquares(X)[0];

            isPlayerCentered = CENTER_SQUARE === playerSquare.squareNumber;
            isPlayerOnEdge = !playerSquare.isCorner && !isPlayerCentered;

            if (isPlayerOnEdge) {
                squareToPlay = CENTER_SQUARE;
            }  else if (isPlayerCentered) {
                squareToPlay = 8;
            } else {
                var availableCorner = gameGrid.getAvailableSquares('corner')[0];
                squareToPlay = availableCorner && availableCorner.squareNumber;
            }
        }

        if (-1 === squareToPlay && whoGoesFirst === PLAYER && 2 === playNumber) {
            var playerSquare = gameGrid.getXorOSquares(X)[0];

            if (playerSquare.isCorner) {
                isPlayerStartOnCorner = true;
                squareToPlay = CENTER_SQUARE;
            } else if (playerSquare.squareNumber === CENTER_SQUARE) {
                var availableCorner = gameGrid.getAvailableSquares('corner')[0];
                squareToPlay = availableCorner && availableCorner.squareNumber;
            } else {
                isPlayerStartOnEdge = true;
                squareToPlay = getNearestCornerToEdge(playerSquare.squareNumber)
            }
        }
        
        if (-1 === squareToPlay && whoGoesFirst === PLAYER && 4 === playNumber) {
            if (isPlayerStartOnCorner) {
                var availableEdge = gameGrid.getAvailableSquares('edge')[0];
                squareToPlay = availableEdge && availableEdge.squareNumber;
            } else if (!gameGrid.getSquareValue(CENTER_SQUARE)) {
                squareToPlay = CENTER_SQUARE;
            } else {
                var availableCorner = gameGrid.getAvailableSquares('corner')[0];
                squareToPlay = availableCorner && availableCorner.squareNumber;
            }
        }

        if (-1 === squareToPlay) {
            squareToPlay = Math.floor(Math.random() * 9);

            while (gameGrid.getSquareValue(squareToPlay)) {
                squareToPlay = ++squareToPlay % 8;
            };
        }

        gameGrid.setSquareValue($('canvas'), squareToPlay, O);

        if (checkIfGameOver()) {
            gameStatus = GAME_OVER;
            $('#whoseTurn')
                .text('game over!')
                .css('color', 'black');
        } else {
            setWhoseTurn(!whoseTurn);
        }
    }

    function doPlayersTurn(squareNumber) {
        playNumber++;

        gameGrid.setSquareValue($('canvas'), squareNumber, X);

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

    function findCheckmate(xOrO) {
        var checkMateSquareNumber,
            availableSquares = gameGrid.getAvailableSquares('all'),
            iminentWinStripes;

        availableSquares.forEach(function (availableSquare) {
            availableSquare.xOrO = xOrO;    //temporarily set xOrO so we can test if this creates a checkmate

            if (gameGrid.getIminentWinStripes(xOrO).length === 2) {
                if (!isNaN(checkMateSquareNumber)) {
                    checkMateSquareNumber = null;
                } else {
                    checkMateSquareNumber = availableSquare.squareNumber;
                }
            }

            delete availableSquare.xOrO;    //reset
        });


        return checkMateSquareNumber && { checkMateSquareNumber: checkMateSquareNumber };
    }

    function findIminentWin(xOrO) {
        //identify square to occupy to prevent opponent win on next move
        var iminentWinStripes = gameGrid.getIminentWinStripes(xOrO);

        if (iminentWinStripes.length) {
            var unoccupiedSquare = iminentWinStripes[0].filter(function (square) {
                return !square.xOrO;  //unoccuied square is the square to block to prevent player win
            })[0].squareNumber
            return { unoccupiedSquare: unoccupiedSquare }
        }
    }

    function handleCanvasClick(x, y) {
        var squareNumber;

        if (gameStatus === GAME_OVER) {
            restartGame();
            return;
        }

        if (COMPUTER === whoseTurn) {
            return;
        }

        squareNumber = gameGrid.getSquareNumberFromXYCoord(x, y);

        if (isNaN(squareNumber)) {
            return;
        }

        if (gameGrid.getSquareValue(squareNumber)) {
            return;  //square is already taken
        }

        doPlayersTurn(squareNumber);

    }

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

    function restartGame() {
        playNumber = 0;
        isPlayerOnEdge = false;
        isPlayerCentered = false;
        isPlayerStartOnCorner = false;
        isPlayerStartOnEdge = false;

        gameGrid.refreshGame($('canvas'));
        gameStatus = GAME_IN_PLAY;
        whoGoesFirst = !whoGoesFirst;
        setWhoseTurn(whoGoesFirst);
        if (whoGoesFirst === COMPUTER) {
            setTimeout(function () {
                doComputersTurn();
            }, 2000);
        }
    }

    function setEventHandlers() {
        $('canvas').click(function (e) {
            handleCanvasClick(e.offsetX, e.offsetY)
        });
    }

    function setWhoseTurn(who) {
        whoseTurn = who;
        $('#whoseTurn')
            .text(whoseTurn === PLAYER ? 'your turn' : 'computer\'s turn')
            .css('color', whoseTurn === PLAYER ? 'red' : 'green');
    }

    return {
        init: init
    };
}());

tictactoe.init();