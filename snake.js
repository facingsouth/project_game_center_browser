// model
var model = (function(){

  var snakePos;
  var boardSize = 20;
  var board = generateBoard();
  var gameOver = false;

  // Snake starts at size 3.
  var snakeLength = 3;

  // Generate a 10x10 board.
  function generateBoard(){
    var newBoard = new Array(boardSize);
    for (var i = 0; i < newBoard.length; i++){
      newBoard[i] = Array.apply(null, Array(boardSize)).map(function() { return 0 });
    }
    placeSnake(newBoard);
    placeFood(newBoard);
    return newBoard;
  }

  // Place the head of the snake.
  function placeSnake(inputBoard){
    snakePos = [0, 3];
    inputBoard[0][3] = "S";
    inputBoard[0][2] = 2;
    inputBoard[0][1] = 1;
  }

  function placeFood(inputBoard) {
    var posX, posY;
    do {
      posX = Math.floor(Math.random()*boardSize);
      posY = Math.floor(Math.random()*boardSize);
    } while (inputBoard[posX][posY] != 0);
    inputBoard[posX][posY] = 'F';
  }

  // updateBoard takes an input vector and moves the snake head in that
  // direction.
  function updateBoard(dir){
    if (!outOfBounds(dir) && !hitSelf(dir)){
      removeSnake();
      updateBody(dir);
      updateHead(dir);
    } else {
      gameOver = true;
    }
  }

  // Check if the snake collides with itself.
  function hitSelf(dir){
    var nextPos = board[snakePos[0] + dir[0]][snakePos[1] + dir[1]]
    return (nextPos === "S" || nextPos > 0);
  }

  function outOfBounds(dir){
    return (snakePos[0] + dir[0]) < 0 || (snakePos[0] + dir[0]) >= boardSize ||
           (snakePos[1] + dir[1]) < 0 || (snakePos[1] + dir[1]) >= boardSize;
  }

  //update snake head position
  //place snake head on the board
  function updateHead(dir){
    snakePos[0] += dir[0];
    snakePos[1] += dir[1];
    board[snakePos[0]][snakePos[1]] = "S";
  }

  function removeSnake(){
    board[snakePos[0]][snakePos[1]] = 0;
  }

  //set current position to the length of the snake
  //reduce all num on the board by 1
  function updateBody(dir){
    board[snakePos[0]][snakePos[1]] = snakeLength;
    if (!(movingOntoFood(dir))){
      decrementBodyParts();
    } else {
      snakeLength++;
      placeFood(board);
    }
  }

  function movingOntoFood(dir){
    var nextPos = board[snakePos[0] + dir[0]][snakePos[1] + dir[1]]
    return nextPos === "F";
  }

  function decrementBodyParts(){
    for (var x = 0; x < board.length; x++){
      for (var y = 0; y < board[x].length; y++){
        if (typeof(board[x][y]) === "number" && board[x][y] > 0){
          board[x][y]--;
        }
      }
    }
  }

  function calcScore() {
    return snakeLength - 3;
  }

  function dead() {
    return gameOver;
  }

  return {
    board: board,
    updateBoard: updateBoard,
    snakePos: snakePos,
    score: calcScore,
    gameOver: dead
  };

})();

var view = (function(){

  var DOMBoard = null;
  var DOMScore = null;

  function initDOM(board, score){
    DOMBoard = board;
    DOMScore = score;
  }
  // var DOMSnake = $("#snake");

  function render(board){
    // Wipe board clean
    DOMBoard.children().remove()
    for (var x = 0; x < board.length; x++){
      for (var y = 0; y < board[x].length; y++){
        // If there is a snake piece to draw, draw it.
        drawSquare(board, x, y);
      }
    }
  }

  function drawSquare(board, x, y){
    square = board[x][y];
    if (square === "S"){
      drawSnake(x, y);
    } else if (square === "F"){
      drawFood(x, y);
    } else if (parseInt(square) > 0){
      drawSnake(x, y);
    }
  }

  function drawSnake(x, y){
    var square = document.createElement("DIV");
    square.className = 'snake';
    square = $(square);
    square.css("top", 25 * y);
    square.css("left", 25 * x);
    DOMBoard.append(square)
  }

  function drawFood(x, y){
    var square = document.createElement("DIV");
    square.className = 'food';
    square = $(square);
    square.css("top", 25 * y);
    square.css("left", 25 * x);
    DOMBoard.append(square)
  }

  function updateScore(score) {
    DOMScore.text(score);
  }

  return {
    render: render,
    initDOM: initDOM,
    updateScore: updateScore,
  };

})();

var controller = (function(){

  var keys = {
      37 : keyLeft,
      38 : keyUp,
      39 : keyRight,
      40 : keyDown,
  }
  var lastDirection = null;
  var lastMovement = [0, 0];
  var playInterval;

  function initInput() {
    $(document).keydown(function(e) {
      if (keys[e.keyCode]) {
        keys[e.keyCode]();
      }
    })
  }

  function keyLeft() {
    if (!(lastMovement[0] == 1 && lastMovement[1] == 0))
    lastDirection = [-1, 0];
  }

  function keyRight() {
    if (!(lastMovement[0] == -1 && lastMovement[1] == 0))
    lastDirection = [1, 0];
  }

  function keyUp() {
    if (!(lastMovement[0] == 0 && lastMovement[1] == 1))
    lastDirection = [0, -1];
  }

  function keyDown() {
    if (!(lastMovement[0] == 0 && lastMovement[1] == -1))
    lastDirection = [0, 1];
  }


  function play(){

    playInterval = setInterval(function() {
      // console.log(lastDirection);

      // Update the board according to the last direction placed.
      if (lastDirection != null) {
        model.updateBoard(lastDirection);
        lastMovement = lastDirection;
      }
      // Redraw the board with updated model information.
      drawBoard();

      checkGameOver();
    }, 200);
  }

  function checkGameOver() {
    console.log(model.gameOver());
    if (model.gameOver()) {
      alert("You Lose!");
      clearInterval(playInterval);
    }
  }

  function drawBoard() {
    view.render(model.board);
    view.updateScore(model.score());

  }

  return {
    initInput: initInput,
    play: play,
    keys: keys,
  };

})();


$(document).ready(function(){
  view.initDOM($("#board"), $('#score'));
  view.render(model.board);
  controller.initInput();
  controller.play();
})


// view

// controller
