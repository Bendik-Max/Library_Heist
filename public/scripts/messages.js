// @ts-nocheck

(function (exports) {
  /*
  * Client to server: game is complete, the winner is ...
  */
  exports.T_GAME_WON_BY = "GAME-WON-BY";
  exports.O_GAME_WON_BY = {
  type: exports.T_GAME_WON_BY,
    data: null,
  };
  
  /*
   * Server to client: abort game (e.g. if second player exited the game)
   */
  exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED",
    data: null
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);
  
  /*
  * Server to client: choose target word
  */
  exports.O_CHOOSE = { type: "CHOOSE-CODE" };
  exports.S_CHOOSE = JSON.stringify(exports.O_CHOOSE);
  
  /*
  * Server to client: set as player 
  */
  exports.T_PLAYER_TYPE = "PLAYER-TYPE";
  exports.O_PLAYER_1 = {
  type: exports.T_PLAYER_TYPE,
    data: "1",
  };
 // exports.S_PLAYER_1 = JSON.stringify(exports.O_PLAYER_1);
  
  /*
  * Server to client: set as player B
  */
  exports.O_PLAYER_2 = {
    type: exports.T_PLAYER_TYPE,
    data: "2",
  };
 // exports.S_PLAYER_2 = JSON.stringify(exports.O_PLAYER_2);
  
  /*
  * Player A to server OR server to Player B: this is the target code
  */
  exports.T_TARGET_CODE = "SET-CODE";
  exports.O_TARGET_CODE = {
    type: exports.T_TARGET_CODE,
    data: null,
  };
  //exports.S_TARGET_CODE = JSON.stringify(exports.O_TARGET_CODE);
  //exports.S_TARGET_WORD does not exist, as we always need to fill the data property
  
  /*
  * Player B to server OR server to Player A: guessed code
  */
  exports.T_MAKE_A_GUESS = "MAKE-A-GUESS";
  exports.O_MAKE_A_GUESS = {
    type: exports.T_MAKE_A_GUESS,
    data: null,
  };
  //exports.S_MAKE_A_GUESS does not exist, as data needs to be set
  
  /*tell the server to reset the gamestate and switch sides, data will be filled with the score of the player who just finished*/
  exports.T_SWITCH_SIDES = "SWITCH-SIDES";
  exports.O_SWITCH_SIDES = {
    type: exports.T_SWITCH_SIDES,
    data: null,
  };

  /*
  * Server to Player A & B: game over with result won/loss
  */
  exports.T_GAME_OVER = "GAME-OVER";
  exports.O_GAME_OVER = {
    type: exports.T_GAME_OVER,
    data: null,
  };
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server