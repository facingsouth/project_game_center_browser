var BO = BO || {};

BO.BrickModule = (function(){

  var _brickWidth = 30;
  var _brickHeight = 8;

  function Brick(pos) {
    this.pos = {};
    this.pos.x = pos[0];
    this.pos.y = pos[1];
    this.width = _brickWidth;
    this.height = _brickHeight;
  }

  Brick.prototype.render = function() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.fillStyle = "green";
    // ctx.globalAlpha = 0.5;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  Brick.prototype.hitBy = function(ball) {
    return ball.pos.x > this.pos.x - ball.radius               && 
           ball.pos.x < this.pos.x + this.width + ball.radius  &&
           ball.pos.y > this.pos.y - ball.radius               && 
           ball.pos.y < this.pos.y + this.height + ball.radius;
  }

  Brick.prototype.leftOrRightHitBy = function(ball) {
    return (ball.pos.x === this.pos.x - ball.radius              ||
           ball.pos.x === this.pos.x + this.width + ball.radius) &&
           ball.pos.y >= this.pos.y - ball.radius               && 
           ball.pos.y <= this.pos.y + this.height + ball.radius;
  }

  Brick.prototype.topOrBottomHitBy = function(ball) {
    return (ball.pos.y === this.pos.y - ball.radius             ||
           ball.pos.y === this.pos.y + this.height + ball.radius) &&
           ball.pos.x >= this.pos.x - ball.radius               && 
           ball.pos.x <= this.pos.x + this.width + ball.radius;
  }

  Brick.prototype.clear = function() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.clearRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  return {
    Brick: Brick,
  }
})();