// model
var model = (function(){

  var snakePos;
  var board = generateBoard();

  // Snake starts at size 3.
  var snakeLength = 3;

  // Generate a 10x10 board.
  function generateBoard(){
    var newBoard = new Array(10);
    for (var i = 0; i < newBoard.length; i++){
      newBoard[i] = new Array(10);
    }
    placeSnake(newBoard);
    return newBoard;
  }

  // Place the head of the snake.
  function placeSnake(inputBoard){
    snakePos = [0, 3];
    inputBoard[0][3] = "S"
    inputBoard[0][2] = 2
    inputBoard[0][1] = 1
  }

  // updateBoard takes an input vector and moves the snake head in that
  // direction.
  function updateBoard(dir){
    //remove snake from the current position
    //set current position to the length of the snake
    //reduce all num on the board by 1
    //update snake head position
    //place snake head on the board
  }

  return {
    board: board,
    updateBoard: updateBoard,
  };

})();

var view = (function(){

  var DOMBoard = null;

  function initDOMBoard(board){
    DOMBoard = board;
  }
  // var DOMSnake = $("#snake");

  function render(board){
    // Wipe board clean
    DOMBoard.children().remove()
    for (var x = 0; x < board.length; x++){
      for (var y = 0; y < board[x].length; y++){
        // If there is a snake piece to draw, draw it.
        if (board[x][y] && (board[x][y] == "S" || parseInt(board[x][y]) > 0)){
          var bodyPart = document.createElement("DIV");
          bodyPart.className = 'snake';
          bodyPart = $(bodyPart);
          bodyPart.css("top", 50 * y);
          bodyPart.css("left", 50 * x);
          DOMBoard.append(bodyPart)
        }
      }
    }
  }

  return {
    render: render,
    initDOMBoard: initDOMBoard,
  };

})();

var controller = (function(){

  var keys = {
      37 : keyLeft,
      38 : keyUp,
      39 : keyRight,
      40 : keyDown,
  }
  var lastDirection = [0, 0];

  function initInput() {
    inputHandlers = {};
    document.addEventListener('keyDown', function(e) {
      if (keys[e.keyCode]) keys[e.keyCode]();
    })
  };

  function keyLeft() {
    lastDirection = [-1, 0];
  }

  function keyRight() {
    lastDirection = [1, 0];
  }

  function keyUp() {
    lastDirection = [0, -1];
  }

  function keyDown() {
    lastDirection = [0, 1];
  }


  function play(){
    setInterval(function() {

      // Update the board according to the last direction placed.
      model.updateBoard(lastDirection);

      // Redraw the board with updated model information.
      view.render(model.board());

    }, 3000);
  }

})


$(document).ready(function(){
  view.initDOMBoard($("#board"));
  view.render(model.board);
  controller.initInput();
  // controller.play();
})


// view

// controller
