var gameGrid = (function () {

    var rowAndColumnHeight = 75,
        padding = 0.2 * rowAndColumnHeight,
        nonClickableDivider = 5,
        X = 'X',
        O = 'O',
        XXX = 'XXX',
        OOO = 'OOO',
        squares = [
            { squareNumber: 0, isEdge: false, isCorner: true, origin: { x: 0, y: 0 }, position: { row: 0, col: 0, diag1: true } },
            { squareNumber: 1, isEdge: true, isCorner: false, origin: { x: rowAndColumnHeight, y: 0 }, position: { row: 0, col: 1 } },
            { squareNumber: 2, isEdge: false, isCorner: true, origin: { x: rowAndColumnHeight * 2, y: 0 }, position: { row: 0, col: 2, diag2: true } },
            { squareNumber: 3, isEdge: true, isCorner: false, origin: { x: 0, y: rowAndColumnHeight }, position: { row: 1, col: 0 } },
            { squareNumber: 4, isEdge: false, isCorner: false, isCenter: true, origin: { x: rowAndColumnHeight, y: rowAndColumnHeight }, position: { row: 1, col: 1, diag1: true, diag2: true } },
            { squareNumber: 5, isEdge: true, isCorner: false, origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight }, position: { row: 1, col: 2 } },
            { squareNumber: 6, isEdge: false, isCorner: true, origin: { x: 0, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 0, diag2: true } },
            { squareNumber: 7, isEdge: true, isCorner: false, origin: { x: rowAndColumnHeight, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 1 } },
            { squareNumber: 8, isEdge: false, isCorner: true, origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 2, diag1: true } }
        ],
        positions = {
            CENTER: 4,
            LOWER_RIGHT: 8
        };

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

    function drawWinLine($canvas, winningRow) {

        var startX,
            startY,
            endX,
            endY,
            winningRowsSortX = utility.deepCopy(sortRowOnXOrYCoordinate(winningRow, 'X')),
            winningRowsSortY = utility.deepCopy(sortRowOnXOrYCoordinate(winningRow, 'Y')),
            isVerticalWin = winningRowsSortX[0].origin.x === winningRowsSortX[2].origin.x,
            isHorizontalWin = winningRowsSortX[0].origin.y === winningRowsSortX[2].origin.y,
            isDiagonalWin = !isVerticalWin && !isHorizontalWin,
            isDiagnoalWinULToLR = winningRow[0].origin.x < winningRow[2].origin.x,
            isDiagnoalWinURToLL = isDiagonalWin & !isDiagnoalWinULToLR;

        if (isVerticalWin) {
            startX = endX = winningRowsSortX[0].origin.x + rowAndColumnHeight / 2;
            startY = winningRowsSortY[0].origin.y;
            endY = winningRowsSortY[2].origin.y + rowAndColumnHeight;
        }

        if (!isVerticalWin) {
            startX = winningRowsSortX[0].origin.x;
            endX = winningRowsSortX[2].origin.x + rowAndColumnHeight;
        }

        if (isHorizontalWin) {
            startY = endY = winningRowsSortY[0].origin.y + rowAndColumnHeight / 2
        }

        if (isDiagonalWin && isDiagnoalWinULToLR) {
            startY = winningRowsSortY[0].origin.y;
            endY = winningRowsSortY[2].origin.y + rowAndColumnHeight;
        }

        if (isDiagonalWin && isDiagnoalWinURToLL) {
            startY = winningRowsSortY[2].origin.y + rowAndColumnHeight;
            endY = winningRowsSortY[0].origin.y;
        }

        $canvas.drawLine({
            strokeStyle: '#000',
            strokeWidth: 10,
            x1: startX, y1: startY,
            x2: endX, y2: endY,
        });
    }

    function drawX($canvas, squareNumber) {
        var squareOriginX = squares[squareNumber].origin.x,
            squareOriginY = squares[squareNumber].origin.y,
            startX = squareOriginX + padding,
            endX = startX + rowAndColumnHeight - (2 * padding),
            startY1 = squareOriginY + padding,
            endY1 = startY1 + rowAndColumnHeight - (2 * padding),
            startY2 = endY1,
            endY2 = startY1,
            temp;

        $canvas.drawLine({
            strokeStyle: '#F00',
            strokeWidth: 5,
            x1: startX, y1: startY1,
            x2: endX, y2: endY1,
        });

        $canvas.drawLine({
            strokeStyle: '#F00',
            strokeWidth: 5,
            x1: startX, y1: startY2,
            x2: endX, y2: endY2
        });
    }

    function drawO($canvas, squareNumber) {
        var centerX = squares[squareNumber].origin.x + rowAndColumnHeight / 2,
            centerY = squares[squareNumber].origin.y + rowAndColumnHeight / 2,
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

    function getIminentWinRows(xOrO) {
        return getRowsMeetingCriteria(function (stripe) {
            var twoXsOrOs = xOrO + xOrO;
            return twoXsOrOs === getXsAndOsFromRow(stripe);
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

    function getRow (direction, rowOrColumnNumber) {
        return squares.filter(function (square) {
            if ('diag1' === direction || 'diag2' === direction) {
                return square.position[direction];
            } else {
                return square.position[direction] === rowOrColumnNumber;
            }
        })
    }

    function getRowsMeetingCriteria (criteriaFunction) {
        var stripes = [],
            me = this;

        getRows('row');
        getRows('col');
        getRows('diag1');
        getRows('diag2');

        function getRows(direction) {
            var stripe;
            if ('diag1' === direction || 'diag2' === direction) {
                stripe = getRow(direction);
                if (criteriaFunction(stripe)) {
                    stripes.push(stripe);
                }
            } else {
                for (var squareNumber = 0; squareNumber <= 2; squareNumber++) {
                    stripe = getRow(direction, squareNumber);
                    if (criteriaFunction(stripe)) {
                        stripes.push(stripe);
                    }
                }
            }
        }
        return stripes;
    }

    function getWinningRow() {
        return getRowsMeetingCriteria(function (stripe) {
            var stripeXsAndOs = getXsAndOsFromRow(stripe);
            return stripeXsAndOs === XXX || stripeXsAndOs === OOO;
        })[0];
    }

    function getXorOSquares(xOrO) {
        return getSquaresMeetingCriteria(function (square) {
            return square.xOrO && square.xOrO === xOrO;
        });
    }

    function getXsAndOsFromRow (stripe) {
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

    function sortRowOnXOrYCoordinate(row, xOrYCoordinate) {
        return row.sort(function (squareA, squareB) {
            if ('X' === xOrYCoordinate) {
                return squareA.origin.x - squareB.origin.x;
            } else {
                return squareA.origin.y - squareB.origin.y;
            }
        });
    }

    return {
        clear: clear,
        drawGame: drawGame,
        drawWinLine: drawWinLine,
        getAvailableSquares: getAvailableSquares,
        getIminentWinRows: getIminentWinRows,
        getSquareNumberFromXYCoord: getSquareNumberFromXYCoord,
        getSquareValue: getSquareValue,
        getWinningRow: getWinningRow,
        getXorOSquares: getXorOSquares,
        positions: positions,
        refreshGame: refreshGame,
        setSquareValue: setSquareValue
    }
}());