const websocket = require("ws");

const game = function(gameID){
    this.playerA = null;
    this.playerB = null;
    this.playerAscore = 0;
    this.playerBscore = 0;
    this.gameID = gameID;
    this.code = null;
    this.gameState = "No players"; /* "Player 1 or 2 wins" or "Game Aborted"*/
}

/* Update the code to guess in this game.*/

/* checks if there are two connected players and returns a boolean*/
game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 players";
  };

  game.prototype.setStatus = function(w) {
    this.gameState = w;
  };

  game.prototype.getGameID = function(){
    return this.gameID;
  }

game.prototype.getCode = function(){
    return this.code;
}

game.prototype.setCode = function(w) {
  //two possible options for the current game state:
  //1 player, 2 players
  if (this.gameState != "1 player" && this.gameState != "2 players") {
    return new Error(
      `Trying to set code, but game status is ${this.gameState}`
    );
  }
  this.code = w;
};


  game.prototype.addPlayer = function(p) {
    if (this.gameState != "No players" && this.gameState != "1 player") {
      return new Error(
        `Invalid call to addPlayer, current state is ${this.gameState}`
      );
    }
    if(this.gameState == "1 player"){
      this.setStatus("2 players");
    } else{
      this.setStatus("1 player");
    }

  if (this.playerA == null) {
    this.playerA = p;
    return "1";
  } else {
    this.playerB = p;
    return "2";
  }
};

game.prototype.codeIsEmpty = function(){
  return this.code.length == 0;
}

module.exports = game;