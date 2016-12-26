var tictactoe = (function () {

    var VERTICAL = 0,
        HORIZONTAL = 1;

    function init() {
        $(function () {
            setEventHandlers();

            bonsai.run(document.getElementById('game'), {
                url: 'js/game.js',
                width: 225,
                height: 225
            });

        })
    };

    function setEventHandlers() {
    }

    function drawGame() {

    }

    return {
        init: init
    };
}());

tictactoe.init();