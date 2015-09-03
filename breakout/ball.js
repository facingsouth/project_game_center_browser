var BO = BO || {};

BO.BallModule = (function(){
  var _radius = 5;

  function Ball(pos, vel) {
    this.pos = {};
    this.vel = {};
    this.pos.x = pos[0];
    this.pos.y = pos[1];
    this.vel.x = vel[0];
    this.vel.y = vel[1];
    this.radius = _radius;
  }

  Ball.prototype.render = function() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.stroke();
    // console.log("render ball");
  }

  Ball.prototype.clear = function() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.clearRect(this.pos.x-this.radius-1, this.pos.y-this.radius-1, 2*this.radius+2, 2*this.radius+2);
    // console.log("clear ball");
  }

  Ball.prototype.tic = function() {
    this.clear();
    this.pos.x = this.pos.x + this.vel.x;
    this.pos.y = this.pos.y + this.vel.y;
    this.render();
  }

  Ball.prototype.verticalBounce = function() {
    this.vel.y *= -1;
  }

  Ball.prototype.horizontalBounce = function() {
    this.vel.x *= -1;
  }

  Ball.prototype.addVelX = function(inc) {
    this.vel.x += inc;
  }


  return {
    Ball: Ball
  }

})();