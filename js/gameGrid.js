var gameGrid = (function () {

    var rowAndColumnHeight = 75,
        squares = [
        { squareNumber: 0, origin: { x: 0, y: 0 }, position: { row: 0, col: 0, diag1: true } },
        { squareNumber: 1, origin: { x: rowAndColumnHeight, y: 0 }, position: { row: 0, col: 1 } },
        { squareNumber: 2, origin: { x: rowAndColumnHeight * 2, y: 0 }, position: { row: 0, col: 2, diag2: true } },
        { squareNumber: 3, origin: { x: 0, y: rowAndColumnHeight }, position: { row: 1, col: 0 } },
        { squareNumber: 4, origin: { x: rowAndColumnHeight, y: rowAndColumnHeight }, position: { row: 1, col: 1, diag1: true, diag2: true } },
        { squareNumber: 5, origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight }, position: { row: 1, col: 2 } },
        { squareNumber: 6, origin: { x: 0, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 0, diag2: true } },
        { squareNumber: 7, origin: { x: rowAndColumnHeight, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 1 } },
        { squareNumber: 8, origin: { x: rowAndColumnHeight * 2, y: rowAndColumnHeight * 2 }, position: { row: 2, col: 2, diag1: true } }
    ];

    function getStripe (direction, rowOrColumnNumber) {
        return squares.filter(function (square) {
            if ('diag1' === direction || 'diag2' === direction) {
                return square.position[direction];
            } else {
                return square.position[direction] === rowOrColumnNumber;
            }
        })
    }

    function getXsAndOs (stripe) {
        return stripe.map(function (square) {
            return square.xOrO;
        })
        .join('');
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
        
    function getNumberOfOccupiedSquares () {
        return this.squares.filter(function (square) {
            return square.xOrO;
        }).length;
    }

    return {
        squares: squares,
        getNumberOfOccupiedSquares: getNumberOfOccupiedSquares,
        getStripesMeetingCriteria: getStripesMeetingCriteria,
        getXsAndOs: getXsAndOs
    }

}());