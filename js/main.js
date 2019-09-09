
window.onload = function() {
    var canvas = document.getElementById("canvas");
    var cx = canvas.getContext("2d");

    ww = canvas.width = window.innerWidth;
    wh = canvas.height =window.innerHeight;

    window.addEventListener('resize', function() {
        ww = canvas.width = window.innerWidth;
        wh = canvas.height =window.innerHeight;
    })

   

    var Vector = function (x, y) {  
        this.x = x;
        this.y = y;
    }

    Vector.prototype.move = function(x, y) {
        this.x += x;
        this.y += y;
    }

    //加法
    Vector.prototype.add = function(v) {
        return new Vector(this.x+v.x, this.y+v.y);
    }

    //減法
    Vector.prototype.sub = function(v) {
        return new Vector(this.x-v.x, this.y-v.y);
    }
 
    //縮放
    Vector.prototype.mul = function(s) {
         return new Vector(this.x*s, this.y*s);
    }

    //長度
    Vector.prototype.length = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
   }

    //角度
    Vector.prototype.angle = function() {
      return Math.atan2(this.y, this.x);
   }
  

   //變成字串
    Vector.prototype.toString = function(v) {
        return "("+this.x+","+this.y+")";
    }

    Vector.prototype.set = function(x, y){
        this.x = x;
        this.y = y;
        return this;
    }

    //比較
    Vector.prototype.equal = function(v){
        return (this.x == v.x) && (this.y == v.y);
    }

    //複製新的向量
    Vector.prototype.clone = function(v){
        return new Vector(this.x, this.y);
    }




    
    var Ball = function() {

        //位置
        this.p = new Vector(ww/2, wh/2);
        //初始速度
        this.v = new Vector(-10, 3);

        //加速度
        this.a = new Vector(0, 1);
  
        //半徑
        this.r = 50;

        //是否有被拖曳
        this.dragging = false;

    }

    Ball.prototype.draw = function() {
        cx.beginPath();
        cx.save();
        //移動到球的中心再來畫
        cx.translate(this.p.x,this.p.y);
        cx.arc(0, 0, this.r, 0, Math.PI*2);
        cx.fillStyle = controls.color;
        cx.fill();
        cx.restore();


        this.drawV();
    }

    //速度線
    Ball.prototype.drawV = function(){
        

        //x,y 速度線(斜線)
        cx.beginPath();
        cx.save();
            cx.translate(this.p.x, this.p.y);
            cx.scale(3, 3);
            cx.moveTo(0, 0);
            cx.lineTo(this.v.x, this.v.y);
            cx.strokeStyle = "blue";
            cx.stroke();

            //x 速度線
            cx.beginPath();
            cx.moveTo(0, 0);
            cx.lineTo(this.v.x, 0);
            cx.strokeStyle = "red";
            cx.stroke();

            
            //y 速度線
            cx.beginPath();
            cx.moveTo(0, 0);
            cx.lineTo(0, this.v.y);
            cx.strokeStyle = "green";
            cx.stroke();

        cx.restore();

    }

    Ball.prototype.update = function() {

        if (this.dragging ==false) {

            this.p = this.p.add(this.v);
            // this.p.x += this.v.x;
            // this.p.y += this.v.y;
    
            this.v = this.v.add(this.a);
            // this.v.x += this.a.x;
            // this.v.y += this.a.y;
    

            //增加摩擦力
            this.v = this.v.mul(controls.fade);
            // this.v.x *=controls.fade;
            // this.v.y *=controls.fade;
    
            //最新狀態
            controls.vx = this.v.x;
            controls.vy = this.v.y;
            controls.ay = this.a.y;
    
            //更新完位置 再來確認有無撞到邊界
            this.checkBoundary();
        }
     
    }

    //檢查有無撞到邊界
    Ball.prototype.checkBoundary = function() {

        if(this.p.x + this.r > ww) {
            this.v.x = -Math.abs(this.v.x);
        }
        if(this.p.x - this.r < 0) {
            this.v.x = Math.abs(this.v.x);
        }
        if(this.p.y + this.r > wh) {
            this.v.y = -Math.abs(this.v.y);
        }
        if(this.p.y - this.r < 0) {
            this.v.y = Math.abs(this.v.y);
        }
    }

    //控制項
    var controls = {
        vx:0,
        vy:0,
        ay:0.6, //加速度
        fade:0.99, //摩擦力
        update:true, //是否執行這次更新
        color:"#fff",
        step: function() {  // 當沒有update 手動操作
            ball.update();
        },
        FPS:30  //畫面更新率
    }


    var gui = new dat.GUI();


    //listen gui跟著連動 .onChange 改變數值
    gui.add(controls,"vx", -50, 50).listen().onChange(function(value) {
        ball.v.x = value;
    }); 
    gui.add(controls,"vy", -50, 50).listen().onChange(function(value) {
        ball.v.y = value;
    }); 

    // .step(0.001) 更精細的設定
    gui.add(controls,"ay", -1, 1).step(0.001).listen().onChange(function(value) {
        ball.a.y = value;
    }); 

    //摩擦力
    gui.add(controls,"fade",0, 1).step(0.001).listen();
     
    gui.add(controls,"update");

    gui.addColor(controls,"color");

    gui.add(controls,"step");
    gui.add(controls,"FPS",1, 120); //每秒1個影格~120個


    var ball;

    //初始化
    function init() {

        ball = new Ball();
        
    }

    init();

    //更新物理變化
    function update() {

        if (controls.update) {
            ball.update();
        }
     
    }

    setInterval(update, 1000/30); //一秒鐘執行30次
    //繪圖
    function draw() {

        cx.fillStyle = "rgba(0, 0, 0, 0.7)";
        cx.fillRect(0, 0, ww, wh);

        //把自己畫出來
        ball.draw();

        setTimeout(draw,1000/controls.FPS);
    }

    draw();


    var mousePos = {
        x:0,
        y:0
    }

    //兩點距離
    function getDistance(p1, p2) {

        var temp1 = p1.x - p2.x;
        var temp2 = p1.y - p2.y;
        var dist = Math.sqrt(Math.pow(temp1,2) + Math.pow(temp2,2));
        return dist;
    }

    //沒用offset.x 是因為 canvas畫布大小跟螢幕一樣
    canvas.addEventListener("mousedown", function(evt) {
        mousePos = new Vector(evt.x, evt.y)
        console.log(mousePos)

        // var dist = getDistance(mousePos, ball.p);
        var dist = mousePos.sub(ball.p).length() ;

        if (dist < ball.r) {
            console.log("ball clicked");
            ball.dragging = true;
        }
    })

    //跟著滑鼠移動
    canvas.addEventListener("mousemove", function(evt) {
        
        var nowPos = new Vector(evt.x, evt.y);
     

        if (ball.dragging) {

            var delta = nowPos.sub(mousePos);
            // var dx = nowPos.x - mousePos.x;
            // var dy = nowPos.y - mousePos.y;

            ball.p = ball.p.add(delta);
            // ball.p.x += dx;
            // ball.p.y += dy;

            //讓放開的最後速度等於dx dy
            
            ball.v = delta.clone();
            // ball.v.x = dx;
            // ball.v.y = dy;
        }


        var dist = getDistance(mousePos, ball.p);
        if (dist < ball.r) {
            canvas.style.cursor = "move"
        } else {
            canvas.style.cursor = "initial"
        }


        mousePos = nowPos;
    })

    //滑鼠放開 解除拖曳
    canvas.addEventListener("mouseup", function(evt) {
        ball.dragging = false;
    })
    
}
