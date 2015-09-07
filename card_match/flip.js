// Model
// Keeps Track of cards
// Ignore score for now

// 2x2 Board

// Internal representation of a given card
function Card(val){
  this.val = val;
  this.flipped = false;

  // Cards can toggle their flipped state.
  this.flip = function(){
    if (this.flipped){
      this.flipped = false;
    } else {
      this.flipped = true;
    }
  }
}

// Keeps track of the game's internal state.
var model = {

  init: function(boardsize){
    model.cards = [];
    model.points = 0;
    model.previousCard = null;
    model.currentCard = null;

    for(var i = 0; i < (boardsize * boardsize / 2); i++){
      model.cards.push(new Card(i));
      model.cards.push(new Card(i));
    };

    model.cards.sort(function () {
     return [1, -1, 0][Math.random() *3 |0];
    });
  },

  flipCard: function(index){
    // Get the correct card and flip it.
    console.log(index);
    model.previousCard = model.currentCard;

    model.currentCard = this.cards[parseInt(index)];
    model.currentCard.flip();

    // Check to see if flipped cards match if applicable
    // checkIfCardsMatch(model.currentCard);
  },

  checkIfCardsMatch: function(card){
    if (model.currentCard.val === model.previousCard.val) {
      var result = [model.currentCard, model.previousCard];
      model.currentCard = model.previousCard = null;
      model.points += 10;
      return result;
    } else {
      // Decrease points, don't let them go under 0.
      if (model.points - 3 > 0) {
        model.points -= 3;
      } else {
        model.points = 0;
      }
      return false;
    }
  },

  unflipCards: function(){
    model.currentCard.flip();
    model.previousCard.flip();
    model.currentCard = model.previousCard = null;
  },

  gameOver: function(){
    return model.allCardsMatched();
  },

  allCardsMatched: function(){
    for (var i = 0; i < model.cards.length; i++){
      if (!(model.cards[i].flipped)){
        return false
      }
    }
    return true;
  }
}

var controller = {
  flipCount: 0,

  init: function(){
    var bs = controller.getBoardSize();
    model.init(bs);
    this.initializeBoard();
    view.sizeCards(bs);
    view.init();
  },

  getBoardSize: function(){
    var bs = 1;
    while (bs % 2 || isNaN(bs)) {
      bs = parseInt(prompt("What board size do you want EVEN ONLY?"));
    }
    return bs;
  },

  play: function(target){
    model.flipCard(parseInt(target.id));
    this.flipCount++;
    controller.handleMatches();
    view.updatePoints(model.points);
    controller.checkGameOver();
  },

  handleMatches: function(){
    if (this.flipCount % 2 === 0) {
      if (model.checkIfCardsMatch()) view.setMatchingCards();
      else {
        view.unflipCards();
        model.unflipCards();
      }
    }
  },

  initializeBoard: function(){
    var board = $("#board");
    // Actually append divs to board.
    for (var i = 0; i < model.cards.length; i++){
      board.append("<div id='" + i + "' class='card flipped'>" + model.cards[i].val + "</div>")
    }
  },

  checkGameOver: function() {
    if (model.gameOver()) {
      var message = "You win! It took you " + this.flipCount/2 +" tries."
      + "Your score was " + model.points;
      view.updatePoints(message);
    }
  }
}

// View
// Displays Cards at the start
// Has functions to flip cards

// Controller
// Issues commands to model
// Tells the view to flip cards based on the Model's response

var view = {

  init: function() {

    setTimeout(function(){
      $("#board div").removeClass('flipped').addClass('unflipped');
      $('#board').on('click', '.unflipped', function(e) {view.flipCard(e)});
    }, 1000)
  },

  flipCard: function(e) {
    // $(e.target).effect("shake", { times:3, distance: 5 }, 150);
    $(e.target).toggleClass('unflipped');
    $(e.target).toggleClass('flipped');
    controller.play(e.target);
  },

  unflipCards: function() {
    var $cards = $('.flipped');
    $cards.addClass("nonmatch");
    $cards.removeClass("flipped")
    setTimeout(function() {
      $cards.removeClass("nonmatch");
      $cards.toggleClass('unflipped');
    }, 1000)

  },

  setMatchingCards: function() {
    // for (var i=0; i<model.cards.length; i++) {
    //   var $card = $('#' + model.cards[i].id);
    //   $card.removeClass("flipped unflipped");
    //   $card.addClass("matched");
    // }
    var $cards = $('.flipped')
    $cards.removeClass("flipped unflipped");
    $cards.addClass("matched");
  },

  sizeCards: function(bs){
    $(".card").width(Math.round($('#board').width()/bs) - 21);
    $(".card").height(Math.round($(window).height()/bs * .6) - 21);
  },

  updatePoints: function(points) {
    $('#score').text(points);
  }
}

$(document).ready(function(){
    controller.init();
});



