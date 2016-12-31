var gameGrid = (function () {

    var rowAndColumnHeight = 75,
        padding = 0.2 * rowAndColumnHeight,
        nonClickableDivider = 5,
        X = 'X',
        O = 'O',
        XXX = 'XXX',
        OOO = 'OOO',
        squares = [
            { squareNumber: 0, isCorner: true, isCorner: true, origin: { x: 0, y: 0 }, position: { row: 0, col: 0, diag1: true } },
            { squareNumber: 1, isCorner: false, origin: { x: rowAndColumnHeight, y: 0 }, position: { row: 0, col: 1 } },
            { squareNumber: 2, isCorner: true, origin: { x: rowAndColumnHeight * 2, y: 0 }, position: { row: 0, col: 2, diag2: true } },
            { squareNumber: 3, isCorner: false, origin: { x: 0, y: rowAndColumnHeight }, position: { row: 1, col: 0 } },
            { squareNumber: 4, isCorner: false, origin: { x: rowAndColumnHeight, y: rowAndColumnHeight }, position: { row: 1, col: 1, diag1: true, diag2: true } },
            { squareNumber: 5, isCorner: false, origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight }, position: { row: 1, col: 2 } },
            { squareNumber: 6, isCorner: true, origin: { x: 0, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 0, diag2: true } },
            { squareNumber: 7, isCorner: false, origin: { x: rowAndColumnHeight, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 1 } },
            { squareNumber: 8, isCorner: true, origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 2, diag1: true } }
        ];

    function clear(canvas) {
        canvas = canvas[0];
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        var w = canvas.width;
        canvas.width = 1;
        canvas.width = w;
    }

    function drawGame(canvas) {
        canvas.drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: rowAndColumnHeight, y1: 0,
            x2: rowAndColumnHeight, y2: rowAndColumnHeight * 3
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: rowAndColumnHeight * 2, y1: 0,
            x2: rowAndColumnHeight * 2, y2: rowAndColumnHeight * 3
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: 0, y1: rowAndColumnHeight,
            x2: rowAndColumnHeight * 3, y2: rowAndColumnHeight
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: 0, y1: rowAndColumnHeight * 2,
            x2: rowAndColumnHeight * 3, y2: rowAndColumnHeight * 2
        })
    }

    function drawX($canvas, squareNumber) {
        var squareOriginX = squares[squareNumber].origin.x,
            squareOriginY = squares[squareNumber].origin.y,
            startX = squareOriginX + padding,
            startY = squareOriginY + padding,
            endX = startX + rowAndColumnHeight - (2 * padding),
            endY = startY + rowAndColumnHeight - (2 * padding),
            temp;

        $canvas.drawLine({
            strokeStyle: '#F00',
            strokeWidth: 5,
            x1: startX, y1: startY,
            x2: endX, y2: endY
        });

        temp = startY;
        startY = endY;
        endY = temp;

        $canvas.drawLine({
            strokeStyle: '#F00',
            strokeWidth: 5,
            x1: startX, y1: startY,
            x2: endX, y2: endY
        });
    }

    function drawO($canvas, squareNumber) {
        var squareOriginX = squares[squareNumber].origin.x,
            squareOriginY = squares[squareNumber].origin.y,
            centerX = squareOriginX + rowAndColumnHeight / 2,
            centerY = squareOriginY + rowAndColumnHeight / 2,
            circleWidthAndHeight = rowAndColumnHeight - (2 * padding);

        $canvas.drawEllipse({
            strokeStyle: '#0F0',
            strokeWidth: 5,
            x: centerX, y: centerY,
            width: circleWidthAndHeight, height: circleWidthAndHeight
        });

    }

    function getAvailableCorner() {
        var availableCorners = getSquaresMeetingCriteria(function (square) {
            return square.isCorner && !square.xOrO;
        });
        return availableCorners.length && availableCorners;
    }

    function getAvailableEdge() {
        var availableEdges = getSquaresMeetingCriteria(function (square) {
            return !square.isCorner && !square.xOrO;
        });
        return availableEdges.length && availableEdges;
    }

    function getAvailableSquares(edgesCornersOrAll) {
        if ('edge' === edgesCornersOrAll) {
            return getAvailableEdge();
        } else if ('corner' === edgesCornersOrAll) {
            return getAvailableCorner();
        } else {
            return getSquaresMeetingCriteria(function (square) {
                return !square.xOrO;
            });
        }
    }

    function getIminentWinStripes(xOrO) {
        return getStripesMeetingCriteria(function (stripe) {
            var twoXsOrOs = xOrO + xOrO;
            return twoXsOrOs === getXsAndOsFromStripe(stripe);
        });
    }

    function getSquaresMeetingCriteria(criteriaFunction) {
        return squares.filter(function (square) {
            return criteriaFunction(square);
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
            squareNumber = (isFirstColumn) ? 0 : ((isSecondColumn ? 1 : (isThirdColumn ? 2 : NaN)));
        }

        if (isSecondRow) {
            squareNumber = (isFirstColumn) ? 3 : ((isSecondColumn ? 4 : (isThirdColumn ? 5 : NaN)));
        }

        if (isThirdRow) {
            squareNumber = (isFirstColumn) ? 6 : ((isSecondColumn ? 7 : (isThirdColumn ? 8 : NaN)));
        }

        return squareNumber;
    }

    function getSquareValue(squareNumber) {
        return squares[squareNumber].xOrO;
    }

    function getStripe (direction, rowOrColumnNumber) {
        return squares.filter(function (square) {
            if ('diag1' === direction || 'diag2' === direction) {
                return square.position[direction];
            } else {
                return square.position[direction] === rowOrColumnNumber;
            }
        })
    }

    function getStripesMeetingCriteria (criteriaFunction) {
        var stripes = [],
            me = this;

        getStripes('row');
        getStripes('col');
        getStripes('diag1');
        getStripes('diag2');

        function getStripes(direction) {
            var stripe;
            if ('diag1' === direction || 'diag2' === direction) {
                stripe = getStripe(direction);
                if (criteriaFunction(stripe)) {
                    stripes.push(stripe);
                }
            } else {
                for (var squareNumber = 0; squareNumber <= 2; squareNumber++) {
                    stripe = getStripe(direction, squareNumber);
                    if (criteriaFunction(stripe)) {
                        stripes.push(stripe);
                    }
                }
            }
        }
        return stripes;
    }

    function getWinningStripe() {
        return getStripesMeetingCriteria(function (stripe) {
            var stripeXsAndOs = getXsAndOsFromStripe(stripe);
            return stripeXsAndOs === XXX || stripeXsAndOs === OOO;
        });
    }

    function getXorOSquares(xOrO) {
        return getSquaresMeetingCriteria(function (square) {
            return square.xOrO && square.xOrO === xOrO;
        });
    }

    function getXsAndOsFromStripe (stripe) {
        return stripe.map(function (square) {
            return square.xOrO;
        })
        .join('');
    }

    function refreshGame(canvas) {
        clear(canvas);
        drawGame(canvas);
        squares.forEach(function (square) {
            if (square.xOrO) {
                delete square.xOrO;
            }
        })
    }

    function setSquareValue($canvas, squareNumber, xOrO) {
        squares[squareNumber].xOrO = xOrO;
        X === xOrO ? drawX($canvas, squareNumber) : drawO($canvas, squareNumber);
    }

    return {
        clear: clear,
        drawGame: drawGame,
        getAvailableSquares: getAvailableSquares,
        getIminentWinStripes: getIminentWinStripes,
        getSquareNumberFromXYCoord: getSquareNumberFromXYCoord,
        getSquareValue: getSquareValue,
        getWinningStripe: getWinningStripe,
        getXorOSquares: getXorOSquares,
        refreshGame: refreshGame,
        setSquareValue: setSquareValue
    }
}());