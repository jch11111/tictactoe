var tictactoe = (function () {

    function init() {
        $(function () {
            setEventHandlers();

            var canvas = oCanvas.create({
                canvas: "#respondCanvas"
            });

            var line = canvas.display.line({
                start: { x: 5, y: 15 },
                end: { x: 10, y: 25 },
                stroke: "2px #0aa",
                cap: "round"
            });

            canvas.addChild(line);

            var c = $('#respondCanvas');
            var ct = c.get(0).getContext('2d');
            var container = $(c).parent();

            //Run function when browser resizes
            $(window).resize( respondCanvas );

            function respondCanvas(){
                c.attr('width', $(container).width() ); //max width
                c.attr('height', $(container).height() ); //max height

                //Call a function to redraw other content (texts, images etc)
            }

            //Initial call
            //respondCanvas();

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