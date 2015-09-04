var BO = BO || {};

BO.PlayerModule = (function(board){
  var level;
  var score;

  function init() {
    level = 1;
    score = 0;
  }

  function levelUp() {
    level++;
  }

  function addScore() {
    score += 10;
  }

  function getLevel() {
    return level;
  }

  function getScore() {
    return score;
  }

  function renderLevel() {
    var ctx = board.getContext();
    ctx.clearRect(10, 0, 150, 30);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Level: " + level, 10, 30);
  }

  function renderScore() {
    var ctx = board.getContext();
    ctx.clearRect(board.getWidth() - 180, 0, 180, 30);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Score: " + score, board.getWidth() - 180, 30);
  }

  return {
    init: init,
    getLevel: getLevel,
    getScore: getScore,
    levelUp: levelUp,
    addScore: addScore,
    renderLevel: renderLevel,
    renderScore: renderScore
  }
})(BO.BoardModule);