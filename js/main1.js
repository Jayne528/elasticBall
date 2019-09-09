
window.onload = function() {

    var canvas = document.getElementById("canvas");
    var cx = canvas.getContext("2d");

    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;

    function drawVector(v, trans) {
        cx.beginPath();
        cx.moveTo(0, 0);
        cx.save();
        cx.rotate(v.angle());

        //文字
        cx.fillText(v,v.length()/2,10);
        cx.lineTo(v.length(),0);

        //箭頭
        cx.lineTo(v.length()-5, -4);
        cx.lineTo(v.length()-5, 4);
        cx.lineTo(v.length(), 0);

        cx.strokeStyle = "black";
        cx.lineWidth = 3;
        cx.stroke();
        cx.restore();

        if (trans) {
            cx.translate(v.x,v.y);
        }
    }

    function draw() {

        cx.clearRect(0, 0, ww, wh);
        var v1 = new Vector(250, 0);
        var v2 = new Vector(0, 200);
        var v3 = v1.add(v2).mul(-1);

        var c = new Vector(ww/2, wh/2); //視窗中心
        cx.restore();
        cx.save();
            cx.translate(c.x, c.y);
            var md = mousePos.sub(c);
            drawVector(md.mul(1/md.length()).mul(100), false);
        cx.restore();
        // cx.translate(ww/2,wh/2);
        // drawVector(v1,true);  //true 把所有向量連接起來
        // drawVector(v2,true);
        // drawVector(v3,true);
    }
   
    setInterval(draw, 30);

    var mousePos;
    canvas.addEventListener("mousemove", function(evt) {
        mousePos = new Vector(evt.x, evt.y);

        console.log("m:" + mousePos);
    })



    console.clear();
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
    console.log(a+"+"+b+"="+c);

    //減法
    Vector.prototype.sub = function(v) {
        return new Vector(this.x-v.x, this.y-v.y);
    }
    console.log(a+"-"+b+"="+c3);

    //縮放
    Vector.prototype.mul = function(s) {
         return new Vector(this.x*s, this.y*s);
    }
    console.log(b+"*2="+b2);

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

    var a = new Vector (4, 0);
    var b = new Vector (0, 3);
    var c = a.add(b);
    var c3 = a.sub(b);
    var b2 = b.mul(2);

    console.log(c+"的長度="+c.length());

    Vector.prototype.set = function(x, y){
        this.x = x;
        this.y = y;
        return this;
    }

    //比較
    Vector.prototype.equal = function(v){
        return (this.x == v.x) && (this.y == v.y);
    }

    var temp = new Vector(4, 5);
    console.log(c +" 跟 "+ temp + "一樣嗎?"+c.equal(temp));

    //複製新的向量
    Vector.prototype.clone = function(v){
        return new Vector(this.x, this.y);
    }
    //複製其中一個向量
    var newa = a.clone();
    newa.move(3,0);
    console.log(newa+"");
    console.log(a+"");
}
