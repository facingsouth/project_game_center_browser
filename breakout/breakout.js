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
      for (var j=0; j<5; j++) {
        _bricks.push(new BO.BrickModule.Brick([30+i*35, 10+j*10]));
        _bricks[i*5+j].render();      
      }
    }

    var vx = Math.floor(Math.random()*5-2);
    var vy = Math.floor(Math.random()*2-2);

    _balls.push(new BO.BallModule.Ball([150, 125], [vx, vy]));
    _balls[0].render();

    _paddle = BO.PaddleModule;
    _paddle.init();

    _initStartButtonListener();
    _initQuitButtonListener();
  }

  function _tic(){
    _balls[0].clear();
    if (hitTopOrBottom()) {
      _balls[0].verticalBounce();
    }
    if (hitLeftOrRight()) {
      _balls[0].horizontalBounce();
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
    _balls[0].tic();
    _balls[0].render();
  }

  function hitTopOrBottom() {
    return _balls[0].pos.y <= 0 || _balls[0].pos.y >= 150;
  }

  function hitLeftOrRight() {
    return _balls[0].pos.x <= 0 || _balls[0].pos.x >= 300;
  }

  function _initStartButtonListener() {
    $(document).keypress(function(e) {
      if (e.keyCode === 32) {
        clearInterval(game);
        _startGameLoop();
      }
    });
  }

  function _initQuitButtonListener() {
    $("#quit").click(function() {
      clearInterval(game);
      init();
    });
  }

  function _startGameLoop(){
    console.log("setting up game loop");
    game = setInterval(function(){
      _tic();
    }, 10)
  }

  return {
    init: init
  }

})();