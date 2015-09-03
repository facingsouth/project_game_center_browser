var BO = BO || {};

BO.PaddleModule = (function(board){

  var initialPos = {x:135, y:130};
  var pos = {};
  var vel;
  var speed;
  var width = 50;
  var height = 5;

  function init() {
    // pos.x = initialPos.x;
    // pos.y = initialPos.y;
    pos.x = (board.getWidth() - width) / 2;
    pos.y = board.getHeight() - 20;
    speed = 5;
    vel = 0;
    render();
  }

  function render() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.fillStyle = "blue";
    ctx.fillRect(pos.x, pos.y, width, height);
  }

  function clear() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.clearRect(pos.x, pos.y, width, height);
  }

  function hitBy(ball) {
    return ball.pos.x >= pos.x - ball.radius               && 
           ball.pos.x <= pos.x + width + ball.radius       &&
           ball.pos.y >= pos.y - ball.radius               && 
           ball.pos.y <= pos.y + height + ball.radius;
  }

  function topHitBy(ball) {
    return hitBy(ball) &&
           ball.pos.y - ball.vel.y < pos.y - ball.radius             &&
           ball.pos.x >= pos.x - ball.radius                         && 
           ball.pos.x <= pos.x + width + ball.radius;
  }

  function checkBounce(ball) {
    if (topHitBy(ball)) {
      ball.verticalBounce();
      ball.addVelX(vel/5);
    }
  }

  function tic() {
    if (!board.touchLeftOrRight(pos.x+vel, width)) {
      clear();
      pos.x += vel;
      render();
    }
  }

  function move(direction) {
    vel = direction*speed;
  }

  function stop() {
    vel = 0;
  }

  // function getVel() {
  //   return vel;
  // }

  return {
    init: init,
    render: render,
    clear: clear,
    tic: tic,
    move: move, 
    stop: stop,
    checkBounce: checkBounce
  }
})(BO.BoardModule);