// model
var model = (function(){

  var board = generateBoard();

  // Snake starts at size 3.
  var startingLength = 3;

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
    inputBoard[0][3] = "S"
    inputBoard[0][2] = 2
    inputBoard[0][1] = 1
  }

  // updateBoard takes an input vector and moves the snake head in that
  // direction.
  function updateBoard(dir){

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

  var lastDirection = "up";

  function play(){
    while(true){
      // Get the last direction pressed by the player.
      getLastDirection();

      // Update the board according to the last direction placed.
      model.updateBoard(lastDirection);

      // Redraw the board with updated model information.
      view.render(model.board());

    }
  }

  function getLastDirection(){
    // updates last direction;
  }

})


$(document).ready(function(){
  view.initDOMBoard($("#board"));
  view.render(model.board);
  // controller.play();
})


// view

// controller
