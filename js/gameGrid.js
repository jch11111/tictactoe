var gameGrid = (function () {

    var rowAndColumnHeight = 75,
        padding = 0.2 * rowAndColumnHeight,
        nonClickableWidth = 5,
        X = 'X',
        O = 'O',
        XXX = 'XXX',
        OOO = 'OOO',
        gridLineWidth = 7,
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

    function clear($canvas) {
        var context,
            width;

        $canvas = $canvas[0];
        context = $canvas.getContext('2d');
        context.clearRect(0, 0, $canvas.width, $canvas.height);
        width = $canvas.width;
        $canvas.width = 1;
        $canvas.width = width;
    }

    function drawGame($canvas) {
        $canvas.drawLine({
            strokeStyle: '#000',
            strokeWidth: gridLineWidth,
            x1: rowAndColumnHeight, y1: 0,
            x2: rowAndColumnHeight, y2: rowAndColumnHeight * 3
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: gridLineWidth,
            x1: rowAndColumnHeight * 2, y1: 0,
            x2: rowAndColumnHeight * 2, y2: rowAndColumnHeight * 3
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: gridLineWidth,
            x1: 0, y1: rowAndColumnHeight,
            x2: rowAndColumnHeight * 3, y2: rowAndColumnHeight
        })
        .drawLine({
            strokeStyle: '#000',
            strokeWidth: gridLineWidth,
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
            isDiagnoalWinULToLR = isDiagonalWin && winningRow[0].origin.x < winningRow[2].origin.x,
            isDiagnoalWinURToLL = isDiagonalWin & !isDiagnoalWinULToLR;

        if (isVerticalWin) {
            startX =
                endX = winningRowsSortX[0].origin.x + rowAndColumnHeight / 2;
            startY = winningRowsSortY[0].origin.y;
            endY = winningRowsSortY[2].origin.y + rowAndColumnHeight;
        }

        if (!isVerticalWin) {
            startX = winningRowsSortX[0].origin.x;
            endX = winningRowsSortX[2].origin.x + rowAndColumnHeight;
        }

        if (isHorizontalWin) {
            startY =
                endY = winningRowsSortY[0].origin.y + rowAndColumnHeight / 2
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
            strokeWidth: 5,
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

    function getAvailableCorners() {
        var availableCorners = getSquaresMeetingCriteria(function (square) {
            var isAvailable = !square.xOrO;
            return square.isCorner && isAvailable;
        });
        return availableCorners.length && availableCorners;
    }

    function getAvailableEdges() {
        var availableEdges = getSquaresMeetingCriteria(function (square) {
            var isEdge = !square.isCorner && !square.isCenter,
                isAvailable = !square.xOrO;
            return isEdge && isAvailable;
        });
        return availableEdges.length && availableEdges;
    }

    function getAvailableSquares(edgesCornersOrAll) {
        if ('edge' === edgesCornersOrAll) {
            return getAvailableEdges();
        } else if ('corner' === edgesCornersOrAll) {
            return getAvailableCorners();
        } else {
            return getSquaresMeetingCriteria(function (square) {
                var isAvailable = !square.xOrO;
                return isAvailable;
            });
        }
    }

    function getIminentWinRows(xOrO) {
        return getRowsMeetingCriteria(function (row) {
            var twoXsOrOs = xOrO + xOrO;
            return twoXsOrOs === getXsAndOsFromRow(row);
        });
    }

    function getSquaresMeetingCriteria(criteriaFunction) {
        return squares.filter(function (square) {
            return criteriaFunction(square);
        });
    }

    function getSquareNumberFromXYCoord(x, y) {
        var squareNumber,
            isFirstRow = nonClickableWidth < y && y < rowAndColumnHeight - nonClickableWidth,
            isSecondRow = rowAndColumnHeight + nonClickableWidth < y && y < rowAndColumnHeight * 2 - nonClickableWidth,
            isThirdRow = rowAndColumnHeight * 2 + nonClickableWidth < y && y < rowAndColumnHeight * 3 - nonClickableWidth,
            isFirstColumn = nonClickableWidth < x && x < rowAndColumnHeight - nonClickableWidth,
            isSecondColumn = rowAndColumnHeight + nonClickableWidth < x && x < rowAndColumnHeight * 2 - nonClickableWidth,
            isThirdColumn = rowAndColumnHeight * 2 + nonClickableWidth < x && x < rowAndColumnHeight * 3 - nonClickableWidth;

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
        var rows = [],
            me = this;

        getRows('row');
        getRows('col');
        getRows('diag1');
        getRows('diag2');

        function getRows(direction) {
            var row;
            if ('diag1' === direction || 'diag2' === direction) {
                row = getRow(direction);
                if (criteriaFunction(row)) {
                    rows.push(row);
                }
            } else {
                for (var squareNumber = 0; squareNumber <= 2; squareNumber++) {
                    row = getRow(direction, squareNumber);
                    if (criteriaFunction(row)) {
                        rows.push(row);
                    }
                }
            }
        }
        return rows;
    }

    function getWinningRow() {
        return getRowsMeetingCriteria(function (row) {
            var rowXsAndOs = getXsAndOsFromRow(row);
            return rowXsAndOs === XXX || rowXsAndOs === OOO;
        })[0];
    }

    function getXorOSquares(xOrO) {
        return getSquaresMeetingCriteria(function (square) {
            return square.xOrO && square.xOrO === xOrO;
        });
    }

    function getXsAndOsFromRow (row) {
        return row.map(function (square) {
            return square.xOrO;
        })
        .join('');
    }

    function refreshGame($canvas) {
        clear($canvas);
        drawGame($canvas);
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