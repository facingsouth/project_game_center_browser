var BO = BO || {};

BO.BoardModule = (function(){

  var board;
  var ctx;
  var width;
  var height;

  function init() {
    board = document.getElementById("board");
    ctx = board.getContext("2d");
    width = 700;
    height = 500;
    console.log("init board");
  }

  function hitTop(ball) {
    return ball.pos.y - ball.radius <= 0;
  }

  function hitBottom(ball) {
    return ball.pos.y - ball.radius >= height;
  }

  function hitLeftOrRight(ball) {
    return ball.pos.x - ball.radius <= 0 || 
           ball.pos.x + ball.radius >= width;
  }

  function touchLeftOrRight(x, w) {
    return x < 0 || 
           x + w > width;
  }

  function checkBounce(ball) {
    if (hitTop(ball)) {
      ball.verticalBounce();
    }
    if (hitLeftOrRight(ball)) {
      ball.horizontalBounce();
    }
  }

  function getContext() {
    return ctx;
  }

  function getWidth() {
    return width;
  }

  function getHeight() {
    return height;
  }

  return {
    getContext: getContext,
    getWidth: getWidth,
    getHeight: getHeight,
    init: init,
    checkBounce: checkBounce,
    hitBottom: hitBottom,
    touchLeftOrRight: touchLeftOrRight
  }

})();