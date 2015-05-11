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

function golden_fire(){
    Cocoon.App.forwardAsync("theGame.loadGoldenFireLoop();",false);
    
    Cocoon.WebView.hide();
    Cocoon.Touch.enable();
}
function rainbow_band(){
    Cocoon.App.forwardAsync("theGame.loadRainbowBand();",false);
    
    Cocoon.WebView.hide();
    Cocoon.Touch.enable();
}
