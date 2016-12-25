var tictactoe = (function () {

    var VERTICAL = 0,
        HORIZONTAL = 1;

    function init() {
        $(function () {
            setEventHandlers();

/*            
            bonsai.run(document.getElementById('game'), {

                code: function () {

                    new Path()
                        .moveTo(50, 0)
                        .lineTo(50, 200)
                        .lineTo(52, 200)
                        .lineTo(52, 0)
                        .closePath()
                        .fill('blue')
                        .addTo(stage);

                    new Path()
                        .moveTo(150, 0)
                        .lineTo(150, 200)
                        .lineTo(152, 200)
                        .lineTo(152, 0)
                        .closePath()
                        .fill('blue')
                        .addTo(stage);

                },

                width: 200,
                height: 300
            });
  */

            bonsai.run(document.getElementById('game'), {
                url: 'js/game.js',
                width: 225,
                height: 225
            });





            drawGame();
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