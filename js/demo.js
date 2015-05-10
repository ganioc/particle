// the external interface
var theGame = (function(){
    var canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
    var dpr = window.devicePixelRatio;
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var ctx= canvas.getContext("2d");
    var bGameRunning = false;
    var currentGameLoop = null;

    var imgPathList = [
        { pic1:''}
    ];

    var imgList = [];

    function init_pictures(){
        

    }
    
    function init_canvas(){
        canvas.addEventListener(
            "touchstart",
            function(event)
            {
                console.log('touch');
                console.log(event);
                console.log(event.touches[0].pageX);
                console.log(event.touches[0].pageY);
                console.log('width:' + ctx.canvas.width + 'height:' + ctx.canvas.height);
                console.log('dpr:' + dpr);
                console.log('canvas-width:' + canvas.width + ' canvas-height:' + canvas.height);
                
                if( !MenuButton.bWithin(event.touches[0].pageX, event.touches[0].pageY)){
                    event.preventDefault();
                    return;
                }
                
                end_loop();
                
                Cocoon.App.forwardAsync("Cocoon.WebView.show(0, 0, " + canvas.width * window.devicePixelRatio + "," + canvas.height * window.devicePixelRatio + ");");
                /*
                 * Disable the touch events in the CocoonJS side so this event is not called when there is touches over the webview.
                 */
                Cocoon.Touch.disable();
            },
            false
        );

        canvas.addEventListener(
            "mousedown",
            function(event) 
            {
                console.log('click');
                //console.log(event);
                
                if( !MenuButton.bWithin(event.pageX, event.pageY)){
                    event.preventDefault();
                    return;
                }
                
                end_loop();
                
                Cocoon.App.forwardAsync("Cocoon.WebView.show(0, 0, " + canvas.width * window.devicePixelRatio + "," + canvas.height * window.devicePixelRatio + ");");
            },
            false
        );
    }
    // end of init_canvas

    // control, menu_button
    var MenuButton = (
        function(){
            var width = 40,
                height = 40;
            var delta = 5;
            var originX = ctx.canvas.width - delta - width;
            var originY = delta;
            return {
                draw:function(){
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect(originX, originY, width, height);
                    //console.log(':' + originX + ':' + originY);
                    //console.log('menubutton draw()');
                },
                bWithin: function(cx,cy){
                    if( !( cx <originX || cx >(originX + width) || cy > (originY + height) || cy < delta )){
                        return true;
                    }else{
                        return false;
                    }
                }
            };
        }
    )();
    // end of MenuButton
    function end_loop(){
        bGameRunning = false;
    }
    
    function start_loop(){
        // window.clearInterval(splash_timer);
        // bGameRunning = true;
        // window.requestAnimationFrame(gameLoop);
        bGameRunning = true;
        window.requestAnimationFrame(currentGameLoop);
    }
    
    // to generate a game loop
    function createGameLoop(handler){
        var start = 0;
        return function(timestamp){
            if(!start){
                start = timestamp;
            }
            var td = (timestamp - start)/1000; // in micro second

            if(!bGameRunning){
                console.log('out of game loop');
            }
            else{
                handler(td);
                window.requestAnimationFrame(currentGameLoop);
            }
            
        };
    }

    function splashLoop(td){
        var str = 'Boxshell.com';
        var strFontStyle = '40px serif';
        return function(td){
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = strFontStyle;
            ctx.textAlign = 'center';
            ctx.fillText(str, ctx.canvas.width/2, ctx.canvas.height/2);
        };
    }

    function goldenFireLoop(td){

        return function(td){
            ctx.fillStyle = 'black';
            ctx.fillRect( 0,0, ctx.canvas.width, ctx.canvas.height);
            MenuButton.draw();
        };
    }
    
    return {
        init: function(){
            init_canvas();
            currentGameLoop = createGameLoop(splashLoop());
            //window.requestAnimationFrame(currentGameLoop);
            start_loop();
        },
        loadGoldenFireLoop:function(){
            currentGameLoop = createGameLoop(goldenFireLoop());
            start_loop();
        }

    };

})();

window.theGame = theGame;

theGame.init();

