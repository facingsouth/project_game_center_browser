var BO = BO || {};

BO.PaddleModule = (function(){

  var initialPos = {x:135, y:130};
  var pos = {};
  var vel;
  var width = 30;
  var height = 5;

  function init() {
    pos.x = initialPos.x;
    pos.y = initialPos.y;
    vel = 0;
    render();
  }

  function render() {
    var ctx = document.getElementById("board").getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(pos.x, pos.y, width, height);
  }

  function hitBy(ball) {

  }

  function tic() {
    pos.x += vel;
  }

  function move(direction) {
    vel = direction;
  } 

  return {
    init: init,
    render: render,
  }
})();