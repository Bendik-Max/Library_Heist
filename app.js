const express = require("express");
const http = require("http");
const websocket = require("ws");

const game = require("./game");

if(process.argv.length < 3) {
  console.log("Error: expected a port as argument (eg. 'node app.js 3000').");
  process.exit(1);
}

const port = process.argv[2];
const app = express();

const gameStatus = require("./statTracker");
const messages = require("./public/scripts/messages");

const indexRouter = require("./routes/index");
const { get } = require("express/lib/response");
const { Socket } = require("dgram");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/play", indexRouter);
app.get("/", indexRouter);


const server = http.createServer(app);
const wss = new websocket.Server({ server });

const websockets = {}; //property: websocket, value: game


/*
 * regularly clean up the websockets object
 */
setInterval(function() {
    for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

/*Initialize new game and increment the amount of games initialized*/

let currentGame = new game(gameStatus.gamesInitialized);
console.log(gameStatus.gamesInitialized);
console.log(gameStatus.usersOnline);
console.log(gameStatus.gamesCompleted);
let connectionID = 0; //each websocket receives a unique ID



wss.on("connection", function connection(ws) {
  /*
   * two-player game: every two players are added to the same game
   */
  console.log("connected");
  gameStatus.usersOnline++;
  const con = ws;
  con["id"] = connectionID++;
  const playerType = currentGame.addPlayer(con);
  websockets[con["id"]] = currentGame;
    
  const gameID = currentGame.getGameID();

  console.log(
    `Player ${con["id"]} placed in game ${gameID} as ${playerType}`
  );
  
  /*
   * inform the client about its assigned player type
   */
  con.send(playerType == "1" ? JSON.stringify(messages.O_PLAYER_1): JSON.stringify(messages.O_PLAYER_2));

  /*
   * client B receives the target word (if already available)
   */
  if (playerType == 2 && currentGame.getCode() != null) {
    let msg = messages.O_TARGET_CODE;
    msg.data = currentGame.getCode();
    con.send(JSON.stringify(msg));
  }

  /*
  * once we have two players, there is no way back;
  * a new game object is created;
  * if a player now leaves, the game is aborted (player is not preplaced)
  */
  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame = new game(gameStatus.gamesInitialized++);
  }
})

/*
 * message coming in from a player:
 *  1. determine the game object
 *  2. determine the opposing player OP
 *  3. send the message to OP
 */
con.on("message", function incoming(message) {
  let oMsg = JSON.parse(message);
  console.log(oMsg.type);
  console.log(oMsg.data);
  const newmessage = {
    type: oMsg.type,
    data: oMsg.data
  }
  console.log(oMsg);

  const gameObj = websockets[con["id"]];
  const isPlayerA = gameObj.playerA == con ? true : false;

  if (isPlayerA) {
    /*
     * player A cannot do a lot, just send the target word;
     * if player B is already available, send message to B
     */
    if (oMsg.type == messages.T_TARGET_CODE) {
      gameObj.setCode(oMsg.data);
      console.log(gameObj.getCode());
      console.log("goddamn ur good at coding");
      console.log(gameObj.gameState);

      if (gameObj.hasTwoConnectedPlayers()) {
        gameObj.playerB.send(JSON.stringify(newmessage));
        console.log(message);
        console.log("sending back");
      }
    }
  } else {
    /*
     * player B can make a guess;
     * this guess is forwarded to A
     */
    if (oMsg.type == messages.T_MAKE_A_GUESS) {
      gameObj.playerA.send(JSON.stringify(newmessage));
      gameObj.setStatus("CODE GUESSED");
    }

    /*
     * player B can state who won/lost
     */
    if (oMsg.type == messages.T_GAME_WON_BY) {
      if(oMsg.data = 1){
        gameObj.setStatus("Game won by player 1");
        gameObj.playerA.send(JSON.stringify(newmessage));
      } else {
        gameObj.setStatus("Game won by player 2");
        gameObj.playerA.send(JSON.stringify(newmessage));
      }
      //game was won by somebody, update statistics
      gameStatus.gamesCompleted++;
    }
  }
});

con.on("close", function(code) {
  /*
   * code 1001 means almost always closing initiated by the client;
   * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
   */
  console.log(`${con["id"]} disconnected ...`);
  console.log(code);

  if (code == 1001) {
    /*
     * if possible, abort the game; if not, the game is already completed
     */
    const gameObj = websockets[con["id"]];

      gameObj.setStatus("ABORTED");
      gameStatus.usersOnline--;

      /*
       * determine whose connection remains open;
       * close it
       */

      let over = messages.O_GAME_OVER;
      gameObj.playerA.send(JSON.stringify(over));
      gameObj.playerB.send(JSON.stringify(over));      
    }
});

server.listen(port);
