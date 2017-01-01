var tictactoe = (function () {

    var
        COMPUTER = true,
        GAME_IN_PLAY = 0,
        GAME_OVER = 1,
        PLAYER = false,
        X = 'X',
        O = 'O',
        XXX = 'XXX',
        OOO = 'OOO',
        firstSquarePlayedByPlayer,
        gameStatus,
        playNumber = 0,
        whoGoesFirst = PLAYER,
        whoseTurn = whoGoesFirst;

    function checkIfGameOver() {
        if (0 === gameGrid.getAvailableSquares('all').length) {
            return true;
        }

        var winningRow = gameGrid.getWinningRow();
        return winningRow.length > 0 && winningRow[0];
    }

    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
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
            //win if you can on this play!
            squareToPlay = iminentComputerWin.squareToBlockWin;
        }

        if ((iminentPlayerWin = findIminentWin(X)) && -1 === squareToPlay) {
            //block opponent from winning this play
            squareToPlay = iminentPlayerWin.squareToBlockWin;
        }

        if ((checkMateSquareComputer = findCheckmate(O)) && -1 === squareToPlay) {
            //create 'checkmate' this play to win next play
            squareToPlay = checkMateSquareComputer.checkMateSquareNumber
        }

        if ((checkMateSquarePlayer = findCheckmate(X)) && -1 === squareToPlay) {
            //block opponent from creating a checkmate
            squareToPlay = checkMateSquarePlayer.checkMateSquareNumber
        }

        if (whoGoesFirst === COMPUTER && 1 === playNumber && -1 === squareToPlay) {
            squareToPlay = 0; //always start in top left corner if computer first
        }

        if (whoGoesFirst === COMPUTER && 3 === playNumber && -1 === squareToPlay) {
            firstSquarePlayedByPlayer = deepCopy(gameGrid.getXorOSquares(X)[0]);

            if (firstSquarePlayedByPlayer.isCorner) {
                var availableCorner = gameGrid.getAvailableSquares('corner')[0];
                squareToPlay = availableCorner && availableCorner.squareNumber;
            }

            if (firstSquarePlayedByPlayer.isEdge) {
                squareToPlay = gameGrid.positions.CENTER;
            }

            if (firstSquarePlayedByPlayer.isCenter) {
                squareToPlay = gameGrid.positions.LOWER_RIGHT;
            }
        }

        if (whoGoesFirst === PLAYER && 2 === playNumber && -1 === squareToPlay) {
            firstSquarePlayedByPlayer = deepCopy(gameGrid.getXorOSquares(X)[0]);

            if (firstSquarePlayedByPlayer.isCorner) {
                squareToPlay = gameGrid.positions.CENTER;
            }

            if (firstSquarePlayedByPlayer.isCenter) {
                squareToPlay = gameGrid.getAvailableSquares('corner')[0].squareNumber;
            }

            if (firstSquarePlayedByPlayer.isEdge) {
                squareToPlay = getNearestCornerToEdge(firstSquarePlayedByPlayer.squareNumber)
            }
        }
        
        if (whoGoesFirst === PLAYER && 4 === playNumber && -1 === squareToPlay) {
            if (firstSquarePlayedByPlayer.isCorner) {
                squareToPlay = gameGrid.getAvailableSquares('edge')[0].squareNumber;
            } else if (!gameGrid.getSquareValue(gameGrid.positions.CENTER)) {
                squareToPlay = gameGrid.positions.CENTER;
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
        //a 'checkmate' is when a player has 2 different rows with 2 marked squares and one blank. 
        //this is a checkmate because the opponent can only block 1 row, allowing the player to win on the other row
        //This function searches for a grid that will create a checkmate for either X or O player
        var checkMateSquareNumber,
            availableSquares = gameGrid.getAvailableSquares('all'),  //available squares do not have an X or O
            iminentWinRows;

        availableSquares.forEach(function (availableSquare) {
            availableSquare.xOrO = xOrO;    //temporarily set xOrO so we can test if this creates a checkmate

            if (gameGrid.getIminentWinRows(xOrO).length === 2) {
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
        var iminentWinRows = gameGrid.getIminentWinRows(xOrO);

        if (iminentWinRows.length) {
            var squareToBlockWin = iminentWinRows[0].filter(function (square) {
                return !square.xOrO;  //unoccuied square is the square to block to prevent player win
            })[0].squareNumber
            return { squareToBlockWin: squareToBlockWin }
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
                }, 1000);
            }
        })
    };

    function restartGame() {
        playNumber = 0;

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