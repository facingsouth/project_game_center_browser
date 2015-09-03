// The overall game controller
// init models
// init board
// setup all the listeners
// start game loop

var BO = BO || {};

BO.BreakoutModule = (function(){

  var _bricks;
  var _balls;
  var _paddle;
  var game;

  function init() {
    _bricks = [];
    _balls = [];
    for (var i=0; i<7; i++) {
      for (var j=0; j<3; j++) {
        _bricks.push(new BO.BrickModule.Brick([30+i*35, 10+j*10]));
        _bricks[i*3+j].render();      
      }
    }

    var vx = Math.floor(Math.random()*5-2);
    var vy = Math.floor(Math.random()*2-2);

    _balls.push(new BO.BallModule.Ball([150, 125], [vx, vy]));
    _balls[0].render();

    _paddle = BO.PaddleModule;
    _paddle.init();

    // _initKeyPressListeners();
    _initKeyDownListeners();
    _initKeyUpListeners();
    // _initQuitButtonListener();
    // _startGameLoop();
  }

  function _tic(){
    if (hitTop()) {
      _balls[0].verticalBounce();
    }
    if (hitLeftOrRight()) {
      _balls[0].horizontalBounce();
    }
    if (_paddle.hitBy(_balls[0])) {
      _balls[0].verticalBounce();
      // console.log("paddle vel");
      // console.log(_paddle.getVel());
      _balls[0].addVelX(_paddle.getVel()/5);
    }
    var counter = 0;
    while (counter<_bricks.length) {
      if (_bricks[counter].leftOrRightHitBy(_balls[0])) {
        _bricks[counter].clear();
        _bricks.splice(counter, 1);
        _balls[0].horizontalBounce();
      } else if (_bricks[counter].topOrBottomHitBy(_balls[0])) {
        _bricks[counter].clear();
        _bricks.splice(counter, 1);
        _balls[0].verticalBounce();
      } else {
        counter++;
      }
    }
    _balls[0].clear();
    _balls[0].tic();
    _balls[0].render();

    _paddle.clear();
    _paddle.tic();
    _paddle.render();

    checkGameOver();
  }

  function hitTop() {
    return _balls[0].pos.y <= 0;
  }

  function hitLeftOrRight() {
    return _balls[0].pos.x <= 0 || _balls[0].pos.x >= 300;
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
        _paddle.move(-1);
      } else if (e.keyCode === 39) {
        _paddle.move(1);
      }
    });
  }

  function _initKeyUpListeners() {
    $(document).keyup(function(e) {
      // console.log("keyup");
      // console.log(e.keyCode);
      if (e.keyCode === 37 || e.keyCode === 39) {
        _paddle.stop();
      }
    });
  }

  // function _initQuitButtonListener() {
  //   $("#quit").click(function() {
  //     clearInterval(game);
  //     init();
  //   });
  // }


  function _startGameLoop(){
    console.log("setting up game loop");
    game = setInterval(function(){
      _tic();
    }, 20)
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
    if (_balls[0].pos.y + _balls[0].radius > 200){
      clearInterval(game);
      alert("You Lose!");
    }
  }

  return {
    init: init
  }

})();