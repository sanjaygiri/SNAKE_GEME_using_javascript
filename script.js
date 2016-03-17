var canvas=document.getElementById("canvas");
       var ctx=canvas.getContext("2d");
       var width=canvas.width;
       var height=canvas.height;
       var blockSize=10;
       var widthInBlocks=width / blockSize;
       var heightInBlocks=height / blockSize;
       var score=0;
       var speed=100;
       var drawBorder=function() {
        ctx.fillStyle= "Grey";
        ctx.fillRect(0,0,width,blockSize);
        ctx.fillRect(width-blockSize,0,blockSize,height);
        ctx.fillRect(0,height-blockSize,width,blockSize);
        ctx.fillRect(0,0,blockSize,height);
       };
       var printScore=function() {
          ctx.font="20px Courier";
          ctx.fillStyle="Black";
          ctx.textAlign="left";
          ctx.textBaseline="top";
          ctx.fillText("Score:"+score,10,10);
       };
       var gameOver=function() {
        ctx.font="50px Courier";
        ctx.fillStyle="Green";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText("Game Over!!",width/2,height/2);
         clearTimeout(timeoutId);
       };
       var circle=function(x,y) {
        ctx.beginPath();
        ctx.fillStyle="Red";
        ctx.arc(x,y,5,0,Math.PI*2,false);
        ctx.fill();
       };                                  
       var Block=function(col,row) {
        this.col=col;
        this.row=row;
       };
       Block.prototype.drawSquare= function() {
        var x=this.col*10;
        var y=this.row*10;
        ctx.fillStyle="Blue";
        ctx.fillRect(x,y,10,10);
       };
       Block.prototype.drawCircle=function() {
          var centerX=this.col*10+5;
          var centerY=this.row*10+5;
          ctx.fillStyle="Red";
          circle(centerX,centerY);
       };
       Block.prototype.equal=function(otherBlock){
          if(this.col===otherBlock.col && this.row===otherBlock.row){
            return true;
          }
       };                                 
       var Snake=function() {
        this.segments=[
        new Block(5,4),
        new Block(5,5),
        new Block(5,6)
        ];
        this.direction="right";
        this.nextDirection="right";
       };
       Snake.prototype.draw=function() {
        for (var i = 0;i<this.segments.length;i++) {
           this.segments[i].drawSquare();
        }
       };
       Snake.prototype.move=function() {
        var head=this.segments[0];
        var newHead;
        this.direction=this.nextDirection;
        if(this.direction==="right"){
            newHead=new Block(head.col+1,head.row);
          }else if(this.direction==="left"){
            newHead=new Block(head.col-1,head.row);
          }else if(this.direction==="up"){
            newHead=new Block(head.col,head.row-1);
          }else if(this.direction==="down"){
            newHead=new Block(head.col,head.row+1);
          }
          if(this.checkCollision(newHead)){
            gameOver();
            return;
          }

          this.segments.unshift(newHead);

          if(newHead.equal(apple.position)){
            score+=10;
            apple.move();
          }else{
            this.segments.pop();
          }
       };
       Snake.prototype.checkCollision=function(head) {
          var leftCollision=(head.col===0);
          var rightCollision=(head.col===widthInBlocks-1);
          var topCollision=(head.row===0);
          var bottomCollision=(head.row===heightInBlocks-1);
          var wallCollision=(leftCollision||topCollision)||(bottomCollision||rightCollision);
          var selfCollision=false;
          for (var i=0;i<this.segments.length;i++)
          {
            if(head.equal(this.segments[i])){
              selfCollision=true;
            }
          }
          return selfCollision||wallCollision;
        };                                          
        Snake.prototype.setDirection=function(newDirection) {
          if(this.direction==="up"&&newDirection==="down"){
            return;
          }else if(this.direction==="down"&&newDirection==="up"){
            return;
          }else if(this.direction==="left"&&newDirection==="right"){
            return;
          }else if(this.direction==="right"&&newDirection==="left"){
            return;
          }
          this.nextDirection=newDirection;
        };
        var Apple=function() {
          this.position= new Block(10,10);
        };
        Apple.prototype.draw=function() {
          this.position.drawCircle();
        };
        Apple.prototype.move=function() {
          var randomCol=Math.floor(Math.random()*38)+1;
          var randomRow=Math.floor(Math.random()*38)+1;
          this.position= new Block(randomCol,randomRow);
        };                                          
        var snake= new Snake();
        var apple= new Apple();
        var threshold = 10 ;            
        var main=function(){
          ctx.clearRect(0,0,400,400);
          printScore();
          drawBorder();
          snake.move();
          snake.draw();
          apple.draw();
         if (score >= threshold){
            speed -= 10 ;
            threshold += 10;
          }
          var timeoutId=setTimeout(main,speed);
        };
        main();
         var directions={
          37:"left",
          38:"up",
          39:"right",
          40:"down"
        };
        var eventHandler=function(event) {
          var newDirection=directions[event.keyCode];
          if(newDirection!== undefined){
            snake.setDirection(newDirection);
          }
        };
        $("body").keydown(eventHandler);