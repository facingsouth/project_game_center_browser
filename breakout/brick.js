var BO = BO || {};

BO.BrickModule = (function(){

  var _brickWidth = 80;
  var _brickHeight = 30;
  var _offset = 50;
  var _gap = 5;

  function Brick(inds) {
    this.pos = {};
    this.pos.x = inds[0] * (_brickWidth + _gap) + _offset;
    this.pos.y = inds[1] * (_brickHeight + _gap) + _offset;
    this.width = _brickWidth;
    this.height = _brickHeight;
  }

  Brick.prototype.render = function() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  Brick.prototype.hitBy = function(ball) {
    return ball.pos.x >= this.pos.x - ball.radius               && 
           ball.pos.x <= this.pos.x + this.width + ball.radius  &&
           ball.pos.y >= this.pos.y - ball.radius               && 
           ball.pos.y <= this.pos.y + this.height + ball.radius;
  }

  Brick.prototype.leftOrRightHitBy = function(ball) {
    return this.hitBy(ball) &&
          (ball.pos.x - ball.vel.x < this.pos.x - ball.radius              ||
           ball.pos.x - ball.vel.x > this.pos.x + this.width + ball.radius) &&
           ball.pos.y >= this.pos.y - ball.radius               && 
           ball.pos.y <= this.pos.y + this.height + ball.radius;
  }

  Brick.prototype.topOrBottomHitBy = function(ball) {
    return this.hitBy(ball) &&
          (ball.pos.y - ball.vel.y < this.pos.y - ball.radius             ||
           ball.pos.y - ball.vel.y > this.pos.y + this.height + ball.radius) &&
           ball.pos.x >= this.pos.x - ball.radius               && 
           ball.pos.x <= this.pos.x + this.width + ball.radius;
  }

  Brick.prototype.clear = function() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.clearRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  Brick.prototype.checkHitBy = function(ball) {
    if (this.leftOrRightHitBy(ball)) {
      this.clear();
      ball.horizontalBounce();
      return true;
    } 
    if (this.topOrBottomHitBy(ball)) {
      this.clear();
      ball.verticalBounce();
      return true;
    }
    return false;
  }

  return {
    Brick: Brick,
  }
})();