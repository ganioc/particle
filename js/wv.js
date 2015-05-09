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
    //Cocoon.App.forwardAsync("ctx.clearRect(0,0,canvas.width/2,canvas.height/2);");
    
    Cocoon.WebView.hide();
    Cocoon.Touch.enable();
}
