// The overall game controller
// init models
// init board
// setup all the listeners
// start game loop

var BO = BO || {};

BO.BreakoutModule = (function(board, paddle, brickConstructor, ballConstructor){

  var _bricks;
  var _balls;
  var score = 0;
  var game;

  function init() {
    board.init();
    paddle.init();

    _makeBricks();
    _makeBalls(); 

    _initKeyDownListeners();
    _initKeyUpListeners();
    // _initQuitButtonListener();
    renderScore();
  }

  function _makeBricks() {
    _bricks = [];
    for (var i=0; i<7; i++) {
      for (var j=0; j<3; j++) {
        _bricks.push(new brickConstructor([i, j]));
        _bricks[i*3+j].render();      
      }
    }
  }

  function _makeBalls() {
    var x = board.getWidth() / 2;
    var y = board.getHeight() - 26;
    var vx = Math.floor(Math.random()*10-5);
    var vy = Math.floor(Math.random()*5-5);
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
      // console.log("keydown");
      // console.log(e.keyCode);
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
      // console.log("keyup");
      // console.log(e.keyCode);
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
    renderScore();

    _balls[0].tic();

    paddle.tic();


    checkGameOver();
  }
  // function _initQuitButtonListener() {
  //   $("#quit").click(function() {
  //     clearInterval(game);
  //     init();
  //   });
  // }

  function checkHitBricks() {
    var counter = 0;
    while (counter<_bricks.length) {
      if (_bricks[counter].checkHitBy(_balls[0])) {
        _bricks.splice(counter, 1);
        score += 10;
      } else {
        counter++;
      }
    }
  }

  function renderScore() {
    var ctx = board.getContext();
    ctx.clearRect(board.getWidth() - 150, 0, 150, 30);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Score: " + score, board.getWidth() - 150, 30);
  }

  function checkGameOver() {
    checkWin(); 
    checkLose();
  }

  function checkWin() {
    if (_bricks.length === 0) {
      clearInterval(game);
      alert("You Win!");
    }
  }

  function checkLose() {
    if (board.hitBottom(_balls[0])){
      clearInterval(game);
      alert("You Lose!");
    }
  }

  return {
    init: init
  }

})(BO.BoardModule, BO.PaddleModule, BO.BrickModule.Brick, BO.BallModule.Ball);