"use strict;"

// model
// track game board state, score
// init game board includes fill mines, fill calculated num of mines
// reveal square and adjacent squares
// 
// check game over

var model = (function(){

  var boardSize = 5;
  var numOfMines = Math.floor(boardSize*boardSize/5);
  var gameBoard = generateBoard();
  var time = 0;
  var numOfRevealed = 0;
  var lose = false;
  var message = "";

  function reset() {
    gameBoard = generateBoard();
    score = 0;
    numOfRevealed = 0;
    lose = false;
    message = "";
  };

  // Generate game board with mines and num of mines calculated
  function generateBoard() {
    var newBoard = initGameBoard();
    fillMines(newBoard);
    calcNumOfMines(newBoard);
    return newBoard;
  };

  // Initialize a empty board
  function initGameBoard() {
    var newBoard = new Array(boardSize);
    for (var i=0; i<boardSize; i++) {
      newBoard[i] = Array.apply(null, Array(boardSize))
                         .map(function() { return 0 });
    }
    return newBoard;
  };

  function fillMines(board) {
    var mineCount = 0;
    var posX, posY;
    while (mineCount < numOfMines) {
      posX = rand(boardSize);
      posY = rand(boardSize);
      if (board[posX][posY] > -1) {
        board[posX][posY] = -1;
        mineCount++;
      }
    }
  };

  function calcNumOfMines(board) {
    for (var i=0; i<board.length; i++) {
      for (var j=0; j<board[0].length; j++) {
        if (board[i][j] > -1)
        board[i][j] = minesAround(i, j, board);
      }
    }
  };

  function minesAround(x, y, board) {
    var numOfMines = 0;
    for (var i=x-1; i<=x+1; i++) {
      for (var j=y-1; j<=y+1; j++) {
        if (onboard(i, j, board) && !(i===x && j===y) && board[i][j]==-1)
          numOfMines++;
      }
    }
    return numOfMines;
  };

  function onboard(x, y, board) {
    return x>=0 && x<board.length && y>=0 && y<board[0].length; 
  };

  // Generate a random number from 0 to num(exclusive)
  function rand(num) {
    return Math.floor(Math.random()*num);
  };

  function reveal(x, y) {
    if (gameBoard[x][y] === -1) {
      gameBoard[x][y] += 10;
      lose = true;
    } else if (gameBoard[x][y] === 0) {
      revealNeighbors(x, y);
    } else if (gameBoard[x][y] > 0 && gameBoard[x][y] < 9) {
      gameBoard[x][y] += 10;
      numOfRevealed++;
    }
  };

  function revealNeighbors(x, y) {
    for (var i=x-1; i<=x+1; i++) {
      for (var j=y-1; j<=y+1; j++) {
        if (onboard(i, j, gameBoard)) {
          if (gameBoard[i][j] === 0) {
            gameBoard[i][j] += 10;
            numOfRevealed++;
            revealNeighbors(i, j);
          } else if (gameBoard[i][j] > 0 && gameBoard[i][j] < 9) {
            gameBoard[i][j] += 10;
            numOfRevealed++;
          }

        }
      }
    }
  };

  function isWin() {
    return numOfRevealed === boardSize*boardSize-numOfMines;
  };

  function isLose() {
    return lose;
  };

  function gameOver() {
    if (isWin()) {
      message = "You won!";
      return true;
    } else if(isLose()) {
      message = "You Lose!";
      return true;
    } else {
      return false;
    }
  };

  function msg() {
    return message;
  };

  function getTime() {
    return time;
  };

  function increaseTime(val) {
    time += val;
  }

  return {
    gameBoard: gameBoard,
    boardSize: boardSize,
    reveal: reveal,
    gameOver: gameOver,
    msg: msg,
    reset: reset,
    getTime: getTime, 
    increaseTime: increaseTime
  };

})();

// view
// setup listeners
// render game board

var view = (function(){
  var $gameBoard;
  var boardSize;

  function init(board, bs) {
    $gameBoard = board;
    boardSize = bs;
    $gameBoard.children().remove();
    $gameBoard.css("width", boardSize*30);
    $gameBoard.css("height", boardSize*30);
    for (var i=0; i<boardSize; i++) {
      for (var j=0; j<boardSize; j++) {
        $gameBoard.append(makeSquare(i, j));
      }
    };

    $gameBoard.on("click", ".square", function(e) {
      controller.reveal($(e.target));
    });

    $gameBoard.on("mousedown", ".hidden", function(e) {
      if(e.which == 3) {
        e.preventDefault();
        label($(e.target));
      }
    });

    // $("#option").click(function() {
    //   var bs = prompt("Enter Board Size");
    //   model.boardSize = bs;
    //   view.init($("#game-board"), bs);
    //   console.log(model.boardSize);
    //   controller.play();
    // });

    // $("#start").click(controller.play);
  };

  function render(board) {
    $("#timer").text(model.getTime());

    for (var i=0; i<boardSize; i++) {
      for (var j=0; j<boardSize; j++) {
        if (board[i][j] > 9){
          reveal(board, i, j);      
        } else if (board[i][j] === 9) {
          setMine(board, i, j);
        }
      }
    }
  };

  function makeSquare(x, y) {
    var $square = $("<div class='square'></div>");
    $square.addClass("hidden");
    $square.attr("id", x+"-"+y);
    $square.offset({
      left: x*30,
      top: y*30
    })
    return $square;
  };

  function reveal(board, i, j) {
    var $s = $("#"+i+"-"+j);
    $s.empty();
    if (board[i][j]%10) {
      $s.text(board[i][j]%10);
    }
    $s.removeClass("hidden");
    $s.addClass("revealed");
  };

  function setMine(board, i, j) {
    var $s = $("#"+i+"-"+j);
    $s.empty();
    $s.removeClass("hidden");
    $s.addClass("mine");
  };

  function label(ele) {
    if (ele.text()) {
      ele.empty();
    } else {
      ele.text("\u2691");
    }
  };

  return {
    init: init,
    render: render
  }

})();


// controller
// game loop
var controller = (function(){
  var coords, posX, posY;
  var timer;

  function play() {
    // clearInterval(timer);
    // model.reset();
    view.init($("#game-board"), model.boardSize);
    timer = setInterval(function(){
      model.increaseTime(1);
      view.render(model.gameBoard);
      if (model.gameOver()) { 
        alert(model.msg());
        model.reset();
        clearInterval(timer);
      };
      // view.render(model.gameBoard);
    }, 1000);
  }

  function reveal(ele) {
    coords = ele.attr("id").split("-");
    posX = parseInt(coords[0]);
    posY = parseInt(coords[1]);
    model.reveal(posX, posY);
    view.render(model.gameBoard);
  };

  return {
    reveal: reveal,
    play: play
  }

})();

$(document).ready(function(){
  document.onmousedown=disableclick;
  status="Right Click Disabled";
  function disableclick(event)
  {
    if(event.button==2)
     {
       return false;    
     }
  }
  // view.init($("#game-board"), model.boardSize);
  controller.play();
})
