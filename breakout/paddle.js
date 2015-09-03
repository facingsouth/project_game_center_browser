var BO = BO || {};

BO.PaddleModule = (function(){

  var initialPos = {x:135, y:130};
  var pos = {};
  var vel;
  var speed;
  var width = 30;
  var height = 5;

  function init() {
    pos.x = initialPos.x;
    pos.y = initialPos.y;
    speed = 5;
    vel = 0;
    render();
  }

  function render() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(pos.x, pos.y, width, height);
  }

  function clear() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.clearRect(pos.x, pos.y, width, height);
  }

  function hitBy(ball) {
    return ball.pos.x >= pos.x && 
           ball.pos.x <= pos.x + width && 
           ball.pos.y + ball.radius >= pos.y &&
           ball.pos.y + ball.radius <= pos.y + height;
  }

  function tic() {
    if (pos.x + vel >= 0 && pos.x + vel <= 300 - width)
      pos.x += vel;
  }

  function move(direction) {
    vel = direction*speed;
  }

  function stop() {
    vel = 0;
  }

  function getVel() {
    return vel;
  }

  return {
    init: init,
    render: render,
    clear: clear,
    tic: tic,
    move: move, 
    stop: stop,
    hitBy: hitBy,
    getVel: getVel
  }
})();