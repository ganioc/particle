/**
 * @fileOverview
 * @name demo.js
 * @author Spike Yang
 * @license 
 */


var theGame = (function(){
    //var start = 0;
    var canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
    var dpr = window.devicePixelRatio;
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var ctx= canvas.getContext("2d");
    var bGameRunning = false;
    var currentGameLoop = null;

    //var touch_callback = null;

    var imgPathList = [
        { path:'img/button_silver_80.png',
          name:'button'
        },
        { path:'img/fly_50.png',
          name:'fly'
        },
        { path:'img/flystepback_50.png',
          name:'flystepback'
        },
        { path:'img/pebble.png',
          name:'waterripple'
        }
    ];

    var imgList = [];
    var numImageLoaded = 0;

    // to judge if a point is within a rectangle
    function bPointWithinRect(x0,y0,x,y,w,h){
        if( !( x0 <x || x0 >(x + w) || y0 > (y + h) || y0 < y )){
            return true;
        }else{
            return false;
        }
    }

    function get_image(ilist,name){
        var result = _.find(ilist,function(c){
            return c.name === name;
        });
        if(!result) { throw 'image ' + name + ' not found.'; }
        return result;
    }
    function init_images(img_path, img_list,callback){
        
        for(var i=0;i < img_path.length; i++){
            img_list[i] = new Image();
            img_list[i].src = img_path[i].path;
            img_list[i].name = img_path[i].name;
            img_list[i].onload = function(){
                numImageLoaded += 1;
                if(numImageLoaded === img_path.length){
                    console.log('img loaded.');
                    callback();
                }
            };
        }
    }

    function touch_move_default(event){
        

    }
    function touch_start_default(event){
        // console.log('touch');
        // console.log(event);
        // console.log(event.touches[0].pageX);
        // console.log(event.touches[0].pageY);
        // console.log('width:' + ctx.canvas.width + 'height:' + ctx.canvas.height);
        // console.log('dpr:' + dpr);
        // console.log('canvas-width:' + canvas.width + ' canvas-height:' + canvas.height);
                
        if( !MenuButton.bWithin(event.touches[0].pageX, event.touches[0].pageY)){
            //event.preventDefault();
            return;
        }
        
        end_loop();

        // canvas.addEventListener(
        //     "touchstart",
        //     touch_start_default,
        //     false
        // );
        // canvas.addEventListener(
        //     "touchmove",
        //     touch_move_default,
        //     false
        // );
        
        Cocoon.App.forwardAsync("Cocoon.WebView.show(0, 0, " + canvas.width * window.devicePixelRatio + "," + canvas.height * window.devicePixelRatio + ");");
        /*
         * Disable the touch events in the CocoonJS side so this event is not called when there is touches over the webview.
         */
        Cocoon.Touch.disable();
        
    }
    function init_canvas(){

        //touch_callback = touch_default;
        
        canvas.addEventListener(
            "touchstart",
            touch_start_default,
            false
        );
        canvas.addEventListener(
            "touchmove",
            touch_move_default,
            false
        );
        canvas.addEventListener(
            "mousedown",
            function(event) 
            {
                console.log('click');
                //console.log(event);
                
                if( !MenuButton.bWithin(event.pageX, event.pageY)){
                    //event.preventDefault();
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
            var bPressed = false;
            var img = null;
            
            return {
                draw:function(){
                    //ctx.drawImage(get_image(imgList,'button'),10,10);
                    if(!bPressed){
                        ctx.drawImage(img,0,0,80,80,originX,originY,width,height);
                    }
                    //ctx.fillStyle = 'yellow';
                    //ctx.fillRect(originX, originY, width, height);
                    //console.log(':' + originX + ':' + originY);
                    //console.log('menubutton draw()');
                },
                bWithin: function(cx,cy){
                    if( !( cx <originX || cx >(originX + width) || cy > (originY + height) || cy < delta )){
                        return true;
                    }else{
                        return false;
                    }
                },
                getButtonWidth: function(){
                    return width + 2* delta;
                },
                init:function(){
                    img = get_image(imgList,'button');
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
    function createGameLoop(handler, callback){
        var start;
        return function(timestamp){
            if(!start){
                start = timestamp;
            }
            
            var td = (timestamp - start)/1000; // in micro second
            start = timestamp;

            if(!bGameRunning){
                console.log('out of game loop');
                //remove callback , do some housekeeping here
                callback();
            }
            else{
                handler(td);
                window.requestAnimationFrame(currentGameLoop);
            }
        };
    }

    function splashLoop(td){
        var str = 'Boxshell.com';
        var strPS = '2015';
        var strFontStyle = '40px serif';
        var strPSFontStyle = '20px serif';
        return function(td){
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = strFontStyle;
            ctx.textAlign = 'center';
            ctx.fillText(str, ctx.canvas.width/2, ctx.canvas.height/2);
            ctx.font= strPSFontStyle;
            ctx.fillText(strPS,ctx.canvas.width/2,ctx.canvas.height/2 + 40);
        };
    }
    
  /**
 * This is game loop of golden firework simulation
 * @param {} function
 * @returns {} 
 * @throws {} 
 */  
    function goldenFireLoop(td){
        var counterFPS = 0;
        var counter = 0;
        var strFPS= '';
        //var cWidth = ctx.canvas.width * window.devicePixelRatio;
        //var cHeight = ctx.canvas.height * window.devicePixelRatio;
        
        var emitX = ctx.canvas.width/2;
        var emitY = ctx.canvas.height/2;
        var emitX2 = ctx.canvas.width/2;
        var emitY2 = ctx.canvas.height/4;

        var PARTICLE_NUM = 100;
        var MAX_PARTICLES = 5000;
        var NFIELDS = 5; // x,y, vx, vy, age
        var PARTICLES_LENGTH = MAX_PARTICLES * NFIELDS;
        var MAX_AGE = 4;
        var drag = 0.99;
        var gravity = 20;
        // var r = 220,r2 = 100,
        //     g = 220,g2 = 
        //     b = 10;
        
        var Float32Array = window.Float32Array || Array;
        var particles = new Float32Array(PARTICLES_LENGTH);
        var particles2 = new Float32Array(PARTICLES_LENGTH);
        var particles_i = 0;
        var particles_i_2 =0;


        var touchstartCallback = function(event){
            touch_start_default(event);
            console.log('touch number:' + event.touches.length);
            emitX = event.touches[0].pageX;
            emitY = event.touches[0].pageY;
            if(event.touches.length>=2){
                emitX2 = event.touches[1].pageX;
                emitY2 = event.touches[1].pageY;
            }
            
        };
        var touchMoveCallback = function(event){
            //console.log(event.touches.length);
            emitX = event.touches[0].pageX;
            emitY = event.touches[0].pageY;
            if(event.touches.length>=2){
                emitX2 = event.touches[1].pageX;
                emitY2 = event.touches[1].pageY;
            }

        };
        canvas.addEventListener(
            "touchstart",
            touchstartCallback,
            false
        );

        canvas.addEventListener(
            'touchmove',
            touchMoveCallback,
            false
        );
        
        
        function emit(x,y){
            for(var i = 0; i< PARTICLE_NUM; i++){                particles_i = (particles_i + NFIELDS)% PARTICLES_LENGTH;
                particles[particles_i] = x;
                particles[particles_i + 1] = y;
                var alpha = fuzzy(Math.PI),
                    radius = Math.random() * 100;
                particles[particles_i + 2] = Math.cos(alpha)* radius;
                particles[particles_i + 3] = Math.sin(alpha)* radius;
                particles[particles_i + 4] = Math.random();
            }
        }
        function emit2(x,y){
            for(var i = 0; i< PARTICLE_NUM; i++){                particles_i_2 = (particles_i_2 + NFIELDS)% PARTICLES_LENGTH;
                particles2[particles_i] = x;
                particles2[particles_i + 1] = y;
                var alpha = fuzzy(Math.PI),
                    radius = Math.random() * 100;
                particles2[particles_i_2 + 2] = Math.cos(alpha)* radius;
                particles2[particles_i_2 + 3] = Math.sin(alpha)* radius;
                particles2[particles_i_2 + 4] = Math.random();
            }
        }
        
        return {
            loop:function(td){
                emit(emitX, emitY);
                emit(emitX2, emitY2);
                //ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

                
                //ctx.save();
                ctx.fillStyle = 'rgba(120,55,10,1)';
                ctx.globalCompositeOperation = 'lighter';
                //console.log('td:' + td);
                //var imgdata = ctx.getImageData(0,0,cWidth, cHeight);
                //var data = imgdata.data;
                for(var i=0; i< PARTICLES_LENGTH; i+= NFIELDS){
                    if( (particles[i+4] += td) > MAX_AGE){
                        continue;
                    }

                    //Math.ceil
                    var x = ~~(particles[i]= (particles[i]+
                                              (particles[i+2]*=drag)*td));
                    var y = ~~(particles[i+1] = (particles[i+1]+
                                                 (particles[i+3]=(particles[i+3] + gravity*td)*drag)*td));
                    // check bounds
                    if( x<0||x>=canvas.width||y<0||y>=canvas.height){
                        continue;
                    }
                    
                    ctx.fillRect(x,y,2,2);
                    
                }
                ctx.fillStyle = 'rgba(33,255,33,1)';
                //ctx.globalCompositeOperation = 'lighter';
                //console.log('td:' + td);
                //var imgdata = ctx.getImageData(0,0,cWidth, cHeight);
                //var data = imgdata.data;
                for(var i2=0; i2< PARTICLES_LENGTH; i2+= NFIELDS){
                    if( (particles2[i2+4] += td) > MAX_AGE){
                        continue;
                    }

                    //Math.ceil
                    var x2 = ~~(particles2[i2]= (particles2[i2]+
                                                 (particles2[i2+2]*=drag)*td));
                    var y2 = ~~(particles2[i2+1] = (particles2[i2+1]+
                                                    (particles2[i2+3]=(particles2[i2+3] + gravity*td)*drag)*td));
                    // check bounds
                    if( x<20||x2>=canvas.width||y2<0||y2>=canvas.height){
                        continue;
                    }
                    
                    ctx.fillRect(x2,y2,2,2);
                    // End of particles looping
                }

                ctx.globalCompositeOperation = 'source-over';
                // FPS counting
                counter +=1;
                counterFPS +=td;

                ctx.fillStyle = 'white';
                ctx.font ='20px serif';
                ctx.textAlign = 'left';
                ctx.fillText( 'FPS:'+strFPS ,10,ctx.canvas.height - 20);
                if( counter === 50){
                    strFPS = (counterFPS/ counter).toPrecision(3);
                    counter = 0;
                    counterFPS = 0;
                }

                // End of FPS counting
                
                MenuButton.draw();
            },//End of golden_fire
            housekeeping:function(){
                canvas.removeEventListener(
                    "touchstart",
                    touchstartCallback,
                    false
                );

                canvas.removeEventListener(
                    'touchmove',
                    touchMoveCallback,
                    false
                );
            }
            
        };
    }
    // End of golden_fire loop
    function rainbowBandLoop(td){

        var MAX_PARTICLES = 9; // Or we consider to change it according to screen height

        var HEIGHT = Math.floor(ctx.canvas.height/ MAX_PARTICLES);
        HEIGHT = (HEIGHT%2 === 0)?HEIGHT:(HEIGHT -1);
        console.log('HEIGHT is:' + HEIGHT);
        //var SPEED = 2; //Math.floor(HEIGHT/SPEED_NUM);
        var RAINBOW_SPEED = 80;
        var RAINBOW_DELTA = 0;
        var thresh = -HEIGHT;
        var PARTICLES_LENGTH = (MAX_PARTICLES + 2);
        var SPACING = MenuButton.getButtonWidth();
        
        function Particle(){
            var x,y,vx,vy,color;
        }
        var particles = [];
        for(var i =0; i< PARTICLES_LENGTH; i++){
            particles.push(new Particle());
        }
        var particles_i = 0 ;
        var bEmit = true;

        function Fly(option){
            this.x = option.x||ctx.canvas.width/2;
            this.y = option.y||0;
            this.width = option.width||30;
            this.height = option.height||30;
            this.size = 1;
            this.color = 'white';
            this.speed = option.speed||300;
            this.xspeed = 0;
            this.state = 'crouch';// fall, crouch, jump ... state
            this.crouch_i = option.crouch_i||0;
            this.image = get_image(imgList, 'fly');
            this.imageStepBack = get_image(imgList, 'flystepback');
            this.pace = 0;
            this.pace_counter = 0;
            //this.bTouched = false;
        };

        Fly.prototype.changeDirection = function(param){
            if(param ==='wild'){
                if(this.x < (ctx.canvas.width/2 - 5)){
                    this.xspeed = (Math.random()>0.5)?90:40;
                }
                else if( this.x > (ctx.canvas.width/2 + 5)){
                    this.xspeed = (Math.random()>0.5)?-90:-40;
                }
                else{
                    this.xspeed = (Math.random()>0.6)?30:-90;
                }

            }else{
                
                if(this.x < (ctx.canvas.width/2 - 5)){
                    this.xspeed = (Math.random()>0.5)?50:20;
                }
                else if( this.x > (ctx.canvas.width/2 + 5)){
                    this.xspeed = (Math.random()>0.5)?-50:-20;
                }
                else{
                    this.xspeed = (Math.random()>0.6)?0:-70;
                }
            }
        };
        
        Fly.prototype.update = function(td){
            if(this.state === 'crouch'){
                //console.log('::' + y_temp);
                this.y += particles[this.crouch_i].vy * td;
                //console.log(':' + y_temp);
                if( particles[this.crouch_i].y + HEIGHT >= ctx.canvas.height){
                    this.state = 'jump';
                    this.changeDirection();
                }
            }
            else if( this.state === 'jump'){
                this.y = this.y - this.speed * td;
                this.x = this.x + this.xspeed * td;
                
                this.pace_counter += 1;
                if( this.pace_counter === 5){
                    this.pace = ~this.pace;
                    this.pace_counter = 0;
                }
                
                    
                var _y = this.y,
                    _height = this.height;
                
                    if( this.y < ctx.canvas.height/3 && this.y >=0){
                        var _index = _.findIndex(particles,function(c){
                            var distance = _y + _height - c.y - HEIGHT/2;
                            //console.log('dist:' + distance);
                            if(Math.abs(distance) < HEIGHT/4){
                                return true;
                            }
                            else{
                                return false;
                            }
                        });
                        
                        if(_index !== -1 && Math.random()>0.9){
                            this.crouch_i = _index;
                            this.state = 'crouch';
                            //this.bTouched = false;
                        }
                        
                    }
                else if( this.y < 0){
                    //console.log('into <0');
                    var index = _.findIndex(particles, function(c){
                        if(c.y <=0){
                            return true;
                        }else{
                            return false;
                            }
                    });
                    if(index != -1){
                        //console.log('not -1');
                        this.crouch_i = index;
                        this.state = 'crouch';
                        //this.bTouched = false;
                    }
                    else{
                        //console.log('is -1');
                        this.crouch_i = 0;
                        this.state = 'crouch';
                        //this.bTouched = false;
                    }
                }
                else{
                    ;//console.log('It should never happen ...');
                }
            }
                // this.my = y_temp;
        };
        // end of Fly update()
        
        Fly.prototype.draw = function(){
            //ctx.fillStyle = this.color;
            //ctx.fillRect(this.x,this.y,this.width*this.size,this.height*this.size);
            if( this.pace === 0){
                ctx.drawImage(this.image,0,0,50,52,this.x,this.y, this.width,this.height );
            }
            else{
                ctx.drawImage(this.imageStepBack,0,0,50,52,this.x,this.y,this.width,this.height);
            }
        };
        // End of Fly draw()

        // to generate the color in emit
        var createColor = function(){
            var tick = 0;
            var COLOR_SPACING = 5;
            var COLOR_STEP = 0xff/COLOR_SPACING;
            
            var color_list = new Array();
            var color_list_index=0;

            for(var i =0; i< COLOR_SPACING;i ++){
                for( var j=0; j< COLOR_SPACING; j++){
                    for( var k=0; k< COLOR_SPACING; k++){
                        var r = i*COLOR_STEP;
                        var g = j*COLOR_STEP;
                        var b = k*COLOR_STEP;
                        color_list[color_list_index] = r<<16|b<<8|g;
                        color_list_index += 1;
                    }
                }
            }
            color_list_index = ~~(Math.random()*color_list.length) -1;
            
            return function (){
                tick += 1;
                if( true ){
                    color_list_index += 1;
                    if(color_list_index >= color_list.length){
                        color_list_index = 0;
                    }
                }
                return color_list[color_list_index];
            };
        };
        // endof createColor

        var fly1 = null;
        var color = createColor();

        function emit(td,delta){
            //console.log(angle.toString(16));
            particles[particles_i].x = SPACING;     //x
            particles[particles_i].y = -HEIGHT + delta;
            particles[particles_i].vx = 0;   //vx
            particles[particles_i].vy = RAINBOW_SPEED;  //vy
            particles[particles_i].color = color(); //
            
            particles_i = (particles_i + 1)%PARTICLES_LENGTH;
        }

        // catch touchstart, if touch the fly, then the fly will change to jump state
        var touchstartCallbackRainbowBand =
                function(event){
                    var delta = 0;
                    console.log('touch-happened:' + event.touches[0].pageX + ':' + event.touches[0].pageY);
                    console.log('fly:' + fly1.x + ':' + fly1.y + ':' + fly1.width + ':' + fly1.height);
                    console.log('touch length:' + event.touches.length);

                    if(bPointWithinRect(event.touches[0].pageX - delta, event.touches[0].pageY - delta,fly1.x,fly1.y,30,30)){
                        console.log('on a fly');
                        if(fly1.state === 'crouch'){
                            fly1.state = 'jump';
                            fly1.changeDirection('wild');
                        }
                        else if(fly1.state === 'jump'){
                            if(fly1.x < (ctx.canvas.width/2)){
                                fly1.xspeed = (Math.random()>0.5)?60:40;
                            }
                            else{
                                fly1.xspeed = (Math.random()>0.5)?-60:-40;
                            }
                        }
                    }else{
                        console.log('not on a fly');
                    }
                };
        
        canvas.addEventListener(
            'touchstart',
            touchstartCallbackRainbowBand,
            false
        );

        
        // rainbow loop function
        return {
            loop:function(td){
                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

                thresh += RAINBOW_SPEED * td;
                if( thresh >= 1){
                    //bEmit = true;
                    emit(td, thresh);
                    thresh = -HEIGHT;
                    //RAINBOW_DELTA = thresh;
                    if(!fly1){
                        fly1 = new Fly({
                            x:particles[0].x + Math.random()* ctx.canvas.width/2,
                            y:particles[0].y + HEIGHT/2 -20,
                            crouch_i:0,
                            width:30,
                            height:30,
                            speed: 300
                        });
                    }
                }
                
                for(var i=0;i < PARTICLES_LENGTH;i++){
                    var x = particles[i].x;
                    var y = particles[i].y;

                    var color = particles[i].color;

                    if(particles[i].vy> 0){
                        var str = color.toString(16);
                        if(str.length === 2){
                            str = '0000' + str;
                        }
                        else if(str.length === 4){
                            str = '00' + str;
                        }
                        
                        ctx.fillStyle = '#' + str; //
                        ctx.fillRect(x, y, ctx.canvas.width - x*2, HEIGHT);
                        
                        particles[i].y = particles[i].y + RAINBOW_SPEED*td;
                        
                    }
                }// end of for
                if(fly1){
                    fly1.update(td);
                    fly1.draw();
                }
                MenuButton.draw();
            },
            housekeeping:function(){
                canvas.removeEventListener(
                    'touchstart',
                    touchstartCallbackRainbowBand,
                    false
                );
            }
        };
    }
    // end of rainbowBandLoop

    // begin of waterRippleLoop
    function waterRippleLoop(){
        var width = ctx.canvas.width,
            height = Math.floor(ctx.canvas.height/4);

        var y_top = height;
        var y_top_num = y_top* width;
        
        var origin_img = get_image(imgList, 'waterripple');
        
        var size = width* height;

        var buffer0 = [], buffer1 = [];
        var aux, texture, origin_texture;

        for(var i=0; i< size; i++){
            buffer0.push(0);
            buffer1.push(0);
        }
        
        function touchstartCallbackWaterRipple(event){
            disturb( event.touches[0].pageX,
                     event.touches[0].pageY - y_top,15000);
        }
        function touchmoveCallbackWaterRipple(event){
            disturb( event.touches[0].pageX,
                     event.touches[0].pageY - y_top, 15000);
        }
        function clickCallbackWaterRipple(event){
            console.log('mouse down');
            console.log(event.clientX + ' ' + event.clientY);
            console.log('page:' + event.pageX + ' ' + event.pageY);
            disturb(event.clientX, event.clientY- y_top, 15000);
        }
        canvas.addEventListener(
            'touchstart',
            touchstartCallbackWaterRipple,
            false
        );
        canvas.addEventListener(
            'touchmove',
            touchmoveCallbackWaterRipple,
            false
            
        );
        canvas.addEventListener(
            'mousedown',
            clickCallbackWaterRipple,
            false
        );

        function disturb(x,y,z){
            if(x<2 || x> width -2|| y<1 || y> (height -2)){
                return;
            }
            var i = x+ (y)* width;
            buffer0[i] += z;
            buffer0[i-1] -= z;

        }

        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(origin_img,0, y_top, width, height);
        //ctx.fillStyle='black';
        //ctx.fillRect(0,0, width, height);
        
        texture = ctx.getImageData(0,y_top,width,height);// what is on the canvas
        origin_texture = ctx.getImageData(0, y_top,width,height); // the original color

        //var light = 10;
        //disturb(100, 100, 10000);
        //var comp_Y = Math.floor(height/2)* width;
        
        return {
            loop: function(td){

                //console.log(td);
                var i, x, Xoffset, Yoffset, Shading;

                ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

                //average cells to make surface more even
                for(i = width +1; i< size - width -1; i+= 2){
                    for( x=1; x< width -1; x++, i++){
                        buffer0[i] =
                            (buffer0[i]
                             +buffer0[i+1]
                             +buffer0[i-1]
                             +buffer0[i-width]
                             +buffer0[i+width])/5;
                    }
                }

                for(i = width +1; i< size - width -1; i+= 2){
                    for( x=1; x< width -1; x++, i++){
                        // wave propagation
                        var waveHeight = (buffer0[i-1] + buffer0[i+1] + buffer0[i+width] + buffer0[i-width])/2 -buffer1[i];
                        buffer1[i] = waveHeight;
                        // calculate index in the texture with some fake referaction
                        var ti = i + ~~((buffer1[i-2]-buffer1[i])*0.08)+ ~~((buffer1[i-width]-buffer1[i])*0.08)*width;
                        // clamping
                        ti = ti < 0 ? 0 : ti > size ? size : ti;
                        // some very fake lighting and caustics based on the wave height
                        // and angle
                        var light = buffer1[i]*2.0-buffer1[i-2]*0.6,
                            i4 = (i )*4,
                            ti4 = (ti)*4;
                        // clamping
                        light = light < -10 ? -10 : light > 100 ? 100 : light;
                        origin_texture.data[i4] = texture.data[ti4]+light;
                        origin_texture.data[i4+1] = texture.data[ti4+1]+light;
                        origin_texture.data[i4+2] = texture.data[ti4+2]+light;                        
                        
                    }
                }
                if(Math.random()<0.3){
                    disturb(Math.floor(Math.random()*width), Math.floor(Math.random()*height), Math.random()*10000);
                }
                //swap buffers
                aux = buffer0;
                buffer0 = buffer1;
                buffer1 = aux;

                ctx.putImageData(origin_texture, 0, y_top);
                
                MenuButton.draw();
            },
            housekeeping:function(){
                canvas.removeEventListener(
                    'touchstart',
                    touchstartCallbackWaterRipple,
                    false
                );
                canvas.removeEventListener(
                    'touchmove',
                    touchmoveCallbackWaterRipple,
                    false
                );
                canvas.removeEventListener(
                    'mousedown',
                    clickCallbackWaterRipple,
                    false
                );
            }
        };
    }
    // end of waterRippleLoop


    function funcWrapperLoop(func){
        return function(){
            var obj = func();
            currentGameLoop = createGameLoop(obj.loop,
                                             obj.housekeeping );
            start_loop();
        };
    }
    
    return {
        pre_init: function(callback){
            init_canvas();
            init_images(imgPathList,imgList,callback);
        },
        init: function(){
            MenuButton.init();
            currentGameLoop = createGameLoop(splashLoop());
            start_loop();
        },
        loadGoldenFireLoop:funcWrapperLoop(goldenFireLoop),
        loadRainbowBand: funcWrapperLoop(rainbowBandLoop),
        loadWaterRipple: funcWrapperLoop(waterRippleLoop)
        
    };

})();

window.theGame = theGame;

theGame.pre_init(theGame.init);

