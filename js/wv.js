//
window.addEventListener(
    "load",
    function()
    {
        Cocoon.App.forward("console.log('hello from the other side');");
        // Disable the input in CocoonJS (we do not want to have both input in CocoonJS and the WebView)
        Cocoon.Touch.disable();
    }
);


function li_callback(str){
    return function(){
        Cocoon.App.forwardAsync(str,false);
        Cocoon.WebView.hide();
        Cocoon.Touch.enable();
    };
}

var golden_fire = li_callback("theGame.loadGoldenFireLoop();");

var rainbow_band = li_callback("theGame.loadRainbowBand();");

var water_ripple = li_callback("theGame.loadWaterRipple();");

var webgl_run = li_callback("theGame.loadWebglTest();");

var webgl_rotate_run = li_callback("theGame.loadWebglRotateTest();");

// function golden_fire(){
//     Cocoon.App.forwardAsync("theGame.loadGoldenFireLoop();",false);
    
//     Cocoon.WebView.hide();
//     Cocoon.Touch.enable();
// }
// function rainbow_band(){
//     Cocoon.App.forwardAsync("theGame.loadRainbowBand();",false);
    
//     Cocoon.WebView.hide();
//     Cocoon.Touch.enable();
// }
// function water_ripple(){
//     Cocoon.App.forwardAsync("theGame.loadWaterRipple();",false);
    
//     Cocoon.WebView.hide();
//     Cocoon.Touch.enable();
// }
