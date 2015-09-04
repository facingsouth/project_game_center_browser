// The overall game controller
// init models
// init board
// setup all the listeners
// start game loop

var BO = BO || {};

BO.BreakoutModule = (function(board, paddle, player, brickConstructor, ballConstructor){

  var _bricks;
  var _balls;
  var baseSpeed = 2;
  var game;

  function init() {
    player.init();
    reset();
    _initKeyDownListeners();
    _initKeyUpListeners();
    player.renderLevel();
    player.renderScore();
  }

  function reset() {
    board.init();
    paddle.init();

    _makeBricks();
    _makeBalls();
  }

  function _makeBricks() {
    _bricks = [];
    var numRows = player.getLevel() + 2;
    for (var i=0; i<7; i++) {
      for (var j=0; j<numRows; j++) {
        _bricks.push(new brickConstructor([i, j]));
        _bricks[i*numRows+j].render();      
      }
    }
  }

  function _makeBalls() {
    var x = board.getWidth() / 2;
    var y = board.getHeight() - 26;
    var angle = Math.floor(Math.random()*160+10)*Math.PI/180;
    var vx = baseSpeed * player.getLevel() * Math.cos(angle);
    var vy = baseSpeed * player.getLevel() * Math.sin(angle);
    _balls = [];

    _balls.push(new ballConstructor([x, y], [vx, vy]));
    _balls[0].render();
  }


  function _initKeyPressListeners() {
    $(document).keypress(function(e) {
      if (e.keyCode === 32) {
        clearInterval(game);
        _startGameLoop();
      }
    });
  }

  function _initKeyDownListeners() {
    $(document).keydown(function(e) {
      if (e.keyCode === 32) {
        clearInterval(game);
        _startGameLoop();
      } else if (e.keyCode === 37) {
        paddle.move(-1);
      } else if (e.keyCode === 39) {
        paddle.move(1);
      }
    });
  }

  function _initKeyUpListeners() {
    $(document).keyup(function(e) {
      if (e.keyCode === 37 || e.keyCode === 39) {
        paddle.stop();
      }
    });
  }

  function _startGameLoop(){
    console.log("setting up game loop");
    game = setInterval(function(){
      _tic();
    }, 10)
  }

  function _tic(){
    board.checkBounce(_balls[0]);
    paddle.checkBounce(_balls[0]);

    checkHitBricks();
    player.renderLevel();
    player.renderScore();

    _balls[0].tic();

    paddle.tic();

    checkClearLevel();
    checkGameOver();
  }

  function checkHitBricks() {
    var counter = 0;
    while (counter<_bricks.length) {
      if (_bricks[counter].checkHitBy(_balls[0])) {
        _bricks.splice(counter, 1);
        player.addScore();
      } else {
        counter++;
      }
    }
  }

  function checkGameOver() {
    checkWin(); 
    checkLose();
  }

  function checkClearLevel() {
    if (_bricks.length === 0) {
      player.levelUp();
      reset();
    }
  }

  function checkWin() {
    if (player.getLevel() > 9) {
      clearInterval(game);
      if (confirm("You are unbelievable! Play Again?")) {
        window.location.reload();
      };
    }
  }

  function checkLose() {
    if (board.hitBottom(_balls[0])){
      clearInterval(game);
      if (confirm("You Lose! Play Again?")) {
        window.location.reload();
      };
    }
  }

  return {
    init: init
  }

})(BO.BoardModule, BO.PaddleModule, BO.PlayerModule, BO.BrickModule.Brick, BO.BallModule.Ball);